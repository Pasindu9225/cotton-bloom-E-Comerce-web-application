// app/admin/customers/page.tsx
import { prisma } from "@/lib/prisma";
import { Mail, Search, User as UserIcon } from "lucide-react";

async function getCustomers() {
    const customers = await prisma.user.findMany({
        where: { role: "customer" },
        include: {
            orders: true,
        },
        // FIX 1: Sort by ID instead of 'createdAt' (which doesn't exist in your User table)
        orderBy: { id: 'desc' },
    });

    return customers;
}

export default async function AdminCustomersPage() {
    const customers = await getCustomers();

    return (
        <div className="space-y-6 max-w-[1400px]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">
                    Customers
                </h1>
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search customers..."
                        className="h-10 w-full sm:w-[300px] rounded-md border border-gray-200 bg-white pl-9 pr-4 text-sm outline-none focus:border-black dark:border-gray-800 dark:bg-gray-900 dark:focus:border-white"
                    />
                </div>
            </div>

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
                                        No customers found yet.
                                    </td>
                                </tr>
                            ) : (
                                customers.map((customer) => {

                                    // FIX 2: Explicit typing and using 'totalAmount'
                                    const totalSpent = customer.orders.reduce((sum: number, order: any) => {
                                        // Your schema uses 'totalAmount', so we look for that
                                        const val = order.totalAmount || 0;
                                        return sum + Number(val);
                                    }, 0);

                                    return (
                                        <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500">
                                                        <UserIcon className="h-5 w-5" />
                                                    </div>
                                                    {/* FIX 3: Use 'fullName' because 'name' does not exist in your User schema */}
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
                                                <button className="text-sm font-medium text-black hover:underline dark:text-white">
                                                    View
                                                </button>
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