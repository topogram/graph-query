// import Commit from './TopoQuery.commit.js'

/**
 * TopoQueryParser is a parser for topogram-style query for network manipulations
 *
 * @name TopoQueryParser
 * @kind class
 * @example const parser = new TopoQueryParser();
 */
class TopoQueryParser {
  constructor() {
    // this.options = options || {}
    // this.currentSelection

    this.actions = ['add', 'delete', 'set', 'show', 'hide' ]
  }



  // * @returns {string} type Nodes or edges
  // * @property {Array} elements The descriptions of the element

  /**
  * @name parseSelector
  * @param {String} selector the raw selector as a string
  * @returns { Object } the parsed selection object
  */
  parseSelector(s) {

    let type = 'nodes' // default type
    if (s.slice(0, 4) == 'edge') type = 'edges'

    let selector = []

    switch(s.split(':').length) {
      case 1:
        switch(s) {
          case 'nodes' :
            selector.push({ 'id' : '*'}); break;
          case 'edges' :
            selector.push({ 'id' : '*'}); break;
          default:
            // single node
            selector.push({ 'id' : s}); break;
        }
        break;
      case 2:
        // single element by ID
        selector.push({ 'id' : s.split(':')[1] }); break;
      case 3:
        // by props
        let props = {}
        props[s.split(':')[1]] = s.split(':')[2]
        selector.push(props); break;
        break;
      default:
        throw new Error('Selector ' + s + ' is too long')
        break;
    }

    return {
      type,
      selector
    }
  }

  /**
  * @name parseAction
  * @param {String} action The action to be executed
  * @returns { Object }
  */
  parseAction(a) {
    let action = ( a == undefined ) ? 'show' : a  // default action
    if( this.actions.indexOf(action) < 0 ) throw new Error('Unkown action : '+ action)
    return action.toUpperCase()
  }

  /**
  * @name parseOptions
  * @param {String} options The options for the command
  * @returns { Array } array of options properly parsed
  */
  parseOptions(opts) {
    if (opts == undefined || opts.length == 0) throw new Error('Query options can not be undefined ')
    let options = {}
    opts.forEach(o => {
      let q = o.split(':')
      if(q.length > 2) throw new Error('Malformed options query : '+ q)
      options[ q[0] ] = isNaN( q[1] )  ? q[1] : parseFloat(q[1])
    })

    return options
  }


  /**
  * The main function for the parser
  *
  * @name parse
  * @param {String} q the query
  * @return {Object} An object containing selection and action
  */
  parse(q) {

    // support complex expressions using blank spaces
    const query = q.match(/(?:[^\s"]+|"[^"]*")+/g)
                    .map( s => s.replace(/\"/g, '') ) // delete quotemarks

    const { type, selector } = this.parseSelector( query[0] )

    let action = this.parseAction(query[1])
    let options = ( action == 'SET' ) ? this.parseOptions( query.slice(2) ) : null

    return {
      q,
      selector,
      type,
      action,
      options
    }
  }


}


export default TopoQueryParser
