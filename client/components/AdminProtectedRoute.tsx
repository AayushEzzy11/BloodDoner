import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth, db } from "@/firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * AdminProtectedRoute Component
 * Ensures only authenticated users with admin role can access admin routes
 * 
 * Logic:
 * - If not authenticated → redirect to /admin (login page)
 * - If authenticated but not admin → redirect to /
 * - If authenticated AND admin → allow access
 */
export const AdminProtectedRoute = ({
  children,
}: AdminProtectedRouteProps) => {
  const [status, setStatus] = useState<"loading" | "authorized" | "unauthorized">(
    "loading"
  );
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          // Not authenticated - redirect to /admin (login page)
          setRedirectPath("/admin");
          setStatus("unauthorized");
          return;
        }

        // User is authenticated, check role
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();

        if (userData?.role === "admin") {
          // User is admin - allow access
          setStatus("authorized");
          setRedirectPath(null);
        } else {
          // User exists but is not admin - redirect to home
          setRedirectPath("/");
          setStatus("unauthorized");
        }
      } catch (error) {
        console.error("Error checking admin role:", error);
        // On error, redirect to admin login for safety
        setRedirectPath("/admin");
        setStatus("unauthorized");
      }
    });

    return () => unsubscribe();
  }, []);

  // Show loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authorized
  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  // User is authorized
  return <>{children}</>;
};

export default AdminProtectedRoute;
