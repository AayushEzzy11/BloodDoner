import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle } from "lucide-react";
import { getRecentActivities } from "@/lib/adminDashboard";
import { formatDistanceToNow } from "date-fns";

interface Activity {
  id: string;
  adminId: string;
  action: string;
  details: Record<string, any>;
  timestamp: Date;
}

interface ActivityLogProps {
  refreshTrigger?: number;
}

const getActionColor = (action: string) => {
  switch (action) {
    case "UPDATE_REQUEST_STATUS":
      return "bg-blue-100 text-blue-800";
    case "DELETE_REQUEST":
      return "bg-red-100 text-red-800";
    case "UPDATE_DONOR_STATUS":
      return "bg-purple-100 text-purple-800";
    case "DELETE_DONOR":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getActionLabel = (action: string) => {
  switch (action) {
    case "UPDATE_REQUEST_STATUS":
      return "Updated Request";
    case "DELETE_REQUEST":
      return "Deleted Request";
    case "UPDATE_DONOR_STATUS":
      return "Updated Donor";
    case "DELETE_DONOR":
      return "Deleted Donor";
    default:
      return action;
  }
};

export const ActivityLog = ({ refreshTrigger = 0 }: ActivityLogProps) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchActivities();
  }, [refreshTrigger]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const data = await getRecentActivities(10);
      setActivities(data as Activity[]);
      setError(null);
    } catch (err) {
      console.error("Error fetching activities:", err);
      setError("Failed to load activity log");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest admin actions on the system</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Loading activities...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64 gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-500">{error}</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">No activities yet</p>
          </div>
        ) : (
          <ScrollArea className="h-64 pr-4">
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 pb-4 border-b last:border-b-0"
                >
                  <Badge className={getActionColor(activity.action)}>
                    {getActionLabel(activity.action)}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">
                      {activity.details?.patientName ||
                        activity.details?.donorName ||
                        "System Action"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(activity.timestamp), {
                        addSuffix: true,
                      })}
                    </div>
                    {activity.details?.previousStatus && (
                      <div className="text-xs text-gray-600 mt-1">
                        Status: {activity.details.previousStatus} →{" "}
                        {activity.details.newStatus}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityLog;
