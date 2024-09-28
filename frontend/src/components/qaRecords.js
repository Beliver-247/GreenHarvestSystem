import React, { useEffect, useState } from "react";
import ConfirmModal from "./modals/ConfirmModal";
import "../styles/qaRecords.css";
import SuccessModal from "./modals/SuccessModal";

const QARecords = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);
  const [updatedRecord, setUpdatedRecord] = useState({
    vegetableType: "",
    gradeAWeight: "",
    gradeBWeight: "",
    gradeCWeight: "",
  });
  const [vegetableFilter, setVegetableFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState(""); // New state for date filter
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch("http://localhost:8070/QArecord");
        if (response.ok) {
          const data = await response.json();
          setRecords(data);
          setFilteredRecords(data);
        } else {
          console.error("Failed to fetch records:", response.statusText);
        }
      } catch (err) {
        console.error("Error fetching records:", err);
      }
    };

    fetchRecords();
  }, []);

  useEffect(() => {
    let filtered = records;

    if (vegetableFilter !== "All") {
      filtered = filtered.filter(
        (record) => record.vegetableType === vegetableFilter
      );
    }

    if (dateFilter) {
      filtered = filtered.filter((record) => {
        const recordDate = new Date(record.dateCreated).toLocaleDateString();
        const selectedDate = new Date(dateFilter).toLocaleDateString();
        return recordDate === selectedDate;
      });
    }

    setFilteredRecords(filtered);
  }, [vegetableFilter, dateFilter, records]);

  const handleEdit = (record) => {
    setEditingRecord(record);
    setUpdatedRecord(record);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:8070/QArecord/update/${editingRecord._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedRecord),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setRecords(records.map((rec) => (rec._id === data._id ? data : rec)));
        setEditingRecord(null);
        setUpdateSuccess(true);
        setShowSuccessModal(true);
      } else {
        alert("Error updating record");
      }
    } catch (err) {
      console.error("Error updating record:", err);
      alert("Error updating record");
    }
  };

  const handleDelete = (id) => {
    setRecordToDelete(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:8070/QArecord/delete/${recordToDelete}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setRecords(records.filter((record) => record._id !== recordToDelete));
        setShowSuccessModal(true);
      } else {
        alert("Error deleting record");
      }
    } catch (err) {
      console.error("Error deleting record:", err);
      alert("Error deleting record");
    } finally {
      setShowConfirmModal(false);
      setRecordToDelete(null);
    }
  };

  const vegetableTypes = [
    ...new Set(records.map((record) => record.vegetableType)),
  ];

  return (
    <div className="qa-records">
      <h2>QA Records</h2>
      <div className="filter-container">
        <label htmlFor="vegetableFilter">Filter by Vegetable:</label>
        <select
          id="vegetableFilter"
          value={vegetableFilter}
          onChange={(e) => setVegetableFilter(e.target.value)}
        >
          <option value="All">All</option>
          {vegetableTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {/* New date filter input */}
        <label htmlFor="dateFilter">Filter by Date:</label>
        <input className="date-filter-container"
          type="date"
          id="dateFilter"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Vegetable Type</th>
            <th>Grade A Weight</th>
            <th>Grade B Weight</th>
            <th>Grade C Weight</th>
            <th>Date Created</th>
            <th>Time Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.map((record) => {
            const createdAt = new Date(record.dateCreated);
            const date = createdAt.toLocaleDateString();
            const time = createdAt.toLocaleTimeString();

            return (
              <tr key={record._id}>
                <td>{record.vegetableType}</td>
                <td>{record.gradeAWeight}</td>
                <td>{record.gradeBWeight}</td>
                <td>{record.gradeCWeight}</td>
                <td>{date}</td>
                <td>{time}</td>
                <td>
                  <button className="upButton" onClick={() => handleEdit(record)}>
                    Update
                  </button>
                  <button
                    className="delButton"
                    onClick={() => handleDelete(record._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {editingRecord && (
        <>
          <div className="modal-overlay" />
          <div className="edit-modal">
            <h3>Edit Record</h3>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Vegetable Type:</label>
                <input
                  type="text"
                  value={updatedRecord.vegetableType}
                  onChange={(e) =>
                    setUpdatedRecord({
                      ...updatedRecord,
                      vegetableType: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Grade A Weight:</label>
                <input
                  type="number"
                  value={updatedRecord.gradeAWeight}
                  onChange={(e) =>
                    setUpdatedRecord({
                      ...updatedRecord,
                      gradeAWeight: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Grade B Weight:</label>
                <input
                  type="number"
                  value={updatedRecord.gradeBWeight}
                  onChange={(e) =>
                    setUpdatedRecord({
                      ...updatedRecord,
                      gradeBWeight: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Grade C Weight:</label>
                <input
                  type="number"
                  value={updatedRecord.gradeCWeight}
                  onChange={(e) =>
                    setUpdatedRecord({
                      ...updatedRecord,
                      gradeCWeight: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <button type="submit">Update</button>
              <button type="button" onClick={() => setEditingRecord(null)}>
                Cancel
              </button>
            </form>
          </div>
        </>
      )}

      {showSuccessModal && (
        <SuccessModal
          message={updateSuccess ? "Record updated successfully" : "Record deleted successfully"}
          onClose={() => {
            setShowSuccessModal(false);
            setUpdateSuccess(false);
          }}
          show={showSuccessModal}
        />
      )}

      {showConfirmModal && (
        <ConfirmModal
          message="Are you sure you want to delete this record?"
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirmModal(false)}
          show={showConfirmModal}
        />
      )}
    </div>
  );
};

export default QARecords;
