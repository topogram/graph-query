# Topoquery

[![Build Status](https://travis-ci.org/topogram/topoquery.svg?branch=master)](https://travis-ci.org/topogram/topoquery)

**Topoquery** is a simple query system to create and manipulate states of networks and graphs.

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

## Dev

### Publish demo to gh-pages

    gulp deploy

### Test

    gulp test

### Build the Docs

    gulp doc
