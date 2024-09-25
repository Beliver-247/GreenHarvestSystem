import React from 'react';
import ProductDetails from '../../components/ProductDetails/ProductDetails';
import StoreContextProvider from "../../context/StoreContext";


const Product = () => {
  return (
    <div>
      <StoreContextProvider>
        <ProductDetails />
      </StoreContextProvider>
    </div>
  );
};

export default Product;
