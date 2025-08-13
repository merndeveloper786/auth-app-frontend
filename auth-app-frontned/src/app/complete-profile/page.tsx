"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Calendar,
  Loader2,
  CheckCircle,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import PrivateRoute from "@/components/PrivateRoute";

interface UserData {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  provider: string;
  age?: number;
  gender?: string;
  createdAt: string;
}

function CompleteProfilePageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState<UserData | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const token = searchParams.get("token");
    const userParam = searchParams.get("user");

    if (!token || !userParam) {
      router.push("/signin");
      return;
    }

    try {
      const userData = JSON.parse(decodeURIComponent(userParam));
      setUser(userData);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/signin");
    }

    // Add event listener for navbar Change Password button
    const handleShowChangePassword = () => {
      setError("Please complete your profile first before changing password.");
    };
    window.addEventListener("showChangePassword", handleShowChangePassword);
    return () => {
      window.removeEventListener(
        "showChangePassword",
        handleShowChangePassword
      );
    };
  }, [searchParams, router]);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    // Validate age
    if (!formData.age) {
      errors.age = "Age is required";
    } else {
      const age = parseInt(formData.age);
      if (isNaN(age) || age < 13 || age > 120) {
        errors.age = "Age must be between 13 and 120";
      }
    }

    // Validate gender
    if (!formData.gender) {
      errors.gender = "Gender is required";
    }

    // Validate password for Google users
    if (user?.provider === "google") {
      if (!formData.password) {
        errors.password = "Password is required for Google users";
      } else if (formData.password.length < 6) {
        errors.password = "Password must be at least 6 characters long";
      } else if (!formData.confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      gender: value,
    }));
    if (formErrors.gender) {
      setFormErrors((prev) => ({
        ...prev,
        gender: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
        }/auth/complete-profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setSuccess("Profile completed successfully!");
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        setTimeout(() => {
          router.push("/profile");
        }, 1500);
      } else {
        setError(data.error || "Failed to complete profile");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600 dark:text-blue-400" />
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <PrivateRoute requireAuth={true}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">
              Complete Your Profile
            </CardTitle>
            <CardDescription>
              Welcome {user.name}! Please provide some additional information to
              complete your profile.
              {user.provider === "google" && (
                <span className="block mt-2 text-sm text-amber-600 dark:text-amber-400">
                  Since you signed up with Google, you can optionally set a
                  password for local authentication.
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert>
                  <AlertDescription className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {success}
                  </AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="age">Age *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={handleInputChange}
                    required
                    min={13}
                    max={120}
                    className={`pl-10 ${
                      formErrors.age
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }`}
                  />
                </div>
                {formErrors.age && (
                  <p className="text-sm text-red-500">{formErrors.age}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={handleSelectChange}
                  required
                >
                  <SelectTrigger
                    className={`w-full h-10 ${
                      formErrors.gender
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }`}
                  >
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.gender && (
                  <p className="text-sm text-red-500">{formErrors.gender}</p>
                )}
              </div>

              {/* Password fields for Google users */}
              {user.provider === "google" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Set a password for local login"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className={`pl-10 pr-10 ${
                          formErrors.password
                            ? "border-red-500 focus:border-red-500"
                            : ""
                        }`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {formErrors.password && (
                      <p className="text-sm text-red-500">
                        {formErrors.password}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      This password will be used for future password changes and
                      local authentication
                    </p>
                  </div>
                  {formData.password && (
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirm Password *
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                          className={`pl-10 pr-10 ${
                            formErrors.confirmPassword
                              ? "border-red-500 focus:border-red-500"
                              : ""
                          }`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {formErrors.confirmPassword && (
                        <p className="text-sm text-red-500">
                          {formErrors.confirmPassword}
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={
                  isLoading ||
                  !formData.age ||
                  !formData.gender ||
                  (user.provider === "google" &&
                    (!formData.password ||
                      formData.password !== formData.confirmPassword))
                }
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Completing Profile...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete Profile
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PrivateRoute>
  );
}

export default function CompleteProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600 dark:text-blue-400" />
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      }
    >
      <CompleteProfilePageInner />
    </Suspense>
  );
}
