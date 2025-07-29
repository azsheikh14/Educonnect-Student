'use client'
import React, { useEffect, useState, useRef } from 'react';
import TeacherCard from '../components/TeacherCard';
import Teacher from '../interfaces/profile';
import Select from 'react-select';
import { getTeachersByPageLimit } from '../services/teacherService';

interface OptionType {
    value: string;
    label: string;
}

const Teachers = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [subjectFilter, setSubjectFilter] = useState<OptionType | null>(null);
    const [classFilter, setClassFilter] = useState<OptionType | null>(null);
    const [sortOption, setSortOption] = useState('name');
    const [page, setPage] = useState(1);
    const [totalTeachers, setTotalTeachers] = useState(0);
    const [loading, setLoading] = useState(false);
    const pageRef = useRef(page);
    const [hasMore, setHasMore] = useState(true);
    const initialFetch = useRef(true);

    const fetchTeachers = async (page: number, limit: number) => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const response = await getTeachersByPageLimit(page, limit);
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
                pageRef.current = pageRef.current + 1
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

    const handleClearFilters = () => {
        setSubjectFilter(null);
        setClassFilter(null);
        setSortOption('name');
        setSearchTerm('');
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filteredTeachers = teachers
        .filter((teacher) =>
            teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (!subjectFilter || teacher.subjects?.includes(subjectFilter.value)) &&
            (!classFilter || teacher.classes?.includes(classFilter.value))
        )
        .sort((a, b) => {
            if (sortOption === 'experience') {
                return b.experienceYears - a.experienceYears;
            } else {
                return 0;
            }
        });

    const uniqueSubjects = Array.from(new Set(teachers.flatMap(teacher => teacher.subjects || [])));
    const uniqueClasses = Array.from(new Set(teachers.flatMap(teacher => teacher.classes || [])));

    const subjectOptions = uniqueSubjects.map(subject => ({ value: subject, label: subject }));
    const classOptions = uniqueClasses.map(classItem => ({ value: classItem, label: classItem }));

    return (
        <div className="p-5">
            <div className='mb-4'>
                <p className='text-lg font-medium'>Explore Our Teachers</p>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
                <div className="relative w-1/3">
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
                        onChange={handleSearchChange}
                    />
                </div>
                <div className='space-x-3 ml-3 flex'>
                    <Select
                        options={subjectOptions}
                        value={subjectFilter}
                        onChange={setSubjectFilter}
                        placeholder="Filter by Subject"
                        className="w-60"
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
                    <Select
                        options={classOptions}
                        value={classFilter}
                        onChange={setClassFilter}
                        placeholder="Filter by Class"
                        className="w-60"
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
                    <button onClick={handleClearFilters} className="bg-blue-400 rounded-lg px-4 text-white focus:outline-none" >
                        Clear
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredTeachers.map((teacher) => (
                    <TeacherCard key={teacher._id} teacher={teacher} />
                ))}
            </div>
        </div >
    );
};

export default Teachers;
