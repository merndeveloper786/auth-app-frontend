"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    age?: number;
    gender?: string;
    profilePicture?: string;
    provider?: string;
    password?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Remove sidebar collapse tracking as it's handled internally

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setUser(user);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [pathname, checkAuth]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  const isAuthPage =
    pathname === "/signin" ||
    pathname === "/signup" ||
    pathname === "/complete-profile";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar - Only visible on large screens */}
      <Sidebar user={user} onLogout={handleLogout} />

      {/* Main container - Responsive layout */}
      <div className="lg:ml-16 transition-all duration-300">
        {/* Navbar - Full width on mobile, adjusted on desktop */}
        <Navbar isAuthenticated={true} user={user} />

        {/* Page content - Responsive padding and spacing */}
        <main className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
}
