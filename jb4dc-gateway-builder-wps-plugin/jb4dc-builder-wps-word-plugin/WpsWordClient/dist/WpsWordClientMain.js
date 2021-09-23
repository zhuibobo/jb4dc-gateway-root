/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./WpsWordClientMain.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../node_modules/decode-uri-component/index.js":
/*!*****************************************************!*\
  !*** ../node_modules/decode-uri-component/index.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar token = '%[a-f0-9]{2}';\nvar singleMatcher = new RegExp(token, 'gi');\nvar multiMatcher = new RegExp('(' + token + ')+', 'gi');\n\nfunction decodeComponents(components, split) {\n\ttry {\n\t\t// Try to decode the entire string first\n\t\treturn decodeURIComponent(components.join(''));\n\t} catch (err) {\n\t\t// Do nothing\n\t}\n\n\tif (components.length === 1) {\n\t\treturn components;\n\t}\n\n\tsplit = split || 1;\n\n\t// Split the array in 2 parts\n\tvar left = components.slice(0, split);\n\tvar right = components.slice(split);\n\n\treturn Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));\n}\n\nfunction decode(input) {\n\ttry {\n\t\treturn decodeURIComponent(input);\n\t} catch (err) {\n\t\tvar tokens = input.match(singleMatcher);\n\n\t\tfor (var i = 1; i < tokens.length; i++) {\n\t\t\tinput = decodeComponents(tokens, i).join('');\n\n\t\t\ttokens = input.match(singleMatcher);\n\t\t}\n\n\t\treturn input;\n\t}\n}\n\nfunction customDecodeURIComponent(input) {\n\t// Keep track of all the replacements and prefill the map with the `BOM`\n\tvar replaceMap = {\n\t\t'%FE%FF': '\\uFFFD\\uFFFD',\n\t\t'%FF%FE': '\\uFFFD\\uFFFD'\n\t};\n\n\tvar match = multiMatcher.exec(input);\n\twhile (match) {\n\t\ttry {\n\t\t\t// Decode as big chunks as possible\n\t\t\treplaceMap[match[0]] = decodeURIComponent(match[0]);\n\t\t} catch (err) {\n\t\t\tvar result = decode(match[0]);\n\n\t\t\tif (result !== match[0]) {\n\t\t\t\treplaceMap[match[0]] = result;\n\t\t\t}\n\t\t}\n\n\t\tmatch = multiMatcher.exec(input);\n\t}\n\n\t// Add `%C2` at the end of the map to make sure it does not replace the combinator before everything else\n\treplaceMap['%C2'] = '\\uFFFD';\n\n\tvar entries = Object.keys(replaceMap);\n\n\tfor (var i = 0; i < entries.length; i++) {\n\t\t// Replace all decoded components\n\t\tvar key = entries[i];\n\t\tinput = input.replace(new RegExp(key, 'g'), replaceMap[key]);\n\t}\n\n\treturn input;\n}\n\nmodule.exports = function (encodedURI) {\n\tif (typeof encodedURI !== 'string') {\n\t\tthrow new TypeError('Expected `encodedURI` to be of type `string`, got `' + typeof encodedURI + '`');\n\t}\n\n\ttry {\n\t\tencodedURI = encodedURI.replace(/\\+/g, ' ');\n\n\t\t// Try the built in decoder first\n\t\treturn decodeURIComponent(encodedURI);\n\t} catch (err) {\n\t\t// Fallback to a more advanced decoder\n\t\treturn customDecodeURIComponent(encodedURI);\n\t}\n};\n\n\n//# sourceURL=webpack:///../node_modules/decode-uri-component/index.js?");

/***/ }),

/***/ "../node_modules/filter-obj/index.js":
/*!*******************************************!*\
  !*** ../node_modules/filter-obj/index.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nmodule.exports = function (obj, predicate) {\n\tvar ret = {};\n\tvar keys = Object.keys(obj);\n\tvar isArr = Array.isArray(predicate);\n\n\tfor (var i = 0; i < keys.length; i++) {\n\t\tvar key = keys[i];\n\t\tvar val = obj[key];\n\n\t\tif (isArr ? predicate.indexOf(key) !== -1 : predicate(key, val, obj)) {\n\t\t\tret[key] = val;\n\t\t}\n\t}\n\n\treturn ret;\n};\n\n\n//# sourceURL=webpack:///../node_modules/filter-obj/index.js?");

/***/ }),

