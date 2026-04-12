import mongoose from "mongoose";
import Restaurant from "@/models/Restaurant";
import Reservation from "@/models/Reservation";
import { connectDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{id: string}> }
) {

  await connectDB();

  try {

    const {id} = await params;
    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return NextResponse.json({ success: false }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: restaurant });
  } catch (err) {

    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  try {

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid restaurant ID" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const restaurant = await Restaurant.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!restaurant) {
      return NextResponse.json({ success: false }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: restaurant });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  try {

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid restaurant ID" },
        { status: 400 }
      );
    }

    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return NextResponse.json(
        { success: false, message: "Restaurant not found" },
        { status: 404 }
      );
    }

    await Reservation.deleteMany({ restaurant: id });
    await Restaurant.deleteOne({ _id: id });

    return NextResponse.json({ success: true, data: {} });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}