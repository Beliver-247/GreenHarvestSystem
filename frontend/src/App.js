import './App.css';
import SideNav from './components/SideNav';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom"
import OrderForm from './components/order/OrderForm';
import Home from "./pages/home/Home.js";




function App() {
  return (
    <div className="App">
      <Router>
        <SideNav/>
        <OrderForm/>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
