"use client";

import * as React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useWebSocket } from "@/app/provider";
import { useEffect } from "react";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const { data: session } = useSession();
  const router = useRouter()
  if (session?.user) {
    router.push("/chats")
  }
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [email, setEmail] = React.useState<string>("ali12@gmail.com");
  const [password, setPassword] = React.useState<string>("ali12");
  const [name, setName] = React.useState<string>("ali123");



  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  function handleCredentials2() {
    setEmail("sethamishi0512@gmail.com")
    setPassword("Doll@2107")
    setName("Amishi Seth")
  }

  function handleCredentials3() {
    setEmail("vseth2576@gmail.com")
    setPassword("Doll@2107")
    setName("Vijay Seth")
  }

  function handleCredentials1() {
    setEmail("ali12@gmail.com")
    setName("ali123")
    setPassword("ali12")
  }

  async function manageSignIn() {
    if (email == "" || password == "" || name == "") {
      return;
    } else {
      await signIn("credentials", {
        name: name,
        password: password,
        email: email,
        callbackUrl: "/chats",
      })
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div>
            <Label className="" htmlFor="email">
              Email
            </Label>
            <Input
              id="username"
              type="email"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
              className="mt-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label className="" htmlFor="email">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="name12712"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              className="mt-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <Label className="">
              Full name
            </Label>
            <Input
              id="username"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
              className="mt-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-row w-full justify-center">
          <Button
            disabled={isLoading}
            className="mt-5 bg-red-800 text-white mr-1"
            onClick={handleCredentials1}
          >
            Credentials 1
          </Button>
          <Button
            disabled={isLoading}
            className="mt-5 bg-red-800 text-white mr-1"
            onClick={handleCredentials2}
          >
            Credentials 2
          </Button>
          <Button
            disabled={isLoading}
            className="mt-5 bg-red-800 text-white mr-1"
            onClick={handleCredentials3}
          >
            Credentials 3
          </Button>
          </div>
          <Button
            disabled={isLoading}
            className="mt-5 bg-violet-900 text-white"
            onClick={manageSignIn}
          >
            Sign In with above Credentials
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        color="green"
        disabled={isLoading}
        onClick={async () => await signIn("github", { callbackUrl: "/chats" })}
        className="bg-green-600"
      >
        <img src="https://favicon.twenty.com/github.com" className="h-6 mr-2" />
      </Button>
    </div>
  );
}
