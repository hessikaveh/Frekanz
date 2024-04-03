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
    "Improve your German language skills by practicing the most frequently used words by solving puzzles. Vocabulary trainer, 1000 most frequently used german words.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <html lang="en" className="dark">
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
              <label className="btn btn-circle mx-1 swap swap-rotate">
                {/* this hidden checkbox controls the state */}
                <input
                  type="checkbox"
                  className="theme-controller"
                  value="luxury"
                />

                {/* sun icon */}
                <svg
                  className="swap-on fill-current w-8 h-8"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                </svg>

                {/* moon icon */}
                <svg
                  className="swap-off fill-current w-8 h-8"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                </svg>
              </label>

              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="mx-1 btn btn-ghost btn-circle avatar"
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
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </AuthProvider>
  );
}
