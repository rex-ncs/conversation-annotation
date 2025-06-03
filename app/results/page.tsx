import { getMetrics } from "../actions/metrics";
import { getAllUserRole } from "../actions/auth";
import { getAnnotationsByMetricWithDetails } from "../actions/annotation";
import ResultsTable from "./results-table";

export default async function ResultsPage({ searchParams }: { searchParams: { metricId?: string } }) {
  const metrics = await getMetrics();
  const users = await getAllUserRole();
  const metricId = searchParams.metricId ? parseInt(searchParams.metricId) : metrics[0]?.id;
  const annotations = metricId ? await getAnnotationsByMetricWithDetails(metricId) : [];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Results</h1>
      <ResultsTable metrics={metrics} users={users} annotations={annotations} selectedMetricId={metricId} />
    </div>
  );
}
