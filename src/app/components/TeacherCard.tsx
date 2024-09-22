import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Teacher from '@/app/interface/Teacher';
import { FaExternalLinkAlt } from 'react-icons/fa';
import axios from 'axios';

const TeacherCard = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);

    useEffect(() => {
        const fetchTeachers = async () => {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const response = await axios.post(`${apiUrl}/teacher/getAllTeachers`);
            setTeachers(response.data);
        };

        fetchTeachers();
    }, []);

    return (
        <div className="p-6 min-h-screen flex flex-col items-center">
            <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">Meet Our Teachers</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teachers.map((teacher) => (
                    <div key={teacher._id} className="bg-white rounded-lg overflow-hidden p-6 w-full max-w-[350px] flex flex-col items-center border border-gray-200">
                        <div className="flex flex-col items-center mb-4">
                            <Link href={`/teacher?id=${teacher._id}`}>
                                <img src={teacher.profilePic || '/bijju.png'} className="w-40 h-40 rounded-full border-4 border-blue-600 shadow-md mb-4" alt={`${teacher.name}'s profile`} />
                            </Link>
                            <div className="relative w-full text-center flex items-center">
                                <Link href={`/teacher?id=${teacher._id}`}>
                                    <h2 className="text-2xl font-bold text-gray-900 cursor-pointer">{teacher.name.toUpperCase()}</h2>
                                </Link>
                                <Link href={`/teacher?id=${teacher._id}`}>
                                    <span className="flex items-center text-gray-600 hover:text-blue-600 cursor-pointer ml-3" aria-label="Visit Profile">
                                        <FaExternalLinkAlt className="w-5 h-5" />
                                    </span>
                                </Link>
                            </div>
                            <div className='text-center'>
                                <p className="text-gray-700 cursor-pointer">{teacher.title}</p>
                                <p className="text-gray-600">Experience: {teacher.experienceYears} years</p>
                            </div>

                            <span className="flex items-center text-yellow-500 mb-2">
                                {teacher.rating ? (
                                    <>
                                        <span className="text-lg">{teacher.rating} ★</span>
                                        <span className="text-sm ml-1">Rated</span>
                                    </>
                                ) : (
                                    <span className="text-sm">Not rated</span>
                                )}
                            </span>
                        </div>
                        <div className="border-t-2 border-gray-300 text-left mb-4">
                            {teacher.subjects && teacher.subjects.length > 0 && (
                                <>
                                    <h3 className="font-semibold text-gray-800 mt-4">Subjects:</h3>
                                    <div className="flex flex-wrap mt-2">
                                        {teacher.subjects.map((subject, index) => (
                                            <span key={index} className="bg-green-100 text-green-600 text-sm font-medium px-3 py-1 rounded-full mr-2 mb-2">
                                                {subject}
                                            </span>
                                        ))}
                                    </div>
                                </>
                            )}
                            {teacher.innovativeLearning && teacher.innovativeLearning.length > 0 && (
                                <>
                                    <h3 className="font-semibold text-gray-800 mt-4">Teaching Method:</h3>
                                    <div className="flex flex-wrap mt-2">
                                        {teacher.innovativeLearning.map((learning, index) => (
                                            <span key={index} className="bg-blue-100 text-blue-600 text-sm font-medium px-3 py-1 rounded-full mr-2 mb-2">
                                                {learning}
                                            </span>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeacherCard;
