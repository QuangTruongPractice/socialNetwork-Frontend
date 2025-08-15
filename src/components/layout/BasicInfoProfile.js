import { Card, Col, Row } from "react-bootstrap";

const BasicInfoProfile = ({ user, profile, role }) => {
  const formatDate = (dateArr) => {
    if (!dateArr || dateArr.length < 3) return "";
    return `${dateArr[2]}/${dateArr[1]}/${dateArr[0]}`;
  };

  return (
    <Row>
      <Col md={6}>
        <Card className="h-100">
          <Card.Header>
            <h5 className="mb-0">Thông tin cá nhân</h5>
          </Card.Header>
          <Card.Body>
            <p><strong>Họ tên:</strong> {user.firstName} {user.lastName}</p>
            {user.userCode && <p><strong>Mã số:</strong> {user.userCode}</p>}
            <p><strong>Điện thoại:</strong> {user.phone}</p>
            {user.gender && <p><strong>Giới tính:</strong> {user.gender}</p>}
            {user.dob && <p><strong>Ngày sinh:</strong> {formatDate(user.dob)}</p>}
            <p><strong>Ngày tạo:</strong> {formatDate(profile.createdAt)}</p>
          </Card.Body>
        </Card>
      </Col>

      <Col md={6}>
        <Card className="h-100">
          <Card.Header>
            <h5 className="mb-0">Thông tin học tập</h5>
          </Card.Header>
          <Card.Body>
            {role === "ALUMNI" && (
              <>
                <p><strong>Năm tốt nghiệp:</strong> {profile.graduationYear}</p>
                <p><strong>Chuyên ngành:</strong> {profile.major}</p>
                <p><strong>Khoa:</strong> {profile.faculty}</p>
              </>
            )}
            {role === "LECTURER" && (
              <>
                <p><strong>Khoa:</strong> {profile.faculty}</p>
                <p><strong>Chuyên môn:</strong> {profile.specialization}</p>
                <p><strong>Học vị:</strong> {profile.degree}</p>
              </>
            )}
            {role === "ADMIN" && (
              <p className="text-muted">Không có thông tin học tập</p>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default BasicInfoProfile;
