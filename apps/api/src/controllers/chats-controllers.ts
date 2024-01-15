import {Request, Response} from 'express'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.CLIENT_URL!, process.env.CLIENT_SECRET!)

export async function getChats(req: Request, res: Response) {
    const {email} = req.body;
    console.log('chats email get')
    console.log(email)
    console.log('before supabase')
    const {data} = await supabase.from("USERS_CHATS").select(`id, user_id, chat_id (id ,updated_at, user1 (name, email, image), user2 (name, email, image), m_r_m, latest_message_status, tag1, tag2, latest_message_user)`).eq("user_id", email)
    console.log('after supabase')
    const sortedData = data!.sort(GetSortOrderForChats("updated_at"))
    console.log('sorted data')
    console.log(sortedData)
    return res.status(200).json({
        chats: sortedData
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
    console.log('after new chat possibilities')
    return res.status(200).json({
        users: finalArr
    })
}


export async function createNewChat(req: Request, res: Response) {
    const {email1, email2, tag1, tag2} = req.body;
    const { data } = await supabase
    .from('CHATS')
    .insert({ user1: email1, user2: email2, m_r_m: "", latest_message_status: "read", tag1: tag1, tag2: tag2 })
    .select()
    await supabase.from('USERS_CHATS').insert({user_id: email1, chat_id: data![0].id})
    await supabase.from('USERS_CHATS').insert({user_id: email2, chat_id: data![0].id})
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


function GetSortOrderForChats(prop: any) {    
    return function(a: any, b: any) {
        const aUpdatedAt = a.chat_id[prop];
        const bUpdatedAt = b.chat_id[prop];
        
        if (aUpdatedAt > bUpdatedAt) {    
            return -1;    
        } else if (aUpdatedAt < bUpdatedAt) {    
            return 1;    
        }    
        return 0;    
    }    
}


async function authorizeUser(req: Request, res: Response) {
    const {email} = req.body;
    const {data} = await supabase.from("USERS").select().eq("email", email)
    return res.status(200).send({data}.data![0])
}

export async function addUser(req: Request, res: Response) {
    const {email, password, name} = req.body;
    const {data, error} = await supabase
          .from('USERS')
          .insert({ email: email, password: password, name : name, image: "https://img.analisa.io/tiktok/profile/7031003225021875205.png"}).select()
    return res.status(200).send(data![0])
}

export async function updateChatStatus(req: Request, res: Response) {
    const {id} = req.body;
    await supabase.from('CHATS').update({ latest_message_status: "read"}).eq("id", id)
    return res.sendStatus(200)
}


export async function fetchUser(req: Request, res: Response) {
    const {email} = req.body;
    const {data} = await supabase.from("USERS").select().eq("email", email)
    return res.status(200).send({data}.data![0])
}