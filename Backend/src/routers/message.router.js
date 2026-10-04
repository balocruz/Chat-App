import {Router} from "express"
import {getMessages} from "../controllers/message.controller.js"
import {verifyUser} from "../middleware/auth.middleware.js"

const router = Router()
router.get(`/:conversationId`, verifyUser, getMessages)

export default router