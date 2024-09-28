import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";

// Local Repo Components
import LayoutQAManager from "./components/LayoutQAManager";
import LayoutQATeam from "./components/LayoutQATeam";
import AddQArecord from "./components/AddQArecord";
import AddQAmember from "./components/AddQAmember";
import QARecords from "./components/qaRecords";
import QATeam from "./components/QATeam";
import Dashboard from "./components/QADash";
import IncomingBatches from "./components/IncomingBatches";
import Login from "./components/Login";

// Remote Repo Components
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
import QADash from './components/QADash.js';
import QAStandards from "./components/QAStandardComponent.js";
import QADashboard from "./components/QADash.js";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* QA Manager Routes (from Local Repo) */}
        <Route path="/" element={<LayoutQAManager />}>
          <Route index element={<QADashboard />} />
          <Route path="incoming-batches" element={<IncomingBatches />} />
          <Route path="add-qarecord" element={<AddQArecord />} />
          <Route path="qa-records" element={<QARecords />} />
          <Route path="qa-team" element={<QATeam />} />
          <Route path="add-qaMember" element={<AddQAmember />} />
          <Route path="qa-standards" element={<QAStandards />}/>
        </Route>

        <Route path="/qa-manager" element={<QADash />}/>

        {/* QA Team Routes (from Local Repo) */}
        <Route path="/" element={<LayoutQATeam />}>
          <Route path="add-qarecord" element={<AddQArecord />} />
          <Route path="qa-records" element={<QARecords />} />
          <Route path="incoming-batches" element={<IncomingBatches />} />
        </Route>

        {/* Vehicle Fleet Management Routes (from Remote Repo) */}
        <Route path="/vehicle-fleet" element={<LayoutVFManager />}>
          <Route index element={<VFDashboard />} />
          <Route path="vehicle-management" element={<VehicleManagement />} />
          <Route path="driver-management" element={<DriverManagement />} />
          <Route path="fuel-management" element={<FuelManagement />} />
          <Route path="maintenance-management" element={<MaintenanceManagement />} />
          <Route path="cost-management" element={<ExpensesCalculator />} />
        </Route>

        {/* Driver Routes (from Remote Repo) */}
        <Route path="driver" element={<LayoutDriver />}>
          <Route path="driver-page" element={<DriverPage />} />
        </Route>

        {/* Authentication and Recovery Routes (from Remote Repo) */}
        <Route path="/" element={<Home />} />
        <Route path="/OTP" element={<OTP />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/recovery-email" element={<RecoveryPage />} />
        <Route path="/recovery-OTP" element={<RecoveryOTP />} />
        <Route path="/recovery-password" element={<RecoveryPassword />} />
        <Route path="/employee-signin" element={<EmployeeSignin />} />
        <Route path="/Unauthorized" element={<Unauthorized />} />

        {/* Admin Routes (from Remote Repo) */}
        <Route path="/add-employee" element={<AddEmployeeForm />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard/profile" element={<Dashboard />} />
          <Route path="/admin-user" element={<AdminDashboard />} />
        </Route>

        {/* Product Management Routes (from Remote Repo) */}
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/view-product" element={<ViewProduct />} />
        <Route path="/admin-product" element={<AdminView />} />
        <Route path="/dashboard" element={<OffcutDashboard />} />

        {/* Default QA Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Offcut Specials Placeholder */}
        <Route path="/" element={<h1>Offcut Specials</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
