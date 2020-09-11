interface AdjacencyList {
  [vertex: string]: Array<string>
}

interface State {
  readonly adjacencyList: AdjacencyList
}

interface AddVertex {
  (vertex: string): Graph
}

interface AddEdge {
  (vertex: string, edge: string): Graph
}

export interface Graph extends State {
  addVertex: AddVertex
  addEdge: AddEdge
}

const createFromState = (state: State): Graph =>
  Object.assign({}, getters(state), vertexAdder(state), edgeAdder(state))

const getters = ({ adjacencyList }: State): State => ({
  get adjacencyList() {
    return adjacencyList
  },
})

const vertexAdder = (state: State): { addVertex: AddVertex } => ({
  addVertex: (vertex) => {
    // check if vertex already exists
    if (state.adjacencyList[vertex])
      throw TypeError(
        `A Vertex, \`${vertex}\`, already exists; the same vertex can not be added again.`
      )

    const newList = { ...state.adjacencyList }
    newList[vertex] = []

    return createFromState({ ...state, adjacencyList: newList })
  },
})

const edgeAdder = (state: State): { addEdge: AddEdge } => ({
  addEdge: (vertex, edge) => {
    // check if vertex already exists
    if (!state.adjacencyList[vertex])
      throw TypeError(
        `A Vertex, \`${vertex}\`, does not exist yet; a Vertex must exist before an Edge can be added to it.`
      )

    // check if edge already exists as a vertex
    if (!state.adjacencyList[edge])
      throw TypeError(
        `A Vertex, \`${edge}\`, does not exist; a new Edge must match an existing Vertex.`
      )

    const newList = { ...state.adjacencyList }
    const vertexList = newList[vertex]

    // check if the edge already exists before adding it
    vertexList.includes(edge) ? null : vertexList.push(edge)

    return createFromState({ ...state, adjacencyList: newList })
  },
})

const create = (existingAdjacencyList: AdjacencyList = {}): Graph => {
  const state = {
    adjacencyList: existingAdjacencyList,
  }

  return Object.assign({}, getters(state), vertexAdder(state), edgeAdder(state))
}

export default { create }
