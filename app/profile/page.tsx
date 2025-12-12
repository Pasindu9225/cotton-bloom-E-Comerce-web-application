// app/profile/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Package } from "lucide-react";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/SignOutButton"; // 👈 Import the button

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        redirect("/login");
    }

    // 1. Fetch User & Orders from Database
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            orders: {
                orderBy: { createdAt: 'desc' }, // Newest orders first
                include: { items: true }
            }
        }
    });

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
            <h1 className="text-3xl font-bold">My Account</h1>

            <div className="grid md:grid-cols-3 gap-6">

                {/* Left: Profile Card */}
                <div className="col-span-1 space-y-6">
                    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-12 w-12 bg-black text-white rounded-full flex items-center justify-center text-xl font-bold">
                                {user.fullName?.charAt(0) || "U"}
                            </div>
                            <div>
                                <p className="font-medium">{user.fullName}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                        </div>

                        {/* 👈 Use the new Client Component here */}
                        <SignOutButton />
                    </div>
                </div>

                {/* Right: Order History */}
                <div className="md:col-span-2 space-y-4">
                    <h2 className="text-xl font-semibold">Order History</h2>

                    {user.orders.length === 0 ? (
                        // State: No Orders
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 text-center space-y-3">
                            <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400">
                                <Package className="h-6 w-6" />
                            </div>
                            <h3 className="font-medium">No recent orders</h3>
                            <p className="text-sm text-gray-500">Go shopping to see your orders here.</p>
                            <Link href="/new-arrivals" className="inline-block text-sm font-medium underline">
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        // State: Has Orders
                        <div className="space-y-4">
                            {user.orders.map((order) => (
                                <div key={order.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-bold">Order #{order.id}</span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${order.status === "DELIVERED" ? "bg-green-100 text-green-700" :
                                                order.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                                                    "bg-gray-100 text-gray-600"
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {order.items.length} items • Total: <span className="font-medium text-black dark:text-white">${Number(order.totalAmount).toFixed(2)}</span>
                                        </p>
                                    </div>

                                    <Link
                                        href={`/profile/orders/${order.id}`}
                                        className="text-sm font-medium underline decoration-gray-300 underline-offset-4 hover:decoration-black transition-all"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}