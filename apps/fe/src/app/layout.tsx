"use client"
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "./provider/provider";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';

const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      
        <RecoilRoot>
        <NextAuthProvider>
          {children}
          </NextAuthProvider>
          </RecoilRoot>
      </body>
    </html>
  );
}
