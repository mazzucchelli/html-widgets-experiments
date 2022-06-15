// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/shortid/lib/random/random-from-seed.js":[function(require,module,exports) {
'use strict';

// Found this seed-based random generator somewhere
// Based on The Central Randomizer 1.3 (C) 1997 by Paul Houle (houle@msc.cornell.edu)

var seed = 1;

/**
 * return a random number based on a seed
 * @param seed
 * @returns {number}
 */
function getNextValue() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed/(233280.0);
}

function setSeed(_seed_) {
    seed = _seed_;
}

module.exports = {
    nextValue: getNextValue,
    seed: setSeed
};

},{}],"../node_modules/shortid/lib/alphabet.js":[function(require,module,exports) {
'use strict';

var randomFromSeed = require('./random/random-from-seed');

var ORIGINAL = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
var alphabet;
var previousSeed;

var shuffled;

function reset() {
    shuffled = false;
}

function setCharacters(_alphabet_) {
    if (!_alphabet_) {
        if (alphabet !== ORIGINAL) {
            alphabet = ORIGINAL;
            reset();
        }
        return;
    }

    if (_alphabet_ === alphabet) {
        return;
    }

    if (_alphabet_.length !== ORIGINAL.length) {
        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. You submitted ' + _alphabet_.length + ' characters: ' + _alphabet_);
    }

    var unique = _alphabet_.split('').filter(function(item, ind, arr){
       return ind !== arr.lastIndexOf(item);
    });

    if (unique.length) {
        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. These characters were not unique: ' + unique.join(', '));
    }

    alphabet = _alphabet_;
    reset();
}

function characters(_alphabet_) {
    setCharacters(_alphabet_);
    return alphabet;
}

function setSeed(seed) {
    randomFromSeed.seed(seed);
    if (previousSeed !== seed) {
        reset();
        previousSeed = seed;
    }
}

function shuffle() {
    if (!alphabet) {
        setCharacters(ORIGINAL);
    }

    var sourceArray = alphabet.split('');
    var targetArray = [];
    var r = randomFromSeed.nextValue();
    var characterIndex;

    while (sourceArray.length > 0) {
        r = randomFromSeed.nextValue();
        characterIndex = Math.floor(r * sourceArray.length);
        targetArray.push(sourceArray.splice(characterIndex, 1)[0]);
    }
    return targetArray.join('');
}

function getShuffled() {
    if (shuffled) {
        return shuffled;
    }
    shuffled = shuffle();
    return shuffled;
}

/**
 * lookup shuffled letter
 * @param index
 * @returns {string}
 */
function lookup(index) {
    var alphabetShuffled = getShuffled();
    return alphabetShuffled[index];
}

function get () {
  return alphabet || ORIGINAL;
}

module.exports = {
    get: get,
    characters: characters,
    seed: setSeed,
    lookup: lookup,
    shuffled: getShuffled
};

},{"./random/random-from-seed":"../node_modules/shortid/lib/random/random-from-seed.js"}],"../node_modules/shortid/lib/random/random-byte-browser.js":[function(require,module,exports) {
'use strict';

var crypto = typeof window === 'object' && (window.crypto || window.msCrypto); // IE 11 uses window.msCrypto

var randomByte;

if (!crypto || !crypto.getRandomValues) {
    randomByte = function(size) {
        var bytes = [];
        for (var i = 0; i < size; i++) {
            bytes.push(Math.floor(Math.random() * 256));
        }
        return bytes;
    };
} else {
    randomByte = function(size) {
        return crypto.getRandomValues(new Uint8Array(size));
    };
}

module.exports = randomByte;

},{}],"../node_modules/nanoid/format.browser.js":[function(require,module,exports) {
// This file replaces `format.js` in bundlers like webpack or Rollup,
// according to `browser` config in `package.json`.

module.exports = function (random, alphabet, size) {
  // We can’t use bytes bigger than the alphabet. To make bytes values closer
  // to the alphabet, we apply bitmask on them. We look for the closest
  // `2 ** x - 1` number, which will be bigger than alphabet size. If we have
  // 30 symbols in the alphabet, we will take 31 (00011111).
  // We do not use faster Math.clz32, because it is not available in browsers.
  var mask = (2 << Math.log(alphabet.length - 1) / Math.LN2) - 1
  // Bitmask is not a perfect solution (in our example it will pass 31 bytes,
  // which is bigger than the alphabet). As a result, we will need more bytes,
  // than ID size, because we will refuse bytes bigger than the alphabet.

  // Every hardware random generator call is costly,
  // because we need to wait for entropy collection. This is why often it will
  // be faster to ask for few extra bytes in advance, to avoid additional calls.

  // Here we calculate how many random bytes should we call in advance.
  // It depends on ID length, mask / alphabet size and magic number 1.6
  // (which was selected according benchmarks).

  // -~f => Math.ceil(f) if n is float number
  // -~i => i + 1 if n is integer number
  var step = -~(1.6 * mask * size / alphabet.length)
  var id = ''

  while (true) {
    var bytes = random(step)
    // Compact alternative for `for (var i = 0; i < step; i++)`
    var i = step
    while (i--) {
      // If random byte is bigger than alphabet even after bitmask,
      // we refuse it by `|| ''`.
      id += alphabet[bytes[i] & mask] || ''
      // More compact than `id.length + 1 === size`
      if (id.length === +size) return id
    }
  }
}

},{}],"../node_modules/shortid/lib/generate.js":[function(require,module,exports) {
'use strict';

var alphabet = require('./alphabet');
var random = require('./random/random-byte');
var format = require('nanoid/format');

function generate(number) {
    var loopCounter = 0;
    var done;

    var str = '';

    while (!done) {
        str = str + format(random, alphabet.get(), 1);
        done = number < (Math.pow(16, loopCounter + 1 ) );
        loopCounter++;
    }
    return str;
}

module.exports = generate;

},{"./alphabet":"../node_modules/shortid/lib/alphabet.js","./random/random-byte":"../node_modules/shortid/lib/random/random-byte-browser.js","nanoid/format":"../node_modules/nanoid/format.browser.js"}],"../node_modules/shortid/lib/build.js":[function(require,module,exports) {
'use strict';

var generate = require('./generate');
var alphabet = require('./alphabet');

// Ignore all milliseconds before a certain time to reduce the size of the date entropy without sacrificing uniqueness.
// This number should be updated every year or so to keep the generated id short.
// To regenerate `new Date() - 0` and bump the version. Always bump the version!
var REDUCE_TIME = 1567752802062;

// don't change unless we change the algos or REDUCE_TIME
// must be an integer and less than 16
var version = 7;

// Counter is used when shortid is called multiple times in one second.
var counter;

// Remember the last time shortid was called in case counter is needed.
var previousSeconds;

/**
 * Generate unique id
 * Returns string id
 */
function build(clusterWorkerId) {
    var str = '';

    var seconds = Math.floor((Date.now() - REDUCE_TIME) * 0.001);

    if (seconds === previousSeconds) {
        counter++;
    } else {
        counter = 0;
        previousSeconds = seconds;
    }

    str = str + generate(version);
    str = str + generate(clusterWorkerId);
    if (counter > 0) {
        str = str + generate(counter);
    }
    str = str + generate(seconds);
    return str;
}

module.exports = build;

},{"./generate":"../node_modules/shortid/lib/generate.js","./alphabet":"../node_modules/shortid/lib/alphabet.js"}],"../node_modules/shortid/lib/is-valid.js":[function(require,module,exports) {
'use strict';
var alphabet = require('./alphabet');

function isShortId(id) {
    if (!id || typeof id !== 'string' || id.length < 6 ) {
        return false;
    }

    var nonAlphabetic = new RegExp('[^' +
      alphabet.get().replace(/[|\\{}()[\]^$+*?.-]/g, '\\$&') +
    ']');
    return !nonAlphabetic.test(id);
}

module.exports = isShortId;

},{"./alphabet":"../node_modules/shortid/lib/alphabet.js"}],"../node_modules/shortid/lib/util/cluster-worker-id-browser.js":[function(require,module,exports) {
'use strict';

module.exports = 0;

},{}],"../node_modules/shortid/lib/index.js":[function(require,module,exports) {
'use strict';

var alphabet = require('./alphabet');
var build = require('./build');
var isValid = require('./is-valid');

// if you are using cluster or multiple servers use this to make each instance
// has a unique value for worker
// Note: I don't know if this is automatically set when using third
// party cluster solutions such as pm2.
var clusterWorkerId = require('./util/cluster-worker-id') || 0;

/**
 * Set the seed.
 * Highly recommended if you don't want people to try to figure out your id schema.
 * exposed as shortid.seed(int)
 * @param seed Integer value to seed the random alphabet.  ALWAYS USE THE SAME SEED or you might get overlaps.
 */
function seed(seedValue) {
    alphabet.seed(seedValue);
    return module.exports;
}

/**
 * Set the cluster worker or machine id
 * exposed as shortid.worker(int)
 * @param workerId worker must be positive integer.  Number less than 16 is recommended.
 * returns shortid module so it can be chained.
 */
function worker(workerId) {
    clusterWorkerId = workerId;
    return module.exports;
}

/**
 *
 * sets new characters to use in the alphabet
 * returns the shuffled alphabet
 */
function characters(newCharacters) {
    if (newCharacters !== undefined) {
        alphabet.characters(newCharacters);
    }

    return alphabet.shuffled();
}

/**
 * Generate unique id
 * Returns string id
 */
function generate() {
  return build(clusterWorkerId);
}

// Export all other functions as properties of the generate function
module.exports = generate;
module.exports.generate = generate;
module.exports.seed = seed;
module.exports.worker = worker;
module.exports.characters = characters;
module.exports.isValid = isValid;

},{"./alphabet":"../node_modules/shortid/lib/alphabet.js","./build":"../node_modules/shortid/lib/build.js","./is-valid":"../node_modules/shortid/lib/is-valid.js","./util/cluster-worker-id":"../node_modules/shortid/lib/util/cluster-worker-id-browser.js"}],"../node_modules/shortid/index.js":[function(require,module,exports) {
'use strict';
module.exports = require('./lib/index');

},{"./lib/index":"../node_modules/shortid/lib/index.js"}],"../node_modules/observable-membrane/dist/observable-membrane.js":[function(require,module,exports) {
var global = arguments[3];
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ObservableMembrane = void 0;

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf2(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf2(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf2(o) { _getPrototypeOf2 = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf2(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

/**
 * Copyright (C) 2017 salesforce.com, inc.
 */
var isArray = Array.isArray;
var ObjectDotPrototype = Object.prototype,
    _getPrototypeOf = Object.getPrototypeOf,
    ObjectCreate = Object.create,
    ObjectDefineProperty = Object.defineProperty,
    _isExtensible = Object.isExtensible,
    _getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor,
    getOwnPropertyNames = Object.getOwnPropertyNames,
    getOwnPropertySymbols = Object.getOwnPropertySymbols,
    _preventExtensions = Object.preventExtensions,
    hasOwnProperty = Object.hasOwnProperty;
var _Array$prototype = Array.prototype,
    ArrayPush = _Array$prototype.push,
    ArrayConcat = _Array$prototype.concat;
var OtS = {}.toString;

function toString(obj) {
  if (obj && obj.toString) {
    return obj.toString();
  } else if (_typeof(obj) === 'object') {
    return OtS.call(obj);
  } else {
    return obj + '';
  }
}

function isUndefined(obj) {
  return obj === undefined;
}

function isFunction(obj) {
  return typeof obj === 'function';
}

var proxyToValueMap = new WeakMap();

function registerProxy(proxy, value) {
  proxyToValueMap.set(proxy, value);
}

var unwrap = function unwrap(replicaOrAny) {
  return proxyToValueMap.get(replicaOrAny) || replicaOrAny;
};

var BaseProxyHandler = /*#__PURE__*/function () {
  function BaseProxyHandler(membrane, value) {
    _classCallCheck(this, BaseProxyHandler);

    this.originalTarget = value;
    this.membrane = membrane;
  } // Shared utility methods


  _createClass(BaseProxyHandler, [{
    key: "wrapDescriptor",
    value: function wrapDescriptor(descriptor) {
      if (hasOwnProperty.call(descriptor, 'value')) {
        descriptor.value = this.wrapValue(descriptor.value);
      } else {
        var originalSet = descriptor.set,
            originalGet = descriptor.get;

        if (!isUndefined(originalGet)) {
          descriptor.get = this.wrapGetter(originalGet);
        }

        if (!isUndefined(originalSet)) {
          descriptor.set = this.wrapSetter(originalSet);
        }
      }

      return descriptor;
    }
  }, {
    key: "copyDescriptorIntoShadowTarget",
    value: function copyDescriptorIntoShadowTarget(shadowTarget, key) {
      var originalTarget = this.originalTarget; // Note: a property might get defined multiple times in the shadowTarget
      //       but it will always be compatible with the previous descriptor
      //       to preserve the object invariants, which makes these lines safe.

      var originalDescriptor = _getOwnPropertyDescriptor(originalTarget, key); // TODO: it should be impossible for the originalDescriptor to ever be undefined, this `if` can be removed

      /* istanbul ignore else */


      if (!isUndefined(originalDescriptor)) {
        var wrappedDesc = this.wrapDescriptor(originalDescriptor);
        ObjectDefineProperty(shadowTarget, key, wrappedDesc);
      }
    }
  }, {
    key: "lockShadowTarget",
    value: function lockShadowTarget(shadowTarget) {
      var _this = this;

      var originalTarget = this.originalTarget;
      var targetKeys = ArrayConcat.call(getOwnPropertyNames(originalTarget), getOwnPropertySymbols(originalTarget));
      targetKeys.forEach(function (key) {
        _this.copyDescriptorIntoShadowTarget(shadowTarget, key);
      });
      var tagPropertyKey = this.membrane.tagPropertyKey;

      if (!isUndefined(tagPropertyKey) && !hasOwnProperty.call(shadowTarget, tagPropertyKey)) {
        ObjectDefineProperty(shadowTarget, tagPropertyKey, ObjectCreate(null));
      }

      _preventExtensions(shadowTarget);
    } // Shared Traps
    // TODO: apply() is never called

    /* istanbul ignore next */

  }, {
    key: "apply",
    value: function apply(shadowTarget, thisArg, argArray) {
      /* No op */
    } // TODO: construct() is never called

    /* istanbul ignore next */

  }, {
    key: "construct",
    value: function construct(shadowTarget, argArray, newTarget) {
      /* No op */
    }
  }, {
    key: "get",
    value: function get(shadowTarget, key) {
      var originalTarget = this.originalTarget,
          valueObserved = this.membrane.valueObserved;
      var value = originalTarget[key];
      valueObserved(originalTarget, key);
      return this.wrapValue(value);
    }
  }, {
    key: "has",
    value: function has(shadowTarget, key) {
      var originalTarget = this.originalTarget,
          _this$membrane = this.membrane,
          tagPropertyKey = _this$membrane.tagPropertyKey,
          valueObserved = _this$membrane.valueObserved;
      valueObserved(originalTarget, key); // since key is never going to be undefined, and tagPropertyKey might be undefined
      // we can simply compare them as the second part of the condition.

      return key in originalTarget || key === tagPropertyKey;
    }
  }, {
    key: "ownKeys",
    value: function ownKeys(shadowTarget) {
      var originalTarget = this.originalTarget,
          tagPropertyKey = this.membrane.tagPropertyKey; // if the membrane tag key exists and it is not in the original target, we add it to the keys.

      var keys = isUndefined(tagPropertyKey) || hasOwnProperty.call(originalTarget, tagPropertyKey) ? [] : [tagPropertyKey]; // small perf optimization using push instead of concat to avoid creating an extra array

      ArrayPush.apply(keys, getOwnPropertyNames(originalTarget));
      ArrayPush.apply(keys, getOwnPropertySymbols(originalTarget));
      return keys;
    }
  }, {
    key: "isExtensible",
    value: function isExtensible(shadowTarget) {
      var originalTarget = this.originalTarget; // optimization to avoid attempting to lock down the shadowTarget multiple times

      if (!_isExtensible(shadowTarget)) {
        return false; // was already locked down
      }

      if (!_isExtensible(originalTarget)) {
        this.lockShadowTarget(shadowTarget);
        return false;
      }

      return true;
    }
  }, {
    key: "getPrototypeOf",
    value: function getPrototypeOf(shadowTarget) {
      var originalTarget = this.originalTarget;
      return _getPrototypeOf(originalTarget);
    }
  }, {
    key: "getOwnPropertyDescriptor",
    value: function getOwnPropertyDescriptor(shadowTarget, key) {
      var originalTarget = this.originalTarget,
          _this$membrane2 = this.membrane,
          valueObserved = _this$membrane2.valueObserved,
          tagPropertyKey = _this$membrane2.tagPropertyKey; // keys looked up via getOwnPropertyDescriptor need to be reactive

      valueObserved(originalTarget, key);

      var desc = _getOwnPropertyDescriptor(originalTarget, key);

      if (isUndefined(desc)) {
        if (key !== tagPropertyKey) {
          return undefined;
        } // if the key is the membrane tag key, and is not in the original target,
        // we produce a synthetic descriptor and install it on the shadow target


        desc = {
          value: undefined,
          writable: false,
          configurable: false,
          enumerable: false
        };
        ObjectDefineProperty(shadowTarget, tagPropertyKey, desc);
        return desc;
      }

      if (desc.configurable === false) {
        // updating the descriptor to non-configurable on the shadow
        this.copyDescriptorIntoShadowTarget(shadowTarget, key);
      } // Note: by accessing the descriptor, the key is marked as observed
      // but access to the value, setter or getter (if available) cannot observe
      // mutations, just like regular methods, in which case we just do nothing.


      return this.wrapDescriptor(desc);
    }
  }]);

  return BaseProxyHandler;
}();

var getterMap$1 = new WeakMap();
var setterMap$1 = new WeakMap();
var reverseGetterMap = new WeakMap();
var reverseSetterMap = new WeakMap();

var ReactiveProxyHandler = /*#__PURE__*/function (_BaseProxyHandler) {
  _inherits(ReactiveProxyHandler, _BaseProxyHandler);

  var _super = _createSuper(ReactiveProxyHandler);

  function ReactiveProxyHandler() {
    _classCallCheck(this, ReactiveProxyHandler);

    return _super.apply(this, arguments);
  }

  _createClass(ReactiveProxyHandler, [{
    key: "wrapValue",
    value: function wrapValue(value) {
      return this.membrane.getProxy(value);
    }
  }, {
    key: "wrapGetter",
    value: function wrapGetter(originalGet) {
      var wrappedGetter = getterMap$1.get(originalGet);

      if (!isUndefined(wrappedGetter)) {
        return wrappedGetter;
      }

      var handler = this;

      var get = function get() {
        // invoking the original getter with the original target
        return handler.wrapValue(originalGet.call(unwrap(this)));
      };

      getterMap$1.set(originalGet, get);
      reverseGetterMap.set(get, originalGet);
      return get;
    }
  }, {
    key: "wrapSetter",
    value: function wrapSetter(originalSet) {
      var wrappedSetter = setterMap$1.get(originalSet);

      if (!isUndefined(wrappedSetter)) {
        return wrappedSetter;
      }

      var set = function set(v) {
        // invoking the original setter with the original target
        originalSet.call(unwrap(this), unwrap(v));
      };

      setterMap$1.set(originalSet, set);
      reverseSetterMap.set(set, originalSet);
      return set;
    }
  }, {
    key: "unwrapDescriptor",
    value: function unwrapDescriptor(descriptor) {
      if (hasOwnProperty.call(descriptor, 'value')) {
        // dealing with a data descriptor
        descriptor.value = unwrap(descriptor.value);
      } else {
        var set = descriptor.set,
            get = descriptor.get;

        if (!isUndefined(get)) {
          descriptor.get = this.unwrapGetter(get);
        }

        if (!isUndefined(set)) {
          descriptor.set = this.unwrapSetter(set);
        }
      }

      return descriptor;
    }
  }, {
    key: "unwrapGetter",
    value: function unwrapGetter(redGet) {
      var reverseGetter = reverseGetterMap.get(redGet);

      if (!isUndefined(reverseGetter)) {
        return reverseGetter;
      }

      var handler = this;

      var get = function get() {
        // invoking the red getter with the proxy of this
        return unwrap(redGet.call(handler.wrapValue(this)));
      };

      getterMap$1.set(get, redGet);
      reverseGetterMap.set(redGet, get);
      return get;
    }
  }, {
    key: "unwrapSetter",
    value: function unwrapSetter(redSet) {
      var reverseSetter = reverseSetterMap.get(redSet);

      if (!isUndefined(reverseSetter)) {
        return reverseSetter;
      }

      var handler = this;

      var set = function set(v) {
        // invoking the red setter with the proxy of this
        redSet.call(handler.wrapValue(this), handler.wrapValue(v));
      };

      setterMap$1.set(set, redSet);
      reverseSetterMap.set(redSet, set);
      return set;
    }
  }, {
    key: "set",
    value: function set(shadowTarget, key, value) {
      var originalTarget = this.originalTarget,
          valueMutated = this.membrane.valueMutated;
      var oldValue = originalTarget[key];

      if (oldValue !== value) {
        originalTarget[key] = value;
        valueMutated(originalTarget, key);
      } else if (key === 'length' && isArray(originalTarget)) {
        // fix for issue #236: push will add the new index, and by the time length
        // is updated, the internal length is already equal to the new length value
        // therefore, the oldValue is equal to the value. This is the forking logic
        // to support this use case.
        valueMutated(originalTarget, key);
      }

      return true;
    }
  }, {
    key: "deleteProperty",
    value: function deleteProperty(shadowTarget, key) {
      var originalTarget = this.originalTarget,
          valueMutated = this.membrane.valueMutated;
      delete originalTarget[key];
      valueMutated(originalTarget, key);
      return true;
    }
  }, {
    key: "setPrototypeOf",
    value: function setPrototypeOf(shadowTarget, prototype) {
      /* istanbul ignore else */
      if ("development" !== 'production') {
        throw new Error("Invalid setPrototypeOf invocation for reactive proxy ".concat(toString(this.originalTarget), ". Prototype of reactive objects cannot be changed."));
      }
    }
  }, {
    key: "preventExtensions",
    value: function preventExtensions(shadowTarget) {
      if (_isExtensible(shadowTarget)) {
        var originalTarget = this.originalTarget;

        _preventExtensions(originalTarget); // if the originalTarget is a proxy itself, it might reject
        // the preventExtension call, in which case we should not attempt to lock down
        // the shadow target.
        // TODO: It should not actually be possible to reach this `if` statement.
        // If a proxy rejects extensions, then calling preventExtensions will throw an error:
        // https://codepen.io/nolanlawson-the-selector/pen/QWMOjbY

        /* istanbul ignore if */


        if (_isExtensible(originalTarget)) {
          return false;
        }

        this.lockShadowTarget(shadowTarget);
      }

      return true;
    }
  }, {
    key: "defineProperty",
    value: function defineProperty(shadowTarget, key, descriptor) {
      var originalTarget = this.originalTarget,
          _this$membrane3 = this.membrane,
          valueMutated = _this$membrane3.valueMutated,
          tagPropertyKey = _this$membrane3.tagPropertyKey;

      if (key === tagPropertyKey && !hasOwnProperty.call(originalTarget, key)) {
        // To avoid leaking the membrane tag property into the original target, we must
        // be sure that the original target doesn't have yet.
        // NOTE: we do not return false here because Object.freeze and equivalent operations
        // will attempt to set the descriptor to the same value, and expect no to throw. This
        // is an small compromise for the sake of not having to diff the descriptors.
        return true;
      }

      ObjectDefineProperty(originalTarget, key, this.unwrapDescriptor(descriptor)); // intentionally testing if false since it could be undefined as well

      if (descriptor.configurable === false) {
        this.copyDescriptorIntoShadowTarget(shadowTarget, key);
      }

      valueMutated(originalTarget, key);
      return true;
    }
  }]);

  return ReactiveProxyHandler;
}(BaseProxyHandler);

var getterMap = new WeakMap();
var setterMap = new WeakMap();

var ReadOnlyHandler = /*#__PURE__*/function (_BaseProxyHandler2) {
  _inherits(ReadOnlyHandler, _BaseProxyHandler2);

  var _super2 = _createSuper(ReadOnlyHandler);

  function ReadOnlyHandler() {
    _classCallCheck(this, ReadOnlyHandler);

    return _super2.apply(this, arguments);
  }

  _createClass(ReadOnlyHandler, [{
    key: "wrapValue",
    value: function wrapValue(value) {
      return this.membrane.getReadOnlyProxy(value);
    }
  }, {
    key: "wrapGetter",
    value: function wrapGetter(originalGet) {
      var wrappedGetter = getterMap.get(originalGet);

      if (!isUndefined(wrappedGetter)) {
        return wrappedGetter;
      }

      var handler = this;

      var get = function get() {
        // invoking the original getter with the original target
        return handler.wrapValue(originalGet.call(unwrap(this)));
      };

      getterMap.set(originalGet, get);
      return get;
    }
  }, {
    key: "wrapSetter",
    value: function wrapSetter(originalSet) {
      var wrappedSetter = setterMap.get(originalSet);

      if (!isUndefined(wrappedSetter)) {
        return wrappedSetter;
      }

      var handler = this;

      var set = function set(v) {
        /* istanbul ignore else */
        if ("development" !== 'production') {
          var originalTarget = handler.originalTarget;
          throw new Error("Invalid mutation: Cannot invoke a setter on \"".concat(originalTarget, "\". \"").concat(originalTarget, "\" is read-only."));
        }
      };

      setterMap.set(originalSet, set);
      return set;
    }
  }, {
    key: "set",
    value: function set(shadowTarget, key, value) {
      /* istanbul ignore else */
      if ("development" !== 'production') {
        var originalTarget = this.originalTarget;
        var msg = isArray(originalTarget) ? "Invalid mutation: Cannot mutate array at index ".concat(key.toString(), ". Array is read-only.") : "Invalid mutation: Cannot set \"".concat(key.toString(), "\" on \"").concat(originalTarget, "\". \"").concat(originalTarget, "\" is read-only.");
        throw new Error(msg);
      }
      /* istanbul ignore next */


      return false;
    }
  }, {
    key: "deleteProperty",
    value: function deleteProperty(shadowTarget, key) {
      /* istanbul ignore else */
      if ("development" !== 'production') {
        var originalTarget = this.originalTarget;
        throw new Error("Invalid mutation: Cannot delete \"".concat(key.toString(), "\" on \"").concat(originalTarget, "\". \"").concat(originalTarget, "\" is read-only."));
      }
      /* istanbul ignore next */


      return false;
    }
  }, {
    key: "setPrototypeOf",
    value: function setPrototypeOf(shadowTarget, prototype) {
      /* istanbul ignore else */
      if ("development" !== 'production') {
        var originalTarget = this.originalTarget;
        throw new Error("Invalid prototype mutation: Cannot set prototype on \"".concat(originalTarget, "\". \"").concat(originalTarget, "\" prototype is read-only."));
      }
    }
  }, {
    key: "preventExtensions",
    value: function preventExtensions(shadowTarget) {
      /* istanbul ignore else */
      if ("development" !== 'production') {
        var originalTarget = this.originalTarget;
        throw new Error("Invalid mutation: Cannot preventExtensions on ".concat(originalTarget, "\". \"").concat(originalTarget, " is read-only."));
      }
      /* istanbul ignore next */


      return false;
    }
  }, {
    key: "defineProperty",
    value: function defineProperty(shadowTarget, key, descriptor) {
      /* istanbul ignore else */
      if ("development" !== 'production') {
        var originalTarget = this.originalTarget;
        throw new Error("Invalid mutation: Cannot defineProperty \"".concat(key.toString(), "\" on \"").concat(originalTarget, "\". \"").concat(originalTarget, "\" is read-only."));
      }
      /* istanbul ignore next */


      return false;
    }
  }]);

  return ReadOnlyHandler;
}(BaseProxyHandler);

function extract(objectOrArray) {
  if (isArray(objectOrArray)) {
    return objectOrArray.map(function (item) {
      var original = unwrap(item);

      if (original !== item) {
        return extract(original);
      }

      return item;
    });
  }

  var obj = ObjectCreate(_getPrototypeOf(objectOrArray));
  var names = getOwnPropertyNames(objectOrArray);
  return ArrayConcat.call(names, getOwnPropertySymbols(objectOrArray)).reduce(function (seed, key) {
    var item = objectOrArray[key];
    var original = unwrap(item);

    if (original !== item) {
      seed[key] = extract(original);
    } else {
      seed[key] = item;
    }

    return seed;
  }, obj);
}

var formatter = {
  header: function header(plainOrProxy) {
    var originalTarget = unwrap(plainOrProxy); // if originalTarget is falsy or not unwrappable, exit

    if (!originalTarget || originalTarget === plainOrProxy) {
      return null;
    }

    var obj = extract(plainOrProxy);
    return ['object', {
      object: obj
    }];
  },
  hasBody: function hasBody() {
    return false;
  },
  body: function body() {
    return null;
  }
}; // Inspired from paulmillr/es6-shim
// https://github.com/paulmillr/es6-shim/blob/master/es6-shim.js#L176-L185

/* istanbul ignore next */

function getGlobal() {
  // the only reliable means to get the global object is `Function('return this')()`
  // However, this causes CSP violations in Chrome apps.
  if (typeof globalThis !== 'undefined') {
    return globalThis;
  }

  if (typeof self !== 'undefined') {
    return self;
  }

  if (typeof window !== 'undefined') {
    return window;
  }

  if (typeof global !== 'undefined') {
    return global;
  } // Gracefully degrade if not able to locate the global object


  return {};
}

function init() {
  /* istanbul ignore if */
  if ("development" === 'production') {
    // this method should never leak to prod
    throw new ReferenceError();
  }

  var global = getGlobal(); // Custom Formatter for Dev Tools. To enable this, open Chrome Dev Tools
  //  - Go to Settings,
  //  - Under console, select "Enable custom formatters"
  // For more information, https://docs.google.com/document/d/1FTascZXT9cxfetuPRT2eXPQKXui4nWFivUnS_335T3U/preview

  var devtoolsFormatters = global.devtoolsFormatters || [];
  ArrayPush.call(devtoolsFormatters, formatter);
  global.devtoolsFormatters = devtoolsFormatters;
}
/* istanbul ignore else */


if ("development" !== 'production') {
  init();
}

function defaultValueIsObservable(value) {
  // intentionally checking for null
  if (value === null) {
    return false;
  } // treat all non-object types, including undefined, as non-observable values


  if (_typeof(value) !== 'object') {
    return false;
  }

  if (isArray(value)) {
    return true;
  }

  var proto = _getPrototypeOf(value);

  return proto === ObjectDotPrototype || proto === null || _getPrototypeOf(proto) === null;
}

var defaultValueObserved = function defaultValueObserved(obj, key) {
  /* do nothing */
};

var defaultValueMutated = function defaultValueMutated(obj, key) {
  /* do nothing */
};

function createShadowTarget(value) {
  return isArray(value) ? [] : {};
}

var ObservableMembrane = /*#__PURE__*/function () {
  function ObservableMembrane() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, ObservableMembrane);

    this.readOnlyObjectGraph = new WeakMap();
    this.reactiveObjectGraph = new WeakMap();
    var valueMutated = options.valueMutated,
        valueObserved = options.valueObserved,
        valueIsObservable = options.valueIsObservable,
        tagPropertyKey = options.tagPropertyKey;
    this.valueMutated = isFunction(valueMutated) ? valueMutated : defaultValueMutated;
    this.valueObserved = isFunction(valueObserved) ? valueObserved : defaultValueObserved;
    this.valueIsObservable = isFunction(valueIsObservable) ? valueIsObservable : defaultValueIsObservable;
    this.tagPropertyKey = tagPropertyKey;
  }

  _createClass(ObservableMembrane, [{
    key: "getProxy",
    value: function getProxy(value) {
      var unwrappedValue = unwrap(value);

      if (this.valueIsObservable(unwrappedValue)) {
        // When trying to extract the writable version of a readonly we return the readonly.
        if (this.readOnlyObjectGraph.get(unwrappedValue) === value) {
          return value;
        }

        return this.getReactiveHandler(unwrappedValue);
      }

      return unwrappedValue;
    }
  }, {
    key: "getReadOnlyProxy",
    value: function getReadOnlyProxy(value) {
      value = unwrap(value);

      if (this.valueIsObservable(value)) {
        return this.getReadOnlyHandler(value);
      }

      return value;
    }
  }, {
    key: "unwrapProxy",
    value: function unwrapProxy(p) {
      return unwrap(p);
    }
  }, {
    key: "getReactiveHandler",
    value: function getReactiveHandler(value) {
      var proxy = this.reactiveObjectGraph.get(value);

      if (isUndefined(proxy)) {
        // caching the proxy after the first time it is accessed
        var handler = new ReactiveProxyHandler(this, value);
        proxy = new Proxy(createShadowTarget(value), handler);
        registerProxy(proxy, value);
        this.reactiveObjectGraph.set(value, proxy);
      }

      return proxy;
    }
  }, {
    key: "getReadOnlyHandler",
    value: function getReadOnlyHandler(value) {
      var proxy = this.readOnlyObjectGraph.get(value);

      if (isUndefined(proxy)) {
        // caching the proxy after the first time it is accessed
        var handler = new ReadOnlyHandler(this, value);
        proxy = new Proxy(createShadowTarget(value), handler);
        registerProxy(proxy, value);
        this.readOnlyObjectGraph.set(value, proxy);
      }

      return proxy;
    }
  }]);

  return ObservableMembrane;
}();
/** version: 2.0.0 */


exports.ObservableMembrane = ObservableMembrane;
},{}],"../lib/configs.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var prefix = "data-x";
exports.default = {
  prefix: prefix,
  root: "".concat(prefix, "-root"),
  selector: "".concat(prefix, "-component"),
  target: "".concat(prefix, "-target")
};
},{}],"../lib/utils.ts":[function(require,module,exports) {
"use strict";

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseDataset = exports.convertType = void 0;

function unquoteKey(string) {
  var count = string.length - 1;
  var pair = string.charAt(0) + string.charAt(count);
  return pair === '""' || pair === "''" ? string.slice(1, count) : string;
}

var cleanDatasetKey = function cleanDatasetKey(key, selector) {
  var cleaned = key.replace(selector, "");
  return "".concat(cleaned.charAt(0).toLocaleLowerCase()).concat(cleaned.slice(1));
};

var filterDataset = function filterDataset(dataset, selector) {
  var options = __assign({}, dataset);

  return Object.keys(options).filter(function (entry) {
    return entry.includes(selector);
  });
};

var convertType = function convertType(value, unquote) {
  if (value.includes("{") && value.includes("}")) {
    return JSON.parse(value.replace(/'/g, '"'));
  } else if (value.includes("[") && value.includes("]")) {
    var cleanedArr = value.replace("[", "").replace("]", "");
    return cleanedArr.split(",").map(function (el) {
      return (0, exports.convertType)(el.trim(), true);
    });
  } else {
    switch (value) {
      case "false":
        return false;

      case "true":
        return true;

      case "null":
        return null;

      default:
        return typeof parseFloat(value) === "number" ? parseFloat(value) : value;
    }
  }
};

exports.convertType = convertType;

var parseDataset = function parseDataset(dataset, selector) {
  var res = {};
  var filteredKeys = filterDataset(dataset, selector);
  console.log("filteredKeys", filteredKeys);
  filteredKeys.forEach(function (entry) {
    var cleanEntry = cleanDatasetKey(entry, selector);
    res[cleanEntry] = (0, exports.convertType)(dataset[entry]);
  });
  return res;
};

exports.parseDataset = parseDataset;
},{}],"../lib/helpers/ReactiveComponent.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReactiveComponent = void 0;

var shortid_1 = __importDefault(require("shortid"));

var observable_membrane_1 = require("observable-membrane"); // import { parseDataset } from "../utils";


var configs_1 = __importDefault(require("../configs"));

var utils_1 = require("../utils");

var snakeToCamel = function snakeToCamel(str) {
  return str.replace(/([-_][a-z0-9])/g, function (group) {
    return group.toUpperCase().replace("-", "").replace("_", "");
  });
};

var ReactiveComponent =
/** @class */
function () {
  function ReactiveComponent(htmlEl, handler, emitter) {
    var _this = this;

    this.useChild = function (name) {
      return _this.$htmlEl.querySelector("[".concat(configs_1.default.target, "=\"").concat(name, "\"]"));
    };

    this.useChildren = function (name) {
      return Array.from(_this.$htmlEl.querySelectorAll("[".concat(configs_1.default.target, "=\"").concat(name, "\"]")));
    };

    this.useState = function (proxy, onChange) {
      var membrane = new observable_membrane_1.ObservableMembrane({
        valueObserved: function valueObserved(target, key) {// where target is the object that was accessed
          // and key is the key that was read
          // console.log("accessed ", key, target);
        },
        valueMutated: function valueMutated(target, key) {
          // where target is the object that was mutated
          // and key is the key that was mutated
          // console.log("mutated ", key, target);
          onChange();
        }
      });
      return membrane.getProxy(proxy);
    };

    this.collectProps = function () {
      // temp props object
      var obj = {}; // cycle dataset and only handle interesting attributes

      for (var _i = 0, _a = Object.entries(_this.$htmlEl.dataset); _i < _a.length; _i++) {
        var _b = _a[_i],
            key = _b[0],
            value = _b[1];

        if (key.startsWith("r") && key !== "r" && !key.startsWith("rId")) {
          // adjust prop name: r-prop-name -> propName
          var _c = key.substring(1),
              firstLetter = _c[0],
              restOfWord = _c.slice(1);

          var cleanKey = snakeToCamel(firstLetter.toLowerCase() + restOfWord); // save original attibute name

          _this.propsMap[cleanKey] = key; // store the converted value in temp props object

          obj[cleanKey] = (0, utils_1.convertType)(value);
        }
      } // make props object reactive so it can auto update the DOM


      _this.props = _this.useState(obj, function () {
        for (var _i = 0, _a = Object.entries(_this.props); _i < _a.length; _i++) {
          var _b = _a[_i],
              key = _b[0],
              value = _b[1];
          var datasetKey = _this.propsMap[key];
          _this.$htmlEl.dataset[datasetKey] = JSON.stringify(value);
        }
      });
    };

    this.id = shortid_1.default.generate();
    this.$htmlEl = htmlEl;
    this.propsMap = {};
    this.props = {};
    this.children = {};
    htmlEl.setAttribute("data-r-id", this.id);
    this.collectChildren();
    this.collectProps();
    handler(this, emitter);
  }

  Object.defineProperty(ReactiveComponent.prototype, "$el", {
    get: function get() {
      return this.$htmlEl;
    },
    enumerable: false,
    configurable: true
  });

  ReactiveComponent.prototype.collectChildren = function () {
    var _this = this;

    var c = Array.from(this.$htmlEl.querySelectorAll("[r-child]"));
    c.forEach(function (el) {
      var name = el.getAttribute("r-child");
      _this.children[name] = el;
    });
  };

  return ReactiveComponent;
}();

exports.ReactiveComponent = ReactiveComponent;
},{"shortid":"../node_modules/shortid/index.js","observable-membrane":"../node_modules/observable-membrane/dist/observable-membrane.js","../configs":"../lib/configs.ts","../utils":"../lib/utils.ts"}],"../lib/helpers/componentsManager.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReactiveHtml = void 0;

