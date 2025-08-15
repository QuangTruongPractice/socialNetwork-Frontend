import { Modal, Form, Button, ListGroup, Card } from "react-bootstrap";
import { useRef, useState, useEffect } from "react";
import MySpinner from "./layout/MySpinner";
import { createInvitation, searchAccount, searchGroup } from "../configs/LoadData";
import PostContentInput from "./layout/PostContentInput";
import UploadImage from "./layout/UploadImage";
import ModalPostFooter from "./layout/ModalPostFooter";

export default function AddInvitation({ onClose, onPostCreated }) {
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [postForm, setPostForm] = useState({});
  const formRef = useRef();
  const fileRef = useRef();

  useEffect(() => {
    const fetchResults = async () => {
      if (!search.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const accRes = await searchAccount(search);
        const groupRes = await searchGroup(search);
          
        const mappedAcc = accRes.map((a) => ({
          type: "account",
          id: a.id,
          name: a.email,
        }));

        const mappedGroup = groupRes.map((g) => ({
          type: "group",
          id: g.id,
          name: g.name,
        }));

        setResults([...mappedAcc, ...mappedGroup]);
      } catch (err) {
        console.error("Fetch error", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    const delay = setTimeout(fetchResults, 300);
    return () => clearTimeout(delay);
  }, [search]);

  const handleSelect = (item) => {
    if (!selected.find((s) => s.type === item.type && s.id === item.id)) {
      setSelected([...selected, item]);
    }
  };

  const handleRemove = (item) => {
    setSelected(
      selected.filter((s) => !(s.type === item.type && s.id === item.id))
    );
  };

  const handleSelectAll = () => {
    setSelected([{ type: "all", id: "all", name: "Tất cả" }]);
  };

  const validate = () => {
    if (!postForm.content || postForm.content.trim().length < 5) {
      setError("Nội dung quá ngắn!");
      return false;
    }
    if (selected.length === 0) {
      setError("Chưa chọn người nhận!");
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

        selected.forEach((item) => {
          const value = item.type === "all" ? "all" : `${item.type}:${item.id}`;
          formData.append("recipients", value);
        });

        let res = await createInvitation(formData);
        if (res.status === 201) {
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
        <Modal.Title>Tạo thư mời</Modal.Title>
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

          <Form.Group className="mt-3">
            <Form.Label>Tìm người nhận</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập email hoặc tên nhóm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {loading && <MySpinner />}
            <ListGroup className="mt-2">
              {results.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  onClick={() => handleSelect(item)}
                  className="p-2 border mb-1 rounded hover-shadow"
                  style={{ cursor: "pointer" }}
                >
                  [{item.type}] {item.name}
                </div>
              ))}
            </ListGroup>
            <Button
              variant="outline-primary"
              className="mt-2"
              onClick={handleSelectAll}
              disabled={selected.find((s) => s.type === "all")}
            >
              Chọn tất cả
            </Button>

            <Card className="mt-3">
              <ListGroup className="mt-1">
                {selected.map((s) => (
                  <ListGroup.Item key={`sel-${s.type}-${s.id}`}>
                    [{s.type}] {s.name}
                    <Button
                      variant="link"
                      size="sm"
                      className="text-danger float-end"
                      onClick={() => handleRemove(s)}
                    >
                      x
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          </Form.Group>
        </Modal.Body>

        <ModalPostFooter onClose={onClose} loading={loading} />
      </Form>
    </Modal>
  );
}
