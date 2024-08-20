import './App.css';
import SideNav from './components/SideNav';
import {BrowserRouter as Router, Route} from "react-router-dom"

function App() {
  return (
    <Router>
    <div className="App">
      <SideNav/>

    </div>
    </Router>
  );
}

export default App;
