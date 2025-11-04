
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LocalePage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  
  // Redirect to the main page
  useEffect(() => {
    router.push('/');
  }, [router]);

  return null;
}
