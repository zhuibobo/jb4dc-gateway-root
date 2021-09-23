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
/******/ 	return __webpack_require__(__webpack_require__.s = "./DevPanel.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../node_modules/babel-loader/lib/index.js?!../node_modules/vue-loader/lib/index.js?!./VueComponent/dev-panel-app.vue?vue&type=script&lang=js&":
/*!*************************************************************************************************************************************************************!*\
  !*** ../node_modules/babel-loader/lib??ref--0!../node_modules/vue-loader/lib??vue-loader-options!./VueComponent/dev-panel-app.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Utility_WpsClientUtility_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Utility/WpsClientUtility.js */ \"./Utility/WpsClientUtility.js\");\n//\n//\n//\n//\n//\n//\n//\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  name: \"dev-panel-app\",\n  mounted: function mounted() {},\n  methods: {\n    openServerMockPage: function openServerMockPage() {\n      wps.OAAssist.ShellExecute(\"http://127.0.0.1:3889/WpsWordServer/dist/WpsWordServerDemoPage.html\");\n    },\n    sendMessageToServerPage: function sendMessageToServerPage() {\n      var currentTime = new Date();\n      var actionOption = _Utility_WpsClientUtility_js__WEBPACK_IMPORTED_MODULE_0__[\"WpsClientUtility\"].getActionOption();\n      var timeStr = currentTime.getHours() + ':' + currentTime.getMinutes() + \":\" + currentTime.getSeconds(); //let wpsClientAdditionActionOption=window.parent.getActionOptionToThisWindow();\n\n      console.log(actionOption);\n      wps.OAAssist.WebNotify(\"这行内容由wps加载项主动送达给业务系统，可以任意自定义, 比如时间值:\" + timeStr, true);\n    }\n  }\n});\n\n//# sourceURL=webpack:///./VueComponent/dev-panel-app.vue?../node_modules/babel-loader/lib??ref--0!../node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

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

/***/ "../node_modules/vue-loader/lib/loaders/templateLoader.js?!../node_modules/vue-loader/lib/index.js?!./VueComponent/dev-panel-app.vue?vue&type=template&id=33e13554&scoped=true&":
/*!*******************************************************************************************************************************************************************************************************************!*\
  !*** ../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../node_modules/vue-loader/lib??vue-loader-options!./VueComponent/dev-panel-app.vue?vue&type=template&id=33e13554&scoped=true& ***!
  \*******************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return staticRenderFns; });\nvar render = function() {\n  var _vm = this\n  var _h = _vm.$createElement\n  var _c = _vm._self._c || _h\n  return _c(\n    \"div\",\n    [\n      _c(\n        \"Button\",\n        { attrs: { type: \"primary\" }, on: { click: _vm.openServerMockPage } },\n        [_vm._v(\"打开服务端模拟页面\")]\n      ),\n      _vm._v(\" \"),\n      _c(\n        \"Button\",\n        {\n          attrs: { type: \"primary\" },\n          on: { click: _vm.sendMessageToServerPage }\n        },\n        [_vm._v(\"发送消息到服务端\")]\n      )\n    ],\n    1\n  )\n}\nvar staticRenderFns = []\nrender._withStripped = true\n\n\n\n//# sourceURL=webpack:///./VueComponent/dev-panel-app.vue?../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "../node_modules/vue-loader/lib/runtime/componentNormalizer.js":
/*!*********************************************************************!*\
  !*** ../node_modules/vue-loader/lib/runtime/componentNormalizer.js ***!
  \*********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return normalizeComponent; });\n/* globals __VUE_SSR_CONTEXT__ */\n\n// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).\n// This module is a runtime utility for cleaner component module output and will\n// be included in the final webpack user bundle.\n\nfunction normalizeComponent (\n  scriptExports,\n  render,\n  staticRenderFns,\n  functionalTemplate,\n  injectStyles,\n  scopeId,\n  moduleIdentifier, /* server only */\n  shadowMode /* vue-cli only */\n) {\n  // Vue.extend constructor export interop\n  var options = typeof scriptExports === 'function'\n    ? scriptExports.options\n    : scriptExports\n\n  // render functions\n  if (render) {\n    options.render = render\n    options.staticRenderFns = staticRenderFns\n    options._compiled = true\n  }\n\n  // functional template\n  if (functionalTemplate) {\n    options.functional = true\n  }\n\n  // scopedId\n  if (scopeId) {\n    options._scopeId = 'data-v-' + scopeId\n  }\n\n  var hook\n  if (moduleIdentifier) { // server build\n    hook = function (context) {\n      // 2.3 injection\n      context =\n        context || // cached call\n        (this.$vnode && this.$vnode.ssrContext) || // stateful\n        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional\n      // 2.2 with runInNewContext: true\n      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {\n        context = __VUE_SSR_CONTEXT__\n      }\n      // inject component styles\n      if (injectStyles) {\n        injectStyles.call(this, context)\n      }\n      // register component module identifier for async chunk inferrence\n      if (context && context._registeredComponents) {\n        context._registeredComponents.add(moduleIdentifier)\n      }\n    }\n    // used by ssr in case component is cached and beforeCreate\n    // never gets called\n    options._ssrRegister = hook\n  } else if (injectStyles) {\n    hook = shadowMode\n      ? function () {\n        injectStyles.call(\n          this,\n          (options.functional ? this.parent : this).$root.$options.shadowRoot\n        )\n      }\n      : injectStyles\n  }\n\n  if (hook) {\n    if (options.functional) {\n      // for template-only hot-reload because in that case the render fn doesn't\n      // go through the normalizer\n      options._injectStyles = hook\n      // register for functional component in vue file\n      var originalRender = options.render\n      options.render = function renderWithStyleInjection (h, context) {\n        hook.call(context)\n        return originalRender(h, context)\n      }\n    } else {\n      // inject component registration as beforeCreate hook\n      var existing = options.beforeCreate\n      options.beforeCreate = existing\n        ? [].concat(existing, hook)\n        : [hook]\n    }\n  }\n\n  return {\n    exports: scriptExports,\n    options: options\n  }\n}\n\n\n//# sourceURL=webpack:///../node_modules/vue-loader/lib/runtime/componentNormalizer.js?");

/***/ }),

