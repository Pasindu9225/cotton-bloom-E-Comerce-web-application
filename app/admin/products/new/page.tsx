// app/admin/products/new/page.tsx
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/ProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function AddProductPage() {
    const categories = await prisma.category.findMany();

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/admin/products" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <ArrowLeft className="h-5 w-5 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-black dark:text-white">Add New Product</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Admin Panel: Upload 3 images for the product.</p>
                </div>
            </div>

            <ProductForm categories={categories} />
        </div>
    );
}