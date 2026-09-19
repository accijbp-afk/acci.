import { ID, Query } from 'appwrite';
import { databases, APPWRITE_CONFIG, isAppwriteConfigured } from './client';
import { ChamberEvent } from '@/types';
import { SEED_EVENTS } from '../seedData';

const LOCAL_STORAGE_EVENTS_KEY = 'acci_events_data_v2';

const ALLOWED_EVENT_KEYS = new Set([
  'id',
  'title',
  'slug',
  'category',
  'date',
  'time',
  'venue',
  'description',
  'imageUrl',
  'bgColor',
  'registrationUrl',
  'status',
  'createdAt',
]);

function sanitizeEventPayload(data: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};
  for (const [key, val] of Object.entries(data)) {
    if (ALLOWED_EVENT_KEYS.has(key) && val !== undefined && val !== null) {
      sanitized[key] = val;
    }
  }
  return sanitized;
}

let memoryEvents: ChamberEvent[] = [...SEED_EVENTS];

const getLocalEvents = (): ChamberEvent[] => {
  if (typeof window === 'undefined') return [...memoryEvents];
  const stored = localStorage.getItem(LOCAL_STORAGE_EVENTS_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_EVENTS_KEY, JSON.stringify(SEED_EVENTS));
    return [...SEED_EVENTS];
  }
  try {
    const list: ChamberEvent[] = JSON.parse(stored);
    const cleanList = Array.isArray(list)
      ? list.filter((e) => e && typeof e.id === 'string' && !e.id.startsWith('EV_SEED_') && !e.id.startsWith('EV_10'))
      : [];
    if (cleanList.length !== list.length) {
      localStorage.setItem(LOCAL_STORAGE_EVENTS_KEY, JSON.stringify(cleanList));
    }
    return cleanList;
  } catch {
    return [...SEED_EVENTS];
  }
};

const saveLocalEvents = (events: ChamberEvent[]) => {
  memoryEvents = [...events];
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_EVENTS_KEY, JSON.stringify(events));
  }
};

export const eventsService = {
  async getEvents(): Promise<ChamberEvent[]> {
    const local = getLocalEvents();

    if (isAppwriteConfigured()) {
      try {
        const res = await databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.events,
          [Query.orderAsc('date'), Query.limit(50)]
        );
        const docs = res.documents as unknown as ChamberEvent[];

        // Hybrid merge: ensure newly published local events appear immediately even before DB index sync
        for (const loc of local) {
          if (!docs.some((d) => d.id === loc.id || d.$id === loc.id || (d.title === loc.title && d.date === loc.date))) {
            docs.unshift(loc);
          }
        }

        return docs;
      } catch (err) {
        console.warn('Appwrite events fetch failed, using local/seed fallback', err);
      }
    }
    return local;
  },

  async getEventBySlug(slug: string): Promise<ChamberEvent | null> {
    const list = await this.getEvents();
    return list.find((e) => e.slug === slug || e.id === slug || e.$id === slug) || null;
  },

  async createEvent(event: Omit<ChamberEvent, 'id' | 'createdAt' | 'status'>): Promise<ChamberEvent> {
    const newEvent: ChamberEvent = {
      ...event,
      id: 'EV_' + Date.now(),
      status: 'upcoming',
      createdAt: new Date().toISOString(),
    };

    let createdDoc: ChamberEvent | null = null;
    if (isAppwriteConfigured()) {
      try {
        const payload = sanitizeEventPayload(newEvent);
        const res = await databases.createDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.events,
          ID.unique(),
          payload
        );
        createdDoc = res as unknown as ChamberEvent;
      } catch (err) {
        console.warn('Appwrite createEvent error', err);
      }
    }

    const finalEvent = createdDoc || newEvent;

    // Persist to local cache for instant client feedback and offline resilience
    const list = getLocalEvents();
    if (!list.some((e) => e.id === finalEvent.id || (finalEvent.$id && e.$id === finalEvent.$id))) {
      list.unshift(finalEvent);
      saveLocalEvents(list);
    }

    return finalEvent;
  },

  async deleteEvent(id: string): Promise<boolean> {
    if (isAppwriteConfigured()) {
      try {
        try {
          await databases.deleteDocument(
            APPWRITE_CONFIG.databaseId,
            APPWRITE_CONFIG.collections.events,
            id
          );
        } catch {
          const found = await databases.listDocuments(
            APPWRITE_CONFIG.databaseId,
            APPWRITE_CONFIG.collections.events,
            [Query.equal('id', id), Query.limit(1)]
          );
          if (found.documents.length > 0) {
            await databases.deleteDocument(
              APPWRITE_CONFIG.databaseId,
              APPWRITE_CONFIG.collections.events,
              found.documents[0].$id
            );
          }
        }
      } catch (err) {
        console.warn('Appwrite deleteEvent error:', err);
      }
    }

    const list = getLocalEvents();
    const filtered = list.filter((e) => e.id !== id && e.$id !== id);
    saveLocalEvents(filtered);
    return true;
  },
};
