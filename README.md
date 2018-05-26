# Enum Object
[![npm](https://img.shields.io/npm/v/enum-object.svg)](https://www.npmjs.com/package/enum-object)

A JavaScript Enum object type that allows to easily create enums from arrays or objects, and offers developer friendly interface.

## Installation
    $ npm install enum-object


## Getting Started

```js
import Enum from 'enum-object'

const statuses = new Enum({
  created: {
    value: 1,
    label: 'Created', // `label` and `color` props are optional extra data that could be whatever you need.
    color: 'grey'
  },
  inProgress: {
    value: 2,
    label: 'In Progress',
    color: 'yellow'
  },
  ready: {
    value: 3,
    label: 'Ready',
    color: 'brown'
  },
  done: {
    value: 4,
    label: 'Done',
    color: 'green'
  }
})

statuses.created
// { value: 1, label: "Created", color: "grey" }

statuses.created.valueOf()
// 1

statuses.created.toString()
// "1"

/* Due to valueOf method and coercion it's possible to do comparisons like this: */

statuses.ready == 3
// true

statuses.done > statuses.inProgress
// true

statuses.$enum.keys
// ["created", "inProgress", "ready", "done"]

statuses.$enum.values
// [1, 2, 3, 4]

statuses.$enum.items
// [
//    { value: 1, label: "Created", color: "grey" },
//   ...
//    { value: 4, label: "Done", color: "green" }
// ]

/* Since `keys`, `values`, `items`, `entries` props are always arrays it's very convenient
to use them together with map/filter/reduce/etc. array methods, like this: */

statuses.$enum.values.map(i => `${i.label} is ${i.color}`)
// ["Created is grey", "In Progress is yellow", "Ready is brown", "Done is green"]

statuses.has('cancelled') // no such key
// false

statuses.hasValue(4)
// true

statuses.getFromValue(1)
// { value: 1, label: "Created", color: "grey" }
```

## Enum object creation

You can create an enum using either `new` keyword or `create` factory function. The result will be the same.

```js
import Enum from 'enum-object'

// Using 'new' keyword
const colors = new Enum(['red', 'green', 'blue'])

// Using create method (factory function)
const colors = Enum.create(['red', 'green', 'blue'])

// { blue: "blue", green: "green": red: "red", $enum: {...} }
```

## Input collection

It's possible to create an enum instance using either `Array` or `Object` as input argument.

Array input example:
```js
const gender = new Enum(['MALE', 'FEMALE'])

// { MALE: "MALE", FEMALE: "FEMALE", $enum: {...} }
```

Object input example:

```js
const gender = new Enum({
  male: 'm',
  female: 'f'
})

// { male: "m", female: "f", $enum: {...} }
```

Both Array and Object notations allow to use objects as items:

```js
const gender = new Enum([
  { key: 'MALE', value: 'M' },
  { key: 'FEMALE', value: 'F' }
])
// or
const gender = new Enum({
  MALE: { value: 'M' },
  FEMALE: { value: 'F' }
})
// the result will be the same
```

When using object items, the `value` property of each item is required.

### Enum keys
In case of object notation input object's keys always will be the enum keys.

As for Array notation, it depends on type of array items.

1) simple literal items (`String`, `Number`, `Boolean`) will be both key and value
2) for object items there should be `key` property defined for each input array item

All the examples below will result in the same set of enum keys:
```js
const enumFromArrayOfStrings = new Enum(['MALE', 'FEMALE'])
console.log(enumFromArrayOfStrings.$enum.keys)
// ["MALE", "FEMALE"]

const enumFromArrayOfObjects = new Enum([
  { key: 'MALE', value: 'M' },
  { key: 'FEMALE', value: 'F' }
])
console.log(enumFromArrayOfObjects.$enum.keys)
// ["MALE", "FEMALE"]

const enumFromObject = new Enum({
  MALE: { value: 'M' },
  FEMALE: { value: 'F' }
})
console.log(enumFromObject.$enum.keys)
// ["MALE", "FEMALE"]
```
Notice that every enum created has `$enum` property, that contains a set of convenient methods and props.
The full list of those can be found in [$enum utils](#enum-utils) section.

### Enum items and values
If the input collection contains objects like `{ value: 1, label: 'Apple', isTasty: true }` then this object itself is an **item**, and it's `value` prop is a **value**.

If an input collection's item is primitive literal (`String`, `Number`, `Boolean`) than **item** is the same as **value**.

__It's recommended to create enums with object notation and object values since it's the most flexible way and it's very easy to add additional props in the future without changing existing code.__

Every **item** object is supplied by `valueOf()` and `toString()` methods (or you can provide them in the input collection), so that it's possible to do comparisons like this:
```js
fruit.apple
// { value: 1, label: "Apple", isTasty: true }

fruit.apple.valueOf() // or +fruit.apple
// 1

fruit.apple == 1 // works only for Abstract Equality Comparison (==)
// true

fruit.apple <= 2
// true
```

## $enum utils
An enum object instance has `$enum` prop, that contains a list of utility props and methods:

| **Property** | **Description** |
|:------------|:----------------|
| `collection` | Enum object without `$enum` prop |
| `entries` | Array of an enum's elements [key, value] pairs (the same as the result of Object.entries(enumInstance)) |
| `keys` | Array of an enum's property names (the same as the result of Object.keys(enumInstance)) |
| `values` | Array of an enum's values |
| `items` | Array of an enum's items |
| `get(key)` | Get an enum value by key (including additional item's properties) |
| `getFromValue(val)` | Get enum item by given value |
| `has(key)` | Boolean: Whether there an enum item with given key |
| `hasValue(val)` | Boolean: Whether there a corresponding enum value in the enum collection |


## Other features

1) Enum instance is immutable, so that once enum is created it's not possible to change the items by mistake.
2) `$enum` utility prop is located next to the keys of the enum, but unlike them, `$enum` prop is not iterable (not __enumerable__).

Moreover, enum instance is iterable object, that means you can do `for...of`:
```js
for (const item of statuses) {
  console.log(item)
}
// { value: 1, label: "Created", color: "grey" }
// ...
/// { value: 4, label: "Done", color: "green" }
```


---

## License

[MIT](http://opensource.org/licenses/MIT)
