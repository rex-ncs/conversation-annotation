import { redirect } from "next/navigation";
import { getLoggedInUser } from "../actions/auth";
import Annotation from "./annotation";

export default async function Annotate() {
    const user = await getLoggedInUser();
    if (!user) {
      redirect("/login");
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold m-2">Start Annotation Session</h1>
              <p className="text-muted-foreground">
                Select a metric you want to evaluate for each conversation in this session.
              </p>
            </div>
            <Annotation user={user}/>
        </div>
    )
}