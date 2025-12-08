// app/admin/page.tsx
import { prisma } from "@/lib/prisma";
import { DollarSign, ShoppingBag, Users, TrendingUp, LucideIcon } from "lucide-react";
import DownloadReportButton from "@/components/DownloadReportButton"; // <--- Import the new button

interface StatsCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    trend: string;
}

async function getDashboardStats() {
    const totalOrders = await prisma.order.count();

    const totalCustomers = await prisma.user.count({
        where: { role: "CUSTOMER" },
    });

    const salesData = await prisma.order.aggregate({
        _sum: { totalAmount: true },
    });

    const rawTotal = salesData._sum.totalAmount;
    const totalSales = rawTotal ? Number(rawTotal.toString()) : 0;

    return { totalOrders, totalCustomers, totalSales };
}

export default async function AdminDashboard() {
    const stats = await getDashboardStats();

    return (
        <div className="space-y-8 max-w-[1400px]">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

                {/* REPLACED THE OLD BUTTON WITH THE NEW COMPONENT */}
                {/* We pass the stats data into the button so it can print them */}
                <DownloadReportButton data={stats} />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Sales"
                    value={`$${stats.totalSales.toFixed(2)}`}
                    icon={DollarSign}
                    trend="Live"
                />
                <StatsCard
                    title="Total Orders"
                    value={stats.totalOrders.toString()}
                    icon={ShoppingBag}
                    trend="Live"
                />
                <StatsCard
                    title="Customers"
                    value={stats.totalCustomers.toString()}
                    icon={Users}
                    trend="Live"
                />
                <StatsCard
                    title="Conversion"
                    value="0%"
                    icon={TrendingUp}
                    trend="--"
                />
            </div>

            {/* Recent Orders Placeholder */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
                <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-4">
                    <h3 className="font-semibold text-lg">Recent Orders</h3>
                </div>
                <div className="p-6">
                    {stats.totalOrders === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            No orders yet. Your database is empty!
                        </p>
                    ) : (
                        <p className="text-sm">Orders list will go here...</p>
                    )}
                </div>
            </div>
        </div>
    );
}

// Reusable Stats Card
function StatsCard({ title, value, icon: Icon, trend }: StatsCardProps) {
    return (
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm transition-colors">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                    <Icon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                </div>
            </div>
            <div className="mt-4">
                <h3 className="text-2xl font-bold">{value}</h3>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-medium">
                    {trend}
                </p>
            </div>
        </div>
    );
}