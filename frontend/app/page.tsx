'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        router.push("/auth/login");
      } else {
        setUsername(localStorage.getItem("user_name"));
        setLoading(false);
      }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/auth/login");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <h1 className="text-4xl font-bold mb-4">Welcome, {username}</h1>
          <button 
        onClick={handleLogout} 
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
          >
        Logout
          </button>
        </>
      )}
    </main>
  )
}
