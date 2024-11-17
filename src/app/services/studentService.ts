import axios from 'axios';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const getAssignedWork = async (id: string) => {
    try {
        const response = await axios.post(`${apiUrl}/student/getAssignedWork`, {
            id
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching student data:', error);
    }
};