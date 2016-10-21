import Commit from './TopoQuery.commit.js'
import TopoQuery from './TopoQuery.parser.js'

global.TopoQuery = TopoQuery
window.TopoQuery = TopoQuery

// add commit
global.Commit = Commit
window.Commit = Commit
