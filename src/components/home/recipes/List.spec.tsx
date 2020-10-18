import 'mocha'
import { expect } from 'chai'
import sinon, { SinonStub } from 'sinon'
import { shallow, configure, ShallowWrapper } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
// despite importing useLocation from 'react-router-dom'
// it needs imported from 'react-router' here for some reason
// to allow it to be stubbed by sinon
import Router from 'react-router'
import { Location } from 'history'

configure({ adapter: new Adapter() })

import React from 'react'

import { Recipe } from '../../../lib/data/fetch'
import Card from './Card'

import List from './List'

describe('component/recipes/List', () => {
  const recipes = [
    { id: 'recipe' } as Recipe,
    { id: 'recipe' } as Recipe,
    { id: 'recipe' } as Recipe,
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
