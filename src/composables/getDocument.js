import apiURL from "@/services/apiURL";
import axios from "axios";

export const fetchAllDoc = async (collectionName, condition = {}) => {
    try {
      const params = {};
  
      if (condition.limit) {
        params.limit = condition.limit;
      }
  
      if (condition.populate) {
        // make sure populate is always an array
        const populateArray = Array.isArray(condition.populate)
          ? condition.populate
          : [condition.populate];
        params.populate = JSON.stringify(populateArray);
      }
  
      if (condition.sortOrder) {
        params.sortOrder = condition.sortOrder;
      }
  
      if (condition.searchFields) {
        // support array or string
        params.searchFields = Array.isArray(condition.searchFields)
          ? condition.searchFields.join(",")
          : condition.searchFields;
      }
  
      if (condition.searchTerm) {
        params.searchTerm = condition.searchTerm;
      }
  
      if (condition.dynamicConditions) {
        params.dynamicConditions = JSON.stringify(condition.dynamicConditions);
      }
  
      const response = await axios.get(
        `${apiURL}/lms/api/getAllDocs/${collectionName}`,
        { params }
      );
  
      return response.data.data;
    } catch (err) {
      console.log("failed to fetch data", err);
    }
  };
  
