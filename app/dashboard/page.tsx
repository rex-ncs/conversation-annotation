import MetricsTable from "@/app/dashboard/metrics-table";
import AnnotationsTable from "@/app/dashboard/annotations-table";
import { getAnnotationsWithDetails } from "../actions/annotation";
import { redirect } from "next/navigation";
import { getLoggedInUser } from "../actions/auth";

export default async function Dashboard() {
  const user = await getLoggedInUser(); // Ensure the user is logged in
  if (!user) {
    redirect('/');
  }
  const annotations = await getAnnotationsWithDetails(user.id); // Fetch only this user's annotations

  return (
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Metrics</h2>
          <MetricsTable />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">Annotations</h2>
          <p className="text-muted-foreground mb-6">Click on the pencil to edit <b>annotated</b> conversation.</p>
          <AnnotationsTable annotations={annotations}/>
        </div>
      </main>
  )
}