import { jwtDecode } from 'jwt-decode';

export const getDecodedToken = async () => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    console.warn('No authentication token found');
    return null;
  }

  try {
    const decoded = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error.message);
    localStorage.removeItem('authToken'); // Clear invalid token
    return null;
  }
};

// Optional: Add token validation helper
export const isTokenValid = async () => {
  const decoded = await getDecodedToken();
  if (!decoded) return false;
  
  const currentTime = Date.now() / 1000;
  return decoded.exp > currentTime;
};

// Optional: Add token refresh helper
export const refreshTokenIfNeeded = async () => {
  const decoded = await getDecodedToken();
  if (!decoded) return false;
  
  const timeUntilExpiry = decoded.exp - (Date.now() / 1000);
  // Refresh if less than 5 minutes until expiry
  if (timeUntilExpiry < 300) {
    // Implement your token refresh logic here
    return true;
  }
  return false;
};