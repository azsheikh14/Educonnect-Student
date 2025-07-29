import axios from 'axios';
import Class from '../interfaces/Class';

export const getStudentClasses = async (userId: string, otherId?: string) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/class/getStudentClasses/${userId}`, {
            role: 'Student',
            otherId,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching classes:', error);
        throw error;
    }
};

export const insertClasses = async (classes: Class[]) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/class/insertClasses`, { classes });
        return response.data;
    } catch (error) {
        console.error('Error inserting classes:', error);
    }
};

export const smartScheduleClasses  = async (classes: Class[]) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/class/smartScheduleClasses`, { classes });
        console.log('response.data :', response.data);
        return response.data;
    } catch (error) {
        console.error('Error inserting classes:', error);
    }
}

