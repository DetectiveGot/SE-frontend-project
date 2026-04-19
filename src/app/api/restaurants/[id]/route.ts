import mongoose from "mongoose";
import Restaurant from "@/models/Restaurant";
import Reservation from "@/models/Reservation";
import { connectDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

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
  try {
    const {id} = await params;
    const token = (await cookies()).get('token')?.value;
    if(!token || token === 'null') {
        return NextResponse.json({
                success: false,
                message: 'Not authorized',
            },
            {
                status: 401,
            }
        );
    }

    const body = await req.json();
    const resp = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/restaurants/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body),
    });
    const data = await resp.json().catch(() => null);

    return NextResponse.json(data, {
        status: resp.status
    });
  } catch(err) {
    console.log(err);
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