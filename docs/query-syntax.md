# Query structure

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
