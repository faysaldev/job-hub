"use client";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Mail, Phone, MapPin, Users, Target, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#E3E3E3]">
      {/* Hero Section */}
      <div className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#234C6A]/10 to-[#456882]/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-[#234C6A] mb-6">
              About JobHub
            </h1>
            <p className="text-xl text-[#234C6A]/80 mb-8">
              Connecting talented professionals with the right opportunities
              since 2020
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#234C6A] mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-[#234C6A]/80 mb-4">
                At JobHub, we{`'`}re passionate about connecting talented
                individuals with companies that value their skills. Our platform
                is designed to streamline the hiring process for both job
                seekers and employers.
              </p>
              <p className="text-lg text-[#234C6A]/80 mb-6">
                We believe that finding the right opportunity should be simple,
                transparent, and rewarding for everyone involved.
              </p>
              <Button className="bg-gradient-to-r from-[#234C6A] to-[#456882] hover:from-[#234C6A]/90 hover:to-[#456882]/90 text-white">
                Learn More About Us
              </Button>
            </div>
            <div className="flex justify-center">
              <Card className="p-8 border-[#456882]/30 bg-white shadow-xl">
                <div className="aspect-w-16 aspect-h-9">
                  <div className="bg-gradient-to-br from-[#234C6A] to-[#456882] rounded-lg w-full h-64 flex items-center justify-center">
                    <div className="text-white text-center p-4">
                      <Target className="h-16 w-16 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold">Our Vision</h3>
                      <p className="mt-2">
                        Creating meaningful connections in the professional
                        world
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-[#E3E3E3]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <Card className="p-8 border-[#456882]/30 bg-white">
              <div className="text-4xl font-bold text-[#234C6A] mb-2">10K+</div>
              <div className="text-[#234C6A]/80">Active Job Seekers</div>
            </Card>
            <Card className="p-8 border-[#456882]/30 bg-white">
              <div className="text-4xl font-bold text-[#234C6A] mb-2">5K+</div>
              <div className="text-[#234C6A]/80">Partner Companies</div>
            </Card>
            <Card className="p-8 border-[#456882]/30 bg-white">
              <div className="text-4xl font-bold text-[#234C6A] mb-2">85%</div>
              <div className="text-[#234C6A]/80">Success Rate</div>
            </Card>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-[#234C6A] text-center mb-16">
            Our Leadership Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Johnson",
                role: "CEO & Founder",
                bio: "With over 15 years in HR technology, Alex founded JobHub to revolutionize job searching.",
              },
              {
                name: "Sarah Williams",
                role: "CTO",
                bio: "Tech visionary focused on building scalable and secure job matching algorithms.",
              },
              {
                name: "Michael Chen",
                role: "Head of Product",
                bio: "Passionate about creating intuitive user experiences for job seekers and employers.",
              },
            ].map((member, index) => (
              <Card
                key={index}
                className="p-6 border-[#456882]/30 bg-white text-center"
              >
                <div className="bg-gradient-to-br from-[#234C6A] to-[#456882] rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                </div>
                <h3 className="text-xl font-bold text-[#234C6A]">
                  {member.name}
                </h3>
                <p className="text-[#456882] mb-2">{member.role}</p>
                <p className="text-[#234C6A]/70">{member.bio}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20 bg-[#E3E3E3]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-[#234C6A] text-center mb-16">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Target className="h-8 w-8" />,
                title: "Integrity",
                description:
                  "We believe in transparent and honest relationships with all our users.",
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: "Community",
                description:
                  "Building a platform where professionals can support each other.",
              },
              {
                icon: <Award className="h-8 w-8" />,
                title: "Excellence",
                description:
                  "We strive to provide the best tools and resources for career growth.",
              },
            ].map((value, index) => (
              <Card key={index} className="p-6 border-[#456882]/30 bg-white">
                <div className="text-[#234C6A] mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-[#234C6A] mb-2">
                  {value.title}
                </h3>
                <p className="text-[#234C6A]/70">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <Card className="p-12 text-center border-[#456882]/30 bg-gradient-to-r from-[#234C6A] to-[#456882] text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Career Journey?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied professionals who have found their
              next opportunity with JobHub
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-[#234C6A] hover:bg-[#E3E3E3]">
                Create Account
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Learn More
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
