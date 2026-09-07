import {
  MemberBusiness,
  ChamberEvent,
  ChamberNews,
  JobListing,
  ContactSubmission,
  BusinessReview,
  ImpactStory,
  CommitteeLeader,
  GalleryAlbum,
} from '@/types';

export const SEED_CATEGORIES = [
  { id: 'cat-1', name: 'Manufacturing', icon: '🏭', desc: 'Heavy industry, FMCG, packaging & fabrication' },
  { id: 'cat-2', name: 'Wholesale', icon: '🏬', desc: 'B2B bulk trading, agricultural commodities & commodities' },
  { id: 'cat-3', name: 'Retail', icon: '🛍️', desc: 'Showrooms, jewellery, fashion, electronics & supermarkets' },
  { id: 'cat-4', name: 'Professional', icon: '💼', desc: 'Chartered Accountants, legal advocates, tax & architects' },
  { id: 'cat-5', name: 'Service Provider', icon: '🔧', desc: 'Healthcare, hospitals, IT, logistics, hospitality' },
  { id: 'cat-6', name: 'Distribution', icon: '🚛', desc: 'Supply chain networks, FMCG distribution & dealerships' },
  { id: 'cat-7', name: 'Import / Export', icon: '🌐', desc: 'Cross-border trade, agri-exports & raw materials' },
];

export const SEED_INDUSTRIES = [
  { id: 'ind-1', name: 'Food Processing & FMCG', icon: '🍽️', category: 'Manufacturing', imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80' },
  { id: 'ind-2', name: 'Textile & Garments', icon: '🧵', category: 'Manufacturing', imageUrl: 'https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?auto=format&fit=crop&w=600&q=80' },
  { id: 'ind-3', name: 'Jewellery & Precious Metals', icon: '💎', category: 'Retail', imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80' },
  { id: 'ind-4', name: 'Agricultural Commodities', icon: '🌾', category: 'Wholesale', imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80' },
  { id: 'ind-5', name: 'Hospitals & Healthcare', icon: '🏥', category: 'Service Provider', imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80' },
  { id: 'ind-6', name: 'Hotels & Hospitality', icon: '🏨', category: 'Service Provider', imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80' },
  { id: 'ind-7', name: 'Transporters & Logistics', icon: '🚛', category: 'Distribution', imageUrl: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=600&q=80' },
  { id: 'ind-8', name: 'Chartered Accountants & Audit', icon: '📊', category: 'Professional', imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80' },
  { id: 'ind-9', name: 'Software Development & IT', icon: '💻', category: 'Professional', imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80' },
  { id: 'ind-10', name: 'Advocates & Law Firms', icon: '⚖️', category: 'Professional', imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80' },
  { id: 'ind-11', name: 'Real Estate & Infrastructure', icon: '🏗️', category: 'Manufacturing', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80' },
  { id: 'ind-12', name: 'Automobile Dealers & Parts', icon: '🚗', category: 'Retail', imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80' },
  { id: 'ind-13', name: 'Steel & Hardware Trading', icon: '🔩', category: 'Wholesale', imageUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80' },
  { id: 'ind-14', name: 'Coaching & Higher Education', icon: '📚', category: 'Service Provider', imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80' },
  { id: 'ind-15', name: 'Event Management & Media', icon: '🎭', category: 'Service Provider', imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80' },
  { id: 'ind-16', name: 'Electronics & Home Appliances', icon: '📱', category: 'Retail', imageUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80' },
];

// Clean empty arrays for fresh live data
export const SEED_MEMBERS: MemberBusiness[] = [];
export const SEED_EVENTS: ChamberEvent[] = [];
export const SEED_NEWS: ChamberNews[] = [];
export const SEED_JOBS: JobListing[] = [];
export const SEED_CONTACT: ContactSubmission[] = [];
export const SEED_REVIEWS: BusinessReview[] = [];
export const SEED_STORIES: ImpactStory[] = [];
export const SEED_LEADERSHIP: CommitteeLeader[] = [];
export const SEED_GALLERY: GalleryAlbum[] = [];
