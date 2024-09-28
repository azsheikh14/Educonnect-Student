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
                return "bg-green-100 text-green-800";
            case "In Progress":
                return "bg-yellow-100 text-yellow-800";
            case "Pending":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className='w-full max-w-4xl mx-auto p-4'>
            <h3 className='text-3xl font-bold text-gray-800 mb-6 text-center'>Assigned Work</h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                {assignedTasks.map((task, index) => (
                    <div key={index} className={`p-5 rounded-lg border ${getStatusBgColor(task.status)} transition-all duration-200 ease-in-out`}>
                        <h4 className='font-semibold text-xl mb-2'>{task.subject}</h4>
                        <p className='text-gray-700 mb-1'>{task.task}</p>
                        <p className='text-gray-600 mb-1'><strong>Start Date:</strong> {task.startDate}</p>
                        <p className='text-gray-600 mb-1'><strong>End Date:</strong> {task.endDate}</p>
                        <span className={`inline-flex justify-center items-center rounded-lg px-3 py-1 mt-3 font-semibold ${getStatusBgColor(task.status)}`}>
                            {task.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AssignedWork;
