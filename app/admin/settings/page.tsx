// app/admin/settings/page.tsx
import { Camera, Lock, Mail, Save, User } from "lucide-react";

export default function AdminSettingsPage() {
    return (
        <div className="max-w-[1000px] mx-auto space-y-8">

            {/* 1. Page Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">
                    Account Settings
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Manage your profile details and security preferences.
                </p>
            </div>

            {/* 2. Main Form Card */}
            <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 shadow-sm p-8">

                {/* AVATAR SECTION */}
                <div className="flex flex-col items-center sm:flex-row sm:items-start gap-8 border-b border-gray-100 dark:border-gray-800 pb-8 mb-8">
                    <div className="relative group">
                        <div className="h-24 w-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border-4 border-white dark:border-gray-900 shadow-sm overflow-hidden">
                            <User className="h-10 w-10 text-gray-400" />
                            {/* <img src="/avatar.jpg" alt="Profile" className="h-full w-full object-cover" /> */}
                        </div>
                        <button className="absolute bottom-0 right-0 p-2 rounded-full bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black transition-colors shadow-md">
                            <Camera className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="text-center sm:text-left">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Picture</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mt-1">
                            Upload a high-res picture. Max size 2MB.
                        </p>
                    </div>
                </div>

                {/* FORM FIELDS */}
                <form className="space-y-6">

                    {/* Row 1: Name */}
                    <div className="grid gap-2">
                        <label className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            Full Name
                        </label>
                        <input
                            type="text"
                            defaultValue="Admin User"
                            className="h-11 rounded-md border border-gray-200 bg-white px-4 text-sm outline-none focus:border-black dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-white transition-colors"
                        />
                    </div>

                    {/* Row 2: Email */}
                    <div className="grid gap-2">
                        <label className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            Email Address
                        </label>
                        <input
                            type="email"
                            defaultValue="admin@cottonbloom.com"
                            disabled
                            className="h-11 rounded-md border border-gray-200 bg-gray-50 px-4 text-sm text-gray-500 outline-none cursor-not-allowed dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400"
                        />
                        <p className="text-xs text-gray-400">Email address cannot be changed.</p>
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-800 my-6"></div>

                    {/* Row 3: Password Change */}
                    <div className="space-y-4">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            Change Password
                        </h3>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <label className="text-sm text-gray-600 dark:text-gray-400">Current Password</label>
                                <input
                                    type="password"
                                    className="h-11 rounded-md border border-gray-200 bg-white px-4 text-sm outline-none focus:border-black dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-white"
                                />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm text-gray-600 dark:text-gray-400">New Password</label>
                                <input
                                    type="password"
                                    className="h-11 rounded-md border border-gray-200 bg-white px-4 text-sm outline-none focus:border-black dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-6">
                        <button type="button" className="px-5 py-2.5 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="flex items-center gap-2 px-6 py-2.5 rounded-md bg-black text-white text-sm font-medium hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-colors shadow-sm">
                            <Save className="h-4 w-4" />
                            Save Changes
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}