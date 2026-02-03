# Sahayog Red Admin Dashboard

A modern, responsive admin dashboard for managing blood donor and blood request operations. Built with React, TypeScript, Tailwind CSS, Firestore, and Recharts.

## 🎯 Features

### 1. **Dashboard Overview**
- Real-time statistics cards showing:
  - Total Blood Requests
  - Pending Requests
  - Fulfilled Requests
  - Active Donors
- Animated icons and color-coded metrics

### 2. **Charts & Analytics**
- **Request Status Distribution**: Bar chart showing pending, fulfilled, and expired requests
- **Blood Group Distribution**: Pie chart of active donors by blood type
- **Request Trend Chart**: 30-day line chart tracking request volumes
- Real-time data from Firestore
- Responsive and interactive using Recharts

### 3. **Blood Request Management**
- Comprehensive table with:
  - Patient name and blood type
  - Hospital name and units required
  - Current status (pending/fulfilled/expired)
  - Request creation date
- Admin actions:
  - **Update Status**: Change request status with dropdown selector
  - **Delete Request**: Remove requests from system
- Activity logging for all changes

### 4. **Donor Management**
- Complete donor directory table displaying:
  - Donor name and email
  - Blood type with color-coded badges
  - Phone number and active/inactive status
- Admin actions:
  - **Activate/Deactivate**: Toggle donor availability
  - **Delete Donor**: Remove donor profiles
- Activity tracking

### 5. **Activity Log**
- Recent admin actions feed showing:
  - Action type (request update/delete, donor update/delete)
  - Affected resource name
  - Status changes
  - Timestamp with relative time (e.g., "2 minutes ago")
- Scrollable list with latest 10 actions

### 6. **Authentication & Security**
- **Role-based Access Control**: Only users with `role="admin"` can access dashboard
- **Protected Routes**: ProtectedRoute component ensures authorization
- **Automatic Redirect**: Non-admin users redirected to login
- **Auth State Management**: Real-time Firebase authentication

### 7. **Responsive Design**
- **Desktop**: Full sidebar navigation + multi-column layouts
- **Tablet**: Collapsible sidebar with optimized spacing
- **Mobile**: Hidden sidebar with hamburger menu
- Touch-friendly buttons and interactions

## 📁 Project Structure

```
client/
├── components/
│   ├── admin/
│   │   ├── DashboardStats.tsx         # Summary cards component
│   │   ├── RequestStatusChart.tsx     # Bar chart for request status
│   │   ├── RequestTrendChart.tsx      # Line chart for trends
│   │   ├── BloodGroupChart.tsx        # Pie chart for blood groups
│   │   ├── BloodRequestsTable.tsx     # Request management table
│   │   ├── DonorsTable.tsx            # Donor management table
│   │   └── ActivityLog.tsx            # Activity feed component
│   └── ProtectedRoute.tsx             # Auth protection wrapper
├── lib/
│   └── adminDashboard.ts              # Firestore queries & CRUD operations
└── pages/
    └── AdminDashboard.tsx             # Main dashboard layout component
```

## 🔧 Key Components

### ProtectedRoute (`components/ProtectedRoute.tsx`)
Wraps routes to ensure only authenticated admin users can access them.

```typescript
<Route 
  path="/admin" 
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  } 
/>
```

**Features:**
- Checks Firebase authentication state
- Verifies user role in Firestore
- Handles loading state during auth check
- Redirects unauthorized users to login

### Admin Dashboard Utilities (`lib/adminDashboard.ts`)

#### Queries
- `getDashboardStats()`: Fetch summary statistics
- `getBloodRequests(status?, limit?)`: Get requests with optional filtering
- `getAllDonors(limit?)`: Fetch all donors
- `getRequestStatusBreakdown()`: Status distribution for charts
- `getRequestTrend(days?)`: 30-day trend data
- `getBloodGroupDistribution()`: Donor blood group breakdown
- `getRecentActivities(limit?)`: Admin activity history

#### Mutations
- `updateRequestStatus(requestId, newStatus, adminId)`: Update request status
- `deleteBloodRequest(requestId, adminId)`: Remove request
- `updateDonorStatus(donorId, isActive, adminId)`: Toggle donor status
- `deleteDonor(donorId, adminId)`: Remove donor
- `logActivity(adminId, action, details)`: Record admin actions

### Dashboard Components

**DashboardStats** (`components/admin/DashboardStats.tsx`)
- 4 summary cards with real-time metrics
- Color-coded by metric type
- Loading and error states
- Responsive grid layout

**RequestStatusChart** (`components/admin/RequestStatusChart.tsx`)
- Bar chart visualization
- Shows pending, fulfilled, expired counts
- Auto-refresh on data changes

**RequestTrendChart** (`components/admin/RequestTrendChart.tsx`)
- 30-day line chart
- Tracks daily request volume
- Interactive tooltips and legend

**BloodGroupChart** (`components/admin/BloodGroupChart.tsx`)
- Pie chart of donor distribution
- Color-coded by blood type
- Shows only groups with donors

