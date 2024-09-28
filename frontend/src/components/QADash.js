import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/QADash.css"; // Assuming you are using a separate CSS file for styling

const QADashboard = () => {
  const [batchCount, setBatchCount] = useState(0);
  const [qaRecordCount, setQaRecordCount] = useState(0);
  const [qaStandardCount, setQaStandardCount] = useState(0);
  const [qaTeamCount, setQaTeamCount] = useState(0);

  // Fetch the count of incoming batches
  const fetchBatchCount = async () => {
    try {
      const response = await fetch("http://localhost:8070/incomingBatches"); // Updated endpoint
      const data = await response.json();
      setBatchCount(data.length); // Assuming data is an array of batches
    } catch (error) {
      console.error("Error fetching batch data:", error);
    }
  };

  // Fetch the count of QA records
  const fetchQaRecordCount = async () => {
    try {
      const response = await fetch("http://localhost:8070/QArecord");
      const data = await response.json();
      setQaRecordCount(data.length);
    } catch (error) {
      console.error("Error fetching QA record data:", error);
    }
  };

  // Fetch the count of QA standards
  const fetchQaStandardCount = async () => {
    try {
      const response = await fetch("http://localhost:8070/qaStandards");
      const data = await response.json();
      setQaStandardCount(data.length);
    } catch (error) {
      console.error("Error fetching QA standard data:", error);
    }
  };

  // Fetch the count of QA team members
  const fetchQaTeamCount = async () => {
    try {
      const response = await fetch("http://localhost:8070/QATeam");
      const data = await response.json();
      setQaTeamCount(data.length);
    } catch (error) {
      console.error("Error fetching QA team data:", error);
    }
  };

  // Use useEffect to fetch the counts when the component is mounted
  useEffect(() => {
    fetchBatchCount();
    fetchQaRecordCount();
    fetchQaStandardCount();
    fetchQaTeamCount();
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <div className="dashboard-summary">
        <Link to="/incoming-batches" className="dashboard-item">
          <h2>Incoming Batches</h2>
          <p>Total: {batchCount}</p>
        </Link>
        <Link to="/qa-records" className="dashboard-item">
          <h2>QA Records</h2>
          <p>Total: {qaRecordCount}</p>
        </Link>
        <Link to="/qa-standards" className="dashboard-item">
          <h2>QA Standards</h2>
          <p>Total: {qaStandardCount}</p>
        </Link>
        <Link to="/qa-team" className="dashboard-item">
          <h2>QA Team Members</h2>
          <p>Total: {qaTeamCount}</p>
        </Link>
      </div>
    </div>
  );
};

export default QADashboard;
