"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/src/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import {
  Briefcase,
  Users,
  Building2,
  Shield,
  Zap,
  Globe,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import SignInForm from "@/src/components/auth/SignInForm";
import SignUpForm from "@/src/components/auth/SignUpForm";
import {
  useLoginMutation,
  useRegisterMutation,
} from "@/src/redux/features/auth/authApi";
import gsap from "gsap";

// Define user type
interface User {
  id: string;
  name: string;
  email: string;
  role: "jobseeker" | "recruiter";
}

const AuthPage = () => {
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const [
    signIn,
    {
      isLoading: LoadingSignIn,
      isSuccess: isSignInSuccess,
      isError: isSignInError,
      data: loginData,
      error: loginError,
    },
  ] = useLoginMutation();
  const [
    signUp,
    {
      isLoading: LoadingSignUp,
      isSuccess: isSignUpSuccess,
      isError: isSignUpError,
      data: registerData,
      error: registerError,
    },
  ] = useRegisterMutation();

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".auth-hero",
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }
      );

      gsap.fromTo(
        ".auth-card",
        { opacity: 0, x: 30, scale: 0.98 },
        { opacity: 1, x: 0, scale: 1, duration: 0.8, delay: 0.2, ease: "power3.out" }
      );

      gsap.fromTo(
        ".feature-item",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, delay: 0.4, ease: "power2.out" }
      );

      gsap.fromTo(
        ".trust-badge",
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.4, stagger: 0.1, delay: 0.6, ease: "back.out(1.7)" }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
    }
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      router.push(
        currentUser.role === "recruiter"
          ? "/recruiter"
          : "/job-seeker"
      );
    }
  }, [currentUser, router]);

  // Handle successful login
  useEffect(() => {
    if (isSignInSuccess && loginData) {
      console.log("Login successful", loginData);
      const userData = {
        id: loginData.data.id,
        name: loginData.data.name,
        email: loginData.data.email,
        role: loginData.data.role,
      };
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", loginData.token);
      setCurrentUser(userData);
    }
  }, [isSignInSuccess, loginData]);

  // Handle successful registration
  useEffect(() => {
    if (isSignUpSuccess && registerData) {
      console.log("Registration successful", registerData);
    }
  }, [isSignUpSuccess, registerData]);

  // If user is already logged in, show loading state while redirecting
  if (currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#234C6A] via-[#2d5a7a] to-[#456882]">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xl font-semibold">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const signInData = { email, password };
    try {
      const result = await signIn(signInData).unwrap();
      console.log("Sign in successful", result);
    } catch (error) {
      console.error("Sign in failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("signup-email") as string;
    const phone = formData.get("phone") as string;
    const password = formData.get("signup-password") as string;
    const role = formData.get("user-type") as string;

    const signUpData = {
      name,
      email,
      phoneNumber: phone,
      password,
      role: role === "jobseeker" ? "seeker" : role,
    };

    try {
      const result = await signUp(signUpData).unwrap();
      if (result?.code === 200) {
        router.push(`/auth/verify-email?email=${email}`);
      }
    } catch (error) {
      alert("Email of phone number already exist");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: <Users className="h-5 w-5" />, text: "500K+ Active Users" },
    { icon: <Building2 className="h-5 w-5" />, text: "25K+ Companies" },
    { icon: <Briefcase className="h-5 w-5" />, text: "1M+ Jobs Posted" },
  ];

  const trustBadges = [
    { icon: <Shield className="h-4 w-4" />, text: "Secure" },
    { icon: <Zap className="h-4 w-4" />, text: "Fast" },
    { icon: <Globe className="h-4 w-4" />, text: "Global" },
  ];

  return (
    <div ref={containerRef} className="min-h-screen flex bg-[#E3E3E3]">
      {/* Left Side - Hero Content (Hidden on mobile) */}
      <div className="auth-hero hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#234C6A] via-[#2d5a7a] to-[#456882] relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-center p-12 xl:p-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 border border-white/20">
              <Briefcase className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">JobHub</span>
          </Link>

          <div className="mb-12">
            <h1 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
              Your Dream Career
              <span className="block text-white/80">Starts Here</span>
            </h1>

            <p className="text-lg text-white/70 leading-relaxed max-w-md">
              Join millions of professionals who trust JobHub to find their next opportunity.
              Whether you are looking for a job or hiring talent, we have got you covered.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4 mb-10">
            {features.map((feature, i) => (
              <div
                key={i}
                className="feature-item flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10"
              >
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  {feature.icon}
                </div>
                <span className="text-white font-semibold">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="flex gap-4">
            {trustBadges.map((badge, i) => (
              <div
                key={i}
                className="trust-badge flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
              >
                <span className="text-white">{badge.icon}</span>
                <span className="text-sm text-white font-medium">{badge.text}</span>
              </div>
            ))}
          </div>

          {/* Testimonial Preview */}
          <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                JD
              </div>
              <div>
                <p className="text-white/90 italic mb-3">
                  &ldquo;Found my dream job within 2 weeks of joining JobHub. The platform is intuitive and the job recommendations are spot-on!&rdquo;
                </p>
                <p className="text-white font-semibold">Jane Doe</p>
                <p className="text-sm text-white/60">Software Engineer at Google</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Card */}
      <div className="auth-card w-full lg:w-1/2 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden p-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-[#234C6A] to-[#456882] rounded-xl p-2">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-[#234C6A]">JobHub</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-[#456882] hover:text-[#234C6A] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {/* Auth Form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Desktop Back Link */}
            <div className="hidden lg:block mb-8">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[#456882] hover:text-[#234C6A] transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </div>

            {/* Mobile Hero */}
            <div className="text-center mb-8 lg:hidden">
              <h1 className="text-2xl font-bold text-[#234C6A] mb-2">
                Welcome to JobHub
              </h1>
              <p className="text-[#456882]">
                Sign in to your account or create a new one
              </p>
            </div>

            <Card className="p-8 bg-white border-none shadow-2xl rounded-2xl">
              <div className="text-center mb-6 hidden lg:block">
                <h2 className="text-2xl font-bold text-[#234C6A] mb-1">Welcome Back</h2>
                <p className="text-[#456882] text-sm">Sign in to continue to JobHub</p>
              </div>

              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-[#E3E3E3] p-1 rounded-xl">
                  <TabsTrigger
                    value="signin"
                    className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#234C6A] data-[state=active]:to-[#456882] data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#234C6A] data-[state=active]:to-[#456882] data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="space-y-4">
                  <SignInForm loading={loading} handleSignIn={handleSignIn} />

                  <div className="text-center mt-4">
                    <Link
                      href="/auth/forgot-password"
                      className="text-[#234C6A] hover:text-[#456882] text-sm font-medium transition-colors"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4">
                  <SignUpForm loading={loading} handleSignUp={handleSignUp} />
                </TabsContent>
              </Tabs>

              {/* Social proof */}
              <div className="mt-6 pt-6 border-t border-[#E3E3E3]">
                <div className="flex items-center justify-center gap-2 text-sm text-[#456882]">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Trusted by 500,000+ professionals</span>
                </div>
              </div>
            </Card>

            {/* Additional links */}
            <div className="mt-6 text-center">
              <p className="text-sm text-[#456882]">
                By signing up, you agree to our{" "}
                <Link href="/terms-of-service" className="text-[#234C6A] hover:underline font-medium">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy-policy" className="text-[#234C6A] hover:underline font-medium">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
