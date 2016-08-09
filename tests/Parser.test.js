import { assert }  from 'chai'
import TopoQuery  from '../src/js/TopoQuery.parser.js'

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
    assert.deepEqual(Object.keys(q), ['q', 'selector', 'action', 'options'])
  })

  it('should parse a basic query', ()=>{
    const { selector, action, options } = new TopoQuery('nodes show')
    assert.equal(action, 'SHOW')
    assert.deepEqual( selector, {'id' : '*', 'type': 'nodes'} )
    assert.equal(selector.type, 'nodes')
    assert.deepEqual( options, null )
  })

  describe('actions', () => {

    it('should accept no actions and default to show ', ()=>{
      const { action } = new TopoQuery('nodes')
      assert.equal(action, 'SHOW')
    })

    it('should only accept existing actions for edges', ()=>{
      assert.throws(function() {
        new TopoQuery('edge:bla dance')
      }, Error)
    })

    // describe('node creation', () => {
    //
    //   it('should allow node creation with options', ()=>{
    //
    //     let q = 'node add id:zappa color:blue name:"Frank Zappa" longitude:"1,23" latitude:"1,23" starred:false'
    //
    //     const { type, query, selector, action, options } = new TopoQuery(q)
    //     console.log(selector);
    //
    //     assert.deepEqual( selector, { id : null, 'type': 'nodes' } )
    //     assert.equal(q, query)
    //     assert.equal(action, 'ADD')
    //     assert.deepEqual( options, [ {
    //       color : 'blue',
    //       name : 'Frank Zappa',
    //       longitude: '1,23',
    //       latitude: '1,23',
    //       starred : false
    //     } ])
    //
    //   })
    //
    // })


    describe('link creation', () => {

      it('requires a target node as an option', ()=>{
        assert.throws(function() {
          new TopoQuery('bla dance')
        }, Error)
      })

      it('creates a target node as an option', ()=>{
        const { selector, action, options } = new TopoQuery('John loves Jim')
        assert.deepEqual( selector, {'id' : 'John', 'type': 'nodes'} )
        assert.equal(action, 'LINK')
        assert.deepEqual( options, {'id' : 'Jim', 'type' : 'nodes'} )
      })
    })
  })

  describe('selector', () => {

    it('should differentiate nodes and edges', () => {
      assert.equal(new TopoQuery('nodes show').selector.type, 'nodes')
      assert.equal(new TopoQuery('edges show').selector.type, 'edges')
      assert.equal(new TopoQuery('bla show').selector.type, 'nodes')
      assert.equal(new TopoQuery('edge:bla show').selector.type, 'edges')
      assert.equal(new TopoQuery('edge:key:value show').selector.type, 'edges')
    })

    it('should recognize a single word selector as a node', () => {
      assert.equal(new TopoQuery('John show').selector.type, 'nodes')
      assert.equal(new TopoQuery('Jalalal show').selector.type, 'nodes')
      assert.equal(new TopoQuery('edge:loves show').selector.type, 'edges')
    })

    it('should differentiate a node by name, id, props', () => {
      assert.deepEqual(new TopoQuery('John show').selector, { 'id' : 'John', 'type': 'nodes'})
      assert.deepEqual(new TopoQuery('nodes show').selector, { 'id' : '*', 'type': 'nodes'})
      assert.deepEqual(new TopoQuery('edges show').selector, { 'id' : '*', 'type': 'edges'})
      assert.deepEqual(new TopoQuery('node:John show').selector, { 'id' : 'John', 'type': 'nodes'})
      assert.deepEqual(new TopoQuery('edge:loves show').selector, { 'id' : 'loves', 'type': 'edges'})
      assert.deepEqual(new TopoQuery('edge:color:blue show').selector, { 'color' : 'blue', 'type': 'edges'})
      assert.deepEqual(new TopoQuery('node:weight:42 show').selector, { 'weight' : '42', 'type': 'nodes'})
    })

    it('should not accept weird selectors', ()=>{
      assert.throws(function() { new TopoQuery('node:weight:green:lklk show'), Error })
    })

    it('should support expressions using blank spaces', ()=>{
      assert.deepEqual(
        new TopoQuery('node:cyto:"[weight >= 50][height < 180]" show').selector,
        { 'cyto' : '[weight >= 50][height < 180]', 'type' : 'nodes' })
    })

  })

  describe('options', () => {

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
      assert.deepEqual( selector, { 'id' : '*', 'type' : 'nodes' } )
      assert.deepEqual( options, { 'color' : 'blue', name : 'Jean-Claude Dus', weight : 53 }  )
    })

  })

  describe('queries OK', () => {
    it('should parse all those queries correctly', () => {
      const instructions = queries.map(q => new TopoQuery(q))
      assert.equal(queries.length, instructions.length)
    })
  })

})
