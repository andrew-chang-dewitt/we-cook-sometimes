import 'mocha'
import { expect } from 'chai'
import sinon, { SinonStub } from 'sinon'
import { shallow, configure, ShallowWrapper } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Router from 'react-router'
import { Location } from 'history'

configure({ adapter: new Adapter() })

import React from 'react'

import { Recipe } from '../../lib/data/fetch'
import Card from './Card'

import List from './List'

describe('src/component/recipes/List', () => {
  const recipes = [
    { id: 'recipe' } as Recipe,
    { id: 'recipe' } as Recipe,
    { id: 'recipe' } as Recipe,
  ]

  let wrapper: ShallowWrapper
  let useLocationStub: SinonStub<any, any>

  beforeEach(() => {
    useLocationStub = sinon.stub(Router, 'useLocation').callsFake(() => {
      console.log('inside stubbed useLocation')

      return { search: '' } as Location<{}>
    })
    wrapper = shallow(<List recipes={recipes} />)
  })
  afterEach(() => {
    useLocationStub.restore()
  })

  it('renders a list of cards for each Recipe given', () => {
    expect(wrapper.find(Card)).to.have.lengthOf(3)
  })
})
