import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Avatar from './Avatar';

const UserCard = ({ user }) => {
  return (
    <Link to={`/user-profile/${user.id}`} className="text-decoration-none text-dark">
      <Card className="h-100 shadow-sm">
        <Card.Body className="d-flex align-items-center">
          <Avatar src={user.avatar} size={60} className="me-2" />
          <div>
            <Card.Title className="mb-0">
              {user.firstName} {user.lastName}
            </Card.Title>
            <Card.Text className="text-muted">Mã: {user.userCode}</Card.Text>
          </div>
        </Card.Body>
      </Card>
    </Link>
  );
};

export default UserCard;
