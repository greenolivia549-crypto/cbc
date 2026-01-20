"use client";

import TrendingSlider from "@/components/home/TrendingSlider";
import ArticleGrid from "@/components/home/ArticleGrid";
import SideMenu from "@/components/layout/SideMenu";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <TrendingSlider />

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left Column: Articles */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-primary">Latest Articles</h2>
              <button className="text-sm font-medium text-primary hover:underline">
                View All
              </button>
            </div>

            <ArticleGrid />
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-1">
            <SideMenu />
          </div>
        </div>
      </div>
    </div>
  );
}
