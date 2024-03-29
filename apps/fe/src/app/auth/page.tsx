import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "./page.css";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { UserAuthForm } from "@/components/ui/user-auth-form";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function AuthenticationPage() {
  return (
    <div className="fadeInUp-animation">
      <div className="container h-screen flex flex-col items-center justify-center md:grid sm:grid lg:max-w-none lg:grid-cols-2 lg:px-0 sm:max-w-none">
        <Link
          href="https://github.com/aneeshseth/gotsapp"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8"
          )}
        >
          <img src="https://favicon.twenty.com/github.com" className="h-12" />
        </Link>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 flex items-center bg-opacity-0 flex-col justify-center">
            <div>
            <b>sample email:</b> sethamishi0512@gmail.com
            </div>
            <div>
            <b>sample password:</b> Doll@2107
            </div>
            <div>
            <b>sample name:</b>  Amishi Seth
            </div>
          </div>
        </div>
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 max-w-96">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          </div>
          <code className="relative rounded bg-muted px-0 py-1 font-mono text-sm font-semibold w-full github-si flex justify-center">
            <div className="sign-text">
              Sign-in with sample credentials/Github.
            </div>
          </code>
          <UserAuthForm  />
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="/"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}



/*
redis-server:
    image: "redis:alpine"
    command: redis-server
    ports:
      - "6379:6379"
*/
