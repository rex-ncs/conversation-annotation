import MetricsTable from "@/components/metrics-table";

export default function Dashboard() {
    return (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Overview of all conversations and metrics</p>
            <MetricsTable />
          </div>
        </main>
    )
}