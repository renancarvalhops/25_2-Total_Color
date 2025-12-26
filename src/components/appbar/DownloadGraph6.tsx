import { useGraph } from "@/contexts/GraphContext";
import { FileType2Icon, LoaderCircleIcon } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { RippleButton } from "../ui/shadcn-io/ripple-button";
import Graph6 from "graph6";

export default function DownloadGraph6() {
    const { graph, graphView } = useGraph();
    const [isDownloading, setIsDownloading] = useState(false);

    const download = () => {
        setIsDownloading(true);

        const blob = new Blob([Graph6.parse(graph.matrix)]);
        const a = document.createElement('a');

        a.download = `${graphView.name}.g6`;
        a.href = URL.createObjectURL(blob);
        a.click();

        setIsDownloading(false);
    };

    if (!graphView.active) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >           
            <RippleButton variant={'outline'} onClick={download}>
                {isDownloading ? <LoaderCircleIcon className="animate-spin" /> : <FileType2Icon />}

                Baixar em graph6
            </RippleButton>
        </motion.div>
    );
}