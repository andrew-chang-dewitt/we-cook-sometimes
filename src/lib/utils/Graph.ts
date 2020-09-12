interface AdjacencyList {
  [vertex: string]: Array<string>
}

interface State {
  readonly adjacencyList: AdjacencyList
  root: string | null
  readonly directed: boolean
  readonly acyclical: boolean
}

interface AddVertex {
  (vertex: string): Graph
}

interface AddEdge {
  (vertex: string, edge: string): Graph
}

interface ForEach {
  (callback: (vertex: string) => void): Graph
}

export interface Graph {
  readonly adjacencyList: AdjacencyList
  addVertex: AddVertex
  addEdge: AddEdge
  forEach: ForEach
  iterator: () => Iterator<string>
}

const graph = (state: State): Graph =>
  Object.assign(
    {},
    getters(state),
    vertexAdder(state),
    edgeAdder(state),
    forEacher(state),
    iterable(state)
  )

export interface Iterator<T> {
  next: () => T | null
}

const iterable = ({
  adjacencyList,
  root,
}: State): { iterator: () => Iterator<string> } => ({
  iterator: () => {
    const visited: string[] = []
    const stack: string[] = []

    if (!root)
      throw TypeError(
        'Cannot iterate over graph without having a root; either your graph has no vertices, or has them, but has no root defined.'
      )

    stack.push(root)

    return {
      next: () => {
        const recur = (): string | null => {
          const current = stack[stack.length - 1]

          if (!current) return null

          if (!visited.includes(current)) {
            visited.push(current)
            return current
          }

          if (
            adjacencyList[current].every((neighbor) =>
              visited.includes(neighbor)
            )
          ) {
            stack.pop()

            return recur()
          }

          const remaining = adjacencyList[current]
            .reduce((accumulator: string[], neighbor) => {
              if (!visited.includes(neighbor)) accumulator.push(neighbor)

              return accumulator
            }, [])
            .sort()

          stack.push(remaining[0])

          return recur()
        }

        return recur()
      },
    }
  },
})

const forEacher = (state: State): { forEach: ForEach } => ({
  forEach: (callback) => {
    const iterator = iterable(state).iterator()

    let current = iterator.next()

    const recur = () => {
      while (current) {
        callback(current)
        current = iterator.next()
      }
    }

    recur()

    return graph(state)
  },
})

const getters = ({
  adjacencyList,
}: State): { adjacencyList: AdjacencyList } => ({
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

    // if this is the first vertex, make it the root
    if (Object.keys(state.adjacencyList).length === 0) state.root = vertex

    const newList = { ...state.adjacencyList }
    newList[vertex] = []

    return graph({ ...state, adjacencyList: newList })
  },
})

const edgeAdder = (state: State): { addEdge: AddEdge } => {
  const addEdge = (state: State, vertex: string, edge: string): State => {
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

    // spread the list of neighbors to shallow clone it
    // to avoid side affecting the given state
    const edges = [...state.adjacencyList[vertex]]

    // check if the edge already exists before adding it
    edges.includes(edge) ? null : edges.push(edge)

    // spread the adjacency list to shallow clone it
    const newList = { ...state.adjacencyList }
    // then replace the old list of neighbors with the new one
    newList[vertex] = edges
    // this avoids unnecessarily cloning all neighbors lists
    // when they aren't changing

    return { ...state, adjacencyList: newList }
  }

  const enforceAcyclicality = (
    graph: Graph,
    fromVertex: string,
    toVertex: string
  ): Graph => {
    if (hasCycle(graph))
      throw TypeError(
        `Can not add edge ${fromVertex}${toVertex} because it creates a Cycle & this graph was created as a Directed Acyclical graph`
      )

    return graph
  }

  const addDirected: AddEdge = (fromVertex, toVertex) => {
    const newGraph = graph(addEdge(state, fromVertex, toVertex))

    return state.acyclical
      ? enforceAcyclicality(newGraph, fromVertex, toVertex)
      : newGraph
  }

  const addUndirected: AddEdge = (vertexA, vertexB) => {
    const newState = addEdge(state, vertexA, vertexB)
    return graph(addEdge(newState, vertexB, vertexA))
  }

  return {
    addEdge: !state.directed ? addUndirected : addDirected,
  }
}

const create = (
  adjacencyList: AdjacencyList = {},
  directed: boolean = false,
  acyclical: boolean = false,
  root: string | null = null
): Graph => {
  const state: State = {
    adjacencyList,
    directed,
    acyclical,
    root,
  }

  return graph(state)
}

const hasCycle = (graph: Graph): boolean => {
  graph

  return false
}

export default { create }
