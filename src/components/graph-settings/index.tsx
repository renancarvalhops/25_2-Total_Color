"use client"
import { Settings2 } from "lucide-react";
import { motion } from "motion/react";
import { Dispatch, RefObject, SetStateAction, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ClassesSettings from "./classes";
import { Graph } from "@/types";
import FreeSettings from "./free";

interface GraphSettingsProps {
    dragConstraintRef: RefObject<HTMLElement | null>,
    graph: Graph,
    setGraph: Dispatch<SetStateAction<Graph>>
}

export default function GraphSettings({
    dragConstraintRef,
    graph,
    setGraph
}: GraphSettingsProps) {
    const [isShowing, setIsShowing] = useState(false);

    const tabs = [
        {
            value: 'classes',
            name: 'Classes',
            content: <ClassesSettings setGraph={setGraph} />
        },
        {
            value: 'free',
            name: 'Livre',
            content: <FreeSettings setGraph={setGraph} />
        }
    ];

    return (
        <motion.section
            drag
            dragConstraints={dragConstraintRef}
            className={
                `absolute left-10 top-10 z-10`
            }
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: .5 }}
        >
            <motion.div
                className={`bg-red-400 cursor-pointer active:bg-red-300 flex h-12 items-center justify-center 
                    mb-4 rounded-full shadow-lg w-12`}
                onClick={() => setIsShowing(!isShowing)}
            >
                <Settings2 className="text-gray-50" />
            </motion.div>

            {
                isShowing &&
                <motion.div
                    className="bg-gray-100 p-4 rounded-md shadow-lg"
                >
                    <Tabs
                        value={graph.mode}
                        onValueChange={(value) => setGraph({...graph, mode: value})} 
                    >
                        <TabsList>
                            {tabs.map(tab => (
                                <TabsTrigger key={tab.value} value={tab.value}>
                                    {tab.name}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        {tabs.map(tab => (
                            <TabsContent key={tab.value} value={tab.value}>
                                {tab.content}
                            </TabsContent>
                        ))}
                    </Tabs>
                </motion.div>
            }

        </motion.section>
    );
}