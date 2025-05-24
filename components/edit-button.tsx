"use client";

import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

interface EditButtonProps {
    conversationId: string;
    metricId: number;
}

export default function EditButton({ conversationId, metricId }: EditButtonProps) {
    const router = useRouter();

    const handleEdit = () => {
        router.push(`/annotate?conversationId=${conversationId}&metricId=${metricId}`);
    }

    return (
        <button onClick={handleEdit} className="text-blue-500 hover:text-blue-700" title="Edit">
            <Pencil size={18} />
        </button>
    )
}