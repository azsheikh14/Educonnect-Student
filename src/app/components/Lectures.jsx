import React, { use } from "react";
import { useUserContext } from '@/app/contexts/userContext';

const Lectures = () => {
  const { userData } = useUserContext();
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-700">Lectures</h2>
        <p
          onClick={() => { window.location.href = '/classes' }}
          className="text-[#76309B] text-sm font-medium hover:underline hover:text-[#5e247d] transition cursor-pointer"
        >
          View All →
        </p>
      </div>

      <div className="mt-4 space-y-3 text-sm text-gray-700">
        {userData && userData.classes && userData?.classes
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 8)
          .map((lec, index) => (
            <div key={index} className="flex justify-between">
              <span>{lec.subjects.join(', ')}</span>
              <span>
                {lec.slot.slot} - {lec.slot.day}
              </span>
            </div>
          ))}
      </div>
    </div>
  )
};

export default Lectures;
