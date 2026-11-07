import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Checkbox } from "@/src/components/ui/checkbox";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Briefcase,
  Search,
} from "lucide-react";
import Link from "next/link";

interface SignUpFormProps {
  loading: boolean;
  handleSignUp: (e: React.FormEvent<HTMLFormElement>) => void;
}

const SignUpForm = ({ loading, handleSignUp }: SignUpFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState("seeker");

  return (
    <form onSubmit={handleSignUp} className="space-y-3.5">
      <div className="space-y-1.5">
        <Label
          htmlFor="name"
          className="text-[11px] font-bold uppercase tracking-wider text-neutral-700"
        >
          Full Name
        </Label>
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            id="name"
            name="name"
            placeholder="John Doe"
            required
            className="pl-10 h-11 border-[#eaecf0] bg-white shadow-2xs focus:border-black focus:ring-1 focus:ring-black transition-all rounded-xl placeholder:text-neutral-400 text-sm text-[#111827]"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label
          htmlFor="signup-email"
          className="text-[11px] font-bold uppercase tracking-wider text-neutral-700"
        >
          Email Address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            id="signup-email"
            name="signup-email"
            type="email"
            placeholder="name@company.com"
            required
            className="pl-10 h-11 border-[#eaecf0] bg-white shadow-2xs focus:border-black focus:ring-1 focus:ring-black transition-all rounded-xl placeholder:text-neutral-400 text-sm text-[#111827]"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label
          htmlFor="phone"
          className="text-[11px] font-bold uppercase tracking-wider text-neutral-700"
        >
          Phone Number
        </Label>
        <div className="relative">
          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            required
            className="pl-10 h-11 border-[#eaecf0] bg-white shadow-2xs focus:border-black focus:ring-1 focus:ring-black transition-all rounded-xl placeholder:text-neutral-400 text-sm text-[#111827]"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label
          htmlFor="signup-password"
          className="text-[11px] font-bold uppercase tracking-wider text-neutral-700"
        >
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            id="signup-password"
            name="signup-password"
            minLength={8}
            maxLength={128}
            type={showPassword ? "text" : "password"}
            placeholder="At least 8 characters"
            required
            className="pl-10 pr-10 h-11 border-[#eaecf0] bg-white shadow-2xs focus:border-black focus:ring-1 focus:ring-black transition-all rounded-xl placeholder:text-neutral-400 text-sm text-[#111827]"
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors cursor-pointer"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
          Account Type
        </Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setUserType("seeker")}
            aria-pressed={userType === "seeker"}
            className={`flex items-center justify-center gap-2.5 p-3 rounded-xl border transition-all cursor-pointer ${
              userType === "seeker"
                ? "border-black bg-black/5 text-black shadow-2xs"
                : "border-[#eaecf0] bg-white text-neutral-600 hover:border-neutral-300 hover:text-black"
            }`}
          >
            <div
              className={`p-1.5 rounded-lg transition-colors ${userType === "seeker" ? "bg-black text-white" : "bg-neutral-100 text-neutral-600"}`}
            >
              <Search className="h-3.5 w-3.5" />
            </div>
            <span className="font-bold text-xs uppercase tracking-wider">Job Seeker</span>
          </button>
          <button
            type="button"
            onClick={() => setUserType("recruiter")}
            aria-pressed={userType === "recruiter"}
            className={`flex items-center justify-center gap-2.5 p-3 rounded-xl border transition-all cursor-pointer ${
              userType === "recruiter"
                ? "border-black bg-black/5 text-black shadow-2xs"
                : "border-[#eaecf0] bg-white text-neutral-600 hover:border-neutral-300 hover:text-black"
            }`}
          >
            <div
              className={`p-1.5 rounded-lg transition-colors ${userType === "recruiter" ? "bg-black text-white" : "bg-neutral-100 text-neutral-600"}`}
            >
              <Briefcase className="h-3.5 w-3.5" />
            </div>
            <span className="font-bold text-xs uppercase tracking-wider">Recruiter</span>
          </button>
        </div>
        <input type="hidden" name="user-type" value={userType} />
      </div>
      <div className="flex items-start space-x-2.5 p-3 bg-neutral-50 rounded-xl border border-[#eaecf0]">
        <Checkbox
          id="terms"
          name="terms"
          required
          className="mt-0.5 border-neutral-300 data-[state=checked]:bg-black data-[state=checked]:border-black"
        />
        <Label
          htmlFor="terms"
          className="text-neutral-600 text-xs leading-relaxed cursor-pointer"
        >
          I agree to the{" "}
          <Link href="/terms-of-service" className="text-black font-semibold hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className="text-black font-semibold hover:underline">
            Privacy Policy
          </Link>
        </Label>
      </div>
      <Button
        type="submit"
        className="w-full h-11 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-2xs transition-all group cursor-pointer"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Creating account...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            Create Account
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        )}
      </Button>
    </form>
  );
};

export default SignUpForm;
