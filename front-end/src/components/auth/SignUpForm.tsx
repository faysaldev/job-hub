import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Checkbox } from "@/src/components/ui/checkbox";
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, Briefcase, Search } from "lucide-react";

interface SignUpFormProps {
  loading: boolean;
  handleSignUp: (e: React.FormEvent<HTMLFormElement>) => void;
}

const SignUpForm = ({ loading, handleSignUp }: SignUpFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState("jobseeker");

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-[#234C6A] font-semibold">
          Full Name
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#456882]" />
          <Input
            id="name"
            name="name"
            placeholder="Enter your full name"
            required
            className="pl-10 h-12 border-[#234C6A]/20 focus:border-[#234C6A] focus:ring-[#234C6A] rounded-xl bg-[#E3E3E3]/30"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-email" className="text-[#234C6A] font-semibold">
          Email Address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#456882]" />
          <Input
            id="signup-email"
            name="signup-email"
            type="email"
            placeholder="Enter your email"
            required
            className="pl-10 h-12 border-[#234C6A]/20 focus:border-[#234C6A] focus:ring-[#234C6A] rounded-xl bg-[#E3E3E3]/30"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-[#234C6A] font-semibold">
          Phone Number
        </Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#456882]" />
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            required
            className="pl-10 h-12 border-[#234C6A]/20 focus:border-[#234C6A] focus:ring-[#234C6A] rounded-xl bg-[#E3E3E3]/30"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-password" className="text-[#234C6A] font-semibold">
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#456882]" />
          <Input
            id="signup-password"
            name="signup-password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            required
            className="pl-10 pr-10 h-12 border-[#234C6A]/20 focus:border-[#234C6A] focus:ring-[#234C6A] rounded-xl bg-[#E3E3E3]/30"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#456882] hover:text-[#234C6A] transition-colors"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-[#234C6A] font-semibold">I am a</Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setUserType("jobseeker")}
            className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 ${
              userType === "jobseeker"
                ? "border-[#234C6A] bg-[#234C6A]/10 text-[#234C6A]"
                : "border-[#234C6A]/20 text-[#456882] hover:border-[#234C6A]/40"
            }`}
          >
            <Search className="h-5 w-5" />
            <span className="font-medium">Job Seeker</span>
          </button>
          <button
            type="button"
            onClick={() => setUserType("recruiter")}
            className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 ${
              userType === "recruiter"
                ? "border-[#234C6A] bg-[#234C6A]/10 text-[#234C6A]"
                : "border-[#234C6A]/20 text-[#456882] hover:border-[#234C6A]/40"
            }`}
          >
            <Briefcase className="h-5 w-5" />
            <span className="font-medium">Recruiter</span>
          </button>
        </div>
        <input type="hidden" name="user-type" value={userType} />
      </div>
      <div className="flex items-start space-x-3 p-4 bg-[#E3E3E3]/50 rounded-xl">
        <Checkbox id="terms" name="terms" required className="mt-0.5 border-[#234C6A]/30 data-[state=checked]:bg-[#234C6A] data-[state=checked]:border-[#234C6A]" />
        <Label htmlFor="terms" className="text-[#456882] text-sm leading-relaxed">
          I agree to the <span className="text-[#234C6A] font-semibold hover:underline cursor-pointer">Terms of Service</span> and <span className="text-[#234C6A] font-semibold hover:underline cursor-pointer">Privacy Policy</span>
        </Label>
      </div>
      <Button
        type="submit"
        className="w-full h-12 bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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
