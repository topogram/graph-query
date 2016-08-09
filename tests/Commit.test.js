import { assert }  from 'chai'
import Commit  from '../src/Commit.js'

const instructions  = [
    {
      action : 'ADD',
      type : 'nodes',
      elements : [
        { 'id' : '1', 'name' : 'A'},
        { 'id' : '2', 'name' : 'B'},
        { 'id' : '3', 'name' : 'C'}
      ]
    },
    {
      action : 'ADD',
      type : 'edges',
      elements : [
        { 'id' : 'edgeA', 'source' : '1', 'target' : '2'},
        { 'id' : 'edgeB', 'source' : '1', 'target' : '3'},
        { 'id' : 'edgeC', 'source' : '2', 'target' : '3'}
      ]
    },
    {
      action : 'DELETE',
      elements : [
        'edgeB'
      ],
      type : 'edges'
    },
    {
      action : 'ADD',
      elements : [
        { 'id' : 'edgeD', 'source' : '3', 'target' : '2'},
        { 'id' : 'edgeE','source' : '5', 'target' : '3'}
      ],
      type : 'edges'
    },
    {
      action : 'DELETE',
      elements : ['1'],
      type : 'nodes'
    },
    {
      action : 'ADD',
      elements  : [
        '4',
        '5',
        '6'
      ],
      type: 'nodes'
    },
    {
      action : 'UPDATE',
      elements : [
        { 'ids' : ['2'],  'updates' : { 'name' : 'yeepeeee!' } }
      ],
      type: 'nodes'
    }
]

describe('Commit', () => {

  it('has a unique ID', () => {
    let commitA = new Commit(instructions)
    let commitB = new Commit(instructions)
    assert.equal(typeof(commitA.id), 'string')
    assert.isAtLeast(commitA.id.length, 20)
    assert.notEqual(commitA.id, commitB.id)
  })

  it('does not accept empty instructions args at init', () =>{
    assert.throws(function() {
        new Commit([])
    }, Error)
  })

  it('export/import JSON correctly', () =>{
    let commitA = new Commit(instructions)
    let j = commitA.toJSON()
    let commitB = new Commit(j)
    assert.equal(commitA.id, commitB.id)
    assert.deepEqual(commitA.diff, commitB.diff)
  })
  
})
