let jwt_decode;

const loadJwtDecode = async () => {
  jwt_decode = (await import('jwt-decode')).default;
};

export const getDecodedToken = async () => {
  await loadJwtDecode(); // Espera a que jwt_decode esté disponible

  const token = localStorage.getItem('authToken');
  if (!token) return null;

  try {
    const decoded = jwt_decode(token);  // Ahora debería funcionar
    return decoded;
  } catch (error) {
    console.error('Error decoding token', error);
    return null;
  }
};
