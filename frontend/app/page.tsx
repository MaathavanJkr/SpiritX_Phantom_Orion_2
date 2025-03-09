'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import AuthForm from "@/components/auth/auth-form";
import LoginPage from "./auth/login/page";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      router.push("/dashboard");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
        <LoginPage />
  );
}
