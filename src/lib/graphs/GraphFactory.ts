import { AcceptedFileExtensions, GraphClassesNames } from "@/types";
import PathGraph from "./classes/PathGraph";
import CycleGraph from "./classes/CycleGraph";
import CompleteGraph from "./classes/CompleteGraph";
import FreeGraph from "./GraphFree";

interface MakeArguments {
    graphClass?: {
        name: GraphClassesNames,
        order: number
    },
    graphFree?: {
        fileExtension: AcceptedFileExtensions,
        content: string
    }
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
        } else if (graphFree) {
            const { fileExtension, content } = graphFree;

            Graph = new FreeGraph(fileExtension, content);
        } else {
            throw new Error('Insira informações em graphClass ou graphFree');
        }


        return Graph;
    }
}