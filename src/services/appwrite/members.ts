import { ID, Query } from 'appwrite';
import { databases, APPWRITE_CONFIG, isAppwriteConfigured } from './client';
import { MemberBusiness, BusinessReview } from '@/types';
import { SEED_MEMBERS, SEED_REVIEWS } from '../seedData';

const LOCAL_STORAGE_MEMBERS_KEY = 'acci_members_data';
const LOCAL_STORAGE_REVIEWS_KEY = 'acci_reviews_data';

const getLocalMembers = (): MemberBusiness[] => {
  if (typeof window === 'undefined') return SEED_MEMBERS;
  const stored = localStorage.getItem(LOCAL_STORAGE_MEMBERS_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_MEMBERS_KEY, JSON.stringify(SEED_MEMBERS));
    return SEED_MEMBERS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return SEED_MEMBERS;
  }
};

const saveLocalMembers = (members: MemberBusiness[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_MEMBERS_KEY, JSON.stringify(members));
  }
};

const getLocalReviews = (): BusinessReview[] => {
  if (typeof window === 'undefined') return SEED_REVIEWS;
  const stored = localStorage.getItem(LOCAL_STORAGE_REVIEWS_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_REVIEWS_KEY, JSON.stringify(SEED_REVIEWS));
    return SEED_REVIEWS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return SEED_REVIEWS;
  }
};