**BloodRequestsTable** (`components/admin/BloodRequestsTable.tsx`)
- Sortable request listing
- Inline status dropdown
- One-click delete with confirmation
- Toast notifications for actions
- Loading and error states

**DonorsTable** (`components/admin/DonorsTable.tsx`)
- Complete donor directory
- Activate/Deactivate toggle
- Delete with confirmation
- Real-time status updates
- Toast notifications

**ActivityLog** (`components/admin/ActivityLog.tsx`)
- Recent admin actions feed
- Color-coded by action type
- Relative timestamps (e.g., "5 minutes ago")
- Scrollable list with 10 latest actions
- Shows resource names and status changes

## 🚀 Usage

### Access the Dashboard
1. Login with admin credentials
2. Navigate to `/admin`
3. Dashboard loads with ProtectedRoute verification

### Managing Requests
1. Go to **Blood Requests** tab
2. View all pending requests
3. Update status via dropdown or delete with trash icon
4. Changes logged automatically in activity feed

### Managing Donors
1. Go to **Donors** tab
2. View all registered donors
3. Toggle active/inactive status
4. Delete donors if needed
5. All changes reflected in activity log

### Viewing Analytics
1. Go to **Analytics** tab
2. See comprehensive charts and metrics
3. Monitor system trends
4. Track blood group distribution

## 🔌 Firestore Collections

### bloodRequests
```typescript
{
  id: string,
  patientName: string,
  bloodType: string,
  hospital: string,
  unitsNeeded: number,
  status: "pending" | "fulfilled" | "expired",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### users (donors)
```typescript
{
  uid: string,
  email: string,
  firstName: string,
  lastName: string,
  bloodType: string,
  phone: string,
  role: "donor" | "admin" | "seeker",
  isActive: boolean,
  createdAt: Timestamp,
  updatedAt?: Timestamp
}
```

### adminActivityLogs
```typescript
{
  id: string,
  adminId: string,
  action: string,
  details: Record<string, any>,
  timestamp: Timestamp
}
```

## 🎨 Styling

- **Framework**: Tailwind CSS 3
- **Icons**: Lucide React
- **UI Components**: Pre-built Radix UI components
- **Charts**: Recharts with custom colors
- **Responsive**: Mobile-first design with breakpoints

### Color Scheme
- Primary: Red (`#EF4444` / `#DC2626`)
- Success: Green (`#22C55E`)
- Warning: Yellow (`#EAB308`)
- Blood Types: Custom color mapping
  - O+: Red
  - A+: Blue
  - B+: Orange
  - AB+: Purple

## 📊 Real-time Updates

- Charts refresh on data changes via `refreshTrigger` prop
- Activity log updates automatically
- Stats cards reflect latest counts
- Tables refresh after mutations
- Toast notifications confirm actions

## 🔒 Security Features

1. **Authentication**: Firebase Auth integration
2. **Role-based Access**: Admin-only dashboard
3. **Authorization Checks**: Server-side validation via Firestore
4. **Activity Audit Trail**: All admin actions logged
5. **Confirmation Dialogs**: Prevent accidental deletions
6. **Error Handling**: User-friendly error messages

## 🎯 Performance

- Lazy loading of components
- Optimized Firestore queries with limits
- Efficient re-renders with React hooks
- Responsive images and icons
- Cached user authentication state

## 🐛 Error Handling

- Try-catch blocks for all async operations
- User-friendly error messages via toast notifications
- Graceful degradation with fallback states
- Detailed console logging for debugging

## 📱 Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Deployment

The dashboard is production-ready and includes:
- TypeScript type safety
- Compiled optimization
- Responsive design
- Error boundaries (recommended to add)
- Environment variable configuration

## 📝 Development

### Adding New Features

**Add a new chart:**
```typescript
// 1. Create query in adminDashboard.ts
export async function getCustomMetric() {
  // Firestore query
}

// 2. Create chart component
export const CustomChart = ({ refreshTrigger = 0 }) => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    getCustomMetric().then(setData);
  }, [refreshTrigger]);
  
  return <Card>...</Card>;
};

// 3. Import and add to dashboard
<CustomChart refreshTrigger={refreshTrigger} />
```

**Add a new table action:**
```typescript
// 1. Create mutation in adminDashboard.ts
export async function performAction(id: string, adminId: string) {
  // Perform action
  await logActivity(adminId, "ACTION_NAME", { /* details */ });
}

// 2. Call from table component
const handleAction = async (id: string) => {
  await performAction(id, adminId);
  onActionComplete?.();
};
```

## 🙏 Best Practices

1. Always log admin actions for audit trail
2. Confirm before deleting resources
3. Use toast notifications for feedback
4. Handle loading and error states
5. Refresh data after mutations
6. Validate user role on protected routes
7. Keep queries optimized with limits
8. Test with real Firestore data

## 📚 Related Files

- [Authentication](../lib/auth.ts)
- [Blood Compatibility](../lib/bloodCompatibility.ts)
- [Firebase Config](../firebase/firebaseConfig.js)
- [UI Components](../components/ui/)

---

**Last Updated**: February 2, 2026  
**Version**: 1.0.0  
**Status**: Production Ready
