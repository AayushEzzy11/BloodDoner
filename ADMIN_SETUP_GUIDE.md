# Sahayog Red Admin Dashboard - Setup Guide

## 🚀 Quick Start

The admin dashboard is now fully integrated into your Sahayog Red blood donor management system. Here's everything you need to know to get started.

## ✅ What's Included

### New Files Created
1. **`client/components/ProtectedRoute.tsx`** - Route protection with role-based access
2. **`client/lib/adminDashboard.ts`** - Firestore queries and CRUD operations
3. **`client/pages/AdminDashboard.tsx`** - Main dashboard component with responsive layout
4. **`client/components/admin/DashboardStats.tsx`** - Summary statistics cards
5. **`client/components/admin/RequestStatusChart.tsx`** - Request status bar chart
6. **`client/components/admin/RequestTrendChart.tsx`** - 30-day request trend line chart
7. **`client/components/admin/BloodGroupChart.tsx`** - Donor blood group pie chart
8. **`client/components/admin/BloodRequestsTable.tsx`** - Request management table
9. **`client/components/admin/DonorsTable.tsx`** - Donor management table
10. **`client/components/admin/ActivityLog.tsx`** - Recent activity feed

### Modified Files
- **`client/App.jsx`** - Updated to use new AdminDashboard with ProtectedRoute
- **`ADMIN_DASHBOARD_DOCS.md`** - Comprehensive documentation

## 📋 Prerequisites

All required dependencies are already in your `package.json`:
- ✅ React 18+
- ✅ TypeScript
- ✅ Firebase
- ✅ Tailwind CSS 3
- ✅ Recharts
- ✅ Lucide React
- ✅ React Router 6
- ✅ Radix UI components

## 🔐 Authentication Setup

### Admin User Creation
To create admin users in your system:

1. Register a user normally
2. In Firestore, edit the user document in `users` collection
3. Set `role: "admin"`

Example Firestore document:
```json
{
  "uid": "user123",
  "email": "admin@sahayogred.com",
  "firstName": "Admin",
  "lastName": "User",
  "bloodType": "O+",
  "phone": "+91XXXXXXXXXX",
  "role": "admin",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

## 🎯 Access the Dashboard

1. **Login as Admin**
   ```
   Email: admin@sahayogred.com (or your admin email)
   Password: your-password
   ```

2. **Navigate to Dashboard**
   - URL: `http://localhost:8080/admin`
   - Or add a link in your main navigation to `/admin`

3. **Authorization Check**
   - ProtectedRoute will verify:
     - User is authenticated
     - User role is "admin"
   - Non-admin users are redirected to `/login`

## 🎨 Dashboard Features

### Home Tab (Dashboard)
- **4 Summary Cards**: Total Requests, Pending, Fulfilled, Active Donors
- **Charts**: 
  - Request Status Distribution (bar chart)
  - Donor Blood Group Distribution (pie chart)
  - 30-day Request Trend (line chart)
- **Activity Log**: Recent admin actions

### Blood Requests Tab
- **Table View**: All blood requests with full details
- **Quick Actions**:
  - Update status: Pending → Fulfilled → Expired
  - Delete requests
  - View patient details and hospital info
- **Real-time Updates**: Changes reflected immediately

### Donors Tab
- **Donor Directory**: All registered blood donors
- **Management**:
  - Activate/Deactivate donors
  - Delete donor profiles
  - View contact information
- **Status Tracking**: Active vs Inactive donors

### Analytics Tab
- **Comprehensive Metrics**: All statistics and charts
- **Trend Analysis**: 30-day request volume
- **Donor Distribution**: Blood group breakdown
- **Activity Audit**: Complete admin action history

## 🔌 Firestore Collections Reference

### bloodRequests
```typescript
{
  patientName: string,
  bloodType: string,
  hospital: string,
  unitsNeeded: number,
  status: "pending" | "fulfilled" | "expired",
  createdAt: Timestamp,
  updatedAt: Timestamp,
  // other fields...
}
```

### users (with role="admin")
```typescript
{
  uid: string,
  email: string,
  firstName: string,
  lastName: string,
  bloodType: string,
  phone: string,
  role: "admin", // <- Required for admin access
  isActive: boolean,
  createdAt: Timestamp,
  // other fields...
}
```

### adminActivityLogs (auto-created)
```typescript
{
  adminId: string,
  action: string,
  details: Record<string, any>,
  timestamp: Timestamp
}
```

## 🚀 Running the Application

```bash
# Start development server
npm run dev

# TypeScript checking
npm run typecheck

# Build for production
npm run build

# Start production server
npm start
```

## 📊 Key Functionality

### Real-time Statistics
- Total blood requests count
- Pending requests (need fulfillment)
- Fulfilled requests (completed)
- Active donors (available for donation)

