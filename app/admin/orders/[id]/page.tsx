// app/admin/orders/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { ArrowLeft, Mail, MapPin, Package } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import OrderStatusControls from "@/components/OrderStatusControls"; // 👈 IMPORT THIS

interface OrderDetailsPageProps {
    params: Promise<{ id: string }>;
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
    const { id } = await params;
    const orderId = parseInt(id);

    if (isNaN(orderId)) return notFound();

    // 1. Fetch Order with User and Items (Product + Variant)
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            user: {
                include: { addresses: true },
            },
            items: {
                include: {
                    variant: {
                        include: { product: true },
                    },
                },
            },
        },
    });

    if (!order) return notFound();

    // Get the first address (if any)
    const address = order.user.addresses[0];

    return (
        <div className="max-w-4xl mx-auto space-y-8">

            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/orders" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <ArrowLeft className="h-5 w-5 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-black dark:text-white">
                        Order #{order.id}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                </div>

                {/* 👇 REPLACED STATIC BADGE WITH INTERACTIVE CONTROLS */}
                <div className="ml-auto">
                    <OrderStatusControls
                        orderId={order.id}
                        currentStatus={order.status}
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">

                {/* Left Column: Order Items */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Package className="h-4 w-4" /> Order Items
                        </h3>
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {order.items.map((item) => (
                                <div key={item.id} className="py-4 flex items-center gap-4">
                                    <div className="h-16 w-16 relative bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                        <Image
                                            src={item.variant.product.images[0] || "/placeholder.jpg"}
                                            alt={item.variant.product.name}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-sm text-gray-900 dark:text-white">{item.variant.product.name}</p>
                                        <p className="text-xs text-gray-500">
                                            Size: {item.variant.size} • Color: {item.variant.color}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">${Number(item.priceAtPurchase).toFixed(2)}</p>
                                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-gray-100 dark:border-gray-800 mt-4 pt-4 flex justify-between items-center">
                            <span className="font-semibold text-gray-900 dark:text-white">Total Amount</span>
                            <span className="text-xl font-bold text-black dark:text-white">${Number(order.totalAmount).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Customer & Address */}
                <div className="space-y-6">

                    {/* Customer Card */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                        <h3 className="font-semibold mb-4 text-sm text-gray-500 uppercase tracking-wider">Customer</h3>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
                                {order.user.fullName?.charAt(0) || "U"}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{order.user.fullName}</p>
                                <p className="text-xs text-gray-500">Customer ID: {order.user.id}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <Mail className="h-4 w-4" />
                            <a href={`mailto:${order.user.email}`} className="hover:underline">{order.user.email}</a>
                        </div>
                    </div>

                    {/* Address Card */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                        <h3 className="font-semibold mb-4 text-sm text-gray-500 uppercase tracking-wider">Shipping Address</h3>
                        <div className="flex gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                            {address ? (
                                <div>
                                    <p>{address.streetAddress}</p>
                                    <p>{address.city}, {address.postalCode}</p>
                                    <p>{address.country}</p>
                                </div>
                            ) : (
                                <p className="text-gray-400 italic">No address provided</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}