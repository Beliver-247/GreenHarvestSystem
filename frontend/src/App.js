import './App.css';
import SideNav from './components/SideNav';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LayoutVFManager from './components/LayoutVFManager';
import LayoutDriver from './components/LayoutDriver';

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
