import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import '../styles/layout.css';

const LayoutQAManager = () => {
  return (
    <div className="layout"> {/* Use the layout class from layout.css */}
      {/* Sidebar */}
      <nav className="side-nav"> {/* Use the side-nav class from layout.css */}
        <div className="p-6">
          <h2 className="text-3xl font-semibold mb-8">QA Manager</h2>
          <ul className="space-y-4">
            <li>
              <Link to="/incoming-batches" className="side-nav-link">Incoming Batches</Link> {/* Update to use custom styles */}
            </li>
            <li>
              <Link to="/add-qarecord" className="side-nav-link">Add QA Record</Link> {/* Update to use custom styles */}
            </li>
            <li>
              <Link to="/qa-records" className="side-nav-link">QA Records</Link> {/* Update to use custom styles */}
            </li>
            <li>
              <Link to="/qa-team" className="side-nav-link">QA Team</Link> {/* Update to use custom styles */}
            </li>
            <li>
              <Link to="/add-qaMember" className="side-nav-link">Add QA Member</Link> {/* Update to use custom styles */}
            </li>
          </ul>
        </div>
      </nav>

      {/* Content Area */}
      <main className="main-content"> {/* Use the main-content class from layout.css */}
        <Outlet />
      </main>
    </div>
  );
};

export default LayoutQAManager;
