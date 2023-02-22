import { useLayoutEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks";
import { createPost, fetchAllFriends, fetchAllPosts, fetchAllUsers } from "../api";
import { useHandleInput } from "../hooks";
import styles from '../styles/home.module.css';
import {Post} from '../components';
import { FaTimesCircle, FaTelegramPlane } from "react-icons/fa";
import { FiImage } from "react-icons/fi";
import {toast} from "react-toastify";

function Home () {
   const [friendsList, setFriendsList] = useState([]); // list of all friends

   const [postsList, setPostsList] = useState([]); // list of all posts

   const [usersList, setUsersList] = useState([]); // list of all users

   const [images, setImages] = useState([]); // images to add in new post (when creating)

   const [width, setWidth] = useState(); // matching width of two buttons to add post

   const widthRef = useRef(); // reference of button to addimage

   const auth = useAuth(); // data of logged user (using context api)

   const content = useHandleInput(); // text content of new post



   useLayoutEffect(() => {
      (async () => {
         // Fetching all friends (api call)
         const friendResponse = await fetchAllFriends();
         setFriendsList(friendResponse.data);

         // Fetching all posts (api call)
         const postResponse = await fetchAllPosts();
         setPostsList(postResponse.data);

         // Fetching all users (api call)
         const userResponse = await fetchAllUsers();
         setUsersList(userResponse.data);
      })();

      // Matching width of two buttons in form to add-post
      setWidth(widthRef.current.offsetWidth);
   }, []);


   // Function to add new post
   const handleSubmit = async (e) => {
      e.preventDefault();

      if (images.length > 0 || content.value !== "") {
         const formData = new FormData();
         if (images.length > 0) { // add images (in form) if uploaded by user
            for (let i of images) {
               formData.append("images", i);
            }
         }

         formData.append("content", content.value);

         const response = await createPost(formData);
         setImages([]);
         content.handleChange("");

         let newPostList = [response.data, ...postsList]; // adding new post to state
         setPostsList(newPostList);

         e.target.reset();
         if (response.success) {
            toast.success("New post added");
         } else {
            toast.error("Failed to add post");
         }
      } else {
         toast.warning("Add text or images to post");
      }
   };


   // Removing images from preview before uploading (in new-post)
   const removeImgFromPreview = (index) => {
      const newImages = images.filter(
         (image, indexOfImg) => indexOfImg !== index
      );
      setImages(newImages);
   };



   return (
      <div className={styles.homepage}>
         <ul className={styles.left}>
            <h2>Profile</h2>
            <Link
               to={`/profile/${auth.user.userid}`}
               className={styles.profileLink}
            >
               <img
                  src={`http://localhost:8000/${auth.user.avatar}`}
                  alt="avatar"
               />
               {auth.user.username}
            </Link>

            <h2 className={styles.friendsHeader}>Friends</h2>
            {friendsList && friendsList.length > 0 ? (
               friendsList.map((friend, index) => {
                  return (
                     <li className={styles.friendHome} key={index}>
                        <Link to={`/profile/${friend.userid}`}>
                           <img
                              src={`http://localhost:8000/${friend.avatar}`}
                              alt="avatar"
                           />
                           {friend.username}
                        </Link>
                     </li>
                  );
               })
            ) : (
               <p className={styles.noFriend}>Add friends...</p>
            )}
         </ul>

         <div className={styles.center}>
            <form onSubmit={handleSubmit} className={styles.newPost}>
               <input
                  type="text"
                  name="content"
                  onChange={({ target }) => content.handleChange(target.value)}
                  placeholder="What's in your mind.."
               />

               {images.length > 0 && (
                  <div className={styles.previewImgContainer}>
                     {images.map((image, index) => {
                        let imageUrl = URL.createObjectURL(image);
                        return (
                           <div className={styles.previewImg} key={index}>
                              <img src={imageUrl} alt="avatar" />
                              <FaTimesCircle
                                 onClick={() => removeImgFromPreview(index)}
                              />
                           </div>
                        );
                     })}
                  </div>
               )}

               <div className={styles.newPostBtns}>
                  <label ref={widthRef}>
                     <FiImage />
                     Add images
                     <input
                        multiple
                        type="file"
                        onChange={({ target }) =>
                           setImages([...images, ...target.files])
                        }
                        accept="image/*"
                     />
                  </label>

                  <button type="submit" style={{ width: width }}>
                     <FaTelegramPlane />
                     Post
                  </button>
               </div>
            </form>

            {postsList.map((post, index) => {
               return <Post post={post} key={index} />;
            })}
         </div>

         <ul className={styles.right}>
            <h2>All Users</h2>
            {usersList.map((user, index) => {
               return (
                  <li className={styles.userHome} key={index}>
                     <Link to={`/profile/${user.userid}`}>
                        <img
                           src={`http://localhost:8000/${user.avatar}`}
                           alt="avatar"
                        />
                        {user.username}
                     </Link>
                  </li>
               );
            })}
         </ul>
      </div>
   );
}

export default Home;