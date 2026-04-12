"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";

type Restaurant = {
  name: string;
  address: string;
  imgsrc: string;
  tel: string;
};

export default function Banner() {
  const [item, setCovers] = useState<Restaurant[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/restaurantsADS");
        const data = await res.json();
        setCovers(data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleClick = () => {
    if (item.length === 0) return;
    setIndex((prev) => (prev + 1) % item.length);
  };

  return (
    <div className="flex gap-5 justify-end w-[100vw] h-[390px] mr-[3vw]">

      <div>
        {item.length > 0 && (
          <>
            <h1 className="w-[700px] text-[50px] mt-[80px] font-thin [text-shadow:0_4px_20px_rgba(0,0,0,1)]">
              {item[index].name}
            </h1>

            <p className="w-[700px] text-[30px] mt-[15px] font-thin [text-shadow:0_4px_20px_rgba(0,0,0,1)]">
              {item[index].address} <br/>
              Tel: {item[index].tel}
            </p>
          </>
        )}
      </div>

      <div className="relative w-[900px] h-full rounded-4xl">
        {item.length > 0 && (
          <Image
            onClick={handleClick}
            src={item[index].imgsrc}
            alt="cover"
            fill
            className="object-cover rounded-4xl border-[2px] border-black cursor-pointer"
          />
        )}

        {/* gradient overlay */}
        <Box className="absolute inset-0 pointer-events-none">
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "30%",
              height: "100%",
              background:
                "linear-gradient(to right, rgba(0,0,0,0.7), transparent)",
              borderTopLeftRadius: 20,
              borderBottomLeftRadius: 20,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "30%",
              height: "100%",
              background:
                "linear-gradient(to left, rgba(0,0,0,0.7), transparent)",
              borderTopRightRadius: 20,
              borderBottomRightRadius: 20,
            }}
          />
        </Box>
      </div>
    </div>
  );
}