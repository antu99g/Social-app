import {Link} from 'react-router-dom';
import styles from '../styles/navbar.module.css';
import { useAuth } from '../hooks';
import { FiLogOut } from "react-icons/fi";

export default function Navbar () {
   const auth = useAuth(); // details of logged user (from context api)
   
   if(auth.user){
      return (
         <nav className={styles.nav}>
            <h1 className={styles.logo}>
               Social
            </h1>

            <Link to={`/profile/${auth.user.userid}`}>
               <img
                  src={`http://localhost:8000/${auth.user.avatar}`}
                  alt="avatar"
               />
               {auth.user.username}
            </Link>

            <span
               onClick={() => {
                  auth.logout();
               }}
               className='hover'
            >
               <FiLogOut />
               Log Out
            </span>
         </nav>
      );
   }
}