"use client";

import { updateOrderStatus } from "@/app/actions/admin";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface Props {
    orderId: number;
    currentStatus: string;
}

export default function OrderStatusControls({ orderId, currentStatus }: Props) {
    const [loading, setLoading] = useState(false);

    const handleUpdate = async (status: string) => {
        setLoading(true);
        await updateOrderStatus(orderId, status);
        setLoading(false);
    };

    if (loading) {
        return <div className="px-4 py-2 flex items-center gap-2 text-sm text-gray-500"><Loader2 className="animate-spin h-4 w-4" /> Updating...</div>;
    }

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium mr-2">Set Status:</span>

            {currentStatus !== "PENDING" && (
                <button
                    onClick={() => handleUpdate("PENDING")}
                    className="px-3 py-1.5 text-xs font-bold border rounded hover:bg-gray-50"
                >
                    Pending
                </button>
            )}

            {currentStatus !== "SHIPPED" && (
                <button
                    onClick={() => handleUpdate("SHIPPED")}
                    className="px-3 py-1.5 text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded hover:bg-blue-100"
                >
                    Mark Shipped
                </button>
            )}

            {currentStatus !== "DELIVERED" && (
                <button
                    onClick={() => handleUpdate("DELIVERED")}
                    className="px-3 py-1.5 text-xs font-bold bg-green-50 text-green-700 border border-green-200 rounded hover:bg-green-100"
                >
                    Mark Delivered
                </button>
            )}
        </div>
    );
}