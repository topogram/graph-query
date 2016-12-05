import { assert }  from 'chai'
import TopoQuery  from '../src/js/TopoQuery.js'

import queries from './queries.js'

describe('parser', () => {

  it('should accept only strings', ()=>{
    assert.throws(function(){
      new TopoQuery(54)
    }, Error)

    assert.throws(function(){
      new TopoQuery({})
    }, Error)

    assert.throws(function(){
      new TopoQuery([])
    }, Error)
  })

  it('should return the original query', ()=>{
    const { q } = new TopoQuery('John loves Jim')
    assert.equal(q, 'John loves Jim')
  })

  it('should return the complete parsed query', ()=>{
    const q = new TopoQuery('John loves Jim')
    assert.deepEqual(Object.keys(q), ['id', 'q', 'selector', 'action', 'options'])
  })

  it('should parse a basic query', ()=>{
    const { selector, action, options } = new TopoQuery('nodes show')
    assert.equal(action, 'SHOW')
    assert.deepEqual( selector, {'id' : '*', 'elType': 'nodes'} )
    assert.equal(selector.elType, 'nodes')
    assert.deepEqual( options, null )
  })

  describe('selector', () => {

    it('should differentiate nodes and edges', () => {
      assert.equal(new TopoQuery('nodes show').selector.elType, 'nodes')
      assert.equal(new TopoQuery('edges show').selector.elType, 'edges')
      assert.equal(new TopoQuery('bla show').selector.elType, 'nodes')
      assert.equal(new TopoQuery('edge:bla show').selector.elType, 'edges')
      assert.equal(new TopoQuery('edge:key:value show').selector.elType, 'edges')
    })

    it('should recognize a single word selector as a node', () => {
      assert.equal(new TopoQuery('John show').selector.elType, 'nodes')
      assert.equal(new TopoQuery('Jalalal show').selector.elType, 'nodes')
      assert.equal(new TopoQuery('edge:loves show').selector.elType, 'edges')
    })

    it('should differentiate a node by name, id, props', () => {
      assert.deepEqual(new TopoQuery('John show').selector, { 'id' : 'John', 'elType': 'nodes'})
      assert.deepEqual(new TopoQuery('nodes show').selector, { 'id' : '*', 'elType': 'nodes'})
      assert.deepEqual(new TopoQuery('edges show').selector, { 'id' : '*', 'elType': 'edges'})
      assert.deepEqual(new TopoQuery('node:John show').selector, { 'id' : 'John', 'elType': 'nodes'})
      assert.deepEqual(new TopoQuery('edge:loves show').selector, { 'id' : 'loves', 'elType': 'edges'})
      assert.deepEqual(new TopoQuery('edge:color:blue show').selector, { 'color' : 'blue', 'elType': 'edges'})
      assert.deepEqual(new TopoQuery('node:weight:42 show').selector, { 'weight' : '42', 'elType': 'nodes'})
    })

    it('should not accept weird selectors', ()=>{
      assert.throws(function() { new TopoQuery('node:weight:green:lklk show'), Error })
    })

    it('should support expressions using blank spaces', ()=>{
      assert.deepEqual(
        new TopoQuery('node:cyto:"[weight >= 50][height < 180]" show').selector,
        { 'cyto' : '[weight >= 50][height < 180]', 'elType' : 'nodes' })
    })

    it('default should be nodes and custom properties', () => {
      const { selector } = new TopoQuery('group:animals show')
      assert.deepEqual( selector, { 'elType' : 'nodes', 'group' : 'animals' } )
    })

    it('should handle a "elType" property with an Error', () => {
      assert.throws(function(){ new TopoQuery('elType:animals show') }, Error)
    })

  })

  describe('actions', () => {

    it('when no actions specified, default to show ', ()=>{
      const { action } = new TopoQuery('nodes')
      assert.equal(action, 'SHOW')
    })

    it('should only accept existing actions', ()=>{
      assert.throws(function() {
        new TopoQuery('edge:bla dance')
      }, Error)

      assert.throws(function() {
        new TopoQuery('node dance')
      }, Error)
    })
  })
})

