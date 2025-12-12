import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Leaf, ShieldCheck, Truck } from "lucide-react";

export const dynamic = "force-dynamic";

async function getNewArrivals() {
  const products = await prisma.product.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return products.map((p) => ({
    ...p,
    basePrice: Number(p.basePrice),
  }));
}

export default async function HomePage() {
  const newArrivals = await getNewArrivals();

  return (
    <div className="pb-20 bg-white dark:bg-black">

      {/* 1. HERO SECTION */}
      <section className="relative h-[85vh] w-full bg-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero-1.png"
            alt="Cotton Bloom Hero"
            fill
            className="object-cover opacity-70"
            priority
            unoptimized
          />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10 space-y-6">
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white text-sm font-medium">
            New Collection 2025
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white drop-shadow-xl max-w-4xl">
            PURE COMFORT, <br /> NATURALLY.
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 max-w-2xl drop-shadow-md">
            Premium apparel crafted for everyday luxury. Experience the touch of true quality.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href="/new-arrivals"
              className="px-8 py-4 bg-white text-black rounded-full font-bold text-sm hover:scale-105 transition-transform flex items-center justify-center gap-2"
            >
              Shop New Arrivals <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/men"
              className="px-8 py-4 bg-transparent border border-white text-white rounded-full font-bold text-sm hover:bg-white/10 transition-colors"
            >
              Shop Men
            </Link>
          </div>
        </div>
      </section>

      {/* 2. FEATURES (CENTERED) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-b border-gray-100 dark:border-gray-800 text-center">
          {/* Item 1 */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-full">
              <Leaf className="h-6 w-6" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="font-bold text-lg">100% Organic</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Sustainably sourced materials</p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="font-bold text-lg">Premium Quality</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Durability guaranteed</p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-full">
              <Truck className="h-6 w-6" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="font-bold text-lg">Fast Shipping</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">3-5 business days global</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY SPLIT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-6">
          {/* MEN'S CATEGORY */}
          <Link href="/men" className="group relative h-[450px] overflow-hidden rounded-3xl flex items-center justify-center text-center">
            <Image
              src="/hero-2.png"
              alt="Men's Collection"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-500" />

            <div className="relative z-10 p-8">
              <span className="text-white/90 text-sm font-bold tracking-widest uppercase mb-3 block">Collection</span>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">MEN</h2>
              <span className="inline-block px-6 py-3 bg-white text-black rounded-full font-bold text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                Shop Now
              </span>
            </div>
          </Link>

          {/* WOMEN'S CATEGORY */}
          <Link href="/women" className="group relative h-[450px] overflow-hidden rounded-3xl flex items-center justify-center text-center">
            <Image
              src="/hero-3.png"
              alt="Women's Collection"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-500" />

            <div className="relative z-10 p-8">
              <span className="text-white/90 text-sm font-bold tracking-widest uppercase mb-3 block">Collection</span>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">WOMEN</h2>
              <span className="inline-block px-6 py-3 bg-white text-black rounded-full font-bold text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                Shop Now
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* 4. NEW ARRIVALS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-black dark:text-white">Latest Drops</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Fresh styles just for you.</p>
          </div>
          <Link href="/new-arrivals" className="hidden sm:flex items-center gap-2 text-sm font-medium border-b border-black dark:border-white pb-1 hover:opacity-70 transition-opacity">
            View All Products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>

        <div className="mt-12 text-center sm:hidden">
          <Link href="/new-arrivals" className="inline-block px-8 py-4 border-2 border-black dark:border-white rounded-full font-bold text-sm">
            View All Products
          </Link>
        </div>
      </section>

      {/* 5. NEWSLETTER */}
      <section className="mt-16 py-24 bg-black dark:bg-gray-900 text-white">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">Join the Community</h2>
          <p className="text-gray-300 text-lg">
            Subscribe to receive updates, access to exclusive deals, and early access to new drops.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white transition-all"
            />
            <button className="px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}