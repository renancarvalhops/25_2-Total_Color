export type Vertex = `${number}`;
export type Edge = `${number} ${number}`;
export type GraphElement = Vertex | Edge;
export type Color = `${number}`;
export type Coloring = Map<GraphElement, Color>;
export type AdjacencyMatrix = number[][];