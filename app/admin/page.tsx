// app/admin/page.tsx
import { prisma } from "@/lib/prisma";
import { DollarSign, ShoppingBag, Users, TrendingUp, LucideIcon } from "lucide-react";
import DownloadReportButton from "@/components/DownloadReportButton";
import DashboardCharts from "@/components/DashboardCharts"; // New Component
import { subDays, format } from "date-fns";

interface StatsCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    trend: string;
}

// 1. Helper to get date range
function getDateRange(days: string) {
    const now = new Date();
    const daysNum = parseInt(days) || 7;
    return subDays(now, daysNum);
}

// 2. Main Data Fetching
async function getDashboardData(daysParam: string) {
    const startDate = getDateRange(daysParam);

    // A. Basic Stats
    const totalOrders = await prisma.order.count();
    const totalCustomers = await prisma.user.count({ where: { role: "customer" } });
    const salesData = await prisma.order.aggregate({ _sum: { totalAmount: true } });
    const totalSales = salesData._sum.totalAmount ? Number(salesData._sum.totalAmount) : 0;

    // B. Revenue Chart Data (Group by Day)
    // We fetch all orders in range, then group in JS (Prisma groupBy is limited on dates)
    const recentOrders = await prisma.order.findMany({
        where: { createdAt: { gte: startDate } },
        orderBy: { createdAt: 'asc' },
    });

    // Map orders to "Mon", "Tue" format
    const revenueMap = new Map<string, number>();
    recentOrders.forEach(order => {
        const dateKey = format(order.createdAt, "MMM dd"); // e.g., "Dec 10"
        const current = revenueMap.get(dateKey) || 0;
        revenueMap.set(dateKey, current + Number(order.totalAmount));
    });

    // Convert Map to Array for Chart
    const chartData = Array.from(revenueMap.entries()).map(([date, total]) => ({ date, total }));

    // C. Status Distribution
    const statusGroups = await prisma.order.groupBy({
        by: ['status'],
        _count: { id: true },
    });
    const statusData = statusGroups.map(g => ({ name: g.status, value: g._count.id }));

    // D. Top Products
    const topItems = await prisma.orderItem.groupBy({
        by: ['variantId'],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5,
    });

    // We need product names, so we fetch product details for these variants
    const topProducts = await Promise.all(topItems.map(async (item) => {
        const variant = await prisma.productVariant.findUnique({
            where: { id: item.variantId },
            include: { product: true }
        });
        return {
            name: variant?.product.name || "Unknown",
            sales: item._sum.quantity || 0
        };
    }));

    return {
        stats: { totalOrders, totalCustomers, totalSales },
        revenueData: chartData,
        statusData,
        topProducts
    };
}

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
    const params = await searchParams;
    const days = params.days || "7";
    const data = await getDashboardData(days);

    return (
        <div className="space-y-8 max-w-[1400px]">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                {/* We pass all data to the Report Button now */}
                <DownloadReportButton data={data} />
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard title="Total Sales" value={`$${data.stats.totalSales.toFixed(2)}`} icon={DollarSign} trend="All time" />
                <StatsCard title="Total Orders" value={data.stats.totalOrders.toString()} icon={ShoppingBag} trend="All time" />
                <StatsCard title="Customers" value={data.stats.totalCustomers.toString()} icon={Users} trend="Active" />
                <StatsCard title="Avg. Order" value={`$${data.stats.totalOrders > 0 ? (data.stats.totalSales / data.stats.totalOrders).toFixed(2) : "0.00"}`} icon={TrendingUp} trend="Calculated" />
            </div>

            {/* CHARTS SECTION */}
            <DashboardCharts
                revenueData={data.revenueData}
                statusData={data.statusData}
                topProducts={data.topProducts}
            />
        </div>
    );
}

function StatsCard({ title, value, icon: Icon, trend }: StatsCardProps) {
    return (
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                    <Icon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                </div>
            </div>
            <div className="mt-4">
                <h3 className="text-2xl font-bold">{value}</h3>
                <p className="text-xs text-green-600 mt-1 font-medium">{trend}</p>
            </div>
        </div>
    );
}