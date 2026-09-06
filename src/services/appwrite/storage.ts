import { ID } from 'appwrite';
import { storage, APPWRITE_CONFIG, isAppwriteConfigured } from './client';

export const storageService = {
  async uploadFile(file: File): Promise<string> {
    if (isAppwriteConfigured()) {
      try {
        const res = await storage.createFile(APPWRITE_CONFIG.buckets.media, ID.unique(), file);
        return storage.getFileView(APPWRITE_CONFIG.buckets.media, res.$id).toString();
      } catch (err) {
        console.warn('Appwrite storage upload failed, falling back to data URL', err);
      }
    }

    // Local data URL fallback
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  getFileViewUrl(fileId: string): string {
    if (isAppwriteConfigured()) {
      return storage.getFileView(APPWRITE_CONFIG.buckets.media, fileId).toString();
    }
    return fileId;
  },
};
