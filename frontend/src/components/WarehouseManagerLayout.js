import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const WarehouseManagerLayout = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 h-screen bg-green-900 text-white fixed top-0 left-0 mt-10">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Inventory Control</h2>
          <ul className="space-y-4">
            <li>
              <Link to="/wh-manager/manager-dashboard" className="block py-2 px-4 hover:bg-green-600 focus:bg-green-600 rounded">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/wh-manager/add-staff" className="block py-2 px-4 hover:bg-green-600 focus:bg-green-600 rounded">
                Register Staff
              </Link>
            </li>
            <li>
              <Link to="/wh-manager/all-staff" className="block py-2 px-4 hover:bg-green-600 focus:bg-green-600 rounded">
                Staff Management
              </Link>
            </li>
            <li>
              <Link to="/wh-manager/delivery-history" className="block py-2 px-4 hover:bg-green-600 focus:bg-green-600 rounded">
                Delivery History
              </Link>
            </li>
            <li>
              <Link to="/wh-manager/all-stocks" className="block py-2 px-4 hover:bg-green-600 focus:bg-green-600 rounded">
                View Inventory
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow ml-64 p-6 bg-gray-100 h-screen overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default WarehouseManagerLayout;
