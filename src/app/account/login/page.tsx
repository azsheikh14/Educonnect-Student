'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios, { AxiosError } from 'axios';
import { TbMail } from "react-icons/tb";
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi";
import { FaCloudUploadAlt } from "react-icons/fa";
import { HiOutlineBriefcase } from "react-icons/hi";
import { MdOutlinePerson2 } from "react-icons/md";
import { MdOutlineSchool } from "react-icons/md";
import Image from 'next/image'
import { useUserContext } from '@/app/contexts/userContext';
import ReCAPTCHA from 'react-google-recaptcha';
import { toast } from 'react-toastify';

interface ErrorResponse {
    message?: string;
}

const Login = () => {
    const { setUserData } = useUserContext();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isNotRobot, setIsNotRobot] = useState(false);
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if(!isNotRobot) {toast.error('Please verify that you are not a robot.'); return}
        setLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const response = await axios.post(`${apiUrl}/student/studentLogin`, formData);
            const { token, user } = response.data;
            setUserData(user)
            Cookies.set('studentToken', token, { expires: 1 });
            router.push('/');
        } catch (error) {
            toast.error('Invalid Credentials');
            const axiosError = error as AxiosError<ErrorResponse>;
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    return (
        <div className="flex h-screen">
            <div className='bg-purple-100 w-1/2 h-screen flex items-center justify-center'>
                <img src="/Educonnect.png" className='w-80' alt="" />
            </div>
            <div className="w-1/2 flex flex-col justify-center items-left px-12">
                <h2 className="text-3xl font-bold mb-2">Hi!</h2>
                <h3 className="text-xl font-semibold mb-6 text-[#76309B]">EduConnect Students</h3>
                <form className="w-full max-w-md space-y-4" onSubmit={handleSubmit}>
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
                                <FiEyeOff className="absolute top-0 right-0 flex items-center pr-3 cursor-pointer text-3xl text-black h-full" onClick={togglePasswordVisibility} />
                            ) : (
                                <FiEye className="absolute top-0 right-0 flex items-center pr-3 cursor-pointer text-3xl text-black h-full" onClick={togglePasswordVisibility} />
                            )}
                        </div>
                    </div>
                    <div className="text-sm text-gray-500">Dont have an account? <span className='text-blue-600 cursor-pointer' onClick={() => { window.location.href = '/account/signup' }}>Signup</span></div>
                    <div className="flex items-center space-x-2">
                        <ReCAPTCHA sitekey={siteKey} onChange={() => {setIsNotRobot(true)}} />
                    </div>
                    <button type="submit" style={{ backgroundColor: "#76309B" }} className="w-full cursor-pointer text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
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
            </div>
        </div>
    );
};

export default Login;