/***/ "../node_modules/query-string/index.js":
/*!*********************************************!*\
  !*** ../node_modules/query-string/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nconst strictUriEncode = __webpack_require__(/*! strict-uri-encode */ \"../node_modules/strict-uri-encode/index.js\");\nconst decodeComponent = __webpack_require__(/*! decode-uri-component */ \"../node_modules/decode-uri-component/index.js\");\nconst splitOnFirst = __webpack_require__(/*! split-on-first */ \"../node_modules/split-on-first/index.js\");\nconst filterObject = __webpack_require__(/*! filter-obj */ \"../node_modules/filter-obj/index.js\");\n\nconst isNullOrUndefined = value => value === null || value === undefined;\n\nfunction encoderForArrayFormat(options) {\n\tswitch (options.arrayFormat) {\n\t\tcase 'index':\n\t\t\treturn key => (result, value) => {\n\t\t\t\tconst index = result.length;\n\n\t\t\t\tif (\n\t\t\t\t\tvalue === undefined ||\n\t\t\t\t\t(options.skipNull && value === null) ||\n\t\t\t\t\t(options.skipEmptyString && value === '')\n\t\t\t\t) {\n\t\t\t\t\treturn result;\n\t\t\t\t}\n\n\t\t\t\tif (value === null) {\n\t\t\t\t\treturn [...result, [encode(key, options), '[', index, ']'].join('')];\n\t\t\t\t}\n\n\t\t\t\treturn [\n\t\t\t\t\t...result,\n\t\t\t\t\t[encode(key, options), '[', encode(index, options), ']=', encode(value, options)].join('')\n\t\t\t\t];\n\t\t\t};\n\n\t\tcase 'bracket':\n\t\t\treturn key => (result, value) => {\n\t\t\t\tif (\n\t\t\t\t\tvalue === undefined ||\n\t\t\t\t\t(options.skipNull && value === null) ||\n\t\t\t\t\t(options.skipEmptyString && value === '')\n\t\t\t\t) {\n\t\t\t\t\treturn result;\n\t\t\t\t}\n\n\t\t\t\tif (value === null) {\n\t\t\t\t\treturn [...result, [encode(key, options), '[]'].join('')];\n\t\t\t\t}\n\n\t\t\t\treturn [...result, [encode(key, options), '[]=', encode(value, options)].join('')];\n\t\t\t};\n\n\t\tcase 'comma':\n\t\tcase 'separator':\n\t\tcase 'bracket-separator': {\n\t\t\tconst keyValueSep = options.arrayFormat === 'bracket-separator' ?\n\t\t\t\t'[]=' :\n\t\t\t\t'=';\n\n\t\t\treturn key => (result, value) => {\n\t\t\t\tif (\n\t\t\t\t\tvalue === undefined ||\n\t\t\t\t\t(options.skipNull && value === null) ||\n\t\t\t\t\t(options.skipEmptyString && value === '')\n\t\t\t\t) {\n\t\t\t\t\treturn result;\n\t\t\t\t}\n\n\t\t\t\t// Translate null to an empty string so that it doesn't serialize as 'null'\n\t\t\t\tvalue = value === null ? '' : value;\n\n\t\t\t\tif (result.length === 0) {\n\t\t\t\t\treturn [[encode(key, options), keyValueSep, encode(value, options)].join('')];\n\t\t\t\t}\n\n\t\t\t\treturn [[result, encode(value, options)].join(options.arrayFormatSeparator)];\n\t\t\t};\n\t\t}\n\n\t\tdefault:\n\t\t\treturn key => (result, value) => {\n\t\t\t\tif (\n\t\t\t\t\tvalue === undefined ||\n\t\t\t\t\t(options.skipNull && value === null) ||\n\t\t\t\t\t(options.skipEmptyString && value === '')\n\t\t\t\t) {\n\t\t\t\t\treturn result;\n\t\t\t\t}\n\n\t\t\t\tif (value === null) {\n\t\t\t\t\treturn [...result, encode(key, options)];\n\t\t\t\t}\n\n\t\t\t\treturn [...result, [encode(key, options), '=', encode(value, options)].join('')];\n\t\t\t};\n\t}\n}\n\nfunction parserForArrayFormat(options) {\n\tlet result;\n\n\tswitch (options.arrayFormat) {\n\t\tcase 'index':\n\t\t\treturn (key, value, accumulator) => {\n\t\t\t\tresult = /\\[(\\d*)\\]$/.exec(key);\n\n\t\t\t\tkey = key.replace(/\\[\\d*\\]$/, '');\n\n\t\t\t\tif (!result) {\n\t\t\t\t\taccumulator[key] = value;\n\t\t\t\t\treturn;\n\t\t\t\t}\n\n\t\t\t\tif (accumulator[key] === undefined) {\n\t\t\t\t\taccumulator[key] = {};\n\t\t\t\t}\n\n\t\t\t\taccumulator[key][result[1]] = value;\n\t\t\t};\n\n\t\tcase 'bracket':\n\t\t\treturn (key, value, accumulator) => {\n\t\t\t\tresult = /(\\[\\])$/.exec(key);\n\t\t\t\tkey = key.replace(/\\[\\]$/, '');\n\n\t\t\t\tif (!result) {\n\t\t\t\t\taccumulator[key] = value;\n\t\t\t\t\treturn;\n\t\t\t\t}\n\n\t\t\t\tif (accumulator[key] === undefined) {\n\t\t\t\t\taccumulator[key] = [value];\n\t\t\t\t\treturn;\n\t\t\t\t}\n\n\t\t\t\taccumulator[key] = [].concat(accumulator[key], value);\n\t\t\t};\n\n\t\tcase 'comma':\n\t\tcase 'separator':\n\t\t\treturn (key, value, accumulator) => {\n\t\t\t\tconst isArray = typeof value === 'string' && value.includes(options.arrayFormatSeparator);\n\t\t\t\tconst isEncodedArray = (typeof value === 'string' && !isArray && decode(value, options).includes(options.arrayFormatSeparator));\n\t\t\t\tvalue = isEncodedArray ? decode(value, options) : value;\n\t\t\t\tconst newValue = isArray || isEncodedArray ? value.split(options.arrayFormatSeparator).map(item => decode(item, options)) : value === null ? value : decode(value, options);\n\t\t\t\taccumulator[key] = newValue;\n\t\t\t};\n\n\t\tcase 'bracket-separator':\n\t\t\treturn (key, value, accumulator) => {\n\t\t\t\tconst isArray = /(\\[\\])$/.test(key);\n\t\t\t\tkey = key.replace(/\\[\\]$/, '');\n\n\t\t\t\tif (!isArray) {\n\t\t\t\t\taccumulator[key] = value ? decode(value, options) : value;\n\t\t\t\t\treturn;\n\t\t\t\t}\n\n\t\t\t\tconst arrayValue = value === null ?\n\t\t\t\t\t[] :\n\t\t\t\t\tvalue.split(options.arrayFormatSeparator).map(item => decode(item, options));\n\n\t\t\t\tif (accumulator[key] === undefined) {\n\t\t\t\t\taccumulator[key] = arrayValue;\n\t\t\t\t\treturn;\n\t\t\t\t}\n\n\t\t\t\taccumulator[key] = [].concat(accumulator[key], arrayValue);\n\t\t\t};\n\n\t\tdefault:\n\t\t\treturn (key, value, accumulator) => {\n\t\t\t\tif (accumulator[key] === undefined) {\n\t\t\t\t\taccumulator[key] = value;\n\t\t\t\t\treturn;\n\t\t\t\t}\n\n\t\t\t\taccumulator[key] = [].concat(accumulator[key], value);\n\t\t\t};\n\t}\n}\n\nfunction validateArrayFormatSeparator(value) {\n\tif (typeof value !== 'string' || value.length !== 1) {\n\t\tthrow new TypeError('arrayFormatSeparator must be single character string');\n\t}\n}\n\nfunction encode(value, options) {\n\tif (options.encode) {\n\t\treturn options.strict ? strictUriEncode(value) : encodeURIComponent(value);\n\t}\n\n\treturn value;\n}\n\nfunction decode(value, options) {\n\tif (options.decode) {\n\t\treturn decodeComponent(value);\n\t}\n\n\treturn value;\n}\n\nfunction keysSorter(input) {\n\tif (Array.isArray(input)) {\n\t\treturn input.sort();\n\t}\n\n\tif (typeof input === 'object') {\n\t\treturn keysSorter(Object.keys(input))\n\t\t\t.sort((a, b) => Number(a) - Number(b))\n\t\t\t.map(key => input[key]);\n\t}\n\n\treturn input;\n}\n\nfunction removeHash(input) {\n\tconst hashStart = input.indexOf('#');\n\tif (hashStart !== -1) {\n\t\tinput = input.slice(0, hashStart);\n\t}\n\n\treturn input;\n}\n\nfunction getHash(url) {\n\tlet hash = '';\n\tconst hashStart = url.indexOf('#');\n\tif (hashStart !== -1) {\n\t\thash = url.slice(hashStart);\n\t}\n\n\treturn hash;\n}\n\nfunction extract(input) {\n\tinput = removeHash(input);\n\tconst queryStart = input.indexOf('?');\n\tif (queryStart === -1) {\n\t\treturn '';\n\t}\n\n\treturn input.slice(queryStart + 1);\n}\n\nfunction parseValue(value, options) {\n\tif (options.parseNumbers && !Number.isNaN(Number(value)) && (typeof value === 'string' && value.trim() !== '')) {\n\t\tvalue = Number(value);\n\t} else if (options.parseBooleans && value !== null && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {\n\t\tvalue = value.toLowerCase() === 'true';\n\t}\n\n\treturn value;\n}\n\nfunction parse(query, options) {\n\toptions = Object.assign({\n\t\tdecode: true,\n\t\tsort: true,\n\t\tarrayFormat: 'none',\n\t\tarrayFormatSeparator: ',',\n\t\tparseNumbers: false,\n\t\tparseBooleans: false\n\t}, options);\n\n\tvalidateArrayFormatSeparator(options.arrayFormatSeparator);\n\n\tconst formatter = parserForArrayFormat(options);\n\n\t// Create an object with no prototype\n\tconst ret = Object.create(null);\n\n\tif (typeof query !== 'string') {\n\t\treturn ret;\n\t}\n\n\tquery = query.trim().replace(/^[?#&]/, '');\n\n\tif (!query) {\n\t\treturn ret;\n\t}\n\n\tfor (const param of query.split('&')) {\n\t\tif (param === '') {\n\t\t\tcontinue;\n\t\t}\n\n\t\tlet [key, value] = splitOnFirst(options.decode ? param.replace(/\\+/g, ' ') : param, '=');\n\n\t\t// Missing `=` should be `null`:\n\t\t// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters\n\t\tvalue = value === undefined ? null : ['comma', 'separator', 'bracket-separator'].includes(options.arrayFormat) ? value : decode(value, options);\n\t\tformatter(decode(key, options), value, ret);\n\t}\n\n\tfor (const key of Object.keys(ret)) {\n\t\tconst value = ret[key];\n\t\tif (typeof value === 'object' && value !== null) {\n\t\t\tfor (const k of Object.keys(value)) {\n\t\t\t\tvalue[k] = parseValue(value[k], options);\n\t\t\t}\n\t\t} else {\n\t\t\tret[key] = parseValue(value, options);\n\t\t}\n\t}\n\n\tif (options.sort === false) {\n\t\treturn ret;\n\t}\n\n\treturn (options.sort === true ? Object.keys(ret).sort() : Object.keys(ret).sort(options.sort)).reduce((result, key) => {\n\t\tconst value = ret[key];\n\t\tif (Boolean(value) && typeof value === 'object' && !Array.isArray(value)) {\n\t\t\t// Sort object keys, not values\n\t\t\tresult[key] = keysSorter(value);\n\t\t} else {\n\t\t\tresult[key] = value;\n\t\t}\n\n\t\treturn result;\n\t}, Object.create(null));\n}\n\nexports.extract = extract;\nexports.parse = parse;\n\nexports.stringify = (object, options) => {\n\tif (!object) {\n\t\treturn '';\n\t}\n\n\toptions = Object.assign({\n\t\tencode: true,\n\t\tstrict: true,\n\t\tarrayFormat: 'none',\n\t\tarrayFormatSeparator: ','\n\t}, options);\n\n\tvalidateArrayFormatSeparator(options.arrayFormatSeparator);\n\n\tconst shouldFilter = key => (\n\t\t(options.skipNull && isNullOrUndefined(object[key])) ||\n\t\t(options.skipEmptyString && object[key] === '')\n\t);\n\n\tconst formatter = encoderForArrayFormat(options);\n\n\tconst objectCopy = {};\n\n\tfor (const key of Object.keys(object)) {\n\t\tif (!shouldFilter(key)) {\n\t\t\tobjectCopy[key] = object[key];\n\t\t}\n\t}\n\n\tconst keys = Object.keys(objectCopy);\n\n\tif (options.sort !== false) {\n\t\tkeys.sort(options.sort);\n\t}\n\n\treturn keys.map(key => {\n\t\tconst value = object[key];\n\n\t\tif (value === undefined) {\n\t\t\treturn '';\n\t\t}\n\n\t\tif (value === null) {\n\t\t\treturn encode(key, options);\n\t\t}\n\n\t\tif (Array.isArray(value)) {\n\t\t\tif (value.length === 0 && options.arrayFormat === 'bracket-separator') {\n\t\t\t\treturn encode(key, options) + '[]';\n\t\t\t}\n\n\t\t\treturn value\n\t\t\t\t.reduce(formatter(key), [])\n\t\t\t\t.join('&');\n\t\t}\n\n\t\treturn encode(key, options) + '=' + encode(value, options);\n\t}).filter(x => x.length > 0).join('&');\n};\n\nexports.parseUrl = (url, options) => {\n\toptions = Object.assign({\n\t\tdecode: true\n\t}, options);\n\n\tconst [url_, hash] = splitOnFirst(url, '#');\n\n\treturn Object.assign(\n\t\t{\n\t\t\turl: url_.split('?')[0] || '',\n\t\t\tquery: parse(extract(url), options)\n\t\t},\n\t\toptions && options.parseFragmentIdentifier && hash ? {fragmentIdentifier: decode(hash, options)} : {}\n\t);\n};\n\nexports.stringifyUrl = (object, options) => {\n\toptions = Object.assign({\n\t\tencode: true,\n\t\tstrict: true\n\t}, options);\n\n\tconst url = removeHash(object.url).split('?')[0] || '';\n\tconst queryFromUrl = exports.extract(object.url);\n\tconst parsedQueryFromUrl = exports.parse(queryFromUrl, {sort: false});\n\n\tconst query = Object.assign(parsedQueryFromUrl, object.query);\n\tlet queryString = exports.stringify(query, options);\n\tif (queryString) {\n\t\tqueryString = `?${queryString}`;\n\t}\n\n\tlet hash = getHash(object.url);\n\tif (object.fragmentIdentifier) {\n\t\thash = `#${encode(object.fragmentIdentifier, options)}`;\n\t}\n\n\treturn `${url}${queryString}${hash}`;\n};\n\nexports.pick = (input, filter, options) => {\n\toptions = Object.assign({\n\t\tparseFragmentIdentifier: true\n\t}, options);\n\n\tconst {url, query, fragmentIdentifier} = exports.parseUrl(input, options);\n\treturn exports.stringifyUrl({\n\t\turl,\n\t\tquery: filterObject(query, filter),\n\t\tfragmentIdentifier\n\t}, options);\n};\n\nexports.exclude = (input, filter, options) => {\n\tconst exclusionFilter = Array.isArray(filter) ? key => !filter.includes(key) : (key, value) => !filter(key, value);\n\n\treturn exports.pick(input, exclusionFilter, options);\n};\n\n\n//# sourceURL=webpack:///../node_modules/query-string/index.js?");

