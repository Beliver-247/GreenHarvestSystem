
import './App.css';
import FarmerRequest from './farmerRequests/farmerRequest.js';
import FarmerRequestDB from './farmerRequests/farmerRequestDB.js';
import CustomerRequest from './customerRequests/customerRequest.js';
import CustomerRequestDB from './customerRequests/customerRequestDB.js'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/farmerRequest' element={<FarmerRequest />} />
        <Route path='/farmerRequestDB' element={<FarmerRequestDB />} />
        <Route path='/customerRequest' element={<CustomerRequest />} />
        <Route path='/customerRequestDB' element={<CustomerRequestDB />} />
      </Routes>
    </Router>
  );
}

export default App;
