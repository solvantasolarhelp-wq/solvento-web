"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function AssocRoot() {
  const router = useRouter();
  useEffect(() => { router.replace("/associate/dashboard"); }, [router]);
  return null;
}
