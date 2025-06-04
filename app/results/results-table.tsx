"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import { Metric, User, Annotation } from "@/lib/types";
import { useRouter, useSearchParams } from "next/navigation";
import { exportConversationsToExcel } from "@/utils/export";

const PAGE_SIZE = 10;

interface ResultsTableProps {
  metrics: Metric[];
  users: User[];
  annotations: (Annotation & { conversation: { id: string }, user: User })[];
  selectedMetricId: number;
  extraScores?: Record<string, boolean>; // Add extraScores prop
}

function verdictColor(verdict: string | undefined) {
  if (verdict === "pass" || verdict === "PASS") return "bg-green-200 text-green-800";
  if (verdict === "fail" || verdict === "FAIL") return "bg-red-200 text-red-800";
  return "";
}

export default function ResultsTable({ metrics, users, annotations, selectedMetricId, extraScores }: ResultsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(0);
  const [popup, setPopup] = useState<{
    x: number, y: number, comment: string, verdict: string, convId: string, userId: number
  } | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

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

  // Prepare data for export
  const handleExport = async () => {
    // Build conversations array with Annotation array for each conversation
    const conversationsForExport = conversations.map(conv => ({
      id: conv.id,
      Annotation: users.map(user => {
        const verdict = verdictMap[conv.id]?.[user.id];
        return verdict ? { userId: user.id, verdict } : null;
      }).filter(Boolean)
    }));
    const metricName = metrics.find(m => m.id === selectedMetricId)?.name || "Metric";
    const blob = await exportConversationsToExcel(conversationsForExport, users, metricName);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `results-${metricName}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Find comment for a given conversation and user
  const getComment = (convId: string, userId: number) => {
    const ann = annotations.find(a => a.conversationId === convId && a.userId === userId);
    return ann?.comments || "";
  };

  // Close popup on click outside or Escape
  useEffect(() => {
    if (!popup) return;
    const handler = (e: MouseEvent | KeyboardEvent) => {
      if (
        e instanceof MouseEvent &&
        popupRef.current &&
        !popupRef.current.contains(e.target as Node)
      ) {
        setPopup(null);
      }
      if (e instanceof KeyboardEvent && e.key === "Escape") {
        setPopup(null);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", handler);
    };
  }, [popup]);

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
        <button
          className="ml-auto px-3 py-1 border rounded bg-blue-600 text-white hover:bg-blue-700"
          onClick={handleExport}
        >
          Export to Excel
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead>
            <tr>
              <th className="border px-2 py-1 bg-gray-50">Conversation</th>
              {/* Extra Score column header */}
              {extraScores && <th className="border px-2 py-1 bg-gray-50">Score</th>}
              {users.map(u => (
                <th key={u.id} className="border px-2 py-1 bg-gray-50">{u.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pagedConversations.map(conv => (
              <tr key={conv.id}>
                <td className="border px-2 py-1 max-w-xs truncate" title={conv.id}>{conv.id}</td>
                {/* Extra Score cell */}
                {extraScores && (
                  <td
                    className={`border px-2 py-1 text-center ${
                      verdictColor(extraScores[conv.id] === true ? "pass" : extraScores[conv.id] === false ? "fail" : undefined)
                    }`}
                  >
                    {extraScores[conv.id] === true
                      ? "pass"
                      : extraScores[conv.id] === false
                        ? "fail"
                        : <span className="text-gray-400 italic">-</span>}
                  </td>
                )}
                {users.map(u => {
                  const verdict = verdictMap[conv.id]?.[u.id];
                  const comment = getComment(conv.id, u.id);
                  return (
                    <td
                      key={u.id}
                      className={`border px-2 py-1 text-center cursor-pointer ${verdictColor(verdict)}`}
                      onClick={e => {
                        const rect = (e.target as HTMLElement).getBoundingClientRect();
                        setPopup({
                          x: rect.right + window.scrollX + 8,
                          y: rect.top + window.scrollY,
                          comment,
                          verdict: verdict || "-",
                          convId: conv.id,
                          userId: u.id
                        });
                      }}
                    >
                      {verdict || "-"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {popup && (
          <div
            ref={popupRef}
            style={{
              position: "absolute",
              left: popup.x,
              top: popup.y,
              zIndex: 1000,
              minWidth: 200,
              maxWidth: 320,
              background: "white",
              border: "1px solid #ccc",
              borderRadius: 6,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              padding: "12px",
              fontSize: "0.95rem"
            }}
          >
            <div className="mb-2 font-semibold">
              Verdict: <span className={verdictColor(popup.verdict)}>{popup.verdict}</span>
            </div>
            <div>
              <span className="font-semibold">Comment:</span>
              <div className="mt-1 whitespace-pre-wrap text-gray-700">
                {popup.comment ? popup.comment : <span className="italic text-gray-400">No comment</span>}
              </div>
            </div>
            <button
              className="mt-3 px-2 py-1 border rounded text-xs bg-gray-100 hover:bg-gray-200"
              onClick={() => setPopup(null)}
            >
              Close
            </button>
          </div>
        )}
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
