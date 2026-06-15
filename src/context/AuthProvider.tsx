"use client";

import { SessionProvider } from "next-auth/react";//Think of it as a session storage container provided by next auth.Stores logged-in user information,Makes it available everywhere

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;//everything renderrable by nextjs
}) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}