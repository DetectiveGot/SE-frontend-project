import { notFound } from "next/navigation";
import { headers } from "next/headers";
import Light from "@/components/ui/Light";
import Link from "next/link";
import { Box } from "@mui/material";
import Card from "@/components/ui/Card";
import Comment from "@/models/comment";
import { connectDB } from "@/lib/db";
import RestaurantHomeClient from "../../../clientServer/Restaurants/RestaurantHomeClient";
import { InnerBackground, OuterBackground } from "@/components/Background";

export default async function RestaurantsPage() {

    const h = await headers();
    const restaurantsRes = await fetch(`${process.env.NEXTAUTH_URL}/api/restaurants`, {
        cache: 'no-store',
        headers: {
            cookie: h.get("cookie") ?? "",
        }
    });
    if(!restaurantsRes.ok) {
        notFound();
    }
    
    const restaurantsData = await restaurantsRes.json();
    const restaurants = restaurantsData.data.data;

      await connectDB();
    
      const ratings = await Comment.aggregate([
        {
          $group: {
            _id: "$r_id",
            avgStar: { $avg: "$star" },
          },
        },
      ]);
    
      const ratingMap = Object.fromEntries(
        ratings.map(r => [r._id.toString(), r.avgStar])
      );

    return (
        <>
            <Light/>

            <div className="relative flex justify-center mt-20">

                <OuterBackground/>
                <div className="fixed inset-x-0 top-[150px] bottom-0 flex justify-center">
                    
                    <GridDisplay restaurants={restaurants} ratingMap={ratingMap}/>
                    <InnerBackground/>

                </div>

            </div>

            <RestaurantHomeClient/>
        </>
    )

}

function GridDisplay({ restaurants, ratingMap }: any){

    return(
        <div className="absolute max-w-5xl w-full h-154 justify-center py-8 px-8 z-30 mr-[600px] mt-[15px] overflow-auto bg-white rounded-3xl border-2 border-black  no-scrollbar">
            <div className="grid grid-cols-2 justify-center gap-10 w-full">
                {restaurants.map((it: any) => (

                    <Link href={`/restaurants/${it._id}`} key={it._id}>
                    <Card restaurant={it} ratingMap={ratingMap} />
                    </Link>
                ))}
            </div>
        </div>
    )
}