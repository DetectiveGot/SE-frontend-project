import { notFound } from "next/navigation";
import { headers } from "next/headers";
import Light from "@/components/ui/Light"
import RestaurantClient from "./RestaurantClient";
import Comment from "@/models/comment";
import { connectDB } from "@/lib/db";
import { getUser } from "@/lib/getUser";

export default async function RestaurantsPage({params}: {params: Promise<{id: string}>}) {
    const { id } = await params;
    const h = await headers();
    const restaurantsRes = await fetch(`${process.env.NEXTAUTH_URL}/api/restaurants/${id}`, {
        cache: 'no-store',
        headers: {
            cookie: h.get("cookie") ?? "",
        }
    });
    const user = await getUser();

    
    if(!restaurantsRes.ok) {
        notFound();
    }
    const restaurantsData = await restaurantsRes.json();
    const restaurants = restaurantsData.data;

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
            <RestaurantClient user={user} restaurants={restaurants} rating={avgStar}/>
        </>
    )
}