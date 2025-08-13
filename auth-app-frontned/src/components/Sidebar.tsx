"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User, Shield, Home, Users, BarChart3 } from "lucide-react";

interface SidebarProps {
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
  onLogout?: () => void;
}

export default function Sidebar({}: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const menuItems = [
    {
      href: "/",
      icon: Home,
      label: "Home",
      active: pathname === "/",
    },
    {
      href: "/dashboard",
      icon: BarChart3,
      label: "Dashboard",
      active: pathname === "/dashboard",
    },
    {
      href: "/users",
      icon: Users,
      label: "Users",
      active: pathname === "/users",
    },
    {
      href: "/profile",
      icon: User,
      label: "Profile",
      active: pathname === "/profile",
    },
  ];

  return (
    <div
      className={`hidden lg:flex bg-white dark:bg-gray-900 shadow-lg border-r border-gray-200 dark:border-gray-700 h-screen transition-all duration-300 ease-in-out flex-col fixed left-0 top-0 z-30 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      {/* App Header */}
      <div className="px-3 pt-4">
        <div
          className={`flex items-center space-x-3 ${
            isCollapsed ? "justify-center" : "justify-start"
          }`}
        >
          {/* App Icon */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </div>

          {/* App Name and Subtitle - Show only when expanded */}
          {!isCollapsed && (
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">
                AUTH APP
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                Secure Authentication
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-8">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-full flex items-center transition-all duration-200 ${
                      isCollapsed ? "px-2 justify-center" : "px-3 justify-start"
                    } ${
                      item.active
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {!isCollapsed && <span className="ml-3 text-sm">{item.label}</span>}
                  </Button>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
