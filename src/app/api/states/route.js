import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const states = await prisma.state.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        lgas: {
          orderBy: {
            name: "asc",
          },
        },
      },
    });

    return NextResponse.json({ states }, { status: 200 });
  } catch (error) {
    console.error("Fetch states error:", error);

    return NextResponse.json(
      { message: "Unable to retrieve states." },
      { status: 500 }
    );
  }
}