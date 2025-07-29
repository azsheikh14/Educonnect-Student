export default interface Student {
    _id: string;
    name: string;
    email: string;
    password: string;
    courses: string[];
    class: string;
    selectedCourses: string[];
    bio?: string;
    profilePic?: string;
    enrollmentNumber: string;
    assignments: string[];
    classesAttended: number;
    upcomingClasses: number;
    completedTasks: number;
    pendingTasks: number;
    results: [{
        subject: string,
        marks: number,
        semester: number
    }]
}