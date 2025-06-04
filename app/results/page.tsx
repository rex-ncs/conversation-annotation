import { getMetrics } from "../actions/metrics";
import { getAllUserRole } from "../actions/auth";
import { getAnnotationsByMetricWithDetails } from "../actions/annotation";
import ResultsTable from "./results-table";
import fs from "fs";
import path from "path";

interface ResultsPageProps {
  searchParams?: {
    metricId?: string;
  };
}

export default async function ResultsPage({
  searchParams,
}: ResultsPageProps & {
  // @ts-ignore - Force override the conflicting PageProps type
  searchParams?: any;
}) {
  const metrics = await getMetrics();
  const users = await getAllUserRole();
  const metricId = searchParams?.metricId ? parseInt(searchParams.metricId) : metrics[0]?.id;
  const annotations = metricId ? await getAnnotationsByMetricWithDetails(metricId) : [];

  // Load extra scores from data folder (example: Extraction metric)
  let extraScores: Record<string, boolean> = {};
  try {
    const dataPath = path.join(process.cwd(), "data", "evaluation_extraction_1.json");
    const file = fs.readFileSync(dataPath, "utf-8");
    const json = JSON.parse(file);
    // Flatten the array of objects into a single map
    for (const entry of json.score) {
      const [convId, score] = Object.entries(entry)[0];
      extraScores[convId] = Boolean(score); // keep as boolean
    }
  } catch (e) {
    // If file not found or error, leave extraScores empty
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Results</h1>
      <ResultsTable metrics={metrics} users={users} annotations={annotations} selectedMetricId={metricId} extraScores={extraScores} />
    </div>
  );
}
