import { HexadecimalColors } from "../graph-viewer/ViewerUtils";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";
import { Button } from "../ui/button";
import { MenuIcon } from "lucide-react";
import AppbarItems from "./AppbarItems";
import { useState } from "react";

export default function AppBar() {
    const title = "Total-Color";
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <menu className="bg-blue-500 flex gap-4 items-center justify-between px-12 py-4 relative shadow">

            <h2 className="flex gap-[0.1rem] select-none text-2xl text-white">
                {title.split("").map((char, index) => (
                    <span
                        key={index}
                        onMouseEnter={(e) => e.currentTarget.style.color = HexadecimalColors.get(index)}
                        onMouseLeave={(e) => e.currentTarget.style.color = ""}
                    >
                        {char}
                    </span>
                ))}
            </h2>

            <div className="hidden xl:flex flex-wrap gap-2">
                <AppbarItems />
            </div>

            <Drawer open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} direction="right">
                <DrawerTrigger asChild>
                    <Button className="inline xl:hidden" variant="outline">
                        <MenuIcon />
                    </Button>
                </DrawerTrigger>
                <DrawerContent>
                    <div className="bg-gray-200 flex flex-col h-full w-full">
                        <DrawerHeader>
                            <DrawerTitle>Menu</DrawerTitle>
                            <DrawerDescription></DrawerDescription>
                        </DrawerHeader>

                        <div className="flex flex-col gap-4 p-4">
                            <AppbarItems onItemClick={() => setMobileMenuOpen(false)} />
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>

        </menu>
    );
}