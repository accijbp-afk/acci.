import { ID, Query } from 'appwrite';
import { databases, APPWRITE_CONFIG, isAppwriteConfigured } from './client';
import { ChamberNews } from '@/types';
import { SEED_NEWS } from '../seedData';

const LOCAL_STORAGE_NEWS_KEY = 'acci_news_data';

const getLocalNews = (): ChamberNews[] => {
  if (typeof window === 'undefined') return SEED_NEWS;
  const stored = localStorage.getItem(LOCAL_STORAGE_NEWS_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_NEWS_KEY, JSON.stringify(SEED_NEWS));
    return SEED_NEWS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return SEED_NEWS;
  }
};

export const newsService = {
  async getNews(): Promise<ChamberNews[]> {
    if (isAppwriteConfigured()) {
      try {
        const res = await databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.news,
          [Query.orderDesc('publishedAt'), Query.limit(50)]
        );
        return (res.documents as unknown as ChamberNews[]).map((doc) => ({
          ...doc,
          id: doc.$id || doc.id,
        }));
      } catch (err) {
        console.warn('Appwrite news fetch error', err);
      }
    }
    return getLocalNews();
  },

  async getNewsBySlug(slug: string): Promise<ChamberNews | null> {
    const list = await this.getNews();
    return list.find((n) => n.slug === slug || n.id === slug || n.$id === slug) || null;
  },

  async createNews(item: Omit<ChamberNews, 'id' | 'publishedAt'>): Promise<ChamberNews> {
    const newArticle: ChamberNews = {
      ...item,
      id: 'NEWS_' + Date.now(),
      publishedAt: new Date().toISOString().split('T')[0],
    };

    if (isAppwriteConfigured()) {
      try {
        const res = await databases.createDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.news,
          ID.unique(),
          newArticle
        );
        return res as unknown as ChamberNews;
      } catch (err) {
        console.warn('Appwrite createNews error', err);
      }
    }

    const list = getLocalNews();
    list.unshift(newArticle);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_NEWS_KEY, JSON.stringify(list));
    }
    return newArticle;
  },

  async deleteNews(id: string): Promise<boolean> {
    if (isAppwriteConfigured()) {
      try {
        await databases.deleteDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.news,
          id
        );
      } catch {
        // Continue
      }
    }

    const list = getLocalNews();
    const filtered = list.filter((n) => n.id !== id && n.$id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_NEWS_KEY, JSON.stringify(filtered));
    }
    return true;
  },
};
