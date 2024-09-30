import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';

export default function InventoryDashboard() {
    const [staffCount, setStaffCount] = useState(0);
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        // Fetch staff count
        const fetchStaffCount = async () => {
            try {
                const response = await axios.get('http://localhost:3001/staff/all-staff');
                setStaffCount(response.data.staffMembers.length);
            } catch (error) {
                console.error('Error fetching staff count:', error);
            }
        };

        fetchStaffCount();
    }, []);

    return (
      <div className="flex flex-col gap-4 p-6 max-w-md">
          <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-bold mb-4">Registered Staff Members</h2>
              <p className="text-2xl">{staffCount}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-bold mb-4">Calendar</h2>
              <Calendar onChange={setDate} value={date} />
          </div>
      </div>
  );
};

