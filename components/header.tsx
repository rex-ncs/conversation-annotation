import { Button } from "@/components/ui/button"
import { UserCircle } from "lucide-react"
import { logout } from "@/app/actions/auth"

export default async function Header( { username }: { username: string }) {

    return (
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Conversation Annotation Tool</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <UserCircle className="h-5 w-5" />
              <span>{username}</span>
            </div>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
    )
}