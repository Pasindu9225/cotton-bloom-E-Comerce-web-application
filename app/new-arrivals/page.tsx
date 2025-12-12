// app/new-arrivals/page.tsx
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

async function getNewArrivals() {
    const products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        include: { category: true },
        take: 50,
    });

    return products.map((p) => ({
        ...p,
        basePrice: Number(p.basePrice),
    }));
}

export default async function NewArrivalsPage() {
    const products = await getNewArrivals();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-black dark:text-white">New Arrivals</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    The latest trends, just in.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product as any} />
                ))}
            </div>
        </div>
    );
}