/***/ }),

/***/ "../node_modules/split-on-first/index.js":
/*!***********************************************!*\
  !*** ../node_modules/split-on-first/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nmodule.exports = (string, separator) => {\n\tif (!(typeof string === 'string' && typeof separator === 'string')) {\n\t\tthrow new TypeError('Expected the arguments to be of type `string`');\n\t}\n\n\tif (separator === '') {\n\t\treturn [string];\n\t}\n\n\tconst separatorIndex = string.indexOf(separator);\n\n\tif (separatorIndex === -1) {\n\t\treturn [string];\n\t}\n\n\treturn [\n\t\tstring.slice(0, separatorIndex),\n\t\tstring.slice(separatorIndex + separator.length)\n\t];\n};\n\n\n//# sourceURL=webpack:///../node_modules/split-on-first/index.js?");

/***/ }),

/***/ "../node_modules/strict-uri-encode/index.js":
/*!**************************************************!*\
  !*** ../node_modules/strict-uri-encode/index.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nmodule.exports = str => encodeURIComponent(str).replace(/[!'()*]/g, x => `%${x.charCodeAt(0).toString(16).toUpperCase()}`);\n\n\n//# sourceURL=webpack:///../node_modules/strict-uri-encode/index.js?");

/***/ }),

/***/ "./Utility/WpsClientUtility.js":
/*!*************************************!*\
  !*** ./Utility/WpsClientUtility.js ***!
  \*************************************/
