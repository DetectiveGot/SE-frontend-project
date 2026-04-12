import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { UserType } from "@/types/types";
import { connectDB } from "@/lib/db";
import Reservation from "@/models/Reservation";
import Restaurant from "@/models/Restaurant";
import mongoose from "mongoose";

export async function GET(req: NextRequest, {params}:{params: Promise<{id: string}>}) {
    try {
        const {id} = await params;
        const session = await getServerSession(authOptions);
        const user = session?.user as UserType|undefined;
        // console.log(user);
        if(!user) {
            return NextResponse.json({
                success: false, 
                message: 'Not authorized',
            }, {
                status: 401
            });
        }
        await connectDB();

        let query;
        if(user.role !== 'admin') {
            // query = Reservation.find({user: user.id, restaurant: id}).populate({
            //     path: 'restaurant',
            //     select: 'name address tel'
            // })
            query = Reservation.aggregate([
                {$match: {
                    user: new mongoose.Types.ObjectId(user.id), 
                    restaurant: new mongoose.Types.ObjectId(id)
                }},
                {$lookup: {
                    from: 'restaurants',
                    localField: 'restaurant',
                    foreignField: '_id',
                    as: 'restaurantData'
                }},
                {$unwind: '$restaurantData'},
                {$lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'userData'
                }},
                {$unwind: '$userData'},
                {$addFields: {
                    userName: '$userData.name',
                    userEmail: '$userData.email',
                    userTel: '$userData.telephone',
                    restaurantName: '$restaurantData.name',
                    restaurantAddress: '$restaurantData.address',
                }},
                {$unset: ['restaurantData', 'userData']}
            ]);
        } else {
            // query = Reservation.find({restaurant: id}).populate({
            //     path: 'restaurant',
            //     select: 'name address tel'
            // });
            query = Reservation.aggregate([
                {$match: {
                    restaurant: new mongoose.Types.ObjectId(id)
                }},
                {$lookup: {
                    from: 'restaurants',
                    localField: 'restaurant',
                    foreignField: '_id',
                    as: 'restaurantData'
                }},
                {$unwind: '$restaurantData'},
                {$lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'userData'
                }},
                {$unwind: '$userData'},
                {$addFields: {
                    userName: '$userData.name',
                    userEmail: '$userData.email',
                    userTel: '$userData.telephone',
                    restaurantName: '$restaurantData.name',
                    restaurantAddress: '$restaurantData.address',
                }},
                {$unset: ['restaurantData', 'userData']}
            ]);
        }

        const reservations = await query;
        return NextResponse.json({
            success: true,
            count: reservations.length,
            data: reservations
        }, {
            status: 200
        })
    } catch(err) {
        console.log(err);
        return NextResponse.json({
            success: false, 
            message: 'Cannot find Reservation',
        }, {
            status: 500
        })
    }

}

export async function POST(req: NextRequest, {params}:{params: Promise<{id: string}>}) {
    try {

        const {id} = await params;
        // console.log(id);
        const session = await getServerSession(authOptions);
        const user = session?.user as UserType|undefined;
        // console.log(user);
        if(!user) {
            return NextResponse.json({
                success: false, 
                message: 'Not authorized',
            }, {
                status: 401
            });
        }
        await connectDB();
        let body = await req.json();
        body.restaurant = id;

        const restaurant = await Restaurant.findById(id);
        if(!restaurant) {
            return NextResponse.json({
                success: false,
                message: `No restaurant with the id of ${id}`
            }, {
                status: 404
            });
        }

        // console.log(restaurant);
        const openTime = restaurant.openTime;
        const closeTime = restaurant.closeTime;
        const startTime = body.startDateTime.slice(11, 16);
        const endTime = body.endDateTime.slice(11, 16);
        // console.log(req.body);
        console.log(`Restarant time: ${openTime}-${closeTime}, your reserved ${startTime}-${endTime}`);
        //Rule: must be same date
        const startDate = body.startDateTime.slice(0, 10);
        const endDate = body.endDateTime.slice(0, 10);
        if(startDate!=endDate) {
            return NextResponse.json({
                success: false, 
                message: `The reserve must be on the same day. ${startDate} - ${endDate}`
            }, {
                status: 400
            });
        }
        // Rule: l<r
        if(startTime>=endTime) {
            return NextResponse.json({
                success: false, 
                message: `End Time ${endTime} must be more than Start Time ${startTime}`
            }, {
                status: 400
            });
        }
        //Rule: Only in available time
        if(!(openTime<=startTime && endTime<=closeTime)) {
            return NextResponse.json({
                success: false, 
                message: `Restarant time: ${openTime}-${closeTime}, your reserved ${startTime}-${endTime}`
            }, {
                status: 400
            });
        }
        body.user = user.id;
        const existedReservations = await Reservation.find({user: user.id});
        if(existedReservations.length>=3 && user.role !== 'admin') {
            return NextResponse.json({
                success: false,
                message: `The user with ID ${user.id} has already made 3 reservations` 
            }, {
                status: 400
            })
        }
        

        const reservation = await Reservation.create(body);
        return NextResponse.json({
            success: true,
            data: reservation
        }, {
            status: 200
        });
    } catch(err) {
        console.log(err);
        return NextResponse.json({
            success: false,
            message: 'Cannot create Reservation'
        }, {
            status: 500
        });
    }
}

//test
export async function DELETE(req: NextRequest,{ params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authorized",
        },
        { status: 401 }
      )
    }

    const user = session.user as UserType

    if (user.role !== "admin" && user.role !== 'owner') {
      return NextResponse.json(
        {
          success: false,
          message: `User ${user.id} is not authorized to delete these reservations`,
        },
        { status: 401 }
      )
    }

    await connectDB()

    const { id } = await params

    const result = await Reservation.deleteMany({ restaurant: id })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: `No reservations found for restaurant ${id}`,
        },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        deletedCount: result.deletedCount,
      },
      { status: 200 }
    )
  } catch (err) {
    console.log(err)

    return NextResponse.json(
      {
        success: false,
        message: "Cannot delete reservations",
      },
      { status: 500 }
    )
  }
}