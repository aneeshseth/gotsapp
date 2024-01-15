import express from 'express'
import { addUser, createNewChat, fetchUser, getChats, getMessages, getNewChatPossibilies, updateChatStatus } from '../controllers/chats-controllers'
const router = express.Router()


router.post("/chats", getChats)
router.post("/messages", getMessages)
router.post("/getnew", getNewChatPossibilies)
router.post('/createnew', createNewChat)
router.post('/add', addUser)
router.post('/update', updateChatStatus)
router.post('/fetchuser', fetchUser)

export default router;