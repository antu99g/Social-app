import { useState, useLayoutEffect } from 'react';
import { useParams } from "react-router-dom";
import { useAuth, useEditField, useToggleView } from "../hooks";
import { Link } from 'react-router-dom';
import styles from '../styles/profile.module.css';
import { FriendRequest, Friend, Post } from "../components";
import {
   fetchPosts,
   sendFriendReq,
   removeFriendReq,
   fetchUserDetails,
   removeFriend,
   updateUserData,
   deletePost,
   addFriend,
   prefix,
} from "../api";
import { FaArrowLeft, FaPencilAlt, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";


function Profile () {
   const [user, setUser] = useState(null); // user, whose profile is being seen

   const [postsList, setPostsList] = useState([]); // all posts

   const [friends, setFriends] = useState([]); // all friends

   const [self, setSelf] = useState(false); // if seeing own profile or not

   const [friendship, setFriendship] = useState(''); // friendship status with logged user

   const [image, setImage] = useState(null); // used for changing profile image

   const auth = useAuth(); // details of logged user (from context api)

   const userId = useParams().id; // id of current user

   const editName = useEditField(); // custom hook for editing username

   const editBio = useEditField(); // custom hook for editing about section

   const editProfileImg = useToggleView(); // custom hook for changing profile image

   const unfriendForm = useToggleView(); // custom hook for confirmation before unfriend


   useLayoutEffect(() => {
      // Checking if own profile or not
      if (auth.user.userid === userId) {
         setSelf(true);
      }

      (async () => {
         // Fetching all users
         const detailResponse = await fetchUserDetails(userId);
         setUser(detailResponse.data);
         setFriends(detailResponse.data.friends);

         // Setting friendship status (when seeing others profile)
         if (!self) {
            checkFriendship(detailResponse.data);
         }
         
         // Fetching all posts
         const postResponse = await fetchPosts(userId);
         setPostsList(postResponse.data);
      })();
   }, []);


   // Function to check friendship status with user (if not self)
   const checkFriendship = (user) => {
      for(let friend of user.friends){
         if(friend.userid === auth.user.userid){
            setFriendship('true');
            return;
         }
      }
      for (let request of user.requests) {
         if(request.userid === auth.user.userid){
            setFriendship("pending");
            return;
         }
      }
      setFriendship("false");
   };
      
   
   // Function to handle click for all friendship statuses
   const handleFriendBtnClick = async () => {
      // If user is already a friend (will unfriend)
      if (friendship === "true") {
         const response = await removeFriend(userId);
         setFriendship("false");

         if (response.success) {
            toast.warn("Friend removed", {icon: false});
         } else {
            toast.error("Error in removing friend");
         }
      }
      // If user is not a friend (will send friend request)
      else if (friendship === "false") {
         const response = await sendFriendReq(userId);
         setFriendship("pending");

         if (response.success) {
            toast.success("Friend request sent");
         } else {
            toast.error("Error in sending friend request");
         }
      }
      // If user already sent a friend request (will cancel friend request)
      else if (friendship === "pending") {
         const response = await removeFriendReq(userId, self);
         setFriendship("false");

         if (response.success) {
            toast.warn("Friend request removed", {icon: false});
         } else {
            toast.error("Error in removing friend request");
         }
      }
   };


   // Function for editing name of user
   const handleEditName = async (e) => {
      e.preventDefault();
      editName.toggleInput();
      if (editName.value === "") {
         toast.warning("Add text to edit username");
      } else {
         const response = await auth.editUserData({ username: editName.value });
         setUser({ ...user, username: response.username });
      }
   };
   
   
   // Function for editing about section
   const handleEditBio = async (e) => {
      e.preventDefault();
      editBio.toggleInput();
      if(editBio.value===''){
         toast.warning("Add text to edit bio");
      } else {
         const response = await updateUserData({ description: editBio.value });
         setUser({ ...user, description: response.data.description });
         if (response.success) {
            toast.success("Bio edited successfully");
         } else {
            toast.error("Error in editing bio");
         }
      }
   };


   // Function for editing profile image
   const handleEditProfileImg = async () => {
      if(image){ // if the user uploaded an image
         const formData = new FormData();
         formData.append("avatar", image);
         const response = await auth.editUserData(formData); 

         setUser({ ...user, avatar: response.avatar });
         editProfileImg.toggleView(false); // hiding the input to upload image         
      } else {
         editProfileImg.toggleView(false);
         toast.warning("Please select an image");
      }
   };

   
   // Function for deleting a post
   const handleDeletePost = async (postid) => {
      const response = await deletePost(postid);

      // Removing deleted post from state
      // const newPostList = postsList.filter((post) => post.postid !== postid);
      // setPostsList(newPostList);

      if (response.success) {
         toast.warn("Post deleted successfully", {icon: false});
      } else {
         toast.error("Error in deleting post");
      }
   };


   // Function for adding a friend (from friend request)
   const handleAddFriend = async (userid, username, avatar) => {
      const response = await addFriend(userid);

      // Changing friendship status with user
      setFriendship("true");

      // Add new friend in state
      const newFreinds = [...friends, { userid, username, avatar }];        
      setFriends(newFreinds);

      if (response.success) {
         toast.success("Friend added successfully");
      } else {
         toast.error("Error in adding friend");
      }
   };


   // Function for removing a friend (from friend request)
   const handleRemoveFriendReq = async (userid) => {
      const response = await removeFriendReq(userid, self);
      
      // Changing friendship status with user
      setFriendship('false');
      
      if (response.success) {
         toast.warn("Friend request removed", {icon: false});
      } else {
         toast.error("Error in removing request");
      }
   };



   return (
      <div className={styles.profilePage}>
         <Link to="/" className={styles.homeBtn}>
            <FaArrowLeft /> Home
         </Link>

         {user && (
            <div className={styles.profileDetail}>
               {editProfileImg.view ? (
                  <>
                     <input
                        type="file"
                        onChange={(e) => setImage(e.target.files[0])}
                        accept="image/*"
                     />
                     <button onClick={handleEditProfileImg}>Upload</button>
                     <FaTimes
                        onClick={() => editProfileImg.toggleView(false)}
                        className={styles.cancelEditProfileImg}
                     />
                  </>
               ) : (
                  <>
                     <img
                        src={`${prefix}/${user.avatar}`}
                        alt="avatar"
                        className={styles.profileImg}
                     />
                     {self && (
                        <FaPencilAlt
                           onClick={() => editProfileImg.toggleView(true)}
                           className={styles.editProfileImg}
                        />
                     )}
                  </>
               )}

               {self ? (
                  editName.showInput ? (
                     <form
                        onSubmit={handleEditName}
                        className={styles.editNameForm}
                     >
                        <input
                           type="text"
                           onChange={({ target }) =>
                              editName.handleChange(target.value)
                           }
                           defaultValue={user.username}
                        />
                        <button type="submit">Edit</button>
                        <FaTimes onClick={() => editName.toggleInput(false)} />
                     </form>
                  ) : (
                     <h1 className={styles.userName}>
                        {user.username}
                        <FaPencilAlt
                           onClick={() => editName.toggleInput(true)}
                        />
                     </h1>
                  )
               ) : (
                  <h1 className={`${styles.userName} ${styles.flexColumn}`}>
                     <div>{user.username}</div>
                     <span
                        onClick={() => {
                           unfriendForm.toggleView();
                           if (friendship !== "true") {
                              handleFriendBtnClick();
                           }
                        }}
                        className={`
                           ${styles.friendStatusBtn}
                           ${
                              friendship === "true" &&
                              unfriendForm.view &&
                              styles.darkBg
                           }
                           ${friendship === "true" && styles.friendBtnBlue} 
                           ${friendship === "false" && styles.friendBtnGold} 
                           ${friendship === "pending" && styles.friendBtnGreen}
                        `}
                     >
                        {friendship === "true" && "Friends"}
                        {friendship === "false" && "Add Friend"}
                        {friendship === "pending" && "Cancel Request"}

                        {friendship === "true" && unfriendForm.view && (
                           <div className={styles.unfreindList}>
                              <div onClick={handleFriendBtnClick}>Unfriend</div>
                              <div
                                 onClick={() => unfriendForm.toggleView(false)}
                              >
                                 Cancel
                              </div>
                           </div>
                        )}
                     </span>
                  </h1>
               )}
            </div>
         )}

         <div className={styles.lowerSection}>
            <div className={styles.postContainer}>
               {postsList &&
                  postsList.map((post, index) => {
                     return (
                        <Post
                           post={post}
                           self={self}
                           handleDeletePost={handleDeletePost}
                           key={index}
                        />
                     );
                  })}
            </div>

            <div className={styles.rightColContainer}>
               <div className={styles.aboutSection}>
                  <h2 className={styles.aboutHeader}>
                     About
                     {user &&
                        self &&
                        (editBio.showInput ? (
                           <FaTimes
                              onClick={() => editBio.toggleInput(false)}
                           />
                        ) : (
                           <FaPencilAlt
                              onClick={() => editBio.toggleInput(true)}
                           />
                        ))}
                  </h2>

                  {user &&
                     (editBio.showInput ? (
                        <form onSubmit={handleEditBio}>
                           <input
                              type="textarea"
                              onChange={({ target }) =>
                                 editBio.handleChange(target.value)
                              }
                              defaultValue={user.description}
                           />
                           <button type="submit">Edit</button>
                        </form>
                     ) : user.description.length > 0 ? (
                        <p className={styles.description}>{user.description}</p>
                     ) : (
                        <h4 className={styles.noBio}>Describe yourself...</h4>
                     ))}
               </div>

               {user && self && user.requests.length > 0 &&(
                  <FriendRequest
                     requests={user.requests}
                     handleAddFriend={handleAddFriend}
                     handleRemoveFriendReq={handleRemoveFriendReq}
                  />
               )}

               {user &&
                  (friends.length > 0 ? (
                     <Friend friends={friends} self={self} />
                  ) : (
                     <h2 className={styles.noFriend}>
                        Friends
                        <p className={styles.colorGrey}>Add friends...</p>
                     </h2>
                  ))}
            </div>
         </div>
      </div>
   );
}

export default Profile;