"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";

export default function RestaurantGrid({ restaurants, ratingMap }: { restaurants: any[], ratingMap: any[] }) {
    const [sortBy, setSortBy] = useState("recent");
    const [sortOrder, setSortOrder] = useState("desc");

    // Convert ratingMap array to object for quick lookup
    const ratingMapObj = useMemo(() => {
        const map: Record<string, number> = {};
        ratingMap.forEach((item: any) => {
            map[item.filteredRestaurants] = item.rating;
        });
        return map;
    }, [ratingMap]);

    // Sorting Logic
    const sortedRestaurants = useMemo(() => {
        let sorted = [...restaurants];

        sorted.sort((a, b) => {
            let valA: any, valB: any;

            if (sortBy === "alphabetical") {
                valA = a.name.toLowerCase();
                valB = b.name.toLowerCase();
                return sortOrder === "asc" 
                    ? valA.localeCompare(valB) 
                    : valB.localeCompare(valA);
            } 
            
            if (sortBy === "rating") {
                valA = ratingMapObj[a._id] || 0;
                valB = ratingMapObj[b._id] || 0;
            } else { 
                // Default: Recent (assumes createdAt field exists)
                valA = new Date(a.createdAt || 0).getTime();
                valB = new Date(b.createdAt || 0).getTime();
            }

            return sortOrder === "asc" ? valA - valB : valB - valA;
        });

        return sorted;
    }, [restaurants, sortBy, sortOrder, ratingMapObj]);

    return (
        <div className="absolute max-w-5xl w-full h-154 justify-center py-8 px-8 z-30 mr-[600px] mt-[15px] overflow-auto bg-white rounded-3xl border-2 border-black no-scrollbar">
            {/* Sorting Dropdowns */}
            <div className="flex gap-4 mb-6 top-0 bg-white pb-4 z-40 border-b border-gray-100">
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Sort By</label>
                    <select 
                        className="p-2 border rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#00BBFF]"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="recent">Recent</option>
                        <option value="alphabetical">Alphabetical</option>
                        <option value="rating">Ratings</option>
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Order</label>
                    <select 
                        className="p-2 border rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#00BBFF]"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>
            </div>

            {/* Grid Display */}
            <div className="grid grid-cols-2 justify-center gap-10 w-full">
                {sortedRestaurants.map((it: any) => (
                    <Link href={`/restaurants/${it._id}`} key={it._id}>
                        <Card restaurant={it} ratingMap={ratingMapObj} />
                    </Link>
                ))}
            </div>
        </div>
    );
}