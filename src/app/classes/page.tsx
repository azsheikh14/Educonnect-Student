'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserContext } from '../contexts/userContext';
import { toast } from 'react-toastify';
import { useChatContext } from '../contexts/chatContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Select from 'react-select';
import { useClassContext } from '../contexts/studentClassContext';

const Classes = () => {
    const { classes, setClasses } = useClassContext();
    const [filter, setFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    // const [sortOption, setSortOption] = useState('date');
    const { userData } = useUserContext();
    const { setCurrentChat } = useChatContext();
    const router = useRouter()

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/class/getStudentClasses/${userData?._id}`);
                setClasses(response.data);
            } catch (error) {
                console.error('Error fetching classes:', error);
            }
        };

        fetchClasses();
    }, [userData]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleConfirmClass = async (classId: string) => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/class/confirm-class/${classId}`, { teacherId: userData?._id });
            console.log('response :', response);
            // if(response.status !== 200) {
            //     toast.error(response?.message || 'Failed to confirm class.');
            // }
            toast.success('Class confirmed successfully!');
            const updatedClasses = classes.map(cls =>
                cls._id === classId ? { ...cls, isConfirmed: true, jitsiLink: response.data.jitsiLink } : cls
            );
            setClasses(updatedClasses);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to confirm class.');
        }
    };

    const handleMessageTeacher = (teacherId: string, teacherProfilePic: string, teacherName: string) => {
        setCurrentChat({
            teacherId: teacherId,
            teacherName: teacherName,
            teacherProfilePic: teacherProfilePic,
        });
        router.push('/messages')
    };

    const filteredClasses = classes
        .filter((cls) =>
            cls.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (filter === '' || cls.subjects.some(subject => subject.toLowerCase() === filter.toLowerCase()))
        )
        .sort((a, b) => {
            // if (sortOption === 'date') {
            //     const dateA = Array.isArray(a.classDate) ? new Date(a.classDate[0]).getTime() : new Date(a.classDate).getTime();
            //     const dateB = Array.isArray(b.classDate) ? new Date(b.classDate[0]).getTime() : new Date(b.classDate).getTime();
            //     return dateA - dateB;
            // }
            return a.teacherName.localeCompare(b.teacherName);
        });

    const uniqueSubjects = Array.from(new Set(classes.flatMap((cls) => cls.subjects)));

    return (
        <div className="p-6">
            <div className='flex justify-between items-center mb-4'>
                <p className='text-lg font-medium'>Your Classes</p>
                <div className="flex flex-col md:flex-row w-1/2 justify-between items-center space-x-2">
                    <div className="relative w-2/3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="absolute left-2 top-1/2 transform -translate-y-1/2">
                            <g clipPath="url(#clip0_17624_34399)">
                                <path d="M17.8028 18.863C18.0957 19.1559 18.5706 19.1559 18.8635 18.863C19.1564 18.5701 19.1564 18.0952 18.8635 17.8024L17.8028 18.863ZM15.6224 9.01896C15.6224 12.6657 12.6661 15.6219 9.01945 15.6219V17.1219C13.4946 17.1219 17.1224 13.4941 17.1224 9.01896H15.6224ZM9.01945 15.6219C5.37274 15.6219 2.4165 12.6657 2.4165 9.01896H0.916504C0.916504 13.4941 4.54431 17.1219 9.01945 17.1219V15.6219ZM2.4165 9.01896C2.4165 5.37225 5.37274 2.41602 9.01945 2.41602V0.916016C4.54431 0.916016 0.916504 4.54383 0.916504 9.01896H2.4165ZM9.01945 2.41602C12.6661 2.41602 15.6224 5.37225 15.6224 9.01896H17.1224C17.1224 4.54383 13.4946 0.916016 9.01945 0.916016V2.41602ZM18.8635 17.8024L14.758 13.6969L13.6974 14.7575L17.8028 18.863L18.8635 17.8024Z" fill="black" />
                            </g>
                            <defs>
                                <clipPath id="clip0_17624_34399">
                                    <rect width="20" height="20" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                        <input
                            type="text"
                            placeholder="Search Teachers..."
                            className="rounded-lg p-2 pl-10 w-full focus:outline-none border-none"
                            style={{ border: '1px solid #E5E7EB', borderRadius: '0.75rem', backgroundColor: '#F9FAFB' }}
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                    <Select
                        options={[{ value: '', label: 'All Categories' }, ...uniqueSubjects.map(subject => ({ value: subject, label: subject }))]}
                        value={filter ? { value: filter, label: filter } : { value: '', label: 'All Categories' }}
                        onChange={(selectedOption) => setFilter(selectedOption?.value || '')}
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
                    />

                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClasses.map((cls) => (
                    <div key={cls._id} className='bg-white rounded-lg p-4'>
                        <div className='flex justify-between mb-6'>
                            <div className='flex'>
                                {cls.teacherProfilePic ?
                                    <img src={cls.teacherProfilePic} alt="" />
                                    :
                                    <div className='w-10 h-10 bg-gray-100 rounded-full flex items-end justify-center'>
                                        <Image src="/svg/noPic.svg" className='rounded-full' height={45} width={45} alt="" />
                                    </div>
                                }
                                <div className='ml-3'>
                                    <p className='text-base font-semibold cursor-pointer' onClick={() => router.push(`/teacher?id=${cls.teacherId}`)}>{cls.teacherName || 'Student Name'}</p>
                                    <p className='text-sm text-gray-400 font-normal'>Teacher</p>
                                </div>
                            </div>
                            <div className='flex space-x-4 cursor-pointer'>
                                <div onClick={() => router.push(`/teacher?id=${cls.teacherId}`)} className='w-10 h-10 bg-gray-100 rounded-full p-1 flex items-center justify-center'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 18 18" fill="none">
                                        <path d="M13.5 15H4.5C3.675 15 3 14.325 3 13.5V4.5C3 3.675 3.675 3 4.5 3H7.5C7.95 3 8.25 3.3 8.25 3.75C8.25 4.2 7.95 4.5 7.5 4.5H4.5V13.5H13.5V10.5C13.5 10.05 13.8 9.75 14.25 9.75C14.7 9.75 15 10.05 15 10.5V13.5C15 14.325 14.325 15 13.5 15Z" fill="#070707" />
                                        <path d="M15 7.5C14.55 7.5 14.25 7.2 14.25 6.75V3.75H11.25C10.8 3.75 10.5 3.45 10.5 3C10.5 2.55 10.8 2.25 11.25 2.25H15C15.45 2.25 15.75 2.55 15.75 3V6.75C15.75 7.2 15.45 7.5 15 7.5Z" fill="#070707" />
                                        <path d="M9.75 9C9.525 9 9.375 8.925 9.225 8.775C8.925 8.475 8.925 8.025 9.225 7.725L14.475 2.475C14.775 2.175 15.225 2.175 15.525 2.475C15.825 2.775 15.825 3.225 15.525 3.525L10.275 8.775C10.125 8.925 9.975 9 9.75 9Z" fill="#070707" />
                                    </svg>
                                </div>
                                <div onClick={() => handleMessageTeacher(cls.teacherId, cls.teacherProfilePic, cls.teacherName)} className='w-10 h-10 bg-blue-500 rounded-full p-1 flex items-center justify-center'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <g clipPath="url(#clip0_17623_18035)">
                                            <path d="M8.96484 0.5625C4.02152 0.5625 0 4.11075 0 8.47266C0 10.3153 0.729211 12.1007 2.05632 13.5159C2.31898 14.5989 2.00018 15.7463 1.20916 16.5373C0.878414 16.8681 1.11231 17.4375 1.58203 17.4375C3.08475 17.4375 4.5334 16.8489 5.60971 15.8107C6.6747 16.1907 7.80149 16.3828 8.96484 16.3828C13.9082 16.3828 18 12.8346 18 8.47266C18 4.11075 13.9082 0.5625 8.96484 0.5625ZM4.81641 10.0547C3.94404 10.0547 3.23438 9.34502 3.23438 8.47266C3.23438 7.60029 3.94404 6.89062 4.81641 6.89062C5.68877 6.89062 6.39844 7.60029 6.39844 8.47266C6.39844 9.34502 5.68877 10.0547 4.81641 10.0547ZM9.03516 10.0547C8.16279 10.0547 7.45312 9.34502 7.45312 8.47266C7.45312 7.60029 8.16279 6.89062 9.03516 6.89062C9.90752 6.89062 10.6172 7.60029 10.6172 8.47266C10.6172 9.34502 9.90752 10.0547 9.03516 10.0547ZM13.2539 10.0547C12.3815 10.0547 11.6719 9.34502 11.6719 8.47266C11.6719 7.60029 12.3815 6.89062 13.2539 6.89062C14.1263 6.89062 14.8359 7.60029 14.8359 8.47266C14.8359 9.34502 14.1263 10.0547 13.2539 10.0547Z" fill="white" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_17623_18035">
                                                <rect width="18" height="18" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-between mb-2'>
                            <div className='flex space-x-2 text-gray-400 items-center'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <g clipPath="url(#clip0_17623_18043)">
                                        <path d="M7.99911 13.3574C7.69758 13.3574 7.45312 13.6019 7.45312 13.9034V15.4558C7.45312 15.7573 7.69758 16.0017 7.99911 16.0017C8.30071 16.0017 8.5451 15.7573 8.5451 15.4558V13.9034C8.5451 13.6018 8.30064 13.3574 7.99911 13.3574Z" fill="#767C8C" />
                                        <path d="M7.99911 2.64642C8.30071 2.64642 8.5451 2.40196 8.5451 2.10043V0.547939C8.5451 0.246409 8.30071 0.00195312 7.99911 0.00195312C7.69758 0.00195312 7.45312 0.246409 7.45312 0.547939V2.10043C7.45312 2.40196 7.69758 2.64642 7.99911 2.64642Z" fill="#767C8C" />
                                        <path d="M3.44122 11.7887L2.34313 12.8862C2.12984 13.0993 2.12976 13.4451 2.34292 13.6583C2.44956 13.7649 2.58934 13.8183 2.72911 13.8183C2.86881 13.8183 3.00844 13.765 3.11508 13.6585L4.21317 12.561C4.42647 12.3479 4.42654 12.0021 4.21339 11.7889C4.00009 11.5756 3.65445 11.5756 3.44122 11.7887Z" fill="#767C8C" />
                                        <path d="M12.1724 4.3751C12.3121 4.3751 12.4518 4.32181 12.5585 4.21523L13.6564 3.11773C13.8696 2.9045 13.8697 2.55886 13.6565 2.34556C13.4433 2.13226 13.0977 2.13219 12.8844 2.34548L11.7864 3.44299C11.5732 3.65614 11.5731 4.00186 11.7863 4.21508C11.8929 4.32181 12.0326 4.3751 12.1724 4.3751Z" fill="#767C8C" />
                                        <path d="M2.64432 8.00106C2.64432 7.69953 2.39986 7.45508 2.09833 7.45508H0.545986C0.244456 7.45508 0 7.69953 0 8.00106C0 8.30259 0.244456 8.54705 0.545986 8.54705H2.09833C2.39986 8.54705 2.64432 8.30259 2.64432 8.00106Z" fill="#767C8C" />
                                        <path d="M15.454 7.45508H13.901C13.5994 7.45508 13.355 7.69953 13.355 8.00106C13.355 8.30259 13.5994 8.54705 13.901 8.54705H15.454C15.7556 8.54705 16 8.30259 16 8.00106C16 7.69961 15.7556 7.45508 15.454 7.45508Z" fill="#767C8C" />
                                        <path d="M3.44102 4.21514C3.54759 4.32172 3.68737 4.375 3.82707 4.375C3.96676 4.375 4.10654 4.32172 4.21311 4.21514C4.42634 4.00191 4.42634 3.6562 4.21311 3.44297L3.11561 2.34547C2.90238 2.13224 2.55667 2.13224 2.34351 2.34547C2.13029 2.55869 2.13029 2.90441 2.34351 3.11756L3.44102 4.21514Z" fill="#767C8C" />
                                        <path d="M12.5591 11.7889C12.3459 11.5756 12.0002 11.5756 11.7869 11.7888C11.5736 12.002 11.5736 12.3477 11.7869 12.5609L12.8842 13.6584C12.9909 13.765 13.1306 13.8183 13.2703 13.8183C13.41 13.8183 13.5498 13.765 13.6564 13.6585C13.8697 13.4452 13.8697 13.0995 13.6565 12.8864L12.5591 11.7889Z" fill="#767C8C" />
                                        <path d="M7.99993 3.75195C5.65678 3.75195 3.75049 5.65839 3.75049 8.00169C3.75049 10.3449 5.65678 12.2513 7.99993 12.2513C10.3433 12.2513 12.2497 10.3449 12.2497 8.00169C12.2497 5.65839 10.3432 3.75195 7.99993 3.75195ZM7.99993 11.1593C6.25889 11.1593 4.84246 9.7428 4.84246 8.00169C4.84246 6.2605 6.25889 4.84392 7.99993 4.84392C9.74119 4.84392 11.1578 6.2605 11.1578 8.00169C11.1578 9.7428 9.74119 11.1593 7.99993 11.1593Z" fill="#767C8C" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_17623_18043">
                                            <rect width="16" height="16" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                                <p className='text-base font-medium '>Day</p>
                            </div>
                            <div>
                                <p className='text-lg font-medium'>
                                    {cls.slot.day.includes(',')
                                        ? cls.slot.day.split(',').map(day => {
                                            const dayMap: { [key: string]: string } = {
                                                'Monday': 'Mon',
                                                'Tuesday': 'Tue',
                                                'Wednesday': 'Wed',
                                                'Thursday': 'Thur',
                                                'Friday': 'Fri',
                                                'Saturday': 'Sat',
                                                'Sunday': 'Sun'
                                            };
                                            return dayMap[day.trim()] || day.trim();
                                        }).join(', ')
                                        : cls.slot.day}
                                </p>
                            </div>
                        </div>
                        <div className='flex justify-between mb-2'>
                            <div className='flex space-x-2 text-gray-400 items-center'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <g clipPath="url(#clip0_17623_18058)">
                                        <path d="M7.99984 0.666016C6.54944 0.666016 5.13162 1.09611 3.92566 1.90191C2.7197 2.7077 1.77977 3.85301 1.22472 5.193C0.669681 6.533 0.524457 8.00748 0.807415 9.43001C1.09037 10.8525 1.78881 12.1592 2.81439 13.1848C3.83998 14.2104 5.14665 14.9088 6.56918 15.1918C7.99171 15.4747 9.4662 15.3295 10.8062 14.7745C12.1462 14.2194 13.2915 13.2795 14.0973 12.0735C14.9031 10.8676 15.3332 9.44975 15.3332 7.99935C15.3309 6.05513 14.5575 4.1912 13.1828 2.81643C11.808 1.44166 9.94406 0.668309 7.99984 0.666016ZM7.99984 13.9993C6.81315 13.9993 5.65311 13.6475 4.66642 12.9882C3.67972 12.3289 2.91069 11.3918 2.45656 10.2955C2.00244 9.19909 1.88362 7.99269 2.11513 6.82881C2.34664 5.66492 2.91808 4.59582 3.7572 3.75671C4.59631 2.91759 5.66541 2.34615 6.8293 2.11464C7.99319 1.88313 9.19958 2.00195 10.2959 2.45607C11.3923 2.9102 12.3294 3.67923 12.9887 4.66593C13.6479 5.65262 13.9998 6.81266 13.9998 7.99935C13.9979 9.59005 13.3651 11.115 12.2403 12.2398C11.1155 13.3646 9.59054 13.9974 7.99984 13.9993Z" fill="#767C8C" />
                                        <path d="M8.66683 7.72465V4.00065C8.66683 3.82384 8.59659 3.65427 8.47157 3.52925C8.34654 3.40422 8.17697 3.33398 8.00016 3.33398C7.82335 3.33398 7.65378 3.40422 7.52876 3.52925C7.40373 3.65427 7.3335 3.82384 7.3335 4.00065V8.00065C7.33353 8.17745 7.4038 8.34699 7.52883 8.47198L9.52883 10.472C9.65456 10.5934 9.82297 10.6606 9.99776 10.6591C10.1726 10.6576 10.3398 10.5875 10.4634 10.4639C10.587 10.3403 10.6571 10.173 10.6586 9.99825C10.6601 9.82345 10.5929 9.65505 10.4715 9.52932L8.66683 7.72465Z" fill="#767C8C" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_17623_18058">
                                            <rect width="16" height="16" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                                <p className='text-base font-medium '>Time</p>
                            </div>
                            <div>
                                <p className='text-lg font-medium'>{cls.slot.slot}</p>
                            </div>
                        </div>
                        <div className='flex justify-between mb-2'>
                            <div className='flex space-x-2 text-gray-400 items-center'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <g clipPath="url(#clip0_17623_18065)">
                                        <mask id="mask0_17623_18065" style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="-1" y="-1" width="17" height="17">
                                            <path d="M-0.000976562 -0.0039053H15.999V15.9961H-0.000976562V-0.0039053Z" fill="white" />
                                        </mask>
                                        <g mask="url(#mask0_17623_18065)">
                                            <path d="M3.28027 12.6836V14.5586H15.5303V2.37109H3.28027V5.18359H15.5303" stroke="#767C8C" strokeWidth="0.9375" stroke-miterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M6.12402 1.43359V3.30859" stroke="#767C8C" strokeWidth="0.9375" stroke-miterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M12.7178 1.43359V3.30859" stroke="#767C8C" strokeWidth="0.9375" stroke-miterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M9.40527 1.43359V3.30859" stroke="#767C8C" strokeWidth="0.9375" stroke-miterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M3.28027 5.18359C3.28027 10.3398 0.467773 12.6836 0.467773 12.6836H12.7178C12.7178 12.6836 15.5303 10.3398 15.5303 5.18359" stroke="#767C8C" strokeWidth="0.9375" stroke-miterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                        </g>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_17623_18065">
                                            <rect width="16" height="16" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                                <p className='text-base font-medium '>Date</p>
                            </div>
                            <div>
                                <p className='text-lg font-medium'>
                                    {Array.isArray(cls.classDate)
                                        ? cls.classDate.length > 1
                                            ? 'Recurring Class'
                                            : new Date(cls.classDate[0]).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
                                        : new Date(cls.classDate).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                                </p>
                            </div>
                        </div>
                        <div className='flex justify-between mb-2'>
                            <div className='flex space-x-2 text-gray-400 items-center'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M8.84536 9.53305C9.10336 9.63159 9.23256 9.92059 9.13403 10.1785C8.70816 11.2937 8.06016 11.9084 7.27343 12.2159C6.54521 12.5004 5.73856 12.5003 5.04364 12.5001C5.02914 12.5001 5.0147 12.5001 5.0003 12.5001C4.25348 12.5001 3.62724 12.5063 3.09114 12.7159C2.59832 12.9084 2.1387 13.2937 1.80072 14.1785C1.70219 14.4365 1.4132 14.5657 1.15523 14.4672C0.897264 14.3687 0.76801 14.0797 0.866543 13.8217C1.29245 12.7067 1.94046 12.0919 2.72717 11.7844C3.45539 11.4999 4.26204 11.5 4.95696 11.5001H5.0003C5.74711 11.5001 6.37336 11.4939 6.90943 11.2844C7.4023 11.0919 7.8619 10.7067 8.1999 9.82172C8.29843 9.56372 8.58743 9.43452 8.84536 9.53305Z" fill="#767C8C" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M8.63173 1.5H11.37C12.1252 1.49999 12.7424 1.49997 13.2296 1.56548C13.7389 1.63395 14.1805 1.78214 14.5329 2.1346C14.8854 2.48707 15.0336 2.92862 15.1021 3.43793C15.1675 3.92517 15.1675 4.54232 15.1675 5.29754V6.70247C15.1675 7.45767 15.1675 8.07487 15.1021 8.56207C15.0336 9.0714 14.8854 9.51293 14.5329 9.8654C14.1805 10.2179 13.7389 10.3661 13.2296 10.4345C12.7424 10.5 12.1252 10.5 11.37 10.5H10.3333C10.0572 10.5 9.83333 10.2761 9.83333 10C9.83333 9.72387 10.0572 9.5 10.3333 9.5H11.3342C12.134 9.5 12.6836 9.49893 13.0963 9.44347C13.4948 9.38987 13.6901 9.294 13.8258 9.15827C13.9615 9.0226 14.0574 8.82727 14.111 8.4288C14.1665 8.01607 14.1675 7.46647 14.1675 6.66667V5.33333C14.1675 4.53353 14.1665 3.98397 14.111 3.57117C14.0574 3.17276 13.9615 2.9774 13.8258 2.84171C13.6901 2.70601 13.4948 2.61013 13.0963 2.55656C12.6836 2.50106 12.134 2.5 11.3342 2.5H8.66753C7.86773 2.5 7.3182 2.50106 6.9054 2.55656C6.50696 2.61013 6.3116 2.70601 6.1759 2.84171C6.05972 2.95789 5.97433 3.11613 5.91834 3.40199C5.8596 3.70181 5.84076 4.10033 5.83592 4.67091C5.83358 4.94704 5.60783 5.16899 5.3317 5.16665C5.05556 5.16431 4.83361 4.93856 4.83596 4.66243C4.84076 4.0953 4.85832 3.61137 4.93698 3.20976C5.01838 2.7942 5.17138 2.43203 5.4688 2.1346C5.82126 1.78214 6.26282 1.63395 6.77213 1.56548C7.25933 1.49997 7.87653 1.49999 8.63173 1.5Z" fill="#767C8C" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M5.00016 7.16602C4.35583 7.16602 3.8335 7.68835 3.8335 8.33268C3.8335 8.97702 4.35583 9.49935 5.00016 9.49935C5.6445 9.49935 6.16683 8.97702 6.16683 8.33268C6.16683 7.68835 5.6445 7.16602 5.00016 7.16602ZM2.8335 8.33268C2.8335 7.13608 3.80355 6.16602 5.00016 6.16602C6.19678 6.16602 7.16683 7.13608 7.16683 8.33268C7.16683 9.52928 6.19678 10.4993 5.00016 10.4993C3.80355 10.4993 2.8335 9.52928 2.8335 8.33268Z" fill="#767C8C" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M7.5 4.66602C7.5 4.38988 7.72387 4.16602 8 4.16602H12C12.2761 4.16602 12.5 4.38988 12.5 4.66602C12.5 4.94216 12.2761 5.16602 12 5.16602H8C7.72387 5.16602 7.5 4.94216 7.5 4.66602ZM9.5 7.33268C9.5 7.05655 9.72387 6.83268 10 6.83268H12C12.2761 6.83268 12.5 7.05655 12.5 7.33268C12.5 7.60882 12.2761 7.83268 12 7.83268H10C9.72387 7.83268 9.5 7.60882 9.5 7.33268Z" fill="#767C8C" />
                                </svg>
                                <p className='text-base font-medium '>Class</p>
                            </div>
                            <div>
                                {cls.classes?.length ?
                                    <p className='text-lg font-medium'>{cls.classes?.join(', ')}</p>
                                    :
                                    <p className='text-lg font-medium'>No Classes</p>
                                }
                            </div>
                        </div>
                        <div className='flex justify-between mb-2'>
                            <div className='flex space-x-2 text-gray-400 items-center'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M13.543 3.0529C13.3976 2.91262 13.2255 2.8029 13.037 2.7302C12.8484 2.65751 12.6472 2.62332 12.4453 2.62965C10.7203 2.6869 9.31653 3.0619 8.27028 3.7449C8.18983 3.79739 8.09584 3.82535 7.99978 3.82535C7.90372 3.82535 7.80973 3.79739 7.72928 3.7449C6.68378 3.06215 5.27928 2.68715 3.55428 2.6299C3.3523 2.6232 3.15105 2.65723 2.9625 2.72994C2.77395 2.80266 2.60196 2.91257 2.45678 3.05315C2.31175 3.19249 2.1965 3.3598 2.11799 3.54496C2.03949 3.73012 1.99936 3.92928 2.00003 4.1304V10.6436C1.99763 11.0324 2.14732 11.4066 2.41713 11.6865C2.68694 11.9663 3.05547 12.1296 3.44403 12.1414C4.96903 12.1914 6.23803 12.5289 7.21678 13.1471C7.45166 13.2942 7.72318 13.3721 8.00028 13.3721C8.27738 13.3721 8.54889 13.2942 8.78378 13.1471C9.76203 12.5289 11.0313 12.1906 12.556 12.1414C12.9446 12.1296 13.3131 11.9663 13.5829 11.6865C13.8527 11.4066 14.0024 11.0324 14 10.6436V4.1304C14.0007 3.92922 13.9605 3.73 13.882 3.5448C13.8034 3.35959 13.6881 3.19225 13.543 3.0529ZM3.47628 11.1416C3.34817 11.1356 3.22731 11.0805 3.13867 10.9878C3.05003 10.8951 3.0004 10.7719 3.00003 10.6436V4.1304C2.99988 4.06336 3.01332 3.99699 3.03953 3.93529C3.06574 3.87359 3.10418 3.81784 3.15253 3.7714C3.24672 3.67971 3.37308 3.62855 3.50453 3.6289H3.52153C5.06053 3.6789 6.29228 4.00065 7.18253 4.58165C7.28187 4.64521 7.38846 4.69666 7.50003 4.7349V12.1571C6.26128 11.4966 4.88014 11.148 3.47628 11.1416ZM13 10.6436C12.9997 10.7717 12.9502 10.8947 12.8618 10.9874C12.7735 11.08 12.6529 11.1352 12.525 11.1416C11.1207 11.1477 9.73907 11.4964 8.50003 12.1574V4.73515C8.61155 4.6968 8.71813 4.64536 8.81753 4.5819C9.70778 4.0009 10.9395 3.68015 12.4783 3.62915C12.5463 3.62596 12.6143 3.63696 12.6779 3.66145C12.7414 3.68594 12.7992 3.72338 12.8475 3.7714C12.8959 3.81784 12.9343 3.87359 12.9605 3.93529C12.9867 3.99699 13.0002 4.06336 13 4.1304V10.6436Z" fill="#767C8C" />
                                </svg>
                                <p className='text-base font-medium '>Subject</p>
                            </div>
                            <div>
                                <p className='text-lg font-medium'>{cls.subjects?.join(', ')}</p>
                            </div>
                        </div>
                        <div className='flex justify-between mb-2'>
                            <div className='flex space-x-2 text-gray-400 items-center'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M6.14356 2H3.38769C2.62252 2 2 2.62252 2 3.38769V6.14356C2 6.90873 2.62252 7.53125 3.38769 7.53125H6.14356C6.90873 7.53125 7.53125 6.90873 7.53125 6.14356V3.38769C7.53125 2.62252 6.90873 2 6.14356 2ZM6.59375 6.14356C6.59375 6.39179 6.39179 6.59375 6.14356 6.59375H3.38769C3.13946 6.59375 2.9375 6.39179 2.9375 6.14356V3.38769C2.9375 3.13946 3.13946 2.9375 3.38769 2.9375H6.14356C6.39179 2.9375 6.59375 3.13946 6.59375 3.38769V6.14356Z" fill="#767C8C" />
                                    <path d="M12.5938 2H9.875C9.09959 2 8.46875 2.63084 8.46875 3.40625V6.125C8.46875 6.90041 9.09959 7.53125 9.875 7.53125H12.5938C13.3692 7.53125 14 6.90041 14 6.125V3.40625C14 2.63084 13.3692 2 12.5938 2ZM13.0625 6.125C13.0625 6.38347 12.8522 6.59375 12.5938 6.59375H9.875C9.61653 6.59375 9.40625 6.38347 9.40625 6.125V3.40625C9.40625 3.14778 9.61653 2.9375 9.875 2.9375H12.5938C12.8522 2.9375 13.0625 3.14778 13.0625 3.40625V6.125Z" fill="#767C8C" />
                                    <path d="M6.14356 8.46875H3.38769C2.62252 8.46875 2 9.09127 2 9.85644V12.6123C2 13.3775 2.62252 14 3.38769 14H6.14356C6.90873 14 7.53125 13.3775 7.53125 12.6123V9.85644C7.53125 9.09127 6.90873 8.46875 6.14356 8.46875ZM6.59375 12.6123C6.59375 12.8605 6.39179 13.0625 6.14356 13.0625H3.38769C3.13946 13.0625 2.9375 12.8605 2.9375 12.6123V9.85644C2.9375 9.60821 3.13946 9.40625 3.38769 9.40625H6.14356C6.39179 9.40625 6.59375 9.60821 6.59375 9.85644V12.6123Z" fill="#767C8C" />
                                    <path d="M12.5938 8.46875H9.875C9.09959 8.46875 8.46875 9.09959 8.46875 9.875V12.5938C8.46875 13.3692 9.09959 14 9.875 14H12.5938C13.3692 14 14 13.3692 14 12.5938V9.875C14 9.09959 13.3692 8.46875 12.5938 8.46875ZM13.0625 12.5938C13.0625 12.8522 12.8522 13.0625 12.5938 13.0625H9.875C9.61653 13.0625 9.40625 12.8522 9.40625 12.5938V9.875C9.40625 9.61653 9.61653 9.40625 9.875 9.40625H12.5938C12.8522 9.40625 13.0625 9.61653 13.0625 9.875V12.5938Z" fill="#767C8C" />
                                </svg>
                                <p className='text-base font-medium '>Type</p>
                            </div>
                            <div>
                                <p className='text-lg font-medium'>{cls.type}</p>
                            </div>
                        </div>
                        <div className='my-3 h-16 flex flex-col justify-center'>
                            <p className='text-base font-medium text-gray-400 mb-2'>Meeting Link</p>
                            {cls.jitsiLink ?
                                <p className='text-sm font-medium text-gray-400'>
                                    <a href={cls.jitsiLink} target="_blank" rel="noopener noreferrer" className='text-blue-500 underline'>
                                        Join Meeting
                                    </a>
                                </p>
                                :
                                <p className=' font-medium text-gray-400'>Class not Confirmed Yet</p>
                            }
                        </div>
                        <div className="flex justify-between items-center text-center w-full text-base font-bold">
                            <div className="w-full">
                                {!cls.isConfirmed ? (
                                    cls.isConfirmedByStudent ? (
                                        <button className="bg-red-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring focus:ring-red-300 w-full">
                                            Waiting for Confirmation
                                        </button>
                                    ) : (
                                        <button onClick={() => cls._id && handleConfirmClass(cls._id)} className="bg-blue-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 w-full" >
                                            Confirm Class
                                        </button>
                                    )
                                ) : (
                                    <button className="bg-gray-400 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 w-full" disabled>
                                        Class Confirmed
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    );
};

export default Classes;
