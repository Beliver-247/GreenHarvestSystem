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
import FarmerRequest from './pages/farmerRequest.js';
import FarmerRequestDB from './pages/farmerRequestDB.js';
import CustomerRequest from './pages/customerRequest.js';
import CustomerRequestDB from './pages/customerRequestDB.js';
import AddStaff from './components/AddStaff';
import AddStock from './components/AddStock';
import AllStaff from './components/AllStaff';
import AllStock from './components/AllStock';
import WarehouseStaffLayout from './components/WarehouseStaffLayout';
import WarehouseManagerLayout from './components/WarehouseManagerLayout';
import InventoryDashboard from './components/InventoryDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import DeliveryHistory from './components/DeliveryHistory';
import UpdateStaff from './components/UpdateStaff';
import UpdateStocks from './components/UpdateStocks';

// Dilakshan
import StoreContextProvider from './context/StoreContext.js';
import UserHome from "./pages/home/Home.js";
import Product from "./pages/product/Product.js";
import Cart from "./components/CartItems/CartItem.js";
import OrderForm from './components/Order/OrderForm';
import PaymentPage from './components/Payment/PaymentPage.js';
import OrderConfirmation from './components/OrderConfirmation/OrderConfirmation.js';
import MyOrders from './components/MyOrders/MyOrders.js';
import OrderDetails from './components/OrderDetails/OrderDetails.js';
import EditOrder from './components/EditOrder/EditOrder.js';

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
    <StoreContextProvider>
      <Router>
        <Header />
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
              <Route path="/" element={<UserHome />} />
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

              {/* Other Routes */}
              <Route path="/farmerRequest" element={<FarmerRequest />} />
              <Route path="/farmerRequestDB" element={<FarmerRequestDB />} />
              <Route path="/customerRequest" element={<CustomerRequest />} />
              <Route path="/customerRequestDB" element={<CustomerRequestDB />} />

              {/* User and Order Routes */}
              <Route path="/home" element={<UserHome />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/order-details/:orderId" element={<OrderDetails />} />
              <Route path="/confirmation" element={<OrderConfirmation />} />
              <Route path="/order/:id" element={<OrderForm />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/edit-order/:orderId" element={<EditOrder />} />

              {/*Staff layout*/}
              <Route path="/wh-staff" element={<WarehouseStaffLayout/>}>
                <Route path="/wh-staff/inventory-dashboard" element={<InventoryDashboard/>} />
                <Route path="/wh-staff/add-stocks" element={<AddStock/>}/>
                <Route path="/wh-staff/all-stocks" element={<AllStock/>}/>
                <Route path="/wh-staff/update-stocks" element={<UpdateStocks/>}/>
              </Route>

              {/*Manager layout*/}
              <Route path="/wh-manager" element={<WarehouseManagerLayout/>}>
                <Route path="/wh-manager/manager-dashboard" element={<ManagerDashboard/>} />
                <Route path="/wh-manager/add-staff" element={<AddStaff/>}/>
                <Route path="/wh-manager/all-staff" element={<AllStaff/>}/>
                <Route path="/wh-manager/all-stocks" element={<AllStock/>}/>
                <Route path="/wh-manager/delivery-history" element={<DeliveryHistory/>}/>
                <Route path="/wh-manager/update-staff/:id" element={<UpdateStaff/>}/>
              </Route>
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
    </StoreContextProvider>
  );
}

export default App;
