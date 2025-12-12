// app/actions/checkout.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// 👇 Define the shapes of your data
interface CartItem {
    variantId: number;
    quantity: number;
    price: number;
}

interface AddressData {
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

// 👇 Apply types here instead of 'any'
export async function placeOrder(cartItems: CartItem[], addressData: AddressData) {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    // 1. ROBUST CHECK: Ensure we have a User AND an ID
    if (!user || !user.email || !user.id) {
        console.error("Checkout Blocked: Missing User ID in session.");
        return { success: false, error: "Session expired. Please log out and log in again." };
    }

    const userId = Number(user.id);

    if (isNaN(userId)) {
        return { success: false, error: "Invalid User ID. Please relogin." };
    }

    try {
        let totalAmount = 0;

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

            await tx.address.create({
                data: {
                    userId: userId,
                    label: "Shipping",
                    streetAddress: addressData.address,
                    city: addressData.city,
                    postalCode: addressData.postalCode,
                    country: addressData.country,
                }
            });

            const newOrder = await tx.order.create({
                data: {
                    userId: userId,
                    totalAmount: totalAmount,
                    status: "PENDING",
                    items: {
                        create: cartItems.map((item) => ({
                            variantId: item.variantId,
                            quantity: item.quantity,
                            priceAtPurchase: item.price
                        }))
                    }
                }
            });

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