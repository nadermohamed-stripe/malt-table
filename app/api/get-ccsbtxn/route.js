// pages/api/get-cash-balance.js
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    console.log("Received POST request to /api/get-ccsbtxn");
    const { CustomerID } = await request.json();

    const customerCashBalanceData = await Promise.all(
      CustomerID.map(async (id) => {
        const transactions = await stripe.customers.listCashBalanceTransactions(id, {
          limit: 10,
        });
        const fundedTransactions = transactions.data.filter((transaction) => transaction.funded);
        const netAmount =
          fundedTransactions.reduce((total, transaction) => total + transaction.net_amount, 0);
        return {
          CustomerID: id,
          CashBalanceTransactions: fundedTransactions,
          NetAmount: netAmount,
        };
      })
    );
    return NextResponse.json(customerCashBalanceData, { status: 200 });
  } catch (error) {
    console.error("Error fetching customer cash balance data:", error);
    return NextResponse.json({ error: "An error occurred while fetching the customer cash balance data." }, { status: 500 });
  }
}