import React from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for redirection
import { FaExternalLinkAlt } from 'react-icons/fa';

const TakeQuiz = () => {
    const router = useRouter();

    const handleQuizClick = () => {
        router.push('/quiz'); // Redirect to the quiz page
    };

    return (
        <div className='bg-white p-4 rounded-lg cursor-pointer border border-gray-200' onClick={handleQuizClick} >
            <div className='flex justify-between mb-2 items-center'>
                <h3 className='text-xl font-semibold text-gray-800'>Take a Quiz</h3>
                <div className='mr-4 cursor-pointer'>
                    <FaExternalLinkAlt />
                </div>
            </div>
            <p className='text-md text-gray-600'>Test your knowledge with our quizzes!</p>
        </div>
    );
};

export default TakeQuiz;
