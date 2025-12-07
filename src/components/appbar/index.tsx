import About from "./About";
import DownloadGraph6 from "./DownloadGraph6";
import Instructions from "./Instructions";
import NewGraph from "./NewGraph";
import ShowColoring from "./ShowColoring";

export default function AppBar() {
    return (
        <menu className="bg-blue-500 flex flex-col gap-4 items-center justify-between lg:flex-row px-12 py-4 relative shadow">

            <h2 className="flex gap-[0.1rem] select-none text-2xl text-white">
                <span className="hover:text-red-500">T</span>
                <span className="hover:text-lime-500">o</span>
                <span className="hover:text-teal-500">t</span>
                <span className="hover:text-emerald-500">a</span>
                <span className="hover:text-indigo-500">l</span>
                <span className="hover:text-rose-500">-</span>
                <span className="hover:text-slate-500">C</span>
                <span className="hover:text-yellow-500">o</span>
                <span className="hover:text-cyan-500">l</span>
                <span className="hover:text-green-500">o</span>
                <span className="hover:text-amber-500">r</span>
            </h2>

            <div className="flex flex-wrap gap-2">
                <Instructions />
                
                <ShowColoring />

                <NewGraph />

                <DownloadGraph6 />

                <About />
            </div>

        </menu>
    );
}