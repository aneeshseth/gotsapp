"use client";
import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Login() {
  const { data: session } = useSession();

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
        <button onClick={() => signIn("github", { callbackUrl: "/about" })}>
          Sign in with Github
        </button>
      </div>
    );
  }
}
