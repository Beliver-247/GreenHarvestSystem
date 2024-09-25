import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext.js'
import FoodItem from '../Product/Product'
import { useNavigate } from 'react-router-dom';

const ProductDisplay = ({category}) => {
   
    const {food_list} = useContext(StoreContext)
    const navigate = useNavigate(); // Hook for navigation

    if (!food_list) {
        return <p>Loading...</p>; // Handle case when food_list is not available
    }

    const handleClick = (id) => {
        navigate(`/product/${id}`); // Navigate to product detail page
      };
    
    return (
        <div className='food-display' id= 'food-display'>
            <h2>Top dishes near you</h2>
            <div className="food-display-list">
                {food_list.map((item, index) => {
                    if (category === "All" || item.category === category) {
                    return (
                        <FoodItem
                        key={index}
                        id={item._id}
                        name={item.name}
                        description={item.description}
                        price={item.price}
                        image={item.image}
                        onClick={() => handleClick(item._id)} // Pass the item ID on click
                        />
                    );
                    }
                    return null; // Return null when the condition isn't met
                })}
            </div>
        </div>
    )
}

export default ProductDisplay;