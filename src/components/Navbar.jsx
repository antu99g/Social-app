import { Link } from "react-router-dom";
import styles from "../styles/navbar.module.css";
import { useAuth } from "../hooks";
import { prefix } from "../api";
import { FiLogOut } from "react-icons/fi";

export default function Navbar() {
  const auth = useAuth(); // details of logged user (from context api)

  return (
    <nav className={styles.nav}>
      <h1 className={styles.logo}>Social</h1>

      {auth.user ? (
        <>
          <Link to={`/profile/${auth.user.userid}`} className="hover">
            <img src={`${prefix}/${auth.user.avatar}`} alt="avatar" />
            {auth.user.username}
          </Link>

          <span
            onClick={() => {
              auth.logout();
            }}
            className="hover"
          >
            <FiLogOut />
            Log Out
          </span>
        </>
      ) : (
        <>
          <Link to="/login" className="hover">
            Login
          </Link>
          <Link
            to="/signup"
            className="hover"
            style={{ margin: "0 12vw 0 5vw" }}
          >
            Sign Up
          </Link>
        </>
      )}
    </nav>
  );
}
