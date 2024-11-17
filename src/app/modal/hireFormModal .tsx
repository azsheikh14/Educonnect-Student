import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import Select, { SingleValue } from 'react-select';
import Teacher from '../interfaces/profile';

interface HireFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    teacher: Teacher;
    onOpenChat: () => void;
}

const HireFormModal: React.FC<HireFormModalProps> = ({ isOpen, onClose, teacher, onOpenChat }) => {
    const [selectedSubject, setSelectedSubject] = useState<{ value: string; label: string } | null>(null);
    const [selectedClass, setSelectedClass] = useState<{ value: string; label: string } | null>(null);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [loading, setLoading] = useState(false);

    const subjectOptions = teacher.subjects ? 
        teacher.subjects.map(subject => ({ value: subject, label: subject })) : [];
    
    const classOptions = teacher.classes ? 
        teacher.classes.map(classItem => ({ value: classItem, label: classItem })) : [];

    const handleSubjectChange = (selectedOption: SingleValue<{ value: string; label: string }>) => {
        setSelectedSubject(selectedOption);
    };

    const handleClassChange = (selectedOption: SingleValue<{ value: string; label: string }>) => {
        setSelectedClass(selectedOption);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedSubject || !selectedClass || !acceptedTerms) {
            toast.error('Please fill all fields and accept the terms.');
            return;
        }
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            await axios.post(`${apiUrl}/hire`, {
                teacherId: teacher._id,
                teacherName: teacher.name,
                subject: selectedSubject.value,
                class: selectedClass.value,
            });
            toast.success('Your request has been sent successfully!');
            onClose();
        } catch (error) {
            console.error('Error sending hire request:', error);
            toast.error('Failed to send request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            onClose();
        }
    };

    useEffect(() => {
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        } else {
            window.removeEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-2/4 shadow-lg">
                <ToastContainer />
                <h2 className="text-2xl font-bold mb-4">Hire {teacher.name}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Select 
                        options={subjectOptions} 
                        onChange={handleSubjectChange} 
                        placeholder="Select Subject" 
                        className="w-full" 
                        isClearable 
                    />
                    <Select 
                        options={classOptions} 
                        onChange={handleClassChange} 
                        placeholder="Select Class" 
                        className="w-full" 
                        isClearable 
                    />
                    <div className="flex items-center">
                        <input 
                            type="checkbox" 
                            id="terms" 
                            checked={acceptedTerms} 
                            onChange={() => setAcceptedTerms(!acceptedTerms)} 
                            className="mr-2"
                        />
                        <label htmlFor="terms" className="text-sm">
                            I agree to the Terms of Service
                        </label>
                    </div>
                    <div className="flex justify-between mt-4 space-x-3">
                        <button type="submit" className={`bg-blue-600 w-1/4 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={loading}>
                            {loading ? 'Sending...' : 'Send Request'}
                        </button>
                        <button type="button" onClick={onOpenChat} className="w-2/4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200">Chat with {teacher.name} before continuing</button>
                        <button type="button" onClick={onClose} className="w-1/4 bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-200">Cancel</button>
                    </div>
                </form>
                <div className="mt-4 text-sm text-gray-600">
                    <h4 className="font-semibold">Terms of Service:</h4>
                    <p>When you hire through our platform, we take responsibility for the service provided. If you choose to engage outside the platform, we will not be liable for any disputes. Please utilize our messaging service to communicate with the teacher, so we can assist in resolving any potential disputes later.</p>
                </div>
            </div>
        </div>
    );
};

export default HireFormModal;
