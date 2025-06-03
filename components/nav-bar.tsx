"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { LayoutDashboard, MessageSquare, Upload, BarChart2 } from "lucide-react";
import { usePathname } from "next/navigation";

interface NavBarProps {
    isAdmin?: boolean;
}

export default function NavBar({ isAdmin = false }: NavBarProps) {
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
            {isAdmin && (
                <>
                    <Link href="/upload">
                        <Button
                            variant={pathname === "/upload" ? "outline" : "ghost"}
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <Upload className="h-4 w-4" />
                            Upload
                        </Button>
                    </Link>
                    <Link href="/results">
                        <Button
                            variant={pathname === "/results" ? "outline" : "ghost"}
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <BarChart2 className="h-4 w-4" />
                            Results
                        </Button>
                    </Link>
                </>
            )}
        </nav>
    );
}