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
  const [sesh, setSesh] = useRecoilState(sessionState);


  if (!session?.user) {
    setSesh({})
  } else {
    setSesh(session?.user!)
  }
  if (session?.user?.email == "invalid") {
    signOut()
  }

  return (
    <div className="fadeInUp-animation">
   <div>hello worfl</div>
    </div>
  );
}


