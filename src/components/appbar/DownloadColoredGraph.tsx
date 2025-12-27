import { useGraph } from "@/contexts/GraphContext";
import { DownloadIcon, LoaderCircleIcon } from "lucide-react";
import { motion } from "motion/react";
import { RippleButton } from "../ui/shadcn-io/ripple-button";
import { Coloring } from "@/lib/graphs/types";

export default function DownloadColoredGraph() {
    const { graphView } = useGraph();

    const download = () => {
        const verticesColoring: Coloring = new Map();
        const edgesColoring: Coloring = new Map();

        graphView.displayedColoring.forEach((color, element) => {
            if (element.split(" ").length === 1) {
                verticesColoring.set(element, color);
            } else {
                edgesColoring.set(element, color);
            }
        });

        let fileContent = "";
        
        fileContent += `${verticesColoring.size}\n`;
        verticesColoring.forEach((color, vertex) => {
            fileContent += `${vertex} ${color}\n`;
        });

        fileContent += `${edgesColoring.size}\n`;
        edgesColoring.forEach((color, edge) => {
            fileContent += `${edge} ${color}\n`;
        });

        const blob = new Blob([fileContent]);
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${graphView.name}_col.txt`;
        a.click();
    };

    if (graphView.displayedColoring.size === 0) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >           
            <RippleButton className="w-full" variant={'outline'} onClick={download}>
                {true ? <DownloadIcon /> : <LoaderCircleIcon className="animate-spin" />}

                Baixar grafo com coloração
            </RippleButton>
        </motion.div>
    );
}