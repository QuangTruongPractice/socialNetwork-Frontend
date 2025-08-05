import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";

const Info = () => {
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <div className="left-image d-none d-md-block" />

      <div className="content-section d-flex flex-column justify-content-center text-center">
        <h1>Chào mừng đến với Mạng xã hội Cựu sinh viên!</h1>
        <p>Kết nối lại với bạn bè, chia sẻ kỷ niệm và nhận thông báo từ trường đại học của bạn.</p>
        <p>Hãy đăng nhập hoặc đăng ký để bắt đầu!</p>

        <div className="text-center mt-4">
          <Button variant="outline-primary" onClick={() => navigate("/login")} className="me-2">
            Đăng nhập
          </Button>
          <Button variant="primary" onClick={() => navigate("/register")}>
            Đăng ký
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Info;
