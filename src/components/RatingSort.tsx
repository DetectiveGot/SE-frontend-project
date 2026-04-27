import { Rating } from "@mui/material";
import Link from "next/link";

export default function RatingSort({value}: {value: number}) {
  return(
    <div>
        <Rating
        readOnly
            id='rating' name='rating'
            defaultValue={value} 
            sx={{
            zIndex: 2,
            fontSize: "1.3rem",
            "& .MuiRating-icon svg": {
                strokeWidth: 0.4,
            },

            "& .MuiRating-iconFilled svg": {
                fill: "url(#starGradient)",
                stroke: "black",
            },

            "& .MuiRating-iconEmpty": {
                display: "none",
            }   
        }}/>
    </div>
  );
}