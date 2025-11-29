// timestampController.js
import axios from 'axios';
import apiURL from './apiURL';




export const fetchTimestamp = async () => {
    const response = await axios.get(`${apiURL}/lms/api/timeStamp`);
    return response.data.timestamp;
}
