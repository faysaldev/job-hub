"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Clock,
  Globe,
  Headphones,
  ArrowUpRight,
  Shield,
  Users,
  Loader2,
} from "lucide-react";
import { toast } from "@/src/hooks/use-toast";
import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSubmitContactFormMutation } from "@/src/redux/features/generals/generalsApi";

gsap.registerPlugin(ScrollTrigger);

export default function ContactPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const [contactSubmit] = useSubmitContactFormMutation();

  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const departmentRef = useRef<HTMLSelectElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-content",
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
      );

      gsap.fromTo(
        ".contact-card",
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: "power2.out",
          delay: 0.25,
        },
      );

      gsap.fromTo(
        ".form-container",
        { opacity: 0, y: 34 },
        { opacity: 1, y: 0, duration: 0.75, ease: "power3.out", delay: 0.35 },
      );

      gsap.fromTo(
        ".info-container",
        { opacity: 0, y: 34 },
        { opacity: 1, y: 0, duration: 0.75, ease: "power3.out", delay: 0.45 },
      );
    });

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        fullName: fullNameRef.current?.value || "",
        email: emailRef.current?.value || "",
        subject: subjectRef.current?.value || "",
        message: messageRef.current?.value || "",
        department: departmentRef.current?.value || "general",
      };

      await contactSubmit(payload).unwrap();

      toast({
        title: "Message Sent Successfully!",
        description:
          "Thank you for reaching out. Our team will respond within 24 hours.",
      });

      if (fullNameRef.current) fullNameRef.current.value = "";
      if (emailRef.current) emailRef.current.value = "";
      if (subjectRef.current) subjectRef.current.value = "";
      if (messageRef.current) messageRef.current.value = "";
      if (departmentRef.current) departmentRef.current.value = "general";
    } catch (error: any) {
      toast({
        title: "Error Sending Message",
        description:
          error?.data?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: <Mail className="h-5 w-5" />,
      title: "Email Us",
      description: "Candidate, recruiter, and platform questions",
      primary: "support@jobhub.com",
      secondary: "enterprise@jobhub.com",
      color: "bg-[#234C6A]",
    },
    {
      icon: <Phone className="h-5 w-5" />,
      title: "Call Us",
      description: "Mon-Fri from 8am to 6pm PST",
      primary: "+1 (555) 123-4567",
      secondary: "+1 (555) 987-6543",
      color: "bg-[#456882]",
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Visit Us",
      description: "Meet the JobHub team at our HQ",
      primary: "123 Business Avenue",
      secondary: "San Francisco, CA 94107",
      color: "bg-[#234C6A]",
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      title: "Live Chat",
      description: "Fast guidance for urgent account issues",
      primary: "Start a conversation",
      secondary: "Average response: 2 min",
      color: "bg-[#456882]",
    },
  ];

  const departments = [
    { value: "general", label: "General Inquiry" },
    { value: "support", label: "Technical Support" },
    { value: "sales", label: "Sales & Partnerships" },
    { value: "careers", label: "Careers at JobHub" },
    { value: "press", label: "Press & Media" },
  ];

  const offices = [
    {
      city: "San Francisco",
      address: "123 Business Avenue, CA 94107",
      type: "Headquarters",
    },
    {
      city: "New York",
      address: "456 Tech Plaza, NY 10001",
      type: "East Coast Office",
    },
    {
      city: "London",
      address: "789 Innovation Hub, EC2A 4NE",
      type: "European Office",
    },
    {
      city: "Singapore",
      address: "321 Marina Bay, 018983",
      type: "Asia Pacific Office",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col jobhub-page-bg">
      <Header />

      <section
        ref={heroRef}
        className="relative overflow-hidden bg-[#234C6A] pb-24 pt-28 md:pb-28 md:pt-32"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:64px_64px]" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="hero-content grid items-end gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white/90 backdrop-blur-sm">
                <Headphones className="h-4 w-4" />
                <span>JobHub Support Desk</span>
              </div>

              <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white md:text-6xl">
                Talk to the right JobHub team.
              </h1>
              <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-white/75">
                Send one focused message and we will route it to candidate
                support, recruiter success, sales, or partnerships.
              </p>
            </div>

            <div className="grid min-w-[260px] gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[
                { icon: Clock, label: "24h Response" },
                { icon: Shield, label: "Verified Support" },
                { icon: Users, label: "For Hiring Teams" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-[10px] font-black uppercase tracking-wide text-white/90 backdrop-blur-sm"
                >
                  <Icon className="mr-2 inline h-4 w-4" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="relative z-20 -mt-12 flex-1 pb-16">
        <div className="container mx-auto px-6">
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
            {contactMethods.map((method) => (
              <Card
                key={method.title}
                className="contact-card group overflow-hidden rounded-3xl border border-[#234C6A]/10 bg-white/95 p-5 shadow-xl shadow-[#234C6A]/8 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-[#234C6A]/25"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg shadow-[#234C6A]/15 ${method.color}`}
                  >
                    {method.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-[#234C6A]">
                      {method.title}
                    </h3>
                    <p className="mt-1 text-xs font-medium leading-5 text-[#456882]">
                      {method.description}
                    </p>
                  </div>
                </div>
                <div className="mt-4 rounded-2xl bg-[#F8FAFC] p-3">
                  <p className="truncate text-sm font-black text-[#234C6A]">
                    {method.primary}
                  </p>
                  <p className="mt-0.5 truncate text-xs font-medium text-[#456882]">
                    {method.secondary}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div ref={formRef} className="form-container">
              <Card className="relative overflow-hidden rounded-3xl border border-[#234C6A]/10 bg-white/95 shadow-2xl shadow-[#234C6A]/10 backdrop-blur-xl pt-0">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#234C6A] to-[#456882]" />
                <div className="border-b border-[#E3E3E3]/70 bg-gradient-to-r from-[#234C6A]/8 to-[#456882]/8 p-5 md:p-6">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-[#456882]">
                        Send a message
                      </p>
                      <h2 className="mt-2 text-2xl font-black text-[#234C6A]">
                        Tell us how we can help
                      </h2>
                      <p className="mt-1 text-sm font-medium text-[#456882]">
                        The fastest path to the right support specialist.
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#234C6A] text-white shadow-lg shadow-[#234C6A]/20">
                      <Send className="h-6 w-6" />
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 p-5 md:p-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-sm font-black text-[#234C6A]"
                      >
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        ref={fullNameRef}
                        className="h-12 rounded-2xl border-transparent bg-[#F4F7F8] text-[#234C6A] placeholder:text-[#456882]/55 focus:border-[#234C6A]/15 focus:bg-white focus:ring-2 focus:ring-[#234C6A]/10"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-sm font-black text-[#234C6A]"
                      >
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        ref={emailRef}
                        className="h-12 rounded-2xl border-transparent bg-[#F4F7F8] text-[#234C6A] placeholder:text-[#456882]/55 focus:border-[#234C6A]/15 focus:bg-white focus:ring-2 focus:ring-[#234C6A]/10"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="department"
                        className="text-sm font-black text-[#234C6A]"
                      >
                        Department
                      </Label>
                      <select
                        id="department"
                        name="department"
                        ref={departmentRef}
                        className="h-12 w-full rounded-2xl border border-transparent bg-[#F4F7F8] px-4 font-semibold text-[#234C6A] outline-none transition focus:border-[#234C6A]/15 focus:bg-white focus:ring-2 focus:ring-[#234C6A]/10"
                      >
                        {departments.map((dept) => (
                          <option key={dept.value} value={dept.value}>
                            {dept.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="subject"
                        className="text-sm font-black text-[#234C6A]"
                      >
                        Subject *
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="How can we help you?"
                        ref={subjectRef}
                        className="h-12 rounded-2xl border-transparent bg-[#F4F7F8] text-[#234C6A] placeholder:text-[#456882]/55 focus:border-[#234C6A]/15 focus:bg-white focus:ring-2 focus:ring-[#234C6A]/10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="message"
                      className="text-sm font-black text-[#234C6A]"
                    >
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us more about your inquiry..."
                      ref={messageRef}
                      rows={7}
                      maxLength={1500}
                      className="resize-none rounded-2xl border-transparent bg-[#F4F7F8] text-[#234C6A] placeholder:text-[#456882]/55 focus:border-[#234C6A]/15 focus:bg-white focus:ring-2 focus:ring-[#234C6A]/10"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-14 w-full rounded-2xl bg-gradient-to-r from-[#234C6A] to-[#456882] text-base font-black text-white shadow-lg shadow-[#234C6A]/20 transition-all hover:from-[#1c405a] hover:to-[#3b5a71] active:scale-[0.99]"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        Send Message
                        <Send className="ml-2 h-5 w-5" />
                      </span>
                    )}
                  </Button>
                </form>
              </Card>
            </div>

            <aside ref={infoRef} className="info-container space-y-6">
              <Card className="overflow-hidden rounded-3xl border border-[#234C6A]/10 bg-white/95 pt-0 shadow-xl shadow-[#234C6A]/8 backdrop-blur">
                <div className="bg-[#234C6A] p-5 text-white">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                      <Headphones className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black">
                        Need a faster answer?
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-white/75">
                        Use live chat for urgent account, application, or
                        recruiter workflow issues.
                      </p>
                      <Button className="mt-4 rounded-2xl bg-white px-5 font-black text-[#234C6A] hover:bg-[#E3E3E3]">
                        Start Live Chat
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">
                  <div className="rounded-2xl border border-[#234C6A]/10 bg-[#F8FAFC] p-4">
                    <Clock className="mb-3 h-5 w-5 text-[#234C6A]" />
                    <p className="font-black text-[#234C6A]">Business Hours</p>
                    <p className="mt-1 text-sm leading-6 text-[#456882]">
                      Mon-Fri, 8am-6pm PST
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[#234C6A]/10 bg-[#F8FAFC] p-4">
                    <MapPin className="mb-3 h-5 w-5 text-[#234C6A]" />
                    <p className="font-black text-[#234C6A]">Headquarters</p>
                    <p className="mt-1 text-sm leading-6 text-[#456882]">
                      123 Business Avenue, San Francisco
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="rounded-3xl border border-[#234C6A]/10 bg-white/90 p-6 shadow-sm backdrop-blur">
                <h3 className="mb-4 flex items-center gap-2 text-xl font-black text-[#234C6A]">
                  <Globe className="h-5 w-5" />
                  Office Network
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {offices.map((office) => (
                    <div
                      key={office.city}
                      className="rounded-2xl border border-[#234C6A]/10 bg-[#F8FAFC] p-4"
                    >
                      <p className="font-black text-[#234C6A]">{office.city}</p>
                      <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-[#456882]">
                        {office.type}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[#456882]">
                        {office.address}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
