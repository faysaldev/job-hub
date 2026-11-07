"use client";
import { useState } from "react";
import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import { useSubmitContactFormMutation } from "@/src/redux/features/generals/generalsApi";
import { toast } from "sonner";
import { Send, HelpCircle, MailCheck } from "lucide-react";

const departments = [
  { value: "general", label: "General question" },
  { value: "support", label: "Technical support" },
  { value: "sales", label: "Recruiter or company inquiry" },
  { value: "careers", label: "Career question" },
];
const inputClass = "mt-2 w-full rounded-xl border border-[#dce5ec] bg-white px-4 py-3 text-sm text-[#162839] placeholder:text-[#9cabb8] focus:border-[#2563a9]";
export default function ContactPage() {
  const [submitContact, { isLoading }] = useSubmitContactFormMutation();
  const [values, setValues] = useState({ fullName: "", email: "", department: "general", subject: "", message: "" });
  const update = (field: keyof typeof values, value: string) => setValues(prev => ({ ...prev, [field]: value }));
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;
    try {
      await submitContact({ ...values, fullName: values.fullName.trim(), email: values.email.trim(), subject: values.subject.trim(), message: values.message.trim() }).unwrap();
      toast.success("Your message has been submitted.");
      setValues({ fullName: "", email: "", department: "general", subject: "", message: "" });
    } catch (error: unknown) {
      toast.error((error as { data?: { message?: string } })?.data?.message || "We couldn't submit your message. Please try again.");
    }
  };
  return <div className="jh-public"><Header/><main id="main-content"><section className="border-b border-[#e1e8ef] bg-white py-16 md:py-20"><div className="jh-container"><p className="jh-kicker mb-4">Contact</p><h1 className="text-4xl font-semibold tracking-tight text-[#162839] md:text-5xl">How can we help?</h1><p className="mt-4 max-w-xl text-base leading-7 text-[#66798a]">Send a question about your account, job search or recruiting workflow. Use the form below to contact JobHub.</p></div></section>
    <section className="jh-container grid items-start gap-8 py-12 md:grid-cols-[minmax(0,1.35fr)_minmax(260px,.65fr)] md:py-16"><div className="jh-panel p-6 md:p-9"><h2 className="text-xl font-semibold text-[#162839]">Send a message</h2><p className="mt-2 text-sm text-[#66798a]">Fields marked * are required.</p>
      <form onSubmit={submit} className="mt-7 space-y-5"><div className="grid gap-5 sm:grid-cols-2"><label className="block text-sm font-semibold text-[#162839]">Full name *<input className={inputClass} type="text" name="fullName" autoComplete="name" maxLength={100} required value={values.fullName} onChange={e=>update("fullName",e.target.value)}/></label><label className="block text-sm font-semibold text-[#162839]">Email *<input className={inputClass} type="email" name="email" autoComplete="email" maxLength={254} required value={values.email} onChange={e=>update("email",e.target.value)}/></label></div>
      <label className="block text-sm font-semibold text-[#162839]">Topic *<select className={inputClass} name="department" required value={values.department} onChange={e=>update("department",e.target.value)}>{departments.map(option=><option value={option.value} key={option.value}>{option.label}</option>)}</select></label>
      <label className="block text-sm font-semibold text-[#162839]">Subject *<input className={inputClass} type="text" name="subject" maxLength={160} required value={values.subject} onChange={e=>update("subject",e.target.value)}/></label>
      <label className="block text-sm font-semibold text-[#162839]">Message *<textarea className={`${inputClass} min-h-40 resize-y`} name="message" minLength={10} maxLength={5000} required value={values.message} onChange={e=>update("message",e.target.value)} placeholder="Tell us how we can help..."/></label>
      <button type="submit" disabled={isLoading} className="jh-button disabled:cursor-not-allowed disabled:opacity-60"><Send size={16}/>{isLoading ? "Submitting…" : "Send message"}</button></form>
    </div><aside className="space-y-4"><div className="jh-panel p-6"><HelpCircle className="text-[#163b5c]" size={23}/><h2 className="mt-5 text-lg font-semibold text-[#162839]">Account or hiring question?</h2><p className="mt-3 text-sm leading-6 text-[#66798a]">Choose the topic in the form so the message reaches the right workflow.</p></div><div className="jh-panel p-6"><MailCheck size={23} className="text-[#163b5c]"/><h2 className="mt-5 text-lg font-semibold text-[#162839]">After you send</h2><p className="mt-3 text-sm leading-6 text-[#66798a]">A confirmation appears when your message is accepted. Response times depend on support availability.</p></div></aside></section>
  </main><Footer/></div>;
}
