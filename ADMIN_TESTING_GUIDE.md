# Admin Dashboard - Testing & Verification Guide

## Pre-Testing Checklist

- [ ] Project is running (`npm run dev`)
- [ ] Firebase is properly configured
- [ ] Admin account exists in Firebase Auth & Firestore
- [ ] Browser console is open (F12)
- [ ] Network tab is monitored

---

## TEST 1: Admin Authentication

### Test 1.1: Login Page Loads
**Steps:**
1. Navigate to `http://localhost:5173/admin`
2. Verify page displays

**Expected Result:**
- ✅ AdminLogin page loads
- ✅ Email and password fields visible
- ✅ "Sign In" button visible
- ✅ Sahayog Red branding displayed
- ✅ No errors in console

### Test 1.2: Already Logged In Admin
**Precondition:** User is logged in with admin account

**Steps:**
1. Navigate to `http://localhost:5173/admin`
2. Observe

**Expected Result:**
- ✅ Auto-redirects to `/admin/dashboard`
- ✅ No login form shown
- ✅ Dashboard loads

### Test 1.3: Valid Admin Login
**Steps:**
1. Navigate to `/admin`
2. Enter valid admin email
3. Enter valid admin password
4. Click "Sign In"

**Expected Result:**
- ✅ Loading spinner appears
- ✅ No errors in console
- ✅ Redirects to `/admin/dashboard`
- ✅ Toast shows "Welcome, Administrator!"

### Test 1.4: Invalid Email
**Steps:**
1. Navigate to `/admin`
2. Enter non-existent email
3. Enter any password
4. Click "Sign In"

**Expected Result:**
- ✅ Error toast: "No user found with this email."
- ✅ Page stays on `/admin`
- ✅ Password field cleared
- ✅ Email field retains value

### Test 1.5: Wrong Password
**Steps:**
1. Navigate to `/admin`
2. Enter valid admin email
3. Enter incorrect password
4. Click "Sign In"

**Expected Result:**
- ✅ Error toast: "Incorrect email or password."
- ✅ Page stays on `/admin`
- ✅ Password field cleared
- ✅ Email field retains value

### Test 1.6: Non-Admin User Login
**Precondition:** Have a non-admin user account in Firebase

**Steps:**
1. Navigate to `/admin`
2. Enter non-admin user email
3. Enter correct password
4. Click "Sign In"

**Expected Result:**
- ✅ Error toast: "Access denied. Admin credentials required."
- ✅ User is logged out
- ✅ Page stays on `/admin`
- ✅ Password field cleared

### Test 1.7: Empty Fields
**Steps:**
1. Navigate to `/admin`
2. Leave email and password empty
3. Click "Sign In"

**Expected Result:**
- ✅ HTML5 validation prevents submission
- ✅ OR error toast: "Email and password are required."
- ✅ Page stays on `/admin`

---

## TEST 2: Route Protection

### Test 2.1: Unauthenticated Access to Dashboard
**Steps:**
1. Clear browser cache/cookies (logout)
2. Navigate directly to `/admin/dashboard`
3. Observe

**Expected Result:**
- ✅ Redirects to `/admin`
- ✅ AdminLogin page shows
- ✅ No dashboard visible
- ✅ Message: "Verifying admin access..." appears briefly

### Test 2.2: Non-Admin Access to Dashboard
**Precondition:** Non-admin user is logged in

**Steps:**
1. Login as non-admin user
2. Navigate to `/admin/dashboard` in URL bar
3. Observe

**Expected Result:**
- ✅ Redirects to `/` (home page)
- ✅ Dashboard not shown
- ✅ Home page displays

### Test 2.3: Admin Access to Dashboard
**Precondition:** Admin user is logged in

**Steps:**
1. Login as admin
2. Navigate to `/admin/dashboard` in URL bar
3. Observe

**Expected Result:**
- ✅ Dashboard loads
- ✅ All tabs visible
- ✅ Data displays
- ✅ No errors in console

### Test 2.4: Admin Dashboard Persistence
**Steps:**
1. Login as admin
2. Navigate to `/admin/dashboard`
3. Refresh page (F5)
4. Observe

**Expected Result:**
- ✅ Dashboard remains visible
- ✅ No redirect to login
- ✅ Session persists
- ✅ Data reloads

---

## TEST 3: Dashboard UI

### Test 3.1: Header Elements
**Steps:**
1. Login as admin
2. View top header
3. Verify all elements

**Expected Result:**
- ✅ Sahayog Red logo visible
- ✅ Admin name displayed (e.g., "Admin User")
- ✅ "Administrator" label shows
- ✅ Logout button visible
- ✅ Mobile menu toggle on small screens

