(function (factory) {
	typeof define === 'function' && define.amd ? define(factory) :
	factory();
})((function () { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function getDefaultExportFromNamespaceIfPresent (n) {
		return n && Object.prototype.hasOwnProperty.call(n, 'default') ? n['default'] : n;
	}

	function getDefaultExportFromNamespaceIfNotNamed (n) {
		return n && Object.prototype.hasOwnProperty.call(n, 'default') && Object.keys(n).length === 1 ? n['default'] : n;
	}

	function getAugmentedNamespace(n) {
	  if (n.__esModule) return n;
	  var f = n.default;
		if (typeof f == "function") {
			var a = function a () {
				if (this instanceof a) {
					var args = [null];
					args.push.apply(args, arguments);
					var Ctor = Function.bind.apply(f, args);
					return new Ctor();
				}
				return f.apply(this, arguments);
			};
			a.prototype = f.prototype;
	  } else a = {};
	  Object.defineProperty(a, '__esModule', {value: true});
		Object.keys(n).forEach(function (k) {
			var d = Object.getOwnPropertyDescriptor(n, k);
			Object.defineProperty(a, k, d.get ? d : {
				enumerable: true,
				get: function () {
					return n[k];
				}
			});
		});
		return a;
	}

	var chai$2 = {};

	/*!
	 * assertion-error
	 * Copyright(c) 2013 Jake Luer <jake@qualiancy.com>
	 * MIT Licensed
	 */

	/*!
	 * Return a function that will copy properties from
	 * one object to another excluding any originally
	 * listed. Returned function will create a new `{}`.
	 *
	 * @param {String} excluded properties ...
	 * @return {Function}
	 */

	function exclude () {
	  var excludes = [].slice.call(arguments);

	  function excludeProps (res, obj) {
	    Object.keys(obj).forEach(function (key) {
	      if (!~excludes.indexOf(key)) res[key] = obj[key];
	    });
	  }

	  return function extendExclude () {
	    var args = [].slice.call(arguments)
	      , i = 0
	      , res = {};

	    for (; i < args.length; i++) {
	      excludeProps(res, args[i]);
	    }

	    return res;
	  };
	};

	/*!
	 * Primary Exports
	 */

	var assertionError = AssertionError$2;

	/**
	 * ### AssertionError
	 *
	 * An extension of the JavaScript `Error` constructor for
	 * assertion and validation scenarios.
	 *
	 * @param {String} message
	 * @param {Object} properties to include (optional)
	 * @param {callee} start stack function (optional)
	 */

	function AssertionError$2 (message, _props, ssf) {
	  var extend = exclude('name', 'message', 'stack', 'constructor', 'toJSON')
	    , props = extend(_props || {});

	  // default values
	  this.message = message || 'Unspecified AssertionError';
	  this.showDiff = false;

	  // copy from properties
	  for (var key in props) {
	    this[key] = props[key];
	  }

	  // capture stack trace
	  ssf = ssf || AssertionError$2;
	  if (Error.captureStackTrace) {
	    Error.captureStackTrace(this, ssf);
	  } else {
	    try {
	      throw new Error();
	    } catch(e) {
	      this.stack = e.stack;
	    }
	  }
	}

	/*!
	 * Inherit from Error.prototype
	 */

	AssertionError$2.prototype = Object.create(Error.prototype);

	/*!
	 * Statically set name
	 */

	AssertionError$2.prototype.name = 'AssertionError';

	/*!
	 * Ensure correct constructor
	 */

	AssertionError$2.prototype.constructor = AssertionError$2;

	/**
	 * Allow errors to be converted to JSON for static transfer.
	 *
	 * @param {Boolean} include stack (default: `true`)
	 * @return {Object} object that can be `JSON.stringify`
	 */

	AssertionError$2.prototype.toJSON = function (stack) {
	  var extend = exclude('constructor', 'toJSON', 'stack')
	    , props = extend({ name: this.name }, this);

	  // include stack if exists and not turned off
	  if (false !== stack && this.stack) {
	    props.stack = this.stack;
	  }

	  return props;
	};

	var index$4 = /*@__PURE__*/getDefaultExportFromCjs(assertionError);

	var utils = {};

	'use strict';

	/* !
	 * Chai - pathval utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * @see https://github.com/logicalparadox/filtr
	 * MIT Licensed
	 */

	/**
	 * ### .hasProperty(object, name)
	 *
	 * This allows checking whether an object has own
	 * or inherited from prototype chain named property.
	 *
	 * Basically does the same thing as the `in`
	 * operator but works properly with null/undefined values
	 * and other primitives.
	 *
	 *     var obj = {
	 *         arr: ['a', 'b', 'c']
	 *       , str: 'Hello'
	 *     }
	 *
	 * The following would be the results.
	 *
	 *     hasProperty(obj, 'str');  // true
	 *     hasProperty(obj, 'constructor');  // true
	 *     hasProperty(obj, 'bar');  // false
	 *
	 *     hasProperty(obj.str, 'length'); // true
	 *     hasProperty(obj.str, 1);  // true
	 *     hasProperty(obj.str, 5);  // false
	 *
	 *     hasProperty(obj.arr, 'length');  // true
	 *     hasProperty(obj.arr, 2);  // true
	 *     hasProperty(obj.arr, 3);  // false
	 *
	 * @param {Object} object
	 * @param {String|Symbol} name
	 * @returns {Boolean} whether it exists
	 * @namespace Utils
	 * @name hasProperty
	 * @api public
	 */

	function hasProperty(obj, name) {
	  if (typeof obj === 'undefined' || obj === null) {
	    return false;
	  }

	  // The `in` operator does not work with primitives.
	  return name in Object(obj);
	}

	/* !
	 * ## parsePath(path)
	 *
	 * Helper function used to parse string object
	 * paths. Use in conjunction with `internalGetPathValue`.
	 *
	 *      var parsed = parsePath('myobject.property.subprop');
	 *
	 * ### Paths:
	 *
	 * * Can be infinitely deep and nested.
	 * * Arrays are also valid using the formal `myobject.document[3].property`.
	 * * Literal dots and brackets (not delimiter) must be backslash-escaped.
	 *
	 * @param {String} path
	 * @returns {Object} parsed
	 * @api private
	 */

	function parsePath(path) {
	  var str = path.replace(/([^\\])\[/g, '$1.[');
	  var parts = str.match(/(\\\.|[^.]+?)+/g);
	  return parts.map(function mapMatches(value) {
	    if (
	      value === 'constructor' ||
	      value === '__proto__' ||
	      value === 'prototype'
	    ) {
	      return {};
	    }
	    var regexp = /^\[(\d+)\]$/;
	    var mArr = regexp.exec(value);
	    var parsed = null;
	    if (mArr) {
	      parsed = { i: parseFloat(mArr[1]) };
	    } else {
	      parsed = { p: value.replace(/\\([.[\]])/g, '$1') };
	    }

	    return parsed;
	  });
	}

	/* !
	 * ## internalGetPathValue(obj, parsed[, pathDepth])
	 *
	 * Helper companion function for `.parsePath` that returns
	 * the value located at the parsed address.
	 *
	 *      var value = getPathValue(obj, parsed);
	 *
	 * @param {Object} object to search against
	 * @param {Object} parsed definition from `parsePath`.
	 * @param {Number} depth (nesting level) of the property we want to retrieve
	 * @returns {Object|Undefined} value
	 * @api private
	 */

	function internalGetPathValue(obj, parsed, pathDepth) {
	  var temporaryValue = obj;
	  var res = null;
	  pathDepth = typeof pathDepth === 'undefined' ? parsed.length : pathDepth;

	  for (var i = 0; i < pathDepth; i++) {
	    var part = parsed[i];
	    if (temporaryValue) {
	      if (typeof part.p === 'undefined') {
	        temporaryValue = temporaryValue[part.i];
	      } else {
	        temporaryValue = temporaryValue[part.p];
	      }

	      if (i === pathDepth - 1) {
	        res = temporaryValue;
	      }
	    }
	  }

	  return res;
	}

	/* !
	 * ## internalSetPathValue(obj, value, parsed)
	 *
	 * Companion function for `parsePath` that sets
	 * the value located at a parsed address.
	 *
	 *  internalSetPathValue(obj, 'value', parsed);
	 *
	 * @param {Object} object to search and define on
	 * @param {*} value to use upon set
	 * @param {Object} parsed definition from `parsePath`
	 * @api private
	 */

	function internalSetPathValue(obj, val, parsed) {
	  var tempObj = obj;
	  var pathDepth = parsed.length;
	  var part = null;
	  // Here we iterate through every part of the path
	  for (var i = 0; i < pathDepth; i++) {
	    var propName = null;
	    var propVal = null;
	    part = parsed[i];

	    // If it's the last part of the path, we set the 'propName' value with the property name
	    if (i === pathDepth - 1) {
	      propName = typeof part.p === 'undefined' ? part.i : part.p;
	      // Now we set the property with the name held by 'propName' on object with the desired val
	      tempObj[propName] = val;
	    } else if (typeof part.p !== 'undefined' && tempObj[part.p]) {
	      tempObj = tempObj[part.p];
	    } else if (typeof part.i !== 'undefined' && tempObj[part.i]) {
	      tempObj = tempObj[part.i];
	    } else {
	      // If the obj doesn't have the property we create one with that name to define it
	      var next = parsed[i + 1];
	      // Here we set the name of the property which will be defined
	      propName = typeof part.p === 'undefined' ? part.i : part.p;
	      // Here we decide if this property will be an array or a new object
	      propVal = typeof next.p === 'undefined' ? [] : {};
	      tempObj[propName] = propVal;
	      tempObj = tempObj[propName];
	    }
	  }
	}

	/**
	 * ### .getPathInfo(object, path)
	 *
	 * This allows the retrieval of property info in an
	 * object given a string path.
	 *
	 * The path info consists of an object with the
	 * following properties:
	 *
	 * * parent - The parent object of the property referenced by `path`
	 * * name - The name of the final property, a number if it was an array indexer
	 * * value - The value of the property, if it exists, otherwise `undefined`
	 * * exists - Whether the property exists or not
	 *
	 * @param {Object} object
	 * @param {String} path
	 * @returns {Object} info
	 * @namespace Utils
	 * @name getPathInfo
	 * @api public
	 */

	function getPathInfo(obj, path) {
	  var parsed = parsePath(path);
	  var last = parsed[parsed.length - 1];
	  var info = {
	    parent:
	      parsed.length > 1 ?
	        internalGetPathValue(obj, parsed, parsed.length - 1) :
	        obj,
	    name: last.p || last.i,
	    value: internalGetPathValue(obj, parsed),
	  };
	  info.exists = hasProperty(info.parent, info.name);

	  return info;
	}

	/**
	 * ### .getPathValue(object, path)
	 *
	 * This allows the retrieval of values in an
	 * object given a string path.
	 *
	 *     var obj = {
	 *         prop1: {
	 *             arr: ['a', 'b', 'c']
	 *           , str: 'Hello'
	 *         }
	 *       , prop2: {
	 *             arr: [ { nested: 'Universe' } ]
	 *           , str: 'Hello again!'
	 *         }
	 *     }
	 *
	 * The following would be the results.
	 *
	 *     getPathValue(obj, 'prop1.str'); // Hello
	 *     getPathValue(obj, 'prop1.att[2]'); // b
	 *     getPathValue(obj, 'prop2.arr[0].nested'); // Universe
	 *
	 * @param {Object} object
	 * @param {String} path
	 * @returns {Object} value or `undefined`
	 * @namespace Utils
	 * @name getPathValue
	 * @api public
	 */

	function getPathValue(obj, path) {
	  var info = getPathInfo(obj, path);
	  return info.value;
	}

	/**
	 * ### .setPathValue(object, path, value)
	 *
	 * Define the value in an object at a given string path.
	 *
	 * ```js
	 * var obj = {
	 *     prop1: {
	 *         arr: ['a', 'b', 'c']
	 *       , str: 'Hello'
	 *     }
	 *   , prop2: {
	 *         arr: [ { nested: 'Universe' } ]
	 *       , str: 'Hello again!'
	 *     }
	 * };
	 * ```
	 *
	 * The following would be acceptable.
	 *
	 * ```js
	 * var properties = require('tea-properties');
	 * properties.set(obj, 'prop1.str', 'Hello Universe!');
	 * properties.set(obj, 'prop1.arr[2]', 'B');
	 * properties.set(obj, 'prop2.arr[0].nested.value', { hello: 'universe' });
	 * ```
	 *
	 * @param {Object} object
	 * @param {String} path
	 * @param {Mixed} value
	 * @api private
	 */

	function setPathValue(obj, path, val) {
	  var parsed = parsePath(path);
	  internalSetPathValue(obj, val, parsed);
	  return obj;
	}

	var pathval = {
	  hasProperty: hasProperty,
	  getPathInfo: getPathInfo,
	  getPathValue: getPathValue,
	  setPathValue: setPathValue,
	};

	var index$3 = /*@__PURE__*/getDefaultExportFromCjs(pathval);

	/*!
	 * Chai - flag utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/**
	 * ### .flag(object, key, [value])
	 *
	 * Get or set a flag value on an object. If a
	 * value is provided it will be set, else it will
	 * return the currently set value or `undefined` if
	 * the value is not set.
	 *
	 *     utils.flag(this, 'foo', 'bar'); // setter
	 *     utils.flag(this, 'foo'); // getter, returns `bar`
	 *
	 * @param {Object} object constructed Assertion
	 * @param {String} key
	 * @param {Mixed} value (optional)
	 * @namespace Utils
	 * @name flag
	 * @api private
	 */

	var flag$5 = function flag(obj, key, value) {
	  var flags = obj.__flags || (obj.__flags = Object.create(null));
	  if (arguments.length === 3) {
	    flags[key] = value;
	  } else {
	    return flags[key];
	  }
	};

	var flag$6 = /*@__PURE__*/getDefaultExportFromCjs(flag$5);

	/*!
	 * Chai - test utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/*!
	 * Module dependencies
	 */

	var flag$4 = flag$5;

	/**
	 * ### .test(object, expression)
	 *
	 * Test an object for expression.
	 *
	 * @param {Object} object (constructed Assertion)
	 * @param {Arguments} chai.Assertion.prototype.assert arguments
	 * @namespace Utils
	 * @name test
	 */

	var test = function test(obj, args) {
	  var negate = flag$4(obj, 'negate')
	    , expr = args[0];
	  return negate ? !expr : expr;
	};

	var test$1 = /*@__PURE__*/getDefaultExportFromCjs(test);

	var typeDetect$2 = {exports: {}};

	var typeDetect = typeDetect$2.exports;

	(function (module, exports) {
		(function (global, factory) {
			'object' === 'object' && 'object' !== 'undefined' ? module.exports = factory() :
			typeof undefined === 'function' && undefined.amd ? undefined(factory) :
			(global.typeDetect = factory());
		}(commonjsGlobal, (function () { 'use strict';

		/* !
		 * type-detect
		 * Copyright(c) 2013 jake luer <jake@alogicalparadox.com>
		 * MIT Licensed
		 */
		var promiseExists = typeof Promise === 'function';

		/* eslint-disable no-undef */
		var globalObject = typeof self === 'object' ? self : commonjsGlobal; // eslint-disable-line id-blacklist

		var symbolExists = typeof Symbol !== 'undefined';
		var mapExists = typeof Map !== 'undefined';
		var setExists = typeof Set !== 'undefined';
		var weakMapExists = typeof WeakMap !== 'undefined';
		var weakSetExists = typeof WeakSet !== 'undefined';
		var dataViewExists = typeof DataView !== 'undefined';
		var symbolIteratorExists = symbolExists && typeof Symbol.iterator !== 'undefined';
		var symbolToStringTagExists = symbolExists && typeof Symbol.toStringTag !== 'undefined';
		var setEntriesExists = setExists && typeof Set.prototype.entries === 'function';
		var mapEntriesExists = mapExists && typeof Map.prototype.entries === 'function';
		var setIteratorPrototype = setEntriesExists && Object.getPrototypeOf(new Set().entries());
		var mapIteratorPrototype = mapEntriesExists && Object.getPrototypeOf(new Map().entries());
		var arrayIteratorExists = symbolIteratorExists && typeof Array.prototype[Symbol.iterator] === 'function';
		var arrayIteratorPrototype = arrayIteratorExists && Object.getPrototypeOf([][Symbol.iterator]());
		var stringIteratorExists = symbolIteratorExists && typeof String.prototype[Symbol.iterator] === 'function';
		var stringIteratorPrototype = stringIteratorExists && Object.getPrototypeOf(''[Symbol.iterator]());
		var toStringLeftSliceLength = 8;
		var toStringRightSliceLength = -1;
		/**
		 * ### typeOf (obj)
		 *
		 * Uses `Object.prototype.toString` to determine the type of an object,
		 * normalising behaviour across engine versions & well optimised.
		 *
		 * @param {Mixed} object
		 * @return {String} object type
		 * @api public
		 */
		function typeDetect(obj) {
		  /* ! Speed optimisation
		   * Pre:
		   *   string literal     x 3,039,035 ops/sec ±1.62% (78 runs sampled)
		   *   boolean literal    x 1,424,138 ops/sec ±4.54% (75 runs sampled)
		   *   number literal     x 1,653,153 ops/sec ±1.91% (82 runs sampled)
		   *   undefined          x 9,978,660 ops/sec ±1.92% (75 runs sampled)
		   *   function           x 2,556,769 ops/sec ±1.73% (77 runs sampled)
		   * Post:
		   *   string literal     x 38,564,796 ops/sec ±1.15% (79 runs sampled)
		   *   boolean literal    x 31,148,940 ops/sec ±1.10% (79 runs sampled)
		   *   number literal     x 32,679,330 ops/sec ±1.90% (78 runs sampled)
		   *   undefined          x 32,363,368 ops/sec ±1.07% (82 runs sampled)
		   *   function           x 31,296,870 ops/sec ±0.96% (83 runs sampled)
		   */
		  var typeofObj = typeof obj;
		  if (typeofObj !== 'object') {
		    return typeofObj;
		  }

		  /* ! Speed optimisation
		   * Pre:
		   *   null               x 28,645,765 ops/sec ±1.17% (82 runs sampled)
		   * Post:
		   *   null               x 36,428,962 ops/sec ±1.37% (84 runs sampled)
		   */
		  if (obj === null) {
		    return 'null';
		  }

		  /* ! Spec Conformance
		   * Test: `Object.prototype.toString.call(window)``
		   *  - Node === "[object global]"
		   *  - Chrome === "[object global]"
		   *  - Firefox === "[object Window]"
		   *  - PhantomJS === "[object Window]"
		   *  - Safari === "[object Window]"
		   *  - IE 11 === "[object Window]"
		   *  - IE Edge === "[object Window]"
		   * Test: `Object.prototype.toString.call(this)``
		   *  - Chrome Worker === "[object global]"
		   *  - Firefox Worker === "[object DedicatedWorkerGlobalScope]"
		   *  - Safari Worker === "[object DedicatedWorkerGlobalScope]"
		   *  - IE 11 Worker === "[object WorkerGlobalScope]"
		   *  - IE Edge Worker === "[object WorkerGlobalScope]"
		   */
		  if (obj === globalObject) {
		    return 'global';
		  }

		  /* ! Speed optimisation
		   * Pre:
		   *   array literal      x 2,888,352 ops/sec ±0.67% (82 runs sampled)
		   * Post:
		   *   array literal      x 22,479,650 ops/sec ±0.96% (81 runs sampled)
		   */
		  if (
		    Array.isArray(obj) &&
		    (symbolToStringTagExists === false || !(Symbol.toStringTag in obj))
		  ) {
		    return 'Array';
		  }

		  // Not caching existence of `window` and related properties due to potential
		  // for `window` to be unset before tests in quasi-browser environments.
		  if (typeof window === 'object' && window !== null) {
		    /* ! Spec Conformance
		     * (https://html.spec.whatwg.org/multipage/browsers.html#location)
		     * WhatWG HTML$7.7.3 - The `Location` interface
		     * Test: `Object.prototype.toString.call(window.location)``
		     *  - IE <=11 === "[object Object]"
		     *  - IE Edge <=13 === "[object Object]"
		     */
		    if (typeof window.location === 'object' && obj === window.location) {
		      return 'Location';
		    }

		    /* ! Spec Conformance
		     * (https://html.spec.whatwg.org/#document)
		     * WhatWG HTML$3.1.1 - The `Document` object
		     * Note: Most browsers currently adher to the W3C DOM Level 2 spec
		     *       (https://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-26809268)
		     *       which suggests that browsers should use HTMLTableCellElement for
		     *       both TD and TH elements. WhatWG separates these.
		     *       WhatWG HTML states:
		     *         > For historical reasons, Window objects must also have a
		     *         > writable, configurable, non-enumerable property named
		     *         > HTMLDocument whose value is the Document interface object.
		     * Test: `Object.prototype.toString.call(document)``
		     *  - Chrome === "[object HTMLDocument]"
		     *  - Firefox === "[object HTMLDocument]"
		     *  - Safari === "[object HTMLDocument]"
		     *  - IE <=10 === "[object Document]"
		     *  - IE 11 === "[object HTMLDocument]"
		     *  - IE Edge <=13 === "[object HTMLDocument]"
		     */
		    if (typeof window.document === 'object' && obj === window.document) {
		      return 'Document';
		    }

		    if (typeof window.navigator === 'object') {
		      /* ! Spec Conformance
		       * (https://html.spec.whatwg.org/multipage/webappapis.html#mimetypearray)
		       * WhatWG HTML$8.6.1.5 - Plugins - Interface MimeTypeArray
		       * Test: `Object.prototype.toString.call(navigator.mimeTypes)``
		       *  - IE <=10 === "[object MSMimeTypesCollection]"
		       */
		      if (typeof window.navigator.mimeTypes === 'object' &&
		          obj === window.navigator.mimeTypes) {
		        return 'MimeTypeArray';
		      }

		      /* ! Spec Conformance
		       * (https://html.spec.whatwg.org/multipage/webappapis.html#pluginarray)
		       * WhatWG HTML$8.6.1.5 - Plugins - Interface PluginArray
		       * Test: `Object.prototype.toString.call(navigator.plugins)``
		       *  - IE <=10 === "[object MSPluginsCollection]"
		       */
		      if (typeof window.navigator.plugins === 'object' &&
		          obj === window.navigator.plugins) {
		        return 'PluginArray';
		      }
		    }

		    if ((typeof window.HTMLElement === 'function' ||
		        typeof window.HTMLElement === 'object') &&
		        obj instanceof window.HTMLElement) {
		      /* ! Spec Conformance
		      * (https://html.spec.whatwg.org/multipage/webappapis.html#pluginarray)
		      * WhatWG HTML$4.4.4 - The `blockquote` element - Interface `HTMLQuoteElement`
		      * Test: `Object.prototype.toString.call(document.createElement('blockquote'))``
		      *  - IE <=10 === "[object HTMLBlockElement]"
		      */
		      if (obj.tagName === 'BLOCKQUOTE') {
		        return 'HTMLQuoteElement';
		      }

		      /* ! Spec Conformance
		       * (https://html.spec.whatwg.org/#htmltabledatacellelement)
		       * WhatWG HTML$4.9.9 - The `td` element - Interface `HTMLTableDataCellElement`
		       * Note: Most browsers currently adher to the W3C DOM Level 2 spec
		       *       (https://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-82915075)
		       *       which suggests that browsers should use HTMLTableCellElement for
		       *       both TD and TH elements. WhatWG separates these.
		       * Test: Object.prototype.toString.call(document.createElement('td'))
		       *  - Chrome === "[object HTMLTableCellElement]"
		       *  - Firefox === "[object HTMLTableCellElement]"
		       *  - Safari === "[object HTMLTableCellElement]"
		       */
		      if (obj.tagName === 'TD') {
		        return 'HTMLTableDataCellElement';
		      }

		      /* ! Spec Conformance
		       * (https://html.spec.whatwg.org/#htmltableheadercellelement)
		       * WhatWG HTML$4.9.9 - The `td` element - Interface `HTMLTableHeaderCellElement`
		       * Note: Most browsers currently adher to the W3C DOM Level 2 spec
		       *       (https://www.w3.org/TR/DOM-Level-2-HTML/html.html#ID-82915075)
		       *       which suggests that browsers should use HTMLTableCellElement for
		       *       both TD and TH elements. WhatWG separates these.
		       * Test: Object.prototype.toString.call(document.createElement('th'))
		       *  - Chrome === "[object HTMLTableCellElement]"
		       *  - Firefox === "[object HTMLTableCellElement]"
		       *  - Safari === "[object HTMLTableCellElement]"
		       */
		      if (obj.tagName === 'TH') {
		        return 'HTMLTableHeaderCellElement';
		      }
		    }
		  }

		  /* ! Speed optimisation
		  * Pre:
		  *   Float64Array       x 625,644 ops/sec ±1.58% (80 runs sampled)
		  *   Float32Array       x 1,279,852 ops/sec ±2.91% (77 runs sampled)
		  *   Uint32Array        x 1,178,185 ops/sec ±1.95% (83 runs sampled)
		  *   Uint16Array        x 1,008,380 ops/sec ±2.25% (80 runs sampled)
		  *   Uint8Array         x 1,128,040 ops/sec ±2.11% (81 runs sampled)
		  *   Int32Array         x 1,170,119 ops/sec ±2.88% (80 runs sampled)
		  *   Int16Array         x 1,176,348 ops/sec ±5.79% (86 runs sampled)
		  *   Int8Array          x 1,058,707 ops/sec ±4.94% (77 runs sampled)
		  *   Uint8ClampedArray  x 1,110,633 ops/sec ±4.20% (80 runs sampled)
		  * Post:
		  *   Float64Array       x 7,105,671 ops/sec ±13.47% (64 runs sampled)
		  *   Float32Array       x 5,887,912 ops/sec ±1.46% (82 runs sampled)
		  *   Uint32Array        x 6,491,661 ops/sec ±1.76% (79 runs sampled)
		  *   Uint16Array        x 6,559,795 ops/sec ±1.67% (82 runs sampled)
		  *   Uint8Array         x 6,463,966 ops/sec ±1.43% (85 runs sampled)
		  *   Int32Array         x 5,641,841 ops/sec ±3.49% (81 runs sampled)
		  *   Int16Array         x 6,583,511 ops/sec ±1.98% (80 runs sampled)
		  *   Int8Array          x 6,606,078 ops/sec ±1.74% (81 runs sampled)
		  *   Uint8ClampedArray  x 6,602,224 ops/sec ±1.77% (83 runs sampled)
		  */
		  var stringTag = (symbolToStringTagExists && obj[Symbol.toStringTag]);
		  if (typeof stringTag === 'string') {
		    return stringTag;
		  }

		  var objPrototype = Object.getPrototypeOf(obj);
		  /* ! Speed optimisation
		  * Pre:
		  *   regex literal      x 1,772,385 ops/sec ±1.85% (77 runs sampled)
		  *   regex constructor  x 2,143,634 ops/sec ±2.46% (78 runs sampled)
		  * Post:
		  *   regex literal      x 3,928,009 ops/sec ±0.65% (78 runs sampled)
		  *   regex constructor  x 3,931,108 ops/sec ±0.58% (84 runs sampled)
		  */
		  if (objPrototype === RegExp.prototype) {
		    return 'RegExp';
		  }

		  /* ! Speed optimisation
		  * Pre:
		  *   date               x 2,130,074 ops/sec ±4.42% (68 runs sampled)
		  * Post:
		  *   date               x 3,953,779 ops/sec ±1.35% (77 runs sampled)
		  */
		  if (objPrototype === Date.prototype) {
		    return 'Date';
		  }

		  /* ! Spec Conformance
		   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-promise.prototype-@@tostringtag)
		   * ES6$25.4.5.4 - Promise.prototype[@@toStringTag] should be "Promise":
		   * Test: `Object.prototype.toString.call(Promise.resolve())``
		   *  - Chrome <=47 === "[object Object]"
		   *  - Edge <=20 === "[object Object]"
		   *  - Firefox 29-Latest === "[object Promise]"
		   *  - Safari 7.1-Latest === "[object Promise]"
		   */
		  if (promiseExists && objPrototype === Promise.prototype) {
		    return 'Promise';
		  }

		  /* ! Speed optimisation
		  * Pre:
		  *   set                x 2,222,186 ops/sec ±1.31% (82 runs sampled)
		  * Post:
		  *   set                x 4,545,879 ops/sec ±1.13% (83 runs sampled)
		  */
		  if (setExists && objPrototype === Set.prototype) {
		    return 'Set';
		  }

		  /* ! Speed optimisation
		  * Pre:
		  *   map                x 2,396,842 ops/sec ±1.59% (81 runs sampled)
		  * Post:
		  *   map                x 4,183,945 ops/sec ±6.59% (82 runs sampled)
		  */
		  if (mapExists && objPrototype === Map.prototype) {
		    return 'Map';
		  }

		  /* ! Speed optimisation
		  * Pre:
		  *   weakset            x 1,323,220 ops/sec ±2.17% (76 runs sampled)
		  * Post:
		  *   weakset            x 4,237,510 ops/sec ±2.01% (77 runs sampled)
		  */
		  if (weakSetExists && objPrototype === WeakSet.prototype) {
		    return 'WeakSet';
		  }

		  /* ! Speed optimisation
		  * Pre:
		  *   weakmap            x 1,500,260 ops/sec ±2.02% (78 runs sampled)
		  * Post:
		  *   weakmap            x 3,881,384 ops/sec ±1.45% (82 runs sampled)
		  */
		  if (weakMapExists && objPrototype === WeakMap.prototype) {
		    return 'WeakMap';
		  }

		  /* ! Spec Conformance
		   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-dataview.prototype-@@tostringtag)
		   * ES6$24.2.4.21 - DataView.prototype[@@toStringTag] should be "DataView":
		   * Test: `Object.prototype.toString.call(new DataView(new ArrayBuffer(1)))``
		   *  - Edge <=13 === "[object Object]"
		   */
		  if (dataViewExists && objPrototype === DataView.prototype) {
		    return 'DataView';
		  }

		  /* ! Spec Conformance
		   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%mapiteratorprototype%-@@tostringtag)
		   * ES6$23.1.5.2.2 - %MapIteratorPrototype%[@@toStringTag] should be "Map Iterator":
		   * Test: `Object.prototype.toString.call(new Map().entries())``
		   *  - Edge <=13 === "[object Object]"
		   */
		  if (mapExists && objPrototype === mapIteratorPrototype) {
		    return 'Map Iterator';
		  }

		  /* ! Spec Conformance
		   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%setiteratorprototype%-@@tostringtag)
		   * ES6$23.2.5.2.2 - %SetIteratorPrototype%[@@toStringTag] should be "Set Iterator":
		   * Test: `Object.prototype.toString.call(new Set().entries())``
		   *  - Edge <=13 === "[object Object]"
		   */
		  if (setExists && objPrototype === setIteratorPrototype) {
		    return 'Set Iterator';
		  }

		  /* ! Spec Conformance
		   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%arrayiteratorprototype%-@@tostringtag)
		   * ES6$22.1.5.2.2 - %ArrayIteratorPrototype%[@@toStringTag] should be "Array Iterator":
		   * Test: `Object.prototype.toString.call([][Symbol.iterator]())``
		   *  - Edge <=13 === "[object Object]"
		   */
		  if (arrayIteratorExists && objPrototype === arrayIteratorPrototype) {
		    return 'Array Iterator';
		  }

		  /* ! Spec Conformance
		   * (http://www.ecma-international.org/ecma-262/6.0/index.html#sec-%stringiteratorprototype%-@@tostringtag)
		   * ES6$21.1.5.2.2 - %StringIteratorPrototype%[@@toStringTag] should be "String Iterator":
		   * Test: `Object.prototype.toString.call(''[Symbol.iterator]())``
		   *  - Edge <=13 === "[object Object]"
		   */
		  if (stringIteratorExists && objPrototype === stringIteratorPrototype) {
		    return 'String Iterator';
		  }

		  /* ! Speed optimisation
		  * Pre:
		  *   object from null   x 2,424,320 ops/sec ±1.67% (76 runs sampled)
		  * Post:
		  *   object from null   x 5,838,000 ops/sec ±0.99% (84 runs sampled)
		  */
		  if (objPrototype === null) {
		    return 'Object';
		  }

		  return Object
		    .prototype
		    .toString
		    .call(obj)
		    .slice(toStringLeftSliceLength, toStringRightSliceLength);
		}

		return typeDetect;

		}))); 
	} (typeDetect$2, typeDetect$2.exports));

	var typeDetectExports = typeDetect$2.exports;
	var typeDetect$1 = /*@__PURE__*/getDefaultExportFromCjs(typeDetectExports);

	/*!
	 * Chai - expectTypes utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/**
	 * ### .expectTypes(obj, types)
	 *
	 * Ensures that the object being tested against is of a valid type.
	 *
	 *     utils.expectTypes(this, ['array', 'object', 'string']);
	 *
	 * @param {Mixed} obj constructed Assertion
	 * @param {Array} type A list of allowed types for this assertion
	 * @namespace Utils
	 * @name expectTypes
	 * @api public
	 */

	var AssertionError$1 = assertionError;
	var flag$3 = flag$5;
	var type$2 = typeDetectExports;

	var expectTypes = function expectTypes(obj, types) {
	  var flagMsg = flag$3(obj, 'message');
	  var ssfi = flag$3(obj, 'ssfi');

	  flagMsg = flagMsg ? flagMsg + ': ' : '';

	  obj = flag$3(obj, 'object');
	  types = types.map(function (t) { return t.toLowerCase(); });
	  types.sort();

	  // Transforms ['lorem', 'ipsum'] into 'a lorem, or an ipsum'
	  var str = types.map(function (t, index) {
	    var art = ~[ 'a', 'e', 'i', 'o', 'u' ].indexOf(t.charAt(0)) ? 'an' : 'a';
	    var or = types.length > 1 && index === types.length - 1 ? 'or ' : '';
	    return or + art + ' ' + t;
	  }).join(', ');

	  var objType = type$2(obj).toLowerCase();

	  if (!types.some(function (expected) { return objType === expected; })) {
	    throw new AssertionError$1(
	      flagMsg + 'object tested must be ' + str + ', but ' + objType + ' given',
	      undefined,
	      ssfi
	    );
	  }
	};

	var expectTypes$1 = /*@__PURE__*/getDefaultExportFromCjs(expectTypes);

	/*!
	 * Chai - getActual utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/**
	 * ### .getActual(object, [actual])
	 *
	 * Returns the `actual` value for an Assertion.
	 *
	 * @param {Object} object (constructed Assertion)
	 * @param {Arguments} chai.Assertion.prototype.assert arguments
	 * @namespace Utils
	 * @name getActual
	 */

	var getActual$1 = function getActual(obj, args) {
	  return args.length > 4 ? args[4] : obj._obj;
	};

	var getActual$2 = /*@__PURE__*/getDefaultExportFromCjs(getActual$1);

	'use strict';

	/* !
	 * Chai - getFuncName utility
	 * Copyright(c) 2012-2016 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/**
	 * ### .getFuncName(constructorFn)
	 *
	 * Returns the name of a function.
	 * When a non-function instance is passed, returns `null`.
	 * This also includes a polyfill function if `aFunc.name` is not defined.
	 *
	 * @name getFuncName
	 * @param {Function} funct
	 * @namespace Utils
	 * @api public
	 */

	var toString = Function.prototype.toString;
	var functionNameMatch = /\s*function(?:\s|\s*\/\*[^(?:*\/)]+\*\/\s*)*([^\s\(\/]+)/;
	var maxFunctionSourceLength = 512;
	function getFuncName(aFunc) {
	  if (typeof aFunc !== 'function') {
	    return null;
	  }

	  var name = '';
	  if (typeof Function.prototype.name === 'undefined' && typeof aFunc.name === 'undefined') {
	    // eslint-disable-next-line prefer-reflect
	    var functionSource = toString.call(aFunc);
	    // To avoid unconstrained resource consumption due to pathalogically large function names,
	    // we limit the available return value to be less than 512 characters.
	    if (functionSource.indexOf('(') > maxFunctionSourceLength) {
	      return name;
	    }
	    // Here we run a polyfill if Function does not support the `name` property and if aFunc.name is not defined
	    var match = functionSource.match(functionNameMatch);
	    if (match) {
	      name = match[1];
	    }
	  } else {
	    // If we've got a `name` property we just use it
	    name = aFunc.name;
	  }

	  return name;
	}

	var getFuncName_1 = getFuncName;

	var index$2 = /*@__PURE__*/getDefaultExportFromCjs(getFuncName_1);

	var loupe$3 = {exports: {}};

	var _nodeResolve_empty = {};

	var _nodeResolve_empty$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		'default': _nodeResolve_empty
	});

	var require$$0 = /*@__PURE__*/getAugmentedNamespace(_nodeResolve_empty$1);

	var loupe$1 = loupe$3.exports;

	(function (module, exports) {
		(function (global, factory) {
		  'object' === 'object' && 'object' !== 'undefined' ? factory(exports) :
		  typeof undefined === 'function' && undefined.amd ? undefined(['exports'], factory) :
		  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.loupe = {}));
		}(commonjsGlobal, (function (exports) { 'use strict';

		  function _typeof(obj) {
		    "@babel/helpers - typeof";

		    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
		      _typeof = function (obj) {
		        return typeof obj;
		      };
		    } else {
		      _typeof = function (obj) {
		        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
		      };
		    }

		    return _typeof(obj);
		  }

		  function _slicedToArray(arr, i) {
		    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
		  }

		  function _arrayWithHoles(arr) {
		    if (Array.isArray(arr)) return arr;
		  }

		  function _iterableToArrayLimit(arr, i) {
		    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
		    var _arr = [];
		    var _n = true;
		    var _d = false;
		    var _e = undefined;

		    try {
		      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
		        _arr.push(_s.value);

		        if (i && _arr.length === i) break;
		      }
		    } catch (err) {
		      _d = true;
		      _e = err;
		    } finally {
		      try {
		        if (!_n && _i["return"] != null) _i["return"]();
		      } finally {
		        if (_d) throw _e;
		      }
		    }

		    return _arr;
		  }

		  function _unsupportedIterableToArray(o, minLen) {
		    if (!o) return;
		    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
		    var n = Object.prototype.toString.call(o).slice(8, -1);
		    if (n === "Object" && o.constructor) n = o.constructor.name;
		    if (n === "Map" || n === "Set") return Array.from(o);
		    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
		  }

		  function _arrayLikeToArray(arr, len) {
		    if (len == null || len > arr.length) len = arr.length;

		    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

		    return arr2;
		  }

		  function _nonIterableRest() {
		    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
		  }

		  var ansiColors = {
		    bold: ['1', '22'],
		    dim: ['2', '22'],
		    italic: ['3', '23'],
		    underline: ['4', '24'],
		    // 5 & 6 are blinking
		    inverse: ['7', '27'],
		    hidden: ['8', '28'],
		    strike: ['9', '29'],
		    // 10-20 are fonts
		    // 21-29 are resets for 1-9
		    black: ['30', '39'],
		    red: ['31', '39'],
		    green: ['32', '39'],
		    yellow: ['33', '39'],
		    blue: ['34', '39'],
		    magenta: ['35', '39'],
		    cyan: ['36', '39'],
		    white: ['37', '39'],
		    brightblack: ['30;1', '39'],
		    brightred: ['31;1', '39'],
		    brightgreen: ['32;1', '39'],
		    brightyellow: ['33;1', '39'],
		    brightblue: ['34;1', '39'],
		    brightmagenta: ['35;1', '39'],
		    brightcyan: ['36;1', '39'],
		    brightwhite: ['37;1', '39'],
		    grey: ['90', '39']
		  };
		  var styles = {
		    special: 'cyan',
		    number: 'yellow',
		    bigint: 'yellow',
		    boolean: 'yellow',
		    undefined: 'grey',
		    null: 'bold',
		    string: 'green',
		    symbol: 'green',
		    date: 'magenta',
		    regexp: 'red'
		  };
		  var truncator = '…';

		  function colorise(value, styleType) {
		    var color = ansiColors[styles[styleType]] || ansiColors[styleType];

		    if (!color) {
		      return String(value);
		    }

		    return "\x1B[".concat(color[0], "m").concat(String(value), "\x1B[").concat(color[1], "m");
		  }

		  function normaliseOptions() {
		    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
		        _ref$showHidden = _ref.showHidden,
		        showHidden = _ref$showHidden === void 0 ? false : _ref$showHidden,
		        _ref$depth = _ref.depth,
		        depth = _ref$depth === void 0 ? 2 : _ref$depth,
		        _ref$colors = _ref.colors,
		        colors = _ref$colors === void 0 ? false : _ref$colors,
		        _ref$customInspect = _ref.customInspect,
		        customInspect = _ref$customInspect === void 0 ? true : _ref$customInspect,
		        _ref$showProxy = _ref.showProxy,
		        showProxy = _ref$showProxy === void 0 ? false : _ref$showProxy,
		        _ref$maxArrayLength = _ref.maxArrayLength,
		        maxArrayLength = _ref$maxArrayLength === void 0 ? Infinity : _ref$maxArrayLength,
		        _ref$breakLength = _ref.breakLength,
		        breakLength = _ref$breakLength === void 0 ? Infinity : _ref$breakLength,
		        _ref$seen = _ref.seen,
		        seen = _ref$seen === void 0 ? [] : _ref$seen,
		        _ref$truncate = _ref.truncate,
		        truncate = _ref$truncate === void 0 ? Infinity : _ref$truncate,
		        _ref$stylize = _ref.stylize,
		        stylize = _ref$stylize === void 0 ? String : _ref$stylize;

		    var options = {
		      showHidden: Boolean(showHidden),
		      depth: Number(depth),
		      colors: Boolean(colors),
		      customInspect: Boolean(customInspect),
		      showProxy: Boolean(showProxy),
		      maxArrayLength: Number(maxArrayLength),
		      breakLength: Number(breakLength),
		      truncate: Number(truncate),
		      seen: seen,
		      stylize: stylize
		    };

		    if (options.colors) {
		      options.stylize = colorise;
		    }

		    return options;
		  }
		  function truncate(string, length) {
		    var tail = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : truncator;
		    string = String(string);
		    var tailLength = tail.length;
		    var stringLength = string.length;

		    if (tailLength > length && stringLength > tailLength) {
		      return tail;
		    }

		    if (stringLength > length && stringLength > tailLength) {
		      return "".concat(string.slice(0, length - tailLength)).concat(tail);
		    }

		    return string;
		  } // eslint-disable-next-line complexity

		  function inspectList(list, options, inspectItem) {
		    var separator = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ', ';
		    inspectItem = inspectItem || options.inspect;
		    var size = list.length;
		    if (size === 0) return '';
		    var originalLength = options.truncate;
		    var output = '';
		    var peek = '';
		    var truncated = '';

		    for (var i = 0; i < size; i += 1) {
		      var last = i + 1 === list.length;
		      var secondToLast = i + 2 === list.length;
		      truncated = "".concat(truncator, "(").concat(list.length - i, ")");
		      var value = list[i]; // If there is more than one remaining we need to account for a separator of `, `

		      options.truncate = originalLength - output.length - (last ? 0 : separator.length);
		      var string = peek || inspectItem(value, options) + (last ? '' : separator);
		      var nextLength = output.length + string.length;
		      var truncatedLength = nextLength + truncated.length; // If this is the last element, and adding it would
		      // take us over length, but adding the truncator wouldn't - then break now

		      if (last && nextLength > originalLength && output.length + truncated.length <= originalLength) {
		        break;
		      } // If this isn't the last or second to last element to scan,
		      // but the string is already over length then break here


		      if (!last && !secondToLast && truncatedLength > originalLength) {
		        break;
		      } // Peek at the next string to determine if we should
		      // break early before adding this item to the output


		      peek = last ? '' : inspectItem(list[i + 1], options) + (secondToLast ? '' : separator); // If we have one element left, but this element and
		      // the next takes over length, the break early

		      if (!last && secondToLast && truncatedLength > originalLength && nextLength + peek.length > originalLength) {
		        break;
		      }

		      output += string; // If the next element takes us to length -
		      // but there are more after that, then we should truncate now

		      if (!last && !secondToLast && nextLength + peek.length >= originalLength) {
		        truncated = "".concat(truncator, "(").concat(list.length - i - 1, ")");
		        break;
		      }

		      truncated = '';
		    }

		    return "".concat(output).concat(truncated);
		  }

		  function quoteComplexKey(key) {
		    if (key.match(/^[a-zA-Z_][a-zA-Z_0-9]*$/)) {
		      return key;
		    }

		    return JSON.stringify(key).replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
		  }

		  function inspectProperty(_ref2, options) {
		    var _ref3 = _slicedToArray(_ref2, 2),
		        key = _ref3[0],
		        value = _ref3[1];

		    options.truncate -= 2;

		    if (typeof key === 'string') {
		      key = quoteComplexKey(key);
		    } else if (typeof key !== 'number') {
		      key = "[".concat(options.inspect(key, options), "]");
		    }

		    options.truncate -= key.length;
		    value = options.inspect(value, options);
		    return "".concat(key, ": ").concat(value);
		  }

		  function inspectArray(array, options) {
		    // Object.keys will always output the Array indices first, so we can slice by
		    // `array.length` to get non-index properties
		    var nonIndexProperties = Object.keys(array).slice(array.length);
		    if (!array.length && !nonIndexProperties.length) return '[]';
		    options.truncate -= 4;
		    var listContents = inspectList(array, options);
		    options.truncate -= listContents.length;
		    var propertyContents = '';

		    if (nonIndexProperties.length) {
		      propertyContents = inspectList(nonIndexProperties.map(function (key) {
		        return [key, array[key]];
		      }), options, inspectProperty);
		    }

		    return "[ ".concat(listContents).concat(propertyContents ? ", ".concat(propertyContents) : '', " ]");
		  }

		  /* !
		   * Chai - getFuncName utility
		   * Copyright(c) 2012-2016 Jake Luer <jake@alogicalparadox.com>
		   * MIT Licensed
		   */

		  /**
		   * ### .getFuncName(constructorFn)
		   *
		   * Returns the name of a function.
		   * When a non-function instance is passed, returns `null`.
		   * This also includes a polyfill function if `aFunc.name` is not defined.
		   *
		   * @name getFuncName
		   * @param {Function} funct
		   * @namespace Utils
		   * @api public
		   */

		  var toString = Function.prototype.toString;
		  var functionNameMatch = /\s*function(?:\s|\s*\/\*[^(?:*\/)]+\*\/\s*)*([^\s\(\/]+)/;
		  function getFuncName(aFunc) {
		    if (typeof aFunc !== 'function') {
		      return null;
		    }

		    var name = '';
		    if (typeof Function.prototype.name === 'undefined' && typeof aFunc.name === 'undefined') {
		      // Here we run a polyfill if Function does not support the `name` property and if aFunc.name is not defined
		      var match = toString.call(aFunc).match(functionNameMatch);
		      if (match) {
		        name = match[1];
		      }
		    } else {
		      // If we've got a `name` property we just use it
		      name = aFunc.name;
		    }

		    return name;
		  }

		  var getFuncName_1 = getFuncName;

		  var getArrayName = function getArrayName(array) {
		    // We need to special case Node.js' Buffers, which report to be Uint8Array
		    if (typeof Buffer === 'function' && array instanceof Buffer) {
		      return 'Buffer';
		    }

		    if (array[Symbol.toStringTag]) {
		      return array[Symbol.toStringTag];
		    }

		    return getFuncName_1(array.constructor);
		  };

		  function inspectTypedArray(array, options) {
		    var name = getArrayName(array);
		    options.truncate -= name.length + 4; // Object.keys will always output the Array indices first, so we can slice by
		    // `array.length` to get non-index properties

		    var nonIndexProperties = Object.keys(array).slice(array.length);
		    if (!array.length && !nonIndexProperties.length) return "".concat(name, "[]"); // As we know TypedArrays only contain Unsigned Integers, we can skip inspecting each one and simply
		    // stylise the toString() value of them

		    var output = '';

		    for (var i = 0; i < array.length; i++) {
		      var string = "".concat(options.stylize(truncate(array[i], options.truncate), 'number')).concat(i === array.length - 1 ? '' : ', ');
		      options.truncate -= string.length;

		      if (array[i] !== array.length && options.truncate <= 3) {
		        output += "".concat(truncator, "(").concat(array.length - array[i] + 1, ")");
		        break;
		      }

		      output += string;
		    }

		    var propertyContents = '';

		    if (nonIndexProperties.length) {
		      propertyContents = inspectList(nonIndexProperties.map(function (key) {
		        return [key, array[key]];
		      }), options, inspectProperty);
		    }

		    return "".concat(name, "[ ").concat(output).concat(propertyContents ? ", ".concat(propertyContents) : '', " ]");
		  }

		  function inspectDate(dateObject, options) {
		    var stringRepresentation = dateObject.toJSON();

		    if (stringRepresentation === null) {
		      return 'Invalid Date';
		    }

		    var split = stringRepresentation.split('T');
		    var date = split[0]; // If we need to - truncate the time portion, but never the date

		    return options.stylize("".concat(date, "T").concat(truncate(split[1], options.truncate - date.length - 1)), 'date');
		  }

		  function inspectFunction(func, options) {
		    var name = getFuncName_1(func);

		    if (!name) {
		      return options.stylize('[Function]', 'special');
		    }

		    return options.stylize("[Function ".concat(truncate(name, options.truncate - 11), "]"), 'special');
		  }

		  function inspectMapEntry(_ref, options) {
		    var _ref2 = _slicedToArray(_ref, 2),
		        key = _ref2[0],
		        value = _ref2[1];

		    options.truncate -= 4;
		    key = options.inspect(key, options);
		    options.truncate -= key.length;
		    value = options.inspect(value, options);
		    return "".concat(key, " => ").concat(value);
		  } // IE11 doesn't support `map.entries()`


		  function mapToEntries(map) {
		    var entries = [];
		    map.forEach(function (value, key) {
		      entries.push([key, value]);
		    });
		    return entries;
		  }

		  function inspectMap(map, options) {
		    var size = map.size - 1;

		    if (size <= 0) {
		      return 'Map{}';
		    }

		    options.truncate -= 7;
		    return "Map{ ".concat(inspectList(mapToEntries(map), options, inspectMapEntry), " }");
		  }

		  var isNaN = Number.isNaN || function (i) {
		    return i !== i;
		  }; // eslint-disable-line no-self-compare


		  function inspectNumber(number, options) {
		    if (isNaN(number)) {
		      return options.stylize('NaN', 'number');
		    }

		    if (number === Infinity) {
		      return options.stylize('Infinity', 'number');
		    }

		    if (number === -Infinity) {
		      return options.stylize('-Infinity', 'number');
		    }

		    if (number === 0) {
		      return options.stylize(1 / number === Infinity ? '+0' : '-0', 'number');
		    }

		    return options.stylize(truncate(number, options.truncate), 'number');
		  }

		  function inspectBigInt(number, options) {
		    var nums = truncate(number.toString(), options.truncate - 1);
		    if (nums !== truncator) nums += 'n';
		    return options.stylize(nums, 'bigint');
		  }

		  function inspectRegExp(value, options) {
		    var flags = value.toString().split('/')[2];
		    var sourceLength = options.truncate - (2 + flags.length);
		    var source = value.source;
		    return options.stylize("/".concat(truncate(source, sourceLength), "/").concat(flags), 'regexp');
		  }

		  function arrayFromSet(set) {
		    var values = [];
		    set.forEach(function (value) {
		      values.push(value);
		    });
		    return values;
		  }

		  function inspectSet(set, options) {
		    if (set.size === 0) return 'Set{}';
		    options.truncate -= 7;
		    return "Set{ ".concat(inspectList(arrayFromSet(set), options), " }");
		  }

		  var stringEscapeChars = new RegExp("['\\u0000-\\u001f\\u007f-\\u009f\\u00ad\\u0600-\\u0604\\u070f\\u17b4\\u17b5" + "\\u200c-\\u200f\\u2028-\\u202f\\u2060-\\u206f\\ufeff\\ufff0-\\uffff]", 'g');
		  var escapeCharacters = {
		    '\b': '\\b',
		    '\t': '\\t',
		    '\n': '\\n',
		    '\f': '\\f',
		    '\r': '\\r',
		    "'": "\\'",
		    '\\': '\\\\'
		  };
		  var hex = 16;
		  var unicodeLength = 4;

		  function escape(char) {
		    return escapeCharacters[char] || "\\u".concat("0000".concat(char.charCodeAt(0).toString(hex)).slice(-unicodeLength));
		  }

		  function inspectString(string, options) {
		    if (stringEscapeChars.test(string)) {
		      string = string.replace(stringEscapeChars, escape);
		    }

		    return options.stylize("'".concat(truncate(string, options.truncate - 2), "'"), 'string');
		  }

		  function inspectSymbol(value) {
		    if ('description' in Symbol.prototype) {
		      return value.description ? "Symbol(".concat(value.description, ")") : 'Symbol()';
		    }

		    return value.toString();
		  }

		  var getPromiseValue = function getPromiseValue() {
		    return 'Promise{…}';
		  };

		  try {
		    var _process$binding = process.binding('util'),
		        getPromiseDetails = _process$binding.getPromiseDetails,
		        kPending = _process$binding.kPending,
		        kRejected = _process$binding.kRejected;

		    if (Array.isArray(getPromiseDetails(Promise.resolve()))) {
		      getPromiseValue = function getPromiseValue(value, options) {
		        var _getPromiseDetails = getPromiseDetails(value),
		            _getPromiseDetails2 = _slicedToArray(_getPromiseDetails, 2),
		            state = _getPromiseDetails2[0],
		            innerValue = _getPromiseDetails2[1];

		        if (state === kPending) {
		          return 'Promise{<pending>}';
		        }

		        return "Promise".concat(state === kRejected ? '!' : '', "{").concat(options.inspect(innerValue, options), "}");
		      };
		    }
		  } catch (notNode) {
		    /* ignore */
		  }

		  var inspectPromise = getPromiseValue;

		  function inspectObject(object, options) {
		    var properties = Object.getOwnPropertyNames(object);
		    var symbols = Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(object) : [];

		    if (properties.length === 0 && symbols.length === 0) {
		      return '{}';
		    }

		    options.truncate -= 4;
		    options.seen = options.seen || [];

		    if (options.seen.indexOf(object) >= 0) {
		      return '[Circular]';
		    }

		    options.seen.push(object);
		    var propertyContents = inspectList(properties.map(function (key) {
		      return [key, object[key]];
		    }), options, inspectProperty);
		    var symbolContents = inspectList(symbols.map(function (key) {
		      return [key, object[key]];
		    }), options, inspectProperty);
		    options.seen.pop();
		    var sep = '';

		    if (propertyContents && symbolContents) {
		      sep = ', ';
		    }

		    return "{ ".concat(propertyContents).concat(sep).concat(symbolContents, " }");
		  }

		  var toStringTag = typeof Symbol !== 'undefined' && Symbol.toStringTag ? Symbol.toStringTag : false;
		  function inspectClass(value, options) {
		    var name = '';

		    if (toStringTag && toStringTag in value) {
		      name = value[toStringTag];
		    }

		    name = name || getFuncName_1(value.constructor); // Babel transforms anonymous classes to the name `_class`

		    if (!name || name === '_class') {
		      name = '<Anonymous Class>';
		    }

		    options.truncate -= name.length;
		    return "".concat(name).concat(inspectObject(value, options));
		  }

		  function inspectArguments(args, options) {
		    if (args.length === 0) return 'Arguments[]';
		    options.truncate -= 13;
		    return "Arguments[ ".concat(inspectList(args, options), " ]");
		  }

		  var errorKeys = ['stack', 'line', 'column', 'name', 'message', 'fileName', 'lineNumber', 'columnNumber', 'number', 'description'];
		  function inspectObject$1(error, options) {
		    var properties = Object.getOwnPropertyNames(error).filter(function (key) {
		      return errorKeys.indexOf(key) === -1;
		    });
		    var name = error.name;
		    options.truncate -= name.length;
		    var message = '';

		    if (typeof error.message === 'string') {
		      message = truncate(error.message, options.truncate);
		    } else {
		      properties.unshift('message');
		    }

		    message = message ? ": ".concat(message) : '';
		    options.truncate -= message.length + 5;
		    var propertyContents = inspectList(properties.map(function (key) {
		      return [key, error[key]];
		    }), options, inspectProperty);
		    return "".concat(name).concat(message).concat(propertyContents ? " { ".concat(propertyContents, " }") : '');
		  }

		  function inspectAttribute(_ref, options) {
		    var _ref2 = _slicedToArray(_ref, 2),
		        key = _ref2[0],
		        value = _ref2[1];

		    options.truncate -= 3;

		    if (!value) {
		      return "".concat(options.stylize(key, 'yellow'));
		    }

		    return "".concat(options.stylize(key, 'yellow'), "=").concat(options.stylize("\"".concat(value, "\""), 'string'));
		  }
		  function inspectHTMLCollection(collection, options) {
		    // eslint-disable-next-line no-use-before-define
		    return inspectList(collection, options, inspectHTML, '\n');
		  }
		  function inspectHTML(element, options) {
		    var properties = element.getAttributeNames();
		    var name = element.tagName.toLowerCase();
		    var head = options.stylize("<".concat(name), 'special');
		    var headClose = options.stylize(">", 'special');
		    var tail = options.stylize("</".concat(name, ">"), 'special');
		    options.truncate -= name.length * 2 + 5;
		    var propertyContents = '';

		    if (properties.length > 0) {
		      propertyContents += ' ';
		      propertyContents += inspectList(properties.map(function (key) {
		        return [key, element.getAttribute(key)];
		      }), options, inspectAttribute, ' ');
		    }

		    options.truncate -= propertyContents.length;
		    var truncate = options.truncate;
		    var children = inspectHTMLCollection(element.children, options);

		    if (children && children.length > truncate) {
		      children = "".concat(truncator, "(").concat(element.children.length, ")");
		    }

		    return "".concat(head).concat(propertyContents).concat(headClose).concat(children).concat(tail);
		  }

		  var symbolsSupported = typeof Symbol === 'function' && typeof Symbol.for === 'function';
		  var chaiInspect = symbolsSupported ? Symbol.for('chai/inspect') : '@@chai/inspect';
		  var nodeInspect = false;

		  try {
		    // eslint-disable-next-line global-require
		    var nodeUtil = require$$0;

		    nodeInspect = nodeUtil.inspect ? nodeUtil.inspect.custom : false;
		  } catch (noNodeInspect) {
		    nodeInspect = false;
		  }

		  function FakeMap() {
		    // eslint-disable-next-line prefer-template
		    this.key = 'chai/loupe__' + Math.random() + Date.now();
		  }

		  FakeMap.prototype = {
		    // eslint-disable-next-line object-shorthand
		    get: function get(key) {
		      return key[this.key];
		    },
		    // eslint-disable-next-line object-shorthand
		    has: function has(key) {
		      return this.key in key;
		    },
		    // eslint-disable-next-line object-shorthand
		    set: function set(key, value) {
		      if (Object.isExtensible(key)) {
		        Object.defineProperty(key, this.key, {
		          // eslint-disable-next-line object-shorthand
		          value: value,
		          configurable: true
		        });
		      }
		    }
		  };
		  var constructorMap = new (typeof WeakMap === 'function' ? WeakMap : FakeMap)();
		  var stringTagMap = {};
		  var baseTypesMap = {
		    undefined: function undefined$1(value, options) {
		      return options.stylize('undefined', 'undefined');
		    },
		    null: function _null(value, options) {
		      return options.stylize(null, 'null');
		    },
		    boolean: function boolean(value, options) {
		      return options.stylize(value, 'boolean');
		    },
		    Boolean: function Boolean(value, options) {
		      return options.stylize(value, 'boolean');
		    },
		    number: inspectNumber,
		    Number: inspectNumber,
		    bigint: inspectBigInt,
		    BigInt: inspectBigInt,
		    string: inspectString,
		    String: inspectString,
		    function: inspectFunction,
		    Function: inspectFunction,
		    symbol: inspectSymbol,
		    // A Symbol polyfill will return `Symbol` not `symbol` from typedetect
		    Symbol: inspectSymbol,
		    Array: inspectArray,
		    Date: inspectDate,
		    Map: inspectMap,
		    Set: inspectSet,
		    RegExp: inspectRegExp,
		    Promise: inspectPromise,
		    // WeakSet, WeakMap are totally opaque to us
		    WeakSet: function WeakSet(value, options) {
		      return options.stylize('WeakSet{…}', 'special');
		    },
		    WeakMap: function WeakMap(value, options) {
		      return options.stylize('WeakMap{…}', 'special');
		    },
		    Arguments: inspectArguments,
		    Int8Array: inspectTypedArray,
		    Uint8Array: inspectTypedArray,
		    Uint8ClampedArray: inspectTypedArray,
		    Int16Array: inspectTypedArray,
		    Uint16Array: inspectTypedArray,
		    Int32Array: inspectTypedArray,
		    Uint32Array: inspectTypedArray,
		    Float32Array: inspectTypedArray,
		    Float64Array: inspectTypedArray,
		    Generator: function Generator() {
		      return '';
		    },
		    DataView: function DataView() {
		      return '';
		    },
		    ArrayBuffer: function ArrayBuffer() {
		      return '';
		    },
		    Error: inspectObject$1,
		    HTMLCollection: inspectHTMLCollection,
		    NodeList: inspectHTMLCollection
		  }; // eslint-disable-next-line complexity

		  var inspectCustom = function inspectCustom(value, options, type) {
		    if (chaiInspect in value && typeof value[chaiInspect] === 'function') {
		      return value[chaiInspect](options);
		    }

		    if (nodeInspect && nodeInspect in value && typeof value[nodeInspect] === 'function') {
		      return value[nodeInspect](options.depth, options);
		    }

		    if ('inspect' in value && typeof value.inspect === 'function') {
		      return value.inspect(options.depth, options);
		    }

		    if ('constructor' in value && constructorMap.has(value.constructor)) {
		      return constructorMap.get(value.constructor)(value, options);
		    }

		    if (stringTagMap[type]) {
		      return stringTagMap[type](value, options);
		    }

		    return '';
		  };

		  var toString$1 = Object.prototype.toString; // eslint-disable-next-line complexity

		  function inspect(value, options) {
		    options = normaliseOptions(options);
		    options.inspect = inspect;
		    var _options = options,
		        customInspect = _options.customInspect;
		    var type = value === null ? 'null' : _typeof(value);

		    if (type === 'object') {
		      type = toString$1.call(value).slice(8, -1);
		    } // If it is a base value that we already support, then use Loupe's inspector


		    if (baseTypesMap[type]) {
		      return baseTypesMap[type](value, options);
		    } // If `options.customInspect` is set to true then try to use the custom inspector


		    if (customInspect && value) {
		      var output = inspectCustom(value, options, type);

		      if (output) {
		        if (typeof output === 'string') return output;
		        return inspect(output, options);
		      }
		    }

		    var proto = value ? Object.getPrototypeOf(value) : false; // If it's a plain Object then use Loupe's inspector

		    if (proto === Object.prototype || proto === null) {
		      return inspectObject(value, options);
		    } // Specifically account for HTMLElements
		    // eslint-disable-next-line no-undef


		    if (value && typeof HTMLElement === 'function' && value instanceof HTMLElement) {
		      return inspectHTML(value, options);
		    }

		    if ('constructor' in value) {
		      // If it is a class, inspect it like an object but add the constructor name
		      if (value.constructor !== Object) {
		        return inspectClass(value, options);
		      } // If it is an object with an anonymous prototype, display it as an object.


		      return inspectObject(value, options);
		    } // last chance to check if it's an object


		    if (value === Object(value)) {
		      return inspectObject(value, options);
		    } // We have run out of options! Just stringify the value


		    return options.stylize(String(value), type);
		  }
		  function registerConstructor(constructor, inspector) {
		    if (constructorMap.has(constructor)) {
		      return false;
		    }

		    constructorMap.set(constructor, inspector);
		    return true;
		  }
		  function registerStringTag(stringTag, inspector) {
		    if (stringTag in stringTagMap) {
		      return false;
		    }

		    stringTagMap[stringTag] = inspector;
		    return true;
		  }
		  var custom = chaiInspect;

		  exports.custom = custom;
		  exports.default = inspect;
		  exports.inspect = inspect;
		  exports.registerConstructor = registerConstructor;
		  exports.registerStringTag = registerStringTag;

		  Object.defineProperty(exports, '__esModule', { value: true });

		}))); 
	} (loupe$3, loupe$3.exports));

	var loupeExports = loupe$3.exports;
	var loupe$2 = /*@__PURE__*/getDefaultExportFromCjs(loupeExports);

	var config$6 = {

	  /**
	   * ### config.includeStack
	   *
	   * User configurable property, influences whether stack trace
	   * is included in Assertion error message. Default of false
	   * suppresses stack trace in the error message.
	   *
	   *     chai.config.includeStack = true;  // enable stack on error
	   *
	   * @param {Boolean}
	   * @api public
	   */

	  includeStack: false,

	  /**
	   * ### config.showDiff
	   *
	   * User configurable property, influences whether or not
	   * the `showDiff` flag should be included in the thrown
	   * AssertionErrors. `false` will always be `false`; `true`
	   * will be true when the assertion has requested a diff
	   * be shown.
	   *
	   * @param {Boolean}
	   * @api public
	   */

	  showDiff: true,

	  /**
	   * ### config.truncateThreshold
	   *
	   * User configurable property, sets length threshold for actual and
	   * expected values in assertion errors. If this threshold is exceeded, for
	   * example for large data structures, the value is replaced with something
	   * like `[ Array(3) ]` or `{ Object (prop1, prop2) }`.
	   *
	   * Set it to zero if you want to disable truncating altogether.
	   *
	   * This is especially userful when doing assertions on arrays: having this
	   * set to a reasonable large value makes the failure messages readily
	   * inspectable.
	   *
	   *     chai.config.truncateThreshold = 0;  // disable truncating
	   *
	   * @param {Number}
	   * @api public
	   */

	  truncateThreshold: 40,

	  /**
	   * ### config.useProxy
	   *
	   * User configurable property, defines if chai will use a Proxy to throw
	   * an error when a non-existent property is read, which protects users
	   * from typos when using property-based assertions.
	   *
	   * Set it to false if you want to disable this feature.
	   *
	   *     chai.config.useProxy = false;  // disable use of Proxy
	   *
	   * This feature is automatically disabled regardless of this config value
	   * in environments that don't support proxies.
	   *
	   * @param {Boolean}
	   * @api public
	   */

	  useProxy: true,

	  /**
	   * ### config.proxyExcludedKeys
	   *
	   * User configurable property, defines which properties should be ignored
	   * instead of throwing an error if they do not exist on the assertion.
	   * This is only applied if the environment Chai is running in supports proxies and
	   * if the `useProxy` configuration setting is enabled.
	   * By default, `then` and `inspect` will not throw an error if they do not exist on the
	   * assertion object because the `.inspect` property is read by `util.inspect` (for example, when
	   * using `console.log` on the assertion object) and `.then` is necessary for promise type-checking.
	   *
	   *     // By default these keys will not throw an error if they do not exist on the assertion object
	   *     chai.config.proxyExcludedKeys = ['then', 'inspect'];
	   *
	   * @param {Array}
	   * @api public
	   */

	  proxyExcludedKeys: ['then', 'catch', 'inspect', 'toJSON']
	};

	var config$7 = /*@__PURE__*/getDefaultExportFromCjs(config$6);

	// This is (almost) directly from Node.js utils
	// https://github.com/joyent/node/blob/f8c335d0caf47f16d31413f89aa28eda3878e3aa/lib/util.js

	var getName = getFuncName_1;
	var loupe = loupeExports;
	var config$5 = config$6;

	var inspect_1 = inspect$2;

	/**
	 * ### .inspect(obj, [showHidden], [depth], [colors])
	 *
	 * Echoes the value of a value. Tries to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Boolean} showHidden Flag that shows hidden (not enumerable)
	 *    properties of objects. Default is false.
	 * @param {Number} depth Depth in which to descend in object. Default is 2.
	 * @param {Boolean} colors Flag to turn on ANSI escape codes to color the
	 *    output. Default is false (no coloring).
	 * @namespace Utils
	 * @name inspect
	 */
	function inspect$2(obj, showHidden, depth, colors) {
	  var options = {
	    colors: colors,
	    depth: (typeof depth === 'undefined' ? 2 : depth),
	    showHidden: showHidden,
	    truncate: config$5.truncateThreshold ? config$5.truncateThreshold : Infinity,
	  };
	  return loupe.inspect(obj, options);
	}

	var inspect$3 = /*@__PURE__*/getDefaultExportFromCjs(inspect_1);

	/*!
	 * Chai - flag utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/*!
	 * Module dependencies
	 */

	var inspect$1 = inspect_1;
	var config$4 = config$6;

	/**
	 * ### .objDisplay(object)
	 *
	 * Determines if an object or an array matches
	 * criteria to be inspected in-line for error
	 * messages or should be truncated.
	 *
	 * @param {Mixed} javascript object to inspect
	 * @returns {string} stringified object
	 * @name objDisplay
	 * @namespace Utils
	 * @api public
	 */

	var objDisplay$1 = function objDisplay(obj) {
	  var str = inspect$1(obj)
	    , type = Object.prototype.toString.call(obj);

	  if (config$4.truncateThreshold && str.length >= config$4.truncateThreshold) {
	    if (type === '[object Function]') {
	      return !obj.name || obj.name === ''
	        ? '[Function]'
	        : '[Function: ' + obj.name + ']';
	    } else if (type === '[object Array]') {
	      return '[ Array(' + obj.length + ') ]';
	    } else if (type === '[object Object]') {
	      var keys = Object.keys(obj)
	        , kstr = keys.length > 2
	          ? keys.splice(0, 2).join(', ') + ', ...'
	          : keys.join(', ');
	      return '{ Object (' + kstr + ') }';
	    } else {
	      return str;
	    }
	  } else {
	    return str;
	  }
	};

	var objDisplay$2 = /*@__PURE__*/getDefaultExportFromCjs(objDisplay$1);

	/*!
	 * Chai - message composition utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/*!
	 * Module dependencies
	 */

	var flag$2 = flag$5
	  , getActual = getActual$1
	  , objDisplay = objDisplay$1;

	/**
	 * ### .getMessage(object, message, negateMessage)
	 *
	 * Construct the error message based on flags
	 * and template tags. Template tags will return
	 * a stringified inspection of the object referenced.
	 *
	 * Message template tags:
	 * - `#{this}` current asserted object
	 * - `#{act}` actual value
	 * - `#{exp}` expected value
	 *
	 * @param {Object} object (constructed Assertion)
	 * @param {Arguments} chai.Assertion.prototype.assert arguments
	 * @namespace Utils
	 * @name getMessage
	 * @api public
	 */

	var getMessage$1 = function getMessage(obj, args) {
	  var negate = flag$2(obj, 'negate')
	    , val = flag$2(obj, 'object')
	    , expected = args[3]
	    , actual = getActual(obj, args)
	    , msg = negate ? args[2] : args[1]
	    , flagMsg = flag$2(obj, 'message');

	  if(typeof msg === "function") msg = msg();
	  msg = msg || '';
	  msg = msg
	    .replace(/#\{this\}/g, function () { return objDisplay(val); })
	    .replace(/#\{act\}/g, function () { return objDisplay(actual); })
	    .replace(/#\{exp\}/g, function () { return objDisplay(expected); });

	  return flagMsg ? flagMsg + ': ' + msg : msg;
	};

	var getMessage$2 = /*@__PURE__*/getDefaultExportFromCjs(getMessage$1);

	/*!
	 * Chai - transferFlags utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/**
	 * ### .transferFlags(assertion, object, includeAll = true)
	 *
	 * Transfer all the flags for `assertion` to `object`. If
	 * `includeAll` is set to `false`, then the base Chai
	 * assertion flags (namely `object`, `ssfi`, `lockSsfi`,
	 * and `message`) will not be transferred.
	 *
	 *
	 *     var newAssertion = new Assertion();
	 *     utils.transferFlags(assertion, newAssertion);
	 *
	 *     var anotherAssertion = new Assertion(myObj);
	 *     utils.transferFlags(assertion, anotherAssertion, false);
	 *
	 * @param {Assertion} assertion the assertion to transfer the flags from
	 * @param {Object} object the object to transfer the flags to; usually a new assertion
	 * @param {Boolean} includeAll
	 * @namespace Utils
	 * @name transferFlags
	 * @api private
	 */

	var transferFlags = function transferFlags(assertion, object, includeAll) {
	  var flags = assertion.__flags || (assertion.__flags = Object.create(null));

	  if (!object.__flags) {
	    object.__flags = Object.create(null);
	  }

	  includeAll = arguments.length === 3 ? includeAll : true;

	  for (var flag in flags) {
	    if (includeAll ||
	        (flag !== 'object' && flag !== 'ssfi' && flag !== 'lockSsfi' && flag != 'message')) {
	      object.__flags[flag] = flags[flag];
	    }
	  }
	};

	var transferFlags$1 = /*@__PURE__*/getDefaultExportFromCjs(transferFlags);

	var deepEql$1 = {exports: {}};

	var deepEql = deepEql$1.exports;

	'use strict';
	/* globals Symbol: false, Uint8Array: false, WeakMap: false */
	/*!
	 * deep-eql
	 * Copyright(c) 2013 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	var type$1 = typeDetectExports;
	function FakeMap() {
	  this._key = 'chai/deep-eql__' + Math.random() + Date.now();
	}

	FakeMap.prototype = {
	  get: function get(key) {
	    return key[this._key];
	  },
	  set: function set(key, value) {
	    if (Object.isExtensible(key)) {
	      Object.defineProperty(key, this._key, {
	        value: value,
	        configurable: true,
	      });
	    }
	  },
	};

	var MemoizeMap = typeof WeakMap === 'function' ? WeakMap : FakeMap;
	/*!
	 * Check to see if the MemoizeMap has recorded a result of the two operands
	 *
	 * @param {Mixed} leftHandOperand
	 * @param {Mixed} rightHandOperand
	 * @param {MemoizeMap} memoizeMap
	 * @returns {Boolean|null} result
	*/
	function memoizeCompare(leftHandOperand, rightHandOperand, memoizeMap) {
	  // Technically, WeakMap keys can *only* be objects, not primitives.
	  if (!memoizeMap || isPrimitive(leftHandOperand) || isPrimitive(rightHandOperand)) {
	    return null;
	  }
	  var leftHandMap = memoizeMap.get(leftHandOperand);
	  if (leftHandMap) {
	    var result = leftHandMap.get(rightHandOperand);
	    if (typeof result === 'boolean') {
	      return result;
	    }
	  }
	  return null;
	}

	/*!
	 * Set the result of the equality into the MemoizeMap
	 *
	 * @param {Mixed} leftHandOperand
	 * @param {Mixed} rightHandOperand
	 * @param {MemoizeMap} memoizeMap
	 * @param {Boolean} result
	*/
	function memoizeSet(leftHandOperand, rightHandOperand, memoizeMap, result) {
	  // Technically, WeakMap keys can *only* be objects, not primitives.
	  if (!memoizeMap || isPrimitive(leftHandOperand) || isPrimitive(rightHandOperand)) {
	    return;
	  }
	  var leftHandMap = memoizeMap.get(leftHandOperand);
	  if (leftHandMap) {
	    leftHandMap.set(rightHandOperand, result);
	  } else {
	    leftHandMap = new MemoizeMap();
	    leftHandMap.set(rightHandOperand, result);
	    memoizeMap.set(leftHandOperand, leftHandMap);
	  }
	}

	/*!
	 * Primary Export
	 */

	deepEql$1.exports = deepEqual;
	var MemoizeMap_1 = deepEql$1.exports.MemoizeMap = MemoizeMap;

	/**
	 * Assert deeply nested sameValue equality between two objects of any type.
	 *
	 * @param {Mixed} leftHandOperand
	 * @param {Mixed} rightHandOperand
	 * @param {Object} [options] (optional) Additional options
	 * @param {Array} [options.comparator] (optional) Override default algorithm, determining custom equality.
	 * @param {Array} [options.memoize] (optional) Provide a custom memoization object which will cache the results of
	    complex objects for a speed boost. By passing `false` you can disable memoization, but this will cause circular
	    references to blow the stack.
	 * @return {Boolean} equal match
	 */
	function deepEqual(leftHandOperand, rightHandOperand, options) {
	  // If we have a comparator, we can't assume anything; so bail to its check first.
	  if (options && options.comparator) {
	    return extensiveDeepEqual(leftHandOperand, rightHandOperand, options);
	  }

	  var simpleResult = simpleEqual(leftHandOperand, rightHandOperand);
	  if (simpleResult !== null) {
	    return simpleResult;
	  }

	  // Deeper comparisons are pushed through to a larger function
	  return extensiveDeepEqual(leftHandOperand, rightHandOperand, options);
	}

	/**
	 * Many comparisons can be canceled out early via simple equality or primitive checks.
	 * @param {Mixed} leftHandOperand
	 * @param {Mixed} rightHandOperand
	 * @return {Boolean|null} equal match
	 */
	function simpleEqual(leftHandOperand, rightHandOperand) {
	  // Equal references (except for Numbers) can be returned early
	  if (leftHandOperand === rightHandOperand) {
	    // Handle +-0 cases
	    return leftHandOperand !== 0 || 1 / leftHandOperand === 1 / rightHandOperand;
	  }

	  // handle NaN cases
	  if (
	    leftHandOperand !== leftHandOperand && // eslint-disable-line no-self-compare
	    rightHandOperand !== rightHandOperand // eslint-disable-line no-self-compare
	  ) {
	    return true;
	  }

	  // Anything that is not an 'object', i.e. symbols, functions, booleans, numbers,
	  // strings, and undefined, can be compared by reference.
	  if (isPrimitive(leftHandOperand) || isPrimitive(rightHandOperand)) {
	    // Easy out b/c it would have passed the first equality check
	    return false;
	  }
	  return null;
	}

	/*!
	 * The main logic of the `deepEqual` function.
	 *
	 * @param {Mixed} leftHandOperand
	 * @param {Mixed} rightHandOperand
	 * @param {Object} [options] (optional) Additional options
	 * @param {Array} [options.comparator] (optional) Override default algorithm, determining custom equality.
	 * @param {Array} [options.memoize] (optional) Provide a custom memoization object which will cache the results of
	    complex objects for a speed boost. By passing `false` you can disable memoization, but this will cause circular
	    references to blow the stack.
	 * @return {Boolean} equal match
	*/
	function extensiveDeepEqual(leftHandOperand, rightHandOperand, options) {
	  options = options || {};
	  options.memoize = options.memoize === false ? false : options.memoize || new MemoizeMap();
	  var comparator = options && options.comparator;

	  // Check if a memoized result exists.
	  var memoizeResultLeft = memoizeCompare(leftHandOperand, rightHandOperand, options.memoize);
	  if (memoizeResultLeft !== null) {
	    return memoizeResultLeft;
	  }
	  var memoizeResultRight = memoizeCompare(rightHandOperand, leftHandOperand, options.memoize);
	  if (memoizeResultRight !== null) {
	    return memoizeResultRight;
	  }

	  // If a comparator is present, use it.
	  if (comparator) {
	    var comparatorResult = comparator(leftHandOperand, rightHandOperand);
	    // Comparators may return null, in which case we want to go back to default behavior.
	    if (comparatorResult === false || comparatorResult === true) {
	      memoizeSet(leftHandOperand, rightHandOperand, options.memoize, comparatorResult);
	      return comparatorResult;
	    }
	    // To allow comparators to override *any* behavior, we ran them first. Since it didn't decide
	    // what to do, we need to make sure to return the basic tests first before we move on.
	    var simpleResult = simpleEqual(leftHandOperand, rightHandOperand);
	    if (simpleResult !== null) {
	      // Don't memoize this, it takes longer to set/retrieve than to just compare.
	      return simpleResult;
	    }
	  }

	  var leftHandType = type$1(leftHandOperand);
	  if (leftHandType !== type$1(rightHandOperand)) {
	    memoizeSet(leftHandOperand, rightHandOperand, options.memoize, false);
	    return false;
	  }

	  // Temporarily set the operands in the memoize object to prevent blowing the stack
	  memoizeSet(leftHandOperand, rightHandOperand, options.memoize, true);

	  var result = extensiveDeepEqualByType(leftHandOperand, rightHandOperand, leftHandType, options);
	  memoizeSet(leftHandOperand, rightHandOperand, options.memoize, result);
	  return result;
	}

	function extensiveDeepEqualByType(leftHandOperand, rightHandOperand, leftHandType, options) {
	  switch (leftHandType) {
	    case 'String':
	    case 'Number':
	    case 'Boolean':
	    case 'Date':
	      // If these types are their instance types (e.g. `new Number`) then re-deepEqual against their values
	      return deepEqual(leftHandOperand.valueOf(), rightHandOperand.valueOf());
	    case 'Promise':
	    case 'Symbol':
	    case 'function':
	    case 'WeakMap':
	    case 'WeakSet':
	      return leftHandOperand === rightHandOperand;
	    case 'Error':
	      return keysEqual(leftHandOperand, rightHandOperand, [ 'name', 'message', 'code' ], options);
	    case 'Arguments':
	    case 'Int8Array':
	    case 'Uint8Array':
	    case 'Uint8ClampedArray':
	    case 'Int16Array':
	    case 'Uint16Array':
	    case 'Int32Array':
	    case 'Uint32Array':
	    case 'Float32Array':
	    case 'Float64Array':
	    case 'Array':
	      return iterableEqual(leftHandOperand, rightHandOperand, options);
	    case 'RegExp':
	      return regexpEqual(leftHandOperand, rightHandOperand);
	    case 'Generator':
	      return generatorEqual(leftHandOperand, rightHandOperand, options);
	    case 'DataView':
	      return iterableEqual(new Uint8Array(leftHandOperand.buffer), new Uint8Array(rightHandOperand.buffer), options);
	    case 'ArrayBuffer':
	      return iterableEqual(new Uint8Array(leftHandOperand), new Uint8Array(rightHandOperand), options);
	    case 'Set':
	      return entriesEqual(leftHandOperand, rightHandOperand, options);
	    case 'Map':
	      return entriesEqual(leftHandOperand, rightHandOperand, options);
	    case 'Temporal.PlainDate':
	    case 'Temporal.PlainTime':
	    case 'Temporal.PlainDateTime':
	    case 'Temporal.Instant':
	    case 'Temporal.ZonedDateTime':
	    case 'Temporal.PlainYearMonth':
	    case 'Temporal.PlainMonthDay':
	      return leftHandOperand.equals(rightHandOperand);
	    case 'Temporal.Duration':
	      return leftHandOperand.total('nanoseconds') === rightHandOperand.total('nanoseconds');
	    case 'Temporal.TimeZone':
	    case 'Temporal.Calendar':
	      return leftHandOperand.toString() === rightHandOperand.toString();
	    default:
	      return objectEqual(leftHandOperand, rightHandOperand, options);
	  }
	}

	/*!
	 * Compare two Regular Expressions for equality.
	 *
	 * @param {RegExp} leftHandOperand
	 * @param {RegExp} rightHandOperand
	 * @return {Boolean} result
	 */

	function regexpEqual(leftHandOperand, rightHandOperand) {
	  return leftHandOperand.toString() === rightHandOperand.toString();
	}

	/*!
	 * Compare two Sets/Maps for equality. Faster than other equality functions.
	 *
	 * @param {Set} leftHandOperand
	 * @param {Set} rightHandOperand
	 * @param {Object} [options] (Optional)
	 * @return {Boolean} result
	 */

	function entriesEqual(leftHandOperand, rightHandOperand, options) {
	  // IE11 doesn't support Set#entries or Set#@@iterator, so we need manually populate using Set#forEach
	  if (leftHandOperand.size !== rightHandOperand.size) {
	    return false;
	  }
	  if (leftHandOperand.size === 0) {
	    return true;
	  }
	  var leftHandItems = [];
	  var rightHandItems = [];
	  leftHandOperand.forEach(function gatherEntries(key, value) {
	    leftHandItems.push([ key, value ]);
	  });
	  rightHandOperand.forEach(function gatherEntries(key, value) {
	    rightHandItems.push([ key, value ]);
	  });
	  return iterableEqual(leftHandItems.sort(), rightHandItems.sort(), options);
	}

	/*!
	 * Simple equality for flat iterable objects such as Arrays, TypedArrays or Node.js buffers.
	 *
	 * @param {Iterable} leftHandOperand
	 * @param {Iterable} rightHandOperand
	 * @param {Object} [options] (Optional)
	 * @return {Boolean} result
	 */

	function iterableEqual(leftHandOperand, rightHandOperand, options) {
	  var length = leftHandOperand.length;
	  if (length !== rightHandOperand.length) {
	    return false;
	  }
	  if (length === 0) {
	    return true;
	  }
	  var index = -1;
	  while (++index < length) {
	    if (deepEqual(leftHandOperand[index], rightHandOperand[index], options) === false) {
	      return false;
	    }
	  }
	  return true;
	}

	/*!
	 * Simple equality for generator objects such as those returned by generator functions.
	 *
	 * @param {Iterable} leftHandOperand
	 * @param {Iterable} rightHandOperand
	 * @param {Object} [options] (Optional)
	 * @return {Boolean} result
	 */

	function generatorEqual(leftHandOperand, rightHandOperand, options) {
	  return iterableEqual(getGeneratorEntries(leftHandOperand), getGeneratorEntries(rightHandOperand), options);
	}

	/*!
	 * Determine if the given object has an @@iterator function.
	 *
	 * @param {Object} target
	 * @return {Boolean} `true` if the object has an @@iterator function.
	 */
	function hasIteratorFunction(target) {
	  return typeof Symbol !== 'undefined' &&
	    typeof target === 'object' &&
	    typeof Symbol.iterator !== 'undefined' &&
	    typeof target[Symbol.iterator] === 'function';
	}

	/*!
	 * Gets all iterator entries from the given Object. If the Object has no @@iterator function, returns an empty array.
	 * This will consume the iterator - which could have side effects depending on the @@iterator implementation.
	 *
	 * @param {Object} target
	 * @returns {Array} an array of entries from the @@iterator function
	 */
	function getIteratorEntries(target) {
	  if (hasIteratorFunction(target)) {
	    try {
	      return getGeneratorEntries(target[Symbol.iterator]());
	    } catch (iteratorError) {
	      return [];
	    }
	  }
	  return [];
	}

	/*!
	 * Gets all entries from a Generator. This will consume the generator - which could have side effects.
	 *
	 * @param {Generator} target
	 * @returns {Array} an array of entries from the Generator.
	 */
	function getGeneratorEntries(generator) {
	  var generatorResult = generator.next();
	  var accumulator = [ generatorResult.value ];
	  while (generatorResult.done === false) {
	    generatorResult = generator.next();
	    accumulator.push(generatorResult.value);
	  }
	  return accumulator;
	}

	/*!
	 * Gets all own and inherited enumerable keys from a target.
	 *
	 * @param {Object} target
	 * @returns {Array} an array of own and inherited enumerable keys from the target.
	 */
	function getEnumerableKeys(target) {
	  var keys = [];
	  for (var key in target) {
	    keys.push(key);
	  }
	  return keys;
	}

	function getEnumerableSymbols(target) {
	  var keys = [];
	  var allKeys = Object.getOwnPropertySymbols(target);
	  for (var i = 0; i < allKeys.length; i += 1) {
	    var key = allKeys[i];
	    if (Object.getOwnPropertyDescriptor(target, key).enumerable) {
	      keys.push(key);
	    }
	  }
	  return keys;
	}

	/*!
	 * Determines if two objects have matching values, given a set of keys. Defers to deepEqual for the equality check of
	 * each key. If any value of the given key is not equal, the function will return false (early).
	 *
	 * @param {Mixed} leftHandOperand
	 * @param {Mixed} rightHandOperand
	 * @param {Array} keys An array of keys to compare the values of leftHandOperand and rightHandOperand against
	 * @param {Object} [options] (Optional)
	 * @return {Boolean} result
	 */
	function keysEqual(leftHandOperand, rightHandOperand, keys, options) {
	  var length = keys.length;
	  if (length === 0) {
	    return true;
	  }
	  for (var i = 0; i < length; i += 1) {
	    if (deepEqual(leftHandOperand[keys[i]], rightHandOperand[keys[i]], options) === false) {
	      return false;
	    }
	  }
	  return true;
	}

	/*!
	 * Recursively check the equality of two Objects. Once basic sameness has been established it will defer to `deepEqual`
	 * for each enumerable key in the object.
	 *
	 * @param {Mixed} leftHandOperand
	 * @param {Mixed} rightHandOperand
	 * @param {Object} [options] (Optional)
	 * @return {Boolean} result
	 */
	function objectEqual(leftHandOperand, rightHandOperand, options) {
	  var leftHandKeys = getEnumerableKeys(leftHandOperand);
	  var rightHandKeys = getEnumerableKeys(rightHandOperand);
	  var leftHandSymbols = getEnumerableSymbols(leftHandOperand);
	  var rightHandSymbols = getEnumerableSymbols(rightHandOperand);
	  leftHandKeys = leftHandKeys.concat(leftHandSymbols);
	  rightHandKeys = rightHandKeys.concat(rightHandSymbols);

	  if (leftHandKeys.length && leftHandKeys.length === rightHandKeys.length) {
	    if (iterableEqual(mapSymbols(leftHandKeys).sort(), mapSymbols(rightHandKeys).sort()) === false) {
	      return false;
	    }
	    return keysEqual(leftHandOperand, rightHandOperand, leftHandKeys, options);
	  }

	  var leftHandEntries = getIteratorEntries(leftHandOperand);
	  var rightHandEntries = getIteratorEntries(rightHandOperand);
	  if (leftHandEntries.length && leftHandEntries.length === rightHandEntries.length) {
	    leftHandEntries.sort();
	    rightHandEntries.sort();
	    return iterableEqual(leftHandEntries, rightHandEntries, options);
	  }

	  if (leftHandKeys.length === 0 &&
	      leftHandEntries.length === 0 &&
	      rightHandKeys.length === 0 &&
	      rightHandEntries.length === 0) {
	    return true;
	  }

	  return false;
	}

	/*!
	 * Returns true if the argument is a primitive.
	 *
	 * This intentionally returns true for all objects that can be compared by reference,
	 * including functions and symbols.
	 *
	 * @param {Mixed} value
	 * @return {Boolean} result
	 */
	function isPrimitive(value) {
	  return value === null || typeof value !== 'object';
	}

	function mapSymbols(arr) {
	  return arr.map(function mapSymbol(entry) {
	    if (typeof entry === 'symbol') {
	      return entry.toString();
	    }

	    return entry;
	  });
	}

	var deepEqlExports = deepEql$1.exports;
	var index$1 = /*@__PURE__*/getDefaultExportFromCjs(deepEqlExports);

	var config$3 = config$6;

	/*!
	 * Chai - isProxyEnabled helper
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/**
	 * ### .isProxyEnabled()
	 *
	 * Helper function to check if Chai's proxy protection feature is enabled. If
	 * proxies are unsupported or disabled via the user's Chai config, then return
	 * false. Otherwise, return true.
	 *
	 * @namespace Utils
	 * @name isProxyEnabled
	 */

	var isProxyEnabled$1 = function isProxyEnabled() {
	  return config$3.useProxy &&
	    typeof Proxy !== 'undefined' &&
	    typeof Reflect !== 'undefined';
	};

	var isProxyEnabled$2 = /*@__PURE__*/getDefaultExportFromCjs(isProxyEnabled$1);

	/*!
	 * Chai - addProperty utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	var addProperty;
	var hasRequiredAddProperty;

	function requireAddProperty () {
		if (hasRequiredAddProperty) return addProperty;
		hasRequiredAddProperty = 1;
		var chai = requireChai();
		var flag = flag$5;
		var isProxyEnabled = isProxyEnabled$1;
		var transferFlags$1 = transferFlags;

		/**
		 * ### .addProperty(ctx, name, getter)
		 *
		 * Adds a property to the prototype of an object.
		 *
		 *     utils.addProperty(chai.Assertion.prototype, 'foo', function () {
		 *       var obj = utils.flag(this, 'object');
		 *       new chai.Assertion(obj).to.be.instanceof(Foo);
		 *     });
		 *
		 * Can also be accessed directly from `chai.Assertion`.
		 *
		 *     chai.Assertion.addProperty('foo', fn);
		 *
		 * Then can be used as any other assertion.
		 *
		 *     expect(myFoo).to.be.foo;
		 *
		 * @param {Object} ctx object to which the property is added
		 * @param {String} name of property to add
		 * @param {Function} getter function to be used for name
		 * @namespace Utils
		 * @name addProperty
		 * @api public
		 */

		addProperty = function addProperty(ctx, name, getter) {
		  getter = getter === undefined ? function () {} : getter;

		  Object.defineProperty(ctx, name,
		    { get: function propertyGetter() {
		        // Setting the `ssfi` flag to `propertyGetter` causes this function to
		        // be the starting point for removing implementation frames from the
		        // stack trace of a failed assertion.
		        //
		        // However, we only want to use this function as the starting point if
		        // the `lockSsfi` flag isn't set and proxy protection is disabled.
		        //
		        // If the `lockSsfi` flag is set, then either this assertion has been
		        // overwritten by another assertion, or this assertion is being invoked
		        // from inside of another assertion. In the first case, the `ssfi` flag
		        // has already been set by the overwriting assertion. In the second
		        // case, the `ssfi` flag has already been set by the outer assertion.
		        //
		        // If proxy protection is enabled, then the `ssfi` flag has already been
		        // set by the proxy getter.
		        if (!isProxyEnabled() && !flag(this, 'lockSsfi')) {
		          flag(this, 'ssfi', propertyGetter);
		        }

		        var result = getter.call(this);
		        if (result !== undefined)
		          return result;

		        var newAssertion = new chai.Assertion();
		        transferFlags$1(this, newAssertion);
		        return newAssertion;
		      }
		    , configurable: true
		  });
		};
		return addProperty;
	}

	var fnLengthDesc = Object.getOwnPropertyDescriptor(function () {}, 'length');

	/*!
	 * Chai - addLengthGuard utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/**
	 * ### .addLengthGuard(fn, assertionName, isChainable)
	 *
	 * Define `length` as a getter on the given uninvoked method assertion. The
	 * getter acts as a guard against chaining `length` directly off of an uninvoked
	 * method assertion, which is a problem because it references `function`'s
	 * built-in `length` property instead of Chai's `length` assertion. When the
	 * getter catches the user making this mistake, it throws an error with a
	 * helpful message.
	 *
	 * There are two ways in which this mistake can be made. The first way is by
	 * chaining the `length` assertion directly off of an uninvoked chainable
	 * method. In this case, Chai suggests that the user use `lengthOf` instead. The
	 * second way is by chaining the `length` assertion directly off of an uninvoked
	 * non-chainable method. Non-chainable methods must be invoked prior to
	 * chaining. In this case, Chai suggests that the user consult the docs for the
	 * given assertion.
	 *
	 * If the `length` property of functions is unconfigurable, then return `fn`
	 * without modification.
	 *
	 * Note that in ES6, the function's `length` property is configurable, so once
	 * support for legacy environments is dropped, Chai's `length` property can
	 * replace the built-in function's `length` property, and this length guard will
	 * no longer be necessary. In the mean time, maintaining consistency across all
	 * environments is the priority.
	 *
	 * @param {Function} fn
	 * @param {String} assertionName
	 * @param {Boolean} isChainable
	 * @namespace Utils
	 * @name addLengthGuard
	 */

	var addLengthGuard = function addLengthGuard (fn, assertionName, isChainable) {
	  if (!fnLengthDesc.configurable) return fn;

	  Object.defineProperty(fn, 'length', {
	    get: function () {
	      if (isChainable) {
	        throw Error('Invalid Chai property: ' + assertionName + '.length. Due' +
	          ' to a compatibility issue, "length" cannot directly follow "' +
	          assertionName + '". Use "' + assertionName + '.lengthOf" instead.');
	      }

	      throw Error('Invalid Chai property: ' + assertionName + '.length. See' +
	        ' docs for proper usage of "' + assertionName + '".');
	    }
	  });

	  return fn;
	};

	var addLengthGuard$1 = /*@__PURE__*/getDefaultExportFromCjs(addLengthGuard);

	/*!
	 * Chai - getProperties utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/**
	 * ### .getProperties(object)
	 *
	 * This allows the retrieval of property names of an object, enumerable or not,
	 * inherited or not.
	 *
	 * @param {Object} object
	 * @returns {Array}
	 * @namespace Utils
	 * @name getProperties
	 * @api public
	 */

	var getProperties$1 = function getProperties(object) {
	  var result = Object.getOwnPropertyNames(object);

	  function addProperty(property) {
	    if (result.indexOf(property) === -1) {
	      result.push(property);
	    }
	  }

	  var proto = Object.getPrototypeOf(object);
	  while (proto !== null) {
	    Object.getOwnPropertyNames(proto).forEach(addProperty);
	    proto = Object.getPrototypeOf(proto);
	  }

	  return result;
	};

	var getProperties$2 = /*@__PURE__*/getDefaultExportFromCjs(getProperties$1);

	var config$2 = config$6;
	var flag$1 = flag$5;
	var getProperties = getProperties$1;
	var isProxyEnabled = isProxyEnabled$1;

	/*!
	 * Chai - proxify utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/**
	 * ### .proxify(object)
	 *
	 * Return a proxy of given object that throws an error when a non-existent
	 * property is read. By default, the root cause is assumed to be a misspelled
	 * property, and thus an attempt is made to offer a reasonable suggestion from
	 * the list of existing properties. However, if a nonChainableMethodName is
	 * provided, then the root cause is instead a failure to invoke a non-chainable
	 * method prior to reading the non-existent property.
	 *
	 * If proxies are unsupported or disabled via the user's Chai config, then
	 * return object without modification.
	 *
	 * @param {Object} obj
	 * @param {String} nonChainableMethodName
	 * @namespace Utils
	 * @name proxify
	 */

	var builtins = ['__flags', '__methods', '_obj', 'assert'];

	var proxify = function proxify(obj, nonChainableMethodName) {
	  if (!isProxyEnabled()) return obj;

	  return new Proxy(obj, {
	    get: function proxyGetter(target, property) {
	      // This check is here because we should not throw errors on Symbol properties
	      // such as `Symbol.toStringTag`.
	      // The values for which an error should be thrown can be configured using
	      // the `config.proxyExcludedKeys` setting.
	      if (typeof property === 'string' &&
	          config$2.proxyExcludedKeys.indexOf(property) === -1 &&
	          !Reflect.has(target, property)) {
	        // Special message for invalid property access of non-chainable methods.
	        if (nonChainableMethodName) {
	          throw Error('Invalid Chai property: ' + nonChainableMethodName + '.' +
	            property + '. See docs for proper usage of "' +
	            nonChainableMethodName + '".');
	        }

	        // If the property is reasonably close to an existing Chai property,
	        // suggest that property to the user. Only suggest properties with a
	        // distance less than 4.
	        var suggestion = null;
	        var suggestionDistance = 4;
	        getProperties(target).forEach(function(prop) {
	          if (
	            !Object.prototype.hasOwnProperty(prop) &&
	            builtins.indexOf(prop) === -1
	          ) {
	            var dist = stringDistanceCapped(
	              property,
	              prop,
	              suggestionDistance
	            );
	            if (dist < suggestionDistance) {
	              suggestion = prop;
	              suggestionDistance = dist;
	            }
	          }
	        });

	        if (suggestion !== null) {
	          throw Error('Invalid Chai property: ' + property +
	            '. Did you mean "' + suggestion + '"?');
	        } else {
	          throw Error('Invalid Chai property: ' + property);
	        }
	      }

	      // Use this proxy getter as the starting point for removing implementation
	      // frames from the stack trace of a failed assertion. For property
	      // assertions, this prevents the proxy getter from showing up in the stack
	      // trace since it's invoked before the property getter. For method and
	      // chainable method assertions, this flag will end up getting changed to
	      // the method wrapper, which is good since this frame will no longer be in
	      // the stack once the method is invoked. Note that Chai builtin assertion
	      // properties such as `__flags` are skipped since this is only meant to
	      // capture the starting point of an assertion. This step is also skipped
	      // if the `lockSsfi` flag is set, thus indicating that this assertion is
	      // being called from within another assertion. In that case, the `ssfi`
	      // flag is already set to the outer assertion's starting point.
	      if (builtins.indexOf(property) === -1 && !flag$1(target, 'lockSsfi')) {
	        flag$1(target, 'ssfi', proxyGetter);
	      }

	      return Reflect.get(target, property);
	    }
	  });
	};

	/**
	 * # stringDistanceCapped(strA, strB, cap)
	 * Return the Levenshtein distance between two strings, but no more than cap.
	 * @param {string} strA
	 * @param {string} strB
	 * @param {number} number
	 * @return {number} min(string distance between strA and strB, cap)
	 * @api private
	 */

	function stringDistanceCapped(strA, strB, cap) {
	  if (Math.abs(strA.length - strB.length) >= cap) {
	    return cap;
	  }

	  var memo = [];
	  // `memo` is a two-dimensional array containing distances.
	  // memo[i][j] is the distance between strA.slice(0, i) and
	  // strB.slice(0, j).
	  for (var i = 0; i <= strA.length; i++) {
	    memo[i] = Array(strB.length + 1).fill(0);
	    memo[i][0] = i;
	  }
	  for (var j = 0; j < strB.length; j++) {
	    memo[0][j] = j;
	  }

	  for (var i = 1; i <= strA.length; i++) {
	    var ch = strA.charCodeAt(i - 1);
	    for (var j = 1; j <= strB.length; j++) {
	      if (Math.abs(i - j) >= cap) {
	        memo[i][j] = cap;
	        continue;
	      }
	      memo[i][j] = Math.min(
	        memo[i - 1][j] + 1,
	        memo[i][j - 1] + 1,
	        memo[i - 1][j - 1] +
	          (ch === strB.charCodeAt(j - 1) ? 0 : 1)
	      );
	    }
	  }

	  return memo[strA.length][strB.length];
	}

	var proxify$1 = /*@__PURE__*/getDefaultExportFromCjs(proxify);

	/*!
	 * Chai - addMethod utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	var addMethod;
	var hasRequiredAddMethod;

	function requireAddMethod () {
		if (hasRequiredAddMethod) return addMethod;
		hasRequiredAddMethod = 1;
		var addLengthGuard$1 = addLengthGuard;
		var chai = requireChai();
		var flag = flag$5;
		var proxify$1 = proxify;
		var transferFlags$1 = transferFlags;

		/**
		 * ### .addMethod(ctx, name, method)
		 *
		 * Adds a method to the prototype of an object.
		 *
		 *     utils.addMethod(chai.Assertion.prototype, 'foo', function (str) {
		 *       var obj = utils.flag(this, 'object');
		 *       new chai.Assertion(obj).to.be.equal(str);
		 *     });
		 *
		 * Can also be accessed directly from `chai.Assertion`.
		 *
		 *     chai.Assertion.addMethod('foo', fn);
		 *
		 * Then can be used as any other assertion.
		 *
		 *     expect(fooStr).to.be.foo('bar');
		 *
		 * @param {Object} ctx object to which the method is added
		 * @param {String} name of method to add
		 * @param {Function} method function to be used for name
		 * @namespace Utils
		 * @name addMethod
		 * @api public
		 */

		addMethod = function addMethod(ctx, name, method) {
		  var methodWrapper = function () {
		    // Setting the `ssfi` flag to `methodWrapper` causes this function to be the
		    // starting point for removing implementation frames from the stack trace of
		    // a failed assertion.
		    //
		    // However, we only want to use this function as the starting point if the
		    // `lockSsfi` flag isn't set.
		    //
		    // If the `lockSsfi` flag is set, then either this assertion has been
		    // overwritten by another assertion, or this assertion is being invoked from
		    // inside of another assertion. In the first case, the `ssfi` flag has
		    // already been set by the overwriting assertion. In the second case, the
		    // `ssfi` flag has already been set by the outer assertion.
		    if (!flag(this, 'lockSsfi')) {
		      flag(this, 'ssfi', methodWrapper);
		    }

		    var result = method.apply(this, arguments);
		    if (result !== undefined)
		      return result;

		    var newAssertion = new chai.Assertion();
		    transferFlags$1(this, newAssertion);
		    return newAssertion;
		  };

		  addLengthGuard$1(methodWrapper, name, false);
		  ctx[name] = proxify$1(methodWrapper, name);
		};
		return addMethod;
	}

	/*!
	 * Chai - overwriteProperty utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	var overwriteProperty;
	var hasRequiredOverwriteProperty;

	function requireOverwriteProperty () {
		if (hasRequiredOverwriteProperty) return overwriteProperty;
		hasRequiredOverwriteProperty = 1;
		var chai = requireChai();
		var flag = flag$5;
		var isProxyEnabled = isProxyEnabled$1;
		var transferFlags$1 = transferFlags;

		/**
		 * ### .overwriteProperty(ctx, name, fn)
		 *
		 * Overwrites an already existing property getter and provides
		 * access to previous value. Must return function to use as getter.
		 *
		 *     utils.overwriteProperty(chai.Assertion.prototype, 'ok', function (_super) {
		 *       return function () {
		 *         var obj = utils.flag(this, 'object');
		 *         if (obj instanceof Foo) {
		 *           new chai.Assertion(obj.name).to.equal('bar');
		 *         } else {
		 *           _super.call(this);
		 *         }
		 *       }
		 *     });
		 *
		 *
		 * Can also be accessed directly from `chai.Assertion`.
		 *
		 *     chai.Assertion.overwriteProperty('foo', fn);
		 *
		 * Then can be used as any other assertion.
		 *
		 *     expect(myFoo).to.be.ok;
		 *
		 * @param {Object} ctx object whose property is to be overwritten
		 * @param {String} name of property to overwrite
		 * @param {Function} getter function that returns a getter function to be used for name
		 * @namespace Utils
		 * @name overwriteProperty
		 * @api public
		 */

		overwriteProperty = function overwriteProperty(ctx, name, getter) {
		  var _get = Object.getOwnPropertyDescriptor(ctx, name)
		    , _super = function () {};

		  if (_get && 'function' === typeof _get.get)
		    _super = _get.get;

		  Object.defineProperty(ctx, name,
		    { get: function overwritingPropertyGetter() {
		        // Setting the `ssfi` flag to `overwritingPropertyGetter` causes this
		        // function to be the starting point for removing implementation frames
		        // from the stack trace of a failed assertion.
		        //
		        // However, we only want to use this function as the starting point if
		        // the `lockSsfi` flag isn't set and proxy protection is disabled.
		        //
		        // If the `lockSsfi` flag is set, then either this assertion has been
		        // overwritten by another assertion, or this assertion is being invoked
		        // from inside of another assertion. In the first case, the `ssfi` flag
		        // has already been set by the overwriting assertion. In the second
		        // case, the `ssfi` flag has already been set by the outer assertion.
		        //
		        // If proxy protection is enabled, then the `ssfi` flag has already been
		        // set by the proxy getter.
		        if (!isProxyEnabled() && !flag(this, 'lockSsfi')) {
		          flag(this, 'ssfi', overwritingPropertyGetter);
		        }

		        // Setting the `lockSsfi` flag to `true` prevents the overwritten
		        // assertion from changing the `ssfi` flag. By this point, the `ssfi`
		        // flag is already set to the correct starting point for this assertion.
		        var origLockSsfi = flag(this, 'lockSsfi');
		        flag(this, 'lockSsfi', true);
		        var result = getter(_super).call(this);
		        flag(this, 'lockSsfi', origLockSsfi);

		        if (result !== undefined) {
		          return result;
		        }

		        var newAssertion = new chai.Assertion();
		        transferFlags$1(this, newAssertion);
		        return newAssertion;
		      }
		    , configurable: true
		  });
		};
		return overwriteProperty;
	}

	/*!
	 * Chai - overwriteMethod utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	var overwriteMethod;
	var hasRequiredOverwriteMethod;

	function requireOverwriteMethod () {
		if (hasRequiredOverwriteMethod) return overwriteMethod;
		hasRequiredOverwriteMethod = 1;
		var addLengthGuard$1 = addLengthGuard;
		var chai = requireChai();
		var flag = flag$5;
		var proxify$1 = proxify;
		var transferFlags$1 = transferFlags;

		/**
		 * ### .overwriteMethod(ctx, name, fn)
		 *
		 * Overwrites an already existing method and provides
		 * access to previous function. Must return function
		 * to be used for name.
		 *
		 *     utils.overwriteMethod(chai.Assertion.prototype, 'equal', function (_super) {
		 *       return function (str) {
		 *         var obj = utils.flag(this, 'object');
		 *         if (obj instanceof Foo) {
		 *           new chai.Assertion(obj.value).to.equal(str);
		 *         } else {
		 *           _super.apply(this, arguments);
		 *         }
		 *       }
		 *     });
		 *
		 * Can also be accessed directly from `chai.Assertion`.
		 *
		 *     chai.Assertion.overwriteMethod('foo', fn);
		 *
		 * Then can be used as any other assertion.
		 *
		 *     expect(myFoo).to.equal('bar');
		 *
		 * @param {Object} ctx object whose method is to be overwritten
		 * @param {String} name of method to overwrite
		 * @param {Function} method function that returns a function to be used for name
		 * @namespace Utils
		 * @name overwriteMethod
		 * @api public
		 */

		overwriteMethod = function overwriteMethod(ctx, name, method) {
		  var _method = ctx[name]
		    , _super = function () {
		      throw new Error(name + ' is not a function');
		    };

		  if (_method && 'function' === typeof _method)
		    _super = _method;

		  var overwritingMethodWrapper = function () {
		    // Setting the `ssfi` flag to `overwritingMethodWrapper` causes this
		    // function to be the starting point for removing implementation frames from
		    // the stack trace of a failed assertion.
		    //
		    // However, we only want to use this function as the starting point if the
		    // `lockSsfi` flag isn't set.
		    //
		    // If the `lockSsfi` flag is set, then either this assertion has been
		    // overwritten by another assertion, or this assertion is being invoked from
		    // inside of another assertion. In the first case, the `ssfi` flag has
		    // already been set by the overwriting assertion. In the second case, the
		    // `ssfi` flag has already been set by the outer assertion.
		    if (!flag(this, 'lockSsfi')) {
		      flag(this, 'ssfi', overwritingMethodWrapper);
		    }

		    // Setting the `lockSsfi` flag to `true` prevents the overwritten assertion
		    // from changing the `ssfi` flag. By this point, the `ssfi` flag is already
		    // set to the correct starting point for this assertion.
		    var origLockSsfi = flag(this, 'lockSsfi');
		    flag(this, 'lockSsfi', true);
		    var result = method(_super).apply(this, arguments);
		    flag(this, 'lockSsfi', origLockSsfi);

		    if (result !== undefined) {
		      return result;
		    }

		    var newAssertion = new chai.Assertion();
		    transferFlags$1(this, newAssertion);
		    return newAssertion;
		  };

		  addLengthGuard$1(overwritingMethodWrapper, name, false);
		  ctx[name] = proxify$1(overwritingMethodWrapper, name);
		};
		return overwriteMethod;
	}

	/*!
	 * Chai - addChainingMethod utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	var addChainableMethod;
	var hasRequiredAddChainableMethod;

	function requireAddChainableMethod () {
		if (hasRequiredAddChainableMethod) return addChainableMethod;
		hasRequiredAddChainableMethod = 1;
		/*!
		 * Module dependencies
		 */

		var addLengthGuard$1 = addLengthGuard;
		var chai = requireChai();
		var flag = flag$5;
		var proxify$1 = proxify;
		var transferFlags$1 = transferFlags;

		/*!
		 * Module variables
		 */

		// Check whether `Object.setPrototypeOf` is supported
		var canSetPrototype = typeof Object.setPrototypeOf === 'function';

		// Without `Object.setPrototypeOf` support, this module will need to add properties to a function.
		// However, some of functions' own props are not configurable and should be skipped.
		var testFn = function() {};
		var excludeNames = Object.getOwnPropertyNames(testFn).filter(function(name) {
		  var propDesc = Object.getOwnPropertyDescriptor(testFn, name);

		  // Note: PhantomJS 1.x includes `callee` as one of `testFn`'s own properties,
		  // but then returns `undefined` as the property descriptor for `callee`. As a
		  // workaround, we perform an otherwise unnecessary type-check for `propDesc`,
		  // and then filter it out if it's not an object as it should be.
		  if (typeof propDesc !== 'object')
		    return true;

		  return !propDesc.configurable;
		});

		// Cache `Function` properties
		var call  = Function.prototype.call,
		    apply = Function.prototype.apply;

		/**
		 * ### .addChainableMethod(ctx, name, method, chainingBehavior)
		 *
		 * Adds a method to an object, such that the method can also be chained.
		 *
		 *     utils.addChainableMethod(chai.Assertion.prototype, 'foo', function (str) {
		 *       var obj = utils.flag(this, 'object');
		 *       new chai.Assertion(obj).to.be.equal(str);
		 *     });
		 *
		 * Can also be accessed directly from `chai.Assertion`.
		 *
		 *     chai.Assertion.addChainableMethod('foo', fn, chainingBehavior);
		 *
		 * The result can then be used as both a method assertion, executing both `method` and
		 * `chainingBehavior`, or as a language chain, which only executes `chainingBehavior`.
		 *
		 *     expect(fooStr).to.be.foo('bar');
		 *     expect(fooStr).to.be.foo.equal('foo');
		 *
		 * @param {Object} ctx object to which the method is added
		 * @param {String} name of method to add
		 * @param {Function} method function to be used for `name`, when called
		 * @param {Function} chainingBehavior function to be called every time the property is accessed
		 * @namespace Utils
		 * @name addChainableMethod
		 * @api public
		 */

		addChainableMethod = function addChainableMethod(ctx, name, method, chainingBehavior) {
		  if (typeof chainingBehavior !== 'function') {
		    chainingBehavior = function () { };
		  }

		  var chainableBehavior = {
		      method: method
		    , chainingBehavior: chainingBehavior
		  };

		  // save the methods so we can overwrite them later, if we need to.
		  if (!ctx.__methods) {
		    ctx.__methods = {};
		  }
		  ctx.__methods[name] = chainableBehavior;

		  Object.defineProperty(ctx, name,
		    { get: function chainableMethodGetter() {
		        chainableBehavior.chainingBehavior.call(this);

		        var chainableMethodWrapper = function () {
		          // Setting the `ssfi` flag to `chainableMethodWrapper` causes this
		          // function to be the starting point for removing implementation
		          // frames from the stack trace of a failed assertion.
		          //
		          // However, we only want to use this function as the starting point if
		          // the `lockSsfi` flag isn't set.
		          //
		          // If the `lockSsfi` flag is set, then this assertion is being
		          // invoked from inside of another assertion. In this case, the `ssfi`
		          // flag has already been set by the outer assertion.
		          //
		          // Note that overwriting a chainable method merely replaces the saved
		          // methods in `ctx.__methods` instead of completely replacing the
		          // overwritten assertion. Therefore, an overwriting assertion won't
		          // set the `ssfi` or `lockSsfi` flags.
		          if (!flag(this, 'lockSsfi')) {
		            flag(this, 'ssfi', chainableMethodWrapper);
		          }

		          var result = chainableBehavior.method.apply(this, arguments);
		          if (result !== undefined) {
		            return result;
		          }

		          var newAssertion = new chai.Assertion();
		          transferFlags$1(this, newAssertion);
		          return newAssertion;
		        };

		        addLengthGuard$1(chainableMethodWrapper, name, true);

		        // Use `Object.setPrototypeOf` if available
		        if (canSetPrototype) {
		          // Inherit all properties from the object by replacing the `Function` prototype
		          var prototype = Object.create(this);
		          // Restore the `call` and `apply` methods from `Function`
		          prototype.call = call;
		          prototype.apply = apply;
		          Object.setPrototypeOf(chainableMethodWrapper, prototype);
		        }
		        // Otherwise, redefine all properties (slow!)
		        else {
		          var asserterNames = Object.getOwnPropertyNames(ctx);
		          asserterNames.forEach(function (asserterName) {
		            if (excludeNames.indexOf(asserterName) !== -1) {
		              return;
		            }

		            var pd = Object.getOwnPropertyDescriptor(ctx, asserterName);
		            Object.defineProperty(chainableMethodWrapper, asserterName, pd);
		          });
		        }

		        transferFlags$1(this, chainableMethodWrapper);
		        return proxify$1(chainableMethodWrapper);
		      }
		    , configurable: true
		  });
		};
		return addChainableMethod;
	}

	/*!
	 * Chai - overwriteChainableMethod utility
	 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	var overwriteChainableMethod;
	var hasRequiredOverwriteChainableMethod;

	function requireOverwriteChainableMethod () {
		if (hasRequiredOverwriteChainableMethod) return overwriteChainableMethod;
		hasRequiredOverwriteChainableMethod = 1;
		var chai = requireChai();
		var transferFlags$1 = transferFlags;

		/**
		 * ### .overwriteChainableMethod(ctx, name, method, chainingBehavior)
		 *
		 * Overwrites an already existing chainable method
		 * and provides access to the previous function or
		 * property.  Must return functions to be used for
		 * name.
		 *
		 *     utils.overwriteChainableMethod(chai.Assertion.prototype, 'lengthOf',
		 *       function (_super) {
		 *       }
		 *     , function (_super) {
		 *       }
		 *     );
		 *
		 * Can also be accessed directly from `chai.Assertion`.
		 *
		 *     chai.Assertion.overwriteChainableMethod('foo', fn, fn);
		 *
		 * Then can be used as any other assertion.
		 *
		 *     expect(myFoo).to.have.lengthOf(3);
		 *     expect(myFoo).to.have.lengthOf.above(3);
		 *
		 * @param {Object} ctx object whose method / property is to be overwritten
		 * @param {String} name of method / property to overwrite
		 * @param {Function} method function that returns a function to be used for name
		 * @param {Function} chainingBehavior function that returns a function to be used for property
		 * @namespace Utils
		 * @name overwriteChainableMethod
		 * @api public
		 */

		overwriteChainableMethod = function overwriteChainableMethod(ctx, name, method, chainingBehavior) {
		  var chainableBehavior = ctx.__methods[name];

		  var _chainingBehavior = chainableBehavior.chainingBehavior;
		  chainableBehavior.chainingBehavior = function overwritingChainableMethodGetter() {
		    var result = chainingBehavior(_chainingBehavior).call(this);
		    if (result !== undefined) {
		      return result;
		    }

		    var newAssertion = new chai.Assertion();
		    transferFlags$1(this, newAssertion);
		    return newAssertion;
		  };

		  var _method = chainableBehavior.method;
		  chainableBehavior.method = function overwritingChainableMethodWrapper() {
		    var result = method(_method).apply(this, arguments);
		    if (result !== undefined) {
		      return result;
		    }

		    var newAssertion = new chai.Assertion();
		    transferFlags$1(this, newAssertion);
		    return newAssertion;
		  };
		};
		return overwriteChainableMethod;
	}

	/*!
	 * Chai - compareByInspect utility
	 * Copyright(c) 2011-2016 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/*!
	 * Module dependencies
	 */

	var inspect = inspect_1;

	/**
	 * ### .compareByInspect(mixed, mixed)
	 *
	 * To be used as a compareFunction with Array.prototype.sort. Compares elements
	 * using inspect instead of default behavior of using toString so that Symbols
	 * and objects with irregular/missing toString can still be sorted without a
	 * TypeError.
	 *
	 * @param {Mixed} first element to compare
	 * @param {Mixed} second element to compare
	 * @returns {Number} -1 if 'a' should come before 'b'; otherwise 1
	 * @name compareByInspect
	 * @namespace Utils
	 * @api public
	 */

	var compareByInspect = function compareByInspect(a, b) {
	  return inspect(a) < inspect(b) ? -1 : 1;
	};

	var compareByInspect$1 = /*@__PURE__*/getDefaultExportFromCjs(compareByInspect);

	/*!
	 * Chai - getOwnEnumerablePropertySymbols utility
	 * Copyright(c) 2011-2016 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/**
	 * ### .getOwnEnumerablePropertySymbols(object)
	 *
	 * This allows the retrieval of directly-owned enumerable property symbols of an
	 * object. This function is necessary because Object.getOwnPropertySymbols
	 * returns both enumerable and non-enumerable property symbols.
	 *
	 * @param {Object} object
	 * @returns {Array}
	 * @namespace Utils
	 * @name getOwnEnumerablePropertySymbols
	 * @api public
	 */

	var getOwnEnumerablePropertySymbols$1 = function getOwnEnumerablePropertySymbols(obj) {
	  if (typeof Object.getOwnPropertySymbols !== 'function') return [];

	  return Object.getOwnPropertySymbols(obj).filter(function (sym) {
	    return Object.getOwnPropertyDescriptor(obj, sym).enumerable;
	  });
	};

	var getOwnEnumerablePropertySymbols$2 = /*@__PURE__*/getDefaultExportFromCjs(getOwnEnumerablePropertySymbols$1);

	/*!
	 * Chai - getOwnEnumerableProperties utility
	 * Copyright(c) 2011-2016 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	/*!
	 * Module dependencies
	 */

	var getOwnEnumerablePropertySymbols = getOwnEnumerablePropertySymbols$1;

	/**
	 * ### .getOwnEnumerableProperties(object)
	 *
	 * This allows the retrieval of directly-owned enumerable property names and
	 * symbols of an object. This function is necessary because Object.keys only
	 * returns enumerable property names, not enumerable property symbols.
	 *
	 * @param {Object} object
	 * @returns {Array}
	 * @namespace Utils
	 * @name getOwnEnumerableProperties
	 * @api public
	 */

	var getOwnEnumerableProperties = function getOwnEnumerableProperties(obj) {
	  return Object.keys(obj).concat(getOwnEnumerablePropertySymbols(obj));
	};

	var getOwnEnumerableProperties$1 = /*@__PURE__*/getDefaultExportFromCjs(getOwnEnumerableProperties);

	'use strict';

	/* !
	 * Chai - checkError utility
	 * Copyright(c) 2012-2016 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	var getFunctionName = getFuncName_1;
	/**
	 * ### .checkError
	 *
	 * Checks that an error conforms to a given set of criteria and/or retrieves information about it.
	 *
	 * @api public
	 */

	/**
	 * ### .compatibleInstance(thrown, errorLike)
	 *
	 * Checks if two instances are compatible (strict equal).
	 * Returns false if errorLike is not an instance of Error, because instances
	 * can only be compatible if they're both error instances.
	 *
	 * @name compatibleInstance
	 * @param {Error} thrown error
	 * @param {Error|ErrorConstructor} errorLike object to compare against
	 * @namespace Utils
	 * @api public
	 */

	function compatibleInstance(thrown, errorLike) {
	  return errorLike instanceof Error && thrown === errorLike;
	}

	/**
	 * ### .compatibleConstructor(thrown, errorLike)
	 *
	 * Checks if two constructors are compatible.
	 * This function can receive either an error constructor or
	 * an error instance as the `errorLike` argument.
	 * Constructors are compatible if they're the same or if one is
	 * an instance of another.
	 *
	 * @name compatibleConstructor
	 * @param {Error} thrown error
	 * @param {Error|ErrorConstructor} errorLike object to compare against
	 * @namespace Utils
	 * @api public
	 */

	function compatibleConstructor(thrown, errorLike) {
	  if (errorLike instanceof Error) {
	    // If `errorLike` is an instance of any error we compare their constructors
	    return thrown.constructor === errorLike.constructor || thrown instanceof errorLike.constructor;
	  } else if (errorLike.prototype instanceof Error || errorLike === Error) {
	    // If `errorLike` is a constructor that inherits from Error, we compare `thrown` to `errorLike` directly
	    return thrown.constructor === errorLike || thrown instanceof errorLike;
	  }

	  return false;
	}

	/**
	 * ### .compatibleMessage(thrown, errMatcher)
	 *
	 * Checks if an error's message is compatible with a matcher (String or RegExp).
	 * If the message contains the String or passes the RegExp test,
	 * it is considered compatible.
	 *
	 * @name compatibleMessage
	 * @param {Error} thrown error
	 * @param {String|RegExp} errMatcher to look for into the message
	 * @namespace Utils
	 * @api public
	 */

	function compatibleMessage(thrown, errMatcher) {
	  var comparisonString = typeof thrown === 'string' ? thrown : thrown.message;
	  if (errMatcher instanceof RegExp) {
	    return errMatcher.test(comparisonString);
	  } else if (typeof errMatcher === 'string') {
	    return comparisonString.indexOf(errMatcher) !== -1; // eslint-disable-line no-magic-numbers
	  }

	  return false;
	}

	/**
	 * ### .getConstructorName(errorLike)
	 *
	 * Gets the constructor name for an Error instance or constructor itself.
	 *
	 * @name getConstructorName
	 * @param {Error|ErrorConstructor} errorLike
	 * @namespace Utils
	 * @api public
	 */

	function getConstructorName(errorLike) {
	  var constructorName = errorLike;
	  if (errorLike instanceof Error) {
	    constructorName = getFunctionName(errorLike.constructor);
	  } else if (typeof errorLike === 'function') {
	    // If `err` is not an instance of Error it is an error constructor itself or another function.
	    // If we've got a common function we get its name, otherwise we may need to create a new instance
	    // of the error just in case it's a poorly-constructed error. Please see chaijs/chai/issues/45 to know more.
	    constructorName = getFunctionName(errorLike);
	    if (constructorName === '') {
	      var newConstructorName = getFunctionName(new errorLike()); // eslint-disable-line new-cap
	      constructorName = newConstructorName || constructorName;
	    }
	  }

	  return constructorName;
	}

	/**
	 * ### .getMessage(errorLike)
	 *
	 * Gets the error message from an error.
	 * If `err` is a String itself, we return it.
	 * If the error has no message, we return an empty string.
	 *
	 * @name getMessage
	 * @param {Error|String} errorLike
	 * @namespace Utils
	 * @api public
	 */

	function getMessage(errorLike) {
	  var msg = '';
	  if (errorLike && errorLike.message) {
	    msg = errorLike.message;
	  } else if (typeof errorLike === 'string') {
	    msg = errorLike;
	  }

	  return msg;
	}

	var checkError = {
	  compatibleInstance: compatibleInstance,
	  compatibleConstructor: compatibleConstructor,
	  compatibleMessage: compatibleMessage,
	  getMessage: getMessage,
	  getConstructorName: getConstructorName,
	};

	var index = /*@__PURE__*/getDefaultExportFromCjs(checkError);

	/*!
	 * Chai - isNaN utility
	 * Copyright(c) 2012-2015 Sakthipriyan Vairamani <thechargingvolcano@gmail.com>
	 * MIT Licensed
	 */

	/**
	 * ### .isNaN(value)
	 *
	 * Checks if the given value is NaN or not.
	 *
	 *     utils.isNaN(NaN); // true
	 *
	 * @param {Value} The value which has to be checked if it is NaN
	 * @name isNaN
	 * @api private
	 */

	function isNaN(value) {
	  // Refer http://www.ecma-international.org/ecma-262/6.0/#sec-isnan-number
	  // section's NOTE.
	  return value !== value;
	}

	// If ECMAScript 6's Number.isNaN is present, prefer that.
	var _isNaN = Number.isNaN || isNaN;

	var isNaN$1 = /*@__PURE__*/getDefaultExportFromCjs(_isNaN);

	var type = typeDetectExports;

	var flag = flag$5;

	function isObjectType(obj) {
	  var objectType = type(obj);
	  var objectTypes = ['Array', 'Object', 'function'];

	  return objectTypes.indexOf(objectType) !== -1;
	}

	/**
	 * ### .getOperator(message)
	 *
	 * Extract the operator from error message.
	 * Operator defined is based on below link
	 * https://nodejs.org/api/assert.html#assert_assert.
	 *
	 * Returns the `operator` or `undefined` value for an Assertion.
	 *
	 * @param {Object} object (constructed Assertion)
	 * @param {Arguments} chai.Assertion.prototype.assert arguments
	 * @namespace Utils
	 * @name getOperator
	 * @api public
	 */

	var getOperator = function getOperator(obj, args) {
	  var operator = flag(obj, 'operator');
	  var negate = flag(obj, 'negate');
	  var expected = args[3];
	  var msg = negate ? args[2] : args[1];

	  if (operator) {
	    return operator;
	  }

	  if (typeof msg === 'function') msg = msg();

	  msg = msg || '';
	  if (!msg) {
	    return undefined;
	  }

	  if (/\shave\s/.test(msg)) {
	    return undefined;
	  }

	  var isObject = isObjectType(expected);
	  if (/\snot\s/.test(msg)) {
	    return isObject ? 'notDeepStrictEqual' : 'notStrictEqual';
	  }

	  return isObject ? 'deepStrictEqual' : 'strictEqual';
	};

	var getOperator$1 = /*@__PURE__*/getDefaultExportFromCjs(getOperator);

	/*!
	 * chai
	 * Copyright(c) 2011 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	var hasRequiredUtils;

	function requireUtils () {
		if (hasRequiredUtils) return utils;
		hasRequiredUtils = 1;
		/*!
		 * Dependencies that are used for multiple exports are required here only once
		 */

		var pathval$1 = pathval;

		/*!
		 * test utility
		 */

		utils.test = test;

		/*!
		 * type utility
		 */

		utils.type = typeDetectExports;

		/*!
		 * expectTypes utility
		 */
		utils.expectTypes = expectTypes;

		/*!
		 * message utility
		 */

		utils.getMessage = getMessage$1;

		/*!
		 * actual utility
		 */

		utils.getActual = getActual$1;

		/*!
		 * Inspect util
		 */

		utils.inspect = inspect_1;

		/*!
		 * Object Display util
		 */

		utils.objDisplay = objDisplay$1;

		/*!
		 * Flag utility
		 */

		utils.flag = flag$5;

		/*!
		 * Flag transferring utility
		 */

		utils.transferFlags = transferFlags;

		/*!
		 * Deep equal utility
		 */

		utils.eql = deepEqlExports;

		/*!
		 * Deep path info
		 */

		utils.getPathInfo = pathval$1.getPathInfo;

		/*!
		 * Check if a property exists
		 */

		utils.hasProperty = pathval$1.hasProperty;

		/*!
		 * Function name
		 */

		utils.getName = getFuncName_1;

		/*!
		 * add Property
		 */

		utils.addProperty = requireAddProperty();

		/*!
		 * add Method
		 */

		utils.addMethod = requireAddMethod();

		/*!
		 * overwrite Property
		 */

		utils.overwriteProperty = requireOverwriteProperty();

		/*!
		 * overwrite Method
		 */

		utils.overwriteMethod = requireOverwriteMethod();

		/*!
		 * Add a chainable method
		 */

		utils.addChainableMethod = requireAddChainableMethod();

		/*!
		 * Overwrite chainable method
		 */

		utils.overwriteChainableMethod = requireOverwriteChainableMethod();

		/*!
		 * Compare by inspect method
		 */

		utils.compareByInspect = compareByInspect;

		/*!
		 * Get own enumerable property symbols method
		 */

		utils.getOwnEnumerablePropertySymbols = getOwnEnumerablePropertySymbols$1;

		/*!
		 * Get own enumerable properties method
		 */

		utils.getOwnEnumerableProperties = getOwnEnumerableProperties;

		/*!
		 * Checks error against a given set of criteria
		 */

		utils.checkError = checkError;

		/*!
		 * Proxify util
		 */

		utils.proxify = proxify;

		/*!
		 * addLengthGuard util
		 */

		utils.addLengthGuard = addLengthGuard;

		/*!
		 * isProxyEnabled helper
		 */

		utils.isProxyEnabled = isProxyEnabled$1;

		/*!
		 * isNaN method
		 */

		utils.isNaN = _isNaN;

		/*!
		 * getOperator method
		 */

		utils.getOperator = getOperator;
		return utils;
	}

	/*!
	 * chai
	 * http://chaijs.com
	 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	var config$1 = config$6;

	var assertion = function (_chai, util) {
	  /*!
	   * Module dependencies.
	   */

	  var AssertionError = _chai.AssertionError
	    , flag = util.flag;

	  /*!
	   * Module export.
	   */

	  _chai.Assertion = Assertion;

	  /*!
	   * Assertion Constructor
	   *
	   * Creates object for chaining.
	   *
	   * `Assertion` objects contain metadata in the form of flags. Three flags can
	   * be assigned during instantiation by passing arguments to this constructor:
	   *
	   * - `object`: This flag contains the target of the assertion. For example, in
	   *   the assertion `expect(numKittens).to.equal(7);`, the `object` flag will
	   *   contain `numKittens` so that the `equal` assertion can reference it when
	   *   needed.
	   *
	   * - `message`: This flag contains an optional custom error message to be
	   *   prepended to the error message that's generated by the assertion when it
	   *   fails.
	   *
	   * - `ssfi`: This flag stands for "start stack function indicator". It
	   *   contains a function reference that serves as the starting point for
	   *   removing frames from the stack trace of the error that's created by the
	   *   assertion when it fails. The goal is to provide a cleaner stack trace to
	   *   end users by removing Chai's internal functions. Note that it only works
	   *   in environments that support `Error.captureStackTrace`, and only when
	   *   `Chai.config.includeStack` hasn't been set to `false`.
	   *
	   * - `lockSsfi`: This flag controls whether or not the given `ssfi` flag
	   *   should retain its current value, even as assertions are chained off of
	   *   this object. This is usually set to `true` when creating a new assertion
	   *   from within another assertion. It's also temporarily set to `true` before
	   *   an overwritten assertion gets called by the overwriting assertion.
	   *
	   * @param {Mixed} obj target of the assertion
	   * @param {String} msg (optional) custom error message
	   * @param {Function} ssfi (optional) starting point for removing stack frames
	   * @param {Boolean} lockSsfi (optional) whether or not the ssfi flag is locked
	   * @api private
	   */

	  function Assertion (obj, msg, ssfi, lockSsfi) {
	    flag(this, 'ssfi', ssfi || Assertion);
	    flag(this, 'lockSsfi', lockSsfi);
	    flag(this, 'object', obj);
	    flag(this, 'message', msg);

	    return util.proxify(this);
	  }

	  Object.defineProperty(Assertion, 'includeStack', {
	    get: function() {
	      console.warn('Assertion.includeStack is deprecated, use chai.config.includeStack instead.');
	      return config$1.includeStack;
	    },
	    set: function(value) {
	      console.warn('Assertion.includeStack is deprecated, use chai.config.includeStack instead.');
	      config$1.includeStack = value;
	    }
	  });

	  Object.defineProperty(Assertion, 'showDiff', {
	    get: function() {
	      console.warn('Assertion.showDiff is deprecated, use chai.config.showDiff instead.');
	      return config$1.showDiff;
	    },
	    set: function(value) {
	      console.warn('Assertion.showDiff is deprecated, use chai.config.showDiff instead.');
	      config$1.showDiff = value;
	    }
	  });

	  Assertion.addProperty = function (name, fn) {
	    util.addProperty(this.prototype, name, fn);
	  };

	  Assertion.addMethod = function (name, fn) {
	    util.addMethod(this.prototype, name, fn);
	  };

	  Assertion.addChainableMethod = function (name, fn, chainingBehavior) {
	    util.addChainableMethod(this.prototype, name, fn, chainingBehavior);
	  };

	  Assertion.overwriteProperty = function (name, fn) {
	    util.overwriteProperty(this.prototype, name, fn);
	  };

	  Assertion.overwriteMethod = function (name, fn) {
	    util.overwriteMethod(this.prototype, name, fn);
	  };

	  Assertion.overwriteChainableMethod = function (name, fn, chainingBehavior) {
	    util.overwriteChainableMethod(this.prototype, name, fn, chainingBehavior);
	  };

	  /**
	   * ### .assert(expression, message, negateMessage, expected, actual, showDiff)
	   *
	   * Executes an expression and check expectations. Throws AssertionError for reporting if test doesn't pass.
	   *
	   * @name assert
	   * @param {Philosophical} expression to be tested
	   * @param {String|Function} message or function that returns message to display if expression fails
	   * @param {String|Function} negatedMessage or function that returns negatedMessage to display if negated expression fails
	   * @param {Mixed} expected value (remember to check for negation)
	   * @param {Mixed} actual (optional) will default to `this.obj`
	   * @param {Boolean} showDiff (optional) when set to `true`, assert will display a diff in addition to the message if expression fails
	   * @api private
	   */

	  Assertion.prototype.assert = function (expr, msg, negateMsg, expected, _actual, showDiff) {
	    var ok = util.test(this, arguments);
	    if (false !== showDiff) showDiff = true;
	    if (undefined === expected && undefined === _actual) showDiff = false;
	    if (true !== config$1.showDiff) showDiff = false;

	    if (!ok) {
	      msg = util.getMessage(this, arguments);
	      var actual = util.getActual(this, arguments);
	      var assertionErrorObjectProperties = {
	          actual: actual
	        , expected: expected
	        , showDiff: showDiff
	      };

	      var operator = util.getOperator(this, arguments);
	      if (operator) {
	        assertionErrorObjectProperties.operator = operator;
	      }

	      throw new AssertionError(
	        msg,
	        assertionErrorObjectProperties,
	        (config$1.includeStack) ? this.assert : flag(this, 'ssfi'));
	    }
	  };

	  /*!
	   * ### ._obj
	   *
	   * Quick reference to stored `actual` value for plugin developers.
	   *
	   * @api private
	   */

	  Object.defineProperty(Assertion.prototype, '_obj',
	    { get: function () {
	        return flag(this, 'object');
	      }
	    , set: function (val) {
	        flag(this, 'object', val);
	      }
	  });
	};

	var assertion$1 = /*@__PURE__*/getDefaultExportFromCjs(assertion);

	/*!
	 * chai
	 * http://chaijs.com
	 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	var assertions = function (chai, _) {
	  var Assertion = chai.Assertion
	    , AssertionError = chai.AssertionError
	    , flag = _.flag;

	  /**
	   * ### Language Chains
	   *
	   * The following are provided as chainable getters to improve the readability
	   * of your assertions.
	   *
	   * **Chains**
	   *
	   * - to
	   * - be
	   * - been
	   * - is
	   * - that
	   * - which
	   * - and
	   * - has
	   * - have
	   * - with
	   * - at
	   * - of
	   * - same
	   * - but
	   * - does
	   * - still
	   * - also
	   *
	   * @name language chains
	   * @namespace BDD
	   * @api public
	   */

	  [ 'to', 'be', 'been', 'is'
	  , 'and', 'has', 'have', 'with'
	  , 'that', 'which', 'at', 'of'
	  , 'same', 'but', 'does', 'still', "also" ].forEach(function (chain) {
	    Assertion.addProperty(chain);
	  });

	  /**
	   * ### .not
	   *
	   * Negates all assertions that follow in the chain.
	   *
	   *     expect(function () {}).to.not.throw();
	   *     expect({a: 1}).to.not.have.property('b');
	   *     expect([1, 2]).to.be.an('array').that.does.not.include(3);
	   *
	   * Just because you can negate any assertion with `.not` doesn't mean you
	   * should. With great power comes great responsibility. It's often best to
	   * assert that the one expected output was produced, rather than asserting
	   * that one of countless unexpected outputs wasn't produced. See individual
	   * assertions for specific guidance.
	   *
	   *     expect(2).to.equal(2); // Recommended
	   *     expect(2).to.not.equal(1); // Not recommended
	   *
	   * @name not
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('not', function () {
	    flag(this, 'negate', true);
	  });

	  /**
	   * ### .deep
	   *
	   * Causes all `.equal`, `.include`, `.members`, `.keys`, and `.property`
	   * assertions that follow in the chain to use deep equality instead of strict
	   * (`===`) equality. See the `deep-eql` project page for info on the deep
	   * equality algorithm: https://github.com/chaijs/deep-eql.
	   *
	   *     // Target object deeply (but not strictly) equals `{a: 1}`
	   *     expect({a: 1}).to.deep.equal({a: 1});
	   *     expect({a: 1}).to.not.equal({a: 1});
	   *
	   *     // Target array deeply (but not strictly) includes `{a: 1}`
	   *     expect([{a: 1}]).to.deep.include({a: 1});
	   *     expect([{a: 1}]).to.not.include({a: 1});
	   *
	   *     // Target object deeply (but not strictly) includes `x: {a: 1}`
	   *     expect({x: {a: 1}}).to.deep.include({x: {a: 1}});
	   *     expect({x: {a: 1}}).to.not.include({x: {a: 1}});
	   *
	   *     // Target array deeply (but not strictly) has member `{a: 1}`
	   *     expect([{a: 1}]).to.have.deep.members([{a: 1}]);
	   *     expect([{a: 1}]).to.not.have.members([{a: 1}]);
	   *
	   *     // Target set deeply (but not strictly) has key `{a: 1}`
	   *     expect(new Set([{a: 1}])).to.have.deep.keys([{a: 1}]);
	   *     expect(new Set([{a: 1}])).to.not.have.keys([{a: 1}]);
	   *
	   *     // Target object deeply (but not strictly) has property `x: {a: 1}`
	   *     expect({x: {a: 1}}).to.have.deep.property('x', {a: 1});
	   *     expect({x: {a: 1}}).to.not.have.property('x', {a: 1});
	   *
	   * @name deep
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('deep', function () {
	    flag(this, 'deep', true);
	  });

	  /**
	   * ### .nested
	   *
	   * Enables dot- and bracket-notation in all `.property` and `.include`
	   * assertions that follow in the chain.
	   *
	   *     expect({a: {b: ['x', 'y']}}).to.have.nested.property('a.b[1]');
	   *     expect({a: {b: ['x', 'y']}}).to.nested.include({'a.b[1]': 'y'});
	   *
	   * If `.` or `[]` are part of an actual property name, they can be escaped by
	   * adding two backslashes before them.
	   *
	   *     expect({'.a': {'[b]': 'x'}}).to.have.nested.property('\\.a.\\[b\\]');
	   *     expect({'.a': {'[b]': 'x'}}).to.nested.include({'\\.a.\\[b\\]': 'x'});
	   *
	   * `.nested` cannot be combined with `.own`.
	   *
	   * @name nested
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('nested', function () {
	    flag(this, 'nested', true);
	  });

	  /**
	   * ### .own
	   *
	   * Causes all `.property` and `.include` assertions that follow in the chain
	   * to ignore inherited properties.
	   *
	   *     Object.prototype.b = 2;
	   *
	   *     expect({a: 1}).to.have.own.property('a');
	   *     expect({a: 1}).to.have.property('b');
	   *     expect({a: 1}).to.not.have.own.property('b');
	   *
	   *     expect({a: 1}).to.own.include({a: 1});
	   *     expect({a: 1}).to.include({b: 2}).but.not.own.include({b: 2});
	   *
	   * `.own` cannot be combined with `.nested`.
	   *
	   * @name own
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('own', function () {
	    flag(this, 'own', true);
	  });

	  /**
	   * ### .ordered
	   *
	   * Causes all `.members` assertions that follow in the chain to require that
	   * members be in the same order.
	   *
	   *     expect([1, 2]).to.have.ordered.members([1, 2])
	   *       .but.not.have.ordered.members([2, 1]);
	   *
	   * When `.include` and `.ordered` are combined, the ordering begins at the
	   * start of both arrays.
	   *
	   *     expect([1, 2, 3]).to.include.ordered.members([1, 2])
	   *       .but.not.include.ordered.members([2, 3]);
	   *
	   * @name ordered
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('ordered', function () {
	    flag(this, 'ordered', true);
	  });

	  /**
	   * ### .any
	   *
	   * Causes all `.keys` assertions that follow in the chain to only require that
	   * the target have at least one of the given keys. This is the opposite of
	   * `.all`, which requires that the target have all of the given keys.
	   *
	   *     expect({a: 1, b: 2}).to.not.have.any.keys('c', 'd');
	   *
	   * See the `.keys` doc for guidance on when to use `.any` or `.all`.
	   *
	   * @name any
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('any', function () {
	    flag(this, 'any', true);
	    flag(this, 'all', false);
	  });

	  /**
	   * ### .all
	   *
	   * Causes all `.keys` assertions that follow in the chain to require that the
	   * target have all of the given keys. This is the opposite of `.any`, which
	   * only requires that the target have at least one of the given keys.
	   *
	   *     expect({a: 1, b: 2}).to.have.all.keys('a', 'b');
	   *
	   * Note that `.all` is used by default when neither `.all` nor `.any` are
	   * added earlier in the chain. However, it's often best to add `.all` anyway
	   * because it improves readability.
	   *
	   * See the `.keys` doc for guidance on when to use `.any` or `.all`.
	   *
	   * @name all
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('all', function () {
	    flag(this, 'all', true);
	    flag(this, 'any', false);
	  });

	  /**
	   * ### .a(type[, msg])
	   *
	   * Asserts that the target's type is equal to the given string `type`. Types
	   * are case insensitive. See the `type-detect` project page for info on the
	   * type detection algorithm: https://github.com/chaijs/type-detect.
	   *
	   *     expect('foo').to.be.a('string');
	   *     expect({a: 1}).to.be.an('object');
	   *     expect(null).to.be.a('null');
	   *     expect(undefined).to.be.an('undefined');
	   *     expect(new Error).to.be.an('error');
	   *     expect(Promise.resolve()).to.be.a('promise');
	   *     expect(new Float32Array).to.be.a('float32array');
	   *     expect(Symbol()).to.be.a('symbol');
	   *
	   * `.a` supports objects that have a custom type set via `Symbol.toStringTag`.
	   *
	   *     var myObj = {
	   *       [Symbol.toStringTag]: 'myCustomType'
	   *     };
	   *
	   *     expect(myObj).to.be.a('myCustomType').but.not.an('object');
	   *
	   * It's often best to use `.a` to check a target's type before making more
	   * assertions on the same target. That way, you avoid unexpected behavior from
	   * any assertion that does different things based on the target's type.
	   *
	   *     expect([1, 2, 3]).to.be.an('array').that.includes(2);
	   *     expect([]).to.be.an('array').that.is.empty;
	   *
	   * Add `.not` earlier in the chain to negate `.a`. However, it's often best to
	   * assert that the target is the expected type, rather than asserting that it
	   * isn't one of many unexpected types.
	   *
	   *     expect('foo').to.be.a('string'); // Recommended
	   *     expect('foo').to.not.be.an('array'); // Not recommended
	   *
	   * `.a` accepts an optional `msg` argument which is a custom error message to
	   * show when the assertion fails. The message can also be given as the second
	   * argument to `expect`.
	   *
	   *     expect(1).to.be.a('string', 'nooo why fail??');
	   *     expect(1, 'nooo why fail??').to.be.a('string');
	   *
	   * `.a` can also be used as a language chain to improve the readability of
	   * your assertions.
	   *
	   *     expect({b: 2}).to.have.a.property('b');
	   *
	   * The alias `.an` can be used interchangeably with `.a`.
	   *
	   * @name a
	   * @alias an
	   * @param {String} type
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function an (type, msg) {
	    if (msg) flag(this, 'message', msg);
	    type = type.toLowerCase();
	    var obj = flag(this, 'object')
	      , article = ~[ 'a', 'e', 'i', 'o', 'u' ].indexOf(type.charAt(0)) ? 'an ' : 'a ';

	    this.assert(
	        type === _.type(obj).toLowerCase()
	      , 'expected #{this} to be ' + article + type
	      , 'expected #{this} not to be ' + article + type
	    );
	  }

	  Assertion.addChainableMethod('an', an);
	  Assertion.addChainableMethod('a', an);

	  /**
	   * ### .include(val[, msg])
	   *
	   * When the target is a string, `.include` asserts that the given string `val`
	   * is a substring of the target.
	   *
	   *     expect('foobar').to.include('foo');
	   *
	   * When the target is an array, `.include` asserts that the given `val` is a
	   * member of the target.
	   *
	   *     expect([1, 2, 3]).to.include(2);
	   *
	   * When the target is an object, `.include` asserts that the given object
	   * `val`'s properties are a subset of the target's properties.
	   *
	   *     expect({a: 1, b: 2, c: 3}).to.include({a: 1, b: 2});
	   *
	   * When the target is a Set or WeakSet, `.include` asserts that the given `val` is a
	   * member of the target. SameValueZero equality algorithm is used.
	   *
	   *     expect(new Set([1, 2])).to.include(2);
	   *
	   * When the target is a Map, `.include` asserts that the given `val` is one of
	   * the values of the target. SameValueZero equality algorithm is used.
	   *
	   *     expect(new Map([['a', 1], ['b', 2]])).to.include(2);
	   *
	   * Because `.include` does different things based on the target's type, it's
	   * important to check the target's type before using `.include`. See the `.a`
	   * doc for info on testing a target's type.
	   *
	   *     expect([1, 2, 3]).to.be.an('array').that.includes(2);
	   *
	   * By default, strict (`===`) equality is used to compare array members and
	   * object properties. Add `.deep` earlier in the chain to use deep equality
	   * instead (WeakSet targets are not supported). See the `deep-eql` project
	   * page for info on the deep equality algorithm: https://github.com/chaijs/deep-eql.
	   *
	   *     // Target array deeply (but not strictly) includes `{a: 1}`
	   *     expect([{a: 1}]).to.deep.include({a: 1});
	   *     expect([{a: 1}]).to.not.include({a: 1});
	   *
	   *     // Target object deeply (but not strictly) includes `x: {a: 1}`
	   *     expect({x: {a: 1}}).to.deep.include({x: {a: 1}});
	   *     expect({x: {a: 1}}).to.not.include({x: {a: 1}});
	   *
	   * By default, all of the target's properties are searched when working with
	   * objects. This includes properties that are inherited and/or non-enumerable.
	   * Add `.own` earlier in the chain to exclude the target's inherited
	   * properties from the search.
	   *
	   *     Object.prototype.b = 2;
	   *
	   *     expect({a: 1}).to.own.include({a: 1});
	   *     expect({a: 1}).to.include({b: 2}).but.not.own.include({b: 2});
	   *
	   * Note that a target object is always only searched for `val`'s own
	   * enumerable properties.
	   *
	   * `.deep` and `.own` can be combined.
	   *
	   *     expect({a: {b: 2}}).to.deep.own.include({a: {b: 2}});
	   *
	   * Add `.nested` earlier in the chain to enable dot- and bracket-notation when
	   * referencing nested properties.
	   *
	   *     expect({a: {b: ['x', 'y']}}).to.nested.include({'a.b[1]': 'y'});
	   *
	   * If `.` or `[]` are part of an actual property name, they can be escaped by
	   * adding two backslashes before them.
	   *
	   *     expect({'.a': {'[b]': 2}}).to.nested.include({'\\.a.\\[b\\]': 2});
	   *
	   * `.deep` and `.nested` can be combined.
	   *
	   *     expect({a: {b: [{c: 3}]}}).to.deep.nested.include({'a.b[0]': {c: 3}});
	   *
	   * `.own` and `.nested` cannot be combined.
	   *
	   * Add `.not` earlier in the chain to negate `.include`.
	   *
	   *     expect('foobar').to.not.include('taco');
	   *     expect([1, 2, 3]).to.not.include(4);
	   *
	   * However, it's dangerous to negate `.include` when the target is an object.
	   * The problem is that it creates uncertain expectations by asserting that the
	   * target object doesn't have all of `val`'s key/value pairs but may or may
	   * not have some of them. It's often best to identify the exact output that's
	   * expected, and then write an assertion that only accepts that exact output.
	   *
	   * When the target object isn't even expected to have `val`'s keys, it's
	   * often best to assert exactly that.
	   *
	   *     expect({c: 3}).to.not.have.any.keys('a', 'b'); // Recommended
	   *     expect({c: 3}).to.not.include({a: 1, b: 2}); // Not recommended
	   *
	   * When the target object is expected to have `val`'s keys, it's often best to
	   * assert that each of the properties has its expected value, rather than
	   * asserting that each property doesn't have one of many unexpected values.
	   *
	   *     expect({a: 3, b: 4}).to.include({a: 3, b: 4}); // Recommended
	   *     expect({a: 3, b: 4}).to.not.include({a: 1, b: 2}); // Not recommended
	   *
	   * `.include` accepts an optional `msg` argument which is a custom error
	   * message to show when the assertion fails. The message can also be given as
	   * the second argument to `expect`.
	   *
	   *     expect([1, 2, 3]).to.include(4, 'nooo why fail??');
	   *     expect([1, 2, 3], 'nooo why fail??').to.include(4);
	   *
	   * `.include` can also be used as a language chain, causing all `.members` and
	   * `.keys` assertions that follow in the chain to require the target to be a
	   * superset of the expected set, rather than an identical set. Note that
	   * `.members` ignores duplicates in the subset when `.include` is added.
	   *
	   *     // Target object's keys are a superset of ['a', 'b'] but not identical
	   *     expect({a: 1, b: 2, c: 3}).to.include.all.keys('a', 'b');
	   *     expect({a: 1, b: 2, c: 3}).to.not.have.all.keys('a', 'b');
	   *
	   *     // Target array is a superset of [1, 2] but not identical
	   *     expect([1, 2, 3]).to.include.members([1, 2]);
	   *     expect([1, 2, 3]).to.not.have.members([1, 2]);
	   *
	   *     // Duplicates in the subset are ignored
	   *     expect([1, 2, 3]).to.include.members([1, 2, 2, 2]);
	   *
	   * Note that adding `.any` earlier in the chain causes the `.keys` assertion
	   * to ignore `.include`.
	   *
	   *     // Both assertions are identical
	   *     expect({a: 1}).to.include.any.keys('a', 'b');
	   *     expect({a: 1}).to.have.any.keys('a', 'b');
	   *
	   * The aliases `.includes`, `.contain`, and `.contains` can be used
	   * interchangeably with `.include`.
	   *
	   * @name include
	   * @alias contain
	   * @alias includes
	   * @alias contains
	   * @param {Mixed} val
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function SameValueZero(a, b) {
	    return (_.isNaN(a) && _.isNaN(b)) || a === b;
	  }

	  function includeChainingBehavior () {
	    flag(this, 'contains', true);
	  }

	  function include (val, msg) {
	    if (msg) flag(this, 'message', msg);

	    var obj = flag(this, 'object')
	      , objType = _.type(obj).toLowerCase()
	      , flagMsg = flag(this, 'message')
	      , negate = flag(this, 'negate')
	      , ssfi = flag(this, 'ssfi')
	      , isDeep = flag(this, 'deep')
	      , descriptor = isDeep ? 'deep ' : '';

	    flagMsg = flagMsg ? flagMsg + ': ' : '';

	    var included = false;

	    switch (objType) {
	      case 'string':
	        included = obj.indexOf(val) !== -1;
	        break;

	      case 'weakset':
	        if (isDeep) {
	          throw new AssertionError(
	            flagMsg + 'unable to use .deep.include with WeakSet',
	            undefined,
	            ssfi
	          );
	        }

	        included = obj.has(val);
	        break;

	      case 'map':
	        var isEql = isDeep ? _.eql : SameValueZero;
	        obj.forEach(function (item) {
	          included = included || isEql(item, val);
	        });
	        break;

	      case 'set':
	        if (isDeep) {
	          obj.forEach(function (item) {
	            included = included || _.eql(item, val);
	          });
	        } else {
	          included = obj.has(val);
	        }
	        break;

	      case 'array':
	        if (isDeep) {
	          included = obj.some(function (item) {
	            return _.eql(item, val);
	          });
	        } else {
	          included = obj.indexOf(val) !== -1;
	        }
	        break;

	      default:
	        // This block is for asserting a subset of properties in an object.
	        // `_.expectTypes` isn't used here because `.include` should work with
	        // objects with a custom `@@toStringTag`.
	        if (val !== Object(val)) {
	          throw new AssertionError(
	            flagMsg + 'the given combination of arguments ('
	            + objType + ' and '
	            + _.type(val).toLowerCase() + ')'
	            + ' is invalid for this assertion. '
	            + 'You can use an array, a map, an object, a set, a string, '
	            + 'or a weakset instead of a '
	            + _.type(val).toLowerCase(),
	            undefined,
	            ssfi
	          );
	        }

	        var props = Object.keys(val)
	          , firstErr = null
	          , numErrs = 0;

	        props.forEach(function (prop) {
	          var propAssertion = new Assertion(obj);
	          _.transferFlags(this, propAssertion, true);
	          flag(propAssertion, 'lockSsfi', true);

	          if (!negate || props.length === 1) {
	            propAssertion.property(prop, val[prop]);
	            return;
	          }

	          try {
	            propAssertion.property(prop, val[prop]);
	          } catch (err) {
	            if (!_.checkError.compatibleConstructor(err, AssertionError)) {
	              throw err;
	            }
	            if (firstErr === null) firstErr = err;
	            numErrs++;
	          }
	        }, this);

	        // When validating .not.include with multiple properties, we only want
	        // to throw an assertion error if all of the properties are included,
	        // in which case we throw the first property assertion error that we
	        // encountered.
	        if (negate && props.length > 1 && numErrs === props.length) {
	          throw firstErr;
	        }
	        return;
	    }

	    // Assert inclusion in collection or substring in a string.
	    this.assert(
	      included
	      , 'expected #{this} to ' + descriptor + 'include ' + _.inspect(val)
	      , 'expected #{this} to not ' + descriptor + 'include ' + _.inspect(val));
	  }

	  Assertion.addChainableMethod('include', include, includeChainingBehavior);
	  Assertion.addChainableMethod('contain', include, includeChainingBehavior);
	  Assertion.addChainableMethod('contains', include, includeChainingBehavior);
	  Assertion.addChainableMethod('includes', include, includeChainingBehavior);

	  /**
	   * ### .ok
	   *
	   * Asserts that the target is a truthy value (considered `true` in boolean context).
	   * However, it's often best to assert that the target is strictly (`===`) or
	   * deeply equal to its expected value.
	   *
	   *     expect(1).to.equal(1); // Recommended
	   *     expect(1).to.be.ok; // Not recommended
	   *
	   *     expect(true).to.be.true; // Recommended
	   *     expect(true).to.be.ok; // Not recommended
	   *
	   * Add `.not` earlier in the chain to negate `.ok`.
	   *
	   *     expect(0).to.equal(0); // Recommended
	   *     expect(0).to.not.be.ok; // Not recommended
	   *
	   *     expect(false).to.be.false; // Recommended
	   *     expect(false).to.not.be.ok; // Not recommended
	   *
	   *     expect(null).to.be.null; // Recommended
	   *     expect(null).to.not.be.ok; // Not recommended
	   *
	   *     expect(undefined).to.be.undefined; // Recommended
	   *     expect(undefined).to.not.be.ok; // Not recommended
	   *
	   * A custom error message can be given as the second argument to `expect`.
	   *
	   *     expect(false, 'nooo why fail??').to.be.ok;
	   *
	   * @name ok
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('ok', function () {
	    this.assert(
	        flag(this, 'object')
	      , 'expected #{this} to be truthy'
	      , 'expected #{this} to be falsy');
	  });

	  /**
	   * ### .true
	   *
	   * Asserts that the target is strictly (`===`) equal to `true`.
	   *
	   *     expect(true).to.be.true;
	   *
	   * Add `.not` earlier in the chain to negate `.true`. However, it's often best
	   * to assert that the target is equal to its expected value, rather than not
	   * equal to `true`.
	   *
	   *     expect(false).to.be.false; // Recommended
	   *     expect(false).to.not.be.true; // Not recommended
	   *
	   *     expect(1).to.equal(1); // Recommended
	   *     expect(1).to.not.be.true; // Not recommended
	   *
	   * A custom error message can be given as the second argument to `expect`.
	   *
	   *     expect(false, 'nooo why fail??').to.be.true;
	   *
	   * @name true
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('true', function () {
	    this.assert(
	        true === flag(this, 'object')
	      , 'expected #{this} to be true'
	      , 'expected #{this} to be false'
	      , flag(this, 'negate') ? false : true
	    );
	  });

	  /**
	   * ### .false
	   *
	   * Asserts that the target is strictly (`===`) equal to `false`.
	   *
	   *     expect(false).to.be.false;
	   *
	   * Add `.not` earlier in the chain to negate `.false`. However, it's often
	   * best to assert that the target is equal to its expected value, rather than
	   * not equal to `false`.
	   *
	   *     expect(true).to.be.true; // Recommended
	   *     expect(true).to.not.be.false; // Not recommended
	   *
	   *     expect(1).to.equal(1); // Recommended
	   *     expect(1).to.not.be.false; // Not recommended
	   *
	   * A custom error message can be given as the second argument to `expect`.
	   *
	   *     expect(true, 'nooo why fail??').to.be.false;
	   *
	   * @name false
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('false', function () {
	    this.assert(
	        false === flag(this, 'object')
	      , 'expected #{this} to be false'
	      , 'expected #{this} to be true'
	      , flag(this, 'negate') ? true : false
	    );
	  });

	  /**
	   * ### .null
	   *
	   * Asserts that the target is strictly (`===`) equal to `null`.
	   *
	   *     expect(null).to.be.null;
	   *
	   * Add `.not` earlier in the chain to negate `.null`. However, it's often best
	   * to assert that the target is equal to its expected value, rather than not
	   * equal to `null`.
	   *
	   *     expect(1).to.equal(1); // Recommended
	   *     expect(1).to.not.be.null; // Not recommended
	   *
	   * A custom error message can be given as the second argument to `expect`.
	   *
	   *     expect(42, 'nooo why fail??').to.be.null;
	   *
	   * @name null
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('null', function () {
	    this.assert(
	        null === flag(this, 'object')
	      , 'expected #{this} to be null'
	      , 'expected #{this} not to be null'
	    );
	  });

	  /**
	   * ### .undefined
	   *
	   * Asserts that the target is strictly (`===`) equal to `undefined`.
	   *
	   *     expect(undefined).to.be.undefined;
	   *
	   * Add `.not` earlier in the chain to negate `.undefined`. However, it's often
	   * best to assert that the target is equal to its expected value, rather than
	   * not equal to `undefined`.
	   *
	   *     expect(1).to.equal(1); // Recommended
	   *     expect(1).to.not.be.undefined; // Not recommended
	   *
	   * A custom error message can be given as the second argument to `expect`.
	   *
	   *     expect(42, 'nooo why fail??').to.be.undefined;
	   *
	   * @name undefined
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('undefined', function () {
	    this.assert(
	        undefined === flag(this, 'object')
	      , 'expected #{this} to be undefined'
	      , 'expected #{this} not to be undefined'
	    );
	  });

	  /**
	   * ### .NaN
	   *
	   * Asserts that the target is exactly `NaN`.
	   *
	   *     expect(NaN).to.be.NaN;
	   *
	   * Add `.not` earlier in the chain to negate `.NaN`. However, it's often best
	   * to assert that the target is equal to its expected value, rather than not
	   * equal to `NaN`.
	   *
	   *     expect('foo').to.equal('foo'); // Recommended
	   *     expect('foo').to.not.be.NaN; // Not recommended
	   *
	   * A custom error message can be given as the second argument to `expect`.
	   *
	   *     expect(42, 'nooo why fail??').to.be.NaN;
	   *
	   * @name NaN
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('NaN', function () {
	    this.assert(
	        _.isNaN(flag(this, 'object'))
	        , 'expected #{this} to be NaN'
	        , 'expected #{this} not to be NaN'
	    );
	  });

	  /**
	   * ### .exist
	   *
	   * Asserts that the target is not strictly (`===`) equal to either `null` or
	   * `undefined`. However, it's often best to assert that the target is equal to
	   * its expected value.
	   *
	   *     expect(1).to.equal(1); // Recommended
	   *     expect(1).to.exist; // Not recommended
	   *
	   *     expect(0).to.equal(0); // Recommended
	   *     expect(0).to.exist; // Not recommended
	   *
	   * Add `.not` earlier in the chain to negate `.exist`.
	   *
	   *     expect(null).to.be.null; // Recommended
	   *     expect(null).to.not.exist; // Not recommended
	   *
	   *     expect(undefined).to.be.undefined; // Recommended
	   *     expect(undefined).to.not.exist; // Not recommended
	   *
	   * A custom error message can be given as the second argument to `expect`.
	   *
	   *     expect(null, 'nooo why fail??').to.exist;
	   *
	   * The alias `.exists` can be used interchangeably with `.exist`.
	   *
	   * @name exist
	   * @alias exists
	   * @namespace BDD
	   * @api public
	   */

	  function assertExist () {
	    var val = flag(this, 'object');
	    this.assert(
	        val !== null && val !== undefined
	      , 'expected #{this} to exist'
	      , 'expected #{this} to not exist'
	    );
	  }

	  Assertion.addProperty('exist', assertExist);
	  Assertion.addProperty('exists', assertExist);

	  /**
	   * ### .empty
	   *
	   * When the target is a string or array, `.empty` asserts that the target's
	   * `length` property is strictly (`===`) equal to `0`.
	   *
	   *     expect([]).to.be.empty;
	   *     expect('').to.be.empty;
	   *
	   * When the target is a map or set, `.empty` asserts that the target's `size`
	   * property is strictly equal to `0`.
	   *
	   *     expect(new Set()).to.be.empty;
	   *     expect(new Map()).to.be.empty;
	   *
	   * When the target is a non-function object, `.empty` asserts that the target
	   * doesn't have any own enumerable properties. Properties with Symbol-based
	   * keys are excluded from the count.
	   *
	   *     expect({}).to.be.empty;
	   *
	   * Because `.empty` does different things based on the target's type, it's
	   * important to check the target's type before using `.empty`. See the `.a`
	   * doc for info on testing a target's type.
	   *
	   *     expect([]).to.be.an('array').that.is.empty;
	   *
	   * Add `.not` earlier in the chain to negate `.empty`. However, it's often
	   * best to assert that the target contains its expected number of values,
	   * rather than asserting that it's not empty.
	   *
	   *     expect([1, 2, 3]).to.have.lengthOf(3); // Recommended
	   *     expect([1, 2, 3]).to.not.be.empty; // Not recommended
	   *
	   *     expect(new Set([1, 2, 3])).to.have.property('size', 3); // Recommended
	   *     expect(new Set([1, 2, 3])).to.not.be.empty; // Not recommended
	   *
	   *     expect(Object.keys({a: 1})).to.have.lengthOf(1); // Recommended
	   *     expect({a: 1}).to.not.be.empty; // Not recommended
	   *
	   * A custom error message can be given as the second argument to `expect`.
	   *
	   *     expect([1, 2, 3], 'nooo why fail??').to.be.empty;
	   *
	   * @name empty
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('empty', function () {
	    var val = flag(this, 'object')
	      , ssfi = flag(this, 'ssfi')
	      , flagMsg = flag(this, 'message')
	      , itemsCount;

	    flagMsg = flagMsg ? flagMsg + ': ' : '';

	    switch (_.type(val).toLowerCase()) {
	      case 'array':
	      case 'string':
	        itemsCount = val.length;
	        break;
	      case 'map':
	      case 'set':
	        itemsCount = val.size;
	        break;
	      case 'weakmap':
	      case 'weakset':
	        throw new AssertionError(
	          flagMsg + '.empty was passed a weak collection',
	          undefined,
	          ssfi
	        );
	      case 'function':
	        var msg = flagMsg + '.empty was passed a function ' + _.getName(val);
	        throw new AssertionError(msg.trim(), undefined, ssfi);
	      default:
	        if (val !== Object(val)) {
	          throw new AssertionError(
	            flagMsg + '.empty was passed non-string primitive ' + _.inspect(val),
	            undefined,
	            ssfi
	          );
	        }
	        itemsCount = Object.keys(val).length;
	    }

	    this.assert(
	        0 === itemsCount
	      , 'expected #{this} to be empty'
	      , 'expected #{this} not to be empty'
	    );
	  });

	  /**
	   * ### .arguments
	   *
	   * Asserts that the target is an `arguments` object.
	   *
	   *     function test () {
	   *       expect(arguments).to.be.arguments;
	   *     }
	   *
	   *     test();
	   *
	   * Add `.not` earlier in the chain to negate `.arguments`. However, it's often
	   * best to assert which type the target is expected to be, rather than
	   * asserting that it’s not an `arguments` object.
	   *
	   *     expect('foo').to.be.a('string'); // Recommended
	   *     expect('foo').to.not.be.arguments; // Not recommended
	   *
	   * A custom error message can be given as the second argument to `expect`.
	   *
	   *     expect({}, 'nooo why fail??').to.be.arguments;
	   *
	   * The alias `.Arguments` can be used interchangeably with `.arguments`.
	   *
	   * @name arguments
	   * @alias Arguments
	   * @namespace BDD
	   * @api public
	   */

	  function checkArguments () {
	    var obj = flag(this, 'object')
	      , type = _.type(obj);
	    this.assert(
	        'Arguments' === type
	      , 'expected #{this} to be arguments but got ' + type
	      , 'expected #{this} to not be arguments'
	    );
	  }

	  Assertion.addProperty('arguments', checkArguments);
	  Assertion.addProperty('Arguments', checkArguments);

	  /**
	   * ### .equal(val[, msg])
	   *
	   * Asserts that the target is strictly (`===`) equal to the given `val`.
	   *
	   *     expect(1).to.equal(1);
	   *     expect('foo').to.equal('foo');
	   *
	   * Add `.deep` earlier in the chain to use deep equality instead. See the
	   * `deep-eql` project page for info on the deep equality algorithm:
	   * https://github.com/chaijs/deep-eql.
	   *
	   *     // Target object deeply (but not strictly) equals `{a: 1}`
	   *     expect({a: 1}).to.deep.equal({a: 1});
	   *     expect({a: 1}).to.not.equal({a: 1});
	   *
	   *     // Target array deeply (but not strictly) equals `[1, 2]`
	   *     expect([1, 2]).to.deep.equal([1, 2]);
	   *     expect([1, 2]).to.not.equal([1, 2]);
	   *
	   * Add `.not` earlier in the chain to negate `.equal`. However, it's often
	   * best to assert that the target is equal to its expected value, rather than
	   * not equal to one of countless unexpected values.
	   *
	   *     expect(1).to.equal(1); // Recommended
	   *     expect(1).to.not.equal(2); // Not recommended
	   *
	   * `.equal` accepts an optional `msg` argument which is a custom error message
	   * to show when the assertion fails. The message can also be given as the
	   * second argument to `expect`.
	   *
	   *     expect(1).to.equal(2, 'nooo why fail??');
	   *     expect(1, 'nooo why fail??').to.equal(2);
	   *
	   * The aliases `.equals` and `eq` can be used interchangeably with `.equal`.
	   *
	   * @name equal
	   * @alias equals
	   * @alias eq
	   * @param {Mixed} val
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function assertEqual (val, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object');
	    if (flag(this, 'deep')) {
	      var prevLockSsfi = flag(this, 'lockSsfi');
	      flag(this, 'lockSsfi', true);
	      this.eql(val);
	      flag(this, 'lockSsfi', prevLockSsfi);
	    } else {
	      this.assert(
	          val === obj
	        , 'expected #{this} to equal #{exp}'
	        , 'expected #{this} to not equal #{exp}'
	        , val
	        , this._obj
	        , true
	      );
	    }
	  }

	  Assertion.addMethod('equal', assertEqual);
	  Assertion.addMethod('equals', assertEqual);
	  Assertion.addMethod('eq', assertEqual);

	  /**
	   * ### .eql(obj[, msg])
	   *
	   * Asserts that the target is deeply equal to the given `obj`. See the
	   * `deep-eql` project page for info on the deep equality algorithm:
	   * https://github.com/chaijs/deep-eql.
	   *
	   *     // Target object is deeply (but not strictly) equal to {a: 1}
	   *     expect({a: 1}).to.eql({a: 1}).but.not.equal({a: 1});
	   *
	   *     // Target array is deeply (but not strictly) equal to [1, 2]
	   *     expect([1, 2]).to.eql([1, 2]).but.not.equal([1, 2]);
	   *
	   * Add `.not` earlier in the chain to negate `.eql`. However, it's often best
	   * to assert that the target is deeply equal to its expected value, rather
	   * than not deeply equal to one of countless unexpected values.
	   *
	   *     expect({a: 1}).to.eql({a: 1}); // Recommended
	   *     expect({a: 1}).to.not.eql({b: 2}); // Not recommended
	   *
	   * `.eql` accepts an optional `msg` argument which is a custom error message
	   * to show when the assertion fails. The message can also be given as the
	   * second argument to `expect`.
	   *
	   *     expect({a: 1}).to.eql({b: 2}, 'nooo why fail??');
	   *     expect({a: 1}, 'nooo why fail??').to.eql({b: 2});
	   *
	   * The alias `.eqls` can be used interchangeably with `.eql`.
	   *
	   * The `.deep.equal` assertion is almost identical to `.eql` but with one
	   * difference: `.deep.equal` causes deep equality comparisons to also be used
	   * for any other assertions that follow in the chain.
	   *
	   * @name eql
	   * @alias eqls
	   * @param {Mixed} obj
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function assertEql(obj, msg) {
	    if (msg) flag(this, 'message', msg);
	    this.assert(
	        _.eql(obj, flag(this, 'object'))
	      , 'expected #{this} to deeply equal #{exp}'
	      , 'expected #{this} to not deeply equal #{exp}'
	      , obj
	      , this._obj
	      , true
	    );
	  }

	  Assertion.addMethod('eql', assertEql);
	  Assertion.addMethod('eqls', assertEql);

	  /**
	   * ### .above(n[, msg])
	   *
	   * Asserts that the target is a number or a date greater than the given number or date `n` respectively.
	   * However, it's often best to assert that the target is equal to its expected
	   * value.
	   *
	   *     expect(2).to.equal(2); // Recommended
	   *     expect(2).to.be.above(1); // Not recommended
	   *
	   * Add `.lengthOf` earlier in the chain to assert that the target's `length`
	   * or `size` is greater than the given number `n`.
	   *
	   *     expect('foo').to.have.lengthOf(3); // Recommended
	   *     expect('foo').to.have.lengthOf.above(2); // Not recommended
	   *
	   *     expect([1, 2, 3]).to.have.lengthOf(3); // Recommended
	   *     expect([1, 2, 3]).to.have.lengthOf.above(2); // Not recommended
	   *
	   * Add `.not` earlier in the chain to negate `.above`.
	   *
	   *     expect(2).to.equal(2); // Recommended
	   *     expect(1).to.not.be.above(2); // Not recommended
	   *
	   * `.above` accepts an optional `msg` argument which is a custom error message
	   * to show when the assertion fails. The message can also be given as the
	   * second argument to `expect`.
	   *
	   *     expect(1).to.be.above(2, 'nooo why fail??');
	   *     expect(1, 'nooo why fail??').to.be.above(2);
	   *
	   * The aliases `.gt` and `.greaterThan` can be used interchangeably with
	   * `.above`.
	   *
	   * @name above
	   * @alias gt
	   * @alias greaterThan
	   * @param {Number} n
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function assertAbove (n, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object')
	      , doLength = flag(this, 'doLength')
	      , flagMsg = flag(this, 'message')
	      , msgPrefix = ((flagMsg) ? flagMsg + ': ' : '')
	      , ssfi = flag(this, 'ssfi')
	      , objType = _.type(obj).toLowerCase()
	      , nType = _.type(n).toLowerCase()
	      , errorMessage
	      , shouldThrow = true;

	    if (doLength && objType !== 'map' && objType !== 'set') {
	      new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
	    }

	    if (!doLength && (objType === 'date' && nType !== 'date')) {
	      errorMessage = msgPrefix + 'the argument to above must be a date';
	    } else if (nType !== 'number' && (doLength || objType === 'number')) {
	      errorMessage = msgPrefix + 'the argument to above must be a number';
	    } else if (!doLength && (objType !== 'date' && objType !== 'number')) {
	      var printObj = (objType === 'string') ? "'" + obj + "'" : obj;
	      errorMessage = msgPrefix + 'expected ' + printObj + ' to be a number or a date';
	    } else {
	      shouldThrow = false;
	    }

	    if (shouldThrow) {
	      throw new AssertionError(errorMessage, undefined, ssfi);
	    }

	    if (doLength) {
	      var descriptor = 'length'
	        , itemsCount;
	      if (objType === 'map' || objType === 'set') {
	        descriptor = 'size';
	        itemsCount = obj.size;
	      } else {
	        itemsCount = obj.length;
	      }
	      this.assert(
	          itemsCount > n
	        , 'expected #{this} to have a ' + descriptor + ' above #{exp} but got #{act}'
	        , 'expected #{this} to not have a ' + descriptor + ' above #{exp}'
	        , n
	        , itemsCount
	      );
	    } else {
	      this.assert(
	          obj > n
	        , 'expected #{this} to be above #{exp}'
	        , 'expected #{this} to be at most #{exp}'
	        , n
	      );
	    }
	  }

	  Assertion.addMethod('above', assertAbove);
	  Assertion.addMethod('gt', assertAbove);
	  Assertion.addMethod('greaterThan', assertAbove);

	  /**
	   * ### .least(n[, msg])
	   *
	   * Asserts that the target is a number or a date greater than or equal to the given
	   * number or date `n` respectively. However, it's often best to assert that the target is equal to
	   * its expected value.
	   *
	   *     expect(2).to.equal(2); // Recommended
	   *     expect(2).to.be.at.least(1); // Not recommended
	   *     expect(2).to.be.at.least(2); // Not recommended
	   *
	   * Add `.lengthOf` earlier in the chain to assert that the target's `length`
	   * or `size` is greater than or equal to the given number `n`.
	   *
	   *     expect('foo').to.have.lengthOf(3); // Recommended
	   *     expect('foo').to.have.lengthOf.at.least(2); // Not recommended
	   *
	   *     expect([1, 2, 3]).to.have.lengthOf(3); // Recommended
	   *     expect([1, 2, 3]).to.have.lengthOf.at.least(2); // Not recommended
	   *
	   * Add `.not` earlier in the chain to negate `.least`.
	   *
	   *     expect(1).to.equal(1); // Recommended
	   *     expect(1).to.not.be.at.least(2); // Not recommended
	   *
	   * `.least` accepts an optional `msg` argument which is a custom error message
	   * to show when the assertion fails. The message can also be given as the
	   * second argument to `expect`.
	   *
	   *     expect(1).to.be.at.least(2, 'nooo why fail??');
	   *     expect(1, 'nooo why fail??').to.be.at.least(2);
	   *
	   * The aliases `.gte` and `.greaterThanOrEqual` can be used interchangeably with
	   * `.least`.
	   *
	   * @name least
	   * @alias gte
	   * @alias greaterThanOrEqual
	   * @param {Number} n
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function assertLeast (n, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object')
	      , doLength = flag(this, 'doLength')
	      , flagMsg = flag(this, 'message')
	      , msgPrefix = ((flagMsg) ? flagMsg + ': ' : '')
	      , ssfi = flag(this, 'ssfi')
	      , objType = _.type(obj).toLowerCase()
	      , nType = _.type(n).toLowerCase()
	      , errorMessage
	      , shouldThrow = true;

	    if (doLength && objType !== 'map' && objType !== 'set') {
	      new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
	    }

	    if (!doLength && (objType === 'date' && nType !== 'date')) {
	      errorMessage = msgPrefix + 'the argument to least must be a date';
	    } else if (nType !== 'number' && (doLength || objType === 'number')) {
	      errorMessage = msgPrefix + 'the argument to least must be a number';
	    } else if (!doLength && (objType !== 'date' && objType !== 'number')) {
	      var printObj = (objType === 'string') ? "'" + obj + "'" : obj;
	      errorMessage = msgPrefix + 'expected ' + printObj + ' to be a number or a date';
	    } else {
	      shouldThrow = false;
	    }

	    if (shouldThrow) {
	      throw new AssertionError(errorMessage, undefined, ssfi);
	    }

	    if (doLength) {
	      var descriptor = 'length'
	        , itemsCount;
	      if (objType === 'map' || objType === 'set') {
	        descriptor = 'size';
	        itemsCount = obj.size;
	      } else {
	        itemsCount = obj.length;
	      }
	      this.assert(
	          itemsCount >= n
	        , 'expected #{this} to have a ' + descriptor + ' at least #{exp} but got #{act}'
	        , 'expected #{this} to have a ' + descriptor + ' below #{exp}'
	        , n
	        , itemsCount
	      );
	    } else {
	      this.assert(
	          obj >= n
	        , 'expected #{this} to be at least #{exp}'
	        , 'expected #{this} to be below #{exp}'
	        , n
	      );
	    }
	  }

	  Assertion.addMethod('least', assertLeast);
	  Assertion.addMethod('gte', assertLeast);
	  Assertion.addMethod('greaterThanOrEqual', assertLeast);

	  /**
	   * ### .below(n[, msg])
	   *
	   * Asserts that the target is a number or a date less than the given number or date `n` respectively.
	   * However, it's often best to assert that the target is equal to its expected
	   * value.
	   *
	   *     expect(1).to.equal(1); // Recommended
	   *     expect(1).to.be.below(2); // Not recommended
	   *
	   * Add `.lengthOf` earlier in the chain to assert that the target's `length`
	   * or `size` is less than the given number `n`.
	   *
	   *     expect('foo').to.have.lengthOf(3); // Recommended
	   *     expect('foo').to.have.lengthOf.below(4); // Not recommended
	   *
	   *     expect([1, 2, 3]).to.have.length(3); // Recommended
	   *     expect([1, 2, 3]).to.have.lengthOf.below(4); // Not recommended
	   *
	   * Add `.not` earlier in the chain to negate `.below`.
	   *
	   *     expect(2).to.equal(2); // Recommended
	   *     expect(2).to.not.be.below(1); // Not recommended
	   *
	   * `.below` accepts an optional `msg` argument which is a custom error message
	   * to show when the assertion fails. The message can also be given as the
	   * second argument to `expect`.
	   *
	   *     expect(2).to.be.below(1, 'nooo why fail??');
	   *     expect(2, 'nooo why fail??').to.be.below(1);
	   *
	   * The aliases `.lt` and `.lessThan` can be used interchangeably with
	   * `.below`.
	   *
	   * @name below
	   * @alias lt
	   * @alias lessThan
	   * @param {Number} n
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function assertBelow (n, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object')
	      , doLength = flag(this, 'doLength')
	      , flagMsg = flag(this, 'message')
	      , msgPrefix = ((flagMsg) ? flagMsg + ': ' : '')
	      , ssfi = flag(this, 'ssfi')
	      , objType = _.type(obj).toLowerCase()
	      , nType = _.type(n).toLowerCase()
	      , errorMessage
	      , shouldThrow = true;

	    if (doLength && objType !== 'map' && objType !== 'set') {
	      new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
	    }

	    if (!doLength && (objType === 'date' && nType !== 'date')) {
	      errorMessage = msgPrefix + 'the argument to below must be a date';
	    } else if (nType !== 'number' && (doLength || objType === 'number')) {
	      errorMessage = msgPrefix + 'the argument to below must be a number';
	    } else if (!doLength && (objType !== 'date' && objType !== 'number')) {
	      var printObj = (objType === 'string') ? "'" + obj + "'" : obj;
	      errorMessage = msgPrefix + 'expected ' + printObj + ' to be a number or a date';
	    } else {
	      shouldThrow = false;
	    }

	    if (shouldThrow) {
	      throw new AssertionError(errorMessage, undefined, ssfi);
	    }

	    if (doLength) {
	      var descriptor = 'length'
	        , itemsCount;
	      if (objType === 'map' || objType === 'set') {
	        descriptor = 'size';
	        itemsCount = obj.size;
	      } else {
	        itemsCount = obj.length;
	      }
	      this.assert(
	          itemsCount < n
	        , 'expected #{this} to have a ' + descriptor + ' below #{exp} but got #{act}'
	        , 'expected #{this} to not have a ' + descriptor + ' below #{exp}'
	        , n
	        , itemsCount
	      );
	    } else {
	      this.assert(
	          obj < n
	        , 'expected #{this} to be below #{exp}'
	        , 'expected #{this} to be at least #{exp}'
	        , n
	      );
	    }
	  }

	  Assertion.addMethod('below', assertBelow);
	  Assertion.addMethod('lt', assertBelow);
	  Assertion.addMethod('lessThan', assertBelow);

	  /**
	   * ### .most(n[, msg])
	   *
	   * Asserts that the target is a number or a date less than or equal to the given number
	   * or date `n` respectively. However, it's often best to assert that the target is equal to its
	   * expected value.
	   *
	   *     expect(1).to.equal(1); // Recommended
	   *     expect(1).to.be.at.most(2); // Not recommended
	   *     expect(1).to.be.at.most(1); // Not recommended
	   *
	   * Add `.lengthOf` earlier in the chain to assert that the target's `length`
	   * or `size` is less than or equal to the given number `n`.
	   *
	   *     expect('foo').to.have.lengthOf(3); // Recommended
	   *     expect('foo').to.have.lengthOf.at.most(4); // Not recommended
	   *
	   *     expect([1, 2, 3]).to.have.lengthOf(3); // Recommended
	   *     expect([1, 2, 3]).to.have.lengthOf.at.most(4); // Not recommended
	   *
	   * Add `.not` earlier in the chain to negate `.most`.
	   *
	   *     expect(2).to.equal(2); // Recommended
	   *     expect(2).to.not.be.at.most(1); // Not recommended
	   *
	   * `.most` accepts an optional `msg` argument which is a custom error message
	   * to show when the assertion fails. The message can also be given as the
	   * second argument to `expect`.
	   *
	   *     expect(2).to.be.at.most(1, 'nooo why fail??');
	   *     expect(2, 'nooo why fail??').to.be.at.most(1);
	   *
	   * The aliases `.lte` and `.lessThanOrEqual` can be used interchangeably with
	   * `.most`.
	   *
	   * @name most
	   * @alias lte
	   * @alias lessThanOrEqual
	   * @param {Number} n
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function assertMost (n, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object')
	      , doLength = flag(this, 'doLength')
	      , flagMsg = flag(this, 'message')
	      , msgPrefix = ((flagMsg) ? flagMsg + ': ' : '')
	      , ssfi = flag(this, 'ssfi')
	      , objType = _.type(obj).toLowerCase()
	      , nType = _.type(n).toLowerCase()
	      , errorMessage
	      , shouldThrow = true;

	    if (doLength && objType !== 'map' && objType !== 'set') {
	      new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
	    }

	    if (!doLength && (objType === 'date' && nType !== 'date')) {
	      errorMessage = msgPrefix + 'the argument to most must be a date';
	    } else if (nType !== 'number' && (doLength || objType === 'number')) {
	      errorMessage = msgPrefix + 'the argument to most must be a number';
	    } else if (!doLength && (objType !== 'date' && objType !== 'number')) {
	      var printObj = (objType === 'string') ? "'" + obj + "'" : obj;
	      errorMessage = msgPrefix + 'expected ' + printObj + ' to be a number or a date';
	    } else {
	      shouldThrow = false;
	    }

	    if (shouldThrow) {
	      throw new AssertionError(errorMessage, undefined, ssfi);
	    }

	    if (doLength) {
	      var descriptor = 'length'
	        , itemsCount;
	      if (objType === 'map' || objType === 'set') {
	        descriptor = 'size';
	        itemsCount = obj.size;
	      } else {
	        itemsCount = obj.length;
	      }
	      this.assert(
	          itemsCount <= n
	        , 'expected #{this} to have a ' + descriptor + ' at most #{exp} but got #{act}'
	        , 'expected #{this} to have a ' + descriptor + ' above #{exp}'
	        , n
	        , itemsCount
	      );
	    } else {
	      this.assert(
	          obj <= n
	        , 'expected #{this} to be at most #{exp}'
	        , 'expected #{this} to be above #{exp}'
	        , n
	      );
	    }
	  }

	  Assertion.addMethod('most', assertMost);
	  Assertion.addMethod('lte', assertMost);
	  Assertion.addMethod('lessThanOrEqual', assertMost);

	  /**
	   * ### .within(start, finish[, msg])
	   *
	   * Asserts that the target is a number or a date greater than or equal to the given
	   * number or date `start`, and less than or equal to the given number or date `finish` respectively.
	   * However, it's often best to assert that the target is equal to its expected
	   * value.
	   *
	   *     expect(2).to.equal(2); // Recommended
	   *     expect(2).to.be.within(1, 3); // Not recommended
	   *     expect(2).to.be.within(2, 3); // Not recommended
	   *     expect(2).to.be.within(1, 2); // Not recommended
	   *
	   * Add `.lengthOf` earlier in the chain to assert that the target's `length`
	   * or `size` is greater than or equal to the given number `start`, and less
	   * than or equal to the given number `finish`.
	   *
	   *     expect('foo').to.have.lengthOf(3); // Recommended
	   *     expect('foo').to.have.lengthOf.within(2, 4); // Not recommended
	   *
	   *     expect([1, 2, 3]).to.have.lengthOf(3); // Recommended
	   *     expect([1, 2, 3]).to.have.lengthOf.within(2, 4); // Not recommended
	   *
	   * Add `.not` earlier in the chain to negate `.within`.
	   *
	   *     expect(1).to.equal(1); // Recommended
	   *     expect(1).to.not.be.within(2, 4); // Not recommended
	   *
	   * `.within` accepts an optional `msg` argument which is a custom error
	   * message to show when the assertion fails. The message can also be given as
	   * the second argument to `expect`.
	   *
	   *     expect(4).to.be.within(1, 3, 'nooo why fail??');
	   *     expect(4, 'nooo why fail??').to.be.within(1, 3);
	   *
	   * @name within
	   * @param {Number} start lower bound inclusive
	   * @param {Number} finish upper bound inclusive
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addMethod('within', function (start, finish, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object')
	      , doLength = flag(this, 'doLength')
	      , flagMsg = flag(this, 'message')
	      , msgPrefix = ((flagMsg) ? flagMsg + ': ' : '')
	      , ssfi = flag(this, 'ssfi')
	      , objType = _.type(obj).toLowerCase()
	      , startType = _.type(start).toLowerCase()
	      , finishType = _.type(finish).toLowerCase()
	      , errorMessage
	      , shouldThrow = true
	      , range = (startType === 'date' && finishType === 'date')
	          ? start.toISOString() + '..' + finish.toISOString()
	          : start + '..' + finish;

	    if (doLength && objType !== 'map' && objType !== 'set') {
	      new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
	    }

	    if (!doLength && (objType === 'date' && (startType !== 'date' || finishType !== 'date'))) {
	      errorMessage = msgPrefix + 'the arguments to within must be dates';
	    } else if ((startType !== 'number' || finishType !== 'number') && (doLength || objType === 'number')) {
	      errorMessage = msgPrefix + 'the arguments to within must be numbers';
	    } else if (!doLength && (objType !== 'date' && objType !== 'number')) {
	      var printObj = (objType === 'string') ? "'" + obj + "'" : obj;
	      errorMessage = msgPrefix + 'expected ' + printObj + ' to be a number or a date';
	    } else {
	      shouldThrow = false;
	    }

	    if (shouldThrow) {
	      throw new AssertionError(errorMessage, undefined, ssfi);
	    }

	    if (doLength) {
	      var descriptor = 'length'
	        , itemsCount;
	      if (objType === 'map' || objType === 'set') {
	        descriptor = 'size';
	        itemsCount = obj.size;
	      } else {
	        itemsCount = obj.length;
	      }
	      this.assert(
	          itemsCount >= start && itemsCount <= finish
	        , 'expected #{this} to have a ' + descriptor + ' within ' + range
	        , 'expected #{this} to not have a ' + descriptor + ' within ' + range
	      );
	    } else {
	      this.assert(
	          obj >= start && obj <= finish
	        , 'expected #{this} to be within ' + range
	        , 'expected #{this} to not be within ' + range
	      );
	    }
	  });

	  /**
	   * ### .instanceof(constructor[, msg])
	   *
	   * Asserts that the target is an instance of the given `constructor`.
	   *
	   *     function Cat () { }
	   *
	   *     expect(new Cat()).to.be.an.instanceof(Cat);
	   *     expect([1, 2]).to.be.an.instanceof(Array);
	   *
	   * Add `.not` earlier in the chain to negate `.instanceof`.
	   *
	   *     expect({a: 1}).to.not.be.an.instanceof(Array);
	   *
	   * `.instanceof` accepts an optional `msg` argument which is a custom error
	   * message to show when the assertion fails. The message can also be given as
	   * the second argument to `expect`.
	   *
	   *     expect(1).to.be.an.instanceof(Array, 'nooo why fail??');
	   *     expect(1, 'nooo why fail??').to.be.an.instanceof(Array);
	   *
	   * Due to limitations in ES5, `.instanceof` may not always work as expected
	   * when using a transpiler such as Babel or TypeScript. In particular, it may
	   * produce unexpected results when subclassing built-in object such as
	   * `Array`, `Error`, and `Map`. See your transpiler's docs for details:
	   *
	   * - ([Babel](https://babeljs.io/docs/usage/caveats/#classes))
	   * - ([TypeScript](https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work))
	   *
	   * The alias `.instanceOf` can be used interchangeably with `.instanceof`.
	   *
	   * @name instanceof
	   * @param {Constructor} constructor
	   * @param {String} msg _optional_
	   * @alias instanceOf
	   * @namespace BDD
	   * @api public
	   */

	  function assertInstanceOf (constructor, msg) {
	    if (msg) flag(this, 'message', msg);

	    var target = flag(this, 'object');
	    var ssfi = flag(this, 'ssfi');
	    var flagMsg = flag(this, 'message');

	    try {
	      var isInstanceOf = target instanceof constructor;
	    } catch (err) {
	      if (err instanceof TypeError) {
	        flagMsg = flagMsg ? flagMsg + ': ' : '';
	        throw new AssertionError(
	          flagMsg + 'The instanceof assertion needs a constructor but '
	            + _.type(constructor) + ' was given.',
	          undefined,
	          ssfi
	        );
	      }
	      throw err;
	    }

	    var name = _.getName(constructor);
	    if (name === null) {
	      name = 'an unnamed constructor';
	    }

	    this.assert(
	        isInstanceOf
	      , 'expected #{this} to be an instance of ' + name
	      , 'expected #{this} to not be an instance of ' + name
	    );
	  };

	  Assertion.addMethod('instanceof', assertInstanceOf);
	  Assertion.addMethod('instanceOf', assertInstanceOf);

	  /**
	   * ### .property(name[, val[, msg]])
	   *
	   * Asserts that the target has a property with the given key `name`.
	   *
	   *     expect({a: 1}).to.have.property('a');
	   *
	   * When `val` is provided, `.property` also asserts that the property's value
	   * is equal to the given `val`.
	   *
	   *     expect({a: 1}).to.have.property('a', 1);
	   *
	   * By default, strict (`===`) equality is used. Add `.deep` earlier in the
	   * chain to use deep equality instead. See the `deep-eql` project page for
	   * info on the deep equality algorithm: https://github.com/chaijs/deep-eql.
	   *
	   *     // Target object deeply (but not strictly) has property `x: {a: 1}`
	   *     expect({x: {a: 1}}).to.have.deep.property('x', {a: 1});
	   *     expect({x: {a: 1}}).to.not.have.property('x', {a: 1});
	   *
	   * The target's enumerable and non-enumerable properties are always included
	   * in the search. By default, both own and inherited properties are included.
	   * Add `.own` earlier in the chain to exclude inherited properties from the
	   * search.
	   *
	   *     Object.prototype.b = 2;
	   *
	   *     expect({a: 1}).to.have.own.property('a');
	   *     expect({a: 1}).to.have.own.property('a', 1);
	   *     expect({a: 1}).to.have.property('b');
	   *     expect({a: 1}).to.not.have.own.property('b');
	   *
	   * `.deep` and `.own` can be combined.
	   *
	   *     expect({x: {a: 1}}).to.have.deep.own.property('x', {a: 1});
	   *
	   * Add `.nested` earlier in the chain to enable dot- and bracket-notation when
	   * referencing nested properties.
	   *
	   *     expect({a: {b: ['x', 'y']}}).to.have.nested.property('a.b[1]');
	   *     expect({a: {b: ['x', 'y']}}).to.have.nested.property('a.b[1]', 'y');
	   *
	   * If `.` or `[]` are part of an actual property name, they can be escaped by
	   * adding two backslashes before them.
	   *
	   *     expect({'.a': {'[b]': 'x'}}).to.have.nested.property('\\.a.\\[b\\]');
	   *
	   * `.deep` and `.nested` can be combined.
	   *
	   *     expect({a: {b: [{c: 3}]}})
	   *       .to.have.deep.nested.property('a.b[0]', {c: 3});
	   *
	   * `.own` and `.nested` cannot be combined.
	   *
	   * Add `.not` earlier in the chain to negate `.property`.
	   *
	   *     expect({a: 1}).to.not.have.property('b');
	   *
	   * However, it's dangerous to negate `.property` when providing `val`. The
	   * problem is that it creates uncertain expectations by asserting that the
	   * target either doesn't have a property with the given key `name`, or that it
	   * does have a property with the given key `name` but its value isn't equal to
	   * the given `val`. It's often best to identify the exact output that's
	   * expected, and then write an assertion that only accepts that exact output.
	   *
	   * When the target isn't expected to have a property with the given key
	   * `name`, it's often best to assert exactly that.
	   *
	   *     expect({b: 2}).to.not.have.property('a'); // Recommended
	   *     expect({b: 2}).to.not.have.property('a', 1); // Not recommended
	   *
	   * When the target is expected to have a property with the given key `name`,
	   * it's often best to assert that the property has its expected value, rather
	   * than asserting that it doesn't have one of many unexpected values.
	   *
	   *     expect({a: 3}).to.have.property('a', 3); // Recommended
	   *     expect({a: 3}).to.not.have.property('a', 1); // Not recommended
	   *
	   * `.property` changes the target of any assertions that follow in the chain
	   * to be the value of the property from the original target object.
	   *
	   *     expect({a: 1}).to.have.property('a').that.is.a('number');
	   *
	   * `.property` accepts an optional `msg` argument which is a custom error
	   * message to show when the assertion fails. The message can also be given as
	   * the second argument to `expect`. When not providing `val`, only use the
	   * second form.
	   *
	   *     // Recommended
	   *     expect({a: 1}).to.have.property('a', 2, 'nooo why fail??');
	   *     expect({a: 1}, 'nooo why fail??').to.have.property('a', 2);
	   *     expect({a: 1}, 'nooo why fail??').to.have.property('b');
	   *
	   *     // Not recommended
	   *     expect({a: 1}).to.have.property('b', undefined, 'nooo why fail??');
	   *
	   * The above assertion isn't the same thing as not providing `val`. Instead,
	   * it's asserting that the target object has a `b` property that's equal to
	   * `undefined`.
	   *
	   * The assertions `.ownProperty` and `.haveOwnProperty` can be used
	   * interchangeably with `.own.property`.
	   *
	   * @name property
	   * @param {String} name
	   * @param {Mixed} val (optional)
	   * @param {String} msg _optional_
	   * @returns value of property for chaining
	   * @namespace BDD
	   * @api public
	   */

	  function assertProperty (name, val, msg) {
	    if (msg) flag(this, 'message', msg);

	    var isNested = flag(this, 'nested')
	      , isOwn = flag(this, 'own')
	      , flagMsg = flag(this, 'message')
	      , obj = flag(this, 'object')
	      , ssfi = flag(this, 'ssfi')
	      , nameType = typeof name;

	    flagMsg = flagMsg ? flagMsg + ': ' : '';

	    if (isNested) {
	      if (nameType !== 'string') {
	        throw new AssertionError(
	          flagMsg + 'the argument to property must be a string when using nested syntax',
	          undefined,
	          ssfi
	        );
	      }
	    } else {
	      if (nameType !== 'string' && nameType !== 'number' && nameType !== 'symbol') {
	        throw new AssertionError(
	          flagMsg + 'the argument to property must be a string, number, or symbol',
	          undefined,
	          ssfi
	        );
	      }
	    }

	    if (isNested && isOwn) {
	      throw new AssertionError(
	        flagMsg + 'The "nested" and "own" flags cannot be combined.',
	        undefined,
	        ssfi
	      );
	    }

	    if (obj === null || obj === undefined) {
	      throw new AssertionError(
	        flagMsg + 'Target cannot be null or undefined.',
	        undefined,
	        ssfi
	      );
	    }

	    var isDeep = flag(this, 'deep')
	      , negate = flag(this, 'negate')
	      , pathInfo = isNested ? _.getPathInfo(obj, name) : null
	      , value = isNested ? pathInfo.value : obj[name];

	    var descriptor = '';
	    if (isDeep) descriptor += 'deep ';
	    if (isOwn) descriptor += 'own ';
	    if (isNested) descriptor += 'nested ';
	    descriptor += 'property ';

	    var hasProperty;
	    if (isOwn) hasProperty = Object.prototype.hasOwnProperty.call(obj, name);
	    else if (isNested) hasProperty = pathInfo.exists;
	    else hasProperty = _.hasProperty(obj, name);

	    // When performing a negated assertion for both name and val, merely having
	    // a property with the given name isn't enough to cause the assertion to
	    // fail. It must both have a property with the given name, and the value of
	    // that property must equal the given val. Therefore, skip this assertion in
	    // favor of the next.
	    if (!negate || arguments.length === 1) {
	      this.assert(
	          hasProperty
	        , 'expected #{this} to have ' + descriptor + _.inspect(name)
	        , 'expected #{this} to not have ' + descriptor + _.inspect(name));
	    }

	    if (arguments.length > 1) {
	      this.assert(
	          hasProperty && (isDeep ? _.eql(val, value) : val === value)
	        , 'expected #{this} to have ' + descriptor + _.inspect(name) + ' of #{exp}, but got #{act}'
	        , 'expected #{this} to not have ' + descriptor + _.inspect(name) + ' of #{act}'
	        , val
	        , value
	      );
	    }

	    flag(this, 'object', value);
	  }

	  Assertion.addMethod('property', assertProperty);

	  function assertOwnProperty (name, value, msg) {
	    flag(this, 'own', true);
	    assertProperty.apply(this, arguments);
	  }

	  Assertion.addMethod('ownProperty', assertOwnProperty);
	  Assertion.addMethod('haveOwnProperty', assertOwnProperty);

	  /**
	   * ### .ownPropertyDescriptor(name[, descriptor[, msg]])
	   *
	   * Asserts that the target has its own property descriptor with the given key
	   * `name`. Enumerable and non-enumerable properties are included in the
	   * search.
	   *
	   *     expect({a: 1}).to.have.ownPropertyDescriptor('a');
	   *
	   * When `descriptor` is provided, `.ownPropertyDescriptor` also asserts that
	   * the property's descriptor is deeply equal to the given `descriptor`. See
	   * the `deep-eql` project page for info on the deep equality algorithm:
	   * https://github.com/chaijs/deep-eql.
	   *
	   *     expect({a: 1}).to.have.ownPropertyDescriptor('a', {
	   *       configurable: true,
	   *       enumerable: true,
	   *       writable: true,
	   *       value: 1,
	   *     });
	   *
	   * Add `.not` earlier in the chain to negate `.ownPropertyDescriptor`.
	   *
	   *     expect({a: 1}).to.not.have.ownPropertyDescriptor('b');
	   *
	   * However, it's dangerous to negate `.ownPropertyDescriptor` when providing
	   * a `descriptor`. The problem is that it creates uncertain expectations by
	   * asserting that the target either doesn't have a property descriptor with
	   * the given key `name`, or that it does have a property descriptor with the
	   * given key `name` but it’s not deeply equal to the given `descriptor`. It's
	   * often best to identify the exact output that's expected, and then write an
	   * assertion that only accepts that exact output.
	   *
	   * When the target isn't expected to have a property descriptor with the given
	   * key `name`, it's often best to assert exactly that.
	   *
	   *     // Recommended
	   *     expect({b: 2}).to.not.have.ownPropertyDescriptor('a');
	   *
	   *     // Not recommended
	   *     expect({b: 2}).to.not.have.ownPropertyDescriptor('a', {
	   *       configurable: true,
	   *       enumerable: true,
	   *       writable: true,
	   *       value: 1,
	   *     });
	   *
	   * When the target is expected to have a property descriptor with the given
	   * key `name`, it's often best to assert that the property has its expected
	   * descriptor, rather than asserting that it doesn't have one of many
	   * unexpected descriptors.
	   *
	   *     // Recommended
	   *     expect({a: 3}).to.have.ownPropertyDescriptor('a', {
	   *       configurable: true,
	   *       enumerable: true,
	   *       writable: true,
	   *       value: 3,
	   *     });
	   *
	   *     // Not recommended
	   *     expect({a: 3}).to.not.have.ownPropertyDescriptor('a', {
	   *       configurable: true,
	   *       enumerable: true,
	   *       writable: true,
	   *       value: 1,
	   *     });
	   *
	   * `.ownPropertyDescriptor` changes the target of any assertions that follow
	   * in the chain to be the value of the property descriptor from the original
	   * target object.
	   *
	   *     expect({a: 1}).to.have.ownPropertyDescriptor('a')
	   *       .that.has.property('enumerable', true);
	   *
	   * `.ownPropertyDescriptor` accepts an optional `msg` argument which is a
	   * custom error message to show when the assertion fails. The message can also
	   * be given as the second argument to `expect`. When not providing
	   * `descriptor`, only use the second form.
	   *
	   *     // Recommended
	   *     expect({a: 1}).to.have.ownPropertyDescriptor('a', {
	   *       configurable: true,
	   *       enumerable: true,
	   *       writable: true,
	   *       value: 2,
	   *     }, 'nooo why fail??');
	   *
	   *     // Recommended
	   *     expect({a: 1}, 'nooo why fail??').to.have.ownPropertyDescriptor('a', {
	   *       configurable: true,
	   *       enumerable: true,
	   *       writable: true,
	   *       value: 2,
	   *     });
	   *
	   *     // Recommended
	   *     expect({a: 1}, 'nooo why fail??').to.have.ownPropertyDescriptor('b');
	   *
	   *     // Not recommended
	   *     expect({a: 1})
	   *       .to.have.ownPropertyDescriptor('b', undefined, 'nooo why fail??');
	   *
	   * The above assertion isn't the same thing as not providing `descriptor`.
	   * Instead, it's asserting that the target object has a `b` property
	   * descriptor that's deeply equal to `undefined`.
	   *
	   * The alias `.haveOwnPropertyDescriptor` can be used interchangeably with
	   * `.ownPropertyDescriptor`.
	   *
	   * @name ownPropertyDescriptor
	   * @alias haveOwnPropertyDescriptor
	   * @param {String} name
	   * @param {Object} descriptor _optional_
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function assertOwnPropertyDescriptor (name, descriptor, msg) {
	    if (typeof descriptor === 'string') {
	      msg = descriptor;
	      descriptor = null;
	    }
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object');
	    var actualDescriptor = Object.getOwnPropertyDescriptor(Object(obj), name);
	    if (actualDescriptor && descriptor) {
	      this.assert(
	          _.eql(descriptor, actualDescriptor)
	        , 'expected the own property descriptor for ' + _.inspect(name) + ' on #{this} to match ' + _.inspect(descriptor) + ', got ' + _.inspect(actualDescriptor)
	        , 'expected the own property descriptor for ' + _.inspect(name) + ' on #{this} to not match ' + _.inspect(descriptor)
	        , descriptor
	        , actualDescriptor
	        , true
	      );
	    } else {
	      this.assert(
	          actualDescriptor
	        , 'expected #{this} to have an own property descriptor for ' + _.inspect(name)
	        , 'expected #{this} to not have an own property descriptor for ' + _.inspect(name)
	      );
	    }
	    flag(this, 'object', actualDescriptor);
	  }

	  Assertion.addMethod('ownPropertyDescriptor', assertOwnPropertyDescriptor);
	  Assertion.addMethod('haveOwnPropertyDescriptor', assertOwnPropertyDescriptor);

	  /**
	   * ### .lengthOf(n[, msg])
	   *
	   * Asserts that the target's `length` or `size` is equal to the given number
	   * `n`.
	   *
	   *     expect([1, 2, 3]).to.have.lengthOf(3);
	   *     expect('foo').to.have.lengthOf(3);
	   *     expect(new Set([1, 2, 3])).to.have.lengthOf(3);
	   *     expect(new Map([['a', 1], ['b', 2], ['c', 3]])).to.have.lengthOf(3);
	   *
	   * Add `.not` earlier in the chain to negate `.lengthOf`. However, it's often
	   * best to assert that the target's `length` property is equal to its expected
	   * value, rather than not equal to one of many unexpected values.
	   *
	   *     expect('foo').to.have.lengthOf(3); // Recommended
	   *     expect('foo').to.not.have.lengthOf(4); // Not recommended
	   *
	   * `.lengthOf` accepts an optional `msg` argument which is a custom error
	   * message to show when the assertion fails. The message can also be given as
	   * the second argument to `expect`.
	   *
	   *     expect([1, 2, 3]).to.have.lengthOf(2, 'nooo why fail??');
	   *     expect([1, 2, 3], 'nooo why fail??').to.have.lengthOf(2);
	   *
	   * `.lengthOf` can also be used as a language chain, causing all `.above`,
	   * `.below`, `.least`, `.most`, and `.within` assertions that follow in the
	   * chain to use the target's `length` property as the target. However, it's
	   * often best to assert that the target's `length` property is equal to its
	   * expected length, rather than asserting that its `length` property falls
	   * within some range of values.
	   *
	   *     // Recommended
	   *     expect([1, 2, 3]).to.have.lengthOf(3);
	   *
	   *     // Not recommended
	   *     expect([1, 2, 3]).to.have.lengthOf.above(2);
	   *     expect([1, 2, 3]).to.have.lengthOf.below(4);
	   *     expect([1, 2, 3]).to.have.lengthOf.at.least(3);
	   *     expect([1, 2, 3]).to.have.lengthOf.at.most(3);
	   *     expect([1, 2, 3]).to.have.lengthOf.within(2,4);
	   *
	   * Due to a compatibility issue, the alias `.length` can't be chained directly
	   * off of an uninvoked method such as `.a`. Therefore, `.length` can't be used
	   * interchangeably with `.lengthOf` in every situation. It's recommended to
	   * always use `.lengthOf` instead of `.length`.
	   *
	   *     expect([1, 2, 3]).to.have.a.length(3); // incompatible; throws error
	   *     expect([1, 2, 3]).to.have.a.lengthOf(3);  // passes as expected
	   *
	   * @name lengthOf
	   * @alias length
	   * @param {Number} n
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function assertLengthChain () {
	    flag(this, 'doLength', true);
	  }

	  function assertLength (n, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object')
	      , objType = _.type(obj).toLowerCase()
	      , flagMsg = flag(this, 'message')
	      , ssfi = flag(this, 'ssfi')
	      , descriptor = 'length'
	      , itemsCount;

	    switch (objType) {
	      case 'map':
	      case 'set':
	        descriptor = 'size';
	        itemsCount = obj.size;
	        break;
	      default:
	        new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
	        itemsCount = obj.length;
	    }

	    this.assert(
	        itemsCount == n
	      , 'expected #{this} to have a ' + descriptor + ' of #{exp} but got #{act}'
	      , 'expected #{this} to not have a ' + descriptor + ' of #{act}'
	      , n
	      , itemsCount
	    );
	  }

	  Assertion.addChainableMethod('length', assertLength, assertLengthChain);
	  Assertion.addChainableMethod('lengthOf', assertLength, assertLengthChain);

	  /**
	   * ### .match(re[, msg])
	   *
	   * Asserts that the target matches the given regular expression `re`.
	   *
	   *     expect('foobar').to.match(/^foo/);
	   *
	   * Add `.not` earlier in the chain to negate `.match`.
	   *
	   *     expect('foobar').to.not.match(/taco/);
	   *
	   * `.match` accepts an optional `msg` argument which is a custom error message
	   * to show when the assertion fails. The message can also be given as the
	   * second argument to `expect`.
	   *
	   *     expect('foobar').to.match(/taco/, 'nooo why fail??');
	   *     expect('foobar', 'nooo why fail??').to.match(/taco/);
	   *
	   * The alias `.matches` can be used interchangeably with `.match`.
	   *
	   * @name match
	   * @alias matches
	   * @param {RegExp} re
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */
	  function assertMatch(re, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object');
	    this.assert(
	        re.exec(obj)
	      , 'expected #{this} to match ' + re
	      , 'expected #{this} not to match ' + re
	    );
	  }

	  Assertion.addMethod('match', assertMatch);
	  Assertion.addMethod('matches', assertMatch);

	  /**
	   * ### .string(str[, msg])
	   *
	   * Asserts that the target string contains the given substring `str`.
	   *
	   *     expect('foobar').to.have.string('bar');
	   *
	   * Add `.not` earlier in the chain to negate `.string`.
	   *
	   *     expect('foobar').to.not.have.string('taco');
	   *
	   * `.string` accepts an optional `msg` argument which is a custom error
	   * message to show when the assertion fails. The message can also be given as
	   * the second argument to `expect`.
	   *
	   *     expect('foobar').to.have.string('taco', 'nooo why fail??');
	   *     expect('foobar', 'nooo why fail??').to.have.string('taco');
	   *
	   * @name string
	   * @param {String} str
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addMethod('string', function (str, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object')
	      , flagMsg = flag(this, 'message')
	      , ssfi = flag(this, 'ssfi');
	    new Assertion(obj, flagMsg, ssfi, true).is.a('string');

	    this.assert(
	        ~obj.indexOf(str)
	      , 'expected #{this} to contain ' + _.inspect(str)
	      , 'expected #{this} to not contain ' + _.inspect(str)
	    );
	  });

	  /**
	   * ### .keys(key1[, key2[, ...]])
	   *
	   * Asserts that the target object, array, map, or set has the given keys. Only
	   * the target's own inherited properties are included in the search.
	   *
	   * When the target is an object or array, keys can be provided as one or more
	   * string arguments, a single array argument, or a single object argument. In
	   * the latter case, only the keys in the given object matter; the values are
	   * ignored.
	   *
	   *     expect({a: 1, b: 2}).to.have.all.keys('a', 'b');
	   *     expect(['x', 'y']).to.have.all.keys(0, 1);
	   *
	   *     expect({a: 1, b: 2}).to.have.all.keys(['a', 'b']);
	   *     expect(['x', 'y']).to.have.all.keys([0, 1]);
	   *
	   *     expect({a: 1, b: 2}).to.have.all.keys({a: 4, b: 5}); // ignore 4 and 5
	   *     expect(['x', 'y']).to.have.all.keys({0: 4, 1: 5}); // ignore 4 and 5
	   *
	   * When the target is a map or set, each key must be provided as a separate
	   * argument.
	   *
	   *     expect(new Map([['a', 1], ['b', 2]])).to.have.all.keys('a', 'b');
	   *     expect(new Set(['a', 'b'])).to.have.all.keys('a', 'b');
	   *
	   * Because `.keys` does different things based on the target's type, it's
	   * important to check the target's type before using `.keys`. See the `.a` doc
	   * for info on testing a target's type.
	   *
	   *     expect({a: 1, b: 2}).to.be.an('object').that.has.all.keys('a', 'b');
	   *
	   * By default, strict (`===`) equality is used to compare keys of maps and
	   * sets. Add `.deep` earlier in the chain to use deep equality instead. See
	   * the `deep-eql` project page for info on the deep equality algorithm:
	   * https://github.com/chaijs/deep-eql.
	   *
	   *     // Target set deeply (but not strictly) has key `{a: 1}`
	   *     expect(new Set([{a: 1}])).to.have.all.deep.keys([{a: 1}]);
	   *     expect(new Set([{a: 1}])).to.not.have.all.keys([{a: 1}]);
	   *
	   * By default, the target must have all of the given keys and no more. Add
	   * `.any` earlier in the chain to only require that the target have at least
	   * one of the given keys. Also, add `.not` earlier in the chain to negate
	   * `.keys`. It's often best to add `.any` when negating `.keys`, and to use
	   * `.all` when asserting `.keys` without negation.
	   *
	   * When negating `.keys`, `.any` is preferred because `.not.any.keys` asserts
	   * exactly what's expected of the output, whereas `.not.all.keys` creates
	   * uncertain expectations.
	   *
	   *     // Recommended; asserts that target doesn't have any of the given keys
	   *     expect({a: 1, b: 2}).to.not.have.any.keys('c', 'd');
	   *
	   *     // Not recommended; asserts that target doesn't have all of the given
	   *     // keys but may or may not have some of them
	   *     expect({a: 1, b: 2}).to.not.have.all.keys('c', 'd');
	   *
	   * When asserting `.keys` without negation, `.all` is preferred because
	   * `.all.keys` asserts exactly what's expected of the output, whereas
	   * `.any.keys` creates uncertain expectations.
	   *
	   *     // Recommended; asserts that target has all the given keys
	   *     expect({a: 1, b: 2}).to.have.all.keys('a', 'b');
	   *
	   *     // Not recommended; asserts that target has at least one of the given
	   *     // keys but may or may not have more of them
	   *     expect({a: 1, b: 2}).to.have.any.keys('a', 'b');
	   *
	   * Note that `.all` is used by default when neither `.all` nor `.any` appear
	   * earlier in the chain. However, it's often best to add `.all` anyway because
	   * it improves readability.
	   *
	   *     // Both assertions are identical
	   *     expect({a: 1, b: 2}).to.have.all.keys('a', 'b'); // Recommended
	   *     expect({a: 1, b: 2}).to.have.keys('a', 'b'); // Not recommended
	   *
	   * Add `.include` earlier in the chain to require that the target's keys be a
	   * superset of the expected keys, rather than identical sets.
	   *
	   *     // Target object's keys are a superset of ['a', 'b'] but not identical
	   *     expect({a: 1, b: 2, c: 3}).to.include.all.keys('a', 'b');
	   *     expect({a: 1, b: 2, c: 3}).to.not.have.all.keys('a', 'b');
	   *
	   * However, if `.any` and `.include` are combined, only the `.any` takes
	   * effect. The `.include` is ignored in this case.
	   *
	   *     // Both assertions are identical
	   *     expect({a: 1}).to.have.any.keys('a', 'b');
	   *     expect({a: 1}).to.include.any.keys('a', 'b');
	   *
	   * A custom error message can be given as the second argument to `expect`.
	   *
	   *     expect({a: 1}, 'nooo why fail??').to.have.key('b');
	   *
	   * The alias `.key` can be used interchangeably with `.keys`.
	   *
	   * @name keys
	   * @alias key
	   * @param {...String|Array|Object} keys
	   * @namespace BDD
	   * @api public
	   */

	  function assertKeys (keys) {
	    var obj = flag(this, 'object')
	      , objType = _.type(obj)
	      , keysType = _.type(keys)
	      , ssfi = flag(this, 'ssfi')
	      , isDeep = flag(this, 'deep')
	      , str
	      , deepStr = ''
	      , actual
	      , ok = true
	      , flagMsg = flag(this, 'message');

	    flagMsg = flagMsg ? flagMsg + ': ' : '';
	    var mixedArgsMsg = flagMsg + 'when testing keys against an object or an array you must give a single Array|Object|String argument or multiple String arguments';

	    if (objType === 'Map' || objType === 'Set') {
	      deepStr = isDeep ? 'deeply ' : '';
	      actual = [];

	      // Map and Set '.keys' aren't supported in IE 11. Therefore, use .forEach.
	      obj.forEach(function (val, key) { actual.push(key); });

	      if (keysType !== 'Array') {
	        keys = Array.prototype.slice.call(arguments);
	      }
	    } else {
	      actual = _.getOwnEnumerableProperties(obj);

	      switch (keysType) {
	        case 'Array':
	          if (arguments.length > 1) {
	            throw new AssertionError(mixedArgsMsg, undefined, ssfi);
	          }
	          break;
	        case 'Object':
	          if (arguments.length > 1) {
	            throw new AssertionError(mixedArgsMsg, undefined, ssfi);
	          }
	          keys = Object.keys(keys);
	          break;
	        default:
	          keys = Array.prototype.slice.call(arguments);
	      }

	      // Only stringify non-Symbols because Symbols would become "Symbol()"
	      keys = keys.map(function (val) {
	        return typeof val === 'symbol' ? val : String(val);
	      });
	    }

	    if (!keys.length) {
	      throw new AssertionError(flagMsg + 'keys required', undefined, ssfi);
	    }

	    var len = keys.length
	      , any = flag(this, 'any')
	      , all = flag(this, 'all')
	      , expected = keys;

	    if (!any && !all) {
	      all = true;
	    }

	    // Has any
	    if (any) {
	      ok = expected.some(function(expectedKey) {
	        return actual.some(function(actualKey) {
	          if (isDeep) {
	            return _.eql(expectedKey, actualKey);
	          } else {
	            return expectedKey === actualKey;
	          }
	        });
	      });
	    }

	    // Has all
	    if (all) {
	      ok = expected.every(function(expectedKey) {
	        return actual.some(function(actualKey) {
	          if (isDeep) {
	            return _.eql(expectedKey, actualKey);
	          } else {
	            return expectedKey === actualKey;
	          }
	        });
	      });

	      if (!flag(this, 'contains')) {
	        ok = ok && keys.length == actual.length;
	      }
	    }

	    // Key string
	    if (len > 1) {
	      keys = keys.map(function(key) {
	        return _.inspect(key);
	      });
	      var last = keys.pop();
	      if (all) {
	        str = keys.join(', ') + ', and ' + last;
	      }
	      if (any) {
	        str = keys.join(', ') + ', or ' + last;
	      }
	    } else {
	      str = _.inspect(keys[0]);
	    }

	    // Form
	    str = (len > 1 ? 'keys ' : 'key ') + str;

	    // Have / include
	    str = (flag(this, 'contains') ? 'contain ' : 'have ') + str;

	    // Assertion
	    this.assert(
	        ok
	      , 'expected #{this} to ' + deepStr + str
	      , 'expected #{this} to not ' + deepStr + str
	      , expected.slice(0).sort(_.compareByInspect)
	      , actual.sort(_.compareByInspect)
	      , true
	    );
	  }

	  Assertion.addMethod('keys', assertKeys);
	  Assertion.addMethod('key', assertKeys);

	  /**
	   * ### .throw([errorLike], [errMsgMatcher], [msg])
	   *
	   * When no arguments are provided, `.throw` invokes the target function and
	   * asserts that an error is thrown.
	   *
	   *     var badFn = function () { throw new TypeError('Illegal salmon!'); };
	   *
	   *     expect(badFn).to.throw();
	   *
	   * When one argument is provided, and it's an error constructor, `.throw`
	   * invokes the target function and asserts that an error is thrown that's an
	   * instance of that error constructor.
	   *
	   *     var badFn = function () { throw new TypeError('Illegal salmon!'); };
	   *
	   *     expect(badFn).to.throw(TypeError);
	   *
	   * When one argument is provided, and it's an error instance, `.throw` invokes
	   * the target function and asserts that an error is thrown that's strictly
	   * (`===`) equal to that error instance.
	   *
	   *     var err = new TypeError('Illegal salmon!');
	   *     var badFn = function () { throw err; };
	   *
	   *     expect(badFn).to.throw(err);
	   *
	   * When one argument is provided, and it's a string, `.throw` invokes the
	   * target function and asserts that an error is thrown with a message that
	   * contains that string.
	   *
	   *     var badFn = function () { throw new TypeError('Illegal salmon!'); };
	   *
	   *     expect(badFn).to.throw('salmon');
	   *
	   * When one argument is provided, and it's a regular expression, `.throw`
	   * invokes the target function and asserts that an error is thrown with a
	   * message that matches that regular expression.
	   *
	   *     var badFn = function () { throw new TypeError('Illegal salmon!'); };
	   *
	   *     expect(badFn).to.throw(/salmon/);
	   *
	   * When two arguments are provided, and the first is an error instance or
	   * constructor, and the second is a string or regular expression, `.throw`
	   * invokes the function and asserts that an error is thrown that fulfills both
	   * conditions as described above.
	   *
	   *     var err = new TypeError('Illegal salmon!');
	   *     var badFn = function () { throw err; };
	   *
	   *     expect(badFn).to.throw(TypeError, 'salmon');
	   *     expect(badFn).to.throw(TypeError, /salmon/);
	   *     expect(badFn).to.throw(err, 'salmon');
	   *     expect(badFn).to.throw(err, /salmon/);
	   *
	   * Add `.not` earlier in the chain to negate `.throw`.
	   *
	   *     var goodFn = function () {};
	   *
	   *     expect(goodFn).to.not.throw();
	   *
	   * However, it's dangerous to negate `.throw` when providing any arguments.
	   * The problem is that it creates uncertain expectations by asserting that the
	   * target either doesn't throw an error, or that it throws an error but of a
	   * different type than the given type, or that it throws an error of the given
	   * type but with a message that doesn't include the given string. It's often
	   * best to identify the exact output that's expected, and then write an
	   * assertion that only accepts that exact output.
	   *
	   * When the target isn't expected to throw an error, it's often best to assert
	   * exactly that.
	   *
	   *     var goodFn = function () {};
	   *
	   *     expect(goodFn).to.not.throw(); // Recommended
	   *     expect(goodFn).to.not.throw(ReferenceError, 'x'); // Not recommended
	   *
	   * When the target is expected to throw an error, it's often best to assert
	   * that the error is of its expected type, and has a message that includes an
	   * expected string, rather than asserting that it doesn't have one of many
	   * unexpected types, and doesn't have a message that includes some string.
	   *
	   *     var badFn = function () { throw new TypeError('Illegal salmon!'); };
	   *
	   *     expect(badFn).to.throw(TypeError, 'salmon'); // Recommended
	   *     expect(badFn).to.not.throw(ReferenceError, 'x'); // Not recommended
	   *
	   * `.throw` changes the target of any assertions that follow in the chain to
	   * be the error object that's thrown.
	   *
	   *     var err = new TypeError('Illegal salmon!');
	   *     err.code = 42;
	   *     var badFn = function () { throw err; };
	   *
	   *     expect(badFn).to.throw(TypeError).with.property('code', 42);
	   *
	   * `.throw` accepts an optional `msg` argument which is a custom error message
	   * to show when the assertion fails. The message can also be given as the
	   * second argument to `expect`. When not providing two arguments, always use
	   * the second form.
	   *
	   *     var goodFn = function () {};
	   *
	   *     expect(goodFn).to.throw(TypeError, 'x', 'nooo why fail??');
	   *     expect(goodFn, 'nooo why fail??').to.throw();
	   *
	   * Due to limitations in ES5, `.throw` may not always work as expected when
	   * using a transpiler such as Babel or TypeScript. In particular, it may
	   * produce unexpected results when subclassing the built-in `Error` object and
	   * then passing the subclassed constructor to `.throw`. See your transpiler's
	   * docs for details:
	   *
	   * - ([Babel](https://babeljs.io/docs/usage/caveats/#classes))
	   * - ([TypeScript](https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work))
	   *
	   * Beware of some common mistakes when using the `throw` assertion. One common
	   * mistake is to accidentally invoke the function yourself instead of letting
	   * the `throw` assertion invoke the function for you. For example, when
	   * testing if a function named `fn` throws, provide `fn` instead of `fn()` as
	   * the target for the assertion.
	   *
	   *     expect(fn).to.throw();     // Good! Tests `fn` as desired
	   *     expect(fn()).to.throw();   // Bad! Tests result of `fn()`, not `fn`
	   *
	   * If you need to assert that your function `fn` throws when passed certain
	   * arguments, then wrap a call to `fn` inside of another function.
	   *
	   *     expect(function () { fn(42); }).to.throw();  // Function expression
	   *     expect(() => fn(42)).to.throw();             // ES6 arrow function
	   *
	   * Another common mistake is to provide an object method (or any stand-alone
	   * function that relies on `this`) as the target of the assertion. Doing so is
	   * problematic because the `this` context will be lost when the function is
	   * invoked by `.throw`; there's no way for it to know what `this` is supposed
	   * to be. There are two ways around this problem. One solution is to wrap the
	   * method or function call inside of another function. Another solution is to
	   * use `bind`.
	   *
	   *     expect(function () { cat.meow(); }).to.throw();  // Function expression
	   *     expect(() => cat.meow()).to.throw();             // ES6 arrow function
	   *     expect(cat.meow.bind(cat)).to.throw();           // Bind
	   *
	   * Finally, it's worth mentioning that it's a best practice in JavaScript to
	   * only throw `Error` and derivatives of `Error` such as `ReferenceError`,
	   * `TypeError`, and user-defined objects that extend `Error`. No other type of
	   * value will generate a stack trace when initialized. With that said, the
	   * `throw` assertion does technically support any type of value being thrown,
	   * not just `Error` and its derivatives.
	   *
	   * The aliases `.throws` and `.Throw` can be used interchangeably with
	   * `.throw`.
	   *
	   * @name throw
	   * @alias throws
	   * @alias Throw
	   * @param {Error|ErrorConstructor} errorLike
	   * @param {String|RegExp} errMsgMatcher error message
	   * @param {String} msg _optional_
	   * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
	   * @returns error for chaining (null if no error)
	   * @namespace BDD
	   * @api public
	   */

	  function assertThrows (errorLike, errMsgMatcher, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object')
	      , ssfi = flag(this, 'ssfi')
	      , flagMsg = flag(this, 'message')
	      , negate = flag(this, 'negate') || false;
	    new Assertion(obj, flagMsg, ssfi, true).is.a('function');

	    if (errorLike instanceof RegExp || typeof errorLike === 'string') {
	      errMsgMatcher = errorLike;
	      errorLike = null;
	    }

	    var caughtErr;
	    try {
	      obj();
	    } catch (err) {
	      caughtErr = err;
	    }

	    // If we have the negate flag enabled and at least one valid argument it means we do expect an error
	    // but we want it to match a given set of criteria
	    var everyArgIsUndefined = errorLike === undefined && errMsgMatcher === undefined;

	    // If we've got the negate flag enabled and both args, we should only fail if both aren't compatible
	    // See Issue #551 and PR #683@GitHub
	    var everyArgIsDefined = Boolean(errorLike && errMsgMatcher);
	    var errorLikeFail = false;
	    var errMsgMatcherFail = false;

	    // Checking if error was thrown
	    if (everyArgIsUndefined || !everyArgIsUndefined && !negate) {
	      // We need this to display results correctly according to their types
	      var errorLikeString = 'an error';
	      if (errorLike instanceof Error) {
	        errorLikeString = '#{exp}';
	      } else if (errorLike) {
	        errorLikeString = _.checkError.getConstructorName(errorLike);
	      }

	      this.assert(
	          caughtErr
	        , 'expected #{this} to throw ' + errorLikeString
	        , 'expected #{this} to not throw an error but #{act} was thrown'
	        , errorLike && errorLike.toString()
	        , (caughtErr instanceof Error ?
	            caughtErr.toString() : (typeof caughtErr === 'string' ? caughtErr : caughtErr &&
	                                    _.checkError.getConstructorName(caughtErr)))
	      );
	    }

	    if (errorLike && caughtErr) {
	      // We should compare instances only if `errorLike` is an instance of `Error`
	      if (errorLike instanceof Error) {
	        var isCompatibleInstance = _.checkError.compatibleInstance(caughtErr, errorLike);

	        if (isCompatibleInstance === negate) {
	          // These checks were created to ensure we won't fail too soon when we've got both args and a negate
	          // See Issue #551 and PR #683@GitHub
	          if (everyArgIsDefined && negate) {
	            errorLikeFail = true;
	          } else {
	            this.assert(
	                negate
	              , 'expected #{this} to throw #{exp} but #{act} was thrown'
	              , 'expected #{this} to not throw #{exp}' + (caughtErr && !negate ? ' but #{act} was thrown' : '')
	              , errorLike.toString()
	              , caughtErr.toString()
	            );
	          }
	        }
	      }

	      var isCompatibleConstructor = _.checkError.compatibleConstructor(caughtErr, errorLike);
	      if (isCompatibleConstructor === negate) {
	        if (everyArgIsDefined && negate) {
	            errorLikeFail = true;
	        } else {
	          this.assert(
	              negate
	            , 'expected #{this} to throw #{exp} but #{act} was thrown'
	            , 'expected #{this} to not throw #{exp}' + (caughtErr ? ' but #{act} was thrown' : '')
	            , (errorLike instanceof Error ? errorLike.toString() : errorLike && _.checkError.getConstructorName(errorLike))
	            , (caughtErr instanceof Error ? caughtErr.toString() : caughtErr && _.checkError.getConstructorName(caughtErr))
	          );
	        }
	      }
	    }

	    if (caughtErr && errMsgMatcher !== undefined && errMsgMatcher !== null) {
	      // Here we check compatible messages
	      var placeholder = 'including';
	      if (errMsgMatcher instanceof RegExp) {
	        placeholder = 'matching';
	      }

	      var isCompatibleMessage = _.checkError.compatibleMessage(caughtErr, errMsgMatcher);
	      if (isCompatibleMessage === negate) {
	        if (everyArgIsDefined && negate) {
	            errMsgMatcherFail = true;
	        } else {
	          this.assert(
	            negate
	            , 'expected #{this} to throw error ' + placeholder + ' #{exp} but got #{act}'
	            , 'expected #{this} to throw error not ' + placeholder + ' #{exp}'
	            ,  errMsgMatcher
	            ,  _.checkError.getMessage(caughtErr)
	          );
	        }
	      }
	    }

	    // If both assertions failed and both should've matched we throw an error
	    if (errorLikeFail && errMsgMatcherFail) {
	      this.assert(
	        negate
	        , 'expected #{this} to throw #{exp} but #{act} was thrown'
	        , 'expected #{this} to not throw #{exp}' + (caughtErr ? ' but #{act} was thrown' : '')
	        , (errorLike instanceof Error ? errorLike.toString() : errorLike && _.checkError.getConstructorName(errorLike))
	        , (caughtErr instanceof Error ? caughtErr.toString() : caughtErr && _.checkError.getConstructorName(caughtErr))
	      );
	    }

	    flag(this, 'object', caughtErr);
	  };

	  Assertion.addMethod('throw', assertThrows);
	  Assertion.addMethod('throws', assertThrows);
	  Assertion.addMethod('Throw', assertThrows);

	  /**
	   * ### .respondTo(method[, msg])
	   *
	   * When the target is a non-function object, `.respondTo` asserts that the
	   * target has a method with the given name `method`. The method can be own or
	   * inherited, and it can be enumerable or non-enumerable.
	   *
	   *     function Cat () {}
	   *     Cat.prototype.meow = function () {};
	   *
	   *     expect(new Cat()).to.respondTo('meow');
	   *
	   * When the target is a function, `.respondTo` asserts that the target's
	   * `prototype` property has a method with the given name `method`. Again, the
	   * method can be own or inherited, and it can be enumerable or non-enumerable.
	   *
	   *     function Cat () {}
	   *     Cat.prototype.meow = function () {};
	   *
	   *     expect(Cat).to.respondTo('meow');
	   *
	   * Add `.itself` earlier in the chain to force `.respondTo` to treat the
	   * target as a non-function object, even if it's a function. Thus, it asserts
	   * that the target has a method with the given name `method`, rather than
	   * asserting that the target's `prototype` property has a method with the
	   * given name `method`.
	   *
	   *     function Cat () {}
	   *     Cat.prototype.meow = function () {};
	   *     Cat.hiss = function () {};
	   *
	   *     expect(Cat).itself.to.respondTo('hiss').but.not.respondTo('meow');
	   *
	   * When not adding `.itself`, it's important to check the target's type before
	   * using `.respondTo`. See the `.a` doc for info on checking a target's type.
	   *
	   *     function Cat () {}
	   *     Cat.prototype.meow = function () {};
	   *
	   *     expect(new Cat()).to.be.an('object').that.respondsTo('meow');
	   *
	   * Add `.not` earlier in the chain to negate `.respondTo`.
	   *
	   *     function Dog () {}
	   *     Dog.prototype.bark = function () {};
	   *
	   *     expect(new Dog()).to.not.respondTo('meow');
	   *
	   * `.respondTo` accepts an optional `msg` argument which is a custom error
	   * message to show when the assertion fails. The message can also be given as
	   * the second argument to `expect`.
	   *
	   *     expect({}).to.respondTo('meow', 'nooo why fail??');
	   *     expect({}, 'nooo why fail??').to.respondTo('meow');
	   *
	   * The alias `.respondsTo` can be used interchangeably with `.respondTo`.
	   *
	   * @name respondTo
	   * @alias respondsTo
	   * @param {String} method
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function respondTo (method, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object')
	      , itself = flag(this, 'itself')
	      , context = ('function' === typeof obj && !itself)
	        ? obj.prototype[method]
	        : obj[method];

	    this.assert(
	        'function' === typeof context
	      , 'expected #{this} to respond to ' + _.inspect(method)
	      , 'expected #{this} to not respond to ' + _.inspect(method)
	    );
	  }

	  Assertion.addMethod('respondTo', respondTo);
	  Assertion.addMethod('respondsTo', respondTo);

	  /**
	   * ### .itself
	   *
	   * Forces all `.respondTo` assertions that follow in the chain to behave as if
	   * the target is a non-function object, even if it's a function. Thus, it
	   * causes `.respondTo` to assert that the target has a method with the given
	   * name, rather than asserting that the target's `prototype` property has a
	   * method with the given name.
	   *
	   *     function Cat () {}
	   *     Cat.prototype.meow = function () {};
	   *     Cat.hiss = function () {};
	   *
	   *     expect(Cat).itself.to.respondTo('hiss').but.not.respondTo('meow');
	   *
	   * @name itself
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('itself', function () {
	    flag(this, 'itself', true);
	  });

	  /**
	   * ### .satisfy(matcher[, msg])
	   *
	   * Invokes the given `matcher` function with the target being passed as the
	   * first argument, and asserts that the value returned is truthy.
	   *
	   *     expect(1).to.satisfy(function(num) {
	   *       return num > 0;
	   *     });
	   *
	   * Add `.not` earlier in the chain to negate `.satisfy`.
	   *
	   *     expect(1).to.not.satisfy(function(num) {
	   *       return num > 2;
	   *     });
	   *
	   * `.satisfy` accepts an optional `msg` argument which is a custom error
	   * message to show when the assertion fails. The message can also be given as
	   * the second argument to `expect`.
	   *
	   *     expect(1).to.satisfy(function(num) {
	   *       return num > 2;
	   *     }, 'nooo why fail??');
	   *
	   *     expect(1, 'nooo why fail??').to.satisfy(function(num) {
	   *       return num > 2;
	   *     });
	   *
	   * The alias `.satisfies` can be used interchangeably with `.satisfy`.
	   *
	   * @name satisfy
	   * @alias satisfies
	   * @param {Function} matcher
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function satisfy (matcher, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object');
	    var result = matcher(obj);
	    this.assert(
	        result
	      , 'expected #{this} to satisfy ' + _.objDisplay(matcher)
	      , 'expected #{this} to not satisfy' + _.objDisplay(matcher)
	      , flag(this, 'negate') ? false : true
	      , result
	    );
	  }

	  Assertion.addMethod('satisfy', satisfy);
	  Assertion.addMethod('satisfies', satisfy);

	  /**
	   * ### .closeTo(expected, delta[, msg])
	   *
	   * Asserts that the target is a number that's within a given +/- `delta` range
	   * of the given number `expected`. However, it's often best to assert that the
	   * target is equal to its expected value.
	   *
	   *     // Recommended
	   *     expect(1.5).to.equal(1.5);
	   *
	   *     // Not recommended
	   *     expect(1.5).to.be.closeTo(1, 0.5);
	   *     expect(1.5).to.be.closeTo(2, 0.5);
	   *     expect(1.5).to.be.closeTo(1, 1);
	   *
	   * Add `.not` earlier in the chain to negate `.closeTo`.
	   *
	   *     expect(1.5).to.equal(1.5); // Recommended
	   *     expect(1.5).to.not.be.closeTo(3, 1); // Not recommended
	   *
	   * `.closeTo` accepts an optional `msg` argument which is a custom error
	   * message to show when the assertion fails. The message can also be given as
	   * the second argument to `expect`.
	   *
	   *     expect(1.5).to.be.closeTo(3, 1, 'nooo why fail??');
	   *     expect(1.5, 'nooo why fail??').to.be.closeTo(3, 1);
	   *
	   * The alias `.approximately` can be used interchangeably with `.closeTo`.
	   *
	   * @name closeTo
	   * @alias approximately
	   * @param {Number} expected
	   * @param {Number} delta
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function closeTo(expected, delta, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object')
	      , flagMsg = flag(this, 'message')
	      , ssfi = flag(this, 'ssfi');

	    new Assertion(obj, flagMsg, ssfi, true).is.a('number');
	    if (typeof expected !== 'number' || typeof delta !== 'number') {
	      flagMsg = flagMsg ? flagMsg + ': ' : '';
	      var deltaMessage = delta === undefined ? ", and a delta is required" : "";
	      throw new AssertionError(
	          flagMsg + 'the arguments to closeTo or approximately must be numbers' + deltaMessage,
	          undefined,
	          ssfi
	      );
	    }

	    this.assert(
	        Math.abs(obj - expected) <= delta
	      , 'expected #{this} to be close to ' + expected + ' +/- ' + delta
	      , 'expected #{this} not to be close to ' + expected + ' +/- ' + delta
	    );
	  }

	  Assertion.addMethod('closeTo', closeTo);
	  Assertion.addMethod('approximately', closeTo);

	  // Note: Duplicates are ignored if testing for inclusion instead of sameness.
	  function isSubsetOf(subset, superset, cmp, contains, ordered) {
	    if (!contains) {
	      if (subset.length !== superset.length) return false;
	      superset = superset.slice();
	    }

	    return subset.every(function(elem, idx) {
	      if (ordered) return cmp ? cmp(elem, superset[idx]) : elem === superset[idx];

	      if (!cmp) {
	        var matchIdx = superset.indexOf(elem);
	        if (matchIdx === -1) return false;

	        // Remove match from superset so not counted twice if duplicate in subset.
	        if (!contains) superset.splice(matchIdx, 1);
	        return true;
	      }

	      return superset.some(function(elem2, matchIdx) {
	        if (!cmp(elem, elem2)) return false;

	        // Remove match from superset so not counted twice if duplicate in subset.
	        if (!contains) superset.splice(matchIdx, 1);
	        return true;
	      });
	    });
	  }

	  /**
	   * ### .members(set[, msg])
	   *
	   * Asserts that the target array has the same members as the given array
	   * `set`.
	   *
	   *     expect([1, 2, 3]).to.have.members([2, 1, 3]);
	   *     expect([1, 2, 2]).to.have.members([2, 1, 2]);
	   *
	   * By default, members are compared using strict (`===`) equality. Add `.deep`
	   * earlier in the chain to use deep equality instead. See the `deep-eql`
	   * project page for info on the deep equality algorithm:
	   * https://github.com/chaijs/deep-eql.
	   *
	   *     // Target array deeply (but not strictly) has member `{a: 1}`
	   *     expect([{a: 1}]).to.have.deep.members([{a: 1}]);
	   *     expect([{a: 1}]).to.not.have.members([{a: 1}]);
	   *
	   * By default, order doesn't matter. Add `.ordered` earlier in the chain to
	   * require that members appear in the same order.
	   *
	   *     expect([1, 2, 3]).to.have.ordered.members([1, 2, 3]);
	   *     expect([1, 2, 3]).to.have.members([2, 1, 3])
	   *       .but.not.ordered.members([2, 1, 3]);
	   *
	   * By default, both arrays must be the same size. Add `.include` earlier in
	   * the chain to require that the target's members be a superset of the
	   * expected members. Note that duplicates are ignored in the subset when
	   * `.include` is added.
	   *
	   *     // Target array is a superset of [1, 2] but not identical
	   *     expect([1, 2, 3]).to.include.members([1, 2]);
	   *     expect([1, 2, 3]).to.not.have.members([1, 2]);
	   *
	   *     // Duplicates in the subset are ignored
	   *     expect([1, 2, 3]).to.include.members([1, 2, 2, 2]);
	   *
	   * `.deep`, `.ordered`, and `.include` can all be combined. However, if
	   * `.include` and `.ordered` are combined, the ordering begins at the start of
	   * both arrays.
	   *
	   *     expect([{a: 1}, {b: 2}, {c: 3}])
	   *       .to.include.deep.ordered.members([{a: 1}, {b: 2}])
	   *       .but.not.include.deep.ordered.members([{b: 2}, {c: 3}]);
	   *
	   * Add `.not` earlier in the chain to negate `.members`. However, it's
	   * dangerous to do so. The problem is that it creates uncertain expectations
	   * by asserting that the target array doesn't have all of the same members as
	   * the given array `set` but may or may not have some of them. It's often best
	   * to identify the exact output that's expected, and then write an assertion
	   * that only accepts that exact output.
	   *
	   *     expect([1, 2]).to.not.include(3).and.not.include(4); // Recommended
	   *     expect([1, 2]).to.not.have.members([3, 4]); // Not recommended
	   *
	   * `.members` accepts an optional `msg` argument which is a custom error
	   * message to show when the assertion fails. The message can also be given as
	   * the second argument to `expect`.
	   *
	   *     expect([1, 2]).to.have.members([1, 2, 3], 'nooo why fail??');
	   *     expect([1, 2], 'nooo why fail??').to.have.members([1, 2, 3]);
	   *
	   * @name members
	   * @param {Array} set
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addMethod('members', function (subset, msg) {
	    if (msg) flag(this, 'message', msg);
	    var obj = flag(this, 'object')
	      , flagMsg = flag(this, 'message')
	      , ssfi = flag(this, 'ssfi');

	    new Assertion(obj, flagMsg, ssfi, true).to.be.an('array');
	    new Assertion(subset, flagMsg, ssfi, true).to.be.an('array');

	    var contains = flag(this, 'contains');
	    var ordered = flag(this, 'ordered');

	    var subject, failMsg, failNegateMsg;

	    if (contains) {
	      subject = ordered ? 'an ordered superset' : 'a superset';
	      failMsg = 'expected #{this} to be ' + subject + ' of #{exp}';
	      failNegateMsg = 'expected #{this} to not be ' + subject + ' of #{exp}';
	    } else {
	      subject = ordered ? 'ordered members' : 'members';
	      failMsg = 'expected #{this} to have the same ' + subject + ' as #{exp}';
	      failNegateMsg = 'expected #{this} to not have the same ' + subject + ' as #{exp}';
	    }

	    var cmp = flag(this, 'deep') ? _.eql : undefined;

	    this.assert(
	        isSubsetOf(subset, obj, cmp, contains, ordered)
	      , failMsg
	      , failNegateMsg
	      , subset
	      , obj
	      , true
	    );
	  });

	  /**
	   * ### .oneOf(list[, msg])
	   *
	   * Asserts that the target is a member of the given array `list`. However,
	   * it's often best to assert that the target is equal to its expected value.
	   *
	   *     expect(1).to.equal(1); // Recommended
	   *     expect(1).to.be.oneOf([1, 2, 3]); // Not recommended
	   *
	   * Comparisons are performed using strict (`===`) equality.
	   *
	   * Add `.not` earlier in the chain to negate `.oneOf`.
	   *
	   *     expect(1).to.equal(1); // Recommended
	   *     expect(1).to.not.be.oneOf([2, 3, 4]); // Not recommended
	   *
	   * It can also be chained with `.contain` or `.include`, which will work with
	   * both arrays and strings:
	   *
	   *     expect('Today is sunny').to.contain.oneOf(['sunny', 'cloudy'])
	   *     expect('Today is rainy').to.not.contain.oneOf(['sunny', 'cloudy'])
	   *     expect([1,2,3]).to.contain.oneOf([3,4,5])
	   *     expect([1,2,3]).to.not.contain.oneOf([4,5,6])
	   *
	   * `.oneOf` accepts an optional `msg` argument which is a custom error message
	   * to show when the assertion fails. The message can also be given as the
	   * second argument to `expect`.
	   *
	   *     expect(1).to.be.oneOf([2, 3, 4], 'nooo why fail??');
	   *     expect(1, 'nooo why fail??').to.be.oneOf([2, 3, 4]);
	   *
	   * @name oneOf
	   * @param {Array<*>} list
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function oneOf (list, msg) {
	    if (msg) flag(this, 'message', msg);
	    var expected = flag(this, 'object')
	      , flagMsg = flag(this, 'message')
	      , ssfi = flag(this, 'ssfi')
	      , contains = flag(this, 'contains')
	      , isDeep = flag(this, 'deep');
	    new Assertion(list, flagMsg, ssfi, true).to.be.an('array');

	    if (contains) {
	      this.assert(
	        list.some(function(possibility) { return expected.indexOf(possibility) > -1 })
	        , 'expected #{this} to contain one of #{exp}'
	        , 'expected #{this} to not contain one of #{exp}'
	        , list
	        , expected
	      );
	    } else {
	      if (isDeep) {
	        this.assert(
	          list.some(function(possibility) { return _.eql(expected, possibility) })
	          , 'expected #{this} to deeply equal one of #{exp}'
	          , 'expected #{this} to deeply equal one of #{exp}'
	          , list
	          , expected
	        );
	      } else {
	        this.assert(
	          list.indexOf(expected) > -1
	          , 'expected #{this} to be one of #{exp}'
	          , 'expected #{this} to not be one of #{exp}'
	          , list
	          , expected
	        );
	      }
	    }
	  }

	  Assertion.addMethod('oneOf', oneOf);

	  /**
	   * ### .change(subject[, prop[, msg]])
	   *
	   * When one argument is provided, `.change` asserts that the given function
	   * `subject` returns a different value when it's invoked before the target
	   * function compared to when it's invoked afterward. However, it's often best
	   * to assert that `subject` is equal to its expected value.
	   *
	   *     var dots = ''
	   *       , addDot = function () { dots += '.'; }
	   *       , getDots = function () { return dots; };
	   *
	   *     // Recommended
	   *     expect(getDots()).to.equal('');
	   *     addDot();
	   *     expect(getDots()).to.equal('.');
	   *
	   *     // Not recommended
	   *     expect(addDot).to.change(getDots);
	   *
	   * When two arguments are provided, `.change` asserts that the value of the
	   * given object `subject`'s `prop` property is different before invoking the
	   * target function compared to afterward.
	   *
	   *     var myObj = {dots: ''}
	   *       , addDot = function () { myObj.dots += '.'; };
	   *
	   *     // Recommended
	   *     expect(myObj).to.have.property('dots', '');
	   *     addDot();
	   *     expect(myObj).to.have.property('dots', '.');
	   *
	   *     // Not recommended
	   *     expect(addDot).to.change(myObj, 'dots');
	   *
	   * Strict (`===`) equality is used to compare before and after values.
	   *
	   * Add `.not` earlier in the chain to negate `.change`.
	   *
	   *     var dots = ''
	   *       , noop = function () {}
	   *       , getDots = function () { return dots; };
	   *
	   *     expect(noop).to.not.change(getDots);
	   *
	   *     var myObj = {dots: ''}
	   *       , noop = function () {};
	   *
	   *     expect(noop).to.not.change(myObj, 'dots');
	   *
	   * `.change` accepts an optional `msg` argument which is a custom error
	   * message to show when the assertion fails. The message can also be given as
	   * the second argument to `expect`. When not providing two arguments, always
	   * use the second form.
	   *
	   *     var myObj = {dots: ''}
	   *       , addDot = function () { myObj.dots += '.'; };
	   *
	   *     expect(addDot).to.not.change(myObj, 'dots', 'nooo why fail??');
	   *
	   *     var dots = ''
	   *       , addDot = function () { dots += '.'; }
	   *       , getDots = function () { return dots; };
	   *
	   *     expect(addDot, 'nooo why fail??').to.not.change(getDots);
	   *
	   * `.change` also causes all `.by` assertions that follow in the chain to
	   * assert how much a numeric subject was increased or decreased by. However,
	   * it's dangerous to use `.change.by`. The problem is that it creates
	   * uncertain expectations by asserting that the subject either increases by
	   * the given delta, or that it decreases by the given delta. It's often best
	   * to identify the exact output that's expected, and then write an assertion
	   * that only accepts that exact output.
	   *
	   *     var myObj = {val: 1}
	   *       , addTwo = function () { myObj.val += 2; }
	   *       , subtractTwo = function () { myObj.val -= 2; };
	   *
	   *     expect(addTwo).to.increase(myObj, 'val').by(2); // Recommended
	   *     expect(addTwo).to.change(myObj, 'val').by(2); // Not recommended
	   *
	   *     expect(subtractTwo).to.decrease(myObj, 'val').by(2); // Recommended
	   *     expect(subtractTwo).to.change(myObj, 'val').by(2); // Not recommended
	   *
	   * The alias `.changes` can be used interchangeably with `.change`.
	   *
	   * @name change
	   * @alias changes
	   * @param {String} subject
	   * @param {String} prop name _optional_
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function assertChanges (subject, prop, msg) {
	    if (msg) flag(this, 'message', msg);
	    var fn = flag(this, 'object')
	      , flagMsg = flag(this, 'message')
	      , ssfi = flag(this, 'ssfi');
	    new Assertion(fn, flagMsg, ssfi, true).is.a('function');

	    var initial;
	    if (!prop) {
	      new Assertion(subject, flagMsg, ssfi, true).is.a('function');
	      initial = subject();
	    } else {
	      new Assertion(subject, flagMsg, ssfi, true).to.have.property(prop);
	      initial = subject[prop];
	    }

	    fn();

	    var final = prop === undefined || prop === null ? subject() : subject[prop];
	    var msgObj = prop === undefined || prop === null ? initial : '.' + prop;

	    // This gets flagged because of the .by(delta) assertion
	    flag(this, 'deltaMsgObj', msgObj);
	    flag(this, 'initialDeltaValue', initial);
	    flag(this, 'finalDeltaValue', final);
	    flag(this, 'deltaBehavior', 'change');
	    flag(this, 'realDelta', final !== initial);

	    this.assert(
	      initial !== final
	      , 'expected ' + msgObj + ' to change'
	      , 'expected ' + msgObj + ' to not change'
	    );
	  }

	  Assertion.addMethod('change', assertChanges);
	  Assertion.addMethod('changes', assertChanges);

	  /**
	   * ### .increase(subject[, prop[, msg]])
	   *
	   * When one argument is provided, `.increase` asserts that the given function
	   * `subject` returns a greater number when it's invoked after invoking the
	   * target function compared to when it's invoked beforehand. `.increase` also
	   * causes all `.by` assertions that follow in the chain to assert how much
	   * greater of a number is returned. It's often best to assert that the return
	   * value increased by the expected amount, rather than asserting it increased
	   * by any amount.
	   *
	   *     var val = 1
	   *       , addTwo = function () { val += 2; }
	   *       , getVal = function () { return val; };
	   *
	   *     expect(addTwo).to.increase(getVal).by(2); // Recommended
	   *     expect(addTwo).to.increase(getVal); // Not recommended
	   *
	   * When two arguments are provided, `.increase` asserts that the value of the
	   * given object `subject`'s `prop` property is greater after invoking the
	   * target function compared to beforehand.
	   *
	   *     var myObj = {val: 1}
	   *       , addTwo = function () { myObj.val += 2; };
	   *
	   *     expect(addTwo).to.increase(myObj, 'val').by(2); // Recommended
	   *     expect(addTwo).to.increase(myObj, 'val'); // Not recommended
	   *
	   * Add `.not` earlier in the chain to negate `.increase`. However, it's
	   * dangerous to do so. The problem is that it creates uncertain expectations
	   * by asserting that the subject either decreases, or that it stays the same.
	   * It's often best to identify the exact output that's expected, and then
	   * write an assertion that only accepts that exact output.
	   *
	   * When the subject is expected to decrease, it's often best to assert that it
	   * decreased by the expected amount.
	   *
	   *     var myObj = {val: 1}
	   *       , subtractTwo = function () { myObj.val -= 2; };
	   *
	   *     expect(subtractTwo).to.decrease(myObj, 'val').by(2); // Recommended
	   *     expect(subtractTwo).to.not.increase(myObj, 'val'); // Not recommended
	   *
	   * When the subject is expected to stay the same, it's often best to assert
	   * exactly that.
	   *
	   *     var myObj = {val: 1}
	   *       , noop = function () {};
	   *
	   *     expect(noop).to.not.change(myObj, 'val'); // Recommended
	   *     expect(noop).to.not.increase(myObj, 'val'); // Not recommended
	   *
	   * `.increase` accepts an optional `msg` argument which is a custom error
	   * message to show when the assertion fails. The message can also be given as
	   * the second argument to `expect`. When not providing two arguments, always
	   * use the second form.
	   *
	   *     var myObj = {val: 1}
	   *       , noop = function () {};
	   *
	   *     expect(noop).to.increase(myObj, 'val', 'nooo why fail??');
	   *
	   *     var val = 1
	   *       , noop = function () {}
	   *       , getVal = function () { return val; };
	   *
	   *     expect(noop, 'nooo why fail??').to.increase(getVal);
	   *
	   * The alias `.increases` can be used interchangeably with `.increase`.
	   *
	   * @name increase
	   * @alias increases
	   * @param {String|Function} subject
	   * @param {String} prop name _optional_
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function assertIncreases (subject, prop, msg) {
	    if (msg) flag(this, 'message', msg);
	    var fn = flag(this, 'object')
	      , flagMsg = flag(this, 'message')
	      , ssfi = flag(this, 'ssfi');
	    new Assertion(fn, flagMsg, ssfi, true).is.a('function');

	    var initial;
	    if (!prop) {
	      new Assertion(subject, flagMsg, ssfi, true).is.a('function');
	      initial = subject();
	    } else {
	      new Assertion(subject, flagMsg, ssfi, true).to.have.property(prop);
	      initial = subject[prop];
	    }

	    // Make sure that the target is a number
	    new Assertion(initial, flagMsg, ssfi, true).is.a('number');

	    fn();

	    var final = prop === undefined || prop === null ? subject() : subject[prop];
	    var msgObj = prop === undefined || prop === null ? initial : '.' + prop;

	    flag(this, 'deltaMsgObj', msgObj);
	    flag(this, 'initialDeltaValue', initial);
	    flag(this, 'finalDeltaValue', final);
	    flag(this, 'deltaBehavior', 'increase');
	    flag(this, 'realDelta', final - initial);

	    this.assert(
	      final - initial > 0
	      , 'expected ' + msgObj + ' to increase'
	      , 'expected ' + msgObj + ' to not increase'
	    );
	  }

	  Assertion.addMethod('increase', assertIncreases);
	  Assertion.addMethod('increases', assertIncreases);

	  /**
	   * ### .decrease(subject[, prop[, msg]])
	   *
	   * When one argument is provided, `.decrease` asserts that the given function
	   * `subject` returns a lesser number when it's invoked after invoking the
	   * target function compared to when it's invoked beforehand. `.decrease` also
	   * causes all `.by` assertions that follow in the chain to assert how much
	   * lesser of a number is returned. It's often best to assert that the return
	   * value decreased by the expected amount, rather than asserting it decreased
	   * by any amount.
	   *
	   *     var val = 1
	   *       , subtractTwo = function () { val -= 2; }
	   *       , getVal = function () { return val; };
	   *
	   *     expect(subtractTwo).to.decrease(getVal).by(2); // Recommended
	   *     expect(subtractTwo).to.decrease(getVal); // Not recommended
	   *
	   * When two arguments are provided, `.decrease` asserts that the value of the
	   * given object `subject`'s `prop` property is lesser after invoking the
	   * target function compared to beforehand.
	   *
	   *     var myObj = {val: 1}
	   *       , subtractTwo = function () { myObj.val -= 2; };
	   *
	   *     expect(subtractTwo).to.decrease(myObj, 'val').by(2); // Recommended
	   *     expect(subtractTwo).to.decrease(myObj, 'val'); // Not recommended
	   *
	   * Add `.not` earlier in the chain to negate `.decrease`. However, it's
	   * dangerous to do so. The problem is that it creates uncertain expectations
	   * by asserting that the subject either increases, or that it stays the same.
	   * It's often best to identify the exact output that's expected, and then
	   * write an assertion that only accepts that exact output.
	   *
	   * When the subject is expected to increase, it's often best to assert that it
	   * increased by the expected amount.
	   *
	   *     var myObj = {val: 1}
	   *       , addTwo = function () { myObj.val += 2; };
	   *
	   *     expect(addTwo).to.increase(myObj, 'val').by(2); // Recommended
	   *     expect(addTwo).to.not.decrease(myObj, 'val'); // Not recommended
	   *
	   * When the subject is expected to stay the same, it's often best to assert
	   * exactly that.
	   *
	   *     var myObj = {val: 1}
	   *       , noop = function () {};
	   *
	   *     expect(noop).to.not.change(myObj, 'val'); // Recommended
	   *     expect(noop).to.not.decrease(myObj, 'val'); // Not recommended
	   *
	   * `.decrease` accepts an optional `msg` argument which is a custom error
	   * message to show when the assertion fails. The message can also be given as
	   * the second argument to `expect`. When not providing two arguments, always
	   * use the second form.
	   *
	   *     var myObj = {val: 1}
	   *       , noop = function () {};
	   *
	   *     expect(noop).to.decrease(myObj, 'val', 'nooo why fail??');
	   *
	   *     var val = 1
	   *       , noop = function () {}
	   *       , getVal = function () { return val; };
	   *
	   *     expect(noop, 'nooo why fail??').to.decrease(getVal);
	   *
	   * The alias `.decreases` can be used interchangeably with `.decrease`.
	   *
	   * @name decrease
	   * @alias decreases
	   * @param {String|Function} subject
	   * @param {String} prop name _optional_
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function assertDecreases (subject, prop, msg) {
	    if (msg) flag(this, 'message', msg);
	    var fn = flag(this, 'object')
	      , flagMsg = flag(this, 'message')
	      , ssfi = flag(this, 'ssfi');
	    new Assertion(fn, flagMsg, ssfi, true).is.a('function');

	    var initial;
	    if (!prop) {
	      new Assertion(subject, flagMsg, ssfi, true).is.a('function');
	      initial = subject();
	    } else {
	      new Assertion(subject, flagMsg, ssfi, true).to.have.property(prop);
	      initial = subject[prop];
	    }

	    // Make sure that the target is a number
	    new Assertion(initial, flagMsg, ssfi, true).is.a('number');

	    fn();

	    var final = prop === undefined || prop === null ? subject() : subject[prop];
	    var msgObj = prop === undefined || prop === null ? initial : '.' + prop;

	    flag(this, 'deltaMsgObj', msgObj);
	    flag(this, 'initialDeltaValue', initial);
	    flag(this, 'finalDeltaValue', final);
	    flag(this, 'deltaBehavior', 'decrease');
	    flag(this, 'realDelta', initial - final);

	    this.assert(
	      final - initial < 0
	      , 'expected ' + msgObj + ' to decrease'
	      , 'expected ' + msgObj + ' to not decrease'
	    );
	  }

	  Assertion.addMethod('decrease', assertDecreases);
	  Assertion.addMethod('decreases', assertDecreases);

	  /**
	   * ### .by(delta[, msg])
	   *
	   * When following an `.increase` assertion in the chain, `.by` asserts that
	   * the subject of the `.increase` assertion increased by the given `delta`.
	   *
	   *     var myObj = {val: 1}
	   *       , addTwo = function () { myObj.val += 2; };
	   *
	   *     expect(addTwo).to.increase(myObj, 'val').by(2);
	   *
	   * When following a `.decrease` assertion in the chain, `.by` asserts that the
	   * subject of the `.decrease` assertion decreased by the given `delta`.
	   *
	   *     var myObj = {val: 1}
	   *       , subtractTwo = function () { myObj.val -= 2; };
	   *
	   *     expect(subtractTwo).to.decrease(myObj, 'val').by(2);
	   *
	   * When following a `.change` assertion in the chain, `.by` asserts that the
	   * subject of the `.change` assertion either increased or decreased by the
	   * given `delta`. However, it's dangerous to use `.change.by`. The problem is
	   * that it creates uncertain expectations. It's often best to identify the
	   * exact output that's expected, and then write an assertion that only accepts
	   * that exact output.
	   *
	   *     var myObj = {val: 1}
	   *       , addTwo = function () { myObj.val += 2; }
	   *       , subtractTwo = function () { myObj.val -= 2; };
	   *
	   *     expect(addTwo).to.increase(myObj, 'val').by(2); // Recommended
	   *     expect(addTwo).to.change(myObj, 'val').by(2); // Not recommended
	   *
	   *     expect(subtractTwo).to.decrease(myObj, 'val').by(2); // Recommended
	   *     expect(subtractTwo).to.change(myObj, 'val').by(2); // Not recommended
	   *
	   * Add `.not` earlier in the chain to negate `.by`. However, it's often best
	   * to assert that the subject changed by its expected delta, rather than
	   * asserting that it didn't change by one of countless unexpected deltas.
	   *
	   *     var myObj = {val: 1}
	   *       , addTwo = function () { myObj.val += 2; };
	   *
	   *     // Recommended
	   *     expect(addTwo).to.increase(myObj, 'val').by(2);
	   *
	   *     // Not recommended
	   *     expect(addTwo).to.increase(myObj, 'val').but.not.by(3);
	   *
	   * `.by` accepts an optional `msg` argument which is a custom error message to
	   * show when the assertion fails. The message can also be given as the second
	   * argument to `expect`.
	   *
	   *     var myObj = {val: 1}
	   *       , addTwo = function () { myObj.val += 2; };
	   *
	   *     expect(addTwo).to.increase(myObj, 'val').by(3, 'nooo why fail??');
	   *     expect(addTwo, 'nooo why fail??').to.increase(myObj, 'val').by(3);
	   *
	   * @name by
	   * @param {Number} delta
	   * @param {String} msg _optional_
	   * @namespace BDD
	   * @api public
	   */

	  function assertDelta(delta, msg) {
	    if (msg) flag(this, 'message', msg);

	    var msgObj = flag(this, 'deltaMsgObj');
	    var initial = flag(this, 'initialDeltaValue');
	    var final = flag(this, 'finalDeltaValue');
	    var behavior = flag(this, 'deltaBehavior');
	    var realDelta = flag(this, 'realDelta');

	    var expression;
	    if (behavior === 'change') {
	      expression = Math.abs(final - initial) === Math.abs(delta);
	    } else {
	      expression = realDelta === Math.abs(delta);
	    }

	    this.assert(
	      expression
	      , 'expected ' + msgObj + ' to ' + behavior + ' by ' + delta
	      , 'expected ' + msgObj + ' to not ' + behavior + ' by ' + delta
	    );
	  }

	  Assertion.addMethod('by', assertDelta);

	  /**
	   * ### .extensible
	   *
	   * Asserts that the target is extensible, which means that new properties can
	   * be added to it. Primitives are never extensible.
	   *
	   *     expect({a: 1}).to.be.extensible;
	   *
	   * Add `.not` earlier in the chain to negate `.extensible`.
	   *
	   *     var nonExtensibleObject = Object.preventExtensions({})
	   *       , sealedObject = Object.seal({})
	   *       , frozenObject = Object.freeze({});
	   *
	   *     expect(nonExtensibleObject).to.not.be.extensible;
	   *     expect(sealedObject).to.not.be.extensible;
	   *     expect(frozenObject).to.not.be.extensible;
	   *     expect(1).to.not.be.extensible;
	   *
	   * A custom error message can be given as the second argument to `expect`.
	   *
	   *     expect(1, 'nooo why fail??').to.be.extensible;
	   *
	   * @name extensible
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('extensible', function() {
	    var obj = flag(this, 'object');

	    // In ES5, if the argument to this method is a primitive, then it will cause a TypeError.
	    // In ES6, a non-object argument will be treated as if it was a non-extensible ordinary object, simply return false.
	    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isExtensible
	    // The following provides ES6 behavior for ES5 environments.

	    var isExtensible = obj === Object(obj) && Object.isExtensible(obj);

	    this.assert(
	      isExtensible
	      , 'expected #{this} to be extensible'
	      , 'expected #{this} to not be extensible'
	    );
	  });

	  /**
	   * ### .sealed
	   *
	   * Asserts that the target is sealed, which means that new properties can't be
	   * added to it, and its existing properties can't be reconfigured or deleted.
	   * However, it's possible that its existing properties can still be reassigned
	   * to different values. Primitives are always sealed.
	   *
	   *     var sealedObject = Object.seal({});
	   *     var frozenObject = Object.freeze({});
	   *
	   *     expect(sealedObject).to.be.sealed;
	   *     expect(frozenObject).to.be.sealed;
	   *     expect(1).to.be.sealed;
	   *
	   * Add `.not` earlier in the chain to negate `.sealed`.
	   *
	   *     expect({a: 1}).to.not.be.sealed;
	   *
	   * A custom error message can be given as the second argument to `expect`.
	   *
	   *     expect({a: 1}, 'nooo why fail??').to.be.sealed;
	   *
	   * @name sealed
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('sealed', function() {
	    var obj = flag(this, 'object');

	    // In ES5, if the argument to this method is a primitive, then it will cause a TypeError.
	    // In ES6, a non-object argument will be treated as if it was a sealed ordinary object, simply return true.
	    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isSealed
	    // The following provides ES6 behavior for ES5 environments.

	    var isSealed = obj === Object(obj) ? Object.isSealed(obj) : true;

	    this.assert(
	      isSealed
	      , 'expected #{this} to be sealed'
	      , 'expected #{this} to not be sealed'
	    );
	  });

	  /**
	   * ### .frozen
	   *
	   * Asserts that the target is frozen, which means that new properties can't be
	   * added to it, and its existing properties can't be reassigned to different
	   * values, reconfigured, or deleted. Primitives are always frozen.
	   *
	   *     var frozenObject = Object.freeze({});
	   *
	   *     expect(frozenObject).to.be.frozen;
	   *     expect(1).to.be.frozen;
	   *
	   * Add `.not` earlier in the chain to negate `.frozen`.
	   *
	   *     expect({a: 1}).to.not.be.frozen;
	   *
	   * A custom error message can be given as the second argument to `expect`.
	   *
	   *     expect({a: 1}, 'nooo why fail??').to.be.frozen;
	   *
	   * @name frozen
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('frozen', function() {
	    var obj = flag(this, 'object');

	    // In ES5, if the argument to this method is a primitive, then it will cause a TypeError.
	    // In ES6, a non-object argument will be treated as if it was a frozen ordinary object, simply return true.
	    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isFrozen
	    // The following provides ES6 behavior for ES5 environments.

	    var isFrozen = obj === Object(obj) ? Object.isFrozen(obj) : true;

	    this.assert(
	      isFrozen
	      , 'expected #{this} to be frozen'
	      , 'expected #{this} to not be frozen'
	    );
	  });

	  /**
	   * ### .finite
	   *
	   * Asserts that the target is a number, and isn't `NaN` or positive/negative
	   * `Infinity`.
	   *
	   *     expect(1).to.be.finite;
	   *
	   * Add `.not` earlier in the chain to negate `.finite`. However, it's
	   * dangerous to do so. The problem is that it creates uncertain expectations
	   * by asserting that the subject either isn't a number, or that it's `NaN`, or
	   * that it's positive `Infinity`, or that it's negative `Infinity`. It's often
	   * best to identify the exact output that's expected, and then write an
	   * assertion that only accepts that exact output.
	   *
	   * When the target isn't expected to be a number, it's often best to assert
	   * that it's the expected type, rather than asserting that it isn't one of
	   * many unexpected types.
	   *
	   *     expect('foo').to.be.a('string'); // Recommended
	   *     expect('foo').to.not.be.finite; // Not recommended
	   *
	   * When the target is expected to be `NaN`, it's often best to assert exactly
	   * that.
	   *
	   *     expect(NaN).to.be.NaN; // Recommended
	   *     expect(NaN).to.not.be.finite; // Not recommended
	   *
	   * When the target is expected to be positive infinity, it's often best to
	   * assert exactly that.
	   *
	   *     expect(Infinity).to.equal(Infinity); // Recommended
	   *     expect(Infinity).to.not.be.finite; // Not recommended
	   *
	   * When the target is expected to be negative infinity, it's often best to
	   * assert exactly that.
	   *
	   *     expect(-Infinity).to.equal(-Infinity); // Recommended
	   *     expect(-Infinity).to.not.be.finite; // Not recommended
	   *
	   * A custom error message can be given as the second argument to `expect`.
	   *
	   *     expect('foo', 'nooo why fail??').to.be.finite;
	   *
	   * @name finite
	   * @namespace BDD
	   * @api public
	   */

	  Assertion.addProperty('finite', function(msg) {
	    var obj = flag(this, 'object');

	    this.assert(
	        typeof obj === 'number' && isFinite(obj)
	      , 'expected #{this} to be a finite number'
	      , 'expected #{this} to not be a finite number'
	    );
	  });
	};

	var assertions$1 = /*@__PURE__*/getDefaultExportFromCjs(assertions);

	/*!
	 * chai
	 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	var expect$1 = function (chai, util) {
	  chai.expect = function (val, message) {
	    return new chai.Assertion(val, message);
	  };

	  /**
	   * ### .fail([message])
	   * ### .fail(actual, expected, [message], [operator])
	   *
	   * Throw a failure.
	   *
	   *     expect.fail();
	   *     expect.fail("custom error message");
	   *     expect.fail(1, 2);
	   *     expect.fail(1, 2, "custom error message");
	   *     expect.fail(1, 2, "custom error message", ">");
	   *     expect.fail(1, 2, undefined, ">");
	   *
	   * @name fail
	   * @param {Mixed} actual
	   * @param {Mixed} expected
	   * @param {String} message
	   * @param {String} operator
	   * @namespace BDD
	   * @api public
	   */

	  chai.expect.fail = function (actual, expected, message, operator) {
	    if (arguments.length < 2) {
	        message = actual;
	        actual = undefined;
	    }

	    message = message || 'expect.fail()';
	    throw new chai.AssertionError(message, {
	        actual: actual
	      , expected: expected
	      , operator: operator
	    }, chai.expect.fail);
	  };
	};

	var expect$2 = /*@__PURE__*/getDefaultExportFromCjs(expect$1);

	/*!
	 * chai
	 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	var should$1 = function (chai, util) {
	  var Assertion = chai.Assertion;

	  function loadShould () {
	    // explicitly define this method as function as to have it's name to include as `ssfi`
	    function shouldGetter() {
	      if (this instanceof String
	          || this instanceof Number
	          || this instanceof Boolean
	          || typeof Symbol === 'function' && this instanceof Symbol
	          || typeof BigInt === 'function' && this instanceof BigInt) {
	        return new Assertion(this.valueOf(), null, shouldGetter);
	      }
	      return new Assertion(this, null, shouldGetter);
	    }
	    function shouldSetter(value) {
	      // See https://github.com/chaijs/chai/issues/86: this makes
	      // `whatever.should = someValue` actually set `someValue`, which is
	      // especially useful for `global.should = require('chai').should()`.
	      //
	      // Note that we have to use [[DefineProperty]] instead of [[Put]]
	      // since otherwise we would trigger this very setter!
	      Object.defineProperty(this, 'should', {
	        value: value,
	        enumerable: true,
	        configurable: true,
	        writable: true
	      });
	    }
	    // modify Object.prototype to have `should`
	    Object.defineProperty(Object.prototype, 'should', {
	      set: shouldSetter
	      , get: shouldGetter
	      , configurable: true
	    });

	    var should = {};

	    /**
	     * ### .fail([message])
	     * ### .fail(actual, expected, [message], [operator])
	     *
	     * Throw a failure.
	     *
	     *     should.fail();
	     *     should.fail("custom error message");
	     *     should.fail(1, 2);
	     *     should.fail(1, 2, "custom error message");
	     *     should.fail(1, 2, "custom error message", ">");
	     *     should.fail(1, 2, undefined, ">");
	     *
	     *
	     * @name fail
	     * @param {Mixed} actual
	     * @param {Mixed} expected
	     * @param {String} message
	     * @param {String} operator
	     * @namespace BDD
	     * @api public
	     */

	    should.fail = function (actual, expected, message, operator) {
	      if (arguments.length < 2) {
	          message = actual;
	          actual = undefined;
	      }

	      message = message || 'should.fail()';
	      throw new chai.AssertionError(message, {
	          actual: actual
	        , expected: expected
	        , operator: operator
	      }, should.fail);
	    };

	    /**
	     * ### .equal(actual, expected, [message])
	     *
	     * Asserts non-strict equality (`==`) of `actual` and `expected`.
	     *
	     *     should.equal(3, '3', '== coerces values to strings');
	     *
	     * @name equal
	     * @param {Mixed} actual
	     * @param {Mixed} expected
	     * @param {String} message
	     * @namespace Should
	     * @api public
	     */

	    should.equal = function (val1, val2, msg) {
	      new Assertion(val1, msg).to.equal(val2);
	    };

	    /**
	     * ### .throw(function, [constructor/string/regexp], [string/regexp], [message])
	     *
	     * Asserts that `function` will throw an error that is an instance of
	     * `constructor`, or alternately that it will throw an error with message
	     * matching `regexp`.
	     *
	     *     should.throw(fn, 'function throws a reference error');
	     *     should.throw(fn, /function throws a reference error/);
	     *     should.throw(fn, ReferenceError);
	     *     should.throw(fn, ReferenceError, 'function throws a reference error');
	     *     should.throw(fn, ReferenceError, /function throws a reference error/);
	     *
	     * @name throw
	     * @alias Throw
	     * @param {Function} function
	     * @param {ErrorConstructor} constructor
	     * @param {RegExp} regexp
	     * @param {String} message
	     * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
	     * @namespace Should
	     * @api public
	     */

	    should.Throw = function (fn, errt, errs, msg) {
	      new Assertion(fn, msg).to.Throw(errt, errs);
	    };

	    /**
	     * ### .exist
	     *
	     * Asserts that the target is neither `null` nor `undefined`.
	     *
	     *     var foo = 'hi';
	     *
	     *     should.exist(foo, 'foo exists');
	     *
	     * @name exist
	     * @namespace Should
	     * @api public
	     */

	    should.exist = function (val, msg) {
	      new Assertion(val, msg).to.exist;
	    };

	    // negation
	    should.not = {};

	    /**
	     * ### .not.equal(actual, expected, [message])
	     *
	     * Asserts non-strict inequality (`!=`) of `actual` and `expected`.
	     *
	     *     should.not.equal(3, 4, 'these numbers are not equal');
	     *
	     * @name not.equal
	     * @param {Mixed} actual
	     * @param {Mixed} expected
	     * @param {String} message
	     * @namespace Should
	     * @api public
	     */

	    should.not.equal = function (val1, val2, msg) {
	      new Assertion(val1, msg).to.not.equal(val2);
	    };

	    /**
	     * ### .throw(function, [constructor/regexp], [message])
	     *
	     * Asserts that `function` will _not_ throw an error that is an instance of
	     * `constructor`, or alternately that it will not throw an error with message
	     * matching `regexp`.
	     *
	     *     should.not.throw(fn, Error, 'function does not throw');
	     *
	     * @name not.throw
	     * @alias not.Throw
	     * @param {Function} function
	     * @param {ErrorConstructor} constructor
	     * @param {RegExp} regexp
	     * @param {String} message
	     * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
	     * @namespace Should
	     * @api public
	     */

	    should.not.Throw = function (fn, errt, errs, msg) {
	      new Assertion(fn, msg).to.not.Throw(errt, errs);
	    };

	    /**
	     * ### .not.exist
	     *
	     * Asserts that the target is neither `null` nor `undefined`.
	     *
	     *     var bar = null;
	     *
	     *     should.not.exist(bar, 'bar does not exist');
	     *
	     * @name not.exist
	     * @namespace Should
	     * @api public
	     */

	    should.not.exist = function (val, msg) {
	      new Assertion(val, msg).to.not.exist;
	    };

	    should['throw'] = should['Throw'];
	    should.not['throw'] = should.not['Throw'];

	    return should;
	  };

	  chai.should = loadShould;
	  chai.Should = loadShould;
	};

	var should$2 = /*@__PURE__*/getDefaultExportFromCjs(should$1);

	/*!
	 * chai
	 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	var assert$1 = function (chai, util) {
	  /*!
	   * Chai dependencies.
	   */

	  var Assertion = chai.Assertion
	    , flag = util.flag;

	  /*!
	   * Module export.
	   */

	  /**
	   * ### assert(expression, message)
	   *
	   * Write your own test expressions.
	   *
	   *     assert('foo' !== 'bar', 'foo is not bar');
	   *     assert(Array.isArray([]), 'empty arrays are arrays');
	   *
	   * @param {Mixed} expression to test for truthiness
	   * @param {String} message to display on error
	   * @name assert
	   * @namespace Assert
	   * @api public
	   */

	  var assert = chai.assert = function (express, errmsg) {
	    var test = new Assertion(null, null, chai.assert, true);
	    test.assert(
	        express
	      , errmsg
	      , '[ negation message unavailable ]'
	    );
	  };

	  /**
	   * ### .fail([message])
	   * ### .fail(actual, expected, [message], [operator])
	   *
	   * Throw a failure. Node.js `assert` module-compatible.
	   *
	   *     assert.fail();
	   *     assert.fail("custom error message");
	   *     assert.fail(1, 2);
	   *     assert.fail(1, 2, "custom error message");
	   *     assert.fail(1, 2, "custom error message", ">");
	   *     assert.fail(1, 2, undefined, ">");
	   *
	   * @name fail
	   * @param {Mixed} actual
	   * @param {Mixed} expected
	   * @param {String} message
	   * @param {String} operator
	   * @namespace Assert
	   * @api public
	   */

	  assert.fail = function (actual, expected, message, operator) {
	    if (arguments.length < 2) {
	        // Comply with Node's fail([message]) interface

	        message = actual;
	        actual = undefined;
	    }

	    message = message || 'assert.fail()';
	    throw new chai.AssertionError(message, {
	        actual: actual
	      , expected: expected
	      , operator: operator
	    }, assert.fail);
	  };

	  /**
	   * ### .isOk(object, [message])
	   *
	   * Asserts that `object` is truthy.
	   *
	   *     assert.isOk('everything', 'everything is ok');
	   *     assert.isOk(false, 'this will fail');
	   *
	   * @name isOk
	   * @alias ok
	   * @param {Mixed} object to test
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isOk = function (val, msg) {
	    new Assertion(val, msg, assert.isOk, true).is.ok;
	  };

	  /**
	   * ### .isNotOk(object, [message])
	   *
	   * Asserts that `object` is falsy.
	   *
	   *     assert.isNotOk('everything', 'this will fail');
	   *     assert.isNotOk(false, 'this will pass');
	   *
	   * @name isNotOk
	   * @alias notOk
	   * @param {Mixed} object to test
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNotOk = function (val, msg) {
	    new Assertion(val, msg, assert.isNotOk, true).is.not.ok;
	  };

	  /**
	   * ### .equal(actual, expected, [message])
	   *
	   * Asserts non-strict equality (`==`) of `actual` and `expected`.
	   *
	   *     assert.equal(3, '3', '== coerces values to strings');
	   *
	   * @name equal
	   * @param {Mixed} actual
	   * @param {Mixed} expected
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.equal = function (act, exp, msg) {
	    var test = new Assertion(act, msg, assert.equal, true);

	    test.assert(
	        exp == flag(test, 'object')
	      , 'expected #{this} to equal #{exp}'
	      , 'expected #{this} to not equal #{act}'
	      , exp
	      , act
	      , true
	    );
	  };

	  /**
	   * ### .notEqual(actual, expected, [message])
	   *
	   * Asserts non-strict inequality (`!=`) of `actual` and `expected`.
	   *
	   *     assert.notEqual(3, 4, 'these numbers are not equal');
	   *
	   * @name notEqual
	   * @param {Mixed} actual
	   * @param {Mixed} expected
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notEqual = function (act, exp, msg) {
	    var test = new Assertion(act, msg, assert.notEqual, true);

	    test.assert(
	        exp != flag(test, 'object')
	      , 'expected #{this} to not equal #{exp}'
	      , 'expected #{this} to equal #{act}'
	      , exp
	      , act
	      , true
	    );
	  };

	  /**
	   * ### .strictEqual(actual, expected, [message])
	   *
	   * Asserts strict equality (`===`) of `actual` and `expected`.
	   *
	   *     assert.strictEqual(true, true, 'these booleans are strictly equal');
	   *
	   * @name strictEqual
	   * @param {Mixed} actual
	   * @param {Mixed} expected
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.strictEqual = function (act, exp, msg) {
	    new Assertion(act, msg, assert.strictEqual, true).to.equal(exp);
	  };

	  /**
	   * ### .notStrictEqual(actual, expected, [message])
	   *
	   * Asserts strict inequality (`!==`) of `actual` and `expected`.
	   *
	   *     assert.notStrictEqual(3, '3', 'no coercion for strict equality');
	   *
	   * @name notStrictEqual
	   * @param {Mixed} actual
	   * @param {Mixed} expected
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notStrictEqual = function (act, exp, msg) {
	    new Assertion(act, msg, assert.notStrictEqual, true).to.not.equal(exp);
	  };

	  /**
	   * ### .deepEqual(actual, expected, [message])
	   *
	   * Asserts that `actual` is deeply equal to `expected`.
	   *
	   *     assert.deepEqual({ tea: 'green' }, { tea: 'green' });
	   *
	   * @name deepEqual
	   * @param {Mixed} actual
	   * @param {Mixed} expected
	   * @param {String} message
	   * @alias deepStrictEqual
	   * @namespace Assert
	   * @api public
	   */

	  assert.deepEqual = assert.deepStrictEqual = function (act, exp, msg) {
	    new Assertion(act, msg, assert.deepEqual, true).to.eql(exp);
	  };

	  /**
	   * ### .notDeepEqual(actual, expected, [message])
	   *
	   * Assert that `actual` is not deeply equal to `expected`.
	   *
	   *     assert.notDeepEqual({ tea: 'green' }, { tea: 'jasmine' });
	   *
	   * @name notDeepEqual
	   * @param {Mixed} actual
	   * @param {Mixed} expected
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notDeepEqual = function (act, exp, msg) {
	    new Assertion(act, msg, assert.notDeepEqual, true).to.not.eql(exp);
	  };

	   /**
	   * ### .isAbove(valueToCheck, valueToBeAbove, [message])
	   *
	   * Asserts `valueToCheck` is strictly greater than (>) `valueToBeAbove`.
	   *
	   *     assert.isAbove(5, 2, '5 is strictly greater than 2');
	   *
	   * @name isAbove
	   * @param {Mixed} valueToCheck
	   * @param {Mixed} valueToBeAbove
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isAbove = function (val, abv, msg) {
	    new Assertion(val, msg, assert.isAbove, true).to.be.above(abv);
	  };

	   /**
	   * ### .isAtLeast(valueToCheck, valueToBeAtLeast, [message])
	   *
	   * Asserts `valueToCheck` is greater than or equal to (>=) `valueToBeAtLeast`.
	   *
	   *     assert.isAtLeast(5, 2, '5 is greater or equal to 2');
	   *     assert.isAtLeast(3, 3, '3 is greater or equal to 3');
	   *
	   * @name isAtLeast
	   * @param {Mixed} valueToCheck
	   * @param {Mixed} valueToBeAtLeast
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isAtLeast = function (val, atlst, msg) {
	    new Assertion(val, msg, assert.isAtLeast, true).to.be.least(atlst);
	  };

	   /**
	   * ### .isBelow(valueToCheck, valueToBeBelow, [message])
	   *
	   * Asserts `valueToCheck` is strictly less than (<) `valueToBeBelow`.
	   *
	   *     assert.isBelow(3, 6, '3 is strictly less than 6');
	   *
	   * @name isBelow
	   * @param {Mixed} valueToCheck
	   * @param {Mixed} valueToBeBelow
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isBelow = function (val, blw, msg) {
	    new Assertion(val, msg, assert.isBelow, true).to.be.below(blw);
	  };

	   /**
	   * ### .isAtMost(valueToCheck, valueToBeAtMost, [message])
	   *
	   * Asserts `valueToCheck` is less than or equal to (<=) `valueToBeAtMost`.
	   *
	   *     assert.isAtMost(3, 6, '3 is less than or equal to 6');
	   *     assert.isAtMost(4, 4, '4 is less than or equal to 4');
	   *
	   * @name isAtMost
	   * @param {Mixed} valueToCheck
	   * @param {Mixed} valueToBeAtMost
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isAtMost = function (val, atmst, msg) {
	    new Assertion(val, msg, assert.isAtMost, true).to.be.most(atmst);
	  };

	  /**
	   * ### .isTrue(value, [message])
	   *
	   * Asserts that `value` is true.
	   *
	   *     var teaServed = true;
	   *     assert.isTrue(teaServed, 'the tea has been served');
	   *
	   * @name isTrue
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isTrue = function (val, msg) {
	    new Assertion(val, msg, assert.isTrue, true).is['true'];
	  };

	  /**
	   * ### .isNotTrue(value, [message])
	   *
	   * Asserts that `value` is not true.
	   *
	   *     var tea = 'tasty chai';
	   *     assert.isNotTrue(tea, 'great, time for tea!');
	   *
	   * @name isNotTrue
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNotTrue = function (val, msg) {
	    new Assertion(val, msg, assert.isNotTrue, true).to.not.equal(true);
	  };

	  /**
	   * ### .isFalse(value, [message])
	   *
	   * Asserts that `value` is false.
	   *
	   *     var teaServed = false;
	   *     assert.isFalse(teaServed, 'no tea yet? hmm...');
	   *
	   * @name isFalse
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isFalse = function (val, msg) {
	    new Assertion(val, msg, assert.isFalse, true).is['false'];
	  };

	  /**
	   * ### .isNotFalse(value, [message])
	   *
	   * Asserts that `value` is not false.
	   *
	   *     var tea = 'tasty chai';
	   *     assert.isNotFalse(tea, 'great, time for tea!');
	   *
	   * @name isNotFalse
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNotFalse = function (val, msg) {
	    new Assertion(val, msg, assert.isNotFalse, true).to.not.equal(false);
	  };

	  /**
	   * ### .isNull(value, [message])
	   *
	   * Asserts that `value` is null.
	   *
	   *     assert.isNull(err, 'there was no error');
	   *
	   * @name isNull
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNull = function (val, msg) {
	    new Assertion(val, msg, assert.isNull, true).to.equal(null);
	  };

	  /**
	   * ### .isNotNull(value, [message])
	   *
	   * Asserts that `value` is not null.
	   *
	   *     var tea = 'tasty chai';
	   *     assert.isNotNull(tea, 'great, time for tea!');
	   *
	   * @name isNotNull
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNotNull = function (val, msg) {
	    new Assertion(val, msg, assert.isNotNull, true).to.not.equal(null);
	  };

	  /**
	   * ### .isNaN
	   *
	   * Asserts that value is NaN.
	   *
	   *     assert.isNaN(NaN, 'NaN is NaN');
	   *
	   * @name isNaN
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNaN = function (val, msg) {
	    new Assertion(val, msg, assert.isNaN, true).to.be.NaN;
	  };

	  /**
	   * ### .isNotNaN
	   *
	   * Asserts that value is not NaN.
	   *
	   *     assert.isNotNaN(4, '4 is not NaN');
	   *
	   * @name isNotNaN
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */
	  assert.isNotNaN = function (val, msg) {
	    new Assertion(val, msg, assert.isNotNaN, true).not.to.be.NaN;
	  };

	  /**
	   * ### .exists
	   *
	   * Asserts that the target is neither `null` nor `undefined`.
	   *
	   *     var foo = 'hi';
	   *
	   *     assert.exists(foo, 'foo is neither `null` nor `undefined`');
	   *
	   * @name exists
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.exists = function (val, msg) {
	    new Assertion(val, msg, assert.exists, true).to.exist;
	  };

	  /**
	   * ### .notExists
	   *
	   * Asserts that the target is either `null` or `undefined`.
	   *
	   *     var bar = null
	   *       , baz;
	   *
	   *     assert.notExists(bar);
	   *     assert.notExists(baz, 'baz is either null or undefined');
	   *
	   * @name notExists
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notExists = function (val, msg) {
	    new Assertion(val, msg, assert.notExists, true).to.not.exist;
	  };

	  /**
	   * ### .isUndefined(value, [message])
	   *
	   * Asserts that `value` is `undefined`.
	   *
	   *     var tea;
	   *     assert.isUndefined(tea, 'no tea defined');
	   *
	   * @name isUndefined
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isUndefined = function (val, msg) {
	    new Assertion(val, msg, assert.isUndefined, true).to.equal(undefined);
	  };

	  /**
	   * ### .isDefined(value, [message])
	   *
	   * Asserts that `value` is not `undefined`.
	   *
	   *     var tea = 'cup of chai';
	   *     assert.isDefined(tea, 'tea has been defined');
	   *
	   * @name isDefined
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isDefined = function (val, msg) {
	    new Assertion(val, msg, assert.isDefined, true).to.not.equal(undefined);
	  };

	  /**
	   * ### .isFunction(value, [message])
	   *
	   * Asserts that `value` is a function.
	   *
	   *     function serveTea() { return 'cup of tea'; };
	   *     assert.isFunction(serveTea, 'great, we can have tea now');
	   *
	   * @name isFunction
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isFunction = function (val, msg) {
	    new Assertion(val, msg, assert.isFunction, true).to.be.a('function');
	  };

	  /**
	   * ### .isNotFunction(value, [message])
	   *
	   * Asserts that `value` is _not_ a function.
	   *
	   *     var serveTea = [ 'heat', 'pour', 'sip' ];
	   *     assert.isNotFunction(serveTea, 'great, we have listed the steps');
	   *
	   * @name isNotFunction
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNotFunction = function (val, msg) {
	    new Assertion(val, msg, assert.isNotFunction, true).to.not.be.a('function');
	  };

	  /**
	   * ### .isObject(value, [message])
	   *
	   * Asserts that `value` is an object of type 'Object' (as revealed by `Object.prototype.toString`).
	   * _The assertion does not match subclassed objects._
	   *
	   *     var selection = { name: 'Chai', serve: 'with spices' };
	   *     assert.isObject(selection, 'tea selection is an object');
	   *
	   * @name isObject
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isObject = function (val, msg) {
	    new Assertion(val, msg, assert.isObject, true).to.be.a('object');
	  };

	  /**
	   * ### .isNotObject(value, [message])
	   *
	   * Asserts that `value` is _not_ an object of type 'Object' (as revealed by `Object.prototype.toString`).
	   *
	   *     var selection = 'chai'
	   *     assert.isNotObject(selection, 'tea selection is not an object');
	   *     assert.isNotObject(null, 'null is not an object');
	   *
	   * @name isNotObject
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNotObject = function (val, msg) {
	    new Assertion(val, msg, assert.isNotObject, true).to.not.be.a('object');
	  };

	  /**
	   * ### .isArray(value, [message])
	   *
	   * Asserts that `value` is an array.
	   *
	   *     var menu = [ 'green', 'chai', 'oolong' ];
	   *     assert.isArray(menu, 'what kind of tea do we want?');
	   *
	   * @name isArray
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isArray = function (val, msg) {
	    new Assertion(val, msg, assert.isArray, true).to.be.an('array');
	  };

	  /**
	   * ### .isNotArray(value, [message])
	   *
	   * Asserts that `value` is _not_ an array.
	   *
	   *     var menu = 'green|chai|oolong';
	   *     assert.isNotArray(menu, 'what kind of tea do we want?');
	   *
	   * @name isNotArray
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNotArray = function (val, msg) {
	    new Assertion(val, msg, assert.isNotArray, true).to.not.be.an('array');
	  };

	  /**
	   * ### .isString(value, [message])
	   *
	   * Asserts that `value` is a string.
	   *
	   *     var teaOrder = 'chai';
	   *     assert.isString(teaOrder, 'order placed');
	   *
	   * @name isString
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isString = function (val, msg) {
	    new Assertion(val, msg, assert.isString, true).to.be.a('string');
	  };

	  /**
	   * ### .isNotString(value, [message])
	   *
	   * Asserts that `value` is _not_ a string.
	   *
	   *     var teaOrder = 4;
	   *     assert.isNotString(teaOrder, 'order placed');
	   *
	   * @name isNotString
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNotString = function (val, msg) {
	    new Assertion(val, msg, assert.isNotString, true).to.not.be.a('string');
	  };

	  /**
	   * ### .isNumber(value, [message])
	   *
	   * Asserts that `value` is a number.
	   *
	   *     var cups = 2;
	   *     assert.isNumber(cups, 'how many cups');
	   *
	   * @name isNumber
	   * @param {Number} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNumber = function (val, msg) {
	    new Assertion(val, msg, assert.isNumber, true).to.be.a('number');
	  };

	  /**
	   * ### .isNotNumber(value, [message])
	   *
	   * Asserts that `value` is _not_ a number.
	   *
	   *     var cups = '2 cups please';
	   *     assert.isNotNumber(cups, 'how many cups');
	   *
	   * @name isNotNumber
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNotNumber = function (val, msg) {
	    new Assertion(val, msg, assert.isNotNumber, true).to.not.be.a('number');
	  };

	   /**
	   * ### .isFinite(value, [message])
	   *
	   * Asserts that `value` is a finite number. Unlike `.isNumber`, this will fail for `NaN` and `Infinity`.
	   *
	   *     var cups = 2;
	   *     assert.isFinite(cups, 'how many cups');
	   *
	   *     assert.isFinite(NaN); // throws
	   *
	   * @name isFinite
	   * @param {Number} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isFinite = function (val, msg) {
	    new Assertion(val, msg, assert.isFinite, true).to.be.finite;
	  };

	  /**
	   * ### .isBoolean(value, [message])
	   *
	   * Asserts that `value` is a boolean.
	   *
	   *     var teaReady = true
	   *       , teaServed = false;
	   *
	   *     assert.isBoolean(teaReady, 'is the tea ready');
	   *     assert.isBoolean(teaServed, 'has tea been served');
	   *
	   * @name isBoolean
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isBoolean = function (val, msg) {
	    new Assertion(val, msg, assert.isBoolean, true).to.be.a('boolean');
	  };

	  /**
	   * ### .isNotBoolean(value, [message])
	   *
	   * Asserts that `value` is _not_ a boolean.
	   *
	   *     var teaReady = 'yep'
	   *       , teaServed = 'nope';
	   *
	   *     assert.isNotBoolean(teaReady, 'is the tea ready');
	   *     assert.isNotBoolean(teaServed, 'has tea been served');
	   *
	   * @name isNotBoolean
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNotBoolean = function (val, msg) {
	    new Assertion(val, msg, assert.isNotBoolean, true).to.not.be.a('boolean');
	  };

	  /**
	   * ### .typeOf(value, name, [message])
	   *
	   * Asserts that `value`'s type is `name`, as determined by
	   * `Object.prototype.toString`.
	   *
	   *     assert.typeOf({ tea: 'chai' }, 'object', 'we have an object');
	   *     assert.typeOf(['chai', 'jasmine'], 'array', 'we have an array');
	   *     assert.typeOf('tea', 'string', 'we have a string');
	   *     assert.typeOf(/tea/, 'regexp', 'we have a regular expression');
	   *     assert.typeOf(null, 'null', 'we have a null');
	   *     assert.typeOf(undefined, 'undefined', 'we have an undefined');
	   *
	   * @name typeOf
	   * @param {Mixed} value
	   * @param {String} name
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.typeOf = function (val, type, msg) {
	    new Assertion(val, msg, assert.typeOf, true).to.be.a(type);
	  };

	  /**
	   * ### .notTypeOf(value, name, [message])
	   *
	   * Asserts that `value`'s type is _not_ `name`, as determined by
	   * `Object.prototype.toString`.
	   *
	   *     assert.notTypeOf('tea', 'number', 'strings are not numbers');
	   *
	   * @name notTypeOf
	   * @param {Mixed} value
	   * @param {String} typeof name
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notTypeOf = function (val, type, msg) {
	    new Assertion(val, msg, assert.notTypeOf, true).to.not.be.a(type);
	  };

	  /**
	   * ### .instanceOf(object, constructor, [message])
	   *
	   * Asserts that `value` is an instance of `constructor`.
	   *
	   *     var Tea = function (name) { this.name = name; }
	   *       , chai = new Tea('chai');
	   *
	   *     assert.instanceOf(chai, Tea, 'chai is an instance of tea');
	   *
	   * @name instanceOf
	   * @param {Object} object
	   * @param {Constructor} constructor
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.instanceOf = function (val, type, msg) {
	    new Assertion(val, msg, assert.instanceOf, true).to.be.instanceOf(type);
	  };

	  /**
	   * ### .notInstanceOf(object, constructor, [message])
	   *
	   * Asserts `value` is not an instance of `constructor`.
	   *
	   *     var Tea = function (name) { this.name = name; }
	   *       , chai = new String('chai');
	   *
	   *     assert.notInstanceOf(chai, Tea, 'chai is not an instance of tea');
	   *
	   * @name notInstanceOf
	   * @param {Object} object
	   * @param {Constructor} constructor
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notInstanceOf = function (val, type, msg) {
	    new Assertion(val, msg, assert.notInstanceOf, true)
	      .to.not.be.instanceOf(type);
	  };

	  /**
	   * ### .include(haystack, needle, [message])
	   *
	   * Asserts that `haystack` includes `needle`. Can be used to assert the
	   * inclusion of a value in an array, a substring in a string, or a subset of
	   * properties in an object.
	   *
	   *     assert.include([1,2,3], 2, 'array contains value');
	   *     assert.include('foobar', 'foo', 'string contains substring');
	   *     assert.include({ foo: 'bar', hello: 'universe' }, { foo: 'bar' }, 'object contains property');
	   *
	   * Strict equality (===) is used. When asserting the inclusion of a value in
	   * an array, the array is searched for an element that's strictly equal to the
	   * given value. When asserting a subset of properties in an object, the object
	   * is searched for the given property keys, checking that each one is present
	   * and strictly equal to the given property value. For instance:
	   *
	   *     var obj1 = {a: 1}
	   *       , obj2 = {b: 2};
	   *     assert.include([obj1, obj2], obj1);
	   *     assert.include({foo: obj1, bar: obj2}, {foo: obj1});
	   *     assert.include({foo: obj1, bar: obj2}, {foo: obj1, bar: obj2});
	   *
	   * @name include
	   * @param {Array|String} haystack
	   * @param {Mixed} needle
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.include = function (exp, inc, msg) {
	    new Assertion(exp, msg, assert.include, true).include(inc);
	  };

	  /**
	   * ### .notInclude(haystack, needle, [message])
	   *
	   * Asserts that `haystack` does not include `needle`. Can be used to assert
	   * the absence of a value in an array, a substring in a string, or a subset of
	   * properties in an object.
	   *
	   *     assert.notInclude([1,2,3], 4, "array doesn't contain value");
	   *     assert.notInclude('foobar', 'baz', "string doesn't contain substring");
	   *     assert.notInclude({ foo: 'bar', hello: 'universe' }, { foo: 'baz' }, 'object doesn't contain property');
	   *
	   * Strict equality (===) is used. When asserting the absence of a value in an
	   * array, the array is searched to confirm the absence of an element that's
	   * strictly equal to the given value. When asserting a subset of properties in
	   * an object, the object is searched to confirm that at least one of the given
	   * property keys is either not present or not strictly equal to the given
	   * property value. For instance:
	   *
	   *     var obj1 = {a: 1}
	   *       , obj2 = {b: 2};
	   *     assert.notInclude([obj1, obj2], {a: 1});
	   *     assert.notInclude({foo: obj1, bar: obj2}, {foo: {a: 1}});
	   *     assert.notInclude({foo: obj1, bar: obj2}, {foo: obj1, bar: {b: 2}});
	   *
	   * @name notInclude
	   * @param {Array|String} haystack
	   * @param {Mixed} needle
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notInclude = function (exp, inc, msg) {
	    new Assertion(exp, msg, assert.notInclude, true).not.include(inc);
	  };

	  /**
	   * ### .deepInclude(haystack, needle, [message])
	   *
	   * Asserts that `haystack` includes `needle`. Can be used to assert the
	   * inclusion of a value in an array or a subset of properties in an object.
	   * Deep equality is used.
	   *
	   *     var obj1 = {a: 1}
	   *       , obj2 = {b: 2};
	   *     assert.deepInclude([obj1, obj2], {a: 1});
	   *     assert.deepInclude({foo: obj1, bar: obj2}, {foo: {a: 1}});
	   *     assert.deepInclude({foo: obj1, bar: obj2}, {foo: {a: 1}, bar: {b: 2}});
	   *
	   * @name deepInclude
	   * @param {Array|String} haystack
	   * @param {Mixed} needle
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.deepInclude = function (exp, inc, msg) {
	    new Assertion(exp, msg, assert.deepInclude, true).deep.include(inc);
	  };

	  /**
	   * ### .notDeepInclude(haystack, needle, [message])
	   *
	   * Asserts that `haystack` does not include `needle`. Can be used to assert
	   * the absence of a value in an array or a subset of properties in an object.
	   * Deep equality is used.
	   *
	   *     var obj1 = {a: 1}
	   *       , obj2 = {b: 2};
	   *     assert.notDeepInclude([obj1, obj2], {a: 9});
	   *     assert.notDeepInclude({foo: obj1, bar: obj2}, {foo: {a: 9}});
	   *     assert.notDeepInclude({foo: obj1, bar: obj2}, {foo: {a: 1}, bar: {b: 9}});
	   *
	   * @name notDeepInclude
	   * @param {Array|String} haystack
	   * @param {Mixed} needle
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notDeepInclude = function (exp, inc, msg) {
	    new Assertion(exp, msg, assert.notDeepInclude, true).not.deep.include(inc);
	  };

	  /**
	   * ### .nestedInclude(haystack, needle, [message])
	   *
	   * Asserts that 'haystack' includes 'needle'.
	   * Can be used to assert the inclusion of a subset of properties in an
	   * object.
	   * Enables the use of dot- and bracket-notation for referencing nested
	   * properties.
	   * '[]' and '.' in property names can be escaped using double backslashes.
	   *
	   *     assert.nestedInclude({'.a': {'b': 'x'}}, {'\\.a.[b]': 'x'});
	   *     assert.nestedInclude({'a': {'[b]': 'x'}}, {'a.\\[b\\]': 'x'});
	   *
	   * @name nestedInclude
	   * @param {Object} haystack
	   * @param {Object} needle
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.nestedInclude = function (exp, inc, msg) {
	    new Assertion(exp, msg, assert.nestedInclude, true).nested.include(inc);
	  };

	  /**
	   * ### .notNestedInclude(haystack, needle, [message])
	   *
	   * Asserts that 'haystack' does not include 'needle'.
	   * Can be used to assert the absence of a subset of properties in an
	   * object.
	   * Enables the use of dot- and bracket-notation for referencing nested
	   * properties.
	   * '[]' and '.' in property names can be escaped using double backslashes.
	   *
	   *     assert.notNestedInclude({'.a': {'b': 'x'}}, {'\\.a.b': 'y'});
	   *     assert.notNestedInclude({'a': {'[b]': 'x'}}, {'a.\\[b\\]': 'y'});
	   *
	   * @name notNestedInclude
	   * @param {Object} haystack
	   * @param {Object} needle
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notNestedInclude = function (exp, inc, msg) {
	    new Assertion(exp, msg, assert.notNestedInclude, true)
	      .not.nested.include(inc);
	  };

	  /**
	   * ### .deepNestedInclude(haystack, needle, [message])
	   *
	   * Asserts that 'haystack' includes 'needle'.
	   * Can be used to assert the inclusion of a subset of properties in an
	   * object while checking for deep equality.
	   * Enables the use of dot- and bracket-notation for referencing nested
	   * properties.
	   * '[]' and '.' in property names can be escaped using double backslashes.
	   *
	   *     assert.deepNestedInclude({a: {b: [{x: 1}]}}, {'a.b[0]': {x: 1}});
	   *     assert.deepNestedInclude({'.a': {'[b]': {x: 1}}}, {'\\.a.\\[b\\]': {x: 1}});
	   *
	   * @name deepNestedInclude
	   * @param {Object} haystack
	   * @param {Object} needle
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.deepNestedInclude = function(exp, inc, msg) {
	    new Assertion(exp, msg, assert.deepNestedInclude, true)
	      .deep.nested.include(inc);
	  };

	  /**
	   * ### .notDeepNestedInclude(haystack, needle, [message])
	   *
	   * Asserts that 'haystack' does not include 'needle'.
	   * Can be used to assert the absence of a subset of properties in an
	   * object while checking for deep equality.
	   * Enables the use of dot- and bracket-notation for referencing nested
	   * properties.
	   * '[]' and '.' in property names can be escaped using double backslashes.
	   *
	   *     assert.notDeepNestedInclude({a: {b: [{x: 1}]}}, {'a.b[0]': {y: 1}})
	   *     assert.notDeepNestedInclude({'.a': {'[b]': {x: 1}}}, {'\\.a.\\[b\\]': {y: 2}});
	   *
	   * @name notDeepNestedInclude
	   * @param {Object} haystack
	   * @param {Object} needle
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notDeepNestedInclude = function(exp, inc, msg) {
	    new Assertion(exp, msg, assert.notDeepNestedInclude, true)
	      .not.deep.nested.include(inc);
	  };

	  /**
	   * ### .ownInclude(haystack, needle, [message])
	   *
	   * Asserts that 'haystack' includes 'needle'.
	   * Can be used to assert the inclusion of a subset of properties in an
	   * object while ignoring inherited properties.
	   *
	   *     assert.ownInclude({ a: 1 }, { a: 1 });
	   *
	   * @name ownInclude
	   * @param {Object} haystack
	   * @param {Object} needle
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.ownInclude = function(exp, inc, msg) {
	    new Assertion(exp, msg, assert.ownInclude, true).own.include(inc);
	  };

	  /**
	   * ### .notOwnInclude(haystack, needle, [message])
	   *
	   * Asserts that 'haystack' includes 'needle'.
	   * Can be used to assert the absence of a subset of properties in an
	   * object while ignoring inherited properties.
	   *
	   *     Object.prototype.b = 2;
	   *
	   *     assert.notOwnInclude({ a: 1 }, { b: 2 });
	   *
	   * @name notOwnInclude
	   * @param {Object} haystack
	   * @param {Object} needle
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notOwnInclude = function(exp, inc, msg) {
	    new Assertion(exp, msg, assert.notOwnInclude, true).not.own.include(inc);
	  };

	  /**
	   * ### .deepOwnInclude(haystack, needle, [message])
	   *
	   * Asserts that 'haystack' includes 'needle'.
	   * Can be used to assert the inclusion of a subset of properties in an
	   * object while ignoring inherited properties and checking for deep equality.
	   *
	   *      assert.deepOwnInclude({a: {b: 2}}, {a: {b: 2}});
	   *
	   * @name deepOwnInclude
	   * @param {Object} haystack
	   * @param {Object} needle
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.deepOwnInclude = function(exp, inc, msg) {
	    new Assertion(exp, msg, assert.deepOwnInclude, true)
	      .deep.own.include(inc);
	  };

	   /**
	   * ### .notDeepOwnInclude(haystack, needle, [message])
	   *
	   * Asserts that 'haystack' includes 'needle'.
	   * Can be used to assert the absence of a subset of properties in an
	   * object while ignoring inherited properties and checking for deep equality.
	   *
	   *      assert.notDeepOwnInclude({a: {b: 2}}, {a: {c: 3}});
	   *
	   * @name notDeepOwnInclude
	   * @param {Object} haystack
	   * @param {Object} needle
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notDeepOwnInclude = function(exp, inc, msg) {
	    new Assertion(exp, msg, assert.notDeepOwnInclude, true)
	      .not.deep.own.include(inc);
	  };

	  /**
	   * ### .match(value, regexp, [message])
	   *
	   * Asserts that `value` matches the regular expression `regexp`.
	   *
	   *     assert.match('foobar', /^foo/, 'regexp matches');
	   *
	   * @name match
	   * @param {Mixed} value
	   * @param {RegExp} regexp
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.match = function (exp, re, msg) {
	    new Assertion(exp, msg, assert.match, true).to.match(re);
	  };

	  /**
	   * ### .notMatch(value, regexp, [message])
	   *
	   * Asserts that `value` does not match the regular expression `regexp`.
	   *
	   *     assert.notMatch('foobar', /^foo/, 'regexp does not match');
	   *
	   * @name notMatch
	   * @param {Mixed} value
	   * @param {RegExp} regexp
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notMatch = function (exp, re, msg) {
	    new Assertion(exp, msg, assert.notMatch, true).to.not.match(re);
	  };

	  /**
	   * ### .property(object, property, [message])
	   *
	   * Asserts that `object` has a direct or inherited property named by
	   * `property`.
	   *
	   *     assert.property({ tea: { green: 'matcha' }}, 'tea');
	   *     assert.property({ tea: { green: 'matcha' }}, 'toString');
	   *
	   * @name property
	   * @param {Object} object
	   * @param {String} property
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.property = function (obj, prop, msg) {
	    new Assertion(obj, msg, assert.property, true).to.have.property(prop);
	  };

	  /**
	   * ### .notProperty(object, property, [message])
	   *
	   * Asserts that `object` does _not_ have a direct or inherited property named
	   * by `property`.
	   *
	   *     assert.notProperty({ tea: { green: 'matcha' }}, 'coffee');
	   *
	   * @name notProperty
	   * @param {Object} object
	   * @param {String} property
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notProperty = function (obj, prop, msg) {
	    new Assertion(obj, msg, assert.notProperty, true)
	      .to.not.have.property(prop);
	  };

	  /**
	   * ### .propertyVal(object, property, value, [message])
	   *
	   * Asserts that `object` has a direct or inherited property named by
	   * `property` with a value given by `value`. Uses a strict equality check
	   * (===).
	   *
	   *     assert.propertyVal({ tea: 'is good' }, 'tea', 'is good');
	   *
	   * @name propertyVal
	   * @param {Object} object
	   * @param {String} property
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.propertyVal = function (obj, prop, val, msg) {
	    new Assertion(obj, msg, assert.propertyVal, true)
	      .to.have.property(prop, val);
	  };

	  /**
	   * ### .notPropertyVal(object, property, value, [message])
	   *
	   * Asserts that `object` does _not_ have a direct or inherited property named
	   * by `property` with value given by `value`. Uses a strict equality check
	   * (===).
	   *
	   *     assert.notPropertyVal({ tea: 'is good' }, 'tea', 'is bad');
	   *     assert.notPropertyVal({ tea: 'is good' }, 'coffee', 'is good');
	   *
	   * @name notPropertyVal
	   * @param {Object} object
	   * @param {String} property
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notPropertyVal = function (obj, prop, val, msg) {
	    new Assertion(obj, msg, assert.notPropertyVal, true)
	      .to.not.have.property(prop, val);
	  };

	  /**
	   * ### .deepPropertyVal(object, property, value, [message])
	   *
	   * Asserts that `object` has a direct or inherited property named by
	   * `property` with a value given by `value`. Uses a deep equality check.
	   *
	   *     assert.deepPropertyVal({ tea: { green: 'matcha' } }, 'tea', { green: 'matcha' });
	   *
	   * @name deepPropertyVal
	   * @param {Object} object
	   * @param {String} property
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.deepPropertyVal = function (obj, prop, val, msg) {
	    new Assertion(obj, msg, assert.deepPropertyVal, true)
	      .to.have.deep.property(prop, val);
	  };

	  /**
	   * ### .notDeepPropertyVal(object, property, value, [message])
	   *
	   * Asserts that `object` does _not_ have a direct or inherited property named
	   * by `property` with value given by `value`. Uses a deep equality check.
	   *
	   *     assert.notDeepPropertyVal({ tea: { green: 'matcha' } }, 'tea', { black: 'matcha' });
	   *     assert.notDeepPropertyVal({ tea: { green: 'matcha' } }, 'tea', { green: 'oolong' });
	   *     assert.notDeepPropertyVal({ tea: { green: 'matcha' } }, 'coffee', { green: 'matcha' });
	   *
	   * @name notDeepPropertyVal
	   * @param {Object} object
	   * @param {String} property
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notDeepPropertyVal = function (obj, prop, val, msg) {
	    new Assertion(obj, msg, assert.notDeepPropertyVal, true)
	      .to.not.have.deep.property(prop, val);
	  };

	  /**
	   * ### .ownProperty(object, property, [message])
	   *
	   * Asserts that `object` has a direct property named by `property`. Inherited
	   * properties aren't checked.
	   *
	   *     assert.ownProperty({ tea: { green: 'matcha' }}, 'tea');
	   *
	   * @name ownProperty
	   * @param {Object} object
	   * @param {String} property
	   * @param {String} message
	   * @api public
	   */

	  assert.ownProperty = function (obj, prop, msg) {
	    new Assertion(obj, msg, assert.ownProperty, true)
	      .to.have.own.property(prop);
	  };

	  /**
	   * ### .notOwnProperty(object, property, [message])
	   *
	   * Asserts that `object` does _not_ have a direct property named by
	   * `property`. Inherited properties aren't checked.
	   *
	   *     assert.notOwnProperty({ tea: { green: 'matcha' }}, 'coffee');
	   *     assert.notOwnProperty({}, 'toString');
	   *
	   * @name notOwnProperty
	   * @param {Object} object
	   * @param {String} property
	   * @param {String} message
	   * @api public
	   */

	  assert.notOwnProperty = function (obj, prop, msg) {
	    new Assertion(obj, msg, assert.notOwnProperty, true)
	      .to.not.have.own.property(prop);
	  };

	  /**
	   * ### .ownPropertyVal(object, property, value, [message])
	   *
	   * Asserts that `object` has a direct property named by `property` and a value
	   * equal to the provided `value`. Uses a strict equality check (===).
	   * Inherited properties aren't checked.
	   *
	   *     assert.ownPropertyVal({ coffee: 'is good'}, 'coffee', 'is good');
	   *
	   * @name ownPropertyVal
	   * @param {Object} object
	   * @param {String} property
	   * @param {Mixed} value
	   * @param {String} message
	   * @api public
	   */

	  assert.ownPropertyVal = function (obj, prop, value, msg) {
	    new Assertion(obj, msg, assert.ownPropertyVal, true)
	      .to.have.own.property(prop, value);
	  };

	  /**
	   * ### .notOwnPropertyVal(object, property, value, [message])
	   *
	   * Asserts that `object` does _not_ have a direct property named by `property`
	   * with a value equal to the provided `value`. Uses a strict equality check
	   * (===). Inherited properties aren't checked.
	   *
	   *     assert.notOwnPropertyVal({ tea: 'is better'}, 'tea', 'is worse');
	   *     assert.notOwnPropertyVal({}, 'toString', Object.prototype.toString);
	   *
	   * @name notOwnPropertyVal
	   * @param {Object} object
	   * @param {String} property
	   * @param {Mixed} value
	   * @param {String} message
	   * @api public
	   */

	  assert.notOwnPropertyVal = function (obj, prop, value, msg) {
	    new Assertion(obj, msg, assert.notOwnPropertyVal, true)
	      .to.not.have.own.property(prop, value);
	  };

	  /**
	   * ### .deepOwnPropertyVal(object, property, value, [message])
	   *
	   * Asserts that `object` has a direct property named by `property` and a value
	   * equal to the provided `value`. Uses a deep equality check. Inherited
	   * properties aren't checked.
	   *
	   *     assert.deepOwnPropertyVal({ tea: { green: 'matcha' } }, 'tea', { green: 'matcha' });
	   *
	   * @name deepOwnPropertyVal
	   * @param {Object} object
	   * @param {String} property
	   * @param {Mixed} value
	   * @param {String} message
	   * @api public
	   */

	  assert.deepOwnPropertyVal = function (obj, prop, value, msg) {
	    new Assertion(obj, msg, assert.deepOwnPropertyVal, true)
	      .to.have.deep.own.property(prop, value);
	  };

	  /**
	   * ### .notDeepOwnPropertyVal(object, property, value, [message])
	   *
	   * Asserts that `object` does _not_ have a direct property named by `property`
	   * with a value equal to the provided `value`. Uses a deep equality check.
	   * Inherited properties aren't checked.
	   *
	   *     assert.notDeepOwnPropertyVal({ tea: { green: 'matcha' } }, 'tea', { black: 'matcha' });
	   *     assert.notDeepOwnPropertyVal({ tea: { green: 'matcha' } }, 'tea', { green: 'oolong' });
	   *     assert.notDeepOwnPropertyVal({ tea: { green: 'matcha' } }, 'coffee', { green: 'matcha' });
	   *     assert.notDeepOwnPropertyVal({}, 'toString', Object.prototype.toString);
	   *
	   * @name notDeepOwnPropertyVal
	   * @param {Object} object
	   * @param {String} property
	   * @param {Mixed} value
	   * @param {String} message
	   * @api public
	   */

	  assert.notDeepOwnPropertyVal = function (obj, prop, value, msg) {
	    new Assertion(obj, msg, assert.notDeepOwnPropertyVal, true)
	      .to.not.have.deep.own.property(prop, value);
	  };

	  /**
	   * ### .nestedProperty(object, property, [message])
	   *
	   * Asserts that `object` has a direct or inherited property named by
	   * `property`, which can be a string using dot- and bracket-notation for
	   * nested reference.
	   *
	   *     assert.nestedProperty({ tea: { green: 'matcha' }}, 'tea.green');
	   *
	   * @name nestedProperty
	   * @param {Object} object
	   * @param {String} property
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.nestedProperty = function (obj, prop, msg) {
	    new Assertion(obj, msg, assert.nestedProperty, true)
	      .to.have.nested.property(prop);
	  };

	  /**
	   * ### .notNestedProperty(object, property, [message])
	   *
	   * Asserts that `object` does _not_ have a property named by `property`, which
	   * can be a string using dot- and bracket-notation for nested reference. The
	   * property cannot exist on the object nor anywhere in its prototype chain.
	   *
	   *     assert.notNestedProperty({ tea: { green: 'matcha' }}, 'tea.oolong');
	   *
	   * @name notNestedProperty
	   * @param {Object} object
	   * @param {String} property
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notNestedProperty = function (obj, prop, msg) {
	    new Assertion(obj, msg, assert.notNestedProperty, true)
	      .to.not.have.nested.property(prop);
	  };

	  /**
	   * ### .nestedPropertyVal(object, property, value, [message])
	   *
	   * Asserts that `object` has a property named by `property` with value given
	   * by `value`. `property` can use dot- and bracket-notation for nested
	   * reference. Uses a strict equality check (===).
	   *
	   *     assert.nestedPropertyVal({ tea: { green: 'matcha' }}, 'tea.green', 'matcha');
	   *
	   * @name nestedPropertyVal
	   * @param {Object} object
	   * @param {String} property
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.nestedPropertyVal = function (obj, prop, val, msg) {
	    new Assertion(obj, msg, assert.nestedPropertyVal, true)
	      .to.have.nested.property(prop, val);
	  };

	  /**
	   * ### .notNestedPropertyVal(object, property, value, [message])
	   *
	   * Asserts that `object` does _not_ have a property named by `property` with
	   * value given by `value`. `property` can use dot- and bracket-notation for
	   * nested reference. Uses a strict equality check (===).
	   *
	   *     assert.notNestedPropertyVal({ tea: { green: 'matcha' }}, 'tea.green', 'konacha');
	   *     assert.notNestedPropertyVal({ tea: { green: 'matcha' }}, 'coffee.green', 'matcha');
	   *
	   * @name notNestedPropertyVal
	   * @param {Object} object
	   * @param {String} property
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notNestedPropertyVal = function (obj, prop, val, msg) {
	    new Assertion(obj, msg, assert.notNestedPropertyVal, true)
	      .to.not.have.nested.property(prop, val);
	  };

	  /**
	   * ### .deepNestedPropertyVal(object, property, value, [message])
	   *
	   * Asserts that `object` has a property named by `property` with a value given
	   * by `value`. `property` can use dot- and bracket-notation for nested
	   * reference. Uses a deep equality check.
	   *
	   *     assert.deepNestedPropertyVal({ tea: { green: { matcha: 'yum' } } }, 'tea.green', { matcha: 'yum' });
	   *
	   * @name deepNestedPropertyVal
	   * @param {Object} object
	   * @param {String} property
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.deepNestedPropertyVal = function (obj, prop, val, msg) {
	    new Assertion(obj, msg, assert.deepNestedPropertyVal, true)
	      .to.have.deep.nested.property(prop, val);
	  };

	  /**
	   * ### .notDeepNestedPropertyVal(object, property, value, [message])
	   *
	   * Asserts that `object` does _not_ have a property named by `property` with
	   * value given by `value`. `property` can use dot- and bracket-notation for
	   * nested reference. Uses a deep equality check.
	   *
	   *     assert.notDeepNestedPropertyVal({ tea: { green: { matcha: 'yum' } } }, 'tea.green', { oolong: 'yum' });
	   *     assert.notDeepNestedPropertyVal({ tea: { green: { matcha: 'yum' } } }, 'tea.green', { matcha: 'yuck' });
	   *     assert.notDeepNestedPropertyVal({ tea: { green: { matcha: 'yum' } } }, 'tea.black', { matcha: 'yum' });
	   *
	   * @name notDeepNestedPropertyVal
	   * @param {Object} object
	   * @param {String} property
	   * @param {Mixed} value
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notDeepNestedPropertyVal = function (obj, prop, val, msg) {
	    new Assertion(obj, msg, assert.notDeepNestedPropertyVal, true)
	      .to.not.have.deep.nested.property(prop, val);
	  };

	  /**
	   * ### .lengthOf(object, length, [message])
	   *
	   * Asserts that `object` has a `length` or `size` with the expected value.
	   *
	   *     assert.lengthOf([1,2,3], 3, 'array has length of 3');
	   *     assert.lengthOf('foobar', 6, 'string has length of 6');
	   *     assert.lengthOf(new Set([1,2,3]), 3, 'set has size of 3');
	   *     assert.lengthOf(new Map([['a',1],['b',2],['c',3]]), 3, 'map has size of 3');
	   *
	   * @name lengthOf
	   * @param {Mixed} object
	   * @param {Number} length
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.lengthOf = function (exp, len, msg) {
	    new Assertion(exp, msg, assert.lengthOf, true).to.have.lengthOf(len);
	  };

	  /**
	   * ### .hasAnyKeys(object, [keys], [message])
	   *
	   * Asserts that `object` has at least one of the `keys` provided.
	   * You can also provide a single object instead of a `keys` array and its keys
	   * will be used as the expected set of keys.
	   *
	   *     assert.hasAnyKeys({foo: 1, bar: 2, baz: 3}, ['foo', 'iDontExist', 'baz']);
	   *     assert.hasAnyKeys({foo: 1, bar: 2, baz: 3}, {foo: 30, iDontExist: 99, baz: 1337});
	   *     assert.hasAnyKeys(new Map([[{foo: 1}, 'bar'], ['key', 'value']]), [{foo: 1}, 'key']);
	   *     assert.hasAnyKeys(new Set([{foo: 'bar'}, 'anotherKey']), [{foo: 'bar'}, 'anotherKey']);
	   *
	   * @name hasAnyKeys
	   * @param {Mixed} object
	   * @param {Array|Object} keys
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.hasAnyKeys = function (obj, keys, msg) {
	    new Assertion(obj, msg, assert.hasAnyKeys, true).to.have.any.keys(keys);
	  };

	  /**
	   * ### .hasAllKeys(object, [keys], [message])
	   *
	   * Asserts that `object` has all and only all of the `keys` provided.
	   * You can also provide a single object instead of a `keys` array and its keys
	   * will be used as the expected set of keys.
	   *
	   *     assert.hasAllKeys({foo: 1, bar: 2, baz: 3}, ['foo', 'bar', 'baz']);
	   *     assert.hasAllKeys({foo: 1, bar: 2, baz: 3}, {foo: 30, bar: 99, baz: 1337]);
	   *     assert.hasAllKeys(new Map([[{foo: 1}, 'bar'], ['key', 'value']]), [{foo: 1}, 'key']);
	   *     assert.hasAllKeys(new Set([{foo: 'bar'}, 'anotherKey'], [{foo: 'bar'}, 'anotherKey']);
	   *
	   * @name hasAllKeys
	   * @param {Mixed} object
	   * @param {String[]} keys
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.hasAllKeys = function (obj, keys, msg) {
	    new Assertion(obj, msg, assert.hasAllKeys, true).to.have.all.keys(keys);
	  };

	  /**
	   * ### .containsAllKeys(object, [keys], [message])
	   *
	   * Asserts that `object` has all of the `keys` provided but may have more keys not listed.
	   * You can also provide a single object instead of a `keys` array and its keys
	   * will be used as the expected set of keys.
	   *
	   *     assert.containsAllKeys({foo: 1, bar: 2, baz: 3}, ['foo', 'baz']);
	   *     assert.containsAllKeys({foo: 1, bar: 2, baz: 3}, ['foo', 'bar', 'baz']);
	   *     assert.containsAllKeys({foo: 1, bar: 2, baz: 3}, {foo: 30, baz: 1337});
	   *     assert.containsAllKeys({foo: 1, bar: 2, baz: 3}, {foo: 30, bar: 99, baz: 1337});
	   *     assert.containsAllKeys(new Map([[{foo: 1}, 'bar'], ['key', 'value']]), [{foo: 1}]);
	   *     assert.containsAllKeys(new Map([[{foo: 1}, 'bar'], ['key', 'value']]), [{foo: 1}, 'key']);
	   *     assert.containsAllKeys(new Set([{foo: 'bar'}, 'anotherKey'], [{foo: 'bar'}]);
	   *     assert.containsAllKeys(new Set([{foo: 'bar'}, 'anotherKey'], [{foo: 'bar'}, 'anotherKey']);
	   *
	   * @name containsAllKeys
	   * @param {Mixed} object
	   * @param {String[]} keys
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.containsAllKeys = function (obj, keys, msg) {
	    new Assertion(obj, msg, assert.containsAllKeys, true)
	      .to.contain.all.keys(keys);
	  };

	  /**
	   * ### .doesNotHaveAnyKeys(object, [keys], [message])
	   *
	   * Asserts that `object` has none of the `keys` provided.
	   * You can also provide a single object instead of a `keys` array and its keys
	   * will be used as the expected set of keys.
	   *
	   *     assert.doesNotHaveAnyKeys({foo: 1, bar: 2, baz: 3}, ['one', 'two', 'example']);
	   *     assert.doesNotHaveAnyKeys({foo: 1, bar: 2, baz: 3}, {one: 1, two: 2, example: 'foo'});
	   *     assert.doesNotHaveAnyKeys(new Map([[{foo: 1}, 'bar'], ['key', 'value']]), [{one: 'two'}, 'example']);
	   *     assert.doesNotHaveAnyKeys(new Set([{foo: 'bar'}, 'anotherKey'], [{one: 'two'}, 'example']);
	   *
	   * @name doesNotHaveAnyKeys
	   * @param {Mixed} object
	   * @param {String[]} keys
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.doesNotHaveAnyKeys = function (obj, keys, msg) {
	    new Assertion(obj, msg, assert.doesNotHaveAnyKeys, true)
	      .to.not.have.any.keys(keys);
	  };

	  /**
	   * ### .doesNotHaveAllKeys(object, [keys], [message])
	   *
	   * Asserts that `object` does not have at least one of the `keys` provided.
	   * You can also provide a single object instead of a `keys` array and its keys
	   * will be used as the expected set of keys.
	   *
	   *     assert.doesNotHaveAllKeys({foo: 1, bar: 2, baz: 3}, ['one', 'two', 'example']);
	   *     assert.doesNotHaveAllKeys({foo: 1, bar: 2, baz: 3}, {one: 1, two: 2, example: 'foo'});
	   *     assert.doesNotHaveAllKeys(new Map([[{foo: 1}, 'bar'], ['key', 'value']]), [{one: 'two'}, 'example']);
	   *     assert.doesNotHaveAllKeys(new Set([{foo: 'bar'}, 'anotherKey'], [{one: 'two'}, 'example']);
	   *
	   * @name doesNotHaveAllKeys
	   * @param {Mixed} object
	   * @param {String[]} keys
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.doesNotHaveAllKeys = function (obj, keys, msg) {
	    new Assertion(obj, msg, assert.doesNotHaveAllKeys, true)
	      .to.not.have.all.keys(keys);
	  };

	  /**
	   * ### .hasAnyDeepKeys(object, [keys], [message])
	   *
	   * Asserts that `object` has at least one of the `keys` provided.
	   * Since Sets and Maps can have objects as keys you can use this assertion to perform
	   * a deep comparison.
	   * You can also provide a single object instead of a `keys` array and its keys
	   * will be used as the expected set of keys.
	   *
	   *     assert.hasAnyDeepKeys(new Map([[{one: 'one'}, 'valueOne'], [1, 2]]), {one: 'one'});
	   *     assert.hasAnyDeepKeys(new Map([[{one: 'one'}, 'valueOne'], [1, 2]]), [{one: 'one'}, {two: 'two'}]);
	   *     assert.hasAnyDeepKeys(new Map([[{one: 'one'}, 'valueOne'], [{two: 'two'}, 'valueTwo']]), [{one: 'one'}, {two: 'two'}]);
	   *     assert.hasAnyDeepKeys(new Set([{one: 'one'}, {two: 'two'}]), {one: 'one'});
	   *     assert.hasAnyDeepKeys(new Set([{one: 'one'}, {two: 'two'}]), [{one: 'one'}, {three: 'three'}]);
	   *     assert.hasAnyDeepKeys(new Set([{one: 'one'}, {two: 'two'}]), [{one: 'one'}, {two: 'two'}]);
	   *
	   * @name hasAnyDeepKeys
	   * @param {Mixed} object
	   * @param {Array|Object} keys
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.hasAnyDeepKeys = function (obj, keys, msg) {
	    new Assertion(obj, msg, assert.hasAnyDeepKeys, true)
	      .to.have.any.deep.keys(keys);
	  };

	 /**
	   * ### .hasAllDeepKeys(object, [keys], [message])
	   *
	   * Asserts that `object` has all and only all of the `keys` provided.
	   * Since Sets and Maps can have objects as keys you can use this assertion to perform
	   * a deep comparison.
	   * You can also provide a single object instead of a `keys` array and its keys
	   * will be used as the expected set of keys.
	   *
	   *     assert.hasAllDeepKeys(new Map([[{one: 'one'}, 'valueOne']]), {one: 'one'});
	   *     assert.hasAllDeepKeys(new Map([[{one: 'one'}, 'valueOne'], [{two: 'two'}, 'valueTwo']]), [{one: 'one'}, {two: 'two'}]);
	   *     assert.hasAllDeepKeys(new Set([{one: 'one'}]), {one: 'one'});
	   *     assert.hasAllDeepKeys(new Set([{one: 'one'}, {two: 'two'}]), [{one: 'one'}, {two: 'two'}]);
	   *
	   * @name hasAllDeepKeys
	   * @param {Mixed} object
	   * @param {Array|Object} keys
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.hasAllDeepKeys = function (obj, keys, msg) {
	    new Assertion(obj, msg, assert.hasAllDeepKeys, true)
	      .to.have.all.deep.keys(keys);
	  };

	 /**
	   * ### .containsAllDeepKeys(object, [keys], [message])
	   *
	   * Asserts that `object` contains all of the `keys` provided.
	   * Since Sets and Maps can have objects as keys you can use this assertion to perform
	   * a deep comparison.
	   * You can also provide a single object instead of a `keys` array and its keys
	   * will be used as the expected set of keys.
	   *
	   *     assert.containsAllDeepKeys(new Map([[{one: 'one'}, 'valueOne'], [1, 2]]), {one: 'one'});
	   *     assert.containsAllDeepKeys(new Map([[{one: 'one'}, 'valueOne'], [{two: 'two'}, 'valueTwo']]), [{one: 'one'}, {two: 'two'}]);
	   *     assert.containsAllDeepKeys(new Set([{one: 'one'}, {two: 'two'}]), {one: 'one'});
	   *     assert.containsAllDeepKeys(new Set([{one: 'one'}, {two: 'two'}]), [{one: 'one'}, {two: 'two'}]);
	   *
	   * @name containsAllDeepKeys
	   * @param {Mixed} object
	   * @param {Array|Object} keys
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.containsAllDeepKeys = function (obj, keys, msg) {
	    new Assertion(obj, msg, assert.containsAllDeepKeys, true)
	      .to.contain.all.deep.keys(keys);
	  };

	 /**
	   * ### .doesNotHaveAnyDeepKeys(object, [keys], [message])
	   *
	   * Asserts that `object` has none of the `keys` provided.
	   * Since Sets and Maps can have objects as keys you can use this assertion to perform
	   * a deep comparison.
	   * You can also provide a single object instead of a `keys` array and its keys
	   * will be used as the expected set of keys.
	   *
	   *     assert.doesNotHaveAnyDeepKeys(new Map([[{one: 'one'}, 'valueOne'], [1, 2]]), {thisDoesNot: 'exist'});
	   *     assert.doesNotHaveAnyDeepKeys(new Map([[{one: 'one'}, 'valueOne'], [{two: 'two'}, 'valueTwo']]), [{twenty: 'twenty'}, {fifty: 'fifty'}]);
	   *     assert.doesNotHaveAnyDeepKeys(new Set([{one: 'one'}, {two: 'two'}]), {twenty: 'twenty'});
	   *     assert.doesNotHaveAnyDeepKeys(new Set([{one: 'one'}, {two: 'two'}]), [{twenty: 'twenty'}, {fifty: 'fifty'}]);
	   *
	   * @name doesNotHaveAnyDeepKeys
	   * @param {Mixed} object
	   * @param {Array|Object} keys
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.doesNotHaveAnyDeepKeys = function (obj, keys, msg) {
	    new Assertion(obj, msg, assert.doesNotHaveAnyDeepKeys, true)
	      .to.not.have.any.deep.keys(keys);
	  };

	 /**
	   * ### .doesNotHaveAllDeepKeys(object, [keys], [message])
	   *
	   * Asserts that `object` does not have at least one of the `keys` provided.
	   * Since Sets and Maps can have objects as keys you can use this assertion to perform
	   * a deep comparison.
	   * You can also provide a single object instead of a `keys` array and its keys
	   * will be used as the expected set of keys.
	   *
	   *     assert.doesNotHaveAllDeepKeys(new Map([[{one: 'one'}, 'valueOne'], [1, 2]]), {thisDoesNot: 'exist'});
	   *     assert.doesNotHaveAllDeepKeys(new Map([[{one: 'one'}, 'valueOne'], [{two: 'two'}, 'valueTwo']]), [{twenty: 'twenty'}, {one: 'one'}]);
	   *     assert.doesNotHaveAllDeepKeys(new Set([{one: 'one'}, {two: 'two'}]), {twenty: 'twenty'});
	   *     assert.doesNotHaveAllDeepKeys(new Set([{one: 'one'}, {two: 'two'}]), [{one: 'one'}, {fifty: 'fifty'}]);
	   *
	   * @name doesNotHaveAllDeepKeys
	   * @param {Mixed} object
	   * @param {Array|Object} keys
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.doesNotHaveAllDeepKeys = function (obj, keys, msg) {
	    new Assertion(obj, msg, assert.doesNotHaveAllDeepKeys, true)
	      .to.not.have.all.deep.keys(keys);
	  };

	 /**
	   * ### .throws(fn, [errorLike/string/regexp], [string/regexp], [message])
	   *
	   * If `errorLike` is an `Error` constructor, asserts that `fn` will throw an error that is an
	   * instance of `errorLike`.
	   * If `errorLike` is an `Error` instance, asserts that the error thrown is the same
	   * instance as `errorLike`.
	   * If `errMsgMatcher` is provided, it also asserts that the error thrown will have a
	   * message matching `errMsgMatcher`.
	   *
	   *     assert.throws(fn, 'Error thrown must have this msg');
	   *     assert.throws(fn, /Error thrown must have a msg that matches this/);
	   *     assert.throws(fn, ReferenceError);
	   *     assert.throws(fn, errorInstance);
	   *     assert.throws(fn, ReferenceError, 'Error thrown must be a ReferenceError and have this msg');
	   *     assert.throws(fn, errorInstance, 'Error thrown must be the same errorInstance and have this msg');
	   *     assert.throws(fn, ReferenceError, /Error thrown must be a ReferenceError and match this/);
	   *     assert.throws(fn, errorInstance, /Error thrown must be the same errorInstance and match this/);
	   *
	   * @name throws
	   * @alias throw
	   * @alias Throw
	   * @param {Function} fn
	   * @param {ErrorConstructor|Error} errorLike
	   * @param {RegExp|String} errMsgMatcher
	   * @param {String} message
	   * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
	   * @namespace Assert
	   * @api public
	   */

	  assert.throws = function (fn, errorLike, errMsgMatcher, msg) {
	    if ('string' === typeof errorLike || errorLike instanceof RegExp) {
	      errMsgMatcher = errorLike;
	      errorLike = null;
	    }

	    var assertErr = new Assertion(fn, msg, assert.throws, true)
	      .to.throw(errorLike, errMsgMatcher);
	    return flag(assertErr, 'object');
	  };

	  /**
	   * ### .doesNotThrow(fn, [errorLike/string/regexp], [string/regexp], [message])
	   *
	   * If `errorLike` is an `Error` constructor, asserts that `fn` will _not_ throw an error that is an
	   * instance of `errorLike`.
	   * If `errorLike` is an `Error` instance, asserts that the error thrown is _not_ the same
	   * instance as `errorLike`.
	   * If `errMsgMatcher` is provided, it also asserts that the error thrown will _not_ have a
	   * message matching `errMsgMatcher`.
	   *
	   *     assert.doesNotThrow(fn, 'Any Error thrown must not have this message');
	   *     assert.doesNotThrow(fn, /Any Error thrown must not match this/);
	   *     assert.doesNotThrow(fn, Error);
	   *     assert.doesNotThrow(fn, errorInstance);
	   *     assert.doesNotThrow(fn, Error, 'Error must not have this message');
	   *     assert.doesNotThrow(fn, errorInstance, 'Error must not have this message');
	   *     assert.doesNotThrow(fn, Error, /Error must not match this/);
	   *     assert.doesNotThrow(fn, errorInstance, /Error must not match this/);
	   *
	   * @name doesNotThrow
	   * @param {Function} fn
	   * @param {ErrorConstructor} errorLike
	   * @param {RegExp|String} errMsgMatcher
	   * @param {String} message
	   * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
	   * @namespace Assert
	   * @api public
	   */

	  assert.doesNotThrow = function (fn, errorLike, errMsgMatcher, msg) {
	    if ('string' === typeof errorLike || errorLike instanceof RegExp) {
	      errMsgMatcher = errorLike;
	      errorLike = null;
	    }

	    new Assertion(fn, msg, assert.doesNotThrow, true)
	      .to.not.throw(errorLike, errMsgMatcher);
	  };

	  /**
	   * ### .operator(val1, operator, val2, [message])
	   *
	   * Compares two values using `operator`.
	   *
	   *     assert.operator(1, '<', 2, 'everything is ok');
	   *     assert.operator(1, '>', 2, 'this will fail');
	   *
	   * @name operator
	   * @param {Mixed} val1
	   * @param {String} operator
	   * @param {Mixed} val2
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.operator = function (val, operator, val2, msg) {
	    var ok;
	    switch(operator) {
	      case '==':
	        ok = val == val2;
	        break;
	      case '===':
	        ok = val === val2;
	        break;
	      case '>':
	        ok = val > val2;
	        break;
	      case '>=':
	        ok = val >= val2;
	        break;
	      case '<':
	        ok = val < val2;
	        break;
	      case '<=':
	        ok = val <= val2;
	        break;
	      case '!=':
	        ok = val != val2;
	        break;
	      case '!==':
	        ok = val !== val2;
	        break;
	      default:
	        msg = msg ? msg + ': ' : msg;
	        throw new chai.AssertionError(
	          msg + 'Invalid operator "' + operator + '"',
	          undefined,
	          assert.operator
	        );
	    }
	    var test = new Assertion(ok, msg, assert.operator, true);
	    test.assert(
	        true === flag(test, 'object')
	      , 'expected ' + util.inspect(val) + ' to be ' + operator + ' ' + util.inspect(val2)
	      , 'expected ' + util.inspect(val) + ' to not be ' + operator + ' ' + util.inspect(val2) );
	  };

	  /**
	   * ### .closeTo(actual, expected, delta, [message])
	   *
	   * Asserts that the target is equal `expected`, to within a +/- `delta` range.
	   *
	   *     assert.closeTo(1.5, 1, 0.5, 'numbers are close');
	   *
	   * @name closeTo
	   * @param {Number} actual
	   * @param {Number} expected
	   * @param {Number} delta
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.closeTo = function (act, exp, delta, msg) {
	    new Assertion(act, msg, assert.closeTo, true).to.be.closeTo(exp, delta);
	  };

	  /**
	   * ### .approximately(actual, expected, delta, [message])
	   *
	   * Asserts that the target is equal `expected`, to within a +/- `delta` range.
	   *
	   *     assert.approximately(1.5, 1, 0.5, 'numbers are close');
	   *
	   * @name approximately
	   * @param {Number} actual
	   * @param {Number} expected
	   * @param {Number} delta
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.approximately = function (act, exp, delta, msg) {
	    new Assertion(act, msg, assert.approximately, true)
	      .to.be.approximately(exp, delta);
	  };

	  /**
	   * ### .sameMembers(set1, set2, [message])
	   *
	   * Asserts that `set1` and `set2` have the same members in any order. Uses a
	   * strict equality check (===).
	   *
	   *     assert.sameMembers([ 1, 2, 3 ], [ 2, 1, 3 ], 'same members');
	   *
	   * @name sameMembers
	   * @param {Array} set1
	   * @param {Array} set2
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.sameMembers = function (set1, set2, msg) {
	    new Assertion(set1, msg, assert.sameMembers, true)
	      .to.have.same.members(set2);
	  };

	  /**
	   * ### .notSameMembers(set1, set2, [message])
	   *
	   * Asserts that `set1` and `set2` don't have the same members in any order.
	   * Uses a strict equality check (===).
	   *
	   *     assert.notSameMembers([ 1, 2, 3 ], [ 5, 1, 3 ], 'not same members');
	   *
	   * @name notSameMembers
	   * @param {Array} set1
	   * @param {Array} set2
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notSameMembers = function (set1, set2, msg) {
	    new Assertion(set1, msg, assert.notSameMembers, true)
	      .to.not.have.same.members(set2);
	  };

	  /**
	   * ### .sameDeepMembers(set1, set2, [message])
	   *
	   * Asserts that `set1` and `set2` have the same members in any order. Uses a
	   * deep equality check.
	   *
	   *     assert.sameDeepMembers([ { a: 1 }, { b: 2 }, { c: 3 } ], [{ b: 2 }, { a: 1 }, { c: 3 }], 'same deep members');
	   *
	   * @name sameDeepMembers
	   * @param {Array} set1
	   * @param {Array} set2
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.sameDeepMembers = function (set1, set2, msg) {
	    new Assertion(set1, msg, assert.sameDeepMembers, true)
	      .to.have.same.deep.members(set2);
	  };

	  /**
	   * ### .notSameDeepMembers(set1, set2, [message])
	   *
	   * Asserts that `set1` and `set2` don't have the same members in any order.
	   * Uses a deep equality check.
	   *
	   *     assert.notSameDeepMembers([ { a: 1 }, { b: 2 }, { c: 3 } ], [{ b: 2 }, { a: 1 }, { f: 5 }], 'not same deep members');
	   *
	   * @name notSameDeepMembers
	   * @param {Array} set1
	   * @param {Array} set2
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notSameDeepMembers = function (set1, set2, msg) {
	    new Assertion(set1, msg, assert.notSameDeepMembers, true)
	      .to.not.have.same.deep.members(set2);
	  };

	  /**
	   * ### .sameOrderedMembers(set1, set2, [message])
	   *
	   * Asserts that `set1` and `set2` have the same members in the same order.
	   * Uses a strict equality check (===).
	   *
	   *     assert.sameOrderedMembers([ 1, 2, 3 ], [ 1, 2, 3 ], 'same ordered members');
	   *
	   * @name sameOrderedMembers
	   * @param {Array} set1
	   * @param {Array} set2
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.sameOrderedMembers = function (set1, set2, msg) {
	    new Assertion(set1, msg, assert.sameOrderedMembers, true)
	      .to.have.same.ordered.members(set2);
	  };

	  /**
	   * ### .notSameOrderedMembers(set1, set2, [message])
	   *
	   * Asserts that `set1` and `set2` don't have the same members in the same
	   * order. Uses a strict equality check (===).
	   *
	   *     assert.notSameOrderedMembers([ 1, 2, 3 ], [ 2, 1, 3 ], 'not same ordered members');
	   *
	   * @name notSameOrderedMembers
	   * @param {Array} set1
	   * @param {Array} set2
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notSameOrderedMembers = function (set1, set2, msg) {
	    new Assertion(set1, msg, assert.notSameOrderedMembers, true)
	      .to.not.have.same.ordered.members(set2);
	  };

	  /**
	   * ### .sameDeepOrderedMembers(set1, set2, [message])
	   *
	   * Asserts that `set1` and `set2` have the same members in the same order.
	   * Uses a deep equality check.
	   *
	   *     assert.sameDeepOrderedMembers([ { a: 1 }, { b: 2 }, { c: 3 } ], [ { a: 1 }, { b: 2 }, { c: 3 } ], 'same deep ordered members');
	   *
	   * @name sameDeepOrderedMembers
	   * @param {Array} set1
	   * @param {Array} set2
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.sameDeepOrderedMembers = function (set1, set2, msg) {
	    new Assertion(set1, msg, assert.sameDeepOrderedMembers, true)
	      .to.have.same.deep.ordered.members(set2);
	  };

	  /**
	   * ### .notSameDeepOrderedMembers(set1, set2, [message])
	   *
	   * Asserts that `set1` and `set2` don't have the same members in the same
	   * order. Uses a deep equality check.
	   *
	   *     assert.notSameDeepOrderedMembers([ { a: 1 }, { b: 2 }, { c: 3 } ], [ { a: 1 }, { b: 2 }, { z: 5 } ], 'not same deep ordered members');
	   *     assert.notSameDeepOrderedMembers([ { a: 1 }, { b: 2 }, { c: 3 } ], [ { b: 2 }, { a: 1 }, { c: 3 } ], 'not same deep ordered members');
	   *
	   * @name notSameDeepOrderedMembers
	   * @param {Array} set1
	   * @param {Array} set2
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notSameDeepOrderedMembers = function (set1, set2, msg) {
	    new Assertion(set1, msg, assert.notSameDeepOrderedMembers, true)
	      .to.not.have.same.deep.ordered.members(set2);
	  };

	  /**
	   * ### .includeMembers(superset, subset, [message])
	   *
	   * Asserts that `subset` is included in `superset` in any order. Uses a
	   * strict equality check (===). Duplicates are ignored.
	   *
	   *     assert.includeMembers([ 1, 2, 3 ], [ 2, 1, 2 ], 'include members');
	   *
	   * @name includeMembers
	   * @param {Array} superset
	   * @param {Array} subset
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.includeMembers = function (superset, subset, msg) {
	    new Assertion(superset, msg, assert.includeMembers, true)
	      .to.include.members(subset);
	  };

	  /**
	   * ### .notIncludeMembers(superset, subset, [message])
	   *
	   * Asserts that `subset` isn't included in `superset` in any order. Uses a
	   * strict equality check (===). Duplicates are ignored.
	   *
	   *     assert.notIncludeMembers([ 1, 2, 3 ], [ 5, 1 ], 'not include members');
	   *
	   * @name notIncludeMembers
	   * @param {Array} superset
	   * @param {Array} subset
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notIncludeMembers = function (superset, subset, msg) {
	    new Assertion(superset, msg, assert.notIncludeMembers, true)
	      .to.not.include.members(subset);
	  };

	  /**
	   * ### .includeDeepMembers(superset, subset, [message])
	   *
	   * Asserts that `subset` is included in `superset` in any order. Uses a deep
	   * equality check. Duplicates are ignored.
	   *
	   *     assert.includeDeepMembers([ { a: 1 }, { b: 2 }, { c: 3 } ], [ { b: 2 }, { a: 1 }, { b: 2 } ], 'include deep members');
	   *
	   * @name includeDeepMembers
	   * @param {Array} superset
	   * @param {Array} subset
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.includeDeepMembers = function (superset, subset, msg) {
	    new Assertion(superset, msg, assert.includeDeepMembers, true)
	      .to.include.deep.members(subset);
	  };

	  /**
	   * ### .notIncludeDeepMembers(superset, subset, [message])
	   *
	   * Asserts that `subset` isn't included in `superset` in any order. Uses a
	   * deep equality check. Duplicates are ignored.
	   *
	   *     assert.notIncludeDeepMembers([ { a: 1 }, { b: 2 }, { c: 3 } ], [ { b: 2 }, { f: 5 } ], 'not include deep members');
	   *
	   * @name notIncludeDeepMembers
	   * @param {Array} superset
	   * @param {Array} subset
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notIncludeDeepMembers = function (superset, subset, msg) {
	    new Assertion(superset, msg, assert.notIncludeDeepMembers, true)
	      .to.not.include.deep.members(subset);
	  };

	  /**
	   * ### .includeOrderedMembers(superset, subset, [message])
	   *
	   * Asserts that `subset` is included in `superset` in the same order
	   * beginning with the first element in `superset`. Uses a strict equality
	   * check (===).
	   *
	   *     assert.includeOrderedMembers([ 1, 2, 3 ], [ 1, 2 ], 'include ordered members');
	   *
	   * @name includeOrderedMembers
	   * @param {Array} superset
	   * @param {Array} subset
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.includeOrderedMembers = function (superset, subset, msg) {
	    new Assertion(superset, msg, assert.includeOrderedMembers, true)
	      .to.include.ordered.members(subset);
	  };

	  /**
	   * ### .notIncludeOrderedMembers(superset, subset, [message])
	   *
	   * Asserts that `subset` isn't included in `superset` in the same order
	   * beginning with the first element in `superset`. Uses a strict equality
	   * check (===).
	   *
	   *     assert.notIncludeOrderedMembers([ 1, 2, 3 ], [ 2, 1 ], 'not include ordered members');
	   *     assert.notIncludeOrderedMembers([ 1, 2, 3 ], [ 2, 3 ], 'not include ordered members');
	   *
	   * @name notIncludeOrderedMembers
	   * @param {Array} superset
	   * @param {Array} subset
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notIncludeOrderedMembers = function (superset, subset, msg) {
	    new Assertion(superset, msg, assert.notIncludeOrderedMembers, true)
	      .to.not.include.ordered.members(subset);
	  };

	  /**
	   * ### .includeDeepOrderedMembers(superset, subset, [message])
	   *
	   * Asserts that `subset` is included in `superset` in the same order
	   * beginning with the first element in `superset`. Uses a deep equality
	   * check.
	   *
	   *     assert.includeDeepOrderedMembers([ { a: 1 }, { b: 2 }, { c: 3 } ], [ { a: 1 }, { b: 2 } ], 'include deep ordered members');
	   *
	   * @name includeDeepOrderedMembers
	   * @param {Array} superset
	   * @param {Array} subset
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.includeDeepOrderedMembers = function (superset, subset, msg) {
	    new Assertion(superset, msg, assert.includeDeepOrderedMembers, true)
	      .to.include.deep.ordered.members(subset);
	  };

	  /**
	   * ### .notIncludeDeepOrderedMembers(superset, subset, [message])
	   *
	   * Asserts that `subset` isn't included in `superset` in the same order
	   * beginning with the first element in `superset`. Uses a deep equality
	   * check.
	   *
	   *     assert.notIncludeDeepOrderedMembers([ { a: 1 }, { b: 2 }, { c: 3 } ], [ { a: 1 }, { f: 5 } ], 'not include deep ordered members');
	   *     assert.notIncludeDeepOrderedMembers([ { a: 1 }, { b: 2 }, { c: 3 } ], [ { b: 2 }, { a: 1 } ], 'not include deep ordered members');
	   *     assert.notIncludeDeepOrderedMembers([ { a: 1 }, { b: 2 }, { c: 3 } ], [ { b: 2 }, { c: 3 } ], 'not include deep ordered members');
	   *
	   * @name notIncludeDeepOrderedMembers
	   * @param {Array} superset
	   * @param {Array} subset
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.notIncludeDeepOrderedMembers = function (superset, subset, msg) {
	    new Assertion(superset, msg, assert.notIncludeDeepOrderedMembers, true)
	      .to.not.include.deep.ordered.members(subset);
	  };

	  /**
	   * ### .oneOf(inList, list, [message])
	   *
	   * Asserts that non-object, non-array value `inList` appears in the flat array `list`.
	   *
	   *     assert.oneOf(1, [ 2, 1 ], 'Not found in list');
	   *
	   * @name oneOf
	   * @param {*} inList
	   * @param {Array<*>} list
	   * @param {String} message
	   * @namespace Assert
	   * @api public
	   */

	  assert.oneOf = function (inList, list, msg) {
	    new Assertion(inList, msg, assert.oneOf, true).to.be.oneOf(list);
	  };

	  /**
	   * ### .changes(function, object, property, [message])
	   *
	   * Asserts that a function changes the value of a property.
	   *
	   *     var obj = { val: 10 };
	   *     var fn = function() { obj.val = 22 };
	   *     assert.changes(fn, obj, 'val');
	   *
	   * @name changes
	   * @param {Function} modifier function
	   * @param {Object} object or getter function
	   * @param {String} property name _optional_
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.changes = function (fn, obj, prop, msg) {
	    if (arguments.length === 3 && typeof obj === 'function') {
	      msg = prop;
	      prop = null;
	    }

	    new Assertion(fn, msg, assert.changes, true).to.change(obj, prop);
	  };

	   /**
	   * ### .changesBy(function, object, property, delta, [message])
	   *
	   * Asserts that a function changes the value of a property by an amount (delta).
	   *
	   *     var obj = { val: 10 };
	   *     var fn = function() { obj.val += 2 };
	   *     assert.changesBy(fn, obj, 'val', 2);
	   *
	   * @name changesBy
	   * @param {Function} modifier function
	   * @param {Object} object or getter function
	   * @param {String} property name _optional_
	   * @param {Number} change amount (delta)
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.changesBy = function (fn, obj, prop, delta, msg) {
	    if (arguments.length === 4 && typeof obj === 'function') {
	      var tmpMsg = delta;
	      delta = prop;
	      msg = tmpMsg;
	    } else if (arguments.length === 3) {
	      delta = prop;
	      prop = null;
	    }

	    new Assertion(fn, msg, assert.changesBy, true)
	      .to.change(obj, prop).by(delta);
	  };

	   /**
	   * ### .doesNotChange(function, object, property, [message])
	   *
	   * Asserts that a function does not change the value of a property.
	   *
	   *     var obj = { val: 10 };
	   *     var fn = function() { console.log('foo'); };
	   *     assert.doesNotChange(fn, obj, 'val');
	   *
	   * @name doesNotChange
	   * @param {Function} modifier function
	   * @param {Object} object or getter function
	   * @param {String} property name _optional_
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.doesNotChange = function (fn, obj, prop, msg) {
	    if (arguments.length === 3 && typeof obj === 'function') {
	      msg = prop;
	      prop = null;
	    }

	    return new Assertion(fn, msg, assert.doesNotChange, true)
	      .to.not.change(obj, prop);
	  };

	  /**
	   * ### .changesButNotBy(function, object, property, delta, [message])
	   *
	   * Asserts that a function does not change the value of a property or of a function's return value by an amount (delta)
	   *
	   *     var obj = { val: 10 };
	   *     var fn = function() { obj.val += 10 };
	   *     assert.changesButNotBy(fn, obj, 'val', 5);
	   *
	   * @name changesButNotBy
	   * @param {Function} modifier function
	   * @param {Object} object or getter function
	   * @param {String} property name _optional_
	   * @param {Number} change amount (delta)
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.changesButNotBy = function (fn, obj, prop, delta, msg) {
	    if (arguments.length === 4 && typeof obj === 'function') {
	      var tmpMsg = delta;
	      delta = prop;
	      msg = tmpMsg;
	    } else if (arguments.length === 3) {
	      delta = prop;
	      prop = null;
	    }

	    new Assertion(fn, msg, assert.changesButNotBy, true)
	      .to.change(obj, prop).but.not.by(delta);
	  };

	  /**
	   * ### .increases(function, object, property, [message])
	   *
	   * Asserts that a function increases a numeric object property.
	   *
	   *     var obj = { val: 10 };
	   *     var fn = function() { obj.val = 13 };
	   *     assert.increases(fn, obj, 'val');
	   *
	   * @name increases
	   * @param {Function} modifier function
	   * @param {Object} object or getter function
	   * @param {String} property name _optional_
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.increases = function (fn, obj, prop, msg) {
	    if (arguments.length === 3 && typeof obj === 'function') {
	      msg = prop;
	      prop = null;
	    }

	    return new Assertion(fn, msg, assert.increases, true)
	      .to.increase(obj, prop);
	  };

	  /**
	   * ### .increasesBy(function, object, property, delta, [message])
	   *
	   * Asserts that a function increases a numeric object property or a function's return value by an amount (delta).
	   *
	   *     var obj = { val: 10 };
	   *     var fn = function() { obj.val += 10 };
	   *     assert.increasesBy(fn, obj, 'val', 10);
	   *
	   * @name increasesBy
	   * @param {Function} modifier function
	   * @param {Object} object or getter function
	   * @param {String} property name _optional_
	   * @param {Number} change amount (delta)
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.increasesBy = function (fn, obj, prop, delta, msg) {
	    if (arguments.length === 4 && typeof obj === 'function') {
	      var tmpMsg = delta;
	      delta = prop;
	      msg = tmpMsg;
	    } else if (arguments.length === 3) {
	      delta = prop;
	      prop = null;
	    }

	    new Assertion(fn, msg, assert.increasesBy, true)
	      .to.increase(obj, prop).by(delta);
	  };

	  /**
	   * ### .doesNotIncrease(function, object, property, [message])
	   *
	   * Asserts that a function does not increase a numeric object property.
	   *
	   *     var obj = { val: 10 };
	   *     var fn = function() { obj.val = 8 };
	   *     assert.doesNotIncrease(fn, obj, 'val');
	   *
	   * @name doesNotIncrease
	   * @param {Function} modifier function
	   * @param {Object} object or getter function
	   * @param {String} property name _optional_
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.doesNotIncrease = function (fn, obj, prop, msg) {
	    if (arguments.length === 3 && typeof obj === 'function') {
	      msg = prop;
	      prop = null;
	    }

	    return new Assertion(fn, msg, assert.doesNotIncrease, true)
	      .to.not.increase(obj, prop);
	  };

	  /**
	   * ### .increasesButNotBy(function, object, property, delta, [message])
	   *
	   * Asserts that a function does not increase a numeric object property or function's return value by an amount (delta).
	   *
	   *     var obj = { val: 10 };
	   *     var fn = function() { obj.val = 15 };
	   *     assert.increasesButNotBy(fn, obj, 'val', 10);
	   *
	   * @name increasesButNotBy
	   * @param {Function} modifier function
	   * @param {Object} object or getter function
	   * @param {String} property name _optional_
	   * @param {Number} change amount (delta)
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.increasesButNotBy = function (fn, obj, prop, delta, msg) {
	    if (arguments.length === 4 && typeof obj === 'function') {
	      var tmpMsg = delta;
	      delta = prop;
	      msg = tmpMsg;
	    } else if (arguments.length === 3) {
	      delta = prop;
	      prop = null;
	    }

	    new Assertion(fn, msg, assert.increasesButNotBy, true)
	      .to.increase(obj, prop).but.not.by(delta);
	  };

	  /**
	   * ### .decreases(function, object, property, [message])
	   *
	   * Asserts that a function decreases a numeric object property.
	   *
	   *     var obj = { val: 10 };
	   *     var fn = function() { obj.val = 5 };
	   *     assert.decreases(fn, obj, 'val');
	   *
	   * @name decreases
	   * @param {Function} modifier function
	   * @param {Object} object or getter function
	   * @param {String} property name _optional_
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.decreases = function (fn, obj, prop, msg) {
	    if (arguments.length === 3 && typeof obj === 'function') {
	      msg = prop;
	      prop = null;
	    }

	    return new Assertion(fn, msg, assert.decreases, true)
	      .to.decrease(obj, prop);
	  };

	  /**
	   * ### .decreasesBy(function, object, property, delta, [message])
	   *
	   * Asserts that a function decreases a numeric object property or a function's return value by an amount (delta)
	   *
	   *     var obj = { val: 10 };
	   *     var fn = function() { obj.val -= 5 };
	   *     assert.decreasesBy(fn, obj, 'val', 5);
	   *
	   * @name decreasesBy
	   * @param {Function} modifier function
	   * @param {Object} object or getter function
	   * @param {String} property name _optional_
	   * @param {Number} change amount (delta)
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.decreasesBy = function (fn, obj, prop, delta, msg) {
	    if (arguments.length === 4 && typeof obj === 'function') {
	      var tmpMsg = delta;
	      delta = prop;
	      msg = tmpMsg;
	    } else if (arguments.length === 3) {
	      delta = prop;
	      prop = null;
	    }

	    new Assertion(fn, msg, assert.decreasesBy, true)
	      .to.decrease(obj, prop).by(delta);
	  };

	  /**
	   * ### .doesNotDecrease(function, object, property, [message])
	   *
	   * Asserts that a function does not decreases a numeric object property.
	   *
	   *     var obj = { val: 10 };
	   *     var fn = function() { obj.val = 15 };
	   *     assert.doesNotDecrease(fn, obj, 'val');
	   *
	   * @name doesNotDecrease
	   * @param {Function} modifier function
	   * @param {Object} object or getter function
	   * @param {String} property name _optional_
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.doesNotDecrease = function (fn, obj, prop, msg) {
	    if (arguments.length === 3 && typeof obj === 'function') {
	      msg = prop;
	      prop = null;
	    }

	    return new Assertion(fn, msg, assert.doesNotDecrease, true)
	      .to.not.decrease(obj, prop);
	  };

	  /**
	   * ### .doesNotDecreaseBy(function, object, property, delta, [message])
	   *
	   * Asserts that a function does not decreases a numeric object property or a function's return value by an amount (delta)
	   *
	   *     var obj = { val: 10 };
	   *     var fn = function() { obj.val = 5 };
	   *     assert.doesNotDecreaseBy(fn, obj, 'val', 1);
	   *
	   * @name doesNotDecreaseBy
	   * @param {Function} modifier function
	   * @param {Object} object or getter function
	   * @param {String} property name _optional_
	   * @param {Number} change amount (delta)
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.doesNotDecreaseBy = function (fn, obj, prop, delta, msg) {
	    if (arguments.length === 4 && typeof obj === 'function') {
	      var tmpMsg = delta;
	      delta = prop;
	      msg = tmpMsg;
	    } else if (arguments.length === 3) {
	      delta = prop;
	      prop = null;
	    }

	    return new Assertion(fn, msg, assert.doesNotDecreaseBy, true)
	      .to.not.decrease(obj, prop).by(delta);
	  };

	  /**
	   * ### .decreasesButNotBy(function, object, property, delta, [message])
	   *
	   * Asserts that a function does not decreases a numeric object property or a function's return value by an amount (delta)
	   *
	   *     var obj = { val: 10 };
	   *     var fn = function() { obj.val = 5 };
	   *     assert.decreasesButNotBy(fn, obj, 'val', 1);
	   *
	   * @name decreasesButNotBy
	   * @param {Function} modifier function
	   * @param {Object} object or getter function
	   * @param {String} property name _optional_
	   * @param {Number} change amount (delta)
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.decreasesButNotBy = function (fn, obj, prop, delta, msg) {
	    if (arguments.length === 4 && typeof obj === 'function') {
	      var tmpMsg = delta;
	      delta = prop;
	      msg = tmpMsg;
	    } else if (arguments.length === 3) {
	      delta = prop;
	      prop = null;
	    }

	    new Assertion(fn, msg, assert.decreasesButNotBy, true)
	      .to.decrease(obj, prop).but.not.by(delta);
	  };

	  /*!
	   * ### .ifError(object)
	   *
	   * Asserts if value is not a false value, and throws if it is a true value.
	   * This is added to allow for chai to be a drop-in replacement for Node's
	   * assert class.
	   *
	   *     var err = new Error('I am a custom error');
	   *     assert.ifError(err); // Rethrows err!
	   *
	   * @name ifError
	   * @param {Object} object
	   * @namespace Assert
	   * @api public
	   */

	  assert.ifError = function (val) {
	    if (val) {
	      throw(val);
	    }
	  };

	  /**
	   * ### .isExtensible(object)
	   *
	   * Asserts that `object` is extensible (can have new properties added to it).
	   *
	   *     assert.isExtensible({});
	   *
	   * @name isExtensible
	   * @alias extensible
	   * @param {Object} object
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.isExtensible = function (obj, msg) {
	    new Assertion(obj, msg, assert.isExtensible, true).to.be.extensible;
	  };

	  /**
	   * ### .isNotExtensible(object)
	   *
	   * Asserts that `object` is _not_ extensible.
	   *
	   *     var nonExtensibleObject = Object.preventExtensions({});
	   *     var sealedObject = Object.seal({});
	   *     var frozenObject = Object.freeze({});
	   *
	   *     assert.isNotExtensible(nonExtensibleObject);
	   *     assert.isNotExtensible(sealedObject);
	   *     assert.isNotExtensible(frozenObject);
	   *
	   * @name isNotExtensible
	   * @alias notExtensible
	   * @param {Object} object
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNotExtensible = function (obj, msg) {
	    new Assertion(obj, msg, assert.isNotExtensible, true).to.not.be.extensible;
	  };

	  /**
	   * ### .isSealed(object)
	   *
	   * Asserts that `object` is sealed (cannot have new properties added to it
	   * and its existing properties cannot be removed).
	   *
	   *     var sealedObject = Object.seal({});
	   *     var frozenObject = Object.seal({});
	   *
	   *     assert.isSealed(sealedObject);
	   *     assert.isSealed(frozenObject);
	   *
	   * @name isSealed
	   * @alias sealed
	   * @param {Object} object
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.isSealed = function (obj, msg) {
	    new Assertion(obj, msg, assert.isSealed, true).to.be.sealed;
	  };

	  /**
	   * ### .isNotSealed(object)
	   *
	   * Asserts that `object` is _not_ sealed.
	   *
	   *     assert.isNotSealed({});
	   *
	   * @name isNotSealed
	   * @alias notSealed
	   * @param {Object} object
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNotSealed = function (obj, msg) {
	    new Assertion(obj, msg, assert.isNotSealed, true).to.not.be.sealed;
	  };

	  /**
	   * ### .isFrozen(object)
	   *
	   * Asserts that `object` is frozen (cannot have new properties added to it
	   * and its existing properties cannot be modified).
	   *
	   *     var frozenObject = Object.freeze({});
	   *     assert.frozen(frozenObject);
	   *
	   * @name isFrozen
	   * @alias frozen
	   * @param {Object} object
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.isFrozen = function (obj, msg) {
	    new Assertion(obj, msg, assert.isFrozen, true).to.be.frozen;
	  };

	  /**
	   * ### .isNotFrozen(object)
	   *
	   * Asserts that `object` is _not_ frozen.
	   *
	   *     assert.isNotFrozen({});
	   *
	   * @name isNotFrozen
	   * @alias notFrozen
	   * @param {Object} object
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNotFrozen = function (obj, msg) {
	    new Assertion(obj, msg, assert.isNotFrozen, true).to.not.be.frozen;
	  };

	  /**
	   * ### .isEmpty(target)
	   *
	   * Asserts that the target does not contain any values.
	   * For arrays and strings, it checks the `length` property.
	   * For `Map` and `Set` instances, it checks the `size` property.
	   * For non-function objects, it gets the count of own
	   * enumerable string keys.
	   *
	   *     assert.isEmpty([]);
	   *     assert.isEmpty('');
	   *     assert.isEmpty(new Map);
	   *     assert.isEmpty({});
	   *
	   * @name isEmpty
	   * @alias empty
	   * @param {Object|Array|String|Map|Set} target
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.isEmpty = function(val, msg) {
	    new Assertion(val, msg, assert.isEmpty, true).to.be.empty;
	  };

	  /**
	   * ### .isNotEmpty(target)
	   *
	   * Asserts that the target contains values.
	   * For arrays and strings, it checks the `length` property.
	   * For `Map` and `Set` instances, it checks the `size` property.
	   * For non-function objects, it gets the count of own
	   * enumerable string keys.
	   *
	   *     assert.isNotEmpty([1, 2]);
	   *     assert.isNotEmpty('34');
	   *     assert.isNotEmpty(new Set([5, 6]));
	   *     assert.isNotEmpty({ key: 7 });
	   *
	   * @name isNotEmpty
	   * @alias notEmpty
	   * @param {Object|Array|String|Map|Set} target
	   * @param {String} message _optional_
	   * @namespace Assert
	   * @api public
	   */

	  assert.isNotEmpty = function(val, msg) {
	    new Assertion(val, msg, assert.isNotEmpty, true).to.not.be.empty;
	  };

	  /*!
	   * Aliases.
	   */

	  (function alias(name, as){
	    assert[as] = assert[name];
	    return alias;
	  })
	  ('isOk', 'ok')
	  ('isNotOk', 'notOk')
	  ('throws', 'throw')
	  ('throws', 'Throw')
	  ('isExtensible', 'extensible')
	  ('isNotExtensible', 'notExtensible')
	  ('isSealed', 'sealed')
	  ('isNotSealed', 'notSealed')
	  ('isFrozen', 'frozen')
	  ('isNotFrozen', 'notFrozen')
	  ('isEmpty', 'empty')
	  ('isNotEmpty', 'notEmpty');
	};

	var assert$2 = /*@__PURE__*/getDefaultExportFromCjs(assert$1);

	/*!
	 * chai
	 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
	 * MIT Licensed
	 */

	var hasRequiredChai;

	function requireChai () {
		if (hasRequiredChai) return chai$2;
		hasRequiredChai = 1;
		(function (exports) {
			var used = [];

			/*!
			 * Chai version
			 */

			exports.version = '4.3.8';

			/*!
			 * Assertion Error
			 */

			exports.AssertionError = assertionError;

			/*!
			 * Utils for plugins (not exported)
			 */

			var util = requireUtils();

			/**
			 * # .use(function)
			 *
			 * Provides a way to extend the internals of Chai.
			 *
			 * @param {Function}
			 * @returns {this} for chaining
			 * @api public
			 */

			exports.use = function (fn) {
			  if (!~used.indexOf(fn)) {
			    fn(exports, util);
			    used.push(fn);
			  }

			  return exports;
			};

			/*!
			 * Utility Functions
			 */

			exports.util = util;

			/*!
			 * Configuration
			 */

			var config = config$6;
			exports.config = config;

			/*!
			 * Primary `Assertion` prototype
			 */

			var assertion$1 = assertion;
			exports.use(assertion$1);

			/*!
			 * Core Assertions
			 */

			var core = assertions;
			exports.use(core);

			/*!
			 * Expect interface
			 */

			var expect = expect$1;
			exports.use(expect);

			/*!
			 * Should interface
			 */

			var should = should$1;
			exports.use(should);

			/*!
			 * Assert interface
			 */

			var assert = assert$1;
			exports.use(assert); 
		} (chai$2));
		return chai$2;
	}

	var chai = requireChai();

	var chai$1 = /*@__PURE__*/getDefaultExportFromCjs(chai);

	const expect = chai$1.expect;
	const version = chai$1.version;
	const Assertion = chai$1.Assertion;
	const AssertionError = chai$1.AssertionError;
	const util = chai$1.util;
	const config = chai$1.config;
	const use = chai$1.use;
	const should = chai$1.should;
	const assert = chai$1.assert;
	const core = chai$1.core;

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	const ValidPhaseNames = new Set(["Deserialize", "Serialize", "Retry", "Sign"]);
	/**
	 * A private implementation of Pipeline.
	 * Do not export this class from the package.
	 * @internal
	 */
	class HttpPipeline {
	    constructor(policies) {
	        var _a;
	        this._policies = [];
	        this._policies = (_a = policies === null || policies === void 0 ? void 0 : policies.slice(0)) !== null && _a !== void 0 ? _a : [];
	        this._orderedPolicies = undefined;
	    }
	    addPolicy(policy, options = {}) {
	        if (options.phase && options.afterPhase) {
	            throw new Error("Policies inside a phase cannot specify afterPhase.");
	        }
	        if (options.phase && !ValidPhaseNames.has(options.phase)) {
	            throw new Error(`Invalid phase name: ${options.phase}`);
	        }
	        if (options.afterPhase && !ValidPhaseNames.has(options.afterPhase)) {
	            throw new Error(`Invalid afterPhase name: ${options.afterPhase}`);
	        }
	        this._policies.push({
	            policy,
	            options,
	        });
	        this._orderedPolicies = undefined;
	    }
	    removePolicy(options) {
	        const removedPolicies = [];
	        this._policies = this._policies.filter((policyDescriptor) => {
	            if ((options.name && policyDescriptor.policy.name === options.name) ||
	                (options.phase && policyDescriptor.options.phase === options.phase)) {
	                removedPolicies.push(policyDescriptor.policy);
	                return false;
	            }
	            else {
	                return true;
	            }
	        });
	        this._orderedPolicies = undefined;
	        return removedPolicies;
	    }
	    sendRequest(httpClient, request) {
	        const policies = this.getOrderedPolicies();
	        const pipeline = policies.reduceRight((next, policy) => {
	            return (req) => {
	                return policy.sendRequest(req, next);
	            };
	        }, (req) => httpClient.sendRequest(req));
	        return pipeline(request);
	    }
	    getOrderedPolicies() {
	        if (!this._orderedPolicies) {
	            this._orderedPolicies = this.orderPolicies();
	        }
	        return this._orderedPolicies;
	    }
	    clone() {
	        return new HttpPipeline(this._policies);
	    }
	    static create() {
	        return new HttpPipeline();
	    }
	    orderPolicies() {
	        /**
	         * The goal of this method is to reliably order pipeline policies
	         * based on their declared requirements when they were added.
	         *
	         * Order is first determined by phase:
	         *
	         * 1. Serialize Phase
	         * 2. Policies not in a phase
	         * 3. Deserialize Phase
	         * 4. Retry Phase
	         * 5. Sign Phase
	         *
	         * Within each phase, policies are executed in the order
	         * they were added unless they were specified to execute
	         * before/after other policies or after a particular phase.
	         *
	         * To determine the final order, we will walk the policy list
	         * in phase order multiple times until all dependencies are
	         * satisfied.
	         *
	         * `afterPolicies` are the set of policies that must be
	         * executed before a given policy. This requirement is
	         * considered satisfied when each of the listed policies
	         * have been scheduled.
	         *
	         * `beforePolicies` are the set of policies that must be
	         * executed after a given policy. Since this dependency
	         * can be expressed by converting it into a equivalent
	         * `afterPolicies` declarations, they are normalized
	         * into that form for simplicity.
	         *
	         * An `afterPhase` dependency is considered satisfied when all
	         * policies in that phase have scheduled.
	         *
	         */
	        const result = [];
	        // Track all policies we know about.
	        const policyMap = new Map();
	        function createPhase(name) {
	            return {
	                name,
	                policies: new Set(),
	                hasRun: false,
	                hasAfterPolicies: false,
	            };
	        }
	        // Track policies for each phase.
	        const serializePhase = createPhase("Serialize");
	        const noPhase = createPhase("None");
	        const deserializePhase = createPhase("Deserialize");
	        const retryPhase = createPhase("Retry");
	        const signPhase = createPhase("Sign");
	        // a list of phases in order
	        const orderedPhases = [serializePhase, noPhase, deserializePhase, retryPhase, signPhase];
	        // Small helper function to map phase name to each Phase
	        function getPhase(phase) {
	            if (phase === "Retry") {
	                return retryPhase;
	            }
	            else if (phase === "Serialize") {
	                return serializePhase;
	            }
	            else if (phase === "Deserialize") {
	                return deserializePhase;
	            }
	            else if (phase === "Sign") {
	                return signPhase;
	            }
	            else {
	                return noPhase;
	            }
	        }
	        // First walk each policy and create a node to track metadata.
	        for (const descriptor of this._policies) {
	            const policy = descriptor.policy;
	            const options = descriptor.options;
	            const policyName = policy.name;
	            if (policyMap.has(policyName)) {
	                throw new Error("Duplicate policy names not allowed in pipeline");
	            }
	            const node = {
	                policy,
	                dependsOn: new Set(),
	                dependants: new Set(),
	            };
	            if (options.afterPhase) {
	                node.afterPhase = getPhase(options.afterPhase);
	                node.afterPhase.hasAfterPolicies = true;
	            }
	            policyMap.set(policyName, node);
	            const phase = getPhase(options.phase);
	            phase.policies.add(node);
	        }
	        // Now that each policy has a node, connect dependency references.
	        for (const descriptor of this._policies) {
	            const { policy, options } = descriptor;
	            const policyName = policy.name;
	            const node = policyMap.get(policyName);
	            if (!node) {
	                throw new Error(`Missing node for policy ${policyName}`);
	            }
	            if (options.afterPolicies) {
	                for (const afterPolicyName of options.afterPolicies) {
	                    const afterNode = policyMap.get(afterPolicyName);
	                    if (afterNode) {
	                        // Linking in both directions helps later
	                        // when we want to notify dependants.
	                        node.dependsOn.add(afterNode);
	                        afterNode.dependants.add(node);
	                    }
	                }
	            }
	            if (options.beforePolicies) {
	                for (const beforePolicyName of options.beforePolicies) {
	                    const beforeNode = policyMap.get(beforePolicyName);
	                    if (beforeNode) {
	                        // To execute before another node, make it
	                        // depend on the current node.
	                        beforeNode.dependsOn.add(node);
	                        node.dependants.add(beforeNode);
	                    }
	                }
	            }
	        }
	        function walkPhase(phase) {
	            phase.hasRun = true;
	            // Sets iterate in insertion order
	            for (const node of phase.policies) {
	                if (node.afterPhase && (!node.afterPhase.hasRun || node.afterPhase.policies.size)) {
	                    // If this node is waiting on a phase to complete,
	                    // we need to skip it for now.
	                    // Even if the phase is empty, we should wait for it
	                    // to be walked to avoid re-ordering policies.
	                    continue;
	                }
	                if (node.dependsOn.size === 0) {
	                    // If there's nothing else we're waiting for, we can
	                    // add this policy to the result list.
	                    result.push(node.policy);
	                    // Notify anything that depends on this policy that
	                    // the policy has been scheduled.
	                    for (const dependant of node.dependants) {
	                        dependant.dependsOn.delete(node);
	                    }
	                    policyMap.delete(node.policy.name);
	                    phase.policies.delete(node);
	                }
	            }
	        }
	        function walkPhases() {
	            for (const phase of orderedPhases) {
	                walkPhase(phase);
	                // if the phase isn't complete
	                if (phase.policies.size > 0 && phase !== noPhase) {
	                    if (!noPhase.hasRun) {
	                        // Try running noPhase to see if that unblocks this phase next tick.
	                        // This can happen if a phase that happens before noPhase
	                        // is waiting on a noPhase policy to complete.
	                        walkPhase(noPhase);
	                    }
	                    // Don't proceed to the next phase until this phase finishes.
	                    return;
	                }
	                if (phase.hasAfterPolicies) {
	                    // Run any policies unblocked by this phase
	                    walkPhase(noPhase);
	                }
	            }
	        }
	        // Iterate until we've put every node in the result list.
	        let iteration = 0;
	        while (policyMap.size > 0) {
	            iteration++;
	            const initialResultLength = result.length;
	            // Keep walking each phase in order until we can order every node.
	            walkPhases();
	            // The result list *should* get at least one larger each time
	            // after the first full pass.
	            // Otherwise, we're going to loop forever.
	            if (result.length <= initialResultLength && iteration > 1) {
	                throw new Error("Cannot satisfy policy dependencies due to requirements cycle.");
	            }
	        }
	        return result;
	    }
	}
	/**
	 * Creates a totally empty pipeline.
	 * Useful for testing or creating a custom one.
	 */
	function createEmptyPipeline() {
	    return HttpPipeline.create();
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	function log(...args) {
	    if (args.length > 0) {
	        const firstArg = String(args[0]);
	        if (firstArg.includes(":error")) {
	            console.error(...args);
	        }
	        else if (firstArg.includes(":warning")) {
	            console.warn(...args);
	        }
	        else if (firstArg.includes(":info")) {
	            console.info(...args);
	        }
	        else if (firstArg.includes(":verbose")) {
	            console.debug(...args);
	        }
	        else {
	            console.debug(...args);
	        }
	    }
	}

	// Copyright (c) Microsoft Corporation.
	const debugEnvVariable = (typeof process !== "undefined" && process.env && process.env.DEBUG) || undefined;
	let enabledString;
	let enabledNamespaces = [];
	let skippedNamespaces = [];
	const debuggers = [];
	if (debugEnvVariable) {
	    enable(debugEnvVariable);
	}
	const debugObj = Object.assign((namespace) => {
	    return createDebugger(namespace);
	}, {
	    enable,
	    enabled,
	    disable,
	    log,
	});
	function enable(namespaces) {
	    enabledString = namespaces;
	    enabledNamespaces = [];
	    skippedNamespaces = [];
	    const wildcard = /\*/g;
	    const namespaceList = namespaces.split(",").map((ns) => ns.trim().replace(wildcard, ".*?"));
	    for (const ns of namespaceList) {
	        if (ns.startsWith("-")) {
	            skippedNamespaces.push(new RegExp(`^${ns.substr(1)}$`));
	        }
	        else {
	            enabledNamespaces.push(new RegExp(`^${ns}$`));
	        }
	    }
	    for (const instance of debuggers) {
	        instance.enabled = enabled(instance.namespace);
	    }
	}
	function enabled(namespace) {
	    if (namespace.endsWith("*")) {
	        return true;
	    }
	    for (const skipped of skippedNamespaces) {
	        if (skipped.test(namespace)) {
	            return false;
	        }
	    }
	    for (const enabledNamespace of enabledNamespaces) {
	        if (enabledNamespace.test(namespace)) {
	            return true;
	        }
	    }
	    return false;
	}
	function disable() {
	    const result = enabledString || "";
	    enable("");
	    return result;
	}
	function createDebugger(namespace) {
	    const newDebugger = Object.assign(debug, {
	        enabled: enabled(namespace),
	        destroy,
	        log: debugObj.log,
	        namespace,
	        extend,
	    });
	    function debug(...args) {
	        if (!newDebugger.enabled) {
	            return;
	        }
	        if (args.length > 0) {
	            args[0] = `${namespace} ${args[0]}`;
	        }
	        newDebugger.log(...args);
	    }
	    debuggers.push(newDebugger);
	    return newDebugger;
	}
	function destroy() {
	    const index = debuggers.indexOf(this);
	    if (index >= 0) {
	        debuggers.splice(index, 1);
	        return true;
	    }
	    return false;
	}
	function extend(namespace) {
	    const newDebugger = createDebugger(`${this.namespace}:${namespace}`);
	    newDebugger.log = this.log;
	    return newDebugger;
	}

	// Copyright (c) Microsoft Corporation.
	const registeredLoggers = new Set();
	const logLevelFromEnv = (typeof process !== "undefined" && process.env && process.env.AZURE_LOG_LEVEL) || undefined;
	let azureLogLevel;
	/**
	 * The AzureLogger provides a mechanism for overriding where logs are output to.
	 * By default, logs are sent to stderr.
	 * Override the `log` method to redirect logs to another location.
	 */
	const AzureLogger = debugObj("azure");
	AzureLogger.log = (...args) => {
	    debugObj.log(...args);
	};
	const AZURE_LOG_LEVELS = ["verbose", "info", "warning", "error"];
	if (logLevelFromEnv) {
	    // avoid calling setLogLevel because we don't want a mis-set environment variable to crash
	    if (isAzureLogLevel(logLevelFromEnv)) {
	        setLogLevel(logLevelFromEnv);
	    }
	    else {
	        console.error(`AZURE_LOG_LEVEL set to unknown log level '${logLevelFromEnv}'; logging is not enabled. Acceptable values: ${AZURE_LOG_LEVELS.join(", ")}.`);
	    }
	}
	/**
	 * Immediately enables logging at the specified log level. If no level is specified, logging is disabled.
	 * @param level - The log level to enable for logging.
	 * Options from most verbose to least verbose are:
	 * - verbose
	 * - info
	 * - warning
	 * - error
	 */
	function setLogLevel(level) {
	    if (level && !isAzureLogLevel(level)) {
	        throw new Error(`Unknown log level '${level}'. Acceptable values: ${AZURE_LOG_LEVELS.join(",")}`);
	    }
	    azureLogLevel = level;
	    const enabledNamespaces = [];
	    for (const logger of registeredLoggers) {
	        if (shouldEnable(logger)) {
	            enabledNamespaces.push(logger.namespace);
	        }
	    }
	    debugObj.enable(enabledNamespaces.join(","));
	}
	/**
	 * Retrieves the currently specified log level.
	 */
	function getLogLevel() {
	    return azureLogLevel;
	}
	const levelMap = {
	    verbose: 400,
	    info: 300,
	    warning: 200,
	    error: 100,
	};
	/**
	 * Creates a logger for use by the Azure SDKs that inherits from `AzureLogger`.
	 * @param namespace - The name of the SDK package.
	 * @hidden
	 */
	function createClientLogger(namespace) {
	    const clientRootLogger = AzureLogger.extend(namespace);
	    patchLogMethod(AzureLogger, clientRootLogger);
	    return {
	        error: createLogger(clientRootLogger, "error"),
	        warning: createLogger(clientRootLogger, "warning"),
	        info: createLogger(clientRootLogger, "info"),
	        verbose: createLogger(clientRootLogger, "verbose"),
	    };
	}
	function patchLogMethod(parent, child) {
	    child.log = (...args) => {
	        parent.log(...args);
	    };
	}
	function createLogger(parent, level) {
	    const logger = Object.assign(parent.extend(level), {
	        level,
	    });
	    patchLogMethod(parent, logger);
	    if (shouldEnable(logger)) {
	        const enabledNamespaces = debugObj.disable();
	        debugObj.enable(enabledNamespaces + "," + logger.namespace);
	    }
	    registeredLoggers.add(logger);
	    return logger;
	}
	function shouldEnable(logger) {
	    return Boolean(azureLogLevel && levelMap[logger.level] <= levelMap[azureLogLevel]);
	}
	function isAzureLogLevel(logLevel) {
	    return AZURE_LOG_LEVELS.includes(logLevel);
	}

	// Copyright (c) Microsoft Corporation.
	const logger$1 = createClientLogger("core-rest-pipeline");

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/// <reference path="../shims-public.d.ts" />
	const listenersMap = new WeakMap();
	const abortedMap = new WeakMap();
	/**
	 * An aborter instance implements AbortSignal interface, can abort HTTP requests.
	 *
	 * - Call AbortSignal.none to create a new AbortSignal instance that cannot be cancelled.
	 * Use `AbortSignal.none` when you are required to pass a cancellation token but the operation
	 * cannot or will not ever be cancelled.
	 *
	 * @example
	 * Abort without timeout
	 * ```ts
	 * await doAsyncWork(AbortSignal.none);
	 * ```
	 */
	class AbortSignal {
	    constructor() {
	        /**
	         * onabort event listener.
	         */
	        this.onabort = null;
	        listenersMap.set(this, []);
	        abortedMap.set(this, false);
	    }
	    /**
	     * Status of whether aborted or not.
	     *
	     * @readonly
	     */
	    get aborted() {
	        if (!abortedMap.has(this)) {
	            throw new TypeError("Expected `this` to be an instance of AbortSignal.");
	        }
	        return abortedMap.get(this);
	    }
	    /**
	     * Creates a new AbortSignal instance that will never be aborted.
	     *
	     * @readonly
	     */
	    static get none() {
	        return new AbortSignal();
	    }
	    /**
	     * Added new "abort" event listener, only support "abort" event.
	     *
	     * @param _type - Only support "abort" event
	     * @param listener - The listener to be added
	     */
	    addEventListener(
	    // tslint:disable-next-line:variable-name
	    _type, listener) {
	        if (!listenersMap.has(this)) {
	            throw new TypeError("Expected `this` to be an instance of AbortSignal.");
	        }
	        const listeners = listenersMap.get(this);
	        listeners.push(listener);
	    }
	    /**
	     * Remove "abort" event listener, only support "abort" event.
	     *
	     * @param _type - Only support "abort" event
	     * @param listener - The listener to be removed
	     */
	    removeEventListener(
	    // tslint:disable-next-line:variable-name
	    _type, listener) {
	        if (!listenersMap.has(this)) {
	            throw new TypeError("Expected `this` to be an instance of AbortSignal.");
	        }
	        const listeners = listenersMap.get(this);
	        const index = listeners.indexOf(listener);
	        if (index > -1) {
	            listeners.splice(index, 1);
	        }
	    }
	    /**
	     * Dispatches a synthetic event to the AbortSignal.
	     */
	    dispatchEvent(_event) {
	        throw new Error("This is a stub dispatchEvent implementation that should not be used.  It only exists for type-checking purposes.");
	    }
	}
	/**
	 * Helper to trigger an abort event immediately, the onabort and all abort event listeners will be triggered.
	 * Will try to trigger abort event for all linked AbortSignal nodes.
	 *
	 * - If there is a timeout, the timer will be cancelled.
	 * - If aborted is true, nothing will happen.
	 *
	 * @internal
	 */
	// eslint-disable-next-line @azure/azure-sdk/ts-use-interface-parameters
	function abortSignal(signal) {
	    if (signal.aborted) {
	        return;
	    }
	    if (signal.onabort) {
	        signal.onabort.call(signal);
	    }
	    const listeners = listenersMap.get(signal);
	    if (listeners) {
	        // Create a copy of listeners so mutations to the array
	        // (e.g. via removeListener calls) don't affect the listeners
	        // we invoke.
	        listeners.slice().forEach((listener) => {
	            listener.call(signal, { type: "abort" });
	        });
	    }
	    abortedMap.set(signal, true);
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * This error is thrown when an asynchronous operation has been aborted.
	 * Check for this error by testing the `name` that the name property of the
	 * error matches `"AbortError"`.
	 *
	 * @example
	 * ```ts
	 * const controller = new AbortController();
	 * controller.abort();
	 * try {
	 *   doAsyncWork(controller.signal)
	 * } catch (e) {
	 *   if (e.name === 'AbortError') {
	 *     // handle abort error here.
	 *   }
	 * }
	 * ```
	 */
	class AbortError extends Error {
	    constructor(message) {
	        super(message);
	        this.name = "AbortError";
	    }
	}
	/**
	 * An AbortController provides an AbortSignal and the associated controls to signal
	 * that an asynchronous operation should be aborted.
	 *
	 * @example
	 * Abort an operation when another event fires
	 * ```ts
	 * const controller = new AbortController();
	 * const signal = controller.signal;
	 * doAsyncWork(signal);
	 * button.addEventListener('click', () => controller.abort());
	 * ```
	 *
	 * @example
	 * Share aborter cross multiple operations in 30s
	 * ```ts
	 * // Upload the same data to 2 different data centers at the same time,
	 * // abort another when any of them is finished
	 * const controller = AbortController.withTimeout(30 * 1000);
	 * doAsyncWork(controller.signal).then(controller.abort);
	 * doAsyncWork(controller.signal).then(controller.abort);
	 *```
	 *
	 * @example
	 * Cascaded aborting
	 * ```ts
	 * // All operations can't take more than 30 seconds
	 * const aborter = Aborter.timeout(30 * 1000);
	 *
	 * // Following 2 operations can't take more than 25 seconds
	 * await doAsyncWork(aborter.withTimeout(25 * 1000));
	 * await doAsyncWork(aborter.withTimeout(25 * 1000));
	 * ```
	 */
	class AbortController$1 {
	    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	    constructor(parentSignals) {
	        this._signal = new AbortSignal();
	        if (!parentSignals) {
	            return;
	        }
	        // coerce parentSignals into an array
	        if (!Array.isArray(parentSignals)) {
	            // eslint-disable-next-line prefer-rest-params
	            parentSignals = arguments;
	        }
	        for (const parentSignal of parentSignals) {
	            // if the parent signal has already had abort() called,
	            // then call abort on this signal as well.
	            if (parentSignal.aborted) {
	                this.abort();
	            }
	            else {
	                // when the parent signal aborts, this signal should as well.
	                parentSignal.addEventListener("abort", () => {
	                    this.abort();
	                });
	            }
	        }
	    }
	    /**
	     * The AbortSignal associated with this controller that will signal aborted
	     * when the abort method is called on this controller.
	     *
	     * @readonly
	     */
	    get signal() {
	        return this._signal;
	    }
	    /**
	     * Signal that any operations passed this controller's associated abort signal
	     * to cancel any remaining work and throw an `AbortError`.
	     */
	    abort() {
	        abortSignal(this._signal);
	    }
	    /**
	     * Creates a new AbortSignal instance that will abort after the provided ms.
	     * @param ms - Elapsed time in milliseconds to trigger an abort.
	     */
	    static timeout(ms) {
	        const signal = new AbortSignal();
	        const timer = setTimeout(abortSignal, ms, signal);
	        // Prevent the active Timer from keeping the Node.js event loop active.
	        if (typeof timer.unref === "function") {
	            timer.unref();
	        }
	        return signal;
	    }
	}

	// Copyright (c) Microsoft Corporation.

	// Copyright (c) Microsoft Corporation.
	/**
	 * Creates an abortable promise.
	 * @param buildPromise - A function that takes the resolve and reject functions as parameters.
	 * @param options - The options for the abortable promise.
	 * @returns A promise that can be aborted.
	 */
	function createAbortablePromise(buildPromise, options) {
	    const { cleanupBeforeAbort, abortSignal, abortErrorMsg } = options !== null && options !== void 0 ? options : {};
	    return new Promise((resolve, reject) => {
	        function rejectOnAbort() {
	            reject(new AbortError(abortErrorMsg !== null && abortErrorMsg !== void 0 ? abortErrorMsg : "The operation was aborted."));
	        }
	        function removeListeners() {
	            abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.removeEventListener("abort", onAbort);
	        }
	        function onAbort() {
	            cleanupBeforeAbort === null || cleanupBeforeAbort === void 0 ? void 0 : cleanupBeforeAbort();
	            removeListeners();
	            rejectOnAbort();
	        }
	        if (abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.aborted) {
	            return rejectOnAbort();
	        }
	        try {
	            buildPromise((x) => {
	                removeListeners();
	                resolve(x);
	            }, (x) => {
	                removeListeners();
	                reject(x);
	            });
	        }
	        catch (err) {
	            reject(err);
	        }
	        abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.addEventListener("abort", onAbort);
	    });
	}

	// Copyright (c) Microsoft Corporation.
	const StandardAbortMessage$1 = "The delay was aborted.";
	/**
	 * A wrapper for setTimeout that resolves a promise after timeInMs milliseconds.
	 * @param timeInMs - The number of milliseconds to be delayed.
	 * @param options - The options for delay - currently abort options
	 * @returns Promise that is resolved after timeInMs
	 */
	function delay$2(timeInMs, options) {
	    let token;
	    const { abortSignal, abortErrorMsg } = options !== null && options !== void 0 ? options : {};
	    return createAbortablePromise((resolve) => {
	        token = setTimeout(resolve, timeInMs);
	    }, {
	        cleanupBeforeAbort: () => clearTimeout(token),
	        abortSignal,
	        abortErrorMsg: abortErrorMsg !== null && abortErrorMsg !== void 0 ? abortErrorMsg : StandardAbortMessage$1,
	    });
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * promise.race() wrapper that aborts rest of promises as soon as the first promise settles.
	 */
	async function cancelablePromiseRace(abortablePromiseBuilders, options) {
	    var _a, _b;
	    const aborter = new AbortController$1();
	    function abortHandler() {
	        aborter.abort();
	    }
	    (_a = options === null || options === void 0 ? void 0 : options.abortSignal) === null || _a === void 0 ? void 0 : _a.addEventListener("abort", abortHandler);
	    try {
	        return await Promise.race(abortablePromiseBuilders.map((p) => p({ abortSignal: aborter.signal })));
	    }
	    finally {
	        aborter.abort();
	        (_b = options === null || options === void 0 ? void 0 : options.abortSignal) === null || _b === void 0 ? void 0 : _b.removeEventListener("abort", abortHandler);
	    }
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/**
	 * Returns a random integer value between a lower and upper bound,
	 * inclusive of both bounds.
	 * Note that this uses Math.random and isn't secure. If you need to use
	 * this for any kind of security purpose, find a better source of random.
	 * @param min - The smallest integer value allowed.
	 * @param max - The largest integer value allowed.
	 */
	function getRandomIntegerInclusive(min, max) {
	    // Make sure inputs are integers.
	    min = Math.ceil(min);
	    max = Math.floor(max);
	    // Pick a random offset from zero to the size of the range.
	    // Since Math.random() can never return 1, we have to make the range one larger
	    // in order to be inclusive of the maximum value after we take the floor.
	    const offset = Math.floor(Math.random() * (max - min + 1));
	    return offset + min;
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/**
	 * Helper to determine when an input is a generic JS object.
	 * @returns true when input is an object type that is not null, Array, RegExp, or Date.
	 */
	function isObject(input) {
	    return (typeof input === "object" &&
	        input !== null &&
	        !Array.isArray(input) &&
	        !(input instanceof RegExp) &&
	        !(input instanceof Date));
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * Typeguard for an error object shape (has name and message)
	 * @param e - Something caught by a catch clause.
	 */
	function isError(e) {
	    if (isObject(e)) {
	        const hasName = typeof e.name === "string";
	        const hasMessage = typeof e.message === "string";
	        return hasName && hasMessage;
	    }
	    return false;
	}
	/**
	 * Given what is thought to be an error object, return the message if possible.
	 * If the message is missing, returns a stringified version of the input.
	 * @param e - Something thrown from a try block
	 * @returns The error message or a string of the input
	 */
	function getErrorMessage(e) {
	    if (isError(e)) {
	        return e.message;
	    }
	    else {
	        let stringified;
	        try {
	            if (typeof e === "object" && e) {
	                stringified = JSON.stringify(e);
	            }
	            else {
	                stringified = String(e);
	            }
	        }
	        catch (err) {
	            stringified = "[unable to stringify input]";
	        }
	        return `Unknown error ${stringified}`;
	    }
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/**
	 * Converts a base64 string into a byte array.
	 * @param content - The base64 string to convert.
	 * @internal
	 */
	function base64ToBytes(content) {
	    if (typeof atob !== "function") {
	        throw new Error(`Your browser environment is missing the global "atob" function.`);
	    }
	    const binary = atob(content);
	    const bytes = new Uint8Array(binary.length);
	    for (let i = 0; i < binary.length; i++) {
	        bytes[i] = binary.charCodeAt(i);
	    }
	    return bytes;
	}
	/**
	 * Converts an ArrayBuffer to base64 string.
	 * @param buffer - Raw binary data.
	 * @internal
	 */
	function bufferToBase64(buffer) {
	    if (typeof btoa !== "function") {
	        throw new Error(`Your browser environment is missing the global "btoa" function.`);
	    }
	    const bytes = new Uint8Array(buffer);
	    let binary = "";
	    for (const byte of bytes) {
	        binary += String.fromCharCode(byte);
	    }
	    return btoa(binary);
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/**
	 * Converts an ArrayBuffer to a hexadecimal string.
	 * @param buffer - Raw binary data.
	 * @internal
	 */
	function bufferToHex(buffer) {
	    const bytes = new Uint8Array(buffer);
	    return Array.prototype.map.call(bytes, byteToHex).join("");
	}
	/**
	 * Converts a byte to a hexadecimal string.
	 * @param byte - An integer representation of a byte.
	 * @internal
	 */
	function byteToHex(byte) {
	    const hex = byte.toString(16);
	    return hex.length === 2 ? hex : `0${hex}`;
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	let encoder;
	/**
	 * Returns a cached TextEncoder.
	 * @internal
	 */
	function getTextEncoder() {
	    if (encoder) {
	        return encoder;
	    }
	    if (typeof TextEncoder === "undefined") {
	        throw new Error(`Your browser environment is missing "TextEncoder".`);
	    }
	    encoder = new TextEncoder();
	    return encoder;
	}
	/**
	 * Converts a utf8 string into a byte array.
	 * @param content - The utf8 string to convert.
	 * @internal
	 */
	function utf8ToBytes(content) {
	    return getTextEncoder().encode(content);
	}

	// Copyright (c) Microsoft Corporation.
	let subtleCrypto;
	/**
	 * Returns a cached reference to the Web API crypto.subtle object.
	 * @internal
	 */
	function getCrypto() {
	    if (subtleCrypto) {
	        return subtleCrypto;
	    }
	    if (!self.crypto || !self.crypto.subtle) {
	        throw new Error("Your browser environment does not support cryptography functions.");
	    }
	    subtleCrypto = self.crypto.subtle;
	    return subtleCrypto;
	}
	/**
	 * Generates a SHA-256 HMAC signature.
	 * @param key - The HMAC key represented as a base64 string, used to generate the cryptographic HMAC hash.
	 * @param stringToSign - The data to be signed.
	 * @param encoding - The textual encoding to use for the returned HMAC digest.
	 */
	async function computeSha256Hmac(key, stringToSign, encoding) {
	    const crypto = getCrypto();
	    const keyBytes = base64ToBytes(key);
	    const stringToSignBytes = utf8ToBytes(stringToSign);
	    const cryptoKey = await crypto.importKey("raw", keyBytes, {
	        name: "HMAC",
	        hash: { name: "SHA-256" },
	    }, false, ["sign"]);
	    const signature = await crypto.sign({
	        name: "HMAC",
	        hash: { name: "SHA-256" },
	    }, cryptoKey, stringToSignBytes);
	    switch (encoding) {
	        case "base64":
	            return bufferToBase64(signature);
	        case "hex":
	            return bufferToHex(signature);
	    }
	}
	/**
	 * Generates a SHA-256 hash.
	 * @param content - The data to be included in the hash.
	 * @param encoding - The textual encoding to use for the returned hash.
	 */
	async function computeSha256Hash(content, encoding) {
	    const contentBytes = utf8ToBytes(content);
	    const digest = await getCrypto().digest({ name: "SHA-256" }, contentBytes);
	    switch (encoding) {
	        case "base64":
	            return bufferToBase64(digest);
	        case "hex":
	            return bufferToHex(digest);
	    }
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/**
	 * Helper TypeGuard that checks if something is defined or not.
	 * @param thing - Anything
	 */
	function isDefined(thing) {
	    return typeof thing !== "undefined" && thing !== null;
	}
	/**
	 * Helper TypeGuard that checks if the input is an object with the specified properties.
	 * @param thing - Anything.
	 * @param properties - The name of the properties that should appear in the object.
	 */
	function isObjectWithProperties(thing, properties) {
	    if (!isDefined(thing) || typeof thing !== "object") {
	        return false;
	    }
	    for (const property of properties) {
	        if (!objectHasProperty(thing, property)) {
	            return false;
	        }
	    }
	    return true;
	}
	/**
	 * Helper TypeGuard that checks if the input is an object with the specified property.
	 * @param thing - Any object.
	 * @param property - The name of the property that should appear in the object.
	 */
	function objectHasProperty(thing, property) {
	    return (isDefined(thing) && typeof thing === "object" && property in thing);
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/*
	 * NOTE: When moving this file, please update "react-native" section in package.json.
	 */
	/**
	 * Generated Universally Unique Identifier
	 *
	 * @returns RFC4122 v4 UUID.
	 */
	function generateUUID() {
	    let uuid = "";
	    for (let i = 0; i < 32; i++) {
	        // Generate a random number between 0 and 15
	        const randomNumber = Math.floor(Math.random() * 16);
	        // Set the UUID version to 4 in the 13th position
	        if (i === 12) {
	            uuid += "4";
	        }
	        else if (i === 16) {
	            // Set the UUID variant to "10" in the 17th position
	            uuid += (randomNumber & 0x3) | 0x8;
	        }
	        else {
	            // Add a random hexadecimal digit to the UUID string
	            uuid += randomNumber.toString(16);
	        }
	        // Add hyphens to the UUID string at the appropriate positions
	        if (i === 7 || i === 11 || i === 15 || i === 19) {
	            uuid += "-";
	        }
	    }
	    return uuid;
	}
	/**
	 * Generated Universally Unique Identifier
	 *
	 * @returns RFC4122 v4 UUID.
	 */
	function randomUUID$1() {
	    return generateUUID();
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	var _a$2;
	// NOTE: This could be undefined if not used in a secure context
	const uuidFunction = typeof ((_a$2 = globalThis === null || globalThis === void 0 ? void 0 : globalThis.crypto) === null || _a$2 === void 0 ? void 0 : _a$2.randomUUID) === "function"
	    ? globalThis.crypto.randomUUID.bind(globalThis.crypto)
	    : generateUUID;
	/**
	 * Generated Universally Unique Identifier
	 *
	 * @returns RFC4122 v4 UUID.
	 */
	function randomUUID() {
	    return uuidFunction();
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	var _a$1, _b, _c, _d;
	/**
	 * A constant that indicates whether the environment the code is running is a Web Browser.
	 */
	// eslint-disable-next-line @azure/azure-sdk/ts-no-window
	const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined";
	/**
	 * A constant that indicates whether the environment the code is running is a Web Worker.
	 */
	const isWebWorker = typeof self === "object" &&
	    typeof (self === null || self === void 0 ? void 0 : self.importScripts) === "function" &&
	    (((_a$1 = self.constructor) === null || _a$1 === void 0 ? void 0 : _a$1.name) === "DedicatedWorkerGlobalScope" ||
	        ((_b = self.constructor) === null || _b === void 0 ? void 0 : _b.name) === "ServiceWorkerGlobalScope" ||
	        ((_c = self.constructor) === null || _c === void 0 ? void 0 : _c.name) === "SharedWorkerGlobalScope");
	/**
	 * A constant that indicates whether the environment the code is running is Node.JS.
	 */
	const isNode = typeof process !== "undefined" && Boolean(process.version) && Boolean((_d = process.versions) === null || _d === void 0 ? void 0 : _d.node);
	/**
	 * A constant that indicates whether the environment the code is running is Deno.
	 */
	const isDeno = typeof Deno !== "undefined" &&
	    typeof Deno.version !== "undefined" &&
	    typeof Deno.version.deno !== "undefined";
	/**
	 * A constant that indicates whether the environment the code is running is Bun.sh.
	 */
	const isBun = typeof Bun !== "undefined" && typeof Bun.version !== "undefined";
	/**
	 * A constant that indicates whether the environment the code is running is in React-Native.
	 */
	// https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Core/setUpNavigator.js
	const isReactNative = typeof navigator !== "undefined" && (navigator === null || navigator === void 0 ? void 0 : navigator.product) === "ReactNative";

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/**
	 * The helper that transforms bytes with specific character encoding into string
	 * @param bytes - the uint8array bytes
	 * @param format - the format we use to encode the byte
	 * @returns a string of the encoded string
	 */
	function uint8ArrayToString(bytes, format) {
	    switch (format) {
	        case "utf-8":
	            return uint8ArrayToUtf8String(bytes);
	        case "base64":
	            return uint8ArrayToBase64(bytes);
	        case "base64url":
	            return uint8ArrayToBase64Url(bytes);
	    }
	}
	/**
	 * The helper that transforms string to specific character encoded bytes array.
	 * @param value - the string to be converted
	 * @param format - the format we use to decode the value
	 * @returns a uint8array
	 */
	function stringToUint8Array(value, format) {
	    switch (format) {
	        case "utf-8":
	            return utf8StringToUint8Array(value);
	        case "base64":
	            return base64ToUint8Array(value);
	        case "base64url":
	            return base64UrlToUint8Array(value);
	    }
	}
	/**
	 * Decodes a Uint8Array into a Base64 string.
	 * @internal
	 */
	function uint8ArrayToBase64(uint8Array) {
	    const decoder = new TextDecoder();
	    const dataString = decoder.decode(uint8Array);
	    return btoa(dataString);
	}
	/**
	 * Decodes a Uint8Array into a Base64Url string.
	 * @internal
	 */
	function uint8ArrayToBase64Url(bytes) {
	    return uint8ArrayToBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
	}
	/**
	 * Decodes a Uint8Array into a javascript string.
	 * @internal
	 */
	function uint8ArrayToUtf8String(uint8Array) {
	    const decoder = new TextDecoder("utf-8");
	    const dataString = decoder.decode(uint8Array);
	    return dataString;
	}
	/**
	 * Encodes a JavaScript string into a Uint8Array.
	 * @internal
	 */
	function utf8StringToUint8Array(value) {
	    return new TextEncoder("utf-8").encode(value);
	}
	/**
	 * Encodes a Base64 string into a Uint8Array.
	 * @internal
	 */
	function base64ToUint8Array(value) {
	    return new TextEncoder().encode(atob(value));
	}
	/**
	 * Encodes a Base64Url string into a Uint8Array.
	 * @internal
	 */
	function base64UrlToUint8Array(value) {
	    const base64String = value.replace(/-/g, "+").replace(/_/g, "/");
	    return base64ToUint8Array(base64String);
	}

	// Copyright (c) Microsoft Corporation.

	// Copyright (c) Microsoft Corporation.
	const RedactedString = "REDACTED";
	// Make sure this list is up-to-date with the one under core/logger/Readme#Keyconcepts
	const defaultAllowedHeaderNames = [
	    "x-ms-client-request-id",
	    "x-ms-return-client-request-id",
	    "x-ms-useragent",
	    "x-ms-correlation-request-id",
	    "x-ms-request-id",
	    "client-request-id",
	    "ms-cv",
	    "return-client-request-id",
	    "traceparent",
	    "Access-Control-Allow-Credentials",
	    "Access-Control-Allow-Headers",
	    "Access-Control-Allow-Methods",
	    "Access-Control-Allow-Origin",
	    "Access-Control-Expose-Headers",
	    "Access-Control-Max-Age",
	    "Access-Control-Request-Headers",
	    "Access-Control-Request-Method",
	    "Origin",
	    "Accept",
	    "Accept-Encoding",
	    "Cache-Control",
	    "Connection",
	    "Content-Length",
	    "Content-Type",
	    "Date",
	    "ETag",
	    "Expires",
	    "If-Match",
	    "If-Modified-Since",
	    "If-None-Match",
	    "If-Unmodified-Since",
	    "Last-Modified",
	    "Pragma",
	    "Request-Id",
	    "Retry-After",
	    "Server",
	    "Transfer-Encoding",
	    "User-Agent",
	    "WWW-Authenticate",
	];
	const defaultAllowedQueryParameters = ["api-version"];
	/**
	 * @internal
	 */
	class Sanitizer {
	    constructor({ additionalAllowedHeaderNames: allowedHeaderNames = [], additionalAllowedQueryParameters: allowedQueryParameters = [], } = {}) {
	        allowedHeaderNames = defaultAllowedHeaderNames.concat(allowedHeaderNames);
	        allowedQueryParameters = defaultAllowedQueryParameters.concat(allowedQueryParameters);
	        this.allowedHeaderNames = new Set(allowedHeaderNames.map((n) => n.toLowerCase()));
	        this.allowedQueryParameters = new Set(allowedQueryParameters.map((p) => p.toLowerCase()));
	    }
	    sanitize(obj) {
	        const seen = new Set();
	        return JSON.stringify(obj, (key, value) => {
	            // Ensure Errors include their interesting non-enumerable members
	            if (value instanceof Error) {
	                return Object.assign(Object.assign({}, value), { name: value.name, message: value.message });
	            }
	            if (key === "headers") {
	                return this.sanitizeHeaders(value);
	            }
	            else if (key === "url") {
	                return this.sanitizeUrl(value);
	            }
	            else if (key === "query") {
	                return this.sanitizeQuery(value);
	            }
	            else if (key === "body") {
	                // Don't log the request body
	                return undefined;
	            }
	            else if (key === "response") {
	                // Don't log response again
	                return undefined;
	            }
	            else if (key === "operationSpec") {
	                // When using sendOperationRequest, the request carries a massive
	                // field with the autorest spec. No need to log it.
	                return undefined;
	            }
	            else if (Array.isArray(value) || isObject(value)) {
	                if (seen.has(value)) {
	                    return "[Circular]";
	                }
	                seen.add(value);
	            }
	            return value;
	        }, 2);
	    }
	    sanitizeHeaders(obj) {
	        const sanitized = {};
	        for (const key of Object.keys(obj)) {
	            if (this.allowedHeaderNames.has(key.toLowerCase())) {
	                sanitized[key] = obj[key];
	            }
	            else {
	                sanitized[key] = RedactedString;
	            }
	        }
	        return sanitized;
	    }
	    sanitizeQuery(value) {
	        if (typeof value !== "object" || value === null) {
	            return value;
	        }
	        const sanitized = {};
	        for (const k of Object.keys(value)) {
	            if (this.allowedQueryParameters.has(k.toLowerCase())) {
	                sanitized[k] = value[k];
	            }
	            else {
	                sanitized[k] = RedactedString;
	            }
	        }
	        return sanitized;
	    }
	    sanitizeUrl(value) {
	        if (typeof value !== "string" || value === null) {
	            return value;
	        }
	        const url = new URL(value);
	        if (!url.search) {
	            return value;
	        }
	        for (const [key] of url.searchParams) {
	            if (!this.allowedQueryParameters.has(key.toLowerCase())) {
	                url.searchParams.set(key, RedactedString);
	            }
	        }
	        return url.toString();
	    }
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * The programmatic identifier of the logPolicy.
	 */
	const logPolicyName = "logPolicy";
	/**
	 * A policy that logs all requests and responses.
	 * @param options - Options to configure logPolicy.
	 */
	function logPolicy(options = {}) {
	    var _a;
	    const logger = (_a = options.logger) !== null && _a !== void 0 ? _a : logger$1.info;
	    const sanitizer = new Sanitizer({
	        additionalAllowedHeaderNames: options.additionalAllowedHeaderNames,
	        additionalAllowedQueryParameters: options.additionalAllowedQueryParameters,
	    });
	    return {
	        name: logPolicyName,
	        async sendRequest(request, next) {
	            if (!logger.enabled) {
	                return next(request);
	            }
	            logger(`Request: ${sanitizer.sanitize(request)}`);
	            const response = await next(request);
	            logger(`Response status code: ${response.status}`);
	            logger(`Headers: ${sanitizer.sanitize(response.headers)}`);
	            return response;
	        },
	    };
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/**
	 * The programmatic identifier of the redirectPolicy.
	 */
	const redirectPolicyName = "redirectPolicy";
	/**
	 * Methods that are allowed to follow redirects 301 and 302
	 */
	const allowedRedirect = ["GET", "HEAD"];
	/**
	 * A policy to follow Location headers from the server in order
	 * to support server-side redirection.
	 * In the browser, this policy is not used.
	 * @param options - Options to control policy behavior.
	 */
	function redirectPolicy(options = {}) {
	    const { maxRetries = 20 } = options;
	    return {
	        name: redirectPolicyName,
	        async sendRequest(request, next) {
	            const response = await next(request);
	            return handleRedirect(next, response, maxRetries);
	        },
	    };
	}
	async function handleRedirect(next, response, maxRetries, currentRetries = 0) {
	    const { request, status, headers } = response;
	    const locationHeader = headers.get("location");
	    if (locationHeader &&
	        (status === 300 ||
	            (status === 301 && allowedRedirect.includes(request.method)) ||
	            (status === 302 && allowedRedirect.includes(request.method)) ||
	            (status === 303 && request.method === "POST") ||
	            status === 307) &&
	        currentRetries < maxRetries) {
	        const url = new URL(locationHeader, request.url);
	        request.url = url.toString();
	        // POST request with Status code 303 should be converted into a
	        // redirected GET request if the redirect url is present in the location header
	        if (status === 303) {
	            request.method = "GET";
	            request.headers.delete("Content-Length");
	            delete request.body;
	        }
	        request.headers.delete("Authorization");
	        const res = await next(request);
	        return handleRedirect(next, res, maxRetries, currentRetries + 1);
	    }
	    return response;
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/*
	 * NOTE: When moving this file, please update "browser" section in package.json.
	 */
	/**
	 * @internal
	 */
	function getHeaderName() {
	    return "x-ms-useragent";
	}
	/**
	 * @internal
	 */
	function setPlatformSpecificData(map) {
	    var _a, _b, _c;
	    const localNavigator = globalThis.navigator;
	    map.set("OS", ((_c = (_b = (_a = localNavigator === null || localNavigator === void 0 ? void 0 : localNavigator.userAgentData) === null || _a === void 0 ? void 0 : _a.platform) !== null && _b !== void 0 ? _b : localNavigator === null || localNavigator === void 0 ? void 0 : localNavigator.platform) !== null && _c !== void 0 ? _c : "unknown").replace(" ", ""));
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	const SDK_VERSION = "1.12.1";
	const DEFAULT_RETRY_POLICY_COUNT = 3;

	// Copyright (c) Microsoft Corporation.
	function getUserAgentString(telemetryInfo) {
	    const parts = [];
	    for (const [key, value] of telemetryInfo) {
	        const token = value ? `${key}/${value}` : key;
	        parts.push(token);
	    }
	    return parts.join(" ");
	}
	/**
	 * @internal
	 */
	function getUserAgentHeaderName() {
	    return getHeaderName();
	}
	/**
	 * @internal
	 */
	function getUserAgentValue(prefix) {
	    const runtimeInfo = new Map();
	    runtimeInfo.set("core-rest-pipeline", SDK_VERSION);
	    setPlatformSpecificData(runtimeInfo);
	    const defaultAgent = getUserAgentString(runtimeInfo);
	    const userAgentValue = prefix ? `${prefix} ${defaultAgent}` : defaultAgent;
	    return userAgentValue;
	}

	// Copyright (c) Microsoft Corporation.
	const UserAgentHeaderName = getUserAgentHeaderName();
	/**
	 * The programmatic identifier of the userAgentPolicy.
	 */
	const userAgentPolicyName = "userAgentPolicy";
	/**
	 * A policy that sets the User-Agent header (or equivalent) to reflect
	 * the library version.
	 * @param options - Options to customize the user agent value.
	 */
	function userAgentPolicy(options = {}) {
	    const userAgentValue = getUserAgentValue(options.userAgentPrefix);
	    return {
	        name: userAgentPolicyName,
	        async sendRequest(request, next) {
	            if (!request.headers.has(UserAgentHeaderName)) {
	                request.headers.set(UserAgentHeaderName, userAgentValue);
	            }
	            return next(request);
	        },
	    };
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/*
	 * NOTE: When moving this file, please update "browser" section in package.json
	 */
	const decompressResponsePolicyName = "decompressResponsePolicy";
	/**
	 * decompressResponsePolicy is not supported in the browser and attempting
	 * to use it will raise an error.
	 */
	function decompressResponsePolicy() {
	    throw new Error("decompressResponsePolicy is not supported in browser environment");
	}

	// Copyright (c) Microsoft Corporation.
	const StandardAbortMessage = "The operation was aborted.";
	/**
	 * A wrapper for setTimeout that resolves a promise after delayInMs milliseconds.
	 * @param delayInMs - The number of milliseconds to be delayed.
	 * @param value - The value to be resolved with after a timeout of t milliseconds.
	 * @param options - The options for delay - currently abort options
	 *                  - abortSignal - The abortSignal associated with containing operation.
	 *                  - abortErrorMsg - The abort error message associated with containing operation.
	 * @returns Resolved promise
	 */
	function delay$1(delayInMs, value, options) {
	    return new Promise((resolve, reject) => {
	        let timer = undefined;
	        let onAborted = undefined;
	        const rejectOnAbort = () => {
	            return reject(new AbortError((options === null || options === void 0 ? void 0 : options.abortErrorMsg) ? options === null || options === void 0 ? void 0 : options.abortErrorMsg : StandardAbortMessage));
	        };
	        const removeListeners = () => {
	            if ((options === null || options === void 0 ? void 0 : options.abortSignal) && onAborted) {
	                options.abortSignal.removeEventListener("abort", onAborted);
	            }
	        };
	        onAborted = () => {
	            if (timer) {
	                clearTimeout(timer);
	            }
	            removeListeners();
	            return rejectOnAbort();
	        };
	        if ((options === null || options === void 0 ? void 0 : options.abortSignal) && options.abortSignal.aborted) {
	            return rejectOnAbort();
	        }
	        timer = setTimeout(() => {
	            removeListeners();
	            resolve(value);
	        }, delayInMs);
	        if (options === null || options === void 0 ? void 0 : options.abortSignal) {
	            options.abortSignal.addEventListener("abort", onAborted);
	        }
	    });
	}
	/**
	 * @internal
	 * @returns the parsed value or undefined if the parsed value is invalid.
	 */
	function parseHeaderValueAsNumber(response, headerName) {
	    const value = response.headers.get(headerName);
	    if (!value)
	        return;
	    const valueAsNum = Number(value);
	    if (Number.isNaN(valueAsNum))
	        return;
	    return valueAsNum;
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * The header that comes back from Azure services representing
	 * the amount of time (minimum) to wait to retry (in seconds or timestamp after which we can retry).
	 */
	const RetryAfterHeader = "Retry-After";
	/**
	 * The headers that come back from Azure services representing
	 * the amount of time (minimum) to wait to retry.
	 *
	 * "retry-after-ms", "x-ms-retry-after-ms" : milliseconds
	 * "Retry-After" : seconds or timestamp
	 */
	const AllRetryAfterHeaders = ["retry-after-ms", "x-ms-retry-after-ms", RetryAfterHeader];
	/**
	 * A response is a throttling retry response if it has a throttling status code (429 or 503),
	 * as long as one of the [ "Retry-After" or "retry-after-ms" or "x-ms-retry-after-ms" ] headers has a valid value.
	 *
	 * Returns the `retryAfterInMs` value if the response is a throttling retry response.
	 * If not throttling retry response, returns `undefined`.
	 *
	 * @internal
	 */
	function getRetryAfterInMs(response) {
	    if (!(response && [429, 503].includes(response.status)))
	        return undefined;
	    try {
	        // Headers: "retry-after-ms", "x-ms-retry-after-ms", "Retry-After"
	        for (const header of AllRetryAfterHeaders) {
	            const retryAfterValue = parseHeaderValueAsNumber(response, header);
	            if (retryAfterValue === 0 || retryAfterValue) {
	                // "Retry-After" header ==> seconds
	                // "retry-after-ms", "x-ms-retry-after-ms" headers ==> milli-seconds
	                const multiplyingFactor = header === RetryAfterHeader ? 1000 : 1;
	                return retryAfterValue * multiplyingFactor; // in milli-seconds
	            }
	        }
	        // RetryAfterHeader ("Retry-After") has a special case where it might be formatted as a date instead of a number of seconds
	        const retryAfterHeader = response.headers.get(RetryAfterHeader);
	        if (!retryAfterHeader)
	            return;
	        const date = Date.parse(retryAfterHeader);
	        const diff = date - Date.now();
	        // negative diff would mean a date in the past, so retry asap with 0 milliseconds
	        return Number.isFinite(diff) ? Math.max(0, diff) : undefined;
	    }
	    catch (e) {
	        return undefined;
	    }
	}
	/**
	 * A response is a retry response if it has a throttling status code (429 or 503),
	 * as long as one of the [ "Retry-After" or "retry-after-ms" or "x-ms-retry-after-ms" ] headers has a valid value.
	 */
	function isThrottlingRetryResponse(response) {
	    return Number.isFinite(getRetryAfterInMs(response));
	}
	function throttlingRetryStrategy() {
	    return {
	        name: "throttlingRetryStrategy",
	        retry({ response }) {
	            const retryAfterInMs = getRetryAfterInMs(response);
	            if (!Number.isFinite(retryAfterInMs)) {
	                return { skipStrategy: true };
	            }
	            return {
	                retryAfterInMs,
	            };
	        },
	    };
	}

	// Copyright (c) Microsoft Corporation.
	// intervals are in milliseconds
	const DEFAULT_CLIENT_RETRY_INTERVAL = 1000;
	const DEFAULT_CLIENT_MAX_RETRY_INTERVAL = 1000 * 64;
	/**
	 * A retry strategy that retries with an exponentially increasing delay in these two cases:
	 * - When there are errors in the underlying transport layer (e.g. DNS lookup failures).
	 * - Or otherwise if the outgoing request fails (408, greater or equal than 500, except for 501 and 505).
	 */
	function exponentialRetryStrategy(options = {}) {
	    var _a, _b;
	    const retryInterval = (_a = options.retryDelayInMs) !== null && _a !== void 0 ? _a : DEFAULT_CLIENT_RETRY_INTERVAL;
	    const maxRetryInterval = (_b = options.maxRetryDelayInMs) !== null && _b !== void 0 ? _b : DEFAULT_CLIENT_MAX_RETRY_INTERVAL;
	    let retryAfterInMs = retryInterval;
	    return {
	        name: "exponentialRetryStrategy",
	        retry({ retryCount, response, responseError }) {
	            const matchedSystemError = isSystemError(responseError);
	            const ignoreSystemErrors = matchedSystemError && options.ignoreSystemErrors;
	            const isExponential = isExponentialRetryResponse(response);
	            const ignoreExponentialResponse = isExponential && options.ignoreHttpStatusCodes;
	            const unknownResponse = response && (isThrottlingRetryResponse(response) || !isExponential);
	            if (unknownResponse || ignoreExponentialResponse || ignoreSystemErrors) {
	                return { skipStrategy: true };
	            }
	            if (responseError && !matchedSystemError && !isExponential) {
	                return { errorToThrow: responseError };
	            }
	            // Exponentially increase the delay each time
	            const exponentialDelay = retryAfterInMs * Math.pow(2, retryCount);
	            // Don't let the delay exceed the maximum
	            const clampedExponentialDelay = Math.min(maxRetryInterval, exponentialDelay);
	            // Allow the final value to have some "jitter" (within 50% of the delay size) so
	            // that retries across multiple clients don't occur simultaneously.
	            retryAfterInMs =
	                clampedExponentialDelay / 2 + getRandomIntegerInclusive(0, clampedExponentialDelay / 2);
	            return { retryAfterInMs };
	        },
	    };
	}
	/**
	 * A response is a retry response if it has status codes:
	 * - 408, or
	 * - Greater or equal than 500, except for 501 and 505.
	 */
	function isExponentialRetryResponse(response) {
	    return Boolean(response &&
	        response.status !== undefined &&
	        (response.status >= 500 || response.status === 408) &&
	        response.status !== 501 &&
	        response.status !== 505);
	}
	/**
	 * Determines whether an error from a pipeline response was triggered in the network layer.
	 */
	function isSystemError(err) {
	    if (!err) {
	        return false;
	    }
	    return (err.code === "ETIMEDOUT" ||
	        err.code === "ESOCKETTIMEDOUT" ||
	        err.code === "ECONNREFUSED" ||
	        err.code === "ECONNRESET" ||
	        err.code === "ENOENT");
	}

	// Copyright (c) Microsoft Corporation.
	const retryPolicyLogger = createClientLogger("core-rest-pipeline retryPolicy");
	/**
	 * The programmatic identifier of the retryPolicy.
	 */
	const retryPolicyName = "retryPolicy";
	/**
	 * retryPolicy is a generic policy to enable retrying requests when certain conditions are met
	 */
	function retryPolicy(strategies, options = { maxRetries: DEFAULT_RETRY_POLICY_COUNT }) {
	    const logger = options.logger || retryPolicyLogger;
	    return {
	        name: retryPolicyName,
	        async sendRequest(request, next) {
	            var _a, _b;
	            let response;
	            let responseError;
	            let retryCount = -1;
	            // eslint-disable-next-line no-constant-condition
	            retryRequest: while (true) {
	                retryCount += 1;
	                response = undefined;
	                responseError = undefined;
	                try {
	                    logger.info(`Retry ${retryCount}: Attempting to send request`, request.requestId);
	                    response = await next(request);
	                    logger.info(`Retry ${retryCount}: Received a response from request`, request.requestId);
	                }
	                catch (e) {
	                    logger.error(`Retry ${retryCount}: Received an error from request`, request.requestId);
	                    // RestErrors are valid targets for the retry strategies.
	                    // If none of the retry strategies can work with them, they will be thrown later in this policy.
	                    // If the received error is not a RestError, it is immediately thrown.
	                    responseError = e;
	                    if (!e || responseError.name !== "RestError") {
	                        throw e;
	                    }
	                    response = responseError.response;
	                }
	                if ((_a = request.abortSignal) === null || _a === void 0 ? void 0 : _a.aborted) {
	                    logger.error(`Retry ${retryCount}: Request aborted.`);
	                    const abortError = new AbortError();
	                    throw abortError;
	                }
	                if (retryCount >= ((_b = options.maxRetries) !== null && _b !== void 0 ? _b : DEFAULT_RETRY_POLICY_COUNT)) {
	                    logger.info(`Retry ${retryCount}: Maximum retries reached. Returning the last received response, or throwing the last received error.`);
	                    if (responseError) {
	                        throw responseError;
	                    }
	                    else if (response) {
	                        return response;
	                    }
	                    else {
	                        throw new Error("Maximum retries reached with no response or error to throw");
	                    }
	                }
	                logger.info(`Retry ${retryCount}: Processing ${strategies.length} retry strategies.`);
	                strategiesLoop: for (const strategy of strategies) {
	                    const strategyLogger = strategy.logger || retryPolicyLogger;
	                    strategyLogger.info(`Retry ${retryCount}: Processing retry strategy ${strategy.name}.`);
	                    const modifiers = strategy.retry({
	                        retryCount,
	                        response,
	                        responseError,
	                    });
	                    if (modifiers.skipStrategy) {
	                        strategyLogger.info(`Retry ${retryCount}: Skipped.`);
	                        continue strategiesLoop;
	                    }
	                    const { errorToThrow, retryAfterInMs, redirectTo } = modifiers;
	                    if (errorToThrow) {
	                        strategyLogger.error(`Retry ${retryCount}: Retry strategy ${strategy.name} throws error:`, errorToThrow);
	                        throw errorToThrow;
	                    }
	                    if (retryAfterInMs || retryAfterInMs === 0) {
	                        strategyLogger.info(`Retry ${retryCount}: Retry strategy ${strategy.name} retries after ${retryAfterInMs}`);
	                        await delay$1(retryAfterInMs, undefined, { abortSignal: request.abortSignal });
	                        continue retryRequest;
	                    }
	                    if (redirectTo) {
	                        strategyLogger.info(`Retry ${retryCount}: Retry strategy ${strategy.name} redirects to ${redirectTo}`);
	                        request.url = redirectTo;
	                        continue retryRequest;
	                    }
	                }
	                if (responseError) {
	                    logger.info(`None of the retry strategies could work with the received error. Throwing it.`);
	                    throw responseError;
	                }
	                if (response) {
	                    logger.info(`None of the retry strategies could work with the received response. Returning it.`);
	                    return response;
	                }
	                // If all the retries skip and there's no response,
	                // we're still in the retry loop, so a new request will be sent
	                // until `maxRetries` is reached.
	            }
	        },
	    };
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * Name of the {@link defaultRetryPolicy}
	 */
	const defaultRetryPolicyName = "defaultRetryPolicy";
	/**
	 * A policy that retries according to three strategies:
	 * - When the server sends a 429 response with a Retry-After header.
	 * - When there are errors in the underlying transport layer (e.g. DNS lookup failures).
	 * - Or otherwise if the outgoing request fails, it will retry with an exponentially increasing delay.
	 */
	function defaultRetryPolicy(options = {}) {
	    var _a;
	    return {
	        name: defaultRetryPolicyName,
	        sendRequest: retryPolicy([throttlingRetryStrategy(), exponentialRetryStrategy(options)], {
	            maxRetries: (_a = options.maxRetries) !== null && _a !== void 0 ? _a : DEFAULT_RETRY_POLICY_COUNT,
	        }).sendRequest,
	    };
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/**
	 * The programmatic identifier of the formDataPolicy.
	 */
	const formDataPolicyName = "formDataPolicy";
	/**
	 * A policy that encodes FormData on the request into the body.
	 */
	function formDataPolicy() {
	    return {
	        name: formDataPolicyName,
	        async sendRequest(request, next) {
	            if (request.formData) {
	                const formData = request.formData;
	                const requestForm = new FormData();
	                for (const formKey of Object.keys(formData)) {
	                    const formValue = formData[formKey];
	                    if (Array.isArray(formValue)) {
	                        for (const subValue of formValue) {
	                            requestForm.append(formKey, subValue);
	                        }
	                    }
	                    else {
	                        requestForm.append(formKey, formValue);
	                    }
	                }
	                request.body = requestForm;
	                request.formData = undefined;
	                const contentType = request.headers.get("Content-Type");
	                if (contentType && contentType.indexOf("application/x-www-form-urlencoded") !== -1) {
	                    request.body = new URLSearchParams(requestForm).toString();
	                }
	                else if (contentType && contentType.indexOf("multipart/form-data") !== -1) {
	                    // browser will automatically apply a suitable content-type header
	                    request.headers.delete("Content-Type");
	                }
	            }
	            return next(request);
	        },
	    };
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/*
	 * NOTE: When moving this file, please update "browser" section in package.json
	 */
	const proxyPolicyName = "proxyPolicy";
	const errorMessage = "proxyPolicy is not supported in browser environment";
	function getDefaultProxySettings() {
	    throw new Error(errorMessage);
	}
	/**
	 * proxyPolicy is not supported in the browser and attempting
	 * to use it will raise an error.
	 */
	function proxyPolicy() {
	    throw new Error(errorMessage);
	}
	/**
	 * A function to reset the cached agents.
	 * proxyPolicy is not supported in the browser and attempting
	 * to use it will raise an error.
	 * @internal
	 */
	function resetCachedProxyAgents() {
	    throw new Error(errorMessage);
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/**
	 * The programmatic identifier of the setClientRequestIdPolicy.
	 */
	const setClientRequestIdPolicyName = "setClientRequestIdPolicy";
	/**
	 * Each PipelineRequest gets a unique id upon creation.
	 * This policy passes that unique id along via an HTTP header to enable better
	 * telemetry and tracing.
	 * @param requestIdHeaderName - The name of the header to pass the request ID to.
	 */
	function setClientRequestIdPolicy(requestIdHeaderName = "x-ms-client-request-id") {
	    return {
	        name: setClientRequestIdPolicyName,
	        async sendRequest(request, next) {
	            if (!request.headers.has(requestIdHeaderName)) {
	                request.headers.set(requestIdHeaderName, request.requestId);
	            }
	            return next(request);
	        },
	    };
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/**
	 * Name of the TLS Policy
	 */
	const tlsPolicyName = "tlsPolicy";
	/**
	 * Gets a pipeline policy that adds the client certificate to the HttpClient agent for authentication.
	 */
	function tlsPolicy(tlsSettings) {
	    return {
	        name: tlsPolicyName,
	        sendRequest: async (req, next) => {
	            // Users may define a request tlsSettings, honor those over the client level one
	            if (!req.tlsSettings) {
	                req.tlsSettings = tlsSettings;
	            }
	            return next(req);
	        },
	    };
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/** @internal */
	const knownContextKeys = {
	    span: Symbol.for("@azure/core-tracing span"),
	    namespace: Symbol.for("@azure/core-tracing namespace"),
	};
	/**
	 * Creates a new {@link TracingContext} with the given options.
	 * @param options - A set of known keys that may be set on the context.
	 * @returns A new {@link TracingContext} with the given options.
	 *
	 * @internal
	 */
	function createTracingContext(options = {}) {
	    let context = new TracingContextImpl(options.parentContext);
	    if (options.span) {
	        context = context.setValue(knownContextKeys.span, options.span);
	    }
	    if (options.namespace) {
	        context = context.setValue(knownContextKeys.namespace, options.namespace);
	    }
	    return context;
	}
	/** @internal */
	class TracingContextImpl {
	    constructor(initialContext) {
	        this._contextMap =
	            initialContext instanceof TracingContextImpl
	                ? new Map(initialContext._contextMap)
	                : new Map();
	    }
	    setValue(key, value) {
	        const newContext = new TracingContextImpl(this);
	        newContext._contextMap.set(key, value);
	        return newContext;
	    }
	    getValue(key) {
	        return this._contextMap.get(key);
	    }
	    deleteValue(key) {
	        const newContext = new TracingContextImpl(this);
	        newContext._contextMap.delete(key);
	        return newContext;
	    }
	}

	// Copyright (c) Microsoft Corporation.
	function createDefaultTracingSpan() {
	    return {
	        end: () => {
	            // noop
	        },
	        isRecording: () => false,
	        recordException: () => {
	            // noop
	        },
	        setAttribute: () => {
	            // noop
	        },
	        setStatus: () => {
	            // noop
	        },
	    };
	}
	function createDefaultInstrumenter() {
	    return {
	        createRequestHeaders: () => {
	            return {};
	        },
	        parseTraceparentHeader: () => {
	            return undefined;
	        },
	        startSpan: (_name, spanOptions) => {
	            return {
	                span: createDefaultTracingSpan(),
	                tracingContext: createTracingContext({ parentContext: spanOptions.tracingContext }),
	            };
	        },
	        withContext(_context, callback, ...callbackArgs) {
	            return callback(...callbackArgs);
	        },
	    };
	}
	/** @internal */
	let instrumenterImplementation;
	/**
	 * Extends the Azure SDK with support for a given instrumenter implementation.
	 *
	 * @param instrumenter - The instrumenter implementation to use.
	 */
	function useInstrumenter(instrumenter) {
	    instrumenterImplementation = instrumenter;
	}
	/**
	 * Gets the currently set instrumenter, a No-Op instrumenter by default.
	 *
	 * @returns The currently set instrumenter
	 */
	function getInstrumenter() {
	    if (!instrumenterImplementation) {
	        instrumenterImplementation = createDefaultInstrumenter();
	    }
	    return instrumenterImplementation;
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * Creates a new tracing client.
	 *
	 * @param options - Options used to configure the tracing client.
	 * @returns - An instance of {@link TracingClient}.
	 */
	function createTracingClient(options) {
	    const { namespace, packageName, packageVersion } = options;
	    function startSpan(name, operationOptions, spanOptions) {
	        var _a;
	        const startSpanResult = getInstrumenter().startSpan(name, Object.assign(Object.assign({}, spanOptions), { packageName: packageName, packageVersion: packageVersion, tracingContext: (_a = operationOptions === null || operationOptions === void 0 ? void 0 : operationOptions.tracingOptions) === null || _a === void 0 ? void 0 : _a.tracingContext }));
	        let tracingContext = startSpanResult.tracingContext;
	        const span = startSpanResult.span;
	        if (!tracingContext.getValue(knownContextKeys.namespace)) {
	            tracingContext = tracingContext.setValue(knownContextKeys.namespace, namespace);
	        }
	        span.setAttribute("az.namespace", tracingContext.getValue(knownContextKeys.namespace));
	        const updatedOptions = Object.assign({}, operationOptions, {
	            tracingOptions: Object.assign(Object.assign({}, operationOptions === null || operationOptions === void 0 ? void 0 : operationOptions.tracingOptions), { tracingContext }),
	        });
	        return {
	            span,
	            updatedOptions,
	        };
	    }
	    async function withSpan(name, operationOptions, callback, spanOptions) {
	        const { span, updatedOptions } = startSpan(name, operationOptions, spanOptions);
	        try {
	            const result = await withContext(updatedOptions.tracingOptions.tracingContext, () => Promise.resolve(callback(updatedOptions, span)));
	            span.setStatus({ status: "success" });
	            return result;
	        }
	        catch (err) {
	            span.setStatus({ status: "error", error: err });
	            throw err;
	        }
	        finally {
	            span.end();
	        }
	    }
	    function withContext(context, callback, ...callbackArgs) {
	        return getInstrumenter().withContext(context, callback, ...callbackArgs);
	    }
	    /**
	     * Parses a traceparent header value into a span identifier.
	     *
	     * @param traceparentHeader - The traceparent header to parse.
	     * @returns An implementation-specific identifier for the span.
	     */
	    function parseTraceparentHeader(traceparentHeader) {
	        return getInstrumenter().parseTraceparentHeader(traceparentHeader);
	    }
	    /**
	     * Creates a set of request headers to propagate tracing information to a backend.
	     *
	     * @param tracingContext - The context containing the span to serialize.
	     * @returns The set of headers to add to a request.
	     */
	    function createRequestHeaders(tracingContext) {
	        return getInstrumenter().createRequestHeaders(tracingContext);
	    }
	    return {
	        startSpan,
	        withSpan,
	        withContext,
	        parseTraceparentHeader,
	        createRequestHeaders,
	    };
	}

	// Copyright (c) Microsoft Corporation.

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	const custom = {};

	// Copyright (c) Microsoft Corporation.
	const errorSanitizer = new Sanitizer();
	/**
	 * A custom error type for failed pipeline requests.
	 */
	class RestError extends Error {
	    constructor(message, options = {}) {
	        super(message);
	        this.name = "RestError";
	        this.code = options.code;
	        this.statusCode = options.statusCode;
	        this.request = options.request;
	        this.response = options.response;
	        Object.setPrototypeOf(this, RestError.prototype);
	    }
	    /**
	     * Logging method for util.inspect in Node
	     */
	    [custom]() {
	        return `RestError: ${this.message} \n ${errorSanitizer.sanitize(this)}`;
	    }
	}
	/**
	 * Something went wrong when making the request.
	 * This means the actual request failed for some reason,
	 * such as a DNS issue or the connection being lost.
	 */
	RestError.REQUEST_SEND_ERROR = "REQUEST_SEND_ERROR";
	/**
	 * This means that parsing the response from the server failed.
	 * It may have been malformed.
	 */
	RestError.PARSE_ERROR = "PARSE_ERROR";
	/**
	 * Typeguard for RestError
	 * @param e - Something caught by a catch clause.
	 */
	function isRestError(e) {
	    if (e instanceof RestError) {
	        return true;
	    }
	    return isError(e) && e.name === "RestError";
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * The programmatic identifier of the tracingPolicy.
	 */
	const tracingPolicyName = "tracingPolicy";
	/**
	 * A simple policy to create OpenTelemetry Spans for each request made by the pipeline
	 * that has SpanOptions with a parent.
	 * Requests made without a parent Span will not be recorded.
	 * @param options - Options to configure the telemetry logged by the tracing policy.
	 */
	function tracingPolicy(options = {}) {
	    const userAgent = getUserAgentValue(options.userAgentPrefix);
	    const tracingClient = tryCreateTracingClient();
	    return {
	        name: tracingPolicyName,
	        async sendRequest(request, next) {
	            var _a, _b;
	            if (!tracingClient || !((_a = request.tracingOptions) === null || _a === void 0 ? void 0 : _a.tracingContext)) {
	                return next(request);
	            }
	            const { span, tracingContext } = (_b = tryCreateSpan(tracingClient, request, userAgent)) !== null && _b !== void 0 ? _b : {};
	            if (!span || !tracingContext) {
	                return next(request);
	            }
	            try {
	                const response = await tracingClient.withContext(tracingContext, next, request);
	                tryProcessResponse(span, response);
	                return response;
	            }
	            catch (err) {
	                tryProcessError(span, err);
	                throw err;
	            }
	        },
	    };
	}
	function tryCreateTracingClient() {
	    try {
	        return createTracingClient({
	            namespace: "",
	            packageName: "@azure/core-rest-pipeline",
	            packageVersion: SDK_VERSION,
	        });
	    }
	    catch (e) {
	        logger$1.warning(`Error when creating the TracingClient: ${getErrorMessage(e)}`);
	        return undefined;
	    }
	}
	function tryCreateSpan(tracingClient, request, userAgent) {
	    try {
	        // As per spec, we do not need to differentiate between HTTP and HTTPS in span name.
	        const { span, updatedOptions } = tracingClient.startSpan(`HTTP ${request.method}`, { tracingOptions: request.tracingOptions }, {
	            spanKind: "client",
	            spanAttributes: {
	                "http.method": request.method,
	                "http.url": request.url,
	                requestId: request.requestId,
	            },
	        });
	        // If the span is not recording, don't do any more work.
	        if (!span.isRecording()) {
	            span.end();
	            return undefined;
	        }
	        if (userAgent) {
	            span.setAttribute("http.user_agent", userAgent);
	        }
	        // set headers
	        const headers = tracingClient.createRequestHeaders(updatedOptions.tracingOptions.tracingContext);
	        for (const [key, value] of Object.entries(headers)) {
	            request.headers.set(key, value);
	        }
	        return { span, tracingContext: updatedOptions.tracingOptions.tracingContext };
	    }
	    catch (e) {
	        logger$1.warning(`Skipping creating a tracing span due to an error: ${getErrorMessage(e)}`);
	        return undefined;
	    }
	}
	function tryProcessError(span, error) {
	    try {
	        span.setStatus({
	            status: "error",
	            error: isError(error) ? error : undefined,
	        });
	        if (isRestError(error) && error.statusCode) {
	            span.setAttribute("http.status_code", error.statusCode);
	        }
	        span.end();
	    }
	    catch (e) {
	        logger$1.warning(`Skipping tracing span processing due to an error: ${getErrorMessage(e)}`);
	    }
	}
	function tryProcessResponse(span, response) {
	    try {
	        span.setAttribute("http.status_code", response.status);
	        const serviceRequestId = response.headers.get("x-ms-request-id");
	        if (serviceRequestId) {
	            span.setAttribute("serviceRequestId", serviceRequestId);
	        }
	        span.setStatus({
	            status: "success",
	        });
	        span.end();
	    }
	    catch (e) {
	        logger$1.warning(`Skipping tracing span processing due to an error: ${getErrorMessage(e)}`);
	    }
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * Create a new pipeline with a default set of customizable policies.
	 * @param options - Options to configure a custom pipeline.
	 */
	function createPipelineFromOptions(options) {
	    var _a;
	    const pipeline = createEmptyPipeline();
	    if (isNode) {
	        if (options.tlsOptions) {
	            pipeline.addPolicy(tlsPolicy(options.tlsOptions));
	        }
	        pipeline.addPolicy(proxyPolicy(options.proxyOptions));
	        pipeline.addPolicy(decompressResponsePolicy());
	    }
	    pipeline.addPolicy(formDataPolicy());
	    pipeline.addPolicy(userAgentPolicy(options.userAgentOptions));
	    pipeline.addPolicy(setClientRequestIdPolicy((_a = options.telemetryOptions) === null || _a === void 0 ? void 0 : _a.clientRequestIdHeaderName));
	    pipeline.addPolicy(defaultRetryPolicy(options.retryOptions), { phase: "Retry" });
	    pipeline.addPolicy(tracingPolicy(options.userAgentOptions), { afterPhase: "Retry" });
	    if (isNode) {
	        // Both XHR and Fetch expect to handle redirects automatically,
	        // so only include this policy when we're in Node.
	        pipeline.addPolicy(redirectPolicy(options.redirectOptions), { afterPhase: "Retry" });
	    }
	    pipeline.addPolicy(logPolicy(options.loggingOptions), { afterPhase: "Sign" });
	    return pipeline;
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	function normalizeName(name) {
	    return name.toLowerCase();
	}
	function* headerIterator(map) {
	    for (const entry of map.values()) {
	        yield [entry.name, entry.value];
	    }
	}
	class HttpHeadersImpl {
	    constructor(rawHeaders) {
	        this._headersMap = new Map();
	        if (rawHeaders) {
	            for (const headerName of Object.keys(rawHeaders)) {
	                this.set(headerName, rawHeaders[headerName]);
	            }
	        }
	    }
	    /**
	     * Set a header in this collection with the provided name and value. The name is
	     * case-insensitive.
	     * @param name - The name of the header to set. This value is case-insensitive.
	     * @param value - The value of the header to set.
	     */
	    set(name, value) {
	        this._headersMap.set(normalizeName(name), { name, value: String(value) });
	    }
	    /**
	     * Get the header value for the provided header name, or undefined if no header exists in this
	     * collection with the provided name.
	     * @param name - The name of the header. This value is case-insensitive.
	     */
	    get(name) {
	        var _a;
	        return (_a = this._headersMap.get(normalizeName(name))) === null || _a === void 0 ? void 0 : _a.value;
	    }
	    /**
	     * Get whether or not this header collection contains a header entry for the provided header name.
	     * @param name - The name of the header to set. This value is case-insensitive.
	     */
	    has(name) {
	        return this._headersMap.has(normalizeName(name));
	    }
	    /**
	     * Remove the header with the provided headerName.
	     * @param name - The name of the header to remove.
	     */
	    delete(name) {
	        this._headersMap.delete(normalizeName(name));
	    }
	    /**
	     * Get the JSON object representation of this HTTP header collection.
	     */
	    toJSON(options = {}) {
	        const result = {};
	        if (options.preserveCase) {
	            for (const entry of this._headersMap.values()) {
	                result[entry.name] = entry.value;
	            }
	        }
	        else {
	            for (const [normalizedName, entry] of this._headersMap) {
	                result[normalizedName] = entry.value;
	            }
	        }
	        return result;
	    }
	    /**
	     * Get the string representation of this HTTP header collection.
	     */
	    toString() {
	        return JSON.stringify(this.toJSON({ preserveCase: true }));
	    }
	    /**
	     * Iterate over tuples of header [name, value] pairs.
	     */
	    [Symbol.iterator]() {
	        return headerIterator(this._headersMap);
	    }
	}
	/**
	 * Creates an object that satisfies the `HttpHeaders` interface.
	 * @param rawHeaders - A simple object representing initial headers
	 */
	function createHttpHeaders(rawHeaders) {
	    return new HttpHeadersImpl(rawHeaders);
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * Checks if the body is a NodeReadable stream which is not supported in Browsers
	 */
	function isNodeReadableStream(body) {
	    return body && typeof body.pipe === "function";
	}
	/**
	 * Checks if the body is a ReadableStream supported by browsers
	 */
	function isReadableStream(body) {
	    return Boolean(body &&
	        typeof body.getReader === "function" &&
	        typeof body.tee === "function");
	}
	/**
	 * Checks if the body is a Blob or Blob-like
	 */
	function isBlob(body) {
	    // File objects count as a type of Blob, so we want to use instanceof explicitly
	    return (typeof Blob === "function" || typeof Blob === "object") && body instanceof Blob;
	}
	/**
	 * A HttpClient implementation that uses window.fetch to send HTTP requests.
	 * @internal
	 */
	class FetchHttpClient {
	    /**
	     * Makes a request over an underlying transport layer and returns the response.
	     * @param request - The request to be made.
	     */
	    async sendRequest(request) {
	        const url = new URL(request.url);
	        const isInsecure = url.protocol !== "https:";
	        if (isInsecure && !request.allowInsecureConnection) {
	            throw new Error(`Cannot connect to ${request.url} while allowInsecureConnection is false.`);
	        }
	        if (request.proxySettings) {
	            throw new Error("HTTP proxy is not supported in browser environment");
	        }
	        try {
	            return await makeRequest(request);
	        }
	        catch (e) {
	            throw getError(e, request);
	        }
	    }
	}
	/**
	 * Sends a request
	 */
	async function makeRequest(request) {
	    const { abortController, abortControllerCleanup } = setupAbortSignal(request);
	    try {
	        const headers = buildFetchHeaders(request.headers);
	        const { streaming, body: requestBody } = buildRequestBody(request);
	        const requestInit = {
	            body: requestBody,
	            method: request.method,
	            headers: headers,
	            signal: abortController.signal,
	            credentials: request.withCredentials ? "include" : "same-origin",
	            cache: "no-store",
	        };
	        // According to https://fetch.spec.whatwg.org/#fetch-method,
	        // init.duplex must be set when body is a ReadableStream object.
	        // currently "half" is the only valid value.
	        if (streaming) {
	            requestInit.duplex = "half";
	        }
	        /**
	         * Developers of the future:
	         * Do not set redirect: "manual" as part
	         * of request options.
	         * It will not work as you expect.
	         */
	        const response = await fetch(request.url, requestInit);
	        // If we're uploading a blob, we need to fire the progress event manually
	        if (isBlob(request.body) && request.onUploadProgress) {
	            request.onUploadProgress({ loadedBytes: request.body.size });
	        }
	        return buildPipelineResponse(response, request);
	    }
	    finally {
	        if (abortControllerCleanup) {
	            abortControllerCleanup();
	        }
	    }
	}
	/**
	 * Creates a pipeline response from a Fetch response;
	 */
	async function buildPipelineResponse(httpResponse, request) {
	    var _a, _b;
	    const headers = buildPipelineHeaders(httpResponse);
	    const response = {
	        request,
	        headers,
	        status: httpResponse.status,
	    };
	    const bodyStream = isReadableStream(httpResponse.body)
	        ? buildBodyStream(httpResponse.body, request.onDownloadProgress)
	        : httpResponse.body;
	    if (
	    // Value of POSITIVE_INFINITY in streamResponseStatusCodes is considered as any status code
	    ((_a = request.streamResponseStatusCodes) === null || _a === void 0 ? void 0 : _a.has(Number.POSITIVE_INFINITY)) ||
	        ((_b = request.streamResponseStatusCodes) === null || _b === void 0 ? void 0 : _b.has(response.status))) {
	        if (request.enableBrowserStreams) {
	            response.browserStreamBody = bodyStream !== null && bodyStream !== void 0 ? bodyStream : undefined;
	        }
	        else {
	            const responseStream = new Response(bodyStream);
	            response.blobBody = responseStream.blob();
	        }
	    }
	    else {
	        const responseStream = new Response(bodyStream);
	        response.bodyAsText = await responseStream.text();
	    }
	    return response;
	}
	function setupAbortSignal(request) {
	    const abortController = new AbortController();
	    // Cleanup function
	    let abortControllerCleanup;
	    /**
	     * Attach an abort listener to the request
	     */
	    let abortListener;
	    if (request.abortSignal) {
	        if (request.abortSignal.aborted) {
	            throw new AbortError("The operation was aborted.");
	        }
	        abortListener = (event) => {
	            if (event.type === "abort") {
	                abortController.abort();
	            }
	        };
	        request.abortSignal.addEventListener("abort", abortListener);
	        abortControllerCleanup = () => {
	            var _a;
	            if (abortListener) {
	                (_a = request.abortSignal) === null || _a === void 0 ? void 0 : _a.removeEventListener("abort", abortListener);
	            }
	        };
	    }
	    // If a timeout was passed, call the abort signal once the time elapses
	    if (request.timeout > 0) {
	        setTimeout(() => {
	            abortController.abort();
	        }, request.timeout);
	    }
	    return { abortController, abortControllerCleanup };
	}
	/**
	 * Gets the specific error
	 */
	function getError(e, request) {
	    var _a;
	    if (e && (e === null || e === void 0 ? void 0 : e.name) === "AbortError") {
	        return e;
	    }
	    else {
	        return new RestError(`Error sending request: ${e.message}`, {
	            code: (_a = e === null || e === void 0 ? void 0 : e.code) !== null && _a !== void 0 ? _a : RestError.REQUEST_SEND_ERROR,
	            request,
	        });
	    }
	}
	/**
	 * Converts PipelineRequest headers to Fetch headers
	 */
	function buildFetchHeaders(pipelineHeaders) {
	    const headers = new Headers();
	    for (const [name, value] of pipelineHeaders) {
	        headers.append(name, value);
	    }
	    return headers;
	}
	function buildPipelineHeaders(httpResponse) {
	    const responseHeaders = createHttpHeaders();
	    for (const [name, value] of httpResponse.headers) {
	        responseHeaders.set(name, value);
	    }
	    return responseHeaders;
	}
	function buildRequestBody(request) {
	    const body = typeof request.body === "function" ? request.body() : request.body;
	    if (isNodeReadableStream(body)) {
	        throw new Error("Node streams are not supported in browser environment.");
	    }
	    return isReadableStream(body)
	        ? { streaming: true, body: buildBodyStream(body, request.onUploadProgress) }
	        : { streaming: false, body };
	}
	/**
	 * Reads the request/response original stream and stream it through a new
	 * ReadableStream, this is done to be able to report progress in a way that
	 * all modern browsers support. TransformStreams would be an alternative,
	 * however they are not yet supported by all browsers i.e Firefox
	 */
	function buildBodyStream(readableStream, onProgress) {
	    let loadedBytes = 0;
	    // If the current browser supports pipeThrough we use a TransformStream
	    // to report progress
	    if (isTransformStreamSupported(readableStream)) {
	        return readableStream.pipeThrough(new TransformStream({
	            transform(chunk, controller) {
	                if (chunk === null) {
	                    controller.terminate();
	                    return;
	                }
	                controller.enqueue(chunk);
	                loadedBytes += chunk.length;
	                if (onProgress) {
	                    onProgress({ loadedBytes });
	                }
	            },
	        }));
	    }
	    else {
	        // If we can't use transform streams, wrap the original stream in a new readable stream
	        // and use pull to enqueue each chunk and report progress.
	        const reader = readableStream.getReader();
	        return new ReadableStream({
	            async pull(controller) {
	                var _a;
	                const { done, value } = await reader.read();
	                // When no more data needs to be consumed, break the reading
	                if (done || !value) {
	                    // Close the stream
	                    controller.close();
	                    reader.releaseLock();
	                    return;
	                }
	                loadedBytes += (_a = value === null || value === void 0 ? void 0 : value.length) !== null && _a !== void 0 ? _a : 0;
	                // Enqueue the next data chunk into our target stream
	                controller.enqueue(value);
	                if (onProgress) {
	                    onProgress({ loadedBytes });
	                }
	            },
	        });
	    }
	}
	/**
	 * Create a new HttpClient instance for the browser environment.
	 * @internal
	 */
	function createFetchHttpClient() {
	    return new FetchHttpClient();
	}
	function isTransformStreamSupported(readableStream) {
	    return readableStream.pipeThrough !== undefined && self.TransformStream !== undefined;
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * Create the correct HttpClient for the current environment.
	 */
	function createDefaultHttpClient() {
	    return createFetchHttpClient();
	}

	// Copyright (c) Microsoft Corporation.
	class PipelineRequestImpl {
	    constructor(options) {
	        var _a, _b, _c, _d, _e, _f, _g;
	        this.url = options.url;
	        this.body = options.body;
	        this.headers = (_a = options.headers) !== null && _a !== void 0 ? _a : createHttpHeaders();
	        this.method = (_b = options.method) !== null && _b !== void 0 ? _b : "GET";
	        this.timeout = (_c = options.timeout) !== null && _c !== void 0 ? _c : 0;
	        this.formData = options.formData;
	        this.disableKeepAlive = (_d = options.disableKeepAlive) !== null && _d !== void 0 ? _d : false;
	        this.proxySettings = options.proxySettings;
	        this.streamResponseStatusCodes = options.streamResponseStatusCodes;
	        this.withCredentials = (_e = options.withCredentials) !== null && _e !== void 0 ? _e : false;
	        this.abortSignal = options.abortSignal;
	        this.tracingOptions = options.tracingOptions;
	        this.onUploadProgress = options.onUploadProgress;
	        this.onDownloadProgress = options.onDownloadProgress;
	        this.requestId = options.requestId || randomUUID();
	        this.allowInsecureConnection = (_f = options.allowInsecureConnection) !== null && _f !== void 0 ? _f : false;
	        this.enableBrowserStreams = (_g = options.enableBrowserStreams) !== null && _g !== void 0 ? _g : false;
	    }
	}
	/**
	 * Creates a new pipeline request with the given options.
	 * This method is to allow for the easy setting of default values and not required.
	 * @param options - The options to create the request with.
	 */
	function createPipelineRequest(options) {
	    return new PipelineRequestImpl(options);
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * The programmatic identifier of the exponentialRetryPolicy.
	 */
	const exponentialRetryPolicyName = "exponentialRetryPolicy";
	/**
	 * A policy that attempts to retry requests while introducing an exponentially increasing delay.
	 * @param options - Options that configure retry logic.
	 */
	function exponentialRetryPolicy(options = {}) {
	    var _a;
	    return retryPolicy([
	        exponentialRetryStrategy(Object.assign(Object.assign({}, options), { ignoreSystemErrors: true })),
	    ], {
	        maxRetries: (_a = options.maxRetries) !== null && _a !== void 0 ? _a : DEFAULT_RETRY_POLICY_COUNT,
	    });
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * Name of the {@link systemErrorRetryPolicy}
	 */
	const systemErrorRetryPolicyName = "systemErrorRetryPolicy";
	/**
	 * A retry policy that specifically seeks to handle errors in the
	 * underlying transport layer (e.g. DNS lookup failures) rather than
	 * retryable error codes from the server itself.
	 * @param options - Options that customize the policy.
	 */
	function systemErrorRetryPolicy(options = {}) {
	    var _a;
	    return {
	        name: systemErrorRetryPolicyName,
	        sendRequest: retryPolicy([
	            exponentialRetryStrategy(Object.assign(Object.assign({}, options), { ignoreHttpStatusCodes: true })),
	        ], {
	            maxRetries: (_a = options.maxRetries) !== null && _a !== void 0 ? _a : DEFAULT_RETRY_POLICY_COUNT,
	        }).sendRequest,
	    };
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * Name of the {@link throttlingRetryPolicy}
	 */
	const throttlingRetryPolicyName = "throttlingRetryPolicy";
	/**
	 * A policy that retries when the server sends a 429 response with a Retry-After header.
	 *
	 * To learn more, please refer to
	 * https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-manager-request-limits,
	 * https://docs.microsoft.com/en-us/azure/azure-subscription-service-limits and
	 * https://docs.microsoft.com/en-us/azure/virtual-machines/troubleshooting/troubleshooting-throttling-errors
	 *
	 * @param options - Options that configure retry logic.
	 */
	function throttlingRetryPolicy(options = {}) {
	    var _a;
	    return {
	        name: throttlingRetryPolicyName,
	        sendRequest: retryPolicy([throttlingRetryStrategy()], {
	            maxRetries: (_a = options.maxRetries) !== null && _a !== void 0 ? _a : DEFAULT_RETRY_POLICY_COUNT,
	        }).sendRequest,
	    };
	}

	// Copyright (c) Microsoft Corporation.
	// Default options for the cycler if none are provided
	const DEFAULT_CYCLER_OPTIONS = {
	    forcedRefreshWindowInMs: 1000,
	    retryIntervalInMs: 3000,
	    refreshWindowInMs: 1000 * 60 * 2, // Start refreshing 2m before expiry
	};
	/**
	 * Converts an an unreliable access token getter (which may resolve with null)
	 * into an AccessTokenGetter by retrying the unreliable getter in a regular
	 * interval.
	 *
	 * @param getAccessToken - A function that produces a promise of an access token that may fail by returning null.
	 * @param retryIntervalInMs - The time (in milliseconds) to wait between retry attempts.
	 * @param refreshTimeout - The timestamp after which the refresh attempt will fail, throwing an exception.
	 * @returns - A promise that, if it resolves, will resolve with an access token.
	 */
	async function beginRefresh(getAccessToken, retryIntervalInMs, refreshTimeout) {
	    // This wrapper handles exceptions gracefully as long as we haven't exceeded
	    // the timeout.
	    async function tryGetAccessToken() {
	        if (Date.now() < refreshTimeout) {
	            try {
	                return await getAccessToken();
	            }
	            catch (_a) {
	                return null;
	            }
	        }
	        else {
	            const finalToken = await getAccessToken();
	            // Timeout is up, so throw if it's still null
	            if (finalToken === null) {
	                throw new Error("Failed to refresh access token.");
	            }
	            return finalToken;
	        }
	    }
	    let token = await tryGetAccessToken();
	    while (token === null) {
	        await delay$1(retryIntervalInMs);
	        token = await tryGetAccessToken();
	    }
	    return token;
	}
	/**
	 * Creates a token cycler from a credential, scopes, and optional settings.
	 *
	 * A token cycler represents a way to reliably retrieve a valid access token
	 * from a TokenCredential. It will handle initializing the token, refreshing it
	 * when it nears expiration, and synchronizes refresh attempts to avoid
	 * concurrency hazards.
	 *
	 * @param credential - the underlying TokenCredential that provides the access
	 * token
	 * @param tokenCyclerOptions - optionally override default settings for the cycler
	 *
	 * @returns - a function that reliably produces a valid access token
	 */
	function createTokenCycler(credential, tokenCyclerOptions) {
	    let refreshWorker = null;
	    let token = null;
	    let tenantId;
	    const options = Object.assign(Object.assign({}, DEFAULT_CYCLER_OPTIONS), tokenCyclerOptions);
	    /**
	     * This little holder defines several predicates that we use to construct
	     * the rules of refreshing the token.
	     */
	    const cycler = {
	        /**
	         * Produces true if a refresh job is currently in progress.
	         */
	        get isRefreshing() {
	            return refreshWorker !== null;
	        },
	        /**
	         * Produces true if the cycler SHOULD refresh (we are within the refresh
	         * window and not already refreshing)
	         */
	        get shouldRefresh() {
	            var _a;
	            return (!cycler.isRefreshing &&
	                ((_a = token === null || token === void 0 ? void 0 : token.expiresOnTimestamp) !== null && _a !== void 0 ? _a : 0) - options.refreshWindowInMs < Date.now());
	        },
	        /**
	         * Produces true if the cycler MUST refresh (null or nearly-expired
	         * token).
	         */
	        get mustRefresh() {
	            return (token === null || token.expiresOnTimestamp - options.forcedRefreshWindowInMs < Date.now());
	        },
	    };
	    /**
	     * Starts a refresh job or returns the existing job if one is already
	     * running.
	     */
	    function refresh(scopes, getTokenOptions) {
	        var _a;
	        if (!cycler.isRefreshing) {
	            // We bind `scopes` here to avoid passing it around a lot
	            const tryGetAccessToken = () => credential.getToken(scopes, getTokenOptions);
	            // Take advantage of promise chaining to insert an assignment to `token`
	            // before the refresh can be considered done.
	            refreshWorker = beginRefresh(tryGetAccessToken, options.retryIntervalInMs, 
	            // If we don't have a token, then we should timeout immediately
	            (_a = token === null || token === void 0 ? void 0 : token.expiresOnTimestamp) !== null && _a !== void 0 ? _a : Date.now())
	                .then((_token) => {
	                refreshWorker = null;
	                token = _token;
	                tenantId = getTokenOptions.tenantId;
	                return token;
	            })
	                .catch((reason) => {
	                // We also should reset the refresher if we enter a failed state.  All
	                // existing awaiters will throw, but subsequent requests will start a
	                // new retry chain.
	                refreshWorker = null;
	                token = null;
	                tenantId = undefined;
	                throw reason;
	            });
	        }
	        return refreshWorker;
	    }
	    return async (scopes, tokenOptions) => {
	        //
	        // Simple rules:
	        // - If we MUST refresh, then return the refresh task, blocking
	        //   the pipeline until a token is available.
	        // - If we SHOULD refresh, then run refresh but don't return it
	        //   (we can still use the cached token).
	        // - Return the token, since it's fine if we didn't return in
	        //   step 1.
	        //
	        // If the tenantId passed in token options is different to the one we have
	        // Or if we are in claim challenge and the token was rejected and a new access token need to be issued, we need to
	        // refresh the token with the new tenantId or token.
	        const mustRefresh = tenantId !== tokenOptions.tenantId || Boolean(tokenOptions.claims) || cycler.mustRefresh;
	        if (mustRefresh)
	            return refresh(scopes, tokenOptions);
	        if (cycler.shouldRefresh) {
	            refresh(scopes, tokenOptions);
	        }
	        return token;
	    };
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * The programmatic identifier of the bearerTokenAuthenticationPolicy.
	 */
	const bearerTokenAuthenticationPolicyName = "bearerTokenAuthenticationPolicy";
	/**
	 * Default authorize request handler
	 */
	async function defaultAuthorizeRequest(options) {
	    const { scopes, getAccessToken, request } = options;
	    const getTokenOptions = {
	        abortSignal: request.abortSignal,
	        tracingOptions: request.tracingOptions,
	    };
	    const accessToken = await getAccessToken(scopes, getTokenOptions);
	    if (accessToken) {
	        options.request.headers.set("Authorization", `Bearer ${accessToken.token}`);
	    }
	}
	/**
	 * We will retrieve the challenge only if the response status code was 401,
	 * and if the response contained the header "WWW-Authenticate" with a non-empty value.
	 */
	function getChallenge(response) {
	    const challenge = response.headers.get("WWW-Authenticate");
	    if (response.status === 401 && challenge) {
	        return challenge;
	    }
	    return;
	}
	/**
	 * A policy that can request a token from a TokenCredential implementation and
	 * then apply it to the Authorization header of a request as a Bearer token.
	 */
	function bearerTokenAuthenticationPolicy(options) {
	    var _a;
	    const { credential, scopes, challengeCallbacks } = options;
	    const logger = options.logger || logger$1;
	    const callbacks = Object.assign({ authorizeRequest: (_a = challengeCallbacks === null || challengeCallbacks === void 0 ? void 0 : challengeCallbacks.authorizeRequest) !== null && _a !== void 0 ? _a : defaultAuthorizeRequest, authorizeRequestOnChallenge: challengeCallbacks === null || challengeCallbacks === void 0 ? void 0 : challengeCallbacks.authorizeRequestOnChallenge }, challengeCallbacks);
	    // This function encapsulates the entire process of reliably retrieving the token
	    // The options are left out of the public API until there's demand to configure this.
	    // Remember to extend `BearerTokenAuthenticationPolicyOptions` with `TokenCyclerOptions`
	    // in order to pass through the `options` object.
	    const getAccessToken = credential
	        ? createTokenCycler(credential /* , options */)
	        : () => Promise.resolve(null);
	    return {
	        name: bearerTokenAuthenticationPolicyName,
	        /**
	         * If there's no challenge parameter:
	         * - It will try to retrieve the token using the cache, or the credential's getToken.
	         * - Then it will try the next policy with or without the retrieved token.
	         *
	         * It uses the challenge parameters to:
	         * - Skip a first attempt to get the token from the credential if there's no cached token,
	         *   since it expects the token to be retrievable only after the challenge.
	         * - Prepare the outgoing request if the `prepareRequest` method has been provided.
	         * - Send an initial request to receive the challenge if it fails.
	         * - Process a challenge if the response contains it.
	         * - Retrieve a token with the challenge information, then re-send the request.
	         */
	        async sendRequest(request, next) {
	            if (!request.url.toLowerCase().startsWith("https://")) {
	                throw new Error("Bearer token authentication is not permitted for non-TLS protected (non-https) URLs.");
	            }
	            await callbacks.authorizeRequest({
	                scopes: Array.isArray(scopes) ? scopes : [scopes],
	                request,
	                getAccessToken,
	                logger,
	            });
	            let response;
	            let error;
	            try {
	                response = await next(request);
	            }
	            catch (err) {
	                error = err;
	                response = err.response;
	            }
	            if (callbacks.authorizeRequestOnChallenge &&
	                (response === null || response === void 0 ? void 0 : response.status) === 401 &&
	                getChallenge(response)) {
	                // processes challenge
	                const shouldSendRequest = await callbacks.authorizeRequestOnChallenge({
	                    scopes: Array.isArray(scopes) ? scopes : [scopes],
	                    request,
	                    response,
	                    getAccessToken,
	                    logger,
	                });
	                if (shouldSendRequest) {
	                    return next(request);
	                }
	            }
	            if (error) {
	                throw error;
	            }
	            else {
	                return response;
	            }
	        },
	    };
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/**
	 * The programmatic identifier of the ndJsonPolicy.
	 */
	const ndJsonPolicyName = "ndJsonPolicy";
	/**
	 * ndJsonPolicy is a policy used to control keep alive settings for every request.
	 */
	function ndJsonPolicy() {
	    return {
	        name: ndJsonPolicyName,
	        async sendRequest(request, next) {
	            // There currently isn't a good way to bypass the serializer
	            if (typeof request.body === "string" && request.body.startsWith("[")) {
	                const body = JSON.parse(request.body);
	                if (Array.isArray(body)) {
	                    request.body = body.map((item) => JSON.stringify(item) + "\n").join("");
	                }
	            }
	            return next(request);
	        },
	    };
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * The programmatic identifier of the auxiliaryAuthenticationHeaderPolicy.
	 */
	const auxiliaryAuthenticationHeaderPolicyName = "auxiliaryAuthenticationHeaderPolicy";
	const AUTHORIZATION_AUXILIARY_HEADER = "x-ms-authorization-auxiliary";
	async function sendAuthorizeRequest(options) {
	    var _a, _b;
	    const { scopes, getAccessToken, request } = options;
	    const getTokenOptions = {
	        abortSignal: request.abortSignal,
	        tracingOptions: request.tracingOptions,
	    };
	    return (_b = (_a = (await getAccessToken(scopes, getTokenOptions))) === null || _a === void 0 ? void 0 : _a.token) !== null && _b !== void 0 ? _b : "";
	}
	/**
	 * A policy for external tokens to `x-ms-authorization-auxiliary` header.
	 * This header will be used when creating a cross-tenant application we may need to handle authentication requests
	 * for resources that are in different tenants.
	 * You could see [ARM docs](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/authenticate-multi-tenant) for a rundown of how this feature works
	 */
	function auxiliaryAuthenticationHeaderPolicy(options) {
	    const { credentials, scopes } = options;
	    const logger = options.logger || logger$1;
	    const tokenCyclerMap = new WeakMap();
	    return {
	        name: auxiliaryAuthenticationHeaderPolicyName,
	        async sendRequest(request, next) {
	            if (!request.url.toLowerCase().startsWith("https://")) {
	                throw new Error("Bearer token authentication for auxiliary header is not permitted for non-TLS protected (non-https) URLs.");
	            }
	            if (!credentials || credentials.length === 0) {
	                logger.info(`${auxiliaryAuthenticationHeaderPolicyName} header will not be set due to empty credentials.`);
	                return next(request);
	            }
	            const tokenPromises = [];
	            for (const credential of credentials) {
	                let getAccessToken = tokenCyclerMap.get(credential);
	                if (!getAccessToken) {
	                    getAccessToken = createTokenCycler(credential);
	                    tokenCyclerMap.set(credential, getAccessToken);
	                }
	                tokenPromises.push(sendAuthorizeRequest({
	                    scopes: Array.isArray(scopes) ? scopes : [scopes],
	                    request,
	                    getAccessToken,
	                    logger,
	                }));
	            }
	            const auxiliaryTokens = (await Promise.all(tokenPromises)).filter((token) => Boolean(token));
	            if (auxiliaryTokens.length === 0) {
	                logger.warning(`None of the auxiliary tokens are valid. ${AUTHORIZATION_AUXILIARY_HEADER} header will not be set.`);
	                return next(request);
	            }
	            request.headers.set(AUTHORIZATION_AUXILIARY_HEADER, auxiliaryTokens.map((token) => `Bearer ${token}`).join(", "));
	            return next(request);
	        },
	    };
	}

	// Copyright (c) Microsoft Corporation.

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	// In the browser, we load the env variables with the help of karma.conf.js
	const env = window.__env__;

	// Copyright (c) Microsoft Corporation.
	/**
	 * A custom error type for failed pipeline requests.
	 */
	class RecorderError extends Error {
	    constructor(message, statusCode) {
	        super(message);
	        this.statusCode = statusCode;
	        this.name = "RecorderError";
	        this.statusCode = statusCode;
	    }
	}
	/**
	 * Helper class to manage the recording state to make sure the proxy-tool is not flooded with unintended requests.
	 */
	class RecordingStateManager {
	    constructor() {
	        this.currentState = "stopped";
	    }
	    /**
	     * validateState
	     */
	    validateState(nextState) {
	        if (nextState === "started") {
	            if (this.state === "started") {
	                throw new RecorderError("Already started, should not have called start again.");
	            }
	        }
	        if (nextState === "stopped") {
	            if (this.state === "stopped") {
	                throw new RecorderError("Already stopped, should not have called stop again.");
	            }
	        }
	    }
	    get state() {
	        return this.currentState;
	    }
	    set state(nextState) {
	        // Validate state transition
	        this.validateState(nextState);
	        this.currentState = nextState;
	    }
	}
	function isStringSanitizer(sanitizer) {
	    return !sanitizer.regex;
	}
	/**
	 * Throws error message when the `label` is not defined when it should have been defined in the given mode.
	 *
	 * Returns true if the param exists.
	 */
	function ensureExistence(thing, label) {
	    if (!thing) {
	        throw new RecorderError(`Something went wrong, ${label} should not have been undefined in "${getTestMode()}" mode.`);
	    }
	    return true; // Since we would throw error if undefined
	}
	/**
	 * Returns the test mode.
	 *
	 * If TEST_MODE is not defined, defaults to playback.
	 */
	function getTestMode() {
	    var _a;
	    if (isPlaybackMode()) {
	        return "playback";
	    }
	    return (_a = env.TEST_MODE) === null || _a === void 0 ? void 0 : _a.toLowerCase();
	}
	/** Make a lazy value that can be deferred and only computed once. */
	const once = (make) => {
	    let value;
	    return () => (value = value !== null && value !== void 0 ? value : make());
	};
	function isRecordMode() {
	    var _a;
	    return ((_a = env.TEST_MODE) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "record";
	}
	function isLiveMode() {
	    var _a;
	    return ((_a = env.TEST_MODE) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "live";
	}
	function isPlaybackMode() {
	    return !isRecordMode() && !isLiveMode();
	}
	/**
	 * Loads the environment variables in both node and browser modes corresponding to the key-value pairs provided.
	 *
	 * Example-
	 *
	 * Suppose `variables` is { ACCOUNT_NAME: "my_account_name", ACCOUNT_KEY: "fake_secret" },
	 * `setEnvironmentVariables` loads the ACCOUNT_NAME and ACCOUNT_KEY in the environment accordingly.
	 */
	function setEnvironmentVariables(variables) {
	    for (const [key, value] of Object.entries(variables)) {
	        env[key] = value;
	    }
	}
	/**
	 * Returns the environment variable. Throws error if not defined.
	 */
	function assertEnvironmentVariable(variable) {
	    const value = env[variable];
	    if (!value)
	        throw new Error(`${variable} is not defined`);
	    return value;
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/**
	 * This method is used while generating the file/folder path using the describe/it block titles.
	 *
	 * Since those titles may contain symbols such as `<`, "=" or even ' ', we'll replace them
	 * with strings representing those symbols or with something that reads better as a file name.
	 *
	 * If a test has some special character that is not being considered here,
	 * feel free to add the symbol and its replacement.
	 */
	function formatPath(path) {
	    return path
	        .toLowerCase()
	        .replace(/ /g, "_")
	        .replace(/<=/g, "lte")
	        .replace(/>=/g, "gte")
	        .replace(/</g, "lt")
	        .replace(/>/g, "gt")
	        .replace(/=/g, "eq")
	        .replace(/\W/g, "");
	}
	/**
	 * Generates a file path with the following structure:
	 *
	 *     `{node|browsers}/<describe-block-title>/recording_<test-title>.json`
	 *
	 * @param platform A string, either "node" or "browsers".
	 * @param testSuiteTitle The title of the test suite.
	 * @param testTitle The title of the specific test we're running.
	 */
	function generateTestRecordingFilePath(platform, testSuiteTitle, testTitle) {
	    // File Extension
	    return `${platform}/${formatPath(testSuiteTitle)}/recording_${formatPath(testTitle)}.json`;
	}

	// Copyright (c) Microsoft Corporation.
	function relativeRecordingsPath() {
	    if (env.RECORDINGS_RELATIVE_PATH) {
	        return env.RECORDINGS_RELATIVE_PATH;
	    }
	    else {
	        throw new RecorderError("RECORDINGS_RELATIVE_PATH was not set while in browser mode. Ensure that process.env.RELATIVE_RECORDINGS_PATH has been set properly in your Karma configuration.");
	    }
	}

	// Copyright (c) Microsoft Corporation.
	function sessionFilePath(testContext) {
	    // sdk/service/project/recordings/{node|browsers}/<describe-block-title>/recording_<test-title>.json
	    return `${relativeRecordingsPath()}/${recordingFilePath(testContext)}`;
	}
	/**
	 * Generates a file path with the following structure:
	 *
	 *  `{node|browsers}/<describe-block-title>/recording_<test-title>.json`
	 */
	function recordingFilePath(testContext) {
	    if (!testContext.parent) {
	        throw new RecorderError(`Test ${testContext.title} is not inside a describe block, so a file path for its recording could not be generated. Please place the test inside a describe block.`);
	    }
	    return generateTestRecordingFilePath(isNode ? "node" : "browsers", testContext.parent.fullTitle(), testContext.title);
	}
	function assetsJsonPath() {
	    // Hacky solution using substring works around the fact that:
	    // 1) the relativeRecordingsPath may not exist on disk (so relativeRecordingsPath()/../assets.json might not exist either, can't use ..)
	    // 2) `path` (and therefore `path.dirname`) is not available in the browser.
	    const recordingsPath = relativeRecordingsPath();
	    const sdkDir = recordingsPath.substring(0, recordingsPath.lastIndexOf("/"));
	    return `${sdkDir}/assets.json`;
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/**
	 * All the routes available with the proxy-tool endpoint that can be hit
	 */
	const paths = {
	    playback: "/playback",
	    record: "/record",
	    start: "/start",
	    stop: "/stop",
	    admin: "/admin",
	    addSanitizer: "/addSanitizer",
	    info: "/info",
	    available: "/available",
	    active: "/active",
	    reset: "/reset",
	    setMatcher: "/setMatcher",
	    addTransform: "/addTransform",
	    setRecordingOptions: "/setRecordingOptions",
	};

	const logger = createClientLogger("test-recorder");

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	/**
	 * Returns the connection string parsed as JSON object.
	 */
	function getConnStringAsJSON(connectionString) {
	    const keyValuePairs = {};
	    const elements = connectionString.split(";").filter((e) => Boolean(e));
	    for (const element of elements) {
	        const trimmedElement = element.trim();
	        const [elementKey, value] = getKeyValuePair(trimmedElement);
	        keyValuePairs[elementKey] = value;
	    }
	    return keyValuePairs;
	}
	/**
	 * Returns the key and value from `<key>=<value>` string.
	 *
	 * `a=b=c` => ["a", "b=c"]
	 */
	function getKeyValuePair(kvp) {
	    // If the string is not in kvp format <key>=<value> return an empty array
	    if (!kvp || kvp.indexOf("=") === -1) {
	        return [];
	    }
	    return kvp.split(/=(.*)/).slice(0, 2);
	}
	/**
	 * Get real and fake values mapped from the provided connection strings.
	 *
	 * Example:
	 *  connectionString = "endpoint=secretive.azure.io;token=a1b2c3d4;secret=totally_secret"
	 *  fakeConnString   = "endpoint=randomval.azure.io;token=mask_tok;secret=totally_faked"
	 *
	 *  // Ordering/spaces are not important
	 *
	 * Returns
	 * ```
	 * {
	 *   "secretive.azure.io": "randomval.azure.io",
	 *   "a1b2c3d4"          : "mask_tok",
	 *   "totally_secret"    : "totally_faked"
	 * }
	 * ```
	 */
	function getRealAndFakePairs(connectionString, fakeConnString) {
	    const realAndFakePairs = {};
	    const fakeValues = getConnStringAsJSON(fakeConnString);
	    const realValues = getConnStringAsJSON(connectionString);
	    for (const key in fakeValues) {
	        realAndFakePairs[realValues[key]] = fakeValues[key]; // "real value" : "fake value"
	    }
	    return realAndFakePairs;
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * Adds the recording id headers to the requests that are sent to the proxy tool.
	 * These are required to appropriately save the recordings in the record mode and picking them up in playback.
	 */
	function createRecordingRequest(url, sessionFile, recordingId, method = "POST", assetsJson) {
	    const req = createPipelineRequest({ url: url, method });
	    if (sessionFile !== undefined) {
	        const body = { "x-recording-file": sessionFile };
	        // during browser tests the non-presence of an assets.json will result in the value "undefined" being set
	        // its easier to just explicitly handle this case rather than ensure that folks update their karma conf properly.
	        if (assetsJson && assetsJson !== "undefined") {
	            body["x-recording-assets-file"] = assetsJson;
	        }
	        req.body = JSON.stringify(body);
	    }
	    if (recordingId !== undefined) {
	        req.headers.set("x-recording-id", recordingId);
	    }
	    return req;
	}

	/**
	 * Given an AddSanitizer<T> function, create an AddSanitizer function that operates on an array of T, adding
	 * each sanitizer in the array individually.
	 */
	const pluralize = (singular) => async (httpClient, url, recordingId, sanitizers) => {
	    await Promise.all(sanitizers.map((sanitizer) => singular(httpClient, url, recordingId, sanitizer)));
	};
	/**
	 * Makes an AddSanitizer<unknown> function that passes the sanitizer content directly to the test proxy request body.
	 */
	const makeAddSanitizer = (sanitizerName) => async (httpClient, url, recordingId, sanitizer) => {
	    await addSanitizer(httpClient, url, recordingId, {
	        sanitizer: sanitizerName,
	        body: sanitizer,
	    });
	};
	/**
	 * Makes an AddSanitizer<boolean> function that adds the sanitizer if the value is set to true,
	 * and otherwise makes no request to the server. Used for ResetSanitizer and OAuthResponseSanitizer.
	 */
	const makeAddBodilessSanitizer = (sanitizerName) => async (httpClient, url, recordingId, enable) => {
	    if (enable) {
	        await addSanitizer(httpClient, url, recordingId, {
	            sanitizer: sanitizerName,
	            body: undefined,
	        });
	    }
	};
	/**
	 * Makes an AddSanitizer function for a FindReplaceSanitizer, for example a bodySanitizer.
	 * Depending on the input FindReplaceSanitizer options, either adds a sanitizer named `regexSanitizerName`
	 * or `stringSanitizerName`.
	 */
	const makeAddFindReplaceSanitizer = (regexSanitizerName, stringSanitizerName) => async (httpClient, url, recordingId, sanitizer) => {
	    if (isStringSanitizer(sanitizer)) {
	        await addSanitizer(httpClient, url, recordingId, {
	            sanitizer: stringSanitizerName,
	            body: {
	                target: sanitizer.target,
	                value: sanitizer.value,
	            },
	        });
	    }
	    else {
	        await addSanitizer(httpClient, url, recordingId, {
	            sanitizer: regexSanitizerName,
	            body: {
	                regex: sanitizer.target,
	                value: sanitizer.value,
	                groupForReplace: sanitizer.groupForReplace,
	            },
	        });
	    }
	};
	/**
	 *  Internally,
	 * - connection strings are parsed and
	 * - each part of the connection string is mapped with its corresponding fake value
	 * - GeneralStringSanitizer is applied for each of the parts with the real and fake values that are parsed
	 */
	const addConnectionStringSanitizer = async (httpClient, url, recordingId, { actualConnString, fakeConnString }) => {
	    if (!actualConnString) {
	        if (!isRecordMode())
	            return;
	        throw new RecorderError(`Attempted to add an invalid sanitizer - ${JSON.stringify({
            actualConnString: actualConnString,
            fakeConnString: fakeConnString,
        })}`);
	    }
	    // extract connection string parts and match call
	    const pairsMatched = getRealAndFakePairs(actualConnString, fakeConnString);
	    await addSanitizers(httpClient, url, recordingId, {
	        generalSanitizers: Object.entries(pairsMatched).map(([key, value]) => {
	            return { value, target: key };
	        }),
	    });
	};
	/**
	 * Adds a ContinuationSanitizer with the given options.
	 */
	const addContinuationSanitizer = async (httpClient, url, recordingId, sanitizer) => {
	    await addSanitizer(httpClient, url, recordingId, {
	        sanitizer: "ContinuationSanitizer",
	        body: Object.assign(Object.assign({}, sanitizer), { resetAfterFirst: sanitizer.resetAfterFirst.toString() }),
	    });
	};
	/**
	 * Adds a RemoveHeaderSanitizer with the given options.
	 */
	const addRemoveHeaderSanitizer = async (httpClient, url, recordingId, sanitizer) => {
	    await addSanitizer(httpClient, url, recordingId, {
	        sanitizer: "RemoveHeaderSanitizer",
	        body: {
	            headersForRemoval: sanitizer.headersForRemoval.toString(),
	        },
	    });
	};
	/**
	 * Adds a HeaderRegexSanitizer or HeaderStringSanitizer.
	 *
	 * HeaderSanitizer is a special case of FindReplaceSanitizer where a header name ('key') must be provided.
	 * Additionally, the 'target' option is not required. If target is unspecified, the header's value will always
	 * be replaced.
	 */
	const addHeaderSanitizer = async (httpClient, url, recordingId, sanitizer) => {
	    if (sanitizer.regex || !sanitizer.target) {
	        await addSanitizer(httpClient, url, recordingId, {
	            sanitizer: "HeaderRegexSanitizer",
	            body: {
	                key: sanitizer.key,
	                value: sanitizer.value,
	                regex: sanitizer.target,
	                groupForReplace: sanitizer.groupForReplace,
	            },
	        });
	    }
	    else {
	        await addSanitizer(httpClient, url, recordingId, {
	            sanitizer: "HeaderStringSanitizer",
	            body: {
	                key: sanitizer.key,
	                target: sanitizer.target,
	                value: sanitizer.value,
	            },
	        });
	    }
	};
	const addSanitizersActions = {
	    generalSanitizers: pluralize(makeAddFindReplaceSanitizer("GeneralRegexSanitizer", "GeneralStringSanitizer")),
	    bodySanitizers: pluralize(makeAddFindReplaceSanitizer("BodyRegexSanitizer", "BodyStringSanitizer")),
	    headerSanitizers: pluralize(addHeaderSanitizer),
	    uriSanitizers: pluralize(makeAddFindReplaceSanitizer("UriRegexSanitizer", "UriStringSanitizer")),
	    connectionStringSanitizers: pluralize(addConnectionStringSanitizer),
	    bodyKeySanitizers: pluralize(makeAddSanitizer("BodyKeySanitizer")),
	    continuationSanitizers: pluralize(addContinuationSanitizer),
	    removeHeaderSanitizer: addRemoveHeaderSanitizer,
	    oAuthResponseSanitizer: makeAddBodilessSanitizer("OAuthResponseSanitizer"),
	    uriSubscriptionIdSanitizer: makeAddSanitizer("UriSubscriptionIdSanitizer"),
	    resetSanitizer: makeAddBodilessSanitizer("Reset"),
	};
	async function addSanitizers(httpClient, url, recordingId, options) {
	    await Promise.all(Object.entries(options).map(([key, sanitizer]) => {
	        const action = addSanitizersActions[key];
	        if (!action) {
	            throw new RecorderError(`Sanitizer ${key} not implemented`);
	        }
	        return action(httpClient, url, recordingId, sanitizer);
	    }));
	}
	/**
	 * Atomic method to add a simple sanitizer.
	 */
	async function addSanitizer(httpClient, url, recordingId, options) {
	    const uri = `${url}${paths.admin}${options.sanitizer !== "Reset" ? paths.addSanitizer : paths.reset}`;
	    const req = createRecordingRequest(uri, undefined, recordingId);
	    if (options.sanitizer !== "Reset") {
	        req.headers.set("x-abstraction-identifier", options.sanitizer);
	    }
	    req.headers.set("Content-Type", "application/json");
	    req.body = options.body !== undefined ? JSON.stringify(options.body) : undefined;
	    logger.info("[addSanitizer] Adding sanitizer", options);
	    const rsp = await httpClient.sendRequest(Object.assign(Object.assign({}, req), { allowInsecureConnection: true }));
	    if (rsp.status !== 200) {
	        logger.error("[addSanitizer] addSanitizer request failed", rsp);
	        throw new RecorderError("addSanitizer request failed.");
	    }
	}
	/**
	 * Returns the html document of all the available transforms in the proxy-tool
	 */
	async function transformsInfo(httpClient, url, recordingId) {
	    if (recordingId) {
	        const infoUri = `${url}${paths.info}${paths.available}`;
	        const req = createRecordingRequest(infoUri, undefined, recordingId, "GET");
	        if (!httpClient) {
	            throw new RecorderError(`Something went wrong, Sanitizer.httpClient should not have been undefined in ${getTestMode()} mode.`);
	        }
	        const rsp = await httpClient.sendRequest(Object.assign(Object.assign({}, req), { allowInsecureConnection: true }));
	        if (rsp.status !== 200) {
	            throw new RecorderError("Info request failed.");
	        }
	        return rsp.bodyAsText;
	    }
	    else {
	        throw new RecorderError("Bad state, recordingId is not defined when called transformsInfo().");
	    }
	}

	// Copyright (c) Microsoft Corporation.
	/**
	 * Supposed to be used in record and playback modes.
	 * Has no effect in live mode.
	 *
	 *  1. The key-value pairs will be used as the environment variables in playback mode.
	 *  2. If the env variables are present in the recordings as plain strings, they will be replaced with the provided values in record mode
	 */
	async function handleEnvSetup(httpClient, url, recordingId, envSetupForPlayback) {
	    if (envSetupForPlayback) {
	        if (isPlaybackMode()) {
	            // Loads the "fake" environment variables in `process.env` or `window.__env__` based on the runtime
	            logger.verbose("[handleEnvSetup] Playback mode: updating environment variables to their fake values");
	            setEnvironmentVariables(envSetupForPlayback);
	        }
	        else if (isRecordMode()) {
	            logger.verbose("[handleEnvSetup] Record mode: adding sanitizers to remove environment variables set in envSetupForPlayback:", envSetupForPlayback);
	            // If the env variables are present in the recordings as plain strings, they will be replaced with the provided values in record mode
	            const generalSanitizers = [];
	            for (const [key, value] of Object.entries(envSetupForPlayback)) {
	                const envKey = env[key];
	                if (envKey) {
	                    generalSanitizers.push({ target: envKey, value });
	                }
	            }
	            await addSanitizers(httpClient, url, recordingId, {
	                generalSanitizers,
	            });
	            logger.verbose("[handleEnvSetup] Added environment variable sanitizers successfully.");
	        }
	    }
	}

	// Copyright (c) Microsoft Corporation.
	async function setMatcher(recorderUrl, httpClient, matcher, recordingId, matcherBody = { compareBodies: true, ignoreQueryOrdering: false }) {
	    var _a, _b;
	    const url = `${recorderUrl}${paths.admin}${paths.setMatcher}`;
	    const request = createPipelineRequest({ url, method: "POST", allowInsecureConnection: true });
	    request.headers.set("x-abstraction-identifier", matcher);
	    if (recordingId) {
	        request.headers.set("x-recording-id", recordingId);
	    }
	    if (matcherBody) {
	        request.body = JSON.stringify({
	            compareBodies: matcherBody.compareBodies,
	            excludedHeaders: (_a = matcherBody.excludedHeaders) === null || _a === void 0 ? void 0 : _a.toString(),
	            ignoredHeaders: (_b = matcherBody.ignoredHeaders) === null || _b === void 0 ? void 0 : _b.toString(),
	            ignoreQueryOrdering: matcherBody.ignoreQueryOrdering,
	        });
	    }
	    logger.info("[setMatcher] Setting matcher", matcher, matcherBody);
	    const response = await httpClient.sendRequest(request);
	    const { status, bodyAsText } = response;
	    if (status < 200 || status > 299) {
	        logger.error("[setMatcher] setMatcher failed", response);
	        throw new RecorderError(`setMatcher failed: ${bodyAsText}`, status);
	    }
	}

	// Copyright (c) Microsoft Corporation.
	async function addTransform(recorderUrl, httpClient, transform, recordingId) {
	    var _a;
	    const url = `${recorderUrl}${paths.admin}${paths.addTransform}`;
	    const request = createPipelineRequest({ url, method: "POST", allowInsecureConnection: true });
	    request.headers.set("x-abstraction-identifier", transform.type);
	    if (recordingId) {
	        request.headers.set("x-recording-id", recordingId);
	    }
	    request.body = JSON.stringify(Object.assign(Object.assign({}, (transform.applyCondition ? { applyCondition: transform.applyCondition } : {})), ((_a = transform.params) !== null && _a !== void 0 ? _a : {})));
	    logger.info("[addTransform] Adding transform", transform);
	    const response = await httpClient.sendRequest(request);
	    const { status, bodyAsText } = response;
	    if (status < 200 || status > 299) {
	        logger.error("[addTransform] addTransform failed", response);
	        throw new RecorderError(`addTransform failed: ${bodyAsText}`, status);
	    }
	}

	async function setRecordingOptions(recorderUrl, httpClient, { handleRedirects }) {
	    const body = JSON.stringify({
	        HandleRedirects: handleRedirects,
	    });
	    const request = createPipelineRequest({
	        url: `${recorderUrl}${paths.admin}${paths.setRecordingOptions}`,
	        method: "POST",
	        body,
	        allowInsecureConnection: true,
	        headers: createHttpHeaders({
	            "Content-Type": "application/json",
	        }),
	    });
	    const response = await httpClient.sendRequest(request);
	    if (response.status < 200 || response.status > 299) {
	        throw new RecorderError(`setRecordingOptions failed: ${response.bodyAsText}`);
	    }
	}

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	const encodeBase64 = (data) => btoa(data);
	const decodeBase64 = (data) => atob(data);

	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.
	var _a;
	/**
	 * This client manages the recorder life cycle and interacts with the proxy-tool to do the recording,
	 * eventually save them in record mode and playing them back in playback mode.
	 *
	 * - Use the `configureClient` method to add recorder policy on your client.
	 *
	 * Other than configuring your clients, use `start`, `stop`, `addSanitizers` methods to use the recorder.
	 */
	class Recorder {
	    constructor(testContext) {
	        this.testContext = testContext;
	        this.stateManager = new RecordingStateManager();
	        logger.info(`[Recorder#constructor] Creating a recorder instance in ${getTestMode()} mode`);
	        if (isRecordMode() || isPlaybackMode()) {
	            if (this.testContext) {
	                this.sessionFile = sessionFilePath(this.testContext);
	                this.assetsJson = assetsJsonPath();
	                logger.info(`[Recorder#constructor] Using a session file located at ${this.sessionFile}`);
	                this.httpClient = createDefaultHttpClient();
	            }
	            else {
	                throw new Error("Unable to determine the recording file path, testContext provided is not defined.");
	            }
	        }
	        this.variables = {};
	    }
	    /**
	     * redirectRequest updates the request in record and playback modes to hit the proxy-tool with appropriate headers.
	     * recorderHttpPolicy calls this method on the request.
	     */
	    redirectRequest(request) {
	        const upstreamUrl = new URL(request.url);
	        const redirectedUrl = new URL(request.url);
	        const testProxyUrl = new URL(Recorder.url);
	        // Sometimes, due to the service returning a redirect or due to the retry policy, redirectRequest
	        // may be called multiple times. We only want to update the request the second time if the request's
	        // URL has been changed between calls (this may happen in the case of a redirect, but generally
	        // not in the case of a retry). Otherwise, we might accidentally update the X-Recording-Upstream-Base-Uri
	        // header to point to the test proxy instead of the true upstream.
	        const requestAlreadyRedirected = upstreamUrl.host === testProxyUrl.host &&
	            upstreamUrl.port === testProxyUrl.port &&
	            upstreamUrl.protocol === testProxyUrl.protocol;
	        if (requestAlreadyRedirected) {
	            logger.verbose(`[Recorder#redirectRequest] Determined that the request to ${request.url} has already been redirected, not attempting to redirect again.`, request);
	        }
	        else {
	            if (this.recordingId === undefined) {
	                logger.error("[Recorder#redirectRequest] Could not redirect request (recording ID not set)", request);
	                throw new RecorderError("Recording ID must be defined to redirect a request");
	            }
	            logger.info(`[Recorder#redirectRequest] Redirecting request to ${request.url} through the test proxy`, request);
	            request.headers.set("x-recording-id", this.recordingId);
	            request.headers.set("x-recording-mode", getTestMode());
	            redirectedUrl.host = testProxyUrl.host;
	            redirectedUrl.port = testProxyUrl.port;
	            redirectedUrl.protocol = testProxyUrl.protocol;
	            request.headers.set("x-recording-upstream-base-uri", upstreamUrl.origin);
	            request.url = redirectedUrl.toString();
	            request.allowInsecureConnection = true;
	        }
	    }
	    /**
	     * revertRequestChanges reverts the request in record and playback modes back to the existing url.
	     *
	     * Workflow:
	     *   - recorderHttpPolicy calls this method after the request is made
	     *   1. "redirectRequest" method is called to update the request with the proxy-tool url
	     *   2. Request hits the proxy tool, proxy-tool hits the service and returns the response
	     *   3. Using `revertRequestChanges`, we revert the request back to the original url
	     */
	    revertRequestChanges(request, originalUrl) {
	        logger.info(`[Recorder#revertRequestChanges] "undo"s the URL changes made by the recorder to hit the test proxy after the response is received,`, request);
	        const proxyHeaders = ["x-recording-id", "x-recording-mode"];
	        for (const headerName of proxyHeaders) {
	            request.headers.delete(headerName);
	        }
	        request.url = originalUrl;
	    }
	    /**
	     * addSanitizers adds the sanitizers for the current recording which will be applied on it before being saved.
	     *
	     * Takes SanitizerOptions as the input, passes on to the proxy-tool.
	     *
	     * By default, it applies only to record mode.
	     *
	     * If you want this to be applied in a specific mode or in a combination of modes, use the "mode" argument.
	     */
	    async addSanitizers(options, mode = ["record"]) {
	        if (isLiveMode())
	            return;
	        const actualTestMode = getTestMode();
	        if (mode.includes(actualTestMode) &&
	            ensureExistence(this.httpClient, "this.httpClient") &&
	            ensureExistence(this.recordingId, "this.recordingId")) {
	            return addSanitizers(this.httpClient, Recorder.url, this.recordingId, options);
	        }
	    }
	    /**
	     * addSessionSanitizers adds the sanitizers for all the following recordings which will be applied on it before being saved.
	     * This lets you call addSessionSanitizers once (e.g. in a global before() in your tests). The sanitizers will be applied
	     * to every subsequent test.
	     *
	     * Takes SanitizerOptions as the input, passes on to the proxy-tool.
	     *
	     * By default, it applies only to record mode.
	     *
	     * If you want this to be applied in a specific mode or in a combination of modes, use the "mode" argument.
	     */
	    static async addSessionSanitizers(options, mode = ["record"]) {
	        if (isLiveMode()) {
	            return;
	        }
	        const actualTestMode = getTestMode();
	        if (mode.includes(actualTestMode)) {
	            const httpClient = createDefaultHttpClient();
	            return addSanitizers(httpClient, Recorder.url, undefined, options);
	        }
	    }
	    async addTransform(transform) {
	        if (isPlaybackMode() &&
	            ensureExistence(this.httpClient, "this.httpClient") &&
	            ensureExistence(this.recordingId, "this.recordingId")) {
	            await addTransform(Recorder.url, this.httpClient, transform, this.recordingId);
	        }
	    }
	    /**
	     * Call this method to ping the proxy-tool with a start request
	     * signalling to start recording in the record mode
	     * or to start playing back in the playback mode.
	     *
	     * Takes RecorderStartOptions as the input, which will get used in record and playback modes.
	     * Includes
	     * - envSetupForPlayback - The key-value pairs will be used as the environment variables in playback mode. If the env variables are present in the recordings as plain strings, they will be replaced with the provided values.
	     * - sanitizerOptions - Generated recordings are updated by the "proxy-tool" based on the sanitizer options provided, these santizers are applied only in "record" mode.
	     */
	    async start(options) {
	        if (isLiveMode())
	            return;
	        logger.info(`[Recorder#start] Starting the recorder in ${getTestMode()} mode`);
	        this.stateManager.state = "started";
	        if (this.recordingId === undefined) {
	            const startUri = `${Recorder.url}${isPlaybackMode() ? paths.playback : paths.record}${paths.start}`;
	            const req = createRecordingRequest(startUri, this.sessionFile, this.recordingId, "POST", this.assetsJson);
	            if (ensureExistence(this.httpClient, "TestProxyHttpClient.httpClient")) {
	                logger.verbose("[Recorder#start] Setting redirect mode");
	                await setRecordingOptions(Recorder.url, this.httpClient, { handleRedirects: !isNode });
	                logger.verbose("[Recorder#start] Sending the start request to the test proxy");
	                let rsp = await this.httpClient.sendRequest(Object.assign(Object.assign({}, req), { allowInsecureConnection: true }));
	                // If the error is due to the assets.json not existing, try again without specifying an assets.json. This will
	                // occur with SDKs that have not migrated to asset sync yet.
	                // TODO: remove once everyone has migrated to asset sync
	                if (rsp.status === 400 && rsp.headers.get("x-request-known-exception") === "true") {
	                    const errorMessage = decodeBase64(rsp.headers.get("x-request-known-exception-error"));
	                    if (errorMessage.includes("The provided assets") &&
	                        errorMessage.includes("does not exist")) {
	                        logger.info("[Recorder#start] start request failed, trying again without assets.json specified");
	                        const retryRequest = createRecordingRequest(startUri, this.sessionFile, this.recordingId, "POST", undefined);
	                        rsp = await this.httpClient.sendRequest(Object.assign(Object.assign({}, retryRequest), { allowInsecureConnection: true }));
	                    }
	                }
	                if (rsp.status !== 200) {
	                    logger.error("[Recorder#start] Could not start the recorder", rsp);
	                    throw new RecorderError("Start request failed.");
	                }
	                const id = rsp.headers.get("x-recording-id");
	                if (!id) {
	                    logger.error("[Recorder#start] Test proxy did not provide a recording ID when starting the recorder");
	                    throw new RecorderError("No recording ID returned for a successful start request.");
	                }
	                this.recordingId = id;
	                if (isPlaybackMode()) {
	                    this.variables = rsp.bodyAsText ? JSON.parse(rsp.bodyAsText) : {};
	                }
	                await handleEnvSetup(this.httpClient, Recorder.url, this.recordingId, options.envSetupForPlayback);
	                // Sanitizers to be added only in record mode
	                if (isRecordMode() && options.sanitizerOptions) {
	                    // Makes a call to the proxy-tool to add the sanitizers for the current recording id
	                    // Recordings of the current test will be influenced by the sanitizers that are being added here
	                    logger.verbose("[Recorder#start] Adding sanitizers specified in the start options");
	                    await this.addSanitizers(options.sanitizerOptions);
	                }
	                logger.info("[Recorder#start] Recorder started successfully");
	            }
	        }
	    }
	    /**
	     * Call this method to ping the proxy-tool with a stop request, this helps saving the recording in record mode.
	     */
	    async stop() {
	        if (isLiveMode())
	            return;
	        this.stateManager.state = "stopped";
	        if (this.recordingId !== undefined) {
	            logger.info("[Recorder#stop] Stopping recording", this.recordingId);
	            const stopUri = `${Recorder.url}${isPlaybackMode() ? paths.playback : paths.record}${paths.stop}`;
	            const req = createRecordingRequest(stopUri, undefined, this.recordingId);
	            req.headers.set("x-recording-save", "true");
	            if (isRecordMode()) {
	                logger.verbose("[Recorder#stop] Adding recorder variables to the request body:", this.variables);
	                req.headers.set("Content-Type", "application/json");
	                req.body = JSON.stringify(this.variables);
	            }
	            if (ensureExistence(this.httpClient, "TestProxyHttpClient.httpClient")) {
	                const rsp = await this.httpClient.sendRequest(Object.assign(Object.assign({}, req), { allowInsecureConnection: true }));
	                if (rsp.status !== 200) {
	                    logger.error("[Recorder#stop] Stop request failed", rsp);
	                    throw new RecorderError("Stop request failed.");
	                }
	                logger.verbose("[Recorder#stop] Recorder stop request successful");
	            }
	        }
	        else {
	            logger.error("[Recorder#stop] Encountered invalid state: recordingId should have been defined when calling stop");
	            throw new RecorderError("Bad state, recordingId is not defined when called stop.");
	        }
	    }
	    /**
	     * Sets the matcher for the current recording to the matcher specified.
	     */
	    async setMatcher(matcher, options) {
	        if (isPlaybackMode()) {
	            if (!this.httpClient) {
	                throw new RecorderError("httpClient should be defined in playback mode");
	            }
	            await setMatcher(Recorder.url, this.httpClient, matcher, this.recordingId, options);
	        }
	    }
	    async transformsInfo() {
	        if (isLiveMode()) {
	            throw new RecorderError("Cannot call transformsInfo in live mode");
	        }
	        if (ensureExistence(this.httpClient, "this.httpClient")) {
	            return await transformsInfo(this.httpClient, Recorder.url, this.recordingId);
	        }
	        throw new RecorderError("Expected httpClient to be defined");
	    }
	    /**
	     * For core-v2 - libraries depending on core-rest-pipeline.
	     * This method adds the recording policy to the additionalPolicies in the client options.
	     *
	     * Helps in redirecting the requests to the proxy tool instead of directly going to the service.
	     *
	     * Note: Client Options must have "additionalPolicies" as part of the options.
	     */
	    configureClientOptions(options) {
	        if (isLiveMode())
	            return options;
	        if (!options.additionalPolicies)
	            options.additionalPolicies = [];
	        options.additionalPolicies.push({
	            policy: this.recorderHttpPolicy(),
	            position: "perRetry",
	        });
	        return options;
	    }
	    handleTestProxyErrors(response) {
	        var _a, _b;
	        if (response.headers.get("x-request-mismatch") === "true") {
	            const errorMessage = decodeBase64((_a = response.headers.get("x-request-mismatch-error")) !== null && _a !== void 0 ? _a : "");
	            logger.error("[Recorder#handleTestProxyErrors] Could not match request to recording", errorMessage);
	            throw new RecorderError(errorMessage);
	        }
	        if (response.headers.get("x-request-known-exception") === "true") {
	            const errorMessage = decodeBase64((_b = response.headers.get("x-request-known-exception-error")) !== null && _b !== void 0 ? _b : "");
	            logger.error("[Recorder#handleTestProxyErrors] Test proxy error encountered", errorMessage);
	            throw new RecorderError(errorMessage);
	        }
	    }
	    /**
	     * recorderHttpPolicy that can be added as a pipeline policy for any of the core-v2 SDKs(SDKs depending on core-rest-pipeline)
	     */
	    recorderHttpPolicy() {
	        return {
	            name: "recording policy",
	            sendRequest: async (request, next) => {
	                const originalUrl = request.url;
	                this.redirectRequest(request);
	                const response = await next(request);
	                this.handleTestProxyErrors(response);
	                this.revertRequestChanges(request, originalUrl);
	                return response;
	            },
	        };
	    }
	    variable(name, value = undefined) {
	        if (isPlaybackMode()) {
	            const recordedValue = this.variables[name];
	            if (recordedValue === undefined) {
	                logger.error(`[Recorder#variable] Test tried to access a variable in playback that was not set in the recording: ${name}`);
	                throw new RecorderError(`Tried to access a variable in playback that was not set in recording: ${name}`);
	            }
	            return recordedValue;
	        }
	        if (!this.variables[name]) {
	            if (value === undefined) {
	                logger.error(`[Recorder#variable] Test tried to access an unitialized variable: ${name}`);
	                throw new RecorderError(`Tried to access uninitialized variable: ${name}. You must initialize it with a value before using it.`);
	            }
	            this.variables[name] = value;
	        }
	        return this.variables[name];
	    }
	}
	Recorder.url = `http://localhost:${(_a = env.TEST_PROXY_HTTP_PORT) !== null && _a !== void 0 ? _a : 5000}`;

	// Copyright (c) Microsoft Corporation.
	/**
	 * Usage - `await delay(<milliseconds>)`
	 * This `delay` has no effect if the `TEST_MODE` is `"playback"`.
	 * If the `TEST_MODE` is not `"playback"`, `delay` is a wrapper for setTimeout that resolves a promise after t milliseconds.
	 *
	 * @param {number} milliseconds The number of milliseconds to be delayed.
	 */
	function delay(milliseconds) {
	    if (isPlaybackMode()) {
	        return;
	    }
	    return new Promise((resolve) => setTimeout(resolve, milliseconds));
	}

	// Copyright (c) Microsoft Corporation.

	"use strict";
	// Copyright (c) Microsoft Corporation.
	// Licensed under the MIT license.

	// Copyright (c) Microsoft Corporation.
	const envSetupForPlayback = {
	    ENDPOINT: "https://endpoint",
	    AZURE_CLIENT_ID: "azure_client_id",
	    AZURE_CLIENT_SECRET: "azure_client_secret",
	    AZURE_TENANT_ID: "88888888-8888-8888-8888-888888888888",
	    SUBSCRIPTION_ID: "azure_subscription_id",
	};
	const recorderEnvSetup = {
	    envSetupForPlayback,
	};
	/**
	 * creates the recorder and reads the environment variables from the `.env` file.
	 * Should be called first in the test suite to make sure environment variables are
	 * read before they are being used.
	 */
	async function createRecorder(context) {
	    const recorder = new Recorder(context.currentTest);
	    await recorder.start(recorderEnvSetup);
	    return recorder;
	}

	// Copyright (c) Microsoft Corporation.
	describe("My test", () => {
	    let recorder;
	    beforeEach(async function () {
	        recorder = await createRecorder(this);
	    });
	    afterEach(async function () {
	        await recorder.stop();
	    });
	    it("sample test", async function () {
	        assert.equal(1, 1);
	    });
	});

}));
//# sourceMappingURL=index.browser.js.map
