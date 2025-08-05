import { Alert, Form, Button, Card, Row, Col } from "react-bootstrap";
import { useRef, useState } from "react";
import { uploadProfile } from "../configs/LoadData";
import { useNavigate } from "react-router-dom";
import MySpinner from "./layout/MySpinner";
import TextInputField from "./layout/TextInputField";
import SelectInputField from "./layout/SelectInputField";
const AddAlumniProfile = () => {
  const info = [
    {
      title: "Năm tốt nghiệp",
      field: "graduationYear",
      type: "select",
      options: [
        { label: "2025", value: "2025" },
        { label: "2024", value: "2024" },
        { label: "2023", value: "2023" },
        { label: "2022", value: "2022" },
        { label: "2021", value: "2021" },
      ],
    },
    {
      title: "Ngành",
      field: "major",
      type: "text",
    },
    {
      title: "Khoa",
      field: "faculty",
      type: "text",
    },
    {
      title: "Công việc hiện tại",
      field: "currentJob",
      type: "text",
    },
    {
      title: "Công ty",
      field: "company",
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

        if (result.status === 201) nav("/redirect");
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
              {i.type === "select" ? (
                <SelectInputField
                  {...i}
                  value={profile[i.field]}
                  onChange={(e) =>
                    setProfile({ ...profile, [i.field]: e.target.value })
                  }
                />
              ) : (
                <TextInputField
                  {...i}
                  value={profile[i.field]}
                  onChange={(e) =>
                    setProfile({ ...profile, [i.field]: e.target.value })
                  }
                />
              )}
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

export default AddAlumniProfile;
