import { NextRequest } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { fontUrl } = body;

  const res = await fetch(fontUrl);
  const arrayBuffer = await res.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  return new Response(`data:font/ttf;base64,${base64}`, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
