import RemoteRestInterface from '../Remote/RemoteRestInterface.js';
import VirtualBodyControl from '../VirtualBodyControl.js';

let WebFormRuntime={
    //OperationAdd:"add",
    //OperationUpdate:"update",
    //OperationView:"view",
    //OperationDel:"del",
    //_Prop_Status:"Edit",
    _Prop_Config:{
        RendererToId:null,
        FormId:"",
        RecordId:"",
        ButtonId:"",
        IsPreview:false,
        OperationType:"",
        ListFormButtonElemId:"",
        FormRuntimeCategory:"IsDependenceList",
        PreHandleFormHtmlRuntimeFunc:null
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

                var formHtmlRuntime = result.data.formHtmlRuntime;
                if (typeof (this._Prop_Config.PreHandleFormHtmlRuntimeFunc) == "function") {
                    formHtmlRuntime = this._Prop_Config.PreHandleFormHtmlRuntimeFunc(formHtmlRuntime, this, this._Prop_Config);
                }

                this._$RendererToElem.append(formHtmlRuntime);

                try {
                    //this._FormJSRuntimeInst = Object.create(HTMLJSRuntime);
                    //this._FormJSRuntimeInst.Initialization({}, this._$RendererToElem, this._FormPO.formJsContent);
                } catch (e) {
                    console.error("加载动态脚本错误! FormRuntime._LoadHTMLToEl-->this._FormJSRuntimeInst.Initialization:" + e);
                }

                var _rendererChainParas = {
                    po: result.data,
                    sourceHTML: formHtmlRuntime,
                    $rootElem: this._$RendererToElem,
                    $parentControlElem: this._$RendererToElem,
                    $singleControlElem: this._$RendererToElem,
                    formRuntimeInstance: this
                };

                VirtualBodyControl.RendererChain(_rendererChainParas);

                try {
                    VirtualBodyControl.InitStyle(_rendererChainParas);
                } catch (e) {
                    throw "初始化样式错误! FormRuntime._LoadHTMLToEl-->VirtualBodyControl.InitStyle:" + e;
                }

                /*if (this.IsPreview()) {
                    this.CallRendererChainCompletedFunc();
                } else {
                    if (this._FormPO.listButtonEntity) {
                        this.CreateALLInnerFormButton(this._FormPO.listButtonEntity);
                    }
                }*/

                if (BaseUtility.IsUpdateOperation(this.GetOperationType()) || BaseUtility.IsViewOperation(this.GetOperationType())) {
                    var formRecordComplexPO = result.data.formRecordComplexPO;
                    //console.log(result.data);
                    //console.log(formRecordComplexPO);
                    this.DeSerializationFormData(formRecordComplexPO);
                }
                if (BaseUtility.IsViewOperation(this.GetOperationType()) && this._Prop_Config.FormRuntimeCategory == FormRuntimeSinglePageObject.FORM_RUNTIME_CATEGORY_INDEPENDENCE) {
                    $("#innerButtonWrapOuter").hide();
                } else if (this.IsPrint()) {
                    $("#innerButtonWrapOuter").hide();
                    $(".html-design-operation-button-outer-wrap").hide();
                }

                //this.CallRendererChainCompletedFunc();
            } catch (e) {
                throw "渲染Html控件错误! FormRuntime._LoadHTMLToEl:" + e;
            }
            //var relationFormRecordComplexPo=FormRuntimeMock.GetMockData();
            //this.DeSerializationFormData(relationFormRecordComplexPo);
        });
    },
    _LoadToPDFStyle:function (){
        if(BaseUtility.GetUrlParaValue("ToPDF")=="ToPDF") {
            LoadJsCssUtility("/JB4DCBuilderClient/Themes/Default/Css/HTMLDesignRuntimeToPDF.css");
            console.log("加载转PDF样式!");
        }
    },
    CallRendererChainCompletedFunc:function() {
        var _this=this;
        if (typeof (this._Prop_Config.RendererChainCompletedFunc) == "function") {
            this._Prop_Config.RendererChainCompletedFunc.call(this,this._Prop_Config);
        }
        HTMLPageObjectInstanceProxy.Init(this._Prop_Config,this._FormPO);
        window.setTimeout(function () {
            //console.log("延迟调用");
            HTMLPageObjectInstanceProxy.CallPageReady();
            DialogUtility.CloseDialog(DialogUtility.DialogLoadingId);
            //_this._Prop_Config.pageHostInstance.pageToLoadingStatus(false);
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
        var formRecordComplexPo = {
            recordId: this._Prop_Config.RecordId,
            formId: this._Prop_Config.FormId,
            buttonId: this._Prop_Config.ButtonId,
            formRuntimeCategory:this._Prop_Config.FormRuntimeCategory,
            formRecordDataRelationPOList: null,
            exData: null
        };

        var originalFormDataRelation = this.GetOriginalFormDataRelation();
        //console.log(originalFormDataRelation);

        for (var i = 0; i < originalFormDataRelation.length; i++) {
            var singleRelation = originalFormDataRelation[i];
            var relationSingleName = singleRelation.singleName;
            var tableName = singleRelation.tableName;
            var tableId=singleRelation.tableId;
            //var isMain = (singleRelation.parentId == "-1");
            var isMain = singleRelation.main;
            singleRelation.isMain = isMain;
            if (isMain) {
                singleRelation.relationType = "1To1";
            }
            var relationType = singleRelation.relationType;

            if (relationType == "1To1") {
                //获取不在动态DynamicContainer中的并且绑定到了当前表的控件
                var controls = $("[tablename='" + tableName + "'][serialize='true']").not($("[control_category='DynamicContainer']").find("[jbuild4dc_custom='true']"));
                var oneRowRecord = [];
                for (var j = 0; j < controls.length; j++) {
                    var $controlElem = $(controls[j]);
                    var fieldTransferPO = HTMLControl.TryGetFieldTransferPO($controlElem, singleRelation.id, relationSingleName, relationType);
                    oneRowRecord.push(fieldTransferPO);
                }

                var recordId = "";
                var outerFieldName = "";
                var outerFieldValue = "";
                var selfFieldName = "";
                //var mainRelationPO=FormRelationPOUtility.FindMainRelationPO(originalFormDataRelation);
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
                var control = $("[serialize='true'][control_category='DynamicContainer'][relation_po_id='"+singleRelation.id+"']");
                if(control.length>0) {
                    var controlInstance = HTMLControl.GetControlInstanceByElem(control);
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
            formRuntimeInstance: this,
            relationFormRecordComplexPo:relationFormRecordComplexPo,
            callToViewStatusFunc:BaseUtility.IsViewOperation(this.GetOperationType())
        });
    },
    CreateALLInnerFormButton:function (listButtonPO) {
        if(!StringUtility.IsNullOrEmpty(listButtonPO.buttonInnerConfig)) {
            var buttonInnerConfig=JsonUtility.StringToJson(listButtonPO.buttonInnerConfig);
            for (var i = 0; i < buttonInnerConfig.length; i++) {
                var innerButtonConfig=buttonInnerConfig[i];
                var buttonElem=InnerFormButtonRuntime.RendererSingleInnerFormButton(innerButtonConfig,this,listButtonPO);
                $("#innerButtonWrapOuter").append(buttonElem);
            }
        }
    },
    GetWebFormRTParas:function () {
        return this._Prop_Config.WebFormRTParas;
    }
}

export {WebFormRuntime as default};