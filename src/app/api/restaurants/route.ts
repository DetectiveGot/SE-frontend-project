import Restaurant from "@/models/Restaurant";
import { connectDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();

  try {

    const { searchParams } = new URL(req.url);

    const select = searchParams.get("select");
    const sort = searchParams.get("sort");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "25");

    let query: any = Restaurant.find();

    if (select) {
      query = query.select(select.split(",").join(" "));
    }

    if (sort) {
      query = query.sort(sort.split(",").join(" "));
    } else {
      query = query.sort("-createdAt");
    }

    const startIndex = (page - 1) * limit;
    const total = await Restaurant.countDocuments();

    query = query.skip(startIndex).limit(limit);

    const restaurants = await query;

    return NextResponse.json({
      success: true,
      count: restaurants.length,
      data: restaurants,
    });
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();
    const restaurant = await Restaurant.create(body);

    return NextResponse.json(
      { success: true, data: restaurant },
      { status: 201 }
    );
  } catch (err: any) {
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e: any) => e.message);
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    if (err.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Restaurant name already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: false }, { status: 500 });
  }
}