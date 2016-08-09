import { assert }  from 'chai'
import TopoQueryParser  from '../src/js/TopoQuery.parser.js'

import queries from './queries.js'

describe('parser', () => {

  const parser = new TopoQueryParser()

  it('should parse a basic query', ()=>{
    const { type, q, selector, action, options } = parser.parse('nodes show')
    assert.equal(action, 'SHOW')
    assert.equal(type, 'nodes')
    assert.equal(q, 'nodes show')
    assert.deepEqual( selector, [ {'id' : '*'} ] )
    assert.deepEqual( options, null )
  })

  describe('actions', () => {
    it('should accept no actions and default to show ', ()=>{
      const { type, q, action } = parser.parse('nodes')
      assert.equal(action, 'SHOW')
      assert.equal(type, 'nodes')
      assert.equal(q, 'nodes')
    })

    it('should only accept existing actions for edges', ()=>{
      assert.throws(function() {
        parser.parse('edge:bla dance')
      }, Error)
    })

    describe('node creation', () => {

      it('should allow node creation with options', ()=>{
        let q = 'node add id:zappa color:blue name:"Frank Zappa" longitude:"1,23" latitude:"1,23" starred:false'

        const { type, TopoQueryParser, selector, action, options } = parser.parse(q)
        console.log(selector);

        assert.deepEqual( selector, [{ id : null }] )
        assert.equal(type, 'nodes')
        assert.equal(q, TopoQueryParser)
        assert.equal(action, 'ADD')
        assert.deepEqual( options, [ {
          color : 'blue',
          name : 'Frank Zappa',
          longitude: '1,23',
          latitude: '1,23',
          starred : false
        } ])

      })

    })

    describe('link creation', () => {

      it('requires a target node as an option', ()=>{
        assert.throws(function() {
          parser.parse('bla dance')
        }, Error)
      })

      it('creates a target node as an option', ()=>{
        const { type, q, selector, action, options } = parser.parse('John loves Jim')
        assert.equal(action, 'LINK')
        assert.equal(type, 'nodes')
        assert.equal(q, 'John loves Jim')
        assert.deepEqual( selector, [ {'id' : 'John'} ] )
        assert.deepEqual( options, [ {'id' : 'Jim'} ] )
      })

    })
  })

  describe('selector', () => {

    it('should differentiate nodes and edges', () => {
      assert.equal(parser.parse('nodes show').type, 'nodes')
      assert.equal(parser.parse('edges show').type, 'edges')
      assert.equal(parser.parse('node show').type, 'nodes')
      assert.equal(parser.parse('edge show').type, 'edges')
      assert.equal(parser.parse('edge:key:value show').type, 'edges')
    })

    it('should recognize a single word selector as a node', () => {
      assert.equal(parser.parse('John show').type, 'nodes')
      assert.equal(parser.parse('Jalalal show').type, 'nodes')
      assert.equal(parser.parse('edge:loves show').type, 'edges')
    })

    it('should differentiate a node by name, id, props', () => {

      assert.equal(parser.parse('John show').type, 'nodes')
      assert.deepEqual(parser.parse('John show').selector, [{ 'id' : 'John'}])

      assert.equal(parser.parse('nodes show').type, 'nodes')
      assert.deepEqual(parser.parse('nodes show').selector, [{ 'id' : '*'}])

      assert.equal(parser.parse('edges show').type, 'edges')
      assert.deepEqual(parser.parse('edges show').selector, [{ 'id' : '*'}])

      assert.equal(parser.parse('node:John show').type, 'nodes')
      assert.deepEqual(parser.parse('node:John show').selector, [{ 'id' : 'John'}])

      assert.equal(parser.parse('edge:loves show').type, 'edges')
      assert.deepEqual(parser.parse('edge:loves show').selector, [{ 'id' : 'loves'}])

      assert.equal(parser.parse('edge:color:blue show').type, 'edges')
      assert.deepEqual(parser.parse('edge:color:blue show').selector, [{ 'color' : 'blue'}])

      assert.equal(parser.parse('node:weight:green show').type, 'nodes')
      assert.deepEqual(parser.parse('node:weight:green show').selector, [{ 'weight' : 'green'}])

    })

    it('should not accept weird selectors', ()=>{
      assert.throws(function() { parser.parse('node:weight:green:lklk show'), Error })
    })

    it('should support expressions using blank spaces', ()=>{
      assert.deepEqual(parser.parse('node:cyto:"[weight >= 50][height < 180]" show').selector, [{ 'cyto' : '[weight >= 50][height < 180]'}])
    })

  })

  describe('options', () => {

    it('should require options with SET action', ()=>{
      assert.throws(function() {
        parser.parse('nodes set')
      }, Error)
    })

    it('should not accept malformed options for SET action', ()=> {
      const q = 'nodes set color:klskd:name:53'
      assert.throws(function() {
        parser.parse(q)
      }, Error)
    })

    it('should parse multiple options for SET action', ()=> {
      const q = 'nodes set color:blue name:"Jean-Claude Dus" weight:53'
      const { type, selector, action, options } = parser.parse(q)
      assert.equal(action, 'SET')
      assert.equal(type, 'nodes')
      assert.deepEqual( selector, [ {'id' : '*'} ] )
      assert.deepEqual( options, { 'color' : 'blue', name : 'Jean-Claude Dus', weight : 53 }  )
    })

  })

  describe('queries OK', () => {
    it('should parse all those queries correctly', () => {
      const parser = new TopoQueryParser()
      const instructions = queries.map(q => parser.parse(q))
      // console.log(instructions)
      assert.equal(queries.length, instructions.length)
    })
  })

})
