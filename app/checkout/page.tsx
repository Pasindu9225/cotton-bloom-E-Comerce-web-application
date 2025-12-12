// app/checkout/page.tsx
"use client";

import { useCart } from "../context/CartContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { placeOrder } from "@/app/actions/checkout";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
    // 1. Get clearCart from context
    const { items, cartTotal, clearCart } = useCart();
    const { data: session } = useSession();
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (items.length === 0) {
            router.push("/cart");
        }
    }, [items, router]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        if (!session) {
            setError("Please log in to place an order.");
            setIsSubmitting(false);
            return;
        }

        const formData = new FormData(e.currentTarget);
        const addressData = {
            address: formData.get("address"),
            city: formData.get("city"),
            postalCode: formData.get("postalCode"),
            country: formData.get("country"),
        };

        const result = await placeOrder(items, addressData);

        if (result.success) {
            // 2. USE THE CONTEXT FUNCTION TO CLEAR CART
            // This correctly clears "cotton-bloom-cart-user@email.com"
            clearCart();

            // Redirect to success page
            router.push(`/checkout/success?orderId=${result.orderId}`);
        } else {
            setError(result.error || "Checkout failed");
            setIsSubmitting(false);
        }
    }

    if (items.length === 0) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link href="/cart" className="flex items-center gap-2 text-sm text-gray-500 mb-8 hover:text-black">
                <ArrowLeft className="h-4 w-4" /> Back to Cart
            </Link>

            <div className="grid lg:grid-cols-2 gap-12">

                {/* LEFT: Shipping Form */}
                <div>
                    <h1 className="text-3xl font-bold mb-6">Checkout</h1>
                    <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">

                        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                            <h3 className="font-medium text-sm text-gray-500 mb-1">Contact Information</h3>
                            <p className="font-medium">{session?.user?.email || "Guest"}</p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold">Shipping Address</h3>
                            <div>
                                <label className="block text-sm font-medium mb-1">Street Address</label>
                                <input name="address" required placeholder="123 Main St" className="w-full h-11 px-4 rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">City</label>
                                    <input name="city" required placeholder="New York" className="w-full h-11 px-4 rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Postal Code</label>
                                    <input name="postalCode" required placeholder="10001" className="w-full h-11 px-4 rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Country</label>
                                <select name="country" className="w-full h-11 px-4 rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800">
                                    <option value="USA">United States</option>
                                    <option value="UK">United Kingdom</option>
                                    <option value="CA">Canada</option>
                                    <option value="AU">Australia</option>
                                    <option value="LK">Sri Lanka</option>
                                </select>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-12 flex items-center justify-center gap-2 bg-black text-white rounded-md font-bold hover:bg-gray-900 disabled:opacity-50 transition-colors dark:bg-white dark:text-black"
                        >
                            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : `Pay $${cartTotal.toFixed(2)}`}
                        </button>
                    </form>
                </div>

                {/* RIGHT: Order Summary */}
                <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-xl h-fit sticky top-24">
                    <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                    <div className="space-y-4 mb-6">
                        {items.map((item) => (
                            <div key={item.variantId} className="flex justify-between text-sm">
                                <div className="flex gap-3">
                                    <span className="font-medium text-gray-500">{item.quantity}x</span>
                                    <span>{item.name} <span className="text-gray-400">({item.size})</span></span>
                                </div>
                                <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-green-600">
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2">
                            <span>Total</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}