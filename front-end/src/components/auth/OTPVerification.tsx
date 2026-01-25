import { useState, useRef, useEffect } from "react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { toast } from "@/src/hooks/use-toast";
import { Clock, Mail, RefreshCw, ShieldCheck, Sparkles } from "lucide-react";

interface OTPVerificationProps {
  email: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
  loading: boolean;
  timeLeft: number;
}

const OTPVerification = ({ email, onVerify, onResend, loading, timeLeft }: OTPVerificationProps) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpChange = (index: number, value: string) => {
    if (/^\d$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input if value is entered and not the last input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp];
      pastedData.split("").forEach((digit, index) => {
        if (index < 6) newOtp[index] = digit;
      });
      setOtp(newOtp);
      inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
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
      inputRefs.current[index - 1]?.focus();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isComplete = otp.every(d => d !== "");

  return (
    <div className="space-y-6">
      {/* OTP Input Section */}
      <div className="text-center">
        <div className="flex justify-center gap-3">
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className={`w-12 h-14 text-2xl font-bold text-center rounded-xl transition-all duration-300 ${
                digit
                  ? "border-2 border-[#234C6A] bg-[#234C6A]/5 text-[#234C6A]"
                  : "border-2 border-[#234C6A]/20 bg-[#E3E3E3]/30"
              } focus:outline-none focus:ring-2 focus:ring-[#234C6A] focus:border-[#234C6A]`}
            />
          ))}
        </div>
        <p className="text-sm text-[#456882] mt-3">
          Tip: You can paste the code directly
        </p>
      </div>

      {/* Timer Section */}
      <div className="flex items-center justify-center">
        {timeLeft > 0 ? (
          <div className="flex items-center gap-3 px-4 py-2 bg-[#E3E3E3]/50 rounded-xl">
            <Clock className="h-5 w-5 text-[#456882]" />
            <span className="text-[#234C6A] font-medium">
              Resend available in <span className="font-bold">{formatTime(timeLeft)}</span>
            </span>
          </div>
        ) : (
          <Button
            onClick={onResend}
            disabled={loading}
            variant="ghost"
            className="text-[#234C6A] hover:bg-[#234C6A]/10"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Resend Verification Code
          </Button>
        )}
      </div>

      {/* Verify Button */}
      <Button
        className={`w-full h-12 rounded-xl font-semibold transition-all duration-300 ${
          isComplete
            ? "bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white shadow-lg hover:shadow-xl"
            : "bg-[#234C6A]/20 text-[#234C6A]/50 cursor-not-allowed"
        }`}
        onClick={handleVerify}
        disabled={loading || !isComplete}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Verifying...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Verify Code
          </span>
        )}
      </Button>

      {/* Security Note */}
      <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
        <Sparkles className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-green-700">
          This code expires in 10 minutes for security purposes.
        </p>
      </div>
    </div>
  );
};

export default OTPVerification;