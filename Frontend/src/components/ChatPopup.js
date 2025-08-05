import { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import db from "../configs/Firebase";
import { ref, push, onValue } from "firebase/database";

const ChatPopup = ({ roomId, currentUser, targetUser, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    const messagesRef = ref(db, `chats/${roomId}`);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const loadedMessages = data ? Object.values(data) : [];
      setMessages(loadedMessages);
    });
    return () => unsubscribe();
  }, [roomId]);

  const handleSend = () => {
    if (content.trim() === "") return;

    const msg = {
      senderId: currentUser.id,
      senderName: `${currentUser.firstName} ${currentUser.lastName}`,
      content,
      timestamp: new Date().toISOString(),
    };

    const messagesRef = ref(db, `chats/${roomId}`);
    push(messagesRef, msg);
    setContent("");
  };

  return (
    <div
      className="chat-popup shadow-lg border rounded bg-white p-2"
      style={{
        position: "fixed",
        bottom: "10px",
        right: "10px",
        width: "300px",
        zIndex: 1000,
      }}
    >
      <div className="d-flex justify-content-between align-items-center border-bottom pb-1 mb-2">
        <strong>
          {targetUser.firstName} {targetUser.lastName}
        </strong>
        <Button size="sm" variant="light" onClick={onClose}>
          ×
        </Button>
      </div>

      <div
        style={{
          height: "300px",
          overflowY: "auto",
          marginBottom: "10px",
          paddingRight: "5px",
          display: "flex",
          flexDirection: "column-reverse",
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-1 text-${
              msg.senderId === currentUser.id ? "end" : "start"
            }`}
          >
            <span className="badge bg-secondary">{msg.content}</span>
          </div>
        ))}
      </div>

      <Form.Control
        type="text"
        placeholder="Nhập tin nhắn..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
    </div>
  );
};

export default ChatPopup;
