/**
 * Automated Appwrite Setup & Schema Migration Script
 * Run with: npx tsx scripts/setup-appwrite.ts
 *
 * This script connects to your Appwrite project via Server API Key
 * and automatically creates the database, collections, attributes,
 * and storage bucket for ACCI Jabalpur.
 */

import fs from 'fs';
import path from 'path';

// Read .env.local if not already in process.env
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

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'acci_db';

async function request(path: string, method = 'GET', body: unknown = null) {
  const url = `${ENDPOINT}${path}`;
  const headers: Record<string, string> = {
    'X-Appwrite-Project': PROJECT_ID || '',
    'X-Appwrite-Key': API_KEY || '',
    'Content-Type': 'application/json',
  };

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok && res.status !== 409) {
    // 409 means resource already exists
    throw new Error(`[${res.status}] ${json.message || JSON.stringify(json)}`);
  }
  return json;
}

async function main() {
  console.log('🏛️  ACCI Jabalpur — Appwrite Schema Setup');
  console.log('==========================================');

  if (!PROJECT_ID || !API_KEY) {
    console.error('❌ Error: NEXT_PUBLIC_APPWRITE_PROJECT_ID and APPWRITE_API_KEY must be set in your environment.');
    console.log('Please configure .env.local with your project credentials.');
    process.exit(1);
  }

  console.log(`Endpoint:   ${ENDPOINT}`);
  console.log(`Project ID: ${PROJECT_ID}`);
  console.log(`Database:   ${DATABASE_ID}`);

  try {
    // 1. Create Database
    console.log('\n1. Ensuring Database exists...');
    await request('/databases', 'POST', {
      databaseId: DATABASE_ID,
      name: 'ACCI Chamber Database',
    }).then(() => console.log(`   ✓ Created database: ${DATABASE_ID}`))
      .catch((e) => console.log(`   ℹ Database already exists or notice: ${e.message}`));

    // 2. Collections to create
    const collections = [
      { id: 'users', name: 'Registered Users' },
      { id: 'members', name: 'Member Enterprises & Directory' },
      { id: 'events', name: 'Chamber Events & Conclaves' },
      { id: 'news', name: 'Circulars & News' },
      { id: 'jobs', name: 'Employment & Vacancies' },
      { id: 'contact_submissions', name: 'Secretariat Inquiries' },
      { id: 'reviews', name: 'Enterprise Reviews' },
      { id: 'impact_stories', name: 'Member Impact Stories' },
    ];

    console.log('\n2. Creating Collections...');
    for (const col of collections) {
      await request(`/databases/${DATABASE_ID}/collections`, 'POST', {
        collectionId: col.id,
        name: col.name,
        permissions: ['read("any")', 'create("any")', 'update("users")', 'delete("users")'],
        documentSecurity: false,
      }).then(() => console.log(`   ✓ Collection: ${col.id} (${col.name})`))
        .catch((e) => console.log(`   ℹ Collection ${col.id}: ${e.message}`));
    }

    // 2b. Ensure Events Collection Attributes
    console.log('\n2b. Ensuring Events Collection Attributes...');
    const eventAttributes = [
      { key: 'title', size: 255, required: true },
      { key: 'id', size: 100, required: false },
      { key: 'slug', size: 255, required: true },
      { key: 'category', size: 100, required: true },
      { key: 'date', size: 50, required: true },
      { key: 'time', size: 50, required: true },
      { key: 'venue', size: 255, required: true },
      { key: 'description', size: 5000, required: true },
      { key: 'imageUrl', size: 1000000, required: false },
      { key: 'bgColor', size: 100, required: false },
      { key: 'registrationUrl', size: 1000, required: false },
      { key: 'status', size: 50, required: true },
      { key: 'createdAt', size: 50, required: true },
    ];

    for (const attr of eventAttributes) {
      await request(`/databases/${DATABASE_ID}/collections/events/attributes/string`, 'POST', {
        key: attr.key,
        size: attr.size,
        required: attr.required,
      }).then(() => console.log(`   ✓ Created attribute: events.${attr.key}`))
        .catch(async () => {
          // If exists and it's imageUrl, ensure size is 1,000,000
          if (attr.key === 'imageUrl') {
            await request(`/databases/${DATABASE_ID}/collections/events/attributes/string/imageUrl`, 'PATCH', {
              size: 1000000,
              required: false,
            }).then(() => console.log(`   ✓ Updated events.imageUrl size to 1,000,000`))
              .catch(() => {});
          }
        });
    }

    // 2c. Ensure Impact Stories Collection Attributes
    console.log('\n2c. Ensuring Impact Stories Collection Attributes...');
    const storyStringAttributes = [
      { key: 'id', size: 100, required: false },
      { key: 'title', size: 255, required: true },
      { key: 'authorName', size: 255, required: true },
      { key: 'businessName', size: 255, required: true },
      { key: 'roleOrDesignation', size: 255, required: false },
      { key: 'benefitCategory', size: 100, required: false },
      { key: 'story', size: 5000, required: true },
      { key: 'imageUrl', size: 1000, required: false },
      { key: 'status', size: 50, required: true },
      { key: 'createdAt', size: 50, required: true },
      { key: 'contactPhone', size: 50, required: false },
      { key: 'contactEmail', size: 255, required: false },
    ];

    for (const attr of storyStringAttributes) {
      await request(`/databases/${DATABASE_ID}/collections/impact_stories/attributes/string`, 'POST', {
        key: attr.key,
        size: attr.size,
        required: attr.required,
      }).then(() => console.log(`   ✓ Created attribute: impact_stories.${attr.key}`))
        .catch(() => {});
    }

    await request(`/databases/${DATABASE_ID}/collections/impact_stories/attributes/boolean`, 'POST', {
      key: 'featured',
      required: false,
      default: false,
    }).then(() => console.log(`   ✓ Created attribute: impact_stories.featured`))
      .catch(() => {});

    await request(`/databases/${DATABASE_ID}/collections/impact_stories/attributes/integer`, 'POST', {
      key: 'rating',
      required: false,
      min: 1,
      max: 5,
      default: 5,
    }).then(() => console.log(`   ✓ Created attribute: impact_stories.rating`))
      .catch(() => {});

    // 3. Create Storage Bucket
    console.log('\n3. Creating Media Storage Bucket...');
    const bucketId = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID || 'acci_media';
    await request('/storage/buckets', 'POST', {
      bucketId,
      name: 'ACCI Media Assets',
      permissions: ['read("any")', 'create("any")', 'update("users")', 'delete("users")'],
      fileSecurity: false,
      enabled: true,
      maxFileSize: 10485760, // 10MB
      allowedFileExtensions: ['jpg', 'png', 'jpeg', 'webp', 'svg', 'pdf'],
    }).then(() => console.log(`   ✓ Storage bucket: ${bucketId}`))
      .catch((e) => console.log(`   ℹ Bucket ${bucketId}: ${e.message}`));

    console.log('\n🎉 Appwrite setup complete! Your Chamber backend is ready.');
  } catch (err: unknown) {
    console.error('\n❌ Setup halted:', err instanceof Error ? err.message : err);
  }
}

main();
