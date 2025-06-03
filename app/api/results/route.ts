import { NextRequest } from "next/server";
import { getPaginatedConversationsWithAnnotations } from "@/app/actions/results";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const metricId = Number(searchParams.get("metricId"));
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = 10;
  if (!metricId) {
    return Response.json({ conversations: [], total: 0 });
  }
  const { conversations, total } = await getPaginatedConversationsWithAnnotations(metricId, page, pageSize);
  return Response.json({ conversations, total });
}
