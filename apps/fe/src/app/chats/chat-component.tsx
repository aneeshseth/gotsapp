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
import './main-display.css'
import { useRouter } from "next/navigation";
import { useRecoilState, useRecoilValue } from "recoil";
import { sessionState, userAppState, userSessionState, userState } from "@/app/state/atoms";
import { Button } from "@/components/ui/button";
import { useWebSocket } from "@/app/provider";
import { redirect } from 'next/navigation';
import { signOut } from "next-auth/react";
interface MailProps {
  email: string,
  image: string,
  name: string
}
export default function Mail({email, image, name}: MailProps) {

  const router = useRouter()
  const setTags1 = new Map<String, String>();
  const setTags2 = new Map<String, String>();
  const [sesh, setSesh] = useRecoilState(sessionState);
  const webSocket: any = useWebSocket();
  const [tag1, setTag1] = useState<Map<String, String>>(new Map());
  const [tag2, setTag2] = useState<Map<String, String>>(new Map());
  const [creatingChat, setCreatingChat] = React.useState(false)
  const [checkNew, setCheckNew] = React.useState<boolean>(false)
  const [mail] = useMail();
  const [user, setUser] = useRecoilState(userState);
  const currentUser = useRecoilValue<any>(userAppState);
  const [chats, setChats] = React.useState<any>([])
  const [newPossibleUsers, setNewPossibleUsers] = React.useState<any>([])
  let [color, setColor] = React.useState("#ffffff");
  const currentSeshState = useRecoilValue<any>(userSessionState)
  const [loading, setLoading] = React.useState(true)
  async function fetchUserData() {
    const data: any = await axios.post('https://aneesh.pro/fetchuser', {
      email: email
    })
    let userData = data;
    if (data?.length == 0) {
      const data:any = await axios.post('https://aneesh.pro/add', {
        email: email,
        password: null,
        name: name
      })
      if (data) userData = data![0]
    }
    setUser(userData)
    console.log('current sesh email')
    console.log(email)
    const res = await axios.post("https://aneesh.pro/chats", {
      email: email
    })
    console.log(res.data.chats)
    setLoading(false)
    setChats(res.data.chats)
    const users = await axios.post("https://aneesh.pro/getnew", {
      email: email
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
        email1: email,
        email2: email2,
        tag1: tag1,
        tag2: tag2
      })
      setCreatingChat(false)
      window.location.reload()
    }
  }

    React.useEffect(() => {
      setSesh({email: email, image: image, name: name})
      fetchUserData()
      return () => {
        if (webSocket) {
          webSocket.send(
            JSON.stringify({
              type: "leaveAllRooms",
              payload: {
                userId: email,
              },
            })
          );
        }
      }
    }, [])

  
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
            defaultSize={[265, 440, 655][1]}
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
                          userId: email,
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
          <ResizablePanel defaultSize={[265, 440, 655][2]}>
            <MailDisplay
              mail={chats.find((item: any) => item.chat_id.id === mail.selected) || null}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </TooltipProvider>
      </div>
    );
  }