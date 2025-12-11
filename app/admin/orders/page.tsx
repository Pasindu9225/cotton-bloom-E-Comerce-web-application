// app/admin/orders/page.tsx
import { prisma } from "@/lib/prisma";
import { Eye } from "lucide-react";
import Search from "@/components/Search"; // Use existing component
import OrderStatusFilter from "@/components/OrderStatusFilter"; // Use new component
import Link from "next/link";

// Helper function to build the prisma query
async function getOrders(query: string, statusFilter?: string) {
    // Logic: If query is a number, search ID. If string, search Customer Name.
    const isNumber = !isNaN(parseInt(query)) && query !== "";

    const whereCondition: any = {
        AND: [],
    };

    if (query) {
        if (isNumber) {
            whereCondition.AND.push({ id: parseInt(query) });
        } else {
            whereCondition.AND.push({
                user: {
                    fullName: {
                        contains: query,
                        mode: "insensitive",
                    },
                },
            });
        }
    }

    if (statusFilter && statusFilter !== "ALL") {
        whereCondition.AND.push({ status: statusFilter });
    }

    const orders = await prisma.order.findMany({
        where: whereCondition,
        include: {
            user: true,
            items: true,
        },
        orderBy: { createdAt: 'desc' },
    });

    return orders;
}

export default async function AdminOrdersPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; status?: string }>;
}) {
    const params = await searchParams;
    const query = params.q || "";
    const status = params.status || "";

    const orders = await getOrders(query, status);

    return (
        <div className="space-y-6 max-w-[1400px]">

            {/* Header & Controls */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">
                    Orders
                </h1>
                <div className="flex flex-col sm:flex-row gap-2">
                    {/* 1. Search Bar */}
                    <Search placeholder="Search by ID or Customer..." />

                    {/* 2. Filter Dropdown */}
                    <OrderStatusFilter />
                </div>
            </div>

            {/* Orders Table */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-4 font-medium">Order ID</th>
                                <th className="px-6 py-4 font-medium">Customer</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Total</th>
                                <th className="px-6 py-4 text-right font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        No orders found.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            #{order.id}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {order.user?.fullName || "Guest"}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {order.user?.email}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={order.status} />
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            ${Number(order.totalAmount).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {/* 3. Link to Order Details */}
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="inline-flex rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-black dark:hover:bg-gray-800 dark:hover:text-white transition-colors"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        SHIPPED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
        DELIVERED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    };

    const className = styles[status] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${className}`}>
            {status}
        </span>
    );
}