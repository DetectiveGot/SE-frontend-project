
import { connectDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Reservation from "@/models/Reservation";
import Restaurant from "@/models/Restaurant";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { UserType } from "@/types/types";
import mongoose from "mongoose";

export async function GET(req: NextRequest, {params}:{params: Promise<{id: string}>}) {
    try {
        const session = await getServerSession(authOptions);

        if(!session || !session.user){
            return NextResponse.json({
                success: false, 
                message: 'Not authorized',
            }, {
                status: 401
            });

        }

        const user = session.user as UserType;

        await connectDB();
        
        const { id } = await params;
        const reservation = (await Reservation.aggregate([
            {$match: {
                _id: new mongoose.Types.ObjectId(id), 
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
                openTime: '$restaurantData.openTime',
                closeTime: '$restaurantData.closeTime'
            }},
            {$unset: ['restaurantData', 'userData']}
        ]))[0];
        if(!reservation) {
            return NextResponse.json({
                success: false, 
                message: `No reservation with the id of ${id}`
            }, {
                status: 404
            });
        }

        if(reservation.user.toString()!==user.id && user.role !== 'admin') {
            return NextResponse.json({
                success: false, 
                message: `No reservation with the id of ${id}`
            }, {
                status: 404
            });
        }

        return NextResponse.json({
            success: true, 
            data: reservation
        }, {
            status: 200
        })
    } catch(err) {
        console.log(err);
        NextResponse.json({
            success: false, 
            message: 'Internal Server Error'
        }, {
            status: 500
        });
    }
}

export async function PUT(req: NextRequest, {params}:{params: Promise<{id: string}>}) {
    try {
        const session = await getServerSession(authOptions);

        if(!session || !session.user){
            return NextResponse.json({
                success: false, 
                message: 'Not authorized',
            }, {
                status: 401
            });

        }

        const user = session.user as UserType;

        await connectDB();
        const {id} = await params;
        // let reservation = await Reservation.findById(req.params.id).populate({
        //     path: 'restaurant',
        //     select: 'openTime closeTime'
        // })
        
        let reservation = (await Reservation.aggregate([
            {$match: {
                _id: new mongoose.Types.ObjectId(id), 
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
                openTime: '$restaurantData.openTime',
                closeTime: '$restaurantData.closeTime'
            }},
            {$unset: ['restaurantData', 'userData']}
        ]))[0];
        if(!reservation) {
            return NextResponse.json({
                success: false,
                message: `No reservation with the id of ${id}`
            }, {
                status: 404
            });
        }

        if(reservation.user.toString()!==user.id && user.role !== 'admin') {
            return NextResponse.json({
                success: false, 
                message: `User ${user.id} is not authorized to update this reservation`
            }, {
                status: 401
            });
        }
        let body = await req.json();
        let restaurantId = body.restaurant;
        let restaurant;
        if(!restaurantId) {
            restaurant = {
                openTime: reservation.openTime,
                closeTime: reservation.closeTime
            };
        } else {
            restaurant = (await Restaurant.findById(restaurantId)) || {
                openTime: reservation.openTime,
                closeTime: reservation.closeTime
            };
        }
        if(!restaurant) {
            return NextResponse.json({
                success: false,
                message: `This restaurantId doesn't exist ${restaurantId}.`
            }, {
                status: 400
            });
        }
        console.log(reservation);
        const openTime = restaurant.openTime;
        const closeTime = restaurant.closeTime;
        const startDateTime = body.startDateTime || reservation.startDateTime.toISOString();
        let endDateTime = body.endDateTime || reservation.endDateTime.toISOString();
        const startTime = startDateTime.slice(11, 16);
        const endTime = endDateTime.slice(11, 16);
        console.log(`Restarant time: ${openTime}-${closeTime}, your reserved ${startTime}-${endTime}`);
        //Rule: must be same date
        const startDate = startDateTime.slice(0, 10);
        const endDate = endDateTime.slice(0, 10);
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

        reservation = await Reservation.findByIdAndUpdate(id, body, {
            new: true, 
            runValidators: true
        });

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
            message: 'Cannot update Reservation'
        }, {
            status:500
        })
    }
}

export async function DELETE(req: NextRequest, {params}:{params: Promise<{id: string}>}) {
    try {
        const session = await getServerSession(authOptions);

        if(!session || !session.user){
            return NextResponse.json({
                success: false, 
                message: 'Not authorized',
            }, {
                status: 401
            });

        }

        const user = session.user as UserType;
        
        await connectDB();
        const { id } = await params;
        const reservation = await Reservation.findById(id);
        if(!reservation) {
            return NextResponse.json({
                success: false, 
                message: `No reservation with the id of ${id}`
            }, {
                status: 404
            });
        }

        if(reservation.user.toString()!==user.id && user.role !== 'admin') {
            return NextResponse.json({
                success: false, 
                message: `User ${user.id} is not authorized to delete this reservation`
            }, {
                status: 401
            });
        }
        await reservation.deleteOne();
        return NextResponse.json({
            success: true, 
            data: {}
        }, {
            status: 200
        });
    } catch(err) {
        console.log(err);
        return NextResponse.json({
            success: true,
            message: 'Cannot delete Reservation'
        }, {
            status: 500
        });
    }
}