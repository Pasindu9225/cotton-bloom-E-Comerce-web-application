// components/OrderStatusFilter.tsx
"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function OrderStatusFilter() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams);
        const status = e.target.value;

        if (status && status !== "ALL") {
            params.set("status", status);
        } else {
            params.delete("status");
        }

        router.replace(`${pathname}?${params.toString()}`);
    };

    return (
        <select
            onChange={handleFilterChange}
            defaultValue={searchParams.get("status") || "ALL"}
            className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm outline-none focus:border-black dark:border-gray-800 dark:bg-gray-900 dark:focus:border-white"
        >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
        </select>
    );
}