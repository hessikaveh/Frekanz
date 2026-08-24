import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../auth/authoptions";

const MAX_ITEMS = 5000;

function isValidPuzzle(p: unknown): p is { word: string; state: string; bundle: string } {
  if (typeof p !== "object" || p === null) return false;
  const { word, state, bundle } = p as Record<string, unknown>;
  return (
    typeof word === "string" &&
    word.length > 0 &&
    word.length <= 100 &&
    typeof state === "string" &&
    state.length <= 20 &&
    typeof bundle === "string" &&
    bundle.length <= 50
  );
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { wordProgress: true },
  });
  if (!user) {
    return NextResponse.json([]);
  }

  return NextResponse.json(
    user.wordProgress.map(({ word, state, bundle }) => ({ word, state, bundle }))
  );
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const puzzles = Array.isArray(body) ? body : (body as any)?.puzzles;
  if (!Array.isArray(puzzles) || puzzles.length > MAX_ITEMS) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  if (!puzzles.every(isValidPuzzle)) {
    return NextResponse.json({ error: "Invalid puzzle entry" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await prisma.$transaction(
    puzzles.map((p) =>
      prisma.wordProgress.upsert({
        where: { userId_word: { userId: user.id, word: p.word } },
        create: { userId: user.id, word: p.word, state: p.state, bundle: p.bundle },
        update: { state: p.state, bundle: p.bundle },
      })
    )
  );

  return NextResponse.json({ saved: puzzles.length });
}
