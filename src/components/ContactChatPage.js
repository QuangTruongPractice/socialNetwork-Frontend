import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Container, Row, Col, ListGroup, Form, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { MyUserContext } from "../configs/Contexts";
import { getConversations, getChatHistory, getChatRoomId, uploadChatImage } from "../configs/LoadData";
import WebSocketService from "../configs/WebSocketService";
import Avatar from "./layout/Avatar";
import { FaImage, FaPaperPlane, FaUserCircle } from "react-icons/fa";

const ContactChatPage = () => {
    const [user] = useContext(MyUserContext);
    const [activeContact, setActiveContact] = useState(null);
    const [content, setContent] = useState("");
    const [uploading, setUploading] = useState(false);
    const [pendingImage, setPendingImage] = useState(null);

    const queryClient = useQueryClient();
    const scrollRef = useRef(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    // 1. Fetch Conversations
    const { data: conversations = [], isLoading: loadingConvos } = useQuery({
        queryKey: ["conversations"],
        queryFn: getConversations,
        onSuccess: (data) => {
            if (data.length > 0 && !activeContact) {
                setActiveContact(data[0].otherUser);
            }
        }
    });

    // 2. Fetch Room ID
    const { data: roomId } = useQuery({
        queryKey: ["roomId", user?.id, activeContact?.id],
        queryFn: () => getChatRoomId(user.id, activeContact.id),
        enabled: !!user && !!activeContact,
    });

    // 3. Fetch History (Initial Messages)
    const { data: historyMessages, isLoading: loadingHistory } = useQuery({
        queryKey: ["messages", roomId],
        queryFn: () => getChatHistory(user.id, activeContact.id),
        enabled: !!user && !!activeContact && !!roomId,
    });



    // Toggle active contact
    useEffect(() => {
        if (conversations.length > 0 && !activeContact) {
            setActiveContact(conversations[0].otherUser);
        }
    }, [conversations, activeContact]);

    // Update Sidebar Helper (updates Cache)
    const updateSidebar = useCallback((newMsg) => {
        queryClient.setQueryData(["conversations"], (prev) => {
            if (!prev) return prev;
            const senderId = newMsg.sender?.id || newMsg.sender;
            const recipientId = newMsg.recipient?.id || newMsg.recipient;
            const partnerId = (senderId === user.id) ? recipientId : senderId;

            const existingIdx = prev.findIndex(c => c.otherUser.id === partnerId);
            let updated = [...prev];

            if (existingIdx !== -1) {
                const item = { ...updated[existingIdx], lastMessage: newMsg };
                updated.splice(existingIdx, 1);
                updated.unshift(item);
            }
            return updated;
        });
    }, [user.id, queryClient]);

    // WebSocket Subscription
    useEffect(() => {
        if (!roomId) return;

        WebSocketService.connect(() => {
            WebSocketService.subscribe(`/topic/chat/${roomId}`, (newMsg) => {
                // Update messages cache
                queryClient.setQueryData(["messages", roomId], (old) => {
                    const prev = old || [];
                    if (prev.find(m => m.id === newMsg.id && newMsg.id !== undefined)) return prev;
                    return [...prev, newMsg];
                });
                updateSidebar(newMsg);
            });
        });

        return () => {

        };
    }, [roomId, updateSidebar, queryClient]);

    // Scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [historyMessages]);

    const handleSend = () => {
        if ((!content.trim() && !pendingImage) || !roomId) return;

        const chatMsg = {
            sender: { id: user.id },
            recipient: { id: activeContact.id },
            content: content,
            image: pendingImage,
            timestamp: new Date().toISOString() // Local timestamp for immediate sync UI
        };

        WebSocketService.sendMessage(`/app/chat/${roomId}`, chatMsg);
        updateSidebar(chatMsg); // Local update for snappiness
        setContent("");
        setPendingImage(null);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploading(true);
            try {
                const url = await uploadChatImage(file);
                setPendingImage(url);
            } catch (err) {
                alert("Lỗi tải ảnh");
            } finally {
                setUploading(false);
            }
        }
    };

    return (
        <Container className="py-2" style={{ height: "calc(100vh - 130px)", maxWidth: "1400px" }}>
            <Row className="h-100 g-0 shadow-lg rounded-4 bg-white overflow-hidden border">
                {/* Conversations Sidebar */}
                <Col md={4} lg={3} className="border-end d-flex flex-column bg-white h-100 overflow-hidden">
                    <div className="p-4 border-bottom bg-white d-flex flex-column flex-shrink-0">
                        <h4 className="mb-0 fw-bold text-primary">Liên hệ</h4>
                        <div className="mt-3">
                            <Form.Control
                                size="sm"
                                type="text"
                                placeholder="Tìm kiếm đoạn chat..."
                                className="bg-light border-0 rounded-pill px-3"
                                style={{ fontSize: "0.85rem" }}
                            />
                        </div>
                    </div>
                    <ListGroup variant="flush" className="overflow-auto flex-grow-1 custom-scrollbar">
                        {loadingConvos ? (
                            <div className="text-center p-5"><Spinner animation="border" variant="primary" size="sm" /></div>
                        ) : conversations.length === 0 ? (
                            <div className="text-center p-5 text-muted">
                                <div className="mb-2 opacity-25"><FaUserCircle size={40} /></div>
                                <small>Chưa có hội thoại nào</small>
                            </div>
                        ) : (
                            conversations.map((c) => (
                                <ListGroup.Item
                                    key={c.otherUser.id}
                                    action
                                    active={activeContact?.id === c.otherUser.id}
                                    onClick={() => setActiveContact(c.otherUser)}
                                    className="d-flex align-items-center border-0 px-4 py-3 transition-all hvr-light"
                                    style={{
                                        borderLeft: activeContact?.id === c.otherUser.id ? "4px solid #007bff" : "4px solid transparent",
                                        backgroundColor: activeContact?.id === c.otherUser.id ? "#f0f7ff" : "transparent"
                                    }}
                                >
                                    <Avatar src={c.otherUser.avatar} size={48} className="me-3 shadow-sm" />
                                    <div className="w-100 overflow-hidden">
                                        <div className={`fw-bold text-truncate ${activeContact?.id === c.otherUser.id ? "text-primary" : "text-dark"}`} style={{ fontSize: "0.95rem" }}>
                                            {c.otherUser.firstName} {c.otherUser.lastName}
                                        </div>
                                        <small className={`text-truncate d-block ${activeContact?.id === c.otherUser.id ? "text-primary opacity-75" : "text-muted"}`} style={{ fontSize: "0.8rem" }}>
                                            {c.lastMessage.image ? "📷 Ảnh mới" : (c.lastMessage.content || "...")}
                                        </small>
                                    </div>
                                </ListGroup.Item>
                            ))
                        )}
                    </ListGroup>
                </Col>

                {/* Chat Area */}
                <Col md={8} lg={9} id="chat-detail-area" className="p-0 d-flex flex-column bg-light h-100 overflow-hidden shadow-inner">
                    {activeContact ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-white shadow-sm flex-shrink-0" style={{ zIndex: 10 }}>
                                <div className="d-flex align-items-center ms-2">
                                    <div className="position-relative">
                                        <Avatar src={activeContact.avatar} size={42} className="me-3 border-2 border-primary p-0.5 shadow-sm" />
                                        <span className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle" style={{ width: "12px", height: "12px", marginRight: "12px", marginBottom: "2px" }}></span>
                                    </div>
                                    <div>
                                        <div className="fw-bold fs-5 text-dark lh-1">{activeContact.firstName} {activeContact.lastName}</div>
                                        <small className="text-success fw-medium" style={{ fontSize: "0.8rem" }}>Đang hoạt động</small>
                                    </div>
                                </div>
                                <div className="me-2">
                                    <Button
                                        variant="light"
                                        size="sm"
                                        className="rounded-pill px-3 border text-primary fw-medium hvr-grow"
                                        onClick={() => navigate(`/user-profile/${activeContact.id}`)}
                                    >
                                        <FaUserCircle className="me-1" /> Trang cá nhân
                                    </Button>
                                </div>
                            </div>

                            {/* Messages */}
                            <div
                                className="flex-grow-1 p-4 overflow-auto custom-scrollbar"
                                ref={scrollRef}
                                style={{ backgroundColor: "#f0f2f5", minHeight: 0 }}
                            >
                                {loadingHistory ? (
                                    <div className="h-100 d-flex align-items-center justify-content-center">
                                        <Spinner animation="grow" variant="primary" />
                                    </div>
                                ) : (
                                    historyMessages && historyMessages.map((m, idx) => {
                                        const isMe = m.sender.id === user.id;
                                        return (
                                            <div key={idx} className={`d-flex mb-3 ${isMe ? "justify-content-end" : "justify-content-start"}`}>
                                                {!isMe && <Avatar src={activeContact.avatar} size={28} className="me-2 align-self-end mb-1 shadow-sm border border-white" />}
                                                <div className={`shadow-sm ${isMe ? "bg-primary text-white" : "bg-white text-dark"}`}
                                                    style={{
                                                        maxWidth: "70%",
                                                        padding: "10px 16px",
                                                        borderRadius: isMe ? "18px 18px 2px 18px" : "18px 18px 18px 2px",
                                                        fontSize: "0.95rem"
                                                    }}>
                                                    {m.image && (
                                                        <img
                                                            src={m.image}
                                                            alt="chat"
                                                            className="img-fluid rounded-3 mb-2 d-block border"
                                                            style={{ cursor: "pointer", maxHeight: "350px", objectFit: "contain" }}
                                                            onClick={() => window.open(m.image, "_blank")}
                                                        />
                                                    )}
                                                    {m.content && <div className="lh-base">{m.content}</div>}
                                                    <div className={`mt-1 text-end ${isMe ? "text-white-50" : "text-muted"}`} style={{ fontSize: "0.65rem" }}>
                                                        {(() => {
                                                            try {
                                                                const t = m.timestamp;
                                                                if (!t) return "";
                                                                let date;
                                                                if (Array.isArray(t)) {
                                                                    date = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);
                                                                } else if (typeof t === 'string') {
                                                                    date = new Date(t.replace(" ", "T"));
                                                                } else {
                                                                    date = new Date(t);
                                                                }
                                                                return isNaN(date.getTime()) ? "" : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                                            } catch (e) { return ""; }
                                                        })()}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Message Input */}
                            <div className="p-3 border-top bg-white shadow-sm flex-shrink-0">
                                {pendingImage && (
                                    <div className="mb-3 ps-2">
                                        <div className="position-relative d-inline-block">
                                            <img src={pendingImage} alt="preview" className="rounded border shadow-sm" style={{ width: "100px", height: "100px", objectFit: "cover" }} />
                                            <Button variant="danger" size="sm" className="position-absolute top-0 end-0 translate-middle rounded-circle p-1 shadow-sm" style={{ fontSize: "10px", width: "22px", height: "22px" }} onClick={() => setPendingImage(null)}>✕</Button>
                                        </div>
                                    </div>
                                )}
                                <Form className="d-flex align-items-center gap-2" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                                    <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleImageUpload} />
                                    <Button variant="light" className="text-primary rounded-circle border hvr-grow" style={{ width: "42px", height: "42px" }} onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                                        {uploading ? <Spinner animation="border" size="sm" /> : <FaImage size={20} />}
                                    </Button>
                                    <Form.Control
                                        type="text"
                                        placeholder="Aa"
                                        className="border-0 bg-light rounded-pill px-4 py-2"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        style={{ boxShadow: "none", fontSize: "0.95rem" }}
                                    />
                                    <Button variant="primary" className="rounded-circle shadow-sm hvr-grow" style={{ width: "42px", height: "42px" }} onClick={handleSend} disabled={!content.trim() && !pendingImage}>
                                        <FaPaperPlane size={16} />
                                    </Button>
                                </Form>
                            </div>
                        </>
                    ) : (
                        <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted bg-white p-5">
                            <div className="bg-light rounded-circle p-4 mb-4 shadow-sm" style={{ width: "120px", height: "120px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <FaPaperPlane size={50} className="text-primary opacity-25" />
                            </div>
                            <h4 className="fw-bold text-dark mb-2">Chào mừng bạn!</h4>
                            <p className="text-center px-4" style={{ maxWidth: "300px" }}>Hãy chọn một người bạn để bắt đầu cuộc trò chuyện thú vị ngay lúc này.</p>
                            <Button variant="outline-primary" className="mt-3 rounded-pill px-4 shadow-sm fw-medium hvr-grow">Bắt đầu tìm kiếm</Button>
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default ContactChatPage;
