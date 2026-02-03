import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, AlertCircle } from "lucide-react";
import { getAllDonors, deleteDonor, updateDonorStatus } from "@/lib/adminDashboard";
import { useToast } from "@/hooks/use-toast";

interface Donor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  bloodType: string;
  phone: string;
  isActive: boolean;
  [key: string]: any;
}

interface DonorsTableProps {
  adminId: string;
  refreshTrigger?: number;
  onActionComplete?: () => void;
}

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

export const DonorsTable = ({
  adminId,
  refreshTrigger = 0,
  onActionComplete,
}: DonorsTableProps) => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchDonors();
  }, [refreshTrigger]);

  const fetchDonors = async () => {
    try {
      setLoading(true);
      const data = await getAllDonors();
      setDonors(data as Donor[]);
      setError(null);
    } catch (err) {
      console.error("Error fetching donors:", err);
      setError("Failed to load donors");
      toast({
        title: "Error",
        description: "Failed to load donors",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (donorId: string, currentStatus: boolean) => {
    try {
      await updateDonorStatus(donorId, !currentStatus, adminId);
      toast({
        title: "Success",
        description: `Donor ${!currentStatus ? "activated" : "deactivated"} successfully`,
      });
      await fetchDonors();
      onActionComplete?.();
    } catch (err) {
      console.error("Error updating donor status:", err);
      toast({
        title: "Error",
        description: "Failed to update donor status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (donorId: string) => {
    if (!window.confirm("Are you sure you want to delete this donor?")) {
      return;
    }

    try {
      await deleteDonor(donorId, adminId);
      toast({
        title: "Success",
        description: "Donor deleted successfully",
      });
      await fetchDonors();
      onActionComplete?.();
    } catch (err) {
      console.error("Error deleting donor:", err);
      toast({
        title: "Error",
        description: "Failed to delete donor",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blood Donors</CardTitle>
        <CardDescription>Manage donor profiles and activation status</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Loading donors...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64 gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-500">{error}</p>
          </div>
        ) : donors.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">No donors found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Blood Type</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donors.map((donor) => (
                  <TableRow key={donor.id}>
                    <TableCell className="font-medium">
                      {donor.firstName} {donor.lastName}
                    </TableCell>
                    <TableCell className="text-sm">{donor.email}</TableCell>
                    <TableCell>
                      <Badge className={getBloodTypeColor(donor.bloodType)}>
                        {donor.bloodType}
                      </Badge>
                    </TableCell>
                    <TableCell>{donor.phone || "N/A"}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          donor.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {donor.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(donor.id, donor.isActive)}
                      >
                        {donor.isActive ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(donor.id)}
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

export default DonorsTable;