var ReactiveComponent_1 = require("./ReactiveComponent");

var ReactiveHtml =
/** @class */
function () {
  function ReactiveHtml(_a) {
    var components = _a.components,
        events = _a.events,
        _b = _a.importer,
        importer = _b === void 0 ? null : _b,
        _c = _a.rootElement,
        rootElement = _c === void 0 ? "[data-r-root]" : _c,
        _d = _a.selector,
        selector = _d === void 0 ? "[data-r]" : _d;
    this.rootElement = document.body.querySelector(rootElement);
    this.selector = selector;
    this.components = components;
    this.importer = importer;
    this.events = events;
    this.init();
  }

  ReactiveHtml.prototype.afterNodeDeleted = function (removedNodes) {
    console.log("afterNodeDeleted", removedNodes);
  };

  ReactiveHtml.prototype.afterNodeAdded = function (addedNodes) {
    var _this = this;

    addedNodes.filter(function (el) {
      return !!el.querySelectorAll;
    }).forEach(function (addedNode) {
      _this.importComponents(addedNode);
    });
  };

  ReactiveHtml.prototype.observeDomChanges = function (target) {
    return __awaiter(this, void 0, void 0, function () {
      var config, observer;

      var _this = this;

      return __generator(this, function (_a) {
        config = {
          attributes: true,
          childList: true,
          subtree: true
        };
        observer = new MutationObserver(function (mutationsList) {
          for (var _i = 0, mutationsList_1 = mutationsList; _i < mutationsList_1.length; _i++) {
            var mutation = mutationsList_1[_i];

            if (mutation.type === "childList") {
              var addedNodes = Array.from(mutation.addedNodes);
              var removedNodes = Array.from(mutation.removedNodes);

              if (mutation.target && removedNodes.length) {
                _this.afterNodeDeleted(removedNodes);
              }

              if (mutation.target && addedNodes.length) {
                _this.afterNodeAdded(addedNodes);
              }
            } else {
              return; //   if (
              //     mutation.attributeName.includes("data-state") &&
              //     !!mutation.target.CID
              //   ) {
              //     this.afterStateAttributeChanged(
              //       mutation.target.CID,
              //       mutation.attributeName
              //     );
              //   }
            }
          }
        });
        observer.observe(target, config);
        return [2
        /*return*/
        ];
      });
    });
  };

  ReactiveHtml.prototype.findComponents = function (target) {
    var finalTarget = target !== document.body ? target.parentNode : document.body;
    return Array.from(finalTarget.querySelectorAll(this.selector)).filter(function (el) {
      return !!el.dataset.r && !el.dataset.rId;
    });
  };

  ReactiveHtml.prototype.importComponents = function (target) {
    var _this = this;

    return new Promise(function (resolve, reject) {
      try {
        var components = _this.findComponents(target);

        components.forEach(function (component) {
          var componentName = component.dataset.r;
          new ReactiveComponent_1.ReactiveComponent(component, _this.components[componentName], _this.events);
        });
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  };

  ReactiveHtml.prototype.init = function () {
    return __awaiter(this, void 0, void 0, function () {
      var res, e_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 3,, 4]);

            return [4
            /*yield*/
            , this.importComponents(this.rootElement)];

          case 1:
            res = _a.sent();
            return [4
            /*yield*/
            , this.observeDomChanges(this.rootElement)];

          case 2:
            _a.sent();

            console.log(res);
            return [3
            /*break*/
            , 4];

          case 3:
            e_1 = _a.sent();
            console.error(e_1);
            return [3
            /*break*/
            , 4];

          case 4:
            return [2
            /*return*/
            ];
        }
      });
    });
  };

  return ReactiveHtml;
}();

