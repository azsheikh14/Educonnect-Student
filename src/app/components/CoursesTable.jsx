import React from "react";
import { useUserContext } from '@/app/contexts/userContext';

const CoursesTable = () => {
  const { userData } = useUserContext();
  return (
    <div className="bg-white p-6 rounded-xl shadow-md overflow-auto">
      {/* Header Row */}
      <div className="grid grid-cols-5 text-gray-500 text-sm font-semibold border-b pb-2 text-left">
        <div>Index</div>
        <div>Semester</div>
        <div>Marks</div>
        <div>Subject</div>
      </div>

      {/* Data Rows */}
      {userData?.results.map((c, i) => (
        <div
          key={i}
          className="grid grid-cols-5 text-sm items-center text-left py-2 border-b last:border-b-0"
        >
          <div>{i}</div>
          <div>{c.semester}</div>
          <div>{c.marks}</div>
          <div>{c.subject}</div>
        </div>
      ))}
    </div>
  )
};

export default CoursesTable;
