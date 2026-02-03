import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Droplets,
  Users,
  BarChart3,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import DashboardStatsCards from "@/components/admin/DashboardStats";
import RequestStatusChart from "@/components/admin/RequestStatusChart";
import RequestTrendChart from "@/components/admin/RequestTrendChart";
import BloodGroupChart from "@/components/admin/BloodGroupChart";
import BloodRequestsTable from "@/components/admin/BloodRequestsTable";
import DonorsTable from "@/components/admin/DonorsTable";
import ActivityLog from "@/components/admin/ActivityLog";
import CompletedDonationsTable from "@/components/admin/CompletedDonationsTable";
import { logoutUser } from "@/lib/auth";

type TabType = "dashboard" | "requests" | "donors" | "analytics" | "activity";

/**
 * Sahayog Red Admin Dashboard
 * Complete admin management system for blood donor management
 * Features: Real-time statistics, request & donor management, analytics, activity logs
 */
export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [adminName, setAdminName] = useState<string>("Admin");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch admin user info
  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        if (auth.currentUser) {
          const userDoc = await getDoc(
            doc(db, "users", auth.currentUser.uid)
          );
          const userData = userDoc.data();
          if (userData?.firstName && userData?.lastName) {
            setAdminName(`${userData.firstName} ${userData.lastName}`);
          }
        }
      } catch (error) {
        console.error("Error fetching admin info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminInfo();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      // Redirect to admin login page, NOT user login
      navigate("/admin", { replace: true });
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleActionComplete = () => {
    // Trigger refresh of all components
    setRefreshTrigger((prev) => prev + 1);
  };

  const navItems = [
    {
      id: "dashboard" as TabType,
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "requests" as TabType,
      label: "Blood Requests",
      icon: Droplets,
    },
    {
      id: "donors" as TabType,
      label: "Donors",
      icon: Users,
    },
    {
      id: "analytics" as TabType,
      label: "Analytics",
      icon: BarChart3,
    },
    {
      id: "activity" as TabType,
      label: "Recent Activity",
      icon: BarChart3,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
          <p className="text-gray-600">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between px-4 lg:px-8 py-4">
          {/* Left: Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            <div className="flex items-center gap-2">
              <img src="/images/logo.png" alt="Logo" className="h-8 w-auto" />
              <div>
                <h1 className="font-bold text-lg text-gray-900">Sahayog Red</h1>
                <p className="text-xs text-gray-500">Admin Dashboard</p>
              </div>
            </div>
          </div>

          {/* Right: Admin Info & Logout */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="font-medium text-gray-900 text-sm">{adminName}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed lg:relative lg:translate-x-0 left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 pt-20 lg:pt-0 transition-transform duration-300 z-40 overflow-y-auto`}
        >
          <nav className="px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    isActive
                      ? "bg-red-100 text-red-700 border-l-4 border-red-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Divider */}
            <div className="my-6 border-t border-gray-200"></div>

            {/* Logout Mobile */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 lg:hidden"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            {/* Dashboard Tab */}
            {activeTab === "dashboard" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Welcome Back, {adminName.split(" ")[0]}!
                  </h2>
                  <p className="text-gray-600">
                    Here's your blood donation system overview
                  </p>
                </div>

                {/* Stats Cards */}
                <DashboardStatsCards refreshTrigger={refreshTrigger} />

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <RequestStatusChart refreshTrigger={refreshTrigger} />
                  <BloodGroupChart refreshTrigger={refreshTrigger} />
                </div>

                {/* Trend Chart */}
                <RequestTrendChart refreshTrigger={refreshTrigger} />

                {/* Activity Log */}
                <ActivityLog refreshTrigger={refreshTrigger} />
              </div>
            )}

            {/* Blood Requests Tab */}
            {activeTab === "requests" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Blood Requests
                  </h2>
                  <p className="text-gray-600">
                    Manage and track all blood donation requests
                  </p>
                </div>

                <BloodRequestsTable
                  adminId={auth.currentUser?.uid || ""}
                  refreshTrigger={refreshTrigger}
                  onActionComplete={handleActionComplete}
                />
              </div>
            )}

            {/* Donors Tab */}
            {activeTab === "donors" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Blood Donors
                  </h2>
                  <p className="text-gray-600">
                    Manage donor profiles and their availability
                  </p>
                </div>

                <DonorsTable
                  adminId={auth.currentUser?.uid || ""}
                  refreshTrigger={refreshTrigger}
                  onActionComplete={handleActionComplete}
                />
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Analytics & Insights
                  </h2>
                  <p className="text-gray-600">
                    Comprehensive overview of system activity and trends
                  </p>
                </div>

                {/* Summary Stats */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    System Metrics
                  </h3>
                  <DashboardStatsCards refreshTrigger={refreshTrigger} />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <RequestStatusChart refreshTrigger={refreshTrigger} />
                  <BloodGroupChart refreshTrigger={refreshTrigger} />
                </div>

                {/* Trend */}
                <RequestTrendChart refreshTrigger={refreshTrigger} />
              </div>
            )}

            {/* Recent Activity Tab */}
            {activeTab === "activity" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Recent Activity
                  </h2>
                  <p className="text-gray-600">
                    Latest admin and system actions across blood requests and donors
                  </p>
                </div>

                {/* Top: recent actions timeline */}
                <ActivityLog refreshTrigger={refreshTrigger} />

                {/* Bottom: explicit completed donations table */}
                <CompletedDonationsTable refreshTrigger={refreshTrigger} />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminDashboard;
