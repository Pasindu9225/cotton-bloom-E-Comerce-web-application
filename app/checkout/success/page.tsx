// app/checkout/success/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";

interface SuccessPageProps {
    searchParams: Promise<{ orderId?: string }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
    const { orderId } = await searchParams;

    if (!orderId) return notFound();

    // Fetch the order to show details
    const order = await prisma.order.findUnique({
        where: { id: Number(orderId) },
        include: { user: true },
    });

    if (!order) return notFound();

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center space-y-6">
            <div className="h-24 w-24 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-12 w-12" />
            </div>

            <h1 className="text-4xl font-bold text-black dark:text-white">Order Confirmed!</h1>
            <p className="text-lg text-gray-500 max-w-md">
                Thank you, <span className="font-semibold text-black dark:text-white">{order.user.fullName}</span>.
                Your order <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">#{order.id}</span> has been placed successfully.
            </p>

            <div className="pt-8 flex flex-col sm:flex-row gap-4">
                <Link
                    href="/new-arrivals"
                    className="px-8 py-3 bg-black text-white rounded-full font-bold hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-colors"
                >
                    Continue Shopping
                </Link>
                <Link
                    href="/profile"
                    className="px-8 py-3 border border-gray-200 dark:border-gray-700 text-black dark:text-white rounded-full font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                    View Order
                </Link>
            </div>
        </div>
    );
}