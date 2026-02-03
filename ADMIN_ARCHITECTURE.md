# Sahayog Red Admin Dashboard - Architecture & Flow

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        React Application                         │
│                         (App.jsx)                                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Route: /admin                               │
│              <ProtectedRoute requiredRole="admin">               │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    ┌────────▼─────────┐
                    │                  │
                    ▼                  ▼
            ┌──────────────┐    ┌────────────────┐
            │ Auth Check   │    │ Role Check     │
            │ (Firebase)   │    │ (Firestore)    │
            └──────┬───────┘    └────────┬───────┘
                   │                    │
                   └────────┬───────────┘
                            │
                    ┌───────▼────────┐
                    │    AUTHORIZED  │
                    │   (Auth=YES &  │
                    │   Role=ADMIN)  │
                    └───────┬────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AdminDashboard                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Header: Logo | Admin Name | Logout Button             │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  Sidebar:          │  Main Content Area:               │   │
│  │  - Dashboard       │  ┌──────────────────────────────┐ │   │
│  │  - Requests        │  │  Current Tab Content         │ │   │
│  │  - Donors          │  │  (Dynamic based on tab)       │ │   │
│  │  - Analytics       │  └──────────────────────────────┘ │   │
│  │  - Logout          │                                    │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                             │
           ┌─────────────────┼─────────────────┐
           │                 │                 │
           ▼                 ▼                 ▼
    ┌────────────────┐  ┌─────────────┐  ┌──────────────┐
    │   Dashboard    │  │  Requests   │  │    Donors    │
    │     Tab        │  │     Tab     │  │      Tab     │
    └────────┬───────┘  └──────┬──────┘  └──────┬───────┘
             │                 │                │
             ▼                 ▼                ▼
    ┌────────────────┐  ┌─────────────┐  ┌──────────────┐
    │ - Stats Cards  │  │  Requests   │  │ Donors Table │
    │ - 3 Charts     │  │    Table    │  │              │
    │ - Activity Log │  │             │  │ Crud Ops:    │
    │                │  │ Crud Ops:   │  │ - Activate   │
    │                │  │ - Update    │  │ - Deactivate │
    │                │  │ - Delete    │  │ - Delete     │
    │                │  │             │  │              │
    └────────┬───────┘  └──────┬──────┘  └──────┬───────┘
             │                 │                │
             └─────────────────┼────────────────┘
                               │
                               ▼
         ┌───────────────────────────────────────┐
         │  adminDashboard.ts (Query Layer)      │
         │  ┌─────────────────────────────────┐  │
         │  │ • getDashboardStats()           │  │
         │  │ • getBloodRequests()            │  │
         │  │ • getAllDonors()                │  │
         │  │ • getRequestTrend()             │  │
         │  │ • getBloodGroupDistribution()   │  │
         │  │ • updateRequestStatus()         │  │
         │  │ • updateDonorStatus()           │  │
         │  │ • logActivity()                 │  │
         │  │ • ... and more                  │  │
         │  └────────────┬────────────────────┘  │
         └───────────────┼──────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────┐
        │       Firebase Firestore           │
        │  ┌──────────────────────────────┐  │
        │  │ bloodRequests Collection     │  │
        │  ├──────────────────────────────┤  │
        │  │ users Collection             │  │
        │  │ (role: "donor"/"admin")      │  │
        │  ├──────────────────────────────┤  │
        │  │ adminActivityLogs Collection │  │
        │  └──────────────────────────────┘  │
        └────────────────────────────────────┘
```

## Component Hierarchy

```
AdminDashboard
├── Header
│   ├── Sahayog Red Logo
│   ├── Menu Toggle (Mobile)
│   ├── Admin Name
│   └── Logout Button
│
├── Sidebar
│   ├── Dashboard Link
│   ├── Requests Link
│   ├── Donors Link
│   ├── Analytics Link
│   └── Logout Link (Mobile)
│
└── Main Content (Tab-based)
    │
    ├─ Dashboard Tab
    │  ├── DashboardStats
    │  │   ├── Total Requests Card
    │  │   ├── Pending Requests Card
    │  │   ├── Fulfilled Requests Card
    │  │   └── Active Donors Card
    │  │
    │  ├── RequestStatusChart
    │  │   └── Bar Chart (Pending/Fulfilled/Expired)
    │  │
    │  ├── BloodGroupChart
    │  │   └── Pie Chart (Blood Types)
    │  │
    │  ├── RequestTrendChart
    │  │   └── Line Chart (30-day trend)
    │  │
    │  └── ActivityLog
    │      └── Recent Actions Feed
    │
    ├─ Requests Tab
    │  └── BloodRequestsTable
    │      ├── Table Headers
    │      ├── Request Rows
    │      ├── Status Dropdown (inline)
    │      └── Delete Button (inline)
    │
    ├─ Donors Tab
    │  └── DonorsTable
    │      ├── Table Headers
    │      ├── Donor Rows
    │      ├── Activate/Deactivate Button
    │      └── Delete Button
    │
    └─ Analytics Tab
       ├── DashboardStats (full view)
       ├── RequestStatusChart
       ├── BloodGroupChart
       ├── RequestTrendChart
       └── ActivityLog
