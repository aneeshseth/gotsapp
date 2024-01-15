"use client"
import {} from '@/app/chats/page'
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
