import { notFound } from "next/navigation";
import { cookies, headers } from "next/headers";
import ReservationClient from "../../../clientServer/Reservation/ReservationClient";
import Light from "@/components/ui/Light";

export default async function ReservationPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

    const h = await headers();
    const reservationsRes = await fetch(`${process.env.BACKEND_URL}/api/v1/reservations`, {
        cache: 'no-store',
        headers: {
          Authorization: `Bearer ${token}`,
        }
    });
    if(!reservationsRes.ok) {
        notFound();
    }
    const reservationsData = await reservationsRes.json();
    const reservations = reservationsData.data;
    
    return (
        <div className="w-full min-h-dvh flex flex-col px-4 sm:px-12">
            <Light/>
            <ReservationClient initReservation={reservations}/>
        </div>
    )
}