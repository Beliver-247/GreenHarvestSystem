import React, { useState, useEffect } from "react";
import "../styles/QAStandards.css"; // Ensure this file is linked

const QAStandards = () => {
  const [standards, setStandards] = useState([]);

  useEffect(() => {
    const fetchStandards = async () => {
      try {
        const response = await fetch("http://localhost:3001/qaStandards");
        if (response.ok) {
          const data = await response.json();
          setStandards(data);
        } else {
          console.error("Failed to fetch QA standards");
        }
      } catch (err) {
        console.error("Error fetching QA standards:", err);
      }
    };

    fetchStandards();
  }, []);

  return (
    <div className="qa-standards-container">
      <h2>QA Standards</h2>
      {standards.map((standard) => (
        <div className="standard-card" key={standard._id}>
          <h3 className="standard-title">{standard.vegetableType}</h3>
          <div className="standard-details">
            <div>
              <h4>Grade A</h4>
              <ul>
                <li>Weight: {standard.gradeA.weight}</li>
                <li>Shape: {standard.gradeA.shape}</li>
                <li>Color: {standard.gradeA.color}</li>
                <li>Blemishes: {standard.gradeA.blemishes}</li>
              </ul>
            </div>
            <div>
              <h4>Grade B</h4>
              <ul>
                <li>Weight: {standard.gradeB.weight}</li>
                <li>Shape: {standard.gradeB.shape}</li>
                <li>Color: {standard.gradeB.color}</li>
                <li>Blemishes: {standard.gradeB.blemishes}</li>
              </ul>
            </div>
            <div>
              <h4>Grade C</h4>
              <ul>
                <li>Weight: {standard.gradeC.weight}</li>
                <li>Shape: {standard.gradeC.shape}</li>
                <li>Color: {standard.gradeC.color}</li>
                <li>Blemishes: {standard.gradeC.blemishes}</li>
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QAStandards;
