# TopoQuery

TopoQuery is a parser for topogram-style query for network manipulations

**Parameters**

-   `q` **String** The query

**Examples**

```javascript
const q = new TopoQuery('nodes show');
```

## parse

The main function for the parser

**Parameters**

-   `q` **String** the query

Returns **Object** An object containing selection and action

## parseAction

**Parameters**

-   `a` **String** The action to be executed
-   `type` **String** The type of elements (nodes or edges)
-   `q` **String** The original query

Returns **Object** 

## parseOptions

**Parameters**

-   `action` **String** The type of action in capitals
-   `opts` **Array** The list of options and selectors
-   `q` **String** The original query
-   `linkName`  

Returns **Object** options properly parsed

## parseSelector

**Parameters**

-   `selector` **String** the raw selector as a string
-   `s`  
-   `q`  

Returns **Object** the parsed selection object
