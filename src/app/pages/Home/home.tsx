import React, { useEffect, useState, useRef } from 'react';
import { useUserContext } from '@/app/contexts/userContext';
import Teacher from '@/app/interfaces/profile';
import { getTeachersByPageLimit } from '@/app/services/teacherService';
import WelcomeBanner from "../../components/Welcomebanner.jsx";
import Attendance from "./Attendance";
import Lectures from "../../components/Lectures";
import CoursesTable from "../../components/CoursesTable";

const Home = () => {
    const { userData } = useUserContext();
    console.log('userData :', userData);
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
            const response = await getTeachersByPageLimit(page, limit)
            setTeachers((prevTeachers) => [...prevTeachers, ...response.teachers]);
            setTotalTeachers(response.totalTeachers);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setHasMore(teachers.length < totalTeachers);
        console.log('teachers :', teachers);
    }, [teachers, totalTeachers]);

    const handleScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const threshold = 2;

        if (windowHeight + scrollTop >= documentHeight - threshold) {
            if (hasMore && !loading) {
                pageRef.current = pageRef.current + 1;
                setPage((teachers.length / 12) + 1);
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
        // <div className='p-6'>
        //     <p className='text-lg font-medium'>Dashboard</p>
        //     <div className='mt-8 mb-6'>
        //         <AssignedWork />
        //     </div>
        //     <div className='flex w-full space-x-4'>
        //         <div className='w-8/12'>
        //             {userData && <MyProfile student={userData} />}
        //         </div>
        //         <div className='w-4/12'>
        //             <UpcomingClasses />
        //         </div>
        //     </div>
        //     <div className=''>
        //         <p className='text-lg font-bold my-4'>Featured Teachers</p>
        //         <div className='flex w-full space-x-4 h-full'>
        //             <div className='w-8/12 h-full'>
        //                 <FeaturedTeachers />
        //             </div>
        //             <div className='w-4/12 bg-white rounded-lg p-4 space-y-3 h-full'>
        //                 <ReferAFriend />
        //                 <TakeQuiz />
        //             </div>
        //         </div>
        //     </div>
        //     <div className=''>
        //         <p className='text-lg font-bold my-4'>Teachers</p>
        //         <div className='w-full grid grid-cols-4 gap-4'>
        //             {teachers.map((teacher) => (
        //                 <TeacherCard key={teacher._id} teacher={teacher} />
        //             ))}
        //         </div>
        //         {loading && <p>Loading more teachers...</p>}
        //     </div>
        // </div>
        <div className="flex bg-gray-100 min-h-screen">
            <div className="flex-1 flex flex-col">
                <main className="flex-1 p-6 md:p-10">
                    <WelcomeBanner />

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mt-6">
                        <StatCard title="Class Attended" value={userData?.classesAttended ?? 0} />
                        <StatCard title="Courses Enrolled" value={userData?.selectedCourses.length ?? 0} />
                        <StatCard title="Upcoming Classes" value={userData?.upcomingClasses ?? 0} />
                        <StatCard title="Assignments Done" value={userData?.completedTasks ?? 0} />
                    </div>

                    {/* Attendance & Lectures */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                        <Attendance />
                        <Lectures />
                    </div>

                    {/* Registered Courses (with View All) */}
                    <div className="mt-8">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-lg font-semibold text-gray-700">
                                Results
                            </h2>
                            <p
                                onClick={()=> window.location.href = '/profile'}
                                className="text-[#76309B] text-sm cursor-pointer font-medium hover:underline hover:text-[#5e247d] transition"
                            >
                                View All →
                            </p>
                        </div>
                        <CoursesTable />
                    </div>
                </main>
            </div>
        </div>
    );
};

const StatCard = ({ title, value }: { title: string; value: string | number }) => (
    <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center justify-center">
        <div className="text-[#76309B] font-bold text-xl">{value}</div>
        <div className="text-sm text-gray-600 mt-1 text-center">{title}</div>
    </div>
);


export default Home;
