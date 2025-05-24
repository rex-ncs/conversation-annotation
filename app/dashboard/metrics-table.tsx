import { getMetrics } from "@/app/actions/metrics";

export default async function MetricsTable() {
    const metrics = await getMetrics();
    return (
        <div className="overflow-x-auto border rounded-lg mt-8">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
            {metrics && metrics.length > 0 ? (
                metrics.map((metric) => (
                <tr key={metric.id}>
                    <td className="px-4 py-2 font-mono">{metric.id}</td>
                    <td className="px-4 py-2">{metric.name}</td>
                    <td className="px-4 py-2">{metric.definition}</td>
                </tr>
                ))
            ) : (
                <tr>
                <td colSpan={3} className="px-4 py-4 text-center text-gray-500">
                    No Metrics Found!
                </td>
                </tr>
            )}
            </tbody>
        </table>
        </div>
    );
}