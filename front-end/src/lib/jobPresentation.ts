/** Pure, shared display helpers. Never render an invalid or $0-$0 compensation band. */
export const hasValidSalary = (min?: number | null, max?: number | null): boolean => {
  const lower = Number(min);
  const upper = Number(max);
  if (!Number.isFinite(lower) || !Number.isFinite(upper) || lower < 0 || upper < 0) return false;
  return (lower > 0 || upper > 0) && (lower === 0 || upper === 0 || upper >= lower);
};

const periodSuffix: Record<string, string> = {
  hourly: '/hr', daily: '/day', weekly: '/wk', monthly: '/mo', yearly: '/yr',
};

const money = (amount: number, compact: boolean) => {
  if (compact && amount >= 1000) {
    const kilo = amount / 1000;
    return `$${Number(kilo.toFixed(1)).toLocaleString('en-US')}k`;
  }
  return `$${amount.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
};

export function formatJobSalary(
  min?: number | null, max?: number | null, period?: string | null, compact = false,
): string {
  if (!hasValidSalary(min, max)) return 'Salary not specified';
  const lower = Number(min);
  const upper = Number(max);
  const suffix = period ? periodSuffix[period] || '' : '';
  if (!lower) return `Up to ${money(upper, compact)}${suffix}`;
  if (!upper) return `From ${money(lower, compact)}${suffix}`;
  return `${money(lower, compact)} – ${money(upper, compact)}${suffix}`;
}

export interface RelatedJobCandidate {
  _id?: string;
  id?: string | number;
  title: string;
  category?: string;
  subcategory?: string;
  locationType?: string;
  skills?: string[];
  createdAt?: string;
}

/** Rank public results locally; uses the existing paginated GET /job API, with no additional route. */
export function relatedJobs<T extends RelatedJobCandidate>(
  current: RelatedJobCandidate, candidates: T[], limit = 3,
): T[] {
  const normalized = (value?: string) => (value || '').trim().toLowerCase();
  const targetSkills = new Set((current.skills || []).map(normalized).filter(Boolean));
  const currentId = String(current._id || current.id || '');
  const score = (candidate: T) => {
    let relevance = 0;
    if (normalized(current.subcategory) && normalized(candidate.subcategory) === normalized(current.subcategory)) relevance += 8;
    if (normalized(current.category) && normalized(candidate.category) === normalized(current.category)) relevance += 5;
    if (normalized(current.locationType) && normalized(candidate.locationType) === normalized(current.locationType)) relevance += 2;
    relevance += (candidate.skills || []).filter(skill => targetSkills.has(normalized(skill))).length * 2;
    return relevance;
  };
  return candidates
    .filter(candidate => !!(candidate._id || candidate.id) && String(candidate._id || candidate.id) !== currentId)
    .sort((a, b) => score(b) - score(a) || new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, Math.max(0, limit));
}
