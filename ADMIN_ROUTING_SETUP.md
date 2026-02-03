// ADMIN ROUTING CONFIGURATION SUMMARY
// ===================================

// Routes Structure:
// ✅ /admin → AdminLogin component
// ✅ /admin/dashboard → AdminDashboard (protected by AdminProtectedRoute)

// Authentication Flow:
// 1. User visits /admin → AdminLogin page
// 2. Enters email/password
// 3. AdminLogin verifies:
//    - Firebase Auth credentials
//    - Firestore role === "admin"
// 4. On success → redirect to /admin/dashboard
// 5. On failure → show error, stay on /admin
// 6. If already logged in as admin → auto-redirect to /admin/dashboard

// AdminProtectedRoute Logic:
// - If NOT authenticated → redirect to /admin (login page)
// - If authenticated but NOT admin → redirect to / (home)
// - If authenticated AND admin → allow access
// - NEVER redirects to /login or user login page

// AdminDashboard Features:
// ✅ Top Header: Logo, admin name, logout button
// ✅ Sidebar Navigation: Dashboard, Blood Requests, Donors, Analytics
// ✅ Dashboard Tab:
//    - Stats cards (Total Requests, Pending, Fulfilled, Active Donors)
//    - Request Status Chart (Pending/Fulfilled/Expired)
//    - Blood Group Distribution Chart
//    - Request Trend Chart (30-day trend)
//    - Activity Log
// ✅ Blood Requests Tab:
//    - Table with Patient Name, Blood Group, Hospital, Units, Status
//    - Update status button
//    - Delete request button
// ✅ Donors Tab:
//    - Table with Name, Blood Group, Phone, Active/Inactive status
//    - Activate/Deactivate button
//    - Delete donor button
// ✅ Analytics Tab:
//    - Combined view of all metrics and charts
// ✅ Logout: Redirects to /admin (not /login)

// File Structure:
// client/pages/AdminLogin.tsx ............ Admin login form (separate from user login)
// client/pages/AdminDashboard.tsx ........ Main dashboard with tabs
// client/components/AdminProtectedRoute.tsx ... Protected route wrapper
// client/components/admin/DashboardStats.tsx ... Summary cards
// client/components/admin/RequestStatusChart.tsx ... Status chart
// client/components/admin/RequestTrendChart.tsx ... Trend chart
// client/components/admin/BloodGroupChart.tsx ... Blood group distribution
// client/components/admin/BloodRequestsTable.tsx ... Request management
// client/components/admin/DonorsTable.tsx ... Donor management
// client/components/admin/ActivityLog.tsx ... Activity log
// client/lib/adminDashboard.ts .......... Firestore queries

// Key Security Rules:
// 1. Admin authentication COMPLETELY SEPARATE from user login
// 2. No redirect from admin routes to /login
// 3. Role-based access control enforced
// 4. Admin must have role="admin" in Firestore users collection
// 5. All admin queries filtered by admin user ID where applicable
