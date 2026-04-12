import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Comment from "@/models/comment";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ r_id: string }> }
) {
  const { r_id } = await params;

  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(r_id)) {
    return NextResponse.json(
      { error: "Invalid restaurant id" },
      { status: 400 }
    );
  }

  const result = await Comment.aggregate([
    {
      $match: {
        r_id: new mongoose.Types.ObjectId(r_id),
      },
    },
    {
      $group: {
        _id: "$r_id",
        avgStar: { $avg: "$star" },
        count: { $sum: 1 },
      },
    },
  ]);

  return NextResponse.json(result[0] || { avgStar: 0, count: 0 });
}