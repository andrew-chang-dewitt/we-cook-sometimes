import 'mocha'
import { expect } from 'chai'
import { shallow, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

import React from 'react'

import { Recipe } from '../../lib/data/fetch'
import Card from './Card'

import List from './List'

describe('src/component/recipes/List', () => {
  it('renders a list of cards for each Recipe given', () => {
    const recipes = [
      ('recipe' as any) as Recipe,
      ('recipe' as any) as Recipe,
      ('recipe' as any) as Recipe,
    ]
    expect(
      shallow(<List recipes={recipes} openId={null} />).find(Card)
    ).to.have.lengthOf(3)
  })
})
