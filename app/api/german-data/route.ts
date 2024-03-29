import { NextResponse } from "next/server";
import { jsonData } from "./data";

const posts = jsonData;

export async function GET() {
  return NextResponse.json(posts);
}
