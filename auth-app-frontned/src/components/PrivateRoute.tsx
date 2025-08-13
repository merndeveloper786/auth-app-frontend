"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

interface PrivateRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean; // true = requires auth, false = requires no auth
}

export default function PrivateRoute({
  children,
  requireAuth = true,
}: PrivateRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    const hasValidAuth = token && userData;

    if (requireAuth) {
      // Route requires authentication
      if (!hasValidAuth) {
        // User is not authenticated, redirect to signin
        router.push("/signin");
        return;
      }
    } else {
      // Route requires no authentication (public routes)
      if (hasValidAuth) {
        // User is authenticated, redirect to profile
        router.push("/profile");
        return;
      }
    }

    setIsLoading(false);
  }, [requireAuth, router]);

  useEffect(() => {
    checkAuth();
  }, [pathname, checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600 dark:text-blue-400" />
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
