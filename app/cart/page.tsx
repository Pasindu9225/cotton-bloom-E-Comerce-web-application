// app/cart/page.tsx
"use client";

import { useCart } from "../context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";

export default function CartPage() {
    // 👈 Import the new updateQuantity function
    const { items, removeFromCart, updateQuantity, cartTotal } = useCart();

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <h2 className="text-2xl font-bold">Your cart is empty</h2>
                <p className="text-gray-500">Looks like you haven't added anything yet.</p>
                <Link href="/new-arrivals" className="px-6 py-3 bg-black text-white rounded-full font-medium hover:opacity-90 dark:bg-white dark:text-black">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold mb-8 text-black dark:text-white">Shopping Cart</h1>

            <div className="grid lg:grid-cols-3 gap-12">

                {/* LEFT: Cart Items List */}
                <div className="lg:col-span-2 space-y-6">
                    {items.map((item) => (
                        <div key={`${item.productId}-${item.variantId}`} className="flex gap-4 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
                                <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                            </div>

                            <div className="flex flex-1 flex-col justify-between">
                                <div>
                                    <div className="flex justify-between">
                                        <h3 className="font-medium text-black dark:text-white">
                                            <Link href={`/products/${item.productId}`} className="hover:underline">{item.name}</Link>
                                        </h3>
                                        <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">Size: {item.size}</p>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-3 border border-gray-200 dark:border-gray-700 rounded-lg p-1">

                                        {/* 👇 MINUS BUTTON: Uses updateQuantity */}
                                        <button
                                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded disabled:opacity-30"
                                        >
                                            <Minus className="h-3 w-3" />
                                        </button>

                                        <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>

                                        {/* 👇 PLUS BUTTON: Uses updateQuantity */}
                                        <button
                                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                                            disabled={item.quantity >= item.maxStock}
                                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded disabled:opacity-30"
                                        >
                                            <Plus className="h-3 w-3" />
                                        </button>
                                    </div>

                                    <button onClick={() => removeFromCart(item.variantId)} className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1">
                                        <Trash2 className="h-4 w-4" />
                                        <span className="hidden sm:inline">Remove</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* RIGHT: Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 sticky top-24">
                        <h2 className="text-lg font-bold mb-4">Order Summary</h2>
                        <div className="space-y-3 text-sm border-b border-gray-200 dark:border-gray-800 pb-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                                <span className="font-medium">${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                                <span className="text-green-600 font-medium">Free</span>
                            </div>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-4 mb-6">
                            <span>Total</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <Link
                            href="/checkout"
                            className="w-full flex items-center justify-center gap-2 bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-colors"
                        >
                            Checkout <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}