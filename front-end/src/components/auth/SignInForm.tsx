import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";

interface SignInFormProps {
  loading: boolean;
  handleSignIn: (e: React.FormEvent<HTMLFormElement>) => void;
}

const SignInForm = ({ loading, handleSignIn }: SignInFormProps) => {
  return (
    <form onSubmit={handleSignIn} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-[#234C6A]">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="your@email.com"
          required
          className="border-[#234C6A]/30 focus:border-[#234C6A] focus:ring-[#234C6A]"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-[#234C6A]">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          className="border-[#234C6A]/30 focus:border-[#234C6A] focus:ring-[#234C6A]"
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white"
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
};

export default SignInForm;