import { notFound } from "next/navigation";
import { headers } from "next/headers";
import Light from "@/components/ui/Light";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Comment from "@/models/comment";
import RestaurantHomeClient from "@/clientServer/Restaurants/RestaurantHomeClient";
import { InnerBackground, OuterBackground } from "@/components/Background";
import { getUser } from "@/lib/getUser";
import { CommentType, UserType } from "@/types/types";
import { Rating } from "@mui/material";
import RestaurantGrid from "@/components/RestaurantGrid"; 

export default async function RestaurantsPage() {
    const user = await getUser();

    try {
        const { filteredRestaurants, result } = await FetchData(`${process.env.NEXTAUTH_URL}/api/restaurants`);
        const mycomments = await FetchYourComments(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments`);
        
        return (
            <>
                <Light/>
                {/* SVG Defs... */}
                <div className="relative flex justify-center mt-20">
                    <OuterBackground/>
                    <div className="fixed inset-x-0 top-[150px] bottom-0 flex justify-center">
                        
                        {/* 2. Use the new Sortable RestaurantGrid here */}
                        <RestaurantGrid restaurants={filteredRestaurants} ratingMap={result}/>

                        <div className="flex flex-col absolute w-[280px] h-[360px] z-20 ml-[1000px] mt-[90px]"> 
                            { user ? 
                            mycomments.map((it: CommentType) => (
                                <div key={it._id.toString()} className="text-xl">
                                    <div className="flex flex-row gap-2 items-center ">
                                        <div className="text-[#00BBFF] font-bold">{it.restaurant.name}</div>
                                        <Rating value={it.rating} readOnly sx={{ /* ... styles */ }} />
                                    </div>
                                    <div> {it.text} </div>
                                </div>
                            ))
                            : <h1 className="text-4xl flex items-center justify-center h-[90%]">Login First</h1> }
                        </div>
                        <InnerBackground/>
                    </div>
                </div>
                <RestaurantHomeClient/>
            </>
        )
    } catch (err) {
        console.error(err);
        notFound(); 
    }
}

function GridDisplay({ restaurants, ratingMap }: any){

    const ratingMapObj: Record<string, number> = {};

    ratingMap.forEach((item:any) => {
    ratingMapObj[item.filteredRestaurants] = item.rating;
    });

    return(
        <div className="absolute max-w-5xl w-full h-154 justify-center py-8 px-8 z-30 mr-[600px] mt-[15px] overflow-auto bg-white rounded-3xl border-2 border-black  no-scrollbar">
            <div className="grid grid-cols-2 justify-center gap-10 w-full">
                {restaurants.map((it: any) => (
                    <Link href={`/restaurants/${it._id}`} key={it._id}>
                    <Card restaurant={it} ratingMap={ratingMapObj} />
                    </Link>
                ))}
            </div>
        </div>
    )
}

type Comment = {
  rating: number;
};

type Restaurant = {
  _id: string;
  comments?: Comment[];
};

async function FetchData(link:string){

    const h = await headers();
    const restaurantsRes = await fetch(link, {
        cache: 'no-store',
        headers: {
            cookie: h.get("cookie") ?? "",
        }
    });

    if (!restaurantsRes.ok) {
        if (restaurantsRes.status === 401) {
            throw new Error("Unauthorized");
        }
        if (restaurantsRes.status === 403) {
            throw new Error("Forbidden");
        }
        if (restaurantsRes.status === 404) {
            notFound();
        }

        const text = await restaurantsRes.text();
        
        console.error("STATUS:", restaurantsRes.status);
        console.error("RESPONSE:", text);

        throw new Error(`Fetch failed: ${restaurantsRes.status}`);
    }
    
    const restaurantsData = await restaurantsRes.json();
    const restaurants = restaurantsData.data.data;
    console.log("restaurantsData:", restaurants);

    const user = await getUser();
    const filteredRestaurants = restaurants.filter(
            (r: any) => r.owner?._id === user._id.toString()
        );

    const result = filteredRestaurants?.map((r: Restaurant) => {
    const comments = r.comments ?? [];

    const avg =
        comments.length > 0
        ? comments.reduce((acc, c) => acc + c.rating, 0) / comments.length
        : 0;

    return {
        filteredRestaurants: r._id,
        rating: avg,
    };
    });

    console.log("result",result)
      return { filteredRestaurants, result };

}

async function FetchYourComments(link:string){
    const user:UserType = await getUser();

    if(!user) {
        return;
    }

    const h = await headers();
    const commentsRes = await fetch(link, {
        cache: 'no-store',
        headers: {
            cookie: h.get("cookie") ?? "",
        }
    });

    if (!commentsRes.ok) {
        if (commentsRes.status === 401) {
            throw new Error("Unauthorized");
        }
        if (commentsRes.status === 403) {
            throw new Error("Forbidden");
        }
        if (commentsRes.status === 404) {
            notFound();
        }

        const text = await commentsRes.text();
        
        console.error("STATUS:", commentsRes.status);
        console.error("RESPONSE:", text);

        throw new Error(`Fetch failed: ${commentsRes.status}`);
    }

    const commentsData = await commentsRes.json();
    const comments = commentsData.data;
    console.log("comments:", comments);

    const myComments = comments.filter(
        (c: CommentType) => c.restaurant.user === user._id
    );

    console.log("myCommentsOwner:", comments[0].restaurant);
    console.log("myComments:", myComments);

    return myComments;

}