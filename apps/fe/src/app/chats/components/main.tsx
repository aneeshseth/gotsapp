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
import { CSSProperties } from "react";
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
import { Mail } from "@/app/chats/data";
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
  mails: Mail[];
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}
import { useRouter } from "next/navigation";
import { useRecoilState, useRecoilValue } from "recoil";
import { sessionState, userAppState, userSessionState, userState } from "@/app/state/atoms";
import { Button } from "@/components/ui/button";


export function Mail({
  accounts,
  mails,
  defaultLayout = [265, 440, 655],
  defaultCollapsed = false,
  navCollapsedSize,
}: MailProps) {
  const { data: session } = useSession();
  console.log('MY SESSION')
  console.log(session?.user)
  const router = useRouter()
  const [sesh, setSesh] = useRecoilState(sessionState);
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
  const [chats, setChats] = React.useState([])
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
    const res = await axios.post("http://localhost:3004/chats", {
      email: currentSeshState.email
    })
    setChats(res.data.chats)
  }
  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1500)
    fetchUserData()
  }, [])
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [loading, setLoading] = React.useState(true)
  let [color, setColor] = React.useState("#ffffff");
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
        >
          <Tabs defaultValue="all">
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold mr-10">Inbox</h1>
              <TabsList className="ml-auto">
                <TabsTrigger
                  value="all"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  All mail
                </TabsTrigger>
                <TabsTrigger
                  value="unread"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Unread
                </TabsTrigger>
              </TabsList>
              <Button onClick={() => {
               console.log(chats)
              }} className="ml-5 h-8">Sign Out</Button>
            </div>
            <Separator />
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search" className="pl-8" />
                </div>
              </form>
            </div>
            <TabsContent value="all" className="m-0">
              <MailList items={mails} />
            </TabsContent>
            <TabsContent value="unread" className="m-0">
              <MailList items={mails.filter((item) => !item.read)} />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]}>
          <MailDisplay
            mail={mails.find((item) => item.id === mail.selected) || null}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
