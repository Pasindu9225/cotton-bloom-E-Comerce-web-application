// components/Navbar.tsx
"use client";

import Link from "next/link";
import { ShoppingBag, Search, Menu, X, User } from "lucide-react";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { usePathname } from "next/navigation";
import { useCart } from "../app/context/CartContext"; // 👈 1. Import the Hook

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // 👈 2. Get the real count from the Cart Brain
    const { cartCount } = useCart();

    // Fix Hydration Mismatch: Wait for client load before showing count
    // (Prevents the server saying "0" and client saying "1" error)
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const isAdmin = pathname?.startsWith("/admin");

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white dark:bg-white dark:text-black">
                            <span className="font-bold">C</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight">COTTON BLOOM</span>
                    </Link>
                </div>

                {/* Desktop Navigation - HIDDEN IF ADMIN */}
                {!isAdmin && (
                    <div className="hidden md:flex md:gap-x-8">
                        <Link href="/new-arrivals" className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-300">
                            New Arrivals
                        </Link>
                        <Link href="/men" className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-300">
                            Men
                        </Link>
                        <Link href="/women" className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-300">
                            Women
                        </Link>
                    </div>
                )}

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <ThemeToggle />

                    {!isAdmin && (
                        <>
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                                <Search className="h-5 w-5" />
                            </button>

                            <Link href="/cart" className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                                <ShoppingBag className="h-5 w-5" />
                                {/* 👈 3. Display the Real Count (only if > 0) */}
                                {mounted && cartCount > 0 && (
                                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white dark:bg-white dark:text-black animate-in zoom-in">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </>
                    )}

                    <Link href={isAdmin ? "/admin" : "/profile"} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                        <User className="h-5 w-5" />
                    </Link>

                    {!isAdmin && (
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    )}
                </div>
            </div>

            {isOpen && !isAdmin && (
                <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 pb-4 pt-2">
                    <div className="flex flex-col space-y-4">
                        <Link href="/new-arrivals" className="text-sm font-medium py-2">New Arrivals</Link>
                        <Link href="/men" className="text-sm font-medium py-2">Men</Link>
                        <Link href="/women" className="text-sm font-medium py-2">Women</Link>
                    </div>
                </div>
            )}
        </nav>
    );
}