import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";

interface SignInFormProps {
  loading: boolean;
  handleSignIn: (e: React.FormEvent<HTMLFormElement>) => void;
}

const SignInForm = ({ loading, handleSignIn }: SignInFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={handleSignIn} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-[#234C6A] font-semibold">
          Email Address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#456882]" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            required
            className="pl-10 h-12 border-[#234C6A]/20 focus:border-[#234C6A] focus:ring-[#234C6A] rounded-xl bg-[#E3E3E3]/30"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-[#234C6A] font-semibold">
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#456882]" />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
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
            Signing in...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            Sign In
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </span>
        )}
      </Button>
    </form>
  );
};

export default SignInForm;
