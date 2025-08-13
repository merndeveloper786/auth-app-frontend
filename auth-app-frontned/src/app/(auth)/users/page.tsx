"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  User,
  Calendar,
  Mail,
  Loader2,
  Eye,
  Grid,
  List,
} from "lucide-react";
import PrivateRoute from "@/components/PrivateRoute";

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  profilePicture?: string;
  provider: string;
  createdAt: string;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<
    {
      id: string;
      name: string;
      email: string;
      age?: number;
      gender?: string;
      profilePicture?: string;
      provider?: string;
      createdAt: string;
    }[]
  >([]);
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
    email: string;
    age?: number;
    gender?: string;
    profilePicture?: string;
    provider?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      router.push("/signin");
      return;
    }

    if (userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentUser(user);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, [router]);

  const fetchUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/signin");
        return;
      }

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
        }/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Handle both possible response structures
        const usersData = data.users || data;
        setUsers(usersData);
      } else if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/signin");
      } else {
        setError("Failed to load users");
      }
    } catch (error) {
      console.error("Users fetch error:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkAuth();
    fetchUsers();
  }, [checkAuth, fetchUsers]);

  const handleViewProfile = (userId: string) => {
    if (currentUser && userId === currentUser.id) {
      // If it's the current user, redirect to their own profile
      router.push("/profile");
    } else {
      // If it's another user, navigate to their profile page
      router.push(`/users/${userId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Loading users...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PrivateRoute requireAuth={true}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 lg:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center space-x-3 mb-4"></div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {users.length} user{users.length !== 1 ? "s" : ""} found
              </p>
              <div className="flex items-center justify-between sm:justify-end space-x-2">
                <Button onClick={fetchUsers} variant="outline" size="sm" className="flex-1 sm:flex-none">
                  <span className="sm:hidden">Refresh</span>
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
                <div className="flex border border-gray-200 dark:border-gray-700 rounded-md">
                  <Button
                    variant={viewMode === "cards" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("cards")}
                    className="rounded-r-none px-2 sm:px-3"
                  >
                    <Grid className="w-4 h-4" />
                    <span className="ml-1 hidden sm:inline">Cards</span>
                  </Button>
                  <Button
                    variant={viewMode === "table" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("table")}
                    className="rounded-l-none px-2 sm:px-3"
                  >
                    <List className="w-4 h-4" />
                    <span className="ml-1 hidden sm:inline">Table</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {users.length === 0 ? (
            <Card className="max-[425px]:mobile-card-bg">
              <CardContent className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No users found
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  There are no users registered yet.
                </p>
              </CardContent>
            </Card>
          ) : viewMode === "cards" ? (
            // Card View
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {users.map((user) => (
                <Card
                  key={user.id}
                  className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {user.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base sm:text-lg truncate">
                          {user.name}
                        </CardTitle>
                        <CardDescription className="text-sm truncate">
                          {user.email}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="px-4 sm:px-6 py-3 sm:py-4 space-y-3 sm:space-y-4">
                    {/* User Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-0 text-sm">
                      {/* Age */}
                      <div className="flex items-center space-x-2 px-1">
                        <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="font-medium">
                          Age: {user.age || "Not set"}
                        </span>
                      </div>

                      {/* Gender */}
                      <div className="flex items-center space-x-2 justify-end px-1">
                        <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="font-medium capitalize">
                          {user.gender || "Not set"}
                        </span>
                      </div>
                    </div>

                    {/* Provider and Date */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {/* Provider */}
                      <div className="flex items-center space-x-2 px-1">
                        <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="font-medium capitalize">
                          {user.provider}
                        </span>
                      </div>

                      {/* Date */}
                      <div className="flex items-center justify-end px-1">
                        <span className="text-gray-500 dark:text-gray-400 text-xs">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleViewProfile(user.id)}
                    >
                      {currentUser && user.id === currentUser.id ? (
                        <>
                          <User className="w-4 h-4 mr-2" />
                          My Profile
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-2" />
                          View Profile
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // Table View
            <Card className="max-[425px]:mobile-card-bg">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px]">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                          Age
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                          Gender
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                          Provider
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                          Joined
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {users.map((user) => (
                        <tr
                          key={user.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                                {user.profilePicture ? (
                                  <img
                                    src={user.profilePicture}
                                    alt={user.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                )}
                              </div>
                              <div className="ml-2 sm:ml-4 min-w-0 flex-1">
                                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {user.name}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                                  {user.email}
                                </div>
                                {/* Mobile-only info */}
                                <div className="sm:hidden mt-1 text-xs text-gray-500 dark:text-gray-400">
                                  {user.age && `Age: ${user.age}`}
                                  {user.age && user.gender && " • "}
                                  {user.gender && `${user.gender}`}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white hidden sm:table-cell">
                            {user.age || "Not set"}
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white capitalize hidden md:table-cell">
                            {user.gender || "Not set"}
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white capitalize hidden lg:table-cell">
                            {user.provider}
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewProfile(user.id)}
                              className="w-full sm:w-auto"
                            >
                              {currentUser && user.id === currentUser.id ? (
                                <>
                                  <User className="w-4 h-4 sm:mr-2" />
                                  <span className="hidden sm:inline">My Profile</span>
                                </>
                              ) : (
                                <>
                                  <Eye className="w-4 h-4 sm:mr-2" />
                                  <span className="hidden sm:inline">View</span>
                                </>
                              )}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PrivateRoute>
  );
}
