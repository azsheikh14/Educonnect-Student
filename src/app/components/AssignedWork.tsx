import React from 'react';

const AssignedWork = () => {
    const assignedTasks = [
        {
            subject: "Mathematics",
            task: "Complete Chapter 5 Exercises",
            startDate: "2024-09-20",
            endDate: "2024-09-25",
            status: "In Progress"
        },
        {
            subject: "Science",
            task: "Submit Lab Report",
            startDate: "2024-09-22",
            endDate: "2024-09-29",
            status: "Pending"
        },
        {
            subject: "History",
            task: "Read Chapter 4",
            startDate: "2024-09-18",
            endDate: "2024-09-21",
            status: "Completed"
        },
        {
            subject: "Geography",
            task: "Prepare for the upcoming exam",
            startDate: "2024-09-25",
            endDate: "2024-10-01",
            status: "Pending"
        },
    ];

    const getStatusBgColor = (status: string) => {
        switch (status) {
            case "Completed":
                return "bg-green-300";
            case "In Progress":
                return "bg-yellow-300";
            case "Pending":
                return "bg-red-300";
            default:
                return "bg-gray-100";
        }
    };

    return (
        <div className='w-full p-4 rounded-lg'>
            <h3 className='text-2xl font-bold text-gray-800 mb-4 text-center'>Assigned Work</h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {assignedTasks.map((task, index) => (
                    <div key={index} className={`p-4 rounded-lg shadow-md ${getStatusBgColor(task.status)}`}>
                        <h4 className='font-semibold text-lg'>{task.subject}</h4>
                        <p className='text-gray-700'>{task.task}</p>
                        <p className='text-gray-600'>Start Date: {task.startDate}</p>
                        <p className='text-gray-600'>End Date: {task.endDate}</p>
                        <span className={`inline-flex justify-center items-center rounded-lg ${getStatusBgColor(task.status)} text-white px-2 py-1 mt-2`}>
                            {task.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AssignedWork;
