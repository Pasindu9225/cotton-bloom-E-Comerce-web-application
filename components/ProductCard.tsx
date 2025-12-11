// components/ProductCard.tsx
import Image from "next/image";
import Link from "next/link";
import { Product, Category } from "@prisma/client";

interface ProductCardProps {
    product: Product & { category: Category | null };
}

export default function ProductCard({ product }: ProductCardProps) {
    // Use the first image or a placeholder
    const mainImage = product.images[0] || "/placeholder.jpg";

    return (
        <Link href={`/products/${product.id}`} className="group block space-y-3">
            {/* Image Container */}
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                <Image
                    src={mainImage}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized // Keeps it fast for now
                />

                {/* 'New' Badge (Logic: Created in last 7 days) */}
                {new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                    <div className="absolute top-2 left-2 px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-black text-white dark:bg-white dark:text-black rounded-sm">
                        New
                    </div>
                )}
            </div>

            {/* Details */}
            <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:underline decoration-1 underline-offset-4">
                    {product.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {product.category?.name || "Apparel"}
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Rs{Number(product.basePrice).toFixed(2)}
                </p>
            </div>
        </Link>
    );
}