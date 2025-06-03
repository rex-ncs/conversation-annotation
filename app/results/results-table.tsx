"use client";

import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
}
interface Metric {
  id: number;
  name: string;
}
interface Conversation {
  id: string;
  Annotation: any[];
}

interface ResultsTableProps {
  metrics: Metric[];
  users: User[];
  initialMetricId: number;
}

export default function ResultsTable({ metrics, users, initialMetricId }: ResultsTableProps) {
  const [metricId, setMetricId] = useState(initialMetricId);
  const [page, setPage] = useState(1);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [total, setTotal] = useState(0);
  const pageSize = 10;
  const totalPages = Math.ceil(total / pageSize);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`/api/results?metricId=${metricId}&page=${page}`);
      const data = await res.json();
      setConversations(data.conversations);
      setTotal(data.total);
    }
    fetchData();
  }, [metricId, page]);

  function getVerdict(conversation: any, userId: number) {
    const ann = conversation.Annotation.find((a: any) => a.userId === userId);
    return ann ? ann.verdict : "-";
  }

  return (
    <div>
      <form className="mb-6 flex gap-4 items-center" onSubmit={e => e.preventDefault()}>
        <label htmlFor="metric" className="font-medium">Metric:</label>
        <Select value={metricId.toString()} onValueChange={v => { setMetricId(Number(v)); setPage(1); }}>
          <SelectTrigger className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {metrics.map((m) => (
              <SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </form>
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b bg-gray-50">Conversation ID</th>
              {users.map((u) => (
                <th key={u.id} className="px-4 py-2 border-b bg-gray-50">{u.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {conversations.map((conv) => (
              <tr key={conv.id}>
                <td className="px-4 py-2 border-b font-mono">{conv.id}</td>
                {users.map((user) => {
                  const annotation = conv.Annotation.find(a => a.userId === user.id);
                  return (
                    <td
                      key={user.id}
                      className={`
                        px-4 py-2 text-center
                        ${
                          annotation?.verdict === "pass"
                            ? "bg-green-100 text-green-800"
                            : annotation?.verdict === "fail"
                            ? "bg-red-100 text-red-800"
                            : ""
                        }
                      `}
                    >
                      {annotation?.verdict ?? "-"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <span>Page {page} of {totalPages}</span>
        <div className="flex gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className={`px-3 py-1 rounded border ${page <= 1 ? 'opacity-50 pointer-events-none' : ''}`}>Prev</button>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className={`px-3 py-1 rounded border ${page >= totalPages ? 'opacity-50 pointer-events-none' : ''}`}>Next</button>
        </div>
      </div>
    </div>
  );
}
