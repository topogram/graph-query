import { assert }  from 'chai'
import Commit  from '../src/js/TopoQuery.commit.js'
import TopoQuery  from '../src/js/TopoQuery.parser.js'
import moment from 'moment'
import queries from './queries.js'

const qs = [
  'node add id:Jon color:blue',
  'node add id:Jack',
  'node add id:Joe',
  'Joe likes Jack',
  'Jon hates Jack',
  'Jon ignores Jack'
]

describe('Commit', () => {

  const instruction = new TopoQuery('Joe loves Jack')
  const instructions = qs.map(q => new TopoQuery(q) )

  describe('init', () => {
    it('does not accept empty params', () =>{
      assert.throws(function() {
          new Commit()
      }, Error)
    })

    it('does not accept an empty Array', () =>{
      assert.throws(function() {
          new Commit([])
      }, Error)
    })

    it('does not accept weird objects', () =>{
      assert.throws(function() {
          new Commit({ 'bla' : 'loves'})
      }, Error)
    })

    it('does accept a single instruction', () =>{
      new Commit(instruction)
    })

    it('does accept an array of instructions', () =>{
      new Commit(instructions)
    })
  })

  describe('storage', () => {

    it('has a unique ID', () => {
      let commitA = new Commit(instruction)
      let commitB = new Commit(instruction)
      assert.equal(typeof(commitA.id), 'string')
      assert.isAtLeast(commitA.id.length, 20)
      assert.notEqual(commitA.id, commitB.id)
    })

    it('stores a date Object when created', () =>{
      let commitA = new Commit(instruction)
      assert.isTrue(moment(commitA.ts).isValid())
    })

    it('export/import JSON correctly', () => {
      let commitA = new Commit(instruction)
      let j = commitA.toJSON()
      let commitB = new Commit(j)
      assert.equal(commitA.id, commitB.id)
      assert.deepEqual(commitA.diff, commitB.diff)
      assert.isTrue(moment(commitA.ts).isValid())
      assert.isTrue(moment(commitB.ts).isValid())
    })

  })

  describe('features', () =>{

    it('should store creation of nodes', () =>{
      let c = new Commit(instruction)
      assert.equal(c.diff.add.length, 1)
    })

    it('should store creation of nodes', () =>{
      let c = new Commit(instructions)
      assert.equal(c.diff.add.length, 6)
    })

    describe("LINK", () => {
      it('should add both source and target nodes', () =>{
        const instruction = new TopoQuery('Joe loves Jack')
        let c = new Commit(instruction)
        // assert.equal(c.diff.add.length, 3)
        // console.log(c.diff)
      })
    })

  })

  it('should work with a bunch of queries', () => {
    let c = new Commit( queries.map(q => new TopoQuery(q)) )
  })
})
