import { useGraph } from "@/contexts/GraphContext";
import { motion } from "motion/react";
import { RippleButton } from "../ui/shadcn-io/ripple-button";
import { PiGraph } from "react-icons/pi";

export default function NewGraph() {
    const { graphView, resetGraph } = useGraph();

    if (!graphView.active) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <RippleButton className="w-full" variant={'outline'} onClick={resetGraph}>
                <PiGraph />
                Novo grafo
            </RippleButton>
        </motion.div>
    );
}