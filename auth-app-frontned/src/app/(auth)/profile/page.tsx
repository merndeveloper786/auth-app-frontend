/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Save,
  Edit,
  X,
  Loader2,
  Camera,
  Calendar,
  Lock,
} from "lucide-react";
import PrivateRoute from "@/components/PrivateRoute";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  profilePicture?: string;
  provider: string;
  password?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
  });

  const [changePasswordData, setChangePasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showChangePassword, setShowChangePassword] = useState(false);

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/signin");
      return;
    }

    try {
      const user = JSON.parse(userData);
      setUser(user);
    } catch {
      setError("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Profile fetch - Token:", token ? "exists" : "missing");
      console.log(
        "Profile fetch - API URL:",
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
      );

      if (!token) {
        router.push("/signin");
        return;
      }

      const apiUrl = `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
      }/users/profile`;
      console.log("Profile fetch - Full URL:", apiUrl);

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Profile fetch - Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Profile fetch - Response data:", data);
        // Handle both possible response structures
        const userData = data.user || data;
        setUser(userData);
        setFormData({
          name: userData.name || "",
          age: userData.age?.toString() || "",
          gender: userData.gender || "",
        });
        if (userData.profilePicture) {
          setImagePreview(userData.profilePicture);
        }
      } else if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/signin");
      } else {
        setError("Failed to load profile");
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkAuth();
    fetchProfile();

    // Add event listener for navbar Change Password button
    const handleShowChangePassword = () => {
      setShowChangePassword(true);
    };

    window.addEventListener("showChangePassword", handleShowChangePassword);

    return () => {
      window.removeEventListener(
        "showChangePassword",
        handleShowChangePassword
      );
    };
  }, [checkAuth, fetchProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      gender: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();

      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // Add profile image if selected
      if (profileImage) {
        formDataToSend.append("profilePicture", profileImage);
      }

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
        }/users/profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess("Profile updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
        // Handle both possible response structures
        const userData = data.user || data;
        setUser(userData);
        setIsEditing(false);
        setProfileImage(null);
      } else {
        setError(data.error || "Failed to update profile");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess("");

    if (changePasswordData.newPassword !== changePasswordData.confirmPassword) {
      setError("New passwords do not match");
      setIsSaving(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const requestBody: Record<string, string> = {
        newPassword: changePasswordData.newPassword,
      };

      // Only include current password if user has one (not for Google users without password)
      if (
        user?.provider === "google" &&
        (!user.password || user.password === "")
      ) {
        // Google user without password - don't send current password
      } else {
        requestBody.currentPassword = changePasswordData.currentPassword;
      }

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
        }/users/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || "Password changed successfully!");
        setTimeout(() => setSuccess(""), 3000);
        setShowChangePassword(false);
        setChangePasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setError(data.error || "Failed to change password");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("user");
  //   router.push("/");
  // };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600 dark:text-blue-400" />
          <p className="text-gray-600 dark:text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">User not found</p>
        </div>
      </div>
    );
  }

  return (
    <PrivateRoute requireAuth={true}>
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-full">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {/* Profile Picture */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                    )}
                  </div>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {user.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {user.email}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Profile Form */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-gray-700 dark:text-gray-200"
                    >
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white "
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-gray-700 dark:text-gray-200"
                    >
                      Email
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                      <Input
                        id="email"
                        type="email"
                        value={user.email}
                        disabled
                        className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="age"
                      className="text-gray-700 dark:text-gray-200"
                    >
                      Age
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                      <Input
                        id="age"
                        name="age"
                        type="number"
                        value={formData.age}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        min={13}
                        max={120}
                        className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="gender"
                      className="text-gray-700 dark:text-gray-200"
                    >
                      Gender
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                      <Select
                        value={formData.gender}
                        onValueChange={handleSelectChange}
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="w-full pl-10 h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>

                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                          <SelectItem
                            value="male"
                            className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            Male
                          </SelectItem>
                          <SelectItem
                            value="female"
                            className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            Female
                          </SelectItem>
                          <SelectItem
                            value="other"
                            className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            Other
                          </SelectItem>
                          <SelectItem
                            value="prefer-not-to-say"
                            className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            Prefer not to say
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">
                  Account Information
                </h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-300">
                      Provider:
                    </span>
                    <span className="ml-2 font-medium capitalize text-gray-900 dark:text-white">
                      {user.provider}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-300">
                      Last Updated:
                    </span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {new Date(user.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  {isEditing ? (
                    <>
                      <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={() => setIsEditing(true)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    </>
                  )}
                </div>

                {/* Cancel Button - Card Bottom Right Corner */}
                {isEditing && (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                )}
              </div>

              {/* Change Password Form */}
              {showChangePassword && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">
                    {user?.provider === "google" &&
                    (!user.password || user.password === "")
                      ? "Set Password"
                      : "Change Password"}
                  </h4>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    {/* Only show current password field if user has a password */}
                    {!(
                      user?.provider === "google" &&
                      (!user.password || user.password === "")
                    ) && (
                      <div className="space-y-2">
                        <Label
                          htmlFor="current-password"
                          className="text-gray-700 dark:text-gray-200"
                        >
                          Current Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                          <Input
                            id="current-password"
                            name="currentPassword"
                            type="password"
                            placeholder="Enter current password"
                            value={changePasswordData.currentPassword}
                            onChange={(e) =>
                              setChangePasswordData((prev) => ({
                                ...prev,
                                currentPassword: e.target.value,
                              }))
                            }
                            required
                            className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label
                        htmlFor="new-password"
                        className="text-gray-700 dark:text-gray-200"
                      >
                        New Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                        <Input
                          id="new-password"
                          name="newPassword"
                          type="password"
                          placeholder="Enter new password"
                          value={changePasswordData.newPassword}
                          onChange={(e) =>
                            setChangePasswordData((prev) => ({
                              ...prev,
                              newPassword: e.target.value,
                            }))
                          }
                          required
                          className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="confirm-password"
                        className="text-gray-700 dark:text-gray-200"
                      >
                        Confirm New Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                        <Input
                          id="confirm-password"
                          name="confirmPassword"
                          type="password"
                          placeholder="Confirm new password"
                          value={changePasswordData.confirmPassword}
                          onChange={(e) =>
                            setChangePasswordData((prev) => ({
                              ...prev,
                              confirmPassword: e.target.value,
                            }))
                          }
                          required
                          className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button type="submit" disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {user?.provider === "google" &&
                            (!user.password || user.password === "")
                              ? "Setting Password..."
                              : "Changing Password..."}
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            {user?.provider === "google" &&
                            (!user.password || user.password === "")
                              ? "Set Password"
                              : "Change Password"}
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowChangePassword(false);
                          setChangePasswordData({
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: "",
                          });
                        }}
                        className="border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PrivateRoute>
  );
}