/*! exports provided: WpsClientUtility */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"WpsClientUtility\", function() { return WpsClientUtility; });\n/* harmony import */ var query_string__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! query-string */ \"../node_modules/query-string/index.js\");\n/* harmony import */ var query_string__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(query_string__WEBPACK_IMPORTED_MODULE_0__);\n\nvar WpsClientUtility = {\n  getActionOption: function getActionOption() {\n    /*let urlParas=queryString.parse(location.search);\r\n    return JSON.parse(urlParas.actionOptionUrl);*/\n    var wpsDocObjectInstance = wps.WpsApplication().ActiveDocument;\n    var currentRsid = wpsDocObjectInstance.CurrentRsid;\n    var actionOptionString = localStorage.getItem(\"actionOption_\" + currentRsid);\n    return JSON.parse(actionOptionString);\n  },\n  isJb4dcDocument: function isJb4dcDocument() {\n    console.log(\"2\");\n    var wpsDocObjectInstance = wps.WpsApplication().ActiveDocument;\n\n    if (wpsDocObjectInstance) {\n      var currentRsid = wpsDocObjectInstance.CurrentRsid;\n      var isJb4dcDocumentVar = localStorage.getItem(\"isJb4dcDocument_\" + currentRsid);\n\n      if (isJb4dcDocumentVar) {\n        return true;\n      }\n    }\n\n    return false;\n  },\n\n  /**\r\n   * 上传一个文件到远程服务器\r\n   * @param name 上传后的文件名称\r\n   * @param path 文件绝对路径\r\n   * @param url 上传地址\r\n   * @param field 请求中name的值\r\n   * @param onSuccess 下载成功的回调函数\r\n   * @param onFail 下载失败的回调函数\r\n   */\n  uploadFile: function uploadFile(doc, onSuccess, onFail) {\n    console.log(doc);\n    var openDialog = wps.WpsApplication().Dialogs.Item(wps.Enum.wdDialogInsertFile);\n    var dlgAnswer = openDialog.Show();\n    console.log(dlgAnswer);\n    console.log(openDialog);\n    doc.SaveAsUrl(doc.Name, \"http://127.0.0.1:9104/JB4DCBuilder/Rest/Builder/File/UploadCKE4Image\", \"1.doc\");\n    /*wps.OAAssist.UploadFile(doc.Name, \"C:\\\\22.aip\", \"http://127.0.0.1:9104/JB4DCBuilder/Rest/Builder/File/UploadCKE4Image*\", \"123\", (result)=>{\r\n      }, ()=>{\r\n      });*/\n  }\n};\n\n\n//# sourceURL=webpack:///./Utility/WpsClientUtility.js?");

