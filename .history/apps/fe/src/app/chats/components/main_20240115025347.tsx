"use client";
import * as React from "react";
import {
  AlertCircle,
  Archive,
  ArchiveX,
  File,
  Inbox,
  MessagesSquare,
  PenBox,
  Search,
  Send,
  ShoppingCart,
  Trash2,
  Users2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CSSProperties, useEffect, useState } from "react";
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

interface MailProps {
  accounts: {
    label: string;
    email: string;
    icon: React.ReactNode;
  }[];
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}
import './main-display.css'
import { useRouter } from "next/navigation";
import { useRecoilState, useRecoilValue } from "recoil";
import { sessionState, userAppState, userSessionState, userState } from "@/app/state/atoms";
import { Button } from "@/components/ui/button";
import { useWebSocket } from "@/app/provider";

export function Mail({
  accounts,
  defaultLayout = [265, 440, 655],
  defaultCollapsed = false,
  navCollapsedSize,
}: MailProps) {
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
    const {data} = await supabase.from("USERS").select().eq("email", session?.user?.email)
    let userData = {data}.data![0];
    if (data?.length == 0) {
      const { data ,error } = await supabase
      .from('USERS')
      .insert({ email: session?.user?.email, password: null, name : session?.user?.name, image: "https://img.analisa.io/tiktok/profile/7031003225021875205.png"}).select()
      if (data) userData = data![0]
    }
    setUser(userData)
    const res = await axios.post("ec2-35-180-47-148.eu-west-3.compute.amazonaws.com:3004/chats", {
      email: currentSeshState.email
    })
    console.log(res.data.chats)
    setLoading(false)
    setChats(res.data.chats)
    const users = await axios.post("ec2-35-180-47-148.eu-west-3.compute.amazonaws.com:3004/getnew", {
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
      await axios.post("http://localhost:3004/createnew", {
        email1: currentSeshState.email,
        email2: email2,
        tag1: tag1,
        tag2: tag2
      })
      setCreatingChat(false)
      window.location.reload()
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
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [creatingChat, setCreatingChat] = React.useState(false)
  let [color, setColor] = React.useState("#ffffff");
  const [checkNew, setCheckNew] = React.useState<boolean>(false)
  const [mail] = useMail();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <ClipLoader
        color={color}
        loading={loading}
        cssOverride={override}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
    )
  }

  return (
    <div className="fadeInUp-animation">
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`;
        }}
        className="h-full max-h-[750px] items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[1]}
          minSize={20}
          maxSize={40}
          className="left-panel"
        >
          <Tabs defaultValue="all">
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold mr-10">Inbox</h1>
               <TabsList className="ml-auto mr-3">
                <TabsTrigger
                  value="all"
                  className="text-zinc-600 dark:text-zinc-200"
                  onClick={() => {
                    console.log(currentUser)
                   webSocket.send(
                    JSON.stringify({
                      type: "leaveAllRooms",
                      payload: {
                        userId: currentSeshState.email,
                      },
                    })
                  );
                  signOut()
                  }}
                >
                  Sign Out
                </TabsTrigger>
              </TabsList>
               <Dialog>
                <TabsList className="">
                <TabsTrigger
                  value="all"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  <DialogTrigger>New Chat (+)</DialogTrigger>
                </TabsTrigger>
              </TabsList>
                <DialogContent style={{width: "1000px"}}>
                  <DialogHeader>
                    <DialogTitle>Users available for chatting?</DialogTitle>
                    {newPossibleUsers && newPossibleUsers.map((user: any) => (
                      <DialogDescription key={user.email}>
                        {creatingChat === false ? (
                          <div className="flex items-center mt-4">
                                            <Input
                          placeholder="Tag 1"
                          className="mr-2"
                          value={tag1?.get(`${user.email}`)?.toString()}
                          onChange={(e) => {
                            setTag1((prevTag1) => {
                              const newTag1 = new Map(prevTag1);
                              newTag1.set(`${user.email}`, e.target.value);
                              return newTag1;
                            });
                          }}
                        />
                        <Input
                          placeholder="Tag 2"
                          className="mr-2"
                          value={tag2?.get(`${user.email}`)?.toString()}
                          onChange={(e) => {
                            setTag2((prevTag2) => {
                              const newTag2 = new Map(prevTag2);
                              newTag2.set(`${user.email}`, e.target.value);
                              return newTag2;
                            });
                          }}
                        />
                          <Button className="mr-8 bg-black text-white" onClick={() => {
                            setCreatingChat(true)
                           createNewChat(user.email, tag1?.get(`${user.email}`)?.toString() || "", tag2?.get(`${user.email}`)?.toString() || "");
                          }}>{user.email}</Button>
                          </div>
                        ) : (
                          <Button className="mt-4 bg-emerald-700" disabled>{user.email}</Button>
                        )}
                      </DialogDescription>
                    ))}
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
            <Separator />
            <TabsContent value="all" className="mt-5">
              <MailList items={chats} />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]}>
          <MailDisplay
            mail={chats.find((item: any) => item.chat_id.id === mail.selected) || null}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
    </div>
  );
}


