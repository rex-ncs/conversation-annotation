import { redirect } from "next/navigation";
import { getLoggedInUser } from "../actions/auth";
import Annotation from "./annotation";

export default async function Annotate() {
    const user = await getLoggedInUser();
    if (!user) {
      redirect("/");
    }

    return (
        <div className="w-full mx-auto">
            <div className="text-center mb-4">
              <p className="mt-3 text-red-500">Instructions: Evaluation should be done only on the last conversation. The conversation history provides the context.</p>
            </div>
            <Annotation user={user}/>
        </div>
    )
}