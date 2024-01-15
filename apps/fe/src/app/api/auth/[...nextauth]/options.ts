import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import type { AuthOptions } from "next-auth";
import axios from "axios";
export const options: AuthOptions = {
  secret: "p8OvEvf4pKyYlcs84/vePmV8LLfKqwfke3G+yAEcQ1s=",
  providers: [
    GitHubProvider({
      name: "GitHub",
      clientId: "354b5078f83a56543ea0",
      clientSecret: "f3c1b5aa7072349b743573f20c570a2bce80dd4e",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "email",
          type: "text",
          placeholder: "jsmith@gmail.com",
        },
        username: { label: "username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log(credentials);
        const data: any = await axios.post("https://aneesh.pro/fetchuser", {
          email: credentials?.email,
        });
        console.log(data.data);
        let userData = data.data;
        if (data?.length == 0) {
          const data = await axios.post("https://aneesh.pro/add", {
            email: credentials?.email,
            password: credentials?.password,
            name: credentials?.username,
          });
          userData = data;
        }
        let user;
        if (
          userData.password != null &&
          credentials?.password == userData.password
        ) {
          user = {
            id: Math.floor(Math.random() * 100).toString(),
            email: userData.email,
            password: credentials?.password,
            image: userData.image,
            name: userData.name,
          };
        } else {
          return null;
        }
        return user;
      },
    }),
  ],
};
