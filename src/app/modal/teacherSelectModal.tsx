import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Teacher from '@/app/interface/Teacher'

type TeacherSelectModalProps = {
    onSelect: (teacher: Teacher) => void;
    onClose: () => void;
};

const TeacherSelectModal: React.FC<TeacherSelectModalProps> = ({ onSelect, onClose }) => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const response = await axios.post(`${apiUrl}/teacher/getAllTeachers/`);
                setTeachers(response.data);
            } catch (error) {
                console.error(error)
                setError("Failed to load teachers. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchTeachers();
    }, []);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
                <h2 className="text-xl font-bold mb-4">Select a Teacher</h2>

                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : error ? (
                    <div className="text-red-500 text-center">{error}</div>
                ) : (
                    <ul className="space-y-2">
                        {teachers.map((teacher) => (
                            <li
                                key={teacher._id}
                                className="cursor-pointer hover:bg-gray-200 p-2 rounded"
                                onClick={() => onSelect(teacher)}
                            >
                                {teacher.name}
                            </li>
                        ))}
                    </ul>
                )}

                <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default TeacherSelectModal;
