import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Attendance = () => {
  const data = {
    labels: ["Present", "Absent", "Leaves"],
    datasets: [
      {
        data: [85, 10, 5],
        backgroundColor: ["#7e22ce", "#c084fc", "#ddd6fe"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: "70%",
    plugins: {
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Attendance</h2>
        
      </div>

      {/* Legend */}
      <div className="flex justify-around text-sm font-medium mb-4">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-[#7e22ce]"></span>
          <span>Present</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-[#c084fc]"></span>
          <span>Absent</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-[#ddd6fe]"></span>
          <span>Leaves</span>
        </div>
      </div>

      {/* Doughnut Chart with Centered Text */}
      <div className="relative h-52 w-full">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-purple-700">
          85%
        </div>
      </div>
    </div>
  );
};

export default Attendance;
