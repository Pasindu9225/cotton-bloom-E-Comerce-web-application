// components/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut } from "lucide-react";

const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { name: "Products", icon: Package, href: "/admin/products" },
    { name: "Orders", icon: ShoppingCart, href: "/admin/orders" },
    { name: "Customers", icon: Users, href: "/admin/customers" },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white dark:bg-black border-r dark:border-gray-800 transition-colors z-40">
            {/* 1. Logo Section */}
            <div className="flex h-16 items-center justify-center border-b border-gray-800 dark:border-gray-800">
                <h1 className="text-xl font-bold tracking-wider uppercase">Cotton-Bloom Admin</h1>
            </div>

            {/* 2. Navigation Links */}
            <nav className="flex-1 space-y-1 p-4 mt-4">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${isActive
                                ? "bg-indigo-600 text-white"
                                : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                }`}
                        >
                            <item.icon className="h-5 w-5" />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* 3. Bottom Actions */}
            <div className="absolute bottom-4 w-full px-4 space-y-1">
                <Link href="/admin/settings" className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
                    <Settings className="h-5 w-5" />
                    <span className="text-sm font-medium">Settings</span>
                </Link>
                <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors">
                    <LogOut className="h-5 w-5" />
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
}