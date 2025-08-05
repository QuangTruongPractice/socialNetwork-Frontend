import { Form } from "react-bootstrap";

const SelectInputField = ({ title, field, value, options, onChange }) => (
  <Form.Group className="mb-3" controlId={field}>
    <Form.Label>{title}</Form.Label>
    <Form.Select
      value={value || ""}
      onChange={(e) => onChange(field, e.target.value)}
      required
    >
      <option value="">-- Chọn --</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </Form.Select>
  </Form.Group>
);

export default SelectInputField;
