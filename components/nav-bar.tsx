"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { LayoutDashboard, MessageSquare } from "lucide-react";
import { usePathname } from "next/navigation";

export default function NavBar() {
    const pathname = usePathname();
    return (
        <nav className="flex items-center gap-4">
            <Link href="/dashboard">
                <Button
                variant={pathname === "/dashboard" ? "outline" : "ghost"}
                size="sm"
                className="flex items-center gap-2"
                >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
                </Button>
            </Link>
            <Link href="/metric">
                <Button
                variant={pathname === "/annotate" ? "outline" : "ghost"}
                size="sm"
                className="flex items-center gap-2"
                >
                <MessageSquare className="h-4 w-4" />
                Start Annotation
                </Button>
            </Link>
        </nav>
    )
}