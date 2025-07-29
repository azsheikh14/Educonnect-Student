'use client';
import React, { useState } from 'react';
import { useClassContext } from '../contexts/studentClassContext';
import Class from '../interfaces/Class';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClassModal from '@/app/modal/classModal';

const Timetable: React.FC = () => {
    const { classes } = useClassContext();
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    const [selectedClass, setSelectedClass] = useState<Class[]>([]);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => <div key={`empty-${i}`} className='w-full h-full'></div>);

    const openClassModal = (classSlots: Class[]) => {
        setSelectedClass(classSlots.length > 0 ? classSlots : []);
        setModalIsOpen(true);
    };

    const closeClassModal = () => {
        setSelectedClass([]);
        setModalIsOpen(false);
    };

    const changeMonth = (offset: number) => {
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    };

    return (
        <div className='p-4'>
            <div className='w-full flex items-center justify-between mb-4'>
                <p className='text-lg font-medium'>Timetable</p>
            </div>

            <div className='bg-white w-full rounded-xl h-[80vh]'>
                <div>
                    <div className='flex justify-between items-center w-full px-6 py-3 h-[10%]'>
                        <button onClick={() => changeMonth(-1)} className='cursor-pointer text-gray-700 py-1 px-3 rounded-full text-sm font-medium bg-gray-100 flex items-center'>
                            <FaChevronLeft className='mr-1' /> Prev
                        </button>
                        <div className='text-lg font-medium cursor-pointer' onClick={() => setCurrentMonth(new Date())}>
                            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </div>
                        <button onClick={() => changeMonth(1)} className='cursor-pointer text-gray-700 py-1 px-3 rounded-full text-sm font-medium bg-gray-100 flex items-center'>
                            Next <FaChevronRight className='ml-1' />
                        </button>
                    </div>
                    <div className='grid grid-cols-7 h-[90%] space-x-2 space-y-2 '>
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                            <div key={index} className='font-bold h-20 flex items-center justify-center'>{day}</div>
                        ))}
                        {emptyDays}
                        {daysArray.map((day) => {
                            const dayClasses = classes.filter(classSlot => {
                                if (Array.isArray(classSlot.classDate)) {
                                    return classSlot.classDate.some(dateString => {
                                        const classDate = new Date(dateString);
                                        return classDate.getUTCDate() === day &&
                                            classDate.getUTCMonth() === currentMonth.getMonth() &&
                                            classDate.getUTCFullYear() === currentMonth.getFullYear();
                                    });
                                } else {
                                    const classDate = new Date(classSlot.classDate);
                                    return classDate.getUTCDate() === day &&
                                        classDate.getUTCMonth() === currentMonth.getMonth() &&
                                        classDate.getUTCFullYear() === currentMonth.getFullYear();
                                }
                            });

                            const isToday = day === new Date().getDate() &&
                                currentMonth.getMonth() === new Date().getMonth() &&
                                currentMonth.getFullYear() === new Date().getFullYear();

                            const cursorClass = dayClasses.length > 0 ? 'cursor-pointer' : '';
                            const highlightClass = dayClasses.some(cls => cls?.isNew) ? 'bg-green-200' : '';

                            return (
                                <div
                                    key={day}
                                    className={`space-y-2 space-x-2 flex flex-col items-center justify-center h-[calc((80vh-140px)/6)] relative ${isToday ? 'bg-yellow-400 rounded-lg' : dayClasses.length > 0 ? `bg-blue-100 rounded-lg ${highlightClass}` : ''} ${cursorClass}`}
                                    onClick={() => {
                                        if (dayClasses.length > 0) {
                                            openClassModal(dayClasses);
                                        }
                                    }}
                                >
                                    <div className='text-lg'>{day}</div>
                                    {dayClasses.length > 0 && (
                                        <div className='text-xs font-light text-center'>
                                            <div className='text-[8px]'>{dayClasses[0].slot.slot}</div>
                                            {dayClasses.length > 1 && (
                                                <div className='text-[8px] text-gray-500'>
                                                    +{dayClasses.length - 1} more
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
            <ClassModal isOpen={modalIsOpen} onRequestClose={closeClassModal} selectedClasses={selectedClass} />

        </div>
    );
};

export default Timetable;
