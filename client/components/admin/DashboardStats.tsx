import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStats, DashboardStats } from "@/lib/adminDashboard";
import { Users, Droplets, CheckCircle, Clock } from "lucide-react";

interface DashboardStatsProps {
  refreshTrigger?: number;
}

export const DashboardStatsCards = ({ refreshTrigger = 0 }: DashboardStatsProps) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError("Failed to load statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="h-24 bg-gray-200 animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-500 text-sm">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statsData = [
    {
      title: "Total Requests",
      value: stats.totalRequests,
      icon: Droplets,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Pending Requests",
      value: stats.pendingRequests,
      icon: Clock,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Fulfilled Requests",
      value: stats.fulfilledRequests,
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Active Donors",
      value: stats.activeDonors,
      icon: Users,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <IconComponent className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1">Real-time data</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStatsCards;