exports.ReactiveHtml = ReactiveHtml;
},{"./ReactiveComponent":"../lib/helpers/ReactiveComponent.ts"}],"../node_modules/events/events.js":[function(require,module,exports) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
'use strict';

var R = typeof Reflect === 'object' ? Reflect : null;
var ReflectApply = R && typeof R.apply === 'function' ? R.apply : function ReflectApply(target, receiver, args) {
  return Function.prototype.apply.call(target, receiver, args);
};
var ReflectOwnKeys;

if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys;
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
};

function EventEmitter() {
  EventEmitter.init.call(this);
}

module.exports = EventEmitter;
module.exports.once = once; // Backwards-compat with node 0.10.x

EventEmitter.EventEmitter = EventEmitter;
EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined; // By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.

var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function () {
    return defaultMaxListeners;
  },
  set: function (arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }

    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function () {
  if (this._events === undefined || this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
}; // Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.


EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }

  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined) return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];

  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);

  var doError = type === 'error';
  var events = this._events;
  if (events !== undefined) doError = doError && events.error === undefined;else if (!doError) return false; // If there is no 'error' event listener then throw.

  if (doError) {
    var er;
    if (args.length > 0) er = args[0];

    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    } // At least give some kind of context to the user


    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];
  if (handler === undefined) return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);

    for (var i = 0; i < len; ++i) ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;
  checkListener(listener);
  events = target._events;

  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type, listener.listener ? listener.listener : listener); // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object

      events = target._events;
    }

    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] = prepend ? [listener, existing] : [existing, listener]; // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    } // Check for listener leak


    m = _getMaxListeners(target);

    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true; // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax

      var w = new Error('Possible EventEmitter memory leak detected. ' + existing.length + ' ' + String(type) + ' listeners ' + 'added. Use emitter.setMaxListeners() to ' + 'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener = function prependListener(type, listener) {
  return _addListener(this, type, listener, true);
};

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0) return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = {
    fired: false,
    wrapFn: undefined,
    target: target,
    type: type,
    listener: listener
  };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
  checkListener(listener);
  this.prependListener(type, _onceWrap(this, type, listener));
  return this;
}; // Emits a 'removeListener' event if and only if the listener was removed.


