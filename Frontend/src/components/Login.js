import "../css/Login.css";
import { useContext, useState } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import Apis, { authApis, endpoints } from "../configs/Apis";
import cookie from "react-cookies";
import { MyUserContext } from "../configs/Contexts";
import { useNavigate } from "react-router-dom";
import MySpinner from "./layout/MySpinner";

const Login = () => {
  const [, dispatch] = useContext(MyUserContext);
  const [loading, setLoading] = useState(false);
  const info = [
    {
      title: "Email",
      field: "email",
      type: "email",
    },
    {
      title: "Mật khẩu",
      field: "password",
      type: "password",
    },
  ];
  const [user, setUser] = useState({});
  const [error, setError] = useState(null);
  const nav = useNavigate();

  const login = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);
      let res = await Apis.post(endpoints["login"], {
        ...user,
      });
      cookie.save("token", res.data.token);
      let u = await authApis().get(endpoints["user"]);

      localStorage.setItem("user", JSON.stringify(u.data));

      dispatch({
        type: "login",
        payload: u.data,
      });

      nav("/redirect");

    } catch (ex) {
      console.error(ex);
      setError(ex.response.data || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page d-flex">
      <div className="left-image d-none d-md-block" />

      <div className="content-section">
        <div className="form-wrapper w-75">
          <h1 className="text-center text-success mt-2">ĐĂNG NHẬP</h1>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={login}>
            <div className="row">
              {info.map((i) => (
                <Form.Group key={i.field} className="mb-3" controlId={i.field}>
                  <Form.Label>{i.title}</Form.Label>
                  <Form.Control
                    required
                    value={user[i.field]}
                    onChange={(e) =>
                      setUser({ ...user, [i.field]: e.target.value })
                    }
                    type={i.type}
                    placeholder={i.title}
                  />
                </Form.Group>
              ))}
            </div>

            {loading ? (
              <MySpinner />
            ) : (
              <div className="text-center">
                <Button type="submit" variant="success">
                  Đăng nhập
                </Button>
              </div>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
