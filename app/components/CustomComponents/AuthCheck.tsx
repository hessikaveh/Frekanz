"use client";

import { useSession } from "next-auth/react";

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  if (status === "authenticated") {
    return <>{children}</>;
  } else {
    return <h2 className="font-extralight text-center m-3">Please sign in.</h2>;
  }
}
