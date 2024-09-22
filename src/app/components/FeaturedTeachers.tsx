import React from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';

const FeaturedTeachers = () => {
  const teachers = [
    {
      id: 1,
      name: 'Alice Smith',
      hourlyRate: '$30',
      classesPerWeek: 5,
      imageUrl: '/bijju.png',
    },
    {
      id: 2,
      name: 'Bob Johnson',
      hourlyRate: '$25',
      classesPerWeek: 3,
      imageUrl: '/bijju.png',
    },
    {
      id: 3,
      name: 'Charlie Brown',
      hourlyRate: '$35',
      classesPerWeek: 4,
      imageUrl: '/bijju.png',
    },
  ];

  return (
    <div className='py-6'>
      <h2 className='text-2xl font-bold text-gray-800 mb-4'>Featured Teachers</h2>
      <div className='flex flex-col gap-6'>
        {teachers.map(teacher => (
          <div key={teacher.id} className='bg-white p-4 flex items-center rounded-lg shadow-md'>
            <img
              src={teacher.imageUrl}
              alt={teacher.name}
              className='w-16 h-16 rounded-full mr-4'
            />
            <div className='flex flex-col w-full'>
              {/* Desktop layout */}
              <div className='hidden sm:flex justify-evenly w-full '>
                <h3 className='text-lg font-bold text-gray-900'>{teacher.name}</h3>
                <p className='text-md text-gray-600'>{teacher.hourlyRate}/class</p>
                <p className='text-md text-gray-600'>{teacher.classesPerWeek} classes/week</p>
                <FaExternalLinkAlt className='text-gray-500 hover:text-blue-500 cursor-pointer' />
              </div>

              {/* Mobile layout */}
              <div className='flex flex-col sm:hidden justify-evenly w-full p-4'>
                <h3 className='text-lg font-bold text-gray-900 text-center'>{teacher.name}</h3>
                <p className='text-md text-gray-600 text-center'>{teacher.hourlyRate}/class</p>
                <p className='text-md text-gray-600 text-center'>{teacher.classesPerWeek} classes/week</p>
                <FaExternalLinkAlt className='text-gray-500 hover:text-blue-500 cursor-pointer self-center mt-2' />
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedTeachers;
