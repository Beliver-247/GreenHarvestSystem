import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SuccessModal from "./modals/SuccessModal";

const AddQArecord = () => {
  const [vegetableType, setVegetableType] = useState("");
  const [qualityStandards, setQualityStandards] = useState(null);
  const [gradeAWeight, setGradeAWeight] = useState("");
  const [gradeBWeight, setGradeBWeight] = useState("");
  const [gradeCWeight, setGradeCWeight] = useState("");
  const [batchId, setBatchId] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const location = useLocation();

  const getQueryParams = () => {
    const searchParams = new URLSearchParams(location.search);
    const vegetableType = searchParams.get("vegetableType");
    const batchId = searchParams.get("batchId");
    return { vegetableType, batchId };
  };

  useEffect(() => {
    const { vegetableType, batchId } = getQueryParams();
    setVegetableType(vegetableType || "");
    setBatchId(batchId || "");
  }, [location.search]);

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
      batchId,
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
        setShowSuccessModal(true);
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

  const resetForm = () => {
    setVegetableType("");
    setGradeAWeight("");
    setGradeBWeight("");
    setGradeCWeight("");
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 p-8 bg-white rounded-lg shadow-md animate-fadeIn">
      <h2 className="text-center text-2xl text-gray-800 mb-6 animate-popIn">Add QA Record</h2>
      <form onSubmit={onSubmit}>
        <div>
          <select
            className="block w-full max-w-sm mx-auto mb-5 p-3 border-2 border-green-600 rounded-lg focus:border-green-700 focus:ring-2 focus:ring-green-300 transition"
            required
            value={vegetableType}
            onChange={(e) => setVegetableType(e.target.value)}
            disabled={!!vegetableType}
          >
            <option value="">Select a vegetable</option>
            <option value="Carrot">Carrot</option>
            <option value="Leek">Leek</option>
            <option value="Cabbage">Cabbage</option>
            <option value="Potato">Potato</option>
          </select>
        </div>

        {qualityStandards && (
         <div className="flex flex-wrap justify-between mb-6 space-y-0 animate-fadeIn">
         {/* Grade A Section */}
         <div className="w-full md:w-1/3 p-4">
           <div className="bg-white border border-gray-300 rounded-lg p-4 transition transform hover:-translate-y-2 shadow hover:shadow-lg min-h-[250px]">
             <h3 className="text-xl mb-2">Grade A</h3>
             <ul className="list-disc pl-5">
               <li>Weight: {qualityStandards.gradeA.weight}</li>
               <li>Shape: {qualityStandards.gradeA.shape}</li>
               <li>Color: {qualityStandards.gradeA.color}</li>
               <li>Blemishes: {qualityStandards.gradeA.blemishes}</li>
             </ul>
           </div>
           <label className="block mt-4">Grade A Weight:</label>
           <input
             type="number"
             className="block w-full p-2 mt-1 border border-gray-300 rounded-lg focus:border-green-600 focus:ring-green-300 transition"
             required
             value={gradeAWeight}
             onChange={(e) => setGradeAWeight(e.target.value)}
           />
         </div>
       
         {/* Grade B Section */}
         <div className="w-full md:w-1/3 p-4">
           <div className="bg-white border border-gray-300 rounded-lg p-4 transition transform hover:-translate-y-2 shadow hover:shadow-lg min-h-[250px]">
             <h3 className="text-xl mb-2">Grade B</h3>
             <ul className="list-disc pl-5">
               <li>Weight: {qualityStandards.gradeB.weight}</li>
               <li>Shape: {qualityStandards.gradeB.shape}</li>
               <li>Color: {qualityStandards.gradeB.color}</li>
               <li>Blemishes: {qualityStandards.gradeB.blemishes}</li>
             </ul>
           </div>
           <label className="block mt-4">Grade B Weight:</label>
           <input
             type="number"
             className="block w-full p-2 mt-1 border border-gray-300 rounded-lg focus:border-green-600 focus:ring-green-300 transition"
             required
             value={gradeBWeight}
             onChange={(e) => setGradeBWeight(e.target.value)}
           />
         </div>
       
         {/* Grade C Section */}
         <div className="w-full md:w-1/3 p-4">
           <div className="bg-white border border-gray-300 rounded-lg p-4 transition transform hover:-translate-y-2 shadow hover:shadow-lg min-h-[250px]">
             <h3 className="text-xl mb-2">Grade C</h3>
             <ul className="list-disc pl-5">
               <li>Weight: {qualityStandards.gradeC.weight}</li>
               <li>Shape: {qualityStandards.gradeC.shape}</li>
               <li>Color: {qualityStandards.gradeC.color}</li>
               <li>Blemishes: {qualityStandards.gradeC.blemishes}</li>
             </ul>
           </div>
           <label className="block mt-4">Grade C Weight:</label>
           <input
             type="number"
             className="block w-full p-2 mt-1 border border-gray-300 rounded-lg focus:border-green-600 focus:ring-green-300 transition"
             required
             value={gradeCWeight}
             onChange={(e) => setGradeCWeight(e.target.value)}
           />
         </div>
       </div>
       
        )}

        <div>
          <button
            type="submit"
            className="block w-full max-w-sm mx-auto py-3 px-6 bg-green-600 text-white rounded-lg transition hover:bg-green-700 transform hover:scale-105 animate-buttonSlideUp"
          >
            Add QA Record
          </button>
        </div>
      </form>

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
