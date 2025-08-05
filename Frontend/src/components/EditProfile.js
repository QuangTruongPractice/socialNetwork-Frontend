import { useEffect, useState, useContext, useRef } from "react";
import { Button, Form, Row, Col, Container } from "react-bootstrap";
import MySpinner from "./layout/MySpinner";
import { MyUserContext } from "../configs/Contexts";
import { authApis, endpoints } from "../configs/Apis";
import TextInputField from "./layout/TextInputField";
import SelectInputField from "./layout/SelectInputField";
import { useNavigate } from "react-router-dom";
const EditProfile = () => {
  const [user, dispatch] = useContext(MyUserContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const avatar = useRef();
  const nav = useNavigate();

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
  ];

  useEffect(() => {
    if (user) {
      setFormData({
        lastName: user.lastName || "",
        firstName: user.firstName || "",
        dob: user.dob ? user.dob.slice(0, 10) : "",
        gender: user.gender || "",
        userCode: user.userCode || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let formData = new FormData();
      for (let key in formData) {
        formData.append(key, formData[key]);
      }
      if (avatar.current.files.length > 0) {
        formData.append("avatar", avatar.current.files[0]);
      }
      let res = await authApis().put(endpoints["user"], formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch({
        type: "login",
        payload: res.data,
      });

      if (res.status === 200) nav("/my-profile");

      console.log("Dữ liệu gửi đi:", formData);
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Form className="mt-3" onSubmit={handleEdit}>
        <Row>
          {info.map((field, idx) => (
            <Col md={6} key={idx} className="mb-3">
              {field.type === "select" ? (
                <SelectInputField
                  {...field}
                  value={formData[field.field]}
                  onChange={(name, value) =>
                    setFormData((prev) => ({ ...prev, [name]: value }))
                  }
                />
              ) : (
                <TextInputField
                  {...field}
                  value={formData[field.field]}
                  onChange={(name, value) =>
                    setFormData((prev) => ({ ...prev, [name]: value }))
                  }
                />
              )}
            </Col>
          ))}
        </Row>

        {/* Avatar chỉ render một lần */}
        <Form.Group className="mb-3" controlId="avatar">
          <Form.Label>Ảnh đại diện</Form.Label>
          <Form.Control type="file" ref={avatar} />
        </Form.Group>

        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? <MySpinner /> : "Lưu"}
        </Button>
      </Form>
    </Container>
  );
};

export default EditProfile;
