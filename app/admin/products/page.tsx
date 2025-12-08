import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Search from "@/components/Search"; // Make sure you created components/Search.tsx

// 1. Fetch products filtered by the search query
async function getProducts(query: string) {
    const products = await prisma.product.findMany({
        where: {
            name: {
                contains: query,
                mode: "insensitive", // Case-insensitive search
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
    searchParams: Promise<{ q?: string }>; // FIX: Define as Promise for Next.js 15
}) {
    // FIX: Await the searchParams before using them
    const params = await searchParams;
    const query = params?.q || "";

    const products = await getProducts(query);

    return (
        <div className="space-y-6 max-w-[1400px]">

            {/* 1. Header & Actions */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">
                    Products
                </h1>
                <div className="flex gap-2">

                    {/* 2. Search Bar Component */}
                    {/* This handles the URL updates automatically */}
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

            {/* 3. Products Table */}
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
                                    // Calculate Total Stock
                                    const totalStock = product.variants.reduce((acc, v) => acc + v.stockQuantity, 0);
                                    const isOutOfStock = totalStock === 0;

                                    return (
                                        <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs text-gray-400">
                                                        {/* Placeholder for image */}
                                                        IMG
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
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-black dark:hover:bg-gray-800 dark:hover:text-white">
                                                        <Pencil className="h-4 w-4" />
                                                    </button>
                                                    <button className="rounded-md p-2 text-gray-500 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
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