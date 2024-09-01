import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';


export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);
          setRole(decodedToken.role);
          console.log("From useAuth:", decodedToken.role)
        } else {
          localStorage.removeItem('accessToken');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('accessToken');
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return { isAuthenticated, role };
}