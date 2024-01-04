"use client";
import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Login() {
  const { data: session } = useSession();
  console.log(session?.user);
  if (session) {
    return (
      <div style={{ fontFamily: "sans-serif", margin: "10px 20px" }}>
        <p>Welcome, {session.user?.name}, youre logged in!</p>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  } else {
    return (
      <div>
        <p>Please sign in</p>
        <button onClick={() => signIn("github", { callbackUrl: "/chats" })}>
          Sign in with Github
        </button>
        <button
          onClick={() =>
            signIn("credentials", {
              username: "ali",
              password: "ali123",
              callbackUrl: "/chats",
            })
          }
        >
          Sign in with creds
        </button>
      </div>
    );
  }
}
