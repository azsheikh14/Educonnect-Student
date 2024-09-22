'use client'
// context/UserContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getDataFromToken } from '../utils/getDataFromToken';
import axios from 'axios';
import Student from '@/app/interface/Student'; // Import your Student type

interface UserContextType {
  userData: Student | null; // Change to your actual user data type
  setUserData: React.Dispatch<React.SetStateAction<Student | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<Student | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await getDataFromToken();
        if (userId) {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          const response = await axios.post(`${apiUrl}/student/getStudent/${userId}`);
          setUserData(response.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
