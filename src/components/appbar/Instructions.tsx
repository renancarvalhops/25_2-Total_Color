import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { RippleButton } from "../ui/shadcn-io/ripple-button";
import { CgNotes } from "react-icons/cg";
import { motion } from "motion/react";
import { useGraph } from "@/contexts/GraphContext";
import { useEffect, useState } from "react";
import { PiHandTapLight, PiMouseScrollLight } from "react-icons/pi";
import { HiCursorClick } from "react-icons/hi";
import { BsShiftFill } from "react-icons/bs";
import { InfoIcon } from "lucide-react";

const onlyMobile = "flex gap-2 items-center lg:hidden";
const onlyDesktop = "gap-2 hidden items-center lg:flex";
const bothDevices = "flex gap-2 items-center";

export default function Instructions() {
    const { graphView } = useGraph();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsOpen(!localStorage.getItem("hasUsedApp"));
    }, []);

    if (!graphView.active) {
        return null;
    }
    
    return (
        <Dialog
            open={isOpen}
            onOpenChange={() => {
                if (!localStorage.getItem("hasUsedApp")) {
                    localStorage.setItem("hasUsedApp", "true");
                }

                setIsOpen(!isOpen);
            }}
        >
            <DialogTrigger asChild>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >   
                    <RippleButton variant={'outline'} className="w-full">
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

                <div className="flex flex-col gap-2">
                    <div className={onlyDesktop}>
                        <PiMouseScrollLight size={30} />
                        Utilize o scroll para aumentar/diminuir o zoom
                    </div>

                    <div className={onlyDesktop}>
                        <HiCursorClick size={30} />
                        <div>
                            Clique em um elemento do grafo para selecioná-lo
                            <span className="text-gray-700 text-sm"> (a seleção é cumulativa)</span>
                        </div>
                    </div>

                    <div className={onlyMobile}>
                        <PiHandTapLight size={30} />
                        <div>
                            Toque em um elemento do grafo para selecioná-lo
                            <span className="text-gray-700 text-sm"> (a seleção é cumulativa)</span>
                        </div>
                    </div>

                    <div className={onlyDesktop}>
                        <BsShiftFill size={30} />
                        Shift + Clique arrastado cria uma caixa que seleciona os elementos contidos nela
                    </div>

                    <div className={onlyMobile}>
                        <PiHandTapLight size={25} />
                        Toque para interagir com um elemento do grafo
                    </div>

                    <div className={bothDevices}>
                        <InfoIcon size={30} />
                        Caso precise, você poderá acessar essas informações novamente pelo botão &quot;Instruções&quot; no menu
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}