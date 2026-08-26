
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";

import ReportProblem from "./pages/ReportProblem";
import MyComplaints from "./pages/MyComplaints";
import ComplaintDetails from "./pages/ComplaintDetails";

import Login from "./pages/Login";
import Register from "./pages/Register";
import OTPVerification from "./pages/OTPVerification";

import AdminLogin from "./pages/AdminLogin";
import AdminDasboard from "./pages/AdminDasboard";
import AdminComplaints from "./pages/AdminComplaints";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminAreaAlert from "./pages/AdminAreaAlert"

// ==========================================
// MAIN APP CONTENT
// ==========================================

function AppContent() {
  const location = useLocation();

  // Pages where Navbar should NOT appear
  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/verify-otp" ||
    location.pathname === "/admin-login" ||
    location.pathname === "/admin" ||
    location.pathname === "/admin/complaints" ||
    location.pathname === "/admin/area-alerts";

  return (
    <>

      {/* ==========================================
          NAVBAR
      ========================================== */}

      {!hideNavbar && (
        <nav className="navbar">

          {/* Logo */}

          <Link
            to="/"
            className="nav-logo"
          >
            🇮🇳 LocalFix India
          </Link>


          {/* Navigation Links */}

          <div className="nav-links">

            <Link to="/report-problem">
              Report Problem
            </Link>

            <Link to="/my-complaints">
              My Complaints
            </Link>



             <Link to="/login">
              Logout
            </Link>




          

          </div>

        </nav>
      )}


      {/* ==========================================
          ROUTES
      ========================================== */}

      <Routes>

        {/* ==========================================
            HOME
        ========================================== */}

        <Route
          path="/"
          element={
            <Navigate to="/login" replace />
          }
        />


        {/* ==========================================
            CITIZEN - REPORT PROBLEM
        ========================================== */}

        <Route
          path="/report-problem"
          element={
            <ReportProblem />
          }
        />


        {/* ==========================================
            CITIZEN LOGIN
        ========================================== */}

        <Route
          path="/login"
          element={
            <Login />
          }
        />


        {/* ==========================================
            CITIZEN REGISTER
        ========================================== */}

        <Route
          path="/register"
          element={
            <Register />
          }
        />


        {/* ==========================================
            OTP VERIFICATION
        ========================================== */}

        <Route
          path="/verify-otp"
          element={
            <OTPVerification />
          }
        />


        {/* ==========================================
            MY COMPLAINTS
        ========================================== */}

        <Route
          path="/my-complaints"
          element={
            <MyComplaints />
          }
        />


        {/* ==========================================
            COMPLAINT DETAILS
        ========================================== */}

        <Route
          path="/complaint/:id"
          element={
            <ComplaintDetails />
          }
        />


        {/* ==========================================
            ADMIN LOGIN
        ========================================== */}

        <Route
          path="/admin-login"
          element={
            <AdminLogin />
          }
        />


        {/* ==========================================
            ADMIN DASHBOARD
        ========================================== */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDasboard />
            </ProtectedRoute>
          }
        />


        {/* ==========================================
            ADMIN COMPLAINTS
        ========================================== */}

        <Route
          path="/admin/complaints"
          element={
            <ProtectedRoute>
              <AdminComplaints />
            </ProtectedRoute>
          }
        />


        {/* ==========================================
            INVALID URL
        ========================================== */}

        <Route
          path="*"
          element={
            <Navigate to="/login" replace />
          }
        />

        {/* admin area alert */}
        <Route path="/admin/area-alerts"
         element={
         <ProtectedRoute>
         <AdminAreaAlert/>
         </ProtectedRoute>
         }/>

      </Routes>

    </>
  );
}


// ==========================================
// APP
// ==========================================

function App() {
  return (
    <BrowserRouter>

      <AppContent />

    </BrowserRouter>
  );
}

export default App;