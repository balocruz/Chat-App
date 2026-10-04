import app from "./app.js";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import connectMongoDb from "./src/database/database.js";
import {createMessage} from "./src/Services/message.service.js";
import jwt from "jsonwebtoken";

dotenv.config({ path: "./.env" });

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});
const PORT = process.env.PORT;

io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error"));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (error) {
    return next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("join_conversation", async (conversationId) => {
      socket.join(conversationId);
      console.log("Joined conversation:", conversationId);
    });
    
  socket.on("send_message", async (data) => {
    try {
      const message = await createMessage({...data,sender: socket.user.id});
      console.log("Message saved: ", message);
      io.to(data.conversation).emit("message_received", message);
    } catch (err) {
      console.log("Error saving message:", err);
    }

    

    //io.emit("message_received",message)
  });
});

async function startServer() {
  try {
    await connectMongoDb();
    httpServer.on("error", (error) => {
      console.log("Error", error);
    });
    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Failed to start server:", error);
  }
}
startServer();
