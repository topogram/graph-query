/* eslint-disable */

// fake collections
let Nodes = []
let Edges = []

let prevNodesLength = Nodes.length;
let prevEdgesLength = Edges.length;
let currentCommitIndex = 0

const instructions  = [
    {
      action : 'ADD',
      type : 'nodes',
      elements : [
        { 'id' : '1', 'name' : 'A'},
        { 'id' : '2', 'name' : 'B'},
        { 'id' : '3', 'name' : 'C'}
      ]
    },
    {
      action : 'ADD',
      type : 'edges',
      elements : [
        { 'id' : 'edgeA', 'source' : '1', 'target' : '2'},
        { 'id' : 'edgeB', 'source' : '1', 'target' : '3'},
        { 'id' : 'edgeC', 'source' : '2', 'target' : '3'}
      ]
    },
    {
      action : 'DELETE',
      elements : [
        'edgeB', 'edgeA'
      ],
      type : 'edges'
    },
    {
      action : 'ADD',
      elements  : [
        { 'id' : '4', 'name' : 'D'},
        { 'id' : '5', 'name' : 'E'},
        { 'id' : '6', 'name' : 'F'}
      ],
      type: 'nodes'
    },
    {
      action : 'ADD',
      elements : [
        { 'id' : 'edgeD', 'source' : '3', 'target' : '4'},
        { 'id' : 'edgeE','source' : '5', 'target' : '3'}
      ],
      type : 'edges'
    },
    {
      action : 'DELETE',
      elements : ['6'],
      type : 'nodes'
    }
  ]

// a single commit
let commit = new Commit(instructions)
console.log(commit)

// split the instructions into different commits
let commits = instructions.map(i => new Commit([i]))
console.log(commits)

const divCommits = document.getElementById('commits')
const commitsList = document.createElement('ul');
divCommits.appendChild(commitsList)

const logger = document.getElementById('log')

// graph
const cy = initCytoscape()

log('Hello network !')

// init
parseCommitsList()

function clearCommitsList() {
  while(commitsList.firstChild){
    commitsList.removeChild(commitsList.firstChild);
  }
}

function parseCommitsList() {

  clearCommitsList()

  commits.forEach( (c, i) => {

    if (i > currentCommitIndex) return

    let li = document.createElement('li')
    li.className = 'commit'

    let a = document.createElement('a')
    a.innerHTML = 'commit '+i
    a.href= '#'+c.id
    a.title= '#'+c.id
    a.setAttribute('data-commit', c.id)
    a.setAttribute('data-commit-index', i)
    a.onclick = commitOnClick

    li.appendChild(a)
    commitsList.appendChild(li)
  })

}

function commitOnClick(e) {
  e.preventDefault();

  executeCommits()

  // allow next commit
  if(this.dataset.commitIndex == currentCommitIndex) currentCommitIndex++
  else if (this.dataset.commitIndex < currentCommitIndex) currentCommitIndex = this.dataset.commitIndex
  parseCommitsList()

  // console.log(this.dataset);
  // let c = getCommit(this.dataset.commit)
  // console.log(c)
  // applyCommit(c)
}

function getCommit(id) {
  return commits.filter(c => c.id == id)[0]
}

function log(message) {
  logger.innerHTML = logger.innerHTML + '<br>' + message
}

function executeCommits() {
  Nodes = []
  Edges = []
  commits.forEach( (c, i) => {
    if (i > currentCommitIndex) return
    applyCommit(c)
  })
  log('----------------------------------')
  log(''+Nodes.length + ' nodes '+ Edges.length + ' edges')
  log('############################')

  updateCy()
}

// cytoscape
function parseCyElements() {

  let nodes = Nodes.map( (n,i) => (
    {
      data : {
        id : n.id,
        name : n.name
      },
      group : 'nodes',
      position : {
        x: i*75 + 200,
        y : i%2*150 + 200
      }
    })
  )

  let edges = Edges.map(e => (
    {
      data : {
        id : e.id,
        name : e.name,
        source : e.source,
        target : e.target
      },
      group : 'edges'
    })
  )

  // Edges.map(e => console.log(e))
  return nodes.concat(edges)
}

function updateCy() {
  let elements = parseCyElements()
  console.log(elements);
  cy.remove('*')
  cy.json({ elements : elements })
}

function initCytoscape() {
  return cytoscape({
    container: document.getElementById('cy'),
    boxSelectionEnabled: false,
    autounselectify: true,

    layout: {
      name: 'random'
    },

    elements: [],

    style: [
      {
        selector: 'node',
        style: {
          'height': 20,
          'width': 20,
          'background-color': '#18e018'
        }
      },

      {
        selector: 'edge',
        style: {
          'curve-style': 'haystack',
          'haystack-radius': 0,
          'width': 5,
          'opacity': 0.5,
          'line-color': '#a2efa2'
        }
      }
    ]
  })
}

// fake DB methods
function applyCommit(commit, debug=true) {

  log('--------- apply commit '+ commit.id + ' ----------')

  // ADD nodes
  if(commit.diff.nodes.add.length) log('ADD '+commit.diff.nodes.add.length+' nodes')
  Nodes = Nodes.concat(commit.diff.nodes.add)
  if(prevNodesLength != Nodes.length) log('Nodes ADD : before '+prevNodesLength +' / after '+Nodes.length)
  prevNodesLength = Nodes.length

  // DELETE nodes
  if(commit.diff.nodes.delete.length) log('DELETE '+commit.diff.nodes.delete.length+' nodes')
  Nodes = Nodes.filter(n => commit.diff.nodes.delete.indexOf(n.id))
  if(prevNodesLength != Nodes.length) log('Nodes DELETE: before '+prevNodesLength +' / after '+Nodes.length)
  prevNodesLength = Nodes.length

  // ADD edges
  if(commit.diff.edges.add.length) log('ADD '+commit.diff.edges.add.length+' edges')
  Edges = Edges.concat(commit.diff.edges.add)
  if(prevEdgesLength != Edges.length) log('Edges ADD : before '+prevEdgesLength +' / after '+Nodes.length)
  prevEdgesLength = Edges.length

  // DELETE edges
  if(commit.diff.edges.delete.length) log('DELETE '+commit.diff.edges.delete.length+' edges')
  Edges = Edges.filter(n => commit.diff.edges.delete.indexOf(n.id))
  if(prevEdgesLength != Edges.length) log('Edges DELETE: before '+prevEdgesLength +' / after '+Edges.length)
  prevEdgesLength = Edges.length


}
