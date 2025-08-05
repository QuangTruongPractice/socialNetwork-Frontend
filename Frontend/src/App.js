import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Header from "./components/layout/Header";
import Home from "./components/Home";
import AddAlumniProfile from "./components/AddAlumniProfile";
import AddLecturerProfile from "./components/AddLecturerProfile";
import AddAdminProfile from "./components/AddAdminProfile";
import MyProfile from "./components/MyProfile";
import EditProfile from "./components/EditProfile";
import UserProfile from "./components/UserProfile";
import Login from "./components/Login";
import Register from "./components/Register";
import Info from "./components/Info";
import PostDetail from "./components/PostDetail";
import { MyUserContext } from "./configs/Contexts";
import { useReducer, useContext } from "react";
import MyUserReducer from "./reducers/MyUserReducer";
import "bootstrap/dist/css/bootstrap.min.css";
import ChangePassword from "./components/ChangePassword";
import LoginHandle from "./components/LoginHandle";
import Following from "./components/Following";
import Follower from "./components/Follower";
import NotificationPage from "./components/NotificationPage";

const ProtectedRoute = ({ children }) => {
  const [user] = useContext(MyUserContext);
  console.info("ProtectedRoute user:", user);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const GuestRoute = ({ children }) => {
  const [user] = useContext(MyUserContext);
  if (user) {
    return <Navigate to="/home" replace />;
  }
  return children;
};

const Layout = () => {
  const location = useLocation();
  const [user] = useContext(MyUserContext);
  const hideHeaderPaths = [
    "/login",
    "/add-admin-profile",
    "/add-alumni-profile",
    "/add-lecturer-profile",
    "/register",
    "/",
    "/change-password",
  ];

  const hideHeader = hideHeaderPaths.includes(location.pathname);

  return (
    <>
      {!hideHeader && <Header />}

        <Routes>
          <Route path="/redirect" element={<LoginHandle />} />
          <Route path="/add-alumni-profile" element={<ProtectedRoute><AddAlumniProfile /></ProtectedRoute>} />
          <Route path="/add-lecturer-profile" element={<ProtectedRoute><AddLecturerProfile /></ProtectedRoute>} />
          <Route path="/add-admin-profile" element={<ProtectedRoute><AddAdminProfile /></ProtectedRoute>} />
          <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/" element={<Info />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/follower" element={<ProtectedRoute><Follower /></ProtectedRoute>} />
          <Route path="/following" element={<ProtectedRoute><Following /></ProtectedRoute>} />
          <Route path="/notification" element={<ProtectedRoute><NotificationPage /></ProtectedRoute>} />
          <Route path="/post/:postId" element={<ProtectedRoute><PostDetail /></ProtectedRoute>} />
          <Route path="/my-profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
          <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          <Route path="/user-profile/:userId" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="*" element={
            user ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
          } />
        </Routes>
    </>
  );
};

const App = () => {
  let [user, dispatch] = useReducer(MyUserReducer, JSON.parse(localStorage.getItem("user")));
  return (
    <MyUserContext.Provider value={[user, dispatch]}>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </MyUserContext.Provider>
  );
};

export default App;
