'use client'
// contexts/studentClassContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import Class from '@/app/interfaces/Class';
import { useUserContext } from '@/app/contexts/userContext';
import { getStudentClasses } from '../services/classService';

interface ClassContextType {
    classes: Class[];
    setClasses: React.Dispatch<React.SetStateAction<Class[]>>;
    fetchClasses: () => Promise<void>;
}

const ClassContext = createContext<ClassContextType | undefined>(undefined);

export const ClassProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { userData } = useUserContext();
    const [classes, setClasses] = useState<Class[]>([]);

    const fetchClasses = async () => {
        if (!userData) return;
        try {
            const response = await getStudentClasses(userData._id)
            setClasses(response);
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };

    useEffect(() => {
        if (userData) {
            fetchClasses();
        }
    }, [userData]);

    return (
        <ClassContext.Provider value={{ classes, setClasses, fetchClasses }}>
            {children}
        </ClassContext.Provider>
    );
};

export const useClassContext = () => {
    const context = useContext(ClassContext);
    if (!context) {
        throw new Error('useClassContext must be used within a ClassProvider');
    }
    return context;
};
