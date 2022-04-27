import RemoteRestInterface from '../Remote/RemoteRestInterface.js';
import VirtualBodyControl from '../VirtualBodyControl.js';
import JSRuntime from "../JSRuntime";
import InnerFormButtonRuntime from "./InnerFormButtonRuntime";

let WebFormRuntime={
    //OperationAdd:"add",
    //OperationUpdate:"update",
    //OperationView:"view",
    //OperationDel:"del",
    //_Prop_Status:"Edit",
    _Prop_Config:{
        RendererToId:null,
        RendererInnerButtonsToId:null,
        FormId:"",
        RecordId:"",
        ButtonId:"",
        IsPreview:false,
        OperationType:"",
        ListFormButtonElemId:"",
        FormRuntimeCategory:"IsDependenceList",
        PreHandleFormHtmlRuntimeFunc:null,
        RuntimeRootHostInstanceName:"",
        RendererControlInstances:[],
        RendererChainCompletedFunc:null,
        RendererDataChainCompletedFunc:null
    },
    _$RendererToElem:null,
    _FormPO:null,
    _FormDataRelationList:null,
    _OriginalFormDataRelationList:null,
    _FormJSRuntimeInst:null,
    //_RelationPOWithDynamicContainerControl:{},
    Initialization:function (_config) {
        this._Prop_Config= $.extend(true,{},this._Prop_Config,_config);
        this._$RendererToElem=$("#"+this._Prop_Config.RendererToId);
        this._LoadHTMLToEl();
        this._LoadToPDFStyle();
    },
    //用于控制BuilderListPageRuntimeInstance.RendererChainComplete的调用时间
    _RendererChainIsCompleted:true,
    _RendererDataChainIsCompleted:true,
    _LoadHTMLToEl:function () {
        RemoteRestInterface.loadWebFormRuntimeHTML({
            formId: this._Prop_Config.FormId,
            recordId: this._Prop_Config.RecordId,
            buttonId: this._Prop_Config.ButtonId,
            operationType: this.GetOperationType(),
            formRuntimeCategory: this._Prop_Config.FormRuntimeCategory
        }).then((response)=> {
            try {
                let result = response.data;

                this._FormPO = result.data;
                this._FormPO.formDataRelation = "";//清空字符串类型的关联.功能调整
                this._FormDataRelationList = this._FormPO.formRecordDataRelationPOList;
                this._OriginalFormDataRelationList = JsonUtility.CloneStringify(this._FormDataRelationList);

                let formHtmlRuntime = result.data.formHtmlRuntime;
                if (typeof (this._Prop_Config.PreHandleFormHtmlRuntimeFunc) == "function") {
                    formHtmlRuntime = this._Prop_Config.PreHandleFormHtmlRuntimeFunc(formHtmlRuntime, this, this._Prop_Config);
                }

                this._$RendererToElem.append(formHtmlRuntime);

                this.pageRuntimeExtendObj = JSRuntime.ConvertJsContentToObject(this, this._FormPO.formJsRuntime);
                this.pageRuntimeExtendObj.data.runtimeRootHostInstance = this;
                this.pageRuntimeExtendObj.pageReady();

                let _rendererChainParas = {
                    po: result.data,
                    sourceHTML: formHtmlRuntime,
                    $rootElem: this._$RendererToElem,
                    $parentControlElem: this._$RendererToElem,
                    $singleControlElem: this._$RendererToElem,
                    runtimeRootHostInstance: this,
                    runtimeRootHostInstanceName: this._Prop_Config.RuntimeRootHostInstanceName,
                    pageRuntimeExtendObj: this.pageRuntimeExtendObj
                };

                VirtualBodyControl.RendererChain(_rendererChainParas);

                try {
                    VirtualBodyControl.InitStyle(_rendererChainParas);
                } catch (e) {
                    throw "初始化样式错误! FormRuntime._LoadHTMLToEl-->VirtualBodyControl.InitStyle:" + e;
                }

                let RendererChainCompleteObj = window.setInterval(() => {
                    if (this.TestAllControlInstancesRendererIsCompleted()) {
                        window.clearInterval(RendererChainCompleteObj);
                        this.CallRendererChainCompletedFunc();
                    }
                }, 500);


                if (!this.IsPreview()) {
                    if (this._FormPO.listButtonEntity) {
                        this.CreateALLInnerFormButton(this._FormPO.listButtonEntity);
                    }
                }

                if (BaseUtility.IsUpdateOperation(this.GetOperationType()) || BaseUtility.IsViewOperation(this.GetOperationType())) {
                    let formRecordComplexPO = result.data.formRecordComplexPO;
                    this.DeSerializationFormData(formRecordComplexPO);
                }
                if (BaseUtility.IsViewOperation(this.GetOperationType()) && this._Prop_Config.FormRuntimeCategory == FormRuntimeSinglePageObject.FORM_RUNTIME_CATEGORY_INDEPENDENCE) {
                    $("#innerButtonWrapOuter").hide();
                } else if (this.IsPrint()) {
                    $("#innerButtonWrapOuter").hide();
                    $(".html-design-operation-button-outer-wrap").hide();
                }

                let RendererDataChainCompleteObj = window.setInterval(() => {
                    console.log("等待完成.....");
                    if (this.TestAllControlInstancesRendererDataIsCompleted()) {
                        window.clearInterval(RendererDataChainCompleteObj);
                        this.CallRendererDataChainCompletedFunc();
                    }
                }, 700);
            } catch (e) {
                console.error("渲染Html控件错误! FormRuntime._LoadHTMLToEl:" + e);
                throw e;
            }
            //let relationFormRecordComplexPo=FormRuntimeMock.GetMockData();
            //this.DeSerializationFormData(relationFormRecordComplexPo);
        });
    },
    _LoadToPDFStyle:function (){
        if(BaseUtility.GetUrlParaValue("ToPDF")=="ToPDF") {
            LoadJsCssUtility("/JB4DCBuilderClient/Themes/Default/Css/HTMLDesignRuntimeToPDF.css");
            console.log("加载转PDF样式!");
        }
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
    IsPrint:function (){
        return BaseUtility.GetUrlParaValue("IsPrint")=="true";
    },
    IsPreview: function () {
        return this._Prop_Config.IsPreview
    },
    GetRecordId:function(){
        return this._Prop_Config.RecordId;
    },
    GetOperationType:function(){
        return this._Prop_Config.OperationType;
    },
    GetOpenedListFormButtonId:function(){
        return this._Prop_Config.ListFormButtonElemId;
    },
    GetOriginalFormDataRelation:function() {
        return JsonUtility.CloneStringify(this._OriginalFormDataRelationList);
        //return JsonUtility.StringToJson(this._FormPO.formDataRelation);
    },
    GetFormPO:function(){
        return this._FormPO;
    },

    SerializationFormData:function () {
        let formRecordComplexPo = {
            recordId: this._Prop_Config.RecordId,
            formId: this._Prop_Config.FormId,
            buttonId: this._Prop_Config.ButtonId,
            formRuntimeCategory:this._Prop_Config.FormRuntimeCategory,
            formRecordDataRelationPOList: null,
            exData: null
        };

        let originalFormDataRelation = this.GetOriginalFormDataRelation();
        //console.log(originalFormDataRelation);

        for (let i = 0; i < originalFormDataRelation.length; i++) {
            let singleRelation = originalFormDataRelation[i];
            let relationSingleName = singleRelation.singleName;
            let tableName = singleRelation.tableName;
            let tableId=singleRelation.tableId;
            //let isMain = (singleRelation.parentId == "-1");
            let isMain = singleRelation.main;
            singleRelation.isMain = isMain;
            if (isMain) {
                singleRelation.relationType = "1To1";
            }
            let relationType = singleRelation.relationType;

            if (relationType == "1To1") {
                //获取不在动态DynamicContainer中的并且绑定到了当前表的控件
                let controls = $("[tablename='" + tableName + "'][serialize='true']").not($("[control_category='DynamicContainer']").find("[jbuild4dc_custom='true']"));
                let oneRowRecord = [];
                for (let j = 0; j < controls.length; j++) {
                    let $controlElem = $(controls[j]);
                    let fieldTransferPO = HTMLControl.TryGetFieldTransferPO($controlElem, singleRelation.id, relationSingleName, relationType);
                    oneRowRecord.push(fieldTransferPO);
                }

                let recordId = "";
                let outerFieldName = "";
                let outerFieldValue = "";
                let selfFieldName = "";
                //let mainRelationPO=FormRelationPOUtility.FindMainRelationPO(originalFormDataRelation);
                //debugger;
                if (isMain) {
                    FormRelationPOUtility.CreateIdFieldInRecordFieldPOArray(oneRowRecord, formRecordComplexPo.recordId,this.GetFormPO(),tableId);
                    recordId = formRecordComplexPo.recordId;
                    outerFieldName = "NotOuterField";
                    outerFieldValue = "NotOuterField";
                    selfFieldName = "NotOuterField";
                } else {
                    //recordId = FormRelationPOUtility.FindIDFieldPOInOneDataRecord(oneRowRecord).value;
                    recordId = FormRelationPOUtility.FindFieldPOInOneDataRecord(oneRowRecord,singleRelation.pkFieldName).value;
                    outerFieldName = singleRelation.outerKeyFieldName;
                    outerFieldValue = singleRelation.outerKeyFieldName;
                    selfFieldName = singleRelation.selfKeyFieldName;
                }

                FormRelationPOUtility.Add1To1DataRecordFieldPOList(singleRelation, oneRowRecord, "", recordId, outerFieldName, outerFieldValue, selfFieldName);
            } else {
                let control = $("[serialize='true'][control_category='DynamicContainer'][relation_po_id='"+singleRelation.id+"']");
                if(control.length>0) {
                    let controlInstance = HTMLControl.GetControlInstanceByElem(control);
                    controlInstance.SerializationValue(originalFormDataRelation,singleRelation,control);
                }
            }
        }
        formRecordComplexPo.formRecordDataRelationPOList = originalFormDataRelation;
        //console.log(formRecordComplexPo);
        //console.log(JsonUtility.JsonToString(formRecordComplexPo))
        //console.log(JsonUtility.JsonToString(formRecordComplexPo))
        return formRecordComplexPo;
    },
    DeSerializationFormData:function (relationFormRecordComplexPo) {
        //console.log("DeSerializationFormData");
        //console.log(relationFormRecordComplexPo);
        //绑定数据并进行二次渲染绑定数据。
        VirtualBodyControl.RendererDataChain({
            $rootElem: this._$RendererToElem,
            $parentControlElem: this._$RendererToElem,
            $singleControlElem: this._$RendererToElem,
            //formRuntimeInstance: this,
            relationFormRecordComplexPo:relationFormRecordComplexPo,
            callToViewStatusFunc:BaseUtility.IsViewOperation(this.GetOperationType()),
            runtimeRootHostInstance: this,
            runtimeRootHostInstanceName: this._Prop_Config.RuntimeRootHostInstanceName,
            pageRuntimeExtendObj: this.pageRuntimeExtendObj
        });
    },
    CreateALLInnerFormButton:function (listButtonPO) {
        if(!StringUtility.IsNullOrEmpty(listButtonPO.buttonInnerConfig)) {
            let buttonInnerConfig=JsonUtility.StringToJson(listButtonPO.buttonInnerConfig);
            for (let i = 0; i < buttonInnerConfig.length; i++) {
                let innerButtonConfig=buttonInnerConfig[i];
                let buttonElem=InnerFormButtonRuntime.RendererSingleInnerFormButton(innerButtonConfig,this,listButtonPO);
                $("#"+this._Prop_Config.RendererInnerButtonsToId).append(buttonElem);
            }
        }
    },
    GetWebFormRTParas:function () {
        return this._Prop_Config.WebFormRTParas;
    },
    AddRendererControlInstance:function (instance){
        this._Prop_Config.RendererControlInstances.push(instance);
    },
    CallPageRuntimeExtendEveryControlRendererChainEnd:function (_rendererChainParas){
        this.pageRuntimeExtendObj.everyControlRendererChainEnd(_rendererChainParas);
    },
    CallPageRuntimeExtendEveryControlRendererDataChainEnd:function (_rendererDataChainParas){
        this.pageRuntimeExtendObj.everyControlRendererDataChainEnd(_rendererDataChainParas);
    }
}

export {WebFormRuntime as default};