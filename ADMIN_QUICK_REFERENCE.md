# Admin Dashboard - Quick Reference Guide

## 📂 File Structure

```
client/
├── components/
│   ├── ProtectedRoute.tsx                    # Auth protection wrapper
│   └── admin/
│       ├── DashboardStats.tsx                # 4 summary cards component
│       ├── RequestStatusChart.tsx            # Bar chart for request status
│       ├── RequestTrendChart.tsx             # Line chart for 30-day trends
│       ├── BloodGroupChart.tsx               # Pie chart for donor distribution
│       ├── BloodRequestsTable.tsx            # Request CRUD table
│       ├── DonorsTable.tsx                   # Donor CRUD table
│       └── ActivityLog.tsx                   # Recent actions feed
├── lib/
│   └── adminDashboard.ts                     # All Firestore queries & mutations
└── pages/
    └── AdminDashboard.tsx                    # Main dashboard container
```

## 🔄 Data Flow

```
User Login
    ↓
ProtectedRoute (auth check + role verification)
    ↓
AdminDashboard (main layout)
    ↓
Components (stats, charts, tables, logs)
    ↓
adminDashboard.ts (Firestore queries)
    ↓
Firestore Database
```

## 💾 Firestore Queries

### Read Operations
```typescript
// Fetch all data types
getDashboardStats()              // Get 4 main metrics
getBloodRequests(status?, limit)   // Get requests (optional filter)
getAllDonors(limit)              // Get all donors
getRequestStatusBreakdown()       // Status counts for chart
getRequestTrend(days)            // Daily request counts
getBloodGroupDistribution()       // Donor count by blood type
getRecentActivities(limit)        // Admin action logs
```

### Write Operations
```typescript
// Mutations (all log activity automatically)
updateRequestStatus(requestId, newStatus, adminId)
deleteBloodRequest(requestId, adminId)
updateDonorStatus(donorId, isActive, adminId)
deleteDonor(donorId, adminId)
logActivity(adminId, action, details)
```

## 📊 Component Props

### DashboardStats
```typescript
<DashboardStats 
  refreshTrigger={0}  // Number - triggers re-fetch when incremented
/>
```

### Chart Components
```typescript
<RequestStatusChart refreshTrigger={0} />
<RequestTrendChart days={30} refreshTrigger={0} />
<BloodGroupChart refreshTrigger={0} />
```

### Table Components
```typescript
<BloodRequestsTable 
  adminId="user123"           // Current admin user ID
  refreshTrigger={0}          // Trigger refresh
  onActionComplete={() => {}} // Callback after action
/>

<DonorsTable 
  adminId="user123"
  refreshTrigger={0}
  onActionComplete={() => {}}
/>
```

### ActivityLog
```typescript
<ActivityLog 
  refreshTrigger={0}  // Trigger refresh
/>
```

## 🎯 Main Dashboard Tabs

### Dashboard (Home)
- Stats cards
- Request status chart
- Blood group chart
- Request trend chart
- Activity log

### Blood Requests
- Full requests table
- Status update dropdown
- Delete button
- Real-time refresh

### Donors
- Full donors table
- Activate/Deactivate button
- Delete button
- Real-time refresh

### Analytics
- All stats, charts, and logs combined
- Comprehensive system overview

## 🔑 Key Functions

### Initialize Admin Dashboard
```typescript
import AdminDashboard from "@/pages/AdminDashboard";
import ProtectedRoute from "@/components/ProtectedRoute";

// In App.jsx routing
<Route 
  path="/admin" 
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  } 
/>
```

### Trigger Refresh
```typescript
const [refreshTrigger, setRefreshTrigger] = useState(0);

// Increment to refresh all components
setRefreshTrigger(prev => prev + 1);
```

### Call Firestore Query
```typescript
import { getDashboardStats } from "@/lib/adminDashboard";

const stats = await getDashboardStats();
// { totalRequests, pendingRequests, fulfilledRequests, activeDonors }
```

### Perform CRUD Operation
```typescript
import { updateRequestStatus } from "@/lib/adminDashboard";

await updateRequestStatus(requestId, "fulfilled", adminId);
// Automatically logs activity
```

## 🎨 Color Scheme

