import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function PostMiddle({ id, content, image }) {
  return (
    <Link to={`/post/${id}`} className="text-decoration-none text-dark">
      <Card.Text>{content}</Card.Text>
      {image && (
        <div className="text-center mt-3">
          <img
            src={image}
            alt="post"
            className="img-fluid rounded"
            style={{ maxHeight: "400px", objectFit: "contain" }}
          />
        </div>
      )}
    </Link>
  );
}
