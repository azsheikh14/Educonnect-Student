import React from 'react';
import { FaChalkboardTeacher, FaCalendarAlt, FaCheckCircle, FaTasks, FaMedal, FaRegCommentDots } from 'react-icons/fa';
import Student from '@/app/interface/Student'

interface UpdateComponentProps {
    student: Student;
}
const Updates: React.FC<UpdateComponentProps> = ({ student }) => {
    console.log('student :', student);
    return (
        <div className='grid grid-cols-2 gap-4 h-[90%]'>
            <div className='bg-blue-100 p-4 rounded-lg shadow-sm text-center flex flex-col items-center justify-center'>
                <FaChalkboardTeacher className='text-blue-700 text-4xl mb-2' />
                <h4 className='text-lg font-semibold text-blue-700'>Classes Attended</h4>
                <p className='text-2xl font-bold text-blue-900'>12</p>
            </div>
            <div className='bg-green-100 p-4 rounded-lg shadow-sm text-center flex flex-col items-center'>
                <FaCalendarAlt className='text-green-700 text-4xl mb-2' />
                <h4 className='text-lg font-semibold text-green-700'>Upcoming Classes</h4>
                <p className='text-2xl font-bold text-green-900'>3</p>
            </div>
            <div className='bg-yellow-100 p-4 rounded-lg shadow-sm text-center flex flex-col items-center'>
                <FaCheckCircle className='text-yellow-700 text-4xl mb-2' />
                <h4 className='text-lg font-semibold text-yellow-700'>Completed Tasks</h4>
                <p className='text-2xl font-bold text-yellow-900'>8</p>
            </div>
            <div className='bg-red-100 p-4 rounded-lg shadow-sm text-center flex flex-col items-center'>
                <FaTasks className='text-red-700 text-4xl mb-2' />
                <h4 className='text-lg font-semibold text-red-700'>Pending Tasks</h4>
                <p className='text-2xl font-bold text-red-900'>5</p>
            </div>
            <div className='bg-purple-100 p-4 rounded-lg shadow-sm text-center flex flex-col items-center'>
                <FaMedal className='text-purple-700 text-4xl mb-2' />
                <h4 className='text-lg font-semibold text-purple-700'>Achievements</h4>
                <p className='text-2xl font-bold text-purple-900'>4</p>
            </div>
            <div className='bg-pink-100 p-4 rounded-lg shadow-sm text-center flex flex-col items-center'>
                <FaRegCommentDots className='text-pink-700 text-4xl mb-2' />
                <h4 className='text-lg font-semibold text-pink-700'>Feedback</h4>
                <p className='text-2xl font-bold text-pink-900'>23</p>
            </div>
        </div>
    );
}

export default Updates;
