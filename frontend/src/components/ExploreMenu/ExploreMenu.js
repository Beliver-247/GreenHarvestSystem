import React from 'react'
import './ExploreMenu.css'
import { menu_list } from '../../assets/assets.js'

const ExploreMenu = ({category, setCategory}) => {
  return (
    <div className='explore-menu' id='explore-menu'>
        <h1>Explore Our menu</h1>
        <p className='explore-menu-text'>dIn this tutorial you will learn to create a complete food ordering website / app using React JS, MongoDB, Express, Node JS and Stripe payment gateway. In this Full Stack Food delivery app project we will create the Frontend website, Admin Panel and Backend server. s</p>
        <div className="explore-menu-list">
            {menu_list.map((item, index)=>{
                return (
                    <div onClick={()=>setCategory(prev=>prev===item.menu_name?"All":item.menu_name)} key={index} className='explore-menu-list-item'>
                        <img className={category===item.menu_name?"active":""}src={item.menu_image} alt="" />
                        <p>{item.menu_name}</p>
                    </div>
                )
            })}
        </div>
    </div>
  )
}

export default ExploreMenu;
