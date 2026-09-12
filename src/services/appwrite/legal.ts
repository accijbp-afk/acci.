import { LegalDocument } from '@/types';
import { databases, APPWRITE_CONFIG, isAppwriteConfigured } from './client';

const DEFAULT_TERMS: LegalDocument = {
  id: 'terms',
  title: 'Terms & Conditions of Chamber Affiliation',
  categoryBadge: 'Legal Governance & Bylaws',
  lastUpdated: 'September 2026',
  content: `## 1. Institutional Preamble
The Agrawal Chamber of Commerce & Industries (ACCI), Jabalpur is an apex trade and commercial organization operating under the highest standards of mercantile ethics and community welfare. By applying for membership, registering an enterprise, posting vacancies, or utilizing this portal, you agree to comply with the Chamber bylaws and governing guidelines.

## 2. Membership Eligibility & Verification
All enterprises listed in the directory must belong to members of the Agrawal community or their legally recognized partnerships and corporate entities. The ACCI team reserves the right to request physical or documentary verification of business credentials, GST registrations, or trade licenses before according verified status.

## 3. Directory Accuracy & Code of Conduct
Members must provide genuine, non-misleading details regarding their goods, services, and commercial terms. Spurious trade listings, fraudulent claims, or conduct detrimental to the community reputation will result in immediate delisting and revocation of Chamber privileges upon council resolution.

## 4. Commercial Mediation & Arbitration
ACCI offers conciliation and voluntary commercial dispute resolution between member enterprises through its Senior Advisory Panel. Decisions reached through formal Chamber conciliation are considered morally binding upon members honoring community traditions.

## 5. Contact & Legal Notices
For official legal notices or Chamber constitution queries, please write to: accijbp@gmail.com or visit the Chamber Office at Civic Centre, Jabalpur.`,
};

const DEFAULT_PRIVACY: LegalDocument = {
  id: 'privacy',
  title: 'Privacy Policy & Data Standards',
  categoryBadge: 'Information Protection',
  lastUpdated: 'September 2026',
  content: `## 1. Data Protection Commitment
The Agrawal Chamber of Commerce & Industries (ACCI), Jabalpur is committed to safeguarding the privacy and commercial confidentiality of its members, delegates, and website visitors. We collect only information strictly necessary for commercial networking, directory listings, and administrative communication.

## 2. Information We Collect
When you list an enterprise or create a member account, we collect:
- Enterprise trade name, founder name, and business address.
- Contact telephone, WhatsApp number, and commercial email.
- Industry classification, GST details, and service/product catalogues.
- Delegate pass details for Chamber conclaves and symposiums.

## 3. Purpose of Processing
Your data is utilized exclusively to display public commercial directory cards, enable direct buyer inquiries via phone or WhatsApp, issue official event badges, and dispatch important Chamber updates or taxation notices. We do not sell or monetize member data to third-party marketing brokers.

## 4. Secure Cloud Infrastructure & Governance
Authentication and database operations are managed via secure cloud database services with strict role-based access control and encrypted session management.

## 5. Inquiries & Data Rights
To request rectification or removal of your business directory listing, contact our team at accijbp@gmail.com.`,
};

const STORAGE_KEY_PREFIX = 'acci_legal_doc_';

const getLocalStorage = (type: 'terms' | 'privacy'): LegalDocument | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${type}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn(`Error reading ${type} from localStorage`, e);
  }
  return null;
};

const setLocalStorage = (type: 'terms' | 'privacy', doc: LegalDocument): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${type}`, JSON.stringify(doc));
  } catch (e) {
    console.warn(`Error writing ${type} to localStorage`, e);
  }
};

export const legalService = {
  getDefaults(type: 'terms' | 'privacy'): LegalDocument {
    return type === 'terms' ? { ...DEFAULT_TERMS } : { ...DEFAULT_PRIVACY };
  },

  async getLegalContent(type: 'terms' | 'privacy'): Promise<LegalDocument> {
    // 1. Check local storage first for quick response & offline/demo mode
    const local = getLocalStorage(type);
    if (local) {
      return local;
    }

    // 2. If Appwrite configured, attempt database fetch if a legal collection exists
    if (isAppwriteConfigured()) {
      try {
        const res = await databases.getDocument(
          APPWRITE_CONFIG.databaseId,
          'legal_policies',
          type
        );
        if (res) {
          const doc: LegalDocument = {
            id: type,
            title: res.title || (type === 'terms' ? DEFAULT_TERMS.title : DEFAULT_PRIVACY.title),
            categoryBadge: res.categoryBadge || (type === 'terms' ? DEFAULT_TERMS.categoryBadge : DEFAULT_PRIVACY.categoryBadge),
            lastUpdated: res.lastUpdated || 'September 2026',
            content: res.content || (type === 'terms' ? DEFAULT_TERMS.content : DEFAULT_PRIVACY.content),
          };
          setLocalStorage(type, doc);
          return doc;
        }
      } catch {
        // Appwrite collection might not be created yet, fallback to default
      }
    }

    // 3. Fallback to default
    const fallback = this.getDefaults(type);
    setLocalStorage(type, fallback);
    return fallback;
  },

  async updateLegalContent(type: 'terms' | 'privacy', data: Partial<LegalDocument>): Promise<LegalDocument> {
    const existing = await this.getLegalContent(type);
    const updated: LegalDocument = {
      ...existing,
      ...data,
      id: type,
      lastUpdated: data.lastUpdated || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    };

    setLocalStorage(type, updated);

    if (isAppwriteConfigured()) {
      try {
        await databases.updateDocument(
          APPWRITE_CONFIG.databaseId,
          'legal_policies',
          type,
          {
            title: updated.title,
            categoryBadge: updated.categoryBadge,
            lastUpdated: updated.lastUpdated,
            content: updated.content,
          }
        );
      } catch {
        try {
          await databases.createDocument(
            APPWRITE_CONFIG.databaseId,
            'legal_policies',
            type,
            {
              title: updated.title,
              categoryBadge: updated.categoryBadge,
              lastUpdated: updated.lastUpdated,
              content: updated.content,
            }
          );
        } catch {
          // Local storage updated successfully
        }
      }
    }

    return updated;
  },

  async resetLegalContent(type: 'terms' | 'privacy'): Promise<LegalDocument> {
    const defaults = this.getDefaults(type);
    return this.updateLegalContent(type, defaults);
  },
};
