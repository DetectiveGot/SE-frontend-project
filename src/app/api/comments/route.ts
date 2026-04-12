import { connectDB } from "@/lib/db";
import Comment from "@/models/comment";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const r_id = searchParams.get("r_id");

  const query = r_id ? { r_id } : {};

  const comments = await Comment.find(query)
    .populate("u_id", "name email")
    .sort({ createdAt: -1 });

  return NextResponse.json(comments);
}

export async function POST(req: NextRequest) {
  await connectDB();

  const body = await req.json();

  const comment = await Comment.create({
    r_id: body.r_id,
    u_id: body.u_id,
    text: body.text,
    star: body.star,
  });

  return NextResponse.json(comment);
}

export async function DELETE(req: NextRequest) {
    
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  return NextResponse.json({ message: "Deleted " + id });
}