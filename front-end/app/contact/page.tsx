"use client";
import { useState } from "react";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "@/src/hooks/use-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would send the form data to a backend
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you soon.",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#E3E3E3]">
      {/* Hero Section */}
      <div className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#234C6A]/10 to-[#456882]/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-[#234C6A] mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-[#234C6A]/80 mb-8">
              Have questions or feedback? We{`'`}d love to hear from you
            </p>
          </div>
        </div>
      </div>

      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-[#234C6A] mb-8">
                Contact Information
              </h2>
              <div className="space-y-6">
                <Card className="p-6 border-[#456882]/30 bg-white flex items-start gap-4">
                  <div className="bg-[#234C6A]/10 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-[#234C6A]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#234C6A] mb-1">Email</h3>
                    <p className="text-[#234C6A]/80">support@jobhub.com</p>
                    <p className="text-[#234C6A]/80">info@jobhub.com</p>
                  </div>
                </Card>

                <Card className="p-6 border-[#456882]/30 bg-white flex items-start gap-4">
                  <div className="bg-[#234C6A]/10 p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-[#234C6A]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#234C6A] mb-1">Phone</h3>
                    <p className="text-[#234C6A]/80">+1 (555) 123-4567</p>
                    <p className="text-[#234C6A]/80">+1 (555) 987-6543</p>
                  </div>
                </Card>

                <Card className="p-6 border-[#456882]/30 bg-white flex items-start gap-4">
                  <div className="bg-[#234C6A]/10 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-[#234C6A]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#234C6A] mb-1">Office</h3>
                    <p className="text-[#234C6A]/80">123 Business Avenue</p>
                    <p className="text-[#234C6A]/80">San Francisco, CA 94107</p>
                  </div>
                </Card>
              </div>

              <div className="mt-10">
                <h3 className="text-2xl font-bold text-[#234C6A] mb-4">
                  Business Hours
                </h3>
                <Card className="p-6 border-[#456882]/30 bg-white">
                  <ul className="space-y-2">
                    <li className="flex justify-between border-b border-[#456882]/20 pb-2">
                      <span className="text-[#234C6A]">Monday - Friday</span>
                      <span className="text-[#234C6A]/80">
                        9:00 AM - 6:00 PM
                      </span>
                    </li>
                    <li className="flex justify-between border-b border-[#456882]/20 pb-2">
                      <span className="text-[#234C6A]">Saturday</span>
                      <span className="text-[#234C6A]/80">
                        10:00 AM - 4:00 PM
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-[#234C6A]">Sunday</span>
                      <span className="text-[#234C6A]/80">Closed</span>
                    </li>
                  </ul>
                </Card>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-[#234C6A] mb-8">
                Send us a Message
              </h2>
              <Card className="p-8 border-[#456882]/30 bg-white">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-[#234C6A]">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="border-[#234C6A]/30 focus:border-[#234C6A] focus:ring-[#234C6A]"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[#234C6A]">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="border-[#234C6A]/30 focus:border-[#234C6A] focus:ring-[#234C6A]"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-[#234C6A]">
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="border-[#234C6A]/30 focus:border-[#234C6A] focus:ring-[#234C6A]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-[#234C6A]">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      className="border-[#234C6A]/30 focus:border-[#234C6A] focus:ring-[#234C6A]"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white"
                  >
                    <Send className="mr-2 h-4 w-4" /> Send Message
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="py-10 bg-[#E3E3E3]">
        <div className="container mx-auto px-4">
          <Card className="p-0 border-[#456882]/30 overflow-hidden">
            <div className="aspect-w-16 aspect-h-9 h-96 bg-gradient-to-br from-[#234C6A] to-[#456882] flex items-center justify-center">
              <div className="text-white text-center p-6">
                <MapPin className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold">Visit Our Office</h3>
                <p className="mt-2">
                  123 Business Avenue, San Francisco, CA 94107
                </p>
                <p className="mt-4">We{`'`}d love to meet you in person!</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
