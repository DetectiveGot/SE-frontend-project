'use client'

import { CommentType, RestaurantType, UserType } from "@/types/types";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { FormControl, MenuItem, Rating, Select, SelectChangeEvent } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";
import RatingSort from "./RatingSort";

 const OwnerViewCommentPopPage = ({restaurants,user,closeCard}:{restaurants:RestaurantType,user: UserType,closeCard: () => void} ) => {
    
    const router = useRouter();
    const [age, setAge] = React.useState("10");
    const [selected, setSelected] = React.useState<number | null>(null);
    const handleChange = (event: SelectChangeEvent) => {
        setAge(event.target.value);
    };

    console.log("user is",user)
    const handleCreate = async (formData: FormData) => {
        
        try {
            const payload = {
                text: formData.get("comment"),
                rating: formData.get("rating"),
                user: user,
            }
            console.log(payload);
            const resp = await fetch(`/api/restaurants/${restaurants._id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });
            
            const data = await resp.json();
            if(!resp.ok) {
                throw new Error(data.message || "Failed to create");
            }
            toast.success("Create success!", {position: 'top-center'})
            closeCard();
            router.refresh()

        } catch(err) {
            console.log(err);
            toast.error("Failed to create", {
                position: 'top-center',
                description: err instanceof Error ? err.message : "Something went wrong.",
            });
        }
    }

   const filteredComments = (restaurants.comments || []).filter((c) => {
        if (!selected) return true; // ไม่เลือก = แสดงทั้งหมด
        return c.rating === selected;
    });

    const sortedComments = [...filteredComments].sort((a, b) => {
    const aIsMine = a.user._id.toString() === user._id.toString() ? 1 : 0;
    const bIsMine = b.user._id.toString() === user._id.toString() ? 1 : 0;

    if (aIsMine !== bIsMine) {
        return bIsMine - aIsMine;
    }

    switch (age) {
        case "10":
        return new Date(b.createdAt as any).getTime() - new Date(a.createdAt as any).getTime();

        case "20":
        return b.rating - a.rating;

        case "30":
        return a.rating - b.rating;

        default:
        return 0;
    }
    });

    return (
        <div className="z-50 fixed inset-0 bg-black/50 flex justify-center items-center h-dvh w-dvw">
            <form action={handleCreate}>
                <div className="flex flex-col pt-12 px-15 pb-10 w-[1300px] h-[760px] bg-white rounded-md p-4 shadow font-bold">

                    <div className="flex justify-between ">
                        <div className="w-[100%] flex flex-col gap-5 [text-shadow:0_4px_20px_rgba(0,0,0,1)]  relative">
                            <h1 className="text-4xl ">Reviews</h1>

                            <div className="flex flex-row gap-3 [text-shadow:0_4px_20px_rgba(0,0,0,1)] ">
                                <div className=" w-full flex flex-col items-start gap-3 ">
                                    <div className=" flex flex-row my-8 items-center gap-5"> 
                                        <h1 className="text-4xl h-[60px] w-[100%]"> Sort :</h1> 
                                        <FormControl
                                            sx={{
                                                minWidth: 200,
                                                height: 40,
                                                backgroundColor: "#d6d6d6",
                                                borderRadius: 1,
                                            }}
                                            size="small"
                                            >

                                            <Select
                                                labelId="demo-simple-select-helper-label"
                                                id="demo-simple-select-helper"
                                                value={age}
                                                label="Sort"
                                                onChange={handleChange}
                                                sx={{
                                                color: "white",

                                                ".MuiSvgIcon-root": {
                                                    color: "#424242",
                                                },
                                                }}
                                            >

                                                <MenuItem value={10}>Most Recent</MenuItem>
                                                <MenuItem value={20}>Rating High-to-Low</MenuItem>
                                                <MenuItem value={30}>Rating Low-to-High</MenuItem>
                                            </Select>
                                            </FormControl>

                                            <div className="flex gap-4">
                                                {[1,2,3,4,5].map((num) => (
                                                    <div
                                                    key={num}
                                                    onClick={() => setSelected(num)}
                                                    className={`
                                                        p-[6px] px-[10px] border rounded-xl
                                                        transition-all duration-200 cursor-pointer
                                                        hover:scale-110 hover:bg-gray-200
                                                        ${selected === num ? "bg-gray-200 scale-110" : ""}
                                                    `}
                                                    >
                                                    <RatingSort value={num} />
                                                    </div>
                                                ))}
                                                </div>

                                    </div>
                                </div>
                            </div>
                            <Button variant={'destructive'} onClick={closeCard} className="absolute top-0 right-0">X</Button>
                        </div>
                    </div>

                    <div className="flex flex-1">

                        <div className="h-full flex flex-col  flex-7 gap-4 overflow-y-scroll">
                            {sortedComments.map((it: CommentType) => (
                                
                                <div key={it._id.toString()} className="flex flex-col !w-[96%] !overflow-visible border-b border-gray-500 pb-4 gap-2 overflow-scroll">
                                    <div className="flex flex-row gap-3">

                                        {user._id === it.user._id ? ( 

                                            <h1 className="text-[#00BBFF]">{it.user.name}</h1> 

                                            ) : (

                                            <h1 className="text-black">{it.user.name}</h1> 

                                            )}

                                        <Rating
                                        value={it.rating} 
                                        readOnly
                                        sx={{
                                            zIndex: 2,
                                            fontSize: "1.5rem",
                                            
                                            "& .MuiRating-icon svg": {
                                            strokeWidth: 0.4,
                                            },

                                            "& .MuiRating-iconFilled svg": {
                                            fill: "url(#starGradient)",
                                            stroke: "black",
                                            },

                                            "& .MuiRating-iconEmpty svg": {
                                            fill: "transparent" ,
                                            stroke: "#333",
                                            },
                                        }}
                                        />
                                    </div>
                                    <h1>{it.text}</h1>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col py-5 pl-9 pr-0 flex-3 gap-3">
                            <img src={restaurants.imgsrc} className=""/>
                            <h1 className="text-4xl text-center">{restaurants?.name}</h1>
                            <h1 className="text-xl text-center">Adress : {restaurants?.address} Tel : {restaurants.telephone}</h1>
                        </div>
                    </div>

                </div>
            </form>
        </div>
    )
}

export {OwnerViewCommentPopPage};