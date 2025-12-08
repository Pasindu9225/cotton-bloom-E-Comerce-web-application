// app/admin/products/new/page.tsx
import { prisma } from "@/lib/prisma";
import { createProduct } from "@/app/actions/product";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default async function AddProductPage() {
    // Fetch categories for the dropdown
    const categories = await prisma.category.findMany();

    return (
        <div className="max-w-3xl mx-auto space-y-8">

            {/* 1. Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/products"
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-black dark:text-white">
                        Add New Product
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Create a new item in your inventory.
                    </p>
                </div>
            </div>

            {/* 2. The Form */}
            <form action={createProduct} className="bg-white dark:bg-gray-900 p-8 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">

                {/* Product Name */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-200">
                        Product Name
                    </label>
                    <input
                        name="name"
                        required
                        placeholder="e.g. Linen Blend Shirt"
                        className="w-full h-11 px-4 rounded-md border border-gray-200 bg-gray-50 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black dark:border-gray-700 dark:bg-gray-800 dark:focus:border-white dark:focus:ring-white transition-all"
                    />
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-200">
                        Description
                    </label>
                    <textarea
                        name="description"
                        required
                        placeholder="Enter product details..."
                        className="w-full h-32 p-4 rounded-md border border-gray-200 bg-gray-50 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black dark:border-gray-700 dark:bg-gray-800 dark:focus:border-white dark:focus:ring-white transition-all resize-none"
                    />
                </div>

                {/* Row: Price & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900 dark:text-gray-200">
                            Base Price ($)
                        </label>
                        <input
                            name="price"
                            type="number"
                            step="0.01"
                            required
                            placeholder="0.00"
                            className="w-full h-11 px-4 rounded-md border border-gray-200 bg-gray-50 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black dark:border-gray-700 dark:bg-gray-800 dark:focus:border-white dark:focus:ring-white transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900 dark:text-gray-200">
                            Category
                        </label>
                        <select
                            name="category"
                            required
                            defaultValue="" // FIX: Set default value here instead of 'selected' on option
                            className="w-full h-11 px-4 rounded-md border border-gray-200 bg-gray-50 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black dark:border-gray-700 dark:bg-gray-800 dark:focus:border-white dark:focus:ring-white transition-all appearance-none"
                        >
                            <option value="" disabled>Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Stock Quantity */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-200">
                        Initial Stock Quantity
                    </label>
                    <input
                        name="stock"
                        type="number"
                        required
                        placeholder="e.g. 50"
                        className="w-full h-11 px-4 rounded-md border border-gray-200 bg-gray-50 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black dark:border-gray-700 dark:bg-gray-800 dark:focus:border-white dark:focus:ring-white transition-all"
                    />
                </div>

                <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
                    <Link
                        href="/admin/products"
                        className="px-5 py-2.5 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        className="flex items-center gap-2 px-6 py-2.5 rounded-md bg-black text-white text-sm font-medium hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-colors shadow-sm"
                    >
                        <Save className="h-4 w-4" />
                        Publish Product
                    </button>
                </div>
            </form>
        </div>
    );
}