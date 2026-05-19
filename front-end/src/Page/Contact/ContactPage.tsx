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
  CheckCircle,
  ArrowRight,
  Building2,
  Sparkles,
  Briefcase,
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

  const faqs = [
    {
      question: "How quickly will I receive a response?",
      answer:
        "Our team typically responds within 24 hours during business days.",
    },
    {
      question: "Do you offer enterprise solutions?",
      answer: "Yes! Contact our sales team for custom enterprise packages.",
    },
    {
      question: "Where are your offices located?",
      answer:
        "Our headquarters is in San Francisco, with offices in New York, London, and Singapore.",
    },
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
        className="relative overflow-hidden bg-[#234C6A] pt-32 pb-28 md:pt-40 md:pb-32"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:64px_64px]" />
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="absolute left-8 top-28 hidden h-28 w-64 rotate-[-8deg] rounded-[2rem] border border-white/10 bg-white/5 lg:block" />
          <div className="absolute bottom-14 right-10 hidden h-32 w-72 rotate-[7deg] rounded-[2rem] border border-white/10 bg-white/5 lg:block" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="hero-content mx-auto max-w-5xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white/90 backdrop-blur-sm">
              <Headphones className="h-4 w-4" />
              <span>JobHub Support Desk</span>
            </div>

            <h1 className="mx-auto max-w-4xl text-4xl font-black tracking-tight text-white md:text-6xl">
              Let&apos;s solve your next hiring or career question.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg font-medium leading-8 text-white/75">
              Talk with the team behind your job portal experience. We help
              candidates, recruiters, partners, and growing teams move faster.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { icon: Clock, label: "24h Response" },
                { icon: Shield, label: "Verified Support" },
                { icon: Users, label: "For Hiring Teams" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-black uppercase tracking-wide text-white/90 backdrop-blur-sm"
                >
                  <Icon className="mr-2 inline h-4 w-4" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-20 -mt-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {contactMethods.map((method) => (
              <Card
                key={method.title}
                className="contact-card group relative h-full overflow-hidden rounded-3xl border border-[#234C6A]/10 bg-white/95 p-6 shadow-xl shadow-[#234C6A]/8 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-[#234C6A]/25 hover:shadow-2xl hover:shadow-[#234C6A]/12"
              >
                <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#234C6A] to-[#456882] transition-transform duration-300 group-hover:scale-x-100" />
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg shadow-[#234C6A]/15 ${method.color}`}
                  >
                    {method.icon}
                  </div>
                  <ArrowRight className="h-5 w-5 text-[#456882]/45 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#234C6A]" />
                </div>
                <h3 className="text-lg font-black tracking-tight text-[#234C6A]">
                  {method.title}
                </h3>
                <p className="mt-2 min-h-[44px] text-sm leading-6 text-[#456882]">
                  {method.description}
                </p>
                <div className="mt-5 border-t border-[#E3E3E3]/70 pt-4">
                  <p className="font-black text-[#234C6A]">{method.primary}</p>
                  <p className="mt-1 text-sm font-medium text-[#456882]">
                    {method.secondary}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <main className="flex-1">
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-6">
            <div className="mb-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#234C6A]/10 bg-[#234C6A]/5 px-4 py-2 text-xs font-black uppercase tracking-widest text-[#234C6A]">
                  <Briefcase className="h-4 w-4" />
                  Contact JobHub
                </div>
                <h2 className="text-3xl font-black tracking-tight text-[#234C6A] md:text-5xl">
                  Premium support for a smarter job marketplace.
                </h2>
              </div>
              <p className="max-w-2xl text-base font-medium leading-8 text-[#456882] lg:justify-self-end">
                Choose a department, share the details, and our team will route
                your message to the right specialist without changing your
                existing backend flow.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div ref={formRef} className="form-container">
                <Card className="relative overflow-hidden rounded-3xl border border-[#234C6A]/10 bg-white/95 shadow-2xl shadow-[#234C6A]/10 backdrop-blur-xl">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#234C6A] to-[#456882]" />
                  <div className="border-b border-[#E3E3E3]/70 bg-gradient-to-r from-[#234C6A]/8 to-[#456882]/8 p-6 md:p-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-[#456882]">
                          Send a message
                        </p>
                        <h3 className="mt-2 text-2xl font-black text-[#234C6A]">
                          Tell us how we can help
                        </h3>
                      </div>
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#234C6A] text-white shadow-lg shadow-[#234C6A]/20">
                        <Send className="h-6 w-6" />
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6 p-6 md:p-8">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
                <Card className="overflow-hidden rounded-3xl border border-[#234C6A]/10 bg-white/90 shadow-xl shadow-[#234C6A]/8 backdrop-blur">
                  <div className="bg-[#234C6A] p-6 text-white">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                      <Globe className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-black">Global presence</h3>
                    <p className="mt-2 text-sm leading-6 text-white/75">
                      Connect with the closest JobHub team for platform,
                      employer, and candidate support.
                    </p>
                  </div>

                  <div className="divide-y divide-[#E3E3E3]/70">
                    {offices.map((office) => (
                      <div
                        key={office.city}
                        className="group flex gap-4 p-5 transition-colors hover:bg-[#234C6A]/5"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#234C6A]/10 text-[#234C6A] transition group-hover:bg-[#234C6A] group-hover:text-white">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-black text-[#234C6A]">
                              {office.city}
                            </h4>
                            <span className="rounded-full bg-[#E3E3E3]/70 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#456882]">
                              {office.type}
                            </span>
                          </div>
                          <p className="mt-1 text-sm leading-6 text-[#456882]">
                            {office.address}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="rounded-3xl border border-[#234C6A]/10 bg-white/90 p-6 shadow-sm backdrop-blur">
                  <h3 className="mb-5 flex items-center gap-2 text-xl font-black text-[#234C6A]">
                    <Sparkles className="h-5 w-5" />
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-3">
                    {faqs.map((faq) => (
                      <div
                        key={faq.question}
                        className="rounded-2xl border border-[#234C6A]/8 bg-[#F8FAFC] p-4"
                      >
                        <h4 className="font-black text-[#234C6A]">
                          {faq.question}
                        </h4>
                        <p className="mt-2 text-sm leading-6 text-[#456882]">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="relative overflow-hidden rounded-3xl border-none bg-gradient-to-br from-[#234C6A] to-[#456882] p-6 text-white shadow-xl shadow-[#234C6A]/20">
                  <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-[3rem] bg-white/10" />
                  <div className="relative">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                      <Headphones className="h-6 w-6" />
                    </div>
                    <h4 className="text-xl font-black">Need immediate help?</h4>
                    <p className="mt-2 text-sm leading-6 text-white/78">
                      Our support team is available for urgent account,
                      application, and recruiter workflow questions.
                    </p>
                    <Button className="mt-5 rounded-2xl bg-white px-5 font-black text-[#234C6A] hover:bg-[#E3E3E3]">
                      Start Live Chat
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              </aside>
            </div>
          </div>
        </section>

        <section className="bg-[#E3E3E3]/70 py-16 md:py-20">
          <div className="container mx-auto px-6">
            <div className="mb-10 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#234C6A]/10 bg-white/70 px-4 py-2 text-xs font-black uppercase tracking-widest text-[#234C6A]">
                <MapPin className="h-4 w-4" />
                Find Us
              </div>
              <h2 className="text-3xl font-black tracking-tight text-[#234C6A] md:text-5xl">
                Visit our headquarters
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-8 text-[#456882]">
                We would love to meet you in person. Schedule a visit to our
                San Francisco office.
              </p>
            </div>

            <Card className="overflow-hidden rounded-3xl border border-[#234C6A]/10 bg-white shadow-2xl shadow-[#234C6A]/10">
              <div className="relative min-h-[420px] overflow-hidden bg-[#234C6A]">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:56px_56px]" />
                <div className="absolute left-[12%] top-[20%] h-4 w-4 rounded-full bg-white shadow-[0_0_0_12px_rgba(255,255,255,0.08)]" />
                <div className="absolute right-[18%] top-[28%] h-3 w-3 rounded-full bg-white/70 shadow-[0_0_0_10px_rgba(255,255,255,0.06)]" />
                <div className="absolute bottom-[18%] left-[22%] h-3 w-3 rounded-full bg-white/70 shadow-[0_0_0_10px_rgba(255,255,255,0.06)]" />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />

                <div className="relative z-10 flex min-h-[420px] items-center justify-center p-6 text-center text-white">
                  <div className="max-w-xl">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 backdrop-blur">
                      <MapPin className="h-10 w-10" />
                    </div>
                    <h3 className="text-3xl font-black md:text-4xl">
                      JobHub Headquarters
                    </h3>
                    <p className="mt-4 text-xl font-semibold text-white/85">
                      123 Business Avenue
                    </p>
                    <p className="mt-1 text-lg text-white/70">
                      San Francisco, CA 94107
                    </p>
                    <Button className="mt-7 rounded-2xl bg-white px-6 font-black text-[#234C6A] hover:bg-[#E3E3E3]">
                      Get Directions
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
