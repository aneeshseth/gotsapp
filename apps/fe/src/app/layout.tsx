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
import { WebSocketProvider } from './provider';
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
        <WebSocketProvider>
          {children}
          </WebSocketProvider>
          </NextAuthProvider>
          </RecoilRoot>
      </body>
    </html>
  );
}
