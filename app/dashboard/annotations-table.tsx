import { getAnnotationsWithDetails } from "@/app/actions/annotation";
import { Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";
import { Annotation } from "@/lib/types";
import EditButton from "@/components/edit-button";

export default async function AnnotationsTable() {
  const annotations = await getAnnotationsWithDetails();

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
          {annotations.map((a: Annotation) => (
            <tr key={a.id}>
              <td className="px-4 py-2 font-mono">{a.conversationId}</td>
              <td className="px-4 py-2">{a.metric?.name ?? "-"}</td>
              <td className="px-4 py-2">
                <Badge variant={a.verdict==="pass" ? "default" : "destructive"}>
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
    </div>
  );
}