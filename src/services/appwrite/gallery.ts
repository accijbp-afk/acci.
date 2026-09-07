import { GalleryAlbum } from '@/types';
import { SEED_GALLERY } from '../seedData';

const LOCAL_STORAGE_GALLERY_KEY = 'acci_gallery_data_v2';

const getLocalGallery = (): GalleryAlbum[] => {
  if (typeof window === 'undefined') return SEED_GALLERY;
  const stored = localStorage.getItem(LOCAL_STORAGE_GALLERY_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_GALLERY_KEY, JSON.stringify(SEED_GALLERY));
    return SEED_GALLERY;
  }
  try {
    const list: GalleryAlbum[] = JSON.parse(stored);
    const cleanList = Array.isArray(list)
      ? list.filter((a) => !a.id.startsWith('gal-seed-') && !a.id.startsWith('GAL_SEED_') && !a.id.startsWith('gal-10'))
      : [];
    if (cleanList.length !== list.length) {
      localStorage.setItem(LOCAL_STORAGE_GALLERY_KEY, JSON.stringify(cleanList));
    }
    return cleanList;
  } catch {
    return SEED_GALLERY;
  }
};

const saveLocalGallery = (albums: GalleryAlbum[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_GALLERY_KEY, JSON.stringify(albums));
  }
};

export const galleryService = {
  async getAlbums(): Promise<GalleryAlbum[]> {
    return getLocalGallery();
  },

  async getAlbumById(id: string): Promise<GalleryAlbum | null> {
    const list = await this.getAlbums();
    return list.find((a) => a.id === id || a.$id === id) || null;
  },

  async createAlbum(album: Omit<GalleryAlbum, 'id' | 'createdAt'>): Promise<GalleryAlbum> {
    const newAlbum: GalleryAlbum = {
      ...album,
      id: 'GAL_' + Date.now(),
      createdAt: new Date().toISOString(),
      photoCount: album.photos && album.photos.length ? album.photos.length : (album.photoCount || 1),
    };

    const list = getLocalGallery();
    list.unshift(newAlbum);
    saveLocalGallery(list);
    return newAlbum;
  },

  async deleteAlbum(id: string): Promise<boolean> {
    const list = getLocalGallery();
    const filtered = list.filter((a) => a.id !== id && a.$id !== id);
    saveLocalGallery(filtered);
    return true;
  },

  async updateAlbum(id: string, updates: Partial<GalleryAlbum>): Promise<GalleryAlbum | null> {
    const list = getLocalGallery();
    const index = list.findIndex((a) => a.id === id || a.$id === id);
    if (index === -1) return null;
    list[index] = { ...list[index], ...updates };
    saveLocalGallery(list);
    return list[index];
  },
};
