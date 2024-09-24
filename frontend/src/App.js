import './App.css';
import SideNav from './components/SideNav';
import {BrowserRouter as Router} from "react-router-dom"
import OrderForm from './components/order/OrderForm';

function App() {
  return (
    <Router>
    <div className="App">
      {/* <SideNav/> */}
      <OrderForm/>
    </div>
    </Router>
  );
}

export default App;
