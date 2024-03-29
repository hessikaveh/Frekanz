import { NextResponse } from "next/server";
import { jsonData } from "./data";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const posts = JSON.parse(jsonData);

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    redirect("/api/auth/signin");
  }
  return NextResponse.json(posts);
}
