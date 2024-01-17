"use client";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import Tiles from "@/components/ui/Tiles";
import "./page.css";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
export default function Home() {
  const router = useRouter()
  return (
    <div className="fadeInUp-animation">
      <div className="bg-black  text-white bg-[url('https://images.unsplash.com/photo-1511406361295-0a1ff814c0ce?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] ">
        <nav className="py-6 flex justify-between items-center px-8 mb-20">
          <div className="text-2xl font-bold">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/WhatsApp_icon.png/598px-WhatsApp_icon.png"
              className="w-14"
            />
          </div>
          <Link
          href="https://github.com/aneeshseth/gotsapp"
          className=
            "absolute right-4 top-4 md:right-8 md:top-8"
          
        >
          <img src="https://www.pngkey.com/png/full/178-1787366_coming-soon-github-white-icon-png.png" className="h-12" />
        </Link>
        </nav>
        <div className="flex flex-col items-center justify-center mb-10 text-center space-y-8">
          <h1 className="text-6xl font-bold leading-tight">Gotsapp.</h1>
          <h3 className="text-2xl font-semibold tracking-tight">
            a scalable
            <br />
            chatting infrastructure.
          </h3>
          <div className="flex flex-row gap-3">
          <Button
            className="bg-transparent  text-white hover:bg-white hover:text-black"
            onClick={() => {
              router.push("/how");
            }}
          >
            Start Chatting
          </Button>
          </div>
        </div>
        <div className="mb-16">
          <Tiles />
        </div>
      </div>
    </div>
  );
}
