// app/admin/products/[id]/edit/page.tsx
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/ProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

interface EditProductPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
    // 1. Await params to get the ID
    const resolvedParams = await params;
    const productId = parseInt(resolvedParams.id);

    if (isNaN(productId)) return notFound();

    // 2. Fetch the product AND categories
    const [product, categories] = await Promise.all([
        prisma.product.findUnique({
            where: { id: productId },
            include: { variants: true },
        }),
        prisma.category.findMany(),
    ]);

    // 3. If product doesn't exist, show 404
    if (!product) return notFound();

    // 👇 FIX: Convert the Prisma 'Decimal' to a plain Javascript 'Number'
    // Client Components cannot read Prisma Decimals, so we convert it here.
    const formattedProduct = {
        ...product,
        basePrice: Number(product.basePrice)
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/products" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <ArrowLeft className="h-5 w-5 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-black dark:text-white">
                        Edit Product
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Update details for <span className="font-semibold">{product.name}</span>
                    </p>
                </div>
            </div>

            {/* 4. Render Form with SAFE Initial Data */}
            <ProductForm categories={categories} initialData={formattedProduct} />
        </div>
    );
}