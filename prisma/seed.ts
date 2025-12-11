// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"; // 👈 Ensure you have this installed

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting seed...");

    // ==========================================
    // 1. CREATE SUPER ADMIN
    // ==========================================
    const adminEmail = "admin@cottonbloom.com";
    const adminPassword = "admin123";

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
            role: "admin", // Ensure they stay admin if they already exist
            passwordHash: hashedPassword,
        },
        create: {
            email: adminEmail,
            fullName: "Super Admin",
            passwordHash: hashedPassword,
            role: "admin", // 👈 This grants access to the dashboard
        },
    });

    console.log(`👮 Admin created: ${adminEmail} (Password: ${adminPassword})`);

    // ==========================================
    // 2. CREATE CATEGORIES
    // ==========================================
    const categoryNames = ["Men", "Women", "Kids", "Accessories"];

    for (const name of categoryNames) {
        const existing = await prisma.category.findFirst({ where: { name } });
        if (!existing) {
            await prisma.category.create({ data: { name } });
        }
    }

    const menCat = await prisma.category.findFirst({ where: { name: "Men" } });
    const womenCat = await prisma.category.findFirst({ where: { name: "Women" } });

    // ==========================================
    // 3. CREATE STANDARD USERS
    // ==========================================
    const user1 = await prisma.user.upsert({
        where: { email: "alice@example.com" },
        update: {},
        create: {
            email: "alice@example.com",
            passwordHash: await bcrypt.hash("password123", 10),
            fullName: "Alice Johnson",
            role: "customer",
        },
    });

    const user2 = await prisma.user.upsert({
        where: { email: "bob@example.com" },
        update: {},
        create: {
            email: "bob@example.com",
            passwordHash: await bcrypt.hash("password123", 10),
            fullName: "Bob Smith",
            role: "customer",
        },
    });

    console.log("✅ Standard users created");

    // ==========================================
    // 4. CREATE PRODUCTS
    // ==========================================
    const existingProducts = await prisma.product.findMany();

    if (existingProducts.length === 0 && menCat && womenCat) {
        // Product 1: T-Shirt
        const tshirt = await prisma.product.create({
            data: {
                name: "Classic Cotton Tee",
                description: "Premium cotton t-shirt.",
                basePrice: 25.00,
                images: ["/placeholder.jpg"], // 👈 Uses the array format
                categoryId: menCat.id,
                variants: {
                    create: [
                        { size: "M", color: "Black", stockQuantity: 10 },
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
                images: ["/placeholder.jpg"],
                categoryId: womenCat.id,
                variants: {
                    create: [
                        { size: "32", color: "Blue", stockQuantity: 20 }
                    ]
                }
            },
        });

        console.log("✅ Products created");

        // ==========================================
        // 5. CREATE ORDERS (History)
        // ==========================================
        const tshirtVariant = await prisma.productVariant.findFirst({ where: { productId: tshirt.id } });
        const jeansVariant = await prisma.productVariant.findFirst({ where: { productId: jeans.id } });

        if (tshirtVariant && jeansVariant) {
            await prisma.order.create({
                data: {
                    userId: user1.id,
                    totalAmount: 50.00,
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
        console.log("ℹ️ Products already exist, skipping product creation.");
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