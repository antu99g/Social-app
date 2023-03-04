import { createContext, useState, useEffect } from "react";
import { login as loginReq, updateUserData, updateUserImage } from "../api";
import { toast } from "react-toastify";

const initialState = {
   user: null,
   login: () => {},
   logout: () => {}
};

export const AuthContext = createContext(initialState);

export const AuthProvider = ({ children }) => {
   const [user, setUser] = useState(null);

   // Fetching data of logged user (from localstorage)
   useEffect(() => {
      let currentUser = localStorage.getItem('USER_DATA');
      currentUser = JSON.parse(currentUser) || null;
      setUser(currentUser);
   }, []);
   

   // Function for logging-in
   const login = async (email, password) => {
      let res = await loginReq(email, password);
      if(res.success){
         let token = res.token ? String(res.token) : null;

         localStorage.setItem(
            'TOKEN_KEY',
            token
         );
         localStorage.setItem("USER_DATA", JSON.stringify(res.user));
         setUser(res.user);
         toast.success("Logged in successfully!");
      } else {
         toast.error('Error in username/password');
      }
   };


   // Function for log-out
   const logout = () => {
      localStorage.removeItem('TOKEN_KEY');
      localStorage.removeItem('USER_DATA');
      setUser(null);
      toast('Logged out!')
   };


   // Function for editing username and avatar of logged user (globally)
   const editUserData = async (data) => {
      let newUserData = {};
      if(data.username){
         const res = await updateUserData(data);
         if (res.success) {
            newUserData = {...user, username: res.data.username};
            toast.success("Username edited");
         } else {
            toast.error("Error in editing username");
         }
      }
      else if (data) {
         const res = await updateUserImage(data);
         if (res.success) {
            newUserData = {...user, avatar: res.data.avatar};
            toast.success("Profile image edited");
         } else {
            toast.error("Error in editing profile image");
         }
      }
      localStorage.setItem("USER_DATA", JSON.stringify(newUserData));
      setUser(newUserData);
      return newUserData;
   };
   

   const utils = { user, login, logout, editUserData };

   return (
      <AuthContext.Provider value={utils}>
         {children}
      </AuthContext.Provider>
   );
}