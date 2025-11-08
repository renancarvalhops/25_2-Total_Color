import { EllipsisVerticalIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

export default function AppBar() {
    return (
        <menu className="bg-gray-100 flex items-center justify-between px-12 py-2 relative rounded-b-lg shadow-lg">

            <h2 className="font-bold text-lg select-none">
                Total-Color
            </h2>
            
            <span></span>
            
            <Dialog>
                <DialogTrigger asChild>
                    <div className="border border-gray-200 bg-white cursor-pointer hover:opacity-60 p-2 rounded duration-300">
                        <EllipsisVerticalIcon className="h-6 w-6" />
                    </div>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Sobre</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>

                    <section className="flex flex-col gap-2">
                        <p>Sistema produto do TCC &quot;Total-color: uma aplicação web para coloração total em grafos&quot; por Renan Carvalho.</p>

                        <div>
                            <p>Orientadores:</p>
                            <p>Profa. Mayara Midori Omai, M.Sc.</p>
                            <p>Prof. Mauro Nigro Alves Junior, Dr.</p>
                        </div>
                    </section>
                </DialogContent>
            </Dialog>
        </menu>
    );
}