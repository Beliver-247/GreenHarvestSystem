import React, { useEffect, useState } from "react";

const QATeam = () => {
  const [qaTeam, setQATeam] = useState([]);
  const [editingMember, setEditingMember] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchQATeam = async () => {
      try {
        const response = await fetch("http://localhost:3001/QATeam");
        if (response.ok) {
          const data = await response.json();
          setQATeam(data);
        } else {
          console.error("Failed to fetch QA team members");
        }
      } catch (err) {
        console.error("Error: " + err);
      }
    };

    fetchQATeam();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/QATeam/delete/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setQATeam(qaTeam.filter(member => member._id !== id));
        alert("Member deleted successfully");
      } else {
        alert("Error deleting member");
      }
    } catch (err) {
      console.error("Error: " + err);
      alert("Error deleting member");
    }
  };

  const handleEdit = (member) => {
    setEditingMember({
      ...member,
      contactInfo: member.contactInfo || { email: '', phone: '' },
      address: member.address || { street: '', city: '' },
    });
  };

  const handleUpdate = async () => {
    if (!editingMember) return;

    try {
      const payload = {
        ...editingMember,
        birthDay: new Date(editingMember.birthDay).toISOString()
      };

      if (editingMember.password) {
        payload.password = editingMember.password;
      }

      const response = await fetch(`http://localhost:3001/QATeam/update/${editingMember._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const updatedMember = await response.json();
        setQATeam(qaTeam.map(member =>
          member._id === updatedMember.updatedMember._id ? updatedMember.updatedMember : member
        ));
        setEditingMember(null);
        alert("Member updated successfully");
      } else {
        const errorData = await response.json();
        alert(`Error updating member: ${errorData.message || 'Unknown error'}`);

        if (errorData.details && errorData.details.password) {
          alert(`Password Error: ${errorData.details.password.message}`);
        }
      }
    } catch (err) {
      console.error("Network or server error:", err);
      alert("An error occurred while updating the member. Please try again.");
    }
  };

  const filteredQATeam = qaTeam.filter(member => {
    const searchLower = searchQuery.toLowerCase();
    return (
      member.name.toLowerCase().includes(searchLower) ||
      member.NIC.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="qa-records w-4/5 mx-auto p-5">
      <h2 className="text-center mb-5 text-gray-800 text-2xl font-bold">QA Team Members</h2>

      <input
        type="text"
        placeholder="Search by Name or NIC"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-1/2 p-2 mb-5 border border-gray-300 rounded"
      />

<table className="w-full border-collapse fade-in"> {/* Add fade-in class here */}
      <thead>
        <tr>
          <th className="border border-gray-300 p-2 bg-gray-200">Name</th>
          <th className="border border-gray-300 p-2 bg-gray-200">NIC</th>
          <th className="border border-gray-300 p-2 bg-gray-200">Email</th>
          <th className="border border-gray-300 p-2 bg-gray-200">Phone</th>
          <th className="border border-gray-300 p-2 bg-gray-200">Birth Date</th>
          <th className="border border-gray-300 p-2 bg-gray-200">Address</th>
          <th className="border border-gray-300 p-2 bg-gray-200">Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredQATeam.map((member) => (
          <tr
            key={member._id}
            className="hover:bg-green-100 cursor-pointer transition duration-200 ease-in-out transform hover:scale-105"
          >
            <td className="border border-gray-300 p-2">{member.name}</td>
            <td className="border border-gray-300 p-2">{member.NIC}</td>
            <td className="border border-gray-300 p-2">{member.contactInfo.email}</td>
            <td className="border border-gray-300 p-2">{member.contactInfo.phone}</td>
            <td className="border border-gray-300 p-2">{new Date(member.birthDay).toLocaleDateString()}</td>
            <td className="border border-gray-300 p-2">
              {member.address ? `${member.address.street}, ${member.address.city}` : "N/A"}
            </td>
            <td className="border border-gray-300 p-2">
              <button className="w-24 bg-green-500 hover:bg-green-600 text-white py-1 rounded mb-2" onClick={() => handleEdit(member)}>Update</button>
              <button className="w-24 bg-red-500 hover:bg-red-600 text-white py-1 rounded" onClick={() => handleDelete(member._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

      {editingMember && (
        <div className="edit-modal fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded shadow-lg p-4 w-80 z-50">
          <h3 className="text-center mb-2 text-gray-800">Edit QA Member</h3>
          <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
            {/* Form fields for editing */}
            <div className="form-group mb-2">
              <label className="block mb-1 font-bold text-gray-700">Name:</label>
              <input
                type="text"
                value={editingMember.name}
                onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="form-group mb-2">
              <label className="block mb-1 font-bold text-gray-700">Name:</label>
              <input
                type="text"
                value={editingMember.name}
                onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="form-group mb-2">
              <label className="block mb-1 font-bold text-gray-700">NIC:</label>
              <input
                type="text"
                value={editingMember.NIC}
                onChange={(e) => setEditingMember({ ...editingMember, NIC: e.target.value })}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="form-group mb-2">
              <label className="block mb-1 font-bold text-gray-700">Email:</label>
              <input
                type="email"
                value={editingMember.contactInfo.email}
                onChange={(e) => setEditingMember({ ...editingMember, contactInfo: { ...editingMember.contactInfo, email: e.target.value } })}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="form-group mb-2">
              <label className="block mb-1 font-bold text-gray-700">Phone:</label>
              <input
                type="text"
                value={editingMember.contactInfo.phone}
                onChange={(e) => setEditingMember({ ...editingMember, contactInfo: { ...editingMember.contactInfo, phone: e.target.value } })}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="form-group mb-2">
              <label className="block mb-1 font-bold text-gray-700">Birth Date:</label>
              <input
                type="date"
                value={new Date(editingMember.birthDay).toISOString().substr(0, 10)}
                onChange={(e) => setEditingMember({ ...editingMember, birthDay: e.target.value })}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="form-group mb-2">
              <label className="block mb-1 font-bold text-gray-700">Street:</label>
              <input
                type="text"
                value={editingMember.address?.street || ''}
                onChange={(e) => setEditingMember({ ...editingMember, address: { ...editingMember.address, street: e.target.value } })}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="form-group mb-2">
              <label className="block mb-1 font-bold text-gray-700">City:</label>
              <input
                type="text"
                value={editingMember.address?.city || ''}
                onChange={(e) => setEditingMember({ ...editingMember, address: { ...editingMember.address, city: e.target.value } })}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded mb-2" type="submit">Update</button>
            <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded" type="button" onClick={() => setEditingMember(null)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default QATeam;
