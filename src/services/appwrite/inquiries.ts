import { ID, Query } from 'appwrite';
import { databases, APPWRITE_CONFIG, isAppwriteConfigured } from './client';
import { ContactSubmission } from '@/types';

const LOCAL_STORAGE_INQUIRIES_KEY = 'acci_inquiries_data';

const getLocalInquiries = (): ContactSubmission[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(LOCAL_STORAGE_INQUIRIES_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const inquiriesService = {
  async submitContact(data: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }): Promise<ContactSubmission> {
    const newSubmission: ContactSubmission = {
      ...data,
      id: 'INQ_' + Date.now(),
      status: 'unread',
      createdAt: new Date().toISOString(),
    };

    if (isAppwriteConfigured()) {
      try {
        const res = await databases.createDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.contact,
          ID.unique(),
          newSubmission
        );
        return res as unknown as ContactSubmission;
      } catch (err) {
        console.warn('Appwrite submitContact error, saved locally', err);
      }
    }

    const list = getLocalInquiries();
    list.unshift(newSubmission);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_INQUIRIES_KEY, JSON.stringify(list));
    }
    return newSubmission;
  },

  async getInquiries(): Promise<ContactSubmission[]> {
    if (isAppwriteConfigured()) {
      try {
        const res = await databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.contact,
          [Query.orderDesc('createdAt'), Query.limit(100)]
        );
        return res.documents as unknown as ContactSubmission[];
      } catch (err) {
        console.warn('Appwrite inquiries fetch error', err);
      }
    }
    return getLocalInquiries();
  },

  async updateStatus(id: string, status: 'unread' | 'read' | 'resolved'): Promise<boolean> {
    if (isAppwriteConfigured()) {
      try {
        await databases.updateDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.contact,
          id,
          { status }
        );
      } catch {
        // Continue
      }
    }

    const list = getLocalInquiries();
    const idx = list.findIndex((i) => i.id === id || i.$id === id);
    if (idx !== -1) {
      list[idx].status = status;
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_INQUIRIES_KEY, JSON.stringify(list));
      }
      return true;
    }
    return false;
  },

  async deleteInquiry(id: string): Promise<boolean> {
    if (isAppwriteConfigured()) {
      try {
        let docId = id;
        try {
          await databases.deleteDocument(
            APPWRITE_CONFIG.databaseId,
            APPWRITE_CONFIG.collections.contact,
            docId
          );
        } catch {
          const found = await databases.listDocuments(
            APPWRITE_CONFIG.databaseId,
            APPWRITE_CONFIG.collections.contact,
            [Query.equal('id', id), Query.limit(1)]
          );
          if (found.documents.length > 0) {
            await databases.deleteDocument(
              APPWRITE_CONFIG.databaseId,
              APPWRITE_CONFIG.collections.contact,
              found.documents[0].$id
            );
          }
        }
      } catch (err) {
        console.warn('Appwrite delete inquiry error:', err);
      }
    }

    const list = getLocalInquiries().filter((i) => i.id !== id && i.$id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_INQUIRIES_KEY, JSON.stringify(list));
    }
    return true;
  },
};