### Test 3.2: Sidebar Navigation
**Steps:**
1. View left sidebar
2. Check all nav items

**Expected Result:**
- ✅ Dashboard tab visible
- ✅ Blood Requests tab visible
- ✅ Donors tab visible
- ✅ Analytics tab visible
- ✅ Active tab highlighted in red
- ✅ Hover effects work

### Test 3.3: Mobile Menu
**Steps:**
1. Resize browser to mobile size (< 768px)
2. Click hamburger menu
3. Verify sidebar appears
4. Click outside sidebar
5. Verify sidebar closes

**Expected Result:**
- ✅ Hamburger icon appears on mobile
- ✅ Click opens sidebar as overlay
- ✅ Sidebar overlays content
- ✅ Click outside closes sidebar
- ✅ Content is readable on mobile

---

## TEST 4: Dashboard Tab

### Test 4.1: Statistics Cards Load
**Steps:**
1. Login as admin
2. Dashboard tab is active
3. Wait for data to load
4. Observe stats cards

**Expected Result:**
- ✅ 4 cards visible:
  - Total Requests
  - Pending Requests
  - Fulfilled Requests
  - Active Donors
- ✅ Numbers display
- ✅ Icons visible
- ✅ Colors: Blue, Yellow, Green, Purple
- ✅ No errors in console

### Test 4.2: Statistics Values
**Steps:**
1. View stats cards
2. Note the numbers
3. Navigate to Firestore
4. Count actual documents
5. Compare

**Expected Result:**
- ✅ Stats match actual data
- ✅ Total Requests = bloodRequests count
- ✅ Pending = count where status="pending"
- ✅ Fulfilled = count where status="fulfilled"
- ✅ Active Donors = count where role="donor" AND isActive=true

### Test 4.3: Request Status Chart
**Steps:**
1. Dashboard tab active
2. Scroll down
3. View bar chart

**Expected Result:**
- ✅ Bar chart visible
- ✅ Title: "Request Status Distribution"
- ✅ 3 bars: Pending (Yellow), Fulfilled (Green), Expired (Red)
- ✅ X-axis shows status names
- ✅ Y-axis shows counts
- ✅ Hover shows tooltip with values
- ✅ Responsive to screen size

### Test 4.4: Blood Group Chart
**Steps:**
1. Dashboard tab active
2. Scroll down
3. View pie/bar chart

**Expected Result:**
- ✅ Chart visible
- ✅ Shows blood groups: O+, O-, A+, A-, B+, B-, AB+, AB-
- ✅ Colors differentiate types
- ✅ Responsive layout
- ✅ Legend displays

### Test 4.5: Trend Chart
**Steps:**
1. Dashboard tab active
2. Scroll down
3. View line chart

**Expected Result:**
- ✅ Line chart visible
- ✅ Title: "Request Trend (30 Days)"
- ✅ X-axis shows dates
- ✅ Y-axis shows request count
- ✅ Line connects 30 days of data
- ✅ Responsive to window resize

### Test 4.6: Activity Log
**Steps:**
1. Dashboard tab active
2. Scroll to bottom
3. View activity log

**Expected Result:**
- ✅ Activity log visible
- ✅ Shows recent admin actions
- ✅ Columns: Admin, Action, Details, Timestamp
- ✅ Actions logged correctly
- ✅ Timestamps accurate

---

## TEST 5: Blood Requests Tab

### Test 5.1: Table Loads
**Steps:**
1. Click "Blood Requests" tab
2. Wait for table to load

**Expected Result:**
- ✅ Table visible
- ✅ Title: "Blood Requests"
- ✅ Subtitle: "Manage and track all blood donation requests"
- ✅ Column headers visible
- ✅ Rows populated with data

### Test 5.2: Table Data
**Steps:**
1. View blood requests table
2. Check columns and data

**Expected Result:**
- ✅ Column: Patient Name (correct names)
- ✅ Column: Blood Group (O+, O-, A+, etc.)
- ✅ Column: Hospital (hospital names)
- ✅ Column: Units Needed (numbers)
- ✅ Column: Status (Pending, Fulfilled, Expired)
- ✅ Column: Actions (dropdown + delete)

### Test 5.3: Status Update
**Steps:**
1. Find a request with "Pending" status
2. Click status dropdown
3. Select "Fulfilled"
4. Confirm

**Expected Result:**
- ✅ Status changes to "Fulfilled"
- ✅ Toast: "Request status updated successfully"
- ✅ Table refreshes
- ✅ Firestore document updated
- ✅ Activity logged
- ✅ No errors in console

