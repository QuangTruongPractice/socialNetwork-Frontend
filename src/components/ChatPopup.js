import { useState, useEffect, useRef } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { getChatHistory, uploadChatImage } from "../configs/LoadData";
import WebSocketService from "../configs/WebSocketService";
import { FaImage, FaPaperPlane, FaTimes } from "react-icons/fa";

const ChatPopup = ({ roomId, currentUser, targetUser, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [pendingImage, setPendingImage] = useState(null);
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);

  // Load History
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await getChatHistory(currentUser.id, targetUser.id);
        setMessages(Array.isArray(history) ? history : []);
      } catch (err) {
        console.error("Failed to load chat history", err);
      } finally {
        setLoadingHistory(false);
      }
    };
    loadHistory();
  }, [currentUser.id, targetUser.id]);

  // WebSocket Subscription
  useEffect(() => {
    WebSocketService.connect(() => {
      WebSocketService.subscribe(`/topic/chat/${roomId}`, (newMsg) => {
        setMessages((prev) => {
          // Avoid duplicates if sender also receives broadcast
          if (prev.find(m => m.id === newMsg.id && newMsg.id !== undefined)) return prev;
          return [...prev, newMsg];
        });
      });
    });
  }, [roomId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!content.trim() && !pendingImage) return;

    const chatMsg = {
      sender: { id: currentUser.id },
      recipient: { id: targetUser.id },
      content: content,
      image: pendingImage,
    };

    WebSocketService.sendMessage(`/app/chat/${roomId}`, chatMsg);
    setContent("");
    setPendingImage(null);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      try {
        const url = await uploadChatImage(file);
        setPendingImage(url); // Stage it instead of sending
      } catch (err) {
        alert("Lỗi tải ảnh lên");
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div
      className="chat-popup shadow-lg border rounded-3 bg-white"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "350px",
        zIndex: 1050,
        display: "flex",
        flexDirection: "column",
        maxHeight: "500px",
      }}
    >
      <div className="d-flex justify-content-between align-items-center bg-primary text-white p-3 rounded-top-3">
        <div className="d-flex align-items-center gap-2">
          <img
            src={targetUser.avatar || "/default-avatar.png"}
            alt="avatar"
            className="rounded-circle"
            style={{ width: "30px", height: "30px", objectFit: "cover" }}
          />
          <strong className="text-truncate" style={{ maxWidth: "200px" }}>
            {targetUser.firstName} {targetUser.lastName}
          </strong>
        </div>
        <Button size="sm" variant="outline-light" className="border-0" onClick={onClose}>
          <FaTimes />
        </Button>
      </div>

      <div
        ref={scrollRef}
        style={{
          height: "350px",
          overflowY: "auto",
          padding: "15px",
          backgroundColor: "#f8f9fa",
        }}
        className="custom-scrollbar"
      >
        {loadingHistory ? (
          <div className="text-center mt-5">
            <Spinner animation="border" size="sm" variant="primary" />
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.sender.id === currentUser.id;
            return (
              <div
                key={idx}
                className={`d-flex mb-3 ${isMe ? "justify-content-end" : "justify-content-start"}`}
              >
                {!isMe && (
                  <img
                    src={targetUser.avatar || "/default-avatar.png"}
                    alt="avatar"
                    className="rounded-circle me-2 align-self-end mb-1"
                    style={{ width: "24px", height: "24px", objectFit: "cover" }}
                  />
                )}
                <div
                  className={`p-2 rounded-3 shadow-sm ${isMe ? "bg-primary text-white" : "bg-white text-dark"}`}
                  style={{ maxWidth: "80%", wordBreak: "break-word" }}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="chat"
                      className="img-fluid rounded mb-2 d-block"
                      style={{ cursor: "pointer" }}
                      onClick={() => window.open(msg.image, "_blank")}
                    />
                  )}
                  {msg.content && <div style={{ fontSize: "0.95rem" }}>{msg.content}</div>}
                  <div
                    className={`text-muted mt-1 ${isMe ? "text-light" : ""}`}
                    style={{ fontSize: "0.7rem", opacity: 0.7 }}
                  >
                    {(() => {
                      try {
                        const t = msg.timestamp;
                        if (!t) return "";
                        let date;
                        if (Array.isArray(t)) {
                          // [year, month, day, hour, minute, second, nano]
                          date = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);
                        } else if (typeof t === 'string') {
                          date = new Date(t.replace(" ", "T"));
                        } else {
                          date = new Date(t);
                        }

                        if (isNaN(date.getTime())) return "Invalid Date";
                        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      } catch (e) {
                        return "Invalid Date";
                      }
                    })()}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="p-2 border-top bg-white rounded-bottom-3">
        {pendingImage && (
          <div className="position-relative mb-2 ms-2" style={{ width: "60px" }}>
            <img
              src={pendingImage}
              alt="preview"
              className="rounded border"
              style={{ width: "60px", height: "60px", objectFit: "cover" }}
            />
            <Button
              size="sm"
              variant="danger"
              className="position-absolute rounded-circle p-0"
              style={{
                top: "-8px",
                right: "-8px",
                width: "18px",
                height: "18px",
                fontSize: "10px",
              }}
              onClick={() => setPendingImage(null)}
            >
              <FaTimes />
            </Button>
          </div>
        )}
        <Form className="d-flex align-items-center gap-2">
          <input
            type="file"
            hidden
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageUpload}
          />
          <Button
            variant="light"
            className="text-primary p-0 d-flex align-items-center justify-content-center"
            style={{ width: "40px", height: "40px", borderRadius: "50%" }}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? <Spinner animation="border" size="sm" /> : <FaImage size={20} />}
          </Button>
          <Form.Control
            type="text"
            placeholder="Aa"
            className="border-0 bg-light rounded-pill px-3 py-2"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSend())}
            style={{ boxShadow: "none" }}
          />
          <Button
            variant="primary"
            className="p-0 d-flex align-items-center justify-content-center"
            style={{ width: "40px", height: "40px", borderRadius: "50%" }}
            onClick={() => handleSend()}
            disabled={!content.trim() && !uploading}
          >
            <FaPaperPlane size={16} />
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ChatPopup;
