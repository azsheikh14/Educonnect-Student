import React, { useState } from 'react';
import { insertClasses } from '../services/classService';
import { toast } from 'react-toastify';
import { useUserContext } from '../contexts/userContext';
import { FaTrash } from 'react-icons/fa';

interface Row {
    date: string;
    startTime: string;
    endTime: string;
    name: string;
    email: string;
}

const AddScheduleModal: React.FC = () => {
    const [rows, setRows] = useState<Row[]>([{ date: '', startTime: '', endTime: '', name: '', email: '' }]);
    const { userData } = useUserContext();

    const addRow = () => {
        setRows([...rows, { date: '', startTime: '', endTime: '', name: '', email: '' }]);
    };

    const removeRow = (index: number) => {
        const newRows = rows.filter((_, rowIndex) => rowIndex !== index);
        setRows(newRows);
    };

    const handleChange = <T extends keyof Row>(index: number, field: T, value: Row[T]) => {
        const newRows = [...rows];
        newRows[index][field] = value;
        setRows(newRows);
    };

    const handleSubmit = async () => {
        try {
            const formattedClasses = rows
                .filter((row) => row.date && row.startTime && row.endTime && row.name && row.email)
                .map((row) => {
                    const timeSlot = `${row.startTime}-${row.endTime}`;
                    const classDate = row.date;
                    const dayOfWeek = new Date(classDate).toLocaleString('default', { weekday: 'long' });

                    return {
                        _id: '', // or generate a temporary id if needed
                        teacherProfilePic: '', // add actual value if available
                        studentProfilePic: '',
                        isNew: true,
                        studentId: '',
                        teacherId: userData?._id || '',
                        teacherName: userData?.name || '',
                        enrollmentNumber: '',
                        studentName: row.name,
                        slot: {
                            day: dayOfWeek,
                            slot: timeSlot,
                        },
                        classDate: classDate,
                        studentEmail: row.email,
                        status: '',
                        type: '',
                        subjects: [],
                        classes: [],
                        isConfirmed: false,
                        jitsiLink: '',
                        isConfirmedByStudent: false,
                        isConfirmedByTeacher: false,
                    };
                });

            const res = await insertClasses(formattedClasses);

            console.log('res :', res);
            if (res.duplicateCount > 0) {
                toast.warn(`${res.duplicateCount} students already existed. ${res.insertedCount} new classes were added.`);
            } else {
                toast.success(`${res.insertedCount} Classes added successfully.`);
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('An unknown error occurred');
            }
        }
    };

    const isSubmitDisabled = rows.every((row) => !row.date && !row.startTime && !row.endTime && !row.name && !row.email) || rows.some((row) => !row.date || !row.startTime || !row.endTime || !row.name || !row.email);

    return (
        <div className='p-4 bg-white rounded-xl h-[80vh] overflow-auto scrollbar-thin scrollbar-track-rounded scrollbar-thumb-rounded'>
            <p className='mb-4'>Use this tool to schedule classes for new students who don't have an account yet</p>
            <table className='w-full table-auto border-collapse rounded-lg overflow-hidden'>
                <thead>
                    <tr className='bg-gray-200'>
                        <th className='border px-4 py-2'>Class Date</th>
                        <th className='border px-4 py-2'>Start Time</th>
                        <th className='border px-4 py-2'>End Time</th>
                        <th className='border px-4 py-2'>Student Name</th>
                        <th className='border px-4 py-2'>Student Email</th>
                        <th className='border px-4 py-2'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={index} className='hover:bg-gray-50'>
                            <td className='border px-4 py-2'>
                                <input
                                    type='date'
                                    value={row.date}
                                    onChange={(e) => handleChange(index, 'date', e.target.value)}
                                    className='w-full bg-transparent border-none outline-none cursor-pointer'
                                />
                            </td>
                            <td className='border px-4 py-2'>
                                <input
                                    type='time'
                                    value={row.startTime}
                                    onChange={(e) => handleChange(index, 'startTime', e.target.value)}
                                    className='w-full bg-transparent border-none outline-none cursor-pointer'
                                />
                            </td>
                            <td className='border px-4 py-2'>
                                <input
                                    type='time'
                                    value={row.endTime}
                                    onChange={(e) => handleChange(index, 'endTime', e.target.value)}
                                    className='w-full bg-transparent border-none outline-none cursor-pointer'
                                />
                            </td>
                            <td className='border px-4 py-2'>
                                <input
                                    type='text'
                                    value={row.name}
                                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                                    className='w-full bg-transparent border-none outline-none'
                                />
                            </td>
                            <td className='border px-4 py-2'>
                                <input
                                    type='email'
                                    value={row.email}
                                    onChange={(e) => handleChange(index, 'email', e.target.value)}
                                    className='w-full bg-transparent border-none outline-none'
                                />
                            </td>
                            <td className='border px-4 py-2 text-center'>
                                <button onClick={() => removeRow(index)} className='text-red-500 hover:text-red-700'>
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-4 flex justify-between">
                <button onClick={addRow} className='px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all'>
                    Add Row
                </button>
                <button onClick={handleSubmit} disabled={isSubmitDisabled} className={`px-4 py-2 rounded-lg shadow-md transition-all ${isSubmitDisabled ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}>
                    Submit
                </button>
            </div>
        </div>
    );
};

export default AddScheduleModal;
