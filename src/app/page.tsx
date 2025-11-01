"use client"
import GraphVisualization from "@/components/graph-visualization";
import { GraphProvider } from "@/contexts/GraphContext";
import AppBar from "@/components/appbar";
import FabBar from "@/components/fabbar";

export default function Home() {
    return (
        <main className="flex flex-col h-screen w-screen">
            <GraphProvider>
                <AppBar />
                <GraphVisualization />
                <FabBar />
            </GraphProvider>
        </main>
    );
}