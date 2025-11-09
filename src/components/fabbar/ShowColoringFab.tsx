import { useGraphView } from "@/contexts/GraphViewContext";
import { PaletteIcon } from "lucide-react";
import { motion } from "motion/react";

export default function ShowColoringFab() {
    const { graphView, viewColoring } = useGraphView();

    if (!graphView.graph.totalColoring) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="border border-gray-200 bg-white bottom-24 cursor-pointer fixed flex gap-2 hover:opacity-60 left-8 p-2 rounded duration-300 w-fit z-10"
            onClick={() => viewColoring()}
        >
            <div className="flex">
                <PaletteIcon />
            </div>

            Apresentar Coloração
        </motion.div>
    );
}