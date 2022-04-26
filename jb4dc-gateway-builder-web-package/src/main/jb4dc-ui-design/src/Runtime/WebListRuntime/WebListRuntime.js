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
        RendererChainCompletedFunc:null,
        RendererDataChainCompletedFunc:null
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
    //_RendererChainIsCompleted:false,
    //_RendererDataChainIsCompleted:false,
    _LoadHTMLToEl:function () {
        RemoteRestInterface.loadWebListRuntimeHTML({listId: this._Prop_Config.ListId}).then((response) => {
            //debugger;
            console.log(this._Prop_Config);
            let result = response.data;
            this._ListPO = result.data;
            this._$RendererToElem.append("<div class=\"uid-runtime-default-theme-root\">" + result.data.listHtmlRuntime + "</div>");
            this.pageRuntimeExtendObj = JSRuntime.ConvertJsContentToObject(this, this._ListPO.listJsRuntime);

            this.pageRuntimeExtendObj.data.runtimeRootHostInstance = this;
            this.pageRuntimeExtendObj.pageReady();

            //进行元素渲染1
            VirtualBodyControl.RendererChain({
                po: result.data,
                sourceHTML: result.data.listHtmlRuntime,
                $rootElem: this._$RendererToElem,
                $parentControlElem: this._$RendererToElem,
                $singleControlElem: this._$RendererToElem,
                runtimeRootHostInstance: this,
                runtimeRootHostInstanceName: this._Prop_Config.WebListRuntimeInstanceName,
                pageRuntimeExtendObj: this.pageRuntimeExtendObj
            });

            let RendererChainCompleteObj = window.setInterval(() => {
                if (this.TestAllControlInstancesRendererIsCompleted()) {
                    window.clearInterval(RendererChainCompleteObj);
                    this.CallRendererChainCompletedFunc();
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
                runtimeRootHostInstance: this,
                runtimeRootHostInstanceName: this._Prop_Config.WebListRuntimeInstanceName,
                pageRuntimeExtendObj: this.pageRuntimeExtendObj
            });

            let RendererDataChainCompleteObj = window.setInterval(() => {
                //console.log(this._RendererDataChainIsCompleted);
                console.log("等待完成.....");
                if (this.TestAllControlInstancesRendererDataIsCompleted()) {
                    window.clearInterval(RendererDataChainCompleteObj);
                    this.CallRendererDataChainCompletedFunc();
                }
            }, 700);
        });
    },
    TestAllControlInstancesRendererIsCompleted:function(){
        for (let rendererControlInstance of this._Prop_Config.RendererControlInstances) {
            if(rendererControlInstance._prop._RendererChainIsCompleted==false){
                return false;
            }
        }
        return true;
    },
    TestAllControlInstancesRendererDataIsCompleted:function (){
        for (let rendererControlInstance of this._Prop_Config.RendererControlInstances) {
            if(rendererControlInstance._prop._RendererDataChainIsCompleted==false){
                return false;
            }
        }
        return true;
    },
    CallRendererChainCompletedFunc:function() {
        if (typeof (this._Prop_Config.RendererChainCompletedFunc) == "function") {
            this._Prop_Config.RendererChainCompletedFunc.call(this);
        }
        //HTMLPageObjectInstanceProxy.Init(this._Prop_Config,this._ListPO);
        window.setTimeout( ()=> {
            console.log("延迟调用");
            this.pageRuntimeExtendObj.rendererChainCompleted();
            //HTMLPageObjectInstanceProxy.CallPageReady()
        },500);
    },
    CallRendererDataChainCompletedFunc:function() {
        if (typeof (this._Prop_Config.RendererDataChainCompletedFunc) == "function") {
            this._Prop_Config.RendererDataChainCompletedFunc.call(this);
        }
        //HTMLPageObjectInstanceProxy.Init(this._Prop_Config,this._ListPO);
        window.setTimeout( ()=> {
            console.log("延迟调用");
            this.pageRuntimeExtendObj.rendererDataChainCompleted();
            //HTMLPageObjectInstanceProxy.CallPageReady()
        },500);
    },
    CheckPrimaryKeyInDataSet:function(dataSet,primaryKey){
        if(dataSet.list&&dataSet.list.length>0){
            let rowData=dataSet.list[0];
            for(let key in rowData){
                if(StringUtility.toUpperCase(key)==StringUtility.toUpperCase(primaryKey)){
                    return true;
                }
            }
        }
        return false;
    },
    GetPrimaryKey:function(){
        let primaryKey=this._ListPO.listDatasetPrimaryKey;
        return primaryKey;
    },
    IsPreview:function () {
        return this._Prop_Config.IsPreview;
    },
    AddRendererControlInstance:function (instance){
        this._Prop_Config.RendererControlInstances.push(instance);
    }
}
export {ListRuntime as default};