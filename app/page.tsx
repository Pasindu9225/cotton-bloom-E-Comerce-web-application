// app/page.tsx
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Fetch the 4 newest products
async function getNewArrivals() {
  return await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
}

export default async function HomePage() {
  const newArrivals = await getNewArrivals();

  return (
    <div className="space-y-12 pb-12">

      {/* 1. HERO SECTION */}
      <section className="relative h-[80vh] w-full flex items-center justify-center bg-gray-100 dark:bg-gray-900 overflow-hidden">
        {/* You can replace this div with an <Image /> later */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900" />

        <div className="relative z-10 text-center space-y-6 px-4 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-black dark:text-white">
            COTTON BLOOM
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
            Premium apparel crafted for comfort. Experience the touch of true quality.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link
              href="/new-arrivals"
              className="px-8 py-4 bg-black text-white dark:bg-white dark:text-black rounded-full font-bold text-sm hover:opacity-90 transition-opacity"
            >
              Shop New Arrivals
            </Link>
            <Link
              href="/men"
              className="px-8 py-4 bg-white text-black border border-gray-200 dark:bg-black dark:text-white dark:border-gray-800 rounded-full font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              Shop Men
            </Link>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY SPLIT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-4">
          <Link href="/men" className="group relative h-96 overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
            <span className="relative text-3xl font-bold text-black dark:text-white group-hover:scale-110 transition-transform">
              Men's Collection
            </span>
          </Link>
          <Link href="/women" className="group relative h-96 overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
            <span className="relative text-3xl font-bold text-black dark:text-white group-hover:scale-110 transition-transform">
              Women's Collection
            </span>
          </Link>
        </div>
      </section>

      {/* 3. NEW ARRIVALS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-black dark:text-white">New Arrivals</h2>
          <Link href="/new-arrivals" className="flex items-center gap-1 text-sm font-medium hover:underline">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

    </div>
  );
}