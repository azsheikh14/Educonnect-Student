interface Class {
    _id: string;
    isNew: boolean;
    studentProfilePic: string;
    teacherProfilePic: string;
    studentId: string;
    teacherId: string;
    teacherName: string;
    studentName: string;
    slot: {
        day: string;
        slot: string;
    };
    classDate: string | string[];
    status: string;
    type: string | null;
    subjects: string[];
    classes: string[];
    isConfirmed: boolean;
    jitsiLink: string;
    isConfirmedByStudent: boolean;
    isConfirmedByTeacher: boolean;
}

export default Class;