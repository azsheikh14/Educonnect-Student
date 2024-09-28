import React from 'react';
import Link from 'next/link';
import Teacher from '@/app/interface/Teacher';
import { FaExternalLinkAlt } from 'react-icons/fa';

interface TeacherCardProps {
    teacher: Teacher;
}

const TeacherCard: React.FC<TeacherCardProps> = ({ teacher }) => {
    return (
        <div className="bg-white rounded-lg overflow-hidden p-6 w-full max-w-[350px] flex flex-col items-center border border-gray-200">
            <div className="flex flex-col items-center mb-4">
                <Link href={`/teacher?id=${teacher?._id}`}>
                    <img src={teacher?.profilePic || '/bijju.png'} className="w-40 h-40 rounded-full border-4 border-blue-600 shadow-md mb-4" alt={`${teacher.name}'s profile`} />
                </Link>
                <div className="relative w-full text-center flex items-center justify-center">
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
    );
};

export default TeacherCard;
