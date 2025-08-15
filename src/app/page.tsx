"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) return;

    // role に応じてページ遷移
    if (session.user.role === "member") {
      router.push("/member");
    } else if (session.user.role === "admin") {
      router.push("/admin");
    }
  }, [session, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      {!session ? (
        <>
          <h1 className="text-2xl font-bold mb-4">ログインしてください</h1>
          <button
            onClick={() => signIn()}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </>
      ) : (
        <p className="text-lg">Redirecting...</p>
      )}
    </div>
  );
}
