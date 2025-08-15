import { Form } from "react-bootstrap";

const TextInputField = ({ type = "text", title, field, value, onChange }) => (
  <Form.Group className="mb-3" controlId={field}>
    <Form.Label>{title}</Form.Label>
    <Form.Control
      type={type}
      placeholder={title}
      value={value || ""}
      onChange={onChange}
      required
    />
  </Form.Group>
);

export default TextInputField;
