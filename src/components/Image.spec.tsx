import 'mocha'
import { expect } from 'chai'
import { shallow, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import sinon from 'sinon'

configure({ adapter: new Adapter() })

import React from 'react'

// import { ok } from '../utils/Result'
// import fetch, { Image as ImageType } from '../lib/data/fetch'
import Image from './Image'

describe('src/components/Image', () => {
  // stub out React's state, since it's set inside a useEffect &
  // relies entirely on an internal lib already tested thoroughly
  // on its own.
  const dispatch = (newValue: any) => {
    newValue
  }
  const useStateStub = sinon.stub(React, 'useState').returns([
    {
      name: 'image name',
      url: 'url',
      edgeColor: 'color',
    },
    dispatch,
  ])

  afterEach(() => {
    useStateStub.restore()
  })

  it('fetches image data from a given card & attachment Id, then renders an image', () => {
    expect(
      shallow(<Image cardId="id" attachmentId="id" />).find('img')
    ).to.have.lengthOf(1)
  })

  it('renders nothing while it is waiting on the image', () => {
    useStateStub.returns([null as any, dispatch])

    expect(shallow(<Image cardId="id" attachmentId="id" />).html()).to.equal('')
  })
})
