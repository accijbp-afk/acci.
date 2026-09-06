export interface UserProfile {
  $id?: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  role: 'admin' | 'member' | 'user';
  createdAt: string;
}

export interface MemberBusiness {
  $id?: string;
  id: string;
  userId?: string;
  businessName: string;
  legalName?: string;
  ownerName: string;
  incomeType?: string;
  category: 'Wholesale' | 'Retail' | 'Manufacturing' | 'Service Provider' | 'Professional' | 'Distribution' | 'Import / Export';
  industry: string;
  description: string;
  detailed?: string;
  tagline?: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  social?: string;
  address: string;
  city: string;
  pinCode?: string;
  maps?: string;
  timing?: string;
  gst?: string;
  estYear?: string;
  employees?: string;
  services?: string;
  products?: string;
  awards?: string;
  plan: 'Free' | 'Pro' | 'Premium';
  status: 'pending' | 'approved' | 'rejected';
  featured: boolean;
  rating: number;
  reviewCount: number;
  workPhotos?: string[];
  logoUrl?: string;
  joinedAt: string;
}

export interface ChamberEvent {
  $id?: string;
  id: string;
  title: string;
  slug: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  imageUrl?: string;
  bgColor?: string;
  registrationUrl?: string;
  status: 'upcoming' | 'ongoing' | 'past';
  createdAt: string;
}

export interface ChamberNews {
  $id?: string;
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  author: string;
  publishedAt: string;
  status: 'published' | 'draft';
}

export interface JobListing {
  $id?: string;
  id: string;
  userId?: string;
  company: string;
  title: string;
  category: string;
  jobType: 'Full-Time' | 'Part-Time' | 'Internship' | 'Contract';
  urgency: 'Open' | 'Urgent';
  salary: string;
  location: string;
  description: string;
  skills: string;
  contactEmail?: string;
  contactWhatsApp?: string;
  status: 'Active' | 'Closed';
  postedAt: string;
}

export interface ContactSubmission {
  $id?: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'resolved';
  createdAt: string;
}

export interface BusinessReview {
  $id?: string;
  id: string;
  vendorId: string;
  businessName: string;
  reviewerName: string;
  rating: number;
  reviewText: string;
  status: 'pending' | 'approved';
  createdAt: string;
}

export interface ImpactStory {
  $id?: string;
  id: string;
  title: string;
  authorName: string;
  businessName: string;
  story: string;
  imageUrl?: string;
  status: 'approved' | 'pending';
  createdAt: string;
}

export interface CommitteeLeader {
  id: string;
  name: string;
  designation: string;
  organization: string;
  category: 'Patron' | 'Office Bearer' | 'Executive Committee' | 'Chapter Head' | 'Advisory';
  photoUrl?: string;
  bio?: string;
  phone?: string;
  email?: string;
  linkedin?: string;
}
