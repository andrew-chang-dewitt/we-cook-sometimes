import React from 'react'
import { expect } from 'chai'
import 'mocha'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

import { Hello } from './Hello'

describe('Hello', () => {
  it('renders a greeting', () => {
    const wrapper = shallow(<Hello />)

    expect(wrapper.text()).to.equal('Hello world!')
  })
})
