import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
import Dashboard from "./pages/Dashboard.js";
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

function App() {
  return (
    <Router>
       <Header />
      <Routes>
        <Route path="/vehicle-fleet" element={<LayoutVFManager />}>
          <Route index element={<VFDashboard />} />
          <Route path="vehicle-management" element={<VehicleManagement />} />
          <Route path="driver-management" element={<DriverManagement />} />
          <Route path="fuel-management" element={<FuelManagement />} />
          <Route
            path="maintenance-management"
            element={<MaintenanceManagement />}
          />
          <Route path="cost-management" element={<ExpensesCalculator />} />
        </Route>

        <Route path="driver" element={<LayoutDriver />}>
          <Route path="driver-page" element={<DriverPage />} />
        </Route>
        <Route path="/" element={<Home />}></Route>
        <Route path="/OTP" element={<OTP />}></Route>
        <Route path="/sign-up" element={<Signup />}></Route>
        <Route path="/sign-in" element={<SignIn />}></Route>
        <Route path="/recovery-email" element={<RecoveryPage />}></Route>
        <Route path="/recovery-OTP" element={<RecoveryOTP />}></Route>
        <Route path="/employee-signin" element={<EmployeeSignin />}></Route>
        <Route path="/recovery-password" element={<RecoveryPassword />}></Route>
        <Route path="/Unauthorized" element={<Unauthorized />}></Route>
        <Route path="/add-employee" element={<AddEmployeeForm />}></Route>
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard/profile" element={<Dashboard />} />
          <Route path="/admin-user" element={<AdminDashboard />}></Route>
        </Route>
        <Route path="/" element={<h1>Offcut Specials</h1>} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/view-product" element={<ViewProduct />} />
        <Route path="/admin-product" element={<AdminView />} />
        <Route path="/dashboard" element={<OffcutDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
