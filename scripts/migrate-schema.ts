import fs from 'fs';
import path from 'path';
import { Client, Databases, ID } from 'appwrite';
import {
  SEED_MEMBERS,
  SEED_EVENTS,
  SEED_NEWS,
  SEED_JOBS,
  SEED_REVIEWS,
  SEED_IMPACT_STORIES,
} from '../src/services/seedData';

// Load .env.local
const envLocalPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  const lines = fs.readFileSync(envLocalPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '6a9aca980006903a5a9d';
const API_KEY = process.env.APPWRITE_API_KEY || '';
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'acci_db';

async function api(path: string, method = 'GET', body: any = null) {
  const res = await fetch(`${ENDPOINT}${path}`, {
    method,
    headers: {
      'X-Appwrite-Project': PROJECT_ID,
      'X-Appwrite-Key': API_KEY,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

type AttributeDef = {
  key: string;
  type: 'string' | 'boolean' | 'integer' | 'float';
  size?: number;
  required?: boolean;
  array?: boolean;
  default?: any;
};

const SCHEMAS: Record<string, AttributeDef[]> = {
  users: [
    { key: 'userId', type: 'string', size: 100, required: true },
    { key: 'name', type: 'string', size: 255, required: true },
    { key: 'email', type: 'string', size: 255, required: true },
    { key: 'phone', type: 'string', size: 50, required: false },
    { key: 'city', type: 'string', size: 100, required: false },
    { key: 'role', type: 'string', size: 50, required: true },
    { key: 'createdAt', type: 'string', size: 50, required: true },
  ],
  members: [
    { key: 'id', type: 'string', size: 100, required: false },
    { key: 'userId', type: 'string', size: 100, required: false },
    { key: 'businessName', type: 'string', size: 255, required: true },
    { key: 'legalName', type: 'string', size: 255, required: false },
    { key: 'ownerName', type: 'string', size: 255, required: true },
    { key: 'incomeType', type: 'string', size: 100, required: false },
    { key: 'category', type: 'string', size: 100, required: true },
    { key: 'industry', type: 'string', size: 100, required: true },
    { key: 'description', type: 'string', size: 5000, required: true },
    { key: 'detailed', type: 'string', size: 10000, required: false },
    { key: 'tagline', type: 'string', size: 500, required: false },
    { key: 'phone', type: 'string', size: 50, required: true },
    { key: 'whatsapp', type: 'string', size: 50, required: false },
    { key: 'email', type: 'string', size: 255, required: false },
    { key: 'website', type: 'string', size: 500, required: false },
    { key: 'social', type: 'string', size: 500, required: false },
    { key: 'address', type: 'string', size: 1000, required: true },
    { key: 'city', type: 'string', size: 100, required: true },
    { key: 'pinCode', type: 'string', size: 20, required: false },
    { key: 'maps', type: 'string', size: 1000, required: false },
    { key: 'timing', type: 'string', size: 100, required: false },
    { key: 'gst', type: 'string', size: 50, required: false },
    { key: 'estYear', type: 'string', size: 20, required: false },
    { key: 'employees', type: 'string', size: 50, required: false },
    { key: 'services', type: 'string', size: 2000, required: false },
    { key: 'products', type: 'string', size: 2000, required: false },
    { key: 'awards', type: 'string', size: 2000, required: false },
    { key: 'plan', type: 'string', size: 50, required: true },
    { key: 'status', type: 'string', size: 50, required: true },
    { key: 'featured', type: 'boolean', required: true },
    { key: 'rating', type: 'float', required: false, default: 5.0 },
    { key: 'reviewCount', type: 'integer', required: false, default: 0 },
    { key: 'workPhotos', type: 'string', size: 500, array: true, required: false },
    { key: 'logoUrl', type: 'string', size: 1000, required: false },
    { key: 'joinedAt', type: 'string', size: 50, required: true },
  ],
  events: [
    { key: 'id', type: 'string', size: 100, required: false },
    { key: 'title', type: 'string', size: 255, required: true },
    { key: 'slug', type: 'string', size: 255, required: true },
    { key: 'category', type: 'string', size: 100, required: true },
    { key: 'date', type: 'string', size: 50, required: true },
    { key: 'time', type: 'string', size: 50, required: true },
    { key: 'venue', type: 'string', size: 255, required: true },
    { key: 'description', type: 'string', size: 5000, required: true },
    { key: 'imageUrl', type: 'string', size: 1000, required: false },
    { key: 'bgColor', type: 'string', size: 100, required: false },
    { key: 'registrationUrl', type: 'string', size: 1000, required: false },
    { key: 'status', type: 'string', size: 50, required: true },
    { key: 'createdAt', type: 'string', size: 50, required: true },
  ],
  news: [
    { key: 'id', type: 'string', size: 100, required: false },
    { key: 'title', type: 'string', size: 255, required: true },
    { key: 'slug', type: 'string', size: 255, required: true },
    { key: 'category', type: 'string', size: 100, required: true },
    { key: 'excerpt', type: 'string', size: 2000, required: true },
    { key: 'content', type: 'string', size: 20000, required: true },
    { key: 'imageUrl', type: 'string', size: 1000, required: false },
    { key: 'author', type: 'string', size: 200, required: true },
    { key: 'publishedAt', type: 'string', size: 50, required: true },
    { key: 'status', type: 'string', size: 50, required: true },
  ],
  jobs: [
    { key: 'id', type: 'string', size: 100, required: false },
    { key: 'userId', type: 'string', size: 100, required: false },
    { key: 'company', type: 'string', size: 255, required: true },
    { key: 'title', type: 'string', size: 255, required: true },
    { key: 'category', type: 'string', size: 100, required: true },
    { key: 'jobType', type: 'string', size: 50, required: true },
    { key: 'urgency', type: 'string', size: 50, required: true },
    { key: 'salary', type: 'string', size: 100, required: true },
    { key: 'location', type: 'string', size: 255, required: true },
    { key: 'description', type: 'string', size: 5000, required: true },
    { key: 'skills', type: 'string', size: 2000, required: true },
    { key: 'contactEmail', type: 'string', size: 255, required: false },
    { key: 'contactWhatsApp', type: 'string', size: 50, required: false },
    { key: 'status', type: 'string', size: 50, required: true },
    { key: 'postedAt', type: 'string', size: 50, required: true },
  ],
  contact_submissions: [
    { key: 'id', type: 'string', size: 100, required: false },
    { key: 'name', type: 'string', size: 255, required: true },
    { key: 'email', type: 'string', size: 255, required: true },
    { key: 'phone', type: 'string', size: 50, required: true },
    { key: 'subject', type: 'string', size: 255, required: true },
    { key: 'message', type: 'string', size: 5000, required: true },
    { key: 'status', type: 'string', size: 50, required: true },
    { key: 'createdAt', type: 'string', size: 50, required: true },
  ],
  reviews: [
    { key: 'id', type: 'string', size: 100, required: false },
    { key: 'vendorId', type: 'string', size: 100, required: true },
    { key: 'businessName', type: 'string', size: 255, required: true },
    { key: 'reviewerName', type: 'string', size: 255, required: true },
    { key: 'rating', type: 'integer', required: true },
    { key: 'reviewText', type: 'string', size: 2000, required: true },
    { key: 'status', type: 'string', size: 50, required: true },
    { key: 'createdAt', type: 'string', size: 50, required: true },
  ],
  impact_stories: [
    { key: 'id', type: 'string', size: 100, required: false },
    { key: 'title', type: 'string', size: 255, required: true },
    { key: 'authorName', type: 'string', size: 255, required: true },
    { key: 'businessName', type: 'string', size: 255, required: true },
    { key: 'story', type: 'string', size: 5000, required: true },
    { key: 'imageUrl', type: 'string', size: 1000, required: false },
    { key: 'status', type: 'string', size: 50, required: true },
    { key: 'createdAt', type: 'string', size: 50, required: true },
  ],
};

async function createAttributesForCollection(colId: string) {
  const attrs = SCHEMAS[colId];
  if (!attrs) return;

  // Get existing attributes
  const { data: colData } = await api(`/databases/${DATABASE_ID}/collections/${colId}`);
  const existingKeys = new Set((colData.attributes || []).map((a: any) => a.key));

  for (const attr of attrs) {
    if (existingKeys.has(attr.key)) {
      console.log(`  · [${colId}] Attribute already exists: ${attr.key}`);
      continue;
    }

    let subPath = '';
    let body: any = {
      key: attr.key,
      required: attr.required ?? false,
      array: attr.array ?? false,
    };

    if (attr.type === 'string') {
      subPath = '/attributes/string';
      body.size = attr.size || 255;
      if (!attr.required && attr.default !== undefined) {
        body.default = attr.default;
      }
    } else if (attr.type === 'boolean') {
      subPath = '/attributes/boolean';
      if (!attr.required && attr.default !== undefined) {
        body.default = attr.default;
      }
    } else if (attr.type === 'integer') {
      subPath = '/attributes/integer';
      if (!attr.required && attr.default !== undefined) {
        body.default = attr.default;
      }
    } else if (attr.type === 'float') {
      subPath = '/attributes/float';
      if (!attr.required && attr.default !== undefined) {
        body.default = attr.default;
      }
    }

    const { status, data } = await api(
      `/databases/${DATABASE_ID}/collections/${colId}${subPath}`,
      'POST',
      body
    );

    if (status === 201 || status === 202) {
      console.log(`  ✓ [${colId}] Created attribute: ${attr.key} (${attr.type})`);
    } else {
      console.log(`  ⚠️ [${colId}] Error attribute ${attr.key}:`, data.message || status);
    }
  }
}

async function waitForAttributesReady(colId: string) {
  console.log(`  ⏳ Waiting for attributes in ${colId} to finish processing...`);
  for (let i = 0; i < 20; i++) {
    const { data } = await api(`/databases/${DATABASE_ID}/collections/${colId}`);
    const attributes = data.attributes || [];
    const pending = attributes.filter((a: any) => a.status === 'processing');
    if (pending.length === 0) {
      console.log(`  ✓ All ${attributes.length} attributes in ${colId} are ready!`);
      return;
    }
    await new Promise((r) => setTimeout(r, 1500));
  }
  console.log(`  ℹ Attributes in ${colId} ready check timed out, proceeding.`);
}

async function updateCollectionPermissions() {
  console.log('\n🔒 Updating Collection Permissions...');
  const collections = Object.keys(SCHEMAS);
  for (const colId of collections) {
    const { status, data } = await api(
      `/databases/${DATABASE_ID}/collections/${colId}`,
      'PUT',
      {
        name: colId.charAt(0).toUpperCase() + colId.slice(1),
        permissions: [
          'read("any")',
          'create("any")',
          'update("any")',
          'delete("any")',
        ],
        documentSecurity: false,
      }
    );
    if (status === 200) {
      console.log(`  ✓ [${colId}] Permissions updated to read("any"), create/update/delete("any")`);
    } else {
      console.log(`  ℹ [${colId}] Permissions note:`, data.message || status);
    }
  }
}

async function seedDataIntoAppwrite() {
  console.log('\n🌱 Seeding Initial Data into Appwrite Cloud Database...');
  const client = new Client();
  client.setEndpoint(ENDPOINT).setProject(PROJECT_ID);
  const db = new Databases(client);

  // 1. Members
  try {
    const existing = await db.listDocuments(DATABASE_ID, 'members');
    if (existing.total === 0) {
      console.log(`  -> Seeding ${SEED_MEMBERS.length} members...`);
      for (const m of SEED_MEMBERS) {
        const docId = m.id.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 36);
        await db.createDocument(DATABASE_ID, 'members', docId, {
          id: m.id,
          businessName: m.businessName,
          legalName: m.legalName || '',
          ownerName: m.ownerName,
          incomeType: m.incomeType || '',
          category: m.category,
          industry: m.industry,
          description: m.description,
          detailed: m.detailed || '',
          tagline: m.tagline || '',
          phone: m.phone,
          whatsapp: m.whatsapp || '',
          email: m.email || '',
          website: m.website || '',
          social: m.social || '',
          address: m.address,
          city: m.city,
          pinCode: m.pinCode || '',
          maps: m.maps || '',
          timing: m.timing || '',
          gst: m.gst || '',
          estYear: m.estYear || '',
          employees: m.employees || '',
          services: m.services || '',
          products: m.products || '',
          awards: m.awards || '',
          plan: m.plan,
          status: m.status,
          featured: m.featured,
          rating: m.rating,
          reviewCount: m.reviewCount,
          workPhotos: m.workPhotos || [],
          logoUrl: m.logoUrl || '',
          joinedAt: m.joinedAt,
        });
      }
      console.log('  ✓ Members seeded successfully.');
    } else {
      console.log(`  ℹ Members collection already has ${existing.total} documents.`);
    }
  } catch (e: any) {
    console.error('  ❌ Error seeding members:', e.message);
  }

  // 2. Events
  try {
    const existing = await db.listDocuments(DATABASE_ID, 'events');
    if (existing.total === 0) {
      console.log(`  -> Seeding ${SEED_EVENTS.length} events...`);
      for (const ev of SEED_EVENTS) {
        const docId = ev.id.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 36);
        await db.createDocument(DATABASE_ID, 'events', docId, {
          id: ev.id,
          title: ev.title,
          slug: ev.slug,
          category: ev.category,
          date: ev.date,
          time: ev.time,
          venue: ev.venue,
          description: ev.description,
          imageUrl: ev.imageUrl || '',
          bgColor: ev.bgColor || '',
          registrationUrl: ev.registrationUrl || '',
          status: ev.status,
          createdAt: ev.createdAt,
        });
      }
      console.log('  ✓ Events seeded successfully.');
    } else {
      console.log(`  ℹ Events collection already has ${existing.total} documents.`);
    }
  } catch (e: any) {
    console.error('  ❌ Error seeding events:', e.message);
  }

  // 3. News
  try {
    const existing = await db.listDocuments(DATABASE_ID, 'news');
    if (existing.total === 0) {
      console.log(`  -> Seeding ${SEED_NEWS.length} news items...`);
      for (const n of SEED_NEWS) {
        const docId = n.id.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 36);
        await db.createDocument(DATABASE_ID, 'news', docId, {
          id: n.id,
          title: n.title,
          slug: n.slug,
          category: n.category,
          excerpt: n.excerpt,
          content: n.content,
          imageUrl: n.imageUrl || '',
          author: n.author,
          publishedAt: n.publishedAt,
          status: n.status,
        });
      }
      console.log('  ✓ News seeded successfully.');
    } else {
      console.log(`  ℹ News collection already has ${existing.total} documents.`);
    }
  } catch (e: any) {
    console.error('  ❌ Error seeding news:', e.message);
  }

  // 4. Jobs
  try {
    const existing = await db.listDocuments(DATABASE_ID, 'jobs');
    if (existing.total === 0) {
      console.log(`  -> Seeding ${SEED_JOBS.length} jobs...`);
      for (const j of SEED_JOBS) {
        const docId = j.id.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 36);
        await db.createDocument(DATABASE_ID, 'jobs', docId, {
          id: j.id,
          company: j.company,
          title: j.title,
          category: j.category,
          jobType: j.jobType,
          urgency: j.urgency,
          salary: j.salary,
          location: j.location,
          description: j.description,
          skills: j.skills,
          contactEmail: j.contactEmail || '',
          contactWhatsApp: j.contactWhatsApp || '',
          status: j.status,
          postedAt: j.postedAt,
        });
      }
      console.log('  ✓ Jobs seeded successfully.');
    } else {
      console.log(`  ℹ Jobs collection already has ${existing.total} documents.`);
    }
  } catch (e: any) {
    console.error('  ❌ Error seeding jobs:', e.message);
  }

  // 5. Inquiries
  try {
    const existing = await db.listDocuments(DATABASE_ID, 'contact_submissions');
    if (existing.total === 0) {
      const sampleInquiries = [
        {
          id: 'INQ_101',
          name: 'Pramod Agrawal',
          email: 'pramod@narmadaflour.com',
          phone: '+91 94251 55660',
          subject: 'Inquiry regarding Corporate ACCI Patron Membership',
          message: 'Respected Secretary, we operate an agro-processing unit in Jabalpur and wish to apply for Corporate Life Patron Membership with ACCI. Kindly advise procedure.',
          status: 'unread',
          createdAt: '2026-09-05T10:30:00.000Z',
        },
      ];
      console.log(`  -> Seeding ${sampleInquiries.length} inquiries...`);
      for (const inq of sampleInquiries) {
        const docId = inq.id.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 36);
        await db.createDocument(DATABASE_ID, 'contact_submissions', docId, {
          id: inq.id,
          name: inq.name,
          email: inq.email,
          phone: inq.phone,
          subject: inq.subject,
          message: inq.message,
          status: inq.status,
          createdAt: inq.createdAt,
        });
      }
      console.log('  ✓ Inquiries seeded successfully.');
    } else {
      console.log(`  ℹ Inquiries collection already has ${existing.total} documents.`);
    }
  } catch (e: any) {
    console.error('  ❌ Error seeding inquiries:', e.message);
  }

  // 6. Reviews
  try {
    const existing = await db.listDocuments(DATABASE_ID, 'reviews');
    if (existing.total === 0) {
      console.log(`  -> Seeding ${SEED_REVIEWS.length} reviews...`);
      for (const rev of SEED_REVIEWS) {
        const docId = rev.id.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 36);
        await db.createDocument(DATABASE_ID, 'reviews', docId, {
          id: rev.id,
          vendorId: rev.vendorId,
          businessName: rev.businessName,
          reviewerName: rev.reviewerName,
          rating: rev.rating,
          reviewText: rev.reviewText,
          status: rev.status,
          createdAt: rev.createdAt,
        });
      }
      console.log('  ✓ Reviews seeded successfully.');
    } else {
      console.log(`  ℹ Reviews collection already has ${existing.total} documents.`);
    }
  } catch (e: any) {
    console.error('  ❌ Error seeding reviews:', e.message);
  }
}

async function main() {
  console.log('🏛️  ACCI Appwrite Schema Migration & Seeder');
  console.log('============================================');
  console.log(`Target: ${ENDPOINT}`);
  console.log(`Database: ${DATABASE_ID}\n`);

  for (const colId of Object.keys(SCHEMAS)) {
    console.log(`Creating attributes for [${colId}]...`);
    await createAttributesForCollection(colId);
  }

  for (const colId of Object.keys(SCHEMAS)) {
    await waitForAttributesReady(colId);
  }

  await updateCollectionPermissions();

  await seedDataIntoAppwrite();

  console.log('\n🎉 ALL DONE! Appwrite Database is fully configured and populated.');
}

main();
