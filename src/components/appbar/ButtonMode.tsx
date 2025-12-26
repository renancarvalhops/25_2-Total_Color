import { RippleButton } from "@/components/ui/shadcn-io/ripple-button";
import { useGraph } from "@/contexts/GraphContext";
import FreeGraph from "@/lib/graphs/FreeGraph";
import { Modes } from "@/types";
import { PlusIcon } from "lucide-react";
import { motion } from "motion/react";

interface ButtonModeProps {
    mode: Modes,
    text: string
}

export default function ButtonMode({
    mode,
    text
}: ButtonModeProps) {
    const { graph, graphView, changeGraphViewMode } = useGraph();

    if (!graphView.active || !(graph instanceof FreeGraph)) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <RippleButton
                variant={'outline'}
                className={`
                    ${graphView.mode === mode &&
                    "border-amber-500 bg-amber-500 hover:bg-amber-500 hover:text-white text-white"}`
                }
                onClick={() => changeGraphViewMode(mode)}
            >
                <PlusIcon />

                {text}
            </RippleButton>
        </motion.div>
    );
}