```

## Data Flow Diagram

```
User Action (Click)
    │
    ├─ Update Request Status
    │  └─ BloodRequestsTable.handleStatusChange()
    │     └─ updateRequestStatus(id, status, adminId)
    │        ├─ Update Firestore doc
    │        ├─ logActivity() → adminActivityLogs
    │        ├─ Show Toast "Success"
    │        ├─ Refresh table data
    │        └─ onActionComplete()
    │           └─ setRefreshTrigger(+1)
    │              └─ All components re-fetch
    │
    ├─ Delete Request
    │  └─ BloodRequestsTable.handleDelete()
    │     ├─ Show Confirmation Dialog
    │     └─ deleteBloodRequest(id, adminId)
    │        ├─ Delete Firestore doc
    │        ├─ logActivity() → adminActivityLogs
    │        ├─ Show Toast "Success"
    │        ├─ Refresh table data
    │        └─ onActionComplete()
    │           └─ setRefreshTrigger(+1)
    │
    ├─ Activate/Deactivate Donor
    │  └─ DonorsTable.handleToggleStatus()
    │     └─ updateDonorStatus(id, isActive, adminId)
    │        ├─ Update Firestore doc
    │        ├─ logActivity() → adminActivityLogs
    │        ├─ Show Toast "Success"
    │        ├─ Refresh table data
    │        └─ onActionComplete()
    │           └─ setRefreshTrigger(+1)
    │
    └─ Delete Donor
       └─ DonorsTable.handleDelete()
          ├─ Show Confirmation Dialog
          └─ deleteDonor(id, adminId)
             ├─ Delete Firestore doc
             ├─ logActivity() → adminActivityLogs
             ├─ Show Toast "Success"
             ├─ Refresh table data
             └─ onActionComplete()
                └─ setRefreshTrigger(+1)
```

## Refresh Trigger Flow

```
Parent State
refreshTrigger: 0
    │
    ├─ User action
    │  └─ setRefreshTrigger(prev => prev + 1)
    │     └─ refreshTrigger: 1
    │
    └─ Pass to children
       │
       ├─ DashboardStats
       │  └─ useEffect(..., [refreshTrigger])
       │     └─ Calls getDashboardStats()
       │        └─ Fetches from Firestore
       │
       ├─ RequestStatusChart
       │  └─ useEffect(..., [refreshTrigger])
       │     └─ Calls getRequestStatusBreakdown()
       │        └─ Fetches from Firestore
       │
       ├─ RequestTrendChart
       │  └─ useEffect(..., [refreshTrigger])
       │     └─ Calls getRequestTrend()
       │        └─ Fetches from Firestore
       │
       ├─ BloodGroupChart
       │  └─ useEffect(..., [refreshTrigger])
       │     └─ Calls getBloodGroupDistribution()
       │        └─ Fetches from Firestore
       │
       ├─ BloodRequestsTable
       │  └─ useEffect(..., [refreshTrigger])
       │     └─ Calls getBloodRequests()
       │        └─ Fetches from Firestore
       │
       ├─ DonorsTable
       │  └─ useEffect(..., [refreshTrigger])
       │     └─ Calls getAllDonors()
       │        └─ Fetches from Firestore
       │
       └─ ActivityLog
          └─ useEffect(..., [refreshTrigger])
             └─ Calls getRecentActivities()
                └─ Fetches from Firestore
```

## Authentication Flow

```
User navigates to /admin
    │
    ▼
