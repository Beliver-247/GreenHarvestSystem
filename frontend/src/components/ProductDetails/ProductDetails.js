import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';


const ProductDetails = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const { food_list } = useContext(StoreContext);

  // Find the product with the matching ID
  const product = food_list.find((item) => item._id === id);

  if (!product) {
    return <p>Product not found</p>;
  }

  return (
    <div>
     
      <div>
        <h1>{product.name}</h1>
        <img src={product.image} alt={product.name} style={{ width: '300px' }} />
        <p>{product.description}</p>
        <p>Price: ${product.price}</p>
        <p>Category: {product.category}</p>
        <p>Discount: {product.discount}%</p>
        <p>Expiration Date: {new Date(product.expDate).toLocaleDateString()}</p>
        <button>Add to Cart</button>
      </div>
   
    </div>
  );
};

export default ProductDetails;
