import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import AuthProvider from "./components/CustomComponents/AuthProvider";
import {
  SignInButton,
  SignOutButton,
} from "./components/CustomComponents/SigningButtons";
import AuthCheck from "./components/CustomComponents/AuthCheck";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Frekanz",
  description:
    "Improve your German language skills by practicing the most frequently used words by solving puzzles.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={inter.className}>
          <div className="navbar bg-base-200 ">
            <div className="navbar-start">
              <Link className="btn btn-ghost btn-circle" href="/">
                <Image
                  src="/favicon.ico"
                  width={64}
                  height={64}
                  alt="Frekanz logo"
                />
              </Link>
            </div>
            <div className="navbar-center">
              <ul className="menu menu-vertical lg:menu-horizontal bg-base-300 rounded-box">
                <li className="items-center">
                  <Link href="/">Home</Link>
                </li>

                <li className="items-center">
                  <Link href="/german/">Frekanz</Link>
                </li>
              </ul>
            </div>
            <div className="navbar-end">
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="rounded-full">
                    <SignInButton />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="z-[1] shadow menu menu-sm dropdown-content bg-base-100 rounded-box"
                >
                  <li>
                    <div>
                      <AuthCheck>
                        <SignOutButton />
                      </AuthCheck>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div>{children}</div>
        </body>
      </html>
    </AuthProvider>
  );
}
