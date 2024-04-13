import { NextResponse } from "next/server";
import { jsonData } from "./data";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../auth/[...nextauth]/route";

const posts = JSON.parse(jsonData);

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }
  return NextResponse.json(posts);
}
