import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id_or_code: string } }
) {
  const subscriptionCode = params.id_or_code;

  try {
    const paystackRes = await fetch(
      `https://api.paystack.co/subscription/${subscriptionCode}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        method: "GET",
        cache: "no-store",
      }
    );

    const data = await paystackRes.json();

    if (!paystackRes.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to fetch subscription info" },
        { status: paystackRes.status }
      );
    }

    return NextResponse.json(data.data); // You can wrap it if needed
  } catch (err) {
    console.error("❌ Error fetching subscription:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
