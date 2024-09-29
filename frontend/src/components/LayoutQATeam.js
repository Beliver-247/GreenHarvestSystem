import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const LayoutQATeam = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <nav className="w-52 bg-[#11532F] text-white fixed h-full p-5 z-50">
        <h2 className="text-3xl font-semibold mb-8">QA Team</h2>
        <ul className="space-y-4">
          <li>
            <Link to="/qa-team/add-qarecord" className="block px-4 py-2 rounded-lg hover:bg-green-500 transition duration-300">Add QA Record</Link>
          </li>
          <li>
            <Link to="/qa-team/qa-records" className="block px-4 py-2 rounded-lg hover:bg-green-500 transition duration-300">QA Records</Link>
          </li>
          <li>
            <Link to="/qa-team/incoming-batches" className="block px-4 py-2 rounded-lg hover:bg-green-500 transition duration-300">Incoming Batches</Link>
          </li>
        </ul>
      </nav>

      {/* Content Area */}
      <main className="ml-56 p-6 flex-grow bg-white h-full overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default LayoutQATeam;
