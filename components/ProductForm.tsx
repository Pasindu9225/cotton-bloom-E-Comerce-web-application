// components/ProductForm.tsx
"use client";

import { createProduct, updateProduct } from "@/app/actions/product";
import { Save, Upload, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

// 1. Define the data shape for editing
interface ProductData {
    id: number;
    name: string;
    description: string;
    basePrice: any;
    categoryId: number;
    images: string[];
    variants: { stockQuantity: number }[];
}

interface ProductFormProps {
    categories: any[];
    initialData?: ProductData | null; // 👈 This was missing!
}

export default function ProductForm({ categories, initialData }: ProductFormProps) {

    // Initialize State: If editing, load existing images. If creating, use empty slots.
    const [imageUrls, setImageUrls] = useState<(string | null)[]>(() => {
        if (initialData?.images && initialData.images.length > 0) {
            const loaded = initialData.images;
            return [loaded[0] || null, loaded[1] || null, loaded[2] || null];
        }
        return [null, null, null];
    });

    const [isUploading, setIsUploading] = useState(false);

    // Determine if we are Creating or Updating
    const formAction = initialData
        ? updateProduct.bind(null, initialData.id)
        : createProduct;

    const handleBoxUpload = async (e: React.ChangeEvent<HTMLInputElement>, indexToFill: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!CLOUD_NAME || !UPLOAD_PRESET) {
            alert("Missing Cloudinary Env Vars!");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
                method: "POST",
                body: formData,
            });
            const data = await res.json();

            if (data.secure_url) {
                setImageUrls((prev) => {
                    const newArr = [...prev];
                    newArr[indexToFill] = data.secure_url;
                    return newArr;
                });
            }
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed.");
        } finally {
            setIsUploading(false);
        }
    };

    const removeImage = (indexToRemove: number) => {
        setImageUrls((prev) => {
            const newArr = [...prev];
            newArr[indexToRemove] = null;
            return newArr;
        });
    };

    // Get initial stock from the first variant (if exists)
    const initialStock = initialData?.variants[0]?.stockQuantity || 0;

    return (
        <form action={formAction} className="bg-white dark:bg-gray-900 p-8 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">

            <div className="space-y-2">
                <label className="text-sm font-medium">Product Name</label>
                <input
                    name="name"
                    required
                    defaultValue={initialData?.name || ""}
                    placeholder="e.g. Linen Shirt"
                    className="w-full h-11 px-4 rounded-md border border-gray-200 bg-white outline-none dark:bg-gray-800 dark:border-gray-700"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                    name="description"
                    required
                    defaultValue={initialData?.description || ""}
                    className="w-full h-24 p-4 rounded-md border border-gray-200 bg-white outline-none dark:bg-gray-800 dark:border-gray-700 resize-none"
                />
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Price Rs.</label>
                    <input
                        name="price"
                        type="number"
                        step="0.01"
                        required
                        defaultValue={initialData ? Number(initialData.basePrice) : ""}
                        className="w-full h-11 px-4 rounded-md border border-gray-200 bg-white outline-none dark:bg-gray-800 dark:border-gray-700"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <select
                        name="category"
                        required
                        defaultValue={initialData?.categoryId || ""}
                        className="w-full h-11 px-4 rounded-md border border-gray-200 bg-white outline-none dark:bg-gray-800 dark:border-gray-700"
                    >
                        <option value="" disabled>Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Current Stock</label>
                <input
                    name="stock"
                    type="number"
                    required
                    defaultValue={initialStock}
                    className="w-full h-11 px-4 rounded-md border border-gray-200 bg-white outline-none dark:bg-gray-800 dark:border-gray-700"
                />
            </div>

            <div className="space-y-3">
                <label className="text-sm font-medium">Product Images</label>

                {imageUrls.map((url, idx) => (
                    url ? <input key={idx} type="hidden" name="images" value={url} /> : null
                ))}

                <div className="grid grid-cols-3 gap-4">
                    {[0, 1, 2].map((index) => {
                        const url = imageUrls[index];
                        if (url) {
                            return (
                                <div key={index} className="relative h-40 w-full border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                                    <Image src={url} alt="Product" fill className="object-cover" unoptimized />
                                    <button type="button" onClick={() => removeImage(index)} className="absolute top-2 right-2 bg-white/80 text-gray-600 p-1.5 rounded-full hover:bg-red-500 hover:text-white transition-colors">
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            );
                        } else {
                            return (
                                <label key={index} className="h-40 w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-black dark:border-gray-700 dark:hover:border-white">
                                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                    <span className="text-xs text-gray-400">Click to Upload</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleBoxUpload(e, index)} disabled={isUploading} />
                                </label>
                            );
                        }
                    })}
                </div>
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                <button type="submit" disabled={isUploading} className="flex items-center gap-2 px-8 py-3 rounded-lg bg-black text-white font-medium hover:bg-gray-900 disabled:opacity-50 transition-colors">
                    <Save className="h-5 w-5" />
                    {initialData ? "Save Changes" : "Publish Product"}
                </button>
            </div>
        </form>
    );
}