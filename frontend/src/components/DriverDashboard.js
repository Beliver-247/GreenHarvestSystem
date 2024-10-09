import React from 'react';
import { Link } from 'react-router-dom';

const DriverDashboard = () => {
  const driverName = localStorage.getItem('driverName'); // Retrieve the driver's name

  return (
    <div>
      <h1>Welcome, {driverName}!</h1>
      {/* Other content of the driver page */}
      <Link to="/driver/profile">View Profile</Link> {/* Link to the profile page */}
    </div>
  );
};

export default DriverDashboard;