import { useRef } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../hooks";
import styles from '../styles/loginSignup.module.css';


function Login () {
   const emailRef = useRef(); // collecting email from input

   const passwordRef = useRef(); // collecting password from input

   const auth = useAuth(); // data of logged user (using context api)


   // Function for logging-in
   const handleFormSubmit = async (e) => {
      e.preventDefault();
      auth.login(emailRef.current.value, passwordRef.current.value); // function present in context api
      e.target.reset();
   };


   // Navigate to homepage if user already logged-in
   if (auth.user) {
      return <Navigate to="/" />;
   }


   return (
      <div className={styles.formContainer}>
         <h1 className={styles.logo}>Social</h1>

         <h3>Log in</h3>

         <form onSubmit={handleFormSubmit}>
            <p>Email</p>
            <input
               type="email"
               ref={emailRef}
               placeholder="Your email"
               required
            />
            <p>Password</p>
            <input
               type="password"
               ref={passwordRef}
               placeholder="Password..."
               required
            />

            <button type="submit" className={styles.formBtn}>
               Log In
            </button>
         </form>

         <Link to="/signup">New user? Sign up here</Link>
      </div>
   );
}

export default Login;