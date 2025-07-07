import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  // ✅ Set credentials once
  axios.defaults.withCredentials = true;

  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`);
      if (data.success) {
        setUserData(data.userData);
      } else {
        setUserData(null);
        toast.error(data.message || "Failed to fetch user data");
      }
    } catch (error) {
      setUserData(null);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`);
      if (data.success) {
        setIsLoggedIn(true);
        await getUserData(); // ⬅️ Must wait for userData
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    } catch (error) {
      setIsLoggedIn(false);
      setUserData(null);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
