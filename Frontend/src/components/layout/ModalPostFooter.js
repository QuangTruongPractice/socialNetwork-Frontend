import { Button, Modal } from "react-bootstrap";
import MySpinner from "./MySpinner";

export default function PostFooter({ onClose, loading}) {
  return (
    <Modal.Footer>
      <Button variant="secondary" onClick={onClose}>
        Hủy
      </Button>
      <Button type="submit" variant="primary" disabled={loading}>
        {loading ? <MySpinner /> : "Đăng"}
      </Button>
    </Modal.Footer>
  );
}
