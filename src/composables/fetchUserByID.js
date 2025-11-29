
import apiURL from '@/services/apiURL';
import { getUserId } from '@/composables/getUserId';
import axios from 'axios';




export async function fetchUserById() {
    try {
        // Get userId with fallback logic
        const userId = await getUserId();
        
        if (!userId) {
            console.warn('No userId found');
            return null;
        }
        
        const params = {
            dynamicConditions: JSON.stringify([
                {
                    field: '_id',
                    operator: "==",
                    value: userId,
                },
            ])
        };
        const response = await axios.get(`${apiURL}/lms/api/getAllDocs/User`, { params });
        return response.data.data[0] || null;
    } catch (err) {
        console.log("failed to fetch data", err)
    }
}



