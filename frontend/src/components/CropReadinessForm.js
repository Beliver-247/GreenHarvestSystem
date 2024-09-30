import React, { useState } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';

const CropReadinessForm = () => {
    const [formData, setFormData] = useState({
        farmerNIC: '',
        cropVariety: '',
        quantity: '',
        expectedQuality: '',
        preferredPickupDate: '',
        preferredPickupTime: '',
        attachments: [],
    });

    const [errors, setErrors] = useState({});
    const [touchedFields, setTouchedFields] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        // Clear errors for current field after change
        if (errors[name]) {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;

        // Mark the field as touched
        setTouchedFields((prevTouched) => ({ ...prevTouched, [name]: true }));

        // Validate the field
        validateField(name, value);
    };

    const handleFileChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            attachments: [...e.target.files],
        }));
    };

    // Validation functions
    const validateField = (name, value) => {
        let errorMsg = '';

        switch (name) {
            case 'farmerNIC':
                if (!/^\d{9}[Vv]$|^\d{12}$/.test(value)) {
                    errorMsg = 'NIC must be either 9 digits followed by "V" or 12 digits.';
                }
                break;
            case 'quantity':
                if (!/^\d*\.?\d*$/.test(value)) {
                    errorMsg = 'Only numbers and periods are allowed in the quantity.';
                } else if (parseFloat(value) <= 0) {
                    errorMsg = 'Quantity must be greater than 0.';
                }
                break;
            case 'preferredPickupDate':
                if (new Date(value) < new Date().setHours(0, 0, 0, 0)) {
                    errorMsg = 'You cannot select a past date.';
                }
                break;
            default:
                if (!value) {
                    errorMsg = `${name} cannot be empty.`;
                }
                break;
        }

        setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMsg }));
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = {};

        // Validate all fields
        Object.keys(formData).forEach((field) => {
            validateField(field, formData[field]);
            if (errors[field]) valid = false;
        });

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            alert('Please fix the errors in the form.');
            return;
        }

        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                for (const file of value) {
                    formDataToSend.append('attachments', file);
                }
            } else {
                formDataToSend.append(key, value);
            }
        });

        // Retrieve token from localStorage
        const token = localStorage.getItem('farmerToken');

        try {
            await axios.post('http://localhost:3001/cropReadiness/notify', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`, // Add token here
                },
            });
            alert('Notification sent successfully!');
        } catch (error) {
            console.error('Error sending notification:', error); // Log the actual error for better debugging
            alert('Error sending notification.');
        }
    };

    const handleRemoveAttachment = (index) => {
        setFormData((prevData) => ({
            ...prevData,
            attachments: prevData.attachments.filter((_, i) => i !== index),
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Notify Crop Readiness</h2>

            <div className="mb-4">
                <label htmlFor="farmerNIC" className="block text-sm font-medium text-gray-700 mb-2">
                    Farmer NIC
                </label>
                <input
                    type="text"
                    name="farmerNIC"
                    id="farmerNIC"
                    value={formData.farmerNIC}
                    onChange={handleChange}
                    onBlur={handleBlur} // Add onBlur for field validation
                    required
                    className={`border ${errors.farmerNIC ? 'border-red-500' : 'border-gray-300'} rounded p-2 w-full`}
                />
                {errors.farmerNIC && <p className="text-red-500 text-sm">{errors.farmerNIC}</p>}
            </div>

            <div className="mb-4">
                <label htmlFor="cropVariety" className="block text-sm font-medium text-gray-700 mb-2">
                    Crop Variety
                </label>
                <select
                    name="cropVariety"
                    id="cropVariety"
                    value={formData.cropVariety}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`border ${errors.cropVariety ? 'border-red-500' : 'border-gray-300'} rounded p-2 w-full`}
                >
                    <option value="">Select Crop Variety</option>
                    <option value="Carrot">Carrot</option>
                    <option value="Cabbage">Cabbage</option>
                    <option value="Leek">Leek</option>
                    <option value="Potato">Potato</option>
                </select>
                {errors.cropVariety && <p className="text-red-500 text-sm">{errors.cropVariety}</p>}
            </div>

 <div className="mb-4">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                </label>
                <input
                    type="text"
                    name="quantity"
                    id="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
onBlur={handleBlur}

                    required
                    className={`border ${errors.quantity ? 'border-red-500' : 'border-gray-300'} rounded p-2 w-full`}
                />
                {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
            </div>

            <div className="mb-4">
                <label htmlFor="expectedQuality" className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Quality
                </label>
                <select
                    name="expectedQuality"
                    id="expectedQuality"
                    value={formData.expectedQuality}
                    onChange={handleChange}
onBlur={handleBlur}

                    required
                    className={`border ${errors.expectedQuality ? 'border-red-500' : 'border-gray-300'} rounded p-2 w-full`}
                >
                    <option value="">Select Quality</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
                {errors.expectedQuality && <p className="text-red-500 text-sm">{errors.expectedQuality}</p>}
            </div>

            <div className="mb-4">
                <label htmlFor="preferredPickupDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Pickup Date
                </label>
                <input
                    type="date"
                    name="preferredPickupDate"
                    id="preferredPickupDate"
                    value={formData.preferredPickupDate}
                    onChange={handleChange}
onBlur={handleBlur}

                    required
                    className={`border ${errors.preferredPickupDate ? 'border-red-500' : 'border-gray-300'} rounded p-2 w-full`}
                    min={new Date().toISOString().split('T')[0]} // Disable past dates
                />
                {errors.preferredPickupDate && <p className="text-red-500 text-sm">{errors.preferredPickupDate}</p>}
            </div>

            <div className="mb-4">
                <label htmlFor="preferredPickupTime" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Pickup Time
                </label>
                <input
                    type="time"
                    name="preferredPickupTime"
                    id="preferredPickupTime"
                    value={formData.preferredPickupTime}
                    onChange={handleChange}
onBlur={handleBlur}
className={`border ${errors.preferredPickupTime ? 'border-red-500' : 'border-gray-300'} rounded p-2 w-full`}
                    required
                    
                />
            </div>

            <div className="mb-4">
                <label htmlFor="attachments" className="block text-sm font-medium text-gray-700 mb-2">
                    Attachments
                </label>
                <input
                    type="file"
                    name="attachments"
                    id="attachments"
                    onChange={handleFileChange}
onBlur={handleBlur}

                    multiple
                    className="border border-gray-300 rounded p-2 w-full"
                />
                {formData.attachments.length > 0 && (
                    <div className="mt-2">
                        <ul>
                            {formData.attachments.map((file, index) => (
                                <li key={index} className="flex items-center">
                                    <span>{file.name}</span>
                                    <button
                                        type="button"
                                        className="ml-2 text-red-600"
                                        onClick={() => handleRemoveAttachment(index)}
                                    >
                                        <FaTrash />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Submit
            </button>
        </form>
    );
};

export default CropReadinessForm;
