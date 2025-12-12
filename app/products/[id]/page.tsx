// app/products/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import ProductImageGallery from "@/components/ProductImageGallery";
import { notFound } from "next/navigation";

interface ProductPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params;
    const productId = parseInt(id);

    if (isNaN(productId)) return notFound();

    // Fetch product with variants
    const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
            variants: true,
            category: true,
        },
    });

    if (!product) return notFound();

    // Convert Decimal to Number for the client component
    const formattedProduct = {
        ...product,
        basePrice: Number(product.basePrice),
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <ProductImageGallery product={formattedProduct} />
        </div>
    );
}