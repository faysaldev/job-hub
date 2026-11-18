"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAppDispatch } from "@/src/redux/hooks";
import { logout } from "@/src/redux/features/auth/authSlice";
import { baseApi } from "@/src/redux/baseApi/baseApi";
import { invalidatePendingRefresh } from "@/src/lib/authSession";
import Link from "next/link";
import { ArrowLeft, BriefcaseBusiness, LockKeyhole, Mail, RefreshCw } from "lucide-react";
import { useForgotPasswordMutation, useResetPasswordMutation } from "@/src/redux/features/auth/authApi";
import { apiErrorMessage } from "@/src/lib/apiErrors";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";

export default function ForgotPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initialEmail = params.get("email") || "";
  const initialCode = params.get("code") || "";
  useEffect(() => {
    if (initialCode) window.history.replaceState(null, "", `/reset-password?email=${encodeURIComponent(initialEmail)}`);
  }, [initialCode, initialEmail]);
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState(initialCode);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [step, setStep] = useState<"request" | "reset">(initialEmail && initialCode ? "reset" : "request");
  const [cooldown, setCooldown] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [forgotPassword, { isLoading: requesting }] = useForgotPasswordMutation();
  const [resetPassword, { isLoading: resetting }] = useResetPasswordMutation();

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown(value => Math.max(0, value - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const requestReset = async () => {
    if (!email.trim()) { setError("Enter your email address."); return; }
    try {
      setError("");
      await forgotPassword({ email: email.trim() }).unwrap();
      setMessage("If this account can be recovered, a reset link will arrive shortly. Check your inbox and spam folder.");
      setStep("reset");
      setCooldown(60);
    } catch (failure: unknown) {
      setError(apiErrorMessage(failure, "Unable to request password recovery right now."));
    }
  };

  const submitReset = async () => {
    if (!/^\d{6}$/.test(code)) { setError("Enter the six-digit code from your email."); return; }
    if (password.length < 8 || password.length > 128 || !/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
      setError("Use 8–128 characters, including at least one letter and one number."); return;
    }
    if (password !== confirm) { setError("The new passwords do not match."); return; }
    try {
      setError("");
      await resetPassword({ email: email.trim(), code, newPassword: password }).unwrap();
      invalidatePendingRefresh();
      dispatch(logout());
      dispatch(baseApi.util.resetApiState());
      toast.success("Password reset. Sign in using your new password.");
      router.replace("/auth");
    } catch (failure: unknown) {
      setError(apiErrorMessage(failure, "Unable to reset password. The code may be expired or already used."));
    }
  };

  return <main className="flex min-h-screen items-center justify-center bg-[#f6f8fb] px-5 py-12">
    <div className="w-full max-w-[490px]">
      <Link href="/" className="mb-9 inline-flex items-center gap-2 text-xl font-semibold text-[#163b5c]"><BriefcaseBusiness size={24}/> JobHub</Link>
      <div className="jh-panel p-7 sm:p-10">
        <div className="mb-7 flex h-13 w-13 items-center justify-center rounded-xl bg-[#e9f0f6] p-3 text-[#163b5c]">{step === "request" ? <Mail size={27}/> : <LockKeyhole size={27}/>}</div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#162839]">{step === "request" ? "Reset your password" : "Choose a new password"}</h1>
        <p className="mt-2 text-sm leading-6 text-[#66798a]">{step === "request" ? "Enter your account email. If eligible, we will send a one-time reset link." : "Use the six-digit code sent to your email. It expires after 10 minutes."}</p>
        {message && <p role="status" className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-[#163b5c]">{message}</p>}
        {error && <p role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        <form onSubmit={event => { event.preventDefault(); void (step === "request" ? requestReset() : submitReset()); }} className="mt-7 space-y-5">
          <div><label htmlFor="reset-email" className="mb-1.5 block text-sm font-medium text-[#163b5c]">Email address</label>
            <Input id="reset-email" type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} required className="h-11 bg-white" placeholder="you@example.com" /></div>
          {step === "reset" && <>
            <div><label htmlFor="reset-code" className="mb-1.5 block text-sm font-medium text-[#163b5c]">Reset code</label>
              <Input id="reset-code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={code} onChange={event => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} required className="h-11 bg-white tracking-[.25em]" placeholder="000000" /></div>
            <div><label htmlFor="new-password" className="mb-1.5 block text-sm font-medium text-[#163b5c]">New password</label>
              <Input id="new-password" type="password" autoComplete="new-password" minLength={8} maxLength={128} value={password} onChange={event => setPassword(event.target.value)} required className="h-11 bg-white" />
              <p className="mt-1 text-xs text-[#66798a]">8–128 characters with at least one letter and one number.</p></div>
            <div><label htmlFor="confirm-password" className="mb-1.5 block text-sm font-medium text-[#163b5c]">Confirm password</label>
              <Input id="confirm-password" type="password" autoComplete="new-password" minLength={8} maxLength={128} value={confirm} onChange={event => setConfirm(event.target.value)} required className="h-11 bg-white" /></div>
          </>}
          <Button type="submit" className="h-11 w-full bg-[#163b5c] text-white hover:bg-[#245174]" disabled={requesting || resetting}>
            {step === "request" ? (requesting ? "Requesting…" : "Send recovery link") : resetting ? "Updating password…" : "Reset password"}
          </Button>
        </form>
        {step === "reset" && <div className="mt-5 border-t border-[#e1e8ef] pt-5">
          <Button variant="outline" className="h-10 w-full" type="button" disabled={requesting || cooldown > 0} onClick={() => void requestReset()}>
            <RefreshCw size={15}/>{cooldown > 0 ? `Resend available in ${cooldown}s` : "Send another code"}
          </Button>
        </div>}
      </div>
      <Link href="/auth" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#516c83] hover:text-[#163b5c]"><ArrowLeft size={16}/> Back to sign in</Link>
    </div>
  </main>;
}
