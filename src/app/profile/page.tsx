'use client'
import React, { useState } from 'react';
import { useUserContext } from '../contexts/userContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Image from 'next/image';
import Student from '../interfaces/Student'

const ProfileComponent = () => {
    const { userData, setUserData } = useUserContext();
    const [editProfile, setEditProfile] = useState<Student>({ ...userData! });
    const [loading, setLoading] = useState(false);
    console.log('loading :', loading);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = event.target;
        setEditProfile(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const response = await axios.post(`${apiUrl}/teacher/updateTeacherProfile/${userData?._id}`, {
                ...editProfile,
            });
            setUserData(response.data);
            toast.success('Profile updated successfully!');
        } catch (err) {
            console.error('Error saving profile:', err);
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center p-6 w-full mx-auto h-auto rounded-lg">
            <form onSubmit={handleSubmit} className="w-full space-y-6">

                <div className='w-full bg-white p-6 rounded-lg border border-gray-200'>
                    <p className='text-xl font-bold'>Basic Information</p>

                    <div className="flex flex-col items-center col-span-1 pb-8 pt-4">
                        <div className="relative  overflow-hidden cursor-pointer ">
                            {editProfile.profilePic ?
                                <Image width={160} height={160} className="rounded-full object-cover bg-yellow-500" src={editProfile?.profilePic} alt="Profile" onClick={() => document.getElementById('fileInput')?.click()} />
                                :
                                <Image width={160} height={160} className="rounded-full object-cover bg-yellow-500" src='/svg/noPic.svg' alt="Profile" onClick={() => document.getElementById('fileInput')?.click()} />
                            }

                            <div className="absolute bottom-0 right-0 rounded-full border-4 border-white bg-blue-500 w-14 h-14 flex items-center justify-center p-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                                    <path opacity="0.12" d="M21.5 7.0003C22.6046 5.89573 22.6046 4.10487 21.5 3.0003C20.3954 1.89573 18.6046 1.89573 17.5 3.0003L14.5 6.0003L18.5 10.0003L21.5 7.0003Z" fill="white" />
                                    <path d="M18.5 10.0003L14.5 6.0003M3 21.5003L6.38437 21.1243C6.79786 21.0783 7.0046 21.0553 7.19785 20.9928C7.36929 20.9373 7.53245 20.8589 7.68289 20.7597C7.85245 20.6479 7.99955 20.5008 8.29373 20.2066L21.5 7.0003C22.6046 5.89573 22.6046 4.10487 21.5 3.0003C20.3955 1.89573 18.6046 1.89573 17.5 3.0003L4.29373 16.2066C3.99955 16.5008 3.85246 16.6478 3.74064 16.8174C3.64143 16.9679 3.56301 17.131 3.50751 17.3025C3.44496 17.4957 3.42198 17.7024 3.37604 18.1159L3 21.5003Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                        <input type="file" id="fileInput" accept="image/*" className="hidden" onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                    if (ev.target && ev.target.result) {
                                        setEditProfile({
                                            ...editProfile,
                                            profilePic: ev.target.result as string,
                                        });
                                    }
                                };
                                reader.readAsDataURL(e.target.files[0]);
                            }
                        }}
                        />
                    </div>
                    <div className='grid grid-cols-3 gap-x-2'>
                        <div className='w-full'>
                            <p className='mb-2'>Name</p>
                            <input type="text" name="name" value={editProfile.name} onChange={handleChange} className="w-full px-4 h-14 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none text-base font-medium" />
                        </div>
                        <div className='w-full'>
                            <p className='mb-2'>Email</p>
                            <input type="text" name="email" value={editProfile.email} onChange={handleChange} className="w-full px-4 h-14 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none text-base font-medium" />
                        </div>
                        <div className='w-full'>
                            <p className='mb-2'>Enrollment Number</p>
                            <input type="text" disabled name="enrollmentNumber" value={editProfile.enrollmentNumber} onChange={handleChange} className="w-full px-4 h-14 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none text-base font-medium" />
                        </div>
                    </div>
                    <div className='w-full mt-5'>
                        <p className='mb-2'>Bio</p>
                        <textarea
                            name="bio"
                            value={editProfile.bio}
                            onChange={handleChange}
                            className="w-full p-4 min-h-20 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none text-base font-medium resize-none"
                            style={{ overflow: 'hidden' }}
                            onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
                                const target = e.currentTarget as HTMLTextAreaElement;
                                target.style.height = 'auto';
                                target.style.height = `${target.scrollHeight}px`;
                            }}
                        />
                    </div>
                </div>

                <div className='flex justify-end w-full mt-4'>
                    <button type="submit" className='bg-blue-600 w-40 rounded-lg px-4 py-1 h-10 font-bold text-base cursor-pointer flex items-center justify-center text-white'>
                        Save Profile
                    </button>
                </div>

            </form>
        </div>
    );
};

export default ProfileComponent;
