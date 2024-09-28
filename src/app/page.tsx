'use client';
import React, { useEffect, Suspense, useState } from 'react';
import UpcomingClasses from './components/UpcomingClasses';
import TeacherCard from './components/TeacherCard';
import MyProfile from './components/MyProfile';
import FeaturedTeachers from './components/FeaturedTeachers';
import { IoLogOutOutline, IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { FaSearch } from 'react-icons/fa';
import AssignedWork from './components/AssignedWork';
import { useUserContext } from './contexts/userContext';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { getDataFromToken } from './utils/getDataFromToken';
import axios from 'axios';
import Loader from './loading';
import Teacher from './interface/Teacher';
import Link from 'next/link';

const Home = () => {
  const { userData, setUserData } = useUserContext();
  const [teachers, setTeachers] = useState<Teacher[]>([]); // New state for all teachers
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await getDataFromToken();
        if (userId) {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          const response = await axios.post(`${apiUrl}/student/getStudent/${userId}`);
          setUserData(response.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    const fetchAllTeachers = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.post(`${apiUrl}/teacher/getAllTeachers`);
        setTeachers(response.data); // Setting all teachers
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };
    fetchAllTeachers()
    fetchUserData();
  }, [setUserData]);

  const handleLogout = async () => {
    try {
      Cookies.remove('studentToken');
      router.push('/account/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="py-0 md:py-6 flex flex-col mx-3">
      <header className="flex flex-col md:flex-row justify-between items-center mb-4 mx-8">
        <div className="flex items-center mb-2 md:mb-0">
          <div className="w-[40px] h-[40px] bg-yellow-400 rounded-full"></div>
          <p className="text-xl font-bold ml-3">{userData ? userData.name : 'Loading...'}</p>
        </div>

        {/* Search bar */}
        <div className="flex relative mb-2 md:mb-0 md:w-1/3">
          <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="flex-grow p-2 border border-gray-300 focus:outline-none pl-4"
          />
        </div>

        {/* Group icons only on smaller screens */}
        <div className="flex gap-x-4 mb-2 md:mb-0">
          <Link href={'/messages'}>
            <button className="text-gray-600 p-2 rounded-full hover:bg-gray-100">
              <IoChatbubbleEllipsesOutline className="w-6 h-6" />
            </button>
          </Link>
          <button className="text-gray-600 p-2 rounded-full hover:bg-gray-100" onClick={handleLogout}>
            <IoLogOutOutline className="w-6 h-6" />
          </button>
        </div>
      </header>

      <Suspense fallback={<Loader />}>
        <div className="flex flex-col md:flex-row mb-6 justify-between w-full">
          <div className="flex flex-col justify-between items-center lg:w-full w-full">
            <div className="flex flex-col lg:flex-row justify-evenly w-full mb-4 mx-5">
              <div className='w-full lg:w-2/5'>
                {userData ? <MyProfile student={userData} /> : <Loader />}
              </div>
              <div className="hidden md:block mb-4">
                <AssignedWork />
              </div>
            </div>
            <div className="block lg:hidden mb-4 mx-5 w-full">
              <UpcomingClasses />
            </div>
            <div className="md:hidden mb-4">
              <AssignedWork />
            </div>
            <div className="flex-grow w-[95%]">
              <FeaturedTeachers />
            </div>
          </div>

          <div className="flex flex-col w-full md:w-auto mr-4 mt-[-12px]">
            {/* Upcoming Classes moved below the profile on screens under 1000px */}
            <div className="hidden lg:block mb-4">
              <UpcomingClasses />
            </div>
          </div>
        </div>

        {/* Show Assigned Work on larger screens */}
        {/* <div className="hidden md:block mb-4">
          <AssignedWork />
        </div> */}
        <div>
          <h1 className="text-4xl font-bold text-center text-gray-900">Meet Our Teachers</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {teachers.map((teacher) => (
              <TeacherCard key={teacher._id} teacher={teacher} /> // Render each TeacherCard
            ))}
          </div>
        </div>

      </Suspense>
    </div>
  );
};

export default Home;
