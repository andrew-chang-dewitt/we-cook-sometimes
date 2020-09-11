import 'mocha'
import { expect } from 'chai'

import graph, { Graph } from './Graph'

describe('lib/utils/Graph', () => {
  it('initializes with an empty adjacency list', () => {
    expect(graph.create().adjacencyList).to.be.empty
  })

  it('can be given an existing adjacency list to start with', () => {
    expect(graph.create({ aVertex: [] }).adjacencyList).to.deep.equal({
      aVertex: [],
    })
  })

  describe('addVertex()', () => {
    let oldGraph: Graph
    let newGraph: Graph

    before(() => {
      oldGraph = graph.create()
    })

    it('adding a vertex returns a new graph with the new vertex', () => {
      newGraph = oldGraph.addVertex('A')

      expect(newGraph.adjacencyList['A']).to.exist
    })

    it('without altering the old graph', () => {
      expect(newGraph.adjacencyList).to.not.deep.equal(oldGraph.adjacencyList)
      expect(oldGraph.adjacencyList['A']).to.not.exist
    })

    it("won't add a vertex if it already exists", () => {
      expect((_: any) => newGraph.addVertex('A')).to.throw(
        TypeError,
        /vertex.*a.*already exists/i
      )
    })
  })

  describe('addEdge()', () => {
    let oldGraph: Graph
    let newGraph: Graph

    before(() => {
      oldGraph = graph.create({ A: [], B: [] })
    })

    it('can add edges', () => {
      newGraph = oldGraph.addEdge('A', 'B')

      expect(newGraph.adjacencyList['A']).to.deep.equal(['B'])
    })

    it('without altering the old graph', () => {
      expect(newGraph.adjacencyList).to.not.deep.equal(oldGraph.adjacencyList)
      expect(oldGraph.adjacencyList['A']).to.be.empty
      expect(oldGraph.adjacencyList['B']).to.be.empty
    })

    it("but it won't add an edge again if it already exists", () => {
      newGraph = newGraph.addEdge('A', 'B')

      expect(newGraph.adjacencyList['A']).to.not.deep.equal(['B', 'B'])
    })

    it("it won't add an edge to a vertex that doesn't exist yet", () => {
      expect((_: any) => newGraph.addEdge('C', 'A')).to.throw(
        TypeError,
        /vertex.*c.*does not exist/i
      )
    })

    it("and it won't add an edge if it doesn't have a corresponding vertex", () => {
      expect((_: any) => newGraph.addEdge('A', 'C')).to.throw(
        TypeError,
        /vertex.*c.*does not exist/i
      )
    })
  })

  // describe('forEach()', () => {
  //   it('iterates over every node in the graph, executing the provided callback', () => {
  //     const oldGraph = graph.create()
  //     oldGraph.addVertex('A')
  //     oldGraph.addVertex('B')
  //     oldGraph.addVertex('C')
  //     oldGraph.addEdge('A', 'B')
  //     oldGraph.addEdge('A', 'C')
  //     oldGraph.addEdge('B', 'C')

  //     let visited: string[] = []

  //     oldGraph.forEach((node) => visited.push(node))
  //   })
  // })

  describe('undirected vs directed', () => {
    it('is undirected by default', () => {
      const ab = graph.create().addVertex('A').addVertex('B').addEdge('A', 'B')

      expect(ab.adjacencyList['A']).to.contain('B')
      expect(ab.adjacencyList['B']).to.contain('A')
    })

    it('but it can be directed, if specified at creation', () => {
      const ab = graph
        .create({}, true)
        .addVertex('A')
        .addVertex('B')
        .addEdge('A', 'B')

      expect(ab.adjacencyList['A']).to.contain('B')
      expect(ab.adjacencyList['B']).to.not.contain('A')
    })

    describe('directed', () => {
      it('is allowed to be cyclical by default', () => {
        expect(
          graph
            .create()
            .addVertex('A')
            .addVertex('B')
            .addEdge('A', 'B')
            .addEdge('B', 'A').adjacencyList
        ).to.deep.equal({
          A: ['B'],
          B: ['A'],
        })
      })

      // it('but can be be required to enforce that it is acyclical', () => {
      //   expect((_: any) =>
      //     graph
      //       .create({}, false, true)
      //       .addVertex('A')
      //       .addVertex('B')
      //       .addEdge('A', 'B')
      //       .addEdge('B', 'A')
      //   ).to.throw(
      //     TypeError,
      //     /.*can not add Edge BA.*creates a cycle.*acyclical/i
      //   )
      // })

      // it('enforces acyclicality across paths with a length of 3+ nodes', () => {
      //   expect((_: any) =>
      //     graph
      //       .create({}, false, true)
      //       .addVertex('A')
      //       .addVertex('B')
      //       .addVertex('C')
      //       .addEdge('A', 'B')
      //       .addEdge('B', 'C')
      //       .addEdge('C', 'A')
      //   ).to.throw(
      //     TypeError,
      //     /.*can not add Edge BA.*creates a cycle.*acyclical/i
      //   )
      // })
    })
  })
})
