import RemoteRestInterface from '../Remote/RemoteRestInterface.js';
import VirtualBodyControl from '../VirtualBodyControl.js';
import JSRuntime from '../JSRuntime.js';

let ListRuntime={
    _Prop_Status:"Edit",
    _Prop_Config:{
        RendererToId:null,
        ListId:"",
        IsPreview:false,
        WebListRuntimeInstanceName:"",
        RendererControlInstances:[],
        RendererChainCompletedFunc:null
    },
    _ListPO:null,
    _$RendererToElem:null,
    _JSRuntimeInst:null,
    Initialization:function (_config) {
        this._Prop_Config= $.extend(true,{},this._Prop_Config,_config);
        this._$RendererToElem=$("#"+this._Prop_Config.RendererToId);
        this._LoadHTMLToEl();
    },
    //用于控制RendererChainComplete的调用时间
    _RendererChainIsCompleted:false,
    _RendererDataChainIsCompleted:false,
    _LoadHTMLToEl:function () {
        RemoteRestInterface.loadWebListRuntimeHTML({listId:this._Prop_Config.ListId}).then((response)=> {
            //debugger;
            console.log(this._Prop_Config);
            let result = response.data;
            this._ListPO = result.data;
            this._$RendererToElem.append("<div class=\"uid-runtime-default-theme-root\">" + result.data.listHtmlRuntime + "</div>");
            this.pageRuntimeExtendObj = JSRuntime.ConvertJsContentToObject(this, this._ListPO.listJsContent);

            //this._JSRuntimeInst = Object.create(HTMLJSRuntime);
            //this._JSRuntimeInst.Initialization({},this._$RendererToElem,this._ListPO.listJsContent);

            //进行元素渲染1
            VirtualBodyControl.RendererChain({
                po: result.data,
                sourceHTML: result.data.listHtmlRuntime,
                $rootElem: this._$RendererToElem,
                $parentControlElem: this._$RendererToElem,
                $singleControlElem: this._$RendererToElem,
                listRuntimeInstance: this,
                pageRuntimeExtendObj: this.pageRuntimeExtendObj,
                WebListRuntimeInstanceName: this._Prop_Config.WebListRuntimeInstanceName
            });

            let RendererChainCompleteObj = window.setInterval(() => {
                if (this._RendererChainIsCompleted) {
                    window.clearInterval(RendererChainCompleteObj);
                }
            }, 500);

            //获取绑定的数据集合之后
            let topDataSetId = result.data.listDatasetId;
            VirtualBodyControl.RendererDataChain({
                po: result.data,
                sourceHTML: result.data.listHtmlRuntime,
                $rootElem: this._$RendererToElem,
                $parentControlElem: this._$RendererToElem,
                $singleControlElem: this._$RendererToElem,
                topDataSetId: topDataSetId,
                listRuntimeInstance: this,
                pageRuntimeExtendObj: this.pageRuntimeExtendObj,
                WebListRuntimeInstanceName: this._Prop_Config.WebListRuntimeInstanceName
            });

            let RendererDataChainCompleteObj = window.setInterval(() => {
                console.log(this._RendererDataChainIsCompleted);
                if (this._RendererDataChainIsCompleted) {
                    window.clearInterval(RendererDataChainCompleteObj);
                    this.CallRendererChainCompletedFunc();
                }
            }, 700);
        });
    },
    CallRendererChainCompletedFunc:function() {
        if (typeof (this._Prop_Config.RendererChainCompletedFunc) == "function") {
            this._Prop_Config.RendererChainCompletedFunc.call(this);
        }
        //HTMLPageObjectInstanceProxy.Init(this._Prop_Config,this._ListPO);
        window.setTimeout(function () {
            console.log("延迟调用");
            //HTMLPageObjectInstanceProxy.CallPageReady()
        },500);
    },
    CheckPrimaryKeyInDataSet:function(dataSet,primaryKey){
        if(dataSet.list&&dataSet.list.length>0){
            var rowData=dataSet.list[0];
            for(var key in rowData){
                if(StringUtility.toUpperCase(key)==StringUtility.toUpperCase(primaryKey)){
                    return true;
                }
            }
        }
        return false;
    },
    GetPrimaryKey:function(){
        var primaryKey=this._ListPO.listDatasetPrimaryKey;
        return primaryKey;
    },
    IsPreview:function () {
        return this._Prop_Config.IsPreview;
    },
    addRendererControlInstance:function (){

    }
}
export {ListRuntime as default};