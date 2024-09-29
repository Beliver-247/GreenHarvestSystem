import React, { useEffect, useState } from "react";
import ConfirmModal from "./modals/ConfirmModal";
import SuccessModal from "./modals/SuccessModal";
import jsPDF from "jspdf";
import "jspdf-autotable";

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
  const [dateFilter, setDateFilter] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch("http://localhost:3001/QArecord");
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

  const fetchRecords = async () => {
    try {
      const response = await fetch("http://localhost:3001/QArecord");
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
  
  // useEffect to initially fetch records when the component mounts
  useEffect(() => {
    fetchRecords();
  }, []);
  

  const handleUpdate = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(
        `http://localhost:3001/QArecord/update/${editingRecord._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedRecord),
        }
      );
  
      if (response.ok) {
        // Fetch the updated list of records to refresh the page
        await fetchRecords(); // Re-fetch the records
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
        `http://localhost:3001/QArecord/delete/${recordToDelete}`,
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

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("QA Records", 20, 10);

    const headers = [
      "Vegetable Type",
      "Grade A Weight",
      "Grade B Weight",
      "Grade C Weight",
      "Date Created",
      "Time Created",
    ];

    const rows = filteredRecords.map((record) => {
      const createdAt = new Date(record.dateCreated);
      const date = createdAt.toLocaleDateString();
      const time = createdAt.toLocaleTimeString();
      return [
        record.vegetableType,
        record.gradeAWeight,
        record.gradeBWeight,
        record.gradeCWeight,
        date,
        time,
      ];
    });

    doc.autoTable({
      head: [headers],
      body: rows,
      startY: 20,
    });

    doc.save("QA_Records.pdf");
  };

  const vegetableTypes = [
    ...new Set(records.map((record) => record.vegetableType)),
  ];

  return (
    <div className="qa-records w-4/5 mx-auto mt-8 p-6 animate-fadeIn">
      <h2 className="text-center mb-5 text-2xl font-bold text-gray-800">
        QA Records
      </h2>
      <div className="flex justify-center items-center mb-5 gap-6 flex-wrap">
        <label htmlFor="vegetableFilter" className="text-lg">
          Filter by Vegetable:
        </label>
        <select
          id="vegetableFilter"
          value={vegetableFilter}
          onChange={(e) => setVegetableFilter(e.target.value)}
          className="p-2 text-lg border border-gray-300 rounded-md"
        >
          <option value="All">All</option>
          {vegetableTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <label htmlFor="dateFilter" className="text-lg">
          Filter by Date:
        </label>
        <input
          type="date"
          id="dateFilter"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="p-2 text-lg border border-gray-300 rounded-md"
        />
      </div>

      <button
        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95 mx-auto block"
        onClick={generatePDF}
      >
        Download Report
      </button>

      <table className="w-full max-w-5xl mx-auto mt-5 border-collapse border border-gray-300">
  <thead>
    <tr>
      <th className="p-4 bg-gray-100 font-bold text-left border border-gray-300">Vegetable Type</th>
      <th className="p-4 bg-gray-100 font-bold text-left border border-gray-300">Grade A Weight</th>
      <th className="p-4 bg-gray-100 font-bold text-left border border-gray-300">Grade B Weight</th>
      <th className="p-4 bg-gray-100 font-bold text-left border border-gray-300">Grade C Weight</th>
      <th className="p-4 bg-gray-100 font-bold text-left border border-gray-300">Date Created</th>
      <th className="p-4 bg-gray-100 font-bold text-left border border-gray-300">Time Created</th>
      <th className="p-4 bg-gray-100 font-bold text-left border border-gray-300">Actions</th>
    </tr>
  </thead>
  <tbody>
    {filteredRecords.map((record) => {
      const createdAt = new Date(record.dateCreated);
      const date = createdAt.toLocaleDateString();
      const time = createdAt.toLocaleTimeString();

      return (
        <tr key={record._id} className="hover:bg-green-100 cursor-pointer transition duration-200 ease-in-out transform hover:scale-105">
          <td className="p-4 border border-gray-300">{record.vegetableType}</td>
          <td className="p-4 border border-gray-300">{record.gradeAWeight}</td>
          <td className="p-4 border border-gray-300">{record.gradeBWeight}</td>
          <td className="p-4 border border-gray-300">{record.gradeCWeight}</td>
          <td className="p-4 border border-gray-300">{date}</td>
          <td className="p-4 border border-gray-300">{time}</td>
          <td className="p-4 border border-gray-300 flex gap-3">
            <button
              className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600 transition-transform transform hover:scale-105 active:scale-95"
              onClick={() => handleEdit(record)}
            >
              Update
            </button>
            <button
              className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition-transform transform hover:scale-105 active:scale-95"
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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
        <h3 className="text-xl font-semibold mb-6 text-center">Edit Record</h3>
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="form-group">
            <label className="block text-lg font-medium text-gray-700 mb-2">Vegetable Type:</label>
            <input
              type="text"
              value={updatedRecord.vegetableType}
              onChange={(e) =>
                setUpdatedRecord({
                  ...updatedRecord,
                  vegetableType: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-500"
              required
            />
          </div>
          <div className="form-group">
            <label className="block text-lg font-medium text-gray-700 mb-2">Grade A Weight:</label>
            <input
              type="number"
              value={updatedRecord.gradeAWeight}
              onChange={(e) =>
                setUpdatedRecord({
                  ...updatedRecord,
                  gradeAWeight: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-500"
              required
            />
          </div>
          <div className="form-group">
            <label className="block text-lg font-medium text-gray-700 mb-2">Grade B Weight:</label>
            <input
              type="number"
              value={updatedRecord.gradeBWeight}
              onChange={(e) =>
                setUpdatedRecord({
                  ...updatedRecord,
                  gradeBWeight: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-500"
              required
            />
          </div>
          <div className="form-group">
            <label className="block text-lg font-medium text-gray-700 mb-2">Grade C Weight:</label>
            <input
              type="number"
              value={updatedRecord.gradeCWeight}
              onChange={(e) =>
                setUpdatedRecord({
                  ...updatedRecord,
                  gradeCWeight: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-500"
              required
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-transform transform hover:scale-105"
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => setEditingRecord(null)}
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-transform transform hover:scale-105"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
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
