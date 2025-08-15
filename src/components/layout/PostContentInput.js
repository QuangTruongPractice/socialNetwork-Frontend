import { Form } from "react-bootstrap";

export default function PostContentInput({ value, onChange }) {
  return (
    <Form.Group controlId="content">
      <Form.Label>Nội dung</Form.Label>
      <Form.Control
        name="content"
        as="textarea"
        rows={4}
        value={value}
        onChange={onChange}
      />
    </Form.Group>
  );
}