### Request Management
- View all requests with patient/hospital details
- Update request status with dropdown
- Delete requests with confirmation
- Activity logging for all changes

### Donor Management
- View complete donor directory
- Toggle donor active/inactive status
- Delete donor profiles
- Track donor availability

### Analytics & Charts
- **Bar Chart**: Request status distribution
- **Pie Chart**: Active donors by blood type
- **Line Chart**: 30-day request trends

### Activity Audit Trail
- Logs every admin action
- Shows what changed and when
- Tracks status updates and deletions
- Helpful for system monitoring

## 🎨 Customization

### Add New Admin Users
1. Register via `/register`
2. Edit user in Firestore and set `role: "admin"`

### Modify Dashboard Colors
Edit color mappings in components:
- Blood type colors: `getBloodTypeColor()` in tables
- Status colors: `getStatusColor()` in request table
- Chart colors: Modify COLORS array in BloodGroupChart

### Add Dashboard to Navigation
In your Header/Navigation component:
```tsx
{user?.role === "admin" && (
  <Link to="/admin">
    <LayoutDashboard className="h-5 w-5" />
    Admin Dashboard
  </Link>
)}
```

## 🛠️ Development Tips

### Adding New Features

**Add a Chart:**
```typescript
// 1. Create query function in adminDashboard.ts
export async function getCustomData() {
  // Firestore query
}

// 2. Create component in admin/ folder
export const CustomChart = ({ refreshTrigger = 0 }) => {
  useEffect(() => {
    getCustomData().then(setData);
  }, [refreshTrigger]);
  
  return <Card>...</Card>;
};

// 3. Add to dashboard
<CustomChart refreshTrigger={refreshTrigger} />
```

**Add New Table Column:**
1. Add field to Firestore document
2. Add `<TableHead>` in table header
3. Add `<TableCell>` in table row loop
4. Update TypeScript interfaces

## ⚠️ Important Notes

1. **Admin-Only Access**: Only users with `role="admin"` can access `/admin`
2. **Activity Logging**: All admin actions are logged automatically
3. **Confirmation Required**: Deletions require user confirmation
4. **Real-time Updates**: Charts and tables refresh after any action
5. **Error Handling**: Toast notifications show success/failure feedback

## 🐛 Troubleshooting

### Dashboard Not Loading
- ✅ Check Firebase authentication
- ✅ Verify user has `role: "admin"` in Firestore
- ✅ Check browser console for errors
- ✅ Ensure all Firestore collections exist

### Charts Not Displaying
- ✅ Verify data exists in Firestore
- ✅ Check browser console for errors
- ✅ Ensure Firestore queries return data
- ✅ Check Recharts dependency

### Activity Log Not Showing
- ✅ Check `adminActivityLogs` collection exists
- ✅ Verify admin actions are being performed
- ✅ Check Firestore permissions

### Table Data Not Updating
- ✅ Verify Firestore documents have required fields
- ✅ Check database permissions
- ✅ Clear browser cache and reload
- ✅ Check network requests in DevTools

## 📱 Responsive Behavior

- **Desktop (1024px+)**: Full sidebar + multi-column layouts
- **Tablet (768px-1023px)**: Collapsible sidebar
- **Mobile (<768px)**: Hidden sidebar with hamburger menu
- All tables scroll horizontally on small screens

## 🔒 Security Checklist

- ✅ ProtectedRoute guards `/admin` endpoint
- ✅ Role-based access control (admin only)
- ✅ Activity audit trail for all admin actions
- ✅ Confirmation dialogs prevent accidental deletions
- ✅ Error handling and user feedback
- ✅ Firebase Auth integration

## 📚 Additional Resources

- [Complete Dashboard Documentation](./ADMIN_DASHBOARD_DOCS.md)
- [Firebase Firestore Guide](https://firebase.google.com/docs/firestore)
- [Recharts Documentation](https://recharts.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router 6](https://reactrouter.com/)

## 🎓 Learning Path

1. Explore dashboard features
2. Try updating request statuses
3. View changes in activity log
4. Check analytics charts
5. Manage donors
6. Customize as needed

## 📞 Support

For issues or questions:
1. Check error messages in browser console
2. Review Firestore data structure
3. Verify user permissions
4. Check network tab for API issues
5. Review documentation files

---

**Dashboard Status**: ✅ Production Ready  
**Last Updated**: February 2, 2026  
**Version**: 1.0.0

## 🎉 You're All Set!

Your admin dashboard is ready to use. Start by:
1. Creating an admin user
2. Adding some test data to Firestore
3. Logging in and exploring the dashboard
4. Managing blood requests and donors

Happy managing! 🚀
