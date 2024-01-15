"use client"
import {} from '@/app/chats/'
import { accounts } from "@/app/chats/data";



export default function MailPage() {

  return (
    <>
      <Mail
        accounts={accounts}
        navCollapsedSize={5}
      />
    </>
  );
}
