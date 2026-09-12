/**
 * ACCI Chamber Notifications & Email Service
 * Dispatches notifications to:
 * - Admin (accijbp@gmail.com) for all platform events
 * - Members (their registered email) for verification, featured status, reviews, edits
 */

export interface NotificationDetail {
  label: string;
  value: string;
}

export interface SendNotificationParams {
  target: 'admin' | 'member';
  to?: string; // required if target === 'member'
  subject: string;
  badge?: string;
  badgeColor?: string;
  title?: string;
  subtitle?: string;
  details: NotificationDetail[];
  actionText?: string;
  actionUrl?: string;
  footerNote?: string;
}

export const notificationService = {
  /**
   * Send notification to Admin (accijbp@gmail.com)
   */
  async notifyAdmin(params: {
    event:
      | 'USER_REGISTERED'
      | 'MEMBERSHIP_APPLICATION'
      | 'JOB_POSTED'
      | 'INQUIRY_SUBMITTED'
      | 'REVIEW_SUBMITTED'
      | 'MEMBER_STATUS_CHANGED'
      | 'MEMBER_PROFILE_EDITED';
    title: string;
    subtitle?: string;
    details: NotificationDetail[];
    actionUrl?: string;
  }): Promise<boolean> {
    try {
      const response = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: 'admin',
          badge: 'Admin Alert',
          badgeColor: '#07174a',
          subject: `[ACCI Admin Alert] ${params.title}`,
          title: params.title,
          subtitle: params.subtitle,
          details: [
            ...params.details,
            { label: 'Event Type', value: params.event },
            { label: 'Date & Time', value: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) },
          ],
          actionText: 'Open Admin Dashboard',
          actionUrl: params.actionUrl || '/admin',
          footerNote: 'This is an automated chamber alert delivered to admin inbox (accijbp@gmail.com).',
        }),
      });

      return response.ok;
    } catch (err) {
      console.warn('Failed to dispatch admin notification:', err);
      return false;
    }
  },

  /**
   * Send notification to Member's registered email
   */
  async notifyMember(
    memberEmail: string,
    params: {
      event:
        | 'WELCOME_ACCOUNT'
        | 'APPLICATION_RECEIVED'
        | 'ACCOUNT_VERIFIED'
        | 'ACCOUNT_REJECTED'
        | 'PROFILE_FEATURED'
        | 'PROFILE_UPDATED'
        | 'NEW_REVIEW_RECEIVED'
        | 'JOB_POSTED_CONFIRMATION'
        | 'INQUIRY_ACKNOWLEDGED';
      title: string;
      subtitle?: string;
      details: NotificationDetail[];
      actionText?: string;
      actionUrl?: string;
    }
  ): Promise<boolean> {
    if (!memberEmail || !memberEmail.includes('@')) {
      console.warn('Cannot send notification: Invalid member email', memberEmail);
      return false;
    }

    try {
      const badgeColors: Record<string, string> = {
        ACCOUNT_VERIFIED: '#059669', // Emerald
        PROFILE_FEATURED: '#d97706', // Amber gold
        ACCOUNT_REJECTED: '#dc2626', // Red
        WELCOME_ACCOUNT: '#1540a8', // Navy
        APPLICATION_RECEIVED: '#1540a8',
        NEW_REVIEW_RECEIVED: '#7c3aed', // Purple
      };

      const response = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: 'member',
          to: memberEmail,
          badge: params.event.replace(/_/g, ' '),
          badgeColor: badgeColors[params.event] || '#1540a8',
          subject: `[ACCI Jabalpur] ${params.title}`,
          title: params.title,
          subtitle: params.subtitle,
          details: params.details,
          actionText: params.actionText || 'Visit Chamber Portal',
          actionUrl: params.actionUrl || '/dashboard',
          footerNote:
            'You are receiving this communication as a registered member or participant of Agrawal Chamber of Commerce & Industries (ACCI) Jabalpur.',
        }),
      });

      return response.ok;
    } catch (err) {
      console.warn(`Failed to dispatch notification to member ${memberEmail}:`, err);
      return false;
    }
  },
};
