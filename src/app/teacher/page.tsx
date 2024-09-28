'use client';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEnvelope, FaPhone, FaGlobe, FaCommentDots } from 'react-icons/fa';
import TeacherCV from './teacherCV';
import Teacher from '../interface/Teacher';
import { useChatContext } from '../contexts/chatContext';
import { useRouter } from 'next/navigation';
import TeacherCard from '../components/TeacherCard';
import TeacherCVLoader from '../loaders/teacherCVLoader';
import { useUserContext } from '../contexts/userContext';
import DemoClassScheduleModal from '../modal/demoClassScheduleModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TeacherProfile = () => {
    const [teacher, setTeacher] = useState<Teacher | null>(null);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const { setCurrentChat } = useChatContext();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { userData, setUserData } = useUserContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<string>('');

    const handleOpenChat = (id: string, name: string) => {
        setCurrentChat({ teacherId: id, teacherName: name, lastMessage: '' });
        setIsChatOpen(true);
        router.push('/messages');
    };

    useEffect(() => {
        const fetchTeacher = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const response = await axios.post(`${apiUrl}/teacher/getTeacher/${id}`);
                setTeacher(response.data);
            } catch (error) {
                console.error('Error fetching teacher:', error);
            }
        };

        const fetchAllTeachers = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const response = await axios.post(`${apiUrl}/teacher/getAllTeachers`);
                setTeachers(response.data);
            } catch (error) {
                console.error('Error fetching teachers:', error);
            }
        };

        if (id) {
            fetchTeacher();
        }
        fetchAllTeachers();
    }, [id]);

    const convertTo12HourFormat = (time: string) => {
        const [hours, minutes] = time.split(':');
        const period = +hours >= 12 ? 'PM' : 'AM';
        const hour = +hours % 12 || 12;
        return `${hour}:${minutes} ${period}`;
    };

    const getTimeSlots = (day: string, start: any, end: any) => {
        const [startHour, startMinute] = start.split(':').map(Number);
        const [endHour, endMinute] = end.split(':').map(Number);
        let slots = [];
        for (let hour = startHour; hour < endHour; hour++) {
            let startTime = `${hour}:${startMinute < 10 ? '0' + startMinute : startMinute}`;
            let endTime = `${hour + 1}:${endMinute < 10 ? '0' + endMinute : endMinute}`;
            slots.push(`${day} ${convertTo12HourFormat(startTime)} - ${convertTo12HourFormat(endTime)}`);
        }
        return slots;
    };

    const handleScheduleClass = () => {
        if (!selectedSlot) {
            toast.warning('Please select a slot before scheduling the class');
            return;
        }
        setIsModalOpen(true);
    };

    const handleConfirmSchedule = async (selectedOptions: { subjects: any[], classes: any[] }) => {
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const selectedSlot = document.getElementById("availableSlots") as HTMLSelectElement;
            const slotValue = selectedSlot.value;

            console.log('slotValue :', slotValue);

            const [day, startTime, endTime] = slotValue.split(' ');
            const timeSlot = `${startTime} - ${endTime}`;

            const subjectsValues = selectedOptions.subjects.map(subject => subject.value);
            const classesValues = selectedOptions.classes.map(cls => cls.value);

            const response = await axios.post(`${apiUrl}/class/scheduleDemoClass`, {
                slot: { day, slot: timeSlot },
                teacherId: teacher?._id,
                teacherName: teacher?.name,
                studentId: userData?._id,
                studentEmail: userData?.email,
                subjects: subjectsValues,
                classes: classesValues
            });

            setIsModalOpen(false);
            toast.success('Class scheduled successfully!'); // Show success toast
        } catch (error) {
            console.error('Error scheduling class:', error);
            toast.error('Failed to schedule the class. Please try again.'); // Show error toast
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row p-5 gap-4">
            <ToastContainer />
            <div className="flex flex-col md:flex-row p-5 gap-4 w-4/5">
                <div className="w-full">
                    {teacher ? <TeacherCV teacher={teacher} /> : <TeacherCVLoader />}
                    <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">Meet Our Teachers</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        {teachers.map((teacher) => (
                            <TeacherCard key={teacher._id} teacher={teacher} />
                        ))}
                    </div>
                </div>
            </div>
            <div className="md:w-1/3 flex flex-col gap-4">
                <div className="p-4 bg-white rounded-lg shadow flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="w-[40px] h-[40px] bg-red-400 rounded-full"></div>
                        <h2 className="text-xl font-bold ml-4">{teacher?.name}</h2>
                    </div>
                    <p className="text-gray-700 ml-4">{teacher?.jobTitle}</p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-md flex flex-col items-center space-y-4">
                    <h3 className="text-2xl font-semibold text-center text-blue-600">Book a Demo Class</h3>
                    <p className="text-gray-600 text-center">Experience our teaching style and understand how we can help you achieve your learning goals. Schedule a demo class now!</p>
                    <div className="w-full">
                        <label htmlFor="availableSlots" className="block text-sm font-medium text-gray-700 mb-1">Available Slots</label>
                        <select id="availableSlots" name="availableSlots" className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={selectedSlot} onChange={(e) => setSelectedSlot(e.target.value)} >
                            <option value="">Select a slot</option>
                            {teacher?.availability?.map((avail, index) => {
                                const day = avail.day;
                                const timeSlots = getTimeSlots(day, avail.start, avail.end);
                                return (
                                    <optgroup key={index} label={day}>
                                        {timeSlots.map((slot, i) => (
                                            <option key={`${index}-${i}`} value={slot}>{slot}</option>
                                        ))}
                                    </optgroup>
                                );
                            })}
                        </select>

                    </div>
                    <button onClick={handleScheduleClass} className="w-full bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" >
                        Schedule Class
                    </button>
                </div>
                <DemoClassScheduleModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    teacher={teacher}
                    onConfirm={handleConfirmSchedule}
                />
                {teacher && (
                    <button onClick={() => handleOpenChat(teacher._id, teacher.name)} className="w-full bg-green-600 text-white py-2 rounded-lg flex items-center justify-center hover:bg-green-700 transition duration-200 ease-in-out transform hover:scale-105" >
                        <FaCommentDots className="mr-2" /> Message
                    </button>
                )}
                {/* <div className="p-4 bg-white rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-3">Availability</h3>
                    <div className="grid grid-cols-7 gap-2 text-center">
                        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day, dayIndex) => (
                            <div key={day} className="font-semibold">{day}</div>
                        ))}
                        {[...Array(30)].map((_, index) => {
                            const dayNumber = index + 1;
                            const currentDate = new Date();
                            currentDate.setDate(dayNumber);
                            const currentDayName = currentDate.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2);

                            const isAvailable = teacher?.availability?.some(avail => avail.day.slice(0, 2) === currentDayName);
                            return (
                                <div key={index} className={`p-2 ${isAvailable ? 'bg-green-200' : index % 7 === 0 ? 'bg-gray-200' : ''}`}>
                                    {dayNumber}
                                </div>
                            );
                        })}
                    </div>
                </div> */}
                <div className="p-6 bg-white rounded-lg shadow-lg flex flex-col items-start">
                    <h3 className="text-3xl font-semibold mb-4 text-gray-900">Hire {teacher?.name}</h3>
                    <div className="flex flex-col items-start bg-gray-50 p-4 rounded-lg w-full mb-4">
                        <p className="text-xl font-bold text-green-600">Hourly Rate: ${teacher?.monthlyFee}</p>
                        <p className="text-xl font-bold text-green-600">Classes Per Week: {teacher?.classesPerWeek}</p>
                    </div>
                    <p className="text-gray-700 mb-6">Hire {teacher?.name} for personalized lessons tailored to your unique learning goals.</p>
                    <button className="w-full max-w-xs bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Hire Now
                    </button>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h3 className="text-2xl font-bold mb-4">Reviews and Ratings</h3>
                    <div className="space-y-4">
                        <div className="p-4 border border-gray-200 rounded-lg">
                            <p className="font-semibold text-lg">John Smith</p>
                            <p className="text-gray-700">"Great teacher! Highly recommend."</p>
                            <div className="flex space-x-1 text-yellow-400 mt-2">
                                <span>&#9733;</span>
                                <span>&#9733;</span>
                                <span>&#9733;</span>
                                <span>&#9733;</span>
                                <span>&#9734;</span>
                            </div>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-lg">
                            <p className="font-semibold text-lg">Jane Doe</p>
                            <p className="text-gray-700">"Very knowledgeable and patient teacher."</p>
                            <div className="flex space-x-1 text-yellow-400 mt-2">
                                <span>&#9733;</span>
                                <span>&#9733;</span>
                                <span>&#9733;</span>
                                <span>&#9733;</span>
                                <span>&#9733;</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherProfile;
