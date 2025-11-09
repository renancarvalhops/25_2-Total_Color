"use client"
import GraphViewer from "@/components/graph-viewer";
import AppBar from "@/components/appbar";
import FabBar from "@/components/fabbar";
import { GraphViewProvider } from "@/contexts/GraphViewContext";

export default function Home() {
    return (
        <main className="flex flex-col h-screen overflow-hidden w-screen">
            <GraphViewProvider>
                <AppBar />
                <GraphViewer />
                <FabBar />
            </GraphViewProvider>
        </main>
    );
}