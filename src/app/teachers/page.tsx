'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TeacherCard from '../components/TeacherCard'; // Assuming you have a TeacherCard component
import Teacher from '../interface/Teacher';
import { FaSearch } from 'react-icons/fa';
import Select from 'react-select';

// Define the type for the select options
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

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const response = await axios.post(`${apiUrl}/teacher/getAllTeachers`);
                setTeachers(response.data);
            } catch (error) {
                console.error('Error fetching teachers:', error);
            }
        };

        fetchTeachers();
    }, []);

    const handleClearFilters = () => {
        setSubjectFilter(null);
        setClassFilter(null);
        setSortOption('name'); // Reset sort option to default
        setSearchTerm(''); // Clear search term
    };

    const sortOptions = [
        { value: 'name', label: 'Sort by Name' },
        { value: 'experience', label: 'Sort by Experience' },
    ];

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
            if (sortOption === 'name') {
                return a.name.localeCompare(b.name);
            } else if (sortOption === 'experience') {
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
            <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">Explore Our Teachers</h1>

            <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
                <div className="flex relative w-full md:w-1/3">
                    <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search Teachers"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="flex-grow p-2 border border-gray-300 focus:outline-none pl-4"
                    />
                </div>
                <div className='space-x-3 flex'>
                    <Select
                        options={subjectOptions}
                        value={subjectFilter}
                        onChange={setSubjectFilter}
                        placeholder="Filter by Subject"
                        className="w-48"
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                minWidth: '150px',
                                width: 'auto',
                            }),
                        }}
                    />
                    <Select
                        options={classOptions}
                        value={classFilter}
                        onChange={setClassFilter}
                        placeholder="Filter by Class"
                        className="w-48"
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                minWidth: '150px',
                                width: 'auto',
                            }),
                        }}
                    />
                    <Select
                        options={sortOptions}
                        value={sortOptions.find(option => option.value === sortOption)}
                        onChange={(option) => setSortOption(option?.value || 'name')}
                        placeholder="Sort"
                        className="w-48"
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                minWidth: '150px',
                                width: 'auto',
                            }),
                        }}
                    />
                    <button
                        onClick={handleClearFilters}
                        className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none"
                    >
                        Clear All
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