### Test 5.4: Status Validation
**Steps:**
1. Request shows "Pending"
2. Click dropdown
3. Verify options

**Expected Result:**
- ✅ Can select "Pending"
- ✅ Can select "Fulfilled"
- ✅ Can select "Expired"
- ✅ Current status highlighted

### Test 5.5: Delete Request
**Steps:**
1. Find a request in table
2. Click delete (trash) icon
3. Confirm deletion

**Expected Result:**
- ✅ Request removed from table
- ✅ Toast: "Request deleted successfully"
- ✅ Firestore document deleted
- ✅ Activity logged
- ✅ Table refreshes

### Test 5.6: Table Responsiveness
**Steps:**
1. Resize browser window
2. Make it small (tablet/mobile)
3. Observe table

**Expected Result:**
- ✅ Table scrolls horizontally on small screens
- ✅ Important columns remain visible
- ✅ Buttons remain clickable
- ✅ No overlapping text

---

## TEST 6: Donors Tab

### Test 6.1: Table Loads
**Steps:**
1. Click "Donors" tab
2. Wait for table to load

**Expected Result:**
- ✅ Table visible
- ✅ Title: "Blood Donors"
- ✅ Subtitle: "Manage donor profiles and their availability"
- ✅ Column headers visible
- ✅ Rows populated with donor data

### Test 6.2: Donor Data
**Steps:**
1. View donors table
2. Check columns and data

**Expected Result:**
- ✅ Column: Name (first + last name)
- ✅ Column: Blood Group (O+, AB-, etc.)
- ✅ Column: Phone (phone numbers)
- ✅ Column: Status (Active/Inactive badge)
- ✅ Column: Actions (toggle + delete)

### Test 6.3: Toggle Donor Status
**Precondition:** Donor with status "Active"

**Steps:**
1. Find active donor
2. Click toggle button
3. Observe

**Expected Result:**
- ✅ Status changes to "Inactive"
- ✅ Badge color changes (gray)
- ✅ Toast: "Donor deactivated successfully"
- ✅ Firestore updated (isActive: false)
- ✅ Activity logged
- ✅ Table refreshes

### Test 6.4: Toggle Back
**Steps:**
1. Find inactive donor
2. Click toggle button
3. Observe

**Expected Result:**
- ✅ Status changes to "Active"
- ✅ Badge color changes (green)
- ✅ Toast: "Donor activated successfully"
- ✅ Firestore updated (isActive: true)
- ✅ Activity logged

### Test 6.5: Delete Donor
**Steps:**
1. Find donor in table
2. Click delete icon
3. Confirm

**Expected Result:**
- ✅ Donor removed from table
- ✅ Toast: "Donor deleted successfully"
- ✅ Firestore user document deleted
- ✅ Activity logged
- ✅ Table refreshes

### Test 6.6: Multiple Operations
**Steps:**
1. Toggle donor active
2. Delete another donor
3. Refresh page
4. Verify changes persist

**Expected Result:**
- ✅ All changes saved
- ✅ Page refresh shows updated data
- ✅ Firestore has all changes
- ✅ Activity log shows all actions

---

## TEST 7: Analytics Tab

### Test 7.1: Tab Content Loads
**Steps:**
1. Click "Analytics" tab
2. Wait for content

**Expected Result:**
- ✅ Title: "Analytics & Insights"
- ✅ All statistics visible
- ✅ All charts visible
- ✅ Activity log visible
- ✅ No duplicate data

### Test 7.2: Combined View
**Steps:**
1. Analytics tab active
2. Verify content

**Expected Result:**
- ✅ All stats cards shown
- ✅ All charts shown
- ✅ Activity log shown
- ✅ Same data as individual tabs
- ✅ Properly organized layout

---

## TEST 8: Logout & Session

### Test 8.1: Logout Button
**Steps:**
1. Click logout button (top right)
2. Observe

**Expected Result:**
- ✅ Redirects to `/admin` (login page)
- ✅ No error messages
- ✅ Login form visible
- ✅ Session cleared
- ✅ No console errors

### Test 8.2: Logout from Mobile
**Steps:**
1. Resize to mobile
2. Open menu
3. Click logout
4. Observe

**Expected Result:**
- ✅ Logout button visible in mobile menu
- ✅ Redirects to `/admin`
- ✅ Login page shows
- ✅ Menu closes

### Test 8.3: Cannot Access Dashboard After Logout
**Steps:**
1. Logout
2. Navigate to `/admin/dashboard`
3. Observe

**Expected Result:**
- ✅ Redirects to `/admin` (login page)
- ✅ Dashboard not accessible
- ✅ Must login again

---

## TEST 9: Data Consistency

