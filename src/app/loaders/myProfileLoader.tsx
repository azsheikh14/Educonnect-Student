import React from 'react';

const MyProfileLoader = () => {
    return (
        <div className='w-[470px] h-[full] p-6 bg-white border border-gray-200 rounded-lg animate-pulse'>
            <div className='flex items-center mb-6'>
                <div className='w-24 h-24 rounded-full border-4 border-blue-500 shadow-lg flex items-center justify-center overflow-hidden mr-6 bg-gray-300'>
                    {/* Placeholder for profile picture */}
                </div>
                <div>
                    <div className='w-32 h-6 bg-gray-300 rounded mb-2'></div>
                    <div className='w-20 h-4 bg-gray-300 rounded'></div>
                </div>
            </div>

            <div className='mb-6'>
                <h3 className='text-xl font-semibold text-blue-600 mb-2'>Bio</h3>
                <div className='w-full h-4 bg-gray-300 rounded mb-2'></div>
                <div className='w-full h-3 bg-gray-300 rounded mb-4'></div>
            </div>

            <div className='mb-6'>
                <h3 className='text-xl font-semibold text-blue-600 mb-2'>Courses Enrolled</h3>
                <ul className='list-disc pl-5 space-y-1'>
                    <li className='w-3/4 h-4 bg-gray-300 rounded'></li>
                    <li className='w-3/4 h-4 bg-gray-300 rounded'></li>
                </ul>
            </div>
        </div>
    );
};

export default MyProfileLoader;
