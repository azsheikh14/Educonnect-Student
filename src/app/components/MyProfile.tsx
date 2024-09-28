import React from 'react';
import Student from '@/app/interface/Student';

interface ProfileComponentProps {
    student: Student;
}

const MyProfile: React.FC<ProfileComponentProps> = ({ student }) => {
    return (
        <div className='h-full p-6 bg-white border border-gray-200 rounded-lg'>



            <div className='flex flex-row mb-6 lg:flex-col lg:justify-start custom-lg:flex-row'>
                <div className='w-24 h-24 rounded-full border-4 border-blue-500 shadow-lg flex items-center justify-center overflow-hidden mb-4 custom-md:mb-0 custom-md:mr-6'>
                    <img src='/path/to/profile-pic.jpg' alt='Profile'
                        className='w-full h-full rounded-full object-cover transition-transform duration-200 transform hover:scale-110' />
                </div>
                <div className='ml-2 custom-md:text-left ml-0 custom-md:ml-3 custom-md:mt-2'>
                    <h2 className='text-2xl font-bold text-gray-900 leading-tight'>{student.name}</h2>
                    <p className='text-md text-gray-700'>Student</p>
                    <p className='text-md text-gray-700'>Enrollment No: {student.enrollmentNumber}</p>
                </div>
            </div>



            <div className='mb-6'>
                <h3 className='text-xl font-semibold text-blue-600 mb-2'>Bio</h3>
                <p className='text-md text-gray-800 leading-relaxed mb-4'>
                    {student.bio || 'A dedicated student with a passion for learning and exploring new ideas. I strive to expand my knowledge across various subjects and embrace challenges that foster personal and academic growth.'}
                </p>
            </div>

            <div className='mb-6'>
                <h3 className='text-xl font-semibold text-blue-600 mb-2'>Courses Enrolled</h3>
                <ul className='list-disc pl-5 space-y-1'>
                    <li className='text-md text-gray-800'>Computer Science 101</li>
                    <li className='text-md text-gray-800'>Data Structures and Algorithms</li>
                </ul>
            </div>
        </div>
    );
};

export default MyProfile;
