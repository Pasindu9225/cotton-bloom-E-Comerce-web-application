// app/actions/product.ts
"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// --- CREATE ---
export async function createProduct(formData: FormData) {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const categoryId = parseInt(formData.get("category") as string);
    const stock = parseInt(formData.get("stock") as string);

    // Get all image links
    const images = formData.getAll("images") as string[];

    // 1. Create Product
    const product = await prisma.product.create({
        data: {
            name,
            description,
            basePrice: price,
            categoryId,
            images: images,
        },
    });

    // 2. Create Default Variant
    await prisma.productVariant.create({
        data: {
            productId: product.id,
            size: "One Size",
            color: "Default",
            stockQuantity: stock,
        },
    });

    // 3. Refresh and Redirect
    revalidatePath("/admin/products");
    redirect("/admin/products");
}

// --- UPDATE ---
export async function updateProduct(id: number, formData: FormData) {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const categoryId = parseInt(formData.get("category") as string);
    const stock = parseInt(formData.get("stock") as string);
    const images = formData.getAll("images") as string[];

    // 1. Update Product Details
    await prisma.product.update({
        where: { id },
        data: {
            name,
            description,
            basePrice: price,
            categoryId,
            images,
        },
    });

    // 2. Update Stock (Update all variants for simplicity)
    await prisma.productVariant.updateMany({
        where: { productId: id },
        data: {
            stockQuantity: stock,
        },
    });

    // 3. Refresh and Redirect
    revalidatePath("/admin/products");
    redirect("/admin/products");
}

export async function deleteProduct(id: number) {
    try {
        const variants = await prisma.productVariant.findMany({
            where: { productId: id },
            select: { id: true }
        });

        const variantIds = variants.map(v => v.id);

        if (variantIds.length > 0) {
            await prisma.orderItem.deleteMany({
                where: { variantId: { in: variantIds } }
            });
        }

        await prisma.productVariant.deleteMany({
            where: { productId: id },
        });
        await prisma.product.delete({
            where: { id },
        });

        revalidatePath("/admin/products");
    } catch (error) {
        console.error("Failed to delete product:", error);
    }
}