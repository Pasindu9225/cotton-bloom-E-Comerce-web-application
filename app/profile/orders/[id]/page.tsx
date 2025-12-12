// app/profile/orders/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, Package, Truck, CheckCircle, Clock } from "lucide-react";

interface OrderDetailsProps {
    params: Promise<{ id: string }>;
}

export default async function OrderDetailsPage({ params }: OrderDetailsProps) {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    const orderId = parseInt(id);

    if (!session || !session.user?.email) {
        redirect("/login");
    }

    if (isNaN(orderId)) return notFound();

    // 1. Fetch Order (AND verify it belongs to this user)
    const order = await prisma.order.findUnique({
        where: {
            id: orderId,
        },
        include: {
            items: {
                include: {
                    variant: {
                        include: { product: true }
                    }
                }
            },
            user: {
                include: { addresses: true } // Get addresses to find the one used
            }
        },
    });

    // Security Check: If order doesn't exist OR belongs to someone else
    if (!order || order.user.email !== session.user.email) {
        return notFound();
    }

    // Helper to find the address used (Logic: In a real app, we'd snapshot the address on the order itself. 
    // For now, we take the user's most recent address or the first one found)
    const shippingAddress = order.user.addresses[0];

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">

            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/profile" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <ArrowLeft className="h-5 w-5 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-black dark:text-white">
                        Order #{order.id}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <div className="ml-auto">
                    <StatusBadge status={order.status} />
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">

                {/* Main Content: Items */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                            <h2 className="font-semibold flex items-center gap-2">
                                <Package className="h-4 w-4" /> Items
                            </h2>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {order.items.map((item) => (
                                <div key={item.id} className="p-4 flex gap-4">
                                    <div className="relative h-20 w-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                                        <Image
                                            src={item.variant.product.images[0] || "/placeholder.jpg"}
                                            alt={item.variant.product.name}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-sm text-gray-900 dark:text-white">
                                            {item.variant.product.name}
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Size: {item.variant.size} • Color: {item.variant.color}
                                        </p>
                                        <div className="mt-2 flex justify-between items-center">
                                            <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                                            <span className="text-sm font-medium">
                                                ${Number(item.priceAtPurchase).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total Calculation */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-3">
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Subtotal</span>
                            <span>${Number(order.totalAmount).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-green-600">
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>${Number(order.totalAmount).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Details */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                        <h3 className="font-semibold mb-4 text-sm text-gray-500 uppercase tracking-wider">Shipping Details</h3>
                        <div className="flex gap-3 text-sm text-gray-600 dark:text-gray-300">
                            <MapPin className="h-5 w-5 flex-shrink-0 text-gray-400" />
                            {shippingAddress ? (
                                <div>
                                    <p className="font-medium text-black dark:text-white">Shipping Address</p>
                                    <p className="mt-1">{shippingAddress.streetAddress}</p>
                                    <p>{shippingAddress.city}, {shippingAddress.postalCode}</p>
                                    <p>{shippingAddress.country}</p>
                                </div>
                            ) : (
                                <p className="italic text-gray-400">Address not available</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                        <h3 className="font-semibold mb-4 text-sm text-gray-500 uppercase tracking-wider">Payment</h3>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                            <p>Payment Method: <span className="font-medium text-black dark:text-white">Cash on Delivery</span></p>
                            <p className="mt-2 text-xs text-gray-400">
                                Payment will be collected upon delivery of the package.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    if (status === "DELIVERED") {
        return (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                <CheckCircle className="h-3.5 w-3.5" /> Delivered
            </span>
        );
    }
    if (status === "SHIPPED") {
        return (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                <Truck className="h-3.5 w-3.5" /> Shipped
            </span>
        );
    }
    return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
            <Clock className="h-3.5 w-3.5" /> Pending
        </span>
    );
}