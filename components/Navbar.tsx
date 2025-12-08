// components/Navbar.tsx
import Link from "next/link";
import { Search, ShoppingBag, User } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white dark:bg-gray-900 dark:border-gray-800 transition-colors">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* 1. Logo */}
                <div className="flex items-center">
                    <Link href="/" className="text-2xl font-bold tracking-tight text-black dark:text-white">
                        COTTON BLOOM
                    </Link>
                </div>

                {/* 2. Center Links */}
                <div className="hidden space-x-8 md:flex">
                    <Link href="/shop" className="text-sm font-medium text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white">
                        New Arrivals
                    </Link>
                    <Link href="/shop?category=men" className="text-sm font-medium text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white">
                        Men
                    </Link>
                    <Link href="/shop?category=women" className="text-sm font-medium text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white">
                        Women
                    </Link>
                </div>

                {/* 3. Right Icons */}
                <div className="flex items-center gap-4"> {/* Use gap-4 for better spacing */}

                    {/* THEME TOGGLE with Divider */}
                    <div className="flex items-center border-r border-gray-200 pr-4 dark:border-gray-700">
                        <ThemeToggle />
                    </div>

                    {/* Action Icons */}
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white">
                            <Search className="h-5 w-5" />
                        </button>

                        <Link href="/auth/signin" className="p-2 text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white">
                            <User className="h-5 w-5" />
                        </Link>

                        <Link href="/cart" className="relative p-2 text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white">
                            <ShoppingBag className="h-5 w-5" />
                            <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white dark:bg-white dark:text-black">
                                0
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}