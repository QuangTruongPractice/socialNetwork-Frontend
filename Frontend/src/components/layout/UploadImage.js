import { Form } from "react-bootstrap";

export default function UploadImage({ fileRef }) {
  return (
    <Form.Group className="mt-3">
      <Form.Label>Ảnh/Video</Form.Label>
      <Form.Control
        type="file"
        name="media"
        accept="image/*,video/*"
        ref={fileRef}
      />
    </Form.Group>
  );
}
