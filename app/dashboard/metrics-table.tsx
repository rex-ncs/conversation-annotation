import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { getMetrics } from "@/app/actions/metrics";

export default async function MetricsTable() {
    const metrics = await getMetrics();
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Metrics Overview
                </CardTitle>
            </CardHeader>
            <CardContent>
            {!metrics && <span>No Metrics Found!</span>}
            <div className="space-y-4">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border rounded-lg">
                        <thead>
                            <tr className="bg-muted">
                                <th className="px-4 py-2 text-left font-semibold">ID</th>
                                <th className="px-4 py-2 text-left font-semibold">Name</th>
                                <th className="px-4 py-2 text-left font-semibold">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {metrics?.map((metric) => (
                                <tr key={metric.id} className="border-t">
                                    <td className="px-4 py-2">{metric.id}</td>
                                    <td className="px-4 py-2">{metric.name}</td>
                                    <td className="px-4 py-2">{metric.definition}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            </CardContent>
        </Card>
    )
}