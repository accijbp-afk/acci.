import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const FALLBACK_ADMIN_EMAIL = 'accijbp@gmail.com';

// Generate consistent branded HTML email template for ACCI
function renderEmailTemplate({
  badge,
  badgeColor = '#d97706',
  title,
  subtitle,
  details,
  actionText,
  actionUrl,
  footerNote,
}: {
  badge: string;
  badgeColor?: string;
  title: string;
  subtitle?: string;
  details: { label: string; value: string }[];
  actionText?: string;
  actionUrl?: string;
  footerNote?: string;
}) {
  const detailRows = details
    .map(
      (d) => `
      <tr>
        <td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 12px; font-weight: 600; width: 35%; text-transform: uppercase; letter-spacing: 0.5px;">${d.label}</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-size: 13px; font-weight: 500;">${d.value || '—'}</td>
      </tr>
    `
    )
    .join('');

  const actionButton =
    actionText && actionUrl
      ? `
      <div style="margin-top: 24px; text-align: center;">
        <a href="${actionUrl}" style="display: inline-block; background: #07174a; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 13px; font-weight: 700; letter-spacing: 0.5px; box-shadow: 0 2px 4px rgba(7, 23, 74, 0.2);">
          ${actionText} &rarr;
        </a>
      </div>
    `
      : '';

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #faf8f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #faf8f5; padding: 30px 15px;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
            <!-- Header -->
            <tr>
              <td style="background-color: #07174a; padding: 24px 30px; text-align: left; border-bottom: 4px solid #f59e0b;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td>
                      <div style="font-size: 18px; font-weight: 800; color: #ffffff; letter-spacing: 0.5px; text-transform: uppercase;">
                        ACCI Jabalpur
                      </div>
                      <div style="font-size: 11px; color: #fbbf24; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; margin-top: 2px;">
                        Agrawal Chamber of Commerce &amp; Industries
                      </div>
                    </td>
                    <td align="right">
                      <span style="display: inline-block; background-color: ${badgeColor}; color: #ffffff; padding: 4px 10px; border-radius: 9999px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">
                        ${badge}
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 30px;">
                <h2 style="margin: 0 0 8px 0; color: #07174a; font-size: 20px; font-weight: 700;">
                  ${title}
                </h2>
                ${
                  subtitle
                    ? `<p style="margin: 0 0 20px 0; color: #475569; font-size: 13px; line-height: 1.5;">${subtitle}</p>`
                    : ''
                }

                <!-- Details Table -->
                <div style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; margin-top: 16px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                    ${detailRows}
                  </table>
                </div>

                ${actionButton}

                ${
                  footerNote
                    ? `<p style="margin: 24px 0 0 0; font-size: 11px; color: #94a3b8; line-height: 1.5; border-top: 1px dashed #e2e8f0; padding-top: 16px;">${footerNote}</p>`
                    : ''
                }
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #f1f5f9; padding: 18px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0; font-size: 11px; color: #64748b; font-weight: 500;">
                  Agrawal Chamber of Commerce &amp; Industries &bull; Chamber Office, Jabalpur (M.P.)
                </p>
                <p style="margin: 4px 0 0 0; font-size: 10px; color: #94a3b8;">
                  Dedicated Helpline: +91 8319565363 &bull; Email: accijbp@gmail.com
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

// In-memory record for recent notifications
const recentNotifications: Array<{
  timestamp: string;
  to: string;
  subject: string;
  type: string;
  status: 'delivered' | 'simulated' | 'failed';
  error?: string;
}> = [];

interface SmtpSettings {
  user: string;
  pass: string;
  host: string;
  port: number;
  from: string;
  adminEmail: string;
}

// Fetch database setting via Appwrite REST
async function getDbSetting(key: string): Promise<string | null> {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  const apiKey = process.env.APPWRITE_API_KEY;
  const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'acci_db';

  if (!endpoint || !project || !apiKey) return null;

  try {
    const query = encodeURIComponent(JSON.stringify({ method: 'equal', attribute: 'settingKey', values: [key] }));
    const url = `${endpoint}/databases/${dbId}/collections/chamber_settings/documents?queries[]=${query}&limit=1`;
    const res = await fetch(url, {
      headers: {
        'X-Appwrite-Project': project,
        'X-Appwrite-Key': apiKey,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.documents && data.documents.length > 0) {
      return data.documents[0].settingValue;
    }
  } catch (err) {
    console.warn('Failed to read db setting', key, err);
  }
  return null;
}

// Save database setting via Appwrite REST
async function setDbSetting(key: string, value: string): Promise<boolean> {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  const apiKey = process.env.APPWRITE_API_KEY;
  const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'acci_db';

  if (!endpoint || !project || !apiKey) return false;

  try {
    const query = encodeURIComponent(JSON.stringify({ method: 'equal', attribute: 'settingKey', values: [key] }));
    const listUrl = `${endpoint}/databases/${dbId}/collections/chamber_settings/documents?queries[]=${query}&limit=1`;
    const listRes = await fetch(listUrl, {
      headers: {
        'X-Appwrite-Project': project,
        'X-Appwrite-Key': apiKey,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    const listData = await listRes.json().catch(() => ({ documents: [] }));

    if (listData.documents && listData.documents.length > 0) {
      const docId = listData.documents[0].$id;
      const updateUrl = `${endpoint}/databases/${dbId}/collections/chamber_settings/documents/${docId}`;
      const patchRes = await fetch(updateUrl, {
        method: 'PATCH',
        headers: {
          'X-Appwrite-Project': project,
          'X-Appwrite-Key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            settingValue: value,
            updatedAt: new Date().toISOString(),
          },
        }),
      });
      return patchRes.ok;
    } else {
      const createUrl = `${endpoint}/databases/${dbId}/collections/chamber_settings/documents`;
      const postRes = await fetch(createUrl, {
        method: 'POST',
        headers: {
          'X-Appwrite-Project': project,
          'X-Appwrite-Key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId: 'unique()',
          data: {
            settingKey: key,
            settingValue: value,
            updatedAt: new Date().toISOString(),
          },
          permissions: ['read("any")', 'update("any")', 'delete("any")'],
        }),
      });
      return postRes.ok;
    }
  } catch (err) {
    console.error('Failed to write db setting', key, err);
    return false;
  }
}

// Resolve SMTP configuration (Env vars take priority, followed by Appwrite DB)
async function resolveSmtpConfig(): Promise<SmtpSettings | null> {
  const envUser = process.env.SMTP_USER || process.env.GMAIL_USER;
  const envPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;
  const envAdminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || FALLBACK_ADMIN_EMAIL;

  if (envUser && envPass) {
    const host = process.env.SMTP_HOST || (envUser.includes('@gmail.com') ? 'smtp.gmail.com' : 'smtp.gmail.com');
    const port = Number(process.env.SMTP_PORT) || 465;
    return {
      user: envUser,
      pass: envPass.replace(/\s+/g, ''), // Strip spaces from Gmail 16-character passwords
      host,
      port,
      from: process.env.SMTP_FROM || `"ACCI Jabalpur" <${envUser}>`,
      adminEmail: envAdminEmail,
    };
  }

  // Check Appwrite database for persistent settings
  try {
    const savedConfigRaw = await getDbSetting('smtp_config');
    if (savedConfigRaw) {
      const parsed = JSON.parse(savedConfigRaw);
      if (parsed.user && parsed.pass) {
        return {
          user: parsed.user,
          pass: parsed.pass.replace(/\s+/g, ''),
          host: parsed.host || (parsed.user.includes('@gmail.com') ? 'smtp.gmail.com' : 'smtp.gmail.com'),
          port: Number(parsed.port) || 465,
          from: parsed.from || `"ACCI Jabalpur" <${parsed.user}>`,
          adminEmail: parsed.adminEmail || envAdminEmail,
        };
      }
    }
  } catch (err) {
    console.warn('Error reading saved SMTP configuration:', err);
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    // ACTION 1: Test or Save SMTP configuration from Admin Panel
    if (action === 'save_smtp') {
      const { user, pass, host, port, adminEmail } = body;
      if (!user || !pass) {
        return NextResponse.json({ error: 'Email and App Password are required' }, { status: 400 });
      }

      const cleanPass = String(pass).replace(/\s+/g, '');
      const resolvedHost = host || (user.includes('@gmail.com') ? 'smtp.gmail.com' : 'smtp.gmail.com');
      const resolvedPort = Number(port) || 465;

      // Test connection with nodemailer verify
      try {
        const testTransporter = nodemailer.createTransport({
          host: resolvedHost,
          port: resolvedPort,
          secure: resolvedPort === 465,
          auth: {
            user: user.trim(),
            pass: cleanPass,
          },
        });

        await testTransporter.verify();
      } catch (verifyErr: unknown) {
        const errMsg = verifyErr instanceof Error ? verifyErr.message : String(verifyErr);
        return NextResponse.json({
          error: `Authentication failed: ${errMsg}. Please verify your Gmail address and 16-character App Password.`,
        }, { status: 400 });
      }

      // Save verified credentials to chamber_settings in Appwrite
      const configToSave = {
        user: user.trim(),
        pass: cleanPass,
        host: resolvedHost,
        port: resolvedPort,
        from: `"ACCI Jabalpur" <${user.trim()}>`,
        adminEmail: adminEmail || FALLBACK_ADMIN_EMAIL,
      };

      const saved = await setDbSetting('smtp_config', JSON.stringify(configToSave));
      if (!saved) {
        return NextResponse.json({ error: 'Failed to persist settings in Chamber database' }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: 'SMTP credentials successfully verified and connected! Live emails are now active.',
        user: user.trim(),
      });
    }

    // ACTION 2: Send a dedicated live test email
    if (action === 'test_smtp') {
      const smtpConfig = await resolveSmtpConfig();
      if (!smtpConfig) {
        return NextResponse.json({
          error: 'No email service configured. Please enter your Gmail address and 16-character App Password below.',
        }, { status: 400 });
      }

      const testRecipient = body.to || smtpConfig.adminEmail || FALLBACK_ADMIN_EMAIL;
      const transporter = nodemailer.createTransport({
        host: smtpConfig.host,
        port: smtpConfig.port,
        secure: smtpConfig.port === 465,
        auth: {
          user: smtpConfig.user,
          pass: smtpConfig.pass,
        },
      });

      const testHtml = renderEmailTemplate({
        badge: 'Diagnostic Test',
        badgeColor: '#059669',
        title: 'ACCI Live Email System Connected',
        subtitle: 'Congratulations! Your Agrawal Chamber portal email delivery is fully active and functioning.',
        details: [
          { label: 'Sender Account', value: smtpConfig.user },
          { label: 'Recipient Inbox', value: testRecipient },
          { label: 'Delivery Protocol', value: `SMTP SSL (${smtpConfig.host}:${smtpConfig.port})` },
          { label: 'Dispatch Timestamp', value: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) },
        ],
        actionText: 'Open Admin Panel',
        actionUrl: 'https://accijabalpur.com/admin',
        footerNote: 'All platform events (new accounts, member verifications, reviews, job postings) will now deliver live to this email.',
      });

      await transporter.sendMail({
        from: smtpConfig.from,
        to: testRecipient,
        subject: '[ACCI Jabalpur] Live Email Test Successful',
        html: testHtml,
      });

      recentNotifications.unshift({
        timestamp: new Date().toISOString(),
        to: testRecipient,
        subject: '[ACCI Jabalpur] Live Email Test Successful',
        type: 'test',
        status: 'delivered',
      });

      return NextResponse.json({
        success: true,
        delivered: true,
        recipient: testRecipient,
        message: `✅ Test email successfully sent to ${testRecipient}! Please check your inbox.`,
      });
    }

    // ACTION 3: Standard notification dispatch
    const {
      target = 'admin', // 'admin' | 'member'
      to,
      subject,
      badge = 'ACCI Alert',
      badgeColor = '#d97706',
      title,
      subtitle,
      details = [],
      actionText,
      actionUrl,
      footerNote,
    } = body;

    const smtpConfig = await resolveSmtpConfig();
    const adminEmail = smtpConfig?.adminEmail || process.env.ADMIN_NOTIFICATION_EMAIL || FALLBACK_ADMIN_EMAIL;
    const recipient = target === 'admin' ? adminEmail : to;

    if (!recipient) {
      return NextResponse.json({ error: 'Missing recipient email address' }, { status: 400 });
    }

    const emailHtml = renderEmailTemplate({
      badge,
      badgeColor,
      title: title || subject,
      subtitle,
      details,
      actionText,
      actionUrl,
      footerNote,
    });

    let delivered = false;
    let deliveryError: string | null = null;

    if (smtpConfig) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpConfig.host,
          port: smtpConfig.port,
          secure: smtpConfig.port === 465,
          auth: {
            user: smtpConfig.user,
            pass: smtpConfig.pass,
          },
        });

        await transporter.sendMail({
          from: smtpConfig.from,
          to: recipient,
          subject: subject || title,
          html: emailHtml,
        });

        delivered = true;
      } catch (err: unknown) {
        deliveryError = err instanceof Error ? err.message : String(err);
        console.error('SMTP email dispatch error:', deliveryError);
      }
    }

    recentNotifications.unshift({
      timestamp: new Date().toISOString(),
      to: recipient,
      subject: subject || title,
      type: target,
      status: delivered ? 'delivered' : deliveryError ? 'failed' : 'simulated',
      error: deliveryError || undefined,
    });
    if (recentNotifications.length > 50) recentNotifications.pop();

    return NextResponse.json({
      success: true,
      delivered,
      simulated: !delivered && !deliveryError,
      deliveryError,
      recipient,
      subject: subject || title,
      timestamp: new Date().toISOString(),
      note: delivered
        ? `Email dispatched successfully to ${recipient}.`
        : deliveryError
        ? `Delivery failed: ${deliveryError}`
        : 'Logged in simulation mode. Configure Gmail App Password in Admin -> Email & Notifications to send live.',
    });
  } catch (error: unknown) {
    console.error('Error in /api/notify:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const smtpConfig = await resolveSmtpConfig();
  const adminEmail = smtpConfig?.adminEmail || process.env.ADMIN_NOTIFICATION_EMAIL || FALLBACK_ADMIN_EMAIL;

  return NextResponse.json({
    status: 'online',
    defaultAdminEmail: adminEmail,
    smtpConfigured: Boolean(smtpConfig?.user && smtpConfig?.pass),
    configuredUser: smtpConfig?.user ? smtpConfig.user.replace(/(.{3})(.*)(@.*)/, '$1***$3') : null,
    recentNotifications: recentNotifications.slice(0, 15),
  });
}
