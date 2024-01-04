import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

export const options: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: "95720ff743d90d038c06",
      clientSecret: "f77d7a9b3d14eec9f133fd6b5dea081e6a491a3f",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};
