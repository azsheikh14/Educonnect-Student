import React from 'react';
import { FaRegCopy } from "react-icons/fa";
import Image from 'next/image'; // Make sure to import Image from Next.js

const ReferAFriend = () => {
    return (
        <div className='bg-white rounded-lg p-4 border border-gray-200 flex items-center'>
            <div className='w-full'>
                <div className='flex items-center mb-2 justify-between w-full'>
                    <h3 className='text-xl font-semibold text-gray-800'>Refer a Friend</h3>
                    <FaRegCopy className='w-5 h-5 mr-4 cursor-pointer' />
                </div>
                <div className='flex justify-between items-center'>
                    <p className='text-md text-gray-700'>
                        Invite your friends and earn rewards!
                    </p>
                    <button className='text-black p-2 rounded-full'>
                    </button>
                </div>
            </div>
            <div className='flex justify-center'>
            
            </div>
        </div>
    );
};

export default ReferAFriend;
