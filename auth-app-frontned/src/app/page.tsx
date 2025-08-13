import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Users, Zap, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          {/* Main Heading */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Auth App
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              A modern, secure authentication system built with Next.js,
              Express.js, and PostgreSQL. Experience seamless user registration,
              login, and profile management with beautiful UI.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Secure Authentication
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                JWT tokens, password hashing, and rate limiting ensure your data
                stays safe.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                User Management
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Complete user profiles with image uploads and social login
                integration.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Modern UI
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Beautiful, responsive design built with shadcn/ui and Tailwind
                CSS.
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-3">
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/signin">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-gray-500 dark:text-gray-400">
            <p className="text-sm">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Built with Modern Technologies
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                    N
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Next.js
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  React Framework
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 dark:text-green-400 font-bold text-lg">
                    E
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Express.js
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Backend API
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 dark:text-purple-400 font-bold text-lg">
                    P
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  PostgreSQL
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Database
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-orange-600 dark:text-orange-400 font-bold text-lg">
                    T
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  TypeScript
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Type Safety
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