EventEmitter.prototype.removeListener = function removeListener(type, listener) {
  var list, events, position, i, originalListener;
  checkListener(listener);
  events = this._events;
  if (events === undefined) return this;
  list = events[type];
  if (list === undefined) return this;

  if (list === listener || list.listener === listener) {
    if (--this._eventsCount === 0) this._events = Object.create(null);else {
      delete events[type];
      if (events.removeListener) this.emit('removeListener', type, list.listener || listener);
    }
  } else if (typeof list !== 'function') {
    position = -1;

    for (i = list.length - 1; i >= 0; i--) {
      if (list[i] === listener || list[i].listener === listener) {
        originalListener = list[i].listener;
        position = i;
        break;
      }
    }

    if (position < 0) return this;
    if (position === 0) list.shift();else {
      spliceOne(list, position);
    }
    if (list.length === 1) events[type] = list[0];
    if (events.removeListener !== undefined) this.emit('removeListener', type, originalListener || listener);
  }

  return this;
};

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
  var listeners, events, i;
  events = this._events;
  if (events === undefined) return this; // not listening for removeListener, no need to emit

  if (events.removeListener === undefined) {
    if (arguments.length === 0) {
      this._events = Object.create(null);
      this._eventsCount = 0;
    } else if (events[type] !== undefined) {
      if (--this._eventsCount === 0) this._events = Object.create(null);else delete events[type];
    }

    return this;
  } // emit removeListener for all listeners on all events


  if (arguments.length === 0) {
    var keys = Object.keys(events);
    var key;

    for (i = 0; i < keys.length; ++i) {
      key = keys[i];
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }

    this.removeAllListeners('removeListener');
    this._events = Object.create(null);
    this._eventsCount = 0;
    return this;
  }

  listeners = events[type];

  if (typeof listeners === 'function') {
    this.removeListener(type, listeners);
  } else if (listeners !== undefined) {
    // LIFO order
    for (i = listeners.length - 1; i >= 0; i--) {
      this.removeListener(type, listeners[i]);
    }
  }

  return this;
};

