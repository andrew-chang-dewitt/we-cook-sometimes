// testing tools
import 'mocha'
import { expect } from 'chai'
import sinon, { SinonStub } from 'sinon'
import { shallow, configure, ShallowWrapper } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
configure({ adapter: new Adapter() })

// external dependencies
import React from 'react'
// despite importing useLocation from 'react-router-dom'
// it needs imported from 'react-router' here for some reason
// to allow it to be stubbed by sinon
import Router from 'react-router'
import { Location } from 'history'

// internal dependencies
import Factories from '../../../testUtils/Factories'
import Card from './Card'

// component under test
import List from './List'

describe('component/recipes/List', () => {
  const recipes = [
    Factories.schema.RecipeCard.create(),
    Factories.schema.RecipeCard.create(),
    Factories.schema.RecipeCard.create(),
  ]
  let useLocationStub: SinonStub<any, any>

  let wrapper: ShallowWrapper

  before(() => {
    useLocationStub = sinon
      .stub(Router, 'useLocation')
      .callsFake(() => ({ search: '' } as Location<{}>))
  })
  beforeEach(() => {
    wrapper = shallow(<List recipes={recipes} />)
  })
  afterEach(() => {
    useLocationStub.resetHistory()
  })
  after(() => {
    useLocationStub.restore()
  })

  it('renders a list of cards for each Recipe given', () => {
    expect(wrapper.find(Card)).to.have.lengthOf(3)
  })
})
