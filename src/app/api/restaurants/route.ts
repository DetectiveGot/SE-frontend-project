import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/getUser";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
    try {
        const user = await getUser();
        
        if(!user) {
            return NextResponse.json({
                success: false, 
                message: 'Not authorized',
            }, {
                status: 401
            });
        }
        
        console.log("GET Restaurant With User... ",user.userName);

        const res = await fetch(`${process.env.BACKEND_URL}/api/v1/restaurants`,{
            method: "GET",
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
            cache: "no-store",
        });

        if (!res.ok) {
            return NextResponse.json(
                { success: false, message: "Backend error" },
                { status: res.status }
            );
        }

        const data = await res.json();

        return NextResponse.json({ success: true, data: data, });

    } catch (err) {
        return NextResponse.json(
            { success: false, message: "Fetch failed" },
            { status: 500 }
        )
    }
}

export async function POST(req: NextRequest) {
    try {
        const token = (await cookies()).get('token')?.value;
        if(!token || token === 'null') {
            return NextResponse.json({
                    success: false,
                    message: 'Not authorized',
                },
                {
                    status: 401,
                }
            );
        }
        const body = await req.json();
        // console.log(body);
        const resp = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/restaurants`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(body),
        });
        const data = await resp.json().catch(() => null);

        // console.log(data);

        return NextResponse.json(data, {
            status: resp.status
        });
    } catch(err) {
        console.log(err);
        return NextResponse.json({
            success: false,
            message: 'Cannot create Restaurant'
        }, {
            status: 500
        });
    }
}
