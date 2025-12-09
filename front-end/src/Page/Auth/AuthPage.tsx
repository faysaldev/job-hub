"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import { Card } from "@/src/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { Briefcase } from "lucide-react";
import SignInForm from "@/src/components/auth/SignInForm";
import SignUpForm from "@/src/components/auth/SignUpForm";
import {
  useLoginMutation,
  useRegisterMutation,
} from "@/src/redux/features/auth/authApi";
import { toast } from "sonner";

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

  // Check if user is already logged in on component mount
  useEffect(() => {
    // Check for stored user in localStorage
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
          ? "/recruiter/dashboard"
          : "/jobseeker/dashboard"
      );
    }
  }, [currentUser, router]);

  // Handle successful login
  useEffect(() => {
    if (isSignInSuccess && loginData) {
      console.log("Login successful", loginData);
      // Store user data and token in localStorage
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
      // Redirect to email verification page with email as parameter
      // router.push(`/auth/verify-email?email=${encodeURIComponent(registerData.email)}`);
    }
  }, [isSignUpSuccess, registerData]);

  // If user is already logged in, show loading state while redirecting
  if (currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Redirecting...</p>
      </div>
    );
  }

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Create sign in data object and log it
    const signInData = {
      email,
      password,
    };
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

    // Create signup data object and log it
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
      // toast.error();
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#E3E3E3]">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container max-w-md">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-[#234C6A] to-[#456882] rounded-2xl p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Briefcase className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-[#234C6A]">
              Welcome to JobHubs
            </h1>
            <p className="text-[#234C6A]">
              Sign in to your account or create a new one
            </p>
          </div>

          <Card className="p-8 bg-white border-[#456882]/30">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-[#E3E3E3]">
                <TabsTrigger
                  value="signin"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#234C6A] data-[state=active]:to-[#456882] data-[state=active]:text-white"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#234C6A] data-[state=active]:to-[#456882] data-[state=active]:text-white"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <SignInForm loading={loading} handleSignIn={handleSignIn} />

                <div className="text-center mt-4">
                  <Link
                    href="/auth/forgot-password"
                    className="text-[#234C6A] hover:text-[#456882] text-sm"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <SignUpForm loading={loading} handleSignUp={handleSignUp} />
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AuthPage;
