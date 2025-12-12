// components/SignOutButton.tsx
"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-2 text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 py-2 rounded-lg transition-colors text-sm font-medium"
        >
            <LogOut className="h-4 w-4" /> Sign Out
        </button>
    );
}