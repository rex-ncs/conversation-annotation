"use client";
import { useState } from "react"
import { ConversationDisplay } from "./conversation-display";
import MetricDisplay from "./metric-display";
import AnnotateForm from "./annotate-form";
import { Conversation, Metric } from "@/lib/types";

interface AnnotateConversationFormProps {
  selectedMetric: Metric;
  conversations: Conversation[];
}

export default function AnnotateConversationForm({selectedMetric, conversations}: AnnotateConversationFormProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  

  return (
      <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">
                Conversation {currentIndex + 1} of {conversations.length}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
            <div className="lg:col-span-3 flex flex-col">
              <ConversationDisplay conversation={conversations[currentIndex]} />
            </div>
            <div className="lg:col-span-3 space-y-6">
              <MetricDisplay metric={selectedMetric} />
              <AnnotateForm  />
            </div>
          </div>
        </div>
  )
}