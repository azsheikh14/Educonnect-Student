'use client';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TeacherCV from './teacherCV';
import Teacher from '../interfaces/profile';
import { useChatContext } from '../contexts/chatContext';
import { useRouter } from 'next/navigation';
import TeacherCard from '../components/TeacherCard';
import TeacherCVLoader from '../loaders/teacherCVLoader';
import { useUserContext } from '../contexts/userContext';
import DemoClassScheduleModal from '../modal/demoClassScheduleModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MultiValue } from 'react-select';
import { FaChalkboardTeacher, FaDollarSign, FaHandshake } from 'react-icons/fa';
import HireFormModal from '../modal/hireFormModal ';
import Select from 'react-select';

const TeacherProfile = () => {
    const [teacher, setTeacher] = useState<Teacher>();
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const { setCurrentChat } = useChatContext();
    const searchParams = useSearchParams();
    const id = searchParams.get('id') || '';
    const router = useRouter();
    const { userData } = useUserContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<string>('');
    const [isHireModalOpen, setIsHireModalOpen] = useState(false);

    const handleOpenChat = (id: string, name: string) => {
        setCurrentChat({ teacherId: id, teacherName: name, lastMessage: '', teacherProfilePic: '' });
        router.push('/messages');
    };

    const fetchTeacher = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const response = await axios.post(`${apiUrl}/teacher/getTeacher/${id}`);
            setTeacher(response.data);
            fetchAllTeachers(response.data);
        } catch (error) {
            console.error('Error fetching teacher:', error);
        }
    };

    const fetchAllTeachers = async (teacherData: Teacher) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const response = await axios.post(`${apiUrl}/teacher/getRelevantTeachers`, {
                subjects: teacherData?.subjects,
                classes: teacherData?.classes,
                teacherId: teacherData._id
            });
            setTeachers(response.data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    };

    useEffect(() => {
        if (id) {
            fetchTeacher();
        }
    }, [id]);

    const convertTo12HourFormat = (time: string) => {
        const [hours, minutes] = time.split(':');
        const period = +hours >= 12 ? 'PM' : 'AM';
        const hour = +hours % 12 || 12;
        return `${hour}:${minutes} ${period}`;
    };

    const getTimeSlots = (day: string, start: string, end: string) => {
        const [startHour, startMinute] = start.split(':').map(Number);
        const [endHour, endMinute] = end.split(':').map(Number);
        const slots = [];
        for (let hour = startHour; hour < endHour; hour++) {
            const startTime = `${hour}:${startMinute < 10 ? '0' + startMinute : startMinute}`;
            const endTime = `${hour + 1}:${endMinute < 10 ? '0' + endMinute : endMinute}`;
            slots.push(`${day} ${convertTo12HourFormat(startTime)} - ${convertTo12HourFormat(endTime)}`);
        }
        return slots;
    };

    const availabilityOptions = teacher?.availability?.flatMap((avail) => {
        const day = avail.day;
        const timeSlots = getTimeSlots(day, avail.start || '', avail.end || '');
        return timeSlots.map((slot) => ({
            value: slot,
            label: `${slot}`,
        }));
    }) || [];

    const handleScheduleClass = () => {
        if (!selectedSlot) {
            toast.warning('Please select a slot before scheduling the class');
            return;
        }
        setIsModalOpen(true);
    };

    const handleConfirmSchedule = async (selectedOptions: { subjects: MultiValue<{ value: string; label: string }>; classes: MultiValue<{ value: string; label: string }> }) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;

            const [day, ...timeParts] = selectedSlot.split(' ');

            const timeSlot = timeParts.join(' ');

            if (!timeSlot.includes('-')) {
                console.error('Invalid time range format');
                return;
            }

            const subjectsValues = selectedOptions.subjects.map(subject => subject.value);
            const classesValues = selectedOptions.classes.map(cls => cls.value);

            await axios.post(`${apiUrl}/class/scheduleDemoClass`, {
                slot: { day, slot: timeSlot },
                teacherId: teacher?._id,
                teacherName: teacher?.name,
                studentId: userData?._id,
                studentName: userData?.name,
                studentEmail: userData?.email,
                subjects: subjectsValues,
                classes: classesValues
            });

            setIsModalOpen(false);
            toast.success('Class scheduled successfully!');
            toast.success('Please check your email for confirmation');
        } catch (error) {
            console.error('Error scheduling class:', error);
            toast.error('Failed to schedule the class. Please try again.');
        }
    };

    return (
        <div className="flex flex-col md:flex-row p-5 gap-4">
            <ToastContainer />
            <div className="flex flex-col md:flex-row p-5 gap-4 w-full md:w-2/3">
                <div className="w-full">
                    {teacher ? <TeacherCV teacher={teacher} /> : <TeacherCVLoader />}
                    <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">Other Suggestions</h1>
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
                <div className="p-6 bg-white rounded-lg flex flex-col items-center space-y-4">
                    <h3 className="text-2xl font-semibold text-center text-blue-600">Book a Demo Class</h3>
                    <p className="text-gray-600 text-center">Experience our teaching style and understand how we can help you achieve your learning goals. Schedule a demo class now!</p>
                    <div className="w-full">
                        <label htmlFor="availableSlots" className="block text-sm font-medium text-gray-700 mb-1">Available Slots</label>
                        <Select
                            id="availableSlots"
                            options={availabilityOptions}
                            onChange={(option) => setSelectedSlot(option ? option.value : '')}
                            placeholder="Select a slot"
                            className="w-full"
                            isClearable
                        />
                    </div>
                    <button onClick={handleScheduleClass} className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Schedule Class
                    </button>
                </div>
                <div className="p-6 bg-white rounded-lg flex flex-col items-center space-y-4">
                    <h3 className="text-2xl font-semibold text-blue-600">Pricing Details</h3>
                    <div className="flex flex-col space-y-4 w-full">
                        <div className="flex justify-between items-center p-4 bg-white rounded-lg border border-blue-200">
                            <h4 className="text-lg font-medium text-gray-800 flex items-center">
                                <FaDollarSign className="mr-2" />
                                Monthly Fee
                            </h4>
                            <p className="text-2xl font-bold text-gray-900">${teacher?.monthlyFee}</p>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-white rounded-lg border border-blue-200">
                            <h4 className="text-lg font-medium text-gray-800 flex items-center">
                                <FaChalkboardTeacher className="mr-2" />
                                Classes Per Month
                            </h4>
                            <p className="text-2xl font-bold text-gray-900">{teacher?.classesPerWeek}</p>
                        </div>
                    </div>
                    <button onClick={() => setIsHireModalOpen(true)} className="mt-4 w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-200 flex items-center justify-center">
                        <FaHandshake className="mr-2" />
                        Hire Now
                    </button>
                </div>
                {teacher && (
                    <HireFormModal isOpen={isHireModalOpen} onClose={() => setIsHireModalOpen(false)} teacher={teacher} onOpenChat={() => handleOpenChat(teacher._id, teacher.name)} />
                )}
                {teacher && (
                    <button onClick={() => handleOpenChat(teacher._id, teacher.name)} className="w-full bg-blue-600 text-white px-4 py-2 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Message {teacher?.name}
                    </button>
                )}
            </div>
            {teacher && (
                <DemoClassScheduleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} teacher={teacher} onConfirm={handleConfirmSchedule} />
            )}
        </div>
    );
};

export default TeacherProfile;
