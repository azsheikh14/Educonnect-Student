'use client';
import React, { useState, useEffect } from 'react';
import { FaChevronRight, FaChevronLeft, FaAngleDoubleRight, FaAngleDoubleLeft } from "react-icons/fa";
import axios from 'axios';
import { useUserContext } from '../contexts/userContext';
import Class from '../interfaces/Class';

const UpcomingClasses = () => {
    const { userData } = useUserContext();
    const [upcomingClasses, setUpcomingClasses] = useState<Class[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());

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

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    const currentMonth = monthNames[currentDate.getMonth()];
    const currentYear = currentDate.getFullYear();

    const generateCalendarDays = () => {
        const days = [];
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
            days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
        }

        return days;
    };

    const calendarDays = generateCalendarDays();

    const handleMonthChange = (direction: number) => {
        const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + direction));
        setCurrentDate(newDate);
    };

    const handleMonthNameClick = () => {
        setCurrentDate(new Date());
    };

    const findNextMonthWithClasses = (direction: number) => {
        const newDate = new Date(currentDate);
        for (let i = 0; i < 12; i++) { // search within next or previous 12 months
            newDate.setMonth(newDate.getMonth() + direction);
            const monthClasses = upcomingClasses.filter(item => {
                const itemDate = Array.isArray(item.classDate) ? new Date(item.classDate[0]) : new Date(item.classDate);
                return itemDate.getMonth() === newDate.getMonth() && itemDate.getFullYear() === newDate.getFullYear();
            });
            if (monthClasses.length > 0) {
                setCurrentDate(newDate);
                break;
            }
        }
    };

    return (
        <div className="mb-6 flex flex-col justify-start items-start mx-auto md:w-full h-full">
            <div className="datepicker bg-white border-gray-200 border rounded-lg p-6 h-full w-full">
                <div className="datepicker-top mb-4">
                    <div className="btn-group flex justify-center mb-4 -mt-2 text-center">
                        <h2 className="text-2xl font-bold text-gray-900">Upcoming Classes</h2>
                    </div>
                    <div className="month-selector flex justify-between items-center">
                        <div className="flex items-center">
                            <button onClick={() => findNextMonthWithClasses(-1)} className="arrow flex items-center justify-center border-0 bg-white rounded-lg w-8 h-8 shadow mr-2">
                                <FaAngleDoubleLeft />
                            </button>
                            <button onClick={() => handleMonthChange(-1)} className="arrow flex items-center justify-center border-0 bg-white rounded-lg w-8 h-8 shadow">
                                <FaChevronLeft />
                            </button>
                        </div>
                        <span onClick={handleMonthNameClick} className="month-name font-semibold cursor-pointer">{`${currentMonth} ${currentYear}`}</span>
                        <div className="flex items-center">
                            <button onClick={() => handleMonthChange(1)} className="arrow flex items-center justify-center border-0 bg-white rounded-lg w-8 h-8 shadow mr-2">
                                <FaChevronRight />
                            </button>
                            <button onClick={() => findNextMonthWithClasses(1)} className="arrow flex items-center justify-center border-0 bg-white rounded-lg w-8 h-8 shadow">
                                <FaAngleDoubleRight />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="datepicker-calendar grid grid-cols-7 gap-1 flex-grow">
                    {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day, index) => (
                        <span key={index} className="day text-gray-500 text-sm font-medium text-center">{day}</span>
                    ))}
                    {calendarDays.map((day) => {
                        const classItem = upcomingClasses.find((item) => {
                            const itemDate = Array.isArray(item.classDate) ? new Date(item.classDate[0]) : new Date(item.classDate);
                            return itemDate.getDate() === day.getDate() && itemDate.getMonth() === day.getMonth() && itemDate.getFullYear() === day.getFullYear();
                        });
                        return (
                            <button key={day.toString()} className={`date border-0 w-[2.25rem] h-[2.25rem] flex items-center justify-center rounded-md font-semibold focus:outline-none ${classItem ? 'bg-blue-100 text-blue-800 border-blue-100' : 'bg-transparent text-gray-700 border-transparent'}`}>
                                {day.getDate()}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default UpcomingClasses;
