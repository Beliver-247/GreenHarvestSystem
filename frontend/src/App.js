import './App.css';
import SideNav from './components/SideNav';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LayoutVFManager from './components/LayoutVFManager';
import LayoutDriver from './components/LayoutDriver';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="vehicle-fleet" element={<LayoutVFManager />}> //vehicle fleet manager paths
          <Route index element={<VFDashboard />} />
          <Route path="vehicle-management" element={<VehicleManagement />} />
          <Route path="driver-management" element={<DriverManagement />} />
          <Route path="fuel-management" element={<FuelManagement />} />
          <Route path="maintenance-management" element={<MaintenanceManagement />} />
          <Route path="cost-management" element={<ExpensesCalculator />} /> 
        </Route>
  
        <Route path="driver" element={<LayoutDriver />}>  //driver paths
          <Route path="driver-page" element={<DriverPage />} />
        </Route>
          
  
        </Routes>
      </Router>
  );
}

export default App;
