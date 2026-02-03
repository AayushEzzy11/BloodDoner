import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { loginUser } from "@/lib/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "sonner";

/**
 * AdminLogin Component
 * Separate admin authentication from user login
 * Verifies admin role from Firestore before allowing access
 * Routes:
 * - /admin → this login page
 * - /admin/dashboard → admin dashboard (protected)
 */
export default function AdminLogin() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Check if user is already logged in as admin
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // Check if user has admin role
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const userData = userDoc.data();

          if (userData?.role === "admin") {
            // User is already an admin, redirect to dashboard
            navigate("/admin/dashboard", { replace: true });
          }
          // If not admin, stay on this page
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.id]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password } = loginData;

    if (!email || !password) {
      toast.error("Email and password are required.");
      return;
    }

    setIsLoading(true);
    try {
      // 1. Authenticate with Firebase Auth
      const user = await loginUser(email, password);

      // 2. Verify admin role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();

      if (userData?.role !== "admin") {
        // Not an admin, logout and show error
        await auth.signOut();
        toast.error("Access denied. Admin credentials required.");
        setLoginData({ email: "", password: "" });
        setIsLoading(false);
        return;
      }

      // Admin login successful
      toast.success("Welcome, Administrator!");
      navigate("/admin/dashboard", { replace: true });
    } catch (err: any) {
      console.error("Login error:", err);
      switch (err.code) {
        case "auth/user-not-found":
          toast.error("No user found with this email.");
          break;
        case "auth/invalid-credential":
          toast.error("Incorrect email or password.");
          break;
        case "auth/invalid-email":
          toast.error("Invalid email format.");
          break;
        case "auth/too-many-requests":
          toast.error("Too many failed login attempts. Please try again later.");
          break;
        default:
          toast.error(err.message || "Login failed. Please try again.");
      }
      setLoginData({ ...loginData, password: "" });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          <img src="/images/logo.png" alt="Sahayog Red Logo" style={{ maxHeight: '80px', maxWidth: '80px', objectFit: 'contain', margin: '0 auto 24px' }} />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sahayog Red
          </h1>
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <Lock className="h-4 w-4" />
            Admin Portal
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-2 pb-4">
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>
              Enter your admin credentials to access the dashboard
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={loginData.email}
                  onChange={handleChange}
                  placeholder="admin@sahayogred.com"
                  disabled={isLoading}
                  className="h-10"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="h-10"
                  required
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-10 bg-red-600 hover:bg-red-700 text-white font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Logging in...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Info Message */}
            <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-700">
                <strong>Note:</strong> This is the admin portal. If you're a
                regular user, please use the main login page.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          © 2026 Sahayog Red. All rights reserved.
        </p>
      </div>
    </div>
  );
}