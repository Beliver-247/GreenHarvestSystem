// validate.js

const validateForm = (formData) => {
    const errors = {};
    
    // Address Validation
    if (!formData.address.street) {
      errors.addressStreet = 'Street is required';
    }
    if (!formData.address.city) {
      errors.addressCity = 'City is required';
    }
    if (!formData.address.country) {
      errors.addressCountry = 'Country is required';
    }
    if (!formData.address.postalCode) {
      errors.addressPostalCode = 'Postal Code is required';
    }
    if (!formData.address.phone) {
      errors.addressPhone = 'Phone is required';
    }
  
    // Billing Address Validation (if different)
    if (!formData.billingAddressOption === 'same') {
      if (!formData.billingAddress.street) {
        errors.billingAddressStreet = 'Street is required';
      }
      if (!formData.billingAddress.city) {
        errors.billingAddressCity = 'City is required';
      }
      if (!formData.billingAddress.country) {
        errors.billingAddressCountry = 'Country is required';
      }
      if (!formData.billingAddress.postalCode) {
        errors.billingAddressPostalCode = 'Postal Code is required';
      }
      if (!formData.billingAddress.phone) {
        errors.billingAddressPhone = 'Phone is required';
      }
    }
  
    return errors;
  };
  
  export default validateForm;
  