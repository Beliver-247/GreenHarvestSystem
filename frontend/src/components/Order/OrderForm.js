import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import validateForm from '../../Validation/orderForm_validate'; // Adjust the path as necessary

const OrderForm = () => {
  const { id } = useParams();
  const { food_list, cartItems } = useContext(StoreContext);
  const product = food_list.find((item) => item._id === id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: "", // Assume a logged-in user
    address: {
      country: '',
      street: '',
      city: '',
      postalCode: '',
      phone: ''
    },
    billingAddress: {
      country: '',
      street: '',
      city: '',
      postalCode: '',
      phone: ''
    },
    billingAddressOption: 'same'
  });

  const [isSameAsShipping, setIsSameAsShipping] = useState(true);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [field, subfield] = name.split('.');

    if (subfield) {
      setFormData((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          [subfield]: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }

    // Run validation on the current field
    const updatedFormData = {
      ...formData,
      [field]: subfield ? { ...formData[field], [subfield]: value } : value,
    };
    const validationErrors = validateForm(updatedFormData);  // Validate the form with the updated data
    setErrors(validationErrors);
  };

  const handleBillingAddressToggle = (e) => {
    setIsSameAsShipping(e.target.value === 'same');
  };

  useEffect(() => {
    if (isSameAsShipping) {
      setFormData((prev) => ({
        ...prev,
        billingAddress: { ...prev.address } // Copy shipping address to billing address
      }));
    }
  }, [isSameAsShipping, formData.address]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    const orderData = {
      userId: formData.userId,
      items: [
        {
          id: product._id,
          name: product.name,
          qty: cartItems[id],
          price: product.price,
          image: product.image
        }
      ],
      amount: product.price * cartItems[id] + 250,
      address: formData.address,
      billingAddress: formData.billingAddress,
      payment: false
    };

    try {
      navigate('/payment', { state: orderData });
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Order Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Left Side: Shipping and Billing Address */}
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <input
                  name="address.street"
                  placeholder="Street"
                  onChange={handleChange}
                  value={formData.address.street}
                  className={`w-full p-2 border rounded-md ${errors.addressStreet ? 'border-red-500' : 'border-gray-300'}`}
                  required
                />
                {errors.addressStreet && <p className="text-red-500">{errors.addressStreet}</p>}

                <input
                  name="address.city"
                  placeholder="City"
                  onChange={handleChange}
                  value={formData.address.city}
                  className={`w-full p-2 border rounded-md ${errors.addressCity ? 'border-red-500' : 'border-gray-300'}`}
                  required
                />
                {errors.addressCity && <p className="text-red-500">{errors.addressCity}</p>}

                <input
                  name="address.country"
                  placeholder="Country"
                  onChange={handleChange}
                  value={formData.address.country}
                  className={`w-full p-2 border rounded-md ${errors.addressCountry ? 'border-red-500' : 'border-gray-300'}`}
                  required
                />
                {errors.addressCountry && <p className="text-red-500">{errors.addressCountry}</p>}

                <input
                  name="address.postalCode"
                  placeholder="Postal Code"
                  onChange={handleChange}
                  value={formData.address.postalCode}
                  className={`w-full p-2 border rounded-md ${errors.addressPostalCode ? 'border-red-500' : 'border-gray-300'}`}
                  required
                />
                {errors.addressPostalCode && <p className="text-red-500">{errors.addressPostalCode}</p>}

                <input
                  name="address.phone"
                  placeholder="Phone"
                  onChange={handleChange}
                  value={formData.address.phone}
                  className={`w-full p-2 border rounded-md ${errors.addressPhone ? 'border-red-500' : 'border-gray-300'}`}
                  required
                />
                {errors.addressPhone && <p className="text-red-500">{errors.addressPhone}</p>}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Billing Address</h2>
              <div className="space-y-4">
                <div className="flex items-center mb-4">
                  <input
                    type="radio"
                    name="billingAddressOption"
                    value="same"
                    checked={isSameAsShipping}
                    onChange={handleBillingAddressToggle}
                    className="mr-2"
                  />
                  <label>Same as shipping address</label>
                </div>
                <div className="flex items-center mb-4">
                  <input
                    type="radio"
                    name="billingAddressOption"
                    value="different"
                    checked={!isSameAsShipping}
                    onChange={handleBillingAddressToggle}
                    className="mr-2"
                  />
                  <label>Use a different billing address</label>
                </div>

                {!isSameAsShipping && (
                  <>
                    <input
                      name="billingAddress.street"
                      placeholder="Street"
                      onChange={handleChange}
                      value={formData.billingAddress.street}
                      className={`w-full p-2 border rounded-md ${errors.billingAddressStreet ? 'border-red-500' : 'border-gray-300'}`}
                      required
                    />
                    {errors.billingAddressStreet && <p className="text-red-500">{errors.billingAddressStreet}</p>}

                    <input
                      name="billingAddress.city"
                      placeholder="City"
                      onChange={handleChange}
                      value={formData.billingAddress.city}
                      className={`w-full p-2 border rounded-md ${errors.billingAddressCity ? 'border-red-500' : 'border-gray-300'}`}
                      required
                    />
                    {errors.billingAddressCity && <p className="text-red-500">{errors.billingAddressCity}</p>}

                    <input
                      name="billingAddress.country"
                      placeholder="Country"
                      onChange={handleChange}
                      value={formData.billingAddress.country}
                      className={`w-full p-2 border rounded-md ${errors.billingAddressCountry ? 'border-red-500' : 'border-gray-300'}`}
                      required
                    />
                    {errors.billingAddressCountry && <p className="text-red-500">{errors.billingAddressCountry}</p>}

                    <input
                      name="billingAddress.postalCode"
                      placeholder="Postal Code"
                      onChange={handleChange}
                      value={formData.billingAddress.postalCode}
                      className={`w-full p-2 border rounded-md ${errors.billingAddressPostalCode ? 'border-red-500' : 'border-gray-300'}`}
                      required
                    />
                    {errors.billingAddressPostalCode && <p className="text-red-500">{errors.billingAddressPostalCode}</p>}

                    <input
                      name="billingAddress.phone"
                      placeholder="Phone"
                      onChange={handleChange}
                      value={formData.billingAddress.phone}
                      className={`w-full p-2 border rounded-md ${errors.billingAddressPhone ? 'border-red-500' : 'border-gray-300'}`}
                      required
                    />
                    {errors.billingAddressPhone && <p className="text-red-500">{errors.billingAddressPhone}</p>}
                  </>
                )}
              </div>
            </section>
            <button
              type="submit"
              className="w-full p-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Next
            </button>
          </div>

          {/* Right Side: Product Summary */}
          <div className="border p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Product Summary</h2>
            <div className="flex">
              <img src={product.image} alt={product.name} className="w-24 h-24 object-cover mr-4" />
              <div>
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-gray-600">Quantity: {cartItems[id]}</p>
                <p className="font-semibold">Rs. {product.price}</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p>Subtotal:</p>
              <p>Rs. {product.price * cartItems[id]}</p>
            </div>
            <div className="flex justify-between items-center">
              <p>Delivery:</p>
              <p>Rs. 250</p>
            </div>
            <div className="flex justify-between items-center font-semibold">
              <p>Total:</p>
              <p>Rs. {product.price * cartItems[id] + 250}</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;
