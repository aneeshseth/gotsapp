"use client"
import './main-display.css'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { userSessionState } from "@/app/state/atoms";
import { useRecoilValue } from "recoil";
import { useWebSocket } from "@/app/provider";

export function MailDisplay({ mail }: any) {
  const today = new Date();
  const [currMail, setCurrMail] = useState<any>([])
  const [message, setMessage] = useState<string>("")
  const currentSeshState = useRecoilValue<any>(userSessionState)
  const messagesContainerRef = useRef<any>();

  const webSocket: any = useWebSocket();

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      sendMessage(e);
    }
  };

  async function sendMessage(event: any) {
    event.preventDefault()
    setMessage("")
    console.log(currMail)   
    if (mail) {
      console.log("hey man")
      console.log(mail)
      webSocket.send(
        JSON.stringify({
          type: "message",
          payload: {
            roomId: `${mail.chat_id.id}`,
            senderId: mail.user_id,
            message: message,
            type: "text"
          },
        })
      );
    }
  }
  
  async function fetchMessages() {
    if (mail) {
      const res = await axios.post("http://ec2-35-180-47-148.eu-west-3.compute.amazonaws.com:3004/messages", {
        id: mail.chat_id.id
      })
      const data = await res.data;
      setCurrMail(data.messages);
    }
  }
  useEffect(() => {
    fetchMessages()
    if (mail) {
      console.log("hELLOOO")
      console.log(mail)
      webSocket.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: `${mail.chat_id.id}`,
            userId: mail.user_id,
          },
        })
      );
    }
    return () => {
      console.log("UNMOUNTING")
      if (mail) {
        webSocket.send(
          JSON.stringify({
            type: "leave",
            payload: {
              roomId: `${mail.chat_id.id}`,
              userId: mail.user_id,
            },
          })
        );
      }
    }
  }, [mail])

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [currMail])

  useEffect(() => {
    console.log("HELLOOOO FROM WB");
    console.log(webSocket);
    if (webSocket) {
      console.log("iM HERE");
      webSocket.onmessage = function (event: any) {
      console.log("EVENT2");
      console.log(JSON.parse(event.data))
       const data = JSON.parse(event.data);
       setCurrMail((prevCurrMail: any) => [
        ...prevCurrMail,
        { sender_id: data.senderId, content: data.message },
      ]);      
      };
    }
  }, [])

  return (
    <div className="flex flex-col" style={{height: "100vh"}}>
     {mail ? (
        <div className="flex flex-1 flex-col">
          <div className="flex items-start p-4">
            <div className="flex items-start gap-4 text-sm">
              <Avatar>
                <AvatarImage />
                <AvatarFallback>
                    <img src={mail.chat_id && mail.user_id === mail.chat_id.user1.email ? mail.chat_id.user2.image : mail.chat_id.user1.image}/>
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-semibold">{mail.chat_id && mail.user_id === mail.chat_id.user1.email ? mail.chat_id.user2.name : mail.chat_id.user1.name}</div>
                <div className="line-clamp-1 text-xs">
                  <span className="font-medium">Reply-To:</span> {mail.chat_id && mail.user_id === mail.chat_id.user1.email ? mail.chat_id.user2.email : mail.chat_id.user1.email}
                </div>
              </div>
            </div>
            {mail.date && (
              <div className="ml-auto text-xs text-muted-foreground"></div>
            )}
          </div>
          <Separator />
          <div className="flex-grow p-4 overflow-y-auto mt-8 mr-2 ml-2" style={{maxHeight: "520px"}} ref={messagesContainerRef}>
          {currMail && currMail.map((mail: any, index: any) => (
            <>
            <div
              className={mail?.sender_id === currentSeshState.email ? "flex justify-end mb-3 font-mono text-sm text-white" : "flex justify-start mb-3 font-mono text-sm text-black"}
            >
            <div className={mail?.sender_id === currentSeshState.email ? "bg-gray-800 p-2 rounded-lg text-white" : "p-2 bg-indigo-700 rounded-lg text-white"}>
              {mail.content}
            </div>
          </div>
          </>
          ))}
    </div>
          <Separator className="mt-auto" />
          <div className="p-4">
            <form>
              <div className="flex flex-row justify-center items-center">
                <Textarea
                  className="p-4"
                  placeholder={`Reply to ${mail.user_id === mail.chat_id.user1.email ? mail.chat_id.user2.name.split(" ")[0] : mail.chat_id.user1.name.split(" ")[0]}...`} value={message} onChange={(e) => {
                    setMessage(e.target.value) 
                  }} onKeyDown={handleKeyDown}
                />
                  <Button size="sm" className="ml-9" onClick={sendMessage}>
                    Send
                  </Button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="bg-black min-h-screen flex flex-col items-center justify-center text-white">
      <div className="flex items-center justify-center mb-8">
        <SmartphoneIcon className="text-green-500 h-12 w-12" />
        <CheckCircleIcon className="text-pink-500 h-12 w-12 ml-4" />
      </div>
      <h1 className="text-3xl font-bold mb-4 main-text">Gotsapp Web</h1>
      <p className="text-center mb-2 sub-text-1">A Scalable Send and Receive message infrastructure.</p>
    </div>
      )}
    </div>
  );
}

function CheckCircleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}


function SmartphoneIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  )
  }




