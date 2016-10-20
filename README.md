# Topoquery

[![Build Status](https://travis-ci.org/topogram/topoquery.svg?branch=master)](https://travis-ci.org/topogram/topoquery)

    Ongoing work - not ready to use yet

**Topoquery** is a simple query system to create and manipulate networks and graphs.

*"But why ?"*, you may wonder. Because there is no simple, portable and lightweight language to write and store networks. Also because [Cypher](https://neo4j.com/developer/cypher-query-language/) and [Gremlin](https://github.com/tinkerpop/gremlin/wiki) gives me headaches and does not help to store successive states of your graphs.

## How it Works

It is super simple :

* You input **queries** in plain text or via command-line to select nodes / edges and apply actions on them.
* All modifications are stored using **commits**, so any changes can easily be done / undone / moderated / etc
* Everything is serializable in **JSON**, so you can store the data using databases, plain files or just a simple array.

It works with node or in the browser -- see the [`/examples`](/examples) folder.

### Example

```js

let query = new Query('node add color:blue name:"Frank Zappa" longitude:"1,23" latitude:"1,23" starred:false')

console.log(query)

/*
  {
    q: 'node add color:blue name:"Frank Zappa" longitude:"1,23" latitude:"1,23" starred:false',
    selector: { id: null, elType: 'nodes' },
    action: 'ADD',
    options: {
      color: 'blue',
      name: 'Frank Zappa',
      longitude: '1,23',
      latitude: '1,23',
      starred: false
    }
  }
*/

```

```js

const qs = [
  'node add id:Jon color:blue',
  'node add id:Jack',
  'node add id:Joe',
  'Joe likes Jack',
  'Jon hates Jack',
  'Jon ignores Jack',
]

const queries = qs.map(q => new Query(q) )

const commit = new Commit(...queries)

console.log( commit )


```

## Query structure

    selector [ command ] [ options ]

ex.

* `John` `show`
* `type:animals` `hide`
* `dog likes bones` `set` `type:normal`

The query will returns a JSON object containing the command


### Commands

| Command | Description | Options |
|------|------|------|
| `create` | create a new node or edge | |
| `show` | (default) show elements based on a selector | |
| `hide` | hide elements based on a selector | |
| `set` | set properties for a node or an edge | A comma-separated list of `key:value` |
| `merge` | merge nodes together | A node |
| `clear` | clear all previous selections | |

### Properties and selectors

A property/selector is described as `name:value`

| Selector | Description |
|------|------|
| `nodes` | get all nodes |
| `edges` | get all edges |
| `node:id` | get an edge by id |
| `edge:id` | get an edge by id |
| `nodes:key:value` | get all edges where key == value |
| `edges:key:value` | get all edges where key == value |
| `cyto:selector` | use a [cytoscape selector](http://js.cytoscape.org/#selectors) |

Read the [original SPEC](https://github.com/topogram/topogram/wiki/Topogram-graph-query-syntax) for more

## Dev

### Test

    gulp test

### Docs

    gulp doc

then navigate to the `/docs` folder to see the documentation.
