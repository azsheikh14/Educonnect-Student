import axios from 'axios';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const getUserNotifications = async (id: string) => {
    try {
        const response = await axios.post(`${apiUrl}/notification/getUserNotifications`, {
            userId: id
        });
        console.log('response :', response);
        return response.data;
    } catch (error) {
        console.error('Error fetching student data:', error);
    }
};