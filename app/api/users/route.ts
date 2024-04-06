import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: Request) {
  const users = await prisma.user.findMany();
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }
  return NextResponse.json(users);
}