function _listeners(target, type, unwrap) {
  var events = target._events;
  if (events === undefined) return [];
  var evlistener = events[type];
  if (evlistener === undefined) return [];
  if (typeof evlistener === 'function') return unwrap ? [evlistener.listener || evlistener] : [evlistener];
  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function (emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;

function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);

  for (var i = 0; i < n; ++i) copy[i] = arr[i];

  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++) list[index] = list[index + 1];

  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);

  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }

  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }

      resolve([].slice.call(arguments));
    }

    ;
    eventTargetAgnosticAddListener(emitter, name, resolver, {
      once: true
    });

    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, {
        once: true
      });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }

      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}
},{}],"../node_modules/tiny-typed-emitter/lib/index.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypedEmitter = require("events").EventEmitter;

},{"events":"../node_modules/events/events.js"}],"../lib/helpers/eventEmitter.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEvents = void 0;

var tiny_typed_emitter_1 = require("tiny-typed-emitter");

var createEvents = function createEvents() {
  return new tiny_typed_emitter_1.TypedEmitter();
};

exports.createEvents = createEvents;
},{"tiny-typed-emitter":"../node_modules/tiny-typed-emitter/lib/index.js"}],"js/components/LoginForm.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_a) {
  //   const { $emailInput, $passwordInput, $rememberFlag, $submitButton } =
  //     children;
  var $el = _a.$el,
      children = _a.children;
  $el.addEventListener("submit", function (e) {
    e.preventDefault();
    console.log(children);
  });
};
},{}],"../lib/helpers/createComponent.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_a) {
  var name = _a.name,
      template = _a.template,
      tag = _a.tag,
      props = _a.props;
  var rootTag = document.createElement(tag || "div");
  if (name) rootTag.dataset.r = name;

  if (template) {
    rootTag.innerHTML = template;
  }

  if (props) {
    for (var _i = 0, _b = Object.entries(props); _i < _b.length; _i++) {
      var _c = _b[_i],
          key = _c[0],
          value = _c[1];
      rootTag.dataset[key] = value;
    }
  }

  return rootTag;
};
},{}],"js/components/TodoComponent.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var createComponent_1 = __importDefault(require("../../../lib/helpers/createComponent"));

