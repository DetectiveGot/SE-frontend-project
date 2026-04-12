import { connectDB } from "@/lib/db";
import RestaurantADS from "@/models/RestaurantsAds";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);

    const select = searchParams.get("select");
    const sort = searchParams.get("sort");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "25");

    let query: any = RestaurantADS.find();

    if (select) {
      query = query.select(select.split(",").join(" "));
    }

    if (sort) {
      query = query.sort(sort.split(",").join(" "));
    } else {
      query = query.sort("-createdAt");
    }

    const startIndex = (page - 1) * limit;
    const total = await RestaurantADS.countDocuments();

    query = query.skip(startIndex).limit(limit);

    const restaurants = await query;

    return NextResponse.json({
      success: true,
      count: restaurants.length,
      total,
      page,
      data: restaurants,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}