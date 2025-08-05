import { Modal, Form } from "react-bootstrap";
import { useRef, useState } from "react";
import { createPost } from "../configs/LoadData";
import PostContentInput from "./layout/PostContentInput";
import UploadImage from "./layout/UploadImage";
import ModalPostFooter from "./layout/ModalPostFooter";

export default function AddPost({ onClose, onPostCreated }) {
  const [error, setError] = useState("");
  const formRef = useRef();
  const fileRef = useRef();
  const [postForm, setPostForm] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!postForm.content || postForm.content.trim().length < 5) {
      setError("Nội dung quá ngắn!");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        setLoading(true);
        const formData = new FormData();
        for (let key in postForm) formData.append(key, postForm[key]);
        if (fileRef.current?.files?.[0]) {
          formData.append("image", fileRef.current.files[0]);
        }
        let res = await createPost(formData);
        if (res.status === 201){
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
        <Modal.Title>Tạo bài viết</Modal.Title>
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
          <UploadImage fileRef={fileRef} />
        </Modal.Body>
        <ModalPostFooter onClose={onClose} loading={loading} />
      </Form>
    </Modal>
  );
}
