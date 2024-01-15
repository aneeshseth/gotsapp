
import Image from "next/image";

import { Mail } from "@/app/chats/components/main";
import { accounts } from "@/app/chats/data";



export default function MailPage() {


  //const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
  //const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined;
  return (
    <>
      <Mail
        accounts={accounts}
      //  defaultLayout={defaultLayout}
       // defaultCollapsed={defaultCollapsed}
        navCollapsedSize={5}
      />
    </>
  );
}
