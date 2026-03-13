let socket = null;

export const connectSocket = (conversationId, onMessage) => {
  const token = localStorage.getItem("access");

  socket = new WebSocket(
    `ws://127.0.0.1:8000/ws/chat/${conversationId}/?token=${token}`
  );

  socket.onopen = () => {
    console.log("✅ WebSocket Connected");

    // ✅ نبلغ السيرفر إننا Online
    socket.send(JSON.stringify({ type: "presence", status: "online" }));
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (onMessage) onMessage(data);
  };

  socket.onclose = () => {
    console.log("❌ WebSocket Disconnected");
  };

  socket.onerror = (error) => {
    console.error("WebSocket Error:", error);
  };
};

export const sendSocketMessage = (data) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  }
};

export const disconnectSocket = () => {
  if (socket) {
    // ✅ نبلغ السيرفر إننا Offline
    socket.send(JSON.stringify({ type: "presence", status: "offline" }));
    socket.close();
  }
};