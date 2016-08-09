/**
 *
 * The Commit class is will store a diff that can be applied to a graph
 * Each commit has a unique ID.
 * Each commit is serializable, to make it easy to be stored and create undo/redo.
 *
 * @name Commit
 * @kind class
 * @param {Array} instructions A list of RAW instructions
 * @param {String} instructions  A JSON-stringified Commit object
 * @example var commit = new Commit(...)
 */

import crypto from 'crypto'

class Commit {

  constructor(instructions) {

    if (typeof(instructions) == 'string' ) {
      let { id, diff }= this.fromJSON(instructions)
      this.id = id
      this.diff = diff
    }
    else if (instructions instanceof Array ) {
      this.diff = this.parseInstructions(instructions)
      this.id = crypto.randomBytes(20).toString('hex')
    }
    else throw new Error('Instructions should be an array')

  }

  /**
  * parse an Array of raw instructions into a proper diff
  * @name parseInstructions
  * @param {Array} instructions  An array of instructions
  *
  */

  parseInstructions(instructions) {

    if( instructions.length == 0 )  throw new Error('Instructions array can not be empty')

    // final diff
    let diff =  {
      nodes : {
        add : [],
        update : [],
        delete : []
      },
      edges : {
        add : [],
        update : [],
        delete : []
      }
    }

    instructions.forEach(k =>{
      let action = this.parseActions( k['action'], k['elements'])
      diff[k['type']][action.type].push(...action.elements)
    })

    return diff
  }


  /**
  * @name parseActions
  * @param {String} action  One of the action defined in legalActions
  * @param {Array} elements An array of nodes or edges
  *
  * Many of the sanity checks happen here
  */
  parseActions( action, elements) {

    const legalActions = ['ADD', 'UPDATE', 'DELETE']


    if( ! elements instanceof Array ) throw new Error('elements should be an array')

    if( ! action instanceof String ) throw new Error('action should be a string')
    else if( legalActions.indexOf(action) < -1 ) throw new Error('action should be legal')

    switch (action) {
      case 'ADD' :  return { type : 'add',  elements : elements }
      case 'UPDATE' :  return { type : 'update', elements : elements }
      case 'DELETE' : return  { type : 'delete', elements : elements }
    }
  }

  toJSON() {
    return JSON.stringify({ id : this.id, diff : this.diff })
  }

  fromJSON(json) {
    return JSON.parse(json)
  }
}

export default Commit
