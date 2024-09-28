import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import '../styles/IncomingBatches.css'

const IncomingBatches = () => {
  const [batches, setBatches] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // useNavigate hook for navigation

  // Fetch incoming batches when the component mounts
  useEffect(() => {
    fetch('http://localhost:3001/incomingBatches')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setBatches(data);
      })
      .catch((err) => {
        setError('Error fetching incoming batches: ' + err.message);
      });
  }, []);

  // Handle click event for each batch
  const handleRowClick = (batch) => {
    // Redirect to AddQArecord with vegetableType and batchId as query params
    navigate(`/add-qarecord?vegetableType=${batch.vegetableType}&batchId=${batch._id}`);
  };

  return (
    <div>
      <h2>Incoming Batches</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>Vegetable Type</th>
            <th>Total Weight (kg)</th>
            <th>Arrival Date</th>
          </tr>
        </thead>
        <tbody>
          {batches.length > 0 ? (
            batches.map((batch) => (
              <tr key={batch._id} onClick={() => handleRowClick(batch)} style={{ cursor: 'pointer' }}>
                <td>{batch.vegetableType}</td>
                <td>{batch.totalWeight}</td>
                <td>{new Date(batch.arrivalDate).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No incoming batches found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default IncomingBatches;
