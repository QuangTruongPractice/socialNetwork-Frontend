import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Apis, { endpoints } from "../configs/Apis";
import MySpinner from "./layout/MySpinner";
import { Container, ListGroup, Badge } from "react-bootstrap";
import { loadNotification } from "../configs/LoadData"

const NotificationPage = () => {
    const queryClient = useQueryClient();

    const { data: notifications, isLoading, isError } = useQuery({
        queryKey: ["notifications"],
        queryFn: loadNotification,
    });

    const mutationRead = useMutation({
        mutationFn: (id) => Apis.put(endpoints['mark-read'](id)),
        onSuccess: (data, variables) => {
            // Optimistically update or just invalidate
            queryClient.setQueryData(["notifications"], (oldData) =>
                oldData ? oldData.map(n => n.id === variables ? { ...n, isRead: true } : n) : oldData
            );
            // Also invalidate to be sure
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            // Invalidate badge count if it exists elsewhere
        },
        onError: (err) => {
            console.error("Lỗi khi đánh dấu đã đọc:", err);
        }
    });

    const formatDate = (arr) => {
        if (!Array.isArray(arr) || arr.length < 3) return "Không rõ ngày";
        const [year, month, day] = arr;
        return `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year}`;
    };

    if (isLoading) return <MySpinner />;
    if (isError) return <div className="text-center mt-5">Lỗi tải thông báo.</div>;

    return (
        <Container className="mt-4">
            <h2 className="mb-4">Thông báo</h2>
            {notifications.length === 0 ? (
                <p>Không có thông báo nào.</p>
            ) : (
                <ListGroup>
                    {notifications.map((noti) => {
                        const isRead = noti.isRead || noti.read;
                        return (
                            <ListGroup.Item
                                action
                                key={noti.id}
                                onClick={() => mutationRead.mutate(noti.id)}
                                variant={isRead ? "light" : "warning"}
                                className="d-flex justify-content-between align-items-start"
                            >
                                <div>
                                    <div>{noti.message}</div>
                                    <small className="text-muted">
                                        {formatDate(noti.createdAt)}
                                    </small>
                                </div>
                                {!isRead && <Badge bg="danger">Mới</Badge>}
                            </ListGroup.Item>
                        );
                    })}
                </ListGroup>
            )}
        </Container>
    );
};

export default NotificationPage;
