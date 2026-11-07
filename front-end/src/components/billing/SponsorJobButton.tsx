"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Megaphone } from "lucide-react";
import { useBillingActionMutation } from "@/src/redux/features/billing/billingApi";
export default function SponsorJobButton({ jobId, active }: { jobId: string; active: boolean }) {
  const [open, setOpen] = useState(false);
  const [request, { isLoading }] = useBillingActionMutation();
  const run = async (durationDays: 7|30, payment: "credit"|"stripe") => {
    try {
      const data = await request({ action: "sponsor", jobId, durationDays, payment, requestId: crypto.randomUUID() }).unwrap();
      setOpen(false);
      if (data.data.checkoutUrl) window.location.assign(data.data.checkoutUrl);
      else toast.success("Sponsored placement is active");
    } catch (error: any) { toast.error(error?.data?.message || "Promotion could not be started"); }
  };
  return <div className="relative inline-block">
    <button type="button" onClick={() => setOpen(v=>!v)} disabled={!active || isLoading} aria-expanded={open} aria-label="Sponsor this published job"
      className="rounded-lg border border-[#bdccd9] bg-white px-3 py-2 text-sm font-medium text-[#163B5C] hover:bg-blue-50 disabled:opacity-50"><Megaphone className="mr-1 inline h-4 w-4"/>Promote</button>
    {open && <div className="absolute right-0 top-full z-30 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-3 text-left shadow-xl" role="group" aria-label="Promotion options">
      <p className="mb-2 text-xs text-slate-600">Sponsored results are clearly marked.</p>
      {[{days:7 as const,payment:"credit" as const,label:"Use 1 credit · 7 days"},
        {days:7 as const,payment:"stripe" as const,label:"Pay $15 · 7 days"},
        {days:30 as const,payment:"stripe" as const,label:"Pay $39 · 30 days"}].map(item =>
        <button type="button" key={item.label} disabled={isLoading} onClick={()=>run(item.days,item.payment)}
          className="block w-full rounded-md px-2 py-2 text-left text-sm text-[#163B5C] hover:bg-slate-100 disabled:opacity-50">{item.label}</button>)}
      <button type="button" onClick={()=>setOpen(false)} className="mt-1 w-full text-center text-xs text-slate-500 underline">Close</button>
    </div>}
  </div>;
}
