import { PlusIcon, PyramidIcon } from "lucide-react";
import GraphSettings from "../graph-settings";
import { motion } from "motion/react";

export default function FabBar() {
    return (
        <motion.menu
            className="bottom-0 fixed flex flex-row-reverse p-8 w-screen z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
        >
            <GraphSettings>
                <div className="border border-gray-200 bg-white cursor-pointer flex gap-2 hover:opacity-60 p-2 rounded duration-300 w-auto">
                    <div className="flex">
                        <PyramidIcon />
                        <PlusIcon size={15}/>
                    </div>

                    Criar grafo
                </div>
            </GraphSettings>
        </motion.menu>
    );
}