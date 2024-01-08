import {Request, Response} from 'express'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://ilsphosyotjetmkjcsnf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsc3Bob3N5b3RqZXRta2pjc25mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ1MTQ5MzUsImV4cCI6MjAyMDA5MDkzNX0.Pv0x6T00bUOqeFeK32_8yvWTQAw0zzSibAi7XO4V6_E')

export async function getChats(req: Request, res: Response) {
    const {email} = req.body;
    console.log('email')
    console.log(email)
    const {data} = await supabase.from("USERS_CHATS").select(`id, user_id, chat_id (id ,updated_at, user1 (name, email, image), user2 (name, email, image), m_r_m, latest_message_status)`).eq("user_id", email)
    console.log("darta")
    console.log(data)
    return res.status(200).json({
        chats: data
    })
}

export async function getMessages(req: Request, res: Response) {
    const {id} = req.body;
    const {data} = await supabase.from("MESSAGES").select().eq("chat_id", id);  
    const sortedData = data!.sort(GetSortOrder("created_at"))
    return res.status(200).json({
        messages: sortedData
    })
}

export async function getNewChatPossibilies(req: Request, res: Response) {
    const {email} = req.body;
    const {data} = await supabase.from("USERS").select()
    let finalArr: any[] = []
    const checkPushes = data?.map(async (user) => {
        const data1 = await supabase.from("CHATS").select().eq("user1", email).eq("user2", user.email);
        const data2 = await supabase.from("CHATS").select().eq("user1", user.email).eq("user2", email);
        if (data1.data?.length == 0 && data2.data?.length == 0 && email != user.email) {
            finalArr.push(user)
        }
    })
    await Promise.all(checkPushes!)
    return res.status(200).json({
        users: finalArr
    })
}


export async function createNewChat(req: Request, res: Response) {
    const {email1, email2} = req.body;
    const { data } = await supabase
    .from('CHATS')
    .insert({ user1: email1, user2: email2, m_r_m: "", latest_message_status: "read" })
    .select()
    return res.status(200).json({
        createdChat: data
    })
}


function GetSortOrder(prop: any) {    
    return function(a: any, b: any) {    
        if (a[prop] > b[prop]) {    
            return 1;    
        } else if (a[prop] < b[prop]) {    
            return -1;    
        }    
        return 0;    
    }    
}  