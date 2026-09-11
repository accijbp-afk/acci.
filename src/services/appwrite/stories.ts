import { ID, Query } from 'appwrite';
import { databases, APPWRITE_CONFIG, isAppwriteConfigured } from './client';
import { ImpactStory } from '@/types';

const LOCAL_STORAGE_STORIES_KEY = 'acci_impact_stories_v1';

export const INITIAL_SEED_STORIES: ImpactStory[] = [
  {
    id: 'STORY_1',
    title: 'Found Reliable Raw Material Suppliers Across Mahakoshal',
    authorName: 'Rajesh Agrawal',
    roleOrDesignation: 'Managing Director',
    businessName: 'Agrawal Metal & Hardware Mart',
    story:
      'Through the ACCI Business Directory, we discovered verified steel and brass component manufacturers right here in Jabalpur. This cut our sourcing lead time by 40% and established strong trust-based business relationships within our community.',
    benefitCategory: 'B2B Sourcing',
    rating: 5,
    featured: true,
    status: 'approved',
    createdAt: '2026-08-15',
  },
  {
    id: 'STORY_2',
    title: 'Hired 3 Qualified Accountants via Chamber Career Board',
    authorName: 'Sunita Agrawal',
    roleOrDesignation: 'Proprietor',
    businessName: 'Maharaja Silk & Fashion Studio',
    story:
      'We posted an urgent opening for senior inventory accountants on the ACCI Talent Board. Within 48 hours, we received applications from verified community youth with relevant retail accounting experience. The entire hiring process was seamless and cost-free.',
    benefitCategory: 'Talent & Hiring',
    rating: 5,
    featured: true,
    status: 'approved',
    createdAt: '2026-08-28',
  },
  {
    id: 'STORY_3',
    title: 'New Commercial Contracts Secured via Chamber Trade Meet',
    authorName: 'Amit Agrawal',
    roleOrDesignation: 'Partner',
    businessName: 'Shree Ram Agro Industries',
    story:
      'Listing our agro-processing unit on the ACCI Portal and attending the quarterly Trade Conclave opened doors to major wholesale buyers in Katni and Mandla. Having our enterprise officially validated by ACCI gave our outstation buyers immense confidence.',
    benefitCategory: 'Business Growth',
    rating: 5,
    featured: true,
    status: 'approved',
    createdAt: '2026-09-02',
  },
];

const getLocalStories = (): ImpactStory[] => {
  if (typeof window === 'undefined') return INITIAL_SEED_STORIES;
  const stored = localStorage.getItem(LOCAL_STORAGE_STORIES_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_STORIES_KEY, JSON.stringify(INITIAL_SEED_STORIES));
    return INITIAL_SEED_STORIES;
  }
  try {
    const list = JSON.parse(stored);
    if (Array.isArray(list) && list.length > 0) {
      return list;
    }
    localStorage.setItem(LOCAL_STORAGE_STORIES_KEY, JSON.stringify(INITIAL_SEED_STORIES));
    return INITIAL_SEED_STORIES;
  } catch {
    return INITIAL_SEED_STORIES;
  }
};

const saveLocalStories = (stories: ImpactStory[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_STORIES_KEY, JSON.stringify(stories));
  }
};

export const storiesService = {
  async getFeaturedStories(): Promise<ImpactStory[]> {
    if (isAppwriteConfigured()) {
      try {
        const res = await databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.stories,
          [
            Query.equal('status', 'approved'),
            Query.equal('featured', true),
            Query.orderDesc('createdAt'),
            Query.limit(10),
          ]
        );
        return res.documents as unknown as ImpactStory[];
      } catch (err) {
        console.warn('Appwrite stories fetch error, using local storage fallback', err);
      }
    }
    const local = getLocalStories();
    return local.filter((s) => s.status === 'approved' && s.featured);
  },

  async getAllStoriesAdmin(): Promise<ImpactStory[]> {
    if (isAppwriteConfigured()) {
      try {
        const res = await databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.stories,
          [Query.orderDesc('createdAt'), Query.limit(100)]
        );
        return res.documents as unknown as ImpactStory[];
      } catch (err) {
        console.warn('Appwrite admin stories fetch error, using local storage fallback', err);
      }
    }
    return getLocalStories();
  },

  async createStory(
    data: Omit<ImpactStory, 'id' | 'createdAt' | 'status' | 'featured'> & {
      status?: 'approved' | 'pending';
      featured?: boolean;
    }
  ): Promise<ImpactStory> {
    const newStory: ImpactStory = {
      ...data,
      id: 'STORY_' + Date.now(),
      status: data.status || 'pending',
      featured: Boolean(data.featured),
      createdAt: new Date().toISOString().split('T')[0],
    };

    if (isAppwriteConfigured()) {
      try {
        const res = await databases.createDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.stories,
          ID.unique(),
          newStory
        );
        return res as unknown as ImpactStory;
      } catch (err) {
        console.warn('Appwrite createStory error, storing locally', err);
      }
    }

    const list = getLocalStories();
    list.unshift(newStory);
    saveLocalStories(list);
    return newStory;
  },

  async updateStoryStatus(id: string, status: 'approved' | 'pending' | 'rejected'): Promise<boolean> {
    if (isAppwriteConfigured()) {
      try {
        await databases.updateDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.stories,
          id,
          { status }
        );
      } catch {
        // Fallback to local
      }
    }

    const list = getLocalStories();
    const idx = list.findIndex((s) => s.id === id || s.$id === id);
    if (idx !== -1) {
      list[idx].status = status;
      saveLocalStories(list);
    }
    return true;
  },

  async updateStory(id: string, updates: Partial<ImpactStory>): Promise<boolean> {
    if (isAppwriteConfigured()) {
      try {
        await databases.updateDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.stories,
          id,
          updates
        );
      } catch (err) {
        console.warn('Appwrite updateStory error, fallback to local', err);
      }
    }

    const list = getLocalStories();
    const idx = list.findIndex((s) => s.id === id || s.$id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      saveLocalStories(list);
    }
    return true;
  },

  async toggleFeatureStory(id: string, featured: boolean): Promise<boolean> {
    if (isAppwriteConfigured()) {
      try {
        await databases.updateDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.stories,
          id,
          { featured }
        );
      } catch {
        // Fallback to local
      }
    }

    const list = getLocalStories();
    const idx = list.findIndex((s) => s.id === id || s.$id === id);
    if (idx !== -1) {
      list[idx].featured = featured;
      saveLocalStories(list);
    }
    return true;
  },

  async deleteStory(id: string): Promise<boolean> {
    if (isAppwriteConfigured()) {
      try {
        await databases.deleteDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.stories,
          id
        );
      } catch {
        // Fallback to local
      }
    }

    const list = getLocalStories();
    const filtered = list.filter((s) => s.id !== id && s.$id !== id);
    saveLocalStories(filtered);
    return true;
  },
};
