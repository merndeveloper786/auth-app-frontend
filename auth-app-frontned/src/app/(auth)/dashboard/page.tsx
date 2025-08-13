"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  UserPlus,
  Calendar,
  TrendingUp,
  BarChart3,
  PieChart,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import axios from "axios";

interface OverviewData {
  totalUsers: number;
  newUsers: number;
  weeklyUsers: number;
  todayUsers: number;
}

interface GenderData {
  gender: string;
  count: number;
}

interface AgeData {
  ageRange: string;
  count: number;
}

interface TrendData {
  date: string;
  count: number;
}

interface RecentUser {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  createdAt: string;
  provider: string;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function DashboardPage() {
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [genderData, setGenderData] = useState<GenderData[]>([]);
  const [ageData, setAgeData] = useState<AgeData[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in again.");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      const baseURL = "http://localhost:5000/api/users";

      console.log("🔍 Fetching dashboard data...", {
        baseURL,
        hasToken: !!token,
        tokenPreview: token?.substring(0, 20) + "...",
      });

      const [overviewRes, genderRes, ageRes, trendsRes, recentRes] =
        await Promise.all([
          axios.get(`${baseURL}/analytics/overview`, { headers }),
          axios.get(`${baseURL}/analytics/gender`, { headers }),
          axios.get(`${baseURL}/analytics/age`, { headers }),
          axios.get(`${baseURL}/analytics/trends`, { headers }),
          axios.get(`${baseURL}/analytics/recent`, { headers }),
        ]);

      console.log("📊 Dashboard data received:", {
        overview: overviewRes.data,
        genderCount: genderRes.data?.length,
        ageCount: ageRes.data?.length,
        trendsCount: trendsRes.data?.length,
        recentCount: recentRes.data?.length,
      });

      setOverview(overviewRes.data);
      setGenderData(genderRes.data);
      setAgeData(ageRes.data);
      setTrendData(trendsRes.data);
      setRecentUsers(recentRes.data);
    } catch (err: unknown) {
      console.error("❌ Dashboard API Error:", err);
      const error = err as {
        response?: { data?: { error?: string }; status?: number };
        message?: string;
        code?: string;
      };
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch dashboard data";
      const statusCode = error.response?.status;

      if (statusCode === 401 || statusCode === 403) {
        // Clear invalid token and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setError("Session expired. Please log in again.");
        // Redirect to login after a short delay
        setTimeout(() => {
          window.location.href = "/signin";
        }, 2000);
      } else if (statusCode === 404) {
        setError(
          "Dashboard API endpoints not found. Backend may not be running."
        );
      } else if (error.code === "ECONNREFUSED") {
        setError(
          "Cannot connect to backend server. Please ensure backend is running on port 5000."
        );
      } else {
        setError(`${errorMessage} (Status: ${statusCode || "Unknown"})`);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTrendDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">
                Loading dashboard...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <Button onClick={fetchDashboardData}>Retry</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Overview of user registrations and demographics
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Total Users
              </CardTitle>
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="text-xl sm:text-2xl font-bold">
                {overview?.totalUsers || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                All registered users
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6">
              <CardTitle className="text-xs sm:text-sm font-medium">
                New Users (30d)
              </CardTitle>
              <UserPlus className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="text-xl sm:text-2xl font-bold">
                {overview?.newUsers || 0}
              </div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Weekly Users
              </CardTitle>
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="text-xl sm:text-2xl font-bold">
                {overview?.weeklyUsers || 0}
              </div>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Today&apos;s Users
              </CardTitle>
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="text-xl sm:text-2xl font-bold">
                {overview?.todayUsers || 0}
              </div>
              <p className="text-xs text-muted-foreground">Registered today</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Registration Trends */}
          <Card className="bg-white dark:bg-gray-800 max-[425px]:mobile-card-bg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Registration Trends (30 Days)
              </CardTitle>
              <CardDescription>
                Daily user registrations over the last month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatTrendDate}
                    fontSize={10}
                    className="sm:text-xs"
                    interval="preserveStartEnd"
                  />
                  <YAxis fontSize={12} />
                  <Tooltip
                    labelFormatter={(value) => formatDate(value)}
                    formatter={(value) => [value, "Registrations"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gender Distribution */}
          <Card className="bg-white dark:bg-gray-800 max-[425px]:mobile-card-bg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Gender Distribution
              </CardTitle>
              <CardDescription>User distribution by gender</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer
                width="100%"
                height={250}
                className="sm:h-[300px]"
              >
                <RechartsPieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ gender, percent }) =>
                      `${gender}: ${((percent || 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={60}
                    className="sm:outerRadius-80"
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {genderData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Age Distribution & Recent Users */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Age Distribution */}
          <Card className="bg-white dark:bg-gray-800 max-[425px]:mobile-card-bg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Age Distribution
              </CardTitle>
              <CardDescription>User distribution by age groups</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ageRange" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip formatter={(value) => [value, "Users"]} />
                  <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Users */}
          <Card className="bg-white dark:bg-gray-800 max-[425px]:mobile-card-bg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Recent Registrations
              </CardTitle>
              <CardDescription>
                Latest users who joined the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                  >
                    <div className="flex-shrink-0">
                      {user.profilePicture ? (
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={user.profilePicture}
                          alt={user.name}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                    <div className="flex flex-col items-end text-xs text-gray-500 dark:text-gray-400">
                      <span>{formatDate(user.createdAt)}</span>
                      <span className="capitalize">{user.provider}</span>
                    </div>
                  </div>
                ))}
                {recentUsers.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No recent users found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
