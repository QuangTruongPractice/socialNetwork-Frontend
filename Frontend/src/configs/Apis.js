import axios from "axios";
import cookie from 'react-cookies'

const BASE_URL = 'http://localhost:8080/socialNetwork/api';

export const endpoints = {
    'posts': '/posts',
    'auth-posts': '/secure/posts',
    'auth-survey': '/secure/posts/survey',
    'auth-invitation': '/secure/posts/invitation',
    'post-detail': (id) => `/posts/${id}`,
    'edit-post-detail': (id) => `/secure/posts/${id}`,
    'post-comments': (id) => `/secure/posts/${id}/comments`,
    'post-comments-detail': (postId, commentId) => `/secure/posts/${postId}/comments/${commentId}`,
    'register': '/register',
    'login': '/login',
    'profile': '/secure/profile',
    'user-profile': (id) => `/secure/profile/${id}`,
    'user': '/secure/user',
    'find-user': '/users',
    'check-profile': '/secure/user/profile',
    'change-password': '/secure/change-password',
    'groups': '/groups',
    'accounts': '/accounts',
    'vote': '/secure/posts/survey/vote',
    'reaction': (id) => `/posts/${id}/reactions`,
    'auth-reaction': (id) => `/secure/posts/${id}/reactions`,
    'get-follower':'/secure/follows/followers',
    'get-following':'/secure/follows/followings',
    'follow': (id) => `/secure/follows/${id}`,
    'check-follow': (id) => `/secure/follows/check/${id}`,
    'mark-read': (id) => `/notifications/${id}/read`,
    'notification': '/secure/notifications',
}

export const authApis = () => axios.create({
    baseURL: BASE_URL,
    headers: {
        'Authorization': `Bearer ${cookie.load('token')}`
    }
})

export default axios.create({
    baseURL: BASE_URL
})