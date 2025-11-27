import { useState } from "react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { toast } from "@/src/hooks/use-toast";

interface OTPVerificationProps {
  email: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
  loading: boolean;
  timeLeft: number;
}

const OTPVerification = ({ email, onVerify, onResend, loading, timeLeft }: OTPVerificationProps) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleOtpChange = (index: number, value: string) => {
    if (/^\d$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input if value is entered and not the last input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleVerify = () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter the complete 6-digit OTP.",
        variant: "destructive",
      });
      return;
    }
    onVerify(otpString);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <p className="text-[#234C6A] mb-4">
          Enter the 6-digit code sent to <span className="font-semibold">{email}</span>
        </p>
        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <Input
              key={index}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 text-2xl text-center border-2 border-[#234C6A]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#234C6A] focus:border-[#234C6A]"
            />
          ))}
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-[#234C6A] mb-2">
          {timeLeft > 0 ? `Resend OTP in ${timeLeft}s` : "Didn't receive the code?"}
        </p>
        <Button
          onClick={onResend}
          disabled={timeLeft > 0 || loading}
          className={`${
            timeLeft > 0
              ? "bg-[#234C6A]/50 text-[#234C6A] cursor-not-allowed"
              : "bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90"
          } text-white`}
        >
          {timeLeft > 0 ? "Resending..." : "Resend OTP"}
        </Button>
      </div>
      
      <Button
        className="w-full bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white"
        onClick={handleVerify}
        disabled={loading || otp.some(d => d === "")}
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </Button>
    </div>
  );
};

export default OTPVerification;