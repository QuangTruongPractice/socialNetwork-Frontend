import "../css/Login.css";
import { Alert, Form, Button } from "react-bootstrap";
import { useRef, useState } from "react";
import Apis, { endpoints } from "../configs/Apis";
import { useNavigate } from "react-router-dom";
import MySpinner from "./layout/MySpinner";
import TextInputField from "./layout/TextInputField";
import SelectInputField from "./layout/SelectInputField";

const Register = () => {
  const info = [
    {
      title: "Tên",
      field: "lastName",
      type: "text",
    },
    {
      title: "Họ và tên lót",
      field: "firstName",
      type: "text",
    },
    {
      title: "Ngày sinh",
      field: "dob",
      type: "date",
    },
    {
      title: "Giới tính",
      field: "gender",
      type: "select",
      options: [
        { label: "Nam", value: "male" },
        { label: "Nữ", value: "female" },
        { label: "Khác", value: "other" },
      ],
    },
    {
      title: "MSSV",
      field: "userCode",
      type: "text",
    },
    {
      title: "Số điện thoại",
      field: "phone",
      type: "tel",
    },
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
    {
      title: "Xác nhận mật khẩu",
      field: "confirm",
      type: "password",
    },
  ];

  const avatar = useRef();
  const [user, setUser] = useState({});
  const [msg, setMsg] = useState();
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const validate = () => {
    const errors = [];

    for (let i of info) {
      if (!user[i.field] || user[i.field].trim() === "") {
        errors.push(`${i.title} không được để trống`);
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (user.email && !emailRegex.test(user.email)) {
      errors.push("Email không hợp lệ");
    }

    if (user.password && user.password.length < 6) {
      errors.push("Mật khẩu phải có ít nhất 6 ký tự");
    }

    if (!user.userCode || user.userCode.length !== 10) {
      errors.push("MSSV phải có đúng 12 ký tự");
    }

    if (user.password !== user.confirm) {
      errors.push("Mật khẩu xác nhận không khớp");
    }

    if (!avatar.current || avatar.current.files.length === 0) {
      errors.push("Vui lòng chọn ảnh đại diện");
    }

    if (errors.length > 0) {
      setMsg(errors.join(" • "));
      return false;
    }

    setMsg(null);
    return true;
  };

  const register = async (event) => {
    event.preventDefault();

    console.log("Register processing...", user); // Debug log

    if (validate()) {
      try {
        setLoading(true);
        let formData = new FormData();
        for (let key in user)
          if (key !== "confirm") formData.append(key, user[key]);

        if (avatar.current.files.length > 0) {
          formData.append("avatar", avatar.current.files[0]);
        }

        console.log("Sending API request..."); // Debug log
        let res = await Apis.post(endpoints["register"], formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (res.status === 201) nav("/login");
      } catch (ex) {
        console.error("Register Error:", ex);
        let errorMessage = "Đã có lỗi xảy ra";
        if (ex.response && ex.response.data && ex.response.data.error) {
          errorMessage = ex.response.data.error;
        } else if (ex.message) {
          errorMessage = ex.message;
        }
        setMsg(errorMessage);
      } finally {
        setLoading(false);
      }
    } else {
      console.log("Validation failed"); // Debug log
    }
  };
  return (
    <div className="login-page d-flex">
      <div className="left-image d-none d-md-block" />

      <div className="content-section">
        <div className="form-wrapper w-75">
          <h1 className="text-center text-success mt-2">ĐĂNG KÝ</h1>

          {msg && <Alert variant="danger">{msg}</Alert>}

          <Form onSubmit={register}>
            <div className="row">
              {info.map((i, idx) => (
                <div key={i.field} className="col-md-6">
                  <Form.Group className="mb-3" controlId={i.field}>
                    {i.type === "select" ? (
                      <SelectInputField
                        {...i}
                        value={user[i.field]}
                        onChange={(e) =>
                          setUser({ ...user, [i.field]: e.target.value })
                        }
                      />
                    ) : (
                      <TextInputField
                        {...i}
                        type={i.type}
                        value={user[i.field]}
                        onChange={(e) =>
                          setUser({ ...user, [i.field]: e.target.value })
                        }
                      />
                    )}
                  </Form.Group>
                </div>
              ))}
            </div>

            <Form.Group className="mb-3" controlId="avatar">
              <Form.Label>Ảnh đại diện</Form.Label>
              <Form.Control type="file" ref={avatar} />
            </Form.Group>

            {loading ? (
              <MySpinner />
            ) : (
              <div className="text-center">
                <Button type="submit" variant="success">
                  Đăng ký
                </Button>
              </div>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Register;
