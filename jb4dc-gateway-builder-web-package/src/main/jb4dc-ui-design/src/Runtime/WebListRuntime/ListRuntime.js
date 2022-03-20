let ListRuntime = {
    _Prop_Status: "Edit",
    _Prop_Config: {
        RendererToId: null,
        ListId: "",
        IsPreview: false
    },
    _ListPO: null,
    _$RendererToElem: null,
    _JSRuntimeInst: null,
    Initialization: function (_config) {
        this._Prop_Config = $.extend(true, {}, this._Prop_Config, _config);
        this._$RendererToElem = $("#" + this._Prop_Config.RendererToId);
        this._LoadHTMLToEl();
    },
    //用于控制RendererChainComplete的调用时间
    _RendererChainIsCompleted: true,
    _RendererDataChainIsCompleted: true,
    _LoadHTMLToEl: function () {
        RuntimeGeneralInstance.LoadHtmlDesignContent(BaseUtility.GetRootPath() + "/Rest/Builder/RunTime/ListRuntime/LoadHTML?listId=" + this._Prop_Config.ListId, this._Prop_Config.RendererTo, {}, function (result) {
            console.log(result);
            var _self = this;
            _self._ListPO = result.data;
            this._$RendererToElem.append(result.data.listHtmlRuntime);
            //this._$RendererToElem.append(result.data.listJsRuntime);
            this._JSRuntimeInst = Object.create(HTMLJSRuntime);
            this._JSRuntimeInst.Initialization({}, this._$RendererToElem, this._ListPO.listJsContent);
            //console.log(result.data.listJsRuntime);

            //进行元素渲染1
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

            //获取绑定的数据集合之后
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
    CallRendererChainCompletedFunc: function () {
        if (typeof (this._Prop_Config.RendererChainCompletedFunc) == "function") {
            this._Prop_Config.RendererChainCompletedFunc.call(this);
        }
        HTMLPageObjectInstanceProxy.Init(this._Prop_Config, this._ListPO);
        window.setTimeout(function () {
            console.log("延迟调用");
            HTMLPageObjectInstanceProxy.CallPageReady()
        }, 500);
    },
    CheckPrimaryKeyInDataSet: function (dataSet, primaryKey) {
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
    GetPrimaryKey: function () {
        var primaryKey = this._ListPO.listDatasetPrimaryKey;
        return primaryKey;
    },
    IsPreview: function () {
        return this._Prop_Config.IsPreview;
    }
}

export {ListRuntime as default};