'use client';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Teacher, { Education, Experience } from '@/app/interface/Teacher';
import { FaEnvelope, FaPhone, FaGlobe } from 'react-icons/fa';

const TeacherProfile = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [teacher, setTeacher] = useState<Teacher | null>(null);

    useEffect(() => {
        const fetchTeacher = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const response = await axios.post(`${apiUrl}/teacher/getTeacher/${id}`);
                console.log('response :', response);
                setTeacher(response.data); // Setting the data property
                console.log('teacher :', teacher);
            } catch (error) {
                console.error('Error fetching teacher:', error);
            }
        };

        if (id) {
            fetchTeacher();
        }
    }, [id]);

    if (!teacher) return <p>Loading...</p>;

    return (
        <div className="min-h-screen flex mx-auto p-5">
            <div className="w-[1.5/5] bg-gray-700 text-white flex flex-col items-center">
                <img src="/bijju.png" alt={`${teacher.name}'s profile picture`} className="h-[340px] object-cover" />
                < div className='bg-[rgb(34,34,34)] w-full px-2 text-center py-4' >
                    <h1 className="text-5xl font-bold mb-3">{teacher.name}</h1>
                    <h2 className="text-lg">{teacher.jobTitle}</h2>
                </div >
                <div className="text-left w-full px-5 py-3 mt-3">
                    <div className='mb-8'>
                        <h3 className="font-bold mb-1">TEACHING SUBJECTS</h3>
                        <ul className="list-disc list-inside mb-2 space-y-3">
                            {teacher.subjects && Array.isArray(teacher.subjects) && teacher.subjects.map((subject: string, index: number) => (
                                <li key={index}>{subject}</li>
                            ))}
                        </ul>
                    </div>
                    <div className='mb-8'>
                        <h3 className="font-bold mb-1">INNOVATIVE TEACHING METHODS</h3>
                        <ul className="list-disc list-inside mb-2 space-y-3">
                            {teacher.innovativeLearning && Array.isArray(teacher.innovativeLearning) && teacher.innovativeLearning.map((innovativeLearning: string, index: number) => (
                                <li key={index}>{innovativeLearning}</li>
                            ))}
                        </ul>
                    </div>
                    <div className='mb-8'>
                        <h3 className="font-bold mb-2">LANGUAGES</h3>
                        <ul className="list-disc list-inside mb-4 space-y-3">
                            {teacher.languages && Array.isArray(teacher.languages) && teacher.languages.map((language: string, index: number) => (
                                <li key={index}>{language}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div >
            <div className="w-[40%] bg-orange-500">
                <div className='bg-gray-300 py-3'>
                    <div className="mb-8 ml-32">
                        <h3 className="text-xl font-bold mb-3">PROFILE</h3>
                        <p className='w-4/5'>{teacher.bio}</p>
                    </div>
                    <div className="mb-2 flex">
                        <div className="relative flex-none w-32"> {/* Adjust width as needed */}
                            <h3 className="text-2xl font-bold rotate-[270deg] absolute top-1/2 left-0 transform -translate-y-1/2 whitespace-nowrap">
                                EDUCATION
                            </h3>
                        </div>
                        <div className=""> {/* Adjust margin as needed to avoid overlap */}
                            {teacher.qualifications && Array.isArray(teacher.qualifications) && teacher.qualifications.map((edu: Education, index: number) => (
                                <div key={index} className="mb-4">
                                    <h4 className="font-semibold">{edu.year}</h4>
                                    <p>{edu.degree}</p>
                                    <p>{edu.institution}</p>
                                </div>
                            ))}

                        </div>
                    </div>
                </div>
                <div className="flex py-5 bg-white">
                    <div className="relative flex-none w-32"> {/* Adjust width as needed */}
                        <h3 className="text-2xl font-bold rotate-[270deg] absolute top-60 left-0 transform -translate-y-1/2 whitespace-nowrap">
                            EXPERIENCE
                        </h3>
                    </div>
                    <div className=""> {/* Adjust margin as needed to avoid overlap */}
                        {teacher.experience && Array.isArray(teacher.experience) && teacher.experience.map((exp: Experience, index: number) => (
                            <div key={index} className="mb-4">
                                <h4 className="font-semibold">{exp.year}</h4>
                                <p>{exp.position}</p>
                                <p>{exp.company}</p>
                                <p>{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='text-white px-16 py-4'>
                    <h3 className="text-2xl font-bold mb-4">CONTACT</h3>
                    <div className="flex items-center mb-2">
                        <FaEnvelope className="mr-2" /> {/* Email icon */}
                        <p>Email: {teacher.contact?.email}</p>
                    </div>
                    <div className="flex items-center mb-2">
                        <FaPhone className="mr-2" /> {/* Phone icon */}
                        <p>Phone: {teacher.contact?.phone}</p>
                    </div>
                    <div className="flex items-center">
                        <FaGlobe className="mr-2" /> {/* Website icon */}
                        <p>Website: {teacher.contact?.website}</p>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default TeacherProfile;
