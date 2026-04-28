import { Suspense } from 'react';
import EmailVerificationPage from '@/src/Page/Auth/EmailVerificationPage';

function EmailVerificationFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E3E3E3]">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#234C6A] to-[#456882] flex items-center justify-center mx-auto mb-4 animate-pulse">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-[#456882]">Loading...</p>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<EmailVerificationFallback />}>
      <EmailVerificationPage />
    </Suspense>
  );
}
