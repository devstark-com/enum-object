const RESERVED_KEYS = ['$enum']

const checkReservedKeys = (key) => {
  if (RESERVED_KEYS.includes(key)) {
    throw new Error(`'${key}' key is disallowed as an utility enum property`)
  }
}

const enumValue = (item) => {
  if (typeof item === 'object') {
    if (item.hasOwnProperty('value') && !item.hasOwnProperty('valueOf')) {
      return Object.defineProperties(item, {
        valueOf: {
          enumerable: false,
          writable: false,
          value () { return this.value }
        },
        toString: {
          enumerable: false,
          writable: false,
          value () { return String(this.value) }
        }
      })
    }
  }
  return item
}

const enumKeyFromValue = (item) => {
  if (typeof item === 'object') {
    if (item.hasOwnProperty('key')) return String(item.key)
    if (item.hasOwnProperty('value')) return String(item.value)
  }
  return String(item)
}

const createFromArray = (arr) => {
  return arr.reduce((result, item) => {
    const key = enumKeyFromValue(item)
    checkReservedKeys(key)
    if (key) result[key] = enumValue(item)
    return result
  }, Object.create(null))
}

const createFromObject = (obj) => {
  return Object.entries(obj).reduce((result, [key, item]) => {
    checkReservedKeys(key)
    result[key] = enumValue(item)
    return result
  }, Object.create(null))
}

const defineEnumUtils = (enumCollection) => {
  const collection = Object.assign({}, enumCollection)
  const items = Object.values(collection)
  const values = items.map(item => item.hasOwnProperty('value') ? item.value : item)
  const utils = {
    collection,
    entries: Object.entries(collection),
    keys: Object.keys(collection),
    values,
    items,
    get: (key) => collection[key],
    has: (key) => collection.hasOwnProperty(key),
    getFromValue: (val) => Object.values(collection).find((itemsValue) => itemsValue === val),
    hasValue: (val) => Object.values(collection).includes(val)
  }

  Object.defineProperties(enumCollection, {
    $enum: {
      enumerable: false,
      writable: false,
      value: Object.freeze(utils)
    }
  })

  // Make enum instance iterable
  enumCollection[Symbol.iterator] = function () {
    return items[Symbol.iterator]()
  }

  return enumCollection
}

const createEnum = (collection) => {
  let enumCollection = null
  if (Array.isArray(collection)) {
    enumCollection = createFromArray(collection)
  } else if (typeof collection === 'object') {
    enumCollection = createFromObject(collection)
  } else {
    throw new Error('Enum collection should be either Array or Object')
  }
  const enumWithMethods = defineEnumUtils(enumCollection)
  return Object.freeze(enumWithMethods)
}

class Enum {
  constructor (collection) {
    return createEnum(collection)
  }
}

Enum.create = createEnum

// to support both es6 modules and commonjs modules
module.exports = Enum
