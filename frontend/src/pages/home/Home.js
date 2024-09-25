import React from "react"; // Import useState
import "./Home.css";
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu.js'
import ProductDisplay from '../../components/ProductDisplay/ProductDisplay.js'
import { useState } from "react"; // Import useState
import StoreContextProvider from "../../context/StoreContext.js";


const Home = () => {

  const [category, setCategory] = useState("All") // Correct useState usage
  return (
    <div>
        <StoreContextProvider>
          <ExploreMenu category={category} setCategory={setCategory} />
          <ProductDisplay category={category} />
        </StoreContextProvider>
    </div>
  );
};

export default Home;
