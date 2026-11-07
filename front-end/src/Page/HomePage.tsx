"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/src/components/common/Header";
import Footer from "@/src/components/common/Footer";
import { jobCategories } from "@/src/lib/jobCategories";
import { useGetDiscoveryQuery } from "@/src/redux/features/generals/generalsApi";
import HeroSection from "@/src/components/home/HeroSection";
import TrustedBySection from "@/src/components/home/TrustedBySection";
import CategorySection from "@/src/components/home/CategorySection";
import WhySection from "@/src/components/home/WhySection";
import LatestJobsSection from "@/src/components/home/LatestJobsSection";
import StepsSection from "@/src/components/home/StepsSection";
import PathsSection from "@/src/components/home/PathsSection";
import CTASection from "@/src/components/home/CTASection";
import { ErrorState } from "@/src/components/feedback/StateViews";
import { PageLoading } from "@/src/components/feedback/LoadingStates";

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: discovery, isLoading, isError, refetch } = useGetDiscoveryQuery();
  const categories = useMemo(() => jobCategories.map((category) => ({
    ...category,
    // Never show demo counts from jobCategories.ts as if they were live totals.
    count: discovery?.categoryStats.find((stat) => stat.category === category.id)?.count ?? 0,
  })), [discovery]);
  const jobs = discovery?.topJobs ?? [];
  const totalCategoryJobs = categories.reduce((sum, category) => sum + category.count, 0);
  const search = (term = searchQuery) => {
    const value = term.trim();
    router.push(value ? `/job?s=${encodeURIComponent(value)}` : "/job");
  };
  return <div className="jh-public">
    <Header />
    <main id="main-content">
      <HeroSection searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        onSearch={() => search()} onTrendingClick={search}
        heroJobs={jobs.slice(0, 3)} isLoading={isLoading}
        totalCategoryJobs={totalCategoryJobs} />
      <TrustedBySection />
      {isError ? <div className="jh-container py-10"><ErrorState title="Job listings are temporarily unavailable" description="The rest of JobHub is still available. Retry to load the latest opportunities." onRetry={() => { void refetch(); }} /></div>
        : isLoading ? <PageLoading heading="Loading open roles" cards={3} />
          : <><CategorySection categories={categories} />{jobs.length > 0 && <LatestJobsSection jobs={jobs} />}</>}
      <WhySection />
      <StepsSection />
      <PathsSection />
      <CTASection />
    </main>
    <Footer />
  </div>;
}
