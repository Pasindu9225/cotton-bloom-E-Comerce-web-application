// components/AdminSessionGuard.tsx
"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

const ADMIN_TIMEOUT_MS = 30 * 60 * 1000; // 30 Minutes

export default function AdminSessionGuard({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const [lastActivity, setLastActivity] = useState(Date.now());

    useEffect(() => {
        // Only run this logic if the user is an ADMIN
        if (session?.user?.role !== "admin") return;

        const checkForInactivity = setInterval(() => {
            if (Date.now() - lastActivity > ADMIN_TIMEOUT_MS) {
                // Time is up! Force logout.
                console.log("Admin session timed out due to inactivity.");
                signOut({ callbackUrl: "/login" });
            }
        }, 60000); // Check every 1 minute

        // Reset timer on any user action
        const resetTimer = () => setLastActivity(Date.now());

        window.addEventListener("mousemove", resetTimer);
        window.addEventListener("keypress", resetTimer);
        window.addEventListener("click", resetTimer);

        return () => {
            clearInterval(checkForInactivity);
            window.removeEventListener("mousemove", resetTimer);
            window.removeEventListener("keypress", resetTimer);
            window.removeEventListener("click", resetTimer);
        };
    }, [session, lastActivity]);

    return <>{children}</>;
}