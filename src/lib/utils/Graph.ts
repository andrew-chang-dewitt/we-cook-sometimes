interface AdjacencyList {
  [node: string]: Array<string>
}

interface State {
  readonly adjacencyList: AdjacencyList
  root: string | null
  readonly directed: boolean
  readonly acyclical: boolean
}

interface AddNode {
  (node: string): Graph
}

interface AddEdge {
  (node: string, edge: string): Graph
}

export interface Traverser<T> {
  (): {
    next: () => T | null
  }
}

interface ForEach {
  (callback: (node: string) => void): Graph
}

export interface Graph {
  readonly adjacencyList: AdjacencyList
  addNode: AddNode
  addEdge: AddEdge
  traverser: Traverser<string>
  forEach: ForEach
}

const GraphBuilder = (state: State): Graph =>
  Object.assign(
    {},
    getters(state),
    nodeAddable(state),
    edgeAddable(state),
    forEachable(state),
    traversable(state)
  )

class CycleError extends Error {}

const traversable = ({
  adjacencyList,
  root,
  acyclical,
}: State): { traverser: Traverser<string> } => ({
  traverser: () => {
    const visited: string[] = []
    const stack: string[] = []

    if (!root)
      throw TypeError(
        'Cannot traverse over graph without having a root; either your graph has no nodes, or it has no root defined (despite having nodes).'
      )

    stack.push(root)

    return {
      next: () => {
        const recur = (): string | null => {
          const current = stack[stack.length - 1]
          const neighbors = adjacencyList[current]

          if (!current) return null

          if (!visited.includes(current)) {
            visited.push(current)
            return current
          }

          if (
            acyclical &&
            neighbors.some((neighbor) => stack.includes(neighbor))
          ) {
            throw new CycleError(
              'A cycle has been detected while traversing & this graph is marked as acyclical'
            )
          }

          if (neighbors.every((neighbor) => visited.includes(neighbor))) {
            stack.pop()

            return recur()
          }

          const remaining = neighbors
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

const forEachable = (state: State): { forEach: ForEach } => ({
  forEach: (callback) => {
    const traverser = traversable(state).traverser()

    let current = traverser.next()

    const recur = () => {
      while (current) {
        callback(current)
        current = traverser.next()
      }
    }

    recur()

    return GraphBuilder(state)
  },
})

const getters = ({
  adjacencyList,
}: State): { adjacencyList: AdjacencyList } => ({
  get adjacencyList() {
    return adjacencyList
  },
})

const nodeAddable = (state: State): { addNode: AddNode } => ({
  addNode: (node) => {
    // check if node already exists
    if (state.adjacencyList[node])
      throw TypeError(
        `A Node, \`${node}\`, already exists; the same node can not be added again.`
      )

    // if this is the first node, make it the root
    if (Object.keys(state.adjacencyList).length === 0) state.root = node

    const newList = { ...state.adjacencyList }
    newList[node] = []

    return GraphBuilder({ ...state, adjacencyList: newList })
  },
})

const edgeAddable = (state: State): { addEdge: AddEdge } => {
  const addEdge = (state: State, node: string, edge: string): State => {
    // check if node already exists
    if (!state.adjacencyList[node])
      throw TypeError(
        `A Node, \`${node}\`, does not exist yet; a Node must exist before an Edge can be added to it.`
      )

    // check if edge already exists as a node
    if (!state.adjacencyList[edge])
      throw TypeError(
        `A Node, \`${edge}\`, does not exist; a new Edge must match an existing Node.`
      )

    // spread the list of neighbors to shallow clone it
    // to avoid side affecting the given state
    const edges = [...state.adjacencyList[node]]

    // check if the edge already exists before adding it
    edges.includes(edge) ? null : edges.push(edge)

    // spread the adjacency list to shallow clone it
    const newList = { ...state.adjacencyList }
    // then replace the old list of neighbors with the new one
    newList[node] = edges
    // this avoids unnecessarily cloning all neighbors lists
    // when they aren't changing

    return { ...state, adjacencyList: newList }
  }

  const enforceAcyclicality = (
    graph: Graph,
    fromNode: string,
    toNode: string
  ): Graph => {
    // a directed acyclical graph should throw an error when
    // traversed with forEach() if a cycle is found
    try {
      graph.forEach((_) => {})
    } catch (err) {
      if (err instanceof CycleError)
        throw TypeError(
          `Can not add edge ${fromNode}${toNode} because it creates a Cycle & this graph was created as a Directed Acyclical graph`
        )
      else throw err
    }

    return graph
  }

  const addDirected: AddEdge = (fromNode, toNode) => {
    const newGraph = GraphBuilder(addEdge(state, fromNode, toNode))

    return state.acyclical
      ? enforceAcyclicality(newGraph, fromNode, toNode)
      : newGraph
  }

  const addUndirected: AddEdge = (nodeA, nodeB) => {
    const newState = addEdge(state, nodeA, nodeB)
    return GraphBuilder(addEdge(newState, nodeB, nodeA))
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
  if (!directed && acyclical)
    throw TypeError('A directed graph can not be acyclical')

  const state: State = {
    adjacencyList,
    directed,
    acyclical,
    root,
  }

  return GraphBuilder(state)
}

export default { create }
