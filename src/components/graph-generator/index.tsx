"use client"
import { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import ClassGraphGenerator from "./ClassGraphGenerator";
import FreeGraphGenerator from "./FreeGraphGenerator";
import { GraphModes } from "@/types";

export const layouts = [
    { value: 'random', label: 'Aleatório' },
    { value: 'grid', label: 'Grade' },
    { value: 'circle', label: 'Circular' }
];

interface GraphGeneratorProps {
    children?: ReactNode,
    graphMode: GraphModes
}

export default function GraphGenerator({
    children,
    graphMode
}: GraphGeneratorProps) {
    const [open, setOpen] = useState(false);

    const closeDialog = () => setOpen(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle></DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>

                {graphMode === 'classes' ?
                    <ClassGraphGenerator closeDialog={closeDialog} />
                    :
                    <FreeGraphGenerator closeDialog={closeDialog} />
                }
            </DialogContent>
        </Dialog>
    );
}