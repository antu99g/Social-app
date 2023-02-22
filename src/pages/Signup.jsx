import styles from '../styles/loginSignup.module.css';
import { Link, Navigate, useNavigate } from "react-router-dom";
import {signup} from '../api';
import { useHandleInput, useAuth } from '../hooks';
import { toast } from "react-toastify";


function Signup () {
   const email = useHandleInput(); // collecting email from input

   const username = useHandleInput(); // collecting username from input

   const password = useHandleInput(); // collecting password from input

   const cPassword = useHandleInput(); // collecting confirm-password from input

   const auth = useAuth(); // data of logged user (using context api)

   const navigate = useNavigate();


   // Function for sign-up a new user
   const handleFormSubmit = async (e) => {
      e.preventDefault();
      if (cPassword.value !== password.value) { // if password doesn't match with confirm-password
         e.target.reset();
         toast.error("Error in username/password");
         return;
      } else {
         await signup(email.value, username.value, password.value);
         toast.success('New user created!');
         navigate("/login");
      }
   };


   // Navigate to homepage if user already logged-in
   if (auth.user) {
      toast.info("Logged in already");
      return <Navigate to="/" />;
   }



   return (
      <div className={styles.formContainer}>
         <h1 className={styles.logo}>Social</h1>

         <h3>Sign Up</h3>

         <form onSubmit={handleFormSubmit}>
            <p>Email</p>
            <input
               type="email"
               placeholder="Your email"
               onChange={({ target }) => {email.handleChange(target.value)}}
               required
            />
            <p>Username</p>
            <input
               type="text"
               placeholder="Your name"
               onChange={({ target }) => {username.handleChange(target.value)}}
               required
            />
            <p>Password</p>
            <input
               type="password"
               placeholder="Password..."
               onChange={({ target }) => {password.handleChange(target.value)}}
               required
            />
            <p>Confirm Password</p>
            <input
               type="password"
               name="confirmpassword"
               placeholder="Confirm..."
               onChange={({ target }) => {cPassword.handleChange(target.value)}}
               required
            />

            <button type="submit" className={styles.formBtn}>
               Sign Up
            </button>
         </form>

         <Link to="/login">Already have an account? Log in</Link>
      </div>
   );
}

export default Signup;