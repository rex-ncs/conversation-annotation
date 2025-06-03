import { getAllMetrics, getAllUsers } from "@/app/actions/results";
import ResultsTable from "./results-table";

export default async function ResultsPage() {
  // Only server logic here
  const metrics = await getAllMetrics();
  const users = await getAllUsers();
  const initialMetricId = metrics[0]?.id;

  return (
    <div className="p-6 max-w-full">
      <h1 className="text-2xl font-bold mb-4">Results by Metric</h1>
      <ResultsTable metrics={metrics} users={users} initialMetricId={initialMetricId} />
    </div>
  );
}
