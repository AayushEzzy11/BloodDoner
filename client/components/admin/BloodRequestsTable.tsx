import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, AlertCircle } from "lucide-react";
import { getBloodRequests, deleteBloodRequest, updateRequestStatus, logActivity } from "@/lib/adminDashboard";
import { useToast } from "@/hooks/use-toast";

interface BloodRequest {
  id: string;
  patientName: string;
  bloodType: string;
  hospital: string;
  status: "pending" | "fulfilled" | "expired";
  unitsNeeded: number;
  createdAt?: any;
  [key: string]: any;
}

interface BloodRequestsTableProps {
  adminId: string;
  refreshTrigger?: number;
  onActionComplete?: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "fulfilled":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "expired":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getBloodTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    "O+": "bg-red-100 text-red-800",
    "O-": "bg-red-200 text-red-900",
    "A+": "bg-blue-100 text-blue-800",
    "A-": "bg-blue-200 text-blue-900",
    "B+": "bg-orange-100 text-orange-800",
    "B-": "bg-orange-200 text-orange-900",
    "AB+": "bg-purple-100 text-purple-800",
    "AB-": "bg-purple-200 text-purple-900",
  };
  return colors[type] || "bg-gray-100 text-gray-800";
};

export const BloodRequestsTable = ({
  adminId,
  refreshTrigger = 0,
  onActionComplete,
}: BloodRequestsTableProps) => {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, [refreshTrigger]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getBloodRequests();
      setRequests(data as BloodRequest[]);
      setError(null);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError("Failed to load blood requests");
      toast({
        title: "Error",
        description: "Failed to load blood requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (requestId: string, newStatus: string) => {
    try {
      await updateRequestStatus(
        requestId,
        newStatus as "pending" | "fulfilled" | "expired",
        adminId
      );
      toast({
        title: "Success",
        description: "Request status updated successfully",
      });
      await fetchRequests();
      onActionComplete?.();
    } catch (err) {
      console.error("Error updating status:", err);
      toast({
        title: "Error",
        description: "Failed to update request status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (requestId: string) => {
    if (!window.confirm("Are you sure you want to delete this request?")) {
      return;
    }

    try {
      await deleteBloodRequest(requestId, adminId);
      toast({
        title: "Success",
        description: "Request deleted successfully",
      });
      await fetchRequests();
      onActionComplete?.();
    } catch (err) {
      console.error("Error deleting request:", err);
      toast({
        title: "Error",
        description: "Failed to delete request",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blood Requests</CardTitle>
        <CardDescription>Manage and track blood requests</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Loading requests...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64 gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-500">{error}</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">No blood requests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Blood Type</TableHead>
                  <TableHead>Hospital</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.patientName}</TableCell>
                    <TableCell>
                      <Badge className={getBloodTypeColor(request.bloodType)}>
                        {request.bloodType}
                      </Badge>
                    </TableCell>
                    <TableCell>{request.hospital}</TableCell>
                    <TableCell>{request.unitsNeeded || "N/A"}</TableCell>
                    <TableCell>
                      <select
                        value={request.status}
                        onChange={(e) => handleStatusChange(request.id, e.target.value)}
                        className={`px-3 py-1 rounded-md text-sm font-medium cursor-pointer border-0 ${getStatusColor(
                          request.status
                        )}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="fulfilled">Fulfilled</option>
                        <option value="expired">Expired</option>
                      </select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(request.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BloodRequestsTable;
