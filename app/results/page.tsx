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

  // Dynamically load all evaluation files for the selected metric
  const dataDir = path.join(process.cwd(), "data");
  let extraScoresByFile: Record<string, Record<string, boolean>> = {};
  try {
    // Get the selected metric name (normalize for file matching)
    const selectedMetric = metrics.find(m => m.id === metricId);
    if (selectedMetric) {
      // Remove spaces and lowercase for matching (e.g., "Extraction" -> "extraction")
      const metricName = selectedMetric.name.replace(/\s+/g, "[ _]?").toLowerCase();
      // List all files in data dir
      const files = fs.readdirSync(dataDir);
      // Find all evaluation files for this metric
      const matchingFiles = files.filter(f => f.match(new RegExp(`^evaluation_${metricName}.*\\.json$`, 'i')));
      for (const file of matchingFiles) {
        const filePath = path.join(dataDir, file);
        const json = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        const scoreMap: Record<string, boolean> = {};
        for (const entry of json.score) {
          const [convId, score] = Object.entries(entry)[0];
          scoreMap[convId] = Boolean(score);
        }
        extraScoresByFile[file] = scoreMap;
      }
    }
  } catch (e) {
    // If error, leave extraScoresByFile empty
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Results</h1>
      <ResultsTable metrics={metrics} users={users} annotations={annotations} selectedMetricId={metricId} extraScoresByFile={extraScoresByFile} />
    </div>
  );
}
