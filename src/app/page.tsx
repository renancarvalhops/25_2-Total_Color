"use client"
import GraphViewer from "@/components/graph-viewer";
import AppBar from "@/components/appbar";
import FabBar from "@/components/fabbar";
import { GraphProvider } from "@/contexts/GraphContext";

export default function Home() {
    return (
        <main className="flex flex-col h-screen w-screen">
            <GraphProvider>
                <AppBar />
                <GraphViewer />
                <FabBar />
            </GraphProvider>
        </main>
    );
}