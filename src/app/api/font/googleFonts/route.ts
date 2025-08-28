import { WebFontItem } from "@/app/dashboard/page";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: Request) {
  const apiKey = process.env.GOOGLE_FONTS_API_KEY;
  try {
    const googleFontsResponse = await fetch(
      `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&sort=popularity`,
      {
        method: "GET",
      }
    );

    const fonts = await googleFontsResponse.json();

    console.log("fonts google", fonts);

    return NextResponse.json(fonts);
  } catch (error) {
    console.error(error);
  }
}
