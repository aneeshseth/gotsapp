"use client"
import { ComponentProps, useEffect, useState } from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useMail } from "@/app/chats/use-mail";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useWebSocket } from "@/app/provider";
import { userSessionState } from "@/app/state/atoms";
import { useRecoilValue } from "recoil";
import { createClient } from '@supabase/supabase-js'
import axios from "axios";


interface MailListProps {
  items: any;
}

export function MailList({ items }: MailListProps) {
  const [mail, setMail] = useMail();
  const currentSeshState = useRecoilValue<any>(userSessionState)
  const [itemStates, setItemStates] = useState<Map<String, String>>();
  async function updateItemsSeenStatus() {
    const arr = new Map<String, String>();
    const update = items.map((item: any, index: any) => {
      console.log("ITEM MESSAGE")
      console.log(item)
      if (item.chat_id.latest_message_user != currentSeshState.email && item.chat_id.latest_message_status === 'unread') {
        arr.set(`${index}`, "0")
      } else {
        arr.set(`${index}`, "1")
      }
    })
    await Promise.all(update)
    setItemStates(arr)
  }

  useEffect(() => {
    updateItemsSeenStatus()
  }, [items])

    return (
      <ScrollArea className="h-screen">
        <div className="flex flex-col gap-2 p-4 pt-0">
          {items.map((item: any, index: any) => (
            <>
            <button
              key={item.chat_id.id}
              className={cn(
                "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                mail.selected === item.chat_id.id && "bg-muted"
              )}
              onClick={async () => {
                console.log('selecting item')
                itemStates?.set(`${index}`, "1")
                await axios.post('https://aneesh.pro/update', {
                  id: item.chat_id.id
                })
                setMail({
                  ...mail,
                  selected: item.chat_id.id,
                })
              }}
            >
              <div className="flex w-full flex-row gap-1">
                <div className="mr-3">
              <Avatar>
                  <AvatarImage />
                  <AvatarFallback>
                      <img src={item.user_id === item.chat_id.user1.email ? item.chat_id.user2.image : item.chat_id.user1.image}/>
                  </AvatarFallback>
                </Avatar>
                </div>
              <div className="flex w-full flex-col gap-1 border-solid h-full">
                
                <div className="flex items-center">
                  
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">{item.user_id === item.chat_id.user1.email ? item.chat_id.user2.name : item.chat_id.user1.name}</div>
                    {itemStates?.get(`${index}`) == "0" && (
                      <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "ml-auto text-xs",
                      mail.selected === item.chat_id.id
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  ></div>
                </div>
                <div className="line-clamp-2 text-xs text-muted-foreground ">
                {item.chat_id.m_r_m.substring(0, 305)}
                {item.chat_id ? (
              <div className="flex items-center gap-2 mt-3">
                 <Badge key={item.chat_id.tag1} variant={getBadgeVariantFromLabel(item.chat_id.tag1)} className="">
                    {item.chat_id.tag1}
                  </Badge>
                  <Badge key={item.chat_id.tag2} variant={getBadgeVariantFromLabel(item.chat_id.tag2)}>
                    {item.chat_id.tag2}
                  </Badge>
              </div>
            ) : null}
              </div>
              </div>
              </div>
            </button>
            </>
          ))}
        </div>
      </ScrollArea>
    );
  }


function getBadgeVariantFromLabel(
  label: string
): ComponentProps<typeof Badge>["variant"] {
  if (["love"].includes(label.toLowerCase())) {
    return "default";
  }

  if (["sibling"].includes(label.toLowerCase())) {
    return "outline";
  }

  return "destructive";
}


