var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RESERVED_KEYS = ['$enum'];

var checkReservedKeys = function checkReservedKeys(key) {
  if (RESERVED_KEYS.includes(key)) {
    throw new Error('\'' + key + '\' key is disallowed as an utility enum property');
  }
};

var enumValue = function enumValue(item) {
  if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object') {
    if (item.hasOwnProperty('value') && !item.hasOwnProperty('valueOf')) {
      return Object.defineProperties(item, {
        valueOf: {
          enumerable: false,
          writable: false,
          value: function value() {
            return this.value;
          }
        },
        toString: {
          enumerable: false,
          writable: false,
          value: function value() {
            return String(this.value);
          }
        }
      });
    }
  }
  return item;
};

var enumKeyFromValue = function enumKeyFromValue(item) {
  if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object') {
    if (item.hasOwnProperty('key')) return String(item.key);
    if (item.hasOwnProperty('value')) return String(item.value);
  }
  return String(item);
};

var createFromArray = function createFromArray(arr) {
  return arr.reduce(function (result, item) {
    var key = enumKeyFromValue(item);
    checkReservedKeys(key);
    if (key) result[key] = enumValue(item);
    return result;
  }, Object.create(null));
};

var createFromObject = function createFromObject(obj) {
  return Object.entries(obj).reduce(function (result, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        item = _ref2[1];

    checkReservedKeys(key);
    result[key] = enumValue(item);
    return result;
  }, Object.create(null));
};

var defineEnumUtils = function defineEnumUtils(enumCollection) {
  var collection = _extends({}, enumCollection);
  var utils = {
    collection: collection,
    entries: Object.entries(collection),
    keys: Object.keys(collection),
    values: Object.values(collection).map(function (item) {
      return item.hasOwnProperty('value') ? item.value : item;
    }),
    items: Object.values(collection),
    get: function get(key) {
      return collection[key];
    },
    has: function has(key) {
      return collection.hasOwnProperty(key);
    },
    getFromValue: function getFromValue(val) {
      return Object.values(collection).find(function (itemsValue) {
        return itemsValue === val;
      });
    },
    hasValue: function hasValue(val) {
      return Object.values(collection).includes(val);
    }
  };

  Object.defineProperties(enumCollection, {
    $enum: {
      enumerable: false,
      writable: false,
      value: utils
    }
  });
  return enumCollection;
};

var createEnum = function createEnum(collection) {
  var enumCollection = null;
  if (Array.isArray(collection)) {
    enumCollection = createFromArray(collection);
  } else if ((typeof collection === 'undefined' ? 'undefined' : _typeof(collection)) === 'object') {
    enumCollection = createFromObject(collection);
  } else {
    throw new Error('Enum collection should be either Array or Object');
  }
  var enumWithMethods = defineEnumUtils(enumCollection);
  return Object.freeze(enumWithMethods);
};

var Enum = function Enum(collection) {
  _classCallCheck(this, Enum);

  return createEnum(collection);
};

Enum.create = createEnum;

export default Enum;