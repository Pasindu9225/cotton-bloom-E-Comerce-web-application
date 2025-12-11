// app/admin/layout.tsx
import AdminSidebar from "@/components/AdminSidebar";
import AdminSessionGuard from "@/components/AdminSessionGuard"; // 👈 Import the guard

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
            {/* Sidebar (Fixed Width) */}
            <div className="w-64 flex-shrink-0 hidden md:block">
                <AdminSidebar />
            </div>
            <AdminSessionGuard>
                <main className="flex-1 p-8 lg:p-12 overflow-y-auto text-gray-900 dark:text-gray-100">
                    {children}
                </main>
            </AdminSessionGuard>
        </div>
    );
}