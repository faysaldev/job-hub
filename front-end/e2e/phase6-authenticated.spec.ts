import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Staging fixtures ONLY. Use dedicated test accounts, not real customer profiles.
 * Tests are read-only unless a separate opt-in workflow is approved.
 * Skips do not certify the QA IDs; the release evidence gate treats them as open.
 */
const seeker = { email: process.env.PHASE6_E2E_SEEKER_EMAIL, password: process.env.PHASE6_E2E_SEEKER_PASSWORD };
const recruiter = { email: process.env.PHASE6_E2E_RECRUITER_EMAIL, password: process.env.PHASE6_E2E_RECRUITER_PASSWORD };
const currentJobId = process.env.PHASE6_E2E_PUBLIC_JOB_ID;
const savedJobId = process.env.PHASE6_E2E_SAVED_JOB_ID;
const appliedJobId = process.env.PHASE6_E2E_APPLIED_JOB_ID;

async function signIn(page: Page, credentials: { email?: string; password?: string }, role: 'seeker' | 'recruiter') {
  await page.goto('/auth');
  await expect(page.getByLabel('Email Address')).toBeVisible();
  await page.getByLabel('Email Address').fill(credentials.email!);
  await page.getByLabel('Password', { exact: true }).fill(credentials.password!);
  await page.getByRole('button', { name: /^Sign In$/i }).click();
  await expect(page).toHaveURL(role === 'seeker' ? /\/job-seeker(?:\/|$)/ : /\/recruiter(?:\/|$)/, { timeout: 20_000 });
}

const noSeeker = !seeker.email || !seeker.password;
const noRecruiter = !recruiter.email || !recruiter.password;

test.describe('Staging seeker journeys (existing isolated account)', () => {
  test.skip(noSeeker, 'Configure PHASE6_E2E_SEEKER_EMAIL/PASSWORD in secure staging CI secrets');
  test('login survives refresh and direct private route (S-11)', async ({ page }) => {
    await signIn(page, seeker, 'seeker');
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page).not.toHaveURL(/\/auth(?:\?|$)/);
    await page.goto('/job-seeker/settings');
    await expect(page).toHaveURL(/\/job-seeker\/settings/);
    await expect(page.locator('body')).toContainText(/settings|account|password/i);
  });
  test('saved job state is persisted across reload (S-08)', async ({ page }) => {
    test.skip(!savedJobId, 'Set PHASE6_E2E_SAVED_JOB_ID to a job already saved by the staging seeker');
    await signIn(page, seeker, 'seeker');
    await page.goto(`/job/${savedJobId}`);
    await expect(page.getByRole('button', { name: /Remove from saved jobs/i })).toBeVisible();
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('button', { name: /Remove from saved jobs/i })).toBeVisible();
  });
  test('application already exists; cannot apply twice (S-06)', async ({ page }) => {
    test.skip(!appliedJobId, 'Set PHASE6_E2E_APPLIED_JOB_ID to a job previously applied to by the staging seeker');
    await signIn(page, seeker, 'seeker');
    await page.goto(`/job/${appliedJobId}`);
    const action = page.getByRole('button', { name: /Already applied to this job/i });
    await expect(action).toBeVisible();
    await expect(action).toBeDisabled();
  });
  test('seeker settings and interviews have responsive and accessible controls (S-09, S-10)', async ({ page }) => {
    await signIn(page, seeker, 'seeker');
    await page.goto('/job-seeker/settings');
    await expect(page.locator('main, [role="main"]').first()).toBeVisible();
    const a11y = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
    expect(a11y.violations.filter(item => ['serious','critical'].includes(item.impact || ''))).toEqual([]);
    await page.goto('/job-seeker/interviews');
    await expect(page.locator('body')).not.toBeEmpty();
    await expect(page).not.toHaveURL(/\/auth(?:\?|$)/);
  });
});

test.describe('Staging recruiter journeys (existing isolated company)', () => {
  test.skip(noRecruiter, 'Configure PHASE6_E2E_RECRUITER_EMAIL/PASSWORD in secure staging CI secrets');
  test('login, direct URL, recruiter settings (R-12, R-13)', async ({ page }) => {
    await signIn(page, recruiter, 'recruiter');
    await page.reload();
    await expect(page).not.toHaveURL(/\/auth(?:\?|$)/);
    await page.goto('/recruiter/settings');
    await expect(page).toHaveURL(/\/recruiter\/settings/);
    await expect(page.locator('body')).toContainText(/settings|account|password/i);
  });
  test('job quota, real listings and ATS surfaces are reachable (R-01, R-03, R-08)', async ({ page }) => {
    await signIn(page, recruiter, 'recruiter');
    await page.goto('/recruiter/jobs');
    await expect(page.getByRole('heading', { name: /job postings/i })).toBeVisible();
    await expect(page.getByText(/reserved plan slots/i)).toBeVisible();
    await page.goto('/recruiter/applicants');
    await expect(page.locator('body')).toContainText(/applications|applicants/i);
  });
  test('legacy deep link goes to applicants (R-11)', async ({ page }) => {
    await signIn(page, recruiter, 'recruiter');
    await page.goto('/recruiter/applications');
    await expect(page).toHaveURL(/\/recruiter\/applicants(?:\/|$)/);
  });
  test('team and billing can be reached (F-04, F-05)', async ({ page }) => {
    await signIn(page, recruiter, 'recruiter');
    await page.goto('/recruiter/team');
    await expect(page.locator('body')).toContainText(/team|member|invite/i);
    await page.goto('/recruiter/billing');
    await expect(page.locator('body')).toContainText(/plan|billing|subscription/i);
  });
});

test('candidate listings have exactly one site header and footer (R-17)', async ({ page }) => {
  await page.goto('/candidates', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('header.jh-site-header')).toHaveCount(1);
  await expect(page.locator('footer.jh-footer')).toHaveCount(1);
  await expect(page.getByRole('heading', { level: 1, name: /qualified candidates/i })).toBeVisible();
});

test('similar jobs display actual public roles and no $0-$0 salary (S-06, S-12)', async ({ page }) => {
  test.skip(!currentJobId, 'Set PHASE6_E2E_PUBLIC_JOB_ID to a real public job fixture');
  await page.goto(`/job/${currentJobId}`, { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: /similar opportunities/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /browse all jobs/i })).toBeVisible();
  await expect(page.locator('body')).not.toContainText(/\$0\s*[–-]\s*\$0/i);
});
