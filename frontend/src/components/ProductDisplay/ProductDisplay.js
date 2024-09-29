import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext.js'
import FoodItem from '../Product/Product'
import { useNavigate } from 'react-router-dom';

const ProductDisplay = () => {
   
    const {food_list} = useContext(StoreContext)
    const navigate = useNavigate(); // Hook for navigation

    if (!food_list) {
        return <p>Loading...</p>; // Handle case when food_list is not available
    }

    const handleClick = (id) => {
        navigate(`/product/${id}`); // Navigate to product detail page
    };
    
    return (
        <div className='food-display' id= 'food-display' style={{ width: '1200px' }}>
            <h2>Fresh Vegitables</h2>
            <div className="food-display-list">
                {food_list.map((item, index) => {
                  
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
                })}
            </div>
        </div>
    )
}

export default ProductDisplay;
