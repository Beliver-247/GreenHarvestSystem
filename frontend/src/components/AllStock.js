import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StockBarChart from './StockBarChart';

export default function AllStock() {
  const [stocks, setStocks] = useState([]);
  const [totalQuantities, setTotalQuantities] = useState({});

  useEffect(() => {
    function getStocks() {
      axios.get("http://localhost:3001/stock/all-stocks")
        .then(res => {
          setStocks(res.data.stocks);
          setTotalQuantities(res.data.totalQuantities);
        })
        .catch(err => console.log(err));
    }
    getStocks();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-center mb-1">Inventory Stock Levels</h1>
      <div className="overflow-x-auto">
        <hr className="my-4 border-t-2 border-gray-300" />
        {stocks.length > 0 ? (
          <>
            {/* Bar Chart for stock levels */}
            <StockBarChart totalQuantities={totalQuantities} />
          </>
        ) : (
          <p className="text-center text-gray-500 mt-6">Inventory is empty.</p>
        )}
      </div>
    </div>
  );
}
