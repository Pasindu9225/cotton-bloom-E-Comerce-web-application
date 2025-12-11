// app/api/register/route.ts
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { email, password, fullName } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        // 1. Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ message: "Email already exists" }, { status: 409 });
        }

        // 2. Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Create the user
        await prisma.user.create({
            data: {
                email,
                passwordHash: hashedPassword,
                fullName,
                role: "customer", // Force default role to customer
            },
        });

        return NextResponse.json({ message: "User created successfully" }, { status: 201 });
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}