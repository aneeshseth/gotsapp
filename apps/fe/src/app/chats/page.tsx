import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import Mail from "./chat-component";

const chatsPage = async () => {
  const session = await getServerSession(options);
  if (!session) {
    redirect("/");
  }
  console.log("session ", session);
  return (
    <div>
        <Mail email={session.user?.email || ""} image={session.user?.image || ""} name={session.user?.name || ""}/>
    </div>
  );
};

export default chatsPage;
