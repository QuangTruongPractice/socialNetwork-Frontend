import cookie from 'react-cookies'

const MyUserReducer = (current, action) => {
    switch (action.type) {
        case 'login':
            return action.payload;
        case 'logout':
            localStorage.removeItem("user");
            cookie.remove('token');
            return null;
        default:
            return current;
    }

}

export default MyUserReducer;