React Router checks route
    │
    ├─ Finds ProtectedRoute wrapper
    │  │
    │  ▼
    │ ProtectedRoute component mounts
    │  │
    │  ├─ onAuthStateChanged(auth, async (user) => {
    │  │   │
    │  │   ├─ if (!user)
    │  │   │   └─ setIsAuthorized(false)
    │  │   │      └─ <Navigate to="/login" />
    │  │   │
    │  │   ├─ if (user exists)
    │  │   │  │
    │  │   │  ├─ getDoc(db, "users", user.uid)
    │  │   │  │  │
    │  │   │  │  ├─ Check userData.role
    │  │   │  │  │
    │  │   │  │  ├─ if (role === "admin")
    │  │   │  │  │   └─ setIsAuthorized(true)
    │  │   │  │  │      └─ Show AdminDashboard
    │  │   │  │  │
    │  │   │  │  └─ if (role !== "admin")
    │  │   │  │      └─ setIsAuthorized(false)
    │  │   │  │         └─ <Navigate to="/login" />
    │  │   │  │
    │  │   │  └─ catch error
    │  │   │      └─ setIsAuthorized(false)
    │  │   │         └─ <Navigate to="/login" />
    │  │   │
    │  │   └─ Cleanup: return unsubscribe
    │  │
    │  └─ })
    │
    ├─ If isAuthorized === null
    │  └─ Show Loading Spinner
    │
    ├─ If isAuthorized === true
    │  └─ Render <AdminDashboard /> ✓
    │
    └─ If isAuthorized === false
       └─ Redirect to <Navigate to="/login" /> ✗
```

## Firestore Query Examples

```
Get Dashboard Stats
├─ getDocs(collection(db, "bloodRequests"))
│  └─ All requests
│     ├─ Count total
│     ├─ Filter status === "pending" → count
│     └─ Filter status === "fulfilled" → count
│
├─ getDocs(query(
│    collection(db, "users"),
│    where("role", "==", "donor"),
│    where("isActive", "==", true)
│  ))
│  └─ Active donors count
│
└─ Return: { totalRequests, pendingRequests, fulfilledRequests, activeDonors }

Get Request Trends
├─ getDocs(collection(db, "bloodRequests"))
│  └─ All requests
│     ├─ Group by date (createdAt)
│     ├─ Count per day
│     └─ Return last 30 days
│
└─ Format for chart: [{ date: "Jan 02", requests: 5 }, ...]

Get Blood Groups
├─ getDocs(query(
│    collection(db, "users"),
│    where("role", "==", "donor")
│  ))
│  └─ All donors
│     ├─ Extract bloodType
│     ├─ Count each type
│     └─ Build distribution
│
└─ Format for chart: [{ name: "O+", value: 10 }, ...]

Update Request Status
├─ updateDoc(doc(db, "bloodRequests", requestId), {
│    status: newStatus,
│    updatedAt: new Date()
│  })
│  └─ Update Firestore
│
└─ addDoc(collection(db, "adminActivityLogs"), {
    adminId,
    action: "UPDATE_REQUEST_STATUS",
    details: { requestId, previousStatus, newStatus, ... },
    timestamp: new Date()
  })
  └─ Log activity
```

## Error Handling Flow

```
Component mounted
    │
    ▼
useEffect(() => {
    try {
        setLoading(true)
        setError(null)
        │
        data = await getBloodRequests()
        │
        setData(data)
    }
    catch (error) {
        setError("Failed to load blood requests")
        toast({
            title: "Error",
            description: error message,
            variant: "destructive"
        })
        console.error(error)
    }
    finally {
        setLoading(false)
    }
})
    │
    ├─ Rendering
    │  │
    │  ├─ if (loading)
    │  │   └─ Show: <p>Loading...</p>
    │  │
    │  ├─ if (error)
    │  │   └─ Show: <p>{error}</p>
    │  │
    │  ├─ if (data.length === 0)
    │  │   └─ Show: <p>No data found</p>
    │  │
    │  └─ if (data exists)
    │      └─ Render: <Table data={data} />
    │
    └─ User sees appropriate state
```

## State Management Pattern

```
AdminDashboard (Parent)
├─ State:
│  ├─ activeTab: "dashboard" | "requests" | "donors" | "analytics"
│  ├─ adminName: string
│  ├─ sidebarOpen: boolean
│  ├─ refreshTrigger: number
│  └─ loading: boolean
│
├─ Effects:
│  └─ fetchAdminInfo()
│     └─ Gets current user name from Firestore
│
├─ Handlers:
│  ├─ handleLogout() → navigate("/login")
│  ├─ handleActionComplete() → setRefreshTrigger(+1)
│  └─ setActiveTab(tab)
│
└─ Children receive:
   ├─ refreshTrigger (prop)
   ├─ adminId (auth.currentUser?.uid)
   ├─ onActionComplete (callback)
   └─ Other component-specific props
```

---

**Last Updated**: February 2, 2026  
**Architecture Version**: 1.0  
**Status**: Production Ready
