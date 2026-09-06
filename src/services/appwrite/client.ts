import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client();

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '';

if (endpoint) {
  client.setEndpoint(endpoint);
}

if (projectId && projectId !== 'YOUR_APPWRITE_PROJECT_ID') {
  client.setProject(projectId);
}

export const isAppwriteConfigured = (): boolean => {
  return Boolean(
    projectId &&
    projectId !== 'YOUR_APPWRITE_PROJECT_ID' &&
    !projectId.startsWith('676543210000')
  );
};

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export const APPWRITE_CONFIG = {
  endpoint,
  projectId,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'acci_db',
  collections: {
    users: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || 'users',
    members: process.env.NEXT_PUBLIC_APPWRITE_MEMBERS_COLLECTION_ID || 'members',
    events: process.env.NEXT_PUBLIC_APPWRITE_EVENTS_COLLECTION_ID || 'events',
    news: process.env.NEXT_PUBLIC_APPWRITE_NEWS_COLLECTION_ID || 'news',
    jobs: process.env.NEXT_PUBLIC_APPWRITE_JOBS_COLLECTION_ID || 'jobs',
    contact: process.env.NEXT_PUBLIC_APPWRITE_CONTACT_COLLECTION_ID || 'contact_submissions',
    reviews: process.env.NEXT_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID || 'reviews',
    stories: process.env.NEXT_PUBLIC_APPWRITE_STORIES_COLLECTION_ID || 'impact_stories',
  },
  buckets: {
    media: process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID || 'acci_media',
  },
};

export default client;
