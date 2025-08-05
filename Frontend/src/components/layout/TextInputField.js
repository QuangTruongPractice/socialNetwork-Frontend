import { Form } from "react-bootstrap";

const TextInputField = ({ title, field, value, onChange }) => (
  <Form.Group className="mb-3" controlId={field}>
    <Form.Label>{title}</Form.Label>
    <Form.Control
      type="text"
      placeholder={title}
      value={value || ""}
      onChange={(e) => onChange(field, e.target.value)}
      required
    />
  </Form.Group>
);

export default TextInputField;
