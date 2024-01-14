import { cookies } from "next/headers";
import Image from "next/image";

import { Mail } from "@/app/chats/components/main";
import { accounts } from "@/app/chats/data";
import { redirect } from "next/navigation";


export default function MailPage() {
  const layout = cookies().get("react-resizable-panels:layout");
  const collapsed = cookies().get("react-resizable-panels:collapsed");

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
  //const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined;
  return (
    <>
      <Mail
        accounts={accounts}
        defaultLayout={defaultLayout}
       // defaultCollapsed={defaultCollapsed}
        navCollapsedSize={5}
      />
    </>
  );
}