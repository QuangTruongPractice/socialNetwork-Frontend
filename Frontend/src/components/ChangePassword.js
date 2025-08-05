import MySpinner from "./layout/MySpinner";
import { useState } from "react";
import { Button, Form, Alert, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../configs/LoadData";
const ChangePassword = () => {
  const info = [
    {
      title: "Mật khẩu hiện tại",
      field: "currentPassword",
      type: "text",
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

  const [form, setForm] = useState({});
  const [msg, setMsg] = useState();
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const validate = () => {
    const errors = [];
    if (form.password !== form.confirm) {
      errors.push("Mật khẩu xác nhận không khớp");
    }

    if (!form.currentPassword || !form.password) {
      errors.push("Vui lòng điền đầy đủ thông tin");
    }

    if (errors.length > 0) {
      setMsg(errors.join(" • "));
      return false;
    }

    setMsg(null);
    return true;
  };

  const save = async (event) => {
    event.preventDefault();
    if (validate()) {
      try {
        setLoading(true);
        const result = await changePassword(form.currentPassword, form.password);
        if (result.includes("thành công")) {
          nav("/home");
        } else {
          setMsg(result);
        }
      } catch (ex) {
        if (ex.response && ex.response.data && ex.response.data.error) {
          alert("Lỗi: " + ex.response.data.error);
        } else {
          alert("Đã xảy ra lỗi không xác định");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Card className="w-75 mx-auto mt-5 p-4 shadow rounded">
      <h2 className="text-center text-success mb-4">
        🚀 Bạn cần phải đổi mật khẩu trước khi tiếp tục
      </h2>

      {msg && <Alert variant="danger">{msg}</Alert>}

      <Form onSubmit={save}>
        {info.map((f, idx) => (
          <Form.Group className="mb-3" controlId={f.field} key={idx}>
            <Form.Label>{f.title}</Form.Label>
            <Form.Control
              type={f.type}
              name={f.field}
              value={form[f.field] || ""}
              onChange={(e) => setForm({ ...form, [f.field]: e.target.value })}
              placeholder={`Nhập ${f.title.toLowerCase()}`}
            />
          </Form.Group>
        ))}

        {loading ? (
          <MySpinner />
        ) : (
          <div className="text-center">
            <Button variant="success" type="submit">
              Lưu
            </Button>
          </div>
        )}
      </Form>
    </Card>
  );
};
export default ChangePassword;
