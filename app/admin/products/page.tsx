// app/admin/products/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Search from "@/components/Search";
import Image from "next/image";
import { deleteProduct } from "@/app/actions/product"; // Import the delete action

async function getProducts(query: string) {
    const products = await prisma.product.findMany({
        where: {
            name: {
                contains: query,
                mode: "insensitive",
            },
        },
        include: {
            category: true,
            variants: true,
        },
        orderBy: { id: 'desc' },
    });

    return products;
}

export default async function AdminProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const params = await searchParams;
    const query = params?.q || "";

    const products = await getProducts(query);

    return (
        <div className="space-y-6 max-w-[1400px]">

            {/* Header & Actions */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">
                    Products
                </h1>
                <div className="flex gap-2">
                    <Search placeholder="Search products..." />

                    <Link
                        href="/admin/products/new"
                        className="flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                    >
                        <Plus className="h-4 w-4" />
                        Add Product
                    </Link>
                </div>
            </div>

            {/* Products Table */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-4 font-medium">Product Name</th>
                                <th className="px-6 py-4 font-medium">Category</th>
                                <th className="px-6 py-4 font-medium">Price</th>
                                <th className="px-6 py-4 font-medium">Total Stock</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        No products found matching "{query}".
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => {
                                    const totalStock = product.variants.reduce((acc, v) => acc + v.stockQuantity, 0);
                                    const isOutOfStock = totalStock === 0;

                                    // Get the first image or use a fallback
                                    const firstImage = product.images[0] || "/placeholder.jpg";

                                    return (
                                        <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">

                                                    {/* Image Box */}
                                                    <div className="relative h-10 w-10 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                                                        <Image
                                                            src={firstImage}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover"
                                                            unoptimized // Keeps it fast in admin panel
                                                        />
                                                    </div>

                                                    <span className="font-medium text-gray-900 dark:text-white">
                                                        {product.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                                {product.category?.name || "Uncategorized"}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                                ${Number(product.basePrice).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                                {totalStock} units
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${isOutOfStock
                                                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                                        }`}
                                                >
                                                    {isOutOfStock ? "Out of Stock" : "Active"}
                                                </span>
                                            </td>

                                            {/* 👇 UPDATED ACTIONS COLUMN */}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">

                                                    {/* Edit Button (Links to Edit Page) */}
                                                    <Link
                                                        href={`/admin/products/${product.id}/edit`}
                                                        className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-black dark:hover:bg-gray-800 dark:hover:text-white transition-colors"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>

                                                    {/* Delete Button (Server Action) */}
                                                    <form action={deleteProduct.bind(null, product.id)}>
                                                        <button
                                                            type="submit"
                                                            className="rounded-md p-2 text-gray-500 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </form>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}