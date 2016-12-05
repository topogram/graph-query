/**
 * TopoQuery is a parser for topogram-style query for network manipulations
 *
 * @name TopoQuery
 * @kind class
 * @param {String} q The query
 * @example const q = new TopoQuery('nodes show');
 */

import crypto from 'crypto'

class TopoQuery {

  constructor(q) {
    if ( q == undefined ) throw new Error('Empty query : TopoQuery requires a query')
    else if ( typeof(q) != 'string' ) throw new Error('Query should be a string : '+ q)

    this.actions = ['add', 'delete', 'set', 'show', 'hide', 'merge' ] // + LINK

    let id = crypto.randomBytes(20).toString('hex')

    // parse
    const { selector, action, options } = this.parse(q)

    this.selector = selector
    this.action = action
    this.options = options

    return {
      id,
      q,
      selector,
      action,
      options
    }
  }

  /**
  * @name parseSelector
  * @param {String} selector the raw selector as a string
  * @returns { Object } the parsed selection object
  */
  parseSelector(s, q) {

    let type = 'nodes' // default type
    if (s.slice(0, 4) == 'edge') type = 'edges'
    let selector = {}
    switch(s.split(':').length) {
      case 1:
        switch(s) {
          case 'nodes' :
            selector = { 'id' : '*', 'elType' : 'nodes'}
            break;
          case 'edges' :
            selector = { 'id' : '*', 'elType' : 'edges'}
            break;
          default:
            // single node
            let id = (s == 'node') ? null : s
            selector = { 'id' : id, 'elType' : 'nodes'}
            break;
        }
        break;
      case 2:
        // single element by ID
        selector = { 'elType' : type };
        let split = s.split(':')
        if (split[0] === 'node' || split[0] === 'edge' ) selector.id = split[1]
        else if (split[0] === 'elType') throw new Error('Reserved word "elType" in ' + q )
        else selector[ split[0] ] = split[1]
        break;
      case 3:
        // by props
        split = s.split(':')
        selector = { 'elType' : type }
        if (split[0] === 'node' || split[0] === 'edge' ) selector.elType = split[0]+"s"
        selector[ split[1] ] = split[2]
        console.log(selector)
        break;
      default:
        throw new Error('Selector ' + s + ' is too long : '+q)
    }

    return selector
  }

  /**
  * @name parseAction
  * @param {String} a The action to be executed
  * @param {String} type The type of elements (nodes or edges)
  * @param {String} q The original query
  * @returns { Object }
  */
  parseAction(a, type, q) {
    let action = ( a == undefined ) ? 'show' : a  // default action
    if( this.actions.indexOf(action) > -1 ) return action.toUpperCase()
    else if ( type == 'edges' ) throw new Error('Unkown action : '+ action + ' in :' + q)
    else return 'LINK' // create a link
  }

  /**
  * @name parseOptions
  * @param {String} options The options for the command
  * @returns { Array } array of options properly parsed
  */
  parseOptions(action, opts, q) {
    if (opts == undefined || opts.length == 0)
      throw new Error('Query options for '+ action +' can not be undefined : ' +q )

    let options = {}

    if (action == 'SET' || action == 'ADD') {
      opts.forEach(o => {

        let q = o.split(':')

        if(q.length > 2)
          throw new Error('Malformed options query : '+ q)
        else if (q.length == 1)
          options["id"] = q[0] // set default to id
        else
          // check if Nan
          options[ q[0] ] =
            ( q[1] === 'true' || q[1] === 'false')
            ?
            JSON.parse( q[1] )
              : isNaN( q[1] )
              ?
              q[1] : parseFloat(q[1])
      })
      return options

    } else if (action == 'LINK' || action == 'MERGE' ) {
      return this.parseSelector(...opts)
    } else {
      throw new Error('Unkown method '+ action +' in : ' +q)
    }
  }



  /**
  * The main function for the parser
  *
  * @name parse
  * @param {String} q the query
  * @return {Object} An object containing selection and action
  */
  parse(q) {

    // split by blank spaces with doublequotes expression support
    const query = q.match(/(?:[^\s"]+|"[^"]*")+/g)
                    .map( s => s.replace(/\"/g, '') ) // delete quotemarks from results

    // get the selector
    let selector = this.parseSelector( query[0] )

    let action = this.parseAction(query[1])

    let options = ( ['SET', 'LINK', 'ADD', 'MERGE'].indexOf(action) > -1 ) ? this.parseOptions( action, query.slice(2), q ) : null

    return {
      selector,
      action,
      options
    }
  }

}

// export for browser
// global.TopoQuery = TopoQuery
if(typeof window !== 'undefined') window.TopoQuery = TopoQuery

// ES6 export
export default TopoQuery
