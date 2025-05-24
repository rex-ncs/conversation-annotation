"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Annotation } from "@/lib/types";
import EditButton from "@/components/edit-button";

const PAGE_SIZE = 5;

interface AnnotationsTableProps {
  annotations: Annotation[];
}

export default function AnnotationsTable({ annotations }: AnnotationsTableProps) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(annotations.length / PAGE_SIZE);
  const paginated = annotations.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="overflow-x-auto border rounded-lg mt-8">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Chat ID</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Metric</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Verdict</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Edit</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {paginated.map((a: Annotation) => (
            <tr key={a.id}>
              <td className="px-4 py-2 font-mono">{a.conversationId}</td>
              <td className="px-4 py-2">{a.metric?.name ?? "-"}</td>
              <td className="px-4 py-2">
                <Badge variant={a.verdict === "pass" ? "default" : "destructive"}>
                  {a.verdict}
                </Badge>
              </td>
              <td className="px-4 py-2">
                <EditButton conversationId={a.conversationId} metricId={a.metricId} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center items-center gap-2 py-4">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}