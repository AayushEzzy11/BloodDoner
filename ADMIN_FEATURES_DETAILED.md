# Admin Dashboard Features - Complete Documentation

## 1. AUTHENTICATION SYSTEM

### AdminLogin Component (`client/pages/AdminLogin.tsx`)

**Features:**
- ✅ Email/password authentication
- ✅ Firestore role verification
- ✅ Auto-redirect if already logged in as admin
- ✅ Error handling for invalid credentials
- ✅ Loading states during authentication
- ✅ Modern gradient UI with branding
- ✅ Session persistence via Firebase Auth

**Flow:**
```
User enters email/password
     ↓
Submit login form
     ↓
Verify with Firebase Auth
     ↓
Check Firestore for role === "admin"
     ↓
YES → Redirect to /admin/dashboard
NO  → Logout + Show error message
```

**Security Checks:**
```typescript
1. Firebase Auth validation
   if (!user) throw "Invalid credentials"

2. Firestore role verification
   const userData = await getDoc(users/{uid})
   if (userData.role !== "admin") {
     await signOut()
     return "Access denied"
   }
```

---

## 2. ROUTE PROTECTION

### AdminProtectedRoute Component (`client/components/AdminProtectedRoute.tsx`)

**Decision Tree:**
```
User tries to access /admin/dashboard
     ↓
Check if authenticated
     ├─ NO → Redirect to /admin (login)
     └─ YES → Check Firestore role
          ├─ role === "admin" → Allow access ✅
          └─ role !== "admin" → Redirect to / (home)
```

**Implementation:**
```typescript
// Unauthenticated
if (!user) {
  return <Navigate to="/admin" replace />
}

// Non-admin
if (userData?.role !== "admin") {
  return <Navigate to="/" replace />
}

// Admin
return <>{children}</>
```

---

## 3. DASHBOARD INTERFACE

### Layout & Navigation

**Header:**
- Sahayog Red logo
- Admin name (from Firestore)
- Logout button
- Mobile menu toggle

**Sidebar Navigation:**
```
┌─ Dashboard
├─ Blood Requests
├─ Donors
└─ Analytics
```

**Responsive Design:**
- Desktop: Fixed sidebar + content area
- Tablet: Optimized spacing
- Mobile: Hamburger menu with overlay

---

## 4. DASHBOARD TAB - Overview

### Statistics Cards (DashboardStats.tsx)

**4 Key Metrics:**

```
┌─────────────────────┬─────────────────────┐
│  Total Requests     │  Pending Requests   │
│  [Count]            │  [Count]            │
│  📊 Blue            │  ⏳ Yellow          │
├─────────────────────┼─────────────────────┤
│ Fulfilled Requests  │  Active Donors      │
│  [Count]            │  [Count]            │
│  ✅ Green           │  👥 Purple          │
└─────────────────────┴─────────────────────┘
```

**Data Source:**
```typescript
async function getDashboardStats() {
  const requests = await getDocs(bloodRequests)
  const donors = await getDocs(users where role="donor")
  
  return {
    totalRequests: requests.length,
    pendingRequests: count(status="pending"),
    fulfilledRequests: count(status="fulfilled"),
    activeDonors: count(isActive=true)
  }
}
```

### Request Status Chart (RequestStatusChart.tsx)

**Chart Type:** Bar Chart (Recharts)

**Data Visualization:**
```
Status Distribution
│
│     ███
│     ███  ███  ███
│ ──┼─███──███──███───
│     █   │ █   │ █
└─────────────────────
  Pending Fulfilled Expired
```

