import express from "express"
import cors from "cors"
import messagesRouter from "./src/routers/message.router.js"
import authRouter from "./src/routers/auth.router.js"

const app = express()
app.use(cors())
app.use(express.json())
app.use("/api/messages", messagesRouter)
app.use("/api/users",authRouter)

app.get("/", (req, res) => {
    res.send("Server is working");
});

export default app