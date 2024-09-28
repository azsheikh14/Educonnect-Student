'use client';
import React, { useState, useEffect } from 'react';
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import ReferAFriend from './ReferAFriend';
import TakeQuiz from './TakeQuiz';
import axios from 'axios';
import { useUserContext } from '../contexts/userContext';
import Class from '../interface/Class';

const UpcomingClasses = () => {
    const { userData } = useUserContext();
    const [upcomingClasses, setUpcomingClasses] = useState<Class[]>([]);

    useEffect(() => {
        const fetchUpcomingClasses = async () => {
            if (!userData?._id) return;
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const response = await axios.post(`${apiUrl}/class/upcomingClasses`, {
                    studentId: userData._id
                });
                setUpcomingClasses(response.data.upcomingClasses);
            } catch (error) {
                console.error('Error fetching upcoming classes:', error);
            }
        };

        fetchUpcomingClasses();
    }, [userData?._id]);

    const today = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    const currentMonth = monthNames[today.getMonth()];
    const currentYear = today.getFullYear();

    const generateCalendarDays = () => {
        const days = [];
        const totalDays = 30;

        for (let i = 0; i < totalDays; i++) {
            const currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);
            days.push(currentDate);
        }

        return days;
    };

    const calendarDays = generateCalendarDays();

    return (
        <div className="mb-6 flex flex-col justify-start items-start mt-3 h-full mx-auto w-[95%] md:w-full">
            <div className="datepicker bg-white border-gray-200 border rounded-lg p-6 mb-3 w-full">
                <div className="datepicker-top mb-4">
                    <div className="btn-group flex justify-center mb-4 -mt-2 text-center">
                        <h2 className="text-2xl font-bold text-gray-900">Upcoming Classes</h2>
                    </div>
                    <div className="month-selector flex justify-between items-center">
                        <button className="arrow flex items-center justify-center border-0 bg-white rounded-lg w-8 h-8 shadow">
                            <FaChevronLeft />
                        </button>
                        <span className="month-name font-semibold">{`${currentMonth} ${currentYear}`}</span>
                        <button className="arrow flex items-center justify-center border-0 bg-white rounded-lg w-8 h-8 shadow">
                            <FaChevronRight />
                        </button>
                    </div>
                </div>
                <div className="datepicker-calendar grid grid-cols-7 gap-4">
                    {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day, index) => (
                        <span key={index} className="day text-gray-500 text-sm font-medium text-center">{day}</span>
                    ))}
                    {calendarDays.map((day) => {
                        const classItem = upcomingClasses.find((item) =>
                            new Date(item.date).toISOString().split('T')[0] === day.toISOString().split('T')[0]
                        );
                        return (
                            <button
                                key={day.toISOString()}
                                className={`date border-0 w-[2.25rem] h-[2.25rem] flex items-center justify-center rounded-md font-semibold focus:outline-none ${classItem
                                    ? 'bg-blue-100 text-blue-800 border-blue-100'
                                    : 'bg-transparent text-gray-700 border-transparent'
                                    }`}
                            >
                                {day.getDate()}
                            </button>
                        );
                    })}
                </div>
                <div className="mt-4">
                    {upcomingClasses.map((classItem) => (
                        <div key={`${classItem._id}-${classItem.slot.slot}-${new Date(classItem.date).toISOString().split('T')[0]}`} className="flex items-center justify-between mb-2 p-2 border-b border-gray-200">
                            <span className="font-medium text-gray-700">{classItem.teacherName}</span>
                            <span className="text-sm text-gray-500">{new Date(classItem.date).toLocaleDateString()} - {classItem.slot.slot}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-col sm:gap-4 ml-1 w-full">
                <div className="mb-3">
                    <ReferAFriend />
                </div>
                <div className="mb-3">
                    <TakeQuiz />
                </div>
            </div>
        </div>
    );
};

export default UpcomingClasses;
