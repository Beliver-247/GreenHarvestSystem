import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DriverProfile = () => {
  const [driver, setDriver] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        const response = await axios.get('/driver/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDriver(response.data); // Assuming the response contains driver's details
      } catch (error) {
        // Handle error
        console.error('Error fetching driver details', error);
      }
    };

    fetchDriverDetails();
  }, [token]);

  if (!driver) return <div>Loading...</div>;

  return (
    <div>
      <h1>{driver.name}'s Profile</h1>
      <p>Email: {driver.email}</p>
      <p>Phone: {driver.phone}</p>
      {/* Display other driver details as needed */}
    </div>
  );
};

export default DriverProfile;