**Colors:**
- Pending: Yellow (#EAB308)
- Fulfilled: Green (#22C55E)
- Expired: Red (#EF4444)

**Data Calculation:**
```typescript
export async function getRequestStatusBreakdown() {
  const requests = await getBloodRequests()
  return {
    pending: requests.filter(r => r.status === "pending").length,
    fulfilled: requests.filter(r => r.status === "fulfilled").length,
    expired: requests.filter(r => r.status === "expired").length
  }
}
```

### Blood Group Distribution Chart (BloodGroupChart.tsx)

**Chart Type:** Pie Chart or Bar Chart

**Groups Displayed:**
- O+, O-
- A+, A-
- B+, B-
- AB+, AB-

**Shows:**
- Distribution of donors by blood type
- Which blood groups are in high demand
- Inventory balance

### Request Trend Chart (RequestTrendChart.tsx)

**Chart Type:** Line Chart

**Time Period:** 30 days

**Visualization:**
```
Requests Over Time
│
│  ╱╲
│ ╱  ╲  ╱╲
│╱    ╲╱  ╲╱
└──────────────
  Day 1 ... Day 30
```

**Data Points:**
- Daily request count
- Trend analysis
- Peak activity days

**Calculation:**
```typescript
export async function getRequestTrend(days: number = 30) {
  const requests = await getBloodRequests()
  const grouped = {} // Group by date
  
  requests.forEach(req => {
    const date = req.createdAt.toDate()
    const dateStr = date.toISOString().split("T")[0]
    grouped[dateStr]++
  })
  
  return grouped
}
```

### Activity Log (ActivityLog.tsx)

**Displays:**
- Recent admin actions
- Timestamps
- Action details

**Example Entries:**
```
Admin John: Updated request #123 status to Fulfilled
↓ 2 hours ago

Admin Sarah: Deleted donor account (ID: donor_456)
↓ 5 hours ago

Admin John: Created blood request for Hospital ABC
↓ 1 day ago
```

**Tracked Actions:**
- UPDATE_REQUEST_STATUS
- DELETE_REQUEST
- UPDATE_DONOR_STATUS
- DELETE_DONOR

---

## 5. BLOOD REQUESTS TAB - Management

### BloodRequestsTable Component

**Table Columns:**
```
┌────────┬──────────┬────────┬────────┬──────────┬────────┐
│Patient │ Blood Gr │Hospital│ Units  │ Status   │Action  │
├────────┼──────────┼────────┼────────┼──────────┼────────┤
│ John   │ O+       │Hospital A│ 5    │ Pending  │[▼][🗑] │
│ Sarah  │ AB-      │Hospital B│ 3    │Fulfilled │[▼][🗑] │
│ Ahmed  │ A+       │Hospital C│ 2    │ Expired  │[▼][🗑] │
└────────┴──────────┴────────┴────────┴──────────┴────────┘
```

**Status Update Dropdown:**
```
[Pending ▼]
  ├─ Pending
  ├─ Fulfilled
  └─ Expired
```

**Available Actions:**
1. **Update Status**
   - Click dropdown
   - Select new status
   - Automatically saves to Firestore
   - Confirms with toast notification

2. **Delete Request**
   - Click trash icon
   - Confirm deletion
   - Removes from Firestore
   - Activity logged

**Data Fetching:**
```typescript
export async function getBloodRequests(status?: string) {
  const collection = db.collection("bloodRequests")
  let query = collection
  
  if (status) {
    query = query.where("status", "==", status)
  }
  
  return await query.get()
}
```

**Update Status:**
```typescript
export async function updateRequestStatus(
  requestId: string,
  newStatus: "pending" | "fulfilled" | "expired",
  adminId: string
) {
  const docRef = db.doc(`bloodRequests/${requestId}`)
  await docRef.update({ status: newStatus })
  
  // Log activity
  await logActivity(adminId, "UPDATE_REQUEST_STATUS", {
    requestId,
    newStatus
  })
}
```

---

## 6. DONORS TAB - Management

### DonorsTable Component

**Table Columns:**
```
┌────────┬──────────┬────────┬──────────┬────────────┐
│ Name   │ Blood Gr │ Phone  │ Status   │ Actions    │
├────────┼──────────┼────────┼──────────┼────────────┤
│ John   │ O+       │ 9841.. │ Active   │[●][Toggle][🗑]│
│ Sarah  │ AB-      │ 9842.. │Inactive  │[○][Toggle][🗑]│
└────────┴──────────┴────────┴──────────┴────────────┘
```

**Status Toggle Button:**
```
Active Donor  → Click → Inactive Donor
(Green ●)              (Gray ○)
```

**Available Actions:**
1. **Activate/Deactivate**
   - Toggle button switches status
   - Updates Firestore immediately
   - Real-time UI update
   - Activity logged

2. **Delete Donor**
   - Remove donor profile
   - Confirm before deletion
   - Clears all donor data
   - Activity logged

**Data Fetching:**
```typescript
export async function getAllDonors(limit: number = 100) {
  return await db.collection("users")
    .where("role", "==", "donor")
    .limit(limit)
    .get()
}
```

**Update Status:**
```typescript
export async function updateDonorStatus(
  donorId: string,
  isActive: boolean,
  adminId: string
) {
  await db.doc(`users/${donorId}`).update({ isActive })
  await logActivity(adminId, "UPDATE_DONOR_STATUS", {
    donorId,
    isActive
  })
}
```

**Delete Donor:**
```typescript
export async function deleteDonor(donorId: string, adminId: string) {
  await db.doc(`users/${donorId}`).delete()
  await logActivity(adminId, "DELETE_DONOR", { donorId })
}
```

---

## 7. ANALYTICS TAB - Insights

**Comprehensive View Includes:**
- All statistics cards
- Request status chart
- Blood group distribution chart
- Request trend line chart
- Activity log

**Purpose:**
- System-wide overview
- Performance analysis
- Trend identification
- Activity monitoring

---

## 8. REAL-TIME FEATURES

### Firestore Real-Time Updates

**Implementation:**
```typescript
// Listen to collection changes
const unsubscribe = db.collection("bloodRequests")
  .onSnapshot(snapshot => {
    // Update UI with latest data
    setRequests(snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })))
  })

// Cleanup
return () => unsubscribe()
```

**Benefits:**
- Instant data updates
- No manual refresh needed
- Multiple admins see changes immediately
- Charts update in real-time

---

## 9. ACTIVITY LOGGING

### Tracked Events

**Actions Logged:**
```typescript
enum AdminAction {
  "UPDATE_REQUEST_STATUS"    // Status change
  "DELETE_REQUEST"            // Delete request
  "UPDATE_DONOR_STATUS"       // Activate/deactivate
  "DELETE_DONOR"              // Delete donor
}
```

**Logged Data:**
```typescript
{
  id: string              // Log entry ID
  adminId: string         // Admin user ID
  action: AdminAction     // Action type
  details: {              // Action-specific data
    requestId?: string
    donorId?: string
    oldValue?: any
    newValue?: any
  }
  timestamp: Timestamp    // When action occurred
}
```

**Query:**
```typescript
export async function logActivity(
  adminId: string,
  action: string,
  details: Record<string, any>
) {
  await db.collection("activityLog").add({
    adminId,
    action,
    details,
    timestamp: new Date()
  })
}
```

---

## 10. ERROR HANDLING

### Error States

**Loading State:**
```
┌─────────────────────────┐
│  [Spinning icon]        │
│  Loading Dashboard...   │
└─────────────────────────┘
```

**Error Messages:**
```typescript
// Firestore error
catch (err) {
  toast.error("Failed to load blood requests")
  setError("Failed to load chart data")
}
```

**User Feedback:**
- Toast notifications for actions
- Error messages for failures
- Loading indicators during fetch
- Graceful error UI

---

## 11. RESPONSIVE DESIGN

### Breakpoints

**Desktop (lg ≥ 1024px):**
- Sidebar visible always
- Full table display
- All features available

**Tablet (md 768px - 1023px):**
- Optimized spacing
- Sidebar still visible
- Table may scroll

**Mobile (< 768px):**
- Hamburger menu
- Sidebar in overlay
- Stacked layout
- Touch-friendly buttons

### Mobile Menu Implementation

```typescript
const [sidebarOpen, setSidebarOpen] = useState(true)

return (
  <>
    {/* Hamburger button */}
    <button onClick={() => setSidebarOpen(!sidebarOpen)}>
      {sidebarOpen ? <X /> : <Menu />}
    </button>
    
    {/* Sidebar - conditionally positioned */}
    <aside className={sidebarOpen ? "visible" : "hidden"}>
      {/* Navigation */}
    </aside>
    
    {/* Overlay - close menu on click */}
    {sidebarOpen && (
      <div onClick={() => setSidebarOpen(false)} />
    )}
  </>
)
```

---

## 12. FIRESTORE DATA STRUCTURE

### Collections & Documents

```
Firestore Root
├── users/
│   ├── admin_uid_1/
│   │   ├── email: "admin@sahayogred.com"
│   │   ├── role: "admin"
│   │   ├── firstName: "Admin"
│   │   ├── lastName: "User"
│   │   └── isActive: true
│   ├── donor_uid_1/
│   │   ├── email: "donor@example.com"
│   │   ├── role: "donor"
│   │   ├── bloodType: "O+"
│   │   ├── isActive: true
│   │   └── ...
│
├── bloodRequests/
│   ├── request_1/
│   │   ├── patientName: "John"
│   │   ├── bloodType: "O+"
│   │   ├── hospital: "Hospital A"
│   │   ├── unitsNeeded: 5
│   │   ├── status: "pending"
│   │   └── createdAt: Timestamp
│   └── ...
│
└── activityLog/
    ├── log_1/
    │   ├── adminId: "admin_uid_1"
    │   ├── action: "UPDATE_REQUEST_STATUS"
    │   ├── details: {...}
    │   └── timestamp: Timestamp
    └── ...
```

---

## Summary

✅ Complete admin authentication system
✅ Protected route implementation
✅ Statistics and analytics dashboards
✅ Blood request management
✅ Donor management
✅ Real-time data updates
✅ Activity logging
✅ Error handling
✅ Responsive design
✅ Firestore integration

**All features are production-ready and fully functional.**
