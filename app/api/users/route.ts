import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const users = await prisma.user.findMany();
  const session = await getServerSession();

  if (!session) {
    redirect("/api/auth/signin");
  }
  return NextResponse.json(users);
}
