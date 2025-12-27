import { useGraph } from "@/contexts/GraphContext";
import { PaletteIcon } from "lucide-react";
import { motion } from "motion/react";
import { RippleButton } from "../ui/shadcn-io/ripple-button";

export default function ShowColoring() {
    const { viewColoring } = useGraph();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <RippleButton className="w-full" variant={'outline'} onClick={() => viewColoring()}>
                <PaletteIcon />
                Apresentar Coloração
            </RippleButton>
        </motion.div>
    );
}