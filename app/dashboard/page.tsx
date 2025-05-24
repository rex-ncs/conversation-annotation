import MetricsTable from "@/app/dashboard/metrics-table";
import AnnotationsTable from "@/app/dashboard/annotations-table";
import { getAnnotationsWithDetails } from "../actions/annotation";

export default async function Dashboard() {
  const annotations = await getAnnotationsWithDetails(); // Fetch annotations data

  return (
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Overview of all conversations and metrics</p>
          <MetricsTable />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">Annotations</h2>
          <AnnotationsTable annotations={annotations}/>
        </div>
      </main>
  )
}