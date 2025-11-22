import { useGraph } from "@/contexts/GraphContext";
import { DownloadIcon, LoaderCircleIcon } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { RippleButton } from "../ui/shadcn-io/ripple-button";
import Graph6 from "graph6";

export default function DownloadGraph6() {
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
        >           
            <a
                download={`${graphView.name}.g6`}
                href={graph6File ? URL.createObjectURL(graph6File) : ''}
            >
                <RippleButton variant={'outline'}>
                    {graph6File ? <DownloadIcon /> : <LoaderCircleIcon className="animate-spin" />}
                    <span className="hidden lg:inline">Baixar em graph6</span>
                </RippleButton>
            </a>
        </motion.div>
    );
}