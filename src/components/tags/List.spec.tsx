// testing tools
import 'mocha'
import { expect } from 'chai'
import { shallow, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
configure({ adapter: new Adapter() })
import Factories from '../../testUtils/Factories'

import React from 'react'

// dependencies
import Tag from './Tag'

// component under test
import List from './List'

describe('component/tags/List', () => {
  it('renders a list of given Tags', () => {
    const tags = [
      Factories.schema.Tag.create(),
      Factories.schema.Tag.create(),
      Factories.schema.Tag.create(),
    ]

    const list = shallow(<List tags={tags} />)

    expect(list.find(Tag)).to.have.lengthOf(3)
  })
})
