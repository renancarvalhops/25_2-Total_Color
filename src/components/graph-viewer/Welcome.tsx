import { motion } from "motion/react";
import { WritingText } from "../ui/shadcn-io/writing-text";
import GraphGenerator from "../graph-generator";
import { Button } from "../ui/button";

export default function Welcome() {
    return (
        <motion.div className="flex flex-col gap-24">
            <motion.div>
                <WritingText
                    text="Bem-vindo(a) ao Total-Color 😎"
                    className="text-2xl lg:text-4xl select-none"
                    inView={true}
                    spacing=".5rem"
                    transition={{
                        type: "spring",
                        bounce: 0.6,
                        duration: 2,
                        delay: .3
                    }}
                />
            </motion.div>

            <motion.div
                className="flex flex-col gap-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, delay: 2 }}
            >
                <GraphGenerator tabDefaultValue="classes">
                    <Button>Iniciar com uma classe</Button>
                </GraphGenerator>

                <GraphGenerator tabDefaultValue="free">
                    <Button>Iniciar no modo livre</Button>
                </GraphGenerator>
            </motion.div>

        </motion.div>
    );
}