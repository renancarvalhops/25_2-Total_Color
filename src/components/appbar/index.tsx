import { HexadecimalColors } from "../graph-viewer/ViewerUtils";
import About from "./About";
import DownloadGraph6 from "./DownloadGraph6";
import Instructions from "./Instructions";
import NewGraph from "./NewGraph";
import ShowColoring from "./ShowColoring";
import ButtonMode from "./ButtonMode";

export default function AppBar() {
    const title = "Total-Color";

    return (
        <menu className="bg-blue-500 flex flex-col gap-4 items-center justify-between lg:flex-row px-12 py-4 relative shadow">

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

            <div className="flex flex-wrap gap-2">
                <Instructions />
                
                <ShowColoring />

                <ButtonMode mode="vertex" text="Adicionar vértice (v)" />

                <ButtonMode mode="edge" text="Adicionar aresta (e)" />

                <ButtonMode mode="coloring" text="Atribuir cor (c)" />

                <NewGraph />

                {/* <DownloadColoredGraph /> */}

                <DownloadGraph6 />

                <About />
            </div>

        </menu>
    );
}