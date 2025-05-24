import { getMetrics } from "../actions/metrics";
import { MetricSelection } from "./metric-selection";

export default async function MetricPage() {
    const metrics = await getMetrics();

    return (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-4">Select a Metric to Grade</h1>
            <p className="text-muted-foreground mb-6">Choose a metric to start grading on <b>unannotated</b> conversations.</p>
            <MetricSelection availableMetrics={metrics}/>
        </main>
    )
}