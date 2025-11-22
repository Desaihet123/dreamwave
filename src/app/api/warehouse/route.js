import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const warehouses = await prisma.warehouse.findMany({
      include: {
        stocks: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(
      { message: "Warehouses fetched successfully", warehouses },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get Warehouses Error:", error);
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { message: "Warehouse name is required" },
        { status: 400 }
      );
    }

    const warehouse = await prisma.warehouse.create({
      data: { name },
    });

    return NextResponse.json(
      { message: "Warehouse created successfully", warehouse },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Warehouse Error:", error);
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
