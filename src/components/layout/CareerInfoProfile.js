import { Card, Col, Row } from "react-bootstrap";

const CareerInfoProfile = ({ profile, role }) => {
  return (
    <Row>
      <Col md={12}>
        <Card>
          <Card.Header>
            <h5 className="mb-0">Thông tin sự nghiệp</h5>
          </Card.Header>
          <Card.Body>
            {role === "ALUMNI" && (
              <Row>
                <Col md={6}>
                  <p><strong>Công việc hiện tại:</strong> {profile.currentJob}</p>
                  <p><strong>Mô tả:</strong> {profile.description}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Công ty:</strong> {profile.company}</p>
                </Col>
              </Row>
            )}
            {["LECTURER", "ADMIN"].includes(role) && (
              <Row>
                <Col md={6}>
                  <p><strong>Chức vụ:</strong> {profile.position}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Mô tả:</strong> {profile.description}</p>
                </Col>
              </Row>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default CareerInfoProfile;
