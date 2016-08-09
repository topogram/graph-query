import crypto from 'crypto'
import equal  from 'deep-equal'

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
class Commit {

  constructor(instructions) {

    if (typeof(instructions) == 'string' ) {
      let { id, diff, ts }= this.fromJSON(instructions)
      this.id = id
      this.diff = diff
      this.ts = ts
    }
    else if (instructions instanceof Array ) {
      this.diff = this.getEmptyDiff()
      this.id = crypto.randomBytes(20).toString('hex')
      this.ts = new Date()
      this.parseInstructions(instructions)
    }
    else if ( this.isValidQuery(instructions) ) {
      this.id = crypto.randomBytes(20).toString('hex')
      this.ts = new Date()
      this.diff = this.getEmptyDiff()
      this.parseInstructions( [instructions] )
    }
    else throw new Error('Instruction is not valid ')
  }

  /**
  * Check if object is a valid query object
  * @name isValidQuery
  * @param {Object} a selector object
  * @return {Boolean} validty
  */
  isValidQuery(instruction) {
    return (
      instruction instanceof Object
      && equal( Object.keys(instruction), ['q', 'selector', 'action', 'options'] )
    )
  }

  /**
  * Get empty model diff
  * @name getEmptyDiff
  * @returns { Object} an empty diff
  */
  getEmptyDiff() {
    return {
      add : [],
      update : [],
      delete : []
    }
  }

  parseAction(q) {
    switch (q.action) {
      case 'ADD' :
        return { type : 'add',  elements : Object.assign(q.selector, q.options) }
      case 'LINK' :
        return { type : 'add',  elements : Object.assign(q.selector, q.options) }
      case 'SET' :
        return { type : 'update', elements : Object.assign(q.selector, q.options) }
      case 'DELETE' :
        return  { type : 'delete', elements : elements }
      default :
        return {}
    }
  }

  /**
  * parse an Array of raw instructions into a proper diff
  * @name parseInstructions
  * @param {Object} instruction  A single instructions
  *
  */
  parseInstruction(q) {
    if (! this.isValidQuery(q)) throw new Error('Instruction is not valid')
    let parsed = this.parseAction(q)
    if(parsed.type) this.diff[ parsed.type ].push(parsed.elements)
  }

  /**
  * parse an Array of raw instructions into a proper diff
  * @name parseInstructions
  * @param {Array} instructions  An array of instructions
  *
  */
  parseInstructions(instructions) {
    if( instructions.length == 0 )  throw new Error('Instructions array can not be empty')
    instructions.forEach( i => this.parseInstruction( i ))
  }

  toJSON() {
    return JSON.stringify({ id : this.id, diff : this.diff, ts : this.ts })
  }

  fromJSON(json) {
    return JSON.parse(json)
  }
}

export default Commit
