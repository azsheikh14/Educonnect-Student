import React from 'react';
import { FaChalkboardTeacher, FaCalendarAlt, FaCheckCircle, FaTasks, FaMedal, FaRegCommentDots } from 'react-icons/fa';

const Updates = () => {
    return (
        <div className='grid grid-cols-2 gap-4 h-[90%]'>
            <div className='bg-blue-100 p-4 rounded-lg shadow-sm text-center flex flex-col items-center justify-center'>
                <FaChalkboardTeacher className='text-blue-700 text-4xl mb-2' />
                <h4 className='text-lg font-semibold text-blue-700'>Classes Attended</h4>
                <p className='text-2xl font-bold text-blue-900 animate-pulse'>12</p>
            </div>
            <div className='bg-green-100 p-4 rounded-lg shadow-sm text-center flex flex-col items-center'>
                <FaCalendarAlt className='text-green-700 text-4xl mb-2' />
                <h4 className='text-lg font-semibold text-green-700'>Upcoming Classes</h4>
                <p className='text-2xl font-bold text-green-900 animate-pulse'>3</p>
            </div>
            <div className='bg-yellow-100 p-4 rounded-lg shadow-sm text-center flex flex-col items-center'>
                <FaCheckCircle className='text-yellow-700 text-4xl mb-2' />
                <h4 className='text-lg font-semibold text-yellow-700'>Completed Tasks</h4>
                <p className='text-2xl font-bold text-yellow-900 animate-pulse'>8</p>
            </div>
            <div className='bg-red-100 p-4 rounded-lg shadow-sm text-center flex flex-col items-center'>
                <FaTasks className='text-red-700 text-4xl mb-2' />
                <h4 className='text-lg font-semibold text-red-700'>Pending Tasks</h4>
                <p className='text-2xl font-bold text-red-900 animate-pulse'>5</p>
            </div>
            <div className='bg-purple-100 p-4 rounded-lg shadow-sm text-center flex flex-col items-center'>
                <FaMedal className='text-purple-700 text-4xl mb-2' />
                <h4 className='text-lg font-semibold text-purple-700'>Achievements</h4>
                <p className='text-2xl font-bold text-purple-900 animate-pulse'>4</p>
            </div>
            <div className='bg-pink-100 p-4 rounded-lg shadow-sm text-center flex flex-col items-center'>
                <FaRegCommentDots className='text-pink-700 text-4xl mb-2' />
                <h4 className='text-lg font-semibold text-pink-700'>Feedback</h4>
                <p className='text-2xl font-bold text-pink-900 animate-pulse'>23</p>
            </div>
        </div>
    );
}

export default Updates;
