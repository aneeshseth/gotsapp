
import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://ilsphosyotjetmkjcsnf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsc3Bob3N5b3RqZXRta2pjc25mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ1MTQ5MzUsImV4cCI6MjAyMDA5MDkzNX0.Pv0x6T00bUOqeFeK32_8yvWTQAw0zzSibAi7XO4V6_E')


export const options: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: "95720ff743d90d038c06",
      clientSecret: "f77d7a9b3d14eec9f133fd6b5dea081e6a491a3f",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text", placeholder: "jsmith@gmail.com" },
        name: { label: "Name", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const {data} = await supabase.from("USERS").select().eq("email", credentials?.email)
        let userData = {data}.data![0];
        if (data?.length == 0) {
          const { data ,error } = await supabase
          .from('USERS')
          .insert({ email: credentials?.email, password: credentials?.password, name : credentials?.name, image: "https://img.analisa.io/tiktok/profile/7031003225021875205.png"}).select()
          userData = data![0]
        }
        let user;
        if (userData.password != null && credentials?.password == userData.password) {
          user = { id: Math.floor(Math.random()*100).toString(), email: userData.email, password: credentials?.password, image: userData.image };
        } else {
          user = {id: Math.floor(Math.random()*100).toString(), email: "invalid", password: "invalid", image: "invalid"}
        }
        return user;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};


