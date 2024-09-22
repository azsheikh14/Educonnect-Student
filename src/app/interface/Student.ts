export default interface Student {
    _id: any;
    name: string;
    email: string;
    password: string;
    selectedCourses: string[];
    bio?: string;
    profilePic?: string;
    enrollmentNumber: string;
    assignments: string[];
    classesAttended: number;
    upcomingClasses: number;
    completedTasks: number;
    pendingTasks: number;
}