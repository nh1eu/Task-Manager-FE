import React,{ useState, useEffect, createContext } from "react";
import axiosInstance from '../utils/axiosInstance.js';
import { API_PATHS } from "../utils/apiPaths.js";

export const UserContext = createContext();

const UserProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true) //New state to track loading

    useEffect(() => {
        if(user) return;

        const accessToken = localStorage.getItem("token");
        if(!accessToken) {
            setLoading(false);
            return;
        }

        const fecthUser = async () => {
            try {
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
                setUser(response.data);
            } catch (error) {
                console.error("User not authenticated", error);
                clearUser();
            } finally {
                setLoading(false);
            }
        };

        fecthUser();
    }, []);

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem("token", userData.token); //Save token
        setLoading(false);
    };

    const clearUser = () => {
        setUser(null);
        localStorage.removeItem("token");
    };

    return (
        <UserContext.Provider value={{user, loading, updateUser, clearUser}}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider