// app/actions/checkout.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function placeOrder(cartItems: any[], addressData: any) {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    // 1. Debugging: Check what the session actually has
    console.log("Checkout Session:", user);

    // 2. Strict Check: Ensure we have both a User AND an ID
    if (!user || !user.email || !user.id) {
        console.error("Session missing User ID. User must relogin.");
        return { success: false, error: "Session expired. Please log out and log in again." };
    }

    // Safely convert ID to number
    const userId = parseInt(user.id.toString());
    if (isNaN(userId)) {
        return { success: false, error: "Invalid User ID." };
    }

    try {
        let totalAmount = 0;

        // Verify stock and calculate total
        for (const item of cartItems) {
            const variant = await prisma.productVariant.findUnique({
                where: { id: item.variantId },
                include: { product: true }
            });

            if (!variant) throw new Error(`Product variant ${item.variantId} not found`);
            if (variant.stockQuantity < item.quantity) {
                return { success: false, error: `Sorry, ${variant.product.name} is out of stock.` };
            }

            totalAmount += Number(variant.product.basePrice) * item.quantity;
        }

        const order = await prisma.$transaction(async (tx) => {

            // 1. Create Address
            await tx.address.create({
                data: {
                    userId: userId, // 👈 Use the safe variable
                    label: "Shipping",
                    streetAddress: addressData.address,
                    city: addressData.city,
                    postalCode: addressData.postalCode,
                    country: addressData.country,
                }
            });

            // 2. Create Order
            const newOrder = await tx.order.create({
                data: {
                    userId: userId, // 👈 Use the safe variable
                    totalAmount: totalAmount,
                    status: "PENDING",
                    items: {
                        create: cartItems.map((item: any) => ({
                            variantId: item.variantId,
                            quantity: item.quantity,
                            priceAtPurchase: item.price
                        }))
                    }
                }
            });

            // 3. Update Stock
            for (const item of cartItems) {
                await tx.productVariant.update({
                    where: { id: item.variantId },
                    data: { stockQuantity: { decrement: item.quantity } }
                });
            }

            return newOrder;
        });

        return { success: true, orderId: order.id };

    } catch (error) {
        console.error("Checkout Failed:", error);
        return { success: false, error: "Something went wrong processing your order." };
    }
}