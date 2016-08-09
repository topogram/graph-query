import Commit from './TopoQuery.commit.js'
import TopoQueryParser from './TopoQuery.parser.js'

global.TopoQueryParser = TopoQueryParser
window.TopoQueryParser = TopoQueryParser

// add commit
global.Commit = Commit
window.Commit = Commit
