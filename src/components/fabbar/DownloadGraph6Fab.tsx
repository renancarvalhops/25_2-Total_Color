import { useGraph } from "@/contexts/GraphViewContext";
import Graph6 from "@/lib/graphs/Graph6";
import { DownloadIcon, LoaderCircleIcon } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export default function DownloadGraph6Fab() {
    const { graph, graphView } = useGraph();
    const [graph6File, setGraph6File] = useState<Blob>();

    useEffect(() => {
        const blob = new Blob([Graph6.parse(graph.matrix)]);
        setGraph6File(blob);
    }, [graphView.renderings]);

    if (graphView.renderings < 1) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="border border-gray-200 bg-white bottom-8 cursor-pointer fixed flex gap-2 hover:opacity-60 left-8 p-2 rounded duration-300 w-fit z-10"
        >
            <div className="flex">
                {graph6File ? <DownloadIcon /> : <LoaderCircleIcon className="animate-spin" />}
            </div>
            <a
                download={`${graphView.name}.g6`}
                href={graph6File ? URL.createObjectURL(graph6File) : ''}
            >
                Baixar em graph6
            </a>
        </motion.div>
    );
}