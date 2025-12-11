// app/admin/customers/page.tsx
import { prisma } from "@/lib/prisma";
import { Mail, User as UserIcon } from "lucide-react";
import Link from "next/link";
import Search from "@/components/Search"; // Import Search Component

// Update: Filter by name OR email
async function getCustomers(query: string) {
    const customers = await prisma.user.findMany({
        where: {
            role: "customer",
            OR: [
                { fullName: { contains: query, mode: "insensitive" } },
                { email: { contains: query, mode: "insensitive" } },
            ]
        },
        include: {
            orders: true,
        },
        orderBy: { id: 'desc' }, // Updated from createdAt to id based on your schema
    });

    return customers;
}

export default async function AdminCustomersPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const params = await searchParams;
    const query = params?.q || "";

    const customers = await getCustomers(query);

    return (
        <div className="space-y-6 max-w-[1400px]">

            {/* Header & Search */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">
                    Customers
                </h1>
                {/* Enable Search */}
                <Search placeholder="Search name or email..." />
            </div>

            {/* Customers Table */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-4 font-medium">Customer</th>
                                <th className="px-6 py-4 font-medium">Contact</th>
                                <th className="px-6 py-4 font-medium">Orders</th>
                                <th className="px-6 py-4 font-medium">Total Spent</th>
                                <th className="px-6 py-4 text-right font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {customers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No customers found.
                                    </td>
                                </tr>
                            ) : (
                                customers.map((customer) => {

                                    const totalSpent = customer.orders.reduce((sum, order) => {
                                        return sum + Number(order.totalAmount);
                                    }, 0);

                                    return (
                                        <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500">
                                                        <UserIcon className="h-5 w-5" />
                                                    </div>
                                                    <span className="font-medium text-gray-900 dark:text-white">
                                                        {customer.fullName || "Guest User"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                                    <Mail className="h-3 w-3" />
                                                    {customer.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                                {customer.orders.length} orders
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                                ${totalSpent.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {/* 3. Working View Button */}
                                                <Link
                                                    href={`/admin/customers/${customer.id}`}
                                                    className="text-sm font-medium text-black hover:underline dark:text-white"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}