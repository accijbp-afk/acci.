import { ID, Query } from 'appwrite';
import { databases, APPWRITE_CONFIG, isAppwriteConfigured } from './client';
import { JobListing } from '@/types';
import { SEED_JOBS } from '../seedData';

const LOCAL_STORAGE_JOBS_KEY = 'acci_jobs_data';

const getLocalJobs = (): JobListing[] => {
  if (typeof window === 'undefined') return SEED_JOBS;
  const stored = localStorage.getItem(LOCAL_STORAGE_JOBS_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_JOBS_KEY, JSON.stringify(SEED_JOBS));
    return SEED_JOBS;
  }
  try {
    const list: JobListing[] = JSON.parse(stored);
    const cleanList = Array.isArray(list)
      ? list.filter((j) => !j.id.startsWith('JOB_10') && !j.id.startsWith('JOB_SEED_'))
      : [];
    if (cleanList.length !== list.length) {
      localStorage.setItem(LOCAL_STORAGE_JOBS_KEY, JSON.stringify(cleanList));
    }
    return cleanList;
  } catch {
    return SEED_JOBS;
  }
};

export const jobsService = {
  async getJobs(params?: { category?: string; urgency?: string; activeOnly?: boolean }): Promise<JobListing[]> {
    if (isAppwriteConfigured()) {
      try {
        const queries: string[] = [Query.orderDesc('postedAt'), Query.limit(50)];
        if (params?.activeOnly) queries.push(Query.equal('status', 'Active'));
        if (params?.category) queries.push(Query.equal('category', params.category));
        if (params?.urgency) queries.push(Query.equal('urgency', params.urgency));

        const res = await databases.listDocuments(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.jobs,
          queries
        );
        return res.documents as unknown as JobListing[];
      } catch (err) {
        console.warn('Appwrite jobs fetch error', err);
      }
    }

    let list = getLocalJobs();
    if (params?.activeOnly) list = list.filter((j) => j.status === 'Active');
    if (params?.category) list = list.filter((j) => j.category.toLowerCase().includes(params.category!.toLowerCase()));
    if (params?.urgency) list = list.filter((j) => j.urgency === params.urgency);
    return list;
  },

  async createJob(job: Omit<JobListing, 'id' | 'postedAt' | 'status'>): Promise<JobListing> {
    const newJob: JobListing = {
      ...job,
      id: 'JOB_' + Date.now(),
      status: 'Active',
      postedAt: new Date().toISOString().split('T')[0],
    };

    if (isAppwriteConfigured()) {
      try {
        const res = await databases.createDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.jobs,
          ID.unique(),
          newJob
        );
        return res as unknown as JobListing;
      } catch (err) {
        console.warn('Appwrite createJob error', err);
      }
    }

    const list = getLocalJobs();
    list.unshift(newJob);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_JOBS_KEY, JSON.stringify(list));
    }
    return newJob;
  },

  async toggleJobStatus(id: string, status: 'Active' | 'Closed'): Promise<boolean> {
    if (isAppwriteConfigured()) {
      try {
        await databases.updateDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.jobs,
          id,
          { status }
        );
      } catch {
        // Continue
      }
    }

    const list = getLocalJobs();
    const idx = list.findIndex((j) => j.id === id || j.$id === id);
    if (idx !== -1) {
      list[idx].status = status;
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_JOBS_KEY, JSON.stringify(list));
      }
      return true;
    }
    return false;
  },
};
