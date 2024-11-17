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
    {
      id: 4,
      name: 'Charlie Brown',
      hourlyRate: '$35',
      classesPerWeek: 4,
      imageUrl: '/bijju.png',
    },
  ];

  return (
    <div className='bg-white px-10 py-4 rounded-lg border-t border-gray-200'>
      <div className='flex mb-4'>
        <div className='w-2/12 font-bold text-gray-900 text-left'>Index</div>
        <div className='w-4/12 font-bold text-gray-900 text-left'>Teacher</div>
        <div className='w-2/12 font-bold text-gray-900 text-left'>Hourly Rate</div>
        <div className='w-2/12 font-bold text-gray-900 text-left'>Classes/Week</div>
        <div className='w-2/12 font-bold text-gray-900 text-right'>Actions</div>
      </div>
      {teachers.map((teacher, index) => (
        <div
          key={teacher.id}
          className={`flex items-center py-4 ${index !== teachers.length - 1 ? 'border-b' : ''}`}
        >
          <div className='w-2/12 text-left'>{index + 1}</div> {/* Index column */}
          <div className='w-4/12 text-left flex items-center'>
            <img
              src={teacher.imageUrl}
              alt={teacher.name}
              className='w-8 h-8 rounded-full mr-2'
            />
            <h3 className='text-lg font-bold text-gray-900'>{teacher.name}</h3>
          </div>
          <div className='w-2/12 text-left'>
            <p className='text-md text-gray-600'>{teacher.hourlyRate}/class</p>
          </div>
          <div className='w-2/12 text-left'>
            <p className='text-md text-gray-600'>{teacher.classesPerWeek} classes/week</p>
          </div>
          <div className='w-2/12 flex justify-end'>
            <FaExternalLinkAlt className='cursor-pointer mr-4' />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedTeachers;
