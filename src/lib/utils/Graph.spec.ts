import 'mocha'
import { expect } from 'chai'

import graph, { Graph } from './Graph'

describe('lib/utils/Graph', () => {
  it('initializes with an empty adjacency list', () => {
    expect(graph.create().adjacencyList).to.be.empty
  })

  it('can be given an existing adjacency list to start with', () => {
    expect(graph.create({ aNode: [] }).adjacencyList).to.deep.equal({
      aNode: [],
    })
  })

  describe('undirected vs directed', () => {
    it('is undirected by default', () => {
      const ab = graph.create().addNode('A').addNode('B').addEdge('A', 'B')

      expect(ab.adjacencyList['A']).to.contain('B')
      expect(ab.adjacencyList['B']).to.contain('A')
    })

    it('but it can be directed, if specified at creation', () => {
      const ab = graph
        .create({}, true)
        .addNode('A')
        .addNode('B')
        .addEdge('A', 'B')

      expect(ab.adjacencyList['A']).to.contain('B')
      expect(ab.adjacencyList['B']).to.not.contain('A')
    })

    describe('directed', () => {
      it('is allowed to be cyclical by default', () => {
        expect(
          graph
            .create()
            .addNode('A')
            .addNode('B')
            .addEdge('A', 'B')
            .addEdge('B', 'A').adjacencyList
        ).to.deep.equal({
          A: ['B'],
          B: ['A'],
        })
      })

      it('but can be be required to enforce that it is acyclical', () => {
        expect((_: any) => {
          graph
            .create({}, true, true)
            .addNode('A')
            .addNode('B')
            .addEdge('A', 'B')
            .addEdge('B', 'A')
        }).to.throw(
          TypeError,
          /.*can not add Edge BA.*creates a cycle.*acyclical/i
        )
      })

      it('enforces acyclicality across paths with a length of 3+ nodes', () => {
        expect((_: any) => {
          graph
            .create({}, true, true)
            .addNode('A')
            .addNode('B')
            .addNode('C')
            .addEdge('A', 'B')
            .addEdge('B', 'C')
            .addEdge('C', 'A')
        }).to.throw(
          TypeError,
          /.*can not add Edge CA.*creates a cycle.*acyclical/i
        )
      })

      it("won't let you try to make an undirected graph be acyclical", () => {
        expect((_: any) => {
          graph.create({}, false, true)
        }).to.throw(TypeError, /.*undirected.*can not be acyclical/i)
      })
    })
  })

  describe('addNode()', () => {
    let oldGraph: Graph
    let newGraph: Graph

    before(() => {
      oldGraph = graph.create()
    })

    it('adding a node returns a new graph with the new node', () => {
      newGraph = oldGraph.addNode('A')

      expect(newGraph.adjacencyList['A']).to.exist
    })

    it('without altering the old graph', () => {
      expect(newGraph.adjacencyList).to.not.deep.equal(oldGraph.adjacencyList)
      expect(oldGraph.adjacencyList['A']).to.not.exist
    })

    it("won't add a node if it already exists", () => {
      expect((_: any) => newGraph.addNode('A')).to.throw(
        TypeError,
        /node.*a.*already exists/i
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

    it("it won't add an edge to a node that doesn't exist yet", () => {
      expect((_: any) => newGraph.addEdge('C', 'A')).to.throw(
        TypeError,
        /node.*c.*does not exist/i
      )
    })

    it("and it won't add an edge if it doesn't have a corresponding node", () => {
      expect((_: any) => newGraph.addEdge('A', 'C')).to.throw(
        TypeError,
        /node.*c.*does not exist/i
      )
    })
  })

  describe('traverser()', () => {
    it('returns an Traverser made from the graph', () => {
      const aGraph = graph.create(
        {
          A: ['B', 'C', 'E'],
          B: ['C'],
          C: ['D', 'E'],
          D: ['F'],
          E: [],
          F: [],
        },
        true,
        false,
        'A'
      )

      expect(aGraph.traverser()).to.exist
    })

    it('throws an error if the graph does not have a root nodet defined', () => {
      const aGraph = graph.create(
        {
          A: ['B', 'C', 'E'],
          B: ['C'],
          C: ['D', 'E'],
          D: ['F'],
          E: [],
          F: [],
        },
        true
      )

      expect(() => aGraph.traverser()).to.throw(
        TypeError,
        /.*cannot traverse.*without.*root/i
      )
    })

    describe('next()', () => {
      let traverser: { next: () => string | null }

      before(() => {
        traverser = graph
          .create(
            {
              A: ['B', 'C', 'E'],
              B: ['C'],
              C: ['D', 'E'],
              D: ['F'],
              E: [],
              F: [],
            },
            true,
            false,
            'A'
          )
          .traverser()
      })

      it('returns the next item in the traverser ', () => {
        expect(traverser.next()).to.equal('A')
      })

      it('side-effects the traverser so that calling next again returns the item after the one returned last time', () => {
        expect(traverser.next()).to.equal('B')
      })

      it('uses a depth-first traversal algorithm for determining node order', () => {
        let traversed: Array<string | null> = []

        traversed.push(traverser.next())
        traversed.push(traverser.next())
        traversed.push(traverser.next())
        traversed.push(traverser.next())

        expect(traversed).to.deep.equal(['C', 'D', 'F', 'E'])
      })

      it('returns null if there are no items left in the traverser', () => {
        expect(traverser.next()).to.be.null
      })

      it('can traverse over cyclical graphs without repeating a node', () => {
        traverser = graph
          .create(
            {
              A: ['B'],
              B: ['C'],
              C: ['A'],
            },
            true,
            false,
            'A'
          )
          .traverser()

        let traversed: Array<string | null> = []

        traversed.push(traverser.next())
        traversed.push(traverser.next())
        traversed.push(traverser.next())
        traversed.push(traverser.next())

        expect(traversed).to.deep.equal(['A', 'B', 'C', null])
      })
    })
  })

  describe('forEach()', () => {
    it('traverses over every node in the graph, executing the provided callback', () => {
      const oldGraph = graph
        .create()
        .addNode('A')
        .addNode('B')
        .addNode('C')
        .addEdge('A', 'B')
        .addEdge('A', 'C')
        .addEdge('B', 'C')

      let visited: string[] = []

      oldGraph.forEach((node) => visited.push(node))

      expect(visited).to.include.members(['A', 'B', 'C'])
    })
  })
})
