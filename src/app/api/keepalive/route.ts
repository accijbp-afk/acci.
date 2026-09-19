import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '6a9aca980006903a5a9d';

  try {
    const res = await fetch(`${endpoint}/health`, {
      headers: {
        'X-Appwrite-Project': projectId,
      },
      cache: 'no-store',
    });

    const data = await res.json().catch(() => ({}));
    const isPaused = res.status === 403 && JSON.stringify(data).includes('project_paused');

    return NextResponse.json({
      status: isPaused ? 'paused' : res.ok ? 'active' : 'warning',
      appwriteStatus: res.status,
      projectId,
      endpoint,
      message: isPaused
        ? 'Appwrite project is paused due to inactivity. Restore it from cloud.appwrite.io.'
        : 'Keepalive ping successful. Appwrite is operational.',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error pinging Appwrite',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
