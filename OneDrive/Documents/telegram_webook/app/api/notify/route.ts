import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const email = searchParams.get("email");
  const name = searchParams.get("name");
  const phone = searchParams.get("phone");

  return NextResponse.json({
    ok: true,
    received: {
      email,
      name,
      phone,
    },
  });
}
