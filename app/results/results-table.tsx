"use client";
import { useState, useMemo } from "react";
import { Metric, User, Annotation } from "@/lib/types";
import { useRouter, useSearchParams } from "next/navigation";

const PAGE_SIZE = 10;

interface ResultsTableProps {
  metrics: Metric[];
  users: User[];
  annotations: (Annotation & { conversation: { id: string }, user: User })[];
  selectedMetricId: number;
}

function verdictColor(verdict: string | undefined) {
  if (verdict === "pass" || verdict === "PASS") return "bg-green-200 text-green-800";
  if (verdict === "fail" || verdict === "FAIL") return "bg-red-200 text-red-800";
  return "";
}

export default function ResultsTable({ metrics, users, annotations, selectedMetricId }: ResultsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(0);

  // When metric changes, update URL to trigger server refetch
  const handleMetricChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMetricId = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set("metricId", newMetricId);
    router.push(`?${params.toString()}`);
    setPage(0);
  };

  // Get unique conversations
  const conversations = useMemo(() => {
    const map = new Map();
    annotations.forEach(a => {
      if (!map.has(a.conversationId)) map.set(a.conversationId, a.conversation);
    });
    return Array.from(map.values());
  }, [annotations]);

  // Build verdict lookup: { [conversationId]: { [userId]: verdict } }
  const verdictMap: Record<string, Record<number, string>> = useMemo(() => {
    const map: Record<string, Record<number, string>> = {};
    annotations.forEach((a) => {
      if (!map[a.conversationId]) map[a.conversationId] = {};
      map[a.conversationId][a.userId] = a.verdict;
    });
    return map;
  }, [annotations]);

  // Pagination
  const pageCount = Math.ceil(conversations.length / PAGE_SIZE);
  const pagedConversations = conversations.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div>
      <div className="flex gap-4 mb-4 items-center">
        <label className="font-semibold">Metric:</label>
        <select
          className="border rounded px-2 py-1"
          value={selectedMetricId}
          onChange={handleMetricChange}
        >
          {metrics.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead>
            <tr>
              <th className="border px-2 py-1 bg-gray-50">Conversation</th>
              {users.map(u => (
                <th key={u.id} className="border px-2 py-1 bg-gray-50">{u.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pagedConversations.map(conv => (
              <tr key={conv.id}>
                <td className="border px-2 py-1 max-w-xs truncate" title={conv.id}>{conv.id}</td>
                {users.map(u => {
                  const verdict = verdictMap[conv.id]?.[u.id];
                  return (
                    <td key={u.id} className={`border px-2 py-1 text-center ${verdictColor(verdict)}`}>
                      {verdict || "-"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
        >Prev</button>
        <span>Page {page + 1} of {pageCount}</span>
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => setPage(p => Math.min(pageCount - 1, p + 1))}
          disabled={page >= pageCount - 1}
        >Next</button>
      </div>
    </div>
  );
}
