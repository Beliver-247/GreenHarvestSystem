import React from 'react';
import { Link } from 'react-router-dom';
import './SideNav.css';  // This is the CSS file for styling

export default function SideNav() {
    return (
        <div className="side-nav">
            <div className="side-nav-content">
                <h3 className="side-nav-header">Notifications</h3>
                <ul className="nav-list">
                    <li>
                        <Link to="/dashboard" className="nav-link">
                            <button className="nav-button">DASHBOARD</button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/notifications" className="nav-link">
                            <button className="nav-button">NOTIFICATIONS</button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/qa-records" className="nav-link">
                            <button className="nav-button">QA RECORDS</button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/qa-team" className="nav-link">
                            <button className="nav-button">QA TEAM</button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/add" className="nav-link">
                            <button className="nav-button add-button">ADD QA RECORD</button>
                        </Link>
                    </li>
                </ul>
                <div className="logout-section">
                    <button className="logout-button">Logout</button>
                </div>
            </div>
        </div>
    );
}
