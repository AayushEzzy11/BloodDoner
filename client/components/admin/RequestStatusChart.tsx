import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getRequestStatusBreakdown } from "@/lib/adminDashboard";

interface RequestStatusChartProps {
  refreshTrigger?: number;
}

export const RequestStatusChart = ({ refreshTrigger = 0 }: RequestStatusChartProps) => {
  const [data, setData] = useState<Array<{ name: string; count: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const breakdown = await getRequestStatusBreakdown();
        const chartData = [
          { name: "Pending", count: breakdown.pending, fill: "#EAB308" },
          { name: "Fulfilled", count: breakdown.fulfilled, fill: "#22C55E" },
          { name: "Expired", count: breakdown.expired, fill: "#EF4444" },
        ];
        setData(chartData);
        setError(null);
      } catch (err) {
        console.error("Error fetching status breakdown:", err);
        setError("Failed to load chart data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Request Status Distribution</CardTitle>
          <CardDescription>Overview of request statuses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Request Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <p className="text-red-500">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Status Distribution</CardTitle>
        <CardDescription>Current status breakdown of all blood requests</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RequestStatusChart;
