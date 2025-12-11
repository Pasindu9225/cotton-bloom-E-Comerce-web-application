// prisma/create-admin.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const email = "admin@cottonbloom.com"; // 👈 Change if you want
    const password = "admin123";           // 👈 Change if you want

    console.log(`👤 Creating admin: ${email}...`);

    // 1. Hash the password (Security First!)
    const passwordHash = await bcrypt.hash(password, 10);

    // 2. Create (or Update) the Admin User
    const admin = await prisma.user.upsert({
        where: { email },
        update: {
            // If admin exists, ensure they have the 'admin' role
            role: "admin",
            passwordHash: passwordHash,
        },
        create: {
            email,
            fullName: "Super Admin",
            passwordHash,
            role: "admin", // 👈 Crucial
        },
    });

    console.log("✅ Admin account ready!");
    console.log(`👉 Login with: ${email} / ${password}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });