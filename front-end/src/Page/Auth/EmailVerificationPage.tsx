"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BriefcaseBusiness, CheckCircle2, Mail, RefreshCw, ShieldCheck } from "lucide-react";
import { useVerifyEmailMutation, useResendVerificationMutation } from "@/src/redux/features/auth/authApi";
import { useAppDispatch } from "@/src/redux/hooks";
import { setUser } from "@/src/redux/features/auth/authSlice";
import { invalidatePendingRefresh } from "@/src/lib/authSession";
import { apiErrorMessage } from "@/src/lib/apiErrors";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";

export default function EmailVerificationPage() {
  const router = useRouter();
  const params = useSearchParams();
  const dispatch = useAppDispatch();
  const linkEmail = params.get("email") || "";
  const linkCode = params.get("code") || "";
  const [email, setEmail] = useState(linkEmail);
  const [code, setCode] = useState(linkCode);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(params.get("recent") === "1" ? 60 : 0);
  const processedLink = useRef<string | null>(null);
  useEffect(() => {
    if (linkCode) window.history.replaceState(null, "", `/verify-email?email=${encodeURIComponent(linkEmail)}`);
  }, [linkCode, linkEmail]);
  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation();
  const [resendVerification, { isLoading: isResending }] = useResendVerificationMutation();

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown(value => Math.max(0, value - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const verify = useCallback(async (targetEmail: string, targetCode: string) => {
    if (!targetEmail.trim() || !/^\d{6}$/.test(targetCode)) {
      setError("Enter your email and a valid six-digit verification code.");
      return;
    }
    try {
      setError("");
      setFeedback("");
      const result = await verifyEmail({ email: targetEmail.trim(), code: Number(targetCode) }).unwrap();
      if (!result?.data?.accessToken || !result?.data?.user) throw new Error("Unexpected verification response");
      invalidatePendingRefresh();
      dispatch(setUser({ user: result.data.user, token: result.data.accessToken }));
      setFeedback("Email verified successfully. Opening your dashboard…");
      router.replace(result.data.user.role === "recruiter" ? "/recruiter" : "/job-seeker");
    } catch (failure: unknown) {
      setError(apiErrorMessage(failure, "Could not verify this link. Request another code if it expired."));
    }
  }, [verifyEmail, dispatch, router]);

  useEffect(() => {
    if (!linkEmail || !/^\d{6}$/.test(linkCode)) return;
    const key = `${linkEmail}:${linkCode}`;
    if (processedLink.current === key) return;
    processedLink.current = key;
    void verify(linkEmail, linkCode);
  }, [linkEmail, linkCode, verify]);

  const resend = async () => {
    if (!email.trim()) { setError("Enter your email address first."); return; }
    if (cooldown > 0) return;
    try {
      setError("");
      await resendVerification({ email: email.trim() }).unwrap();
      setFeedback("If verification is pending, another link will be emailed shortly. Check spam too.");
      setCooldown(60);
    } catch (failure: unknown) {
      setError(apiErrorMessage(failure, "Unable to request another link."));
    }
  };

  return <main className="flex min-h-screen items-center justify-center bg-[#f6f8fb] px-5 py-12">
    <div className="w-full max-w-[490px]">
      <Link href="/" className="mb-9 inline-flex items-center gap-2 text-xl font-semibold text-[#163b5c]"><BriefcaseBusiness size={24}/> JobHub</Link>
      <div className="jh-panel p-7 sm:p-10">
        <div className="mb-7 flex h-13 w-13 items-center justify-center rounded-xl bg-[#e9f0f6] p-3 text-[#163b5c]"><Mail size={27}/></div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#162839]">Verify your email</h1>
        <p className="mt-2 text-sm leading-6 text-[#66798a]">We&apos;ll send a link with a six-digit code. Links are valid for 10 minutes. If you already have a code, enter it below.</p>
        {feedback && <div role="status" className="mt-5 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900"><CheckCircle2 size={17} className="mt-0.5 shrink-0"/>{feedback}</div>}
        {error && <p role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        <form onSubmit={event => { event.preventDefault(); void verify(email, code); }} className="mt-7 space-y-5">
          <div><label htmlFor="verify-email" className="mb-1.5 block text-sm font-medium text-[#163b5c]">Email address</label>
            <Input id="verify-email" type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} required className="h-11 bg-white" placeholder="you@example.com" /></div>
          <div><label htmlFor="verify-code" className="mb-1.5 block text-sm font-medium text-[#163b5c]">Verification code</label>
            <Input id="verify-code" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={code} onChange={event => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} required className="h-11 bg-white tracking-[.25em]" placeholder="000000" /></div>
          <Button type="submit" disabled={isVerifying} className="h-11 w-full bg-[#163b5c] text-white hover:bg-[#245174]"><ShieldCheck size={17}/>{isVerifying ? "Verifying…" : "Verify email"}</Button>
        </form>
        <div className="mt-6 border-t border-[#e1e8ef] pt-5">
          <p className="text-sm text-[#66798a]">Didn&apos;t get the email? Check your spam folder or request a new link.</p>
          <Button type="button" variant="outline" className="mt-3 h-10 w-full" onClick={() => void resend()} disabled={isResending || cooldown > 0}>
            <RefreshCw size={15}/>{cooldown > 0 ? `Resend available in ${cooldown}s` : isResending ? "Requesting…" : "Resend verification link"}
          </Button>
        </div>
      </div>
      <Link href="/auth" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#516c83] hover:text-[#163b5c]"><ArrowLeft size={16}/> Back to sign in</Link>
    </div>
  </main>;
}
