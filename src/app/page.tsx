"use client"
import { useRef, useState } from "react";
import GraphSettings from "@/components/graph-settings";
import GraphVisualization from "@/components/graph-visualization";
import { Graph } from "@/types";

export default function Home() {
    const dragConstraintRef = useRef<HTMLElement | null>(null);
    const [graph, setGraph] = useState<Graph>({
        mode: 'classes'
    });

    return (
        <main ref={dragConstraintRef} className="bg-gray-700 h-screen overflow-hidden w-screen">
            <GraphSettings
                dragConstraintRef={dragConstraintRef}
                graph={graph}
                setGraph={setGraph}
            />

            <GraphVisualization
                graph={graph}
                setGraph={setGraph}
            />
        </main>
    );
}