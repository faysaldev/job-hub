import { useState, useMemo } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { toast } from "@/src/hooks/use-toast";
import { Lock, Eye, EyeOff, CheckCircle, XCircle, ShieldCheck } from "lucide-react";

interface ResetPasswordProps {
  onSubmit: (password: string) => void;
  loading: boolean;
}

const ResetPassword = ({ onSubmit, loading }: ResetPasswordProps) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password strength checker
  const passwordStrength = useMemo(() => {
    const checks = {
      length: newPassword.length >= 8,
      lowercase: /[a-z]/.test(newPassword),
      uppercase: /[A-Z]/.test(newPassword),
      number: /[0-9]/.test(newPassword),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    };

    const passedChecks = Object.values(checks).filter(Boolean).length;

    let strength: "weak" | "medium" | "strong" = "weak";
    let color = "bg-red-500";

    if (passedChecks >= 4) {
      strength = "strong";
      color = "bg-green-500";
    } else if (passedChecks >= 3) {
      strength = "medium";
      color = "bg-yellow-500";
    }

    return { checks, passedChecks, strength, color };
  }, [newPassword]);

  const passwordsMatch = confirmPassword && newPassword === confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    onSubmit(newPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="new-password" className="text-[#234C6A] font-semibold">
          New Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#456882]" />
          <Input
            id="new-password"
            type={showNewPassword ? "text" : "password"}
            placeholder="Create a strong password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="pl-10 pr-10 h-12 border-[#234C6A]/20 focus:border-[#234C6A] focus:ring-[#234C6A] rounded-xl bg-[#E3E3E3]/30"
            required
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#456882] hover:text-[#234C6A] transition-colors"
          >
            {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        {/* Password Strength Indicator */}
        {newPassword && (
          <div className="space-y-3 p-4 bg-[#E3E3E3]/50 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#234C6A]">Password Strength</span>
              <span className={`text-sm font-semibold capitalize ${
                passwordStrength.strength === "strong" ? "text-green-600" :
                passwordStrength.strength === "medium" ? "text-yellow-600" : "text-red-600"
              }`}>
                {passwordStrength.strength}
              </span>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                    i <= passwordStrength.passedChecks ? passwordStrength.color : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { key: "length", label: "8+ characters" },
                { key: "lowercase", label: "Lowercase letter" },
                { key: "uppercase", label: "Uppercase letter" },
                { key: "number", label: "Number" },
                { key: "special", label: "Special character" },
              ].map((item) => (
                <div
                  key={item.key}
                  className={`flex items-center gap-1 ${
                    passwordStrength.checks[item.key as keyof typeof passwordStrength.checks]
                      ? "text-green-600"
                      : "text-[#456882]"
                  }`}
                >
                  {passwordStrength.checks[item.key as keyof typeof passwordStrength.checks] ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <XCircle className="h-3 w-3" />
                  )}
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password" className="text-[#234C6A] font-semibold">
          Confirm New Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#456882]" />
          <Input
            id="confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`pl-10 pr-10 h-12 border-[#234C6A]/20 focus:border-[#234C6A] focus:ring-[#234C6A] rounded-xl bg-[#E3E3E3]/30 ${
              confirmPassword && (passwordsMatch ? "border-green-500" : "border-red-500")
            }`}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#456882] hover:text-[#234C6A] transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {confirmPassword && (
          <div className={`flex items-center gap-2 text-sm ${passwordsMatch ? "text-green-600" : "text-red-600"}`}>
            {passwordsMatch ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Passwords match
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4" />
                Passwords do not match
              </>
            )}
          </div>
        )}
      </div>

      <Button
        type="submit"
        className="w-full h-12 bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        disabled={loading || !passwordsMatch || passwordStrength.strength === "weak"}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Resetting Password...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Reset Password
          </span>
        )}
      </Button>
    </form>
  );
};

export default ResetPassword;