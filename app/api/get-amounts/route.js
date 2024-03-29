import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    console.log("Received POST request to /api/get-amounts");
    const { CustomerID } = await request.json();

    const amounts = await Promise.all(
      CustomerID.map(async (id) => {
        const cashBalance = await stripe.customers.retrieveCashBalance(id);
        return { CustomerID: id, Amount: cashBalance.available.eur };
      })
    );
    return NextResponse.json(amounts, { status: 200 });
  } catch (error) {
    console.error("Error fetching customer balances:", error);
    return NextResponse.json({ error: "An error occurred while fetching the customer balances." }, { status: 500 });
  }
}