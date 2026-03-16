import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Decode the JWT payload to get user info (id, username)
  const user = token ? JSON.parse(atob(token.split(".")[1])) : null;

  function login(newToken) {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — lets any component call useAuth() instead of useContext(AuthContext)
export function useAuth() {
  return useContext(AuthContext);
}
