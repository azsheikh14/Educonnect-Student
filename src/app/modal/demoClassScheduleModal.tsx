import React, { useState } from 'react';
import Select, { MultiValue } from 'react-select';
import Teacher from '../interface/Teacher';

interface DemoClassScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    teacher: Teacher | null;
    onConfirm: (selectedOptions: { subjects: MultiValue<{ value: string; label: string }>; classes: MultiValue<{ value: string; label: string }> }) => void;
}

const DemoClassScheduleModal: React.FC<DemoClassScheduleModalProps> = ({ isOpen, onClose, teacher, onConfirm }) => {
    const [selectedSubjects, setSelectedSubjects] = useState<MultiValue<{ value: string; label: string }>>([]);
    const [selectedClasses, setSelectedClasses] = useState<MultiValue<{ value: string; label: string }>>([]);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const subjectOptions = (teacher?.subjects || []).map(subject => ({ value: subject, label: subject }));
    const classOptions = (teacher?.classes || []).map(cls => ({ value: cls, label: cls }));

    const handleConfirm = () => {
        if (selectedSubjects.length === 0 || selectedClasses.length === 0) {
            setError('Subjects and Classes are required.');
            return;
        }

        setError(null);
        onConfirm({ subjects: selectedSubjects, classes: selectedClasses });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/3">
                <h2 className="text-lg font-semibold mb-4">Select Class and Subject</h2>
                <Select options={subjectOptions} isMulti placeholder="Select Subjects" onChange={setSelectedSubjects} />
                <div className='h-10 flex items-center'>
                    {error && selectedSubjects.length === 0 && (
                        <p className="text-red-600 text-sm">{error}</p>
                    )}
                </div>
                <Select options={classOptions} isMulti placeholder="Select Classes" onChange={setSelectedClasses} />
                <div className='h-10 flex items-center'>
                    {error && selectedClasses.length === 0 && (
                        <p className="text-red-600 text-sm">{error}</p>
                    )}
                </div>
                <div className="flex justify-between mt-4">
                    <button onClick={onClose} className="bg-gray-300 text-gray-800 py-2 px-4 rounded">Cancel</button>
                    <button onClick={handleConfirm} className="bg-blue-600 text-white py-2 px-4 rounded">Confirm</button>
                </div>
            </div>
        </div>
    );
};

export default DemoClassScheduleModal;
