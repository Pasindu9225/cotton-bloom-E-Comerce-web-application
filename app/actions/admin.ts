"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: number, newStatus: string) {
    try {
        await prisma.order.update({
            where: { id: orderId },
            data: { status: newStatus },
        });

        // Refresh the page so the admin sees the new status immediately
        revalidatePath(`/admin/orders/${orderId}`);
        revalidatePath("/admin/orders");

        return { success: true };
    } catch (error) {
        console.error("Failed to update order:", error);
        return { success: false, error: "Failed to update status" };
    }
}