/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  // CardDescription,
  // CardHeader,
  // CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Mail, Calendar, ArrowLeft, Loader2, Users } from "lucide-react";
import { Label } from "@/components/ui/label";

// interface UserProfile {
//   id: string;
//   name: string;
//   email: string;
//   age: number;
//   gender: string;
//   profilePicture?: string;
//   provider: string;
//   createdAt: string;
// }

export default function UserProfilePage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;

  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    age?: number;
    gender?: string;
    profilePicture?: string;
    provider?: string;
    createdAt: string;
  } | null>(null);
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

  useEffect(() => {
    checkAuth();
    fetchUserProfile();
  }, [userId]);

  const checkAuth = () => {
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

        // If viewing own profile, redirect to profile page
        if (user.id === userId) {
          router.push("/profile");
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/signin");
        return;
      }

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
        }/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Handle both possible response structures
        const userData = data.user || data;
        setUser(userData);
      } else if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/signin");
      } else if (response.status === 404) {
        setError("User not found");
      } else {
        setError("Failed to load user profile");
      }
    } catch (error) {
      console.error("User profile fetch error:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600 dark:text-blue-400" />
          <p className="text-gray-600 dark:text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.push("/users")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Users
          </Button>
        </div>

        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Profile Picture and Basic Info */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold dark:text-white ">
                  {user.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Profile Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <div className="pl-10 py-2 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                      {user.name}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <div className="pl-10 py-2 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                      {user.email}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Age
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <div className="pl-10 py-2 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                      {user.age || "Not set"}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Gender
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <div className="pl-10 py-2 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 rounded-md capitalize border border-gray-200 dark:border-gray-700">
                      {user.gender || "Not set"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h4 className="font-semibold mb-4 dark:text-white">
                Account Information
              </h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-300">
                    Provider:
                  </span>
                  <span className="ml-2 font-medium capitalize dark:text-white">
                    {user.provider}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-300">
                    Joined:
                  </span>
                  <span className="ml-2 font-medium dark:text-white">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex justify-between items-center">
                <Button variant="outline" onClick={() => router.push("/users")}>
                  <Users className="w-4 h-4 mr-2" />
                  Back to Users
                </Button>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  This is a read-only view
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
