// app/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing credentials");
                }

                // 1. Find User
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !user.passwordHash) {
                    throw new Error("User not found");
                }

                // 2. Check Password
                const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
                if (!isValid) throw new Error("Invalid password");

                // 3. Return User Data (Include Role!)
                return {
                    id: user.id.toString(),
                    name: user.fullName,
                    email: user.email,
                    role: user.role, // 👈 Crucial for your Admin Guard
                };
            },
        }),
    ],
    callbacks: {
        // Pass 'role' from token to session so the frontend can see it
        async jwt({ token, user }: any) {
            if (user) token.role = user.role;
            return token;
        },
        async session({ session, token }: any) {
            if (session.user) session.user.role = token.role;
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 Days (Default for customers)
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };