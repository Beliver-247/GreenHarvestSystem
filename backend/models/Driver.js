const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Custom validation for NIC
const validateNIC = function(nic) {
    const oldNICRegex = /^[0-9]{9}[Vv]$/;
    const newNICRegex = /^[0-9]{12}$/;
    return oldNICRegex.test(nic) || newNICRegex.test(nic);
};

// Custom validation for mobile number
const validateMobileNo = function(mobileNo) {
    return /^\d{11}$/.test(mobileNo);
};

// Custom validation for email
const validateEmail = function(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Custom validation for password
const validatePassword = function(password) {
    return /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(password);
};

// Custom validation for license expiration date
const validateLicenseExpDate = function(licenseExpDate) {
    return licenseExpDate >= new Date();
};

// Custom validation for date of birth (dob)
const validateDOB = function(dob) {
    const today = new Date();
    const age18 = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return dob <= age18 && dob <= today;
};

const driverSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    nic: {
        type: String,
        required: true,
        unique: true,
        validate: [validateNIC, 'Invalid NIC format.']
    },
    dob: {
        type: Date,
        required: true,
        validate: [validateDOB, 'Date of birth cannot be in the future and the driver must be at least 18 years old.']
    },
    licenseExpDate: {
        type: Date,
        required: true,
        validate: [validateLicenseExpDate, 'License expiration date cannot be in the past.']
    },
    mobileNo: {
        type: Number,
        required: true,
        validate: [validateMobileNo, 'Use +94 and instead of 0. Eg:-94xxxxxxxxx']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validateEmail, 'Invalid email format.']
    },
    password: {
        type: String,
        required: true,
        validate: [validatePassword, 'Password must contain at least one number, one uppercase letter, and one symbol.']
    }
});

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;
