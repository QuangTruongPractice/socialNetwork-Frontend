import { Card, Button, Form } from "react-bootstrap";
import { useState } from "react";
import AddPost from "./AddPost";
import AddSurvey from "./AddSurvey";
import AddInvitation from "./AddInvitation";
import cookie from "react-cookies";
import {jwtDecode} from "jwt-decode";

export default function PostForm({ onPostCreated }) {
  const [activeForm, setActiveForm] = useState(null); 
  const token = cookie.load("token");
  let role = null;
  try {
    if (token) {
      const decoded = jwtDecode(token);
      role = decoded?.role;
    }
  } catch (err) {
    console.error("Invalid token:", err);
  }

  const handleOpen = (type) => setActiveForm(type);
  const handleClose = () => setActiveForm(null);

  return (
    <>
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Form>
            <Form.Group>
              <Form.Label>Bạn đang nghĩ gì?</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Viết bài..."
                onClick={() => handleOpen("post")}
                readOnly
              />
            </Form.Group>
            <div className="d-flex gap-2 mt-3">
              <Button variant="outline-primary" onClick={() => handleOpen("post")}>
                Ảnh/Video
              </Button>

              {role === "ADMIN" && (
                <>
                  <Button variant="outline-info" onClick={() => handleOpen("survey")}>
                    Khảo sát
                  </Button>
                  <Button variant="outline-success" onClick={() => handleOpen("invitation")}>
                    Thư mời
                  </Button>
                </>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>

      {activeForm === "post" && <AddPost onClose={handleClose} onPostCreated={onPostCreated}/>}
      {activeForm === "survey" && <AddSurvey onClose={handleClose} onPostCreated={onPostCreated}/>}
      {activeForm === "invitation" && <AddInvitation onClose={handleClose} onPostCreated={onPostCreated}/>}
    </>
  );
}
