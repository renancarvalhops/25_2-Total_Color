import { InfoIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { RippleButton } from "../ui/shadcn-io/ripple-button";
import { IoSchool } from "react-icons/io5";
import { motion } from "motion/react";

export default function About() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <RippleButton className="w-full" variant={'outline'}>
                        <InfoIcon />
                        Sobre
                    </RippleButton>
                </motion.div>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Sobre</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>

                <section className="flex flex-col gap-2">
                    <p>
                        Sistema produto do TCC:
                        <span className="italic">
                            &quot;Total-color: uma aplicação web para coloração total em grafos&quot;.
                        </span>
                    </p>

                    <div className="flex flex-col gap-2">
                        <p className="font-semibold">Autor:</p>

                        <div className="flex flex-col gap-1">
                            <p className="flex gap-2 items-center">
                                <IoSchool />
                                Renan Carvalho Pinheiro da Silva (EIC - CEFET/RJ)
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <p className="font-semibold">Orientadores:</p>

                        <div className="flex flex-col gap-1">
                            <p className="flex gap-2 items-center">
                                <IoSchool />
                                Profa. Mayara Midori Omai, M.Sc. (EIC - CEFET/RJ)
                            </p>

                            <p className="flex gap-2 items-center">
                                <IoSchool />
                                Prof. Mauro Nigro Alves Junior, Dr. (IME - UERJ)
                            </p>
                        </div>
                    </div>
                </section>
            </DialogContent>
        </Dialog>
    );
}