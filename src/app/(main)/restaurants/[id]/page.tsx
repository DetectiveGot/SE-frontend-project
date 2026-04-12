import { notFound } from "next/navigation";
import { headers } from "next/headers";
import Light from "@/components/ui/Light"
import RestaurantClient from "./RestaurantClient";
import Comment from "@/models/comment";
import { connectDB } from "@/lib/db";

export default async function RestaurantsPage({params}: {params: Promise<{id: string}>}) {
    const { id } = await params;
    const h = await headers();
    const restaurantsRes = await fetch(`${process.env.NEXTAUTH_URL}/api/restaurants/${id}`, {
        cache: 'no-store',
        headers: {
            cookie: h.get("cookie") ?? "",
        }
    });

    
    if(!restaurantsRes.ok) {
        // console.log("restaurantsRes :",restaurantsRes)
        // console.log("Incoming ID:", id);
        // console.log("Type:", typeof id);
        notFound();
    }
    const restaurantsData = await restaurantsRes.json();
    const restaurants = restaurantsData.data;
    // console.log(reservationsRes);
    // console.log(reservations);

    await connectDB();

    const result = await Comment.aggregate([
    {
        $match: {
        r_id: id,
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

    const avgStar = result[0]?.avgStar || 0;

    return (
        <>
            <Light/>
            <RestaurantClient restaurants={restaurants} rating={avgStar}/>
        </>
    )
}