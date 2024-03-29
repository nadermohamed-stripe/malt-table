import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        console.log("Received POST request to /api/test");
        return NextResponse.json({ message: "Hello from the API!" }, { status: 200 });
    } catch (error) {
        console.error("Error fetching customer balances:", error);
        return NextResponse.json({ error: "An error occurred while fetching the customer balances." }, { status: 500 });
    }
}
