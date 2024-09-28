import React from 'react';

const TeacherCVLoader: React.FC = () => {
    return (
        <div className="min-h-screen flex mx-auto p-5">
            <div className="w-[1.5/5] bg-gray-700 text-white flex flex-col items-center animate-pulse">
                <div className="h-[340px] bg-gray-600 w-full mb-3" /> {/* Profile Picture Placeholder */}
                <div className='w-full px-2 text-center py-4'>
                    <div className="h-8 bg-gray-600 rounded mb-3" /> {/* Name Placeholder */}
                    <div className="h-5 bg-gray-500 rounded" /> {/* Job Title Placeholder */}
                </div>
                <div className="text-left w-full px-5 py-3 mt-3">
                    <div className='mb-8'>
                        <h3 className="font-bold mb-1">TEACHING SUBJECTS</h3>
                        <ul className="list-disc list-inside mb-2 space-y-3">
                            {[...Array(3)].map((_, index) => (
                                <li key={index} className="h-4 bg-gray-500 rounded w-3/4" /> // Placeholder for subjects
                            ))}
                        </ul>
                    </div>
                    <div className='mb-8'>
                        <h3 className="font-bold mb-1">INNOVATIVE TEACHING METHODS</h3>
                        <ul className="list-disc list-inside mb-2 space-y-3">
                            {[...Array(3)].map((_, index) => (
                                <li key={index} className="h-4 bg-gray-500 rounded w-3/4" /> // Placeholder for teaching methods
                            ))}
                        </ul>
                    </div>
                    <div className='mb-8'>
                        <h3 className="font-bold mb-2">LANGUAGES</h3>
                        <ul className="list-disc list-inside mb-4 space-y-3">
                            {[...Array(3)].map((_, index) => (
                                <li key={index} className="h-4 bg-gray-500 rounded w-3/4" /> // Placeholder for languages
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="bg-orange-500 flex-1">
                <div className='bg-gray-300 py-3'>
                    <div className="mb-8 ml-32">
                        <h3 className="text-xl font-bold mb-3">PROFILE</h3>
                        <div className='h-6 bg-gray-500 rounded w-4/5' /> {/* Bio Placeholder */}
                    </div>
                    <div className="mb-2 flex">
                        <div className="relative flex-none w-32">
                            <h3 className="text-2xl font-bold rotate-[270deg] absolute top-1/2 left-0 transform -translate-y-1/2 whitespace-nowrap">
                                EDUCATION
                            </h3>
                        </div>
                        <div className="">
                            {[...Array(3)].map((_, index) => (
                                <div key={index} className="mb-4">
                                    <div className="h-5 bg-gray-500 rounded mb-1" /> {/* Year Placeholder */}
                                    <div className="h-4 bg-gray-500 rounded" /> {/* Degree Placeholder */}
                                    <div className="h-4 bg-gray-500 rounded" /> {/* Institution Placeholder */}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex py-5 bg-white">
                    <div className="relative flex-none w-32">
                        <h3 className="text-2xl font-bold rotate-[270deg] absolute top-48 left-0 transform -translate-y-1/2 whitespace-nowrap">
                            EXPERIENCE
                        </h3>
                    </div>
                    <div className="">
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="mb-4">
                                <div className="h-5 bg-gray-500 rounded mb-1" /> {/* Year Placeholder */}
                                <div className="h-4 bg-gray-500 rounded mb-1" /> {/* Position Placeholder */}
                                <div className="h-4 bg-gray-500 rounded mb-1" /> {/* Company Placeholder */}
                                <div className="h-4 bg-gray-500 rounded" /> {/* Description Placeholder */}
                            </div>
                        ))}
                    </div>
                </div>
                <div className='text-white px-16 py-4'>
                    <h3 className="text-2xl font-bold mb-4">CONTACT</h3>
                    <div className="flex items-center mb-2">
                        <div className="h-4 bg-gray-500 rounded w-1/2" /> {/* Email Placeholder */}
                    </div>
                    <div className="flex items-center mb-2">
                        <div className="h-4 bg-gray-500 rounded w-1/2" /> {/* Phone Placeholder */}
                    </div>
                    <div className="flex items-center">
                        <div className="h-4 bg-gray-500 rounded w-1/2" /> {/* Website Placeholder */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TeacherCVLoader;
