import  { authApis, endpoints } from "./Apis";

export const REACTIONS = [
  { type: "LIKE", icon: "👍" },
  { type: "LOVE", icon: "❤️" },
  { type: "HAHA", icon: "😂" },
  { type: "SAD", icon: "😢" },
  { type: "ANGRY", icon: "😠" },
];

export const uploadProfile = async (formData) => {
  const res = await authApis().post(endpoints["profile"], formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res;
};

export const changePassword = async (currentPassword, password) => {
  const res = await authApis().post(endpoints["change-password"], {
    currentPassword: currentPassword,
    password: password,
  });
  return res.data;
};

export const getPosts = async (page = 1) => {
  const url = `${endpoints["auth-posts"]}?page=${page}`;
  const res = await authApis().get(url);
  return res.data;
};

export const getPostDetail = async (postId) => {
  const res = await authApis().get(endpoints["post-detail"](postId));
  return res.data;
};

export const checkProfile = async () => {
  const res = await authApis().get(endpoints["profile"]);
  return res.data;
};

export const checkUserHaveProfile = async () => {
  const res = await authApis().get(endpoints["check-profile"]);
  return res.data;
};

export const userProfile = async (userId) => {
  const res = await authApis().get(endpoints["user-profile"](userId));
  return res.data;
};

export const createPost = async (formData) => {
  const res = await authApis().post(endpoints["auth-posts"], formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res;
};

export const createSurvey = async (formData) => {
  const res = await authApis().post(endpoints["auth-survey"], formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res;
};

export const createInvitation = async (formData) => {
  const res = await authApis().post(endpoints["auth-invitation"], formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res;
};

export const addReaction = async (reactionType, postId) => {
  const res = await authApis().put(endpoints["auth-reaction"](postId), {
    reactionType: reactionType,
  });
  return res.data;
};

