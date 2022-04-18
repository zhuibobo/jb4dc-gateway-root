/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Runtime/RuntimeGeneralInstance.js":
/*!***********************************************!*\
  !*** ./src/Runtime/RuntimeGeneralInstance.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ RuntimeGeneralInstance)
/* harmony export */ });
var RuntimeGeneralInstance = {
  TryGetMenuOuterId: function TryGetMenuOuterId() {
    return BaseUtility.GetUrlParaValue("menuOuterId");
  }
};


/***/ }),

/***/ "./src/Runtime/WebListRuntime/ListRuntime.js":
/*!***************************************************!*\
  !*** ./src/Runtime/WebListRuntime/ListRuntime.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ListRuntime)
/* harmony export */ });
var ListRuntime = {
  _Prop_Status: "Edit",
  _Prop_Config: {
    RendererToId: null,
    ListId: "",
    IsPreview: false
  },
  _ListPO: null,
  _$RendererToElem: null,
  _JSRuntimeInst: null,
  Initialization: function Initialization(_config) {
    this._Prop_Config = $.extend(true, {}, this._Prop_Config, _config);
    this._$RendererToElem = $("#" + this._Prop_Config.RendererToId);

    this._LoadHTMLToEl();
  },
  _RendererChainIsCompleted: true,
  _RendererDataChainIsCompleted: true,
  _LoadHTMLToEl: function _LoadHTMLToEl() {
    RuntimeGeneralInstance.LoadHtmlDesignContent(BaseUtility.GetRootPath() + "/Rest/Builder/RunTime/ListRuntime/LoadHTML?listId=" + this._Prop_Config.ListId, this._Prop_Config.RendererTo, {}, function (result) {
      console.log(result);

      var _self = this;

      _self._ListPO = result.data;

      this._$RendererToElem.append(result.data.listHtmlRuntime);

      this._JSRuntimeInst = Object.create(HTMLJSRuntime);

      this._JSRuntimeInst.Initialization({}, this._$RendererToElem, this._ListPO.listJsContent);

      VirtualBodyControl.RendererChain({
        po: result.data,
        sourceHTML: result.data.listHtmlRuntime,
        $rootElem: this._$RendererToElem,
        $parentControlElem: this._$RendererToElem,
        $singleControlElem: this._$RendererToElem,
        listRuntimeInstance: this
      });
      var RendererChainCompleteObj = window.setInterval(function () {
        if (_self._RendererChainIsCompleted) {
          window.clearInterval(RendererChainCompleteObj);
        }
      }, 500);
      var topDataSetId = result.data.listDatasetId;
      VirtualBodyControl.RendererDataChain({
        po: result.data,
        sourceHTML: result.data.listHtmlRuntime,
        $rootElem: this._$RendererToElem,
        $parentControlElem: this._$RendererToElem,
        $singleControlElem: this._$RendererToElem,
        topDataSetId: topDataSetId,
        listRuntimeInstance: this
      });
      var RendererDataChainCompleteObj = window.setInterval(function () {
        if (_self._RendererDataChainIsCompleted) {
          window.clearInterval(RendererDataChainCompleteObj);

          _self.CallRendererChainCompletedFunc();
        }
      }, 700);
    }, this);
  },
  CallRendererChainCompletedFunc: function CallRendererChainCompletedFunc() {
    if (typeof this._Prop_Config.RendererChainCompletedFunc == "function") {
      this._Prop_Config.RendererChainCompletedFunc.call(this);
    }

    HTMLPageObjectInstanceProxy.Init(this._Prop_Config, this._ListPO);
    window.setTimeout(function () {
      console.log("延迟调用");
      HTMLPageObjectInstanceProxy.CallPageReady();
    }, 500);
  },
  CheckPrimaryKeyInDataSet: function CheckPrimaryKeyInDataSet(dataSet, primaryKey) {
    if (dataSet.list && dataSet.list.length > 0) {
      var rowData = dataSet.list[0];

      for (var key in rowData) {
        if (StringUtility.toUpperCase(key) == StringUtility.toUpperCase(primaryKey)) {
          return true;
        }
      }
    }

    return false;
  },
  GetPrimaryKey: function GetPrimaryKey() {
    var primaryKey = this._ListPO.listDatasetPrimaryKey;
    return primaryKey;
  },
  IsPreview: function IsPreview() {
    return this._Prop_Config.IsPreview;
  }
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!************************************************************!*\
  !*** ./src/Runtime/WebListRuntime/UIRuntimeWebListMain.js ***!
  \************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ListRuntime_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ListRuntime.js */ "./src/Runtime/WebListRuntime/ListRuntime.js");
/* harmony import */ var _RuntimeGeneralInstance_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../RuntimeGeneralInstance.js */ "./src/Runtime/RuntimeGeneralInstance.js");


var ListRuntimeInst = Object.create(_ListRuntime_js__WEBPACK_IMPORTED_MODULE_0__["default"]);
var listId = _RuntimeGeneralInstance_js__WEBPACK_IMPORTED_MODULE_1__["default"].TryGetMenuOuterId();
ListRuntimeInst.Initialization({
  RendererToId: "htmlDesignRuntimeWrap",
  ListId: listId
});
})();

/******/ })()
;
//# sourceMappingURL=UIRuntimeWebListMain.js.map