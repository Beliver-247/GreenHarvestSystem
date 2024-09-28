const PriceChart = () => {
  return (
    <table className="mt-2 w-full border border-gray-300 text-sm rounded-lg">
      <thead>
        <tr>
          <th className="border-b border-r border-gray-300 py-2 px-4 text-left">
            Quantity
          </th>
          <th className="border-b border-r border-gray-300 py-2 px-4 text-left">
            Discount
          </th>
          <th className="border-b py-2 px-4 text-left">Unit price</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border-b border-r border-gray-300 py-2 px-4">
            10 kg - 25kg
          </td>
          <td className="border-b border-r border-gray-300 py-2 px-4 text-center">
            5%
          </td>
          <td className="border-b py-2 px-4">Rs 350.00</td>
        </tr>
        <tr>
          <td className="border-b border-r border-gray-300 py-2 px-4">
            26 kg - 50kg
          </td>
          <td className="border-b border-r border-gray-300 py-2 px-4 text-center">
            7%
          </td>
          <td className="border-b py-2 px-4">Rs 340.00</td>
        </tr>
        <tr>
          <td className="border-b border-r border-gray-300 py-2 px-4">
            51 kg - 100kg
          </td>
          <td className="border-b border-r border-gray-300 py-2 px-4 text-center">
            11%
          </td>
          <td className="border-b py-2 px-4">Rs 310.00</td>
        </tr>
        <tr>
          <td className="border-r border-gray-300 py-2 px-4">
            101 kg and above
          </td>
          <td className="border-r border-gray-300 py-2 px-4 text-center">
            14%
          </td>
          <td className="py-2 px-4">Rs 300.00</td>
        </tr>
      </tbody>
    </table>
  );
};

export default PriceChart;
