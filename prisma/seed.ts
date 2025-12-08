// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting seed...");

    // 1. Create Categories
    // Since 'name' isn't unique in your schema, we check manually before creating
    const categoryNames = ["Men", "Women", "Kids", "Accessories"];

    for (const name of categoryNames) {
        const existing = await prisma.category.findFirst({ where: { name } });
        if (!existing) {
            await prisma.category.create({ data: { name } });
        }
    }

    // Fetch categories to get their Integer IDs
    const menCat = await prisma.category.findFirst({ where: { name: "Men" } });
    const womenCat = await prisma.category.findFirst({ where: { name: "Women" } });

    // 2. Create Users
    // 'email' IS unique, so we can use upsert safely
    const user1 = await prisma.user.upsert({
        where: { email: "alice@example.com" },
        update: {},
        create: {
            email: "alice@example.com",
            passwordHash: "hashed_password_123", // Matches 'passwordHash'
            fullName: "Alice Johnson",           // Matches 'fullName'
            role: "customer",
        },
    });

    const user2 = await prisma.user.upsert({
        where: { email: "bob@example.com" },
        update: {},
        create: {
            email: "bob@example.com",
            passwordHash: "hashed_password_456",
            fullName: "Bob Smith",
            role: "customer",
        },
    });

    console.log("✅ Users created");

    // 3. Create Products
    // We check if any products exist to avoid duplicates
    const existingProducts = await prisma.product.findMany();

    if (existingProducts.length === 0 && menCat && womenCat) {
        // Product 1: T-Shirt
        const tshirt = await prisma.product.create({
            data: {
                name: "Classic Cotton Tee",
                description: "Premium cotton t-shirt.",
                basePrice: 25.00,          // Matches 'basePrice'
                imageUrl: "/placeholder.jpg", // Matches 'imageUrl'
                categoryId: menCat.id,     // Uses Integer ID
                variants: {
                    create: [
                        { size: "M", color: "Black", stockQuantity: 10 }, // Matches 'stockQuantity'
                        { size: "L", color: "White", stockQuantity: 5 }
                    ]
                }
            },
        });

        // Product 2: Jeans
        const jeans = await prisma.product.create({
            data: {
                name: "Slim Fit Jeans",
                description: "Comfort stretch denim.",
                basePrice: 60.00,
                imageUrl: "/placeholder.jpg",
                categoryId: womenCat.id,
                variants: {
                    create: [
                        { size: "32", color: "Blue", stockQuantity: 20 }
                    ]
                }
            },
        });

        console.log("✅ Products created");

        // 4. Create Orders
        // We need to fetch the variants we just created to link them
        const tshirtVariant = await prisma.productVariant.findFirst({ where: { productId: tshirt.id } });
        const jeansVariant = await prisma.productVariant.findFirst({ where: { productId: jeans.id } });

        if (tshirtVariant && jeansVariant) {
            await prisma.order.create({
                data: {
                    userId: user1.id,
                    totalAmount: 50.00, // Matches 'totalAmount'
                    status: "DELIVERED",
                    items: {
                        create: [
                            {
                                variantId: tshirtVariant.id,
                                quantity: 2,
                                priceAtPurchase: 25.00
                            }
                        ]
                    }
                },
            });

            await prisma.order.create({
                data: {
                    userId: user2.id,
                    totalAmount: 60.00,
                    status: "PENDING",
                    items: {
                        create: [
                            {
                                variantId: jeansVariant.id,
                                quantity: 1,
                                priceAtPurchase: 60.00
                            }
                        ]
                    }
                },
            });
            console.log("✅ Orders created");
        }
    } else {
        console.log("ℹ️ Products already exist or categories missing, skipping.");
    }

    console.log("🌱 Seeding finished.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });