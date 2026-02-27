import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";

import Categories from "./pages/Categories";
import MapStep from "./pages/MapStep";
import IncidentCreate from "./pages/IncidentCreate";
import IncidentView from "./pages/IncidentView";
import MyIncidents from "./pages/MyIncidents";
import AllIncidents from "./pages/AllIncidents";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";

import AdminDashboard from "./pages/AdminDashboard";
import AdminIncidents from "./pages/AdminIncidents";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/categories" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <Categories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <MapStep />
            </ProtectedRoute>
          }
        />
        <Route
          path="/incident/create"
          element={
            <ProtectedRoute>
              <IncidentCreate />
            </ProtectedRoute>
          }
        />

        <Route
          path="/incident/:id"
          element={
            <ProtectedRoute>
              <IncidentView />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-incidents"
          element={
            <ProtectedRoute>
              <MyIncidents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/all-incidents"
          element={
            <ProtectedRoute>
              <AllIncidents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/incidents"
          element={
            <AdminRoute>
              <AdminIncidents />
            </AdminRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
