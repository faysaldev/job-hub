import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";

interface SignUpFormProps {
  loading: boolean;
  handleSignUp: (e: React.FormEvent<HTMLFormElement>) => void;
}

const SignUpForm = ({ loading, handleSignUp }: SignUpFormProps) => {
  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-[#234C6A]">Full Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="John Doe"
          required
          className="border-[#234C6A]/30 focus:border-[#234C6A] focus:ring-[#234C6A]"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-email" className="text-[#234C6A]">Email</Label>
        <Input
          id="signup-email"
          name="signup-email"
          type="email"
          placeholder="your@email.com"
          required
          className="border-[#234C6A]/30 focus:border-[#234C6A] focus:ring-[#234C6A]"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-password" className="text-[#234C6A]">Password</Label>
        <Input
          id="signup-password"
          name="signup-password"
          type="password"
          placeholder="••••••••"
          required
          className="border-[#234C6A]/30 focus:border-[#234C6A] focus:ring-[#234C6A]"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="user-type" className="text-[#234C6A]">I am a</Label>
        <select
          id="user-type"
          name="user-type"
          className="flex h-10 w-full rounded-md border border-[#234C6A]/30 bg-[#E3E3E3] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#234C6A] focus:border-[#234C6A]"
        >
          <option value="jobseeker">Job Seeker</option>
          <option value="recruiter">Recruiter / HR</option>
        </select>
      </div>
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white"
        disabled={loading}
      >
        {loading ? "Creating account..." : "Create Account"}
      </Button>
      <p className="text-xs text-center text-[#234C6A]">
        By signing up, you agree to our Terms of Service and Privacy
        Policy
      </p>
    </form>
  );
};

export default SignUpForm;