```typescript
// Blood Types
"O+": "bg-red-100 text-red-800"
"O-": "bg-red-200 text-red-900"
"A+": "bg-blue-100 text-blue-800"
"A-": "bg-blue-200 text-blue-900"
"B+": "bg-orange-100 text-orange-800"
"B-": "bg-orange-200 text-orange-900"
"AB+": "bg-purple-100 text-purple-800"
"AB-": "bg-purple-200 text-purple-900"

// Status
pending: "bg-yellow-100 text-yellow-800"
fulfilled: "bg-green-100 text-green-800"
expired: "bg-red-100 text-red-800"

// Actions
UPDATE: "bg-blue-100"
DELETE: "bg-red-100"
```

## 🚨 Error Handling

All components handle:
- Loading states (spinner)
- Error states (error messages)
- Empty states (no data messages)
- Toast notifications (success/failure)
- User confirmations (delete confirmation)

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (hidden sidebar, hamburger menu)
- **Tablet**: 768px - 1023px (collapsible sidebar)
- **Desktop**: > 1024px (full sidebar visible)

## 🔐 Authentication Flow

```
1. User logs in → Firebase Auth
2. Navigate to /admin
3. ProtectedRoute checks:
   - Is user authenticated? (onAuthStateChanged)
   - Has user role="admin"? (check Firestore users doc)
4. If authorized → Show AdminDashboard
5. If not authorized → Redirect to /login
```

## 📝 Adding New Feature

### 1. Add Firestore Query (adminDashboard.ts)
```typescript
export async function getCustomData() {
  try {
    const snap = await getDocs(collection(db, "customCollection"));
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
```

### 2. Create Component (components/admin/NewComponent.tsx)
```typescript
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCustomData } from "@/lib/adminDashboard";

export const NewComponent = ({ refreshTrigger = 0 }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const result = await getCustomData();
        setData(result);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [refreshTrigger]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Feature</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? <p>Loading...</p> : <div>{/* Render data */}</div>}
      </CardContent>
    </Card>
  );
};
```

### 3. Add to Dashboard (pages/AdminDashboard.tsx)
```typescript
import NewComponent from "@/components/admin/NewComponent";

// In relevant tab section
<NewComponent refreshTrigger={refreshTrigger} />
```

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| 404 /admin | Check App.jsx routing and ProtectedRoute setup |
| Auth loop | Verify user has role="admin" in Firestore users doc |
| No data in charts | Ensure bloodRequests & users collections exist with data |
| Toast not showing | Check if useToast hook is imported and provider is setup |
| Sidebar not collapsing | Check localStorage and window size breakpoints |
| TypeScript errors | Use `as any` for doc.data() or add proper types |

## 🎯 Performance Tips

1. **Limit queries**: Use `limit()` in Firestore queries
2. **Pagination**: Add pagination for large datasets
3. **Caching**: Consider caching frequently accessed data
4. **Debouncing**: Debounce search/filter inputs
5. **Lazy loading**: Load charts only when tab is active

## 📊 Sample Data for Testing

```javascript
// Sample Blood Request
{
  patientName: "John Doe",
  bloodType: "O+",
  hospital: "City Hospital",
  unitsNeeded: 2,
  status: "pending",
  createdAt: Timestamp.now()
}

// Sample Donor
{
  firstName: "Jane",
  lastName: "Smith",
  email: "jane@example.com",
  bloodType: "A+",
  phone: "+91XXXXXXXXXX",
  role: "donor",
  isActive: true,
  createdAt: Timestamp.now()
}

// Sample Admin
{
  firstName: "Admin",
  lastName: "User",
  email: "admin@sahayogred.com",
  bloodType: "B+",
  phone: "+91XXXXXXXXXX",
  role: "admin",
  isActive: true,
  createdAt: Timestamp.now()
}
```

## 🔗 Related Files

- [Full Documentation](./ADMIN_DASHBOARD_DOCS.md)
- [Setup Guide](./ADMIN_SETUP_GUIDE.md)
- [Auth Functions](./client/lib/auth.ts)
- [Firebase Config](./client/firebase/firebaseConfig.js)

---

**Quick Reference Version**: 1.0  
**Updated**: February 2, 2026