### Test 9.1: Real-Time Updates
**Precondition:** Have 2 browser windows open, both logged in

**Steps:**
1. Window 1: Update a request status
2. Window 2: Observe the table
3. Note if Window 2 updates automatically

**Expected Result:**
- ✅ Window 2 shows updated data in real-time
- ✅ OR Window 2 updates on next refresh
- ✅ Firestore data is consistent

### Test 9.2: Chart Updates
**Steps:**
1. Create/modify blood requests in another tab
2. Watch dashboard tab
3. Observe if charts update

**Expected Result:**
- ✅ Charts update automatically (if real-time enabled)
- ✅ OR Charts show latest data on refresh
- ✅ Data is always current

### Test 9.3: Cross-Tab Consistency
**Steps:**
1. Switch between tabs rapidly
2. Verify data consistency
3. Check for race conditions

**Expected Result:**
- ✅ No duplicate data
- ✅ No missing data
- ✅ All tabs show same data
- ✅ No UI glitches

---

## TEST 10: Error Handling

### Test 10.1: Network Error
**Steps:**
1. Open DevTools Network tab
2. Set to "Offline" mode
3. Try to load dashboard
4. Observe

**Expected Result:**
- ✅ Error message displays
- ✅ Graceful error UI
- ✅ User is informed
- ✅ Can try again

### Test 10.2: Firestore Permission Error
**Steps:**
1. Create a request that violates Firestore rules
2. Attempt operation
3. Observe

**Expected Result:**
- ✅ Error toast displays
- ✅ Operation fails gracefully
- ✅ User sees explanation
- ✅ No console errors or warnings

### Test 10.3: Missing Data
**Steps:**
1. Delete a referenced document
2. Refresh admin dashboard
3. Observe

**Expected Result:**
- ✅ Dashboard still loads
- ✅ Graceful handling of missing data
- ✅ Error messages if needed
- ✅ No crashes

---

## TEST 11: Performance

### Test 11.1: Load Time
**Steps:**
1. Clear cache
2. Load `/admin`
3. Time page load
4. Note in browser DevTools

**Expected Result:**
- ✅ Page loads in < 3 seconds
- ✅ No long loading states
- ✅ Lighthouse score > 70

### Test 11.2: Table Performance
**Steps:**
1. Load dashboard with many requests (100+)
2. Scroll through table
3. Try sorting/filtering
4. Observe performance

**Expected Result:**
- ✅ Smooth scrolling
- ✅ No lag
- ✅ Responsive UI
- ✅ Tables remain usable

### Test 11.3: Chart Performance
**Steps:**
1. Dashboard with all charts loading
2. Resize window (trigger re-render)
3. Switch tabs rapidly
4. Observe performance

**Expected Result:**
- ✅ Charts render smoothly
- ✅ No animation stuttering
- ✅ Tab switching is instant
- ✅ CPU usage reasonable

---

## TEST 12: Browser Compatibility

### Test 12.1: Chrome/Edge
- [ ] All features work
- [ ] UI displays correctly
- [ ] Charts render properly
- [ ] No console errors

### Test 12.2: Firefox
- [ ] All features work
- [ ] UI displays correctly
- [ ] Charts render properly
- [ ] No console errors

### Test 12.3: Safari
- [ ] All features work
- [ ] UI displays correctly
- [ ] Charts render properly
- [ ] No console errors

### Test 12.4: Mobile Browsers
- [ ] Responsive design works
- [ ] Touch interactions work
- [ ] Menu opens/closes correctly
- [ ] Tables are usable on mobile

---

## Regression Testing Checklist

After making changes, verify:

- [ ] Admin can still login
- [ ] Non-admin cannot access dashboard
- [ ] All tabs load correctly
- [ ] Statistics are accurate
- [ ] Tables display data
- [ ] Charts render without errors
- [ ] Update/Delete operations work
- [ ] Logout works correctly
- [ ] No console errors
- [ ] Mobile layout works
- [ ] Data persists after refresh
- [ ] All toast notifications appear

---

## Success Criteria

✅ **All tests pass** = Admin Dashboard ready for production

### Test Summary Template
```
Date: [Date]
Tester: [Name]
Browser: [Browser]
Device: [Device Type]

Tests Passed: [ ]/[ ]
Critical Issues: [ ]
Minor Issues: [ ]
Overall Status: [PASS/FAIL]
```

---

## Notes

- Admin account must exist in Firebase Auth AND Firestore with `role: "admin"`
- Firestore rules must allow read/write for authenticated users
- Real-time updates may not work if using offline mode
- Performance varies based on device and network
- Mobile testing should be done on actual devices when possible

---

**All tests should be performed before deploying to production.**
