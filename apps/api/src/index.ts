import express from 'express'
const app = express()
const port = 3004;
import cors from 'cors'
import chatRouter from './routes/chat-routes'


import { createClient } from '@supabase/supabase-js'


const supabase = createClient('https://xyzcompany.supabase.co', 'public-anon-key')


app.use(express.json())
app.use(cors())
app.use("/", chatRouter)

app.listen(port, () => {
    console.log(`port running at ${port}`)
})




//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsc3Bob3N5b3RqZXRta2pjc25mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ1MTQ5MzUsImV4cCI6MjAyMDA5MDkzNX0.Pv0x6T00bUOqeFeK32_8yvWTQAw0zzSibAi7XO4V6_E

//SERVICE ROLE eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsc3Bob3N5b3RqZXRta2pjc25mIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNDUxNDkzNSwiZXhwIjoyMDIwMDkwOTM1fQ.rKqcBAG-NoJ-BfgH3CWVsFIMmWBL0iA3y9t96ViedZk