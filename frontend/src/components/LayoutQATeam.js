import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import '../styles/layout.css';

const LayoutQATeam = () => {
  return (
    <div className="layout">
      {/* Sidebar */}
      <nav className="side-nav">
        <div className="p-6">
          <h2 className="text-3xl font-semibold mb-8">QA Team</h2>
          <ul className="space-y-4">
            <li>
              <Link to="/add-qarecord" className="block px-4 py-2 rounded-lg hover:bg-green-500">Add QA Record</Link>
            </li>
            <li>
              <Link to="/qa-records" className="block px-4 py-2 rounded-lg hover:bg-green-500">QA Records</Link>
            </li>
            <li>
              <Link to="/incoming-batches" className="block px-4 py-2 rounded-lg hover:bg-green-500">Incoming Batches</Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Content Area */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default LayoutQATeam;
