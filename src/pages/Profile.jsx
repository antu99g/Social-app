import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth, useEditField } from "../hooks";
import { Link } from "react-router-dom";
import styles from "../styles/profile.module.css";
import { FriendRequest, Friend, Post, Loader } from "../components";
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

function Profile() {
  const [user, setUser] = useState(null); // owner of current profile

  const [postsList, setPostsList] = useState([]); // all posts

  const [friends, setFriends] = useState([]); // all friends

  const [friendship, setFriendship] = useState(""); // friendship status with logged user

  const [image, setImage] = useState(null); // used for changing profile image

  const [loading, setLoading] = useState(true); // if posts are loading

  const auth = useAuth(); // details of logged user (from context api)

  const userId = useParams().id; // id of current user

  const self = auth.user?.userid === userId; // if seeing own profile

  const editName = useEditField(); // custom hook for editing username

  const editBio = useEditField(); // custom hook for editing about section

  const [editProfileImg, setEditProfileImg] = useState(false); // changing profile image

  const [unfriendForm, setUnfriendForm] = useState(false); // confirmation before unfriend

  const friendStatus = {
    true: {
      label: "Friends",
      color: "dodgerblue",
    },
    false: {
      label: "Add Friend",
      color: "goldenrod",
    },
    pending: {
      label: "Cancel Request",
      color: "green",
    },
  };

  useEffect(() => {
    (async () => {
      // Fetching all users
      const detailResponse = await fetchUserDetails(userId);
      setUser(detailResponse.data);
      setFriends(detailResponse.data.friends);

      // Friendship status with logged user
      if (!self) {
        checkFriendship(detailResponse.data);
      }

      // Fetching all posts
      const postResponse = await fetchPosts(userId);
      setPostsList(postResponse.data);
      setLoading(false);
    })();
  }, [userId, friendship]);

  // Function to check friendship status with user (if not self)
  const checkFriendship = (user) => {
    if (auth.user) {
      if (!self) {
        for (let friend of user.friends) {
          if (friend.userid === auth.user.userid) {
            setFriendship("true");
            return;
          }
        }
        for (let request of user.requests) {
          if (request.userid === auth.user.userid) {
            setFriendship("pending");
            return;
          }
        }
        setFriendship("false");
      }
    }
  };

  // Function to handle click for all friendship statuses
  const handleFriendBtnClick = async () => {
    // If user is already a friend (will unfriend)
    if (friendship === "true") {
      const response = await removeFriend(userId);
      setFriendship("false");

      if (response.success) {
        toast.warn("Friend removed", { icon: false });
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
        toast.warn("Friend request removed", { icon: false });
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
    if (editBio.value === "") {
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
    if (image) {
      // if the user uploaded an image
      const formData = new FormData();
      formData.append("avatar", image);
      const response = await auth.editUserData(formData);

      setUser({ ...user, avatar: response.avatar });
    } else {
      toast.warning("Please select an image");
    }
    setEditProfileImg(false); // hiding the input to upload image
  };

  // Function for deleting a post
  const handleDeletePost = async (postid) => {
    const response = await deletePost(postid);

    // Removing deleted post from state
    const newPostList = postsList.filter((post) => post.postid !== postid);
    setPostsList(newPostList);

    if (response.success) {
      toast.warn("Post deleted successfully", { icon: false });
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

  // Function for removing a friend request
  const handleRemoveFriendReq = async (userid) => {
    const response = await removeFriendReq(userid, self);

    // Changing friendship status with user
    setFriendship("false");

    if (response.success) {
      toast.warn("Friend request removed", { icon: false });
    } else {
      toast.error("Error in removing request");
    }
  };

  return (
    <div className={styles.profilePage}>
      <Link to="/" className={styles.homeBtn}>
        <FaArrowLeft /> Home
      </Link>

      <div className={styles.profileDetail}>
        {user && (
          <>
            {editProfileImg ? (
              <>
                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                  accept="image/*"
                />
                <button onClick={handleEditProfileImg}>Upload</button>
                <FaTimes
                  onClick={() => setEditProfileImg(false)}
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
                    onClick={() => setEditProfileImg(true)}
                    className={styles.editProfileImg}
                  />
                )}
              </>
            )}

            {self ? (
              editName.showInput ? (
                <form onSubmit={handleEditName} className={styles.editNameForm}>
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
                  <FaPencilAlt onClick={() => editName.toggleInput(true)} />
                </h1>
              )
            ) : (
              <h1 className={`${styles.userName} ${styles.flexColumn}`}>
                <div>{user.username}</div>

                {auth.user && (
                  <span
                    onClick={() => {
                      setUnfriendForm((prevState) => !prevState);
                      if (friendship !== "true") {
                        handleFriendBtnClick();
                      }
                    }}
                    style={{
                      color: friendStatus[friendship].color,
                    }}
                    className={`${styles.friendStatusBtn} hover`}
                  >
                    {friendStatus[friendship].label}

                    {friendship === "true" && unfriendForm && (
                      <div className={styles.unfreindList}>
                        <div onClick={handleFriendBtnClick} className="hover">
                          Unfriend
                        </div>
                        <div
                          onClick={() => setUnfriendForm(false)}
                          className="hover"
                        >
                          Cancel
                        </div>
                      </div>
                    )}
                  </span>
                )}
              </h1>
            )}
          </>
        )}
      </div>

      <div className={styles.lowerSection}>
        <div className={styles.postContainer}>
          {loading ? (
            <Loader />
          ) : (
            postsList &&
            (postsList.length > 0 ? (
              postsList.map((post, index) => {
                return (
                  <Post
                    post={post}
                    self={self}
                    handleDeletePost={handleDeletePost}
                    key={index}
                  />
                );
              })
            ) : (
              <h2 className={styles.noPost}>No posts yet...</h2>
            ))
          )}
        </div>

        <div className={styles.rightColContainer}>
          <div className={styles.aboutSection}>
            <h2 className={styles.aboutHeader}>
              About
              {user &&
                self &&
                (editBio.showInput ? (
                  <FaTimes onClick={() => editBio.toggleInput(false)} />
                ) : (
                  <FaPencilAlt onClick={() => editBio.toggleInput(true)} />
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
                <h4 className={styles.noBio}>
                  {self ? "Describe yourself..." : "No bio available"}
                </h4>
              ))}
          </div>

          {auth.user && user && self && user.requests.length > 0 && (
            <ul className={styles.listContainer}>
              <h2>Requests</h2>
              {user.requests.map((request, index) => {
                return (
                  <FriendRequest
                    request={request}
                    handleAddFriend={handleAddFriend}
                    handleRemoveFriendReq={handleRemoveFriendReq}
                    key={index}
                  />
                );
              })}
            </ul>
          )}

          {user && friends.length < 1 ? (
            <div>
              <h2 style={{ margin: 0 }}>Friends</h2>
              <p
                className={styles.noFriend}
                style={{ color: "grey", margin: "5px 0 0" }}
              >
                {auth.user ? "Add friends..." : "No friends"}
              </p>
            </div>
          ) : (
            <ul className={styles.listContainer}>
              <h2>Friends</h2>

              {friends.map((friend, index) => {
                return <Friend friend={friend} self={self} key={index} />;
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
