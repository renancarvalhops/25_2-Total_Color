"use client"
import { useRef } from "react";
import GraphSettings from "@/components/graph-settings";
import GraphVisualization from "@/components/graph-visualization";
import { GraphProvider } from "@/contexts/GraphContext";

export default function Home() {
    const dragConstraintRef = useRef<HTMLElement | null>(null);

    return (
        <main ref={dragConstraintRef} className="bg-gray-700 h-screen overflow-hidden w-screen">
            <GraphProvider>
                <GraphSettings dragConstraintRef={dragConstraintRef} />
                <GraphVisualization />
            </GraphProvider>
        </main>
    );
}