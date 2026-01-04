import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./Layout/AdminLayout";
import AdminProtectedRoute from "./AdminProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import UsersList from "./pages/UsersList";
import ImageTextEditor from "../Components/ImageTextEditor";
import CreativeManagement from "./pages/CreativeManagement";
import CategoryManagement from "./pages/CategoryManagement";
import ChatSupport from "./pages/ChatSupport";
import IvrRequests from "./pages/IvrRequests";
import IvrCredits from "./pages/IvrCredits";
import UgcRequests from "./pages/UgcRequests";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route
        path="/*"
        element={
          <AdminProtectedRoute>
            <AdminLayout>
              <Routes>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/image-text-editor" element={<ImageTextEditor />} />
                <Route path="/image-text-editor/:id" element={<ImageTextEditor />} />
                <Route path="/creative-management" element={<CreativeManagement />} />
                <Route path="/category-management" element={<CategoryManagement />} />
                <Route path="/users" element={<UsersList />} />
                <Route path="/chat-support" element={<ChatSupport />} />
                <Route path="/ivr-requests" element={<IvrRequests />} />
                <Route path="/ivr-credits" element={<IvrCredits />} />
                <Route path="/ugc-requests" element={<UgcRequests />} />
                <Route path="/settings" element={<AdminSettings />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Routes>
            </AdminLayout>
          </AdminProtectedRoute>
        }
      />
    </Routes>
  );
};

// Placeholder components - replace with your actual implementations

const AdminSettings = () => <div>Admin Settings</div>;

export default AdminRoutes;
