import React from 'react';
import Link from 'next/link';
import Teacher from '@/app/interfaces/profile';

interface TeacherCardProps {
    teacher: Teacher;
}

const TeacherCard: React.FC<TeacherCardProps> = ({ teacher }) => {
    return (
        <div className="bg-white rounded-lg overflow-hidden p-6 w-full max-w-[350px] flex flex-col items-center border border-gray-200">
            <div className="flex flex-col w-full mb-4">
                <div className='flex justify-start'>
                    <Link href={`/teacher?id=${teacher._id}`} className="w-12 h-12 rounded-full mb-4 overflow-hidden">
                        <img src={teacher?.profilePic || '/svg/noPic.svg'} alt={`${teacher.name}'s profile`} className="w-[20] h-[20] object-cover aspect-square rounded-full" />
                    </Link>

                    <div className="relative w-full text-center flex flex-col items-start justify-start ml-3">
                        <Link href={`/teacher?id=${teacher._id}`}>
                            <h2 className="text-lg font-bold text-gray-900 cursor-pointer">{teacher.name.toUpperCase()}</h2>
                        </Link>
                        <p className="text-sm text-gray-600">{teacher.experienceYears} years Experience</p>
                        {/* <Link href={`/teacher?id=${teacher._id}`}>
                            <span className="flex items-center text-gray-600 hover:text-blue-600 cursor-pointer ml-3" aria-label="Visit Profile">
                                <FaExternalLinkAlt className="w-5 h-5" />
                            </span>
                        </Link> */}
                    </div>
                </div>
                {/* <div className='text-center'>
                    <p className="text-gray-700 cursor-pointer">{teacher.title || 'das'}</p>
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
                </span> */}
            </div>
            <div className="border-t-2 border-gray-200 mb-4 w-full">
                {teacher.subjects && teacher.subjects.length > 0 && (
                    <>
                        <h3 className="font-semibold text-gray-800 mt-4">Subjects:</h3>
                        <div className="flex flex-wrap mt-2">
                            {teacher.subjects.map((subject, index) => (
                                <div key={index}>
                                    <div className="border border-gray-200 text-sm font-medium px-3 py-2 rounded-full mr-2 mb-2 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <g clip-path="url(#clip0_17624_28008)">
                                                <path d="M9.96625 12.3828C9.96625 12.1444 10.2142 11.8772 10.2989 11.8043L1.40622 11.2891C0.630813 11.2891 0.3125 11.6074 0.3125 12.3828C0.3125 13.1582 0.630813 13.4765 1.40622 13.4765L10.301 12.9631C10.2142 12.8883 9.96625 12.6212 9.96625 12.3828Z" fill="#E6FFFF" />
                                                <path d="M10.2985 11.8033L5.2334 11.5098V13.2545L10.3006 12.962C10.2138 12.8873 9.96587 12.6202 9.96587 12.3817C9.9659 12.1433 10.2138 11.8762 10.2985 11.8033Z" fill="#CBF0FF" />
                                                <path d="M1.40625 11.9132H1.95172L3.32288 12.2257L4.76416 11.9132H9.99753C10.2564 11.9132 10.4663 11.7033 10.4663 11.4444V0.886719C10.4663 0.627844 10.2564 0.417969 9.99753 0.417969H1.40625C0.630844 0.417969 0 1.04881 0 1.82422V12.382C0 13.1574 0.630844 13.7882 1.40625 13.7882H9.99753C10.2564 13.7882 10.4663 13.5783 10.4663 13.3195C10.4663 13.0606 10.2564 12.8507 9.99753 12.8507H1.40625C1.14778 12.8507 0.9375 12.6404 0.9375 12.382C0.9375 12.1235 1.14778 11.9132 1.40625 11.9132Z" fill="#78B4FF" />
                                                <path d="M9.99715 12.8516H5.2334V13.7891H9.99712C10.256 13.7891 10.4659 13.5792 10.4659 13.3203C10.4659 13.0614 10.256 12.8516 9.99715 12.8516Z" fill="#6299F7" />
                                                <path d="M9.99715 0.417969H5.2334V11.9132H9.99712C10.256 11.9132 10.4659 11.7033 10.4659 11.4445V0.886719C10.4659 0.627813 10.256 0.417969 9.99715 0.417969Z" fill="#6299F7" />
                                                <path d="M7.18484 2.29297H3.28125C3.02237 2.29297 2.8125 2.50284 2.8125 2.76172V4.63684C2.8125 4.89572 3.02237 5.10559 3.28125 5.10559H7.18484C7.44372 5.10559 7.65359 4.89572 7.65359 4.63684V2.76172C7.65359 2.50284 7.44372 2.29297 7.18484 2.29297Z" fill="#E6FFFF" />
                                                <path d="M4.76409 6.98047H3.28125C3.02237 6.98047 2.8125 6.77059 2.8125 6.51172C2.8125 6.25284 3.02237 6.04297 3.28125 6.04297H4.76409C5.02297 6.04297 5.23284 6.25284 5.23284 6.51172C5.23284 6.77059 5.02297 6.98047 4.76409 6.98047Z" fill="#E6FFFF" />
                                                <path d="M1.95215 11.9141V14.4661C1.95215 14.6168 2.02459 14.7583 2.1468 14.8463C2.26902 14.9344 2.42624 14.9584 2.56915 14.9108L3.35837 14.6477L4.14759 14.9108C4.19602 14.9269 4.24602 14.9348 4.2958 14.9348C4.39296 14.9348 4.48909 14.9046 4.5699 14.8463C4.69212 14.7583 4.76455 14.6168 4.76455 14.4661V11.9141H1.95215Z" fill="#FF9B8B" />
                                                <path d="M4.49759 8.85547H3.28125C3.02237 8.85547 2.8125 8.64559 2.8125 8.38672C2.8125 8.12784 3.02237 7.91797 3.28125 7.91797H4.49759C4.75647 7.91797 4.96634 8.12784 4.96634 8.38672C4.96634 8.64559 4.75647 8.85547 4.49759 8.85547Z" fill="#E6FFFF" />
                                                <path d="M7.18452 2.29297H5.2334V5.10559H7.18452C7.4434 5.10559 7.65327 4.89572 7.65327 4.63684V2.76172C7.65327 2.50284 7.4434 2.29297 7.18452 2.29297Z" fill="#CBF0FF" />
                                                <path d="M15.8627 13.4531L13.5508 11.1412C13.4484 11.0388 13.3043 10.9895 13.1607 11.0076C13.017 11.0257 12.8897 11.1093 12.816 11.2339C12.5336 11.7111 12.132 12.1127 11.6548 12.3951C11.5302 12.4688 11.4466 12.5961 11.4285 12.7398C11.4104 12.8835 11.4597 13.0275 11.5621 13.1299L13.874 15.4418C13.9619 15.5297 14.0812 15.5791 14.2055 15.5791C14.3298 15.5791 14.449 15.5297 14.5369 15.4418L15.8627 14.116C16.0458 13.933 16.0457 13.6362 15.8627 13.4531Z" fill="#4F5480" />
                                                <path d="M13.1608 11.0076C13.0171 11.0257 12.8898 11.1093 12.8161 11.2339C12.6749 11.4726 12.5039 11.6922 12.3086 11.8876L15.1999 14.7789L15.8628 14.116C16.0459 13.933 16.0459 13.6362 15.8628 13.4531L13.5509 11.1412C13.4485 11.0388 13.3044 10.9895 13.1608 11.0076Z" fill="#404576" />
                                                <path d="M12.9704 12.553C14.6177 10.9057 14.6177 8.23493 12.9704 6.58766C11.3232 4.94038 8.65239 4.94038 7.00512 6.58766C5.35784 8.23493 5.35784 10.9057 7.00512 12.553C8.65239 14.2002 11.3232 14.2002 12.9704 12.553Z" fill="#5E638B" />
                                                <path d="M9.98953 5.35156C8.82641 5.35156 7.77175 5.82469 7.00781 6.58859L12.9713 12.552C13.7352 11.7881 14.2083 10.7334 14.2083 9.57031C14.2083 7.24406 12.3158 5.35156 9.98953 5.35156Z" fill="#4F5480" />
                                                <path d="M9.99023 7.22656C8.69789 7.22656 7.64648 8.27794 7.64648 9.57034C7.64648 10.8627 8.69789 11.9141 9.99023 11.9141C11.2826 11.9141 12.334 10.8627 12.334 9.57031C12.334 8.27797 11.2826 7.22656 9.99023 7.22656Z" fill="#E6FFFF" />
                                                <path d="M9.98951 7.22656C9.34332 7.22659 8.75738 7.48941 8.33301 7.91381L11.646 11.2268C12.0704 10.8024 12.3332 10.2165 12.3333 9.57034C12.3333 8.27797 11.2819 7.22656 9.98951 7.22656Z" fill="#CBF0FF" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_17624_28008">
                                                    <rect width="16" height="16" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                        <p className='ml-2'>
                                            {subject}
                                        </p>
                                    </div>
                                </div>
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
