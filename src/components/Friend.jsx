import { useState } from "react";
import { removeFriend } from "../api";
import styles from '../styles/friendship.module.css';
import { useToggleView } from "../hooks";

function Friend({ friends, self }) {
   const [isFriend, setIsFriend] = useState(true); // friendship status with logged user

   const unfriendForm = useToggleView(); // cofirmation before unfriend
   
   // Function for removing friend
   const handleUnfriendClick = async (id) => {
      await removeFriend(id);
      setIsFriend(false); // changing friendship status
   };

   return (
      <ul className={styles.listContainer}>
         <h2>Friends</h2>
         {friends.map((friend, index) => {
            return (
               <li className={`${!self && styles.alignCenter}`} key={index}>
                  <img
                     src={`http://localhost:8000/${friend.avatar}`}
                     className={styles.friendAvatar}
                     alt="avatar"
                  />
                  <span className={styles.userdetail}>
                     <div>{friend.username}</div>
                     {self && (
                        <span
                           onClick={() => unfriendForm.toggleView()}
                           className={unfriendForm.view ? styles.darkBg : ""}
                        >
                           {isFriend ? "Unfriend" : "Removed from friends"}

                           {unfriendForm.view && (
                              <div className={styles.unfreindList}>
                                 <div
                                    onClick={() =>
                                       handleUnfriendClick(friend.userid)
                                    }
                                 >
                                    Unfriend
                                 </div>
                                 <div
                                    onClick={() =>
                                       unfriendForm.toggleView(false)
                                    }
                                 >
                                    Cancel
                                 </div>
                              </div>
                           )}
                        </span>
                     )}
                  </span>
               </li>
            );
         })}
      </ul>
   );
}

export default Friend;