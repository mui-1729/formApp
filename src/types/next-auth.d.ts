// src/types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      role?: string; // ここに role を追加
    };
  }

  interface User {
    role?: string;
  }
}
