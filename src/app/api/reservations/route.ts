import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Reservation from "@/models/Reservation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { UserType } from "@/types/types";

import mongoose from "mongoose";
// console.log(mongoose.modelNames());

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        // console.log(user);
        if(!session || !session.user) {
            return NextResponse.json({
                success: false, 
                message: 'Not authorized',
            }, {
                status: 401
            });
        }
        
        const user = session.user as UserType;
        console.log(user);
        console.log(user.id);
        
        await connectDB();
        let query;
    
        if(user.role !== 'admin') {
            // query = Reservation.find({user: user.id}).populate({
            //     path: 'restaurant',
            //     select: 'name address tel'
            // })
            query = Reservation.aggregate([
                {$match: {
                    user: new mongoose.Types.ObjectId(user.id),
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
                    restaurantName: '$restaurantData.name'
                }},
                {$unset: ['restaurantData', 'userData']}
            ]);
        } else {
            query = Reservation.aggregate([
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
                    restaurantName: '$restaurantData.name'
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
        console.error(err);
        return NextResponse.json({
            success: false, 
            message: 'Internal Server Error',
        }, {
            status: 500
        })
    }
}

export async function POST(req: NextRequest) {
    try{
        const session = await getServerSession(authOptions);
        // console.log(user);
        if(!session || !session.user) {
            return NextResponse.json({
                success: false, 
                message: 'Not authorized',
            }, {
                status: 401
            });
        }
        
        const user = session.user as UserType;

        const body = await req.json();
        const { restaurantId, startDateTime, endDateTime } = body;
        if (!restaurantId || !startDateTime || !endDateTime) {
            return NextResponse.json({
                success: false,
                message: "Missing required fields",
            }, { status: 400 });
        }

        const start = new Date(startDateTime);
        const end = new Date(endDateTime);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return NextResponse.json({
                success: false,
                message: "Invalid date format",
            }, { status: 400 });
        }

        if (start >= end) {
            return NextResponse.json({
                success: false,
                message: "Start time must be before end time",
            }, { status: 400 });
        }
        
        await connectDB();

        const conflict = await Reservation.findOne({
            restaurantId,
            $or: [
                {
                    startDateTime: { $lt: end },
                    endDateTime: { $gt: start },
                },
            ],
        });

        if (conflict) {
            return NextResponse.json({
                success: false,
                message: "Time slot already booked",
            }, { status: 409 });
        }

        const reservation = await Reservation.create({
            userId: user.id,
            restaurantId,
            startDateTime: start,
            endDateTime: end,
        });

        return NextResponse.json({
            success: true,
            data: reservation,
        }, { status: 201 });

    }catch(err){
        console.error(err);
        return NextResponse.json({
            success: false,
            message: 'Internal Server Error',
        },{
            status: 500,
        })
    }
}