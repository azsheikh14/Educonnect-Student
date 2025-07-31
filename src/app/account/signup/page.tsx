'use client'

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { TbMail } from 'react-icons/tb';
import { FiLock } from 'react-icons/fi';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
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

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.post(`${apiUrl}/student/studentSignup`, formData);

      setMessage(response.data.message);
      setTimeout(() => router.push('/account/login'), 2000); // Redirect to login page
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error during signup:', axiosError);
      if (axiosError.response?.status === 409) { // Assuming 409 Conflict for existing account
        setError('Account already exists. Please log in.');
      } else {
        setError('Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 flex flex-col justify-center items-left px-12">
        <h2 className="text-3xl font-bold mb-2">Hi!</h2>
        <h3 className="text-xl font-semibold mb-6 text-[#76309B]">EduConnect Teachers</h3>
        <form className="w-full max-w-md space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-bold text-gray-700">Name</label>
            <div className="relative mt-1">
              <input type="name" id="name" name="name" value={formData.name} onChange={handleChange} required className="  block w-full border-2 border-gray-300 focus:outline-none focus:ring-0 p-2 rounded-lg" />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-gray-700">Email</label>
            <div className="relative mt-1">
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="  block w-full border-2 border-gray-300 focus:outline-none focus:ring-0 p-2 rounded-lg" />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-bold text-gray-700">Password</label>
            <div className="relative mt-1">
              <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required minLength={8} pattern="^(?=.*[!@#$%^&*])(?=.*[a-zA-Z0-9]).{8,}$" title="Password must be at least 8 characters long and include a special character." className="block w-full border-2 border-gray-300 focus:outline-none focus:ring-0 p-2 rounded-lg" />
            </div>
          </div>
          <div className="text-sm text-gray-500">Already have an account? <span className='text-blue-600 cursor-pointer' onClick={() => { window.location.href = '/account/login' }}>Login</span></div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" className="h-4 w-4 cursor-pointer" />
            <label>I'm not a robot</label>
          </div>
          <button type="submit" style={{ backgroundColor: "#76309B" }} className="w-full cursor-pointer text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            {loading ? (
              <div className="flex items-center justify-center">
                <svg width="20" height="20" fill="currentColor" className="mr-2 animate-spin" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                  <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z"></path>
                </svg>
                <span>Loading</span>
              </div>
            ) : 'Sign Up'}
          </button>
        </form>
      </div>
      <div className='bg-purple-100 w-1/2 h-screen flex items-center justify-center'>
        <img src="/Educonnect.png" className='w-80' alt="" />
      </div>
    </div>
  );
};

export default Signup;
