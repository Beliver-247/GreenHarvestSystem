import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MaintenanceManagement = () => {
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    registerNo: '',
    currentMileage: '',
    nextServiceMileage: '',
    serviceDate: '',
    totalCost: ''
  });
  const [editingRecordId, setEditingRecordId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formError, setFormError] = useState(''); // For real-time validation errors

  useEffect(() => {
    axios.get('http://localhost:3001/maintain/')
      .then(response => {
        setMaintenanceRecords(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the maintenance data!', error);
      });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:3001/vehicle/')
      .then(response => {
        setVehicles(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the vehicle data!', error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Real-time validation for Next Service Mileage
    if (name === 'nextServiceMileage') {
      if (parseInt(value) <= parseInt(formData.currentMileage)) {
        setFormError('Next Service Mileage must be greater than Current Mileage');
      } else {
        setFormError('');
      }
    }

    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formError) {
      return; // Prevent form submission if there's an error
    }
    if (editingRecordId) {
      axios.put(`http://localhost:3001/maintain/update/${editingRecordId}`, formData)
        .then(response => {
          setMaintenanceRecords(prevRecords => prevRecords.map(record =>
            record._id === editingRecordId ? response.data.maintain : record
          ));
          setEditingRecordId(null);
          setShowForm(false);
        })
        .catch(error => {
          console.error('There was an error updating the maintenance record!', error);
        });
    } else {
      axios.post('http://localhost:3001/maintain/add', formData)
        .then(response => {
          setMaintenanceRecords(prevRecords => [...prevRecords, response.data]);
          setShowForm(false);
        })
        .catch(error => {
          console.error('There was an error adding the maintenance record!', error);
        });
    }
  };

  const handleDelete = (recordId) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      axios.delete(`http://localhost:3001/maintain/delete/${recordId}`)
        .then(response => {
          setMaintenanceRecords(prevRecords => prevRecords.filter(record => record._id !== recordId));
        })
        .catch(error => {
          console.error('There was an error deleting the maintenance record!', error);
        });
    }
  };

  const handleEdit = (record) => {
    setFormData({
      registerNo: record.registerNo,
      currentMileage: record.currentMileage,
      nextServiceMileage: record.nextServiceMileage,
      serviceDate: record.serviceDate,
      totalCost: record.totalCost
    });
    setEditingRecordId(record._id);
    setShowForm(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const MaxServiceDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredRecords = maintenanceRecords.filter(record =>
    record.registerNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full mx-auto p-4 sm:p-6 lg:p-8 bg-white shadow-md rounded-lg overflow-auto">
      <h2 className="text-2xl font-bold mb-4">Maintenance Management</h2>
      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-200"
      >
        {showForm ? (editingRecordId ? 'Cancel Edit' : 'Cancel') : (editingRecordId ? 'Edit Record' : 'Add Maintenance Record')}
      </button>

      <input
        type="text"
        placeholder="Search by vehicle registration number"
        value={searchQuery}
        onChange={handleSearchChange}
        className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            Registration No:
            <select
              name="registerNo"
              value={formData.registerNo}
              onChange={handleInputChange}
              required
              className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            >
              <option value="">Select a vehicle</option>
              {vehicles.map(vehicle => (
                <option key={vehicle.registrationNo} value={vehicle.registrationNo}>
                  {vehicle.registrationNo}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            Current Mileage:
            <input
              type="number"
              name="currentMileage"
              value={formData.currentMileage}
              onChange={handleInputChange}
              required
              className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </label>
          <label className="block">
            Next Service Mileage:
            <input
              type="number"
              name="nextServiceMileage"
              value={formData.nextServiceMileage}
              onChange={handleInputChange}
              required
              className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
            {formError && <p className="text-red-500">{formError}</p>} {/* Display error message */}
          </label>
          <label className="block">
            Service Date:
            <input
              type="date"
              name="serviceDate"
              value={formData.serviceDate}
              onChange={handleInputChange}
              required
              max={MaxServiceDate()}
              className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </label>
          <label className="block">
            Total Cost:
            <input
              type="number"
              name="totalCost"
              value={formData.totalCost}
              onChange={handleInputChange}
              required
              className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </label>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-200"
            disabled={!!formError} // Disable button if there's an error
          >
            {editingRecordId ? 'Update Record' : 'Add Record'}
          </button>
        </form>
      )}

      <table className="w-full table-auto border-collapse mb-6">
        <thead className="bg-gray-200">
          <tr className="border-b border-gray-300">
            <th className="px-4 py-2 border">Registration No</th>
            <th className="px-4 py-2 border">Current Mileage</th>
            <th className="px-4 py-2 border">Next Service Mileage</th>
            <th className="px-4 py-2 border">Service Date</th>
            <th className="px-4 py-2 border">Total Cost</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.length > 0 ? (
            filteredRecords.map(record => (
              <tr key={record._id}>
                <td className="px-4 py-2 border">{record.registerNo}</td>
                <td className="px-4 py-2 border">{record.currentMileage}</td>
                <td className="px-4 py-2 border">{record.nextServiceMileage}</td>
                <td className="px-4 py-2 border">{formatDate(record.serviceDate)}</td>
                <td className="px-4 py-2 border">{record.totalCost}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleEdit(record)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(record._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center p-4">No maintenance records found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MaintenanceManagement;
