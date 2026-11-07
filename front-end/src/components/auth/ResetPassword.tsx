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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="new-password" className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
          New Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            id="new-password"
            type={showNewPassword ? "text" : "password"}
            placeholder="At least 8 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="pl-10 pr-10 h-11 border-[#eaecf0] bg-white shadow-2xs focus:border-black focus:ring-1 focus:ring-black transition-all rounded-xl placeholder:text-neutral-400 text-sm text-[#111827]"
            required
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors cursor-pointer"
          >
            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {/* Password Strength Indicator */}
        {newPassword && (
          <div className="space-y-2.5 p-3.5 bg-neutral-50 rounded-xl border border-[#eaecf0]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-700">Password Strength</span>
              <span className={`text-xs font-bold uppercase tracking-wider ${
                passwordStrength.strength === "strong" ? "text-emerald-600" :
                passwordStrength.strength === "medium" ? "text-amber-600" : "text-rose-600"
              }`}>
                {passwordStrength.strength}
              </span>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    i <= passwordStrength.passedChecks ? passwordStrength.color : "bg-neutral-200"
                  }`}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
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
                      ? "text-emerald-700 font-medium"
                      : "text-neutral-400"
                  }`}
                >
                  {passwordStrength.checks[item.key as keyof typeof passwordStrength.checks] ? (
                    <CheckCircle className="h-3 w-3 text-emerald-600" />
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

      <div className="space-y-1.5">
        <Label htmlFor="confirm-password" className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
          Confirm New Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            id="confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`pl-10 pr-10 h-11 border bg-white shadow-2xs focus:ring-1 transition-all rounded-xl placeholder:text-neutral-400 text-sm text-[#111827] ${
              confirmPassword && (passwordsMatch ? "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20" : "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20")
            }`}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors cursor-pointer"
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {confirmPassword && (
          <div className={`flex items-center gap-1.5 text-xs font-semibold ${passwordsMatch ? "text-emerald-600" : "text-rose-600"}`}>
            {passwordsMatch ? (
              <>
                <CheckCircle className="h-3.5 w-3.5" />
                Passwords match
              </>
            ) : (
              <>
                <XCircle className="h-3.5 w-3.5" />
                Passwords do not match
              </>
            )}
          </div>
        )}
      </div>

      <Button
        type="submit"
        className="w-full h-11 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-2xs transition-all cursor-pointer"
        disabled={loading || !passwordsMatch || passwordStrength.strength === "weak"}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Resetting Password...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            Reset Password
          </span>
        )}
      </Button>
    </form>
  );
};

export default ResetPassword;