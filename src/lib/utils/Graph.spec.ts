import 'mocha'
import { expect } from 'chai'

import graph, { Graph } from './Graph'

describe('lib/utils/Graph', () => {
  let aGraph: Graph

  it('initializes with an empty adjacency list', () => {
    aGraph = graph.create()

    expect(aGraph.adjacencyList).to.be.empty
  })

  it('can be given an existing adjacency list to start with', () => {
    expect(graph.create({ aVertex: [] }).adjacencyList).to.deep.equal({
      aVertex: [],
    })
  })

  describe('addVertex()', () => {
    let newGraph: Graph

    it('adding a vertex returns a new graph with the new vertex', () => {
      newGraph = aGraph.addVertex('A')

      expect(newGraph.adjacencyList['A']).to.exist
    })

    it('without altering the old graph', () => {
      expect(newGraph.adjacencyList).to.not.deep.equal(aGraph.adjacencyList)
      expect(aGraph.adjacencyList['A']).to.not.exist
    })

    it("won't add a vertex if it already exists", () => {
      expect((_: any) => newGraph.addVertex('A')).to.throw(
        TypeError,
        /vertex.*a.*already exists/i
      )
    })
  })

  describe('addEdge()', () => {
    let newGraph = graph.create({ A: [], B: [] })

    it('can add edges', () => {
      newGraph = newGraph.addEdge('A', 'B')

      expect(newGraph.adjacencyList['A']).to.deep.equal(['B'])
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

  describe('undirected vs directed', () => {
    it('is undirected by default', () => {
      const ab = graph.create().addVertex('A').addVertex('B').addEdge('A', 'B')

      expect(ab.adjacencyList['A']).to.contain('B')
      expect(ab.adjacencyList['B']).to.contain('A')
    })

    it('but it can be directed, if specified at creation', () => {
      const ab = graph.create({}, true).addVertex('A').addVertex('B').addEdge('A', 'B')

      expect(ab.adjacencyList['A']).to.contain('B')
      expect(ab.adjacencyList['B']).to.not.contain('A')
    })
  })
})
