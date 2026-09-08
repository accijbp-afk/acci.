import { ID, Query } from 'appwrite';
import { databases, APPWRITE_CONFIG, isAppwriteConfigured } from './client';
import { MemberBusiness, BusinessReview } from '@/types';
import { SEED_MEMBERS, SEED_REVIEWS } from '../seedData';

const LOCAL_STORAGE_MEMBERS_KEY = 'acci_members_data_v2';
const LOCAL_STORAGE_REVIEWS_KEY = 'acci_reviews_data_v2';

const getLocalMembers = (): MemberBusiness[] => {
  if (typeof window === 'undefined') return SEED_MEMBERS;
  const stored = localStorage.getItem(LOCAL_STORAGE_MEMBERS_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_MEMBERS_KEY, JSON.stringify(SEED_MEMBERS));
    return SEED_MEMBERS;
  }
  try {
    const list: MemberBusiness[] = JSON.parse(stored);
    const cleanList = Array.isArray(list)
      ? list.filter((m) => !m.id.startsWith('VND_10') && m.id !== 'VND_1785762656744_88')
      : [];
    if (cleanList.length !== list.length) {
      localStorage.setItem(LOCAL_STORAGE_MEMBERS_KEY, JSON.stringify(cleanList));
    }
    return cleanList;
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

const ALLOWED_MEMBER_KEYS = new Set([
  'id',
  'userId',
  'businessName',
  'legalName',
  'ownerName',
  'incomeType',
  'category',
  'industry',
  'description',
  'tagline',
  'phone',
  'whatsapp',
  'email',
  'website',
  'social',
  'address',
  'city',
  'pinCode',
  'maps',
  'timing',
  'gst',
  'estYear',
  'employees',
  'services',
  'products',
  'plan',
  'status',
  'featured',
  'rating',
  'reviewCount',
  'workPhotos',
  'logoUrl',
  'joinedAt',
]);

function sanitizeMemberPayload(data: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};

  let desc = data.description || '';
  if (data.detailed && !desc.includes(data.detailed)) {
    desc = desc ? `${desc}\n\nAdditional Details: ${data.detailed}` : data.detailed;
  }

  for (const [key, val] of Object.entries(data)) {
    if (ALLOWED_MEMBER_KEYS.has(key) && val !== undefined && val !== null) {
      sanitized[key] = val;
    }
  }

  sanitized.description = desc || 'Chamber member business in Jabalpur';
  sanitized.businessName = sanitized.businessName || 'Business Enterprise';
  sanitized.ownerName = sanitized.ownerName || 'Business Owner';
  sanitized.category = sanitized.category || 'Manufacturing';
  sanitized.industry = sanitized.industry || 'General Trade';
  sanitized.phone = sanitized.phone || '+91 8319565363';
  sanitized.address = sanitized.address || 'Jabalpur, MP';
  sanitized.city = sanitized.city || 'Jabalpur';
  sanitized.plan = sanitized.plan || 'Free';
  sanitized.status = sanitized.status || 'pending';
  sanitized.featured = Boolean(sanitized.featured);
  sanitized.rating = Number(sanitized.rating) || 0;
  sanitized.reviewCount = Number(sanitized.reviewCount) || 0;
  sanitized.joinedAt = sanitized.joinedAt || new Date().toISOString().split('T')[0];

  return sanitized;
}

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

        // Merge any locally pending submissions so newly created members show up immediately
        const local = getLocalMembers();
        for (const loc of local) {
          if (!docs.some((d) => d.id === loc.id || d.$id === loc.id || (d.businessName === loc.businessName && d.phone === loc.phone))) {
            if (statusFilter === 'all' || loc.status === statusFilter) {
              docs.unshift(loc);
            }
          }
        }

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

        return { members: docs, total: Math.max(docs.length, res.total) };
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
        const payload = sanitizeMemberPayload(newMember);
        const res = await databases.createDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.members,
          ID.unique(),
          payload
        );
        const created = { ...newMember, ...res, id: res.id || newMember.id } as unknown as MemberBusiness;
        const local = getLocalMembers();
        local.unshift(created);
        saveLocalMembers(local);
        return created;
      } catch (err) {
        console.error('Appwrite create member error:', err);
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
        let docId = id;
        try {
          await databases.updateDocument(
            APPWRITE_CONFIG.databaseId,
            APPWRITE_CONFIG.collections.members,
            docId,
            { status }
          );
        } catch {
          // If id was custom VND_ id, search for document by id field
          const found = await databases.listDocuments(
            APPWRITE_CONFIG.databaseId,
            APPWRITE_CONFIG.collections.members,
            [Query.equal('id', id)]
          );
          if (found.documents.length > 0) {
            await databases.updateDocument(
              APPWRITE_CONFIG.databaseId,
              APPWRITE_CONFIG.collections.members,
              found.documents[0].$id,
              { status }
            );
          }
        }
      } catch (err) {
        console.warn('Appwrite update status notice:', err);
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
        let docId = id;
        try {
          await databases.updateDocument(
            APPWRITE_CONFIG.databaseId,
            APPWRITE_CONFIG.collections.members,
            docId,
            { featured }
          );
        } catch {
          const found = await databases.listDocuments(
            APPWRITE_CONFIG.databaseId,
            APPWRITE_CONFIG.collections.members,
            [Query.equal('id', id)]
          );
          if (found.documents.length > 0) {
            await databases.updateDocument(
              APPWRITE_CONFIG.databaseId,
              APPWRITE_CONFIG.collections.members,
              found.documents[0].$id,
              { featured }
            );
          }
        }
      } catch (err) {
        console.warn('Appwrite toggle featured notice:', err);
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

  async updateMember(id: string, updates: Partial<MemberBusiness>): Promise<MemberBusiness | null> {
    if (isAppwriteConfigured()) {
      try {
        const payload = sanitizeMemberPayload(updates);
        let docId = id;
        try {
          await databases.updateDocument(
            APPWRITE_CONFIG.databaseId,
            APPWRITE_CONFIG.collections.members,
            docId,
            payload
          );
        } catch {
          const found = await databases.listDocuments(
            APPWRITE_CONFIG.databaseId,
            APPWRITE_CONFIG.collections.members,
            [Query.equal('id', id)]
          );
          if (found.documents.length > 0) {
            await databases.updateDocument(
              APPWRITE_CONFIG.databaseId,
              APPWRITE_CONFIG.collections.members,
              found.documents[0].$id,
              payload
            );
          }
        }
      } catch (err) {
        console.warn('Appwrite update member notice:', err);
      }
    }

    const local = getLocalMembers();
    const idx = local.findIndex((m) => m.id === id || m.$id === id);
    if (idx !== -1) {
      local[idx] = { ...local[idx], ...updates };
      saveLocalMembers(local);
      return local[idx];
    }
    return null;
  },

  async getReviews(vendorId: string, alternateId?: string): Promise<BusinessReview[]> {
    if (isAppwriteConfigured()) {
      try {
        const res = await databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.reviews,
          [Query.equal('vendorId', vendorId), Query.equal('status', 'approved')]
        );
        let docs = res.documents as unknown as BusinessReview[];
        if (docs.length === 0 && alternateId && alternateId !== vendorId) {
          const res2 = await databases.listDocuments(
            APPWRITE_CONFIG.databaseId,
            APPWRITE_CONFIG.collections.reviews,
            [Query.equal('vendorId', alternateId), Query.equal('status', 'approved')]
          );
          docs = res2.documents as unknown as BusinessReview[];
        }
        if (docs.length > 0) {
          return docs;
        }
      } catch (err) {
        console.warn('Appwrite getReviews notice:', err);
      }
    }
    const all = getLocalReviews();
    return all.filter(
      (r) =>
        (r.vendorId === vendorId || (alternateId && r.vendorId === alternateId)) &&
        r.status === 'approved'
    );
  },

  async getAllReviewsAdmin(): Promise<BusinessReview[]> {
    if (isAppwriteConfigured()) {
      try {
        const res = await databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.reviews,
          [Query.limit(100), Query.orderDesc('$createdAt')]
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
        const doc = await databases.createDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.reviews,
          ID.unique(),
          newRev
        );
        if (doc?.$id) {
          newRev.$id = doc.$id;
        }
      } catch (err) {
        console.warn('Appwrite addReview notice:', err);
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
    if (isAppwriteConfigured()) {
      try {
        let docId = id;
        try {
          await databases.updateDocument(
            APPWRITE_CONFIG.databaseId,
            APPWRITE_CONFIG.collections.reviews,
            docId,
            { status }
          );
        } catch {
          // If id is not docId, find by id attribute
          const found = await databases.listDocuments(
            APPWRITE_CONFIG.databaseId,
            APPWRITE_CONFIG.collections.reviews,
            [Query.equal('id', id), Query.limit(1)]
          );
          if (found.documents.length > 0) {
            await databases.updateDocument(
              APPWRITE_CONFIG.databaseId,
              APPWRITE_CONFIG.collections.reviews,
              found.documents[0].$id,
              { status }
            );
          }
        }
      } catch (err) {
        console.warn('Appwrite update review error:', err);
      }
    }

    const list = getLocalReviews();
    const idx = list.findIndex((r) => r.id === id || r.$id === id);
    if (idx !== -1) {
      list[idx].status = status;
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_REVIEWS_KEY, JSON.stringify(list));
      }
    }
    return true;
  },

  async deleteReview(id: string): Promise<boolean> {
    if (isAppwriteConfigured()) {
      try {
        let docId = id;
        try {
          await databases.deleteDocument(
            APPWRITE_CONFIG.databaseId,
            APPWRITE_CONFIG.collections.reviews,
            docId
          );
        } catch {
          const found = await databases.listDocuments(
            APPWRITE_CONFIG.databaseId,
            APPWRITE_CONFIG.collections.reviews,
            [Query.equal('id', id), Query.limit(1)]
          );
          if (found.documents.length > 0) {
            await databases.deleteDocument(
              APPWRITE_CONFIG.databaseId,
              APPWRITE_CONFIG.collections.reviews,
              found.documents[0].$id
            );
          }
        }
      } catch (err) {
        console.warn('Appwrite delete review error:', err);
      }
    }

    const list = getLocalReviews().filter((r) => r.id !== id && r.$id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_REVIEWS_KEY, JSON.stringify(list));
    }
    return true;
  },
};
