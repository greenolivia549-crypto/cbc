import TrendingSlider from "@/components/home/TrendingSlider";
import ArticleGrid from "@/components/home/ArticleGrid";
import SideMenu from "@/components/layout/SideMenu";
import Link from "next/link";
import { getPosts, getFeaturedPosts, getPopularPosts } from "@/lib/posts";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const [latestData, featuredPosts, popularPosts] = await Promise.all([
    getPosts({ limit: 9 }),
    getFeaturedPosts(), // Fetch featured posts specifically
    getPopularPosts()
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <TrendingSlider posts={featuredPosts} />

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left Column: Articles */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-primary">Latest Articles</h2>
              <Link href="/blog" className="text-sm font-medium text-primary hover:underline">
                View All
              </Link>
            </div>

            <ArticleGrid initialPosts={latestData.posts} />
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-1">
            <SideMenu popularPosts={popularPosts} />
          </div>
        </div>
      </div>
    </div>
  );
}
