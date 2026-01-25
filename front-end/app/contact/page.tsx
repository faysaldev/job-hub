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
} from "lucide-react";
import { toast } from "@/src/hooks/use-toast";
import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import gsap from "gsap";

export default function ContactPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    department: "general",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-content",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );

      gsap.fromTo(
        ".contact-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.3,
        }
      );

      gsap.fromTo(
        ".form-container",
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power3.out", delay: 0.4 }
      );

      gsap.fromTo(
        ".info-container",
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power3.out", delay: 0.4 }
      );
    });

    return () => ctx.revert();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Message Sent Successfully!",
      description: "Thank you for reaching out. Our team will respond within 24 hours.",
    });
    setFormData({ name: "", email: "", subject: "", message: "", department: "general" });
    setIsSubmitting(false);
  };

  const contactMethods = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Us",
      description: "Our team is here to help",
      primary: "support@jobhub.com",
      secondary: "enterprise@jobhub.com",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Call Us",
      description: "Mon-Fri from 8am to 6pm PST",
      primary: "+1 (555) 123-4567",
      secondary: "+1 (555) 987-6543",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Visit Us",
      description: "Come say hello at our HQ",
      primary: "123 Business Avenue",
      secondary: "San Francisco, CA 94107",
      color: "from-purple-500 to-violet-500",
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Live Chat",
      description: "Available 24/7",
      primary: "Start a conversation",
      secondary: "Average response: 2 min",
      color: "from-[#234C6A] to-[#456882]",
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
      answer: "Our team typically responds within 24 hours during business days.",
    },
    {
      question: "Do you offer enterprise solutions?",
      answer: "Yes! Contact our sales team for custom enterprise packages.",
    },
    {
      question: "Where are your offices located?",
      answer: "Our headquarters is in San Francisco, with offices in New York, London, and Singapore.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#E3E3E3]">
      <Header />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden bg-gradient-to-br from-[#234C6A] via-[#2d5a7a] to-[#456882]"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="hero-content max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm mb-8 border border-white/20">
              <Headphones className="h-4 w-4" />
              <span>We are Here to Help</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Get in Touch
              <span className="block mt-2 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                We Would Love to Hear From You
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-2xl mx-auto">
              Have questions about our platform? Need help with your account?
              Our dedicated team is ready to assist you.
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-white/90">
              {[
                { icon: <Clock className="h-5 w-5" />, text: "24/7 Support" },
                { icon: <Globe className="h-5 w-5" />, text: "Global Team" },
                { icon: <CheckCircle className="h-5 w-5" />, text: "Fast Response" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="#E3E3E3"
            />
          </svg>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-16 -mt-10 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <Card
                key={index}
                className="contact-card p-6 border-none bg-white shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${method.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  {method.icon}
                </div>
                <h3 className="text-lg font-bold text-[#234C6A] mb-1">
                  {method.title}
                </h3>
                <p className="text-sm text-[#456882] mb-3">{method.description}</p>
                <p className="text-[#234C6A] font-semibold">{method.primary}</p>
                <p className="text-[#456882] text-sm">{method.secondary}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div ref={formRef} className="form-container">
              <div className="mb-8">
                <span className="inline-block px-4 py-1 bg-[#234C6A]/10 text-[#234C6A] rounded-full text-sm font-semibold mb-4">
                  Send a Message
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-[#234C6A] mb-4">
                  How Can We Help?
                </h2>
                <p className="text-[#456882]">
                  Fill out the form below and we will get back to you as soon as possible.
                </p>
              </div>

              <Card className="p-8 border-none bg-[#E3E3E3]/30 shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-[#234C6A] font-semibold">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="border-[#234C6A]/20 focus:border-[#234C6A] focus:ring-[#234C6A] bg-white h-12 rounded-xl"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[#234C6A] font-semibold">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="border-[#234C6A]/20 focus:border-[#234C6A] focus:ring-[#234C6A] bg-white h-12 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-[#234C6A] font-semibold">
                      Department
                    </Label>
                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full h-12 px-4 border border-[#234C6A]/20 rounded-xl bg-white text-[#234C6A] focus:border-[#234C6A] focus:ring-1 focus:ring-[#234C6A] focus:outline-none"
                    >
                      {departments.map((dept) => (
                        <option key={dept.value} value={dept.value}>
                          {dept.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-[#234C6A] font-semibold">
                      Subject *
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="How can we help you?"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="border-[#234C6A]/20 focus:border-[#234C6A] focus:ring-[#234C6A] bg-white h-12 rounded-xl"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-[#234C6A] font-semibold">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us more about your inquiry..."
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      className="border-[#234C6A]/20 focus:border-[#234C6A] focus:ring-[#234C6A] bg-white rounded-xl resize-none"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white h-14 rounded-xl text-lg font-semibold group"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        Send Message
                        <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </Button>
                </form>
              </Card>
            </div>

            {/* Right Column - Info */}
            <div ref={infoRef} className="info-container space-y-8">
              {/* Office Locations */}
              <div>
                <span className="inline-block px-4 py-1 bg-[#234C6A]/10 text-[#234C6A] rounded-full text-sm font-semibold mb-4">
                  Our Offices
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-[#234C6A] mb-6">
                  Global Presence
                </h2>

                <div className="space-y-4">
                  {[
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
                  ].map((office, index) => (
                    <Card
                      key={index}
                      className="p-5 border-none bg-[#E3E3E3]/50 hover:bg-[#E3E3E3] transition-colors duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#234C6A] to-[#456882] flex items-center justify-center text-white flex-shrink-0">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-[#234C6A]">{office.city}</h4>
                            <span className="text-xs px-2 py-0.5 bg-[#234C6A]/10 text-[#234C6A] rounded-full">
                              {office.type}
                            </span>
                          </div>
                          <p className="text-[#456882] text-sm">{office.address}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* FAQs */}
              <div className="pt-8">
                <h3 className="text-xl font-bold text-[#234C6A] mb-6 flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <Card
                      key={index}
                      className="p-5 border-none bg-[#E3E3E3]/50"
                    >
                      <h4 className="font-semibold text-[#234C6A] mb-2">{faq.question}</h4>
                      <p className="text-[#456882] text-sm">{faq.answer}</p>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Quick Support CTA */}
              <Card className="p-6 border-none bg-gradient-to-br from-[#234C6A] to-[#456882] text-white">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Headphones className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Need Immediate Help?</h4>
                    <p className="text-white/80 text-sm mb-4">
                      Our support team is available 24/7 to assist you with any urgent inquiries.
                    </p>
                    <Button
                      variant="outline"
                      className="border-white text-white hover:bg-white/10 group"
                    >
                      Start Live Chat
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-[#E3E3E3]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-[#234C6A]/10 text-[#234C6A] rounded-full text-sm font-semibold mb-4">
              Find Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#234C6A] mb-4">
              Visit Our Headquarters
            </h2>
            <p className="text-[#456882] max-w-2xl mx-auto">
              We would love to meet you in person. Schedule a visit to our San Francisco office.
            </p>
          </div>

          <Card className="border-none overflow-hidden shadow-2xl">
            <div className="aspect-video bg-gradient-to-br from-[#234C6A] to-[#456882] relative">
              {/* Map placeholder with styled design */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
                    <MapPin className="h-10 w-10" />
                  </div>
                  <h3 className="text-3xl font-bold mb-2">JobHub Headquarters</h3>
                  <p className="text-xl text-white/80 mb-2">123 Business Avenue</p>
                  <p className="text-lg text-white/70 mb-6">San Francisco, CA 94107</p>
                  <Button className="bg-white text-[#234C6A] hover:bg-[#E3E3E3]">
                    Get Directions
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full" />
              <div className="absolute bottom-10 right-10 w-48 h-48 border border-white/10 rounded-full" />
              <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-white/5 rounded-full blur-xl" />
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
