import { getConversations } from "../actions/conversations";
import { getMetrics } from "../actions/metrics";
import AnnotationBody from "./body";

export default async function Annotate() {
    const metrics = await getMetrics();
    const conversationsRaw = await getConversations();
    const conversations = conversationsRaw.map(({ ConversationMessages, ...rest }: any) => ({
        ...rest,
        messages: ConversationMessages
    }));
    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold m-2">Start Annotation Session</h1>
              <p className="text-muted-foreground">
                Select a metric you want to evaluate for each conversation in this session.
              </p>
            </div>
            <AnnotationBody metrics={metrics} conversations={conversations} />
        </div>
    )
}