export const membersService = {
  async getMembers(params?: {
    search?: string;
    category?: string;
    industry?: string;
    status?: 'approved' | 'pending' | 'rejected' | 'all';
    featuredOnly?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<{ members: MemberBusiness[]; total: number }> {
    const statusFilter = params?.status || 'approved';

    if (isAppwriteConfigured()) {
      try {
        const queries: string[] = [];
        if (statusFilter !== 'all') {
          queries.push(Query.equal('status', statusFilter));
        }
        if (params?.category) {
          queries.push(Query.equal('category', params.category));
        }
        if (params?.industry) {
          queries.push(Query.equal('industry', params.industry));
        }
        if (params?.featuredOnly) {
          queries.push(Query.equal('featured', true));
        }
        if (params?.limit) {
          queries.push(Query.limit(params.limit));
        }
        if (params?.offset) {
          queries.push(Query.offset(params.offset));
        }

        const res = await databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.members,
          queries
        );

        let docs = res.documents as unknown as MemberBusiness[];
        if (params?.search) {
          const s = params.search.toLowerCase();
          docs = docs.filter(
            (m) =>
              m.businessName.toLowerCase().includes(s) ||
              m.ownerName.toLowerCase().includes(s) ||
              m.industry.toLowerCase().includes(s) ||
              m.description.toLowerCase().includes(s) ||
              m.city.toLowerCase().includes(s)
          );
        }

        return { members: docs, total: res.total };
      } catch (err) {
        console.warn('Appwrite fetch members error, using local fallback', err);
      }
    }

    // Local / Hybrid fallback
    let list = getLocalMembers();

    if (statusFilter !== 'all') {
      list = list.filter((m) => m.status === statusFilter);
    }
    if (params?.category) {
      list = list.filter((m) => m.category.toLowerCase() === params.category!.toLowerCase());
    }
    if (params?.industry) {
      list = list.filter((m) => m.industry.toLowerCase().includes(params.industry!.toLowerCase()));
    }
    if (params?.featuredOnly) {
      list = list.filter((m) => m.featured);
    }
    if (params?.search) {
      const s = params.search.toLowerCase();
      list = list.filter(
        (m) =>
          m.businessName.toLowerCase().includes(s) ||
          m.ownerName.toLowerCase().includes(s) ||
          m.industry.toLowerCase().includes(s) ||
          m.description.toLowerCase().includes(s) ||
          m.city.toLowerCase().includes(s)
      );
    }

    const total = list.length;
    const offset = params?.offset || 0;
    const limit = params?.limit || 50;
    const paginated = list.slice(offset, offset + limit);

    return { members: paginated, total };
  },

  async getMemberById(id: string): Promise<MemberBusiness | null> {
    if (isAppwriteConfigured()) {
      try {
        const doc = await databases.getDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.members,
          id
        );
        return doc as unknown as MemberBusiness;
      } catch {
        // Fall back to local
      }
    }
    const members = getLocalMembers();
    return members.find((m) => m.id === id || m.$id === id) || null;
  },

  async createMember(data: Omit<MemberBusiness, 'id' | 'status' | 'joinedAt'>): Promise<MemberBusiness> {
    const id = 'VND_' + Date.now();
    const newMember: MemberBusiness = {
      ...data,
      id,
      status: 'pending',
      joinedAt: new Date().toISOString().split('T')[0],
      rating: 0,
      reviewCount: 0,
      featured: false,
    };

    if (isAppwriteConfigured()) {
      try {
        const res = await databases.createDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.members,
          ID.unique(),
          newMember
        );
        return res as unknown as MemberBusiness;
      } catch (err) {
        console.warn('Appwrite create member error, saved locally', err);
      }
    }

    const local = getLocalMembers();
    local.unshift(newMember);
    saveLocalMembers(local);
    return newMember;
  },

  async updateMemberStatus(id: string, status: 'approved' | 'rejected' | 'pending'): Promise<boolean> {
    if (isAppwriteConfigured()) {
      try {
        await databases.updateDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.members,
          id,
          { status }
        );
      } catch {
        // Continue to local
      }
    }

    const local = getLocalMembers();
    const idx = local.findIndex((m) => m.id === id || m.$id === id);
    if (idx !== -1) {
      local[idx].status = status;
      saveLocalMembers(local);
      return true;
    }
    return false;
  },

  async toggleFeatured(id: string, featured: boolean): Promise<boolean> {
    if (isAppwriteConfigured()) {
      try {
        await databases.updateDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.members,
          id,
          { featured }
        );
      } catch {
        // Continue
      }
    }

    const local = getLocalMembers();
    const idx = local.findIndex((m) => m.id === id || m.$id === id);
    if (idx !== -1) {
      local[idx].featured = featured;
      saveLocalMembers(local);
      return true;
    }
    return false;
  },

  async getReviews(vendorId: string): Promise<BusinessReview[]> {
    if (isAppwriteConfigured()) {
      try {
        const res = await databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.reviews,
          [Query.equal('vendorId', vendorId), Query.equal('status', 'approved')]
        );
        return res.documents as unknown as BusinessReview[];
      } catch {
        // Fall back
      }
    }
    const all = getLocalReviews();
    return all.filter((r) => r.vendorId === vendorId && r.status === 'approved');
  },

  async getAllReviewsAdmin(): Promise<BusinessReview[]> {
    if (isAppwriteConfigured()) {
      try {
        const res = await databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.reviews,
          [Query.limit(100)]
        );
        return res.documents as unknown as BusinessReview[];
      } catch {
        // Fall back
      }
    }
    return getLocalReviews();
  },

  async addReview(review: Omit<BusinessReview, 'id' | 'status' | 'createdAt'>): Promise<BusinessReview> {
    const newRev: BusinessReview = {
      ...review,
      id: 'REV_' + Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    if (isAppwriteConfigured()) {
      try {
        await databases.createDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.reviews,
          ID.unique(),
          newRev
        );
      } catch {
        // Fall back
      }
    }

    const list = getLocalReviews();
    list.unshift(newRev);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_REVIEWS_KEY, JSON.stringify(list));
    }
    return newRev;
  },

  async updateReviewStatus(id: string, status: 'approved' | 'pending'): Promise<boolean> {
    const list = getLocalReviews();
    const idx = list.findIndex((r) => r.id === id || r.$id === id);
    if (idx !== -1) {
      list[idx].status = status;
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_REVIEWS_KEY, JSON.stringify(list));
      }
      return true;
    }
    return false;
  },
};
