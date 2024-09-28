interface Class {
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
    notes: string;
    type: string;
    isConfirmed: boolean;
};

export default Class;