/***/ "./DevPanel.js":
/*!*********************!*\
  !*** ./DevPanel.js ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Less_WpsWordClient_less__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Less/WpsWordClient.less */ \"./Less/WpsWordClient.less\");\n/* harmony import */ var _Less_WpsWordClient_less__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Less_WpsWordClient_less__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var Vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! Vue */ \"Vue\");\n/* harmony import */ var Vue__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(Vue__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _VueComponent_dev_panel_app_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./VueComponent/dev-panel-app.vue */ \"./VueComponent/dev-panel-app.vue\");\n\n\n //EditTable_SelectDefaultValue.Get_CompletedStatus_HtmlElem();\n\nnew Vue__WEBPACK_IMPORTED_MODULE_1___default.a({\n  el: '#appForm',\n  render: function render(h) {\n    return h(_VueComponent_dev_panel_app_vue__WEBPACK_IMPORTED_MODULE_2__[\"default\"]);\n  }\n});\n\n//# sourceURL=webpack:///./DevPanel.js?");

/***/ }),

/***/ "./Less/WpsWordClient.less":
/*!*********************************!*\
  !*** ./Less/WpsWordClient.less ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./Less/WpsWordClient.less?");

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

/***/ "./VueComponent/dev-panel-app.vue":
/*!****************************************!*\
  !*** ./VueComponent/dev-panel-app.vue ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _dev_panel_app_vue_vue_type_template_id_33e13554_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dev-panel-app.vue?vue&type=template&id=33e13554&scoped=true& */ \"./VueComponent/dev-panel-app.vue?vue&type=template&id=33e13554&scoped=true&\");\n/* harmony import */ var _dev_panel_app_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dev-panel-app.vue?vue&type=script&lang=js& */ \"./VueComponent/dev-panel-app.vue?vue&type=script&lang=js&\");\n/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ \"../node_modules/vue-loader/lib/runtime/componentNormalizer.js\");\n\n\n\n\n\n/* normalize component */\n\nvar component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(\n  _dev_panel_app_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  _dev_panel_app_vue_vue_type_template_id_33e13554_scoped_true___WEBPACK_IMPORTED_MODULE_0__[\"render\"],\n  _dev_panel_app_vue_vue_type_template_id_33e13554_scoped_true___WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"],\n  false,\n  null,\n  \"33e13554\",\n  null\n  \n)\n\n/* hot reload */\nif (false) { var api; }\ncomponent.options.__file = \"VueComponent/dev-panel-app.vue\"\n/* harmony default export */ __webpack_exports__[\"default\"] = (component.exports);\n\n//# sourceURL=webpack:///./VueComponent/dev-panel-app.vue?");

/***/ }),

/***/ "./VueComponent/dev-panel-app.vue?vue&type=script&lang=js&":
/*!*****************************************************************!*\
  !*** ./VueComponent/dev-panel-app.vue?vue&type=script&lang=js& ***!
  \*****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_0_node_modules_vue_loader_lib_index_js_vue_loader_options_dev_panel_app_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib??ref--0!../../node_modules/vue-loader/lib??vue-loader-options!./dev-panel-app.vue?vue&type=script&lang=js& */ \"../node_modules/babel-loader/lib/index.js?!../node_modules/vue-loader/lib/index.js?!./VueComponent/dev-panel-app.vue?vue&type=script&lang=js&\");\n/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__[\"default\"] = (_node_modules_babel_loader_lib_index_js_ref_0_node_modules_vue_loader_lib_index_js_vue_loader_options_dev_panel_app_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[\"default\"]); \n\n//# sourceURL=webpack:///./VueComponent/dev-panel-app.vue?");

/***/ }),

/***/ "./VueComponent/dev-panel-app.vue?vue&type=template&id=33e13554&scoped=true&":
/*!***********************************************************************************!*\
  !*** ./VueComponent/dev-panel-app.vue?vue&type=template&id=33e13554&scoped=true& ***!
  \***********************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_dev_panel_app_vue_vue_type_template_id_33e13554_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib??vue-loader-options!./dev-panel-app.vue?vue&type=template&id=33e13554&scoped=true& */ \"../node_modules/vue-loader/lib/loaders/templateLoader.js?!../node_modules/vue-loader/lib/index.js?!./VueComponent/dev-panel-app.vue?vue&type=template&id=33e13554&scoped=true&\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_dev_panel_app_vue_vue_type_template_id_33e13554_scoped_true___WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_dev_panel_app_vue_vue_type_template_id_33e13554_scoped_true___WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"]; });\n\n\n\n//# sourceURL=webpack:///./VueComponent/dev-panel-app.vue?");

/***/ }),

/***/ "Vue":
/*!**********************!*\
  !*** external "Vue" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = Vue;\n\n//# sourceURL=webpack:///external_%22Vue%22?");

/***/ })

/******/ });