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

interface OrderFn<T> {
  (unordered: Array<T>): Array<T>
}

export interface Traverser<T> {
  next: () => T | null
}

interface ForEach {
  (callback: (node: string) => void): Graph
}

export interface Graph {
  readonly adjacencyList: AdjacencyList
  readonly nodes: Array<string>
  addNode: AddNode
  addEdge: AddEdge
  traverser: (orderFn?: OrderFn<string>) => Traverser<string>
  forEach: ForEach
}

export class CycleError extends Error {}

const GraphBuilder = (state: State): Graph => {
  if (!state.directed && state.acyclical)
    throw TypeError('An undirected graph can not be acyclical')

  return Object.assign(
    {},
    getters(state),
    nodeAddable(state),
    edgeAddable(state),
    forEachable(state),
    traversable(state)
  )
}

const getters = ({
  adjacencyList,
}: State): {
  adjacencyList: AdjacencyList
  nodes: Array<string>
} => ({
  get adjacencyList() {
    return adjacencyList
  },

  get nodes() {
    return Object.keys(adjacencyList)
  },
})

const traversable = ({
  adjacencyList,
  root,
  acyclical,
}: State): { traverser: (orderFn?: OrderFn<string>) => Traverser<string> } => ({
  traverser: (orderFn) => {
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

          let remaining = neighbors.reduce(
            (accumulator: string[], neighbor) => {
              if (!visited.includes(neighbor)) accumulator.push(neighbor)

              return accumulator
            },
            []
          )

          if (orderFn !== undefined) remaining = orderFn(remaining)
          else remaining = remaining.sort()

          if (remaining.length <= 0) {
            stack.pop()

            return recur()
          }

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
    let adjList = state.adjacencyList
    // check if node already exists
    if (!adjList[node])
      throw TypeError(
        `A Node, \`${node}\`, does not exist yet; a Node must exist before an Edge can be added to it.`
      )

    // if edge doesn't exist as a node yet, add it, then reassign adjacency list
    // to the one from the updated graph
    if (!adjList[edge]) adjList = nodeAddable(state).addNode(edge).adjacencyList

    // spread the list of neighbors to shallow clone it
    // to avoid side affecting the given state
    const edges = [...adjList[node]]

    // check if the edge already exists before adding it
    edges.includes(edge) ? null : edges.push(edge)

    // spread the adjacency list to shallow clone it
    const newList = { ...adjList }
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
      /* istanbul ignore else */
      if (err instanceof CycleError)
        throw new CycleError(
          `Can not add edge ${fromNode}${toNode} because it creates a Cycle & this graph was created as a Directed Acyclical graph`
        )
      // having code coverage ignore this line because it isn't a
      // behavior that's designed around; instead this line is required
      // to prevent silencing other errors
      /* istanbul ignore next */ else throw err
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
): Graph =>
  GraphBuilder({
    adjacencyList,
    directed,
    acyclical,
    root,
  })

export default { create }
