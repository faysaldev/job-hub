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

interface SignUpFormProps {
  loading: boolean;
  handleSignUp: (e: React.FormEvent<HTMLFormElement>) => void;
}

const SignUpForm = ({ loading, handleSignUp }: SignUpFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState("seeker");

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div className="space-y-2">
        <Label
          htmlFor="name"
          className="text-[#163B5C] font-semibold text-sm tracking-wide"
        >
          Full Name
        </Label>
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#516C83]/80" />
          <Input
            id="name"
            name="name"
            placeholder="Enter your full name"
            required
            className="pl-11 h-12 border-slate-200/60 bg-white/60 backdrop-blur-md shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:bg-white focus:border-[#163B5C] focus:ring-4 focus:ring-[#163B5C]/10 transition-all duration-300 rounded-xl placeholder:text-[#516C83]/50 text-[#163B5C]"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label
          htmlFor="signup-email"
          className="text-[#163B5C] font-semibold text-sm tracking-wide"
        >
          Email Address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#516C83]/80" />
          <Input
            id="signup-email"
            name="signup-email"
            type="email"
            placeholder="Enter your email"
            required
            className="pl-11 h-12 border-slate-200/60 bg-white/60 backdrop-blur-md shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:bg-white focus:border-[#163B5C] focus:ring-4 focus:ring-[#163B5C]/10 transition-all duration-300 rounded-xl placeholder:text-[#516C83]/50 text-[#163B5C]"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label
          htmlFor="phone"
          className="text-[#163B5C] font-semibold text-sm tracking-wide"
        >
          Phone Number
        </Label>
        <div className="relative">
          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#516C83]/80" />
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Your contact number"
            required
            className="pl-11 h-12 border-slate-200/60 bg-white/60 backdrop-blur-md shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:bg-white focus:border-[#163B5C] focus:ring-4 focus:ring-[#163B5C]/10 transition-all duration-300 rounded-xl placeholder:text-[#516C83]/50 text-[#163B5C]"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label
          htmlFor="signup-password"
          className="text-[#163B5C] font-semibold text-sm tracking-wide"
        >
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#516C83]/80" />
          <Input
            id="signup-password"
            name="signup-password"
            minLength={8}
            maxLength={128}
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            required
            className="pl-11 pr-10 h-12 border-slate-200/60 bg-white/60 backdrop-blur-md shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:bg-white focus:border-[#163B5C] focus:ring-4 focus:ring-[#163B5C]/10 transition-all duration-300 rounded-xl placeholder:text-[#516C83]/50 text-[#163B5C]"
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#516C83]/80 hover:text-[#163B5C] transition-colors cursor-pointer"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-[#163B5C] font-semibold text-sm tracking-wide">
          I am a
        </Label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setUserType("seeker")}
            aria-pressed={userType === "seeker"}
            className={`flex items-center justify-center gap-3 p-2 md:p-4 rounded-2xl border-2 transition-all duration-500 group/btn relative overflow-hidden cursor-pointer ${
              userType === "seeker"
                ? "border-[#163B5C] bg-[#163B5C]/5 text-[#163B5C] shadow-md shadow-[#163B5C]/5"
                : "border-slate-200/60 bg-white/60 text-[#516C83] hover:border-[#163B5C]/30 hover:bg-white"
            }`}
          >
            <div
              className={`p-2 rounded-lg transition-colors ${userType === "seeker" ? "bg-[#163B5C] text-white" : "bg-[#516C83]/10"}`}
            >
              <Search className="h-4 w-4" />
            </div>
            <span className="font-bold text-sm">Job Seeker</span>
          </button>
          <button
            type="button"
            onClick={() => setUserType("recruiter")}
            aria-pressed={userType === "recruiter"}
            className={`flex items-center justify-center gap-3 p-1 md:p-4 rounded-2xl border-2 transition-all duration-500 group/btn relative overflow-hidden cursor-pointer ${
              userType === "recruiter"
                ? "border-[#163B5C] bg-[#163B5C]/5 text-[#163B5C] shadow-md shadow-[#163B5C]/5"
                : "border-slate-200/60 bg-white/60 text-[#516C83] hover:border-[#163B5C]/30 hover:bg-white"
            }`}
          >
            <div
              className={`p-2 rounded-lg transition-colors ${userType === "recruiter" ? "bg-[#163B5C] text-white" : "bg-[#516C83]/10"}`}
            >
              <Briefcase className="h-4 w-4" />
            </div>
            <span className="font-bold text-sm">Recruiter</span>
          </button>
        </div>
        <input type="hidden" name="user-type" value={userType} />
      </div>
      <div className="flex items-start space-x-3 p-4 bg-white/60 backdrop-blur-md rounded-2xl border border-slate-200/60">
        <Checkbox
          id="terms"
          name="terms"
          required
          className="mt-0.5 border-[#163B5C]/30 data-[state=checked]:bg-[#163B5C] data-[state=checked]:border-[#163B5C]"
        />
        <Label
          htmlFor="terms"
          className="text-[#516C83] text-xs md:text-sm leading-relaxed cursor-pointer"
        >
          I agree to the{" "}
          <span className="text-[#163B5C] font-semibold hover:underline cursor-pointer">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="text-[#163B5C] font-semibold hover:underline cursor-pointer">
            Privacy Policy
          </span>
        </Label>
      </div>
      <Button
        type="submit"
        className="w-full h-12 bg-gradient-to-r from-[#163B5C] to-[#516C83] hover:from-[#163B5C]/95 hover:to-[#516C83]/95 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </span>
        )}
      </Button>
    </form>
  );
};

export default SignUpForm;
