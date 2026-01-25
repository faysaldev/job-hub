"use client";

import { useEffect, useRef } from "react";
import { Card } from "@/src/components/ui/card";
import { Star, Quote, Verified } from "lucide-react";
import gsap from "gsap";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Software Engineer",
    company: "Google",
    avatar: "SJ",
    rating: 5,
    quote: "JobHub helped me land my dream role at a top tech company. The resume analyzer was incredibly helpful in highlighting areas for improvement.",
    highlight: "Hired in 2 weeks",
  },
  {
    name: "Michael Chen",
    role: "Product Manager",
    company: "Meta",
    avatar: "MC",
    rating: 5,
    quote: "The skill analyzer helped me identify key skills I needed to develop. Within 3 months, I was promoted to Senior PM at my company.",
    highlight: "Got promoted",
  },
  {
    name: "Emma Rodriguez",
    role: "UX Designer",
    company: "Apple",
    avatar: "ER",
    rating: 5,
    quote: "The personalized job recommendations saved me hours of searching. I found my perfect role in just 2 weeks!",
    highlight: "Perfect match",
  },
];

const TestimonialsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".testimonial-header",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".testimonial-header",
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        ".testimonial-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".testimonial-card",
            start: "top 85%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-[#E3E3E3] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-[#234C6A]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#456882]/5 rounded-full blur-3xl" />
      </div>

      <div className="container px-4">
        <div className="testimonial-header text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#234C6A]/10 rounded-full mb-4">
            <Quote className="h-4 w-4 text-[#234C6A]" />
            <span className="text-sm font-medium text-[#234C6A]">Testimonials</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#234C6A]">
            Success Stories
          </h2>
          <p className="text-lg text-[#456882]">
            Hear from job seekers who found their dream careers through JobHub
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <Card
              key={i}
              className="testimonial-card p-8 bg-white border-none shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl relative overflow-hidden group"
            >
              {/* Highlight badge */}
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  <Verified className="h-3 w-3" />
                  {testimonial.highlight}
                </span>
              </div>

              {/* Quote icon */}
              <div className="mb-6">
                <Quote className="h-10 w-10 text-[#234C6A]/10" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <Star
                    key={j}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-[#234C6A] mb-6 leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-[#E3E3E3]">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#234C6A] to-[#456882] flex items-center justify-center text-white font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-[#234C6A]">{testimonial.name}</h4>
                  <p className="text-sm text-[#456882]">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>

              {/* Hover effect gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#234C6A] to-[#456882] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;