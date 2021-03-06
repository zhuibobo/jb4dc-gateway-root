let FormRuntimeSinglePageObject={
    _webFormRTParas:null,
    _formRuntimeInst:null,
    FORM_RUNTIME_CATEGORY_INDEPENDENCE:"IsIndependence",
    FORM_RUNTIME_CATEGORY_LIST:"IsDependenceList",

    getWebFormRTParasWithListButtonId:function () {
        if(!this._webFormRTParas) {
            this._webFormRTParas = {
                "FormId": BaseUtility.GetUrlParaValue("formId"),
                "ButtonId": BaseUtility.GetUrlParaValue("buttonId"),
                "OperationType": BaseUtility.GetUrlParaValue("operationType"),
                "ListFormButtonElemId": BaseUtility.GetUrlParaValue("listFormButtonElemId"),
                "RecordId": BaseUtility.GetUrlParaValue("recordId"),
                "WindowWidth": BaseUtility.GetUrlParaValue("windowWidth"),
                "WindowHeight": BaseUtility.GetUrlParaValue("windowHeight"),
                "FormRuntimeCategory":this.FORM_RUNTIME_CATEGORY_LIST
            };
            if(!this._webFormRTParas.RecordId){
                this._webFormRTParas.RecordId=StringUtility.Guid();
            }
        }
        return this._webFormRTParas;
    },
    getWebFormRTParasWithIndependence:function(){
        //debugger;
        var formId=RuntimeGeneralInstance.TryGetMenuOuterId();
        if(StringUtility.IsNullOrEmpty(formId)){
            formId=BaseUtility.GetUrlParaValue("formId")
        }
        //console.log(formId);
        if(!this._webFormRTParas) {
            this._webFormRTParas = {
                "FormId": formId,
                "ButtonId": this.FORM_RUNTIME_CATEGORY_INDEPENDENCE,
                "OperationType": this.FORM_RUNTIME_CATEGORY_INDEPENDENCE,
                "ListFormButtonElemId": this.FORM_RUNTIME_CATEGORY_INDEPENDENCE,
                "RecordId": "",
                "WindowWidth": "",
                "WindowHeight": "",
                "FormRuntimeCategory":this.FORM_RUNTIME_CATEGORY_INDEPENDENCE
            };
            if(StringUtility.IsNotNullOrEmpty(BaseUtility.GetUrlParaValue("operationType"))){
                this._webFormRTParas.OperationType=BaseUtility.GetUrlParaValue("operationType");
            };
            if(StringUtility.IsNotNullOrEmpty(BaseUtility.GetUrlParaValue("recordId"))){
                this._webFormRTParas.RecordId=BaseUtility.GetUrlParaValue("recordId");
            };
            if(!this._webFormRTParas.RecordId){
                this._webFormRTParas.RecordId=StringUtility.Guid();
            }
        }
        return this._webFormRTParas;
    },
    pageReady:function (isPreview,rendererChainCompletedFunc,getWebFormRTParasFunc,pageHostInstance) {
        //debugger;
        this._formRuntimeInst = Object.create(FormRuntime);
        //var webFormRTParas=this.getWebFormRTParas();
        var webFormRTParas=getWebFormRTParasFunc.call(this);
        this._formRuntimeInst.Initialization({
            "RendererToId": "htmlDesignRuntimeWrap",
            "FormId":webFormRTParas.FormId,
            "RecordId":webFormRTParas.RecordId,
            "ButtonId":webFormRTParas.ButtonId,
            "OperationType":webFormRTParas.OperationType,
            "IsPreview":isPreview,
            "RendererChainCompletedFunc":rendererChainCompletedFunc,
            "ListFormButtonElemId":webFormRTParas.ListFormButtonElemId,
            "WebFormRTParas":webFormRTParas,
            "FormRuntimeCategory":webFormRTParas.FormRuntimeCategory,
            "pageHostInstance111":pageHostInstance
        });
        //this._formRuntimeInst.webFormRTParas=webFormRTParas;
        return this._formRuntimeInst;
    }
}

