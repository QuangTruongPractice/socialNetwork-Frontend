import { Alert, Form, Button, Card, Row, Col } from "react-bootstrap";
import { useRef, useState } from "react";
import { uploadProfile } from "../configs/LoadData";
import { useNavigate } from "react-router-dom";
import MySpinner from "./layout/MySpinner";
import TextInputField from "./layout/TextInputField";
const AddLecturerProfile = () => {
  const info = [
    {
      title: "Chức vụ",
      field: "position",
      type: "text",
    },
    {
      title: "Học vị",
      field: "degree",
      type: "text",
    },
    {
      title: "Lĩnh vực chuyên môn",
      field: "specialization",
      type: "text",
    },
    {
      title: "Khoa",
      field: "faculty",
      type: "text",
    },
    {
      title: "Giới thiệu bản thân",
      field: "description",
      type: "text",
    },
  ];
  const coverImage = useRef();
  const [profile, setProfile] = useState({});
  const [msg, setMsg] = useState();
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const validate = () => {
    const missingFields = [];

    info.forEach((i) => {
      if (!profile[i.field] || profile[i.field].trim() === "") {
        missingFields.push(i.title);
      }
    });

    if (missingFields.length > 0) {
      setMsg("Vui lòng nhập đầy đủ: " + missingFields.join(", "));
      return false;
    }

    setMsg(null);
    return true;
  };

  const add = async (event) => {
    event.preventDefault();

    if (validate()) {
      try {
        setLoading(true);
        let formData = new FormData();
        for (let key in profile) formData.append(key, profile[key]);

        if (coverImage.current.files.length > 0) {
          formData.append("coverImage", coverImage.current.files[0]);
        }
        const result = await uploadProfile(formData);
        if (result.status === 201) nav("/change-password");
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
        🚀 Để bắt đầu, bạn cần tạo hồ sơ cá nhân
      </h2>

      {msg && <Alert variant="danger">{msg}</Alert>}

      <Form onSubmit={add}>
        <Row>
          {info.map((i) => (
            <Col md={6} key={i.field}>
              <TextInputField
                {...i}
                value={profile[i.field]}
                onChange={(e) =>
                  setProfile({ ...profile, [i.field]: e.target.value })
                }
              />
            </Col>
          ))}
        </Row>

        <Form.Group className="mb-4" controlId="coverImage">
          <Form.Label>Ảnh nền</Form.Label>
          <Form.Control type="file" ref={coverImage} accept="image/*" />
        </Form.Group>

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

export default AddLecturerProfile;
