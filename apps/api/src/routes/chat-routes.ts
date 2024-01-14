import express from 'express'
import { createNewChat, getChats, getMessages, getNewChatPossibilies } from '../controllers/chats-controllers'
const router = express.Router()


router.post("/chats", getChats)
router.post("/messages", getMessages)
router.post("/getnew", getNewChatPossibilies)
router.post('/createnew', createNewChat)

export default router;