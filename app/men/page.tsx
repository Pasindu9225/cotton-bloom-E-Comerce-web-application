// app/men/page.tsx
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

async function getMenProducts() {
    const products = await prisma.product.findMany({
        where: {
            category: { name: "Men" } // Only fetch Men's items
        },
        include: { category: true },
    });

    return products.map((p) => ({
        ...p,
        basePrice: Number(p.basePrice),
    }));
}

export default async function MenPage() {
    const products = await getMenProducts();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-black dark:text-white">Men's Collection</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Essentials for the modern man.
                </p>
            </div>

            {products.length === 0 ? (
                <p className="text-gray-500">No products found in this category yet.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product as any} />
                    ))}
                </div>
            )}
        </div>
    );
}