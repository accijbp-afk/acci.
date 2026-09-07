import { ID, Query } from 'appwrite';
import { databases, APPWRITE_CONFIG, isAppwriteConfigured } from './client';
import { ChamberEvent } from '@/types';
import { SEED_EVENTS } from '../seedData';

const LOCAL_STORAGE_EVENTS_KEY = 'acci_events_data';

const getLocalEvents = (): ChamberEvent[] => {
  if (typeof window === 'undefined') return SEED_EVENTS;
  const stored = localStorage.getItem(LOCAL_STORAGE_EVENTS_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_EVENTS_KEY, JSON.stringify(SEED_EVENTS));
    return SEED_EVENTS;
  }
  try {
    const list: ChamberEvent[] = JSON.parse(stored);
    const cleanList = Array.isArray(list)
      ? list.filter((e) => !e.id.startsWith('EV_SEED_') && !e.id.startsWith('EV_10'))
      : [];
    if (cleanList.length !== list.length) {
      localStorage.setItem(LOCAL_STORAGE_EVENTS_KEY, JSON.stringify(cleanList));
    }
    return cleanList;
  } catch {
    return SEED_EVENTS;
  }
};

export const eventsService = {
  async getEvents(): Promise<ChamberEvent[]> {
    if (isAppwriteConfigured()) {
      try {
        const res = await databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.events,
          [Query.orderAsc('date'), Query.limit(50)]
        );
        return res.documents as unknown as ChamberEvent[];
      } catch (err) {
        console.warn('Appwrite events fetch failed, using seed data', err);
      }
    }
    return getLocalEvents();
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

    if (isAppwriteConfigured()) {
      try {
        const res = await databases.createDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.events,
          ID.unique(),
          newEvent
        );
        return res as unknown as ChamberEvent;
      } catch (err) {
        console.warn('Appwrite createEvent error', err);
      }
    }

    const list = getLocalEvents();
    list.unshift(newEvent);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_EVENTS_KEY, JSON.stringify(list));
    }
    return newEvent;
  },

  async deleteEvent(id: string): Promise<boolean> {
    if (isAppwriteConfigured()) {
      try {
        await databases.deleteDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.events,
          id
        );
      } catch {
        // Continue
      }
    }

    const list = getLocalEvents();
    const filtered = list.filter((e) => e.id !== id && e.$id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_EVENTS_KEY, JSON.stringify(filtered));
    }
    return true;
  },
};
