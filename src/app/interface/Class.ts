interface Class {
    classDate: string | number | Date;
    _id: string;
    studentId: string;
    teacherId: string;
    teacherName: string;
    slot: {
        day: string;
        slot: string;
    };
    date: Date;
    status: string;
    notes?: string;
    type?: string;
    subjects?: string[];
    classes?: string[];
    isConfirmed: boolean;
    jitsiLink: string;
    isConfirmedByStudent: boolean;
    isConfirmedByTeacher: boolean;
};

export default Class;