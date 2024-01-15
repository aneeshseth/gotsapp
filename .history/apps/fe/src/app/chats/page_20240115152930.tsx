"use client";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CSSProperties, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import axios from 'axios'
const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};
import { useSession, signIn, signOut } from "next-auth/react";
import { AccountSwitcher } from "@/app/chats/components/account-switcher";
import { MailDisplay } from "@/app/chats/components/main-display";
import { MailList } from "@/app/chats/components/main-list";
import { Nav } from "@/app/chats/components/nav";
import { useMail } from "@/app/chats/use-mail";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://ilsphosyotjetmkjcsnf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsc3Bob3N5b3RqZXRta2pjc25mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ1MTQ5MzUsImV4cCI6MjAyMDA5MDkzNX0.Pv0x6T00bUOqeFeK32_8yvWTQAw0zzSibAi7XO4V6_E')

import './main-display.css'
import { useRouter } from "next/navigation";
import { useRecoilState, useRecoilValue } from "recoil";
import { sessionState, userAppState, userSessionState, userState } from "@/app/state/atoms";
import { Button } from "@/components/ui/button";
import { useWebSocket } from "@/app/provider";

export default function Mail() {
  const { data: session } = useSession();
  const router = useRouter()
  const setTags1 = new Map<String, String>();
  const setTags2 = new Map<String, String>();
  const [sesh, setSesh] = useRecoilState(sessionState);
  const webSocket: any = useWebSocket();
  const [tag1, setTag1] = useState<Map<String, String>>(new Map());
  const [tag2, setTag2] = useState<Map<String, String>>(new Map());
  const currentSeshState = useRecoilValue<any>(userSessionState)
  if (!session?.user) {
    router.push("/")
  } else {
    setSesh(session?.user!)
  }
  if (session?.user?.email == "invalid") {
    signOut()
  }
  const [user, setUser] = useRecoilState(userState);
  const currentUser = useRecoilValue<any>(userAppState);
  const [loading, setLoading] = React.useState(true)
  const [chats, setChats] = React.useState<any>([])
  const [newPossibleUsers, setNewPossibleUsers] = React.useState<any>([])
  async function fetchUserData() {
    const data: any = await axios.post('https://aneesh.pro/fetchuser', {
      email: session?.user?.email
    })
    let userData = data;
    if (data?.length == 0) {
      const data:any = await axios.post('https://aneesh.pro/add', {
        email: session?.user?.email,
        password: null,
        name: session?.user?.name
      })
      if (data) userData = data![0]
    }
    setUser(userData)
    console.log('current sesh email')
    console.log(currentSeshState.email)
    const res = await axios.post("https://aneesh.pro/chats", {
      email: session?.user?.email
    })
    console.log(res.data.chats)
    setLoading(false)
    setChats(res.data.chats)
    const users = await axios.post("https://aneesh.pro/getnew", {
      email: currentSeshState.email
    })
    
    console.log(users?.data)
    setNewPossibleUsers(users?.data.users)
    users?.data.users.map((user: any) =>  {
      setTags1.set(`${user.email}`, "")
      setTags2.set(`${user.email}`, "")
    })
    setTag1(setTags1)
    setTag2(setTags2)
  }

  async function createNewChat(email2: string, tag1: string, tag2: string) {
    if (tag1 == "" || tag2 == "") {
      alert('please add relevant tags.')
    } else {
      await axios.post("https://aneesh.pro/createnew", {
        email1: currentSeshState.email,
        email2: email2,
        tag1: tag1,
        tag2: tag2
      })
      setCreatingChat(false)
      //window.location.reload()
    }
  }

  React.useEffect(() => {


    fetchUserData()
    return () => {
      if (webSocket) {
        webSocket.send(
          JSON.stringify({
            type: "leaveAllRooms",
            payload: {
              userId: currentSeshState.email,
            },
          })
        );
      }
    }
  }, [])
  const [creatingChat, setCreatingChat] = React.useState(false)
  let [color, setColor] = React.useState("#ffffff");
  const [checkNew, setCheckNew] = React.useState<boolean>(false)
  const [mail] = useMail();


  return (
    <div className="fadeInUp-animation">
   <div>hello worfl</div>
    </div>
  );
}


