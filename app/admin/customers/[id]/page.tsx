// app/admin/customers/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { deleteCustomer } from "@/app/actions/customer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, MapPin, Trash2, ShoppingBag } from "lucide-react";

interface CustomerPageProps {
    params: Promise<{ id: string }>;
}

export default async function CustomerDetailsPage({ params }: CustomerPageProps) {
    const { id } = await params;
    const customerId = parseInt(id);

    if (isNaN(customerId)) return notFound();

    // Fetch Customer with Orders and Address
    const customer = await prisma.user.findUnique({
        where: { id: customerId },
        include: {
            orders: {
                orderBy: { createdAt: "desc" },
            },
            addresses: true,
        },
    });

    if (!customer) return notFound();

    // Calculate Total Spent
    const totalSpent = customer.orders.reduce((sum, order) => {
        return sum + Number(order.totalAmount);
    }, 0);

    const primaryAddress = customer.addresses[0];

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/customers" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <ArrowLeft className="h-5 w-5 text-gray-500" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-black dark:text-white">
                            {customer.fullName || "Guest User"}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Customer ID: #{customer.id} • Joined {new Date().getFullYear()}
                        </p>
                    </div>
                </div>

                {/* Delete Action */}
                <form action={deleteCustomer.bind(null, customer.id)}>
                    <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors text-sm font-medium">
                        <Trash2 className="h-4 w-4" />
                        Delete Customer
                    </button>
                </form>
            </div>

            <div className="grid md:grid-cols-3 gap-6">

                {/* Left Column: Stats & Info */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                        <h3 className="font-semibold mb-4 text-sm text-gray-500 uppercase">Overview</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <ShoppingBag className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold">{customer.orders.length}</p>
                                    <p className="text-xs text-gray-500">Total Orders</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                    <span className="font-bold text-lg">$</span>
                                </div>
                                <div>
                                    <p className="text-xl font-bold">${totalSpent.toFixed(2)}</p>
                                    <p className="text-xs text-gray-500">Total Spent</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                        <h3 className="font-semibold mb-4 text-sm text-gray-500 uppercase">Contact</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <Mail className="h-4 w-4" />
                                {customer.email}
                            </div>
                            <div className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                                <MapPin className="h-4 w-4 mt-0.5" />
                                {primaryAddress ? (
                                    <span>
                                        {primaryAddress.streetAddress},<br />
                                        {primaryAddress.city}, {primaryAddress.country}
                                    </span>
                                ) : <span className="text-gray-400 italic">No address saved</span>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Order History */}
                <div className="md:col-span-2">
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                            <h3 className="font-semibold">Order History</h3>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {customer.orders.length === 0 ? (
                                <p className="p-6 text-sm text-gray-500 text-center">No orders yet.</p>
                            ) : (
                                customer.orders.map((order) => (
                                    <Link
                                        href={`/admin/orders/${order.id}`}
                                        key={order.id}
                                        className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium text-sm text-gray-900 dark:text-white">Order #{order.id}</p>
                                                <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-sm">${Number(order.totalAmount).toFixed(2)}</p>
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}