import { SEED_INDUSTRIES } from '@/services/seedData';
import { MemberBusiness } from '@/types';

/**
 * Returns the display banner image for an enterprise.
 * 1. Custom banner uploaded by the member in the member panel (biz.bannerUrl)
 * 2. First work photo if uploaded (biz.workPhotos[0])
 * 3. Deterministic fallback image mapped to the selected industry type
 * 4. Official emblem fallback
 */
export function getBusinessBanner(biz: Partial<MemberBusiness> | null | undefined): string {
  if (!biz) return '/images/acci_logo.jpg';

  if (biz.bannerUrl && biz.bannerUrl.trim()) {
    return biz.bannerUrl.trim();
  }

  // Check cached custom banner in localStorage (instant offline and upload resilience)
  if (typeof window !== 'undefined') {
    const key = biz.id || biz.$id;
    if (key) {
      const cached = localStorage.getItem(`acci_banner_${key}`);
      if (cached && cached.trim()) {
        return cached.trim();
      }
    }
    if (biz.businessName) {
      const nameKey = `acci_banner_name_${encodeURIComponent(biz.businessName.trim().toLowerCase())}`;
      const nameCached = localStorage.getItem(nameKey);
      if (nameCached && nameCached.trim()) {
        return nameCached.trim();
      }
    }
  }

  if (biz.workPhotos && biz.workPhotos.length > 0 && biz.workPhotos[0]?.trim()) {
    return biz.workPhotos[0].trim();
  }

  if (biz.industry) {
    const raw = biz.industry.toLowerCase().trim();
    // Special match for Chartered Accountants & Audit
    if (raw.includes('chartered') || raw.includes('audit') || raw === 'ca' || raw.includes('accountant') || raw.includes('taxation')) {
      const caInd = SEED_INDUSTRIES.find((ind) => ind.id === 'ind-8');
      if (caInd?.imageUrl) return caInd.imageUrl;
    }

    // Exact match
    const matched = SEED_INDUSTRIES.find(
      (ind) => ind.name.toLowerCase().trim() === raw
    );
    if (matched?.imageUrl) {
      return matched.imageUrl;
    }

    // Partial match
    const partial = SEED_INDUSTRIES.find(
      (ind) => ind.name.toLowerCase().includes(raw) || raw.includes(ind.name.toLowerCase())
    );
    if (partial?.imageUrl) {
      return partial.imageUrl;
    }
  }

  return '/images/acci_logo.jpg';
}

/**
 * Returns the fallback image URL for a specific industry name.
 */
export function getIndustryFallbackImage(industryName?: string): string {
  if (!industryName) return '/images/acci_logo.jpg';
  const raw = industryName.toLowerCase().trim();
  if (raw.includes('chartered') || raw.includes('audit') || raw === 'ca' || raw.includes('accountant') || raw.includes('taxation')) {
    const caInd = SEED_INDUSTRIES.find((ind) => ind.id === 'ind-8');
    if (caInd?.imageUrl) return caInd.imageUrl;
  }
  const matched = SEED_INDUSTRIES.find(
    (ind) => ind.name.toLowerCase().trim() === raw
  );
  if (matched?.imageUrl) return matched.imageUrl;

  const partial = SEED_INDUSTRIES.find(
    (ind) => ind.name.toLowerCase().includes(raw) || raw.includes(ind.name.toLowerCase())
  );
  return partial?.imageUrl || '/images/acci_logo.jpg';
}
