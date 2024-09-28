import React, { useEffect, useState } from "react";
import "../styles/QATeam.css"; 

const QATeam = () => {
  const [qaTeam, setQATeam] = useState([]);
  const [editingMember, setEditingMember] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  useEffect(() => {
    // Fetch QA team members from the server
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
    // Ensure member's contactInfo and address are not null
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
        birthDay: new Date(editingMember.birthDay).toISOString() // Ensure date format is correct
      };
  
      // Include password if the user has entered one
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
  

  // Filter QA team members based on search query
  const filteredQATeam = qaTeam.filter(member => {
    const searchLower = searchQuery.toLowerCase();
    return (
      member.name.toLowerCase().includes(searchLower) ||
      member.NIC.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="qa-records">
      <h2>QA Team Members</h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by Name or NIC"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>NIC</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Birth Date</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredQATeam.map((member) => (
            <tr key={member._id}>
              <td>{member.name}</td>
              <td>{member.NIC}</td>
              <td>{member.contactInfo.email}</td>
              <td>{member.contactInfo.phone}</td>
              <td>{new Date(member.birthDay).toLocaleDateString()}</td>
              <td>
                {member.address ? (
                  `${member.address.street}, ${member.address.city}`
                ) : (
                  "N/A"
                )}
              </td>
              <td>
                <button className="upButton" onClick={() => handleEdit(member)}>Update</button>
                <button className="delButton" onClick={() => handleDelete(member._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingMember && (
  <div className="edit-modal">
    <h3>Edit QA Member</h3>
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleUpdate();
      }}
    >
      <div className="form-group">
        <label>Name:</label>
        <input
          type="text"
          value={editingMember.name}
          onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <label>NIC:</label>
        <input
          type="text"
          value={editingMember.NIC}
          onChange={(e) => setEditingMember({ ...editingMember, NIC: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          value={editingMember.contactInfo.email}
          onChange={(e) => setEditingMember({ ...editingMember, contactInfo: { ...editingMember.contactInfo, email: e.target.value } })}
          required
        />
      </div>
      <div className="form-group">
        <label>Phone:</label>
        <input
          type="text"
          value={editingMember.contactInfo.phone}
          onChange={(e) => setEditingMember({ ...editingMember, contactInfo: { ...editingMember.contactInfo, phone: e.target.value } })}
          required
        />
      </div>
      <div className="form-group">
        <label>Birth Date:</label>
        <input
          type="date"
          value={new Date(editingMember.birthDay).toISOString().substr(0, 10)}
          onChange={(e) => setEditingMember({ ...editingMember, birthDay: e.target.value })}
          required
        />
      </div>
      

      {/* Address Fields */}
      <div className="form-group">
        <label>Street:</label>
        <input
          type="text"
          value={editingMember.address?.street || ''}
          onChange={(e) => setEditingMember({ ...editingMember, address: { ...editingMember.address, street: e.target.value } })}
          required
        />
      </div>
      <div className="form-group">
        <label>City:</label>
        <input
          type="text"
          value={editingMember.address?.city || ''}
          onChange={(e) => setEditingMember({ ...editingMember, address: { ...editingMember.address, city: e.target.value } })}
          required
        />
      </div>

      <button className="upButton" type="submit">Update</button>
      <button className="delButton" type="button" onClick={() => setEditingMember(null)}>Cancel</button>
    </form>
  </div>
)}
    </div>
  );
};

export default QATeam;
