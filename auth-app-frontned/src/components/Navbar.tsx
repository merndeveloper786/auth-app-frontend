"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  User,
  LayoutDashboard,
  Users,
  Lock,
  LogOut,
  Sun,
  Moon,
  Monitor,
  Home,
  BarChart3,
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

interface NavbarProps {
  isAuthenticated?: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    age?: number;
    gender?: string;
    profilePicture?: string;
    provider?: string;
    password?: string;
  } | null;
}

export default function Navbar({ isAuthenticated = false, user }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setAuthState({
          isAuthenticated: true,
          user,
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const isAuth = isAuthenticated || authState.isAuthenticated;
  const currentUser = user || authState.user;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  const getCurrentRouteInfo = () => {
    if (pathname === "/profile") {
      return {
        title: "Profile",
        subtitle: "Manage your account",
        icon: User,
      };
    } else if (pathname === "/complete-profile") {
      return {
        title: "Complete Profile",
        subtitle: "Set up your account",
        icon: User,
      };
    } else if (pathname === "/users") {
      return {
        title: "Users",
        subtitle: "Browse all users",
        icon: Users,
      };
    } else if (pathname.startsWith("/users/")) {
      return {
        title: "User Profile",
        subtitle: "View user details",
        icon: User,
      };
    } else {
      return {
        title: "Dashboard",
        subtitle: "User Management System",
        icon: LayoutDashboard,
      };
    }
  };

  const currentRoute = getCurrentRouteInfo();

  const shouldShowChangePassword =
    (pathname === "/profile" || pathname === "/complete-profile") &&
    currentUser &&
    (currentUser.provider === "credentials" ||
      currentUser.provider === "google");

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 max-[425px]:mobile-glass-effect max-[425px]:border-white/20">
      <div className="px-3 sm:px-5">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo / App Title */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-4">
              {/* <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <RouteIcon className="w-6 h-6 text-white" />
              </div> */}
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-none">
                  {currentRoute.title}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                  {currentRoute.subtitle}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {shouldShowChangePassword && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const event = new CustomEvent("showChangePassword");
                  window.dispatchEvent(event);
                }}
                className="flex items-center space-x-2"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {currentUser?.provider === "google" &&
                  (!currentUser.password || currentUser.password === "")
                    ? "Set Password"
                    : "Change Password"}
                </span>
              </Button>
            )}

            {isAuth && currentUser && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            )}

            {/* Theme Toggle */}
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <Button
                variant={theme === "light" ? "default" : "ghost"}
                size="sm"
                onClick={() => setTheme("light")}
                className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                title="Light mode"
              >
                <Sun className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "ghost"}
                size="sm"
                onClick={() => setTheme("dark")}
                className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                title="Dark mode"
              >
                <Moon className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button
                variant={theme === "system" ? "default" : "ghost"}
                size="sm"
                onClick={() => setTheme("system")}
                className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                title="System mode"
              >
                <Monitor className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile theme toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
                const currentIndex = themes.indexOf(theme);
                const nextTheme = themes[(currentIndex + 1) % themes.length];
                setTheme(nextTheme);
              }}
              className="h-8 w-8 p-0 sm:hidden"
              title={`Switch theme (current: ${theme})`}
            >
              {theme === 'light' ? <Sun className="h-4 w-4" /> : 
               theme === 'dark' ? <Moon className="h-4 w-4" /> : 
               <Monitor className="h-4 w-4" />}
            </Button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 dark:text-white focus:outline-none touch-target"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    mobileMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-3 sm:px-5 pb-4 space-y-3 border-t border-gray-200 dark:border-gray-700 max-[425px]:mobile-glass-effect max-[425px]:border-white/20">
          {/* Mobile Navigation Links */}
          <div className="space-y-2 mb-4">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant={pathname === "/" ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start space-x-2"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Button>
            </Link>
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant={pathname === "/dashboard" ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start space-x-2"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Dashboard</span>
              </Button>
            </Link>
            <Link href="/users" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant={pathname === "/users" ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start space-x-2"
              >
                <Users className="w-4 h-4" />
                <span>Users</span>
              </Button>
            </Link>
            <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant={pathname === "/profile" ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start space-x-2"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Button>
            </Link>
          </div>
          
          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            {shouldShowChangePassword && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const event = new CustomEvent("showChangePassword");
                  window.dispatchEvent(event);
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-start space-x-2 mb-3"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {currentUser?.provider === "google" &&
                  (!currentUser.password || currentUser.password === "")
                    ? "Set Password"
                    : "Change Password"}
                </span>
              </Button>
            )}
            {isAuth && currentUser && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-start space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            )}
          </div>
          <div className="hidden sm:flex md:hidden items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <Button
              variant={theme === "light" ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                setTheme("light");
                setMobileMenuOpen(false);
              }}
              className="h-8 w-8 p-0"
              title="Light mode"
            >
              <Sun className="h-4 w-4" />
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                setTheme("dark");
                setMobileMenuOpen(false);
              }}
              className="h-8 w-8 p-0"
              title="Dark mode"
            >
              <Moon className="h-4 w-4" />
            </Button>
            <Button
              variant={theme === "system" ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                setTheme("system");
                setMobileMenuOpen(false);
              }}
              className="h-8 w-8 p-0"
              title="System mode"
            >
              <Monitor className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
