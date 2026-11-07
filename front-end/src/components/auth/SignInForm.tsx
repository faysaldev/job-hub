import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

interface SignInFormProps {
  loading: boolean;
  handleSignIn: (e: React.FormEvent<HTMLFormElement>) => void;
}

const SignInForm = ({ loading, handleSignIn }: SignInFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={handleSignIn} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
          Email Address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@company.com"
            required
            className="pl-10 h-11 border-[#eaecf0] bg-white shadow-2xs focus:border-black focus:ring-1 focus:ring-black transition-all rounded-xl placeholder:text-neutral-400 text-sm text-[#111827]"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            required
            className="pl-10 pr-10 h-11 border-[#eaecf0] bg-white shadow-2xs focus:border-black focus:ring-1 focus:ring-black transition-all rounded-xl placeholder:text-neutral-400 text-sm text-[#111827]"
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <Button
        type="submit"
        className="w-full h-11 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-2xs transition-all group cursor-pointer"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Signing in...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            Sign In
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        )}
      </Button>
    </form>
  );
};

export default SignInForm;
