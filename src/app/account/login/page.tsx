'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios, { AxiosError } from 'axios';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

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
            const { token } = response.data;
            Cookies.set('studentToken', token, { expires: 1 });
            setMessage('Login successful! Redirecting...');
            router.push('/');
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Error during login:', axiosError);
            setError('Login failed. Invalid Credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6">
            <div className="flex space-x-0 w-[60vw]">
                <div className="relative w-full bg-white p-8 flex justify-center items-center z-10">
                    <img src="/login.png" alt="Login Illustration" className="h-auto" />
                </div>
                <div className="relative w-full bg-white p-8 z-0">
                    <h1 className="text-3xl font-semibold mb-12 text-center text-gray-800">Login</h1>
                    {(error || message) && (
                        <p
                            className={`absolute top-20 left-1/2 transform -translate-x-1/2 text-center w-full ${error ? 'text-red-500' : 'text-green-500'}`}
                        >
                            {error || message}
                        </p>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-0"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-0"
                            />
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
            </div>
        </div>
    );
};

export default Login;
