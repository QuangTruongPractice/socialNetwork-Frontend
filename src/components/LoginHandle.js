import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import cookie from "react-cookies";
import MySpinner from "./layout/MySpinner";
import { checkUserHaveProfile } from "../configs/LoadData";

const LoginHandler = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    const handlePostLogin = async () => {
      try {
        const token = cookie.load("token");
        const decoded = jwtDecode(token);
        const res = await checkUserHaveProfile();
        const hasProfile = res;

        if (String(hasProfile) === "false") {
          if (decoded.role === "ALUMNI") {
            nav("/add-alumni-profile", { replace: true });
          } else if (decoded.role === "LECTURER") {
            nav("/add-lecturer-profile", { replace: true });
          } else if (decoded.role === "ADMIN") {
            nav("/add-admin-profile", { replace: true });
          } else {
            console.warn("Unknown role:", decoded.role);
            nav("/login", { replace: true });
          }
        } else if (decoded.mustChangePassword) {
          nav("/change-password", { replace: true });
        } else {
          nav("/home", { replace: true });
        }
      } catch (error) {
        console.error("Error handling post-login:", error);
      } finally {
        setIsProcessing(false);
      }
    };

    handlePostLogin();
  }, [nav]);

  if (isProcessing) {
    return <MySpinner />;
  }

  return null;
};
export default LoginHandler;
