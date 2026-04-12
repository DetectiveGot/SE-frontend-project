import mongoose from "mongoose";

export type UserType = {
    id: string,
    name: string,
    sub: string,
    email: string,
    role: string,
    telephone: string,
}

export type ReservationType = {
    _id: string,
    startDateTime: Date
    endDateTime: Date
    user: string
    restaurant: string
}

export type RestaurantType = {
    _id: string
    imgsrc: string,
    name: string,
    address: string,
    tel:string,
    openTime: string,
    closeTime: string,
}