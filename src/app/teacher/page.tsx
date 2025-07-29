'use client';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TeacherCV from './teacherCV';
import Teacher from '../interfaces/profile';
import { useChatContext } from '../contexts/chatContext';
import { useRouter } from 'next/navigation';
import TeacherCard from '../components/TeacherCard';
import { useUserContext } from '../contexts/userContext';
import DemoClassScheduleModal from '../modal/demoClassScheduleModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MultiValue } from 'react-select';
import { FaChalkboardTeacher, FaDollarSign } from 'react-icons/fa';
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
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-2/3">
                <div className="w-full">
                    {teacher && <TeacherCV teacher={teacher} />}
                    <h1 className="text-xl font-semibold text-gray-900 my-4">Other Suggestions</h1>
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
                <div className="p-4 bg-white rounded-lg flex flex-col items-start space-y-4">
                    <div className='bg-blue-50 rounded-lg w-full py-4 flex justify-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" viewBox="0 0 140 140" fill="none">
                            <g clip-path="url(#clip0_17881_3107)">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.81055 15.4355H130.19V95.0955H9.81055V15.4355Z" fill="#E8F0FE" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.81055 15.4355H130.19V20.4553H16.8382V95.0958H9.81055V15.4355Z" fill="#B4C2D9" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M4.90902 15.4351H135.091C137.787 15.4351 140 13.2296 140 10.5261C140 7.83055 137.787 5.625 135.091 5.625H4.90902C2.20555 5.625 0 7.83055 0 10.5261C0 13.2296 2.20555 15.4351 4.90902 15.4351Z" fill="#2563EB" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M22.6084 95.0962H74.0234V84.4638C74.0234 74.0606 65.5017 65.5469 55.0985 65.5469H41.5333C31.1221 65.5469 22.6084 74.0606 22.6084 84.4638V95.0962Z" fill="#2563EB" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M40.8223 55.332H55.8105V67.5139H40.8223V55.332Z" fill="#FFE0CC" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M40.8223 55.332H55.8105V62.3203C54.9251 62.7868 53.9924 63.1739 53.028 63.4824C51.4152 63.9882 49.7473 64.257 48.0555 64.257C46.3637 64.257 44.6878 63.9882 43.0754 63.4824C42.3007 63.2374 41.5496 62.9369 40.8225 62.5891L40.8223 55.332Z" fill="#FFC5A6" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M35.7471 66.5106L39.4308 73.0245C39.6285 73.3643 39.9288 73.5779 40.3083 73.649C40.6957 73.7122 41.0515 73.6173 41.3517 73.3723L48.3162 67.5147L38.0948 61.918L35.7471 66.5106Z" fill="#F1F2F2" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M60.8776 66.5106L57.1938 73.0245C57.0041 73.3643 56.7038 73.5779 56.3164 73.649C55.9368 73.7122 55.5732 73.6173 55.2809 73.3723L48.3164 67.5147L58.5298 61.918L60.8776 66.5106Z" fill="#F1F2F2" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M55.8739 13.3948C65.5104 13.3948 71.2258 21.1736 71.2258 33.2762C71.2258 45.3788 63.4156 55.1892 53.7791 55.1892C51.9766 55.1892 50.2296 54.8414 48.5934 54.201C46.9096 54.8414 45.1229 55.1892 43.2731 55.1892C33.1149 55.1892 24.8779 44.8415 24.8779 32.0903C24.8779 31.4105 24.9017 30.7384 24.949 30.0825C21.9609 30.2011 19.5735 29.292 18.1426 26.7782C26.5932 20.881 34.1425 10.5254 43.455 10.5254C47.0359 10.5254 50.3563 11.6243 53.1467 13.5925C54.0559 13.4583 54.965 13.3948 55.8739 13.3948Z" fill="#2D4456" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M54.7201 28.754C57.487 32.5879 61.3447 35.8527 65.4159 37.8685C65.4791 38.5879 65.5028 39.3073 65.5028 40.0423C65.5028 52.1452 57.6927 61.9554 48.0562 61.9554C38.4197 61.9554 30.6016 52.145 30.6016 40.0423C30.6016 38.5404 30.7282 37.0701 30.9573 35.6471C37.3369 35.7658 44.6491 32.7301 49.6055 28.2241C50.3563 27.5364 51.2655 27.2359 52.2775 27.3466C53.2892 27.4497 54.1191 27.9318 54.7201 28.754Z" fill="#FFE0CC" />
                                <path d="M48.3166 57.5989C46.3719 57.5989 44.4745 56.6027 42.9739 54.7939C42.4817 54.2008 42.5638 53.3212 43.1568 52.8293C43.7496 52.3371 44.6298 52.4194 45.1215 53.0122C45.8013 53.8314 46.9076 54.8084 48.3166 54.8084C49.7174 54.8084 50.8287 53.8298 51.5145 53.0089C52.0083 52.4175 52.8877 52.3385 53.4796 52.8323C54.0711 53.3264 54.1501 54.206 53.656 54.7978C52.1256 56.6303 50.2793 57.5989 48.3166 57.5989Z" fill="#945619" />
                                <path d="M41.9171 42.5572V43.0078C41.9171 43.7784 41.2923 44.4029 40.522 44.4029C39.7515 44.4029 39.127 43.7784 39.127 43.0078V42.5572C39.127 41.7866 39.7518 41.1621 40.522 41.1621C41.2923 41.1621 41.9171 41.7866 41.9171 42.5572ZM56.111 41.1621C55.3404 41.1621 54.7159 41.7866 54.7159 42.5572V43.0078C54.7159 43.7784 55.3407 44.4029 56.111 44.4029C56.8813 44.4029 57.5061 43.7784 57.5061 43.0078V42.5572C57.5061 41.7866 56.8813 41.1621 56.111 41.1621Z" fill="#945619" />
                                <path d="M65.2096 37.834H61.2016H51.0119C50.2414 37.834 49.6168 38.4585 49.6168 39.2291V39.905H47.0156V39.2291C47.0156 38.4585 46.3908 37.834 45.6205 37.834H35.423H30.6168C29.8462 37.834 29.2217 38.4585 29.2217 39.2291C29.2217 39.9996 29.8465 40.6241 30.6168 40.6241H34.0279V42.7783C34.0279 45.5091 36.2496 47.7308 38.9804 47.7308H42.0634C44.7942 47.7308 47.0159 45.5091 47.0159 42.7783V42.6952H49.6171V42.7783C49.6171 45.5091 51.8352 47.7308 54.5617 47.7308H57.6523C60.3788 47.7308 62.5969 45.5091 62.5969 42.7783V40.6241H65.2096C65.9802 40.6241 66.6047 39.9996 66.6047 39.2291C66.6047 38.4585 65.9799 37.834 65.2096 37.834ZM44.2252 42.7786C44.2252 43.9707 43.255 44.9406 42.0631 44.9406H38.9801C37.7882 44.9406 36.818 43.9707 36.818 42.7786V40.6244H44.2252V42.7786ZM59.8062 42.7786C59.8062 43.9707 58.8396 44.9406 57.6521 44.9406H54.5614C53.3739 44.9406 52.4073 43.9707 52.4073 42.7786V40.6244H59.8065L59.8062 42.7786Z" fill="#1E3445" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M84.8777 27.8457H136.925C138.617 27.8457 140 29.229 140 30.9208V63.3636C140 65.0554 138.617 66.4307 136.925 66.4307C119.581 66.4307 102.229 66.4307 84.8777 66.4307C83.1859 66.4307 81.8105 65.0554 81.8105 63.3636V30.9129C81.8105 29.2293 83.1859 27.8457 84.8777 27.8457Z" fill="#2563EB" />
                                <path d="M94.0117 37.1978C94.0117 36.4273 94.6365 35.8027 95.4068 35.8027H126.395C127.165 35.8027 127.79 36.4273 127.79 37.1978C127.79 37.9684 127.165 38.5929 126.395 38.5929H95.4068C94.6365 38.5932 94.0117 37.9684 94.0117 37.1978ZM126.395 45.7474H95.4068C94.6362 45.7474 94.0117 46.3719 94.0117 47.1425C94.0117 47.913 94.6365 48.5375 95.4068 48.5375H126.395C127.165 48.5375 127.79 47.913 127.79 47.1425C127.79 46.3719 127.165 45.7474 126.395 45.7474ZM126.395 55.692H95.4068C94.6362 55.692 94.0117 56.3166 94.0117 57.0871C94.0117 57.8577 94.6365 58.4822 95.4068 58.4822H126.395C127.165 58.4822 127.79 57.8577 127.79 57.0871C127.79 56.3166 127.165 55.692 126.395 55.692Z" fill="#E8F0FE" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M4.90902 104.898H135.091C137.787 104.898 140 102.692 140 99.9968C140 97.3013 137.787 95.0957 135.091 95.0957H4.90902C2.20555 95.0957 0 97.301 0 99.9968C0 102.692 2.20555 104.898 4.90902 104.898Z" fill="#2563EB" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M20.3796 29.1183C25.6443 25.0947 31.2493 19.2527 36.9488 15.4344C40.3638 13.1419 43.8184 11.5847 47.2571 11.5847C48.1187 11.5847 48.9727 11.6399 49.8105 11.7665C47.8341 10.9602 45.6999 10.5254 43.4547 10.5254C39.2807 10.5254 35.4627 12.6043 31.7551 15.4344C27.1939 18.9125 22.8066 23.5213 18.1426 26.7782C18.7351 27.822 19.4862 28.5807 20.3796 29.1183Z" fill="#1E3445" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M84.8777 27.8457H136.925C138.617 27.8457 140 29.229 140 30.9208V31.3635H88.3875C86.7037 31.3635 85.3204 32.7389 85.3204 34.4306V66.4307H84.8777C83.1859 66.4307 81.8105 65.0554 81.8105 63.3636V30.9129C81.8105 29.2293 83.1859 27.8457 84.8777 27.8457Z" fill="#2563EB" />
                                <path d="M55.5487 89.5579C55.2392 89.5579 54.9275 89.4554 54.6685 89.2446C54.0711 88.7578 53.9811 87.879 54.4676 87.2816L85.2421 49.487C85.7289 48.8896 86.6071 48.7993 87.2052 49.286C87.8026 49.7728 87.8926 50.6516 87.4061 51.2491L56.6316 89.0436C56.3557 89.3824 55.954 89.5579 55.5487 89.5579Z" fill="#2D4456" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M61.1235 95.0959C62.6493 94.1077 63.6768 92.3448 63.6768 90.4001C63.6768 87.3644 61.1866 84.9852 58.1512 84.8745L49.9062 84.5898V95.0959H61.1235Z" fill="#FFE0CC" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M44.4986 109.649L51.9216 113.934C54.4908 115.412 55.9611 117.958 55.9611 120.93V128.1H21.3838V120.93C21.3838 117.958 22.8541 115.412 25.4233 113.934L32.8463 109.649V101.389H44.4986V109.649Z" fill="#007AFF" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M24.0637 128.1H21.3838V120.93C21.3838 117.958 22.8541 115.412 25.4233 113.934L32.8463 109.649V101.389H35.5183V103.104V104.899V111.365L28.0953 115.65C25.5261 117.128 24.0637 119.673 24.0637 122.646V128.1Z" fill="#036BDB" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M38.4039 109.333C44.4512 109.333 49.3761 104.408 49.3761 98.3609C49.3761 92.3215 44.4512 87.3887 38.4039 87.3887C32.3645 87.3887 27.4316 92.3215 27.4316 98.3609C27.4314 104.408 32.3642 109.333 38.4039 109.333Z" fill="#FFE0CC" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M38.4036 87.3887C39.044 87.3887 39.6764 87.4439 40.293 87.5546C34.4748 88.1554 29.9295 93.0723 29.9295 99.0486C29.9295 103.254 32.1747 106.93 35.5186 108.954C30.8625 107.681 27.4316 103.428 27.4316 98.3606C27.4311 92.3056 32.3483 87.3887 38.4036 87.3887Z" fill="#FFC5A6" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M107.155 109.649L114.578 113.934C117.147 115.412 118.617 117.958 118.617 120.93V128.1H84.04V120.93C84.04 117.958 85.5103 115.412 88.0795 113.934L95.5025 109.649V101.389H107.155V109.649H107.155Z" fill="#FD465F" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M86.72 128.1H84.04V120.93C84.04 117.958 85.5103 115.412 88.0795 113.934L95.5025 109.649V101.389H98.1746V103.104V104.899V111.365L90.7516 115.65C88.1903 117.128 86.72 119.673 86.72 122.646V128.1Z" fill="#BD0D1C" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M101.06 109.333C107.107 109.333 112.032 104.408 112.032 98.3609C112.032 92.3215 107.107 87.3887 101.06 87.3887C95.0207 87.3887 90.0879 92.3215 90.0879 98.3609C90.0879 104.408 95.0207 109.333 101.06 109.333Z" fill="#FFE0CC" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M101.06 87.3887C101.708 87.3887 102.333 87.4439 102.949 87.5546C97.1311 88.1554 92.5937 93.0723 92.5937 99.0486C92.5937 103.254 94.8309 106.93 98.1748 108.954C93.5187 107.681 90.0879 103.428 90.0879 98.3606C90.0876 92.3056 95.0046 87.3887 101.06 87.3887Z" fill="#FFC5A6" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M75.8267 115.917L83.2497 120.202C85.8189 121.688 87.2892 124.233 87.2892 127.198V134.375H52.7119V127.198C52.7119 124.233 54.1822 121.688 56.7514 120.202L64.1744 115.917V107.656H75.8267V115.917Z" fill="#ECBA6E" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M55.3919 134.375H52.7119V127.198C52.7119 124.233 54.1822 121.688 56.7514 120.202L64.1744 115.917V107.656H66.8464V109.372V111.174V117.633L59.4234 121.917C56.8621 123.404 55.3919 125.949 55.3919 128.914V134.375Z" fill="#D49A44" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M69.732 115.61C75.7793 115.61 80.7042 110.678 80.7042 104.638C80.7042 98.5909 75.7793 93.666 69.732 93.666C63.6926 93.666 58.7598 98.5909 58.7598 104.638C58.7598 110.678 63.6926 115.61 69.732 115.61Z" fill="#FFE0CC" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M69.7317 93.666C70.38 93.666 71.0046 93.7213 71.6212 93.8241C65.803 94.4248 61.2576 99.3418 61.2576 105.326C61.2576 109.523 63.5028 113.2 66.8467 115.223C62.1906 113.958 58.7598 109.698 58.7598 104.638C58.7595 98.575 63.6764 93.666 69.7317 93.666Z" fill="#FFC5A6" />
                            </g>
                            <defs>
                                <clipPath id="clip0_17881_3107">
                                    <rect width="140" height="140" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold">Book a Demo Class</h3>
                    <p className="text-gray-600">Experience our teaching style and understand how we can help you achieve your learning goals. Schedule a demo class now!</p>
                    <div className="w-full">
                        <label htmlFor="availableSlots" className="block text-sm font-medium text-gray-700 mb-1">Available Slots</label>
                        <Select
                            id="availableSlots"
                            options={availabilityOptions}
                            onChange={(option) => setSelectedSlot(option ? option.value : '')}
                            placeholder="Select a slot"
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    padding: '0',
                                    height: '45px',
                                    backgroundColor: '#F9FAFB',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '0.75rem',
                                    boxShadow: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    '&:hover': {
                                        borderColor: '#E5E7EB',
                                    },
                                }),
                                valueContainer: (provided) => ({
                                    ...provided,
                                    padding: '0 1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                }),
                                input: (provided) => ({
                                    ...provided,
                                    margin: '0',
                                }),
                                placeholder: (provided) => ({
                                    ...provided,
                                    margin: '0',
                                    lineHeight: '45px',
                                }),
                                dropdownIndicator: (provided) => ({
                                    ...provided,
                                    padding: '0',
                                    paddingRight: '10px',
                                    paddingLeft: '10px',
                                }),
                                indicatorsContainer: (provided) => ({
                                    ...provided,
                                    padding: '0',
                                }),
                                menu: (provided) => ({
                                    ...provided,
                                    zIndex: 100,
                                }),
                                option: (provided, state) => ({
                                    ...provided,
                                    cursor: 'pointer',
                                    backgroundColor: provided.backgroundColor,
                                    color: state.isFocused ? '#000' : provided.color,
                                }),
                            }}
                            isClearable
                        />
                    </div>
                    <button onClick={handleScheduleClass} className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none font-semibold">
                        Schedule Class
                    </button>
                </div>
                <div className="p-4 bg-white rounded-lg flex flex-col items-start space-y-4">
                    <div className='bg-blue-50 rounded-lg w-full py-4 flex justify-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="146" height="146" viewBox="0 0 146 146" fill="none">
                            <path d="M63.875 109.5H118.625V127.75H63.875V109.5Z" fill="#3DC285" />
                            <path d="M63.875 116.344H109.5V120.906H63.875V116.344Z" fill="#35A872" />
                            <path d="M59.3125 63.875H118.625V73H59.3125V63.875Z" fill="#248256" />
                            <path d="M15.9688 34.2188C15.3637 34.2188 14.7835 34.4591 14.3557 34.8869C13.9278 35.3147 13.6875 35.895 13.6875 36.5V95.8125C13.6875 96.4175 13.9278 96.9978 14.3557 97.4256C14.7835 97.8534 15.3637 98.0938 15.9688 98.0938C16.5738 98.0938 17.154 97.8534 17.5818 97.4256C18.0097 96.9978 18.25 96.4175 18.25 95.8125V36.5C18.25 35.895 18.0097 35.3147 17.5818 34.8869C17.154 34.4591 16.5738 34.2188 15.9688 34.2188Z" fill="#4F5659" />
                            <path d="M15.9688 86.6875C19.7484 86.6875 22.8125 83.6234 22.8125 79.8438C22.8125 76.0641 19.7484 73 15.9688 73C12.1891 73 9.125 76.0641 9.125 79.8438C9.125 83.6234 12.1891 86.6875 15.9688 86.6875Z" fill="#2563EB" />
                            <path d="M31.9375 54.75L6.84375 31.9375L73 18.25L139.156 31.9375L114.062 54.75H31.9375Z" fill="#414649" />
                            <path d="M31.9375 55.2063C31.9375 55.2063 52.4688 61.1375 73 61.1375C93.5312 61.1375 114.062 55.2063 114.062 55.2063V43.3438H31.9375V55.2063Z" fill="#414649" />
                            <path d="M114.062 63.875H31.9375V43.3438C31.9375 43.3438 52.4688 36.5 73 36.5C93.5312 36.5 114.062 43.3438 114.062 43.3438V63.875Z" fill="#2563EB" />
                            <path d="M31.9375 63.875V54.75C31.9375 54.75 52.4688 47.9062 73 47.9062C93.5312 47.9062 114.062 54.75 114.062 54.75V63.875H31.9375Z" fill="#4F5659" />
                            <path d="M63.875 73H118.625V91.25H63.875V73Z" fill="#3DC285" />
                            <path d="M66.1562 79.8438H109.5V84.4062H66.1562V79.8438Z" fill="#35A872" />
                            <path d="M82.125 73H95.8125V91.25H82.125V73Z" fill="#E9EEF2" />
                            <path d="M47.9062 91.25H116.344V109.5H47.9062V91.25Z" fill="#248256" />
                            <path d="M47.9062 98.0938H116.344V102.656H47.9062V98.0938Z" fill="#2E9163" />
                            <path d="M82.125 91.25H95.8125V109.5H82.125V91.25Z" fill="#C3C6C7" />
                            <path d="M127.75 127.75H109.5V79.8438V43.3438H127.75V79.8438V127.75Z" fill="#E9EEF2" />
                            <path d="M118.625 50.1875C123.665 50.1875 127.75 47.1234 127.75 43.3438C127.75 39.5641 123.665 36.5 118.625 36.5C113.585 36.5 109.5 39.5641 109.5 43.3438C109.5 47.1234 113.585 50.1875 118.625 50.1875Z" fill="#C3C6C7" />
                            <path d="M109.5 77.5625H127.75V86.6875H109.5V77.5625Z" fill="#FFB632" />
                            <path d="M47.9062 100.375C59.2453 100.375 68.4375 91.1828 68.4375 79.8438C68.4375 68.5047 59.2453 59.3125 47.9062 59.3125C36.5672 59.3125 27.375 68.5047 27.375 79.8438C27.375 91.1828 36.5672 100.375 47.9062 100.375Z" fill="#FFB632" />
                            <path d="M52.4688 77.5625H50.1875V73H54.75C55.355 73 55.9353 72.7597 56.3631 72.3318C56.7909 71.904 57.0312 71.3238 57.0312 70.7188C57.0312 70.1137 56.7909 69.5335 56.3631 69.1057C55.9353 68.6778 55.355 68.4375 54.75 68.4375H50.1875C50.1875 67.8325 49.9472 67.2522 49.5193 66.8244C49.0915 66.3966 48.5113 66.1562 47.9062 66.1562C47.3012 66.1562 46.721 66.3966 46.2932 66.8244C45.8653 67.2522 45.625 67.8325 45.625 68.4375H43.3438C41.5287 68.4375 39.7879 69.1585 38.5045 70.442C37.221 71.7254 36.5 73.4662 36.5 75.2812C36.5 77.0963 37.221 78.8371 38.5045 80.1205C39.7879 81.404 41.5287 82.125 43.3438 82.125H45.625V86.6875H41.0625C40.4575 86.6875 39.8772 86.9278 39.4494 87.3557C39.0216 87.7835 38.7812 88.3637 38.7812 88.9688C38.7812 89.5738 39.0216 90.154 39.4494 90.5818C39.8772 91.0097 40.4575 91.25 41.0625 91.25H45.625C45.625 91.855 45.8653 92.4353 46.2932 92.8631C46.721 93.2909 47.3012 93.5312 47.9062 93.5312C48.5113 93.5312 49.0915 93.2909 49.5193 92.8631C49.9472 92.4353 50.1875 91.855 50.1875 91.25H52.4688C54.2838 91.25 56.0246 90.529 57.308 89.2455C58.5915 87.9621 59.3125 86.2213 59.3125 84.4062C59.3125 82.5912 58.5915 80.8504 57.308 79.567C56.0246 78.2835 54.2838 77.5625 52.4688 77.5625ZM43.3438 77.5625C42.7387 77.5625 42.1585 77.3222 41.7307 76.8943C41.3028 76.4665 41.0625 75.8863 41.0625 75.2812C41.0625 74.6762 41.3028 74.096 41.7307 73.6682C42.1585 73.2403 42.7387 73 43.3438 73H45.625V77.5625H43.3438ZM52.4688 86.6875H50.1875V82.125H52.4688C53.0738 82.125 53.654 82.3653 54.0818 82.7932C54.5097 83.221 54.75 83.8012 54.75 84.4062C54.75 85.0113 54.5097 85.5915 54.0818 86.0193C53.654 86.4472 53.0738 86.6875 52.4688 86.6875Z" fill="#FF8E26" />
                            <path d="M63.875 118.625H31.9375C29.4177 118.625 27.375 120.668 27.375 123.188C27.375 125.707 29.4177 127.75 31.9375 127.75H63.875C66.3948 127.75 68.4375 125.707 68.4375 123.188C68.4375 120.668 66.3948 118.625 63.875 118.625Z" fill="#E09F2C" />
                            <path d="M63.875 109.5H31.9375C29.4177 109.5 27.375 111.543 27.375 114.062C27.375 116.582 29.4177 118.625 31.9375 118.625H63.875C66.3948 118.625 68.4375 116.582 68.4375 114.062C68.4375 111.543 66.3948 109.5 63.875 109.5Z" fill="#EBA72E" />
                            <path d="M63.875 100.375H31.9375C29.4177 100.375 27.375 102.418 27.375 104.938C27.375 107.457 29.4177 109.5 31.9375 109.5H63.875C66.3948 109.5 68.4375 107.457 68.4375 104.938C68.4375 102.418 66.3948 100.375 63.875 100.375Z" fill="#FFB632" />
                            <path d="M82.125 109.5H95.8125V127.75H82.125V109.5Z" fill="#E9EEF2" />
                            <path d="M82.125 63.875H95.8125V73H82.125V63.875Z" fill="#C3C6C7" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold">Pricing Details</h3>
                    <div className="flex flex-col space-y-4 w-full">
                        <div className="flex justify-between items-center p-4 py-2 bg-white rounded-lg border border-gray-200">
                            <h4 className="text-lg font-medium text-gray-800 flex items-center">
                                <FaDollarSign className="mr-2" />
                                Monthly Fee
                            </h4>
                            <p className="text-2xl font-bold text-gray-900">${teacher?.monthlyFee}</p>
                        </div>
                        <div className="flex justify-between items-center p-4 py-2 bg-white rounded-lg border border-gray-200">
                            <h4 className="text-lg font-medium text-gray-800 flex items-center">
                                <FaChalkboardTeacher className="mr-2" />
                                Classes Per Month
                            </h4>
                            <p className="text-2xl font-bold text-gray-900">{teacher?.classesPerWeek}</p>
                        </div>
                    </div>
                    <button onClick={() => setIsHireModalOpen(true)} className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none font-semibold">
                        Hire Now
                    </button>
                </div>
                {teacher && (
                    <HireFormModal isOpen={isHireModalOpen} onClose={() => setIsHireModalOpen(false)} teacher={teacher} onOpenChat={() => handleOpenChat(teacher._id, teacher.name)} />
                )}
                {teacher && (
                    <button onClick={() => handleOpenChat(teacher._id, teacher.name)} className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none font-semibold">
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
