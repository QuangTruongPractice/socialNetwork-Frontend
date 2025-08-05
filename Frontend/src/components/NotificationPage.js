import { useEffect, useState } from "react";
import Apis, { authApis, endpoints } from "../configs/Apis";
import MySpinner from "./layout/MySpinner";
import { Container, ListGroup, Badge } from "react-bootstrap";

const NotificationPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadNotifications = async () => {
        try {
            const response = await authApis().get(endpoints['notification']);
            setNotifications(response.data);
        } catch (error) {
            console.error("Error loading notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await Apis.put(endpoints['mark-read'](id));
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, isRead: true } : n)
            );
        } catch (err) {
            console.error("Lỗi khi đánh dấu đã đọc:", err);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const formatDate = (arr) => {
        if (!Array.isArray(arr) || arr.length < 3) return "Không rõ ngày";
        const [year, month, day] = arr;
        return `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year}`;
    };

    if (loading) return <MySpinner />;

    return (
        <Container className="mt-4">
            <h2 className="mb-4">Thông báo</h2>
            {notifications.length === 0 ? (
                <p>Không có thông báo nào.</p>
            ) : (
                <ListGroup>
                    {notifications.map((noti) => (
                        <ListGroup.Item
                            action
                            key={noti.id}
                            onClick={() => markAsRead(noti.id)}
                            variant={noti.read ? "light" : "warning"}
                            className="d-flex justify-content-between align-items-start"
                        >
                            <div>
                                <div>{noti.message}</div>
                                <small className="text-muted">
                                    {formatDate(noti.createdAt)}
                                </small>
                            </div>
                            {!noti.read && <Badge bg="danger">Mới</Badge>}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </Container>
    );
};

export default NotificationPage;
