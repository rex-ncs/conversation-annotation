import { redirect } from "next/navigation";
import { getLoggedInUser } from "../actions/auth";
import Annotation from "./annotation";

export default async function Annotate() {
    const user = await getLoggedInUser();
    if (!user) {
      redirect("/login");
    }

    return (
        <div className="w-full mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold m-2">Annotation Session</h1>
            </div>
            <Annotation user={user}/>
        </div>
    )
}