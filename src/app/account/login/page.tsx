'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios, { AxiosError } from 'axios';
import { useUserContext } from '@/app/contexts/userContext';
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi";
import { FaCloudUploadAlt } from "react-icons/fa";
import { HiOutlineBriefcase } from "react-icons/hi";
import { MdOutlinePerson2 } from "react-icons/md";
import { MdOutlineSchool } from "react-icons/md";
import Image from 'next/image'
import { TbMail } from 'react-icons/tb';

interface ErrorResponse {
    message?: string;
}

const Login = () => {
    const { setUserData } = useUserContext();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const [typedText, setTypedText] = useState<string>('');
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const response = await axios.post(`${apiUrl}/student/studentLogin`, formData);
            const { token, user } = response.data;
            setUserData(user)
            Cookies.set('studentToken', token, { expires: 1 });
            setMessage('Login successful! Redirecting...');
            router.push('/');
        } catch (error) {
            const axiosError = error as AxiosError<ErrorResponse>;
            if (axiosError.response && axiosError.response.data) {
                setError(axiosError.response.data.message || 'An error occurred');
            } else {
                setError(axiosError.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const fullText = "Computer science teacher with 3 years of experience in teaching programming courses. Proficient in Python, Java, and C++. Skilled in simplifying complex concepts, fostering hands-on learning, and preparing students for real-world coding challenges. Passionate about encouraging problem-solving skills and promoting a growth mindset in the classroom.";

    useEffect(() => {
        let index = 0;
        let timeoutId: NodeJS.Timeout;

        const typeCharacter = () => {
            if (index < fullText.length) {
                setTypedText(prev => prev + fullText.charAt(index));
                index++;
                timeoutId = setTimeout(typeCharacter, 10);
            }
        };

        typeCharacter()

        return () => clearTimeout(timeoutId);
    }, [fullText]);

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    return (
        <div className="flex justify-center items-center min-h-screen p-6">
            <div className="bg-white flex  w-full max-w-4xl shadow-lg rounded-lg h-auto md:h-[80vh]">
                <div className="relative w-full p-8 flex flex-col justify-center h-full md:w-2/3">
                    <h1 className="text-3xl font-bold mb-8 text-left text-gray-800">Lets Sign you In</h1>
                    {(error || message) && (
                        <p className={`absolute top-20 left-1/2 transform -translate-x-1/2 text-center w-full ${error ? 'text-red-500' : 'text-green-500'}`}>
                            {error || message}
                        </p>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-gray-700">Email</label>
                            <div className="relative mt-1">
                                <TbMail className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-3xl text-black h-full" />
                                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="pl-12 block w-full border-2 border-gray-300 focus:outline-none focus:ring-0 p-2 rounded-lg" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-bold text-gray-700">Password</label>
                            <div className="relative mt-1">
                                <FiLock className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-3xl text-black h-full" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="pl-12 block w-full border-2 border-gray-300 focus:outline-none focus:ring-0 p-2 rounded-lg"
                                />
                                {showPassword ? (
                                    <FiEyeOff className="absolute top-1 right-0 flex items-center pr-3 cursor-pointer text-3xl text-black h-full" onClick={togglePasswordVisibility} />
                                ) : (
                                    <FiEye className="absolute top-1 right-0 flex items-center pr-3 cursor-pointer text-3xl text-black h-full" onClick={togglePasswordVisibility} />
                                )}
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <svg width="20" height="20" fill="currentColor" className="mr-2 animate-spin" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z"></path>
                                    </svg>
                                    <span>Loading</span>
                                </div>
                            ) : 'Log In'}
                        </button>
                    </form>
                    <div className="mt-4 text-center flex items-center">
                        <p className="text-sm text-gray-600">Don’t have an account?</p>
                        <button onClick={() => router.push('/account/signup')} className="text-blue-600 hover:underline ml-2">
                            Sign Up
                        </button>
                    </div>
                </div>
                <div className="hidden md:block relative w-full rounded p-8 bg-gradient-to-r from-green-100 to-green-50">
                    <div className="text-4xl text-gray-800 font-bold bg-clip-text h-22 bg-red-400">
                        Welcome back to Students Portal
                    </div>
                    <div className="flex items-center mt-8">
                        <div className="bg-green-500 flex items-center justify-center p-0.5 rounded-full relative z-10 w-14 h-14">
                            <div className="bg-white flex items-center justify-center p-0.5 rounded-full relative z-12 w-11 h-11">
                                <FaCloudUploadAlt className="w-10 h-10 p-2 text-xl text-green-500" />
                            </div>
                        </div>
                        <div className="bg-green-500 py-1 px-2 ml-[-12px] z-0 w-44 h-10 flex items-center rounded-r-full text-white">
                            <span className="ml-4">Upload Documents</span>
                        </div>
                    </div>
                    <div className="mx-auto w-[92%] bg-white h-4 rounded-t-xl shadow border-x border-t mt-4"></div>
                    <div className="mx-auto w-[96%] bg-white h-4 rounded-t-xl shadow border-x border-t"></div>
                    <div className="w-full bg-white p-4 rounded-xl pb-6">
                        <div className="flex w-full">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-end justify-center">
                                <Image src="/svg/noPic.svg" className="rounded-full" height={45} width={45} alt="" />
                            </div>
                            <div className="ml-4 flex flex-col w-[85%]">
                                <div className="flex justify-between">
                                    <p className="text-lg font-bold">Taha Rizwan</p>
                                    <div className="bg-blue-500 px-8 -py-2 text-xs rounded-full text-white w-16 flex items-center justify-center">
                                        Lecturer
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600 flex w-full">
                                    <div className="flex items-center">
                                        <HiOutlineBriefcase className="text-lg" />
                                        <p className="ml-1">Teacher</p>
                                    </div>
                                    <div className="flex items-center ml-2">
                                        <MdOutlinePerson2 className="text-lg" />
                                        <p className="ml-1">3 Years</p>
                                    </div>
                                    <div className="flex items-center ml-2">
                                        <MdOutlineSchool className="text-lg" />
                                        <p className="ml-1">Computer</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-bold mt-4 mb-1">Expertise:</p>
                            <div className="h-32 text-sm mt-3 mb-4">
                                <span className="typewriter-text">{typedText}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
