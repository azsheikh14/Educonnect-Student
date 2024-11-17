import axios from 'axios';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
import Task from '@/app/interfaces/Task'

export const getTeacherById = async (id: string) => {
    try {
        const response = await axios.post(`${apiUrl}/student/getTeacher/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching student data:', error);
    }
};

export const getTeachersBySearch = async (searchTerm: string, studentId: string) => {
    try {
        const response = await axios.post(`${apiUrl}/student/getTeachersBySearch?search=${searchTerm}`, {
            studentId
        });
        return response;
    } catch (error) {
        console.error('Error fetching student data:', error);
    }
}

export const getTeachersByPagination = async (page: number, search: string) => {
    try {
        const response = await axios.post(`${apiUrl}/student/getTeachersByPagination`, { page, search });
        return response.data;
    } catch (error) {
        console.error('Error fetching student data:', error);
    }
}

export const getStudentsForTeacher = async (studentIds: string[]) => {
    try {
        const response = await axios.post(`${apiUrl}/student/getStudentsForTeacher`, { studentIds });
        return response.data;
    } catch (error) {
        console.error('Error fetching student data:', error);
    }
}

export const getAssociatedStudents = async (studentIds: string[]) => {
    try {
        const response = await axios.post(`${apiUrl}/student/getStudentsForTeacher`, { studentIds });
        return response.data;
    } catch (error) {
        console.error('Error fetching student data:', error);
    }
}

export const assignTaskToStudent = async (task: Task) => {
    try {
        const response = await axios.post(`${apiUrl}/student/assignTaskToStudent`, task);
        return response.data;
    } catch (error) {
        console.error('Error fetching student data:', error);
    }
}