"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const MessagesPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/recruiter/interviews");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#234C6A]" />
    </div>
  );
};

export default MessagesPage;
