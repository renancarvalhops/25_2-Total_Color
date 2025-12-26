import { InstructionsText } from "../graph-viewer/InfoPanel";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { RippleButton } from "../ui/shadcn-io/ripple-button";
import { CgNotes } from "react-icons/cg";
import { motion } from "motion/react";
import { useGraph } from "@/contexts/GraphContext";

export default function Instructions() {
    const { graphView } = useGraph();

    if (!graphView.active) {
        return null;
    }
    
    return (
        <Dialog>
            <DialogTrigger asChild>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >   
                    <RippleButton variant={'outline'}>
                        <CgNotes />
                        <span>Instruções</span>
                    </RippleButton>
                </motion.div>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Instruções</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <InstructionsText />
            </DialogContent>
        </Dialog>
    );
}