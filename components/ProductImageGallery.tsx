// components/ProductImageGallery.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingBag, Check } from "lucide-react";
import { useCart } from "../app/context/CartContext"; // 👈 Import Cart Hook

interface Variant {
    id: number;
    size: string;
    color: string;
    stockQuantity: number;
}

interface ProductDetailsProps {
    product: {
        id: number;
        name: string;
        description: string;
        basePrice: number;
        images: string[];
        variants: Variant[];
    };
}

export default function ProductImageGallery({ product }: ProductDetailsProps) {
    const [selectedImage, setSelectedImage] = useState(product.images[0] || "/placeholder.jpg");
    const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
    const { addToCart } = useCart(); // 👈 Use the hook

    const handleAddToCart = () => {
        if (!selectedVariantId) {
            alert("Please select a size first!");
            return;
        }

        const variant = product.variants.find((v) => v.id === selectedVariantId);
        if (!variant) return;

        // 👇 ADD TO CART LOGIC
        addToCart({
            variantId: variant.id,
            productId: product.id,
            name: product.name,
            price: product.basePrice,
            image: product.images[0] || "/placeholder.jpg",
            size: variant.size,
            quantity: 1,
            maxStock: variant.stockQuantity
        });

        alert("Added to cart!");
    };

    return (
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* ... (Image Gallery Code remains exactly the same) ... */}
            <div className="space-y-4">
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <Image src={selectedImage} alt={product.name} fill className="object-cover" unoptimized />
                </div>
                {/* Thumbnails */}
                {product.images.length > 1 && (
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {product.images.map((img, idx) => (
                            <button key={idx} onClick={() => setSelectedImage(img)} className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 ${selectedImage === img ? "border-black dark:border-white" : "border-transparent"}`}>
                                <Image src={img} alt="Thumbnail" fill className="object-cover" unoptimized />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* RIGHT: Details */}
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-black dark:text-white">{product.name}</h1>
                    <p className="text-2xl font-medium mt-2 text-gray-900 dark:text-gray-200">${product.basePrice.toFixed(2)}</p>
                </div>

                <div className="prose prose-sm dark:prose-invert text-gray-600 dark:text-gray-300">
                    <p>{product.description}</p>
                </div>

                {/* Size Selector */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Select Size</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {product.variants.map((variant) => {
                            const isSelected = selectedVariantId === variant.id;
                            const isOutOfStock = variant.stockQuantity === 0;

                            return (
                                <button
                                    key={variant.id}
                                    onClick={() => !isOutOfStock && setSelectedVariantId(variant.id)}
                                    disabled={isOutOfStock}
                                    className={`px-6 py-3 rounded-lg text-sm font-medium border transition-all ${isSelected
                                        ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                                        : isOutOfStock
                                            ? "border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50 dark:bg-gray-900 dark:border-gray-800"
                                            : "border-gray-200 bg-white hover:border-black dark:bg-gray-900 dark:border-gray-700 dark:hover:border-white"
                                        }`}
                                >
                                    {variant.size}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Add to Cart Button */}
                <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                    <button
                        onClick={handleAddToCart}
                        className="w-full h-12 flex items-center justify-center gap-2 bg-black text-white rounded-full font-bold hover:opacity-90 transition-opacity dark:bg-white dark:text-black"
                    >
                        <ShoppingBag className="h-5 w-5" />
                        Add to Cart
                    </button>
                </div>

                {/* Assurance Icons */}
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 pt-4">
                    <div className="flex items-center gap-2"><Check className="h-4 w-4" /> Secure checkout</div>
                    <div className="flex items-center gap-2"><Check className="h-4 w-4" /> Free shipping over $100</div>
                </div>
            </div>
        </div>
    );
}