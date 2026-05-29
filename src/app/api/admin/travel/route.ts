import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

function db() {
  const client = createServiceClient();
  if (!client) throw new Error("Supabase not configured");
  return client;
}

// GET /api/admin/travel — list all periods
export async function GET() {
  try {
    const { data, error } = await db()
      .from("travel_periods")
      .select("id, city, country, from_date, to_date, note, cal_slug, created_at")
      .order("from_date", { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data ?? []);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 503 });
  }
}

// POST /api/admin/travel — create a new period
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { city, country, from_date, to_date, note, cal_slug } = body;

    if (!city || !country || !from_date || !to_date) {
      return NextResponse.json({ error: "city, country, from_date, to_date are required" }, { status: 400 });
    }

    const { data, error } = await db()
      .from("travel_periods")
      .insert({ city, country, from_date, to_date, note: note || null, cal_slug: cal_slug || null })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 503 });
  }
}

// DELETE /api/admin/travel?id=... — delete a period by id
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    const { error } = await db()
      .from("travel_periods")
      .delete()
      .eq("id", id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 503 });
  }
}
