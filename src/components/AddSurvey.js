import { Modal, Form, Button, InputGroup } from "react-bootstrap";
import { useRef, useState } from "react";
import { createSurvey } from "../configs/LoadData";
import PostContentInput from "./layout/PostContentInput";
import UploadImage from "./layout/UploadImage";
import ModalPostFooter from "./layout/ModalPostFooter";

export default function AddSurvey({ onClose, onPostCreated }) {
  const [error, setError] = useState("");
  const [optionInput, setOptionInput] = useState("");
  const [options, setOptions] = useState([]);
  const formRef = useRef();
  const [postForm, setPostForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const validate = () => {
    if (!postForm.content || postForm.content.trim().length < 5) {
      setError("Nội dung quá ngắn!");
      return false;
    }
    if (options.length < 2) {
      setError("Cần ít nhất 2 lựa chọn khảo sát.");
      return false;
    }
    return true;
  };

  const handleAddOption = () => {
    const trimmed = optionInput.trim();
    if (trimmed && !options.includes(trimmed)) {
      setOptions([...options, trimmed]);
      setOptionInput("");
    }
  };

  const handleRemoveOption = (index) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        setLoading(true);
        const formData = new FormData();
        for (let key in postForm) formData.append(key, postForm[key]);

        if (selectedFiles.length > 0) {
          selectedFiles.forEach(item => {
            formData.append("image", item.file);
          });
        }

        options.forEach((opt) => {
          if (opt.trim()) formData.append("options", opt.trim());
        });

        let res = await createSurvey(formData);
        if (res.status === 201) {
          console.info(res.data);
          onPostCreated(res.data);
          onClose();
        }
      } catch (ex) {
        console.error("Lỗi khi đăng bài:", ex);
        setError("Đăng bài thất bại. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Modal show onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Tạo khảo sát</Modal.Title>
      </Modal.Header>
      <Form ref={formRef} onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <div className="alert alert-danger">{error}</div>}

          <PostContentInput
            value={postForm.content || ""}
            onChange={(e) =>
              setPostForm({ ...postForm, [e.target.name]: e.target.value })
            }
          />
          <UploadImage files={selectedFiles} setFiles={setSelectedFiles} />

          <Form.Group className="mt-3">
            <Form.Label>Lựa chọn khảo sát</Form.Label>
            <InputGroup className="mb-2">
              <Form.Control
                placeholder="Nhập lựa chọn..."
                value={optionInput}
                onChange={(e) => setOptionInput(e.target.value)}
              />
              <Button variant="outline-primary" onClick={handleAddOption}>
                Thêm
              </Button>
            </InputGroup>
            <ul className="list-group">
              {options.map((opt, idx) => (
                <li
                  key={idx}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {opt}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveOption(idx)}
                  >
                    X
                  </Button>
                </li>
              ))}
            </ul>
          </Form.Group>
        </Modal.Body>

        <ModalPostFooter onClose={onClose} loading={loading} />
      </Form>
    </Modal>
  );
}
