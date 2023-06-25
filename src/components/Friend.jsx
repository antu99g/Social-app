import { useState } from "react";
import { removeFriend, prefix } from "../api";
import styles from "../styles/friendship.module.css";

function Friend({ friend, self }) {
  const [isFriend, setIsFriend] = useState(true); // friendship status with logged user

  const [formView, setFormView] = useState(false); // showing and hiding unfriend form

  // Function for removing friend
  const handleUnfriendClick = async (id) => {
    await removeFriend(id);
    setIsFriend(false); // changing friendship status
  };

  return (
    <li className={`${!self && styles.flexCenter} ${styles.request}`}>
      <img
        src={`${prefix}/${friend.avatar}`}
        className={styles.friendAvatar}
        alt="avatar"
      />
      <span className={styles.userdetail}>
        <div>{friend.username}</div>
        {self && (
          <span
            onClick={() => setFormView((value) => !value)}
            className={formView ? styles.darkBg : ""}
          >
            {isFriend ? "Unfriend" : "Removed from friends"}

            {formView && (
              <div className={styles.unfreindList}>
                <div onClick={() => handleUnfriendClick(friend.userid)}>
                  Unfriend
                </div>
                <div onClick={() => setFormView(false)}>Cancel</div>
              </div>
            )}
          </span>
        )}
      </span>
    </li>
  );
}

export default Friend;
