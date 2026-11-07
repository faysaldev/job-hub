"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2, FileCheck2, Users } from "lucide-react";
import { useLoginMutation, useRegisterMutation } from "@/src/redux/features/auth/authApi";
import { setUser } from "@/src/redux/features/auth/authSlice";
import { useAppDispatch } from "@/src/redux/hooks";
import { useAuth } from "@/src/hooks/useAuth";
import SignInForm from "@/src/components/auth/SignInForm";
import SignUpForm from "@/src/components/auth/SignUpForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { PageLoading } from "@/src/components/feedback/LoadingStates";

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAuth();
  const [signIn] = useLoginMutation();
  const [signUp] = useRegisterMutation();
  useEffect(() => {
    if (isAuthenticated && user) router.replace(user.role === "recruiter" ? "/recruiter" : user.role === "seeker" ? "/job-seeker" : "/");
  }, [isAuthenticated, user, router]);
  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    try {
      const result = await signIn({ email: String(form.get("email") || "").trim(), password: String(form.get("password") || "") }).unwrap();
      if (!result?.data?.accessToken || !result?.data?.user) throw new Error("Unexpected sign-in response");
      dispatch(setUser({ user: result.data.user, token: result.data.accessToken }));
      toast.success("Signed in successfully");
    } catch (error: unknown) {
      toast.error((error as { data?: { message?: string } })?.data?.message || "Unable to sign in. Please check your credentials.");
    } finally { setLoading(false); }
  };
  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("signup-email") || "").trim();
    setLoading(true);
    try {
      const response = await signUp({ name: String(form.get("name") || "").trim(), email, phoneNumber: String(form.get("phone") || ""), password: String(form.get("signup-password") || ""), role: form.get("user-type") === "seeker" ? "seeker" : "recruiter" }).unwrap();
      if (response?.code === 201 || response?.code === 200) {
        toast.success("Account created. Please verify your email.");
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      } else toast.error("Registration could not be completed. Please try again.");
    } catch (error: unknown) {
      toast.error((error as { data?: { message?: string } })?.data?.message || "Unable to create account.");
    } finally { setLoading(false); }
  };
  if (isAuthenticated && user) return <PageLoading heading="Opening your dashboard" cards={1} />;
  return <main id="main-content" className="min-h-screen bg-[#f6f8fb] lg:grid lg:grid-cols-[.85fr_1.15fr]">
    <div className="hidden min-h-screen flex-col justify-between bg-black p-12 text-white border-r border-neutral-800 lg:flex xl:p-16">
      <Link href="/" aria-label="JOB ! HUB home" className="inline-flex items-center gap-2 text-2xl font-black tracking-tighter text-white">
        JOB ! HUB
      </Link>
      <div className="max-w-xl">
        <p className="mb-4 text-xs font-bold uppercase tracking-wider text-neutral-400">
          Find work · Build careers · Hire top talent
        </p>
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white xl:text-5xl">
          The right opportunity starts with a better connection.
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-400">
          A focused platform to explore verified roles, track your applications in real-time, and connect directly with hiring teams.
        </p>
        <div className="mt-8 space-y-4">
          {[
            { icon: FileCheck2, text: "Apply directly and track application progress" },
            { icon: Users, text: "Engage with verified recruiters and hiring managers" },
            { icon: CheckCircle2, text: "Schedule interviews and view transparent salary metrics" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3 text-xs font-medium text-neutral-300">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 border border-neutral-800 text-white shrink-0">
                <Icon size={16} />
              </span>
              {text}
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-neutral-500">© {new Date().getFullYear()} JOB ! HUB · All rights reserved.</p>
    </div>
    <div className="flex min-h-screen flex-col bg-[#f8fafc]">
      <div className="flex items-center justify-between px-6 py-6 md:px-12">
        <Link href="/" aria-label="JOB ! HUB home" className="inline-flex items-center gap-1.5 text-xl font-black tracking-tighter text-black lg:hidden">
          JOB ! HUB
        </Link>
        <Link href="/" className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-black transition-colors">
          <ArrowLeft size={14} /> Back to home
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-center px-4 pb-16 pt-6 sm:px-8">
        <div className="w-full max-w-[480px]">
          <div className="mb-6">
            <p className="jh-kicker mb-2">Account Portal</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111827]">
              Welcome to JOB ! HUB
            </h2>
            <p className="mt-1.5 text-xs text-[#596d7e]">
              Sign in to your account, or create a new profile to get started.
            </p>
          </div>
          <div className="rounded-2xl border border-[#eaecf0] bg-white p-6 sm:p-8 shadow-xs">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="mb-6 grid h-11 w-full grid-cols-2 rounded-xl bg-[#f4f5f7] p-1 border border-neutral-200/60">
                <TabsTrigger
                  value="signin"
                  className="rounded-lg text-xs font-bold uppercase tracking-wider text-neutral-600 data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-xs transition-all"
                >
                  Sign in
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="rounded-lg text-xs font-bold uppercase tracking-wider text-neutral-600 data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-xs transition-all"
                >
                  Create account
                </TabsTrigger>
              </TabsList>
              <TabsContent value="signin">
                <SignInForm loading={loading} handleSignIn={handleSignIn} />
                <div className="mt-3.5 text-right">
                  <Link href="/reset-password" className="text-xs font-semibold text-neutral-600 hover:text-black hover:underline transition-colors">
                    Forgot password?
                  </Link>
                </div>
              </TabsContent>
              <TabsContent value="signup">
                <SignUpForm loading={loading} handleSignUp={handleSignUp} />
              </TabsContent>
            </Tabs>
          </div>
          <p className="mt-5 text-center text-xs leading-relaxed text-[#596d7e]">
            By continuing, you agree to JOB ! HUB&apos;s{" "}
            <Link href="/terms-of-service" className="font-semibold text-black hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="font-semibold text-black hover:underline">
              Privacy Policy
            </Link>.
          </p>
        </div>
      </div>
    </div>
  </main>;
}
