'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserContext } from '../contexts/userContext';
import Class from '../interface/Class';
import { FaRegCommentDots } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useChatContext } from '../contexts/chatContext';
import { useRouter } from 'next/navigation';

const Classes = () => {
    const [classes, setClasses] = useState<Class[]>([]);
    const [filter, setFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('date'); // Default sorting by date
    const { userData } = useUserContext();
    const { setCurrentChat } = useChatContext();
    const router = useRouter()

    useEffect(() => {
        console.log('filter :', filter);
        const fetchClasses = async () => {
            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/class/getStudentClasses/${userData?._id}`);
                setClasses(response.data);
            } catch (error) {
                console.error('Error fetching classes:', error);
            }
        };

        fetchClasses();
    }, [userData]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleResendConfirmation = async (classId: string) => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/class/resendConfirmation/${classId}`);
            toast.success('Confirmation email resent successfully!');
        } catch (error) {
            console.error('Error resending confirmation:', error);
            toast.error('Failed to resend confirmation email.');
        }
    };

    const handleMessageTeacher = (teacherId: string, teacherName: string) => {
        setCurrentChat({ teacherId: teacherId, teacherName: teacherName, lastMessage: '' });
        router.push('/messages');
    };

    const filteredClasses = classes.filter((cls) =>
        cls.teacherName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedClasses = filteredClasses.sort((a, b) => {
        if (sortOption === 'date') {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        return a.teacherName.localeCompare(b.teacherName);
    });

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Your Classes</h1>

            <div className="mb-4 flex flex-col md:flex-row justify-between items-center">
                <select className="border rounded p-2 mb-2 md:mb-0 md:w-1/4" onChange={(e) => setFilter(e.target.value)}>
                    <option value="">All Categories</option>
                    <option value="math">Math</option>
                    <option value="science">Science</option>
                </select>
                <input
                    type="text"
                    placeholder="Search Classes..."
                    className="border rounded p-2 w-full md:w-1/2"
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <select className="border rounded p-2 ml-2" onChange={(e) => setSortOption(e.target.value)}>
                    <option value="date">Sort by Date</option>
                    <option value="teacher">Sort by Teacher</option>
                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedClasses.map((cls) => (
                    <div key={cls._id} className="bg-white border-4 border-gray-700 rounded-lg p-6 relative overflow-hidden transition duration-300">
                        <div className="bg-gray-100 absolute inset-0 rounded-lg opacity-50" style={{ zIndex: -1 }}></div>
                        <img
                            src="/hangingStudent.png"
                            alt="Hanging Student"
                            className="absolute top-2 right-2 h-36 transform -translate-y-4"
                            style={{ zIndex: 10 }}
                        />
                        <h2 className="text-xl font-bold text-black chalk-text">{cls.teacherName}</h2>
                        <p className="chalk-text"><strong>Day:</strong> {cls.slot.day}</p>
                        <p className="chalk-text"><strong>Slot:</strong> {cls.slot.slot}</p>
                        <p className="chalk-text"><strong>Date:</strong> {new Date(cls.classDate).toLocaleDateString()}</p>
                        <p className="chalk-text"><strong>Type:</strong> {cls.type}</p>
                        <p className="chalk-text"><strong>Status:</strong> {cls.isConfirmedByStudent ? 'Confirmed' : 'Pending'}</p>
                        <p className="chalk-text"><strong>Notes:</strong> {cls.notes || 'No notes available'}</p>
                        <div className="flex justify-between items-center mt-4">
                            {cls.isConfirmed ?
                                <button onClick={() => handleResendConfirmation(cls._id)} className="bg-blue-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300" >
                                    Class Confirmed
                                </button>
                                :
                                <button onClick={() => handleResendConfirmation(cls._id)} className="bg-blue-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300" >
                                    Resend Confirmation Email
                                </button>
                            }
                            <FaRegCommentDots
                                onClick={() => handleMessageTeacher(cls.teacherId, cls.teacherName)}
                                className="text-blue-600 cursor-pointer h-6 w-6"
                                title="Message Teacher"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Classes;
