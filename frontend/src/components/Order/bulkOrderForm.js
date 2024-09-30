import { useLocation } from 'react-router-dom';

const OrderForm = () => {
  const location = useLocation();
  const { cartItems } = location.state;  // Retrieve cart items from state
  const { food_list } = useContext(StoreContext);
  
  const [formData, setFormData] = useState({
    userId: "",  // Replace with the actual user ID
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
    }
  });

  const calculateTotal = () => {
    return Object.keys(cartItems).reduce((total, itemId) => {
      const product = food_list.find(item => item._id === itemId);
      const quantity = cartItems[itemId];
      return total + (product.price * quantity);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const orderItems = Object.keys(cartItems).map(itemId => {
      const product = food_list.find(item => item._id === itemId);
      return {
        id: product._id,
        name: product.name,
        qty: cartItems[itemId],
        price: product.price,
        image: product.image
      };
    });

    const orderData = {
      userId: formData.userId,
      items: orderItems,
      amount: calculateTotal(),
      address: formData.address,
      billingAddress: formData.billingAddress,
      payment: true
    };

    try {
      await axios.post("http://localhost:3001/api/orders/add-order", orderData);
      navigate('/payment');
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form UI here */}
      <button type="submit">Place Order</button>
    </form>
  );
};
