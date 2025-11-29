export function isAuthenticated() {
    const token = localStorage.getItem('token');

    if (token) {
        // Decode the JWT token to check if it's expired
        const decodedToken = decodeJwtToken(token);
        
        // Check if the token is expired
        const isTokenExpired = decodedToken.exp < Date.now() / 1000;

        return !isTokenExpired; // Return true if token is not expired
    }

    return false; // Return false if token does not exist
}

function decodeJwtToken(token) {
    try {
        return JSON.parse(atob(token.split('.')[1])); // Decode the payload of the JWT token
    } catch (error) {
        return {};
    }
}