import { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api";
import { allowedUsers } from "../data/allowedUsers";
import { disconnectSocket } from "../sockets/socketManager";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(
    sessionStorage.getItem("token")
  );

  const [loading, setLoading] = useState(true);

  /*
  ========================================
  LOAD SESSION
  ========================================
  */
  useEffect(() => {
    const storedUser =
      sessionStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  /*
  ========================================
  SAVE SESSION
  ========================================
  */
  const saveSession = (
    token,
    userData
  ) => {
    sessionStorage.setItem(
      "token",
      token
    );

    sessionStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    setToken(token);
    setUser(userData);
  };

  /*
  ========================================
  ALLOWED USERS
  ========================================
  */
  const getAllowedUser = (email) => {
    return allowedUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
  };

  /*
  ========================================
  REGISTER
  ========================================
  */
  const register = async (
    formData
  ) => {
    const allowedUser =
      getAllowedUser(
        formData.email
      );

    if (!allowedUser) {
      throw new Error(
        "You are not authorized to register"
      );
    }

    const response =
      await API.post(
        "/auth/register",
        formData
      );

    const { token, user } =
      response.data;

    const finalUser = {
      ...user,

      // Keep role from allowed users
      role: allowedUser.role,

      // KEEP department from backend
      department:
        user.department || null,
    };

    saveSession(
      token,
      finalUser
    );

    return {
      token,
      user: finalUser,
    };
  };

  /*
  ========================================
  LOGIN
  ========================================
  */
  const login = async (
    formData
  ) => {
    const response =
      await API.post(
        "/auth/login",
        formData
      );

    const { token, user } =
      response.data;

    const allowedUser =
      getAllowedUser(
        user.email
      );

    if (!allowedUser) {
      throw new Error(
        "You are not authorized to access this system"
      );
    }

    const finalUser = {
      ...user,

      // Keep role from whitelist
      role: allowedUser.role,

      // KEEP populated department
      department:
        user.department || null,
    };

    saveSession(
      token,
      finalUser
    );

    return {
      token,
      user: finalUser,
    };
  };

  /*
  ========================================
  LOGOUT
  ========================================
  */
  const logout = () => {
    sessionStorage.removeItem(
      "token"
    );

    sessionStorage.removeItem(
      "user"
    );

    disconnectSocket();

    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        register,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;