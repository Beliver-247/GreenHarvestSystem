import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateStaff() {
  const [staffMember, setStaffMember] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    nic: '',
    email: '',
    address: '',
    district: '',
    contactNumber: '',
    dob: '',
    role: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    // Fetch the staff member's current data
    axios.get(`http://localhost:3001/staff/get-staff/${id}`)
      .then((res) => {
        setStaffMember(res.data.staff);
      })
      .catch((err) => {
        console.error(err);
        console.log(err);
        alert("An error occurred while fetching staff details.");
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStaffMember({
      ...staffMember,
      [name]: value,
    });
  };

  const validateInputs = () => {
    // Add your validation logic here, for example:
    if (!staffMember.firstName || !staffMember.lastName || !staffMember.nic || !staffMember.email || !staffMember.address || !staffMember.district || !staffMember.contactNumber || !staffMember.dob || !staffMember.role) {
      setError("All fields are required.");
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateInputs()) {
      // Send updated data to the server
      axios.put(`http://localhost:3001/staff/update-staff/${id}`, staffMember)
        .then((res) => {
          alert("Staff member updated successfully.");
          navigate('/all-staff'); // Redirect to the staff list
        })
        .catch((err) => {
          console.error(err);
          alert("An error occurred while updating the staff member.");
        });
    }
  };

  return (
    <div className="p-6">
      <h1 className='text-4xl font-bold text-center mb-6'>Update Staff Member</h1>
      <form onSubmit={handleSubmit} className='max-w-lg mx-auto'>
        {error && <p className="text-red-500">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700">First Name</label>
          <input type="text" name="firstName" value={staffMember.firstName} onChange={handleChange} className="border p-2 w-full" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Last Name</label>
          <input type="text" name="lastName" value={staffMember.lastName} onChange={handleChange} className="border p-2 w-full" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Gender</label>
          <select name="gender" value={staffMember.gender} onChange={handleChange} className="border p-2 w-full">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">NIC</label>
          <input type="text" name="nic" value={staffMember.nic} onChange={handleChange} className="border p-2 w-full" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input type="email" name="email" value={staffMember.email} onChange={handleChange} className="border p-2 w-full" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Address</label>
          <input type="text" name="address" value={staffMember.address} onChange={handleChange} className="border p-2 w-full" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">District</label>
          <input type="text" name="district" value={staffMember.district} onChange={handleChange} className="border p-2 w-full" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Contact Number</label>
          <input type="text" name="contactNumber" value={staffMember.contactNumber} onChange={handleChange} className="border p-2 w-full" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Date of Birth</label>
          <input type="date" name="dob" value={staffMember.dob.substring(0, 10)} onChange={handleChange} className="border p-2 w-full" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Role</label>
          <select name="role" value={staffMember.role} onChange={handleChange} className="border p-2 w-full">
            <option value="">Select Role</option>
            <option value="WSS">Warehouse Storage Staff</option>
            <option value="WMS">Warehouse Maintenance Staff</option>
          </select>
        </div>
        <button type="submit" className="w-full h-12 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition duration-200 mt-10">Update Staff Member</button>
      </form>
    </div>
  );
}
