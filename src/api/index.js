export const prefix = "https://social-app-api-e3mz.onrender.com";

// Function to call fetch api for different url with (authentication token)

const customFetch = async (url, config) => {
  // Fetching authentication token from local storage
  const token = window.localStorage.getItem("TOKEN_KEY");

  // If any file present in body
  let filePresent;

  // Stringify form body (if no file present)
  if (config.body) {
    filePresent = config.body instanceof FormData;
    if (!filePresent) {
      config.body = JSON.stringify(config.body);
    }
  }

  // Request headers
  const headers = filePresent
    ? {}
    : {
        "Content-Type": "application/json",
      };

  // If token present add it to headers
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    // API call with all given configurations
    const response = await fetch(String(prefix + url), { headers, ...config });
    const json = await response.json();

    if (json.success) {
      return json;
    }

    throw new Error(json.message);
  } catch (err) {
    return {
      api_call_success: false,
      flag: "error from custom fetch",
      message: err.message || err,
    };
  }
};

// Api call for log-in a user
export const login = async (email, password) => {
  const response = await customFetch("/user/login", {
    method: "POST",
    body: { email, password },
  });
  return response;
};

// Api call for sign-up a new user
export const signup = async (email, username, password) => {
  const response = await customFetch("/user/signup", {
    method: "POST",
    body: { email, username, password },
  });
  return response;
};

// Api call for creating new post
export const createPost = async (data) => {
  const response = await customFetch("/post/create", {
    method: "POST",
    body: data,
  });
  return response;
};

// Api call for fetching all friends
export const fetchAllFriends = async () => {
  try {
    const response = await customFetch("/friends", { method: "GET" });
    return response;
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

// Api call for fetching all posts
export const fetchAllPosts = async () => {
  try {
    const response = await customFetch("/posts", { method: "GET" });
    return response;
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

// Api call for fetching all users
export const fetchAllUsers = async () => {
  try {
    const response = await customFetch("/users", { method: "GET" });
    return response;
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

// Api call for fetching posts of logged user
export const fetchPosts = async (id) => {
  try {
    const response = await customFetch(`/user/${id}/posts`, { method: "GET" });
    return response;
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

// Api call for adding new comment
export const createComment = async (postid, content) => {
  const response = await customFetch(`/comment/${postid}/create`, {
    method: "POST",
    body: { content },
  });
  return response;
};

// Api call for sending friend request
export const sendFriendReq = async (id, userid) => {
  try {
    const response = await customFetch(`/user/friend/add_request/${id}`, {
      method: "POST",
    });
    return response;
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

// Api call for removing friend request
export const removeFriendReq = async (id, self) => {
  try {
    const response = await customFetch(
      `/user/friend/remove_request?id=${id}&self=${self}`,
      {
        method: "POST",
      }
    );
    return response;
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

// Api call for adding new friend
export const addFriend = async (id) => {
  try {
    const response = await customFetch(`/user/friend/add/${id}`, {
      method: "POST",
    });
    return response;
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

// Api call for removing a friend
export const removeFriend = async (id) => {
  try {
    const response = await customFetch(`/user/friend/remove/${id}`, {
      method: "POST",
    });
    return response;
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

// Api call for fetching details of a user
export const fetchUserDetails = async (id) => {
  try {
    const response = await customFetch(`/user/${id}/details`, {
      method: "GET",
    });
    return response;
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

// Api call for handling like click
export const handleLike = async (id) => {
  try {
    const response = await customFetch(`/post/${id}/like`, { method: "POST" });
    return response;
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

// Api call for updating user data
export const updateUserData = async (data) => {
  try {
    const response = await customFetch("/user/edit", {
      method: "POST",
      body: data,
    });
    return response;
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

// Api call for updating profile image of current user
export const updateUserImage = async (data) => {
  try {
    const response = await customFetch("/user/edit/avatar", {
      method: "POST",
      body: data,
    });
    return response;
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

// Api call for editing post
export const editPostDetails = async (postid, data) => {
  try {
    const response = await customFetch(`/post/${postid}/edit`, {
      method: "POST",
      body: data,
    });
    return response;
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

// Api call for deleting a post
export const deletePost = async (data) => {
  try {
    const response = await customFetch(`/post/${data}/delete`, {
      method: "DELETE",
    });
    return response;
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};
