import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, FileText } from "lucide-react";
import { getCompletedDonations } from "@/lib/adminDashboard";

interface CompletedDonation {
  id: string;
  donorName: string;
  donorId: string;
  patientName: string;
  bloodType: string;
  hospital?: string;
  completedAt?: Date | string;
  reportUrl?: string;
}

interface CompletedDonationsTableProps {
  refreshTrigger?: number;
}

export const CompletedDonationsTable = ({ refreshTrigger = 0 }: CompletedDonationsTableProps) => {
  const [rows, setRows] = useState<CompletedDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const data = await getCompletedDonations();
        setRows(data as CompletedDonation[]);
        setError(null);
      } catch (err) {
        console.error("Error loading completed donations:", err);
        setError("Failed to load completed donations");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [refreshTrigger]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Completed Donations</CardTitle>
        <CardDescription>
          List of donations where a donor has uploaded a completion report
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Loading completed donations...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64 gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-500">{error}</p>
          </div>
        ) : rows.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">No completed donations recorded yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donor</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Blood Type</TableHead>
                  <TableHead>Hospital</TableHead>
                  <TableHead>Completed At</TableHead>
                  <TableHead className="text-right">Report</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">{d.donorName}</TableCell>
                    <TableCell>{d.patientName}</TableCell>
                    <TableCell>{d.bloodType}</TableCell>
                    <TableCell>{d.hospital || "—"}</TableCell>
                    <TableCell>
                      {d.completedAt
                        ? new Date(d.completedAt as any).toLocaleString()
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      {d.reportUrl ? (
                        <a
                          href={d.reportUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          <FileText className="h-4 w-4" /> View
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">No file</span>
                      )}
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

export default CompletedDonationsTable;