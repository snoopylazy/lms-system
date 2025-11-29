import apiURL from "@/services/apiURL";
import axios from "axios";


const useDocument = (collectionName) => {

    const add = async (formDoc) => {
        try {

            const response = await axios.post(`${apiURL}/lms/api/insertDoc/${collectionName}`, formDoc);
            return response
        } catch (err) {
            console.log("failed to add data", err)
        }
    }



    const remove = async (id) => {
        try {

            const response = await axios.delete(`${apiURL}/lms/api/deleteDoc/${collectionName}/${id}`);
            return response
        } catch (err) {
            console.log("failed to add data", err)
        }
    }


    const update = async (formDoc, id) => {
        try {

            const response = await axios.patch(`${apiURL}/lms/api/updateDoc/${collectionName}/${id}`, formDoc);
            return response
        } catch (err) {
            console.log("failed to add data", err)
        }
    }


    return {

        add,
        remove,
        update
    };

}


export default useDocument