import React from 'react';
import Student from '@/app/interfaces/Student';
import Image from 'next/image';
interface ProfileComponentProps {
    student: Student;
}

const MyProfile: React.FC<ProfileComponentProps> = ({ student }) => {
    return (
        <div className='p-6 bg-white border border-gray-200 rounded-lg'>
            <div className='flex justify-between items-center mb-3'>
                <p className='text-base font-semibold'>Profile</p>
            </div>
            <div className='flex flex-row mb-6 lg:flex-col lg:justify-start items-center custom-lg:flex-row'>
                {student.profilePic ?
                    <Image width={60} height={60} className="rounded-full object-cover bg-yellow-500" src={student?.profilePic} alt="Profile" onClick={() => document.getElementById('fileInput')?.click()} />
                    :
                    <Image width={60} height={60} className="rounded-full object-cover bg-yellow-500" src='/svg/noPic.svg' alt="Profile" onClick={() => document.getElementById('fileInput')?.click()} />
                }
                <div className='mr-3'>
                    <h2 className='text-lg font-bold leading-tight'>{student.name}</h2>
                    <p className='text-base font-medium text-gray-700'>Enrollment No: {student.enrollmentNumber}</p>
                </div>
            </div>

            <div className='mb-6'>
                <h3 className='text-base font-semibold mb-2'>Biography</h3>
                <p className='text-md text-gray-800 leading-relaxed mb-4'>
                    {student.bio || 'A dedicated student with a passion for learning and exploring new ideas. I strive to expand my knowledge across various subjects and embrace challenges that foster personal and academic growth.'}
                </p>
            </div>

            <div className='mb-6'>
                <h3 className='text-base font-semibold mb-2'>Courses Enrolled</h3>
                <ul className='list-disc space-y-1'>
                    <li className='text-md text-gray-800 flex items-center'>
                        <div className="w-6 mr-2 h-6 p-1 bg-blue-600 rounded-lg justify-center items-center inline-flex">
                            <div className="w-4 h-4 relative flex-col justify-start items-start inline-flex">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M13.7422 3.76655C14.0221 4.0115 14.0475 4.43822 13.7985 4.71458L6.78928 12.4944C6.53898 12.7722 6.10923 12.7899 5.83699 12.5336L1.78097 8.71524C1.52802 8.4771 1.50381 8.0803 1.72083 7.80904C1.96029 7.5097 2.40623 7.4685 2.69123 7.72484L5.83815 10.5554C6.11163 10.8014 6.53268 10.7794 6.77907 10.5063L12.8081 3.8217C13.052 3.55119 13.4681 3.52667 13.7422 3.76655Z" fill="white" />
                                </svg>
                            </div>
                        </div>
                        <p className='text-base font-semibold'>
                            Computer Science 101
                        </p>
                    </li>
                    <li className='text-md text-gray-800 flex items-center'>
                        <div className="w-6 mr-2 h-6 p-1 bg-blue-600 rounded-lg justify-center items-center inline-flex">
                            <div className="w-4 h-4 relative flex-col justify-start items-start inline-flex">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M13.7422 3.76655C14.0221 4.0115 14.0475 4.43822 13.7985 4.71458L6.78928 12.4944C6.53898 12.7722 6.10923 12.7899 5.83699 12.5336L1.78097 8.71524C1.52802 8.4771 1.50381 8.0803 1.72083 7.80904C1.96029 7.5097 2.40623 7.4685 2.69123 7.72484L5.83815 10.5554C6.11163 10.8014 6.53268 10.7794 6.77907 10.5063L12.8081 3.8217C13.052 3.55119 13.4681 3.52667 13.7422 3.76655Z" fill="white" />
                                </svg>
                            </div>
                        </div>
                        <p className='text-base font-semibold'>
                            Data Structures and Algorithms
                        </p>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default MyProfile;
