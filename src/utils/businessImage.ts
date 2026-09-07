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

  if (biz.workPhotos && biz.workPhotos.length > 0 && biz.workPhotos[0]?.trim()) {
    return biz.workPhotos[0].trim();
  }

  if (biz.industry) {
    const matched = SEED_INDUSTRIES.find(
      (ind) => ind.name.toLowerCase().trim() === biz.industry?.toLowerCase().trim()
    );
    if (matched?.imageUrl) {
      return matched.imageUrl;
    }
  }

  return '/images/acci_logo.jpg';
}

/**
 * Returns the fallback image URL for a specific industry name.
 */
export function getIndustryFallbackImage(industryName?: string): string {
  if (!industryName) return '/images/acci_logo.jpg';
  const matched = SEED_INDUSTRIES.find(
    (ind) => ind.name.toLowerCase().trim() === industryName.toLowerCase().trim()
  );
  return matched?.imageUrl || '/images/acci_logo.jpg';
}
