import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Login from "./pages/Login";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import Register from "./pages/Register";

import { ProtectedRoute, PublicRoute } from "./components/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import MoodTracker from "./pages/MoodTracker";
import PatientDetails from "./pages/PatientDetails";

const queryClient = new QueryClient();

function App() {
  const { token, role } = useAuth(); // get role from hook

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public route: login */}
          <Route
            path="/login"
            element={
              <PublicRoute isLoggedIn={!!token} redirectTo={role === "doctor" ? "/doctor-dashboard" : "/patient-dashboard"}>
                <Login />
              </PublicRoute>
            }
          />

          {/* Public route: register*/}
          <Route
            path="/register"
            element={
              <PublicRoute isLoggedIn={!!token} redirectTo={role === "doctor" ? "/doctor-dashboard" : "/patient-dashboard"}>
                <Register />
              </PublicRoute>
            }
          />

          {/* Doctor dashboard */}
          <Route
            path="/doctor-dashboard"
            element={
              <ProtectedRoute
                isLoggedIn={!!token}
                userRole={role}
                requiredRole="doctor"
              >
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />

          {/* Patient dashboard */}
          <Route
            path="/patient-dashboard"
            element={
              <ProtectedRoute
                isLoggedIn={!!token}
                userRole={role}
                requiredRole="patient"
              >
                <PatientDashboard />
              </ProtectedRoute>
            }
          />

          {/* Mood tracker */}
          <Route
            path="/mood-tracker"
            element={
              <ProtectedRoute
                isLoggedIn={!!token}
                userRole={role}
                requiredRole="patient"
              >
                <MoodTracker />
              </ProtectedRoute>
            }
          />

          {/* Patient history - Doctor view */}
          <Route
            path="/patient/:patientId"
            element={
              <ProtectedRoute
                isLoggedIn={!!token}
                userRole={role}
                //requiredRole="doctor"
              >
                <PatientDetails />
              </ProtectedRoute>
            }
          />

          {/* Catch-all: redirect based on role */}
          <Route
            path="*"
            element={
              <Navigate
                to={role === "doctor" ? "/doctor-dashboard" : role === "patient" ? "/patient-dashboard" : "/login"}
                replace
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
