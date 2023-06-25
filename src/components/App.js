import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import { Home, Login, Signup, Profile } from "../pages";
import { useLocation } from "react-router-dom";
import "../styles/app.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// const PrivateRoute = ({ children }) => {
//   const auth = useAuth();

//   if (auth.user) {
//     return children;
//   }

//   return <Navigate to="/login" />;
// };

const Page404 = () => {
  return (
    <>
      <h1 style={{ textAlign: "center", marginTop: "25vh" }}>404</h1>
      <h1 style={{ textAlign: "center" }}>Page not found</h1>
    </>
  );
};

export default function App() {
  const location = useLocation();

  return (
    <div className="app">
      {location.pathname !== "login" && location.pathname !== "signup" && (
        <Navbar />
      )}

      <ToastContainer
        autoClose={2000}
        newestOnTop={false}
        closeOnClick={true}
        theme="colored"
        pauseOnHover={false}
        pauseOnFocusLoss={false}
      />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/profile/:id" element={<Profile />} />

        <Route path="*" element={<Page404 />} />
      </Routes>
    </div>
  );
}
