import { useLayoutEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks";
import {
  createPost,
  fetchAllFriends,
  fetchAllPosts,
  fetchAllUsers,
  prefix,
} from "../api";
import styles from "../styles/home.module.css";
import { Post } from "../components";
import { FaTimesCircle, FaTelegramPlane } from "react-icons/fa";
import { FiImage } from "react-icons/fi";
import { Loader } from "../components";
import { toast } from "react-toastify";

function Home() {
  const [postsList, setPostsList] = useState([]); // list of all posts

  const [friendsList, setFriendsList] = useState([]); // list of all friends

  const [usersList, setUsersList] = useState([]); // list of all users

  const [images, setImages] = useState([]); // images to add in new post (when creating)

  const [width, setWidth] = useState(); // matching width of two buttons to add post

  const [loading, setLoading] = useState(true); // loader before all posts loaded

  const widthRef = useRef(); // reference of button to addimage

  const auth = useAuth(); // data of logged user (using context api)

  const newContent = useRef(); // text content of new post

  useLayoutEffect(() => {
    // Matching width of two buttons in form to add-post
    setWidth(widthRef.current.offsetWidth);

    // Fetching all users (api call)
    const fetchUsers = fetchAllUsers()
      .then((res) => setUsersList(res.data))
      .catch((err) => {
        console.log(err);
      });

    // Fetching all posts (api call)
    const fetchPosts = fetchAllPosts()
      .then((res) => {
        setPostsList(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });

    if (auth.user) {
      // Fetching all friends (api call)
      const fetchFriends = fetchAllFriends()
        .then((res) => setFriendsList(res.data))
        .catch((err) => {
          console.log(err);
        });

      // Sending all fetch requests together
      Promise.all([fetchFriends, fetchUsers, fetchPosts]);
    } else {
      Promise.all([fetchUsers, fetchPosts]);
    }
  }, []);

  // Function to add new post
  const handleAddNewPost = async (e) => {
    e.preventDefault();
    if (images.length > 0 || newContent.current.value !== "") {
      const postContent = newContent.current.value;
      const formData = new FormData();
      if (images.length > 0) {
        // add images (in form) if uploaded by user
        for (let i of images) {
          formData.append("images", i);
        }
      }
      formData.append("content", postContent);

      const response = await createPost(formData);
      setImages([]);

      e.target.reset();
      if (response.success) {
        toast.success("New post added");
        setPostsList((posts) => [response.data, ...posts]);
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
    <div
      className={styles.homepage}
      style={{
        justifyContent: auth.user ? "space-around" : "end",
      }}
    >
      {auth.user && (
        <ul className={styles.leftContainer}>
          <h2>Profile</h2>
          <Link
            to={`/profile/${auth.user.userid}`}
            className={styles.profileLink}
          >
            <img src={`${prefix}/${auth.user.avatar}`} alt="avatar" />
            {auth.user.username}
          </Link>

          <h2 className={styles.friendsHeader}>Friends</h2>
          {friendsList && friendsList.length > 0 ? (
            friendsList.map((friend, index) => {
              return (
                <li className={styles.friendHome} key={index}>
                  <Link to={`/profile/${friend.userid}`}>
                    <img src={`${prefix}/${friend.avatar}`} alt="avatar" />
                    {friend.username}
                  </Link>
                </li>
              );
            })
          ) : (
            <p className={styles.noFriend}>Add friends...</p>
          )}
        </ul>
      )}

      <div className={styles.centerContainer} id="centerContainer">
        <form onSubmit={handleAddNewPost} className={styles.newPost}>
          <input
            type="text"
            ref={newContent}
            placeholder="What's in your mind.."
          />

          {images.length > 0 && (
            <div className={styles.previewImgContainer}>
              {images.map((image, index) => {
                let imageUrl = URL.createObjectURL(image);
                return (
                  <div className={styles.previewImg} key={index}>
                    <img src={imageUrl} alt="Post img" />
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

        {loading ? (
          <Loader text={"posts"} />
        ) : (
          postsList.map((post, index) => {
            return <Post post={post} key={index} />;
          })
        )}
      </div>

      <ul className={styles.rightContainer}>
        <h2>All Users</h2>
        {usersList.map((user, index) => {
          return (
            <li className={styles.userHome} key={index}>
              <Link to={`/profile/${user.userid}`}>
                <img src={`${prefix}/${user.avatar}`} alt="avatar" />
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
