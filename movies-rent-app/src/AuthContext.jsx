import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token is already stored in localStorage when app loads
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
    }
  }, []);

  useEffect(() => {
    if (authToken) {
      const tokenPayload = JSON.parse(atob(authToken.split('.')[1]));

      // If the user is an admin, navigate to the admin dashboard
      if (tokenPayload.is_admin) 
        navigate('/admin');
      
    }
  }, [authToken, navigate]);

  const login = (token) => {
    setAuthToken(token);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setAuthToken(null);
    localStorage.removeItem("token");
    navigate("/login"); 
  };

  const isAuthenticated = () => {
    return !!authToken;
  };

  return (
    <AuthContext.Provider value={{ authToken, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
