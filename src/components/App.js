import {Routes, Route, Navigate} from 'react-router-dom';
import Navbar from "./Navbar";
import {Home, Login, Signup, Profile} from '../pages';
import {useAuth} from '../hooks';
import styles from '../styles/app.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PrivateRoute = ({children}) => {
   const auth = useAuth();

   if(auth.user){
      return children;
   }

   return <Navigate to='/login' />
}

const Page404 = () => {
   return (
      <>
         <h1 style={{ textAlign: "center", marginTop: 100 }}>404</h1>
         <h1 style={{ textAlign: "center" }}>Page not found</h1>
      </>
   );
};

export default function App() {
   return (
      <div className={styles.app}>
         <Navbar />
         <ToastContainer
            autoClose={2000}
            newestOnTop={false}
            closeOnClick={true}
            theme="colored"
            pauseOnHover={false}
         />

         <Routes>
            <Route
               path="/"
               element={
                  <PrivateRoute>
                     <Home />
                  </PrivateRoute>
               }
            />

            <Route path="/login" element={<Login />} />

            <Route path="/signup" element={<Signup />} />

            <Route
               path="/profile/:id"
               element={
                  <PrivateRoute>
                     <Profile />
                  </PrivateRoute>
               }
            />

            <Route path="*" element={<Page404 />} />
         </Routes>
      </div>
   );
}