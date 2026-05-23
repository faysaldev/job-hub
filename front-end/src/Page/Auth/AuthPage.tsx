"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  useLoginMutation,
  useRegisterMutation,
} from "@/src/redux/features/auth/authApi";
import { setUser } from "@/src/redux/features/auth/authSlice";
import { useAppDispatch } from "@/src/redux/hooks";
import { useAuth } from "@/src/hooks/useAuth";
import SignInForm from "@/src/components/auth/SignInForm";
import SignUpForm from "@/src/components/auth/SignUpForm";
import {
  Briefcase,
  Users,
  Building2,
  Shield,
  Zap,
  Globe,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { Card } from "@/src/components/ui/card";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";

gsap.registerPlugin(ScrollTrigger);

const AuthPage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAuth();

  const [signIn] = useLoginMutation();
  const [signUp] = useRegisterMutation();

  // Already logged in → redirect
  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace(user.role === "recruiter" ? "/recruiter" : "/job-seeker");
    }
  }, [isAuthenticated, user, router]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const result = await signIn({
        email: fd.get("email") as string,
        password: fd.get("password") as string,
      }).unwrap();

      if (result?.data?.accessToken && result?.data?.user) {
        dispatch(
          setUser({
            user: result.data.user,
            token: result.data.accessToken,
          }),
        );

        toast.success("Login successfully!");
      } else {
        toast.error("Invalid response from server");
      }
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message;
      toast.error(msg || "Sign in failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const role = fd.get("user-type") as string;
    try {
      const result = await signUp({
        name: fd.get("name") as string,
        email: fd.get("signup-email") as string,
        phoneNumber: fd.get("phone") as string,
        password: fd.get("signup-password") as string,
        role: role === "seeker" ? "seeker" : "recruiter",
      }).unwrap();

      if (result?.code === 201 || result?.code === 200) {
        toast.success("Account created! Please verify your email.");
        router.push(`/verify-email?email=${fd.get("signup-email")}`);
      }
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message;
      toast.error(msg || "Registration failed. Email may already be in use.");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Users, text: "500K+ Active Users" },
    { icon: Building2, text: "25K+ Companies" },
    { icon: Briefcase, text: "1M+ Jobs Posted" },
  ];

  const trustBadges = [
    { icon: Shield, text: "Secure" },
    { icon: Zap, text: "Fast" },
    { icon: Globe, text: "Global" },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".auth-hero-content > *",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power3.out" },
      );
      gsap.fromTo(
        ".auth-form-card",
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 1, ease: "back.out(1.2)", delay: 0.2 },
      );
    });
    return () => ctx.revert();
  }, []);

  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#234C6A] to-[#456882]">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-semibold text-lg tracking-wide animate-pulse">
            Redirecting...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#E3E3E3] via-white to-[#E3E3E3] relative overflow-hidden">
      {/* Floating Back to Home Button */}
      <Link
        href="/"
        className="absolute top-8 right-8 z-50 flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-md border border-white/20 rounded-full text-[#234C6A] font-medium hover:bg-white hover:shadow-xl transition-all duration-300 group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>
      {/* Left Hero Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#234C6A] via-[#2d5a7a] to-[#456882] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute -bottom-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-white/3 to-transparent rounded-full blur-3xl" />
        </div>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10 flex flex-col justify-center p-12 xl:p-16 auth-hero-content">
          <Link href="/" className="flex items-center gap-3 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 border border-white/20">
              <Briefcase className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">JobHub</span>
          </Link>
          <div className="mb-10">
            <h1 className="text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight">
              Your Dream Career
              <span className="block text-white/80">Starts Here</span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed max-w-md">
              Join millions of professionals who trust JobHub to find their next
              opportunity.
            </p>
          </div>
          <div className="space-y-3 mb-8">
            {features.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10"
              >
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <f.icon className="h-5 w-5" />
                </div>
                <span className="text-white font-medium">{f.text}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            {trustBadges.map((b, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20"
              >
                <b.icon className="h-4 w-4 text-white" />
                <span className="text-sm text-white font-medium">{b.text}</span>
              </div>
            ))}
          </div>
          <div className="mt-10 p-5 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                JD
              </div>
              <div>
                <p className="text-white/90 italic text-sm mb-2">
                  &ldquo;Found my dream job within 2 weeks. The recommendations
                  were spot-on!&rdquo;
                </p>
                <p className="text-white font-semibold text-sm">Jane Doe</p>
                <p className="text-xs text-white/60">
                  Software Engineer at Google
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Auth Panel */}
      <div className="w-full lg:w-1/2 flex flex-col">
        <div className="lg:hidden p-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-[#234C6A] to-[#456882] rounded-xl p-2">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-[#234C6A]">JobHub</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1 text-sm text-[#456882] hover:text-[#234C6A] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 md:p-10 lg:p-16 xl:p-20">
          <div className="w-full max-w-[480px] md:max-w-[520px] lg:max-w-[550px] transition-all duration-300">
            <div className="hidden lg:block mb-8">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[#456882] hover:text-[#234C6A] transition-colors text-sm font-medium group"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </Link>
            </div>
            <div className="text-center mb-6 lg:hidden">
              <h1 className="text-2xl font-bold text-[#234C6A] mb-1">
                Welcome to JobHub
              </h1>
              <p className="text-[#456882] text-sm">
                Sign in or create your account
              </p>
            </div>

            <Card className="p-6 sm:p-10 border border-white/50 bg-white/75 backdrop-blur-xl shadow-[0_20px_50px_rgba(35,76,106,0.12)] rounded-[32px] relative overflow-hidden transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#234C6A] to-[#456882]" />
              <div className="text-center mb-8 hidden lg:block">
                <h2 className="text-3xl font-extrabold text-[#234C6A] tracking-tight mb-2">
                  Welcome Back
                </h2>
                <p className="text-[#456882] text-sm font-medium">
                  Sign in to continue to JobHub
                </p>
              </div>

              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid grid-cols-2 w-full h-12 bg-[#E3E3E3]/40 p-1 rounded-2xl mb-8 border border-white/20 backdrop-blur-md">
                  <TabsTrigger
                    value="signin"
                    className="rounded-xl font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#234C6A] data-[state=active]:to-[#456882] data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 cursor-pointer"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="rounded-xl font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#234C6A] data-[state=active]:to-[#456882] data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 cursor-pointer"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="space-y-5">
                  <SignInForm loading={loading} handleSignIn={handleSignIn} />
                  <div className="text-center mt-4">
                    <Link
                      href="/reset-password"
                      className="text-[#234C6A] hover:text-[#456882] text-sm font-semibold transition-colors"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </TabsContent>

                <TabsContent value="signup" className="space-y-5">
                  <SignUpForm loading={loading} handleSignUp={handleSignUp} />
                </TabsContent>
              </Tabs>

              <div className="mt-8 pt-6 border-t border-[#E3E3E3]/60 flex items-center justify-center gap-2 text-sm text-[#456882]/90 font-medium">
                <CheckCircle className="h-4.5 w-4.5 text-green-500" />
                <span>Trusted by 500,000+ professionals</span>
              </div>
            </Card>

            <div className="mt-5 text-center text-xs text-[#456882]">
              By signing up, you agree to our{" "}
              <Link
                href="/terms-of-service"
                className="text-[#234C6A] hover:underline font-medium"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy-policy"
                className="text-[#234C6A] hover:underline font-medium"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
