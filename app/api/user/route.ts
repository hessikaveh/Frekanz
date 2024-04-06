import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  const currentUserEmail = session?.user?.email!;
  const data = await req.json();

  const user = await prisma.user.update({
    where: {
      email: currentUserEmail,
    },
    data,
  });

  return NextResponse.json(user);
}

export async function DELETE(req: Request) {
  const season = await getServerSession(authOptions);
  const currentUserEmail = season?.user?.email!;

  const deleteUser = await prisma.user.delete({
    where: {
      email: currentUserEmail,
    },
  });

  return NextResponse.json(deleteUser);
}
