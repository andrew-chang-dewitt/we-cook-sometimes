import 'mocha'
import sinon, { SinonStub } from 'sinon'
import { expect } from 'chai'

import { recipes } from './recipes'
import * as fetch from './fetch'

describe('lib/data/Recipes', () => {
  let trelloStub: SinonStub<any, any>

  before(() => {
    trelloStub = sinon.stub(fetch, 'trello').returns(
      Promise.resolve([
        {
          id: 'recipe1',
          name: 'One',
          desc: 'description',
          idList: 'list1',
          labels: [
            {
              id: 'label1',
              idBoard: 'aBoard',
              name: 'a label',
              color: 'color',
            },
          ],
          idAttachmentCover: 'cover1',
        },
        {
          id: 'recipe2',
          name: 'Two',
          desc: 'description',
          idList: 'list1',
          labels: [
            {
              id: 'label1',
              idBoard: 'aBoard',
              name: 'a label',
              color: 'color',
            },
            {
              id: 'label2',
              idBoard: 'aBoard',
              name: 'published',
              color: 'color',
            },
          ],
          idAttachmentCover: 'cover1',
        },
      ])
    )
  })
  after(() => {
    trelloStub.restore()
  })

  it('Recipes only returns cards with the `published` tag', async () => {
    let result = await recipes()

    expect(result[0].name).to.equal('Two')
  })
})
