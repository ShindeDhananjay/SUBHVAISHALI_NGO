import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Activities from "./pages/Activities";
import Events from "./pages/Events";
import Impact from "./pages/Impact";
import Volunteer from "./pages/Volunteer";
import Donate from "./pages/Donate";
import Contact from "./pages/Contact";
import VerifyCertificate from "./pages/VerifyCertificate";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminLayout from "./components/admin/AdminLayout";
import ManageContent from "./pages/admin/ManageContent";
import ManageEvents from "./pages/admin/ManageEvents";
import ManageActivities from "./pages/admin/ManageActivities";
import ManageVolunteers from "./pages/admin/ManageVolunteers";
import ManageDonations from "./pages/admin/ManageDonations";
import ManageCertificates from "./pages/admin/ManageCertificates";
import ManageMessages from "./pages/admin/ManageMessages";
import ManageAdmin from "./pages/admin/ManageAdmin";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="activities" element={<Activities />} />
          <Route path="events" element={<Events />} />
          <Route path="impact" element={<Impact />} />
          <Route path="volunteer" element={<Volunteer />} />
          <Route path="donate" element={<Donate />} />
          <Route path="contact" element={<Contact />} />
          <Route path="verify-certificate" element={<VerifyCertificate />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="content" element={<ManageContent />} />
          <Route path="events" element={<ManageEvents />} />
          <Route path="activities" element={<ManageActivities />} />
          <Route path="volunteers" element={<ManageVolunteers />} />
          <Route path="donations" element={<ManageDonations />} />
          <Route path="certificates" element={<ManageCertificates />} />
          <Route path="messages" element={<ManageMessages />} />
          <Route path="settings" element={<ManageAdmin />} />
        </Route>
      </Routes>
    </Router>
  );
}
