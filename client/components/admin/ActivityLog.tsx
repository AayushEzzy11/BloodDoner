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
        <CardDescription>Latest admin actions across requests and donors</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <p className="text-gray-500">Loading activities...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[60vh] gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-500">{error}</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="flex items-center justify-center h-[60vh]">
            <p className="text-gray-500">No activities recorded yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Header row */}
            <div className="hidden md:grid md:grid-cols-[0.8fr,1.4fr,0.8fr,1.2fr] text-xs font-medium text-gray-500 pb-2 border-b">
              <span>Action</span>
              <span>Subject</span>
              <span>When</span>
              <span>Details</span>
            </div>

            <ScrollArea className="h-[60vh] pr-2">
              <div className="space-y-3">
                {activities.map((activity) => {
                  const subject =
                    activity.details?.patientName ||
                    activity.details?.donorName ||
                    activity.details?.entityName ||
                    "System Action";

                  const timeLabel = formatDistanceToNow(
                    new Date(activity.timestamp),
                    { addSuffix: true }
                  );

                  const statusLine = activity.details?.previousStatus
                    ? `${activity.details.previousStatus} → ${activity.details.newStatus}`
                    : activity.details?.description || "—";

                  return (
                    <div
                      key={activity.id}
                      className="border-b last:border-b-0 pb-3"
                    >
                      {/* Desktop layout */}
                      <div className="hidden md:grid md:grid-cols-[0.8fr,1.4fr,0.8fr,1.2fr] items-start gap-3 text-sm">
                        <div>
                          <Badge className={getActionColor(activity.action)}>
                            {getActionLabel(activity.action)}
                          </Badge>
                        </div>
                        <div className="truncate font-medium" title={subject}>
                          {subject}
                        </div>
                        <div className="text-xs text-gray-500">{timeLabel}</div>
                        <div className="text-xs text-gray-600 break-words">
                          {statusLine}
                        </div>
                      </div>

                      {/* Mobile layout */}
                      <div className="md:hidden flex flex-col gap-1 text-sm">
                        <div className="flex items-center justify-between gap-2">
                          <Badge className={getActionColor(activity.action)}>
                            {getActionLabel(activity.action)}
                          </Badge>
                          <span className="text-xs text-gray-500">{timeLabel}</span>
                        </div>
                        <div className="font-medium truncate" title={subject}>
                          {subject}
                        </div>
                        <div className="text-xs text-gray-600 break-words">
                          {statusLine}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityLog;
