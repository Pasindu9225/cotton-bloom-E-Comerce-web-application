// components/DashboardCharts.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from "recharts";

// Colors for Pie Chart
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

interface DashboardChartsProps {
    revenueData: { date: string; total: number }[];
    statusData: { name: string; value: number }[];
    topProducts: { name: string; sales: number }[];
}

export default function DashboardCharts({ revenueData, statusData, topProducts }: DashboardChartsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentDays = searchParams.get("days") || "7";

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        router.push(`/admin?days=${e.target.value}`);
    };

    return (
        <div className="space-y-6">

            {/* 1. Revenue Chart */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-lg">Revenue Trends</h3>
                    <select
                        value={currentDays}
                        onChange={handleFilterChange}
                        className="text-sm border rounded-md p-1 bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                    >
                        <option value="7">Last 7 Days</option>
                        <option value="10">Last 10 Days</option>
                        <option value="30">Last Month</option>
                        <option value="365">Last Year</option>
                    </select>
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                            <Tooltip formatter={(value: number) => [`$${value}`, "Revenue"]} />
                            <Bar dataKey="total" fill="#000000" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">

                {/* 2. Order Status (Pie Chart) */}
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <h3 className="font-semibold text-lg mb-6">Order Status</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. Top Products (Horizontal Bar Layout) */}
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <h3 className="font-semibold text-lg mb-6">Top 5 Products</h3>
                    <div className="space-y-4">
                        {topProducts.map((product, idx) => (
                            <div key={idx} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium truncate max-w-[200px]">{product.name}</span>
                                    <span className="text-gray-500">{product.sales} sold</span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-black rounded-full"
                                        style={{ width: `${(product.sales / Math.max(...topProducts.map(p => p.sales))) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                        {topProducts.length === 0 && <p className="text-gray-500 text-sm">No sales data yet.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}