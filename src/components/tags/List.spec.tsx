// testing tools
import 'mocha'
import { expect } from 'chai'
import { shallow, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
configure({ adapter: new Adapter() })
import React from 'react'

// dependencies
import { Tag as TagType } from '../../lib/data/fetch'
import Tag from './Tag'

// component under test
import List from './List'

describe('component/tags/List', () => {
  it('renders a list of given Tags', () => {
    const tags = ([1, 2, 3] as Array<any>) as Array<TagType>

    const list = shallow(<List tags={tags} />)

    expect(list.find(Tag)).to.have.lengthOf(3)
  })
})
