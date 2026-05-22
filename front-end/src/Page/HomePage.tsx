/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { jobCategories } from "@/src/lib/jobCategories";
import {
  useGetCategoryStatsQuery,
  useGetTopJobsQuery,
} from "@/src/redux/features/generals/generalsApi";

import HeroSection from "@/src/components/home/HeroSection";
import TrustedBySection from "@/src/components/home/TrustedBySection";
import CategorySection from "@/src/components/home/CategorySection";
import WhySection from "@/src/components/home/WhySection";
import LatestJobsSection from "@/src/components/home/LatestJobsSection";
import StepsSection from "@/src/components/home/StepsSection";
import PathsSection from "@/src/components/home/PathsSection";
import TestimonialsSection from "@/src/components/home/TestimonialsSection";
import CTASection from "@/src/components/home/CTASection";

function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: allTopsJobs } = useGetTopJobsQuery(undefined);
  const { data: categoryStats } = useGetCategoryStatsQuery(undefined);

  const enrichedCategories = useMemo(() => {
    if (!categoryStats || !Array.isArray(categoryStats)) return jobCategories;
    return jobCategories.map((cat) => {
      const stat = categoryStats.find(
        (s: { category: string; count: number }) => s.category === cat.id,
      );
      return stat ? { ...cat, count: stat.count } : cat;
    });
  }, [categoryStats]);

  const topJobs = useMemo(() => {
    if (!allTopsJobs || !Array.isArray(allTopsJobs)) return [];
    return allTopsJobs;
  }, [allTopsJobs]);

  const heroJobs = useMemo(() => topJobs.slice(0, 3), [topJobs]);
  const totalCategoryJobs = useMemo(
    () =>
      enrichedCategories.reduce(
        (sum, category) => sum + (Number(category.count) || 0),
        0,
      ),
    [enrichedCategories],
  );

  const handleSearch = () => {
    const keyword = searchQuery.trim();
    router.push(keyword ? `/job?s=${encodeURIComponent(keyword)}` : "/job");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleTrendingClick = (term: string) => {
    setSearchQuery(term);
    router.push(`/job?s=${encodeURIComponent(term)}`);
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-content > *",
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.75, stagger: 0.12, ease: "power3.out" },
      );

      gsap.fromTo(
        ".hero-panel",
        { opacity: 0, x: 36 },
        { opacity: 1, x: 0, duration: 0.85, ease: "power3.out", delay: 0.2 },
      );

      gsap.utils.toArray(".fade-up").forEach((el: any) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 44 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 86%" },
          },
        );
      });

      gsap.utils.toArray(".stagger-item").forEach((el: any, i: number) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 26 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            delay: i * 0.05,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 88%" },
          },
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [allTopsJobs, categoryStats]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex flex-col jobhub-page-bg"
    >
      <Header />

      <main className="flex-1">
        <HeroSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
          onKeyDown={handleKeyDown}
          onTrendingClick={handleTrendingClick}
          heroJobs={heroJobs}
          topJobsCount={topJobs.length}
          totalCategoryJobs={totalCategoryJobs}
          categoriesCount={enrichedCategories.length}
        />

        <TrustedBySection />

        <CategorySection categories={enrichedCategories} />

        <WhySection />

        {topJobs.length > 0 && <LatestJobsSection jobs={topJobs} />}

        <StepsSection />

        <PathsSection />

        <TestimonialsSection />

        <CTASection />
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;
