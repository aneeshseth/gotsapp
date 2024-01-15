"use client"
import { Mail } from "@/app/chats/components/main";
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
