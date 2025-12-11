// app/actions/customer.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteCustomer(customerId: number) {
    try {
        // 1. Delete all Order Items for this user's orders
        // We first find the user's orders to get their IDs
        const userOrders = await prisma.order.findMany({
            where: { userId: customerId },
            select: { id: true }
        });

        const orderIds = userOrders.map(o => o.id);

        if (orderIds.length > 0) {
            // Delete items inside those orders
            await prisma.orderItem.deleteMany({
                where: { orderId: { in: orderIds } }
            });

            // 2. Delete the Orders themselves
            await prisma.order.deleteMany({
                where: { userId: customerId }
            });
        }

        // 3. Delete Addresses
        await prisma.address.deleteMany({
            where: { userId: customerId }
        });

        // 4. Finally, Delete the User
        await prisma.user.delete({
            where: { id: customerId }
        });

        revalidatePath("/admin/customers");
        redirect("/admin/customers");

    } catch (error) {
        console.error("Failed to delete customer:", error);
        throw new Error("Failed to delete customer");
    }
}