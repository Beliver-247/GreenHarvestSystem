import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DriverPage = () => {
  const [formData, setFormData] = useState({
    driverNic: '',
    registerNo: '',
    mileage: '',
    liters: '',
    cost: ''
  });

  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [errors, setErrors] = useState({
    driverNicError: '',
    registerNoError: '',
    mileageError: '',
    litersError: '',
    costError: ''
  });

  const [message, setMessage] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const driversResponse = await axios.get('http://localhost:3001/driver');
        const vehiclesResponse = await axios.get('http://localhost:3001/vehicle');
        
        setDrivers(driversResponse.data);
        setVehicles(vehiclesResponse.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const validateDriverNIC = (nic) => {
    return drivers.some(driver => driver.nic === nic);
  };

  const validateVehicleRegistration = (registrationNo) => {
    return vehicles.some(vehicle => vehicle.registrationNo === registrationNo);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    // Real-time validation
    if (name === 'driverNic') {
      setErrors(prev => ({
        ...prev,
        driverNicError: validateDriverNIC(value) ? '' : 'Driver NIC not found'
      }));
    }

    if (name === 'registerNo') {
      setErrors(prev => ({
        ...prev,
        registerNoError: validateVehicleRegistration(value) ? '' : 'Vehicle registration number not found'
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!errors.driverNicError && !errors.registerNoError) {
      try {
        const response = await axios.post('http://localhost:3001/fuelpurchase/add', formData);
        setMessage(response.data);
        setFormData({
          driverNic: '',
          registerNo: '',
          mileage: '',
          liters: '',
          cost: ''
        });
      } catch (err) {
        console.error(err);
        setMessage('Error adding fuel purchase record.');
      }
    } else {
      setMessage('Please check before submitting.');
    }
  };

  return (
    <div className="w-full mx-auto p-4 sm:p-6 lg:p-8 bg-white shadow-md rounded-lg overflow-auto">
      <h2 className="text-2xl font-bold mb-4">Add Fuel Purchase Record</h2>
      <button 
        onClick={() => setIsFormVisible(!isFormVisible)} 
        className="mb-4 p-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-200"
      >
        Toggle Form
      </button>

      {isFormVisible && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="flex flex-col">
              Driver NIC:
              <input
                type="text"
                name="driverNic"
                value={formData.driverNic}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.driverNicError && <p className="error text-red-500">{errors.driverNicError}</p>}
            </label>
          </div>
          <div>
            <label className="flex flex-col">
              Vehicle Registration Number:
              <input
                type="text"
                name="registerNo"
                value={formData.registerNo}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.registerNoError && <p className="error text-red-500">{errors.registerNoError}</p>}
            </label>
          </div>
          <div>
            <label className="flex flex-col">
              Mileage:
              <input
                type="number"
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>
          <div>
            <label className="flex flex-col">
              Liters:
              <input
                type="number"
                name="liters"
                value={formData.liters}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>
          <div>
            <label className="flex flex-col">
              Cost:
              <input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>
          <button 
            type="submit" 
            className="w-full p-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-200"
          >
            Submit
          </button>
        </form>
      )}

      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
};

export default DriverPage;
