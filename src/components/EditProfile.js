import { useEffect, useState, useContext, useRef } from "react";
import { Button, Form, Row, Col, Container, Alert } from "react-bootstrap";
import MySpinner from "./layout/MySpinner";
import { MyUserContext } from "../configs/Contexts";
import TextInputField from "./layout/TextInputField";
import SelectInputField from "./layout/SelectInputField";
import { useNavigate } from "react-router-dom";
import { editProfile } from "../configs/LoadData";

const EditProfile = () => {
  const [user, dispatch] = useContext(MyUserContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const avatar = useRef();
  const [msg, setMsg] = useState();
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
        dob: user.dob || "",
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
      let submitData = new FormData();
      for (let key in formData) {
        submitData.append(key, formData[key]);
      }
      if (avatar.current.files.length > 0) {
        submitData.append("avatar", avatar.current.files[0]);
      }

      let res = await editProfile(submitData);

      dispatch({
        type: "login",
        payload: res.data,
      });

      if (res.status === 200) nav("/my-profile");


    } catch (err) {
      setMsg(err.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      {msg && <Alert variant="danger">{msg}</Alert>}
      <Form className="mt-3" onSubmit={handleEdit}>
        <Row>
          {info.map((field, idx) => (
            <Col md={6} key={idx} className="mb-3">
              {field.type === "select" ? (
                <SelectInputField
                  {...field}
                  value={formData[field.field]}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, [field.field]: e.target.value }))
                  }
                />
              ) : (
                <TextInputField
                  {...field}
                  type={field.type}
                  value={formData[field.field]}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, [field.field]: e.target.value }))
                  }
                />
              )}
            </Col>
          ))}
        </Row>

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
