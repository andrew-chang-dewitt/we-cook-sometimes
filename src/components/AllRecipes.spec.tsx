// testing tools
import 'mocha'
import { expect } from 'chai'
import sinon, { SinonStub, SinonSpy } from 'sinon'
import { shallow, configure, ShallowWrapper } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
configure({ adapter: new Adapter() })

// dependencies
import React from 'react'
import fetch from '../lib/data/fetch'
import { Factories } from '../lib/core/RecipeList.spec'
import { ok } from '../utils/Result'
import { RecipeList as RecipeListType } from '../lib/core/RecipeList'
import * as hooks from '../utils/useQueryParam'
import List from './home/recipes/List'
import SearchBar from './SearchBar'

// component under test
import AllRecipes from './AllRecipes'

// super hacky/ugly mocking of React's useEffect hook so that it can
// be called properly by Enzyme's shallow renderer
// from: https://github.com/enzymejs/enzyme/issues/2086#issuecomment-694778214
// makes way too liberal use of `any` in order to brute force past
// type checkers
const lastDependencies = {} as any
const useEffectMock = (fn: () => any, dependencies: any) => {
  const effect = new Error().stack?.split('\n')[2] as any

  if (
    !lastDependencies[effect] ||
    dependencies.some(
      (dep: any, index: number) => dep !== lastDependencies[effect][index]
    )
  ) {
    fn()
    lastDependencies[effect] = dependencies
  }
}

describe('component/AllRecipes', () => {
  const recipes = ({
    remaining: ['a', 'b', 'c'],
    allByID: {
      a: Factories.Fetch.Recipe.createWithProperties([
        { key: 'id', value: 'a' },
      ]),
      b: Factories.Fetch.Recipe.createWithProperties([
        { key: 'id', value: 'b' },
      ]),
      c: Factories.Fetch.Recipe.createWithProperties([
        { key: 'id', value: 'c' },
      ]),
    },
  } as unknown) as RecipeListType
  let rendered: ShallowWrapper
  let useQueryParamSetterSpy: SinonSpy<any, any>
  let useQueryParamStub: SinonStub<any, any>
  let useEffectStub: SinonStub<any, any>
  let fetchSearchMock = Promise.resolve(ok([Factories.Fetch.Recipe.create()]))
  let fetchSearchStub: SinonStub<any, any>

  const setup = (value: string = '') => {
    const returns = { value, setter: (_: unknown) => {} }
    useQueryParamSetterSpy = sinon.spy(returns, 'setter')
    useQueryParamStub = sinon
      .stub(hooks, 'default')
      .returns([returns.value, returns.setter])

    return shallow(<AllRecipes recipes={recipes} />)
  }

  beforeEach(() => {
    useEffectStub = sinon.stub(React, 'useEffect').callsFake(useEffectMock)
    fetchSearchStub = sinon.stub(fetch, 'search').returns(fetchSearchMock)
  })
  afterEach(() => {
    useEffectStub.restore()
    useQueryParamSetterSpy.restore()
    useQueryParamStub.restore()
    fetchSearchStub.restore()
  })

  it('renders a search bar', () => {
    rendered = setup()

    expect(rendered.find(SearchBar)).to.have.lengthOf(1)
  })

  it('renders a List', () => {
    expect(rendered.find(List)).to.have.lengthOf(1)
  })

  // FIXME: the following group of tests feels hella brittle, but
  // to make them less brittle requires rendering the full component
  // tree via react-testing-library, which I'd rather not do so it
  // doesn't have mock out any downstream fetch calls or risk
  // breaking on child component changes. It may be possible that
  // the child components themselves could be mocked though, so
  // that's something worth looking into.
  describe('search handling', () => {
    it('if a `search` value exists, a List is built from Trello API search results', () => {
      rendered = setup('value')

      // calling expect inside then callback on the mocked Promise
      // returned by fetch.search to allow for enzyme to have updated
      // the component from the resolution of the Promise per
      // https://github.com/enzymejs/enzyme/issues/346#issuecomment-304535773
      return fetchSearchMock.then(() => {
        expect(rendered.find(List).first().props().recipes).to.have.lengthOf(1)
      })
    })

    it('provides handler to SearchBar to update `search` value', () => {
      // fake out input in SearchBar without rendering it by calling the
      // change handler given to it by AllRecipes directly
      const searchHandler = rendered.find(SearchBar).first().props()
        .changeHandler
      searchHandler({
        target: { value: 'new value' },
        preventDefault: () => {},
      } as React.ChangeEvent<HTMLInputElement>)

      expect(useQueryParamSetterSpy.calledOnceWith('new value')).to.be.true
    })
  })
})
