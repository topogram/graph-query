# Topoquery

**Topoquery** is a simple query system to create and manipulate networks and graphs.

*"But why ?"*, you may wonder. Because there is no simple, portable and lightweight language to write and store networks. Also because [Cypher](https://neo4j.com/developer/cypher-query-language/) and [Gremlin](https://github.com/tinkerpop/gremlin/wiki) gives me headaches and does not help to store successive states of your graphs.


## How it Works

It is super simple :

* You input **queries** in plain text or via command-line to describe
* You can **select** nodes / edges based on id or properties add / merge / duplicate / **modify** your nodes or edges
* All modifications are **stored using JSON serializable commit objects**, so any changes easily can be done / undone / moderated


Topoquery is **database agnostic** and returns commits describing changes as JSON objects. You can store the data as you wish, using a database, plain files or just even an array depending on your needs.

It works with node or in the browser -- see the [`/examples`](/examples) folder.

### Query structure

    selector [ command ] [ options ]

ex.

* `John` `show`
* `type:animals` `hide`
* `dog likes bones` `set` `type:normal`


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
