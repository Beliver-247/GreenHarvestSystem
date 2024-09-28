import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // To access query params
import "../styles/AddQArecord.css";
import SuccessModal from "./modals/SuccessModal";

const AddQArecord = () => {
  const [vegetableType, setVegetableType] = useState("");
  const [qualityStandards, setQualityStandards] = useState(null);
  const [gradeAWeight, setGradeAWeight] = useState("");
  const [gradeBWeight, setGradeBWeight] = useState("");
  const [gradeCWeight, setGradeCWeight] = useState("");
  const [batchId, setBatchId] = useState(""); // State for batch ID
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const location = useLocation(); // Get the current URL location

  // Extract query params from the URL
  const getQueryParams = () => {
    const searchParams = new URLSearchParams(location.search);
    const vegetableType = searchParams.get("vegetableType");
    const batchId = searchParams.get("batchId");
    return { vegetableType, batchId };
  };

  // On component mount, extract the query params and set vegetableType and batchId
  useEffect(() => {
    const { vegetableType, batchId } = getQueryParams();
    setVegetableType(vegetableType || ""); // Preselect vegetable type
    setBatchId(batchId || ""); // Store batch ID
  }, [location.search]);

  // Fetch quality standards based on vegetableType
  useEffect(() => {
    const fetchQualityStandards = async () => {
      if (vegetableType) {
        try {
          const response = await fetch(
            `http://localhost:3001/qaStandards/vegetable/${vegetableType}`
          );
          if (response.ok) {
            const data = await response.json();
            setQualityStandards(data);
          } else {
            console.error("Failed to fetch quality standards");
          }
        } catch (err) {
          console.error("Error fetching quality standards:", err);
        }
      } else {
        setQualityStandards(null);
      }
    };

    fetchQualityStandards();
  }, [vegetableType]);

  const onSubmit = async (e) => {
    e.preventDefault();

    const newRecord = {
      vegetableType,
      gradeAWeight,
      gradeBWeight,
      gradeCWeight,
      batchId, // Include the batch ID in the submitted data
    };

    try {
      const response = await fetch("http://localhost:3001/QArecord/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRecord),
      });

      if (response.ok) {
        setShowSuccessModal(true); // Show success modal
        // Reset form fields after successful submission
        resetForm();
      } else {
        const errorMessage = await response.text();
        alert("Error: " + errorMessage);
      }
    } catch (err) {
      console.error("Error: " + err);
      alert("Error: " + err);
    }
  };

  // Function to reset form fields after submission
  const resetForm = () => {
    setVegetableType("");
    setGradeAWeight("");
    setGradeBWeight("");
    setGradeCWeight("");
  };

  return (
    <div className="add-qa-record">
      <h2>Add QA Record</h2>
      <form onSubmit={onSubmit}>
        {/* Vegetable Type Selector */}
        <div>
          <select
            className="vegetable-select"
            required
            value={vegetableType}
            onChange={(e) => setVegetableType(e.target.value)}
            disabled={!!vegetableType} // Disable select if pre-filled
          >
            <option value="">Select a vegetable</option>
            <option value="Carrot">Carrot</option>
            <option value="Leek">Leek</option>
            <option value="Cabbage">Cabbage</option>
            <option value="Potato">Potato</option>
          </select>
        </div>

        {/* Quality Standards and Grade Weights */}
        {qualityStandards && (
          <div className="quality-standard-container">
            {/* Grade A Section */}
            <div>
              <div className="QAstandardBox">
                <h2>Grade A</h2>
                <ul>
                  <li>Weight: {qualityStandards.gradeA.weight}</li>
                  <li>Shape: {qualityStandards.gradeA.shape}</li>
                  <li>Color: {qualityStandards.gradeA.color}</li>
                  <li>Blemishes: {qualityStandards.gradeA.blemishes}</li>
                </ul>
              </div>
              <label>Grade A Weight:</label>
              <input
                type="number"
                required
                value={gradeAWeight}
                onChange={(e) => setGradeAWeight(e.target.value)}
              />
            </div>
            {/* Grade B Section */}
            <div>
              <div className="QAstandardBox">
                <h2>Grade B</h2>
                <ul>
                  <li>Weight: {qualityStandards.gradeB.weight}</li>
                  <li>Shape: {qualityStandards.gradeB.shape}</li>
                  <li>Color: {qualityStandards.gradeB.color}</li>
                  <li>Blemishes: {qualityStandards.gradeB.blemishes}</li>
                </ul>
              </div>
              <label>Grade B Weight:</label>
              <input
                type="number"
                required
                value={gradeBWeight}
                onChange={(e) => setGradeBWeight(e.target.value)}
              />
            </div>
            {/* Grade C Section */}
            <div>
              <div className="QAstandardBox">
                <h2>Grade C</h2>
                <ul>
                  <li>Weight: {qualityStandards.gradeC.weight}</li>
                  <li>Shape: {qualityStandards.gradeC.shape}</li>
                  <li>Color: {qualityStandards.gradeC.color}</li>
                  <li>Blemishes: {qualityStandards.gradeC.blemishes}</li>
                </ul>
              </div>
              <label>Grade C Weight:</label>
              <input
                type="number"
                required
                value={gradeCWeight}
                onChange={(e) => setGradeCWeight(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div>
          <button type="submit" className="submit-button">
            Add QA Record
          </button>
        </div>
      </form>

      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessModal
          show={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          message="Record added successfully!"
        />
      )}
    </div>
  );
};

export default AddQArecord;
