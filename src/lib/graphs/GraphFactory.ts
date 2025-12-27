import { AcceptedFile, GraphClassName } from "@/types";
import PathGraph from "./classes/PathGraph";
import CycleGraph from "./classes/CycleGraph";
import CompleteGraph from "./classes/CompleteGraph";
import FreeGraph from "./FreeGraph";
import Graph from "./Graph";

interface MakeArguments {
    graphClass?: {
        name: GraphClassName,
        order: number
    },
    graphFree?: {
        fileExtension: AcceptedFile,
        content: string,
        isColored: boolean
    } | null
}

export default class GraphFactory {
    static make({ graphClass, graphFree }: MakeArguments): Graph {
        let Graph: Graph;

        if (graphClass) {
            const { name, order } = graphClass;

            switch (name) {
                case 'paths':
                    Graph = new PathGraph(order);
                    break;
                case 'cycles':
                    Graph = new CycleGraph(order);
                    break;
                case 'completes':
                    Graph = new CompleteGraph(order);
                    break;
            }
        } else if (graphFree !== undefined) {
            Graph = new FreeGraph(graphFree);
        } else {
            throw new Error('Insira informações em graphClass ou graphFree');
        }


        return Graph;
    }
}