describe('commands', () => {

  describe('ADD (node creation)', () => {
    it('should allow node creation with options', ()=>{

      let q = 'node add id:zappa color:blue name:"Frank Zappa" longitude:"1.23" latitude:"1.23" starred:false'

      const { selector, action, options } = new TopoQuery(q)
      assert.deepEqual( selector, { id : null, 'elType': 'nodes' } )
      assert.equal(action, 'ADD')
      assert.deepEqual( options, {
        id : 'zappa',
        color : 'blue',
        name : 'Frank Zappa',
        longitude: 1.23,
        latitude: 1.23,
        starred : false
      })

    })
  })

  describe('LINK (edge creation)', () => {

    it('requires a target node as an option', ()=>{
      assert.throws(function() {
        new TopoQuery('bla dance')
      }, Error)
    })

    it('creates a target node as an option', ()=>{
      const { selector, action, options } = new TopoQuery('John loves Jim')
      assert.deepEqual( selector, {'id' : 'John', 'elType': 'nodes'} )
      assert.equal(action, 'LINK')
      assert.deepEqual( options, {'id' : 'Jim', 'elType' : 'nodes'} )
    })

    it('creates a selector node and a target', ()=>{
      const { selector, action, options } = new TopoQuery('node:color:blue loves Jim')
      assert.deepEqual( selector, {'color' : 'blue', 'elType': 'nodes'} )
      assert.equal(action, 'LINK')
      assert.deepEqual( options, {'id' : 'Jim', 'elType' : 'nodes'} )
    })

    it('creates a selector target', ()=>{
      const { selector, action, options } = new TopoQuery('Jim loves node:color:blue')
      assert.deepEqual( selector, {'id' : 'Jim', 'elType' : 'nodes'} )
      assert.equal(action, 'LINK')
      assert.deepEqual( options, {'color' : 'blue', 'elType': 'nodes'} )
    })

  })

  describe('SET (update properties)', () => {

    it('should require options with SET action', ()=>{
      assert.throws(function() {
        new TopoQuery('nodes set')
      }, Error)
    })

    it('should not accept malformed options for SET action', ()=> {
      const q = 'nodes set color:klskd:name:53'
      assert.throws(function() {
        new TopoQuery(q)
      }, Error)
    })

    it('should parse multiple options for SET action', ()=> {
      const q = 'nodes set color:blue name:"Jean-Claude Dus" weight:53'
      const { selector, action, options } = new TopoQuery(q)
      assert.equal(action, 'SET')
      assert.deepEqual( selector, { 'id' : '*', 'elType' : 'nodes' } )
      assert.deepEqual( options, { 'color' : 'blue', name : 'Jean-Claude Dus', weight : 53 }  )
    })

    it('should wotk for edge', ()=> {
      const q = 'edge:bla set color:blue name:"Jean-Claude Dus" weight:53'
      const { selector, action, options } = new TopoQuery(q)
      assert.equal(action, 'SET')
      assert.deepEqual( selector, { 'id' : 'bla', 'elType' : 'edges' } )
      assert.deepEqual( options, { 'color' : 'blue', name : 'Jean-Claude Dus', weight : 53 }  )
    })

  })

  describe('MERGE (merge two nodes)', () => {

    it('has required options', ()=>{
      assert.throws(function() {
        new TopoQuery('john merge')
      }, Error)
    })

    it('should returns two selectors', () => {
      const { selector, action, options } = new TopoQuery('John merge Jim')
      assert.equal(action, 'MERGE')
      assert.deepEqual( selector, { 'id' : 'John', 'elType' : 'nodes' } )
      assert.deepEqual( options, { 'id' : 'Jim', 'elType' : 'nodes' } )
    })

  })

  describe('DELETE (remove a node or an edge)', () => {
    it('should returns a delete event with no options', () => {
      const { selector, action, options } = new TopoQuery('John delete')
      assert.equal(action, 'DELETE')
      assert.deepEqual( selector, { 'id' : 'John', 'elType' : 'nodes' } )
      assert.deepEqual( options, null )
    })

    it('should work with edges', () => {
      const { selector, action, options } = new TopoQuery('edge:love delete')
      assert.equal(action, 'DELETE')
      assert.deepEqual( selector, { 'id' : 'love', 'elType' : 'edges' } )
      assert.deepEqual( options, null )
    })
  })

  describe('SHOW/HIDE (toggle elements)', () => {
    it('should returns a show event with no options', () => {
      const { selector, action, options } = new TopoQuery('id:animals show')
      assert.equal(action, 'SHOW')
      assert.deepEqual( selector, { 'elType' : 'nodes', 'id' : 'animals' } )
      assert.deepEqual( options, null )
    })

    it('should work with edges', () => {
      const { selector, action, options } = new TopoQuery('edge:love hide')
      assert.equal(action, 'HIDE')
      assert.deepEqual( selector, { 'id' : 'love', 'elType' : 'edges' } )
      assert.deepEqual( options, null )
    })
  })

})

// describe('multiple queries OK', () => {
//   it('should parse all those queries correctly', () => {
//     const instructions = queries.map(q => new TopoQuery(q))
//     assert.equal(queries.length, instructions.length)
//   })
//
//   it('should handle creation of successive nodes correctly', () => {
//
//     const { selector, action, options } = new TopoQuery('node add Jim')
//     console.log(selector, action, options);
//     assert.deepEqual( selector, {'name' : 'Jim', id : null, 'elType': 'nodes'} )
//     assert.equal(action, 'ADD')
//
//   })
// })
