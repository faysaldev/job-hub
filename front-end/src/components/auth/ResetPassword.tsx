import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { toast } from "@/src/hooks/use-toast";

interface ResetPasswordProps {
  onSubmit: (password: string) => void;
  loading: boolean;
}

const ResetPassword = ({ onSubmit, loading }: ResetPasswordProps) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit(newPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="new-password" className="text-[#234C6A]">
          New Password
        </Label>
        <Input
          id="new-password"
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border-[#234C6A]/30 focus:border-[#234C6A] focus:ring-[#234C6A]"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm-password" className="text-[#234C6A]">
          Confirm New Password
        </Label>
        <Input
          id="confirm-password"
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border-[#234C6A]/30 focus:border-[#234C6A] focus:ring-[#234C6A]"
          required
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white"
        disabled={loading}
      >
        {loading ? "Resetting Password..." : "Reset Password"}
      </Button>
    </form>
  );
};

export default ResetPassword;