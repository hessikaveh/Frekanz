"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export function SignInButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <span className="loading loading-spinner loading-xs"></span>;
  }

  if (status === "authenticated") {
    return (
      <Image
        src={session.user?.image ?? "/peeps.svg"}
        width={32}
        height={32}
        alt="Your Name"
      />
    );
  }

  return (
    <button className="btn btn-ghost btn-circle" onClick={() => signIn()}>
      Sign in
    </button>
  );
}

export function SignOutButton() {
  return (
    <button className="btn btn-ghost" onClick={() => signOut()}>
      Sign out
    </button>
  );
}
