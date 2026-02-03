import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

/**
 * Dashboard Statistics Interface
 */
export interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  fulfilledRequests: number;
  activeDonors: number;
}

/**
 * Fetch dashboard statistics from Firestore
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Fetch all blood requests
    const requestsSnap = await getDocs(collection(db, "bloodRequests"));
    const requests = requestsSnap.docs.map((doc) => doc.data());

    // Fetch all active donors
    const donorsSnap = await getDocs(
      query(
        collection(db, "users"),
        where("role", "==", "donor"),
        where("isActive", "==", true)
      )
    );

    const stats: DashboardStats = {
      totalRequests: requests.length,
      pendingRequests: requests.filter((r) => r.status === "pending").length,
      fulfilledRequests: requests.filter((r) => r.status === "fulfilled")
        .length,
      activeDonors: donorsSnap.docs.length,
    };

    return stats;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
}

/**
 * Fetch blood requests with optional status filter
 */
export async function getBloodRequests(
  status?: string,
  limitCount: number = 100
) {
  try {
    let q;
    if (status) {
      q = query(
        collection(db, "bloodRequests"),
        where("status", "==", status),
        limit(limitCount)
      );
    } else {
      q = query(collection(db, "bloodRequests"), limit(limitCount));
    }

    const snap = await getDocs(q);
    return snap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Record<string, any>),
    }));
  } catch (error) {
    console.error("Error fetching blood requests:", error);
    throw error;
  }
}

/**
 * Fetch all donors
 */
export async function getAllDonors(limitCount: number = 100) {
  try {
    const q = query(
      collection(db, "users"),
      where("role", "==", "donor"),
      limit(limitCount)
    );

    const snap = await getDocs(q);
    return snap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Record<string, any>),
    }));
  } catch (error) {
    console.error("Error fetching donors:", error);
    throw error;
  }
}

/**
 * Get request status breakdown for charts
 */
export async function getRequestStatusBreakdown() {
  try {
    const requests = await getBloodRequests();

    const breakdown = {
      pending: (requests as any[]).filter((r) => r.status === "pending").length,
      fulfilled: (requests as any[]).filter((r) => r.status === "fulfilled").length,
      expired: (requests as any[]).filter((r) => r.status === "expired").length,
    };

    return breakdown;
  } catch (error) {
    console.error("Error fetching request status breakdown:", error);
    throw error;
  }
}

/**
 * Get blood requests grouped by date for trend chart
 */
export async function getRequestTrend(days: number = 30) {
  try {
    const requests = await getBloodRequests();
    const now = new Date();
    const data: Record<string, number> = {};

    // Initialize last N days
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      data[dateStr] = 0;
    }

    // Count requests by date
    (requests as any[]).forEach((request) => {
      if (request.createdAt) {
        const createdDate =
          request.createdAt instanceof Timestamp
            ? request.createdAt.toDate()
            : new Date(request.createdAt);

        const dateStr = createdDate.toISOString().split("T")[0];
        if (data[dateStr] !== undefined) {
          data[dateStr]++;
        }
      }
    });

    return Object.entries(data).map(([date, count]) => ({
      date: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      requests: count,
    }));
  } catch (error) {
    console.error("Error fetching request trend:", error);
    throw error;
  }
}

/**
 * Log an admin activity
 */
export async function logActivity(
  adminId: string,
  action: string,
  details: Record<string, any>
) {
  try {
    await addDoc(collection(db, "adminActivityLogs"), {
      adminId,
      action,
      details,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Error logging activity:", error);
    // Don't throw - activity logging should not interrupt main operations
  }
}

/**
 * Get recent admin activities
 */
export async function getRecentActivities(limitCount: number = 10) {
  try {
    const q = query(
      collection(db, "adminActivityLogs"),
      orderBy("timestamp", "desc"),
      limit(limitCount)
    );

    const snap = await getDocs(q);
    return snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp:
        doc.data().timestamp instanceof Timestamp
          ? doc.data().timestamp.toDate()
          : new Date(doc.data().timestamp),
    }));
  } catch (error) {
    console.error("Error fetching activities:", error);
    return [];
  }
}

/**
 * Update blood request status
 */
export async function updateRequestStatus(
  requestId: string,
  newStatus: "pending" | "fulfilled" | "expired",
  adminId: string
) {
  try {
    const requestRef = doc(db, "bloodRequests", requestId);

    // Get request data for activity log
    const requestDoc = await getDoc(requestRef);
    const requestData = requestDoc.data();

    // Update status
    await updateDoc(requestRef, {
      status: newStatus,
      updatedAt: new Date(),
    });

    // Log activity
    await logActivity(adminId, "UPDATE_REQUEST_STATUS", {
      requestId,
      previousStatus: requestData?.status,
      newStatus,
      patientName: requestData?.patientName,
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating request status:", error);
    throw error;
  }
}

/**
 * Delete blood request
 */
export async function deleteBloodRequest(
  requestId: string,
  adminId: string
) {
  try {
    // Get request data for activity log
    const requestDoc = await getDoc(doc(db, "bloodRequests", requestId));
    const requestData = requestDoc.data();

    // Delete request
    await deleteDoc(doc(db, "bloodRequests", requestId));

    // Log activity
    await logActivity(adminId, "DELETE_REQUEST", {
      requestId,
      patientName: requestData?.patientName,
      bloodType: requestData?.bloodType,
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting request:", error);
    throw error;
  }
}

/**
 * Update donor status
 */
export async function updateDonorStatus(
  donorId: string,
  isActive: boolean,
  adminId: string
) {
  try {
    const donorRef = doc(db, "users", donorId);

    // Get donor data for activity log
    const donorDoc = await getDoc(donorRef);
    const donorData = donorDoc.data();

    // Update status
    await updateDoc(donorRef, {
      isActive,
      updatedAt: new Date(),
    });

    // Log activity
    await logActivity(adminId, "UPDATE_DONOR_STATUS", {
      donorId,
      donorName: `${donorData?.firstName} ${donorData?.lastName}`,
      previousStatus: donorData?.isActive,
      newStatus: isActive,
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating donor status:", error);
    throw error;
  }
}

/**
 * Delete donor
 */
export async function deleteDonor(
  donorId: string,
  adminId: string
) {
  try {
    // Get donor data for activity log
    const donorDoc = await getDoc(doc(db, "users", donorId));
    const donorData = donorDoc.data();

    // Delete donor
    await deleteDoc(doc(db, "users", donorId));

    // Log activity
    await logActivity(adminId, "DELETE_DONOR", {
      donorId,
      donorName: `${donorData?.firstName} ${donorData?.lastName}`,
      bloodType: donorData?.bloodType,
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting donor:", error);
    throw error;
  }
}

/**
 * Get blood group distribution for chart
 */
export async function getBloodGroupDistribution() {
  try {
    const donors = await getAllDonors();

    const distribution: Record<string, number> = {
      "O+": 0,
      "O-": 0,
      "A+": 0,
      "A-": 0,
      "B+": 0,
      "B-": 0,
      "AB+": 0,
      "AB-": 0,
    };

    donors.forEach((donor: any) => {
      const bg = donor.bloodType;
      if (distribution[bg] !== undefined) {
        distribution[bg]++;
      }
    });

    return Object.entries(distribution).map(([name, value]) => ({
      name,
      value,
    }));
  } catch (error) {
    console.error("Error fetching blood group distribution:", error);
    throw error;
  }
}
