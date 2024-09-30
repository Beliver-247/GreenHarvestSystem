import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LeafletMap from './LeafletMap';
import WeatherCard from './WeatherCard';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const UpdatePickupRequestForm = () => {
    const { pickupRequestId } = useParams(); // Destructure pickupRequestId from URL
    const [pickupData, setPickupData] = useState({
        crops: [{ cropType: '', quantity: '' }],
        preferredDate: '',
        preferredTime: '',
        address: '',
        location: { lat: 7.8731, lng: 80.7718 }, // Default to a central location in Sri Lanka
        NIC: '',
        weather: null,
    });

    const [errors, setErrors] = useState({});
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0]; // Extracts the date part

    useEffect(() => {
        const fetchPickupRequestData = async () => {
            try {
                const token = localStorage.getItem('farmerToken');

                const response = await axios.get(
                    `http://localhost:3001/pickup-request/${pickupRequestId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                const data = response.data;

                // Map the crops
                const crops = data.crops.map(crop => ({
                    cropType: crop.cropType,
                    quantity: crop.quantity,
                }));

                const formattedDate = data.preferredDate
                    ? new Date(data.preferredDate).toISOString().split('T')[0]
                    : '';

                setPickupData({
                    crops,
                    preferredDate: formattedDate,
                    preferredTime: data.preferredTime || '',
                    address: data.address || '',
                    location: data.location || { lat: 7.8731, lng: 80.7718 },
                    NIC: data.NIC || '',
                });
            } catch (error) {
                console.error('Error fetching pickup request data:', error);
            }
        };

        fetchPickupRequestData();
    }, [pickupRequestId]);

    const validateCrop = (index) => {
        const crop = pickupData.crops[index];
        let cropErrors = {};
        const cropTypes = pickupData.crops.map(c => c.cropType);

        if (!crop.cropType) {
            cropErrors.cropType = 'Crop type cannot be empty';
        } else if (cropTypes.indexOf(crop.cropType) !== index) {
            cropErrors.cropType = 'Duplicate crop type not allowed';
        }

        if (!crop.quantity || crop.quantity <= 0) {
            cropErrors.quantity = 'Quantity must be greater than zero';
        }

        setErrors(prev => ({
            ...prev,
            crops: {
                ...prev.crops,
                [index]: cropErrors,
            }
        }));

        return Object.keys(cropErrors).length === 0;
    };

    const validateField = (name, value) => {
        let fieldError = '';

        if (!value) {
            fieldError = 'This field cannot be empty';
        } else if (name === 'preferredDate') {
            const selectedDate = new Date(value);
            const currentDate = new Date();
            if (selectedDate < currentDate.setHours(0, 0, 0, 0)) {
                fieldError = 'Preferred date cannot be in the past';
            }
        }

        setErrors(prev => ({
            ...prev,
            [name]: fieldError,
        }));

        return !fieldError;
    };

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        const updatedCrops = [...pickupData.crops];
        updatedCrops[index][name] = name === 'quantity' ? Number(value) : value;
        setPickupData((prevState) => ({
            ...prevState,
            crops: updatedCrops,
        }));
    };

    const handleBlur = (e, index = null) => {
        const { name, value } = e.target;
        if (index !== null) {
            validateCrop(index);
        } else {
            validateField(name, value);
        }
    };

    const addCrop = () => {
        setPickupData((prevState) => ({
            ...prevState,
            crops: [...prevState.crops, { cropType: '', quantity: '' }],
        }));
    };

    const removeCrop = (index) => {
        const updatedCrops = pickupData.crops.filter((_, i) => i !== index);
        setPickupData((prevState) => ({
            ...prevState,
            crops: updatedCrops,
        }));
        const updatedErrors = { ...errors };
        delete updatedErrors.crops[index];
        setErrors(updatedErrors);
    };

    const geocodeAddress = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    pickupData.address
                )}`
            );
            if (response.data.length > 0) {
                const { lat, lon } = response.data[0];
                setPickupData((prevState) => ({
                    ...prevState,
                    location: { lat: parseFloat(lat), lng: parseFloat(lon) },
                }));
            } else {
                alert('Address not found.');
            }
        } catch (error) {
            console.error('Error geocoding address:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let isValid = true;

        // Validate crops
        pickupData.crops.forEach((crop, index) => {
            if (!validateCrop(index)) {
                isValid = false;
            }
        });

        // Validate preferred date and time
        if (!validateField('preferredDate', pickupData.preferredDate)) {
            isValid = false;
        }
        if (!validateField('preferredTime', pickupData.preferredTime)) {
            isValid = false;
        }
        if (!validateField('address', pickupData.address)) {
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        try {
            const token = localStorage.getItem('farmerToken');

            if (!token) {
                console.error('Token is missing');
                alert('You need to be logged in to update the request.');
                return;
            }

            const dataToSend = {
                crops: pickupData.crops,
                preferredDate: pickupData.preferredDate,
                preferredTime: pickupData.preferredTime,
                address: pickupData.address,
                location: { lat: pickupData.location.lat, lng: pickupData.location.lng },
                NIC: pickupData.NIC,
            };

            const response = await axios.put(
                `http://localhost:3001/pickup-request/${pickupRequestId}`,
                dataToSend,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200) {
                alert('Pickup request updated successfully');
                setPickupData({
                    ...pickupData,
                    ...response.data.updatedRequest,
                });
                navigate('/fm_layout/pickup_requests-list');
            } else {
                alert('Failed to update the pickup request.');
            }
        } catch (error) {
            console.error('Error updating pickup request:', error);
            alert(
                `Error updating pickup request: ${
                    error.response?.data?.message || error.message
                }`
            );
        }
    };

    return (
        <div className="container mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
                Update Pickup Request
            </h1>

            <div className="flex flex-col lg:flex-row gap-8">
                <form onSubmit={handleSubmit} className="lg:w-1/2 space-y-4">
                    {pickupData.crops.map((crop, index) => (
                        <div key={index} className="flex gap-4">
                            <div className="w-full">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Crop Type:
                                </label>
                                <input
                                    type="text"
                                    name="cropType"
                                    value={crop.cropType}
                                    onChange={(e) => handleChange(e, index)}
                                    onBlur={(e) => handleBlur(e, index)}
                                    className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                />
                                {errors?.crops?.[index]?.cropType && (
                                    <p className="text-red-500 text-sm">
                                        {errors.crops[index].cropType}
                                    </p>
                                )}
                            </div>

                            <div className="w-full">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Quantity (in kg):
                                </label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={crop.quantity}
                                    onChange={(e) => handleChange(e, index)}
                                    onBlur={(e) => handleBlur(e, index)}
                                    className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                />
                                {errors?.crops?.[index]?.quantity && (
                                    <p className="text-red-500 text-sm">
                                        {errors.crops[index].quantity}
                                    </p>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() => removeCrop(index)}
                                className="text-red-500 hover:text-red-700 text-xl"
                            >
                                &times;
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addCrop}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700"
                    >
                        Add Crop
                    </button>

                    <div className="w-full">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Preferred Date:
                        </label>
                        <input
                            type="date"
                            name="preferredDate"
                            min={formattedToday}
                            value={pickupData.preferredDate}
                            onChange={(e) =>
                                setPickupData((prevState) => ({
                                    ...prevState,
                                    preferredDate: e.target.value,
                                }))
                            }
                            onBlur={handleBlur}
                            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                        {errors.preferredDate && (
                            <p className="text-red-500 text-sm">
                                {errors.preferredDate}
                            </p>
                        )}
                    </div>

                    <div className="w-full">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Preferred Time:
                        </label>
                        <input
                            type="time"
                            name="preferredTime"
                            value={pickupData.preferredTime}
                            onChange={(e) =>
                                setPickupData((prevState) => ({
                                    ...prevState,
                                    preferredTime: e.target.value,
                                }))
                            }
                            onBlur={handleBlur}
                            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                        {errors.preferredTime && (
                            <p className="text-red-500 text-sm">
                                {errors.preferredTime}
                            </p>
                        )}
                    </div>

                    <div className="w-full">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Address:
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={pickupData.address}
                            onChange={(e) =>
                                setPickupData((prevState) => ({
                                    ...prevState,
                                    address: e.target.value,
                                }))
                            }
                            onBlur={handleBlur}
                            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                        {errors.address && (
                            <p className="text-red-500 text-sm">
                                {errors.address}
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={geocodeAddress}
                        disabled={loading}
                        className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 ${
                            loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        Geocode Address
                    </button>

                    

                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                    >
                        Update Pickup Request
                    </button>
                </form>

                <div className="lg:w-1/2 space-y-4">
                    <LeafletMap
                        location={pickupData.location}
                        setLocation={(newLocation) =>
                            setPickupData((prevState) => ({
                                ...prevState,
                                location: newLocation,
                            }))
                        }
                    />
                    {weatherData && <WeatherCard weather={weatherData} />}
                </div>
            </div>
        </div>
    );
};

export default UpdatePickupRequestForm;
