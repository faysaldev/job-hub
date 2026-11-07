"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, BriefcaseBusiness, CheckCircle2, FileCheck2, Users } from "lucide-react";
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
    <div className="hidden min-h-screen flex-col justify-between bg-[#163b5c] p-12 text-white lg:flex xl:p-16">
      <Link href="/" className="inline-flex items-center gap-3 text-2xl font-semibold tracking-tight"><span className="grid h-11 w-11 place-items-center rounded-xl bg-white/15"><BriefcaseBusiness size={23}/></span>JobHub</Link>
      <div className="max-w-xl"><p className="mb-5 text-xs font-semibold uppercase tracking-[.16em] text-[#bdd2e2]">Find work · Hire well</p><h1 className="text-5xl font-semibold leading-[1.12] tracking-tight xl:text-6xl">Make room for your next opportunity.</h1><p className="mt-6 max-w-md text-base leading-8 text-[#c9dbe7]">A focused place to discover roles, keep applications moving and manage recruitment.</p>
        <div className="mt-10 space-y-5">{[
          { icon: FileCheck2, text: "Apply for jobs and track progress" },
          { icon: Users, text: "Manage applicant conversations" },
          { icon: CheckCircle2, text: "Keep interviews and hiring activity together" },
        ].map(({icon:Icon,text})=><div key={text} className="flex items-center gap-3 text-sm text-[#e2eaf1]"><Icon size={21} className="text-[#bdd2e2]"/>{text}</div>)}</div>
      </div><p className="text-xs text-[#bdd2e2]">© {new Date().getFullYear()} JobHub</p>
    </div>
    <div className="flex min-h-screen flex-col">
      <div className="flex items-center justify-between px-6 py-6 md:px-12"><Link href="/" className="jh-logo lg:hidden"><span className="jh-logo-mark"><BriefcaseBusiness size={18}/></span>JobHub</Link><Link href="/" className="ml-auto inline-flex items-center gap-2 text-sm font-medium text-[#516c83] hover:text-[#163b5c]"><ArrowLeft size={16}/> Back to home</Link></div>
      <div className="flex flex-1 items-center justify-center px-5 pb-16 pt-8 sm:px-10"><div className="w-full max-w-[500px]"><div className="mb-8"><p className="jh-kicker mb-3">Your account</p><h2 className="text-3xl font-semibold tracking-tight text-[#162839]">Welcome to JobHub</h2><p className="mt-2 text-sm text-[#66798a]">Sign in to continue, or create an account to get started.</p></div>
        <div className="jh-panel p-5 sm:p-8"><Tabs defaultValue="signin" className="w-full"><TabsList className="mb-7 grid h-11 w-full grid-cols-2 rounded-lg bg-[#edf3f8] p-1"><TabsTrigger value="signin" className="rounded-md text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-[#163b5c] data-[state=active]:shadow-sm">Sign in</TabsTrigger><TabsTrigger value="signup" className="rounded-md text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-[#163b5c] data-[state=active]:shadow-sm">Create account</TabsTrigger></TabsList>
          <TabsContent value="signin"><SignInForm loading={loading} handleSignIn={handleSignIn}/><div className="mt-4 text-right"><Link href="/reset-password" className="text-sm font-semibold text-[#163b5c] hover:underline">Forgot password?</Link></div></TabsContent>
          <TabsContent value="signup"><SignUpForm loading={loading} handleSignUp={handleSignUp}/></TabsContent>
        </Tabs></div><p className="mt-6 text-center text-xs leading-5 text-[#66798a]">Before creating an account, review the draft <Link href="/terms-of-service" className="underline">terms</Link> and <Link href="/privacy-policy" className="underline">privacy information</Link>. Final legal policies require operator review.</p>
      </div></div>
    </div>
  </main>;
}
