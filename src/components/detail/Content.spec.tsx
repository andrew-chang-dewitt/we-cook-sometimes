import 'mocha'
import { expect } from 'chai'
import { shallow, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

import React from 'react'

import Content from './Content'

describe('src/component/detail/Content', () => {
  it('renders markdown content into html', () => {
    expect(shallow(<Content data="# Header" />).html()).to.equal(
      '<div><h1>Header</h1></div>'
    )
  })
})
