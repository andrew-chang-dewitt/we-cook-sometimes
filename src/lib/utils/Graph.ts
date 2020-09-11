interface AdjacencyList {
  [vertex: string]: Array<string>
}

export interface Graph {
  readonly adjacencyList: AdjacencyList
  addVertex: (vertex: string) => Graph
  addEdge: (vertex: string, edge: string) => Graph
}

const create = (existingAdjacencyList: AdjacencyList = {}): Graph => {
  const adjacencyList = existingAdjacencyList

  return {
    get adjacencyList() {
      return adjacencyList
    },

    addVertex: (vertex) => {
      // check if vertex already exists
      if (adjacencyList[vertex])
        throw TypeError(
          `A Vertex, \`${vertex}\`, already exists; the same vertex can not be added again.`
        )

      const newList = { ...adjacencyList }
      newList[vertex] = []

      return create(newList)
    },

    addEdge: (vertex, edge) => {
      // check if vertex already exists
      if (!adjacencyList[vertex])
        throw TypeError(
          `A Vertex, \`${vertex}\`, does not exist yet; a Vertex must exist before an Edge can be added to it.`
        )

      // check if edge already exists as a vertex
      if (!adjacencyList[edge])
        throw TypeError(
          `A Vertex, \`${edge}\`, does not exist; a new Edge must match an existing Vertex.`
        )

      const newList = { ...adjacencyList }
      const vertexList = newList[vertex]

      // check if the edge already exists before adding it
      vertexList.includes(edge) ? null : vertexList.push(edge)

      return create(newList)
    },
  }
}

export default { create }
