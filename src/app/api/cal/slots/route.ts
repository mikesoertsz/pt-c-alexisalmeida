import { NextResponse } from "next/server";
import { fetchCalAvailableSlots } from "@/lib/cal";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const eventTypeSlug = searchParams.get("eventTypeSlug")?.trim();
  const start = searchParams.get("start")?.trim();
  const end = searchParams.get("end")?.trim();
  const timeZone = searchParams.get("timeZone")?.trim() || "Europe/Lisbon";

  if (!eventTypeSlug || !start || !end) {
    return NextResponse.json({ error: "Missing eventTypeSlug, start, or end" }, { status: 400 });
  }

  try {
    const data = await fetchCalAvailableSlots({ eventTypeSlug, start, end, timeZone });
    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Slots request failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
