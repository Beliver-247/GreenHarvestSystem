import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

// Local Repo Components
import LayoutQAManager from "./components/LayoutQAManager";
import LayoutQATeam from "./components/LayoutQATeam";
import AddQArecord from "./components/AddQArecord";
import AddQAmember from "./components/AddQAmember";
import QARecords from "./components/qaRecords";
import QATeam from "./components/QATeam";
import IncomingBatches from "./components/IncomingBatches";
import QADashboard from "./components/QADash";
import QAStandards from "./components/QAStandardComponent";
import NotificationModal from './components/modals/NotificationModal'; // Local notification modal

// Remote Repo Components
import Login from "./components/Login";
import VFDashboard from "./components/VehicleFleetDashboard";
import LayoutVFManager from "./components/LayoutVFManager";
import LayoutDriver from "./components/LayoutDriver";
import VehicleManagement from "./pages/VehicleManagement";
import DriverManagement from "./pages/DriverManagement";
import FuelManagement from "./pages/FuelManagement";
import MaintenanceManagement from "./pages/MaintenanceManagement";
import ExpensesCalculator from "./pages/ExpensesCalculator";
import DriverPage from "./pages/DriverPage";
import Signup from "./pages/Signup.js";
import OTP from "./pages/OTP.js";
import SignIn from "./pages/SignIn.js";
import Home from "./pages/Home.js";
import Header from "./components/Header.js";
import PrivateRoute from "./components/PrivateRoute.js";
import RecoveryPage from "./pages/Recovery_email.js";
import RecoveryOTP from "./pages/Recovery_OTP.js";
import RecoveryPassword from "./pages/Recovery_Password.js";
import AdminDashboard from "./pages/Admin_Dashboard.js";
import AddEmployeeForm from "./pages/Add_employee.js";
import EmployeeSignin from "./pages/Employee_SignIn.js";
import Unauthorized from "./pages/Unauthorized.js";
import AddProduct from './pages/AddProduct';
import ViewProduct from './pages/ViewProduct';
import AdminView from './pages/AdminView';
import OffcutDashboard from './pages/Offcut-Dashboard.js';

// Socket.io connection
const socket = io("http://localhost:8070");

function App() {
  const [showModal, setShowModal] = useState(false);
  const [batchDetails, setBatchDetails] = useState({});

  useEffect(() => {
    // Listen for the new batch event from the backend
    socket.on("new-batch", (batch) => {
      setBatchDetails(batch);
      setShowModal(true); // Open modal when a new batch notification is received
    });

    // Clean up the socket listener when the component unmounts
    return () => socket.off("new-batch");
  }, []);

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <Router>
      <Header /> {/* Assuming the Header should be present for both sections */}
      <div className="app-container">
        <div className="content">
          <Routes>
            {/* QA Manager Routes */}
            <Route path="/qa-manager" element={<LayoutQAManager />}>
              <Route index element={<QADashboard />} />
              <Route path="incoming-batches" element={<IncomingBatches />} />
              <Route path="add-qarecord" element={<AddQArecord />} />
              <Route path="qa-records" element={<QARecords />} />
              <Route path="qa-team" element={<QATeam />} />
              <Route path="add-qaMember" element={<AddQAmember />} />
              <Route path="qa-standards" element={<QAStandards />} />
            </Route>

            {/* QA Team Routes */}
            <Route path="/qa-team" element={<LayoutQATeam />}>
              <Route index element={<QADashboard />} />
              <Route path="add-qarecord" element={<AddQArecord />} />
              <Route path="qa-records" element={<QARecords />} />
              <Route path="incoming-batches" element={<IncomingBatches />} />
            </Route>

            {/* Vehicle Fleet Management Routes */}
            <Route path="/vehicle-fleet" element={<LayoutVFManager />}>
              <Route index element={<VFDashboard />} />
              <Route path="vehicle-management" element={<VehicleManagement />} />
              <Route path="driver-management" element={<DriverManagement />} />
              <Route path="fuel-management" element={<FuelManagement />} />
              <Route path="maintenance-management" element={<MaintenanceManagement />} />
              <Route path="cost-management" element={<ExpensesCalculator />} />
            </Route>

            {/* Driver Routes */}
            <Route path="/driver" element={<LayoutDriver />}>
              <Route path="driver-page" element={<DriverPage />} />
            </Route>

            {/* Authentication and Recovery Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/OTP" element={<OTP />} />
            <Route path="/sign-up" element={<Signup />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/recovery-email" element={<RecoveryPage />} />
            <Route path="/recovery-OTP" element={<RecoveryOTP />} />
            <Route path="/recovery-password" element={<RecoveryPassword />} />
            <Route path="/employee-signin" element={<EmployeeSignin />} />
            <Route path="/Unauthorized" element={<Unauthorized />} />

            {/* Admin Routes */}
            <Route path="/add-employee" element={<AddEmployeeForm />} />
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard/profile" element={<QADashboard />} />
              <Route path="/admin-user" element={<AdminDashboard />} />
            </Route>

            {/* Product Management Routes */}
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/view-product" element={<ViewProduct />} />
            <Route path="/admin-product" element={<AdminView />} />
            <Route path="/dashboard" element={<OffcutDashboard />} />

            {/* Offcut Specials Placeholder */}
            <Route path="/" element={<h1>Offcut Specials</h1>} />
          </Routes>
        </div>

        {/* Global notification modal for new batch */}
        <NotificationModal
          title="New Batch Arrived"
          message={`Vegetable: ${batchDetails.vegetableType}\nWeight: ${batchDetails.totalWeight} kg\nArrival Date: ${batchDetails.arrivalDate}`}
          show={showModal}
          onClose={closeModal}
        />
      </div>
    </Router>
  );
}

export default App;
