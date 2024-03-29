import { useState, useRef, useEffect } from "react";
import styles from "../styles/post.module.css";
import { useAuth, useEditField } from "../hooks";
import { createComment, handleLike, editPostDetails, prefix } from "../api";
import {
  FaCheck,
  FaTimes,
  FaTimesCircle,
  FaRegTrashAlt,
  FaAngleUp,
  FaRegThumbsUp,
  FaThumbsUp,
  FaCommentDots,
  FaEdit,
} from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { toast } from "react-toastify";

function Post({ post, self, handleDeletePost }) {
  const [content, setContent] = useState(post.content); // text content of post

  const [liked, setLiked] = useState(post.liked); // if liked by logged user (or not)

  const [likes, setLikes] = useState(post.likes); // number of likes in this post

  const [images, setImages] = useState(post.images); // all images present in post

  const [imagesToEdit, setImagesToEdit] = useState(post.images); // images to update to post

  const [comments, setComments] = useState(post.comments); // all comments

  const [showComments, setShowComments] = useState(false); // showing and hiding comments section

  const [editingPost, setEditingPost] = useState(false); // status if the post is being edited

  const [confirmDelete, setConfirmDelete] = useState(false); // confirmation before deleting post

  const textareaRef = useRef(); // reference of textarea to change text content

  const commentRef = useRef(); // form to add new comment

  const editPost = useEditField(post.content); // form for editing a post

  const [showImg, setShowImg] = useState(false); // hiding images (initially) if more than 4

  const auth = useAuth(); // data of logged user (using context api)

  useEffect(() => {
    if (editingPost) {
      // Setting initial dimention of field to change text content
      let reqRows = textareaRef.current.scrollHeight / 17.25;
      if (!Number.isInteger(reqRows)) {
        reqRows = Math.floor(reqRows) + 1;
      }
      textareaRef.current.rows = reqRows;
    } else if (!editingPost) {
      setImagesToEdit(images);
    }
  }, [editingPost]);

  useEffect(() => {
    setContent(post.content);
    setImages(post.images);
    setLikes(post.likes);
    setLiked(post.liked);
    setComments(post.comments);
  }, [post.content, post.images, post.likes, post.liked, post.comments]);

  // Function to handle like button click
  const handleLikeClick = async () => {
    if (auth.user) {
      const response = await handleLike(post.postid);
      setLiked(response.liked); // changing status of like button
      setLikes(response.likes); // changing likes count
    } else {
      setLiked((prevLiked) => !prevLiked); // changing status of like button
      setLikes((prevLikes) => (liked ? prevLikes + 1 : prevLikes - 1)); // changing likes count
    }
  };

  // Function to edit a post (text content + images)
  const handleEditPost = async () => {
    const data = {
      content: editPost.value || "",
      images: imagesToEdit,
    };

    const response = await editPostDetails(post.postid, data);

    setContent(data.content); // changing text-content state
    setImages(imagesToEdit); // updating images in post
    setEditingPost(false); // changing editing status

    if (response.success) {
      toast.success("Post edited successfully!");
    } else {
      toast.error("Unable edit post");
    }
  };

  // Function for removing images from post (before saving)
  const removeImgFromPost = (index) => {
    const newImages = imagesToEdit.filter(
      (image, indexOfImg) => indexOfImg !== index
    );
    setImagesToEdit(newImages);
  };

  // Function for changing dimention of field to edit text-content
  const updatePostContent = ({ target }) => {
    editPost.handleChange(target.value);

    let reqHeight = textareaRef.current.scrollHeight;
    let reqRows = reqHeight / 17.25;
    if (!Number.isInteger(reqRows)) {
      reqRows = Math.floor(reqRows) + 1;
    }

    if (reqRows > textareaRef.current.rows) {
      textareaRef.current.rows = ++textareaRef.current.rows;
    }
  };

  // Function for adding new comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (commentRef.current.value === "") {
      toast.warning("Add text to comment");
    } else {
      const response = await createComment(
        post.postid,
        commentRef.current.value
      );

      // Adding new comment to state
      setComments([
        ...comments,
        {
          avatar: response.data.avatar,
          author: response.data.author,
          content: response.data.content,
        },
      ]);
      e.target.reset();

      if (response.success) {
        toast.success("Comment added successfully!");
      } else {
        toast.error("Unable to add comment");
      }
    }
  };

  return (
    <div className={styles.post}>
      {self &&
        (editingPost ? (
          <div className={styles.editPostBtns}>
            <small onClick={handleEditPost} className={styles.blueBtn}>
              <FaCheck />
              Save
            </small>

            <small
              onClick={() => {
                setImages(post.images);
                setEditingPost(false);
              }}
              className={styles.redBtn}
            >
              <FaTimes />
              Cancel
            </small>
          </div>
        ) : (
          <div className={styles.editPostBtns}>
            <small
              onClick={() => {
                setEditingPost(true);
              }}
              className={styles.blueBtn}
            >
              <FaEdit />
              Edit
            </small>

            {confirmDelete ? (
              <small className={styles.confirmDelete}>
                <p
                  onClick={({ target }) => {
                    setConfirmDelete(false);
                    target.parentElement.parentElement.parentElement.remove();
                    handleDeletePost(post.postid);
                  }}
                >
                  Delete
                </p>
                <p onClick={() => setConfirmDelete(false)}>Cancel</p>
              </small>
            ) : (
              <small
                onClick={() => setConfirmDelete(true)}
                className={styles.redBtn}
              >
                <FaRegTrashAlt />
                Delete
              </small>
            )}
          </div>
        ))}

      <img
        src={`${prefix}/${post.avatar}`}
        alt="avatar"
        className={styles.postAuthorImg}
      />
      <div className={styles.postAuthor}>
        <h3>{post.author}</h3>
        <small>{post.createdOn}</small>
      </div>

      {editingPost ? (
        <textarea
          type="text"
          ref={textareaRef}
          onChange={updatePostContent}
          defaultValue={content}
          className={styles.editPostText}
        />
      ) : (
        <p className={styles.postContent}>{content}</p>
      )}

      {post.images.length > 0 && (
        <div
          className={`${styles.postImageContainer} ${
            !editingPost && styles.spaceAround
          }`}
        >
          {editingPost
            ? imagesToEdit.map((imageUrl, index) => {
                return (
                  <div className={styles.editingPostImg} key={index}>
                    <img
                      src={`${prefix}/${imageUrl}`}
                      loading="lazy"
                      decoding="async"
                      alt="postImage"
                    />

                    <FaTimesCircle onClick={() => removeImgFromPost(index)} />
                  </div>
                );
              })
            : images.map((imageUrl, index) => {
                return (
                  <div
                    className={`
                              ${styles.postImg}
                              ${index > 3 && !showImg && styles.hidden}
                              ${
                                index === 3 &&
                                images.length > 4 &&
                                styles.posRelative
                              }
                           `}
                    key={index}
                  >
                    <img
                      src={`${prefix}/${imageUrl}`}
                      loading="lazy"
                      decoding="async"
                      alt="postImage"
                    />

                    {index === 3 && images.length > 4 && !showImg && (
                      <div
                        onClick={() => setShowImg(true)}
                        className={styles.hiddenImgCount}
                      >
                        +{images.length - 3}
                      </div>
                    )}
                  </div>
                );
              })}

          {showImg && (
            <div
              className={styles.hideImages}
              onClick={() => setShowImg(false)}
            >
              <FaAngleUp />
              Show Less
            </div>
          )}
        </div>
      )}

      <div className={styles.postBtns}>
        <span onClick={handleLikeClick} className="hover">
          {liked ? <FaThumbsUp /> : <FaRegThumbsUp />}
          <i>{likes > 0 ? likes : "Like"}</i>
        </span>

        <span
          onClick={() => setShowComments(!showComments)}
          style={{
            backgroundColor: showComments
              ? "rgba(0, 0, 0, 0.15)"
              : "transparent",
          }}
          className="hover"
        >
          Comment
          <FaCommentDots />
        </span>
      </div>

      {showComments && (
        <div className={styles.comment}>
          <div className={styles.hideBtn}>
            <span onClick={() => setShowComments(!showComments)}>
              <FaAngleUp />
              Hide
            </span>
          </div>

          <form onSubmit={handleAddComment} className={styles.commentForm}>
            <input type="text" ref={commentRef} placeholder="comment..." />

            <button type="submit">
              <FiSend />
            </button>
          </form>

          {comments.length > 0 ? (
            comments.map((comment, i) => {
              return (
                <div className={styles.singleComment} key={i}>
                  <div>
                    <img src={`${prefix}/${comment.avatar}`} alt="avatar" />
                    <span>{comment.author}</span>
                  </div>
                  <p>{comment.content}</p>
                </div>
              );
            })
          ) : (
            <p className={styles.noComment}>No comments yet...</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Post;
