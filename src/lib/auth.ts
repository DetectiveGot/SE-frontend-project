import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth, { AuthOptions } from "next-auth";
import { connectDB } from "./db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        // username: { label: "Username", type: "text", placeholder: "jsmith" },
        email: { label: "Email", type: "email", placeholder: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        if(!credentials) return null;
        await connectDB();
        const user = await User.findOne({email: credentials.email}).select("+password");
        if(!user) return null;
        const isMatch = await user.matchPassword(credentials.password);
        if(!isMatch) {
          console.log('credential does not match');
          return null;
        }
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          telephone: user.telephone,
        };
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({token, user}) {
      // console.log("user in jwt", user);
      return {...token, ...user};
    },
    async session({session, token, user}) {
      session.user = token as any;
      return session;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    }
  }
};