exports.default = function (_a) {
  var $el = _a.$el,
      children = _a.children,
      useState = _a.useState;
  var todoInput = children.todoInput,
      todoList = children.todoList,
      doneList = children.doneList;

  var prependToTodoList = function prependToTodoList(element) {
    todoList.prepend(element);
  };

  var moveToDoneList = function moveToDoneList(element) {
    var cloned = element;
    doneList.prepend(cloned); // element.remove();
  };

  todoInput.addEventListener("keydown", function (e) {
    if (e.keyCode == 13 && e.metaKey) {
      var newTodo_1 = (0, createComponent_1.default)({
        template: "\n          <span>".concat(todoInput.value, "</span>\n          <button>close</button>\n        ")
      });
      newTodo_1.querySelector("button").addEventListener("click", function (e) {
        moveToDoneList(newTodo_1);
      });
      todoList.prepend(newTodo_1);
      todoInput.value = "";
    }
  });
};
},{"../../../lib/helpers/createComponent":"../lib/helpers/createComponent.ts"}],"js/index.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var componentsManager_1 = require("../../lib/helpers/componentsManager");

var eventEmitter_1 = require("../../lib/helpers/eventEmitter");

var LoginForm_1 = __importDefault(require("./components/LoginForm"));

var TodoComponent_1 = __importDefault(require("./components/TodoComponent"));

new componentsManager_1.ReactiveHtml({
  components: {
    LoginForm: LoginForm_1.default,
    TodoComponent: TodoComponent_1.default
  },
  events: (0, eventEmitter_1.createEvents)()
});
},{"../../lib/helpers/componentsManager":"../lib/helpers/componentsManager.ts","../../lib/helpers/eventEmitter":"../lib/helpers/eventEmitter.ts","./components/LoginForm":"js/components/LoginForm.ts","./components/TodoComponent":"js/components/TodoComponent.ts"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "64355" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/index.ts"], null)
//# sourceMappingURL=/js.52877fb3.js.map