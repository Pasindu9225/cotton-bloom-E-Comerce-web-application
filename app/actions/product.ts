// app/actions/product.ts
"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createProduct(formData: FormData) {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const categoryId = parseInt(formData.get("category") as string);
    const stock = parseInt(formData.get("stock") as string);

    // 1. Create the Product
    const product = await prisma.product.create({
        data: {
            name,
            description,
            basePrice: price,
            categoryId,
            imageUrl: "/placeholder.jpg", // Default image for now
        },
    });

    // 2. Create a Default Variant (Required for stock tracking)
    // In a full app, you would let users pick sizes. For now, we create a "Standard" variant.
    await prisma.productVariant.create({
        data: {
            productId: product.id,
            size: "One Size",
            color: "Default",
            stockQuantity: stock,
        },
    });

    // 3. Redirect back to the products list
    redirect("/admin/products");
}