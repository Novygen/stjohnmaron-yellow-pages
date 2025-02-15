// app/page.tsx
"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">Welcome to Woorkroom</h1>
      <p className="mb-8">Your place to work. Plan. Create. Control.</p>
      <div className="flex gap-4">
        <Link
          href="/sign-in"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Sign In
        </Link>
        <Link
          href="/sign-up"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Sign Up
        </Link>
      </div>
    </main>
  );
}