let FormRuntime={
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
    //????????????BuilderListPageRuntimeInstance.RendererChainComplete???????????????
    _RendererChainIsCompleted:true,
    _RendererDataChainIsCompleted:true,
    _LoadHTMLToEl:function () {
        //debugger;
        /*$(this._Prop_Config.RendererTo).loadHtmlDesignContent(BaseUtility.GetRootPath()+"/Rest/Builder/FormRuntime/FormPreview?formId="+this._Prop_Config.FormId, function() {
            //alert( "Load was performed." );
            console.log("????????????????????????!!");
        });*/
        var url = BaseUtility.BuildAction("/Rest/Builder/RunTime/c/LoadHTML", {});
        if (this._Prop_Config.IsPreview) {
            url = BaseUtility.BuildAction("/Rest/Builder/RunTime/FormRuntime/LoadHTMLForPreView", {});
        }

        RuntimeGeneralInstance.LoadHtmlDesignContent(url, this._Prop_Config.RendererTo, {
            formId: this._Prop_Config.FormId,
            recordId: this._Prop_Config.RecordId,
            buttonId: this._Prop_Config.ButtonId,
            operationType: this.GetOperationType(),
            formRuntimeCategory: this._Prop_Config.FormRuntimeCategory
        }, function (result) {
            try {

                this._FormPO = result.data;
                this._FormPO.formDataRelation = "";//??????????????????????????????.????????????
                this._FormDataRelationList = this._FormPO.formRecordDataRelationPOList;
                this._OriginalFormDataRelationList = JsonUtility.CloneStringify(this._FormDataRelationList);

                var formHtmlRuntime = result.data.formHtmlRuntime;
                if (typeof (this._Prop_Config.PreHandleFormHtmlRuntimeFunc) == "function") {
                    formHtmlRuntime = this._Prop_Config.PreHandleFormHtmlRuntimeFunc(formHtmlRuntime, this, this._Prop_Config);
                }

                this._$RendererToElem.append(formHtmlRuntime);

                try {
                    this._FormJSRuntimeInst = Object.create(HTMLJSRuntime);
                    this._FormJSRuntimeInst.Initialization({}, this._$RendererToElem, this._FormPO.formJsContent);
                } catch (e) {
                    throw "????????????????????????! FormRuntime._LoadHTMLToEl-->this._FormJSRuntimeInst.Initialization:" + e;
                }

                var _rendererChainParas = {
                    po: result.data,
                    sourceHTML: formHtmlRuntime,
                    $rootElem: this._$RendererToElem,
                    $parentControlElem: this._$RendererToElem,
                    $singleControlElem: this._$RendererToElem,
                    formRuntimeInstance: this
                };

                /*console.log("------------------------");
                console.log(VirtualBodyControl.RendererChain);
                console.log("------------------------");*/
                VirtualBodyControl.RendererChain(_rendererChainParas);

                try {
                    VirtualBodyControl.InitStyle(_rendererChainParas);
                } catch (e) {
                    throw "?????????????????????! FormRuntime._LoadHTMLToEl-->VirtualBodyControl.InitStyle:" + e;
                }

                //debugger;
                if (this.IsPreview()) {
                    this.CallRendererChainCompletedFunc();
                } else {
                    /*RuntimeGeneralInstance.LoadInnerFormButton(this._Prop_Config.ButtonId,{},function (result) {
                        if(result.data) {
                            this.CreateALLInnerFormButton(result.data);
                        }
                        this.CallRendererChainCompletedFunc();
                    },this);*/
                    if (this._FormPO.listButtonEntity) {
                        this.CreateALLInnerFormButton(this._FormPO.listButtonEntity);
                    }
                }

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

                this.CallRendererChainCompletedFunc();
                console.log("222222222222222222222222");
            } catch (e) {
                throw "??????Html????????????! FormRuntime._LoadHTMLToEl:" + e;
            }
            //var relationFormRecordComplexPo=FormRuntimeMock.GetMockData();
            //this.DeSerializationFormData(relationFormRecordComplexPo);
        }, this);
    },
    _LoadToPDFStyle:function (){
        if(BaseUtility.GetUrlParaValue("ToPDF")=="ToPDF") {
            LoadJsCssUtility("/JB4DCBuilderClient/Themes/Default/Css/HTMLDesignRuntimeToPDF.css");
            console.log("?????????PDF??????!");
        }
    },
    CallRendererChainCompletedFunc:function() {
        var _this=this;
        if (typeof (this._Prop_Config.RendererChainCompletedFunc) == "function") {
            this._Prop_Config.RendererChainCompletedFunc.call(this,this._Prop_Config);
        }
        HTMLPageObjectInstanceProxy.Init(this._Prop_Config,this._FormPO);
        window.setTimeout(function () {
            //console.log("????????????");
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
                //??????????????????DynamicContainer??????????????????????????????????????????
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
        //????????????????????????????????????????????????
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

let FormRuntimeMockDataPool= {
    mockDataPool: {},
    SaveData: function (groupName, recordId, data) {
        var key = groupName + "-" + recordId;
        this.mockDataPool[key] = data;
    },
    GetData: function (groupName, recordId) {
        var key = groupName + "-" + recordId;
        if (this.mockDataPool[key]) {
            return this.mockDataPool[key];
        }
        return null;
    },
    SaveDataToParentPool: function (groupName, recordId, data) {
        window.parent.FormRuntimeMockDataPool.SaveData(groupName, recordId, data);
    },
    GetDataFromParentPool: function (groupName, recordId) {
        return window.parent.FormRuntimeMockDataPool.GetData(groupName, recordId);
    },
    GetMockData: function () {
        return {
            "recordId": "",
            "formId": "34db0d6f-7978-4acf-8a45-13a6ee5f63e2",
            "buttonId": "",
            "formRecordDataRelationPOList": [
                {
                    "id": "d9bc9332-3c94-28bb-1c11-049764c69eb5",
                    "parentId": "-1",
                    "singleName": "",
                    "pkFieldName": "",
                    "desc": "",
                    "selfKeyFieldName": "",
                    "outerKeyFieldName": "",
                    "relationType": "1To1",
                    "isSave": "true",
                    "condition": "",
                    "tableId": "TDEV_TEST_1",
                    "tableName": "TDEV_TEST_1",
                    "tableCaption": "???????????????11",
                    "tableCode": "T_10437",
                    "displayText": "TDEV_TEST_1[???????????????1]",
                    "icon": "/Themes/Png16X16/table.png",
                    "isMain": true,
                    "oneDataRecord": {
                        "desc": "???????????????",
                        "recordFieldPOList": [
                            {
                                "relationId": "d9bc9332-3c94-28bb-1c11-049764c69eb5",
                                "relationSingleName": "",
                                "relationType": "1To1",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_1",
                                "tableCaption": "???????????????1",
                                "tableId": "TDEV_TEST_1",
                                "fieldTableId": "",
                                "fieldName": "F_TITLE",
                                "fieldDataType": "?????????",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_897949295",
                                "defaultType": "Const",
                                "defaultValue": "??????",
                                "value": "??????15",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "d9bc9332-3c94-28bb-1c11-049764c69eb5",
                                "relationSingleName": "",
                                "relationType": "1To1",
                                "singleName": "WFDCT_TextDateTime",
                                "tableName": "TDEV_TEST_1",
                                "tableCaption": "???????????????1",
                                "tableId": "TDEV_TEST_1",
                                "fieldTableId": "",
                                "fieldName": "F_PUBLIC_TIME",
                                "fieldDataType": "????????????",
                                "fieldDataLength": "20",
                                "serialize": "true",
                                "id": "txt_dt_375186891",
                                "defaultType": "EnvVar",
                                "defaultValue": "ENV_DATETIME_YYYY_MM_DD",
                                "value": "2019-10-31",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "d9bc9332-3c94-28bb-1c11-049764c69eb5",
                                "relationSingleName": "",
                                "relationType": "1To1",
                                "singleName": "WFDCT_DropDownSelect",
                                "tableName": "TDEV_TEST_1",
                                "tableCaption": "???????????????1",
                                "tableId": "TDEV_TEST_1",
                                "fieldTableId": "",
                                "fieldName": "F_PUBLIC_STATUS",
                                "fieldDataType": "?????????",
                                "fieldDataLength": "50",
                                "serialize": "true",
                                "id": "sel_246410688",
                                "defaultType": "",
                                "defaultValue": "",
                                "value": "4",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "d9bc9332-3c94-28bb-1c11-049764c69eb5",
                                "relationSingleName": "",
                                "relationType": "1To1",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_1",
                                "tableCaption": "???????????????1",
                                "tableId": "TDEV_TEST_1",
                                "fieldTableId": "",
                                "fieldName": "F_ORGAN_ID",
                                "fieldDataType": "?????????",
                                "fieldDataLength": "50",
                                "serialize": "true",
                                "id": "txt_897909755",
                                "defaultType": "EnvVar",
                                "defaultValue": "ENV_SYSTEM_CURRENT_USER_ORGAN_ID",
                                "value": "10001",
                                "success": true,
                                "msg": ""
                            },
                            {
                                "relationId": "d9bc9332-3c94-28bb-1c11-049764c69eb5",
                                "relationSingleName": "",
                                "relationType": "1To1",
                                "singleName": "WFDCT_TextBox",
                                "tableName": "TDEV_TEST_1",
                                "tableCaption": "???????????????1",
                                "tableId": "TDEV_TEST_1",
                                "fieldTableId": "",
                                "fieldName": "ID",
                                "fieldDataType": "?????????",
                                "fieldDataLength": "200",
                                "serialize": "true",
                                "id": "txt_897949295",
                                "defaultType": "Const",
                                "defaultValue": "??????",
                                "value": "0d561c0e-b83b-a9ff-c88a-652d4a4aa256",
                                "success": true,
                                "msg": ""
                            }
                        ]
                    }
                },
                {
                    "id": "2d7def75-1438-7614-af7d-60ce0650eba6",
                    "parentId": "d9bc9332-3c94-28bb-1c11-049764c69eb5",
                    "singleName": "",
                    "pkFieldName": "",
                    "desc": "",
                    "selfKeyFieldName": "",
                    "outerKeyFieldName": "",
                    "relationType": "1ToN",
                    "isSave": "true",
                    "condition": "",
                    "tableId": "TDEV_TEST_2",
                    "tableName": "TDEV_TEST_2",
                    "tableCaption": "???????????????2",
                    "tableCode": "T_10438",
                    "displayText": "TDEV_TEST_2[???????????????2](1ToN)",
                    "icon": "/Themes/Png16X16/table.png",
                    "isMain": false,
                    "listDataRecord": [
                        {
                            "desc": "???????????????",
                            "recordFieldPOList": [
                                {
                                    "relationId": "19e5f4ea-4fba-4f4b-0d3b-8b6f56ddeda1",
                                    "relationSingleName": "",
                                    "relationType": "1To1",
                                    "singleName": "WFDCT_TextBox",
                                    "tableName": "TDEV_TEST_2",
                                    "tableCaption": "???????????????2",
                                    "tableId": "TDEV_TEST_2",
                                    "fieldTableId": "",
                                    "fieldName": "F_TITLE",
                                    "fieldDataType": "?????????",
                                    "fieldDataLength": "200",
                                    "serialize": "true",
                                    "id": "txt_698035082",
                                    "defaultType": "Const",
                                    "defaultValue": "1",
                                    "value": "1",
                                    "success": true,
                                    "msg": ""
                                },
                                {
                                    "relationId": "19e5f4ea-4fba-4f4b-0d3b-8b6f56ddeda1",
                                    "relationSingleName": "",
                                    "relationType": "1To1",
                                    "singleName": "WFDCT_TextDateTime",
                                    "tableName": "TDEV_TEST_2",
                                    "tableCaption": "???????????????2",
                                    "tableId": "TDEV_TEST_2",
                                    "fieldTableId": "",
                                    "fieldName": "F_PUBLIC_TIME",
                                    "fieldDataType": "????????????",
                                    "fieldDataLength": "20",
                                    "serialize": "true",
                                    "id": "txt_dt_698060281",
                                    "defaultType": "EnvVar",
                                    "defaultValue": "ENV_DATETIME_YYYY_MM_DD",
                                    "value": "2019-10-30",
                                    "success": true,
                                    "msg": ""
                                },
                                {
                                    "relationId": "19e5f4ea-4fba-4f4b-0d3b-8b6f56ddeda1",
                                    "relationSingleName": "",
                                    "relationType": "1To1",
                                    "singleName": "WFDCT_TextBox",
                                    "tableName": "TDEV_TEST_2",
                                    "tableCaption": "???????????????2",
                                    "tableId": "TDEV_TEST_2",
                                    "fieldTableId": "",
                                    "fieldName": "ID",
                                    "fieldDataType": "?????????",
                                    "fieldDataLength": "200",
                                    "serialize": "true",
                                    "id": "txt_698035082",
                                    "defaultType": "Const",
                                    "defaultValue": "1",
                                    "value": "f18706b9-c8a5-93cb-8be0-f7fca2d77702",
                                    "success": true,
                                    "msg": ""
                                }
                            ]
                        },
                        {
                            "desc": "???????????????",
                            "recordFieldPOList": [
                                {
                                    "relationId": "19e5f4ea-4fba-4f4b-0d3b-8b6f56ddeda1",
                                    "relationSingleName": "",
                                    "relationType": "1To1",
                                    "singleName": "WFDCT_TextBox",
                                    "tableName": "TDEV_TEST_2",
                                    "tableCaption": "???????????????2",
                                    "tableId": "TDEV_TEST_2",
                                    "fieldTableId": "",
                                    "fieldName": "F_TITLE",
                                    "fieldDataType": "?????????",
                                    "fieldDataLength": "200",
                                    "serialize": "true",
                                    "id": "txt_698035082",
                                    "defaultType": "Const",
                                    "defaultValue": "1",
                                    "value": "2",
                                    "success": true,
                                    "msg": ""
                                },
                                {
                                    "relationId": "19e5f4ea-4fba-4f4b-0d3b-8b6f56ddeda1",
                                    "relationSingleName": "",
                                    "relationType": "1To1",
                                    "singleName": "WFDCT_TextDateTime",
                                    "tableName": "TDEV_TEST_2",
                                    "tableCaption": "???????????????2",
                                    "tableId": "TDEV_TEST_2",
                                    "fieldTableId": "",
                                    "fieldName": "F_PUBLIC_TIME",
                                    "fieldDataType": "????????????",
                                    "fieldDataLength": "20",
                                    "serialize": "true",
                                    "id": "txt_dt_698060281",
                                    "defaultType": "EnvVar",
                                    "defaultValue": "ENV_DATETIME_YYYY_MM_DD",
                                    "value": "2019-10-30",
                                    "success": true,
                                    "msg": ""
                                },
                                {
                                    "relationId": "19e5f4ea-4fba-4f4b-0d3b-8b6f56ddeda1",
                                    "relationSingleName": "",
                                    "relationType": "1To1",
                                    "singleName": "WFDCT_TextBox",
                                    "tableName": "TDEV_TEST_2",
                                    "tableCaption": "???????????????2",
                                    "tableId": "TDEV_TEST_2",
                                    "fieldTableId": "",
                                    "fieldName": "ID",
                                    "fieldDataType": "?????????",
                                    "fieldDataLength": "200",
                                    "serialize": "true",
                                    "id": "txt_698035082",
                                    "defaultType": "Const",
                                    "defaultValue": "1",
                                    "value": "e6881779-ecd2-8345-03f1-7c8ef065dccb",
                                    "success": true,
                                    "msg": ""
                                }
                            ]
                        },
                        {
                            "desc": "???????????????",
                            "recordFieldPOList": [
                                {
                                    "relationId": "19e5f4ea-4fba-4f4b-0d3b-8b6f56ddeda1",
                                    "relationSingleName": "",
                                    "relationType": "1To1",
                                    "singleName": "WFDCT_TextBox",
                                    "tableName": "TDEV_TEST_2",
                                    "tableCaption": "???????????????2",
                                    "tableId": "TDEV_TEST_2",
                                    "fieldTableId": "",
                                    "fieldName": "F_TITLE",
                                    "fieldDataType": "?????????",
                                    "fieldDataLength": "200",
                                    "serialize": "true",
                                    "id": "txt_698035082",
                                    "defaultType": "Const",
                                    "defaultValue": "1",
                                    "value": "3",
                                    "success": true,
                                    "msg": ""
                                },
                                {
                                    "relationId": "19e5f4ea-4fba-4f4b-0d3b-8b6f56ddeda1",
                                    "relationSingleName": "",
                                    "relationType": "1To1",
                                    "singleName": "WFDCT_TextDateTime",
                                    "tableName": "TDEV_TEST_2",
                                    "tableCaption": "???????????????2",
                                    "tableId": "TDEV_TEST_2",
                                    "fieldTableId": "",
                                    "fieldName": "F_PUBLIC_TIME",
                                    "fieldDataType": "????????????",
                                    "fieldDataLength": "20",
                                    "serialize": "true",
                                    "id": "txt_dt_698060281",
                                    "defaultType": "EnvVar",
                                    "defaultValue": "ENV_DATETIME_YYYY_MM_DD",
                                    "value": "2019-10-30",
                                    "success": true,
                                    "msg": ""
                                },
                                {
                                    "relationId": "19e5f4ea-4fba-4f4b-0d3b-8b6f56ddeda1",
                                    "relationSingleName": "",
                                    "relationType": "1To1",
                                    "singleName": "WFDCT_TextBox",
                                    "tableName": "TDEV_TEST_2",
                                    "tableCaption": "???????????????2",
                                    "tableId": "TDEV_TEST_2",
                                    "fieldTableId": "",
                                    "fieldName": "ID",
                                    "fieldDataType": "?????????",
                                    "fieldDataLength": "200",
                                    "serialize": "true",
                                    "id": "txt_698035082",
                                    "defaultType": "Const",
                                    "defaultValue": "1",
                                    "value": "d9fe2f10-e5eb-f59a-58ee-787fdce751f1",
                                    "success": true,
                                    "msg": ""
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "4313366b-caa0-4272-2690-1237750651f6",
                    "parentId": "2d7def75-1438-7614-af7d-60ce0650eba6",
                    "singleName": "",
                    "pkFieldName": "",
                    "desc": "",
                    "selfKeyFieldName": "TDEV_TEST_2_ID",
                    "outerKeyFieldName": "ID",
                    "relationType": "1ToN",
                    "isSave": "true",
                    "condition": "",
                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                    "tableName": "TDEV_TEST_5",
                    "tableCaption": "TDEV_TEST_5",
                    "tableCode": "T_10871",
                    "displayText": "TDEV_TEST_5[TDEV_TEST_5](1ToN)",
                    "icon": "/Themes/Png16X16/table.png",
                    "listDataRecord": [
                        {
                            "desc": "???????????????",
                            "recordFieldPOList": [
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextBox",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "F_TITLE",
                                    "fieldDataType": "?????????",
                                    "fieldDataLength": "200",
                                    "serialize": "true",
                                    "id": "txt_768659685",
                                    "defaultType": "Const",
                                    "defaultValue": "1",
                                    "value": "1",
                                    "success": true,
                                    "msg": ""
                                },
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextDateTime",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "F_PUBLIC_TIME",
                                    "fieldDataType": "????????????",
                                    "fieldDataLength": "20",
                                    "serialize": "true",
                                    "id": "txt_dt_768729317",
                                    "defaultType": "EnvVar",
                                    "defaultValue": "ENV_DATETIME_YYYY_MM_DD_HH_MM_SS",
                                    "value": "2019-10-30 20:59:32",
                                    "success": true,
                                    "msg": ""
                                },
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextBox",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "ID",
                                    "fieldDataType": "?????????",
                                    "fieldDataLength": "200",
                                    "serialize": "true",
                                    "id": "txt_768659685",
                                    "defaultType": "Const",
                                    "defaultValue": "1",
                                    "value": "8be67086-3f2e-9eb7-7b9d-f5350db9de92",
                                    "success": true,
                                    "msg": ""
                                },
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextBox",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "TDEV_TEST_2_ID",
                                    "fieldDataType": "?????????",
                                    "fieldDataLength": "200",
                                    "serialize": "true",
                                    "id": "txt_768659685",
                                    "defaultType": "Const",
                                    "defaultValue": "1",
                                    "value": "f18706b9-c8a5-93cb-8be0-f7fca2d77702",
                                    "success": true,
                                    "msg": ""
                                }
                            ]
                        },
                        {
                            "desc": "???????????????",
                            "recordFieldPOList": [
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextBox",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "F_TITLE",
                                    "fieldDataType": "?????????",
                                    "fieldDataLength": "200",
                                    "serialize": "true",
                                    "id": "txt_768659685",
                                    "defaultType": "Const",
                                    "defaultValue": "1",
                                    "value": "11",
                                    "success": true,
                                    "msg": ""
                                },
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextDateTime",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "F_PUBLIC_TIME",
                                    "fieldDataType": "????????????",
                                    "fieldDataLength": "20",
                                    "serialize": "true",
                                    "id": "txt_dt_768729317",
                                    "defaultType": "EnvVar",
                                    "defaultValue": "ENV_DATETIME_YYYY_MM_DD_HH_MM_SS",
                                    "value": "2019-10-30 20:59:32",
                                    "success": true,
                                    "msg": ""
                                },
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextBox",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "ID",
                                    "fieldDataType": "?????????",
                                    "fieldDataLength": "200",
                                    "serialize": "true",
                                    "id": "txt_768659685",
                                    "defaultType": "Const",
                                    "defaultValue": "1",
                                    "value": "3a4f512f-5fd5-2d8f-98a0-6e8aa0178999",
                                    "success": true,
                                    "msg": ""
                                },
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextBox",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "TDEV_TEST_2_ID",
                                    "fieldDataType": "?????????",
                                    "fieldDataLength": "200",
                                    "serialize": "true",
                                    "id": "txt_768659685",
                                    "defaultType": "Const",
                                    "defaultValue": "1",
                                    "value": "f18706b9-c8a5-93cb-8be0-f7fca2d77702",
                                    "success": true,
                                    "msg": ""
                                }
                            ]
                        },
                        {
                            "desc": "???????????????",
                            "recordFieldPOList": [
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextBox",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "F_TITLE",
                                    "fieldDataType": "?????????",
                                    "fieldDataLength": "200",
                                    "serialize": "true",
                                    "id": "txt_768659685",
                                    "defaultType": "Const",
                                    "defaultValue": "1",
                                    "value": "111",
                                    "success": true,
                                    "msg": ""
                                },
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextDateTime",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "F_PUBLIC_TIME",
                                    "fieldDataType": "????????????",
                                    "fieldDataLength": "20",
                                    "serialize": "true",
                                    "id": "txt_dt_768729317",
                                    "defaultType": "EnvVar",
                                    "defaultValue": "ENV_DATETIME_YYYY_MM_DD_HH_MM_SS",
                                    "value": "2019-10-30 20:59:32",
                                    "success": true,
                                    "msg": ""
                                },
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextBox",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "ID",
                                    "fieldDataType": "?????????",
                                    "fieldDataLength": "200",
                                    "serialize": "true",
                                    "id": "txt_768659685",
                                    "defaultType": "Const",
                                    "defaultValue": "1",
                                    "value": "85be9cb5-48bc-ec01-6f0c-7a634934f25e",
                                    "success": true,
                                    "msg": ""
                                },
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextBox",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "TDEV_TEST_2_ID",
                                    "fieldDataType": "?????????",
                                    "fieldDataLength": "200",
                                    "serialize": "true",
                                    "id": "txt_768659685",
                                    "defaultType": "Const",
                                    "defaultValue": "1",
                                    "value": "f18706b9-c8a5-93cb-8be0-f7fca2d77702",
                                    "success": true,
                                    "msg": ""
                                }
                            ]
                        },
                        {
                            "desc": "???????????????",
                            "recordFieldPOList": [
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextBox",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "F_TITLE",
                                    "fieldDataType": "?????????",
                                    "fieldDataLength": "200",
                                    "serialize": "true",
                                    "id": "txt_768659685",
                                    "defaultType": "Const",
                                    "defaultValue": "1",
                                    "value": "1111",
                                    "success": true,
                                    "msg": ""
                                },
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextDateTime",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "F_PUBLIC_TIME",
                                    "fieldDataType": "????????????",
                                    "fieldDataLength": "20",
                                    "serialize": "true",
                                    "id": "txt_dt_768729317",
                                    "defaultType": "EnvVar",
                                    "defaultValue": "ENV_DATETIME_YYYY_MM_DD_HH_MM_SS",
                                    "value": "2019-10-30 20:59:32",
                                    "success": true,
                                    "msg": ""
                                },
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextBox",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "ID",
                                    "fieldDataType": "?????????",
                                    "fieldDataLength": "200",
                                    "serialize": "true",
                                    "id": "txt_768659685",
                                    "defaultType": "Const",
                                    "defaultValue": "1",
                                    "value": "8bd9b70b-7a03-5cbd-863f-bf994612647b",
                                    "success": true,
                                    "msg": ""
                                },
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextBox",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "TDEV_TEST_2_ID",
                                    "fieldDataType": "?????????",
                                    "fieldDataLength": "200",
                                    "serialize": "true",
                                    "id": "txt_768659685",
                                    "defaultType": "Const",
                                    "defaultValue": "1",
                                    "value": "f18706b9-c8a5-93cb-8be0-f7fca2d77702",
                                    "success": true,
                                    "msg": ""
                                }
                            ]
                        },
                        {
                            "desc": "???????????????",
                            "recordFieldPOList": [
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextBox",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "F_TITLE",
                                    "fieldDataType": "?????????",
                                    "fieldDataLength": "200",
                                    "serialize": "true",
                                    "id": "txt_768659685",
                                    "defaultType": "Const",
                                    "defaultValue": "1",
                                    "value": "2",
                                    "success": true,
                                    "msg": ""
                                },
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextDateTime",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "F_PUBLIC_TIME",
                                    "fieldDataType": "????????????",
                                    "fieldDataLength": "20",
                                    "serialize": "true",
                                    "id": "txt_dt_768729317",
                                    "defaultType": "EnvVar",
                                    "defaultValue": "ENV_DATETIME_YYYY_MM_DD_HH_MM_SS",
                                    "value": "2019-10-30 20:59:49",
                                    "success": true,
                                    "msg": ""
                                },
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextBox",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "ID",
                                    "fieldDataType": "?????????",
                                    "fieldDataLength": "200",
                                    "serialize": "true",
                                    "id": "txt_768659685",
                                    "defaultType": "Const",
                                    "defaultValue": "1",
                                    "value": "dbf46b13-3285-5891-ac50-ed783b8fbcda",
                                    "success": true,
                                    "msg": ""
                                },
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextBox",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "TDEV_TEST_2_ID",
                                    "fieldDataType": "?????????",
                                    "fieldDataLength": "200",
                                    "serialize": "true",
                                    "id": "txt_768659685",
                                    "defaultType": "Const",
                                    "defaultValue": "1",
                                    "value": "e6881779-ecd2-8345-03f1-7c8ef065dccb",
                                    "success": true,
                                    "msg": ""
                                }
                            ]
                        },
                        {
                            "desc": "???????????????",
                            "recordFieldPOList": [
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextBox",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "F_TITLE",
                                    "fieldDataType": "?????????",
                                    "fieldDataLength": "200",
                                    "serialize": "true",
                                    "id": "txt_768659685",
                                    "defaultType": "Const",
                                    "defaultValue": "1",
                                    "value": "22",
                                    "success": true,
                                    "msg": ""
                                },
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextDateTime",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "F_PUBLIC_TIME",
                                    "fieldDataType": "????????????",
                                    "fieldDataLength": "20",
                                    "serialize": "true",
                                    "id": "txt_dt_768729317",
                                    "defaultType": "EnvVar",
                                    "defaultValue": "ENV_DATETIME_YYYY_MM_DD_HH_MM_SS",
                                    "value": "2019-10-30 20:59:49",
                                    "success": true,
                                    "msg": ""
                                },
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextBox",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "ID",
                                    "fieldDataType": "?????????",
                                    "fieldDataLength": "200",
                                    "serialize": "true",
                                    "id": "txt_768659685",
                                    "defaultType": "Const",
                                    "defaultValue": "1",
                                    "value": "dfeeeadc-3418-89b8-2fc3-98f9263900c4",
                                    "success": true,
                                    "msg": ""
                                },
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextBox",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "TDEV_TEST_2_ID",
                                    "fieldDataType": "?????????",
                                    "fieldDataLength": "200",
                                    "serialize": "true",
                                    "id": "txt_768659685",
                                    "defaultType": "Const",
                                    "defaultValue": "1",
                                    "value": "e6881779-ecd2-8345-03f1-7c8ef065dccb",
                                    "success": true,
                                    "msg": ""
                                }
                            ]
                        },
                        {
                            "desc": "???????????????",
                            "recordFieldPOList": [
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextBox",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "F_TITLE",
                                    "fieldDataType": "?????????",
                                    "fieldDataLength": "200",
                                    "serialize": "true",
                                    "id": "txt_768659685",
                                    "defaultType": "Const",
                                    "defaultValue": "1",
                                    "value": "222",
                                    "success": true,
                                    "msg": ""
                                },
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextDateTime",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "F_PUBLIC_TIME",
                                    "fieldDataType": "????????????",
                                    "fieldDataLength": "20",
                                    "serialize": "true",
                                    "id": "txt_dt_768729317",
                                    "defaultType": "EnvVar",
                                    "defaultValue": "ENV_DATETIME_YYYY_MM_DD_HH_MM_SS",
                                    "value": "2019-10-30 20:59:49",
                                    "success": true,
                                    "msg": ""
                                },
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextBox",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "ID",
                                    "fieldDataType": "?????????",
                                    "fieldDataLength": "200",
                                    "serialize": "true",
                                    "id": "txt_768659685",
                                    "defaultType": "Const",
                                    "defaultValue": "1",
                                    "value": "005d1265-f165-34f9-dfc7-1e700ba7ffa4",
                                    "success": true,
                                    "msg": ""
                                },
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextBox",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "TDEV_TEST_2_ID",
                                    "fieldDataType": "?????????",
                                    "fieldDataLength": "200",
                                    "serialize": "true",
                                    "id": "txt_768659685",
                                    "defaultType": "Const",
                                    "defaultValue": "1",
                                    "value": "e6881779-ecd2-8345-03f1-7c8ef065dccb",
                                    "success": true,
                                    "msg": ""
                                }
                            ]
                        },
                        {
                            "desc": "???????????????",
                            "recordFieldPOList": [
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextBox",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "F_TITLE",
                                    "fieldDataType": "?????????",
                                    "fieldDataLength": "200",
                                    "serialize": "true",
                                    "id": "txt_768659685",
                                    "defaultType": "Const",
                                    "defaultValue": "1",
                                    "value": "2222",
                                    "success": true,
                                    "msg": ""
                                },
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextDateTime",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "F_PUBLIC_TIME",
                                    "fieldDataType": "????????????",
                                    "fieldDataLength": "20",
                                    "serialize": "true",
                                    "id": "txt_dt_768729317",
                                    "defaultType": "EnvVar",
                                    "defaultValue": "ENV_DATETIME_YYYY_MM_DD_HH_MM_SS",
                                    "value": "2019-10-30 20:59:49",
                                    "success": true,
                                    "msg": ""
                                },
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextBox",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "ID",
                                    "fieldDataType": "?????????",
                                    "fieldDataLength": "200",
                                    "serialize": "true",
                                    "id": "txt_768659685",
                                    "defaultType": "Const",
                                    "defaultValue": "1",
                                    "value": "058e8563-adc1-7c3d-417f-783fe19dd936",
                                    "success": true,
                                    "msg": ""
                                },
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextBox",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "TDEV_TEST_2_ID",
                                    "fieldDataType": "?????????",
                                    "fieldDataLength": "200",
                                    "serialize": "true",
                                    "id": "txt_768659685",
                                    "defaultType": "Const",
                                    "defaultValue": "1",
                                    "value": "e6881779-ecd2-8345-03f1-7c8ef065dccb",
                                    "success": true,
                                    "msg": ""
                                }
                            ]
                        },
                        {
                            "desc": "???????????????",
                            "recordFieldPOList": [
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextBox",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "F_TITLE",
                                    "fieldDataType": "?????????",
                                    "fieldDataLength": "200",
                                    "serialize": "true",
                                    "id": "txt_768659685",
                                    "defaultType": "Const",
                                    "defaultValue": "1",
                                    "value": "3",
                                    "success": true,
                                    "msg": ""
                                },
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextDateTime",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "F_PUBLIC_TIME",
                                    "fieldDataType": "????????????",
                                    "fieldDataLength": "20",
                                    "serialize": "true",
                                    "id": "txt_dt_768729317",
                                    "defaultType": "EnvVar",
                                    "defaultValue": "ENV_DATETIME_YYYY_MM_DD_HH_MM_SS",
                                    "value": "2019-10-30 21:00:12",
                                    "success": true,
                                    "msg": ""
                                },
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextBox",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "ID",
                                    "fieldDataType": "?????????",
                                    "fieldDataLength": "200",
                                    "serialize": "true",
                                    "id": "txt_768659685",
                                    "defaultType": "Const",
                                    "defaultValue": "1",
                                    "value": "82842a88-279e-4599-0f57-0b94c65b5a4c",
                                    "success": true,
                                    "msg": ""
                                },
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextBox",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "TDEV_TEST_2_ID",
                                    "fieldDataType": "?????????",
                                    "fieldDataLength": "200",
                                    "serialize": "true",
                                    "id": "txt_768659685",
                                    "defaultType": "Const",
                                    "defaultValue": "1",
                                    "value": "d9fe2f10-e5eb-f59a-58ee-787fdce751f1",
                                    "success": true,
                                    "msg": ""
                                }
                            ]
                        },
                        {
                            "desc": "???????????????",
                            "recordFieldPOList": [
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextBox",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "F_TITLE",
                                    "fieldDataType": "?????????",
                                    "fieldDataLength": "200",
                                    "serialize": "true",
                                    "id": "txt_768659685",
                                    "defaultType": "Const",
                                    "defaultValue": "1",
                                    "value": "33",
                                    "success": true,
                                    "msg": ""
                                },
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextDateTime",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "F_PUBLIC_TIME",
                                    "fieldDataType": "????????????",
                                    "fieldDataLength": "20",
                                    "serialize": "true",
                                    "id": "txt_dt_768729317",
                                    "defaultType": "EnvVar",
                                    "defaultValue": "ENV_DATETIME_YYYY_MM_DD_HH_MM_SS",
                                    "value": "2019-10-30 21:00:12",
                                    "success": true,
                                    "msg": ""
                                },
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextBox",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "ID",
                                    "fieldDataType": "?????????",
                                    "fieldDataLength": "200",
                                    "serialize": "true",
                                    "id": "txt_768659685",
                                    "defaultType": "Const",
                                    "defaultValue": "1",
                                    "value": "c2b3b86b-d6c3-cb4b-b215-6db99152b56e",
                                    "success": true,
                                    "msg": ""
                                },
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextBox",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "TDEV_TEST_2_ID",
                                    "fieldDataType": "?????????",
                                    "fieldDataLength": "200",
                                    "serialize": "true",
                                    "id": "txt_768659685",
                                    "defaultType": "Const",
                                    "defaultValue": "1",
                                    "value": "d9fe2f10-e5eb-f59a-58ee-787fdce751f1",
                                    "success": true,
                                    "msg": ""
                                }
                            ]
                        },
                        {
                            "desc": "???????????????",
                            "recordFieldPOList": [
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextBox",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "F_TITLE",
                                    "fieldDataType": "?????????",
                                    "fieldDataLength": "200",
                                    "serialize": "true",
                                    "id": "txt_768659685",
                                    "defaultType": "Const",
                                    "defaultValue": "1",
                                    "value": "333",
                                    "success": true,
                                    "msg": ""
                                },
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextDateTime",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "F_PUBLIC_TIME",
                                    "fieldDataType": "????????????",
                                    "fieldDataLength": "20",
                                    "serialize": "true",
                                    "id": "txt_dt_768729317",
                                    "defaultType": "EnvVar",
                                    "defaultValue": "ENV_DATETIME_YYYY_MM_DD_HH_MM_SS",
                                    "value": "2019-10-30 21:00:12",
                                    "success": true,
                                    "msg": ""
                                },
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextBox",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "ID",
                                    "fieldDataType": "?????????",
                                    "fieldDataLength": "200",
                                    "serialize": "true",
                                    "id": "txt_768659685",
                                    "defaultType": "Const",
                                    "defaultValue": "1",
                                    "value": "b06fc984-4548-0914-b041-e8c982151b86",
                                    "success": true,
                                    "msg": ""
                                },
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextBox",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "TDEV_TEST_2_ID",
                                    "fieldDataType": "?????????",
                                    "fieldDataLength": "200",
                                    "serialize": "true",
                                    "id": "txt_768659685",
                                    "defaultType": "Const",
                                    "defaultValue": "1",
                                    "value": "d9fe2f10-e5eb-f59a-58ee-787fdce751f1",
                                    "success": true,
                                    "msg": ""
                                }
                            ]
                        },
                        {
                            "desc": "???????????????",
                            "recordFieldPOList": [
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextBox",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "F_TITLE",
                                    "fieldDataType": "?????????",
                                    "fieldDataLength": "200",
                                    "serialize": "true",
                                    "id": "txt_768659685",
                                    "defaultType": "Const",
                                    "defaultValue": "1",
                                    "value": "3333",
                                    "success": true,
                                    "msg": ""
                                },
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextDateTime",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "F_PUBLIC_TIME",
                                    "fieldDataType": "????????????",
                                    "fieldDataLength": "20",
                                    "serialize": "true",
                                    "id": "txt_dt_768729317",
                                    "defaultType": "EnvVar",
                                    "defaultValue": "ENV_DATETIME_YYYY_MM_DD_HH_MM_SS",
                                    "value": "2019-10-30 21:00:12",
                                    "success": true,
                                    "msg": ""
                                },
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextBox",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "ID",
                                    "fieldDataType": "?????????",
                                    "fieldDataLength": "200",
                                    "serialize": "true",
                                    "id": "txt_768659685",
                                    "defaultType": "Const",
                                    "defaultValue": "1",
                                    "value": "1a648882-ce4b-af88-5471-8846962414aa",
                                    "success": true,
                                    "msg": ""
                                },
                                {
                                    "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
                                    "relationSingleName": "",
                                    "relationType": "1ToN",
                                    "singleName": "WFDCT_TextBox",
                                    "tableName": "TDEV_TEST_5",
                                    "tableCaption": "TDEV_TEST_5",
                                    "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
                                    "fieldTableId": "",
                                    "fieldName": "TDEV_TEST_2_ID",
                                    "fieldDataType": "?????????",
                                    "fieldDataLength": "200",
                                    "serialize": "true",
                                    "id": "txt_768659685",
                                    "defaultType": "Const",
                                    "defaultValue": "1",
                                    "value": "d9fe2f10-e5eb-f59a-58ee-787fdce751f1",
                                    "success": true,
                                    "msg": ""
                                }
                            ]
                        }
                    ],
                    "isMain": false
                }
            ],
            "exData": null
        }
    }
}