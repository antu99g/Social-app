import { Link, Navigate } from "react-router-dom";
import { useHandleInput, useAuth } from "../hooks";
import styles from '../styles/loginSignup.module.css';


function Login () {
   const email = useHandleInput(); // collecting email from input

   const password = useHandleInput(); // collecting password from input

   const auth = useAuth(); // data of logged user (using context api)


   // Function for logging-in
   const handleFormSubmit = async (e) => {
      e.preventDefault();
      auth.login(email.value, password.value); // function present in context api
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
               onChange={({ target }) => email.handleChange(target.value)}
               placeholder="Your email"
               required
            />
            <p>Password</p>
            <input
               type="password"
               onChange={({ target }) => password.handleChange(target.value)}
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