import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import AssignedWork from '@/app/components/AssignedWork';
import FeaturedTeachers from '@/app/components/FeaturedTeachers';
import MyProfile from '@/app/components/MyProfile';
import ReferAFriend from '@/app/components/ReferAFriend';
import TakeQuiz from '@/app/components/TakeQuiz';
import TeacherCard from '@/app/components/TeacherCard';
import UpcomingClasses from '@/app/components/UpcomingClasses';
import { useUserContext } from '@/app/contexts/userContext';
import Teacher from '@/app/interfaces/profile';

const Home = () => {
    const { userData } = useUserContext();
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalTeachers, setTotalTeachers] = useState(0);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const initialFetch = useRef(true);

    const pageRef = useRef(page);

    const fetchTeachers = async (page: number, limit: number) => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const response = await axios.post(`${apiUrl}/teacher/getAllTeachers`, { page, limit });
            setTeachers((prevTeachers) => [...prevTeachers, ...response.data.teachers]);
            setTotalTeachers(response.data.totalTeachers);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setHasMore(teachers.length < totalTeachers);
    }, [teachers, totalTeachers]);

    const handleScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const threshold = 2;

        if (windowHeight + scrollTop >= documentHeight - threshold) {
            if (hasMore && !loading) {
                pageRef.current = pageRef.current + 1; // Increment the page number here
                setPage((teachers.length / 12) + 1); // Set the page state
            }
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [hasMore, loading]);

    useEffect(() => {
        if (initialFetch.current) {
            initialFetch.current = false;
            fetchTeachers(page, 12);
        }
    }, []);

    useEffect(() => {
        if (page > 1) {
            fetchTeachers(page, 12);
        }
    }, [page]);

    return (
        <div className='p-6'>
            <p className='text-lg font-medium'>Dashboard</p>
            <div className='mt-8 mb-6'>
                <AssignedWork />
            </div>
            <div className='flex w-full space-x-4'>
                <div className='w-8/12'>
                    {userData && <MyProfile student={userData} />}
                </div>
                <div className='w-4/12'>
                    <UpcomingClasses />
                </div>
            </div>
            <div className=''>
                <p className='text-lg font-bold my-4'>Featured Teachers</p>
                <div className='flex w-full space-x-4 h-full'>
                    <div className='w-8/12 h-full'>
                        <FeaturedTeachers />
                    </div>
                    <div className='w-4/12 bg-white rounded-lg p-4 space-y-3 h-full'>
                        <ReferAFriend />
                        <TakeQuiz />
                    </div>
                </div>
            </div>
            <div className=''>
                <p className='text-lg font-bold my-4'>Teachers</p>
                <div className='w-full grid grid-cols-4 gap-4'>
                    {teachers.map((teacher) => (
                        <TeacherCard key={teacher._id} teacher={teacher} />
                    ))}
                </div>
                {loading && <p>Loading more teachers...</p>}
            </div>
        </div>
    );
};

export default Home;
