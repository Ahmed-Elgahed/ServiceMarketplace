let socket = null;

export const connectSocket = (conversationId, onMessage) => {
  const token = localStorage.getItem("access");

  if (!conversationId || !token) return;

  // ✅ ديناميك حسب البروتوكول
  const protocol =
    window.location.protocol === "https:" ? "wss" : "ws";

  const host = window.location.host;

  socket = new WebSocket(
    `${protocol}://${host}/ws/chat/${conversationId}/?token=${token}`
  );

  socket.onopen = () => {
    console.log("✅ WebSocket Connected");

    socket.send(
      JSON.stringify({
        type: "presence",
        status: "online",
      })
    );
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (onMessage) onMessage(data);
    } catch (err) {
      console.error("Invalid WS message:", err);
    }
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
    try {
      socket.send(
        JSON.stringify({
          type: "presence",
          status: "offline",
        })
      );
    } catch (err) {
      console.error("Error sending offline status:", err);
    }

    socket.close();
    socket = null;
  }
};