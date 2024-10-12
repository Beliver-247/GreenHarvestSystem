import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function AllStaff() {
  const [staffMembers, setStaffMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    function getStaff() {
      axios.get("http://localhost:3001/staff/all-staff")
        .then((res) => {
          setStaffMembers(res.data.staffMembers);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    getStaff();
  }, []);

  const deleteStaffMember = (id) => {
    axios.delete(`http://localhost:3001/staff/delete/${id}`)
      .then((res) => {
        alert("Staff deleted successfully!");
        setStaffMembers(staffMembers.filter((staff) => staff._id !== id));
      })
      .catch((err) => {
        console.log(err);
        alert("An error occurred while deleting the staff");
      });
  };

  // Filter logic based on search and gender
  const filteredStaffMembers = staffMembers.filter((staff) => {
    return (
      (staff.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.nic.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (genderFilter ? staff.gender === genderFilter : true)
    );
  });

  // Function to download filtered staff records as PDF
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Dynamically set the title based on filters
    let title = "Staff Records";

    if (genderFilter) {
      title += `-${genderFilter}`;
    }

    if (searchQuery) {
      title += ` (Search: ${searchQuery})`;
    }

    // Add the title to the PDF
    doc.text(title, 14, 16);;

    // Define table headers and data
    const tableColumn = ["Full Name", "Gender", "NIC", "Email", "Address", "Number", "Role"];
    const tableRows = [];

    // Populate the tableRows array with filtered staff data
    filteredStaffMembers.forEach((staff, index) => {
      const staffData = [
        `${staff.firstName} ${staff.lastName}`,
        staff.gender,
        staff.nic,
        staff.email,
        `${staff.address}, ${staff.district}`,
        staff.contactNumber,
        staff.role,
      ];
      tableRows.push(staffData);
    });

    // Add table to the PDF
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 22,
      theme: 'grid'
    });

    // Save the PDF
    doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="p-6">
      <h1 className='text-4xl font-bold text-center mb-6'>Warehouse Staff</h1>
      <div className='overflow-x-auto'>
        <hr className='my-4 border-t-2 border-gray-300' />
        {/* Search and Filter Inputs */}
      <div className='flex mb-4'>
        <input
          type="text"
          placeholder="Search by Full Name or NIC"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='border border-gray-300 rounded py-2 px-4 focus:outline-none focus:border-green-500 w-60'
        />
        <select
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
          className='border border-gray-300 rounded py-2 px-4 focus:outline-none focus:border-green-500 ml-2'
        >
          <option value="">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>
        {filteredStaffMembers.length > 0 ? (
          <>
          <table className='min-w-full bg-white shadow-md rounded mb-8'>
            <thead className='bg-gray-800 text-white'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>Index</th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>Full Name</th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>Gender</th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>NIC</th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>Email</th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>Address</th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>Number</th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>DOB</th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>Role</th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaffMembers.map((staff, index) => (
                <tr key={index} className='hover:bg-gray-100'>
                  <td className='px-6 py-4 border-b'>{index + 1}</td>
                  <td className='px-6 py-4 border-b'>{staff.firstName} {staff.lastName}</td>
                  <td className='px-6 py-4 border-b'>{staff.gender}</td>
                  <td className='px-6 py-4 border-b'>{staff.nic}</td>
                  <td className='px-6 py-4 border-b'>{staff.email}</td>
                  <td className='px-6 py-4 border-b'>{staff.address}, {staff.district}</td>
                  <td className='px-6 py-4 border-b'>{staff.contactNumber}</td>
                  <td className='px-6 py-4 border-b'>{new Date(staff.dob).toLocaleDateString()}</td>
                  <td className='px-6 py-4 border-b'>{staff.role}</td>
                  <td className='px-6 py-4 border-b'>
                    <div className='flex space-x-2'>
                      <Link to={`/wh-manager/update-staff/${staff._id}`}
                        className='bg-yellow-500 text-white py-1 px-3 rounded-sm hover:bg-yellow-600 transition duration-200'>
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteStaffMember(staff._id)}
                        className='bg-red-500 text-white py-1 px-3 rounded-sm hover:bg-red-600 transition duration-200'>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Button to Download PDF */}
          <div className="text-right mb-4">
          <button
            onClick={downloadPDF}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
          >
            Download PDF
          </button>
        </div>
      </>
    ) : (
      <p className="text-center text-gray-500 mt-6">No staff members found.</p>
    )}
  </div>
</div>
);
}