/***/ }),

/***/ "./WpsWordClientMain.js":
/*!******************************!*\
  !*** ./WpsWordClientMain.js ***!
  \******************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Utility_WpsClientUtility__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utility/WpsClientUtility */ \"./Utility/WpsClientUtility.js\");\nfunction _typeof(obj) { \"@babel/helpers - typeof\"; if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\n\n\nfunction getCallResult(provideForServerCallInvokeParam, success, message, code, data) {\n  provideForServerCallInvokeParam.success = success;\n  provideForServerCallInvokeParam.message = message;\n  provideForServerCallInvokeParam.code = code;\n  provideForServerCallInvokeParam.data = data;\n  return provideForServerCallInvokeParam;\n}\n\nfunction getUrlPath() {\n  var e = document.location.toString();\n  return -1 != (e = decodeURI(e)).indexOf(\"/\") && (e = e.substring(0, e.lastIndexOf(\"/\"))), e;\n}\n\nfunction getImage(control) {\n  var eleId = control.Id;\n\n  switch (eleId) {\n    case \"btnSaveToServer\":\n      return \"WpsWordClient/dist/Images/upload.svg\";\n\n    case \"btnShowDialog\":\n      return \"WpsWordClient/dist/Images/computer.svg\";\n\n    case \"btnShowDevPanel\":\n      return \"WpsWordClient/dist/Images/computer.svg\";\n\n    case \"btnDialogOpenClientFile\":\n      return \"WpsWordClient/dist/Images/open.svg\";\n\n    case \"btnDialogInsertFile\":\n      return \"WpsWordClient/dist/Images/insert.svg\";\n\n    default:\n      ;\n  }\n\n  return \"WpsWordClient/dist/Images/computer.svg\";\n}\n\nfunction onGetVisible(control) {\n  console.log(control);\n  return _Utility_WpsClientUtility__WEBPACK_IMPORTED_MODULE_0__[\"WpsClientUtility\"].isJb4dcDocument(); //return false;\n}\n\nfunction onWPSWorkTabLoad(ribbonUI) {\n  //wps.alert(\"onWPSWorkTabLoad\");\n  if (_typeof(wps.ribbonUI) != \"object\") {\n    wps.ribbonUI = ribbonUI;\n  } //if (typeof (wps.Enum) != \"object\") { // 如果没有内置枚举值\n  //    wps.Enum = WPS_Enum\n  //}\n  //wps.PluginStorage.setItem(\"EnableFlag\", false) //往PluginStorage中设置一个标记，用于控制两个按钮的置灰\n  //wps.PluginStorage.setItem(\"ApiEventFlag\", false) //往PluginStorage中设置一个标记，用于控制ApiEvent的按钮label\n\n\n  addDocumentEventListener(); //setTimeout(function (){\n  //    wps.alert(\"onWPSWorkTabLoad\");\n  //}, 4000); // 激活页面必须要页签显示出来，所以做1秒延迟\n\n  return true;\n} //挂载WPS的文档事件\n\n\nfunction addDocumentEventListener() {\n  wps.ApiEvent.AddApiEventListener(\"WindowActivate\", onWindowActivateListener); //wps.ApiEvent.AddApiEventListener(\"DocumentBeforeSave\", OnDocumentBeforeSave);\n  //wps.ApiEvent.AddApiEventListener(\"DocumentBeforeClose\", OnDocumentBeforeClose);\n  //wps.ApiEvent.AddApiEventListener(\"DocumentAfterClose\", OnDocumentAfterClose);\n  //wps.ApiEvent.AddApiEventListener(\"DocumentBeforePrint\", OnDocumentBeforePrint);\n  //wps.ApiEvent.AddApiEventListener(\"DocumentOpen\", OnDocumentOpen);\n  //wps.ApiEvent.AddApiEventListener(\"DocumentNew\", OnDocumentNew);\n\n  console.log(\"AddDocumentEvent\");\n} //切换窗口时触发的事件\n\n\nfunction onWindowActivateListener() {\n  var l_doc = wps.WpsApplication().ActiveDocument; //SetCurrDocEnvProp(l_doc); // 设置当前文档对应的用户名\n\n  wps.ribbonUI.Invalidate();\n  setTimeout(function () {// 根据文件是否为OA文件来显示OA菜单再进行刷新按钮\n  }, 4000); // 激活页面必须要页签显示出来，所以做1秒延迟\n\n  return;\n}\n/*function onGetEnabled(control) {\r\n    const eleId = control.Id\r\n    switch (eleId) {\r\n        case \"btnShowMsg\":\r\n            return true\r\n            break\r\n        case \"btnShowDialog\":\r\n        {\r\n            let bFlag = wps.PluginStorage.getItem(\"EnableFlag\")\r\n            return bFlag\r\n            break\r\n        }\r\n        case \"btnShowTaskPane\":\r\n        {\r\n            let bFlag = wps.PluginStorage.getItem(\"EnableFlag\")\r\n            return bFlag\r\n            break\r\n        }\r\n        default:\r\n            break\r\n    }\r\n    return true\r\n}\r\n\r\nfunction onGetVisible(control){\r\n    return true\r\n}\r\n\r\nfunction onGetLabel(control){\r\n    const eleId = control.Id\r\n    switch (eleId) {\r\n        case \"btnIsEnbable\":\r\n        {\r\n            let bFlag = wps.PluginStorage.getItem(\"EnableFlag\")\r\n            return bFlag ?  \"按钮Disable\" : \"按钮Enable\"\r\n            break\r\n        }\r\n        case \"btnApiEvent\":\r\n        {\r\n            let bFlag = wps.PluginStorage.getItem(\"ApiEventFlag\")\r\n            return bFlag ? \"清除新建文件事件\" : \"注册新建文件事件\"\r\n            break\r\n        }\r\n    }\r\n    return \"\"\r\n}\r\n\r\nfunction onNewDocumentApiEvent(doc){\r\n    alert(\"新建文件事件响应，取文件名: \" + doc.Name)\r\n}\r\n\r\nfunction onAddinLoad(ribbonUI){\r\n    if (typeof (wps.ribbonUI) != \"object\"){\r\n        wps.ribbonUI = ribbonUI\r\n    }\r\n\r\n    if (typeof (wps.Enum) != \"object\") { // 如果没有内置枚举值\r\n        wps.Enum = WPS_Enum\r\n    }\r\n\r\n    wps.PluginStorage.setItem(\"EnableFlag\", false) //往PluginStorage中设置一个标记，用于控制两个按钮的置灰\r\n    wps.PluginStorage.setItem(\"ApiEventFlag\", false) //往PluginStorage中设置一个标记，用于控制ApiEvent的按钮label\r\n    return true\r\n}*/\n\n\nfunction onAction(control) {\n  var eleId = control.Id; //var actionOptionUrl =encodeURIComponent(JSON.stringify(getActionOptionWithThisWindow()));\n\n  switch (eleId) {\n    case \"btnDialogOpenClientFile\":\n      {\n        var oldDocument = wps.WpsApplication().ActiveDocument;\n        console.log(oldDocument);\n        var openDialog = wps.WpsApplication().Dialogs.Item(wps.Enum.wdDialogFileOpen);\n        var dlgAnswer = openDialog.Show();\n\n        if (dlgAnswer == -1) {\n          //传递参数\n          var actionOption = _Utility_WpsClientUtility__WEBPACK_IMPORTED_MODULE_0__[\"WpsClientUtility\"].getActionOption();\n          var newDocument = wps.WpsApplication().ActiveDocument;\n          setActionOptionToLocalStorage(newDocument.CurrentRsid, actionOption);\n          oldDocument.Close();\n          console.log(newDocument);\n        }\n      }\n      break;\n\n    case \"btnDialogInsertFile\":\n      {\n        //let oldDocument=wps.WpsApplication().ActiveDocument;\n        //console.log(oldDocument);\n        var _openDialog = wps.WpsApplication().Dialogs.Item(wps.Enum.wdDialogInsertField);\n\n        var _dlgAnswer = _openDialog.Show();\n      }\n      break;\n\n    case \"btnSaveToServer\":\n      {\n        var doc = wps.WpsApplication().ActiveDocument;\n\n        if (!doc) {\n          alert(\"当前没有打开任何文档\");\n          return;\n        }\n\n        _Utility_WpsClientUtility__WEBPACK_IMPORTED_MODULE_0__[\"WpsClientUtility\"].uploadFile(doc); //alert(doc.Name)\n      }\n      break;\n\n    case \"btnShowDialog\":\n      {\n        wps.ShowDialog(getUrlPath() + \"/WpsWordClient/dist/DevPanel.html\", \"JBuildWordPlugin\", 400 * window.devicePixelRatio, 400 * window.devicePixelRatio, false);\n      }\n      break;\n\n    case \"btnShowDevPanel\":\n      {\n        var tsId = wps.PluginStorage.getItem(\"taskpane_id\");\n\n        if (!tsId) {\n          var tskpane = wps.CreateTaskPane(getUrlPath() + \"/WpsWordClient/dist/DevPanel.html\");\n          var id = tskpane.ID;\n          wps.PluginStorage.setItem(\"taskpane_id\", id);\n          tskpane.Visible = true;\n        } else {\n          var _tskpane = wps.GetTaskPane(tsId);\n\n          _tskpane.Visible = !_tskpane.Visible;\n        }\n      }\n      break;\n\n    default:\n      break;\n  }\n\n  return true;\n}\n\nfunction setActionOptionToLocalStorage(currentRsid, actionOption) {\n  //window.WpsClientAdditionActionOption = actionOption;\n  localStorage.setItem(\"actionOption_\" + currentRsid, JSON.stringify(actionOption));\n  localStorage.setItem(\"isJb4dcDocument_\" + currentRsid, \"true\");\n}\n\nfunction provideForServerCall(param) {\n  var jsonObj = typeof param == 'string' ? JSON.parse(param) : param;\n  var action = jsonObj.action;\n  var actionOption = jsonObj.actionOption;\n  var wpsDocObjectInstance = null;\n\n  switch (action) {\n    case \"getDocumentName\":\n      {\n        if (wps.WpsApplication().ActiveDocument) {\n          wpsDocObjectInstance = wps.WpsApplication().ActiveDocument;\n        }\n      }\n      break;\n\n    case \"newDocument\":\n      {\n        var _wpsDocObjectInstance = wps.WpsApplication().Documents.Add();\n      }\n      break;\n\n    case \"openSmallSizeDocument\":\n      {\n        var fileUrl = actionOption.fileUrl;\n        wps.WpsApplication().Documents.OpenFromUrl(fileUrl);\n        wpsDocObjectInstance = wps.WpsApplication().ActiveDocument;\n      }\n      break;\n\n    case \"openBigSizeDocument\":\n      {\n        var _fileUrl = actionOption.fileUrl;\n        wps.WpsApplication().Documents.OpenFromUrl(_fileUrl);\n        wpsDocObjectInstance = wps.WpsApplication().ActiveDocument;\n      }\n      break;\n  } //return;\n\n\n  if (wpsDocObjectInstance) {\n    var resultData = {\n      Name: wpsDocObjectInstance.Name,\n      DocID: wpsDocObjectInstance.DocID,\n      CurrentRsid: wpsDocObjectInstance.CurrentRsid\n    };\n    console.log(\"1\");\n    setActionOptionToLocalStorage(wpsDocObjectInstance.CurrentRsid, actionOption);\n    return getCallResult(param, true, \"操作成功!\", \"00000\", resultData);\n  }\n\n  return getCallResult(param, false, \"操作失败!\", \"10000\", {});\n}\n\nwindow.getImage = getImage; //window.onGetEnabled=onGetEnabled;\n\nwindow.onGetVisible = onGetVisible; //window.onGetLabel=onGetLabel;\n//window.onNewDocumentApiEvent=onNewDocumentApiEvent;\n\nwindow.onWPSWorkTabLoad = onWPSWorkTabLoad;\nwindow.onAction = onAction;\nwindow.provideForServerCall = provideForServerCall;\n\n//# sourceURL=webpack:///./WpsWordClientMain.js?");

/***/ })

/******/ });