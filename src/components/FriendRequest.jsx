import { useState } from "react";
import { prefix } from "../api";
import styles from "../styles/friendship.module.css";

function FriendRequest({ requests, handleAddFriend, handleRemoveFriendReq }) {
   const [reqResponse, setReqResponse] = useState('pending'); // friendship status with logged user
   

   return (
      <ul className={styles.listContainer}>
         <h2>Requests</h2>
         {requests.map((request, index) => {
            return (
               <li key={index}>
                  <img
                     src={`${prefix}/${request.avatar}`}
                     className={styles.friendAvatar}
                     alt="avatar"
                  />

                  <span className={styles.userdetail}>
                     <div>{request.username}</div>
                     {reqResponse === "pending" ? (
                        <>
                           <span
                              onClick={() => {
                                 handleAddFriend(request.userid, request.username, request.avatar);
                                 setReqResponse('accepted'); // changing friendship status
                              }}
                              className={styles.greenBtn}
                           >
                              Confirm
                           </span>
                           <span
                              onClick={() => {
                                 handleRemoveFriendReq(request.userid);
                                 setReqResponse("rejected"); // changing friendship status
                              }}
                              className={styles.redBtn}
                           >
                              Delete
                           </span>
                        </>
                     ) : (
                        <span
                           className={
                              reqResponse === "accepted"
                                 ? styles.greenBtn
                                 : styles.redBtn
                           }
                        >
                           {reqResponse === "accepted" && "Friend added"}
                           {reqResponse === "rejected" && "Request removed"}
                        </span>
                     )}
                  </span>
               </li>
            );
         })}
      </ul>
   );
}

export default FriendRequest;