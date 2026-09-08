import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'accjbp@gmail.com';

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
                  Agrawal Chamber of Commerce &amp; Industries &bull; Secretariat Office, Jabalpur (M.P.)
                </p>
                <p style="margin: 4px 0 0 0; font-size: 10px; color: #94a3b8;">
                  Dedicated Helpline: +91 8319565363 &bull; Email: accjbp@gmail.com
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

// In-memory store for recent simulated notifications (when SMTP is not yet populated)
const recentNotifications: Array<{
  timestamp: string;
  to: string;
  subject: string;
  type: string;
}> = [];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
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

    const recipient = target === 'admin' ? DEFAULT_ADMIN_EMAIL : to;

    if (!recipient) {
      return NextResponse.json(
        { error: 'Missing recipient email address' },
        { status: 400 }
      );
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

    // Check for SMTP configuration in environment
    const smtpHost = process.env.SMTP_HOST || (process.env.GMAIL_USER ? 'smtp.gmail.com' : undefined);
    const smtpPort = Number(process.env.SMTP_PORT) || 465;
    const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;
    const smtpFrom = process.env.SMTP_FROM || `"ACCI Jabalpur" <${smtpUser || 'notifications@acci.org'}>`;

    let delivered = false;
    let deliveryError: string | null = null;

    if (smtpHost && smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        await transporter.sendMail({
          from: smtpFrom,
          to: recipient,
          subject: subject || title,
          html: emailHtml,
        });

        delivered = true;
      } catch (err: unknown) {
        deliveryError = err instanceof Error ? err.message : String(err);
        console.error('SMTP email sending failed:', deliveryError);
      }
    } else {
      // In development or when SMTP is not configured yet, record notification
      recentNotifications.unshift({
        timestamp: new Date().toISOString(),
        to: recipient,
        subject: subject || title,
        type: target,
      });
      if (recentNotifications.length > 50) recentNotifications.pop();

      console.log(`[ACCI NOTIFICATION] Target: ${target} -> ${recipient} | Subject: "${subject || title}"`);
    }

    return NextResponse.json({
      success: true,
      delivered,
      simulated: !delivered,
      deliveryError,
      recipient,
      subject: subject || title,
      timestamp: new Date().toISOString(),
      note: delivered
        ? 'Email dispatched successfully via SMTP.'
        : 'Notification logged. To dispatch live emails via Gmail/SMTP, configure SMTP_USER and SMTP_PASS in .env.local.',
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
  return NextResponse.json({
    status: 'online',
    defaultAdminEmail: DEFAULT_ADMIN_EMAIL,
    smtpConfigured: Boolean(
      (process.env.SMTP_HOST || process.env.GMAIL_USER) &&
      (process.env.SMTP_USER || process.env.GMAIL_USER) &&
      (process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD)
    ),
    recentSimulatedNotifications: recentNotifications.slice(0, 10),
  });
}
