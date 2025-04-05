interface DecodedToken {
    username: string;
    role: string;
    exp: number; 
  }
  
  export const decodeToken = (token: string): DecodedToken | null => {
    try {
      // JWT tokens are base64 encoded with 3 parts: header.payload.signature
      const base64Payload = token.split('.')[1];
      const payload = JSON.parse(atob(base64Payload));
      return payload;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };
  
  export const isTokenExpired = (token: string): boolean => {
    const decoded = decodeToken(token);
    if (!decoded) return true;
    
    return decoded.exp * 1000 < Date.now();
  };
  
  export const getUserFromToken = (token: string | null): { username: string; role: string } | null => {
    if (!token) return null;
    
    const decoded = decodeToken(token);
    if (!decoded || isTokenExpired(token)) return null;
    
    return {
      username: decoded.username,
      role: decoded.role
    };
  };
  