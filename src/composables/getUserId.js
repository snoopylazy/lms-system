import { useBranchStore } from '@/store/branch';
import { decodeJwt } from '@/composables/decodeJWT';

/**
 * Get userId from store, localStorage, or JWT token
 * This ensures consistent userId retrieval across the application
 * @returns {Promise<string|null>} userId or null if not found
 */
export const getUserId = async () => {
    const branchStore = useBranchStore();
    
    // First, try to get from store
    let userId = branchStore.userId;
    
    if (!userId) {
        // Try to get from localStorage
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            userId = storedUserId;
            branchStore.userId = storedUserId; // Update store
        } else {
            // Try to decode from token
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decodedToken = await decodeJwt(token);
                    if (decodedToken && decodedToken.userId) {
                        userId = decodedToken.userId;
                        branchStore.userId = decodedToken.userId; // Update store
                        localStorage.setItem('userId', decodedToken.userId); // Store in localStorage
                    }
                } catch (error) {
                    console.error('Error decoding token:', error);
                }
            }
        }
    }
    
    return userId;
};

/**
 * Get userId and validate that it exists
 * Throws an error if userId cannot be found
 * @param {boolean} showAlert - Whether to show an alert to the user (default: false)
 * @returns {Promise<string>} userId
 * @throws {Error} If userId is not found
 */
export const getValidUserId = async (showAlert = false) => {
    const userId = await getUserId();
    
    if (!userId) {
        const errorMessage = 'User ID not found. Please login again.';
        console.error(errorMessage);
        
        if (showAlert) {
            alert(errorMessage);
        }
        
        throw new Error(errorMessage);
    }
    
    return userId;
};

