import React, { useEffect, useState } from "react";
import { useUserContext } from '../contexts/userContext';

const WelcomeBanner = () => {
  const { userData } = useUserContext();

  return (
    <div className="bg-white p-6 rounded-xl shadow flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold">
          Welcome back, <span className="text-[#76309B]">{userData?.name}</span>
        </h2>
        <p className="text-gray-500 mt-2">
          Your Progress is <span className="text-[#76309B] font-medium">excellent</span>, keep it up!
        </p>
      </div>
    </div>
  );
};

export default WelcomeBanner;
