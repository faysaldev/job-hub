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
import { toast } from "@/src/hooks/use-toast";
import SignInForm from "@/src/components/auth/SignInForm";
import SignUpForm from "@/src/components/auth/SignUpForm";
import SocialAuth from "@/src/components/auth/SocialAuth";

// Define dummy user type
interface User {
  id: string;
  name: string;
  email: string;
  role: "jobseeker" | "recruiter";
}

// Dummy data for existing users
const dummyUsers: User[] = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "jobseeker" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", role: "recruiter" },
];

const AuthPage = () => {
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  // Check if user is already logged in on component mount
  useEffect(() => {
    // In a real app, you would check for a token in localStorage or cookies
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      //   setCurrentUser(user);
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

    // Dummy login implementation
    const success = await dummyLogin(email, password);
    setLoading(false);

    if (success) {
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
    } else {
      toast({
        title: "Error",
        description: "Invalid email or password.",
        variant: "destructive",
      });
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("signup-email") as string;
    const password = formData.get("signup-password") as string;
    const role = formData.get("user-type") as "jobseeker" | "recruiter";

    // Dummy signup implementation
    const success = await dummySignup(email, password, name, role);
    setLoading(false);

    if (success) {
      toast({ title: "Account created!", description: "Please verify your email." });
      // Redirect to email verification page with email as parameter
      router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
    } else {
      toast({
        title: "Error",
        description: "Email already exists.",
        variant: "destructive",
      });
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

            <SocialAuth />
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

// Dummy login function
const dummyLogin = async (
  email: string,
  password: string
): Promise<boolean> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Find user in dummy data
  const user = dummyUsers.find((u) => u.email === email);

  if (user) {
    // Simulate successful login
    const userData = { ...user, password: undefined }; // Don't store password
    localStorage.setItem("user", JSON.stringify(userData));
    return true;
  }

  return false;
};

// Dummy signup function
const dummySignup = async (
  email: string,
  password: string,
  name: string,
  role: "jobseeker" | "recruiter"
): Promise<boolean> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Check if email already exists
  const existingUser = dummyUsers.find((u) => u.email === email);
  if (existingUser) {
    return false;
  }

  // Add new user to dummy data
  const newUser: User = {
    id: (dummyUsers.length + 1).toString(),
    name,
    email,
    role,
  };

  // Store in localStorage
  localStorage.setItem("user", JSON.stringify(newUser));
  return true;
};

export default AuthPage;
