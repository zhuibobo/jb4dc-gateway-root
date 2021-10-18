"use strict";
"use strict";

var FormRelationPOUtility = {
  _FieldPOCache: null,
  BuildRecord: function BuildRecord(fieldPOArray, desc, recordId, outerFieldName, outerFieldValue, selfFieldName) {
    if (desc == undefined || desc == null) {
      throw "方法需要提供desc参数!";
    }

    if (recordId == undefined || recordId == null) {
      throw "方法需要提供recordId参数!";
    }

    if (outerFieldName == undefined || outerFieldName == null) {
      throw "方法需要提供outerFieldName参数!";
    }

    if (outerFieldValue == undefined || outerFieldValue == null) {
      throw "方法需要提供outerFieldValue参数!";
    }

    if (selfFieldName == undefined || selfFieldName == null) {
      throw "方法需要提供selfFieldName参数!";
    }

    return {
      "recordId": recordId,
      "desc": desc,
      "recordFieldPOList": fieldPOArray,
      "outerFieldName": outerFieldName,
      "outerFieldValue": outerFieldValue,
      "selfFieldName": selfFieldName
    };
  },
  FindRecordFieldPOArray: function FindRecordFieldPOArray(record) {
    return record.recordFieldPOList;
  },
  Add1To1DataRecordFieldPOList: function Add1To1DataRecordFieldPOList(relationPO, fieldPOList, desc, recordId, outerFieldName, outerFieldValue, selfFieldName) {
    relationPO.oneDataRecord = this.BuildRecord(fieldPOList, desc, recordId, outerFieldName, outerFieldValue, selfFieldName);
    return relationPO;
  },
  Add1To1DataRecord: function Add1To1DataRecord(relationPO, recordPO) {
    relationPO.oneDataRecord = recordPO;
    return relationPO;
  },
  Get1To1DataRecord: function Get1To1DataRecord(relationPO) {
    return relationPO.oneDataRecord;
  },
  Get1To1DataRecordFieldPOArray: function Get1To1DataRecordFieldPOArray(relationPO) {
    if (relationPO.oneDataRecord) {
      return this.FindRecordFieldPOArray(relationPO.oneDataRecord);
    }

    return null;
  },
  Add1ToNDataRecord: function Add1ToNDataRecord(relationPO, arrayData) {
    for (var i = 0; i < arrayData.length; i++) {
      if (arrayData[i].desc == undefined || arrayData[i].desc == null) {
        throw "arrayData中的数据对象需要包含desc属性!";
      }

      if (arrayData[i].recordId == undefined || arrayData[i].recordId == null) {
        throw "arrayData中的数据对象需要包含recordId属性!";
      }

      if (arrayData[i].recordFieldPOList == undefined || arrayData[i].recordFieldPOList == null) {
        throw "arrayData中的数据对象需要包含recordFieldPOList属性!";
      }

      if (arrayData[i].outerFieldName == undefined || arrayData[i].outerFieldName == null) {
        throw "arrayData中的数据对象需要包含outerFieldName属性!";
      }

      if (arrayData[i].outerFieldValue == undefined || arrayData[i].outerFieldValue == null) {
        throw "arrayData中的数据对象需要包含outerFieldValue属性!";
      }

      if (arrayData[i].selfFieldName == undefined || arrayData[i].selfFieldName == null) {
        throw "arrayData中的数据对象需要包含selfFieldName属性!";
      }
    }

    relationPO.listDataRecord = arrayData;
    return relationPO;
  },
  Get1ToNDataRecord: function Get1ToNDataRecord(relationPO) {
    return relationPO.listDataRecord;
  },
  FindFieldPOInOneDataRecordEnableNull: function FindFieldPOInOneDataRecordEnableNull(oneDataRecord, fieldName) {
    var fieldPOArray = this.FindRecordFieldPOArray(oneDataRecord);
    var fieldPO = ArrayUtility.WhereSingle(fieldPOArray, function (item) {
      return item.fieldName == fieldName;
    });

    if (fieldPO) {
      return fieldPO;
    }

    return null;
  },
  FindFieldPOInOneDataRecord: function FindFieldPOInOneDataRecord(oneDataRecord, fieldName) {
    var fieldPO = this.FindFieldPOInOneDataRecordEnableNull(oneDataRecord, fieldName);

    if (!fieldPO) {
      throw "FormRuntime.FindFieldPOInOneDataRecord:找不到字段" + fieldName + "的数据值!";
    }

    return fieldPO;
  },
  FindFieldValueInOneDataRecord: function FindFieldValueInOneDataRecord(oneDataRecord, fieldName) {
    var recordFieldPOList = this.FindRecordFieldPOArray(oneDataRecord);
    var fieldPO = ArrayUtility.WhereSingle(recordFieldPOList, function (item) {
      return item.fieldName == fieldName;
    });

    if (fieldPO) {
      return fieldPO.value;
    }

    throw "FormRuntime.FindFieldPOByRelationPO:找不到字段" + fieldName + "的数据值!";
  },
  FindIDFieldPOInOneDataRecord: function FindIDFieldPOInOneDataRecord(oneDataRecord) {
    return this.FindFieldPOInOneDataRecord(oneDataRecord, "ID");
  },
  FindFieldPOByRelationPO: function FindFieldPOByRelationPO(relationPO, fieldName) {
    var recordFieldPOList = FormRelationPOUtility.Get1To1DataRecordFieldPOArray(relationPO);
    var fieldPO = ArrayUtility.WhereSingle(recordFieldPOList, function (item) {
      return item.fieldName == fieldName;
    });

    if (fieldPO) {
      return fieldPO;
    }

    throw "FormRuntime.FindFieldPOByRelationPO:找不到字段" + fieldName + "的数据值!";
  },
  FindIdFieldPOByRelationPO: function FindIdFieldPOByRelationPO(relationPO) {
    return this.FindFieldPOByRelationPO(relationPO, "ID");
  },
  FindMainRelationPO: function FindMainRelationPO(relationPOList) {
    return ArrayUtility.WhereSingle(relationPOList, function (item) {
      return FormRelationPOUtility.IsMainRelationPO(item);
    });
  },
  IsMainRelationPO: function IsMainRelationPO(relationPO) {
    return relationPO.isMain == true || relationPO.parentId == "-1";
  },
  FindNotMainRelationPO: function FindNotMainRelationPO(relationPOList) {
    return ArrayUtility.Where(relationPOList, function (item) {
      return item.isMain != true || item.parentId != "-1";
    });
  },
  FindRelationPOById: function FindRelationPOById(relationPOList, id) {
    return ArrayUtility.WhereSingle(relationPOList, function (po) {
      return po.id == id;
    });
  },
  FindRelationPOByTableName: function FindRelationPOByTableName(relationPOList, tableName) {
    return ArrayUtility.WhereSingle(relationPOList, function (po) {
      return po.tableName == tableName;
    });
  },
  FindFieldPOInRelationFormRecordComplexPoOneDataRecord: function FindFieldPOInRelationFormRecordComplexPoOneDataRecord(relationFormRecordComplexPo, relationId, tableName, fieldName) {
    if (this._FieldPOCache == null) {
      this._FieldPOCache = {};
      var formRecordDataRelationPOList = relationFormRecordComplexPo.formRecordDataRelationPOList;

      for (var i = 0; i < formRecordDataRelationPOList.length; i++) {
        var formRecordDataRelationPO = formRecordDataRelationPOList[i];
        var innerRelationId = formRecordDataRelationPO.id;
        var fieldPOList = this.Get1To1DataRecordFieldPOArray(formRecordDataRelationPO);

        if (fieldPOList) {
          for (var j = 0; j < fieldPOList.length; j++) {
            var fieldPO = fieldPOList[j];
            var innerFieldName = fieldPO.fieldName;
            this._FieldPOCache[innerRelationId + "_" + innerFieldName] = fieldPO;
          }
        }
      }
    }

    return this._FieldPOCache[relationId + "_" + fieldName];
  },
  FindRelationPOInRelationFormRecordComplexPo: function FindRelationPOInRelationFormRecordComplexPo(relationFormRecordComplexPo, relationId) {
    return ArrayUtility.WhereSingle(relationFormRecordComplexPo.formRecordDataRelationPOList, function (item) {
      return item.id == relationId;
    });
  },
  FindParentFieldValueInFormDataRelationListWith1To1DataRecord: function FindParentFieldValueInFormDataRelationListWith1To1DataRecord(formDataRelationList, parentRelationPOId, outerFieldName, outerFieldValue) {
    var parentRelationPO = ArrayUtility.WhereSingle(this._FormDataRelationList, function (item) {
      return item.id == relationPO.parentId;
    });
  },
  CreateFieldInRecordFieldPOArray: function CreateFieldInRecordFieldPOArray(recordFieldPOArray, fieldName, fieldValue) {
    var fieldPO = JsonUtility.CloneSimple(recordFieldPOArray[0]);
    fieldPO.fieldName = fieldName;
    fieldPO.value = fieldValue;
    recordFieldPOArray.push(fieldPO);
  },
  CreateIdFieldInRecordFieldPOArray: function CreateIdFieldInRecordFieldPOArray(recordFieldPOArray, idValue, formPO, tableId) {
    if (!idValue) {
      idValue = StringUtility.Guid();
    }

    if (!tableId) {
      throw "FormRelationPOUtility.CreateIdFieldInRecordFieldPOArray:tableId不能为空!";
    }

    var pkFieldPO = ArrayUtility.WhereSingle(formPO.formRecordComplexPO.allDataRelationTableFieldsMap[tableId], function (item) {
      return item.fieldIsPk == "是";
    });
    var pkFieldName = pkFieldPO.fieldName;
    console.log(pkFieldName);
    this.CreateFieldInRecordFieldPOArray(recordFieldPOArray, pkFieldName, idValue);
  }
};
"use strict";

var FormRuntimeSinglePageObject = {
  _webFormRTParas: null,
  _formRuntimeInst: null,
  FORM_RUNTIME_CATEGORY_INDEPENDENCE: "IsIndependence",
  FORM_RUNTIME_CATEGORY_LIST: "IsDependenceList",
  getWebFormRTParasWithListButtonId: function getWebFormRTParasWithListButtonId() {
    if (!this._webFormRTParas) {
      this._webFormRTParas = {
        "FormId": BaseUtility.GetUrlParaValue("formId"),
        "ButtonId": BaseUtility.GetUrlParaValue("buttonId"),
        "OperationType": BaseUtility.GetUrlParaValue("operationType"),
        "ListFormButtonElemId": BaseUtility.GetUrlParaValue("listFormButtonElemId"),
        "RecordId": BaseUtility.GetUrlParaValue("recordId"),
        "WindowWidth": BaseUtility.GetUrlParaValue("windowWidth"),
        "WindowHeight": BaseUtility.GetUrlParaValue("windowHeight"),
        "FormRuntimeCategory": this.FORM_RUNTIME_CATEGORY_LIST
      };

      if (!this._webFormRTParas.RecordId) {
        this._webFormRTParas.RecordId = StringUtility.Guid();
      }
    }

    return this._webFormRTParas;
  },
  getWebFormRTParasWithIndependence: function getWebFormRTParasWithIndependence() {
    var formId = RuntimeGeneralInstance.TryGetMenuOuterId();

    if (StringUtility.IsNullOrEmpty(formId)) {
      formId = BaseUtility.GetUrlParaValue("formId");
    }

    if (!this._webFormRTParas) {
      this._webFormRTParas = {
        "FormId": formId,
        "ButtonId": this.FORM_RUNTIME_CATEGORY_INDEPENDENCE,
        "OperationType": this.FORM_RUNTIME_CATEGORY_INDEPENDENCE,
        "ListFormButtonElemId": this.FORM_RUNTIME_CATEGORY_INDEPENDENCE,
        "RecordId": "",
        "WindowWidth": "",
        "WindowHeight": "",
        "FormRuntimeCategory": this.FORM_RUNTIME_CATEGORY_INDEPENDENCE
      };

      if (StringUtility.IsNotNullOrEmpty(BaseUtility.GetUrlParaValue("operationType"))) {
        this._webFormRTParas.OperationType = BaseUtility.GetUrlParaValue("operationType");
      }

      ;

      if (StringUtility.IsNotNullOrEmpty(BaseUtility.GetUrlParaValue("recordId"))) {
        this._webFormRTParas.RecordId = BaseUtility.GetUrlParaValue("recordId");
      }

      ;

      if (!this._webFormRTParas.RecordId) {
        this._webFormRTParas.RecordId = StringUtility.Guid();
      }
    }

    return this._webFormRTParas;
  },
  pageReady: function pageReady(isPreview, rendererChainCompletedFunc, getWebFormRTParasFunc, pageHostInstance) {
    this._formRuntimeInst = Object.create(FormRuntime);
    var webFormRTParas = getWebFormRTParasFunc.call(this);

    this._formRuntimeInst.Initialization({
      "RendererToId": "htmlDesignRuntimeWrap",
      "FormId": webFormRTParas.FormId,
      "RecordId": webFormRTParas.RecordId,
      "ButtonId": webFormRTParas.ButtonId,
      "OperationType": webFormRTParas.OperationType,
      "IsPreview": isPreview,
      "RendererChainCompletedFunc": rendererChainCompletedFunc,
      "ListFormButtonElemId": webFormRTParas.ListFormButtonElemId,
      "WebFormRTParas": webFormRTParas,
      "FormRuntimeCategory": webFormRTParas.FormRuntimeCategory,
      "pageHostInstance111": pageHostInstance
    });

    return this._formRuntimeInst;
  }
};
var FormRuntime = {
  _Prop_Config: {
    RendererToId: null,
    FormId: "",
    RecordId: "",
    ButtonId: "",
    IsPreview: false,
    OperationType: "",
    ListFormButtonElemId: "",
    FormRuntimeCategory: "IsDependenceList",
    PreHandleFormHtmlRuntimeFunc: null
  },
  _$RendererToElem: null,
  _FormPO: null,
  _FormDataRelationList: null,
  _OriginalFormDataRelationList: null,
  _FormJSRuntimeInst: null,
  Initialization: function Initialization(_config) {
    this._Prop_Config = $.extend(true, {}, this._Prop_Config, _config);
    this._$RendererToElem = $("#" + this._Prop_Config.RendererToId);

    this._LoadHTMLToEl();

    this._LoadToPDFStyle();
  },
  _RendererChainIsCompleted: true,
  _RendererDataChainIsCompleted: true,
  _LoadHTMLToEl: function _LoadHTMLToEl() {
    var url = BaseUtility.BuildAction("/Rest/Builder/RunTime/FormRuntime/LoadHTML", {});

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
        this._FormPO.formDataRelation = "";
        this._FormDataRelationList = this._FormPO.formRecordDataRelationPOList;
        this._OriginalFormDataRelationList = JsonUtility.CloneStringify(this._FormDataRelationList);
        var formHtmlRuntime = result.data.formHtmlRuntime;

        if (typeof this._Prop_Config.PreHandleFormHtmlRuntimeFunc == "function") {
          formHtmlRuntime = this._Prop_Config.PreHandleFormHtmlRuntimeFunc(formHtmlRuntime, this, this._Prop_Config);
        }

        this._$RendererToElem.append(formHtmlRuntime);

        try {
          this._FormJSRuntimeInst = Object.create(HTMLJSRuntime);

          this._FormJSRuntimeInst.Initialization({}, this._$RendererToElem, this._FormPO.formJsContent);
        } catch (e) {
          throw "加载动态脚本错误! FormRuntime._LoadHTMLToEl-->this._FormJSRuntimeInst.Initialization:" + e;
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

        if (this.IsPreview()) {
          this.CallRendererChainCompletedFunc();
        } else {
          if (this._FormPO.listButtonEntity) {
            this.CreateALLInnerFormButton(this._FormPO.listButtonEntity);
          }
        }

        if (BaseUtility.IsUpdateOperation(this.GetOperationType()) || BaseUtility.IsViewOperation(this.GetOperationType())) {
          var formRecordComplexPO = result.data.formRecordComplexPO;
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
        throw "渲染Html控件错误! FormRuntime._LoadHTMLToEl:" + e;
      }
    }, this);
  },
  _LoadToPDFStyle: function _LoadToPDFStyle() {
    if (BaseUtility.GetUrlParaValue("ToPDF") == "ToPDF") {
      LoadJsCssUtility("/JB4DCBuilderClient/Themes/Default/Css/HTMLDesignRuntimeToPDF.css");
      console.log("加载转PDF样式!");
    }
  },
  CallRendererChainCompletedFunc: function CallRendererChainCompletedFunc() {
    var _this = this;

    if (typeof this._Prop_Config.RendererChainCompletedFunc == "function") {
      this._Prop_Config.RendererChainCompletedFunc.call(this, this._Prop_Config);
    }

    HTMLPageObjectInstanceProxy.Init(this._Prop_Config, this._FormPO);
    window.setTimeout(function () {
      HTMLPageObjectInstanceProxy.CallPageReady();
      DialogUtility.CloseDialog(DialogUtility.DialogLoadingId);
    }, 500);
  },
  IsPrint: function IsPrint() {
    return BaseUtility.GetUrlParaValue("IsPrint") == "true";
  },
  IsPreview: function IsPreview() {
    return this._Prop_Config.IsPreview;
  },
  GetRecordId: function GetRecordId() {
    return this._Prop_Config.RecordId;
  },
  GetOperationType: function GetOperationType() {
    return this._Prop_Config.OperationType;
  },
  GetOpenedListFormButtonId: function GetOpenedListFormButtonId() {
    return this._Prop_Config.ListFormButtonElemId;
  },
  GetOriginalFormDataRelation: function GetOriginalFormDataRelation() {
    return JsonUtility.CloneStringify(this._OriginalFormDataRelationList);
  },
  GetFormPO: function GetFormPO() {
    return this._FormPO;
  },
  SerializationFormData: function SerializationFormData() {
    var formRecordComplexPo = {
      recordId: this._Prop_Config.RecordId,
      formId: this._Prop_Config.FormId,
      buttonId: this._Prop_Config.ButtonId,
      formRuntimeCategory: this._Prop_Config.FormRuntimeCategory,
      formRecordDataRelationPOList: null,
      exData: null
    };
    var originalFormDataRelation = this.GetOriginalFormDataRelation();

    for (var i = 0; i < originalFormDataRelation.length; i++) {
      var singleRelation = originalFormDataRelation[i];
      var relationSingleName = singleRelation.singleName;
      var tableName = singleRelation.tableName;
      var tableId = singleRelation.tableId;
      var isMain = singleRelation.main;
      singleRelation.isMain = isMain;

      if (isMain) {
        singleRelation.relationType = "1To1";
      }

      var relationType = singleRelation.relationType;

      if (relationType == "1To1") {
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

        if (isMain) {
          FormRelationPOUtility.CreateIdFieldInRecordFieldPOArray(oneRowRecord, formRecordComplexPo.recordId, this.GetFormPO(), tableId);
          recordId = formRecordComplexPo.recordId;
          outerFieldName = "NotOuterField";
          outerFieldValue = "NotOuterField";
          selfFieldName = "NotOuterField";
        } else {
          recordId = FormRelationPOUtility.FindFieldPOInOneDataRecord(oneRowRecord, singleRelation.pkFieldName).value;
          outerFieldName = singleRelation.outerKeyFieldName;
          outerFieldValue = singleRelation.outerKeyFieldName;
          selfFieldName = singleRelation.selfKeyFieldName;
        }

        FormRelationPOUtility.Add1To1DataRecordFieldPOList(singleRelation, oneRowRecord, "", recordId, outerFieldName, outerFieldValue, selfFieldName);
      } else {
        var control = $("[serialize='true'][control_category='DynamicContainer'][relation_po_id='" + singleRelation.id + "']");

        if (control.length > 0) {
          var controlInstance = HTMLControl.GetControlInstanceByElem(control);
          controlInstance.SerializationValue(originalFormDataRelation, singleRelation, control);
        }
      }
    }

    formRecordComplexPo.formRecordDataRelationPOList = originalFormDataRelation;
    return formRecordComplexPo;
  },
  DeSerializationFormData: function DeSerializationFormData(relationFormRecordComplexPo) {
    VirtualBodyControl.RendererDataChain({
      $rootElem: this._$RendererToElem,
      $parentControlElem: this._$RendererToElem,
      $singleControlElem: this._$RendererToElem,
      formRuntimeInstance: this,
      relationFormRecordComplexPo: relationFormRecordComplexPo,
      callToViewStatusFunc: BaseUtility.IsViewOperation(this.GetOperationType())
    });
  },
  CreateALLInnerFormButton: function CreateALLInnerFormButton(listButtonPO) {
    if (!StringUtility.IsNullOrEmpty(listButtonPO.buttonInnerConfig)) {
      var buttonInnerConfig = JsonUtility.StringToJson(listButtonPO.buttonInnerConfig);

      for (var i = 0; i < buttonInnerConfig.length; i++) {
        var innerButtonConfig = buttonInnerConfig[i];
        var buttonElem = InnerFormButtonRuntime.RendererSingleInnerFormButton(innerButtonConfig, this, listButtonPO);
        $("#innerButtonWrapOuter").append(buttonElem);
      }
    }
  },
  GetWebFormRTParas: function GetWebFormRTParas() {
    return this._Prop_Config.WebFormRTParas;
  }
};
var FormRuntimeMockDataPool = {
  mockDataPool: {},
  SaveData: function SaveData(groupName, recordId, data) {
    var key = groupName + "-" + recordId;
    this.mockDataPool[key] = data;
  },
  GetData: function GetData(groupName, recordId) {
    var key = groupName + "-" + recordId;

    if (this.mockDataPool[key]) {
      return this.mockDataPool[key];
    }

    return null;
  },
  SaveDataToParentPool: function SaveDataToParentPool(groupName, recordId, data) {
    window.parent.FormRuntimeMockDataPool.SaveData(groupName, recordId, data);
  },
  GetDataFromParentPool: function GetDataFromParentPool(groupName, recordId) {
    return window.parent.FormRuntimeMockDataPool.GetData(groupName, recordId);
  },
  GetMockData: function GetMockData() {
    return {
      "recordId": "",
      "formId": "34db0d6f-7978-4acf-8a45-13a6ee5f63e2",
      "buttonId": "",
      "formRecordDataRelationPOList": [{
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
        "tableCaption": "开发测试表11",
        "tableCode": "T_10437",
        "displayText": "TDEV_TEST_1[开发测试表1]",
        "icon": "/Themes/Png16X16/table.png",
        "isMain": true,
        "oneDataRecord": {
          "desc": "一对一数据",
          "recordFieldPOList": [{
            "relationId": "d9bc9332-3c94-28bb-1c11-049764c69eb5",
            "relationSingleName": "",
            "relationType": "1To1",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_1",
            "tableCaption": "开发测试表1",
            "tableId": "TDEV_TEST_1",
            "fieldTableId": "",
            "fieldName": "F_TITLE",
            "fieldDataType": "字符串",
            "fieldDataLength": "200",
            "serialize": "true",
            "id": "txt_897949295",
            "defaultType": "Const",
            "defaultValue": "测试",
            "value": "测试15",
            "success": true,
            "msg": ""
          }, {
            "relationId": "d9bc9332-3c94-28bb-1c11-049764c69eb5",
            "relationSingleName": "",
            "relationType": "1To1",
            "singleName": "WFDCT_TextDateTime",
            "tableName": "TDEV_TEST_1",
            "tableCaption": "开发测试表1",
            "tableId": "TDEV_TEST_1",
            "fieldTableId": "",
            "fieldName": "F_PUBLIC_TIME",
            "fieldDataType": "日期时间",
            "fieldDataLength": "20",
            "serialize": "true",
            "id": "txt_dt_375186891",
            "defaultType": "EnvVar",
            "defaultValue": "ENV_DATETIME_YYYY_MM_DD",
            "value": "2019-10-31",
            "success": true,
            "msg": ""
          }, {
            "relationId": "d9bc9332-3c94-28bb-1c11-049764c69eb5",
            "relationSingleName": "",
            "relationType": "1To1",
            "singleName": "WFDCT_DropDownSelect",
            "tableName": "TDEV_TEST_1",
            "tableCaption": "开发测试表1",
            "tableId": "TDEV_TEST_1",
            "fieldTableId": "",
            "fieldName": "F_PUBLIC_STATUS",
            "fieldDataType": "字符串",
            "fieldDataLength": "50",
            "serialize": "true",
            "id": "sel_246410688",
            "defaultType": "",
            "defaultValue": "",
            "value": "4",
            "success": true,
            "msg": ""
          }, {
            "relationId": "d9bc9332-3c94-28bb-1c11-049764c69eb5",
            "relationSingleName": "",
            "relationType": "1To1",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_1",
            "tableCaption": "开发测试表1",
            "tableId": "TDEV_TEST_1",
            "fieldTableId": "",
            "fieldName": "F_ORGAN_ID",
            "fieldDataType": "字符串",
            "fieldDataLength": "50",
            "serialize": "true",
            "id": "txt_897909755",
            "defaultType": "EnvVar",
            "defaultValue": "ENV_SYSTEM_CURRENT_USER_ORGAN_ID",
            "value": "10001",
            "success": true,
            "msg": ""
          }, {
            "relationId": "d9bc9332-3c94-28bb-1c11-049764c69eb5",
            "relationSingleName": "",
            "relationType": "1To1",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_1",
            "tableCaption": "开发测试表1",
            "tableId": "TDEV_TEST_1",
            "fieldTableId": "",
            "fieldName": "ID",
            "fieldDataType": "字符串",
            "fieldDataLength": "200",
            "serialize": "true",
            "id": "txt_897949295",
            "defaultType": "Const",
            "defaultValue": "测试",
            "value": "0d561c0e-b83b-a9ff-c88a-652d4a4aa256",
            "success": true,
            "msg": ""
          }]
        }
      }, {
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
        "tableCaption": "开发测试表2",
        "tableCode": "T_10438",
        "displayText": "TDEV_TEST_2[开发测试表2](1ToN)",
        "icon": "/Themes/Png16X16/table.png",
        "isMain": false,
        "listDataRecord": [{
          "desc": "一对一数据",
          "recordFieldPOList": [{
            "relationId": "19e5f4ea-4fba-4f4b-0d3b-8b6f56ddeda1",
            "relationSingleName": "",
            "relationType": "1To1",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_2",
            "tableCaption": "开发测试表2",
            "tableId": "TDEV_TEST_2",
            "fieldTableId": "",
            "fieldName": "F_TITLE",
            "fieldDataType": "字符串",
            "fieldDataLength": "200",
            "serialize": "true",
            "id": "txt_698035082",
            "defaultType": "Const",
            "defaultValue": "1",
            "value": "1",
            "success": true,
            "msg": ""
          }, {
            "relationId": "19e5f4ea-4fba-4f4b-0d3b-8b6f56ddeda1",
            "relationSingleName": "",
            "relationType": "1To1",
            "singleName": "WFDCT_TextDateTime",
            "tableName": "TDEV_TEST_2",
            "tableCaption": "开发测试表2",
            "tableId": "TDEV_TEST_2",
            "fieldTableId": "",
            "fieldName": "F_PUBLIC_TIME",
            "fieldDataType": "日期时间",
            "fieldDataLength": "20",
            "serialize": "true",
            "id": "txt_dt_698060281",
            "defaultType": "EnvVar",
            "defaultValue": "ENV_DATETIME_YYYY_MM_DD",
            "value": "2019-10-30",
            "success": true,
            "msg": ""
          }, {
            "relationId": "19e5f4ea-4fba-4f4b-0d3b-8b6f56ddeda1",
            "relationSingleName": "",
            "relationType": "1To1",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_2",
            "tableCaption": "开发测试表2",
            "tableId": "TDEV_TEST_2",
            "fieldTableId": "",
            "fieldName": "ID",
            "fieldDataType": "字符串",
            "fieldDataLength": "200",
            "serialize": "true",
            "id": "txt_698035082",
            "defaultType": "Const",
            "defaultValue": "1",
            "value": "f18706b9-c8a5-93cb-8be0-f7fca2d77702",
            "success": true,
            "msg": ""
          }]
        }, {
          "desc": "一对一数据",
          "recordFieldPOList": [{
            "relationId": "19e5f4ea-4fba-4f4b-0d3b-8b6f56ddeda1",
            "relationSingleName": "",
            "relationType": "1To1",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_2",
            "tableCaption": "开发测试表2",
            "tableId": "TDEV_TEST_2",
            "fieldTableId": "",
            "fieldName": "F_TITLE",
            "fieldDataType": "字符串",
            "fieldDataLength": "200",
            "serialize": "true",
            "id": "txt_698035082",
            "defaultType": "Const",
            "defaultValue": "1",
            "value": "2",
            "success": true,
            "msg": ""
          }, {
            "relationId": "19e5f4ea-4fba-4f4b-0d3b-8b6f56ddeda1",
            "relationSingleName": "",
            "relationType": "1To1",
            "singleName": "WFDCT_TextDateTime",
            "tableName": "TDEV_TEST_2",
            "tableCaption": "开发测试表2",
            "tableId": "TDEV_TEST_2",
            "fieldTableId": "",
            "fieldName": "F_PUBLIC_TIME",
            "fieldDataType": "日期时间",
            "fieldDataLength": "20",
            "serialize": "true",
            "id": "txt_dt_698060281",
            "defaultType": "EnvVar",
            "defaultValue": "ENV_DATETIME_YYYY_MM_DD",
            "value": "2019-10-30",
            "success": true,
            "msg": ""
          }, {
            "relationId": "19e5f4ea-4fba-4f4b-0d3b-8b6f56ddeda1",
            "relationSingleName": "",
            "relationType": "1To1",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_2",
            "tableCaption": "开发测试表2",
            "tableId": "TDEV_TEST_2",
            "fieldTableId": "",
            "fieldName": "ID",
            "fieldDataType": "字符串",
            "fieldDataLength": "200",
            "serialize": "true",
            "id": "txt_698035082",
            "defaultType": "Const",
            "defaultValue": "1",
            "value": "e6881779-ecd2-8345-03f1-7c8ef065dccb",
            "success": true,
            "msg": ""
          }]
        }, {
          "desc": "一对一数据",
          "recordFieldPOList": [{
            "relationId": "19e5f4ea-4fba-4f4b-0d3b-8b6f56ddeda1",
            "relationSingleName": "",
            "relationType": "1To1",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_2",
            "tableCaption": "开发测试表2",
            "tableId": "TDEV_TEST_2",
            "fieldTableId": "",
            "fieldName": "F_TITLE",
            "fieldDataType": "字符串",
            "fieldDataLength": "200",
            "serialize": "true",
            "id": "txt_698035082",
            "defaultType": "Const",
            "defaultValue": "1",
            "value": "3",
            "success": true,
            "msg": ""
          }, {
            "relationId": "19e5f4ea-4fba-4f4b-0d3b-8b6f56ddeda1",
            "relationSingleName": "",
            "relationType": "1To1",
            "singleName": "WFDCT_TextDateTime",
            "tableName": "TDEV_TEST_2",
            "tableCaption": "开发测试表2",
            "tableId": "TDEV_TEST_2",
            "fieldTableId": "",
            "fieldName": "F_PUBLIC_TIME",
            "fieldDataType": "日期时间",
            "fieldDataLength": "20",
            "serialize": "true",
            "id": "txt_dt_698060281",
            "defaultType": "EnvVar",
            "defaultValue": "ENV_DATETIME_YYYY_MM_DD",
            "value": "2019-10-30",
            "success": true,
            "msg": ""
          }, {
            "relationId": "19e5f4ea-4fba-4f4b-0d3b-8b6f56ddeda1",
            "relationSingleName": "",
            "relationType": "1To1",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_2",
            "tableCaption": "开发测试表2",
            "tableId": "TDEV_TEST_2",
            "fieldTableId": "",
            "fieldName": "ID",
            "fieldDataType": "字符串",
            "fieldDataLength": "200",
            "serialize": "true",
            "id": "txt_698035082",
            "defaultType": "Const",
            "defaultValue": "1",
            "value": "d9fe2f10-e5eb-f59a-58ee-787fdce751f1",
            "success": true,
            "msg": ""
          }]
        }]
      }, {
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
        "listDataRecord": [{
          "desc": "一对一数据",
          "recordFieldPOList": [{
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "F_TITLE",
            "fieldDataType": "字符串",
            "fieldDataLength": "200",
            "serialize": "true",
            "id": "txt_768659685",
            "defaultType": "Const",
            "defaultValue": "1",
            "value": "1",
            "success": true,
            "msg": ""
          }, {
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextDateTime",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "F_PUBLIC_TIME",
            "fieldDataType": "日期时间",
            "fieldDataLength": "20",
            "serialize": "true",
            "id": "txt_dt_768729317",
            "defaultType": "EnvVar",
            "defaultValue": "ENV_DATETIME_YYYY_MM_DD_HH_MM_SS",
            "value": "2019-10-30 20:59:32",
            "success": true,
            "msg": ""
          }, {
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "ID",
            "fieldDataType": "字符串",
            "fieldDataLength": "200",
            "serialize": "true",
            "id": "txt_768659685",
            "defaultType": "Const",
            "defaultValue": "1",
            "value": "8be67086-3f2e-9eb7-7b9d-f5350db9de92",
            "success": true,
            "msg": ""
          }, {
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "TDEV_TEST_2_ID",
            "fieldDataType": "字符串",
            "fieldDataLength": "200",
            "serialize": "true",
            "id": "txt_768659685",
            "defaultType": "Const",
            "defaultValue": "1",
            "value": "f18706b9-c8a5-93cb-8be0-f7fca2d77702",
            "success": true,
            "msg": ""
          }]
        }, {
          "desc": "一对一数据",
          "recordFieldPOList": [{
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "F_TITLE",
            "fieldDataType": "字符串",
            "fieldDataLength": "200",
            "serialize": "true",
            "id": "txt_768659685",
            "defaultType": "Const",
            "defaultValue": "1",
            "value": "11",
            "success": true,
            "msg": ""
          }, {
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextDateTime",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "F_PUBLIC_TIME",
            "fieldDataType": "日期时间",
            "fieldDataLength": "20",
            "serialize": "true",
            "id": "txt_dt_768729317",
            "defaultType": "EnvVar",
            "defaultValue": "ENV_DATETIME_YYYY_MM_DD_HH_MM_SS",
            "value": "2019-10-30 20:59:32",
            "success": true,
            "msg": ""
          }, {
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "ID",
            "fieldDataType": "字符串",
            "fieldDataLength": "200",
            "serialize": "true",
            "id": "txt_768659685",
            "defaultType": "Const",
            "defaultValue": "1",
            "value": "3a4f512f-5fd5-2d8f-98a0-6e8aa0178999",
            "success": true,
            "msg": ""
          }, {
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "TDEV_TEST_2_ID",
            "fieldDataType": "字符串",
            "fieldDataLength": "200",
            "serialize": "true",
            "id": "txt_768659685",
            "defaultType": "Const",
            "defaultValue": "1",
            "value": "f18706b9-c8a5-93cb-8be0-f7fca2d77702",
            "success": true,
            "msg": ""
          }]
        }, {
          "desc": "一对一数据",
          "recordFieldPOList": [{
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "F_TITLE",
            "fieldDataType": "字符串",
            "fieldDataLength": "200",
            "serialize": "true",
            "id": "txt_768659685",
            "defaultType": "Const",
            "defaultValue": "1",
            "value": "111",
            "success": true,
            "msg": ""
          }, {
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextDateTime",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "F_PUBLIC_TIME",
            "fieldDataType": "日期时间",
            "fieldDataLength": "20",
            "serialize": "true",
            "id": "txt_dt_768729317",
            "defaultType": "EnvVar",
            "defaultValue": "ENV_DATETIME_YYYY_MM_DD_HH_MM_SS",
            "value": "2019-10-30 20:59:32",
            "success": true,
            "msg": ""
          }, {
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "ID",
            "fieldDataType": "字符串",
            "fieldDataLength": "200",
            "serialize": "true",
            "id": "txt_768659685",
            "defaultType": "Const",
            "defaultValue": "1",
            "value": "85be9cb5-48bc-ec01-6f0c-7a634934f25e",
            "success": true,
            "msg": ""
          }, {
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "TDEV_TEST_2_ID",
            "fieldDataType": "字符串",
            "fieldDataLength": "200",
            "serialize": "true",
            "id": "txt_768659685",
            "defaultType": "Const",
            "defaultValue": "1",
            "value": "f18706b9-c8a5-93cb-8be0-f7fca2d77702",
            "success": true,
            "msg": ""
          }]
        }, {
          "desc": "一对一数据",
          "recordFieldPOList": [{
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "F_TITLE",
            "fieldDataType": "字符串",
            "fieldDataLength": "200",
            "serialize": "true",
            "id": "txt_768659685",
            "defaultType": "Const",
            "defaultValue": "1",
            "value": "1111",
            "success": true,
            "msg": ""
          }, {
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextDateTime",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "F_PUBLIC_TIME",
            "fieldDataType": "日期时间",
            "fieldDataLength": "20",
            "serialize": "true",
            "id": "txt_dt_768729317",
            "defaultType": "EnvVar",
            "defaultValue": "ENV_DATETIME_YYYY_MM_DD_HH_MM_SS",
            "value": "2019-10-30 20:59:32",
            "success": true,
            "msg": ""
          }, {
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "ID",
            "fieldDataType": "字符串",
            "fieldDataLength": "200",
            "serialize": "true",
            "id": "txt_768659685",
            "defaultType": "Const",
            "defaultValue": "1",
            "value": "8bd9b70b-7a03-5cbd-863f-bf994612647b",
            "success": true,
            "msg": ""
          }, {
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "TDEV_TEST_2_ID",
            "fieldDataType": "字符串",
            "fieldDataLength": "200",
            "serialize": "true",
            "id": "txt_768659685",
            "defaultType": "Const",
            "defaultValue": "1",
            "value": "f18706b9-c8a5-93cb-8be0-f7fca2d77702",
            "success": true,
            "msg": ""
          }]
        }, {
          "desc": "一对一数据",
          "recordFieldPOList": [{
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "F_TITLE",
            "fieldDataType": "字符串",
            "fieldDataLength": "200",
            "serialize": "true",
            "id": "txt_768659685",
            "defaultType": "Const",
            "defaultValue": "1",
            "value": "2",
            "success": true,
            "msg": ""
          }, {
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextDateTime",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "F_PUBLIC_TIME",
            "fieldDataType": "日期时间",
            "fieldDataLength": "20",
            "serialize": "true",
            "id": "txt_dt_768729317",
            "defaultType": "EnvVar",
            "defaultValue": "ENV_DATETIME_YYYY_MM_DD_HH_MM_SS",
            "value": "2019-10-30 20:59:49",
            "success": true,
            "msg": ""
          }, {
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "ID",
            "fieldDataType": "字符串",
            "fieldDataLength": "200",
            "serialize": "true",
            "id": "txt_768659685",
            "defaultType": "Const",
            "defaultValue": "1",
            "value": "dbf46b13-3285-5891-ac50-ed783b8fbcda",
            "success": true,
            "msg": ""
          }, {
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "TDEV_TEST_2_ID",
            "fieldDataType": "字符串",
            "fieldDataLength": "200",
            "serialize": "true",
            "id": "txt_768659685",
            "defaultType": "Const",
            "defaultValue": "1",
            "value": "e6881779-ecd2-8345-03f1-7c8ef065dccb",
            "success": true,
            "msg": ""
          }]
        }, {
          "desc": "一对一数据",
          "recordFieldPOList": [{
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "F_TITLE",
            "fieldDataType": "字符串",
            "fieldDataLength": "200",
            "serialize": "true",
            "id": "txt_768659685",
            "defaultType": "Const",
            "defaultValue": "1",
            "value": "22",
            "success": true,
            "msg": ""
          }, {
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextDateTime",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "F_PUBLIC_TIME",
            "fieldDataType": "日期时间",
            "fieldDataLength": "20",
            "serialize": "true",
            "id": "txt_dt_768729317",
            "defaultType": "EnvVar",
            "defaultValue": "ENV_DATETIME_YYYY_MM_DD_HH_MM_SS",
            "value": "2019-10-30 20:59:49",
            "success": true,
            "msg": ""
          }, {
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "ID",
            "fieldDataType": "字符串",
            "fieldDataLength": "200",
            "serialize": "true",
            "id": "txt_768659685",
            "defaultType": "Const",
            "defaultValue": "1",
            "value": "dfeeeadc-3418-89b8-2fc3-98f9263900c4",
            "success": true,
            "msg": ""
          }, {
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "TDEV_TEST_2_ID",
            "fieldDataType": "字符串",
            "fieldDataLength": "200",
            "serialize": "true",
            "id": "txt_768659685",
            "defaultType": "Const",
            "defaultValue": "1",
            "value": "e6881779-ecd2-8345-03f1-7c8ef065dccb",
            "success": true,
            "msg": ""
          }]
        }, {
          "desc": "一对一数据",
          "recordFieldPOList": [{
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "F_TITLE",
            "fieldDataType": "字符串",
            "fieldDataLength": "200",
            "serialize": "true",
            "id": "txt_768659685",
            "defaultType": "Const",
            "defaultValue": "1",
            "value": "222",
            "success": true,
            "msg": ""
          }, {
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextDateTime",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "F_PUBLIC_TIME",
            "fieldDataType": "日期时间",
            "fieldDataLength": "20",
            "serialize": "true",
            "id": "txt_dt_768729317",
            "defaultType": "EnvVar",
            "defaultValue": "ENV_DATETIME_YYYY_MM_DD_HH_MM_SS",
            "value": "2019-10-30 20:59:49",
            "success": true,
            "msg": ""
          }, {
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "ID",
            "fieldDataType": "字符串",
            "fieldDataLength": "200",
            "serialize": "true",
            "id": "txt_768659685",
            "defaultType": "Const",
            "defaultValue": "1",
            "value": "005d1265-f165-34f9-dfc7-1e700ba7ffa4",
            "success": true,
            "msg": ""
          }, {
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "TDEV_TEST_2_ID",
            "fieldDataType": "字符串",
            "fieldDataLength": "200",
            "serialize": "true",
            "id": "txt_768659685",
            "defaultType": "Const",
            "defaultValue": "1",
            "value": "e6881779-ecd2-8345-03f1-7c8ef065dccb",
            "success": true,
            "msg": ""
          }]
        }, {
          "desc": "一对一数据",
          "recordFieldPOList": [{
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "F_TITLE",
            "fieldDataType": "字符串",
            "fieldDataLength": "200",
            "serialize": "true",
            "id": "txt_768659685",
            "defaultType": "Const",
            "defaultValue": "1",
            "value": "2222",
            "success": true,
            "msg": ""
          }, {
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextDateTime",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "F_PUBLIC_TIME",
            "fieldDataType": "日期时间",
            "fieldDataLength": "20",
            "serialize": "true",
            "id": "txt_dt_768729317",
            "defaultType": "EnvVar",
            "defaultValue": "ENV_DATETIME_YYYY_MM_DD_HH_MM_SS",
            "value": "2019-10-30 20:59:49",
            "success": true,
            "msg": ""
          }, {
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "ID",
            "fieldDataType": "字符串",
            "fieldDataLength": "200",
            "serialize": "true",
            "id": "txt_768659685",
            "defaultType": "Const",
            "defaultValue": "1",
            "value": "058e8563-adc1-7c3d-417f-783fe19dd936",
            "success": true,
            "msg": ""
          }, {
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "TDEV_TEST_2_ID",
            "fieldDataType": "字符串",
            "fieldDataLength": "200",
            "serialize": "true",
            "id": "txt_768659685",
            "defaultType": "Const",
            "defaultValue": "1",
            "value": "e6881779-ecd2-8345-03f1-7c8ef065dccb",
            "success": true,
            "msg": ""
          }]
        }, {
          "desc": "一对一数据",
          "recordFieldPOList": [{
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "F_TITLE",
            "fieldDataType": "字符串",
            "fieldDataLength": "200",
            "serialize": "true",
            "id": "txt_768659685",
            "defaultType": "Const",
            "defaultValue": "1",
            "value": "3",
            "success": true,
            "msg": ""
          }, {
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextDateTime",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "F_PUBLIC_TIME",
            "fieldDataType": "日期时间",
            "fieldDataLength": "20",
            "serialize": "true",
            "id": "txt_dt_768729317",
            "defaultType": "EnvVar",
            "defaultValue": "ENV_DATETIME_YYYY_MM_DD_HH_MM_SS",
            "value": "2019-10-30 21:00:12",
            "success": true,
            "msg": ""
          }, {
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "ID",
            "fieldDataType": "字符串",
            "fieldDataLength": "200",
            "serialize": "true",
            "id": "txt_768659685",
            "defaultType": "Const",
            "defaultValue": "1",
            "value": "82842a88-279e-4599-0f57-0b94c65b5a4c",
            "success": true,
            "msg": ""
          }, {
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "TDEV_TEST_2_ID",
            "fieldDataType": "字符串",
            "fieldDataLength": "200",
            "serialize": "true",
            "id": "txt_768659685",
            "defaultType": "Const",
            "defaultValue": "1",
            "value": "d9fe2f10-e5eb-f59a-58ee-787fdce751f1",
            "success": true,
            "msg": ""
          }]
        }, {
          "desc": "一对一数据",
          "recordFieldPOList": [{
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "F_TITLE",
            "fieldDataType": "字符串",
            "fieldDataLength": "200",
            "serialize": "true",
            "id": "txt_768659685",
            "defaultType": "Const",
            "defaultValue": "1",
            "value": "33",
            "success": true,
            "msg": ""
          }, {
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextDateTime",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "F_PUBLIC_TIME",
            "fieldDataType": "日期时间",
            "fieldDataLength": "20",
            "serialize": "true",
            "id": "txt_dt_768729317",
            "defaultType": "EnvVar",
            "defaultValue": "ENV_DATETIME_YYYY_MM_DD_HH_MM_SS",
            "value": "2019-10-30 21:00:12",
            "success": true,
            "msg": ""
          }, {
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "ID",
            "fieldDataType": "字符串",
            "fieldDataLength": "200",
            "serialize": "true",
            "id": "txt_768659685",
            "defaultType": "Const",
            "defaultValue": "1",
            "value": "c2b3b86b-d6c3-cb4b-b215-6db99152b56e",
            "success": true,
            "msg": ""
          }, {
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "TDEV_TEST_2_ID",
            "fieldDataType": "字符串",
            "fieldDataLength": "200",
            "serialize": "true",
            "id": "txt_768659685",
            "defaultType": "Const",
            "defaultValue": "1",
            "value": "d9fe2f10-e5eb-f59a-58ee-787fdce751f1",
            "success": true,
            "msg": ""
          }]
        }, {
          "desc": "一对一数据",
          "recordFieldPOList": [{
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "F_TITLE",
            "fieldDataType": "字符串",
            "fieldDataLength": "200",
            "serialize": "true",
            "id": "txt_768659685",
            "defaultType": "Const",
            "defaultValue": "1",
            "value": "333",
            "success": true,
            "msg": ""
          }, {
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextDateTime",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "F_PUBLIC_TIME",
            "fieldDataType": "日期时间",
            "fieldDataLength": "20",
            "serialize": "true",
            "id": "txt_dt_768729317",
            "defaultType": "EnvVar",
            "defaultValue": "ENV_DATETIME_YYYY_MM_DD_HH_MM_SS",
            "value": "2019-10-30 21:00:12",
            "success": true,
            "msg": ""
          }, {
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "ID",
            "fieldDataType": "字符串",
            "fieldDataLength": "200",
            "serialize": "true",
            "id": "txt_768659685",
            "defaultType": "Const",
            "defaultValue": "1",
            "value": "b06fc984-4548-0914-b041-e8c982151b86",
            "success": true,
            "msg": ""
          }, {
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "TDEV_TEST_2_ID",
            "fieldDataType": "字符串",
            "fieldDataLength": "200",
            "serialize": "true",
            "id": "txt_768659685",
            "defaultType": "Const",
            "defaultValue": "1",
            "value": "d9fe2f10-e5eb-f59a-58ee-787fdce751f1",
            "success": true,
            "msg": ""
          }]
        }, {
          "desc": "一对一数据",
          "recordFieldPOList": [{
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "F_TITLE",
            "fieldDataType": "字符串",
            "fieldDataLength": "200",
            "serialize": "true",
            "id": "txt_768659685",
            "defaultType": "Const",
            "defaultValue": "1",
            "value": "3333",
            "success": true,
            "msg": ""
          }, {
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextDateTime",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "F_PUBLIC_TIME",
            "fieldDataType": "日期时间",
            "fieldDataLength": "20",
            "serialize": "true",
            "id": "txt_dt_768729317",
            "defaultType": "EnvVar",
            "defaultValue": "ENV_DATETIME_YYYY_MM_DD_HH_MM_SS",
            "value": "2019-10-30 21:00:12",
            "success": true,
            "msg": ""
          }, {
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "ID",
            "fieldDataType": "字符串",
            "fieldDataLength": "200",
            "serialize": "true",
            "id": "txt_768659685",
            "defaultType": "Const",
            "defaultValue": "1",
            "value": "1a648882-ce4b-af88-5471-8846962414aa",
            "success": true,
            "msg": ""
          }, {
            "relationId": "fd6cc1a1-822b-7a6c-9ee4-f0e6d36bd538",
            "relationSingleName": "",
            "relationType": "1ToN",
            "singleName": "WFDCT_TextBox",
            "tableName": "TDEV_TEST_5",
            "tableCaption": "TDEV_TEST_5",
            "tableId": "e15549cb-e074-48a3-8939-44340e387f17",
            "fieldTableId": "",
            "fieldName": "TDEV_TEST_2_ID",
            "fieldDataType": "字符串",
            "fieldDataLength": "200",
            "serialize": "true",
            "id": "txt_768659685",
            "defaultType": "Const",
            "defaultValue": "1",
            "value": "d9fe2f10-e5eb-f59a-58ee-787fdce751f1",
            "success": true,
            "msg": ""
          }]
        }],
        "isMain": false
      }],
      "exData": null
    };
  }
};
"use strict";

var HTMLJSRuntime = {
  _Prop_Config: {},
  _$RendererToElem: null,
  _JsContent: null,
  _ReplaceContextPath: function _ReplaceContextPath(source) {
    try {
      var contextPath = BaseUtility.GetRootPath();
      return source.replace(/\$\{contextPath\}/g, contextPath);
    } catch (e) {
      throw "_ReplaceContextPath:" + e;
    }
  },
  _ReplaceTimeStamp: function _ReplaceTimeStamp(source) {
    try {
      var timestamp = new Date().getTime();
      return source.replace(/\$\{timeStamp\}/g, timestamp);
    } catch (e) {
      throw "_ReplaceTimeStamp:" + e;
    }
  },
  ReplaceJSParas: function ReplaceJSParas(source) {
    try {
      var resultJs = this._ReplaceContextPath(source);

      resultJs = this._ReplaceTimeStamp(resultJs);
      return resultJs;
    } catch (e) {
      throw "ReplaceJSParas:" + e;
    }
  },
  Initialization: function Initialization(_config, $rendererToElem, jsContent) {
    this._Prop_Config = $.extend(true, {}, this._Prop_Config, _config);
    this._$RendererToElem = $rendererToElem;
    this._JsContent = jsContent;

    this._LoadJSToEl();
  },
  _LoadJSToEl: function _LoadJSToEl() {
    this._$RendererToElem.append(this.ReplaceJSParas(this._JsContent));
  }
};
"use strict";

var HTMLPageObjectInstanceProxy = {
  webFormRTParas: null,
  htmlPO: null,
  formRecordComplexPO: null,
  FormPageObjectInstance: null,
  BuilderListPageRuntimeInstance: null,
  Init: function Init(webFormRTParas, htmlPO) {
    this.webFormRTParas = webFormRTParas;
    this.htmlPO = htmlPO;

    if (this.htmlPO.formRecordComplexPO) {
      this.formRecordComplexPO = this.htmlPO.formRecordComplexPO;
    }
  },
  CallPageReady: function CallPageReady() {
    if (typeof FormPageObjectInstance != "undefined") {
      this.FormPageObjectInstance = FormPageObjectInstance;
    }

    if (this.FormPageObjectInstance) {
      this.FormPageObjectInstance.data.webFormRTParas = this.webFormRTParas;
      this.FormPageObjectInstance.data.formPO = this.htmlPO;
      this.FormPageObjectInstance.data.formRecordComplexPO = this.formRecordComplexPO;

      if (this.FormPageObjectInstance.pageReady) {
        this.FormPageObjectInstance.pageReady();
      }

      if (this.FormPageObjectInstance.bindRecordDataReady) {
        this.FormPageObjectInstance.bindRecordDataReady();
      }
    }

    if (typeof BuilderListPageRuntimeInstance != "undefined") {
      this.BuilderListPageRuntimeInstance = BuilderListPageRuntimeInstance;
    }

    if (this.BuilderListPageRuntimeInstance) {
      if (!this.BuilderListPageRuntimeInstance.data) {
        this.BuilderListPageRuntimeInstance.data = {};
      }

      this.BuilderListPageRuntimeInstance.data.listPO = this.htmlPO;

      if (this.BuilderListPageRuntimeInstance.pageReady) {
        this.BuilderListPageRuntimeInstance.pageReady();
      }

      if (this.BuilderListPageRuntimeInstance.rendererChainCompleted) {
        this.BuilderListPageRuntimeInstance.rendererChainCompleted();
      }

      if (this.BuilderListPageRuntimeInstance.rendererDataChainCompleted) {
        this.BuilderListPageRuntimeInstance.rendererDataChainCompleted();
      }
    }
  },
  CallValidateEveryFromControl: function CallValidateEveryFromControl(validateResult) {
    if (this.FormPageObjectInstance.validateEveryFromControl) {
      try {
        var newResult = this.FormPageObjectInstance.validateEveryFromControl(validateResult);

        if (newResult) {
          validateResult = newResult;
        }
      } catch (e) {
        DialogUtility.AlertText("自定义校验方法执行失败!");
      }
    }

    return validateResult;
  }
};
"use strict";

var InnerFormButtonRuntime = {
  RendererSingleInnerFormButton: function RendererSingleInnerFormButton(innerButtonConfig, formRuntimeInstance, listButtonPO) {
    var InnerFormButton;
    var buttonElem;
    var formRuntimeCategory = formRuntimeInstance._Prop_Config.FormRuntimeCategory;

    if (innerButtonConfig.buttonType == "关闭按钮") {
      InnerFormButton = Object.create(InnerFormCloseButton);
      buttonElem = InnerFormButton.Instance(innerButtonConfig, formRuntimeInstance, listButtonPO, formRuntimeCategory).elem;
    } else if (innerButtonConfig.buttonType == "保存按钮") {
      InnerFormButton = Object.create(InnerFormSaveButton);
      buttonElem = InnerFormButton.Instance(innerButtonConfig, formRuntimeInstance, listButtonPO, formRuntimeCategory).elem;
    } else if (innerButtonConfig.buttonType == "脚本按钮") {
      InnerFormButton = Object.create(InnerFormJsClientButton);
      buttonElem = InnerFormButton.Instance(innerButtonConfig, formRuntimeInstance, listButtonPO, formRuntimeCategory).elem;
    } else {
      var errorText = "不支持的按钮类型:InnerFormButtonRuntime.RendererSingleInnerFormButton";
      DialogUtility.AlertText(errorText);
      throw errorText;
    }

    return buttonElem;
  },
  RendererSingleInnerFormButtonClick: function RendererSingleInnerFormButtonClick(sender) {}
};
"use strict";

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
"use strict";

var RuntimeGeneralInstance = {
  _Ajax: function _Ajax(url, params, callback, sender) {
    jQuery.ajax({
      url: url,
      type: "POST",
      dataType: "json",
      data: params
    }).done(function (result) {
      if (!result.success) {
        var message = result.message;

        if (StringUtility.IsNullOrEmpty(message)) {
          message = result.traceMsg;
        }

        DialogUtility.AlertText(message, sender);
      }

      callback.call(sender, result);
    }).always(callback && function (jqXHR, status) {});
  },
  LoadHtmlDesignContent: function LoadHtmlDesignContent(url, appendToElemId, params, callback, sender) {
    this._Ajax(url, params, callback, sender);
  },
  LoadInnerFormButton: function LoadInnerFormButton(listFormButtonId, params, callback, sender) {
    var url = BaseUtility.BuildAction("/Rest/Builder/RunTime/ListButtonRuntime/GetButtonPO", {
      buttonId: listFormButtonId
    });

    this._Ajax(url, params, callback, sender);
  },
  SubmitFormDataComplexPOListToServer: function SubmitFormDataComplexPOListToServer(formDataComplexPO, recordId, innerFormButtonId, listButtonId, operationType, callback, sender) {
    var url = BaseUtility.BuildAction("/Rest/Builder/RunTime/InnerFormButtonRuntime/ReceiveHandler", {});
    var params = {
      "formRecordComplexPOString": encodeURIComponent(JsonUtility.JsonToString(formDataComplexPO)),
      "innerFormButtonId": innerFormButtonId,
      "listButtonId": listButtonId,
      "recordId": recordId,
      "operationTypeName": operationType
    };

    this._Ajax(url, params, callback, sender);

    console.log(formDataComplexPO);
  },
  DeleteTableRecord: function DeleteTableRecord(tableId, recordId, successFunc, caller) {
    AjaxUtility.Post("/Rest/Builder/RunTime/DataSetRuntime/DeleteTableRecord", {
      tableId: tableId,
      pkValue: recordId
    }, function (result) {
      if (result.success) {
        successFunc(result);
      }
    }, caller);
  },
  DeleteDataSetRecord: function DeleteDataSetRecord(elemid, bindDataSetId, recordId, caller) {
    AjaxUtility.Post("/Rest/Builder/RunTime/DataSetRuntime/DeleteDataSetRecord", {
      dataSetId: bindDataSetId,
      pkValue: recordId
    }, function (result) {
      if (result.success) {
        WLDCT_ListTableContainer.TryReloadForListFormButton(elemid);
      }
    }, caller);
  },
  GetDataSetData: function GetDataSetData(config, func, sender) {
    var sendData = JSON.stringify(config);
    AjaxUtility.PostRequestBody("/Rest/Builder/RunTime/DataSetRuntime/GetDataSetData", sendData, function (getDataSetResult) {
      func.call(sender, getDataSetResult);
    }, sender);
  },
  GetUrlParas: function GetUrlParas() {
    if (this["menuRightUrlParaJson"]) {
      return this["menuRightUrlParaJson"];
    } else {
      var paraStr = BaseUtility.GetUrlParaValue("menuRightUrlPara");

      if (StringUtility.IsNullOrEmpty(paraStr)) {
        return "";
      }

      if (paraStr.charAt(0) == "{" || paraStr.charAt(0) == "[") {
        try {
          var json = JsonUtility.StringToJson(paraStr);
          return json;
        } catch (e) {}
      }

      this["menuRightUrlParaJson"] = paraStr;
      return paraStr;
    }
  },
  TryGetUrlParaValueByFieldName: function TryGetUrlParaValueByFieldName(actionName, fieldName) {
    var paraJson = this.GetUrlParas();

    if (paraJson && typeof paraJson != "string") {
      for (var i = 0; i < paraJson.length; i++) {
        var singlePara = paraJson[i];

        if (singlePara.ActionType == actionName && singlePara.FieldName == fieldName) {
          return singlePara.Value;
        }
      }
    }

    return "";
  },
  TryGetUrlParaChangeMainDataSetId: function TryGetUrlParaChangeMainDataSetId() {
    var paraJson = this.GetUrlParas();

    if (paraJson && typeof paraJson != "string") {
      for (var i = 0; i < paraJson.length; i++) {
        var singlePara = paraJson[i];

        if (singlePara.ActionType == "ChangeMainDataSet") {
          return singlePara.DataSetId;
        }
      }
    }

    return "";
  },
  TryGetUrlParaViewOnly: function TryGetUrlParaViewOnly() {
    var paraJson = this.GetUrlParas();

    if (paraJson && typeof paraJson != "string") {
      for (var i = 0; i < paraJson.length; i++) {
        var singlePara = paraJson[i];

        if (singlePara.ActionType == "ViewOnly") {
          return true;
        }
      }
    }

    return false;
  },
  TryGetMenuOuterId: function TryGetMenuOuterId() {
    return BaseUtility.GetUrlParaValue("menuOuterId");
  }
};
"use strict";

var ValidateRulesRuntime = {
  "NoEmpty": "NoEmpty",
  getValidateTipElem: function getValidateTipElem() {
    return "<span name='validate-tip' style='color: red'>*</span> ";
  },
  getValidateRules: function getValidateRules($elem) {
    if ($elem.attr("validaterules")) {
      var validateRules = decodeURIComponent($elem.attr("validaterules"));
      return JsonUtility.StringToJson(validateRules);
    }

    return null;
  },
  ValidateSubmitEnable: function ValidateSubmitEnable() {
    var controls = $("[tablename][serialize='true']").not($("[control_category='DynamicContainer']").find("[jbuild4dc_custom='true']"));
    var validateResult = {
      success: true,
      errors: []
    };

    for (var i = 0; i < controls.length; i++) {
      var $controlElem = $(controls[i]);
      var validateRules = ValidateRulesRuntime.getValidateRules($controlElem);

      if (validateRules && validateRules.rules.length > 0) {
        var singleControlErrors = {
          labName: this.tryGetValidateErrorName($controlElem),
          errors: [],
          $elem: null
        };
        var fieldTransferPO = HTMLControl.TryGetFieldTransferPO($controlElem, "ValidateSubmitEnable", "ValidateSubmitEnable", "ValidateSubmitEnable");
        var controlValue = fieldTransferPO.value;

        for (var j = 0; j < validateRules.rules.length; j++) {
          var singleRule = validateRules.rules[j];

          if (singleRule.validateType == ValidateRulesRuntime.NoEmpty) {
            if (StringUtility.Trim(controlValue) == "" || StringUtility.IsNullOrEmpty(controlValue)) {
              singleControlErrors.errors.push("不能为空!");
            }
          }

          if (singleControlErrors.errors.length > 0) {
            singleControlErrors.$elem = $controlElem;
            validateResult.success = false;
            validateResult.errors.push(singleControlErrors);
          }
        }
      }
    }

    var validateResult = HTMLPageObjectInstanceProxy.CallValidateEveryFromControl(validateResult);
    return validateResult;
  },
  tryGetValidateErrorName: function tryGetValidateErrorName($control) {
    var name = "";
    var $prevTd = $control.parent().prev();

    if ($prevTd && $prevTd.length > 0) {
      name = $prevTd.text().replace("*", "").replace("：", "");
    }

    return name;
  },
  AlertValidateErrors: function AlertValidateErrors(validateResult) {
    if (!validateResult.success) {
      var message = "";

      for (var i = 0; i < validateResult.errors.length; i++) {
        var singleControlError = validateResult.errors[i];
        message += singleControlError.labName + "   【" + singleControlError.errors.join(",") + "】<br />";
      }

      DialogUtility.Alert(window, DialogUtility.DialogId05, {
        autoResize: true,
        height: 'auto',
        width: 300,
        title: "系统提示"
      }, message);

      for (var _i = 0; _i < validateResult.errors.length; _i++) {
        var _singleControlError = validateResult.errors[_i];

        if (_singleControlError.$elem.attr("client_resolve") == "WFDCT_RadioGroup") {
          _singleControlError.$elem.parent().addClass("html-design-input-control-error-status-radio-group");
        } else {
          _singleControlError.$elem.addClass("html-design-input-control-error-status");
        }
      }

      window.setTimeout(function () {
        $(".html-design-input-control-error-status").removeClass("html-design-input-control-error-status");
        $(".html-design-input-control-error-status-radio-group").removeClass("html-design-input-control-error-status-radio-group");
      }, 4000);
    }

    return validateResult.success;
  }
};
"use strict";

var HTMLControlAttrs = {
  JBUILD4DC_CUSTOM: "jbuild4dc_custom",
  SELECTED_JBUILD4DC_CUSTOM: "[jbuild4dc_custom=true]",
  CLIENT_RESOLVE: "client_resolve"
};
var HTMLControl = {
  _InstanceMap: {},
  _GetInstance: function _GetInstance(name) {
    for (var key in this._InstanceMap) {
      if (key == name) {
        return this._InstanceMap[key];
      }
    }

    var instance = eval(name);
    this._InstanceMap[name] = instance;
    return instance;
  },
  GetInstance: function GetInstance(name) {
    return this._GetInstance(name);
  },
  SaveControlNewInstanceToPool: function SaveControlNewInstanceToPool($elem, instance) {
    alert("改方法已经废弃,改为服务端创建初始化脚本1!");
    return null;
    var instanceName = $elem.attr("client_resolve") + "_" + StringUtility.GuidSplit("");
    $elem.attr("client_instance_name", instanceName);
    this._InstanceMap[instanceName] = instance;
    return instanceName;
  },
  _SaveControlNewInstanceToPool: function _SaveControlNewInstanceToPool(instanceName, instance) {
    this._InstanceMap[instanceName] = instance;
    return instanceName;
  },
  GetControlInstanceByElem: function GetControlInstanceByElem($elem) {
    return this._GetInstance(this.GetControlInstanceNameByElem($elem));
  },
  GetControlInstanceNameByElem: function GetControlInstanceNameByElem($elem) {
    var instanceName = "";

    if ($elem.attr("client_instance_name") && $elem.attr("client_instance_name").length > 0) {
      instanceName = $elem.attr("client_instance_name");
    } else {
      instanceName = $elem.attr("client_resolve");
    }

    return instanceName;
  },
  RendererChainParas: {
    listEntity: null,
    sourceHTML: null,
    $rootElem: null,
    $parentControlElem: null,
    $singleControlElem: null,
    formRuntimeInstance: null,
    listRuntimeInstance: null
  },
  RendererDataChainParas: {
    listEntity: null,
    sourceHTML: null,
    $rootElem: null,
    $parentControlElem: null,
    $singleControlElem: null,
    topDataSet: null,
    formRuntimeInstance: null,
    listRuntimeInstance: null
  },
  RendererChain: function RendererChain(_rendererChainParas) {
    var $singleControlElem = _rendererChainParas.$singleControlElem;

    for (var i = 0; i < $singleControlElem.children().length; i++) {
      try {
        var $childSingleElem = $($singleControlElem.children()[i]);
        var _cloneRendererChainParas = {};
        JsonUtility.SimpleCloneAttr(_cloneRendererChainParas, _rendererChainParas);
        _cloneRendererChainParas.$singleControlElem = $childSingleElem;

        if ($childSingleElem.attr(HTMLControlAttrs.JBUILD4DC_CUSTOM) == "true" && $childSingleElem.attr(HTMLControlAttrs.CLIENT_RESOLVE)) {
          var instance = HTMLControl.GetControlInstanceByElem($childSingleElem);

          if (typeof instance.Initialize == "function") {
            instance.Initialize();
          }

          if (instance._objectType == "Instance") {
            if (instance._prop) {
              var instanceProp = HTMLControl.TryBindElementAttrToInstanceProp($childSingleElem, instance._prop);
              instance._prop = instanceProp;
            }
          } else {
            var elemId = $childSingleElem.attr("id");

            if (elemId && instance._propMap && instance._prop) {
              if (!instance._propMap[elemId]) {
                var instanceProp = HTMLControl.TryBindElementAttrToInstanceProp($childSingleElem, instance._prop);
                instance._propMap[elemId] = instanceProp;
              }
            }
          }

          instance.RendererChain(_cloneRendererChainParas);

          if (typeof instance.InitStyle == "function") {
            instance.InitStyle(_cloneRendererChainParas);
          }

          if (typeof instance.TryBindUrlValue == "function") {
            instance.TryBindUrlValue(_cloneRendererChainParas);
          }
        } else {
          HTMLControl.RendererChain(_cloneRendererChainParas);
        }
      } catch (e) {
        throw "HTMLControl.js.RendererChain:index:" + i + e;
      }
    }
  },
  RendererDataChain: function RendererDataChain(_rendererDataChainParas) {
    var $singleControlElem = _rendererDataChainParas.$singleControlElem;

    for (var i = 0; i < $singleControlElem.children().length; i++) {
      try {
        var $childSingleElem = $($singleControlElem.children()[i]);
        var _cloneRendererDataChainParas = {};
        JsonUtility.SimpleCloneAttr(_cloneRendererDataChainParas, _rendererDataChainParas);
        _cloneRendererDataChainParas.$singleControlElem = $childSingleElem;

        if ($childSingleElem.attr(HTMLControlAttrs.JBUILD4DC_CUSTOM) == "true" && $childSingleElem.attr(HTMLControlAttrs.CLIENT_RESOLVE)) {
          var instance = HTMLControl.GetControlInstanceByElem($childSingleElem);
          instance.RendererDataChain(_cloneRendererDataChainParas);
          var fieldPO;

          if (typeof instance.SetValue == "function") {
            fieldPO = HTMLControl.TryGetFieldPOInRelationFormRecordComplexPo($childSingleElem, _rendererDataChainParas.relationFormRecordComplexPo);
            instance.SetValue($childSingleElem, fieldPO, _rendererDataChainParas.relationFormRecordComplexPo, _rendererDataChainParas);
          }

          if (_rendererDataChainParas.callToViewStatusFunc) {
            if (typeof instance.ToViewStatus == "function") {
              instance.ToViewStatus($childSingleElem, fieldPO, _rendererDataChainParas.relationFormRecordComplexPo, _rendererDataChainParas);
            }
          }
        } else {
          HTMLControl.RendererDataChain(_cloneRendererDataChainParas);
        }
      } catch (e) {
        throw "HTMLControl.js.RendererDataChain:index:" + i + e;
      }
    }
  },
  InitStyle: function InitStyle(_rendererChainParas) {
    var $singleControlElem = _rendererChainParas.$singleControlElem;
    HTMLControl.TryAppendValidateStyle($singleControlElem);
  },
  TryAppendValidateStyle: function TryAppendValidateStyle($singleControlElem) {
    var validateRules = ValidateRulesRuntime.getValidateRules($singleControlElem);

    if (validateRules && validateRules.rules.length > 0) {
      for (var i = 0; i < validateRules.rules.length; i++) {
        if (validateRules.rules[i].validateType == ValidateRulesRuntime.NoEmpty) {
          var $tdTxt = $singleControlElem.parent().prev();
          var newTxt = ValidateRulesRuntime.getValidateTipElem() + $tdTxt.text();
          $tdTxt.html(newTxt);
        }
      }
    }
  },
  GetValue: function GetValue($elem, originalData, paras) {
    originalData.value = $elem.val();
    return originalData;
  },
  SetValue: function SetValue($elem, fieldPO, relationFormRecordComplexPo, _rendererDataChainParas) {
    if (fieldPO) {
      $elem.val(fieldPO.value);
      $elem.attr("control_value", fieldPO.value);
    }
  },
  ToViewStatus: function ToViewStatus($elem, fieldPO, relationFormRecordComplexPo, _rendererDataChainParas) {
    var oldAllAttrs = BaseUtility.GetElemAllAttr($elem);
    var $viewElem = $("<label />");
    $viewElem.attr(oldAllAttrs);
    $viewElem.removeClass();

    if ($elem.prop("tagName") == "SELECT") {
      var text = $elem.find("option:selected").text();
      $viewElem.text(text);
    } else {
      $viewElem.text($elem.val());
    }

    $elem.replaceWith($viewElem);
  },
  TryBindUrlValue: function TryBindUrlValue(_rendererChainParas) {
    var $singleControlElem = _rendererChainParas.$singleControlElem;
    var columnName = $singleControlElem.attr("columnname");

    if (!columnName) {
      columnName = $singleControlElem.attr("fieldname");
    }

    var urlValue = RuntimeGeneralInstance.TryGetUrlParaValueByFieldName("BindToField", columnName);

    if (urlValue) {
      $singleControlElem.val(urlValue);
      console.log(urlValue);
    }
  },
  TryGetFieldPOInRelationFormRecordComplexPo: function TryGetFieldPOInRelationFormRecordComplexPo($elem, relationFormRecordComplexPo) {
    var relationId = HTMLControl.GetControlBindRelationId($elem);
    var bindTableName = HTMLControl.GetControlBindTableName($elem);
    var bindFieldName = HTMLControl.GetControlBindFieldName($elem);

    if (relationId && bindFieldName) {
      var fieldPO = FormRelationPOUtility.FindFieldPOInRelationFormRecordComplexPoOneDataRecord(relationFormRecordComplexPo, relationId, bindTableName, bindFieldName);
      return fieldPO;
    } else {
      return null;
    }
  },
  FindALLControls: function FindALLControls($parent) {
    if ($parent) {
      return $parent.find("[jbuild4dc_custom='true']");
    }

    return $("[jbuild4dc_custom='true']");
  },
  GetControlBindTableName: function GetControlBindTableName($controlElem) {
    return $controlElem.attr("tablename");
  },
  GetControlBindFieldName: function GetControlBindFieldName($controlElem) {
    return $controlElem.attr("fieldname");
  },
  GetControlBindRelationId: function GetControlBindRelationId($controlElem) {
    return $controlElem.attr("relationid");
  },
  GetControlProp: function GetControlProp($controlElem) {
    var props = {
      singleName: "",
      tableName: "",
      tableCaption: "",
      tableId: "",
      fieldTableId: "",
      fieldName: "",
      fieldDataType: "",
      fieldDataLength: "",
      defaultType: "",
      defaultValue: "",
      id: "",
      serialize: "",
      value: ""
    };

    for (var key in props) {
      var propValue = $controlElem.attr(StringUtility.ToLowerCase(key));

      if (!StringUtility.IsNullOrEmpty(propValue)) {
        props[key] = propValue;
      }
    }

    props.fieldDataLength = $controlElem.attr("fieldlength");
    return props;
  },
  BuildSerializationOriginalData: function BuildSerializationOriginalData(props, relationId, relationSingleName, relationType) {
    var originalData = {
      relationId: relationId,
      relationSingleName: relationSingleName,
      relationType: relationType,
      singleName: props.singleName,
      tableName: props.tableName,
      tableCaption: props.tableCaption,
      tableId: props.tableId,
      fieldTableId: props.fieldTableId,
      fieldName: props.fieldName,
      fieldDataType: props.fieldDataType,
      fieldDataLength: props.fieldDataLength,
      serialize: props.serialize,
      id: props.id,
      defaultType: props.defaultType,
      defaultValue: props.defaultValue,
      value: "",
      success: true,
      msg: ""
    };
    return originalData;
  },
  GetSerializationOneDataRecordFieldValue: function GetSerializationOneDataRecordFieldValue(oneDataRecord, tableName, fieldName) {
    for (var i = 0; i < oneDataRecord.length; i++) {
      if (oneDataRecord[i].tableName == tableName && oneDataRecord[i].fieldName == fieldName) {
        return oneDataRecord[i].value;
      }
    }

    return "";
  },
  TryGetFieldTransferPO: function TryGetFieldTransferPO($controlElem, relationId, relationSingleName, relationType) {
    var props = HTMLControl.GetControlProp($controlElem);
    var originalData = HTMLControl.BuildSerializationOriginalData(props, relationId, relationSingleName, relationType);
    var controlInstance = HTMLControl.GetControlInstanceByElem($controlElem);

    if (BaseUtility.IsFunction(controlInstance.GetValue)) {
      var fieldTransferPO = controlInstance.GetValue($controlElem, originalData, {});

      if (fieldTransferPO.success) {
        return fieldTransferPO;
      } else {
        return null;
      }
    } else {
      DialogUtility.AlertText("控件:" + $controlElem.attr("singlename") + "未包含GetValue的方法!");
    }
  },
  GetSimpleControlValue: function GetSimpleControlValue(tableId, fieldName) {
    var elem = $("[tableid='" + tableId + "'][fieldname='" + fieldName + "']");

    if (elem.length == 0) {
      return null;
    }

    return elem.val();
  },
  TryBindElementAttrToInstanceProp: function TryBindElementAttrToInstanceProp($elem, objProp) {
    var result = {};

    for (var key in objProp) {
      if ($elem.attr(key)) {
        result[key] = $elem.attr(key);
      } else if (key == "elemId") {
        result.elemId = $elem.attr("id");
      } else if (key == "instanceName") {
        result.instanceName = $elem.attr("client_instance_name");
      } else {
        result[key] = objProp[key];
      }
    }

    result.$singleControlElem = $elem;
    return result;
  }
};
"use strict";

var VirtualBodyControl = {
  RendererChain: HTMLControl.RendererChain,
  RendererDataChain: HTMLControl.RendererDataChain,
  InitStyle: function InitStyle(_rendererChainParas) {
    var $singleControlElem = _rendererChainParas.$singleControlElem;
    var formRuntimeInstance = _rendererChainParas.formRuntimeInstance;
    this.TryAutoSetHeight(formRuntimeInstance);
  },
  TryAutoSetHeight: function TryAutoSetHeight(formRuntimeInstance) {
    if ($(".auto-full-page-height-wrap").length > 0) {
      var pageHeight = formRuntimeInstance._Prop_Config.WebFormRTParas.WindowHeight;

      if (pageHeight) {
        pageHeight = pageHeight - 130;

        if (this.HasRootTabContainer()) {
          pageHeight = pageHeight - 70;
        }

        $(".auto-full-page-height-wrap").height(pageHeight);
        $(".auto-full-page-height-wrap").each(function () {
          var elem = $(this);
          var ps = new PerfectScrollbar(elem[0]);
        });
      }
    }
  },
  HasRootTabContainer: function HasRootTabContainer() {
    return $("#htmlDesignRuntimeWrap").children("[singlename='WFDCT_TabContainer']").length > 0;
  }
};
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (factory) {
  "use strict";

  if (typeof define === 'function' && define.amd) {
    define(['jquery'], function ($) {
      return factory($, window, document);
    });
  } else if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') {
    module.exports = function (root, $) {
      if (!root) {
        root = window;
      }

      if (!$) {
        $ = typeof window !== 'undefined' ? require('jquery') : require('jquery')(root);
      }

      return factory($, root, root.document);
    };
  } else {
    factory(jQuery, window, document);
  }
})(function ($, window, document, undefined) {
  "use strict";

  var DataTable = function DataTable(options) {
    this.$ = function (sSelector, oOpts) {
      return this.api(true).$(sSelector, oOpts);
    };

    this._ = function (sSelector, oOpts) {
      return this.api(true).rows(sSelector, oOpts).data();
    };

    this.api = function (traditional) {
      return traditional ? new _Api2(_fnSettingsFromNode(this[_ext.iApiIndex])) : new _Api2(this);
    };

    this.fnAddData = function (data, redraw) {
      var api = this.api(true);
      var rows = $.isArray(data) && ($.isArray(data[0]) || $.isPlainObject(data[0])) ? api.rows.add(data) : api.row.add(data);

      if (redraw === undefined || redraw) {
        api.draw();
      }

      return rows.flatten().toArray();
    };

    this.fnAdjustColumnSizing = function (bRedraw) {
      var api = this.api(true).columns.adjust();
      var settings = api.settings()[0];
      var scroll = settings.oScroll;

      if (bRedraw === undefined || bRedraw) {
        api.draw(false);
      } else if (scroll.sX !== "" || scroll.sY !== "") {
        _fnScrollDraw(settings);
      }
    };

    this.fnClearTable = function (bRedraw) {
      var api = this.api(true).clear();

      if (bRedraw === undefined || bRedraw) {
        api.draw();
      }
    };

    this.fnClose = function (nTr) {
      this.api(true).row(nTr).child.hide();
    };

    this.fnDeleteRow = function (target, callback, redraw) {
      var api = this.api(true);
      var rows = api.rows(target);
      var settings = rows.settings()[0];
      var data = settings.aoData[rows[0][0]];
      rows.remove();

      if (callback) {
        callback.call(this, settings, data);
      }

      if (redraw === undefined || redraw) {
        api.draw();
      }

      return data;
    };

    this.fnDestroy = function (remove) {
      this.api(true).destroy(remove);
    };

    this.fnDraw = function (complete) {
      this.api(true).draw(complete);
    };

    this.fnFilter = function (sInput, iColumn, bRegex, bSmart, bShowGlobal, bCaseInsensitive) {
      var api = this.api(true);

      if (iColumn === null || iColumn === undefined) {
        api.search(sInput, bRegex, bSmart, bCaseInsensitive);
      } else {
        api.column(iColumn).search(sInput, bRegex, bSmart, bCaseInsensitive);
      }

      api.draw();
    };

    this.fnGetData = function (src, col) {
      var api = this.api(true);

      if (src !== undefined) {
        var type = src.nodeName ? src.nodeName.toLowerCase() : '';
        return col !== undefined || type == 'td' || type == 'th' ? api.cell(src, col).data() : api.row(src).data() || null;
      }

      return api.data().toArray();
    };

    this.fnGetNodes = function (iRow) {
      var api = this.api(true);
      return iRow !== undefined ? api.row(iRow).node() : api.rows().nodes().flatten().toArray();
    };

    this.fnGetPosition = function (node) {
      var api = this.api(true);
      var nodeName = node.nodeName.toUpperCase();

      if (nodeName == 'TR') {
        return api.row(node).index();
      } else if (nodeName == 'TD' || nodeName == 'TH') {
        var cell = api.cell(node).index();
        return [cell.row, cell.columnVisible, cell.column];
      }

      return null;
    };

    this.fnIsOpen = function (nTr) {
      return this.api(true).row(nTr).child.isShown();
    };

    this.fnOpen = function (nTr, mHtml, sClass) {
      return this.api(true).row(nTr).child(mHtml, sClass).show().child()[0];
    };

    this.fnPageChange = function (mAction, bRedraw) {
      var api = this.api(true).page(mAction);

      if (bRedraw === undefined || bRedraw) {
        api.draw(false);
      }
    };

    this.fnSetColumnVis = function (iCol, bShow, bRedraw) {
      var api = this.api(true).column(iCol).visible(bShow);

      if (bRedraw === undefined || bRedraw) {
        api.columns.adjust().draw();
      }
    };

    this.fnSettings = function () {
      return _fnSettingsFromNode(this[_ext.iApiIndex]);
    };

    this.fnSort = function (aaSort) {
      this.api(true).order(aaSort).draw();
    };

    this.fnSortListener = function (nNode, iColumn, fnCallback) {
      this.api(true).order.listener(nNode, iColumn, fnCallback);
    };

    this.fnUpdate = function (mData, mRow, iColumn, bRedraw, bAction) {
      var api = this.api(true);

      if (iColumn === undefined || iColumn === null) {
        api.row(mRow).data(mData);
      } else {
        api.cell(mRow, iColumn).data(mData);
      }

      if (bAction === undefined || bAction) {
        api.columns.adjust();
      }

      if (bRedraw === undefined || bRedraw) {
        api.draw();
      }

      return 0;
    };

    this.fnVersionCheck = _ext.fnVersionCheck;

    var _that = this;

    var emptyInit = options === undefined;
    var len = this.length;

    if (emptyInit) {
      options = {};
    }

    this.oApi = this.internal = _ext.internal;

    for (var fn in DataTable.ext.internal) {
      if (fn) {
        this[fn] = _fnExternApiFunc(fn);
      }
    }

    this.each(function () {
      var o = {};
      var oInit = len > 1 ? _fnExtend(o, options, true) : options;
      var i = 0,
          iLen,
          j,
          jLen,
          k,
          kLen;
      var sId = this.getAttribute('id');
      var bInitHandedOff = false;
      var defaults = DataTable.defaults;
      var $this = $(this);

      if (this.nodeName.toLowerCase() != 'table') {
        _fnLog(null, 0, 'Non-table node initialisation (' + this.nodeName + ')', 2);

        return;
      }

      _fnCompatOpts(defaults);

      _fnCompatCols(defaults.column);

      _fnCamelToHungarian(defaults, defaults, true);

      _fnCamelToHungarian(defaults.column, defaults.column, true);

      _fnCamelToHungarian(defaults, $.extend(oInit, $this.data()));

      var allSettings = DataTable.settings;

      for (i = 0, iLen = allSettings.length; i < iLen; i++) {
        var s = allSettings[i];

        if (s.nTable == this || s.nTHead && s.nTHead.parentNode == this || s.nTFoot && s.nTFoot.parentNode == this) {
          var bRetrieve = oInit.bRetrieve !== undefined ? oInit.bRetrieve : defaults.bRetrieve;
          var bDestroy = oInit.bDestroy !== undefined ? oInit.bDestroy : defaults.bDestroy;

          if (emptyInit || bRetrieve) {
            return s.oInstance;
          } else if (bDestroy) {
            s.oInstance.fnDestroy();
            break;
          } else {
            _fnLog(s, 0, 'Cannot reinitialise DataTable', 3);

            return;
          }
        }

        if (s.sTableId == this.id) {
          allSettings.splice(i, 1);
          break;
        }
      }

      if (sId === null || sId === "") {
        sId = "DataTables_Table_" + DataTable.ext._unique++;
        this.id = sId;
      }

      var oSettings = $.extend(true, {}, DataTable.models.oSettings, {
        "sDestroyWidth": $this[0].style.width,
        "sInstance": sId,
        "sTableId": sId
      });
      oSettings.nTable = this;
      oSettings.oApi = _that.internal;
      oSettings.oInit = oInit;
      allSettings.push(oSettings);
      oSettings.oInstance = _that.length === 1 ? _that : $this.dataTable();

      _fnCompatOpts(oInit);

      _fnLanguageCompat(oInit.oLanguage);

      if (oInit.aLengthMenu && !oInit.iDisplayLength) {
        oInit.iDisplayLength = $.isArray(oInit.aLengthMenu[0]) ? oInit.aLengthMenu[0][0] : oInit.aLengthMenu[0];
      }

      oInit = _fnExtend($.extend(true, {}, defaults), oInit);

      _fnMap(oSettings.oFeatures, oInit, ["bPaginate", "bLengthChange", "bFilter", "bSort", "bSortMulti", "bInfo", "bProcessing", "bAutoWidth", "bSortClasses", "bServerSide", "bDeferRender"]);

      _fnMap(oSettings, oInit, ["asStripeClasses", "ajax", "fnServerData", "fnFormatNumber", "sServerMethod", "aaSorting", "aaSortingFixed", "aLengthMenu", "sPaginationType", "sAjaxSource", "sAjaxDataProp", "iStateDuration", "sDom", "bSortCellsTop", "iTabIndex", "fnStateLoadCallback", "fnStateSaveCallback", "renderer", "searchDelay", "rowId", ["iCookieDuration", "iStateDuration"], ["oSearch", "oPreviousSearch"], ["aoSearchCols", "aoPreSearchCols"], ["iDisplayLength", "_iDisplayLength"]]);

      _fnMap(oSettings.oScroll, oInit, [["sScrollX", "sX"], ["sScrollXInner", "sXInner"], ["sScrollY", "sY"], ["bScrollCollapse", "bCollapse"]]);

      _fnMap(oSettings.oLanguage, oInit, "fnInfoCallback");

      _fnCallbackReg(oSettings, 'aoDrawCallback', oInit.fnDrawCallback, 'user');

      _fnCallbackReg(oSettings, 'aoServerParams', oInit.fnServerParams, 'user');

      _fnCallbackReg(oSettings, 'aoStateSaveParams', oInit.fnStateSaveParams, 'user');

      _fnCallbackReg(oSettings, 'aoStateLoadParams', oInit.fnStateLoadParams, 'user');

      _fnCallbackReg(oSettings, 'aoStateLoaded', oInit.fnStateLoaded, 'user');

      _fnCallbackReg(oSettings, 'aoRowCallback', oInit.fnRowCallback, 'user');

      _fnCallbackReg(oSettings, 'aoRowCreatedCallback', oInit.fnCreatedRow, 'user');

      _fnCallbackReg(oSettings, 'aoHeaderCallback', oInit.fnHeaderCallback, 'user');

      _fnCallbackReg(oSettings, 'aoFooterCallback', oInit.fnFooterCallback, 'user');

      _fnCallbackReg(oSettings, 'aoInitComplete', oInit.fnInitComplete, 'user');

      _fnCallbackReg(oSettings, 'aoPreDrawCallback', oInit.fnPreDrawCallback, 'user');

      oSettings.rowIdFn = _fnGetObjectDataFn(oInit.rowId);

      _fnBrowserDetect(oSettings);

      var oClasses = oSettings.oClasses;
      $.extend(oClasses, DataTable.ext.classes, oInit.oClasses);
      $this.addClass(oClasses.sTable);

      if (oSettings.iInitDisplayStart === undefined) {
        oSettings.iInitDisplayStart = oInit.iDisplayStart;
        oSettings._iDisplayStart = oInit.iDisplayStart;
      }

      if (oInit.iDeferLoading !== null) {
        oSettings.bDeferLoading = true;
        var tmp = $.isArray(oInit.iDeferLoading);
        oSettings._iRecordsDisplay = tmp ? oInit.iDeferLoading[0] : oInit.iDeferLoading;
        oSettings._iRecordsTotal = tmp ? oInit.iDeferLoading[1] : oInit.iDeferLoading;
      }

      var oLanguage = oSettings.oLanguage;
      $.extend(true, oLanguage, oInit.oLanguage);

      if (oLanguage.sUrl) {
        $.ajax({
          dataType: 'json',
          url: oLanguage.sUrl,
          success: function success(json) {
            _fnLanguageCompat(json);

            _fnCamelToHungarian(defaults.oLanguage, json);

            $.extend(true, oLanguage, json);

            _fnInitialise(oSettings);
          },
          error: function error() {
            _fnInitialise(oSettings);
          }
        });
        bInitHandedOff = true;
      }

      if (oInit.asStripeClasses === null) {
        oSettings.asStripeClasses = [oClasses.sStripeOdd, oClasses.sStripeEven];
      }

      var stripeClasses = oSettings.asStripeClasses;
      var rowOne = $this.children('tbody').find('tr').eq(0);

      if ($.inArray(true, $.map(stripeClasses, function (el, i) {
        return rowOne.hasClass(el);
      })) !== -1) {
        $('tbody tr', this).removeClass(stripeClasses.join(' '));
        oSettings.asDestroyStripes = stripeClasses.slice();
      }

      var anThs = [];
      var aoColumnsInit;
      var nThead = this.getElementsByTagName('thead');

      if (nThead.length !== 0) {
        _fnDetectHeader(oSettings.aoHeader, nThead[0]);

        anThs = _fnGetUniqueThs(oSettings);
      }

      if (oInit.aoColumns === null) {
        aoColumnsInit = [];

        for (i = 0, iLen = anThs.length; i < iLen; i++) {
          aoColumnsInit.push(null);
        }
      } else {
        aoColumnsInit = oInit.aoColumns;
      }

      for (i = 0, iLen = aoColumnsInit.length; i < iLen; i++) {
        _fnAddColumn(oSettings, anThs ? anThs[i] : null);
      }

      _fnApplyColumnDefs(oSettings, oInit.aoColumnDefs, aoColumnsInit, function (iCol, oDef) {
        _fnColumnOptions(oSettings, iCol, oDef);
      });

      if (rowOne.length) {
        var a = function a(cell, name) {
          return cell.getAttribute('data-' + name) !== null ? name : null;
        };

        $(rowOne[0]).children('th, td').each(function (i, cell) {
          var col = oSettings.aoColumns[i];

          if (col.mData === i) {
            var sort = a(cell, 'sort') || a(cell, 'order');
            var filter = a(cell, 'filter') || a(cell, 'search');

            if (sort !== null || filter !== null) {
              col.mData = {
                _: i + '.display',
                sort: sort !== null ? i + '.@data-' + sort : undefined,
                type: sort !== null ? i + '.@data-' + sort : undefined,
                filter: filter !== null ? i + '.@data-' + filter : undefined
              };

              _fnColumnOptions(oSettings, i);
            }
          }
        });
      }

      var features = oSettings.oFeatures;

      var loadedInit = function loadedInit() {
        if (oInit.aaSorting === undefined) {
          var sorting = oSettings.aaSorting;

          for (i = 0, iLen = sorting.length; i < iLen; i++) {
            sorting[i][1] = oSettings.aoColumns[i].asSorting[0];
          }
        }

        _fnSortingClasses(oSettings);

        if (features.bSort) {
          _fnCallbackReg(oSettings, 'aoDrawCallback', function () {
            if (oSettings.bSorted) {
              var aSort = _fnSortFlatten(oSettings);

              var sortedColumns = {};
              $.each(aSort, function (i, val) {
                sortedColumns[val.src] = val.dir;
              });

              _fnCallbackFire(oSettings, null, 'order', [oSettings, aSort, sortedColumns]);

              _fnSortAria(oSettings);
            }
          });
        }

        _fnCallbackReg(oSettings, 'aoDrawCallback', function () {
          if (oSettings.bSorted || _fnDataSource(oSettings) === 'ssp' || features.bDeferRender) {
            _fnSortingClasses(oSettings);
          }
        }, 'sc');

        var captions = $this.children('caption').each(function () {
          this._captionSide = $(this).css('caption-side');
        });
        var thead = $this.children('thead');

        if (thead.length === 0) {
          thead = $('<thead/>').appendTo($this);
        }

        oSettings.nTHead = thead[0];
        var tbody = $this.children('tbody');

        if (tbody.length === 0) {
          tbody = $('<tbody/>').appendTo($this);
        }

        oSettings.nTBody = tbody[0];
        var tfoot = $this.children('tfoot');

        if (tfoot.length === 0 && captions.length > 0 && (oSettings.oScroll.sX !== "" || oSettings.oScroll.sY !== "")) {
          tfoot = $('<tfoot/>').appendTo($this);
        }

        if (tfoot.length === 0 || tfoot.children().length === 0) {
          $this.addClass(oClasses.sNoFooter);
        } else if (tfoot.length > 0) {
          oSettings.nTFoot = tfoot[0];

          _fnDetectHeader(oSettings.aoFooter, oSettings.nTFoot);
        }

        if (oInit.aaData) {
          for (i = 0; i < oInit.aaData.length; i++) {
            _fnAddData(oSettings, oInit.aaData[i]);
          }
        } else if (oSettings.bDeferLoading || _fnDataSource(oSettings) == 'dom') {
          _fnAddTr(oSettings, $(oSettings.nTBody).children('tr'));
        }

        oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
        oSettings.bInitialised = true;

        if (bInitHandedOff === false) {
          _fnInitialise(oSettings);
        }
      };

      if (oInit.bStateSave) {
        features.bStateSave = true;

        _fnCallbackReg(oSettings, 'aoDrawCallback', _fnSaveState, 'state_save');

        _fnLoadState(oSettings, oInit, loadedInit);
      } else {
        loadedInit();
      }
    });
    _that = null;
    return this;
  };

  var _ext;

  var _Api2;

  var _api_register;

  var _api_registerPlural;

  var _re_dic = {};
  var _re_new_lines = /[\r\n]/g;
  var _re_html = /<.*?>/g;
  var _re_date = /^\d{2,4}[\.\/\-]\d{1,2}[\.\/\-]\d{1,2}([T ]{1}\d{1,2}[:\.]\d{2}([\.:]\d{2})?)?$/;

  var _re_escape_regex = new RegExp('(\\' + ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\', '$', '^', '-'].join('|\\') + ')', 'g');

  var _re_formatted_numeric = /[',$£€¥%\u2009\u202F\u20BD\u20a9\u20BArfkɃΞ]/gi;

  var _empty = function _empty(d) {
    return !d || d === true || d === '-' ? true : false;
  };

  var _intVal = function _intVal(s) {
    var integer = parseInt(s, 10);
    return !isNaN(integer) && isFinite(s) ? integer : null;
  };

  var _numToDecimal = function _numToDecimal(num, decimalPoint) {
    if (!_re_dic[decimalPoint]) {
      _re_dic[decimalPoint] = new RegExp(_fnEscapeRegex(decimalPoint), 'g');
    }

    return typeof num === 'string' && decimalPoint !== '.' ? num.replace(/\./g, '').replace(_re_dic[decimalPoint], '.') : num;
  };

  var _isNumber = function _isNumber(d, decimalPoint, formatted) {
    var strType = typeof d === 'string';

    if (_empty(d)) {
      return true;
    }

    if (decimalPoint && strType) {
      d = _numToDecimal(d, decimalPoint);
    }

    if (formatted && strType) {
      d = d.replace(_re_formatted_numeric, '');
    }

    return !isNaN(parseFloat(d)) && isFinite(d);
  };

  var _isHtml = function _isHtml(d) {
    return _empty(d) || typeof d === 'string';
  };

  var _htmlNumeric = function _htmlNumeric(d, decimalPoint, formatted) {
    if (_empty(d)) {
      return true;
    }

    var html = _isHtml(d);

    return !html ? null : _isNumber(_stripHtml(d), decimalPoint, formatted) ? true : null;
  };

  var _pluck = function _pluck(a, prop, prop2) {
    var out = [];
    var i = 0,
        ien = a.length;

    if (prop2 !== undefined) {
      for (; i < ien; i++) {
        if (a[i] && a[i][prop]) {
          out.push(a[i][prop][prop2]);
        }
      }
    } else {
      for (; i < ien; i++) {
        if (a[i]) {
          out.push(a[i][prop]);
        }
      }
    }

    return out;
  };

  var _pluck_order = function _pluck_order(a, order, prop, prop2) {
    var out = [];
    var i = 0,
        ien = order.length;

    if (prop2 !== undefined) {
      for (; i < ien; i++) {
        if (a[order[i]][prop]) {
          out.push(a[order[i]][prop][prop2]);
        }
      }
    } else {
      for (; i < ien; i++) {
        out.push(a[order[i]][prop]);
      }
    }

    return out;
  };

  var _range = function _range(len, start) {
    var out = [];
    var end;

    if (start === undefined) {
      start = 0;
      end = len;
    } else {
      end = start;
      start = len;
    }

    for (var i = start; i < end; i++) {
      out.push(i);
    }

    return out;
  };

  var _removeEmpty = function _removeEmpty(a) {
    var out = [];

    for (var i = 0, ien = a.length; i < ien; i++) {
      if (a[i]) {
        out.push(a[i]);
      }
    }

    return out;
  };

  var _stripHtml = function _stripHtml(d) {
    return d.replace(_re_html, '');
  };

  var _areAllUnique = function _areAllUnique(src) {
    if (src.length < 2) {
      return true;
    }

    var sorted = src.slice().sort();
    var last = sorted[0];

    for (var i = 1, ien = sorted.length; i < ien; i++) {
      if (sorted[i] === last) {
        return false;
      }

      last = sorted[i];
    }

    return true;
  };

  var _unique = function _unique(src) {
    if (_areAllUnique(src)) {
      return src.slice();
    }

    var out = [],
        val,
        i,
        ien = src.length,
        j,
        k = 0;

    again: for (i = 0; i < ien; i++) {
      val = src[i];

      for (j = 0; j < k; j++) {
        if (out[j] === val) {
          continue again;
        }
      }

      out.push(val);
      k++;
    }

    return out;
  };

  DataTable.util = {
    throttle: function throttle(fn, freq) {
      var frequency = freq !== undefined ? freq : 200,
          last,
          timer;
      return function () {
        var that = this,
            now = +new Date(),
            args = arguments;

        if (last && now < last + frequency) {
          clearTimeout(timer);
          timer = setTimeout(function () {
            last = undefined;
            fn.apply(that, args);
          }, frequency);
        } else {
          last = now;
          fn.apply(that, args);
        }
      };
    },
    escapeRegex: function escapeRegex(val) {
      return val.replace(_re_escape_regex, '\\$1');
    }
  };

  function _fnHungarianMap(o) {
    var hungarian = 'a aa ai ao as b fn i m o s ',
        match,
        newKey,
        map = {};
    $.each(o, function (key, val) {
      match = key.match(/^([^A-Z]+?)([A-Z])/);

      if (match && hungarian.indexOf(match[1] + ' ') !== -1) {
        newKey = key.replace(match[0], match[2].toLowerCase());
        map[newKey] = key;

        if (match[1] === 'o') {
          _fnHungarianMap(o[key]);
        }
      }
    });
    o._hungarianMap = map;
  }

  function _fnCamelToHungarian(src, user, force) {
    if (!src._hungarianMap) {
      _fnHungarianMap(src);
    }

    var hungarianKey;
    $.each(user, function (key, val) {
      hungarianKey = src._hungarianMap[key];

      if (hungarianKey !== undefined && (force || user[hungarianKey] === undefined)) {
        if (hungarianKey.charAt(0) === 'o') {
          if (!user[hungarianKey]) {
            user[hungarianKey] = {};
          }

          $.extend(true, user[hungarianKey], user[key]);

          _fnCamelToHungarian(src[hungarianKey], user[hungarianKey], force);
        } else {
          user[hungarianKey] = user[key];
        }
      }
    });
  }

  function _fnLanguageCompat(lang) {
    var defaults = DataTable.defaults.oLanguage;
    var defaultDecimal = defaults.sDecimal;

    if (defaultDecimal) {
      _addNumericSort(defaultDecimal);
    }

    if (lang) {
      var zeroRecords = lang.sZeroRecords;

      if (!lang.sEmptyTable && zeroRecords && defaults.sEmptyTable === "No data available in table") {
        _fnMap(lang, lang, 'sZeroRecords', 'sEmptyTable');
      }

      if (!lang.sLoadingRecords && zeroRecords && defaults.sLoadingRecords === "Loading...") {
        _fnMap(lang, lang, 'sZeroRecords', 'sLoadingRecords');
      }

      if (lang.sInfoThousands) {
        lang.sThousands = lang.sInfoThousands;
      }

      var decimal = lang.sDecimal;

      if (decimal && defaultDecimal !== decimal) {
        _addNumericSort(decimal);
      }
    }
  }

  var _fnCompatMap = function _fnCompatMap(o, knew, old) {
    if (o[knew] !== undefined) {
      o[old] = o[knew];
    }
  };

  function _fnCompatOpts(init) {
    _fnCompatMap(init, 'ordering', 'bSort');

    _fnCompatMap(init, 'orderMulti', 'bSortMulti');

    _fnCompatMap(init, 'orderClasses', 'bSortClasses');

    _fnCompatMap(init, 'orderCellsTop', 'bSortCellsTop');

    _fnCompatMap(init, 'order', 'aaSorting');

    _fnCompatMap(init, 'orderFixed', 'aaSortingFixed');

    _fnCompatMap(init, 'paging', 'bPaginate');

    _fnCompatMap(init, 'pagingType', 'sPaginationType');

    _fnCompatMap(init, 'pageLength', 'iDisplayLength');

    _fnCompatMap(init, 'searching', 'bFilter');

    if (typeof init.sScrollX === 'boolean') {
      init.sScrollX = init.sScrollX ? '100%' : '';
    }

    if (typeof init.scrollX === 'boolean') {
      init.scrollX = init.scrollX ? '100%' : '';
    }

    var searchCols = init.aoSearchCols;

    if (searchCols) {
      for (var i = 0, ien = searchCols.length; i < ien; i++) {
        if (searchCols[i]) {
          _fnCamelToHungarian(DataTable.models.oSearch, searchCols[i]);
        }
      }
    }
  }

  function _fnCompatCols(init) {
    _fnCompatMap(init, 'orderable', 'bSortable');

    _fnCompatMap(init, 'orderData', 'aDataSort');

    _fnCompatMap(init, 'orderSequence', 'asSorting');

    _fnCompatMap(init, 'orderDataType', 'sortDataType');

    var dataSort = init.aDataSort;

    if (typeof dataSort === 'number' && !$.isArray(dataSort)) {
      init.aDataSort = [dataSort];
    }
  }

  function _fnBrowserDetect(settings) {
    if (!DataTable.__browser) {
      var browser = {};
      DataTable.__browser = browser;
      var n = $('<div/>').css({
        position: 'fixed',
        top: 0,
        left: $(window).scrollLeft() * -1,
        height: 1,
        width: 1,
        overflow: 'hidden'
      }).append($('<div/>').css({
        position: 'absolute',
        top: 1,
        left: 1,
        width: 100,
        overflow: 'scroll'
      }).append($('<div/>').css({
        width: '100%',
        height: 10
      }))).appendTo('body');
      var outer = n.children();
      var inner = outer.children();
      browser.barWidth = outer[0].offsetWidth - outer[0].clientWidth;
      browser.bScrollOversize = inner[0].offsetWidth === 100 && outer[0].clientWidth !== 100;
      browser.bScrollbarLeft = Math.round(inner.offset().left) !== 1;
      browser.bBounding = n[0].getBoundingClientRect().width ? true : false;
      n.remove();
    }

    $.extend(settings.oBrowser, DataTable.__browser);
    settings.oScroll.iBarWidth = DataTable.__browser.barWidth;
  }

  function _fnReduce(that, fn, init, start, end, inc) {
    var i = start,
        value,
        isSet = false;

    if (init !== undefined) {
      value = init;
      isSet = true;
    }

    while (i !== end) {
      if (!that.hasOwnProperty(i)) {
        continue;
      }

      value = isSet ? fn(value, that[i], i, that) : that[i];
      isSet = true;
      i += inc;
    }

    return value;
  }

  function _fnAddColumn(oSettings, nTh) {
    var oDefaults = DataTable.defaults.column;
    var iCol = oSettings.aoColumns.length;
    var oCol = $.extend({}, DataTable.models.oColumn, oDefaults, {
      "nTh": nTh ? nTh : document.createElement('th'),
      "sTitle": oDefaults.sTitle ? oDefaults.sTitle : nTh ? nTh.innerHTML : '',
      "aDataSort": oDefaults.aDataSort ? oDefaults.aDataSort : [iCol],
      "mData": oDefaults.mData ? oDefaults.mData : iCol,
      idx: iCol
    });
    oSettings.aoColumns.push(oCol);
    var searchCols = oSettings.aoPreSearchCols;
    searchCols[iCol] = $.extend({}, DataTable.models.oSearch, searchCols[iCol]);

    _fnColumnOptions(oSettings, iCol, $(nTh).data());
  }

  function _fnColumnOptions(oSettings, iCol, oOptions) {
    var oCol = oSettings.aoColumns[iCol];
    var oClasses = oSettings.oClasses;
    var th = $(oCol.nTh);

    if (!oCol.sWidthOrig) {
      oCol.sWidthOrig = th.attr('width') || null;
      var t = (th.attr('style') || '').match(/width:\s*(\d+[pxem%]+)/);

      if (t) {
        oCol.sWidthOrig = t[1];
      }
    }

    if (oOptions !== undefined && oOptions !== null) {
      _fnCompatCols(oOptions);

      _fnCamelToHungarian(DataTable.defaults.column, oOptions);

      if (oOptions.mDataProp !== undefined && !oOptions.mData) {
        oOptions.mData = oOptions.mDataProp;
      }

      if (oOptions.sType) {
        oCol._sManualType = oOptions.sType;
      }

      if (oOptions.className && !oOptions.sClass) {
        oOptions.sClass = oOptions.className;
      }

      if (oOptions.sClass) {
        th.addClass(oOptions.sClass);
      }

      $.extend(oCol, oOptions);

      _fnMap(oCol, oOptions, "sWidth", "sWidthOrig");

      if (oOptions.iDataSort !== undefined) {
        oCol.aDataSort = [oOptions.iDataSort];
      }

      _fnMap(oCol, oOptions, "aDataSort");
    }

    var mDataSrc = oCol.mData;

    var mData = _fnGetObjectDataFn(mDataSrc);

    var mRender = oCol.mRender ? _fnGetObjectDataFn(oCol.mRender) : null;

    var attrTest = function attrTest(src) {
      return typeof src === 'string' && src.indexOf('@') !== -1;
    };

    oCol._bAttrSrc = $.isPlainObject(mDataSrc) && (attrTest(mDataSrc.sort) || attrTest(mDataSrc.type) || attrTest(mDataSrc.filter));
    oCol._setter = null;

    oCol.fnGetData = function (rowData, type, meta) {
      var innerData = mData(rowData, type, undefined, meta);
      return mRender && type ? mRender(innerData, type, rowData, meta) : innerData;
    };

    oCol.fnSetData = function (rowData, val, meta) {
      return _fnSetObjectDataFn(mDataSrc)(rowData, val, meta);
    };

    if (typeof mDataSrc !== 'number') {
      oSettings._rowReadObject = true;
    }

    if (!oSettings.oFeatures.bSort) {
      oCol.bSortable = false;
      th.addClass(oClasses.sSortableNone);
    }

    var bAsc = $.inArray('asc', oCol.asSorting) !== -1;
    var bDesc = $.inArray('desc', oCol.asSorting) !== -1;

    if (!oCol.bSortable || !bAsc && !bDesc) {
      oCol.sSortingClass = oClasses.sSortableNone;
      oCol.sSortingClassJUI = "";
    } else if (bAsc && !bDesc) {
      oCol.sSortingClass = oClasses.sSortableAsc;
      oCol.sSortingClassJUI = oClasses.sSortJUIAscAllowed;
    } else if (!bAsc && bDesc) {
      oCol.sSortingClass = oClasses.sSortableDesc;
      oCol.sSortingClassJUI = oClasses.sSortJUIDescAllowed;
    } else {
      oCol.sSortingClass = oClasses.sSortable;
      oCol.sSortingClassJUI = oClasses.sSortJUI;
    }
  }

  function _fnAdjustColumnSizing(settings) {
    if (settings.oFeatures.bAutoWidth !== false) {
      var columns = settings.aoColumns;

      _fnCalculateColumnWidths(settings);

      for (var i = 0, iLen = columns.length; i < iLen; i++) {
        columns[i].nTh.style.width = columns[i].sWidth;
      }
    }

    var scroll = settings.oScroll;

    if (scroll.sY !== '' || scroll.sX !== '') {
      _fnScrollDraw(settings);
    }

    _fnCallbackFire(settings, null, 'column-sizing', [settings]);
  }

  function _fnVisibleToColumnIndex(oSettings, iMatch) {
    var aiVis = _fnGetColumns(oSettings, 'bVisible');

    return typeof aiVis[iMatch] === 'number' ? aiVis[iMatch] : null;
  }

  function _fnColumnIndexToVisible(oSettings, iMatch) {
    var aiVis = _fnGetColumns(oSettings, 'bVisible');

    var iPos = $.inArray(iMatch, aiVis);
    return iPos !== -1 ? iPos : null;
  }

  function _fnVisbleColumns(oSettings) {
    var vis = 0;
    $.each(oSettings.aoColumns, function (i, col) {
      if (col.bVisible && $(col.nTh).css('display') !== 'none') {
        vis++;
      }
    });
    return vis;
  }

  function _fnGetColumns(oSettings, sParam) {
    var a = [];
    $.map(oSettings.aoColumns, function (val, i) {
      if (val[sParam]) {
        a.push(i);
      }
    });
    return a;
  }

  function _fnColumnTypes(settings) {
    var columns = settings.aoColumns;
    var data = settings.aoData;
    var types = DataTable.ext.type.detect;
    var i, ien, j, jen, k, ken;
    var col, cell, detectedType, cache;

    for (i = 0, ien = columns.length; i < ien; i++) {
      col = columns[i];
      cache = [];

      if (!col.sType && col._sManualType) {
        col.sType = col._sManualType;
      } else if (!col.sType) {
        for (j = 0, jen = types.length; j < jen; j++) {
          for (k = 0, ken = data.length; k < ken; k++) {
            if (cache[k] === undefined) {
              cache[k] = _fnGetCellData(settings, k, i, 'type');
            }

            detectedType = types[j](cache[k], settings);

            if (!detectedType && j !== types.length - 1) {
              break;
            }

            if (detectedType === 'html') {
              break;
            }
          }

          if (detectedType) {
            col.sType = detectedType;
            break;
          }
        }

        if (!col.sType) {
          col.sType = 'string';
        }
      }
    }
  }

  function _fnApplyColumnDefs(oSettings, aoColDefs, aoCols, fn) {
    var i, iLen, j, jLen, k, kLen, def;
    var columns = oSettings.aoColumns;

    if (aoColDefs) {
      for (i = aoColDefs.length - 1; i >= 0; i--) {
        def = aoColDefs[i];
        var aTargets = def.targets !== undefined ? def.targets : def.aTargets;

        if (!$.isArray(aTargets)) {
          aTargets = [aTargets];
        }

        for (j = 0, jLen = aTargets.length; j < jLen; j++) {
          if (typeof aTargets[j] === 'number' && aTargets[j] >= 0) {
            while (columns.length <= aTargets[j]) {
              _fnAddColumn(oSettings);
            }

            fn(aTargets[j], def);
          } else if (typeof aTargets[j] === 'number' && aTargets[j] < 0) {
            fn(columns.length + aTargets[j], def);
          } else if (typeof aTargets[j] === 'string') {
            for (k = 0, kLen = columns.length; k < kLen; k++) {
              if (aTargets[j] == "_all" || $(columns[k].nTh).hasClass(aTargets[j])) {
                fn(k, def);
              }
            }
          }
        }
      }
    }

    if (aoCols) {
      for (i = 0, iLen = aoCols.length; i < iLen; i++) {
        fn(i, aoCols[i]);
      }
    }
  }

  function _fnAddData(oSettings, aDataIn, nTr, anTds) {
    var iRow = oSettings.aoData.length;
    var oData = $.extend(true, {}, DataTable.models.oRow, {
      src: nTr ? 'dom' : 'data',
      idx: iRow
    });
    oData._aData = aDataIn;
    oSettings.aoData.push(oData);
    var nTd, sThisType;
    var columns = oSettings.aoColumns;

    for (var i = 0, iLen = columns.length; i < iLen; i++) {
      columns[i].sType = null;
    }

    oSettings.aiDisplayMaster.push(iRow);
    var id = oSettings.rowIdFn(aDataIn);

    if (id !== undefined) {
      oSettings.aIds[id] = oData;
    }

    if (nTr || !oSettings.oFeatures.bDeferRender) {
      _fnCreateTr(oSettings, iRow, nTr, anTds);
    }

    return iRow;
  }

  function _fnAddTr(settings, trs) {
    var row;

    if (!(trs instanceof $)) {
      trs = $(trs);
    }

    return trs.map(function (i, el) {
      row = _fnGetRowElements(settings, el);
      return _fnAddData(settings, row.data, el, row.cells);
    });
  }

  function _fnNodeToDataIndex(oSettings, n) {
    return n._DT_RowIndex !== undefined ? n._DT_RowIndex : null;
  }

  function _fnNodeToColumnIndex(oSettings, iRow, n) {
    return $.inArray(n, oSettings.aoData[iRow].anCells);
  }

  function _fnGetCellData(settings, rowIdx, colIdx, type) {
    var draw = settings.iDraw;
    var col = settings.aoColumns[colIdx];
    var rowData = settings.aoData[rowIdx]._aData;
    var defaultContent = col.sDefaultContent;
    var cellData = col.fnGetData(rowData, type, {
      settings: settings,
      row: rowIdx,
      col: colIdx
    });

    if (cellData === undefined) {
      if (settings.iDrawError != draw && defaultContent === null) {
        _fnLog(settings, 0, "Requested unknown parameter " + (typeof col.mData == 'function' ? '{function}' : "'" + col.mData + "'") + " for row " + rowIdx + ", column " + colIdx, 4);

        settings.iDrawError = draw;
      }

      return defaultContent;
    }

    if ((cellData === rowData || cellData === null) && defaultContent !== null && type !== undefined) {
      cellData = defaultContent;
    } else if (typeof cellData === 'function') {
      return cellData.call(rowData);
    }

    if (cellData === null && type == 'display') {
      return '';
    }

    return cellData;
  }

  function _fnSetCellData(settings, rowIdx, colIdx, val) {
    var col = settings.aoColumns[colIdx];
    var rowData = settings.aoData[rowIdx]._aData;
    col.fnSetData(rowData, val, {
      settings: settings,
      row: rowIdx,
      col: colIdx
    });
  }

  var __reArray = /\[.*?\]$/;
  var __reFn = /\(\)$/;

  function _fnSplitObjNotation(str) {
    return $.map(str.match(/(\\.|[^\.])+/g) || [''], function (s) {
      return s.replace(/\\\./g, '.');
    });
  }

  function _fnGetObjectDataFn(mSource) {
    if ($.isPlainObject(mSource)) {
      var o = {};
      $.each(mSource, function (key, val) {
        if (val) {
          o[key] = _fnGetObjectDataFn(val);
        }
      });
      return function (data, type, row, meta) {
        var t = o[type] || o._;
        return t !== undefined ? t(data, type, row, meta) : data;
      };
    } else if (mSource === null) {
      return function (data) {
        return data;
      };
    } else if (typeof mSource === 'function') {
      return function (data, type, row, meta) {
        return mSource(data, type, row, meta);
      };
    } else if (typeof mSource === 'string' && (mSource.indexOf('.') !== -1 || mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1)) {
      var fetchData = function fetchData(data, type, src) {
        var arrayNotation, funcNotation, out, innerSrc;

        if (src !== "") {
          var a = _fnSplitObjNotation(src);

          for (var i = 0, iLen = a.length; i < iLen; i++) {
            arrayNotation = a[i].match(__reArray);
            funcNotation = a[i].match(__reFn);

            if (arrayNotation) {
              a[i] = a[i].replace(__reArray, '');

              if (a[i] !== "") {
                data = data[a[i]];
              }

              out = [];
              a.splice(0, i + 1);
              innerSrc = a.join('.');

              if ($.isArray(data)) {
                for (var j = 0, jLen = data.length; j < jLen; j++) {
                  out.push(fetchData(data[j], type, innerSrc));
                }
              }

              var join = arrayNotation[0].substring(1, arrayNotation[0].length - 1);
              data = join === "" ? out : out.join(join);
              break;
            } else if (funcNotation) {
              a[i] = a[i].replace(__reFn, '');
              data = data[a[i]]();
              continue;
            }

            if (data === null || data[a[i]] === undefined) {
              return undefined;
            }

            data = data[a[i]];
          }
        }

        return data;
      };

      return function (data, type) {
        return fetchData(data, type, mSource);
      };
    } else {
      return function (data, type) {
        return data[mSource];
      };
    }
  }

  function _fnSetObjectDataFn(mSource) {
    if ($.isPlainObject(mSource)) {
      return _fnSetObjectDataFn(mSource._);
    } else if (mSource === null) {
      return function () {};
    } else if (typeof mSource === 'function') {
      return function (data, val, meta) {
        mSource(data, 'set', val, meta);
      };
    } else if (typeof mSource === 'string' && (mSource.indexOf('.') !== -1 || mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1)) {
      var setData = function setData(data, val, src) {
        var a = _fnSplitObjNotation(src),
            b;

        var aLast = a[a.length - 1];
        var arrayNotation, funcNotation, o, innerSrc;

        for (var i = 0, iLen = a.length - 1; i < iLen; i++) {
          arrayNotation = a[i].match(__reArray);
          funcNotation = a[i].match(__reFn);

          if (arrayNotation) {
            a[i] = a[i].replace(__reArray, '');
            data[a[i]] = [];
            b = a.slice();
            b.splice(0, i + 1);
            innerSrc = b.join('.');

            if ($.isArray(val)) {
              for (var j = 0, jLen = val.length; j < jLen; j++) {
                o = {};
                setData(o, val[j], innerSrc);
                data[a[i]].push(o);
              }
            } else {
              data[a[i]] = val;
            }

            return;
          } else if (funcNotation) {
            a[i] = a[i].replace(__reFn, '');
            data = data[a[i]](val);
          }

          if (data[a[i]] === null || data[a[i]] === undefined) {
            data[a[i]] = {};
          }

          data = data[a[i]];
        }

        if (aLast.match(__reFn)) {
          data = data[aLast.replace(__reFn, '')](val);
        } else {
          data[aLast.replace(__reArray, '')] = val;
        }
      };

      return function (data, val) {
        return setData(data, val, mSource);
      };
    } else {
      return function (data, val) {
        data[mSource] = val;
      };
    }
  }

  function _fnGetDataMaster(settings) {
    return _pluck(settings.aoData, '_aData');
  }

  function _fnClearTable(settings) {
    settings.aoData.length = 0;
    settings.aiDisplayMaster.length = 0;
    settings.aiDisplay.length = 0;
    settings.aIds = {};
  }

  function _fnDeleteIndex(a, iTarget, splice) {
    var iTargetIndex = -1;

    for (var i = 0, iLen = a.length; i < iLen; i++) {
      if (a[i] == iTarget) {
        iTargetIndex = i;
      } else if (a[i] > iTarget) {
        a[i]--;
      }
    }

    if (iTargetIndex != -1 && splice === undefined) {
      a.splice(iTargetIndex, 1);
    }
  }

  function _fnInvalidate(settings, rowIdx, src, colIdx) {
    var row = settings.aoData[rowIdx];
    var i, ien;

    var cellWrite = function cellWrite(cell, col) {
      while (cell.childNodes.length) {
        cell.removeChild(cell.firstChild);
      }

      cell.innerHTML = _fnGetCellData(settings, rowIdx, col, 'display');
    };

    if (src === 'dom' || (!src || src === 'auto') && row.src === 'dom') {
      row._aData = _fnGetRowElements(settings, row, colIdx, colIdx === undefined ? undefined : row._aData).data;
    } else {
      var cells = row.anCells;

      if (cells) {
        if (colIdx !== undefined) {
          cellWrite(cells[colIdx], colIdx);
        } else {
          for (i = 0, ien = cells.length; i < ien; i++) {
            cellWrite(cells[i], i);
          }
        }
      }
    }

    row._aSortData = null;
    row._aFilterData = null;
    var cols = settings.aoColumns;

    if (colIdx !== undefined) {
      cols[colIdx].sType = null;
    } else {
      for (i = 0, ien = cols.length; i < ien; i++) {
        cols[i].sType = null;
      }

      _fnRowAttributes(settings, row);
    }
  }

  function _fnGetRowElements(settings, row, colIdx, d) {
    var tds = [],
        td = row.firstChild,
        name,
        col,
        o,
        i = 0,
        contents,
        columns = settings.aoColumns,
        objectRead = settings._rowReadObject;
    d = d !== undefined ? d : objectRead ? {} : [];

    var attr = function attr(str, td) {
      if (typeof str === 'string') {
        var idx = str.indexOf('@');

        if (idx !== -1) {
          var attr = str.substring(idx + 1);

          var setter = _fnSetObjectDataFn(str);

          setter(d, td.getAttribute(attr));
        }
      }
    };

    var cellProcess = function cellProcess(cell) {
      if (colIdx === undefined || colIdx === i) {
        col = columns[i];
        contents = $.trim(cell.innerHTML);

        if (col && col._bAttrSrc) {
          var setter = _fnSetObjectDataFn(col.mData._);

          setter(d, contents);
          attr(col.mData.sort, cell);
          attr(col.mData.type, cell);
          attr(col.mData.filter, cell);
        } else {
          if (objectRead) {
            if (!col._setter) {
              col._setter = _fnSetObjectDataFn(col.mData);
            }

            col._setter(d, contents);
          } else {
            d[i] = contents;
          }
        }
      }

      i++;
    };

    if (td) {
      while (td) {
        name = td.nodeName.toUpperCase();

        if (name == "TD" || name == "TH") {
          cellProcess(td);
          tds.push(td);
        }

        td = td.nextSibling;
      }
    } else {
      tds = row.anCells;

      for (var j = 0, jen = tds.length; j < jen; j++) {
        cellProcess(tds[j]);
      }
    }

    var rowNode = row.firstChild ? row : row.nTr;

    if (rowNode) {
      var id = rowNode.getAttribute('id');

      if (id) {
        _fnSetObjectDataFn(settings.rowId)(d, id);
      }
    }

    return {
      data: d,
      cells: tds
    };
  }

  function _fnCreateTr(oSettings, iRow, nTrIn, anTds) {
    var row = oSettings.aoData[iRow],
        rowData = row._aData,
        cells = [],
        nTr,
        nTd,
        oCol,
        i,
        iLen;

    if (row.nTr === null) {
      nTr = nTrIn || document.createElement('tr');
      row.nTr = nTr;
      row.anCells = cells;
      nTr._DT_RowIndex = iRow;

      _fnRowAttributes(oSettings, row);

      for (i = 0, iLen = oSettings.aoColumns.length; i < iLen; i++) {
        oCol = oSettings.aoColumns[i];
        nTd = nTrIn ? anTds[i] : document.createElement(oCol.sCellType);
        nTd._DT_CellIndex = {
          row: iRow,
          column: i
        };
        cells.push(nTd);

        if ((!nTrIn || oCol.mRender || oCol.mData !== i) && (!$.isPlainObject(oCol.mData) || oCol.mData._ !== i + '.display')) {
          nTd.innerHTML = _fnGetCellData(oSettings, iRow, i, 'display');
        }

        if (oCol.sClass) {
          nTd.className += ' ' + oCol.sClass;
        }

        if (oCol.bVisible && !nTrIn) {
          nTr.appendChild(nTd);
        } else if (!oCol.bVisible && nTrIn) {
          nTd.parentNode.removeChild(nTd);
        }

        if (oCol.fnCreatedCell) {
          oCol.fnCreatedCell.call(oSettings.oInstance, nTd, _fnGetCellData(oSettings, iRow, i), rowData, iRow, i);
        }
      }

      _fnCallbackFire(oSettings, 'aoRowCreatedCallback', null, [nTr, rowData, iRow, cells]);
    }

    row.nTr.setAttribute('role', 'row');
  }

  function _fnRowAttributes(settings, row) {
    var tr = row.nTr;
    var data = row._aData;

    if (tr) {
      var id = settings.rowIdFn(data);

      if (id) {
        tr.id = id;
      }

      if (data.DT_RowClass) {
        var a = data.DT_RowClass.split(' ');
        row.__rowc = row.__rowc ? _unique(row.__rowc.concat(a)) : a;
        $(tr).removeClass(row.__rowc.join(' ')).addClass(data.DT_RowClass);
      }

      if (data.DT_RowAttr) {
        $(tr).attr(data.DT_RowAttr);
      }

      if (data.DT_RowData) {
        $(tr).data(data.DT_RowData);
      }
    }
  }

  function _fnBuildHead(oSettings) {
    var i, ien, cell, row, column;
    var thead = oSettings.nTHead;
    var tfoot = oSettings.nTFoot;
    var createHeader = $('th, td', thead).length === 0;
    var classes = oSettings.oClasses;
    var columns = oSettings.aoColumns;

    if (createHeader) {
      row = $('<tr/>').appendTo(thead);
    }

    for (i = 0, ien = columns.length; i < ien; i++) {
      column = columns[i];
      cell = $(column.nTh).addClass(column.sClass);

      if (createHeader) {
        cell.appendTo(row);
      }

      if (oSettings.oFeatures.bSort) {
        cell.addClass(column.sSortingClass);

        if (column.bSortable !== false) {
          cell.attr('tabindex', oSettings.iTabIndex).attr('aria-controls', oSettings.sTableId);

          _fnSortAttachListener(oSettings, column.nTh, i);
        }
      }

      if (column.sTitle != cell[0].innerHTML) {
        cell.html(column.sTitle);
      }

      _fnRenderer(oSettings, 'header')(oSettings, cell, column, classes);
    }

    if (createHeader) {
      _fnDetectHeader(oSettings.aoHeader, thead);
    }

    $(thead).find('>tr').attr('role', 'row');
    $(thead).find('>tr>th, >tr>td').addClass(classes.sHeaderTH);
    $(tfoot).find('>tr>th, >tr>td').addClass(classes.sFooterTH);

    if (tfoot !== null) {
      var cells = oSettings.aoFooter[0];

      for (i = 0, ien = cells.length; i < ien; i++) {
        column = columns[i];
        column.nTf = cells[i].cell;

        if (column.sClass) {
          $(column.nTf).addClass(column.sClass);
        }
      }
    }
  }

  function _fnDrawHead(oSettings, aoSource, bIncludeHidden) {
    var i, iLen, j, jLen, k, kLen, n, nLocalTr;
    var aoLocal = [];
    var aApplied = [];
    var iColumns = oSettings.aoColumns.length;
    var iRowspan, iColspan;

    if (!aoSource) {
      return;
    }

    if (bIncludeHidden === undefined) {
      bIncludeHidden = false;
    }

    for (i = 0, iLen = aoSource.length; i < iLen; i++) {
      aoLocal[i] = aoSource[i].slice();
      aoLocal[i].nTr = aoSource[i].nTr;

      for (j = iColumns - 1; j >= 0; j--) {
        if (!oSettings.aoColumns[j].bVisible && !bIncludeHidden) {
          aoLocal[i].splice(j, 1);
        }
      }

      aApplied.push([]);
    }

    for (i = 0, iLen = aoLocal.length; i < iLen; i++) {
      nLocalTr = aoLocal[i].nTr;

      if (nLocalTr) {
        while (n = nLocalTr.firstChild) {
          nLocalTr.removeChild(n);
        }
      }

      for (j = 0, jLen = aoLocal[i].length; j < jLen; j++) {
        iRowspan = 1;
        iColspan = 1;

        if (aApplied[i][j] === undefined) {
          nLocalTr.appendChild(aoLocal[i][j].cell);
          aApplied[i][j] = 1;

          while (aoLocal[i + iRowspan] !== undefined && aoLocal[i][j].cell == aoLocal[i + iRowspan][j].cell) {
            aApplied[i + iRowspan][j] = 1;
            iRowspan++;
          }

          while (aoLocal[i][j + iColspan] !== undefined && aoLocal[i][j].cell == aoLocal[i][j + iColspan].cell) {
            for (k = 0; k < iRowspan; k++) {
              aApplied[i + k][j + iColspan] = 1;
            }

            iColspan++;
          }

          $(aoLocal[i][j].cell).attr('rowspan', iRowspan).attr('colspan', iColspan);
        }
      }
    }
  }

  function _fnDraw(oSettings) {
    var aPreDraw = _fnCallbackFire(oSettings, 'aoPreDrawCallback', 'preDraw', [oSettings]);

    if ($.inArray(false, aPreDraw) !== -1) {
      _fnProcessingDisplay(oSettings, false);

      return;
    }

    var i, iLen, n;
    var anRows = [];
    var iRowCount = 0;
    var asStripeClasses = oSettings.asStripeClasses;
    var iStripes = asStripeClasses.length;
    var iOpenRows = oSettings.aoOpenRows.length;
    var oLang = oSettings.oLanguage;
    var iInitDisplayStart = oSettings.iInitDisplayStart;
    var bServerSide = _fnDataSource(oSettings) == 'ssp';
    var aiDisplay = oSettings.aiDisplay;
    oSettings.bDrawing = true;

    if (iInitDisplayStart !== undefined && iInitDisplayStart !== -1) {
      oSettings._iDisplayStart = bServerSide ? iInitDisplayStart : iInitDisplayStart >= oSettings.fnRecordsDisplay() ? 0 : iInitDisplayStart;
      oSettings.iInitDisplayStart = -1;
    }

    var iDisplayStart = oSettings._iDisplayStart;
    var iDisplayEnd = oSettings.fnDisplayEnd();

    if (oSettings.bDeferLoading) {
      oSettings.bDeferLoading = false;
      oSettings.iDraw++;

      _fnProcessingDisplay(oSettings, false);
    } else if (!bServerSide) {
      oSettings.iDraw++;
    } else if (!oSettings.bDestroying && !_fnAjaxUpdate(oSettings)) {
      return;
    }

    if (aiDisplay.length !== 0) {
      var iStart = bServerSide ? 0 : iDisplayStart;
      var iEnd = bServerSide ? oSettings.aoData.length : iDisplayEnd;

      for (var j = iStart; j < iEnd; j++) {
        var iDataIndex = aiDisplay[j];
        var aoData = oSettings.aoData[iDataIndex];

        if (aoData.nTr === null) {
          _fnCreateTr(oSettings, iDataIndex);
        }

        var nRow = aoData.nTr;

        if (iStripes !== 0) {
          var sStripe = asStripeClasses[iRowCount % iStripes];

          if (aoData._sRowStripe != sStripe) {
            $(nRow).removeClass(aoData._sRowStripe).addClass(sStripe);
            aoData._sRowStripe = sStripe;
          }
        }

        _fnCallbackFire(oSettings, 'aoRowCallback', null, [nRow, aoData._aData, iRowCount, j, iDataIndex]);

        anRows.push(nRow);
        iRowCount++;
      }
    } else {
      var sZero = oLang.sZeroRecords;

      if (oSettings.iDraw == 1 && _fnDataSource(oSettings) == 'ajax') {
        sZero = oLang.sLoadingRecords;
      } else if (oLang.sEmptyTable && oSettings.fnRecordsTotal() === 0) {
        sZero = oLang.sEmptyTable;
      }

      anRows[0] = $('<tr/>', {
        'class': iStripes ? asStripeClasses[0] : ''
      }).append($('<td />', {
        'valign': 'top',
        'colSpan': _fnVisbleColumns(oSettings),
        'class': oSettings.oClasses.sRowEmpty
      }).html(sZero))[0];
    }

    _fnCallbackFire(oSettings, 'aoHeaderCallback', 'header', [$(oSettings.nTHead).children('tr')[0], _fnGetDataMaster(oSettings), iDisplayStart, iDisplayEnd, aiDisplay]);

    _fnCallbackFire(oSettings, 'aoFooterCallback', 'footer', [$(oSettings.nTFoot).children('tr')[0], _fnGetDataMaster(oSettings), iDisplayStart, iDisplayEnd, aiDisplay]);

    var body = $(oSettings.nTBody);
    body.children().detach();
    body.append($(anRows));

    _fnCallbackFire(oSettings, 'aoDrawCallback', 'draw', [oSettings]);

    oSettings.bSorted = false;
    oSettings.bFiltered = false;
    oSettings.bDrawing = false;
  }

  function _fnReDraw(settings, holdPosition) {
    var features = settings.oFeatures,
        sort = features.bSort,
        filter = features.bFilter;

    if (sort) {
      _fnSort(settings);
    }

    if (filter) {
      _fnFilterComplete(settings, settings.oPreviousSearch);
    } else {
      settings.aiDisplay = settings.aiDisplayMaster.slice();
    }

    if (holdPosition !== true) {
      settings._iDisplayStart = 0;
    }

    settings._drawHold = holdPosition;

    _fnDraw(settings);

    settings._drawHold = false;
  }

  function _fnAddOptionsHtml(oSettings) {
    var classes = oSettings.oClasses;
    var table = $(oSettings.nTable);
    var holding = $('<div/>').insertBefore(table);
    var features = oSettings.oFeatures;
    var insert = $('<div/>', {
      id: oSettings.sTableId + '_wrapper',
      'class': classes.sWrapper + (oSettings.nTFoot ? '' : ' ' + classes.sNoFooter)
    });
    oSettings.nHolding = holding[0];
    oSettings.nTableWrapper = insert[0];
    oSettings.nTableReinsertBefore = oSettings.nTable.nextSibling;
    var aDom = oSettings.sDom.split('');
    var featureNode, cOption, nNewNode, cNext, sAttr, j;

    for (var i = 0; i < aDom.length; i++) {
      featureNode = null;
      cOption = aDom[i];

      if (cOption == '<') {
        nNewNode = $('<div/>')[0];
        cNext = aDom[i + 1];

        if (cNext == "'" || cNext == '"') {
          sAttr = "";
          j = 2;

          while (aDom[i + j] != cNext) {
            sAttr += aDom[i + j];
            j++;
          }

          if (sAttr == "H") {
            sAttr = classes.sJUIHeader;
          } else if (sAttr == "F") {
            sAttr = classes.sJUIFooter;
          }

          if (sAttr.indexOf('.') != -1) {
            var aSplit = sAttr.split('.');
            nNewNode.id = aSplit[0].substr(1, aSplit[0].length - 1);
            nNewNode.className = aSplit[1];
          } else if (sAttr.charAt(0) == "#") {
            nNewNode.id = sAttr.substr(1, sAttr.length - 1);
          } else {
            nNewNode.className = sAttr;
          }

          i += j;
        }

        insert.append(nNewNode);
        insert = $(nNewNode);
      } else if (cOption == '>') {
        insert = insert.parent();
      } else if (cOption == 'l' && features.bPaginate && features.bLengthChange) {
          featureNode = _fnFeatureHtmlLength(oSettings);
        } else if (cOption == 'f' && features.bFilter) {
          featureNode = _fnFeatureHtmlFilter(oSettings);
        } else if (cOption == 'r' && features.bProcessing) {
          featureNode = _fnFeatureHtmlProcessing(oSettings);
        } else if (cOption == 't') {
          featureNode = _fnFeatureHtmlTable(oSettings);
        } else if (cOption == 'i' && features.bInfo) {
          featureNode = _fnFeatureHtmlInfo(oSettings);
        } else if (cOption == 'p' && features.bPaginate) {
          featureNode = _fnFeatureHtmlPaginate(oSettings);
        } else if (DataTable.ext.feature.length !== 0) {
          var aoFeatures = DataTable.ext.feature;

          for (var k = 0, kLen = aoFeatures.length; k < kLen; k++) {
            if (cOption == aoFeatures[k].cFeature) {
              featureNode = aoFeatures[k].fnInit(oSettings);
              break;
            }
          }
        }

      if (featureNode) {
        var aanFeatures = oSettings.aanFeatures;

        if (!aanFeatures[cOption]) {
          aanFeatures[cOption] = [];
        }

        aanFeatures[cOption].push(featureNode);
        insert.append(featureNode);
      }
    }

    holding.replaceWith(insert);
    oSettings.nHolding = null;
  }

  function _fnDetectHeader(aLayout, nThead) {
    var nTrs = $(nThead).children('tr');
    var nTr, nCell;
    var i, k, l, iLen, jLen, iColShifted, iColumn, iColspan, iRowspan;
    var bUnique;

    var fnShiftCol = function fnShiftCol(a, i, j) {
      var k = a[i];

      while (k[j]) {
        j++;
      }

      return j;
    };

    aLayout.splice(0, aLayout.length);

    for (i = 0, iLen = nTrs.length; i < iLen; i++) {
      aLayout.push([]);
    }

    for (i = 0, iLen = nTrs.length; i < iLen; i++) {
      nTr = nTrs[i];
      iColumn = 0;
      nCell = nTr.firstChild;

      while (nCell) {
        if (nCell.nodeName.toUpperCase() == "TD" || nCell.nodeName.toUpperCase() == "TH") {
          iColspan = nCell.getAttribute('colspan') * 1;
          iRowspan = nCell.getAttribute('rowspan') * 1;
          iColspan = !iColspan || iColspan === 0 || iColspan === 1 ? 1 : iColspan;
          iRowspan = !iRowspan || iRowspan === 0 || iRowspan === 1 ? 1 : iRowspan;
          iColShifted = fnShiftCol(aLayout, i, iColumn);
          bUnique = iColspan === 1 ? true : false;

          for (l = 0; l < iColspan; l++) {
            for (k = 0; k < iRowspan; k++) {
              aLayout[i + k][iColShifted + l] = {
                "cell": nCell,
                "unique": bUnique
              };
              aLayout[i + k].nTr = nTr;
            }
          }
        }

        nCell = nCell.nextSibling;
      }
    }
  }

  function _fnGetUniqueThs(oSettings, nHeader, aLayout) {
    var aReturn = [];

    if (!aLayout) {
      aLayout = oSettings.aoHeader;

      if (nHeader) {
        aLayout = [];

        _fnDetectHeader(aLayout, nHeader);
      }
    }

    for (var i = 0, iLen = aLayout.length; i < iLen; i++) {
      for (var j = 0, jLen = aLayout[i].length; j < jLen; j++) {
        if (aLayout[i][j].unique && (!aReturn[j] || !oSettings.bSortCellsTop)) {
          aReturn[j] = aLayout[i][j].cell;
        }
      }
    }

    return aReturn;
  }

  function _fnBuildAjax(oSettings, data, fn) {
    _fnCallbackFire(oSettings, 'aoServerParams', 'serverParams', [data]);

    if (data && $.isArray(data)) {
      var tmp = {};
      var rbracket = /(.*?)\[\]$/;
      $.each(data, function (key, val) {
        var match = val.name.match(rbracket);

        if (match) {
          var name = match[0];

          if (!tmp[name]) {
            tmp[name] = [];
          }

          tmp[name].push(val.value);
        } else {
          tmp[val.name] = val.value;
        }
      });
      data = tmp;
    }

    var ajaxData;
    var ajax = oSettings.ajax;
    var instance = oSettings.oInstance;

    var callback = function callback(json) {
      _fnCallbackFire(oSettings, null, 'xhr', [oSettings, json, oSettings.jqXHR]);

      fn(json);
    };

    if ($.isPlainObject(ajax) && ajax.data) {
      ajaxData = ajax.data;
      var newData = typeof ajaxData === 'function' ? ajaxData(data, oSettings) : ajaxData;
      data = typeof ajaxData === 'function' && newData ? newData : $.extend(true, data, newData);
      delete ajax.data;
    }

    var baseAjax = {
      "data": data,
      "success": function success(json) {
        var error = json.error || json.sError;

        if (error) {
          _fnLog(oSettings, 0, error);
        }

        oSettings.json = json;
        callback(json);
      },
      "dataType": "json",
      "cache": false,
      "type": oSettings.sServerMethod,
      "error": function error(xhr, _error, thrown) {
        var ret = _fnCallbackFire(oSettings, null, 'xhr', [oSettings, null, oSettings.jqXHR]);

        if ($.inArray(true, ret) === -1) {
          if (_error == "parsererror") {
            _fnLog(oSettings, 0, 'Invalid JSON response', 1);
          } else if (xhr.readyState === 4) {
            _fnLog(oSettings, 0, 'Ajax error', 7);
          }
        }

        _fnProcessingDisplay(oSettings, false);
      }
    };
    oSettings.oAjaxData = data;

    _fnCallbackFire(oSettings, null, 'preXhr', [oSettings, data]);

    if (oSettings.fnServerData) {
      oSettings.fnServerData.call(instance, oSettings.sAjaxSource, $.map(data, function (val, key) {
        return {
          name: key,
          value: val
        };
      }), callback, oSettings);
    } else if (oSettings.sAjaxSource || typeof ajax === 'string') {
      oSettings.jqXHR = $.ajax($.extend(baseAjax, {
        url: ajax || oSettings.sAjaxSource
      }));
    } else if (typeof ajax === 'function') {
      oSettings.jqXHR = ajax.call(instance, data, callback, oSettings);
    } else {
      oSettings.jqXHR = $.ajax($.extend(baseAjax, ajax));
      ajax.data = ajaxData;
    }
  }

  function _fnAjaxUpdate(settings) {
    if (settings.bAjaxDataGet) {
      settings.iDraw++;

      _fnProcessingDisplay(settings, true);

      _fnBuildAjax(settings, _fnAjaxParameters(settings), function (json) {
        _fnAjaxUpdateDraw(settings, json);
      });

      return false;
    }

    return true;
  }

  function _fnAjaxParameters(settings) {
    var columns = settings.aoColumns,
        columnCount = columns.length,
        features = settings.oFeatures,
        preSearch = settings.oPreviousSearch,
        preColSearch = settings.aoPreSearchCols,
        i,
        data = [],
        dataProp,
        column,
        columnSearch,
        sort = _fnSortFlatten(settings),
        displayStart = settings._iDisplayStart,
        displayLength = features.bPaginate !== false ? settings._iDisplayLength : -1;

    var param = function param(name, value) {
      data.push({
        'name': name,
        'value': value
      });
    };

    param('sEcho', settings.iDraw);
    param('iColumns', columnCount);
    param('sColumns', _pluck(columns, 'sName').join(','));
    param('iDisplayStart', displayStart);
    param('iDisplayLength', displayLength);
    var d = {
      draw: settings.iDraw,
      columns: [],
      order: [],
      start: displayStart,
      length: displayLength,
      search: {
        value: preSearch.sSearch,
        regex: preSearch.bRegex
      }
    };

    for (i = 0; i < columnCount; i++) {
      column = columns[i];
      columnSearch = preColSearch[i];
      dataProp = typeof column.mData == "function" ? 'function' : column.mData;
      d.columns.push({
        data: dataProp,
        name: column.sName,
        searchable: column.bSearchable,
        orderable: column.bSortable,
        search: {
          value: columnSearch.sSearch,
          regex: columnSearch.bRegex
        }
      });
      param("mDataProp_" + i, dataProp);

      if (features.bFilter) {
        param('sSearch_' + i, columnSearch.sSearch);
        param('bRegex_' + i, columnSearch.bRegex);
        param('bSearchable_' + i, column.bSearchable);
      }

      if (features.bSort) {
        param('bSortable_' + i, column.bSortable);
      }
    }

    if (features.bFilter) {
      param('sSearch', preSearch.sSearch);
      param('bRegex', preSearch.bRegex);
    }

    if (features.bSort) {
      $.each(sort, function (i, val) {
        d.order.push({
          column: val.col,
          dir: val.dir
        });
        param('iSortCol_' + i, val.col);
        param('sSortDir_' + i, val.dir);
      });
      param('iSortingCols', sort.length);
    }

    var legacy = DataTable.ext.legacy.ajax;

    if (legacy === null) {
      return settings.sAjaxSource ? data : d;
    }

    return legacy ? data : d;
  }

  function _fnAjaxUpdateDraw(settings, json) {
    var compat = function compat(old, modern) {
      return json[old] !== undefined ? json[old] : json[modern];
    };

    var data = _fnAjaxDataSrc(settings, json);

    var draw = compat('sEcho', 'draw');
    var recordsTotal = compat('iTotalRecords', 'recordsTotal');
    var recordsFiltered = compat('iTotalDisplayRecords', 'recordsFiltered');

    if (draw) {
      if (draw * 1 < settings.iDraw) {
        return;
      }

      settings.iDraw = draw * 1;
    }

    _fnClearTable(settings);

    settings._iRecordsTotal = parseInt(recordsTotal, 10);
    settings._iRecordsDisplay = parseInt(recordsFiltered, 10);

    for (var i = 0, ien = data.length; i < ien; i++) {
      _fnAddData(settings, data[i]);
    }

    settings.aiDisplay = settings.aiDisplayMaster.slice();
    settings.bAjaxDataGet = false;

    _fnDraw(settings);

    if (!settings._bInitComplete) {
      _fnInitComplete(settings, json);
    }

    settings.bAjaxDataGet = true;

    _fnProcessingDisplay(settings, false);
  }

  function _fnAjaxDataSrc(oSettings, json) {
    var dataSrc = $.isPlainObject(oSettings.ajax) && oSettings.ajax.dataSrc !== undefined ? oSettings.ajax.dataSrc : oSettings.sAjaxDataProp;

    if (dataSrc === 'data') {
      return json.aaData || json[dataSrc];
    }

    return dataSrc !== "" ? _fnGetObjectDataFn(dataSrc)(json) : json;
  }

  function _fnFeatureHtmlFilter(settings) {
    var classes = settings.oClasses;
    var tableId = settings.sTableId;
    var language = settings.oLanguage;
    var previousSearch = settings.oPreviousSearch;
    var features = settings.aanFeatures;
    var input = '<input type="search" class="' + classes.sFilterInput + '"/>';
    var str = language.sSearch;
    str = str.match(/_INPUT_/) ? str.replace('_INPUT_', input) : str + input;
    var filter = $('<div/>', {
      'id': !features.f ? tableId + '_filter' : null,
      'class': classes.sFilter
    }).append($('<label/>').append(str));

    var searchFn = function searchFn() {
      var n = features.f;
      var val = !this.value ? "" : this.value;

      if (val != previousSearch.sSearch) {
        _fnFilterComplete(settings, {
          "sSearch": val,
          "bRegex": previousSearch.bRegex,
          "bSmart": previousSearch.bSmart,
          "bCaseInsensitive": previousSearch.bCaseInsensitive
        });

        settings._iDisplayStart = 0;

        _fnDraw(settings);
      }
    };

    var searchDelay = settings.searchDelay !== null ? settings.searchDelay : _fnDataSource(settings) === 'ssp' ? 400 : 0;
    var jqFilter = $('input', filter).val(previousSearch.sSearch).attr('placeholder', language.sSearchPlaceholder).on('keyup.DT search.DT input.DT paste.DT cut.DT', searchDelay ? _fnThrottle(searchFn, searchDelay) : searchFn).on('keypress.DT', function (e) {
      if (e.keyCode == 13) {
        return false;
      }
    }).attr('aria-controls', tableId);
    $(settings.nTable).on('search.dt.DT', function (ev, s) {
      if (settings === s) {
        try {
          if (jqFilter[0] !== document.activeElement) {
            jqFilter.val(previousSearch.sSearch);
          }
        } catch (e) {}
      }
    });
    return filter[0];
  }

  function _fnFilterComplete(oSettings, oInput, iForce) {
    var oPrevSearch = oSettings.oPreviousSearch;
    var aoPrevSearch = oSettings.aoPreSearchCols;

    var fnSaveFilter = function fnSaveFilter(oFilter) {
      oPrevSearch.sSearch = oFilter.sSearch;
      oPrevSearch.bRegex = oFilter.bRegex;
      oPrevSearch.bSmart = oFilter.bSmart;
      oPrevSearch.bCaseInsensitive = oFilter.bCaseInsensitive;
    };

    var fnRegex = function fnRegex(o) {
      return o.bEscapeRegex !== undefined ? !o.bEscapeRegex : o.bRegex;
    };

    _fnColumnTypes(oSettings);

    if (_fnDataSource(oSettings) != 'ssp') {
      _fnFilter(oSettings, oInput.sSearch, iForce, fnRegex(oInput), oInput.bSmart, oInput.bCaseInsensitive);

      fnSaveFilter(oInput);

      for (var i = 0; i < aoPrevSearch.length; i++) {
        _fnFilterColumn(oSettings, aoPrevSearch[i].sSearch, i, fnRegex(aoPrevSearch[i]), aoPrevSearch[i].bSmart, aoPrevSearch[i].bCaseInsensitive);
      }

      _fnFilterCustom(oSettings);
    } else {
      fnSaveFilter(oInput);
    }

    oSettings.bFiltered = true;

    _fnCallbackFire(oSettings, null, 'search', [oSettings]);
  }

  function _fnFilterCustom(settings) {
    var filters = DataTable.ext.search;
    var displayRows = settings.aiDisplay;
    var row, rowIdx;

    for (var i = 0, ien = filters.length; i < ien; i++) {
      var rows = [];

      for (var j = 0, jen = displayRows.length; j < jen; j++) {
        rowIdx = displayRows[j];
        row = settings.aoData[rowIdx];

        if (filters[i](settings, row._aFilterData, rowIdx, row._aData, j)) {
          rows.push(rowIdx);
        }
      }

      displayRows.length = 0;
      $.merge(displayRows, rows);
    }
  }

  function _fnFilterColumn(settings, searchStr, colIdx, regex, smart, caseInsensitive) {
    if (searchStr === '') {
      return;
    }

    var data;
    var out = [];
    var display = settings.aiDisplay;

    var rpSearch = _fnFilterCreateSearch(searchStr, regex, smart, caseInsensitive);

    for (var i = 0; i < display.length; i++) {
      data = settings.aoData[display[i]]._aFilterData[colIdx];

      if (rpSearch.test(data)) {
        out.push(display[i]);
      }
    }

    settings.aiDisplay = out;
  }

  function _fnFilter(settings, input, force, regex, smart, caseInsensitive) {
    var rpSearch = _fnFilterCreateSearch(input, regex, smart, caseInsensitive);

    var prevSearch = settings.oPreviousSearch.sSearch;
    var displayMaster = settings.aiDisplayMaster;
    var display, invalidated, i;
    var filtered = [];

    if (DataTable.ext.search.length !== 0) {
      force = true;
    }

    invalidated = _fnFilterData(settings);

    if (input.length <= 0) {
      settings.aiDisplay = displayMaster.slice();
    } else {
      if (invalidated || force || prevSearch.length > input.length || input.indexOf(prevSearch) !== 0 || settings.bSorted) {
          settings.aiDisplay = displayMaster.slice();
        }

      display = settings.aiDisplay;

      for (i = 0; i < display.length; i++) {
        if (rpSearch.test(settings.aoData[display[i]]._sFilterRow)) {
          filtered.push(display[i]);
        }
      }

      settings.aiDisplay = filtered;
    }
  }

  function _fnFilterCreateSearch(search, regex, smart, caseInsensitive) {
    search = regex ? search : _fnEscapeRegex(search);

    if (smart) {
      var a = $.map(search.match(/"[^"]+"|[^ ]+/g) || [''], function (word) {
        if (word.charAt(0) === '"') {
          var m = word.match(/^"(.*)"$/);
          word = m ? m[1] : word;
        }

        return word.replace('"', '');
      });
      search = '^(?=.*?' + a.join(')(?=.*?') + ').*$';
    }

    return new RegExp(search, caseInsensitive ? 'i' : '');
  }

  var _fnEscapeRegex = DataTable.util.escapeRegex;
  var __filter_div = $('<div>')[0];

  var __filter_div_textContent = __filter_div.textContent !== undefined;

  function _fnFilterData(settings) {
    var columns = settings.aoColumns;
    var column;
    var i, j, ien, jen, filterData, cellData, row;
    var fomatters = DataTable.ext.type.search;
    var wasInvalidated = false;

    for (i = 0, ien = settings.aoData.length; i < ien; i++) {
      row = settings.aoData[i];

      if (!row._aFilterData) {
        filterData = [];

        for (j = 0, jen = columns.length; j < jen; j++) {
          column = columns[j];

          if (column.bSearchable) {
            cellData = _fnGetCellData(settings, i, j, 'filter');

            if (fomatters[column.sType]) {
              cellData = fomatters[column.sType](cellData);
            }

            if (cellData === null) {
              cellData = '';
            }

            if (typeof cellData !== 'string' && cellData.toString) {
              cellData = cellData.toString();
            }
          } else {
            cellData = '';
          }

          if (cellData.indexOf && cellData.indexOf('&') !== -1) {
            __filter_div.innerHTML = cellData;
            cellData = __filter_div_textContent ? __filter_div.textContent : __filter_div.innerText;
          }

          if (cellData.replace) {
            cellData = cellData.replace(/[\r\n]/g, '');
          }

          filterData.push(cellData);
        }

        row._aFilterData = filterData;
        row._sFilterRow = filterData.join('  ');
        wasInvalidated = true;
      }
    }

    return wasInvalidated;
  }

  function _fnSearchToCamel(obj) {
    return {
      search: obj.sSearch,
      smart: obj.bSmart,
      regex: obj.bRegex,
      caseInsensitive: obj.bCaseInsensitive
    };
  }

  function _fnSearchToHung(obj) {
    return {
      sSearch: obj.search,
      bSmart: obj.smart,
      bRegex: obj.regex,
      bCaseInsensitive: obj.caseInsensitive
    };
  }

  function _fnFeatureHtmlInfo(settings) {
    var tid = settings.sTableId,
        nodes = settings.aanFeatures.i,
        n = $('<div/>', {
      'class': settings.oClasses.sInfo,
      'id': !nodes ? tid + '_info' : null
    });

    if (!nodes) {
      settings.aoDrawCallback.push({
        "fn": _fnUpdateInfo,
        "sName": "information"
      });
      n.attr('role', 'status').attr('aria-live', 'polite');
      $(settings.nTable).attr('aria-describedby', tid + '_info');
    }

    return n[0];
  }

  function _fnUpdateInfo(settings) {
    var nodes = settings.aanFeatures.i;

    if (nodes.length === 0) {
      return;
    }

    var lang = settings.oLanguage,
        start = settings._iDisplayStart + 1,
        end = settings.fnDisplayEnd(),
        max = settings.fnRecordsTotal(),
        total = settings.fnRecordsDisplay(),
        out = total ? lang.sInfo : lang.sInfoEmpty;

    if (total !== max) {
      out += ' ' + lang.sInfoFiltered;
    }

    out += lang.sInfoPostFix;
    out = _fnInfoMacros(settings, out);
    var callback = lang.fnInfoCallback;

    if (callback !== null) {
      out = callback.call(settings.oInstance, settings, start, end, max, total, out);
    }

    $(nodes).html(out);
  }

  function _fnInfoMacros(settings, str) {
    var formatter = settings.fnFormatNumber,
        start = settings._iDisplayStart + 1,
        len = settings._iDisplayLength,
        vis = settings.fnRecordsDisplay(),
        all = len === -1;
    return str.replace(/_START_/g, formatter.call(settings, start)).replace(/_END_/g, formatter.call(settings, settings.fnDisplayEnd())).replace(/_MAX_/g, formatter.call(settings, settings.fnRecordsTotal())).replace(/_TOTAL_/g, formatter.call(settings, vis)).replace(/_PAGE_/g, formatter.call(settings, all ? 1 : Math.ceil(start / len))).replace(/_PAGES_/g, formatter.call(settings, all ? 1 : Math.ceil(vis / len)));
  }

  function _fnInitialise(settings) {
    var i,
        iLen,
        iAjaxStart = settings.iInitDisplayStart;
    var columns = settings.aoColumns,
        column;
    var features = settings.oFeatures;
    var deferLoading = settings.bDeferLoading;

    if (!settings.bInitialised) {
      setTimeout(function () {
        _fnInitialise(settings);
      }, 200);
      return;
    }

    _fnAddOptionsHtml(settings);

    _fnBuildHead(settings);

    _fnDrawHead(settings, settings.aoHeader);

    _fnDrawHead(settings, settings.aoFooter);

    _fnProcessingDisplay(settings, true);

    if (features.bAutoWidth) {
      _fnCalculateColumnWidths(settings);
    }

    for (i = 0, iLen = columns.length; i < iLen; i++) {
      column = columns[i];

      if (column.sWidth) {
        column.nTh.style.width = _fnStringToCss(column.sWidth);
      }
    }

    _fnCallbackFire(settings, null, 'preInit', [settings]);

    _fnReDraw(settings);

    var dataSrc = _fnDataSource(settings);

    if (dataSrc != 'ssp' || deferLoading) {
      if (dataSrc == 'ajax') {
        _fnBuildAjax(settings, [], function (json) {
          var aData = _fnAjaxDataSrc(settings, json);

          for (i = 0; i < aData.length; i++) {
            _fnAddData(settings, aData[i]);
          }

          settings.iInitDisplayStart = iAjaxStart;

          _fnReDraw(settings);

          _fnProcessingDisplay(settings, false);

          _fnInitComplete(settings, json);
        }, settings);
      } else {
        _fnProcessingDisplay(settings, false);

        _fnInitComplete(settings);
      }
    }
  }

  function _fnInitComplete(settings, json) {
    settings._bInitComplete = true;

    if (json || settings.oInit.aaData) {
      _fnAdjustColumnSizing(settings);
    }

    _fnCallbackFire(settings, null, 'plugin-init', [settings, json]);

    _fnCallbackFire(settings, 'aoInitComplete', 'init', [settings, json]);
  }

  function _fnLengthChange(settings, val) {
    var len = parseInt(val, 10);
    settings._iDisplayLength = len;

    _fnLengthOverflow(settings);

    _fnCallbackFire(settings, null, 'length', [settings, len]);
  }

  function _fnFeatureHtmlLength(settings) {
    var classes = settings.oClasses,
        tableId = settings.sTableId,
        menu = settings.aLengthMenu,
        d2 = $.isArray(menu[0]),
        lengths = d2 ? menu[0] : menu,
        language = d2 ? menu[1] : menu;
    var select = $('<select/>', {
      'name': tableId + '_length',
      'aria-controls': tableId,
      'class': classes.sLengthSelect
    });

    for (var i = 0, ien = lengths.length; i < ien; i++) {
      select[0][i] = new Option(typeof language[i] === 'number' ? settings.fnFormatNumber(language[i]) : language[i], lengths[i]);
    }

    var div = $('<div><label/></div>').addClass(classes.sLength);

    if (!settings.aanFeatures.l) {
      div[0].id = tableId + '_length';
    }

    div.children().append(settings.oLanguage.sLengthMenu.replace('_MENU_', select[0].outerHTML));
    $('select', div).val(settings._iDisplayLength).on('change.DT', function (e) {
      _fnLengthChange(settings, $(this).val());

      _fnDraw(settings);
    });
    $(settings.nTable).on('length.dt.DT', function (e, s, len) {
      if (settings === s) {
        $('select', div).val(len);
      }
    });
    return div[0];
  }

  function _fnFeatureHtmlPaginate(settings) {
    var type = settings.sPaginationType,
        plugin = DataTable.ext.pager[type],
        modern = typeof plugin === 'function',
        redraw = function redraw(settings) {
      _fnDraw(settings);
    },
        node = $('<div/>').addClass(settings.oClasses.sPaging + type)[0],
        features = settings.aanFeatures;

    if (!modern) {
      plugin.fnInit(settings, node, redraw);
    }

    if (!features.p) {
      node.id = settings.sTableId + '_paginate';
      settings.aoDrawCallback.push({
        "fn": function fn(settings) {
          if (modern) {
            var start = settings._iDisplayStart,
                len = settings._iDisplayLength,
                visRecords = settings.fnRecordsDisplay(),
                all = len === -1,
                page = all ? 0 : Math.ceil(start / len),
                pages = all ? 1 : Math.ceil(visRecords / len),
                buttons = plugin(page, pages),
                i,
                ien;

            for (i = 0, ien = features.p.length; i < ien; i++) {
              _fnRenderer(settings, 'pageButton')(settings, features.p[i], i, buttons, page, pages);
            }
          } else {
            plugin.fnUpdate(settings, redraw);
          }
        },
        "sName": "pagination"
      });
    }

    return node;
  }

  function _fnPageChange(settings, action, redraw) {
    var start = settings._iDisplayStart,
        len = settings._iDisplayLength,
        records = settings.fnRecordsDisplay();

    if (records === 0 || len === -1) {
      start = 0;
    } else if (typeof action === "number") {
      start = action * len;

      if (start > records) {
        start = 0;
      }
    } else if (action == "first") {
      start = 0;
    } else if (action == "previous") {
      start = len >= 0 ? start - len : 0;

      if (start < 0) {
        start = 0;
      }
    } else if (action == "next") {
      if (start + len < records) {
        start += len;
      }
    } else if (action == "last") {
      start = Math.floor((records - 1) / len) * len;
    } else {
      _fnLog(settings, 0, "Unknown paging action: " + action, 5);
    }

    var changed = settings._iDisplayStart !== start;
    settings._iDisplayStart = start;

    if (changed) {
      _fnCallbackFire(settings, null, 'page', [settings]);

      if (redraw) {
        _fnDraw(settings);
      }
    }

    return changed;
  }

  function _fnFeatureHtmlProcessing(settings) {
    return $('<div/>', {
      'id': !settings.aanFeatures.r ? settings.sTableId + '_processing' : null,
      'class': settings.oClasses.sProcessing
    }).html(settings.oLanguage.sProcessing).insertBefore(settings.nTable)[0];
  }

  function _fnProcessingDisplay(settings, show) {
    if (settings.oFeatures.bProcessing) {
      $(settings.aanFeatures.r).css('display', show ? 'block' : 'none');
    }

    _fnCallbackFire(settings, null, 'processing', [settings, show]);
  }

  function _fnFeatureHtmlTable(settings) {
    var table = $(settings.nTable);
    table.attr('role', 'grid');
    var scroll = settings.oScroll;

    if (scroll.sX === '' && scroll.sY === '') {
      return settings.nTable;
    }

    var scrollX = scroll.sX;
    var scrollY = scroll.sY;
    var classes = settings.oClasses;
    var caption = table.children('caption');
    var captionSide = caption.length ? caption[0]._captionSide : null;
    var headerClone = $(table[0].cloneNode(false));
    var footerClone = $(table[0].cloneNode(false));
    var footer = table.children('tfoot');
    var _div = '<div/>';

    var size = function size(s) {
      return !s ? null : _fnStringToCss(s);
    };

    if (!footer.length) {
      footer = null;
    }

    var scroller = $(_div, {
      'class': classes.sScrollWrapper
    }).append($(_div, {
      'class': classes.sScrollHead
    }).css({
      overflow: 'hidden',
      position: 'relative',
      border: 0,
      width: scrollX ? size(scrollX) : '100%'
    }).append($(_div, {
      'class': classes.sScrollHeadInner
    }).css({
      'box-sizing': 'content-box',
      width: scroll.sXInner || '100%'
    }).append(headerClone.removeAttr('id').css('margin-left', 0).append(captionSide === 'top' ? caption : null).append(table.children('thead'))))).append($(_div, {
      'class': classes.sScrollBody
    }).css({
      position: 'relative',
      overflow: 'auto',
      width: size(scrollX)
    }).append(table));

    if (footer) {
      scroller.append($(_div, {
        'class': classes.sScrollFoot
      }).css({
        overflow: 'hidden',
        border: 0,
        width: scrollX ? size(scrollX) : '100%'
      }).append($(_div, {
        'class': classes.sScrollFootInner
      }).append(footerClone.removeAttr('id').css('margin-left', 0).append(captionSide === 'bottom' ? caption : null).append(table.children('tfoot')))));
    }

    var children = scroller.children();
    var scrollHead = children[0];
    var scrollBody = children[1];
    var scrollFoot = footer ? children[2] : null;

    if (scrollX) {
      $(scrollBody).on('scroll.DT', function (e) {
        var scrollLeft = this.scrollLeft;
        scrollHead.scrollLeft = scrollLeft;

        if (footer) {
          scrollFoot.scrollLeft = scrollLeft;
        }
      });
    }

    $(scrollBody).css(scrollY && scroll.bCollapse ? 'max-height' : 'height', scrollY);
    settings.nScrollHead = scrollHead;
    settings.nScrollBody = scrollBody;
    settings.nScrollFoot = scrollFoot;
    settings.aoDrawCallback.push({
      "fn": _fnScrollDraw,
      "sName": "scrolling"
    });
    return scroller[0];
  }

  function _fnScrollDraw(settings) {
    var scroll = settings.oScroll,
        scrollX = scroll.sX,
        scrollXInner = scroll.sXInner,
        scrollY = scroll.sY,
        barWidth = scroll.iBarWidth,
        divHeader = $(settings.nScrollHead),
        divHeaderStyle = divHeader[0].style,
        divHeaderInner = divHeader.children('div'),
        divHeaderInnerStyle = divHeaderInner[0].style,
        divHeaderTable = divHeaderInner.children('table'),
        divBodyEl = settings.nScrollBody,
        divBody = $(divBodyEl),
        divBodyStyle = divBodyEl.style,
        divFooter = $(settings.nScrollFoot),
        divFooterInner = divFooter.children('div'),
        divFooterTable = divFooterInner.children('table'),
        header = $(settings.nTHead),
        table = $(settings.nTable),
        tableEl = table[0],
        tableStyle = tableEl.style,
        footer = settings.nTFoot ? $(settings.nTFoot) : null,
        browser = settings.oBrowser,
        ie67 = browser.bScrollOversize,
        dtHeaderCells = _pluck(settings.aoColumns, 'nTh'),
        headerTrgEls,
        footerTrgEls,
        headerSrcEls,
        footerSrcEls,
        headerCopy,
        footerCopy,
        headerWidths = [],
        footerWidths = [],
        headerContent = [],
        footerContent = [],
        idx,
        correction,
        sanityWidth,
        zeroOut = function zeroOut(nSizer) {
      var style = nSizer.style;
      style.paddingTop = "0";
      style.paddingBottom = "0";
      style.borderTopWidth = "0";
      style.borderBottomWidth = "0";
      style.height = 0;
    };

    var scrollBarVis = divBodyEl.scrollHeight > divBodyEl.clientHeight;

    if (settings.scrollBarVis !== scrollBarVis && settings.scrollBarVis !== undefined) {
      settings.scrollBarVis = scrollBarVis;

      _fnAdjustColumnSizing(settings);

      return;
    } else {
      settings.scrollBarVis = scrollBarVis;
    }

    table.children('thead, tfoot').remove();

    if (footer) {
      footerCopy = footer.clone().prependTo(table);
      footerTrgEls = footer.find('tr');
      footerSrcEls = footerCopy.find('tr');
    }

    headerCopy = header.clone().prependTo(table);
    headerTrgEls = header.find('tr');
    headerSrcEls = headerCopy.find('tr');
    headerCopy.find('th, td').removeAttr('tabindex');

    if (!scrollX) {
      divBodyStyle.width = '100%';
      divHeader[0].style.width = '100%';
    }

    $.each(_fnGetUniqueThs(settings, headerCopy), function (i, el) {
      idx = _fnVisibleToColumnIndex(settings, i);
      el.style.width = settings.aoColumns[idx].sWidth;
    });

    if (footer) {
      _fnApplyToChildren(function (n) {
        n.style.width = "";
      }, footerSrcEls);
    }

    sanityWidth = table.outerWidth();

    if (scrollX === "") {
      tableStyle.width = "100%";

      if (ie67 && (table.find('tbody').height() > divBodyEl.offsetHeight || divBody.css('overflow-y') == "scroll")) {
        tableStyle.width = _fnStringToCss(table.outerWidth() - barWidth);
      }

      sanityWidth = table.outerWidth();
    } else if (scrollXInner !== "") {
      tableStyle.width = _fnStringToCss(scrollXInner);
      sanityWidth = table.outerWidth();
    }

    _fnApplyToChildren(zeroOut, headerSrcEls);

    _fnApplyToChildren(function (nSizer) {
      headerContent.push(nSizer.innerHTML);
      headerWidths.push(_fnStringToCss($(nSizer).css('width')));
    }, headerSrcEls);

    _fnApplyToChildren(function (nToSize, i) {
      if ($.inArray(nToSize, dtHeaderCells) !== -1) {
        nToSize.style.width = headerWidths[i];
      }
    }, headerTrgEls);

    $(headerSrcEls).height(0);

    if (footer) {
      _fnApplyToChildren(zeroOut, footerSrcEls);

      _fnApplyToChildren(function (nSizer) {
        footerContent.push(nSizer.innerHTML);
        footerWidths.push(_fnStringToCss($(nSizer).css('width')));
      }, footerSrcEls);

      _fnApplyToChildren(function (nToSize, i) {
        nToSize.style.width = footerWidths[i];
      }, footerTrgEls);

      $(footerSrcEls).height(0);
    }

    _fnApplyToChildren(function (nSizer, i) {
      nSizer.innerHTML = '<div class="dataTables_sizing">' + headerContent[i] + '</div>';
      nSizer.childNodes[0].style.height = "0";
      nSizer.childNodes[0].style.overflow = "hidden";
      nSizer.style.width = headerWidths[i];
    }, headerSrcEls);

    if (footer) {
      _fnApplyToChildren(function (nSizer, i) {
        nSizer.innerHTML = '<div class="dataTables_sizing">' + footerContent[i] + '</div>';
        nSizer.childNodes[0].style.height = "0";
        nSizer.childNodes[0].style.overflow = "hidden";
        nSizer.style.width = footerWidths[i];
      }, footerSrcEls);
    }

    if (table.outerWidth() < sanityWidth) {
      correction = divBodyEl.scrollHeight > divBodyEl.offsetHeight || divBody.css('overflow-y') == "scroll" ? sanityWidth + barWidth : sanityWidth;

      if (ie67 && (divBodyEl.scrollHeight > divBodyEl.offsetHeight || divBody.css('overflow-y') == "scroll")) {
        tableStyle.width = _fnStringToCss(correction - barWidth);
      }

      if (scrollX === "" || scrollXInner !== "") {
        _fnLog(settings, 1, 'Possible column misalignment', 6);
      }
    } else {
      correction = '100%';
    }

    divBodyStyle.width = _fnStringToCss(correction);
    divHeaderStyle.width = _fnStringToCss(correction);

    if (footer) {
      settings.nScrollFoot.style.width = _fnStringToCss(correction);
    }

    if (!scrollY) {
      if (ie67) {
        divBodyStyle.height = _fnStringToCss(tableEl.offsetHeight + barWidth);
      }
    }

    var iOuterWidth = table.outerWidth();
    divHeaderTable[0].style.width = _fnStringToCss(iOuterWidth);
    divHeaderInnerStyle.width = _fnStringToCss(iOuterWidth);
    var bScrolling = table.height() > divBodyEl.clientHeight || divBody.css('overflow-y') == "scroll";
    var padding = 'padding' + (browser.bScrollbarLeft ? 'Left' : 'Right');
    divHeaderInnerStyle[padding] = bScrolling ? barWidth + "px" : "0px";

    if (footer) {
      divFooterTable[0].style.width = _fnStringToCss(iOuterWidth);
      divFooterInner[0].style.width = _fnStringToCss(iOuterWidth);
      divFooterInner[0].style[padding] = bScrolling ? barWidth + "px" : "0px";
    }

    table.children('colgroup').insertBefore(table.children('thead'));
    divBody.scroll();

    if ((settings.bSorted || settings.bFiltered) && !settings._drawHold) {
      divBodyEl.scrollTop = 0;
    }
  }

  function _fnApplyToChildren(fn, an1, an2) {
    var index = 0,
        i = 0,
        iLen = an1.length;
    var nNode1, nNode2;

    while (i < iLen) {
      nNode1 = an1[i].firstChild;
      nNode2 = an2 ? an2[i].firstChild : null;

      while (nNode1) {
        if (nNode1.nodeType === 1) {
          if (an2) {
            fn(nNode1, nNode2, index);
          } else {
            fn(nNode1, index);
          }

          index++;
        }

        nNode1 = nNode1.nextSibling;
        nNode2 = an2 ? nNode2.nextSibling : null;
      }

      i++;
    }
  }

  var __re_html_remove = /<.*?>/g;

  function _fnCalculateColumnWidths(oSettings) {
    var table = oSettings.nTable,
        columns = oSettings.aoColumns,
        scroll = oSettings.oScroll,
        scrollY = scroll.sY,
        scrollX = scroll.sX,
        scrollXInner = scroll.sXInner,
        columnCount = columns.length,
        visibleColumns = _fnGetColumns(oSettings, 'bVisible'),
        headerCells = $('th', oSettings.nTHead),
        tableWidthAttr = table.getAttribute('width'),
        tableContainer = table.parentNode,
        userInputs = false,
        i,
        column,
        columnIdx,
        width,
        outerWidth,
        browser = oSettings.oBrowser,
        ie67 = browser.bScrollOversize;

    var styleWidth = table.style.width;

    if (styleWidth && styleWidth.indexOf('%') !== -1) {
      tableWidthAttr = styleWidth;
    }

    for (i = 0; i < visibleColumns.length; i++) {
      column = columns[visibleColumns[i]];

      if (column.sWidth !== null) {
        column.sWidth = _fnConvertToWidth(column.sWidthOrig, tableContainer);
        userInputs = true;
      }
    }

    if (ie67 || !userInputs && !scrollX && !scrollY && columnCount == _fnVisbleColumns(oSettings) && columnCount == headerCells.length) {
      for (i = 0; i < columnCount; i++) {
        var colIdx = _fnVisibleToColumnIndex(oSettings, i);

        if (colIdx !== null) {
          columns[colIdx].sWidth = _fnStringToCss(headerCells.eq(i).width());
        }
      }
    } else {
      var tmpTable = $(table).clone().css('visibility', 'hidden').removeAttr('id');
      tmpTable.find('tbody tr').remove();
      var tr = $('<tr/>').appendTo(tmpTable.find('tbody'));
      tmpTable.find('thead, tfoot').remove();
      tmpTable.append($(oSettings.nTHead).clone()).append($(oSettings.nTFoot).clone());
      tmpTable.find('tfoot th, tfoot td').css('width', '');
      headerCells = _fnGetUniqueThs(oSettings, tmpTable.find('thead')[0]);

      for (i = 0; i < visibleColumns.length; i++) {
        column = columns[visibleColumns[i]];
        headerCells[i].style.width = column.sWidthOrig !== null && column.sWidthOrig !== '' ? _fnStringToCss(column.sWidthOrig) : '';

        if (column.sWidthOrig && scrollX) {
          $(headerCells[i]).append($('<div/>').css({
            width: column.sWidthOrig,
            margin: 0,
            padding: 0,
            border: 0,
            height: 1
          }));
        }
      }

      if (oSettings.aoData.length) {
        for (i = 0; i < visibleColumns.length; i++) {
          columnIdx = visibleColumns[i];
          column = columns[columnIdx];
          $(_fnGetWidestNode(oSettings, columnIdx)).clone(false).append(column.sContentPadding).appendTo(tr);
        }
      }

      $('[name]', tmpTable).removeAttr('name');
      var holder = $('<div/>').css(scrollX || scrollY ? {
        position: 'absolute',
        top: 0,
        left: 0,
        height: 1,
        right: 0,
        overflow: 'hidden'
      } : {}).append(tmpTable).appendTo(tableContainer);

      if (scrollX && scrollXInner) {
        tmpTable.width(scrollXInner);
      } else if (scrollX) {
        tmpTable.css('width', 'auto');
        tmpTable.removeAttr('width');

        if (tmpTable.width() < tableContainer.clientWidth && tableWidthAttr) {
          tmpTable.width(tableContainer.clientWidth);
        }
      } else if (scrollY) {
        tmpTable.width(tableContainer.clientWidth);
      } else if (tableWidthAttr) {
        tmpTable.width(tableWidthAttr);
      }

      var total = 0;

      for (i = 0; i < visibleColumns.length; i++) {
        var cell = $(headerCells[i]);
        var border = cell.outerWidth() - cell.width();
        var bounding = browser.bBounding ? Math.ceil(headerCells[i].getBoundingClientRect().width) : cell.outerWidth();
        total += bounding;
        columns[visibleColumns[i]].sWidth = _fnStringToCss(bounding - border);
      }

      table.style.width = _fnStringToCss(total);
      holder.remove();
    }

    if (tableWidthAttr) {
      table.style.width = _fnStringToCss(tableWidthAttr);
    }

    if ((tableWidthAttr || scrollX) && !oSettings._reszEvt) {
      var bindResize = function bindResize() {
        $(window).on('resize.DT-' + oSettings.sInstance, _fnThrottle(function () {
          _fnAdjustColumnSizing(oSettings);
        }));
      };

      if (ie67) {
        setTimeout(bindResize, 1000);
      } else {
        bindResize();
      }

      oSettings._reszEvt = true;
    }
  }

  var _fnThrottle = DataTable.util.throttle;

  function _fnConvertToWidth(width, parent) {
    if (!width) {
      return 0;
    }

    var n = $('<div/>').css('width', _fnStringToCss(width)).appendTo(parent || document.body);
    var val = n[0].offsetWidth;
    n.remove();
    return val;
  }

  function _fnGetWidestNode(settings, colIdx) {
    var idx = _fnGetMaxLenString(settings, colIdx);

    if (idx < 0) {
      return null;
    }

    var data = settings.aoData[idx];
    return !data.nTr ? $('<td/>').html(_fnGetCellData(settings, idx, colIdx, 'display'))[0] : data.anCells[colIdx];
  }

  function _fnGetMaxLenString(settings, colIdx) {
    var s,
        max = -1,
        maxIdx = -1;

    for (var i = 0, ien = settings.aoData.length; i < ien; i++) {
      s = _fnGetCellData(settings, i, colIdx, 'display') + '';
      s = s.replace(__re_html_remove, '');
      s = s.replace(/&nbsp;/g, ' ');

      if (s.length > max) {
        max = s.length;
        maxIdx = i;
      }
    }

    return maxIdx;
  }

  function _fnStringToCss(s) {
    if (s === null) {
      return '0px';
    }

    if (typeof s == 'number') {
      return s < 0 ? '0px' : s + 'px';
    }

    return s.match(/\d$/) ? s + 'px' : s;
  }

  function _fnSortFlatten(settings) {
    var i,
        iLen,
        k,
        kLen,
        aSort = [],
        aiOrig = [],
        aoColumns = settings.aoColumns,
        aDataSort,
        iCol,
        sType,
        srcCol,
        fixed = settings.aaSortingFixed,
        fixedObj = $.isPlainObject(fixed),
        nestedSort = [],
        add = function add(a) {
      if (a.length && !$.isArray(a[0])) {
        nestedSort.push(a);
      } else {
        $.merge(nestedSort, a);
      }
    };

    if ($.isArray(fixed)) {
      add(fixed);
    }

    if (fixedObj && fixed.pre) {
      add(fixed.pre);
    }

    add(settings.aaSorting);

    if (fixedObj && fixed.post) {
      add(fixed.post);
    }

    for (i = 0; i < nestedSort.length; i++) {
      srcCol = nestedSort[i][0];
      aDataSort = aoColumns[srcCol].aDataSort;

      for (k = 0, kLen = aDataSort.length; k < kLen; k++) {
        iCol = aDataSort[k];
        sType = aoColumns[iCol].sType || 'string';

        if (nestedSort[i]._idx === undefined) {
          nestedSort[i]._idx = $.inArray(nestedSort[i][1], aoColumns[iCol].asSorting);
        }

        aSort.push({
          src: srcCol,
          col: iCol,
          dir: nestedSort[i][1],
          index: nestedSort[i]._idx,
          type: sType,
          formatter: DataTable.ext.type.order[sType + "-pre"]
        });
      }
    }

    return aSort;
  }

  function _fnSort(oSettings) {
    var i,
        ien,
        iLen,
        j,
        jLen,
        k,
        kLen,
        sDataType,
        nTh,
        aiOrig = [],
        oExtSort = DataTable.ext.type.order,
        aoData = oSettings.aoData,
        aoColumns = oSettings.aoColumns,
        aDataSort,
        data,
        iCol,
        sType,
        oSort,
        formatters = 0,
        sortCol,
        displayMaster = oSettings.aiDisplayMaster,
        aSort;

    _fnColumnTypes(oSettings);

    aSort = _fnSortFlatten(oSettings);

    for (i = 0, ien = aSort.length; i < ien; i++) {
      sortCol = aSort[i];

      if (sortCol.formatter) {
        formatters++;
      }

      _fnSortData(oSettings, sortCol.col);
    }

    if (_fnDataSource(oSettings) != 'ssp' && aSort.length !== 0) {
      for (i = 0, iLen = displayMaster.length; i < iLen; i++) {
        aiOrig[displayMaster[i]] = i;
      }

      if (formatters === aSort.length) {
        displayMaster.sort(function (a, b) {
          var x,
              y,
              k,
              test,
              sort,
              len = aSort.length,
              dataA = aoData[a]._aSortData,
              dataB = aoData[b]._aSortData;

          for (k = 0; k < len; k++) {
            sort = aSort[k];
            x = dataA[sort.col];
            y = dataB[sort.col];
            test = x < y ? -1 : x > y ? 1 : 0;

            if (test !== 0) {
              return sort.dir === 'asc' ? test : -test;
            }
          }

          x = aiOrig[a];
          y = aiOrig[b];
          return x < y ? -1 : x > y ? 1 : 0;
        });
      } else {
        displayMaster.sort(function (a, b) {
          var x,
              y,
              k,
              l,
              test,
              sort,
              fn,
              len = aSort.length,
              dataA = aoData[a]._aSortData,
              dataB = aoData[b]._aSortData;

          for (k = 0; k < len; k++) {
            sort = aSort[k];
            x = dataA[sort.col];
            y = dataB[sort.col];
            fn = oExtSort[sort.type + "-" + sort.dir] || oExtSort["string-" + sort.dir];
            test = fn(x, y);

            if (test !== 0) {
              return test;
            }
          }

          x = aiOrig[a];
          y = aiOrig[b];
          return x < y ? -1 : x > y ? 1 : 0;
        });
      }
    }

    oSettings.bSorted = true;
  }

  function _fnSortAria(settings) {
    var label;
    var nextSort;
    var columns = settings.aoColumns;

    var aSort = _fnSortFlatten(settings);

    var oAria = settings.oLanguage.oAria;

    for (var i = 0, iLen = columns.length; i < iLen; i++) {
      var col = columns[i];
      var asSorting = col.asSorting;
      var sTitle = col.sTitle.replace(/<.*?>/g, "");
      var th = col.nTh;
      th.removeAttribute('aria-sort');

      if (col.bSortable) {
        if (aSort.length > 0 && aSort[0].col == i) {
          th.setAttribute('aria-sort', aSort[0].dir == "asc" ? "ascending" : "descending");
          nextSort = asSorting[aSort[0].index + 1] || asSorting[0];
        } else {
          nextSort = asSorting[0];
        }

        label = sTitle + (nextSort === "asc" ? oAria.sSortAscending : oAria.sSortDescending);
      } else {
        label = sTitle;
      }

      th.setAttribute('aria-label', label);
    }
  }

  function _fnSortListener(settings, colIdx, append, callback) {
    var col = settings.aoColumns[colIdx];
    var sorting = settings.aaSorting;
    var asSorting = col.asSorting;
    var nextSortIdx;

    var next = function next(a, overflow) {
      var idx = a._idx;

      if (idx === undefined) {
        idx = $.inArray(a[1], asSorting);
      }

      return idx + 1 < asSorting.length ? idx + 1 : overflow ? null : 0;
    };

    if (typeof sorting[0] === 'number') {
      sorting = settings.aaSorting = [sorting];
    }

    if (append && settings.oFeatures.bSortMulti) {
      var sortIdx = $.inArray(colIdx, _pluck(sorting, '0'));

      if (sortIdx !== -1) {
        nextSortIdx = next(sorting[sortIdx], true);

        if (nextSortIdx === null && sorting.length === 1) {
          nextSortIdx = 0;
        }

        if (nextSortIdx === null) {
          sorting.splice(sortIdx, 1);
        } else {
          sorting[sortIdx][1] = asSorting[nextSortIdx];
          sorting[sortIdx]._idx = nextSortIdx;
        }
      } else {
        sorting.push([colIdx, asSorting[0], 0]);
        sorting[sorting.length - 1]._idx = 0;
      }
    } else if (sorting.length && sorting[0][0] == colIdx) {
      nextSortIdx = next(sorting[0]);
      sorting.length = 1;
      sorting[0][1] = asSorting[nextSortIdx];
      sorting[0]._idx = nextSortIdx;
    } else {
      sorting.length = 0;
      sorting.push([colIdx, asSorting[0]]);
      sorting[0]._idx = 0;
    }

    _fnReDraw(settings);

    if (typeof callback == 'function') {
      callback(settings);
    }
  }

  function _fnSortAttachListener(settings, attachTo, colIdx, callback) {
    var col = settings.aoColumns[colIdx];

    _fnBindAction(attachTo, {}, function (e) {
      if (col.bSortable === false) {
        return;
      }

      if (settings.oFeatures.bProcessing) {
        _fnProcessingDisplay(settings, true);

        setTimeout(function () {
          _fnSortListener(settings, colIdx, e.shiftKey, callback);

          if (_fnDataSource(settings) !== 'ssp') {
            _fnProcessingDisplay(settings, false);
          }
        }, 0);
      } else {
        _fnSortListener(settings, colIdx, e.shiftKey, callback);
      }
    });
  }

  function _fnSortingClasses(settings) {
    var oldSort = settings.aLastSort;
    var sortClass = settings.oClasses.sSortColumn;

    var sort = _fnSortFlatten(settings);

    var features = settings.oFeatures;
    var i, ien, colIdx;

    if (features.bSort && features.bSortClasses) {
      for (i = 0, ien = oldSort.length; i < ien; i++) {
        colIdx = oldSort[i].src;
        $(_pluck(settings.aoData, 'anCells', colIdx)).removeClass(sortClass + (i < 2 ? i + 1 : 3));
      }

      for (i = 0, ien = sort.length; i < ien; i++) {
        colIdx = sort[i].src;
        $(_pluck(settings.aoData, 'anCells', colIdx)).addClass(sortClass + (i < 2 ? i + 1 : 3));
      }
    }

    settings.aLastSort = sort;
  }

  function _fnSortData(settings, idx) {
    var column = settings.aoColumns[idx];
    var customSort = DataTable.ext.order[column.sSortDataType];
    var customData;

    if (customSort) {
      customData = customSort.call(settings.oInstance, settings, idx, _fnColumnIndexToVisible(settings, idx));
    }

    var row, cellData;
    var formatter = DataTable.ext.type.order[column.sType + "-pre"];

    for (var i = 0, ien = settings.aoData.length; i < ien; i++) {
      row = settings.aoData[i];

      if (!row._aSortData) {
        row._aSortData = [];
      }

      if (!row._aSortData[idx] || customSort) {
        cellData = customSort ? customData[i] : _fnGetCellData(settings, i, idx, 'sort');
        row._aSortData[idx] = formatter ? formatter(cellData) : cellData;
      }
    }
  }

  function _fnSaveState(settings) {
    if (!settings.oFeatures.bStateSave || settings.bDestroying) {
      return;
    }

    var state = {
      time: +new Date(),
      start: settings._iDisplayStart,
      length: settings._iDisplayLength,
      order: $.extend(true, [], settings.aaSorting),
      search: _fnSearchToCamel(settings.oPreviousSearch),
      columns: $.map(settings.aoColumns, function (col, i) {
        return {
          visible: col.bVisible,
          search: _fnSearchToCamel(settings.aoPreSearchCols[i])
        };
      })
    };

    _fnCallbackFire(settings, "aoStateSaveParams", 'stateSaveParams', [settings, state]);

    settings.oSavedState = state;
    settings.fnStateSaveCallback.call(settings.oInstance, settings, state);
  }

  function _fnLoadState(settings, oInit, callback) {
    var i, ien;
    var columns = settings.aoColumns;

    var loaded = function loaded(s) {
      if (!s || !s.time) {
        callback();
        return;
      }

      var abStateLoad = _fnCallbackFire(settings, 'aoStateLoadParams', 'stateLoadParams', [settings, s]);

      if ($.inArray(false, abStateLoad) !== -1) {
        callback();
        return;
      }

      var duration = settings.iStateDuration;

      if (duration > 0 && s.time < +new Date() - duration * 1000) {
        callback();
        return;
      }

      if (s.columns && columns.length !== s.columns.length) {
        callback();
        return;
      }

      settings.oLoadedState = $.extend(true, {}, s);

      if (s.start !== undefined) {
        settings._iDisplayStart = s.start;
        settings.iInitDisplayStart = s.start;
      }

      if (s.length !== undefined) {
        settings._iDisplayLength = s.length;
      }

      if (s.order !== undefined) {
        settings.aaSorting = [];
        $.each(s.order, function (i, col) {
          settings.aaSorting.push(col[0] >= columns.length ? [0, col[1]] : col);
        });
      }

      if (s.search !== undefined) {
        $.extend(settings.oPreviousSearch, _fnSearchToHung(s.search));
      }

      if (s.columns) {
        for (i = 0, ien = s.columns.length; i < ien; i++) {
          var col = s.columns[i];

          if (col.visible !== undefined) {
            columns[i].bVisible = col.visible;
          }

          if (col.search !== undefined) {
            $.extend(settings.aoPreSearchCols[i], _fnSearchToHung(col.search));
          }
        }
      }

      _fnCallbackFire(settings, 'aoStateLoaded', 'stateLoaded', [settings, s]);

      callback();
    };

    if (!settings.oFeatures.bStateSave) {
      callback();
      return;
    }

    var state = settings.fnStateLoadCallback.call(settings.oInstance, settings, loaded);

    if (state !== undefined) {
      loaded(state);
    }
  }

  function _fnSettingsFromNode(table) {
    var settings = DataTable.settings;
    var idx = $.inArray(table, _pluck(settings, 'nTable'));
    return idx !== -1 ? settings[idx] : null;
  }

  function _fnLog(settings, level, msg, tn) {
    msg = 'DataTables warning: ' + (settings ? 'table id=' + settings.sTableId + ' - ' : '') + msg;

    if (tn) {
      msg += '. For more information about this error, please see ' + 'http://datatables.net/tn/' + tn;
    }

    if (!level) {
      var ext = DataTable.ext;
      var type = ext.sErrMode || ext.errMode;

      if (settings) {
        _fnCallbackFire(settings, null, 'error', [settings, tn, msg]);
      }

      if (type == 'alert') {
        alert(msg);
      } else if (type == 'throw') {
        throw new Error(msg);
      } else if (typeof type == 'function') {
        type(settings, tn, msg);
      }
    } else if (window.console && console.log) {
      console.log(msg);
    }
  }

  function _fnMap(ret, src, name, mappedName) {
    if ($.isArray(name)) {
      $.each(name, function (i, val) {
        if ($.isArray(val)) {
          _fnMap(ret, src, val[0], val[1]);
        } else {
          _fnMap(ret, src, val);
        }
      });
      return;
    }

    if (mappedName === undefined) {
      mappedName = name;
    }

    if (src[name] !== undefined) {
      ret[mappedName] = src[name];
    }
  }

  function _fnExtend(out, extender, breakRefs) {
    var val;

    for (var prop in extender) {
      if (extender.hasOwnProperty(prop)) {
        val = extender[prop];

        if ($.isPlainObject(val)) {
          if (!$.isPlainObject(out[prop])) {
            out[prop] = {};
          }

          $.extend(true, out[prop], val);
        } else if (breakRefs && prop !== 'data' && prop !== 'aaData' && $.isArray(val)) {
          out[prop] = val.slice();
        } else {
          out[prop] = val;
        }
      }
    }

    return out;
  }

  function _fnBindAction(n, oData, fn) {
    $(n).on('click.DT', oData, function (e) {
      $(n).blur();
      fn(e);
    }).on('keypress.DT', oData, function (e) {
      if (e.which === 13) {
        e.preventDefault();
        fn(e);
      }
    }).on('selectstart.DT', function () {
      return false;
    });
  }

  function _fnCallbackReg(oSettings, sStore, fn, sName) {
    if (fn) {
      oSettings[sStore].push({
        "fn": fn,
        "sName": sName
      });
    }
  }

  function _fnCallbackFire(settings, callbackArr, eventName, args) {
    var ret = [];

    if (callbackArr) {
      ret = $.map(settings[callbackArr].slice().reverse(), function (val, i) {
        return val.fn.apply(settings.oInstance, args);
      });
    }

    if (eventName !== null) {
      var e = $.Event(eventName + '.dt');
      $(settings.nTable).trigger(e, args);
      ret.push(e.result);
    }

    return ret;
  }

  function _fnLengthOverflow(settings) {
    var start = settings._iDisplayStart,
        end = settings.fnDisplayEnd(),
        len = settings._iDisplayLength;

    if (start >= end) {
      start = end - len;
    }

    start -= start % len;

    if (len === -1 || start < 0) {
      start = 0;
    }

    settings._iDisplayStart = start;
  }

  function _fnRenderer(settings, type) {
    var renderer = settings.renderer;
    var host = DataTable.ext.renderer[type];

    if ($.isPlainObject(renderer) && renderer[type]) {
      return host[renderer[type]] || host._;
    } else if (typeof renderer === 'string') {
      return host[renderer] || host._;
    }

    return host._;
  }

  function _fnDataSource(settings) {
    if (settings.oFeatures.bServerSide) {
      return 'ssp';
    } else if (settings.ajax || settings.sAjaxSource) {
      return 'ajax';
    }

    return 'dom';
  }

  var __apiStruct = [];
  var __arrayProto = Array.prototype;

  var _toSettings = function _toSettings(mixed) {
    var idx, jq;
    var settings = DataTable.settings;
    var tables = $.map(settings, function (el, i) {
      return el.nTable;
    });

    if (!mixed) {
      return [];
    } else if (mixed.nTable && mixed.oApi) {
      return [mixed];
    } else if (mixed.nodeName && mixed.nodeName.toLowerCase() === 'table') {
      idx = $.inArray(mixed, tables);
      return idx !== -1 ? [settings[idx]] : null;
    } else if (mixed && typeof mixed.settings === 'function') {
      return mixed.settings().toArray();
    } else if (typeof mixed === 'string') {
      jq = $(mixed);
    } else if (mixed instanceof $) {
      jq = mixed;
    }

    if (jq) {
      return jq.map(function (i) {
        idx = $.inArray(this, tables);
        return idx !== -1 ? settings[idx] : null;
      }).toArray();
    }
  };

  _Api2 = function _Api(context, data) {
    if (!(this instanceof _Api2)) {
      return new _Api2(context, data);
    }

    var settings = [];

    var ctxSettings = function ctxSettings(o) {
      var a = _toSettings(o);

      if (a) {
        settings = settings.concat(a);
      }
    };

    if ($.isArray(context)) {
      for (var i = 0, ien = context.length; i < ien; i++) {
        ctxSettings(context[i]);
      }
    } else {
      ctxSettings(context);
    }

    this.context = _unique(settings);

    if (data) {
      $.merge(this, data);
    }

    this.selector = {
      rows: null,
      cols: null,
      opts: null
    };

    _Api2.extend(this, this, __apiStruct);
  };

  DataTable.Api = _Api2;
  $.extend(_Api2.prototype, {
    any: function any() {
      return this.count() !== 0;
    },
    concat: __arrayProto.concat,
    context: [],
    count: function count() {
      return this.flatten().length;
    },
    each: function each(fn) {
      for (var i = 0, ien = this.length; i < ien; i++) {
        fn.call(this, this[i], i, this);
      }

      return this;
    },
    eq: function eq(idx) {
      var ctx = this.context;
      return ctx.length > idx ? new _Api2(ctx[idx], this[idx]) : null;
    },
    filter: function filter(fn) {
      var a = [];

      if (__arrayProto.filter) {
        a = __arrayProto.filter.call(this, fn, this);
      } else {
        for (var i = 0, ien = this.length; i < ien; i++) {
          if (fn.call(this, this[i], i, this)) {
            a.push(this[i]);
          }
        }
      }

      return new _Api2(this.context, a);
    },
    flatten: function flatten() {
      var a = [];
      return new _Api2(this.context, a.concat.apply(a, this.toArray()));
    },
    join: __arrayProto.join,
    indexOf: __arrayProto.indexOf || function (obj, start) {
      for (var i = start || 0, ien = this.length; i < ien; i++) {
        if (this[i] === obj) {
          return i;
        }
      }

      return -1;
    },
    iterator: function iterator(flatten, type, fn, alwaysNew) {
      var a = [],
          ret,
          i,
          ien,
          j,
          jen,
          context = this.context,
          rows,
          items,
          item,
          selector = this.selector;

      if (typeof flatten === 'string') {
        alwaysNew = fn;
        fn = type;
        type = flatten;
        flatten = false;
      }

      for (i = 0, ien = context.length; i < ien; i++) {
        var apiInst = new _Api2(context[i]);

        if (type === 'table') {
          ret = fn.call(apiInst, context[i], i);

          if (ret !== undefined) {
            a.push(ret);
          }
        } else if (type === 'columns' || type === 'rows') {
          ret = fn.call(apiInst, context[i], this[i], i);

          if (ret !== undefined) {
            a.push(ret);
          }
        } else if (type === 'column' || type === 'column-rows' || type === 'row' || type === 'cell') {
          items = this[i];

          if (type === 'column-rows') {
            rows = _selector_row_indexes(context[i], selector.opts);
          }

          for (j = 0, jen = items.length; j < jen; j++) {
            item = items[j];

            if (type === 'cell') {
              ret = fn.call(apiInst, context[i], item.row, item.column, i, j);
            } else {
              ret = fn.call(apiInst, context[i], item, i, j, rows);
            }

            if (ret !== undefined) {
              a.push(ret);
            }
          }
        }
      }

      if (a.length || alwaysNew) {
        var api = new _Api2(context, flatten ? a.concat.apply([], a) : a);
        var apiSelector = api.selector;
        apiSelector.rows = selector.rows;
        apiSelector.cols = selector.cols;
        apiSelector.opts = selector.opts;
        return api;
      }

      return this;
    },
    lastIndexOf: __arrayProto.lastIndexOf || function (obj, start) {
      return this.indexOf.apply(this.toArray.reverse(), arguments);
    },
    length: 0,
    map: function map(fn) {
      var a = [];

      if (__arrayProto.map) {
        a = __arrayProto.map.call(this, fn, this);
      } else {
        for (var i = 0, ien = this.length; i < ien; i++) {
          a.push(fn.call(this, this[i], i));
        }
      }

      return new _Api2(this.context, a);
    },
    pluck: function pluck(prop) {
      return this.map(function (el) {
        return el[prop];
      });
    },
    pop: __arrayProto.pop,
    push: __arrayProto.push,
    reduce: __arrayProto.reduce || function (fn, init) {
      return _fnReduce(this, fn, init, 0, this.length, 1);
    },
    reduceRight: __arrayProto.reduceRight || function (fn, init) {
      return _fnReduce(this, fn, init, this.length - 1, -1, -1);
    },
    reverse: __arrayProto.reverse,
    selector: null,
    shift: __arrayProto.shift,
    slice: function slice() {
      return new _Api2(this.context, this);
    },
    sort: __arrayProto.sort,
    splice: __arrayProto.splice,
    toArray: function toArray() {
      return __arrayProto.slice.call(this);
    },
    to$: function to$() {
      return $(this);
    },
    toJQuery: function toJQuery() {
      return $(this);
    },
    unique: function unique() {
      return new _Api2(this.context, _unique(this));
    },
    unshift: __arrayProto.unshift
  });

  _Api2.extend = function (scope, obj, ext) {
    if (!ext.length || !obj || !(obj instanceof _Api2) && !obj.__dt_wrapper) {
      return;
    }

    var i,
        ien,
        j,
        jen,
        struct,
        inner,
        methodScoping = function methodScoping(scope, fn, struc) {
      return function () {
        var ret = fn.apply(scope, arguments);

        _Api2.extend(ret, ret, struc.methodExt);

        return ret;
      };
    };

    for (i = 0, ien = ext.length; i < ien; i++) {
      struct = ext[i];
      obj[struct.name] = typeof struct.val === 'function' ? methodScoping(scope, struct.val, struct) : $.isPlainObject(struct.val) ? {} : struct.val;
      obj[struct.name].__dt_wrapper = true;

      _Api2.extend(scope, obj[struct.name], struct.propExt);
    }
  };

  _Api2.register = _api_register = function _api_register(name, val) {
    if ($.isArray(name)) {
      for (var j = 0, jen = name.length; j < jen; j++) {
        _Api2.register(name[j], val);
      }

      return;
    }

    var i,
        ien,
        heir = name.split('.'),
        struct = __apiStruct,
        key,
        method;

    var find = function find(src, name) {
      for (var i = 0, ien = src.length; i < ien; i++) {
        if (src[i].name === name) {
          return src[i];
        }
      }

      return null;
    };

    for (i = 0, ien = heir.length; i < ien; i++) {
      method = heir[i].indexOf('()') !== -1;
      key = method ? heir[i].replace('()', '') : heir[i];
      var src = find(struct, key);

      if (!src) {
        src = {
          name: key,
          val: {},
          methodExt: [],
          propExt: []
        };
        struct.push(src);
      }

      if (i === ien - 1) {
        src.val = val;
      } else {
        struct = method ? src.methodExt : src.propExt;
      }
    }
  };

  _Api2.registerPlural = _api_registerPlural = function _api_registerPlural(pluralName, singularName, val) {
    _Api2.register(pluralName, val);

    _Api2.register(singularName, function () {
      var ret = val.apply(this, arguments);

      if (ret === this) {
        return this;
      } else if (ret instanceof _Api2) {
        return ret.length ? $.isArray(ret[0]) ? new _Api2(ret.context, ret[0]) : ret[0] : undefined;
      }

      return ret;
    });
  };

  var __table_selector = function __table_selector(selector, a) {
    if (typeof selector === 'number') {
      return [a[selector]];
    }

    var nodes = $.map(a, function (el, i) {
      return el.nTable;
    });
    return $(nodes).filter(selector).map(function (i) {
      var idx = $.inArray(this, nodes);
      return a[idx];
    }).toArray();
  };

  _api_register('tables()', function (selector) {
    return selector ? new _Api2(__table_selector(selector, this.context)) : this;
  });

  _api_register('table()', function (selector) {
    var tables = this.tables(selector);
    var ctx = tables.context;
    return ctx.length ? new _Api2(ctx[0]) : tables;
  });

  _api_registerPlural('tables().nodes()', 'table().node()', function () {
    return this.iterator('table', function (ctx) {
      return ctx.nTable;
    }, 1);
  });

  _api_registerPlural('tables().body()', 'table().body()', function () {
    return this.iterator('table', function (ctx) {
      return ctx.nTBody;
    }, 1);
  });

  _api_registerPlural('tables().header()', 'table().header()', function () {
    return this.iterator('table', function (ctx) {
      return ctx.nTHead;
    }, 1);
  });

  _api_registerPlural('tables().footer()', 'table().footer()', function () {
    return this.iterator('table', function (ctx) {
      return ctx.nTFoot;
    }, 1);
  });

  _api_registerPlural('tables().containers()', 'table().container()', function () {
    return this.iterator('table', function (ctx) {
      return ctx.nTableWrapper;
    }, 1);
  });

  _api_register('draw()', function (paging) {
    return this.iterator('table', function (settings) {
      if (paging === 'page') {
        _fnDraw(settings);
      } else {
        if (typeof paging === 'string') {
          paging = paging === 'full-hold' ? false : true;
        }

        _fnReDraw(settings, paging === false);
      }
    });
  });

  _api_register('page()', function (action) {
    if (action === undefined) {
      return this.page.info().page;
    }

    return this.iterator('table', function (settings) {
      _fnPageChange(settings, action);
    });
  });

  _api_register('page.info()', function (action) {
    if (this.context.length === 0) {
      return undefined;
    }

    var settings = this.context[0],
        start = settings._iDisplayStart,
        len = settings.oFeatures.bPaginate ? settings._iDisplayLength : -1,
        visRecords = settings.fnRecordsDisplay(),
        all = len === -1;
    return {
      "page": all ? 0 : Math.floor(start / len),
      "pages": all ? 1 : Math.ceil(visRecords / len),
      "start": start,
      "end": settings.fnDisplayEnd(),
      "length": len,
      "recordsTotal": settings.fnRecordsTotal(),
      "recordsDisplay": visRecords,
      "serverSide": _fnDataSource(settings) === 'ssp'
    };
  });

  _api_register('page.len()', function (len) {
    if (len === undefined) {
      return this.context.length !== 0 ? this.context[0]._iDisplayLength : undefined;
    }

    return this.iterator('table', function (settings) {
      _fnLengthChange(settings, len);
    });
  });

  var __reload = function __reload(settings, holdPosition, callback) {
    if (callback) {
      var api = new _Api2(settings);
      api.one('draw', function () {
        callback(api.ajax.json());
      });
    }

    if (_fnDataSource(settings) == 'ssp') {
      _fnReDraw(settings, holdPosition);
    } else {
      _fnProcessingDisplay(settings, true);

      var xhr = settings.jqXHR;

      if (xhr && xhr.readyState !== 4) {
        xhr.abort();
      }

      _fnBuildAjax(settings, [], function (json) {
        _fnClearTable(settings);

        var data = _fnAjaxDataSrc(settings, json);

        for (var i = 0, ien = data.length; i < ien; i++) {
          _fnAddData(settings, data[i]);
        }

        _fnReDraw(settings, holdPosition);

        _fnProcessingDisplay(settings, false);
      });
    }
  };

  _api_register('ajax.json()', function () {
    var ctx = this.context;

    if (ctx.length > 0) {
      return ctx[0].json;
    }
  });

  _api_register('ajax.params()', function () {
    var ctx = this.context;

    if (ctx.length > 0) {
      return ctx[0].oAjaxData;
    }
  });

  _api_register('ajax.reload()', function (callback, resetPaging) {
    return this.iterator('table', function (settings) {
      __reload(settings, resetPaging === false, callback);
    });
  });

  _api_register('ajax.url()', function (url) {
    var ctx = this.context;

    if (url === undefined) {
      if (ctx.length === 0) {
        return undefined;
      }

      ctx = ctx[0];
      return ctx.ajax ? $.isPlainObject(ctx.ajax) ? ctx.ajax.url : ctx.ajax : ctx.sAjaxSource;
    }

    return this.iterator('table', function (settings) {
      if ($.isPlainObject(settings.ajax)) {
        settings.ajax.url = url;
      } else {
        settings.ajax = url;
      }
    });
  });

  _api_register('ajax.url().load()', function (callback, resetPaging) {
    return this.iterator('table', function (ctx) {
      __reload(ctx, resetPaging === false, callback);
    });
  });

  var _selector_run = function _selector_run(type, selector, selectFn, settings, opts) {
    var out = [],
        res,
        a,
        i,
        ien,
        j,
        jen,
        selectorType = _typeof(selector);

    if (!selector || selectorType === 'string' || selectorType === 'function' || selector.length === undefined) {
      selector = [selector];
    }

    for (i = 0, ien = selector.length; i < ien; i++) {
      a = selector[i] && selector[i].split && !selector[i].match(/[\[\(:]/) ? selector[i].split(',') : [selector[i]];

      for (j = 0, jen = a.length; j < jen; j++) {
        res = selectFn(typeof a[j] === 'string' ? $.trim(a[j]) : a[j]);

        if (res && res.length) {
          out = out.concat(res);
        }
      }
    }

    var ext = _ext.selector[type];

    if (ext.length) {
      for (i = 0, ien = ext.length; i < ien; i++) {
        out = ext[i](settings, opts, out);
      }
    }

    return _unique(out);
  };

  var _selector_opts = function _selector_opts(opts) {
    if (!opts) {
      opts = {};
    }

    if (opts.filter && opts.search === undefined) {
      opts.search = opts.filter;
    }

    return $.extend({
      search: 'none',
      order: 'current',
      page: 'all'
    }, opts);
  };

  var _selector_first = function _selector_first(inst) {
    for (var i = 0, ien = inst.length; i < ien; i++) {
      if (inst[i].length > 0) {
        inst[0] = inst[i];
        inst[0].length = 1;
        inst.length = 1;
        inst.context = [inst.context[i]];
        return inst;
      }
    }

    inst.length = 0;
    return inst;
  };

  var _selector_row_indexes = function _selector_row_indexes(settings, opts) {
    var i,
        ien,
        tmp,
        a = [],
        displayFiltered = settings.aiDisplay,
        displayMaster = settings.aiDisplayMaster;
    var search = opts.search,
        order = opts.order,
        page = opts.page;

    if (_fnDataSource(settings) == 'ssp') {
      return search === 'removed' ? [] : _range(0, displayMaster.length);
    } else if (page == 'current') {
      for (i = settings._iDisplayStart, ien = settings.fnDisplayEnd(); i < ien; i++) {
        a.push(displayFiltered[i]);
      }
    } else if (order == 'current' || order == 'applied') {
      if (search == 'none') {
        a = displayMaster.slice();
      } else if (search == 'applied') {
        a = displayFiltered.slice();
      } else if (search == 'removed') {
        var displayFilteredMap = {};

        for (var i = 0, ien = displayFiltered.length; i < ien; i++) {
          displayFilteredMap[displayFiltered[i]] = null;
        }

        a = $.map(displayMaster, function (el) {
          return !displayFilteredMap.hasOwnProperty(el) ? el : null;
        });
      }
    } else if (order == 'index' || order == 'original') {
      for (i = 0, ien = settings.aoData.length; i < ien; i++) {
        if (search == 'none') {
          a.push(i);
        } else {
          tmp = $.inArray(i, displayFiltered);

          if (tmp === -1 && search == 'removed' || tmp >= 0 && search == 'applied') {
            a.push(i);
          }
        }
      }
    }

    return a;
  };

  var __row_selector = function __row_selector(settings, selector, opts) {
    var rows;

    var run = function run(sel) {
      var selInt = _intVal(sel);

      var i, ien;
      var aoData = settings.aoData;

      if (selInt !== null && !opts) {
        return [selInt];
      }

      if (!rows) {
        rows = _selector_row_indexes(settings, opts);
      }

      if (selInt !== null && $.inArray(selInt, rows) !== -1) {
        return [selInt];
      } else if (sel === null || sel === undefined || sel === '') {
        return rows;
      }

      if (typeof sel === 'function') {
        return $.map(rows, function (idx) {
          var row = aoData[idx];
          return sel(idx, row._aData, row.nTr) ? idx : null;
        });
      }

      if (sel.nodeName) {
        var rowIdx = sel._DT_RowIndex;
        var cellIdx = sel._DT_CellIndex;

        if (rowIdx !== undefined) {
          return aoData[rowIdx] && aoData[rowIdx].nTr === sel ? [rowIdx] : [];
        } else if (cellIdx) {
          return aoData[cellIdx.row] && aoData[cellIdx.row].nTr === sel ? [cellIdx.row] : [];
        } else {
          var host = $(sel).closest('*[data-dt-row]');
          return host.length ? [host.data('dt-row')] : [];
        }
      }

      if (typeof sel === 'string' && sel.charAt(0) === '#') {
        var rowObj = settings.aIds[sel.replace(/^#/, '')];

        if (rowObj !== undefined) {
          return [rowObj.idx];
        }
      }

      var nodes = _removeEmpty(_pluck_order(settings.aoData, rows, 'nTr'));

      return $(nodes).filter(sel).map(function () {
        return this._DT_RowIndex;
      }).toArray();
    };

    return _selector_run('row', selector, run, settings, opts);
  };

  _api_register('rows()', function (selector, opts) {
    if (selector === undefined) {
      selector = '';
    } else if ($.isPlainObject(selector)) {
      opts = selector;
      selector = '';
    }

    opts = _selector_opts(opts);
    var inst = this.iterator('table', function (settings) {
      return __row_selector(settings, selector, opts);
    }, 1);
    inst.selector.rows = selector;
    inst.selector.opts = opts;
    return inst;
  });

  _api_register('rows().nodes()', function () {
    return this.iterator('row', function (settings, row) {
      return settings.aoData[row].nTr || undefined;
    }, 1);
  });

  _api_register('rows().data()', function () {
    return this.iterator(true, 'rows', function (settings, rows) {
      return _pluck_order(settings.aoData, rows, '_aData');
    }, 1);
  });

  _api_registerPlural('rows().cache()', 'row().cache()', function (type) {
    return this.iterator('row', function (settings, row) {
      var r = settings.aoData[row];
      return type === 'search' ? r._aFilterData : r._aSortData;
    }, 1);
  });

  _api_registerPlural('rows().invalidate()', 'row().invalidate()', function (src) {
    return this.iterator('row', function (settings, row) {
      _fnInvalidate(settings, row, src);
    });
  });

  _api_registerPlural('rows().indexes()', 'row().index()', function () {
    return this.iterator('row', function (settings, row) {
      return row;
    }, 1);
  });

  _api_registerPlural('rows().ids()', 'row().id()', function (hash) {
    var a = [];
    var context = this.context;

    for (var i = 0, ien = context.length; i < ien; i++) {
      for (var j = 0, jen = this[i].length; j < jen; j++) {
        var id = context[i].rowIdFn(context[i].aoData[this[i][j]]._aData);
        a.push((hash === true ? '#' : '') + id);
      }
    }

    return new _Api2(context, a);
  });

  _api_registerPlural('rows().remove()', 'row().remove()', function () {
    var that = this;
    this.iterator('row', function (settings, row, thatIdx) {
      var data = settings.aoData;
      var rowData = data[row];
      var i, ien, j, jen;
      var loopRow, loopCells;
      data.splice(row, 1);

      for (i = 0, ien = data.length; i < ien; i++) {
        loopRow = data[i];
        loopCells = loopRow.anCells;

        if (loopRow.nTr !== null) {
          loopRow.nTr._DT_RowIndex = i;
        }

        if (loopCells !== null) {
          for (j = 0, jen = loopCells.length; j < jen; j++) {
            loopCells[j]._DT_CellIndex.row = i;
          }
        }
      }

      _fnDeleteIndex(settings.aiDisplayMaster, row);

      _fnDeleteIndex(settings.aiDisplay, row);

      _fnDeleteIndex(that[thatIdx], row, false);

      if (settings._iRecordsDisplay > 0) {
        settings._iRecordsDisplay--;
      }

      _fnLengthOverflow(settings);

      var id = settings.rowIdFn(rowData._aData);

      if (id !== undefined) {
        delete settings.aIds[id];
      }
    });
    this.iterator('table', function (settings) {
      for (var i = 0, ien = settings.aoData.length; i < ien; i++) {
        settings.aoData[i].idx = i;
      }
    });
    return this;
  });

  _api_register('rows.add()', function (rows) {
    var newRows = this.iterator('table', function (settings) {
      var row, i, ien;
      var out = [];

      for (i = 0, ien = rows.length; i < ien; i++) {
        row = rows[i];

        if (row.nodeName && row.nodeName.toUpperCase() === 'TR') {
          out.push(_fnAddTr(settings, row)[0]);
        } else {
          out.push(_fnAddData(settings, row));
        }
      }

      return out;
    }, 1);
    var modRows = this.rows(-1);
    modRows.pop();
    $.merge(modRows, newRows);
    return modRows;
  });

  _api_register('row()', function (selector, opts) {
    return _selector_first(this.rows(selector, opts));
  });

  _api_register('row().data()', function (data) {
    var ctx = this.context;

    if (data === undefined) {
      return ctx.length && this.length ? ctx[0].aoData[this[0]]._aData : undefined;
    }

    var row = ctx[0].aoData[this[0]];
    row._aData = data;

    if ($.isArray(data) && row.nTr.id) {
      _fnSetObjectDataFn(ctx[0].rowId)(data, row.nTr.id);
    }

    _fnInvalidate(ctx[0], this[0], 'data');

    return this;
  });

  _api_register('row().node()', function () {
    var ctx = this.context;
    return ctx.length && this.length ? ctx[0].aoData[this[0]].nTr || null : null;
  });

  _api_register('row.add()', function (row) {
    if (row instanceof $ && row.length) {
      row = row[0];
    }

    var rows = this.iterator('table', function (settings) {
      if (row.nodeName && row.nodeName.toUpperCase() === 'TR') {
        return _fnAddTr(settings, row)[0];
      }

      return _fnAddData(settings, row);
    });
    return this.row(rows[0]);
  });

  var __details_add = function __details_add(ctx, row, data, klass) {
    var rows = [];

    var addRow = function addRow(r, k) {
      if ($.isArray(r) || r instanceof $) {
        for (var i = 0, ien = r.length; i < ien; i++) {
          addRow(r[i], k);
        }

        return;
      }

      if (r.nodeName && r.nodeName.toLowerCase() === 'tr') {
        rows.push(r);
      } else {
        var created = $('<tr><td/></tr>').addClass(k);
        $('td', created).addClass(k).html(r)[0].colSpan = _fnVisbleColumns(ctx);
        rows.push(created[0]);
      }
    };

    addRow(data, klass);

    if (row._details) {
      row._details.detach();
    }

    row._details = $(rows);

    if (row._detailsShow) {
      row._details.insertAfter(row.nTr);
    }
  };

  var __details_remove = function __details_remove(api, idx) {
    var ctx = api.context;

    if (ctx.length) {
      var row = ctx[0].aoData[idx !== undefined ? idx : api[0]];

      if (row && row._details) {
        row._details.remove();

        row._detailsShow = undefined;
        row._details = undefined;
      }
    }
  };

  var __details_display = function __details_display(api, show) {
    var ctx = api.context;

    if (ctx.length && api.length) {
      var row = ctx[0].aoData[api[0]];

      if (row._details) {
        row._detailsShow = show;

        if (show) {
          row._details.insertAfter(row.nTr);
        } else {
          row._details.detach();
        }

        __details_events(ctx[0]);
      }
    }
  };

  var __details_events = function __details_events(settings) {
    var api = new _Api2(settings);
    var namespace = '.dt.DT_details';
    var drawEvent = 'draw' + namespace;
    var colvisEvent = 'column-visibility' + namespace;
    var destroyEvent = 'destroy' + namespace;
    var data = settings.aoData;
    api.off(drawEvent + ' ' + colvisEvent + ' ' + destroyEvent);

    if (_pluck(data, '_details').length > 0) {
      api.on(drawEvent, function (e, ctx) {
        if (settings !== ctx) {
          return;
        }

        api.rows({
          page: 'current'
        }).eq(0).each(function (idx) {
          var row = data[idx];

          if (row._detailsShow) {
            row._details.insertAfter(row.nTr);
          }
        });
      });
      api.on(colvisEvent, function (e, ctx, idx, vis) {
        if (settings !== ctx) {
          return;
        }

        var row,
            visible = _fnVisbleColumns(ctx);

        for (var i = 0, ien = data.length; i < ien; i++) {
          row = data[i];

          if (row._details) {
            row._details.children('td[colspan]').attr('colspan', visible);
          }
        }
      });
      api.on(destroyEvent, function (e, ctx) {
        if (settings !== ctx) {
          return;
        }

        for (var i = 0, ien = data.length; i < ien; i++) {
          if (data[i]._details) {
            __details_remove(api, i);
          }
        }
      });
    }
  };

  var _emp = '';

  var _child_obj = _emp + 'row().child';

  var _child_mth = _child_obj + '()';

  _api_register(_child_mth, function (data, klass) {
    var ctx = this.context;

    if (data === undefined) {
      return ctx.length && this.length ? ctx[0].aoData[this[0]]._details : undefined;
    } else if (data === true) {
      this.child.show();
    } else if (data === false) {
      __details_remove(this);
    } else if (ctx.length && this.length) {
      __details_add(ctx[0], ctx[0].aoData[this[0]], data, klass);
    }

    return this;
  });

  _api_register([_child_obj + '.show()', _child_mth + '.show()'], function (show) {
    __details_display(this, true);

    return this;
  });

  _api_register([_child_obj + '.hide()', _child_mth + '.hide()'], function () {
    __details_display(this, false);

    return this;
  });

  _api_register([_child_obj + '.remove()', _child_mth + '.remove()'], function () {
    __details_remove(this);

    return this;
  });

  _api_register(_child_obj + '.isShown()', function () {
    var ctx = this.context;

    if (ctx.length && this.length) {
      return ctx[0].aoData[this[0]]._detailsShow || false;
    }

    return false;
  });

  var __re_column_selector = /^([^:]+):(name|visIdx|visible)$/;

  var __columnData = function __columnData(settings, column, r1, r2, rows) {
    var a = [];

    for (var row = 0, ien = rows.length; row < ien; row++) {
      a.push(_fnGetCellData(settings, rows[row], column));
    }

    return a;
  };

  var __column_selector = function __column_selector(settings, selector, opts) {
    var columns = settings.aoColumns,
        names = _pluck(columns, 'sName'),
        nodes = _pluck(columns, 'nTh');

    var run = function run(s) {
      var selInt = _intVal(s);

      if (s === '') {
        return _range(columns.length);
      }

      if (selInt !== null) {
        return [selInt >= 0 ? selInt : columns.length + selInt];
      }

      if (typeof s === 'function') {
        var rows = _selector_row_indexes(settings, opts);

        return $.map(columns, function (col, idx) {
          return s(idx, __columnData(settings, idx, 0, 0, rows), nodes[idx]) ? idx : null;
        });
      }

      var match = typeof s === 'string' ? s.match(__re_column_selector) : '';

      if (match) {
        switch (match[2]) {
          case 'visIdx':
          case 'visible':
            var idx = parseInt(match[1], 10);

            if (idx < 0) {
              var visColumns = $.map(columns, function (col, i) {
                return col.bVisible ? i : null;
              });
              return [visColumns[visColumns.length + idx]];
            }

            return [_fnVisibleToColumnIndex(settings, idx)];

          case 'name':
            return $.map(names, function (name, i) {
              return name === match[1] ? i : null;
            });

          default:
            return [];
        }
      }

      if (s.nodeName && s._DT_CellIndex) {
        return [s._DT_CellIndex.column];
      }

      var jqResult = $(nodes).filter(s).map(function () {
        return $.inArray(this, nodes);
      }).toArray();

      if (jqResult.length || !s.nodeName) {
        return jqResult;
      }

      var host = $(s).closest('*[data-dt-column]');
      return host.length ? [host.data('dt-column')] : [];
    };

    return _selector_run('column', selector, run, settings, opts);
  };

  var __setColumnVis = function __setColumnVis(settings, column, vis) {
    var cols = settings.aoColumns,
        col = cols[column],
        data = settings.aoData,
        row,
        cells,
        i,
        ien,
        tr;

    if (vis === undefined) {
      return col.bVisible;
    }

    if (col.bVisible === vis) {
      return;
    }

    if (vis) {
      var insertBefore = $.inArray(true, _pluck(cols, 'bVisible'), column + 1);

      for (i = 0, ien = data.length; i < ien; i++) {
        tr = data[i].nTr;
        cells = data[i].anCells;

        if (tr) {
          tr.insertBefore(cells[column], cells[insertBefore] || null);
        }
      }
    } else {
      $(_pluck(settings.aoData, 'anCells', column)).detach();
    }

    col.bVisible = vis;

    _fnDrawHead(settings, settings.aoHeader);

    _fnDrawHead(settings, settings.aoFooter);

    if (!settings.aiDisplay.length) {
      $(settings.nTBody).find('td[colspan]').attr('colspan', _fnVisbleColumns(settings));
    }

    _fnSaveState(settings);
  };

  _api_register('columns()', function (selector, opts) {
    if (selector === undefined) {
      selector = '';
    } else if ($.isPlainObject(selector)) {
      opts = selector;
      selector = '';
    }

    opts = _selector_opts(opts);
    var inst = this.iterator('table', function (settings) {
      return __column_selector(settings, selector, opts);
    }, 1);
    inst.selector.cols = selector;
    inst.selector.opts = opts;
    return inst;
  });

  _api_registerPlural('columns().header()', 'column().header()', function (selector, opts) {
    return this.iterator('column', function (settings, column) {
      return settings.aoColumns[column].nTh;
    }, 1);
  });

  _api_registerPlural('columns().footer()', 'column().footer()', function (selector, opts) {
    return this.iterator('column', function (settings, column) {
      return settings.aoColumns[column].nTf;
    }, 1);
  });

  _api_registerPlural('columns().data()', 'column().data()', function () {
    return this.iterator('column-rows', __columnData, 1);
  });

  _api_registerPlural('columns().dataSrc()', 'column().dataSrc()', function () {
    return this.iterator('column', function (settings, column) {
      return settings.aoColumns[column].mData;
    }, 1);
  });

  _api_registerPlural('columns().cache()', 'column().cache()', function (type) {
    return this.iterator('column-rows', function (settings, column, i, j, rows) {
      return _pluck_order(settings.aoData, rows, type === 'search' ? '_aFilterData' : '_aSortData', column);
    }, 1);
  });

  _api_registerPlural('columns().nodes()', 'column().nodes()', function () {
    return this.iterator('column-rows', function (settings, column, i, j, rows) {
      return _pluck_order(settings.aoData, rows, 'anCells', column);
    }, 1);
  });

  _api_registerPlural('columns().visible()', 'column().visible()', function (vis, calc) {
    var ret = this.iterator('column', function (settings, column) {
      if (vis === undefined) {
        return settings.aoColumns[column].bVisible;
      }

      __setColumnVis(settings, column, vis);
    });

    if (vis !== undefined) {
      this.iterator('column', function (settings, column) {
        _fnCallbackFire(settings, null, 'column-visibility', [settings, column, vis, calc]);
      });

      if (calc === undefined || calc) {
        this.columns.adjust();
      }
    }

    return ret;
  });

  _api_registerPlural('columns().indexes()', 'column().index()', function (type) {
    return this.iterator('column', function (settings, column) {
      return type === 'visible' ? _fnColumnIndexToVisible(settings, column) : column;
    }, 1);
  });

  _api_register('columns.adjust()', function () {
    return this.iterator('table', function (settings) {
      _fnAdjustColumnSizing(settings);
    }, 1);
  });

  _api_register('column.index()', function (type, idx) {
    if (this.context.length !== 0) {
      var ctx = this.context[0];

      if (type === 'fromVisible' || type === 'toData') {
        return _fnVisibleToColumnIndex(ctx, idx);
      } else if (type === 'fromData' || type === 'toVisible') {
        return _fnColumnIndexToVisible(ctx, idx);
      }
    }
  });

  _api_register('column()', function (selector, opts) {
    return _selector_first(this.columns(selector, opts));
  });

  var __cell_selector = function __cell_selector(settings, selector, opts) {
    var data = settings.aoData;

    var rows = _selector_row_indexes(settings, opts);

    var cells = _removeEmpty(_pluck_order(data, rows, 'anCells'));

    var allCells = $([].concat.apply([], cells));
    var row;
    var columns = settings.aoColumns.length;
    var a, i, ien, j, o, host;

    var run = function run(s) {
      var fnSelector = typeof s === 'function';

      if (s === null || s === undefined || fnSelector) {
        a = [];

        for (i = 0, ien = rows.length; i < ien; i++) {
          row = rows[i];

          for (j = 0; j < columns; j++) {
            o = {
              row: row,
              column: j
            };

            if (fnSelector) {
              host = data[row];

              if (s(o, _fnGetCellData(settings, row, j), host.anCells ? host.anCells[j] : null)) {
                a.push(o);
              }
            } else {
              a.push(o);
            }
          }
        }

        return a;
      }

      if ($.isPlainObject(s)) {
        return s.column !== undefined && s.row !== undefined && $.inArray(s.row, rows) !== -1 ? [s] : [];
      }

      var jqResult = allCells.filter(s).map(function (i, el) {
        return {
          row: el._DT_CellIndex.row,
          column: el._DT_CellIndex.column
        };
      }).toArray();

      if (jqResult.length || !s.nodeName) {
        return jqResult;
      }

      host = $(s).closest('*[data-dt-row]');
      return host.length ? [{
        row: host.data('dt-row'),
        column: host.data('dt-column')
      }] : [];
    };

    return _selector_run('cell', selector, run, settings, opts);
  };

  _api_register('cells()', function (rowSelector, columnSelector, opts) {
    if ($.isPlainObject(rowSelector)) {
      if (rowSelector.row === undefined) {
        opts = rowSelector;
        rowSelector = null;
      } else {
        opts = columnSelector;
        columnSelector = null;
      }
    }

    if ($.isPlainObject(columnSelector)) {
      opts = columnSelector;
      columnSelector = null;
    }

    if (columnSelector === null || columnSelector === undefined) {
      return this.iterator('table', function (settings) {
        return __cell_selector(settings, rowSelector, _selector_opts(opts));
      });
    }

    var columns = this.columns(columnSelector);
    var rows = this.rows(rowSelector);
    var a, i, ien, j, jen;
    this.iterator('table', function (settings, idx) {
      a = [];

      for (i = 0, ien = rows[idx].length; i < ien; i++) {
        for (j = 0, jen = columns[idx].length; j < jen; j++) {
          a.push({
            row: rows[idx][i],
            column: columns[idx][j]
          });
        }
      }
    }, 1);
    var cells = this.cells(a, opts);
    $.extend(cells.selector, {
      cols: columnSelector,
      rows: rowSelector,
      opts: opts
    });
    return cells;
  });

  _api_registerPlural('cells().nodes()', 'cell().node()', function () {
    return this.iterator('cell', function (settings, row, column) {
      var data = settings.aoData[row];
      return data && data.anCells ? data.anCells[column] : undefined;
    }, 1);
  });

  _api_register('cells().data()', function () {
    return this.iterator('cell', function (settings, row, column) {
      return _fnGetCellData(settings, row, column);
    }, 1);
  });

  _api_registerPlural('cells().cache()', 'cell().cache()', function (type) {
    type = type === 'search' ? '_aFilterData' : '_aSortData';
    return this.iterator('cell', function (settings, row, column) {
      return settings.aoData[row][type][column];
    }, 1);
  });

  _api_registerPlural('cells().render()', 'cell().render()', function (type) {
    return this.iterator('cell', function (settings, row, column) {
      return _fnGetCellData(settings, row, column, type);
    }, 1);
  });

  _api_registerPlural('cells().indexes()', 'cell().index()', function () {
    return this.iterator('cell', function (settings, row, column) {
      return {
        row: row,
        column: column,
        columnVisible: _fnColumnIndexToVisible(settings, column)
      };
    }, 1);
  });

  _api_registerPlural('cells().invalidate()', 'cell().invalidate()', function (src) {
    return this.iterator('cell', function (settings, row, column) {
      _fnInvalidate(settings, row, src, column);
    });
  });

  _api_register('cell()', function (rowSelector, columnSelector, opts) {
    return _selector_first(this.cells(rowSelector, columnSelector, opts));
  });

  _api_register('cell().data()', function (data) {
    var ctx = this.context;
    var cell = this[0];

    if (data === undefined) {
      return ctx.length && cell.length ? _fnGetCellData(ctx[0], cell[0].row, cell[0].column) : undefined;
    }

    _fnSetCellData(ctx[0], cell[0].row, cell[0].column, data);

    _fnInvalidate(ctx[0], cell[0].row, 'data', cell[0].column);

    return this;
  });

  _api_register('order()', function (order, dir) {
    var ctx = this.context;

    if (order === undefined) {
      return ctx.length !== 0 ? ctx[0].aaSorting : undefined;
    }

    if (typeof order === 'number') {
      order = [[order, dir]];
    } else if (order.length && !$.isArray(order[0])) {
      order = Array.prototype.slice.call(arguments);
    }

    return this.iterator('table', function (settings) {
      settings.aaSorting = order.slice();
    });
  });

  _api_register('order.listener()', function (node, column, callback) {
    return this.iterator('table', function (settings) {
      _fnSortAttachListener(settings, node, column, callback);
    });
  });

  _api_register('order.fixed()', function (set) {
    if (!set) {
      var ctx = this.context;
      var fixed = ctx.length ? ctx[0].aaSortingFixed : undefined;
      return $.isArray(fixed) ? {
        pre: fixed
      } : fixed;
    }

    return this.iterator('table', function (settings) {
      settings.aaSortingFixed = $.extend(true, {}, set);
    });
  });

  _api_register(['columns().order()', 'column().order()'], function (dir) {
    var that = this;
    return this.iterator('table', function (settings, i) {
      var sort = [];
      $.each(that[i], function (j, col) {
        sort.push([col, dir]);
      });
      settings.aaSorting = sort;
    });
  });

  _api_register('search()', function (input, regex, smart, caseInsen) {
    var ctx = this.context;

    if (input === undefined) {
      return ctx.length !== 0 ? ctx[0].oPreviousSearch.sSearch : undefined;
    }

    return this.iterator('table', function (settings) {
      if (!settings.oFeatures.bFilter) {
        return;
      }

      _fnFilterComplete(settings, $.extend({}, settings.oPreviousSearch, {
        "sSearch": input + "",
        "bRegex": regex === null ? false : regex,
        "bSmart": smart === null ? true : smart,
        "bCaseInsensitive": caseInsen === null ? true : caseInsen
      }), 1);
    });
  });

  _api_registerPlural('columns().search()', 'column().search()', function (input, regex, smart, caseInsen) {
    return this.iterator('column', function (settings, column) {
      var preSearch = settings.aoPreSearchCols;

      if (input === undefined) {
        return preSearch[column].sSearch;
      }

      if (!settings.oFeatures.bFilter) {
        return;
      }

      $.extend(preSearch[column], {
        "sSearch": input + "",
        "bRegex": regex === null ? false : regex,
        "bSmart": smart === null ? true : smart,
        "bCaseInsensitive": caseInsen === null ? true : caseInsen
      });

      _fnFilterComplete(settings, settings.oPreviousSearch, 1);
    });
  });

  _api_register('state()', function () {
    return this.context.length ? this.context[0].oSavedState : null;
  });

  _api_register('state.clear()', function () {
    return this.iterator('table', function (settings) {
      settings.fnStateSaveCallback.call(settings.oInstance, settings, {});
    });
  });

  _api_register('state.loaded()', function () {
    return this.context.length ? this.context[0].oLoadedState : null;
  });

  _api_register('state.save()', function () {
    return this.iterator('table', function (settings) {
      _fnSaveState(settings);
    });
  });

  DataTable.versionCheck = DataTable.fnVersionCheck = function (version) {
    var aThis = DataTable.version.split('.');
    var aThat = version.split('.');
    var iThis, iThat;

    for (var i = 0, iLen = aThat.length; i < iLen; i++) {
      iThis = parseInt(aThis[i], 10) || 0;
      iThat = parseInt(aThat[i], 10) || 0;

      if (iThis === iThat) {
        continue;
      }

      return iThis > iThat;
    }

    return true;
  };

  DataTable.isDataTable = DataTable.fnIsDataTable = function (table) {
    var t = $(table).get(0);
    var is = false;

    if (table instanceof DataTable.Api) {
      return true;
    }

    $.each(DataTable.settings, function (i, o) {
      var head = o.nScrollHead ? $('table', o.nScrollHead)[0] : null;
      var foot = o.nScrollFoot ? $('table', o.nScrollFoot)[0] : null;

      if (o.nTable === t || head === t || foot === t) {
        is = true;
      }
    });
    return is;
  };

  DataTable.tables = DataTable.fnTables = function (visible) {
    var api = false;

    if ($.isPlainObject(visible)) {
      api = visible.api;
      visible = visible.visible;
    }

    var a = $.map(DataTable.settings, function (o) {
      if (!visible || visible && $(o.nTable).is(':visible')) {
        return o.nTable;
      }
    });
    return api ? new _Api2(a) : a;
  };

  DataTable.camelToHungarian = _fnCamelToHungarian;

  _api_register('$()', function (selector, opts) {
    var rows = this.rows(opts).nodes(),
        jqRows = $(rows);
    return $([].concat(jqRows.filter(selector).toArray(), jqRows.find(selector).toArray()));
  });

  $.each(['on', 'one', 'off'], function (i, key) {
    _api_register(key + '()', function () {
      var args = Array.prototype.slice.call(arguments);
      args[0] = $.map(args[0].split(/\s/), function (e) {
        return !e.match(/\.dt\b/) ? e + '.dt' : e;
      }).join(' ');
      var inst = $(this.tables().nodes());
      inst[key].apply(inst, args);
      return this;
    });
  });

  _api_register('clear()', function () {
    return this.iterator('table', function (settings) {
      _fnClearTable(settings);
    });
  });

  _api_register('settings()', function () {
    return new _Api2(this.context, this.context);
  });

  _api_register('init()', function () {
    var ctx = this.context;
    return ctx.length ? ctx[0].oInit : null;
  });

  _api_register('data()', function () {
    return this.iterator('table', function (settings) {
      return _pluck(settings.aoData, '_aData');
    }).flatten();
  });

  _api_register('destroy()', function (remove) {
    remove = remove || false;
    return this.iterator('table', function (settings) {
      var orig = settings.nTableWrapper.parentNode;
      var classes = settings.oClasses;
      var table = settings.nTable;
      var tbody = settings.nTBody;
      var thead = settings.nTHead;
      var tfoot = settings.nTFoot;
      var jqTable = $(table);
      var jqTbody = $(tbody);
      var jqWrapper = $(settings.nTableWrapper);
      var rows = $.map(settings.aoData, function (r) {
        return r.nTr;
      });
      var i, ien;
      settings.bDestroying = true;

      _fnCallbackFire(settings, "aoDestroyCallback", "destroy", [settings]);

      if (!remove) {
        new _Api2(settings).columns().visible(true);
      }

      jqWrapper.off('.DT').find(':not(tbody *)').off('.DT');
      $(window).off('.DT-' + settings.sInstance);

      if (table != thead.parentNode) {
        jqTable.children('thead').detach();
        jqTable.append(thead);
      }

      if (tfoot && table != tfoot.parentNode) {
        jqTable.children('tfoot').detach();
        jqTable.append(tfoot);
      }

      settings.aaSorting = [];
      settings.aaSortingFixed = [];

      _fnSortingClasses(settings);

      $(rows).removeClass(settings.asStripeClasses.join(' '));
      $('th, td', thead).removeClass(classes.sSortable + ' ' + classes.sSortableAsc + ' ' + classes.sSortableDesc + ' ' + classes.sSortableNone);
      jqTbody.children().detach();
      jqTbody.append(rows);
      var removedMethod = remove ? 'remove' : 'detach';
      jqTable[removedMethod]();
      jqWrapper[removedMethod]();

      if (!remove && orig) {
        orig.insertBefore(table, settings.nTableReinsertBefore);
        jqTable.css('width', settings.sDestroyWidth).removeClass(classes.sTable);
        ien = settings.asDestroyStripes.length;

        if (ien) {
          jqTbody.children().each(function (i) {
            $(this).addClass(settings.asDestroyStripes[i % ien]);
          });
        }
      }

      var idx = $.inArray(settings, DataTable.settings);

      if (idx !== -1) {
        DataTable.settings.splice(idx, 1);
      }
    });
  });

  $.each(['column', 'row', 'cell'], function (i, type) {
    _api_register(type + 's().every()', function (fn) {
      var opts = this.selector.opts;
      var api = this;
      return this.iterator(type, function (settings, arg1, arg2, arg3, arg4) {
        fn.call(api[type](arg1, type === 'cell' ? arg2 : opts, type === 'cell' ? opts : undefined), arg1, arg2, arg3, arg4);
      });
    });
  });

  _api_register('i18n()', function (token, def, plural) {
    var ctx = this.context[0];

    var resolved = _fnGetObjectDataFn(token)(ctx.oLanguage);

    if (resolved === undefined) {
      resolved = def;
    }

    if (plural !== undefined && $.isPlainObject(resolved)) {
      resolved = resolved[plural] !== undefined ? resolved[plural] : resolved._;
    }

    return resolved.replace('%d', plural);
  });

  DataTable.version = "1.10.18";
  DataTable.settings = [];
  DataTable.models = {};
  DataTable.models.oSearch = {
    "bCaseInsensitive": true,
    "sSearch": "",
    "bRegex": false,
    "bSmart": true
  };
  DataTable.models.oRow = {
    "nTr": null,
    "anCells": null,
    "_aData": [],
    "_aSortData": null,
    "_aFilterData": null,
    "_sFilterRow": null,
    "_sRowStripe": "",
    "src": null,
    "idx": -1
  };
  DataTable.models.oColumn = {
    "idx": null,
    "aDataSort": null,
    "asSorting": null,
    "bSearchable": null,
    "bSortable": null,
    "bVisible": null,
    "_sManualType": null,
    "_bAttrSrc": false,
    "fnCreatedCell": null,
    "fnGetData": null,
    "fnSetData": null,
    "mData": null,
    "mRender": null,
    "nTh": null,
    "nTf": null,
    "sClass": null,
    "sContentPadding": null,
    "sDefaultContent": null,
    "sName": null,
    "sSortDataType": 'std',
    "sSortingClass": null,
    "sSortingClassJUI": null,
    "sTitle": null,
    "sType": null,
    "sWidth": null,
    "sWidthOrig": null
  };
  DataTable.defaults = {
    "aaData": null,
    "aaSorting": [[0, 'asc']],
    "aaSortingFixed": [],
    "ajax": null,
    "aLengthMenu": [10, 25, 50, 100],
    "aoColumns": null,
    "aoColumnDefs": null,
    "aoSearchCols": [],
    "asStripeClasses": null,
    "bAutoWidth": true,
    "bDeferRender": false,
    "bDestroy": false,
    "bFilter": true,
    "bInfo": true,
    "bLengthChange": true,
    "bPaginate": true,
    "bProcessing": false,
    "bRetrieve": false,
    "bScrollCollapse": false,
    "bServerSide": false,
    "bSort": true,
    "bSortMulti": true,
    "bSortCellsTop": false,
    "bSortClasses": true,
    "bStateSave": false,
    "fnCreatedRow": null,
    "fnDrawCallback": null,
    "fnFooterCallback": null,
    "fnFormatNumber": function fnFormatNumber(toFormat) {
      return toFormat.toString().replace(/\B(?=(\d{3})+(?!\d))/g, this.oLanguage.sThousands);
    },
    "fnHeaderCallback": null,
    "fnInfoCallback": null,
    "fnInitComplete": null,
    "fnPreDrawCallback": null,
    "fnRowCallback": null,
    "fnServerData": null,
    "fnServerParams": null,
    "fnStateLoadCallback": function fnStateLoadCallback(settings) {
      try {
        return JSON.parse((settings.iStateDuration === -1 ? sessionStorage : localStorage).getItem('DataTables_' + settings.sInstance + '_' + location.pathname));
      } catch (e) {}
    },
    "fnStateLoadParams": null,
    "fnStateLoaded": null,
    "fnStateSaveCallback": function fnStateSaveCallback(settings, data) {
      try {
        (settings.iStateDuration === -1 ? sessionStorage : localStorage).setItem('DataTables_' + settings.sInstance + '_' + location.pathname, JSON.stringify(data));
      } catch (e) {}
    },
    "fnStateSaveParams": null,
    "iStateDuration": 7200,
    "iDeferLoading": null,
    "iDisplayLength": 10,
    "iDisplayStart": 0,
    "iTabIndex": 0,
    "oClasses": {},
    "oLanguage": {
      "oAria": {
        "sSortAscending": ": activate to sort column ascending",
        "sSortDescending": ": activate to sort column descending"
      },
      "oPaginate": {
        "sFirst": "First",
        "sLast": "Last",
        "sNext": "Next",
        "sPrevious": "Previous"
      },
      "sEmptyTable": "No data available in table",
      "sInfo": "Showing _START_ to _END_ of _TOTAL_ entries",
      "sInfoEmpty": "Showing 0 to 0 of 0 entries",
      "sInfoFiltered": "(filtered from _MAX_ total entries)",
      "sInfoPostFix": "",
      "sDecimal": "",
      "sThousands": ",",
      "sLengthMenu": "Show _MENU_ entries",
      "sLoadingRecords": "Loading...",
      "sProcessing": "Processing...",
      "sSearch": "Search:",
      "sSearchPlaceholder": "",
      "sUrl": "",
      "sZeroRecords": "No matching records found"
    },
    "oSearch": $.extend({}, DataTable.models.oSearch),
    "sAjaxDataProp": "data",
    "sAjaxSource": null,
    "sDom": "lfrtip",
    "searchDelay": null,
    "sPaginationType": "simple_numbers",
    "sScrollX": "",
    "sScrollXInner": "",
    "sScrollY": "",
    "sServerMethod": "GET",
    "renderer": null,
    "rowId": "DT_RowId"
  };

  _fnHungarianMap(DataTable.defaults);

  DataTable.defaults.column = {
    "aDataSort": null,
    "iDataSort": -1,
    "asSorting": ['asc', 'desc'],
    "bSearchable": true,
    "bSortable": true,
    "bVisible": true,
    "fnCreatedCell": null,
    "mData": null,
    "mRender": null,
    "sCellType": "td",
    "sClass": "",
    "sContentPadding": "",
    "sDefaultContent": null,
    "sName": "",
    "sSortDataType": "std",
    "sTitle": null,
    "sType": null,
    "sWidth": null
  };

  _fnHungarianMap(DataTable.defaults.column);

  DataTable.models.oSettings = {
    "oFeatures": {
      "bAutoWidth": null,
      "bDeferRender": null,
      "bFilter": null,
      "bInfo": null,
      "bLengthChange": null,
      "bPaginate": null,
      "bProcessing": null,
      "bServerSide": null,
      "bSort": null,
      "bSortMulti": null,
      "bSortClasses": null,
      "bStateSave": null
    },
    "oScroll": {
      "bCollapse": null,
      "iBarWidth": 0,
      "sX": null,
      "sXInner": null,
      "sY": null
    },
    "oLanguage": {
      "fnInfoCallback": null
    },
    "oBrowser": {
      "bScrollOversize": false,
      "bScrollbarLeft": false,
      "bBounding": false,
      "barWidth": 0
    },
    "ajax": null,
    "aanFeatures": [],
    "aoData": [],
    "aiDisplay": [],
    "aiDisplayMaster": [],
    "aIds": {},
    "aoColumns": [],
    "aoHeader": [],
    "aoFooter": [],
    "oPreviousSearch": {},
    "aoPreSearchCols": [],
    "aaSorting": null,
    "aaSortingFixed": [],
    "asStripeClasses": null,
    "asDestroyStripes": [],
    "sDestroyWidth": 0,
    "aoRowCallback": [],
    "aoHeaderCallback": [],
    "aoFooterCallback": [],
    "aoDrawCallback": [],
    "aoRowCreatedCallback": [],
    "aoPreDrawCallback": [],
    "aoInitComplete": [],
    "aoStateSaveParams": [],
    "aoStateLoadParams": [],
    "aoStateLoaded": [],
    "sTableId": "",
    "nTable": null,
    "nTHead": null,
    "nTFoot": null,
    "nTBody": null,
    "nTableWrapper": null,
    "bDeferLoading": false,
    "bInitialised": false,
    "aoOpenRows": [],
    "sDom": null,
    "searchDelay": null,
    "sPaginationType": "two_button",
    "iStateDuration": 0,
    "aoStateSave": [],
    "aoStateLoad": [],
    "oSavedState": null,
    "oLoadedState": null,
    "sAjaxSource": null,
    "sAjaxDataProp": null,
    "bAjaxDataGet": true,
    "jqXHR": null,
    "json": undefined,
    "oAjaxData": undefined,
    "fnServerData": null,
    "aoServerParams": [],
    "sServerMethod": null,
    "fnFormatNumber": null,
    "aLengthMenu": null,
    "iDraw": 0,
    "bDrawing": false,
    "iDrawError": -1,
    "_iDisplayLength": 10,
    "_iDisplayStart": 0,
    "_iRecordsTotal": 0,
    "_iRecordsDisplay": 0,
    "oClasses": {},
    "bFiltered": false,
    "bSorted": false,
    "bSortCellsTop": null,
    "oInit": null,
    "aoDestroyCallback": [],
    "fnRecordsTotal": function fnRecordsTotal() {
      return _fnDataSource(this) == 'ssp' ? this._iRecordsTotal * 1 : this.aiDisplayMaster.length;
    },
    "fnRecordsDisplay": function fnRecordsDisplay() {
      return _fnDataSource(this) == 'ssp' ? this._iRecordsDisplay * 1 : this.aiDisplay.length;
    },
    "fnDisplayEnd": function fnDisplayEnd() {
      var len = this._iDisplayLength,
          start = this._iDisplayStart,
          calc = start + len,
          records = this.aiDisplay.length,
          features = this.oFeatures,
          paginate = features.bPaginate;

      if (features.bServerSide) {
        return paginate === false || len === -1 ? start + records : Math.min(start + len, this._iRecordsDisplay);
      } else {
        return !paginate || calc > records || len === -1 ? records : calc;
      }
    },
    "oInstance": null,
    "sInstance": null,
    "iTabIndex": 0,
    "nScrollHead": null,
    "nScrollFoot": null,
    "aLastSort": [],
    "oPlugins": {},
    "rowIdFn": null,
    "rowId": null
  };
  DataTable.ext = _ext = {
    buttons: {},
    classes: {},
    build: "dt/dt-1.10.18",
    errMode: "alert",
    feature: [],
    search: [],
    selector: {
      cell: [],
      column: [],
      row: []
    },
    internal: {},
    legacy: {
      ajax: null
    },
    pager: {},
    renderer: {
      pageButton: {},
      header: {}
    },
    order: {},
    type: {
      detect: [],
      search: {},
      order: {}
    },
    _unique: 0,
    fnVersionCheck: DataTable.fnVersionCheck,
    iApiIndex: 0,
    oJUIClasses: {},
    sVersion: DataTable.version
  };
  $.extend(_ext, {
    afnFiltering: _ext.search,
    aTypes: _ext.type.detect,
    ofnSearch: _ext.type.search,
    oSort: _ext.type.order,
    afnSortData: _ext.order,
    aoFeatures: _ext.feature,
    oApi: _ext.internal,
    oStdClasses: _ext.classes,
    oPagination: _ext.pager
  });
  $.extend(DataTable.ext.classes, {
    "sTable": "dataTable",
    "sNoFooter": "no-footer",
    "sPageButton": "paginate_button",
    "sPageButtonActive": "current",
    "sPageButtonDisabled": "disabled",
    "sStripeOdd": "odd",
    "sStripeEven": "even",
    "sRowEmpty": "dataTables_empty",
    "sWrapper": "dataTables_wrapper",
    "sFilter": "dataTables_filter",
    "sInfo": "dataTables_info",
    "sPaging": "dataTables_paginate paging_",
    "sLength": "dataTables_length",
    "sProcessing": "dataTables_processing",
    "sSortAsc": "sorting_asc",
    "sSortDesc": "sorting_desc",
    "sSortable": "sorting",
    "sSortableAsc": "sorting_asc_disabled",
    "sSortableDesc": "sorting_desc_disabled",
    "sSortableNone": "sorting_disabled",
    "sSortColumn": "sorting_",
    "sFilterInput": "",
    "sLengthSelect": "",
    "sScrollWrapper": "dataTables_scroll",
    "sScrollHead": "dataTables_scrollHead",
    "sScrollHeadInner": "dataTables_scrollHeadInner",
    "sScrollBody": "dataTables_scrollBody",
    "sScrollFoot": "dataTables_scrollFoot",
    "sScrollFootInner": "dataTables_scrollFootInner",
    "sHeaderTH": "",
    "sFooterTH": "",
    "sSortJUIAsc": "",
    "sSortJUIDesc": "",
    "sSortJUI": "",
    "sSortJUIAscAllowed": "",
    "sSortJUIDescAllowed": "",
    "sSortJUIWrapper": "",
    "sSortIcon": "",
    "sJUIHeader": "",
    "sJUIFooter": ""
  });
  var extPagination = DataTable.ext.pager;

  function _numbers(page, pages) {
    var numbers = [],
        buttons = extPagination.numbers_length,
        half = Math.floor(buttons / 2),
        i = 1;

    if (pages <= buttons) {
      numbers = _range(0, pages);
    } else if (page <= half) {
      numbers = _range(0, buttons - 2);
      numbers.push('ellipsis');
      numbers.push(pages - 1);
    } else if (page >= pages - 1 - half) {
      numbers = _range(pages - (buttons - 2), pages);
      numbers.splice(0, 0, 'ellipsis');
      numbers.splice(0, 0, 0);
    } else {
      numbers = _range(page - half + 2, page + half - 1);
      numbers.push('ellipsis');
      numbers.push(pages - 1);
      numbers.splice(0, 0, 'ellipsis');
      numbers.splice(0, 0, 0);
    }

    numbers.DT_el = 'span';
    return numbers;
  }

  $.extend(extPagination, {
    simple: function simple(page, pages) {
      return ['previous', 'next'];
    },
    full: function full(page, pages) {
      return ['first', 'previous', 'next', 'last'];
    },
    numbers: function numbers(page, pages) {
      return [_numbers(page, pages)];
    },
    simple_numbers: function simple_numbers(page, pages) {
      return ['previous', _numbers(page, pages), 'next'];
    },
    full_numbers: function full_numbers(page, pages) {
      return ['first', 'previous', _numbers(page, pages), 'next', 'last'];
    },
    first_last_numbers: function first_last_numbers(page, pages) {
      return ['first', _numbers(page, pages), 'last'];
    },
    _numbers: _numbers,
    numbers_length: 7
  });
  $.extend(true, DataTable.ext.renderer, {
    pageButton: {
      _: function _(settings, host, idx, buttons, page, pages) {
        var classes = settings.oClasses;
        var lang = settings.oLanguage.oPaginate;
        var aria = settings.oLanguage.oAria.paginate || {};
        var btnDisplay,
            btnClass,
            counter = 0;

        var attach = function attach(container, buttons) {
          var i, ien, node, button;

          var clickHandler = function clickHandler(e) {
            _fnPageChange(settings, e.data.action, true);
          };

          for (i = 0, ien = buttons.length; i < ien; i++) {
            button = buttons[i];

            if ($.isArray(button)) {
              var inner = $('<' + (button.DT_el || 'div') + '/>').appendTo(container);
              attach(inner, button);
            } else {
              btnDisplay = null;
              btnClass = '';

              switch (button) {
                case 'ellipsis':
                  container.append('<span class="ellipsis">&#x2026;</span>');
                  break;

                case 'first':
                  btnDisplay = lang.sFirst;
                  btnClass = button + (page > 0 ? '' : ' ' + classes.sPageButtonDisabled);
                  break;

                case 'previous':
                  btnDisplay = lang.sPrevious;
                  btnClass = button + (page > 0 ? '' : ' ' + classes.sPageButtonDisabled);
                  break;

                case 'next':
                  btnDisplay = lang.sNext;
                  btnClass = button + (page < pages - 1 ? '' : ' ' + classes.sPageButtonDisabled);
                  break;

                case 'last':
                  btnDisplay = lang.sLast;
                  btnClass = button + (page < pages - 1 ? '' : ' ' + classes.sPageButtonDisabled);
                  break;

                default:
                  btnDisplay = button + 1;
                  btnClass = page === button ? classes.sPageButtonActive : '';
                  break;
              }

              if (btnDisplay !== null) {
                node = $('<a>', {
                  'class': classes.sPageButton + ' ' + btnClass,
                  'aria-controls': settings.sTableId,
                  'aria-label': aria[button],
                  'data-dt-idx': counter,
                  'tabindex': settings.iTabIndex,
                  'id': idx === 0 && typeof button === 'string' ? settings.sTableId + '_' + button : null
                }).html(btnDisplay).appendTo(container);

                _fnBindAction(node, {
                  action: button
                }, clickHandler);

                counter++;
              }
            }
          }
        };

        var activeEl;

        try {
          activeEl = $(host).find(document.activeElement).data('dt-idx');
        } catch (e) {}

        attach($(host).empty(), buttons);

        if (activeEl !== undefined) {
          $(host).find('[data-dt-idx=' + activeEl + ']').focus();
        }
      }
    }
  });
  $.extend(DataTable.ext.type.detect, [function (d, settings) {
    var decimal = settings.oLanguage.sDecimal;
    return _isNumber(d, decimal) ? 'num' + decimal : null;
  }, function (d, settings) {
    if (d && !(d instanceof Date) && !_re_date.test(d)) {
      return null;
    }

    var parsed = Date.parse(d);
    return parsed !== null && !isNaN(parsed) || _empty(d) ? 'date' : null;
  }, function (d, settings) {
    var decimal = settings.oLanguage.sDecimal;
    return _isNumber(d, decimal, true) ? 'num-fmt' + decimal : null;
  }, function (d, settings) {
    var decimal = settings.oLanguage.sDecimal;
    return _htmlNumeric(d, decimal) ? 'html-num' + decimal : null;
  }, function (d, settings) {
    var decimal = settings.oLanguage.sDecimal;
    return _htmlNumeric(d, decimal, true) ? 'html-num-fmt' + decimal : null;
  }, function (d, settings) {
    return _empty(d) || typeof d === 'string' && d.indexOf('<') !== -1 ? 'html' : null;
  }]);
  $.extend(DataTable.ext.type.search, {
    html: function html(data) {
      return _empty(data) ? data : typeof data === 'string' ? data.replace(_re_new_lines, " ").replace(_re_html, "") : '';
    },
    string: function string(data) {
      return _empty(data) ? data : typeof data === 'string' ? data.replace(_re_new_lines, " ") : data;
    }
  });

  var __numericReplace = function __numericReplace(d, decimalPlace, re1, re2) {
    if (d !== 0 && (!d || d === '-')) {
      return -Infinity;
    }

    if (decimalPlace) {
      d = _numToDecimal(d, decimalPlace);
    }

    if (d.replace) {
      if (re1) {
        d = d.replace(re1, '');
      }

      if (re2) {
        d = d.replace(re2, '');
      }
    }

    return d * 1;
  };

  function _addNumericSort(decimalPlace) {
    $.each({
      "num": function num(d) {
        return __numericReplace(d, decimalPlace);
      },
      "num-fmt": function numFmt(d) {
        return __numericReplace(d, decimalPlace, _re_formatted_numeric);
      },
      "html-num": function htmlNum(d) {
        return __numericReplace(d, decimalPlace, _re_html);
      },
      "html-num-fmt": function htmlNumFmt(d) {
        return __numericReplace(d, decimalPlace, _re_html, _re_formatted_numeric);
      }
    }, function (key, fn) {
      _ext.type.order[key + decimalPlace + '-pre'] = fn;

      if (key.match(/^html\-/)) {
        _ext.type.search[key + decimalPlace] = _ext.type.search.html;
      }
    });
  }

  $.extend(_ext.type.order, {
    "date-pre": function datePre(d) {
      var ts = Date.parse(d);
      return isNaN(ts) ? -Infinity : ts;
    },
    "html-pre": function htmlPre(a) {
      return _empty(a) ? '' : a.replace ? a.replace(/<.*?>/g, "").toLowerCase() : a + '';
    },
    "string-pre": function stringPre(a) {
      return _empty(a) ? '' : typeof a === 'string' ? a.toLowerCase() : !a.toString ? '' : a.toString();
    },
    "string-asc": function stringAsc(x, y) {
      return x < y ? -1 : x > y ? 1 : 0;
    },
    "string-desc": function stringDesc(x, y) {
      return x < y ? 1 : x > y ? -1 : 0;
    }
  });

  _addNumericSort('');

  $.extend(true, DataTable.ext.renderer, {
    header: {
      _: function _(settings, cell, column, classes) {
        $(settings.nTable).on('order.dt.DT', function (e, ctx, sorting, columns) {
          if (settings !== ctx) {
            return;
          }

          var colIdx = column.idx;
          cell.removeClass(column.sSortingClass + ' ' + classes.sSortAsc + ' ' + classes.sSortDesc).addClass(columns[colIdx] == 'asc' ? classes.sSortAsc : columns[colIdx] == 'desc' ? classes.sSortDesc : column.sSortingClass);
        });
      },
      jqueryui: function jqueryui(settings, cell, column, classes) {
        $('<div/>').addClass(classes.sSortJUIWrapper).append(cell.contents()).append($('<span/>').addClass(classes.sSortIcon + ' ' + column.sSortingClassJUI)).appendTo(cell);
        $(settings.nTable).on('order.dt.DT', function (e, ctx, sorting, columns) {
          if (settings !== ctx) {
            return;
          }

          var colIdx = column.idx;
          cell.removeClass(classes.sSortAsc + " " + classes.sSortDesc).addClass(columns[colIdx] == 'asc' ? classes.sSortAsc : columns[colIdx] == 'desc' ? classes.sSortDesc : column.sSortingClass);
          cell.find('span.' + classes.sSortIcon).removeClass(classes.sSortJUIAsc + " " + classes.sSortJUIDesc + " " + classes.sSortJUI + " " + classes.sSortJUIAscAllowed + " " + classes.sSortJUIDescAllowed).addClass(columns[colIdx] == 'asc' ? classes.sSortJUIAsc : columns[colIdx] == 'desc' ? classes.sSortJUIDesc : column.sSortingClassJUI);
        });
      }
    }
  });

  var __htmlEscapeEntities = function __htmlEscapeEntities(d) {
    return typeof d === 'string' ? d.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') : d;
  };

  DataTable.render = {
    number: function number(thousands, decimal, precision, prefix, postfix) {
      return {
        display: function display(d) {
          if (typeof d !== 'number' && typeof d !== 'string') {
            return d;
          }

          var negative = d < 0 ? '-' : '';
          var flo = parseFloat(d);

          if (isNaN(flo)) {
            return __htmlEscapeEntities(d);
          }

          flo = flo.toFixed(precision);
          d = Math.abs(flo);
          var intPart = parseInt(d, 10);
          var floatPart = precision ? decimal + (d - intPart).toFixed(precision).substring(2) : '';
          return negative + (prefix || '') + intPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, thousands) + floatPart + (postfix || '');
        }
      };
    },
    text: function text() {
      return {
        display: __htmlEscapeEntities
      };
    }
  };

  function _fnExternApiFunc(fn) {
    return function () {
      var args = [_fnSettingsFromNode(this[DataTable.ext.iApiIndex])].concat(Array.prototype.slice.call(arguments));
      return DataTable.ext.internal[fn].apply(this, args);
    };
  }

  $.extend(DataTable.ext.internal, {
    _fnExternApiFunc: _fnExternApiFunc,
    _fnBuildAjax: _fnBuildAjax,
    _fnAjaxUpdate: _fnAjaxUpdate,
    _fnAjaxParameters: _fnAjaxParameters,
    _fnAjaxUpdateDraw: _fnAjaxUpdateDraw,
    _fnAjaxDataSrc: _fnAjaxDataSrc,
    _fnAddColumn: _fnAddColumn,
    _fnColumnOptions: _fnColumnOptions,
    _fnAdjustColumnSizing: _fnAdjustColumnSizing,
    _fnVisibleToColumnIndex: _fnVisibleToColumnIndex,
    _fnColumnIndexToVisible: _fnColumnIndexToVisible,
    _fnVisbleColumns: _fnVisbleColumns,
    _fnGetColumns: _fnGetColumns,
    _fnColumnTypes: _fnColumnTypes,
    _fnApplyColumnDefs: _fnApplyColumnDefs,
    _fnHungarianMap: _fnHungarianMap,
    _fnCamelToHungarian: _fnCamelToHungarian,
    _fnLanguageCompat: _fnLanguageCompat,
    _fnBrowserDetect: _fnBrowserDetect,
    _fnAddData: _fnAddData,
    _fnAddTr: _fnAddTr,
    _fnNodeToDataIndex: _fnNodeToDataIndex,
    _fnNodeToColumnIndex: _fnNodeToColumnIndex,
    _fnGetCellData: _fnGetCellData,
    _fnSetCellData: _fnSetCellData,
    _fnSplitObjNotation: _fnSplitObjNotation,
    _fnGetObjectDataFn: _fnGetObjectDataFn,
    _fnSetObjectDataFn: _fnSetObjectDataFn,
    _fnGetDataMaster: _fnGetDataMaster,
    _fnClearTable: _fnClearTable,
    _fnDeleteIndex: _fnDeleteIndex,
    _fnInvalidate: _fnInvalidate,
    _fnGetRowElements: _fnGetRowElements,
    _fnCreateTr: _fnCreateTr,
    _fnBuildHead: _fnBuildHead,
    _fnDrawHead: _fnDrawHead,
    _fnDraw: _fnDraw,
    _fnReDraw: _fnReDraw,
    _fnAddOptionsHtml: _fnAddOptionsHtml,
    _fnDetectHeader: _fnDetectHeader,
    _fnGetUniqueThs: _fnGetUniqueThs,
    _fnFeatureHtmlFilter: _fnFeatureHtmlFilter,
    _fnFilterComplete: _fnFilterComplete,
    _fnFilterCustom: _fnFilterCustom,
    _fnFilterColumn: _fnFilterColumn,
    _fnFilter: _fnFilter,
    _fnFilterCreateSearch: _fnFilterCreateSearch,
    _fnEscapeRegex: _fnEscapeRegex,
    _fnFilterData: _fnFilterData,
    _fnFeatureHtmlInfo: _fnFeatureHtmlInfo,
    _fnUpdateInfo: _fnUpdateInfo,
    _fnInfoMacros: _fnInfoMacros,
    _fnInitialise: _fnInitialise,
    _fnInitComplete: _fnInitComplete,
    _fnLengthChange: _fnLengthChange,
    _fnFeatureHtmlLength: _fnFeatureHtmlLength,
    _fnFeatureHtmlPaginate: _fnFeatureHtmlPaginate,
    _fnPageChange: _fnPageChange,
    _fnFeatureHtmlProcessing: _fnFeatureHtmlProcessing,
    _fnProcessingDisplay: _fnProcessingDisplay,
    _fnFeatureHtmlTable: _fnFeatureHtmlTable,
    _fnScrollDraw: _fnScrollDraw,
    _fnApplyToChildren: _fnApplyToChildren,
    _fnCalculateColumnWidths: _fnCalculateColumnWidths,
    _fnThrottle: _fnThrottle,
    _fnConvertToWidth: _fnConvertToWidth,
    _fnGetWidestNode: _fnGetWidestNode,
    _fnGetMaxLenString: _fnGetMaxLenString,
    _fnStringToCss: _fnStringToCss,
    _fnSortFlatten: _fnSortFlatten,
    _fnSort: _fnSort,
    _fnSortAria: _fnSortAria,
    _fnSortListener: _fnSortListener,
    _fnSortAttachListener: _fnSortAttachListener,
    _fnSortingClasses: _fnSortingClasses,
    _fnSortData: _fnSortData,
    _fnSaveState: _fnSaveState,
    _fnLoadState: _fnLoadState,
    _fnSettingsFromNode: _fnSettingsFromNode,
    _fnLog: _fnLog,
    _fnMap: _fnMap,
    _fnBindAction: _fnBindAction,
    _fnCallbackReg: _fnCallbackReg,
    _fnCallbackFire: _fnCallbackFire,
    _fnLengthOverflow: _fnLengthOverflow,
    _fnRenderer: _fnRenderer,
    _fnDataSource: _fnDataSource,
    _fnRowAttributes: _fnRowAttributes,
    _fnExtend: _fnExtend,
    _fnCalculateEnd: function _fnCalculateEnd() {}
  });
  $.fn.dataTable = DataTable;
  DataTable.$ = $;
  $.fn.dataTableSettings = DataTable.settings;
  $.fn.dataTableExt = DataTable.ext;

  $.fn.DataTable = function (opts) {
    return $(this).dataTable(opts).api();
  };

  $.each(DataTable, function (prop, val) {
    $.fn.DataTable[prop] = val;
  });
  return $.fn.dataTable;
});
"use strict";

var InnerFormButton = {
  _prop: {
    elem: null,
    innerButtonConfig: null,
    formRuntimeInstance: null,
    listButtonPO: null,
    formRuntimeCategory: ""
  },
  Instance: function Instance(innerButtonConfig, formRuntimeInstance, listButtonPO, formRuntimeCategory) {
    var elem = $('<button type="button" class="operation-button operation-button-primary" id="' + innerButtonConfig.id + '"><span>' + innerButtonConfig.caption + '</span></button>');
    elem.bind("click", {
      "innerButtonConfig": innerButtonConfig,
      "formRuntimeInstance": formRuntimeInstance,
      "listButtonPO": listButtonPO,
      "formRuntimeCategory": formRuntimeCategory,
      "_this": this
    }, this.ButtonClickEvent);
    return {
      elem: elem
    };
  },
  GetProp: function GetProp(sender) {
    return {
      elem: sender.data._this,
      innerButtonConfig: sender.data.innerButtonConfig,
      formRuntimeInstance: sender.data.formRuntimeInstance,
      listButtonPO: sender.data.listButtonPO,
      formRuntimeCategory: sender.data.formRuntimeCategory
    };
  },
  ButtonClickEvent: function ButtonClickEvent(sender) {
    DialogUtility.Frame_CloseDialog(window);
  }
};
"use strict";

var InnerFormCloseButton = {
  _prop: InnerFormButton._prop,
  Instance: InnerFormButton.Instance,
  GetButtonElem: InnerFormButton.GetButtonElem,
  ButtonClickEvent: function ButtonClickEvent(sender) {
    DialogUtility.Frame_CloseDialog(window);
  }
};
"use strict";

var InnerFormJsClientButton = {
  _prop: InnerFormButton._prop,
  Instance: InnerFormButton.Instance,
  GetButtonElem: InnerFormButton.GetButtonElem,
  ButtonClickEvent: function ButtonClickEvent(sender) {
    var innerButtonConfig = sender.data.innerButtonConfig;
    var actionType = innerButtonConfig.actionType;

    if (actionType == "reloadData") {
      window.location.href = window.location.href;
    } else {
      window.print();
    }
  }
};
"use strict";

var InnerFormSaveButton = {
  _prop: InnerFormButton._prop,
  Instance: InnerFormButton.Instance,
  GetButtonElem: InnerFormButton.GetButtonElem,
  ButtonClickEvent: function ButtonClickEvent(sender) {
    var innerButtonConfig = sender.data.innerButtonConfig;
    var formRuntimeInstance = sender.data.formRuntimeInstance;
    var listButtonPO = sender.data.listButtonPO;
    var _this = sender.data._this;
    var saveAndClose = innerButtonConfig.saveAndClose;
    var validateResult = ValidateRulesRuntime.ValidateSubmitEnable();
    _this._prop = InnerFormButton.GetProp(sender);

    if (ValidateRulesRuntime.AlertValidateErrors(validateResult)) {
      var formDataComplexPO = formRuntimeInstance.SerializationFormData();
      var operationType = formRuntimeInstance._Prop_Config.OperationType;
      DialogUtility.AlertLoading(window, DialogUtility.DialogLoadingId, {
        title: "系统提示"
      }, "系统处理中,请稍候...");
      RuntimeGeneralInstance.SubmitFormDataComplexPOListToServer(formDataComplexPO, formDataComplexPO.recordId, innerButtonConfig.id, listButtonPO.buttonId, operationType, function (result) {
        if (result.success) {
          if (this._prop.formRuntimeCategory == FormRuntimeSinglePageObject.FORM_RUNTIME_CATEGORY_LIST) {
            console.log(this._prop);
            var listFormButtonElemId = formRuntimeInstance.GetOpenedListFormButtonId();
            window.OpenerWindowObj.WLDCT_ListTableContainer.TryReloadForListFormButton(listFormButtonElemId);
            window.setTimeout(function () {
              DialogUtility.CloseDialog(DialogUtility.DialogLoadingId);
              DialogUtility.Alert(window, DialogUtility.DialogId02, {}, result.message, function () {
                DialogUtility.Frame_CloseDialog(window);
              }, this);
            }, 500);
          } else if (this._prop.formRuntimeCategory == FormRuntimeSinglePageObject.FORM_RUNTIME_CATEGORY_INDEPENDENCE) {
            if (this._prop.formRuntimeInstance._FormPO.formOperationType == "dev") {
              var devOperationEndFunc = BaseUtility.GetUrlParaValue("devOperationEndFunc");

              if (StringUtility.IsNotNullOrEmpty(devOperationEndFunc)) {
                window.OpenerWindowObj[devOperationEndFunc](this._prop);
              }

              if (this._prop.innerButtonConfig.saveAndClose == "true") {
                window.setTimeout(function () {
                  DialogUtility.CloseDialog(DialogUtility.DialogLoadingId);
                  DialogUtility.Alert(window, DialogUtility.DialogId02, {}, result.message, function () {
                    DialogUtility.Frame_CloseDialog(window);
                  }, this);
                }, 500);
              }
            } else {
              DialogUtility.CloseDialog(DialogUtility.DialogLoadingId);
              DialogUtility.Alert(window, DialogUtility.DialogId02, {}, result.message, function () {
                if (saveAndClose) {
                  DialogUtility.AlertText("关闭窗口,未完成!");
                }

                window.location.href = window.location.href;
              }, this);
            }
          }
        } else {
          DialogUtility.CloseDialog(DialogUtility.DialogLoadingId);
        }
      }, _this);
    }
  }
};
"use strict";

var WFDCT_BaiduMapContainer = {
  _prop: {
    elemId: "",
    clientInstanceName: "",
    $singleControlElem: null,
    mapObj: null,
    mapSelectedLngLat: "",
    mapEditObjs: [],
    mapViewObjs: [],
    oldEditData: null,
    operationType: ""
  },
  LoadBaiDuJsCompleted: function LoadBaiDuJsCompleted() {
    var _this = this;

    this._prop.mapObj = new BMapGL.Map(this._prop.elemId);

    this._prop.mapObj.centerAndZoom(new BMapGL.Point(114.54200132645097, 22.754142795907825), 16);

    this._prop.mapObj.enableScrollWheelZoom(true);

    this._prop.mapObj.addEventListener('click', function (e) {
      _this._prop.mapSelectedLngLat = e.latlng;
    });

    if (!BaseUtility.IsViewOperation(this._prop.operationType)) {
      this.InitDrawControl();
    }

    if (this._prop.oldEditData) {
      console.log(this._prop.oldEditData);
      var mapData = this._prop.oldEditData;

      for (var i = 0; i < mapData.length; i++) {
        if (mapData[i].type == "point") {
          var point = new BMapGL.Point(mapData[i].path.lng, mapData[i].path.lat);
          var marker = new BMapGL.Marker(point, {});

          this._prop.mapObj.addOverlay(marker);

          this._prop.mapObj.panTo(point);

          this.addToMapEditObjs("point", marker);
        }
      }
    }
  },
  InitializeAtInstance: function InitializeAtInstance(initializeParas, clientInstanceName, elemId) {},
  RendererChain: function RendererChain(_rendererChainParas) {
    console.log(_rendererChainParas);
    var $singleControlElem = _rendererChainParas.$singleControlElem;
    this._prop.elemId = $singleControlElem.attr("id");
    this._prop.clientInstanceName = $singleControlElem.attr("client_instance_name");
    this._prop.$singleControlElem = $singleControlElem;
    this._prop.operationType = _rendererChainParas.formRuntimeInstance._Prop_Config.OperationType;
    $("#" + this._prop.elemId).addClass("map-control-wrap");
    var loadFunc = this._prop.clientInstanceName + ".LoadBaiDuJsCompleted";
    BaiduMapUtility.LoadJsCompleted(loadFunc);
  },
  RendererDataChain: function RendererDataChain() {},
  GetValue: function GetValue($elem, originalData, paras) {
    var mapData = [];

    if (this._prop.mapEditObjs && this._prop.mapEditObjs.length > 0) {
      for (var i = 0; i < this._prop.mapEditObjs.length; i++) {
        if (this._prop.mapEditObjs[i].type == "point") {
          mapData.push({
            "type": this._prop.mapEditObjs[i].type,
            "path": this._prop.mapEditObjs[i].obj.getPosition()
          });
        }
      }

      mapData = JsonUtility.JsonToString(mapData);
    }

    originalData.value = mapData;
    return originalData;
  },
  SetValue: function SetValue($elem, fieldPO, relationFormRecordComplexPo, _rendererDataChainParas) {
    if (fieldPO && fieldPO.value) {
      this._prop.oldEditData = JsonUtility.StringToJson(fieldPO.value);
    }
  },
  ToViewStatus: function ToViewStatus($elem, fieldPO, relationFormRecordComplexPo, _rendererDataChainParas) {},
  addToMapEditObjs: function addToMapEditObjs(type, editObj) {
    this._prop.mapEditObjs.push({
      "type": type,
      "obj": editObj
    });
  },
  InitDrawControl: function InitDrawControl() {
    var $singleControlElem = this._prop.$singleControlElem;
    $singleControlElem.parent().addClass("map-control-wrap");
    var $drawControlWrap = $("<div class='map-operation-button-wrap'></div>");
    var $appendAddPointControl = $("<div class='map-operation-button map-operation-button-add-point' title='添加定位点'></div>");
    var $appendClearControl = $("<div class='map-operation-button map-operation-button-clear' title='清空设置'></div>");
    $drawControlWrap.append($appendAddPointControl);
    $drawControlWrap.append($appendClearControl);
    $singleControlElem.parent().append($drawControlWrap);

    var _this = this;

    $appendAddPointControl.click(function () {
      if (!_this._prop.mapSelectedLngLat) {
        DialogUtility.AlertText("请先点击地图，确认坐标。");
      }

      var point = new BMapGL.Point(_this._prop.mapSelectedLngLat.lng, _this._prop.mapSelectedLngLat.lat);
      var marker = new BMapGL.Marker(point, {});

      _this._prop.mapObj.addOverlay(marker);

      _this.addToMapEditObjs("point", marker);
    });
    $appendClearControl.click(function () {
      for (var i = 0; i < _this._prop.mapEditObjs.length; i++) {
        var editObj = _this._prop.mapEditObjs[i];

        _this._prop.mapObj.removeOverlay(editObj.obj);
      }

      _this._prop.mapEditObjs = [];
    });
  }
};
"use strict";

var _ref_filePath = $("script").last().attr("src");

var WFDCT_CKEditor4 = {
  ckeditorInstance: null,
  RendererChain: function RendererChain(_rendererChainParas) {
    var $singleControlElem = _rendererChainParas.$singleControlElem;
    var areaHeight = $singleControlElem.height();

    if (BaseUtility.IsViewOperation(_rendererChainParas.formRuntimeInstance.GetOperationType())) {} else {
      var filename = _ref_filePath.substr(_ref_filePath.lastIndexOf('/') + 1);

      var editorConfigUrl = BaseUtility.AppendTimeStampUrl(_ref_filePath.replace(filename, "Control/WebFormControl/" + $singleControlElem.attr("customconfig")));
      console.log(editorConfigUrl);
      this.ckeditorInstance = CKEDITOR.replace($singleControlElem.attr("id"), {
        customConfig: editorConfigUrl,
        formRuntimeInstance: _rendererChainParas.formRuntimeInstance
      });
      this.ckeditorInstance.config.height = areaHeight;
    }
  },
  RendererDataChain: function RendererDataChain() {},
  GetValue: function GetValue($elem, originalData, paras) {
    originalData.value = this.ckeditorInstance.getData();
    return originalData;
  },
  SetValue: function SetValue($elem, fieldPO, relationFormRecordComplexPo, _rendererDataChainParas) {
    if (fieldPO) {
      $elem.val(fieldPO.value);
      $elem.attr("control_value", fieldPO.value);
    }
  },
  ToViewStatus: function ToViewStatus($elem, fieldPO, relationFormRecordComplexPo, _rendererDataChainParas) {
    var $viewElem = $("<div></div>");
    var oldAllAttrs = BaseUtility.GetElemAllAttr($elem);
    $viewElem.attr(oldAllAttrs);
    $viewElem.removeClass();
    $viewElem.html(fieldPO.value);
    $viewElem.css("overflow", "auto");
    $viewElem.height($viewElem.height() + 100);
    $elem.replaceWith($viewElem);
  }
};
"use strict";

var WFDCT_DocumentContentUploadConvertToPDFContainer = {
  InitStyle: HTMLControl.InitStyle,
  RendererChain: function RendererChain(_rendererChainParas) {},
  RendererDataChain: function RendererDataChain() {},
  GetValue: HTMLControl.GetValue,
  SetValue: HTMLControl.SetValue,
  ToViewStatus: HTMLControl.ToViewStatus,
  TryBindUrlValue: HTMLControl.TryBindUrlValue
};
"use strict";

var WFDCT_DropDownSelect = {
  InitStyle: HTMLControl.InitStyle,
  RendererChain: function RendererChain(_rendererChainParas) {
    var $singleControlElem = _rendererChainParas.$singleControlElem;
    var defaultSelected = $singleControlElem.attr("defaultselected");

    if (defaultSelected) {
      $singleControlElem.val(defaultSelected);
    }
  },
  RendererDataChain: HTMLControl.RendererDataChain,
  GetValue: HTMLControl.GetValue,
  SetValue: HTMLControl.SetValue,
  ToViewStatus: HTMLControl.ToViewStatus,
  TryBindUrlValue: HTMLControl.TryBindUrlValue
};
"use strict";

var WFDCT_FileImageList = {
  _objectType: "Instance",
  _propMap: {},
  _prop: {
    $singleControlElem: null,
    instanceName: null,
    elemId: null,
    opButtons: null,
    beforeSelectJSMethod: null,
    afterUploadedJsMethod: null,
    fileExType: null,
    authType: null,
    rendererContainerJsMethod: null,
    rendererSingleRowJsMethod: null,
    categoryType: null,
    getBindRecordIdJsMethod: null,
    getBindRecordTypeJsMethod: null,
    useTemplate: null,
    uploadEnable: false,
    downloadEnable: false,
    deleteEnable: false,
    previewEnable: false,
    moveOrderEnable: false,
    clickFileNameAction: null,
    objType: ""
  },
  acInterface: {
    getFileListData: "/Rest/Builder/RunTime/FileRuntime/GetImageFileListData",
    downLoadFileByFileId: "/Rest/Builder/RunTime/FileRuntime/DownLoadFileByFileId"
  },
  RendererChain: function RendererChain(_rendererChainParas) {
    var $singleControlElem = _rendererChainParas.$singleControlElem;
    this.BindElementAttrToInstanceProp($singleControlElem);
    $singleControlElem.html("");
    this.BuildFileList();
  },
  RendererDataChain: function RendererDataChain() {},
  GetValue: HTMLControl.GetValue,
  SetValue: HTMLControl.SetValue,
  BindElementAttrToInstanceProp: function BindElementAttrToInstanceProp($singleControlElem) {
    if (!this._prop.getBindRecordIdJsMethod) {
      this._prop.getBindRecordIdJsMethod = this._prop.instanceName + ".GetThisRecordId()";
    }

    if (!this._prop.getBindRecordTypeJsMethod) {
      this._prop.getBindRecordTypeJsMethod = this._prop.instanceName + ".GetThisRecordType()";
    }
  },
  GetThisRecordId: function GetThisRecordId() {
    var objId = "";

    if (formRuntimeInst && formRuntimeInst.GetWebFormRTParas() && formRuntimeInst.GetWebFormRTParas().RecordId) {
      objId = formRuntimeInst.GetWebFormRTParas().RecordId;
    } else {
      DialogUtility.AlertText("查找不到绑定的记录ID");
    }

    return objId;
  },
  GetThisRecordType: function GetThisRecordType() {
    return this._prop.objType;
  },
  BuildFileList: function BuildFileList() {
    var $singleControlElem = this._prop.$singleControlElem;
    var file_image_list_wrap_id = "file_image_list_wrap" + this._prop.elemId;
    $("#" + file_image_list_wrap_id).remove();
    var $divWarp = $("<div class='file-image-list-wrap' id='" + file_image_list_wrap_id + "'></div>");
    var objId = eval(this._prop.getBindRecordIdJsMethod);
    var category = this._prop.categoryType;
    AjaxUtility.Post(this.acInterface.getFileListData, {
      objId: objId,
      categoryType: category
    }, function (result) {
      if (result.success) {
        for (var i = 0; i < result.data.length; i++) {
          var fileInfo = result.data[i];
          var imgElem = this.BuildFileDislay(result, fileInfo);
          $divWarp.append(imgElem);
        }
      }

      console.log(result);
    }, this);
    $($singleControlElem.append($divWarp));
  },
  BuildFileDislay: function BuildFileDislay(responseJSON, fileInfo) {
    var fileId = fileInfo.fileId;
    var imgElem = "<div class='img-wrap'><img src='" + BaseUtility.BuildAction(this.acInterface.downLoadFileByFileId, {
      fileId: fileId
    }) + "' /></div>";
    return imgElem;
  }
};
"use strict";

var WFDCT_FileUploadContainer = {
  _objectType: "Instance",
  _propMap: {},
  _prop: {
    $singleControlElem: null,
    instanceName: null,
    elemId: null,
    opButtons: null,
    beforeSelectJSMethod: null,
    afterUploadedJsMethod: null,
    fileExType: null,
    authType: null,
    rendererContainerJsMethod: null,
    rendererSingleRowJsMethod: null,
    categoryType: null,
    getBindRecordIdJsMethod: null,
    getBindRecordTypeJsMethod: null,
    useTemplate: null,
    uploadEnable: false,
    downloadEnable: false,
    deleteEnable: false,
    previewEnable: false,
    moveOrderEnable: false,
    clickFileNameAction: null,
    objType: ""
  },
  acInterface: {
    getFileListData: "/Rest/Builder/RunTime/FileRuntime/GetFileListData",
    uploadFile: "/Rest/Builder/RunTime/FileRuntime/UploadFile",
    downloadFile: "/Rest/Builder/RunTime/FileRuntime/DownLoadFileByFileId",
    deleteFile: "/Rest/Builder/RunTime/FileRuntime/DeleteFileByFileId"
  },
  RendererChain: function RendererChain(_rendererChainParas) {
    var $singleControlElem = _rendererChainParas.$singleControlElem;
    this.BindElementAttrToInstanceProp($singleControlElem);
    $singleControlElem.html("");
    this.BuildUploadContainer();
    this.BuildFileList();
  },
  RendererDataChain: function RendererDataChain() {},
  GetValue: HTMLControl.GetValue,
  SetValue: HTMLControl.SetValue,
  ToViewStatus: function ToViewStatus($elem, fieldPO, relationFormRecordComplexPo, _rendererDataChainParas) {
    $("#" + this._prop.uploadWarpId).hide();
    $("#" + this._prop.elemId).find(".delete-button-elem").hide();
    $("#" + this._prop.elemId).find(".move-up-button-elem").hide();
    $("#" + this._prop.elemId).find(".move-down-button-elem").hide();
  },
  BindElementAttrToInstanceProp: function BindElementAttrToInstanceProp($singleControlElem) {
    if (!this._prop.getBindRecordIdJsMethod) {
      this._prop.getBindRecordIdJsMethod = this._prop.instanceName + ".GetThisRecordId()";
    }

    if (!this._prop.getBindRecordTypeJsMethod) {
      this._prop.getBindRecordTypeJsMethod = this._prop.instanceName + ".GetThisRecordType()";
    }

    if (this._prop.opButtons.indexOf("upload") >= 0) {
      this._prop.uploadEnable = true;
    }

    if (this._prop.opButtons.indexOf("download") >= 0) {
      this._prop.downloadEnable = true;
    }

    if (this._prop.opButtons.indexOf("delete") >= 0) {
      this._prop.deleteEnable = true;
    }

    if (this._prop.opButtons.indexOf("online-preview") >= 0) {
      this._prop.previewEnable = true;
    }

    if (this._prop.opButtons.indexOf("move-order") >= 0) {
      this._prop.moveOrderEnable = true;
    }
  },
  GetThisRecordId: function GetThisRecordId() {
    var objId = "";

    if (formRuntimeInst && formRuntimeInst.GetWebFormRTParas() && formRuntimeInst.GetWebFormRTParas().RecordId) {
      objId = formRuntimeInst.GetWebFormRTParas().RecordId;
    } else {
      DialogUtility.AlertText("查找不到绑定的记录ID");
    }

    return objId;
  },
  GetThisRecordType: function GetThisRecordType() {
    return this._prop.objType;
  },
  GetUploadEndPointRequest: function GetUploadEndPointRequest() {
    var endPoint = BaseUtility.GetRootPath() + this.acInterface.uploadFile;
    var paras = {
      objType: eval(this._prop.getBindRecordTypeJsMethod),
      objId: eval(this._prop.getBindRecordIdJsMethod),
      categoryType: this._prop.categoryType
    };
    return {
      endpoint: endPoint,
      params: paras
    };
  },
  CreateDefaultTemplate: function CreateDefaultTemplate(templateId) {
    $(window.document.body).append("<script type=\"text/template\" id=\"" + templateId + "\">\n        <div class=\"qq-uploader-selector qq-uploader qq-gallery\" qq-drop-area-text=\"\u62D6\u653E\u6587\u4EF6\u5230\u8FD9\u91CC\u8FDB\u884C\u4E0A\u4F20\u3002\" style=\"min-height: 78px;\">\n            <div class=\"qq-total-progress-bar-container-selector qq-total-progress-bar-container\">\n                <div role=\"progressbar\" aria-valuenow=\"0\" aria-valuemin=\"0\" aria-valuemax=\"100\" class=\"qq-total-progress-bar-selector qq-progress-bar qq-total-progress-bar\"></div>\n            </div>\n            <div class=\"qq-upload-drop-area-selector qq-upload-drop-area\" qq-hide-dropzone>\n                <span class=\"qq-upload-drop-area-text-selector\"></span>\n            </div>\n            <div class=\"qq-upload-button-selector qq-upload-button\" style=\"float: right\">\n                <div>\u9009\u62E9\u6587\u4EF6</div>\n            </div>\n            <span class=\"qq-drop-processing-selector qq-drop-processing\">\n                <span>Processing dropped files...</span>\n                <span class=\"qq-drop-processing-spinner-selector qq-drop-processing-spinner\"></span>\n            </span>\n            <ul class=\"qq-upload-list-selector qq-upload-list\" role=\"region\" aria-live=\"polite\" aria-relevant=\"additions removals\" style=\"display: none\">\n                <li>\n                    <span role=\"status\" class=\"qq-upload-status-text-selector qq-upload-status-text\"></span>\n                    <div class=\"qq-progress-bar-container-selector qq-progress-bar-container\">\n                        <div role=\"progressbar\" aria-valuenow=\"0\" aria-valuemin=\"0\" aria-valuemax=\"100\" class=\"qq-progress-bar-selector qq-progress-bar\"></div>\n                    </div>\n                    <span class=\"qq-upload-spinner-selector qq-upload-spinner\"></span>\n                    <div class=\"qq-thumbnail-wrapper\">\n                        <img class=\"qq-thumbnail-selector\" qq-max-size=\"120\" qq-server-scale>\n                    </div>\n                    <button type=\"button\" class=\"qq-upload-cancel-selector qq-upload-cancel\">X</button>\n                    <button type=\"button\" class=\"qq-upload-retry-selector qq-upload-retry\">\n                        <span class=\"qq-btn qq-retry-icon\" aria-label=\"Retry\"></span>\n                        Retry\n                    </button>\n\n                    <div class=\"qq-file-info\">\n                        <div class=\"qq-file-name\">\n                            <span class=\"qq-upload-file-selector qq-upload-file\"></span>\n                            <span class=\"qq-edit-filename-icon-selector qq-btn qq-edit-filename-icon\" aria-label=\"Edit filename\"></span>\n                        </div>\n                        <input class=\"qq-edit-filename-selector qq-edit-filename\" tabindex=\"0\" type=\"text\">\n                        <span class=\"qq-upload-size-selector qq-upload-size\"></span>\n                        <button type=\"button\" class=\"qq-btn qq-upload-delete-selector qq-upload-delete\">\n                            <span class=\"qq-btn qq-delete-icon\" aria-label=\"Delete\"></span>\n                        </button>\n                        <button type=\"button\" class=\"qq-btn qq-upload-pause-selector qq-upload-pause\">\n                            <span class=\"qq-btn qq-pause-icon\" aria-label=\"Pause\"></span>\n                        </button>\n                        <button type=\"button\" class=\"qq-btn qq-upload-continue-selector qq-upload-continue\">\n                            <span class=\"qq-btn qq-continue-icon\" aria-label=\"Continue\"></span>\n                        </button>\n                    </div>\n                </li>\n            </ul>\n\n            <dialog class=\"qq-alert-dialog-selector\">\n                <div class=\"qq-dialog-message-selector\"></div>\n                <div class=\"qq-dialog-buttons\">\n                    <button type=\"button\" class=\"qq-cancel-button-selector\">Close</button>\n                </div>\n            </dialog>\n\n            <dialog class=\"qq-confirm-dialog-selector\">\n                <div class=\"qq-dialog-message-selector\"></div>\n                <div class=\"qq-dialog-buttons\">\n                    <button type=\"button\" class=\"qq-cancel-button-selector\">No</button>\n                    <button type=\"button\" class=\"qq-ok-button-selector\">Yes</button>\n                </div>\n            </dialog>\n\n            <dialog class=\"qq-prompt-dialog-selector\">\n                <div class=\"qq-dialog-message-selector\"></div>\n                <input type=\"text\">\n                <div class=\"qq-dialog-buttons\">\n                    <button type=\"button\" class=\"qq-cancel-button-selector\">Cancel</button>\n                    <button type=\"button\" class=\"qq-ok-button-selector\">Ok</button>\n                </div>\n            </dialog>\n        </div>\n    </script>");
  },
  BuildUploadContainer: function BuildUploadContainer() {
    if (this._prop.uploadEnable) {
      var $singleControlElem = this._prop.$singleControlElem;
      var uploadWarpId = 'uploadWarp_' + this._prop.elemId;
      this._prop.uploadWarpId = uploadWarpId;
      var $uploadWarp = $("<div id='" + uploadWarpId + "'></div>");
      $singleControlElem.append($uploadWarp);
      var templateId = "qq-template_" + this._prop.elemId;

      if (this._prop.useTemplate == "defaultTemplate") {
        this.CreateDefaultTemplate(templateId);
      }

      var _this = this;

      var galleryUploader = new qq.FineUploader({
        element: $uploadWarp[0],
        template: templateId,
        multiple: false,
        request: this.GetUploadEndPointRequest(),
        callbacks: {
          onComplete: function onComplete(id, name, responseJSON, xhr) {
            if (responseJSON.success) {
              _this.BuildFileList();
            } else {
              DialogUtility.AlertText(responseJSON.message);
            }
          }
        }
      });
    }
  },
  BuildFileList: function BuildFileList() {
    var $singleControlElem = this._prop.$singleControlElem;
    var upload_file_list_wrap_id = "upload_file_list_warp_" + this._prop.elemId;
    $("#" + upload_file_list_wrap_id).remove();
    var $divWarp = $("<div class='upload_file_list_wrap' id='" + upload_file_list_wrap_id + "'><table class='file_list_table'><thead><tr><th style='width: 80px'>编号</th><th>文件名称</th><th style='width: 140px'>上传时间</th><th style='width: 140px'>上传人</th><th style='width: 140px'>文件大小</th><th style='width: 140px'>操作</th></tr></thead><tbody></tbody></table></div>");
    var $tbody = $divWarp.find("tbody");
    var objId = eval(this._prop.getBindRecordIdJsMethod);
    var category = this._prop.categoryType;
    AjaxUtility.Post(this.acInterface.getFileListData, {
      objId: objId,
      categoryType: category
    }, function (result) {
      if (result.success) {
        for (var i = 0; i < result.data.length; i++) {
          var fileInfo = result.data[i];
          $tbody.append(this.BuildFileInfoTableRow(result, fileInfo));
        }
      }

      if (BaseUtility.IsViewOperation(formRuntimeInst.GetOperationType())) {
        this.ToViewStatus();
      }
    }, this);
    $($singleControlElem.append($divWarp));
  },
  BuildFileInfoTableRow: function BuildFileInfoTableRow(responseJSON, fileInfo) {
    var fileCode = fileInfo.fileCode;
    var fileName = StringUtility.EncodeHtml(fileInfo.fileName);
    var fileCreateTime = DateUtility.DateFormatByTimeStamp(fileInfo.fileCreateTime, "yyyy-MM-dd");
    var fileSize = HardDiskUtility.ByteConvert(fileInfo.fileSize);
    var fileCreatorName = StringUtility.EncodeHtml(fileInfo.fileCreatorName);
    var $trObj = $("<tr><td style=\"text-align: center\">".concat(fileCode, "</td><td>").concat(fileName, "</td><td style=\"text-align: center\">").concat(fileCreateTime, "</td><td style=\"text-align: center\">").concat(fileCreatorName, "</td><td style=\"text-align: center\">").concat(fileSize, "</td><td style=\"text-align: center\"></td></tr>"));
    this.BuildFileInfoTableRowInnerButtons(responseJSON, fileInfo, $trObj);
    return $trObj;
  },
  BuildFileInfoTableRowInnerButtons: function BuildFileInfoTableRowInnerButtons(responseJSON, fileInfo, $tr) {
    if (!this._prop.downloadEnable && !this._prop.deleteEnable && this._prop.previewEnable && this._prop.moveOrderEnable) {}

    var $trLastTd = $tr.find("td:last");

    var _this = this;

    if (this._prop.deleteEnable) {
      var $deleteElem = $("<div class='file-list-inner-button delete-button-elem' title='点击删除'></div>");
      $deleteElem.click(function () {
        DialogUtility.Confirm(window, "确认删除附件【" + fileInfo.fileName + "】吗?", function () {
          AjaxUtility.Post(_this.acInterface.deleteFile, {
            fileId: fileInfo.fileId
          }, function (result) {
            if (result.success) {
              $deleteElem.parent().parent().remove();
            }
          }, _this);
        });
      });
      $trLastTd.append($deleteElem);
    }

    if (this._prop.moveOrderEnable || true) {
      var $moveUpElem = $("<div class='file-list-inner-button move-up-button-elem' title='点击上移'></div>");
      $moveUpElem.click(function () {
        DialogUtility.AlertText("暂不支持!");
      });
      var $moveDownElem = $("<div class='file-list-inner-button move-down-button-elem' title='点击下移'></div>");
      $moveDownElem.click(function () {
        DialogUtility.AlertText("暂不支持!");
      });
      $trLastTd.append($moveUpElem);
      $trLastTd.append($moveDownElem);
    }

    if (this._prop.downloadEnable) {
      var $downloadElem = $("<div class='file-list-inner-button download-button-elem' title='点击下载'></div>");
      $downloadElem.click(function () {
        var url = BaseUtility.GetRootPath() + _this.acInterface.downloadFile + "?fileId=" + fileInfo.fileId;
        window.open(url);
      });
      $trLastTd.append($downloadElem);
    }

    if (this._prop.previewEnable || true) {
      var $previewElem = $("<div class='file-list-inner-button preview-button-elem' title='点击预览'></div>");
      $previewElem.click(function () {
        DialogUtility.AlertText("暂不支持!");
      });
      $trLastTd.append($previewElem);
    }
  },
  TestFilePreviewEnable: function TestFilePreviewEnable(fileInfo) {
    return true;
  }
};
"use strict";

var WFDCT_OpinionInput_Demo_Data = {
  opinions: [{
    id: "11111111111111111",
    userId: "1",
    userName: "庄锐波",
    organId: "",
    organName: "",
    inputOpinion: "这只是一个测试客户端，所以不能保证这一改变一定会出现在Steam的正式版本中",
    inputTime: DateUtility.GetCurrentTimeString(),
    indexNum: 0,
    status: "",
    formClient: ""
  }, {
    id: "222222222222222",
    userId: "Shi_Ming_Hua_UID",
    userName: "石明华",
    organId: "",
    organName: "",
    inputOpinion: "这只是一个测试客户端",
    inputTime: DateUtility.GetCurrentTimeString(),
    indexNum: 1,
    status: "",
    formClient: ""
  }]
};
var WFDCT_OpinionInput = {
  _prop: {
    elemId: "",
    clientInstanceName: "",
    $singleControlElem: null,
    mySession: null,
    $rootElem: null,
    $oldOpinionListWrapElem: null,
    $newOpinionInputWrapElem: null,
    $newOpinionInputElem: null,
    oldOpinionsData: {
      opinions: []
    }
  },
  InitializeAtInstance: function InitializeAtInstance(initializeParas, clientInstanceName, elemId) {
    this._prop.elemId = elemId;
    this._prop.clientInstanceName = clientInstanceName;
  },
  RendererChain: function RendererChain(_rendererChainParas) {
    var $singleControlElem = _rendererChainParas.$singleControlElem;
    this._prop.$singleControlElem = $singleControlElem;
    this._prop.mySession = _rendererChainParas.po.mySession;
    var newOpinionId = StringUtility.Timestamp();
    var $rootElem = $("<div class='wfdct-opinion-input-outer-wrap'>\n                                <div class='wfdct-old-opinions-list-wrap'></div>\n                                <div class='wfdct-new-opinion-input-wrap'>\n                                    <textarea newOpinionId=\"".concat(newOpinionId, "\"></textarea>\n                                </div>\n                          </div>"));
    this._prop.$rootElem = $rootElem;

    this._prop.$singleControlElem.html("").append(this._prop.$rootElem);

    this._prop.$newOpinionInputElem = this._prop.$rootElem.find(".wfdct-new-opinion-input-wrap textarea");
    this._prop.$oldOpinionListWrapElem = this._prop.$rootElem.find(".wfdct-old-opinions-list-wrap");
  },
  RendererDataChain: function RendererDataChain() {},
  GetValue: function GetValue($elem, originalData, paras) {
    var newOpinionId = this._prop.$newOpinionInputElem.attr("newOpinionId");

    if (ArrayUtility.NotExist(this._prop.oldOpinionsData.opinions, function (item) {
      return item.id == newOpinionId;
    })) {
      var newInputOpinion = this._prop.$newOpinionInputElem.val();

      var newOpinionObj = this.BuildNewOpinion(this._prop.mySession, newOpinionId, newInputOpinion, this._prop.oldOpinionsData.opinions.length + 1);

      this._prop.oldOpinionsData.opinions.push(newOpinionObj);
    }

    originalData.value = JsonUtility.JsonToString(this._prop.oldOpinionsData);
    return originalData;
  },
  SetValue: function SetValue($elem, fieldPO, relationFormRecordComplexPo, _rendererDataChainParas) {
    var _this2 = this;

    var value = {
      opinions: []
    };

    var _this = this;

    if (fieldPO && fieldPO.value) {
      value = JsonUtility.StringToJson(fieldPO.value);
    }

    this._prop.oldOpinionsData = value;

    var _loop = function _loop(i) {
      var opinion = value.opinions[i];
      var singleOpinionWrap = $("<div class='wfdct-old-opinions-single-wrap' opinion='" + opinion.id + "'><div class='wfdct-old-opinion-text'></div><div class='wfdct-old-opinion-userinfo'></div></div>");
      var opinionText = opinion.inputOpinion;
      var userInfo = opinion.userName + "【" + opinion.inputTime + "】";

      if (opinion.userId == _this2._prop.mySession.userId) {
        var deleteButton = $("<div class='wfdct-old-opinion-delete' title='删除'><i class=\"las la-times-circle\"></i></div>");
        deleteButton.click(function () {
          WFDCT_OpinionInput.DeleteOpinion.call(_this, opinion.id);
        });
        singleOpinionWrap.prepend(deleteButton);
      }

      singleOpinionWrap.find(".wfdct-old-opinion-text").html(opinionText);
      singleOpinionWrap.find(".wfdct-old-opinion-userinfo").html(userInfo);

      _this2._prop.$oldOpinionListWrapElem.append(singleOpinionWrap);
    };

    for (var i = 0; i < value.opinions.length; i++) {
      _loop(i);
    }
  },
  BuildNewOpinion: function BuildNewOpinion(session, newOpinionId, newInputOpinion, indexNum) {
    return {
      id: newOpinionId,
      userId: session.userId,
      userName: session.userName,
      organId: session.organId,
      organName: session.organName,
      inputOpinion: newInputOpinion,
      inputTime: DateUtility.GetCurrentTimeString(),
      indexNum: indexNum,
      status: "general",
      formClient: "webClient"
    };
  },
  DeleteOpinion: function DeleteOpinion(opinionId) {
    DialogUtility.Confirm(window, "您确认要删除该意见吗?", function () {
      this._prop.$oldOpinionListWrapElem.find("[opinion='" + opinionId + "']").remove();

      if (this._prop.oldOpinionsData && this._prop.oldOpinionsData.opinions && this._prop.oldOpinionsData.opinions.length > 0) {
        ArrayUtility.DeleteWhere(this._prop.oldOpinionsData.opinions, function (item) {
          return item.id == opinionId;
        });
      }
    }, this);
  },
  SetNewValue: function SetNewValue(opinion) {
    this._prop.$newOpinionInputElem.val(opinion);
  },
  ToViewStatus: function ToViewStatus($elem, fieldPO, relationFormRecordComplexPo, _rendererDataChainParas) {
    this._prop.$newOpinionInputElem.hide();

    $(".wfdct-old-opinion-delete").hide();
  }
};
"use strict";

var WFDCT_RadioGroup = {
  radioGroupName: "",
  radioGroupWrapId: "",
  level2BindControlId: "",
  InitStyle: HTMLControl.InitStyle,
  RendererChain: function RendererChain(_rendererChainParas) {
    var $singleControlElem = _rendererChainParas.$singleControlElem;
    var dataSource = decodeURIComponent($singleControlElem.attr("datasource"));
    dataSource = JsonUtility.StringToJson(dataSource);
    var defaultIsChecked = true;
    $singleControlElem.hide();
    var defaultSelected = $singleControlElem.attr("defaultselected");
    this.radioGroupName = "radioGroupName_" + $singleControlElem.attr("id");
    this.radioGroupWrapId = "radioGroupWrap_" + $singleControlElem.attr("id");
    this.level2BindControlId = $singleControlElem.attr("level2bindcontrolid");
    $("#" + this.radioGroupWrapId).remove();
    var radioGroupDiv = $("<div class='radioGroupContainer' id='" + this.radioGroupWrapId + "' style='margin: 4px 0px;' />");
    var rownum = $singleControlElem.attr("rownum");

    var _this = this;

    for (var i = 0; i < dataSource.length; i++) {
      var item = dataSource[i];
      var text = item.ITEXT;
      var value = item.IVALUE;
      var newRow = false;

      if (i != 0 && rownum > 1) {
        newRow = i % rownum == 0;
      } else if (rownum == 1) {
        newRow = true;
      }

      if (text != "--请选择--") {
        var itemRadioId = this.radioGroupName + "_" + i;
        var itemRadio = $("<input type='radio' name='" + this.radioGroupName + "' id='" + itemRadioId + "' />");
        itemRadio.val(value);

        if (value == defaultSelected) {
          itemRadio.prop("checked", true);
        }

        radioGroupDiv.append(itemRadio);
        radioGroupDiv.append("<label for='" + itemRadioId + "' style='margin-right: 8px'>" + text + "</label>");

        if (newRow) {
          radioGroupDiv.append("<br />");
        }

        if (this.Is2LevelDD()) {
          itemRadio.change(function () {
            var value = $(this).val();

            _this.TryBind2LevelDD($singleControlElem, value);
          });
        }
      }
    }

    $singleControlElem.after(radioGroupDiv);

    if (defaultSelected) {}
  },
  RendererDataChain: function RendererDataChain() {},
  GetValue: function GetValue($elem, originalData, paras) {
    originalData.value = $("[name='" + this.radioGroupName + "']:checked").val();

    if (originalData.value == undefined) {
      originalData.value = "";
    }

    return originalData;
  },
  SetValue: function SetValue($elem, fieldPO, relationFormRecordComplexPo, _rendererDataChainParas) {
    if (fieldPO) {
      $elem.val(fieldPO.value);
      $elem.attr("control_value", fieldPO.value);
      $("[name='" + this.radioGroupName + "'][value='" + fieldPO.value + "']").prop("checked", true);

      if (fieldPO.value) {
        this.TryBind2LevelDD($elem, fieldPO.value);
      }
    }
  },
  ToViewStatus: function ToViewStatus($elem, fieldPO, relationFormRecordComplexPo, _rendererDataChainParas) {
    $("[name='" + this.radioGroupName + "']").parent().remove();
    var oldAllAttrs = BaseUtility.GetElemAllAttr($elem);
    var $viewElem = $("<label />");
    $viewElem.attr(oldAllAttrs);
    $viewElem.removeClass();
    $viewElem.show();
    $viewElem.text($elem.val());
    $elem.replaceWith($viewElem);
  },
  Is2LevelDD: function Is2LevelDD() {
    return StringUtility.IsNotNullOrEmpty(this.level2BindControlId);
  },
  TryBind2LevelDD: function TryBind2LevelDD($singleControlElem, value) {
    var level2BindControlId = $singleControlElem.attr("level2bindcontrolid");

    if (level2BindControlId) {
      var dataSourceAllLevel = decodeURIComponent($singleControlElem.attr("datasourcealllevel"));
      dataSourceAllLevel = JsonUtility.StringToJson(dataSourceAllLevel);
      var childDDArray = ArrayUtility.Where(dataSourceAllLevel, function (item) {
        return item.PARENTVALUE == value;
      });
      var $l2Elem = $("#" + level2BindControlId);
      var childDDArrayJson = JsonUtility.JsonToString(childDDArray);
      $l2Elem.attr("datasource", childDDArrayJson);
      var elemInstance = HTMLControl.GetControlInstanceByElem($l2Elem);
      elemInstance.RendererChain({
        $singleControlElem: $l2Elem
      });
    }
  }
};
"use strict";

var WFDCT_SelectOrganUser = {
  acInterface: {
    getOrganTreeData: "/Rest/Builder/RunTime/OrganRuntime/GetFullEnableOrgan",
    reloadListData: "/Rest/Builder/RunTime/UserRuntime/GetUserByOrganId"
  },
  treeConfig: {
    treeIdFieldName: "organId",
    treeObj: null,
    treeSelectedNode: null,
    treeSetting: {
      async: {
        enable: true,
        url: ""
      },
      data: {
        key: {
          name: "organName"
        },
        simpleData: {
          enable: true,
          idKey: "organId",
          pIdKey: "organParentId"
        }
      },
      callback: {
        onClick: function onClick(event, treeId, treeNode) {
          var _self = this.getZTreeObj(treeId)._host;

          _self.SelectedOrganNode(event, treeId, treeNode);
        },
        onAsyncSuccess: function onAsyncSuccess(event, treeId, treeNode, msg) {}
      }
    }
  },
  userConfig: {
    userWarpElemObj: null
  },
  selectedUser: {
    data: []
  },
  _objectType: "Instance",
  _prop: {
    buttonId: null,
    buttonText: null,
    multipleSplit: null,
    resultNameBindToControlField: null,
    resultValueBindToControlField: null,
    resultNameBindToControlId: null,
    resultValueBindToControlId: null,
    selectCondition: null,
    windowCaption: null,
    selectNumber: null,
    settingType: null,
    defaultSelectedOrganId: null,
    containerId: null,
    singleSelectAutoClose: null
  },
  RendererChain: function RendererChain(_rendererChainParas) {
    var $singleControlElem = _rendererChainParas.$singleControlElem;
    var $button = $singleControlElem;
    var buttonText = $button.attr("buttontext");
    $button.text(buttonText);
    $button.css({
      "padding": "2px 6px"
    });
    $button.bind("click", {
      "buttonElem": $button,
      "selfInstance": this
    }, this.ClickEvent);
  },
  RendererDataChain: function RendererDataChain() {},
  GetValue: HTMLControl.GetValue,
  SetValue: HTMLControl.SetValue,
  ToViewStatus: HTMLControl.ToViewStatus,
  BuildContentHTML: function BuildContentHTML(buttonId, selectedOrganId) {
    var containerId = "dialogContainer_" + buttonId;
    var userContainerId = containerId + "_userWrap";
    var treeULId = "treeULId_" + buttonId;

    if ($("#" + containerId).length == 0) {
      var htmlTemplate = "<div id='".concat(containerId, "' class=\"select_organ_user_wrap\">\n                    <div class=\"left_tree_wrap\"><ul ref=\"zTreeUL\" class=\"ztree\" id=\"").concat(treeULId, "\"></ul></div>\n                    <div class=\"right_selected_wrap\" id=\"").concat(userContainerId, "\"></div>\n                    <div class=\"buttons_outer_wrap\"><div class=\"buttons_inner_wrap\"><button class=\"button button-primary\" name=\"btnEnsure\">\u786E\u8BA4</button><button class=\"button\" name=\"btnClose\">\u5173\u95ED</button><button class=\"button\" name=\"btnClear\">\u6E05\u7A7A\u9009\u62E9</button></div></div>\n                </div>");
      var $containerDiv = $(htmlTemplate);
      $containerDiv.hide();
      $(document.body).append($containerDiv);

      var _this = this;

      $containerDiv.find("[name='btnEnsure']").click(function () {
        _this.EnsureClickEvent();
      });
      $containerDiv.find("[name='btnClose']").click(function () {
        _this.CloseClickEvent();
      });
      $containerDiv.find("[name='btnClear']").click(function () {
        _this.ClearClickEvent();
      });
      this.userConfig.userWarpElemObj = $containerDiv.find("#" + userContainerId);
      AjaxUtility.Post(this.acInterface.getOrganTreeData, {}, function (result) {
        if (result.success) {
          console.log(result);
          this.treeConfig.treeObj = $.fn.zTree.init($("#" + treeULId), this.treeConfig.treeSetting, result.data);
          this.treeConfig.treeObj.expandAll(true);
          this.treeConfig.treeObj._host = this;

          if (!StringUtility.IsNullOrEmpty(selectedOrganId)) {
            var node = this.treeConfig.treeObj.getNodeByParam("organId", selectedOrganId, null);
            this.treeConfig.treeObj.selectNode(node);
            this.BuildUserTable(selectedOrganId);
          }
        } else {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {});
        }
      }, this);
    }

    return containerId;
  },
  ClearUserTable: function ClearUserTable() {
    this.userConfig.userWarpElemObj.html("");
  },
  BuildUserTable: function BuildUserTable(organId) {
    AjaxUtility.Post(this.acInterface.reloadListData, {
      organId: organId
    }, function (result) {
      if (result.success) {
        console.log(result);

        var _this = this;

        this.ClearUserTable();
        var $userTable = $("<table class=\"userTable\"><tr><th style=\"width: 40px\">\u9009\u62E9</th><th style=\"width: 80px\">\u59D3\u540D</th><th style=\"width: 100px\">\u624B\u673A\u53F7\u7801</th><th>\u5907\u6CE8</th></tr></table>");

        for (var i = 0; i < result.data.length; i++) {
          var userData = result.data[i];
          var userId = userData.userId;
          var userName = StringUtility.EncodeHtml(userData.userName);
          var userPhoneNumber = StringUtility.EncodeHtml(userData.userPhoneNumber ? userData.userPhoneNumber : "");
          var userDesc = StringUtility.EncodeHtml(userData.userDesc ? userData.userDesc : "");
          var checkBoxId = "cbx_user_" + userId;
          var selectNumber = _this._prop.selectNumber;

          var userIsSelected = _this.TestUserIsSelected(userData);

          var $tr = $("<tr><td style=\"text-align: center\"><input type=\"checkbox\" id=\"".concat(checkBoxId, "\" /></td><td style=\"text-align: center\">").concat(userName, "</td><td style=\"text-align: center\">").concat(userPhoneNumber, "</td><td>").concat(userDesc, "</td></tr>"));
          $tr.bind("click", {
            "selfInstance": this,
            "userData": userData,
            "userId": userId,
            "userName": userName,
            "checkBoxId": checkBoxId,
            "selectNumber": selectNumber
          }, this.UserClickEvent);
          $tr.find("#" + checkBoxId).bind("click", {
            "selfInstance": this,
            "userData": userData,
            "userId": userId,
            "userName": userName,
            "checkBoxId": checkBoxId,
            "selectNumber": selectNumber
          }, this.UserClickEvent);

          if (userIsSelected) {
            $tr.find("#" + checkBoxId).prop("checked", true);
          }

          $userTable.find("tbody").append($tr);
        }

        this.userConfig.userWarpElemObj.append($userTable);
      } else {
        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {});
      }
    }, this);
  },
  SelectedOrganNode: function SelectedOrganNode(event, treeId, treeNode) {
    console.log(treeNode);
    this.BuildUserTable(treeNode.organId);
  },
  UnCheckAllUserExclude: function UnCheckAllUserExclude(checkBoxId) {
    this.userConfig.userWarpElemObj.find("input[type='checkbox'][id!='" + checkBoxId + "']").prop("checked", false);
  },
  ClearSelectedUser: function ClearSelectedUser() {
    this.selectedUser.data = [];
  },
  AddUserToSelectedData: function AddUserToSelectedData(selectNumber, userData) {
    if (selectNumber == "single") {
      this.ClearSelectedUser();
      this.selectedUser.data.push(userData);
    } else if (selectNumber == "multiple") {
      this.selectedUser.data.push(userData);
    }
  },
  DeleteUserToSelectedData: function DeleteUserToSelectedData(selectNumber, userData) {
    for (var i = 0; i < this.selectedUser.data.length; i++) {
      if (this.selectedUser.data[i].userId == userData.userId) {
        ArrayUtility.Delete(this.selectedUser.data, i);
      }
    }
  },
  TestUserIsSelected: function TestUserIsSelected(userData) {
    if (this.selectedUser.data.length > 0) {
      for (var i = 0; i < this.selectedUser.data.length; i++) {
        if (this.selectedUser.data[i].userId == userData.userId) {
          return true;
        }
      }
    }

    return false;
  },
  UserClickEvent: function UserClickEvent(sender) {
    var _this = sender.data.selfInstance;
    var userData = sender.data.userData;
    var userId = sender.data.userId;
    var userName = sender.data.userName;
    var checkBoxId = sender.data.checkBoxId;
    var selectNumber = sender.data.selectNumber;

    if (selectNumber == "single") {
      _this.UnCheckAllUserExclude(checkBoxId);
    }

    if (!$("#" + checkBoxId).prop("checked")) {
      $("#" + checkBoxId).prop("checked", true);

      _this.AddUserToSelectedData(selectNumber, userData);
    } else {
      $("#" + checkBoxId).prop("checked", false);

      _this.DeleteUserToSelectedData(selectNumber, userData);
    }

    if (_this.selectedUser.data.length == 1 && _this._prop.singleSelectAutoClose == "true") {
      _this.EnsureClickEvent();
    }

    sender.stopPropagation();
  },
  ClickEvent: function ClickEvent(sender) {
    var $button = sender.data.buttonElem;
    var _self = sender.data.selfInstance;
    _self._prop.buttonId = $button.attr("id");
    var windowWidth = 700;
    var windowHeight = 500;
    _self._prop.containerId = _self.BuildContentHTML(_self._prop.buttonId, _self._prop.defaultSelectedOrganId);
    DialogUtility.DialogElem(_self._prop.containerId, {
      width: windowWidth,
      height: windowHeight,
      title: _self._prop.windowCaption,
      modal: true
    }, 1, true);
  },
  BuildSelectedName: function BuildSelectedName() {
    var names = [];

    for (var i = 0; i < this.selectedUser.data.length; i++) {
      names.push(this.selectedUser.data[i].userName);
    }

    return names.join(this._prop.multipleSplit);
  },
  BuildSelectedValue: function BuildSelectedValue() {
    var values = [];

    for (var i = 0; i < this.selectedUser.data.length; i++) {
      values.push(this.selectedUser.data[i].userId);
    }

    return values.join(this._prop.multipleSplit);
  },
  EnsureClickEvent: function EnsureClickEvent() {
    var prop = this._prop;

    if (prop.settingType == "bingToControl") {
      if (prop.resultNameBindToControlId) {
        $("#" + prop.resultNameBindToControlId).val(this.BuildSelectedName());
      }

      if (prop.resultValueBindToControlId) {
        $("#" + prop.resultValueBindToControlId).val(this.BuildSelectedValue());
      }

      if (prop.resultNameBindToControlField) {}

      if (prop.resultValueBindToControlField) {}
    }

    this.BindResultTo(this.BuildSelectedValue(), this.BuildSelectedName());
    this.CloseClickEvent();
  },
  CloseClickEvent: function CloseClickEvent() {
    DialogUtility.CloseByElemId(this._prop.containerId);
  },
  ClearClickEvent: function ClearClickEvent() {
    this.ClearSelectedUser();
    this.UnCheckAllUserExclude("not");
    this.BindResultTo("", "");
    this.CloseClickEvent();
  },
  BindResultTo: function BindResultTo(value, name) {
    var prop = this._prop;

    if (prop.settingType == "bingToControl") {
      if (prop.resultNameBindToControlId) {
        $("#" + prop.resultNameBindToControlId).val(name);
      }

      if (prop.resultValueBindToControlId) {
        $("#" + prop.resultValueBindToControlId).val(value);
      }

      if (prop.resultNameBindToControlField) {}

      if (prop.resultValueBindToControlField) {}
    }
  }
};
"use strict";

var WFDCT_SimpleLabel = {
  RendererChain: HTMLControl.RendererChain,
  RendererDataChain: HTMLControl.RendererDataChain,
  GetValue: function GetValue($elem, originalData, paras) {
    originalData.value = $elem.text();
    return originalData;
  },
  SetValue: function SetValue($elem, fieldPO, relationFormRecordComplexPo, _rendererDataChainParas) {
    if (fieldPO) {
      var defformat = $elem.attr("defformat");

      if (defformat == "yyyy-MM-dd") {
        var ctValue = fieldPO.value;

        if (ctValue) {
          var ctDate = DateUtility.ConvertFromString(ctValue);
          ctValue = DateUtility.Format(ctDate, defformat);
        }

        $elem.text(ctValue);
        $elem.attr("control_value", ctValue);
        $elem.attr("control_source_value", fieldPO.value);
      } else {
        $elem.text(fieldPO.value);
        $elem.attr("control_value", fieldPO.value);
        $elem.attr("control_source_value", fieldPO.value);
      }
    }
  }
};
"use strict";

var WFDCT_SubFormListContainer = {
  _AddButtonElem: null,
  _$TemplateTableRow: null,
  _$SingleControlElem: null,
  _$TableElem: null,
  _$TableHeadElem: null,
  _$TableBodyElem: null,
  _EditInRow: true,
  _Display_OPButtons_Add: true,
  _Display_OPButtons_Update: true,
  _Display_OPButtons_Del: true,
  _Display_OPButtons_View: true,
  _FormRuntimeHost: null,
  _FormDataRelationList: null,
  RendererChain: function RendererChain(_rendererChainParas) {
    var $singleControlElem = _rendererChainParas.$singleControlElem;
    this._$SingleControlElem = $singleControlElem;
    this._$TableElem = this._$SingleControlElem.find("table");
    this._$TableBodyElem = this._$TableElem.find("tbody");
    this._$TableHeadElem = this._$TableElem.find("thead");
    this._EditInRow = $singleControlElem.attr("editinrow") == "false" ? false : true;
    this._FormRuntimeHost = _rendererChainParas.formRuntimeInstance;
    this._FormDataRelationList = this._FormRuntimeHost._FormDataRelationList;
    var opbuttons = $singleControlElem.attr("opbuttons");
    this._Display_OPButtons_Add = opbuttons.indexOf("add") >= 0;
    this._Display_OPButtons_Update = opbuttons.indexOf("update") >= 0;
    this._Display_OPButtons_Del = opbuttons.indexOf("delete") >= 0;
    this._Display_OPButtons_View = opbuttons.indexOf("view") >= 0;
    var sourceHTML = $singleControlElem.html();
    var sourceTable = $singleControlElem.find("table[is_template_table='true']");
    sourceTable.addClass("sub-form-list-table");
    $singleControlElem.html("");
    this._AddButtonElem = $("<div class='sflb-button sflb-add' title='新增'>新增</div>");

    if (this._Display_OPButtons_Add) {
      $singleControlElem.prepend("<div class='sub-form-list-button-wrap'></div>").find("div").append(this._AddButtonElem);
    }

    if (this._Display_OPButtons_Del || this._Display_OPButtons_Update || this._Display_OPButtons_View) {
      this._$TableHeadElem.find("tr").append("<th style='width: 120px'>操作</th>");
    }

    $singleControlElem.append(sourceTable);
    var instanceName = HTMLControl.GetControlInstanceNameByElem($singleControlElem);

    this._AddButtonElem.bind("click", {
      hostElem: $singleControlElem,
      _rendererChainParas: _rendererChainParas,
      selfObj: this,
      instanceName: instanceName
    }, this.AddEvent);

    this._$TemplateTableRow = $singleControlElem.find("table tbody tr").clone();
    $singleControlElem.find("table tbody tr").remove();
    var validateRendererChainEnable = this.ValidateRendererChainEnable();

    if (!validateRendererChainEnable.success) {
      DialogUtility.AlertText(validateRendererChainEnable.msg);
    }

    var relationPO = this.TryGetRelationPOClone();
    $singleControlElem.attr("relation_po_id", relationPO.id);
  },
  RendererDataChain: function RendererDataChain(_rendererDataChainParas) {
    var $singleControlElem = _rendererDataChainParas.$singleControlElem;
    var relationFormRecordComplexPo = _rendererDataChainParas.relationFormRecordComplexPo;
    var relation_po_id = $singleControlElem.attr("relation_po_id");
    var relationPO = FormRelationPOUtility.FindRelationPOInRelationFormRecordComplexPo(relationFormRecordComplexPo, relation_po_id);
    var listDataRecord = FormRelationPOUtility.Get1ToNDataRecord(relationPO);

    for (var i = 0; i < listDataRecord.length; i++) {
      var oneDataRecord = listDataRecord[i];

      if (this._EditInRow) {
        this.InnerRow_AddRowToContainer(oneDataRecord, relationPO.pkFieldName);
      } else {
        var childRelationPOArray = [];
        var subRelationPO = ArrayUtility.WhereSingle(relationFormRecordComplexPo.formRecordDataRelationPOList, function (item) {
          return item.parentId == relation_po_id;
        });
        var cloneSubRelationPO = ArrayUtility.WhereSingle(this._FormDataRelationList, function (item) {
          return item.parentId == relation_po_id;
        });

        if (subRelationPO) {
          var selfKeyFieldName = subRelationPO.selfKeyFieldName;
          var outerKeyFieldName = subRelationPO.outerKeyFieldName;
          var outerKeyFieldValue = FormRelationPOUtility.FindFieldValueInOneDataRecord(oneDataRecord, outerKeyFieldName);
          var tempPO = JsonUtility.CloneSimple(cloneSubRelationPO);
          var allRecordList = FormRelationPOUtility.Get1ToNDataRecord(subRelationPO);
          var thisPOListDataRecord = [];

          for (var j = 0; j < allRecordList.length; j++) {
            var oneRecord = allRecordList[j];
            var fieldPOArray = FormRelationPOUtility.FindRecordFieldPOArray(oneRecord);

            if (ArrayUtility.True(fieldPOArray, function (fieldItem) {
              return fieldItem.fieldName == selfKeyFieldName && fieldItem.value == outerKeyFieldValue;
            })) {
              thisPOListDataRecord.push(oneRecord);
            }
          }

          FormRelationPOUtility.Add1ToNDataRecord(tempPO, thisPOListDataRecord);
          childRelationPOArray.push(tempPO);
        }

        this.Dialog_AddRowToContainer(oneDataRecord, true, relationPO.pkFieldName);
      }
    }

    this.InnerRow_CompletedLastEdit();
  },
  SerializationValue: function SerializationValue(originalFormDataRelation, relationPO, control) {
    this.InnerRow_CompletedLastEdit();
    var allData = [];
    var all$TrAttrChildRelationPoArray = [];

    var trs = this._$SingleControlElem.find("tr[is_sub_list_tr='true']");

    var selfPO = this.TryGetRelationPOClone();

    for (var i = 0; i < trs.length; i++) {
      var $tr = $(trs[i]);
      var singleRelationPO = this.GetRowData($tr);
      var tempRecord = FormRelationPOUtility.Get1To1DataRecord(singleRelationPO);
      var idValue = FormRelationPOUtility.FindFieldPOInOneDataRecord(tempRecord, selfPO.pkFieldName).value;
      var tempSelfRecord = this.TryBuildRecord(singleRelationPO, idValue, tempRecord.recordFieldPOList);
      allData.push(tempSelfRecord);
    }

    console.log(allData);

    if (!this._EditInRow) {
      relationPO.isSave = false;
    }

    FormRelationPOUtility.Add1ToNDataRecord(relationPO, allData);
  },
  GetValue: function GetValue($elem, originalData, paras) {
    DialogUtility.AlertText("DynamicContainer类型的控件的序列化交由SerializationValue方法自行完成!");
  },
  SetValue: function SetValue($elem, relationFormRecordComplexPo, _rendererDataChainParas) {},
  ToViewStatus: function ToViewStatus($elem, relationFormRecordComplexPo, _rendererDataChainParas) {
    $elem.find(".sub-form-list-button-wrap").hide();
    $elem.find(".sflt-td-operation-update").hide();
    $elem.find(".sflt-td-operation-del").hide();
  },
  AddEvent: function AddEvent(sender) {
    var $hostElem = sender.data.hostElem;
    var selfObj = sender.data.selfObj;
    var instanceName = sender.data.instanceName;
    var rendererChainParas = sender.data._rendererChainParas;

    if (selfObj._EditInRow) {
      selfObj.InnerRow_AddRowToContainer(null, null);
    } else {
      selfObj.Dialog_ShowAddRowSubFormDialog(sender, $hostElem, rendererChainParas, instanceName);
    }
  },
  ValidateSerializationSubFormDataEnable: function ValidateSerializationSubFormDataEnable(serializationSubFormData) {
    return true;
  },
  ValidateRendererChainEnable: function ValidateRendererChainEnable() {
    return {
      success: true,
      msg: ""
    };
  },
  GetRowId: function GetRowId($tr) {
    var id = $tr.attr("tr_record_id");
    return id;
  },
  SetRowId: function SetRowId($tr, idValue) {
    $tr.attr("tr_record_id", idValue);
  },
  GetRowData: function GetRowData($tr) {
    var json = $tr.attr("tr_record_data");
    return JsonUtility.StringToJson(json);
  },
  GetChildRelationPOArray: function GetChildRelationPOArray($tr) {
    var json = $tr.attr("child_relation_po_array");

    if (!StringUtility.IsNullOrEmpty(json)) {
      return JsonUtility.StringToJson(json);
    }

    return null;
  },
  SaveDataToRowAttr: function SaveDataToRowAttr(relationPO, $tr, aboutRelationPOArray) {
    $tr.attr("is_sub_list_tr", "true");
    $tr.attr("tr_record_id", FormRelationPOUtility.FindFieldPOByRelationPO(relationPO, relationPO.pkFieldName).value);
    $tr.attr("tr_record_data", JsonUtility.JsonToString(relationPO));

    if (aboutRelationPOArray && aboutRelationPOArray.length > 0) {
      $tr.attr("child_relation_po_array", JsonUtility.JsonToString(aboutRelationPOArray));
    }
  },
  TryGetChildRelationPOArrayClone: function TryGetChildRelationPOArrayClone(relationPO) {
    var childRelation = ArrayUtility.Where(this._FormDataRelationList, function (item) {
      return item.parentId == relationPO.id;
    });
    return JsonUtility.CloneArraySimple(childRelation);
  },
  TryGetRelationPOClone: function TryGetRelationPOClone() {
    if (this._po) {
      return JsonUtility.CloneSimple(this._po);
    }

    var bindDataSource = this.TryGetBindDataSourceAttr();
    var po = null;

    if (bindDataSource == "autoTesting") {
      var bindTableName = this.TryGetInnerControlBindTableName();
      po = FormRelationPOUtility.FindRelationPOByTableName(this._FormDataRelationList, bindTableName);

      if (po == null) {
        var errMsg = "WFDCT_SubFormListContainer.TryGetRelationPO:通过内部控件绑定的表找不到具体的数据关联实体！";
        DialogUtility.AlertText(errMsg);
        throw errMsg;
      }
    } else {
      po = FormRelationPOUtility.FindRelationPOById(this._FormDataRelationList, bindDataSource);

      if (po == null) {
        var errMsg = "WFDCT_SubFormListContainer.TryGetRelationPO:通过ID" + bindDataSource + "找不到具体的数据关联实体！";
        DialogUtility.AlertText(errMsg);
        throw errMsg;
      }
    }

    this._po = po;
    return JsonUtility.CloneSimple(this._po);
  },
  TryGetInnerControlBindTableName: function TryGetInnerControlBindTableName() {
    var controls = HTMLControl.FindALLControls(this._$TemplateTableRow);
    var tableName = null;
    controls.each(function () {
      if (!tableName) {
        tableName = HTMLControl.GetControlBindTableName($(this));
      } else {
        if (tableName != HTMLControl.GetControlBindTableName($(this))) {
          DialogUtility.AlertText("子表区域中的控件绑定了多个表!");
        }
      }
    });
    return tableName;
  },
  TryGetBindDataSourceAttr: function TryGetBindDataSourceAttr() {
    return this._$SingleControlElem.attr("binddatasource");
  },
  TryBuildRecord: function TryBuildRecord(relationPO, recordId, fieldPOArray) {
    var outerFieldName = relationPO.outerKeyFieldName;
    var selfKeyFieldName = relationPO.selfKeyFieldName;
    var outerFieldValue = "";
    var parentRelationPO = ArrayUtility.WhereSingle(this._FormDataRelationList, function (item) {
      return item.id == relationPO.parentId;
    });

    if (StringUtility.IsNullOrEmpty(outerFieldName)) {
      var errorMessage = "数据源未设置外键关联字段!";
      DialogUtility.AlertText(errorMessage);
      throw errorMessage;
    }

    if (StringUtility.IsNullOrEmpty(selfKeyFieldName)) {
      var errorMessage = "数据源未设置本身关联字段!";
      DialogUtility.AlertText(errorMessage);
      throw errorMessage;
    }

    if (FormRelationPOUtility.IsMainRelationPO(parentRelationPO)) {
      outerFieldValue = this._FormRuntimeHost.GetRecordId();
    } else {
      var tableId = parentRelationPO.tableId;
      var fieldValue = HTMLControl.GetSimpleControlValue(tableId, outerFieldName);

      if (StringUtility.IsNullOrEmpty(fieldValue)) {
        var errorMessage = "找不到绑定了表:" + tableId + ",字段:" + outerFieldName + "的控件,请确认页面放置了该控件,并存在值!";
        DialogUtility.AlertText(errorMessage);
        throw errorMessage;
      }
    }

    return FormRelationPOUtility.BuildRecord(fieldPOArray, "", recordId, outerFieldName, outerFieldValue, selfKeyFieldName);
  },
  _$LastEditRow: null,
  InnerRow_AddRowToContainer: function InnerRow_AddRowToContainer(oneDataRecord, subTablePKFieldName) {
    this.InnerRow_CompletedLastEdit();

    var $tr = this._$TemplateTableRow.clone();

    var lastOperationTd = $("<td><div class='sflt-td-operation-outer-wrap'></div></td>");
    var lastOperationOuterDiv = lastOperationTd.find("div");
    var btn_operation_del = $("<div title='删除' class='sflt-td-operation-del'></div>");
    btn_operation_del.bind("click", {
      selfObj: this
    }, function (btn_del_sender) {
      var selfObj = btn_del_sender.data.selfObj;
      selfObj.InnerRow_Delete($(this).parent().parent().parent());
    });
    lastOperationOuterDiv.append(btn_operation_del);
    var btn_operation_update = $("<div title='编辑' class='sflt-td-operation-update'></div>");
    btn_operation_update.bind("click", {
      selfObj: this
    }, function (btn_update_sender) {
      var selfObj = btn_update_sender.data.selfObj;
      selfObj.InnerRow_ToEditStatus($(this).parent().parent().parent());
    });
    lastOperationOuterDiv.append(btn_operation_update);
    $tr.append(lastOperationTd);

    this._$TableBodyElem.append($tr);

    this._$LastEditRow = $tr;
    var controls = HTMLControl.FindALLControls(this._$LastEditRow);

    for (var i = 0; i < controls.length; i++) {
      var control = $(controls[i]);
      var controlInstance = HTMLControl.GetControlInstanceByElem(control);
      var fieldName = HTMLControl.GetControlBindFieldName(control);
      controlInstance.RendererChain({
        $singleControlElem: control
      });
    }

    if (oneDataRecord) {
      var controls = HTMLControl.FindALLControls(this._$LastEditRow);

      for (var i = 0; i < controls.length; i++) {
        var control = $(controls[i]);
        var controlInstance = HTMLControl.GetControlInstanceByElem(control);
        var fieldName = HTMLControl.GetControlBindFieldName(control);
        var fieldPO = FormRelationPOUtility.FindFieldPOInOneDataRecordEnableNull(oneDataRecord, fieldName);
        controlInstance.SetValue(control, fieldPO, null, null);
      }

      var idValue = FormRelationPOUtility.FindFieldPOInOneDataRecord(oneDataRecord, subTablePKFieldName).value;
      this.SetRowId($tr, idValue);
    }
  },
  InnerRow_ToEditStatus: function InnerRow_ToEditStatus($tr) {
    this.InnerRow_CompletedLastEdit();
    var rowRelationPO = this.GetRowData($tr);
    var rowSpanControls = $tr.find("[is_inner_row_span='true']");

    for (var i = 0; i < rowSpanControls.length; i++) {
      var spanControl = $(rowSpanControls[i]);
      var controlId = spanControl.attr("edit_control_id");

      var editControl = this._$TemplateTableRow.find("#" + controlId).clone();

      var fieldName = HTMLControl.GetControlBindFieldName(editControl);
      var fieldPO = FormRelationPOUtility.FindFieldPOByRelationPO(rowRelationPO, fieldName);
      var editControlInstance = HTMLControl.GetControlInstanceByElem(editControl);
      editControlInstance.SetValue(editControl, fieldPO, {});
      spanControl.parent().append(editControl);
      spanControl.remove();
    }

    this._$LastEditRow = $tr;
  },
  InnerRow_ToViewStatus: function InnerRow_ToViewStatus(relationPO, $tr) {
    if (this._$LastEditRow) {
      var controls = HTMLControl.FindALLControls(this._$LastEditRow);

      for (var i = 0; i < controls.length; i++) {
        var singleControl = $(controls[i]);
        var fieldName = HTMLControl.GetControlBindFieldName(singleControl);
        var fieldValue = FormRelationPOUtility.FindFieldPOByRelationPO(relationPO, fieldName).value;
        var txtSpan = $("<span is_inner_row_span='true' edit_control_id='" + singleControl.attr("id") + "'>" + fieldValue + "</span>");
        singleControl.before(txtSpan);
        singleControl.remove();
      }
    }

    this._$LastEditRow = null;
  },
  InnerRow_Delete: function InnerRow_Delete($tr) {
    this.InnerRow_CompletedLastEdit();
    console.log(this._FormRuntimeHost);

    if (this._FormRuntimeHost._Prop_Config.OperationType == BaseUtility.GetAddOperationName()) {
      $tr.remove();
      return;
    } else {
      DialogUtility.Confirm(window, "确认删除当前记录?", function () {
        var rowRelationPO = this.GetRowData($tr);
        console.log(rowRelationPO);
        var thisRecordId = rowRelationPO.oneDataRecord.recordId;
        var thisTableId = rowRelationPO.tableId;
        RuntimeGeneralInstance.DeleteTableRecord(thisTableId, thisRecordId, function (result) {
          $tr.remove();
        }, this);
      }, this);
    }
  },
  InnerRow_CompletedLastEdit: function InnerRow_CompletedLastEdit() {
    if (this._$LastEditRow) {
      var controls = HTMLControl.FindALLControls(this._$LastEditRow);
      var relationPO = this.TryGetRelationPOClone();
      var recordFieldPOList = [];

      for (var i = 0; i < controls.length; i++) {
        var singleControl = $(controls[i]);
        var fieldTransferPO = HTMLControl.TryGetFieldTransferPO(singleControl, relationPO.id, relationPO.singleName, relationPO.relationType);
        recordFieldPOList.push(fieldTransferPO);
      }

      var idValue = this.GetRowId(this._$LastEditRow);

      if (!idValue) {
        idValue = StringUtility.Guid();
      }

      FormRelationPOUtility.CreateIdFieldInRecordFieldPOArray(recordFieldPOList, idValue, this._FormRuntimeHost._FormPO, relationPO.tableId);
      var tempRecord = this.TryBuildRecord(relationPO, idValue, recordFieldPOList);
      relationPO = FormRelationPOUtility.Add1To1DataRecordFieldPOList(relationPO, recordFieldPOList, "", tempRecord.recordId, tempRecord.outerFieldName, tempRecord.outerFieldValue, tempRecord.selfFieldName);
      this.SaveDataToRowAttr(relationPO, this._$LastEditRow);
      this.InnerRow_ToViewStatus(relationPO, this._$LastEditRow);
    }
  },
  Dialog_Get_Button_Click_Para: function Dialog_Get_Button_Click_Para($singleControlElem) {
    var relationPO = this.TryGetRelationPOClone();
    console.log("子表外键:" + relationPO.outerKeyFieldName);
    var para = {
      formId: $singleControlElem.attr("formid"),
      buttonId: "",
      elemId: "",
      recordId: "",
      windowHeight: $singleControlElem.attr("windowheight"),
      windowWidth: $singleControlElem.attr("windowwidth"),
      instanceName: $singleControlElem.attr("client_instance_name"),
      dialogWindowTitle: $singleControlElem.attr("dialogwindowtitle"),
      parentRecordId: this._FormRuntimeHost.GetRecordId(),
      selfKeyFieldName: relationPO.selfKeyFieldName,
      outerKeyFieldName: relationPO.outerKeyFieldName
    };
    return para;
  },
  Dialog_AddRow_AddViewButton: function Dialog_AddRow_AddViewButton(operationOuterDiv, $tr, idValue, oneDataRecord, $singleControlElem, isPreview) {
    var btn_operation_view = $("<div title='查看' class='sflt-td-operation-view'></div>");
    var dialogWindowPara = this.Dialog_Get_Button_Click_Para($singleControlElem);
    btn_operation_view.bind("click", {
      "$tr": $tr,
      "idValue": idValue,
      "oneDataRecord": oneDataRecord,
      "dialogWindowPara": dialogWindowPara,
      "isPreview": isPreview
    }, function (sender) {
      var dialogWindowPara = sender.data.dialogWindowPara;
      dialogWindowPara.OperationType = "view";
      dialogWindowPara.recordId = sender.data.idValue;
      var url;

      if (isPreview) {
        url = BaseUtility.BuildView("/HTML/Builder/Form/SubFormPreview.html", dialogWindowPara);
      } else {
        url = BaseUtility.BuildView("/HTML/Builder/Runtime/WebFormSubRuntime.html", dialogWindowPara);
      }

      DialogUtility.OpenIframeWindow(window, DialogUtility.DialogId, url, {
        title: dialogWindowPara.dialogWindowTitle,
        width: dialogWindowPara.windowWidth,
        height: dialogWindowPara.windowHeight
      }, 1);
    });
    operationOuterDiv.append(btn_operation_view);
  },
  Dialog_AddRow_AddUpdateButton: function Dialog_AddRow_AddUpdateButton(operationOuterDiv, $tr, idValue, oneDataRecord, $singleControlElem, isPreview) {
    var btn_operation_view = $("<div title='编辑' class='sflt-td-operation-update'></div>");
    var dialogWindowPara = this.Dialog_Get_Button_Click_Para($singleControlElem);
    btn_operation_view.bind("click", {
      "$tr": $tr,
      "idValue": idValue,
      "oneDataRecord": oneDataRecord,
      "dialogWindowPara": dialogWindowPara,
      "isPreview": isPreview
    }, function (sender) {
      var dialogWindowPara = sender.data.dialogWindowPara;
      dialogWindowPara.operationType = "update";
      dialogWindowPara.recordId = sender.data.idValue;
      var url;

      if (isPreview) {
        url = BaseUtility.BuildView("/HTML/Builder/Form/SubFormPreview.html", dialogWindowPara);
      } else {
        url = BaseUtility.BuildView("/HTML/Builder/Runtime/WebFormSubRuntime.html", dialogWindowPara);
      }

      DialogUtility.OpenIframeWindow(window, DialogUtility.DialogId, url, {
        title: dialogWindowPara.dialogWindowTitle,
        width: dialogWindowPara.windowWidth,
        height: dialogWindowPara.windowHeight
      }, 1);
    });
    operationOuterDiv.append(btn_operation_view);
  },
  Dialog_AddRow_AddDeleteButton: function Dialog_AddRow_AddDeleteButton(operationOuterDiv, $tr, idValue, oneDataRecord, $singleControlElem, isPreview) {
    var btn_operation_view = $("<div title='删除' class='sflt-td-operation-del'></div>");
    btn_operation_view.bind("click", {
      "$tr": $tr,
      "idValue": idValue,
      "oneDataRecord": oneDataRecord,
      "isPreview": isPreview
    }, function (sender) {
      sender.data.$tr.remove();
    });
    operationOuterDiv.append(btn_operation_view);
  },
  Dialog_ShowAddRowSubFormDialog: function Dialog_ShowAddRowSubFormDialog(sender, $singleControlElem, _rendererChainParas, instanceName) {
    var dialogWindowPara = this.Dialog_Get_Button_Click_Para($singleControlElem);

    if (!dialogWindowPara.dialogWindowTitle) {
      dialogWindowPara.dialogWindowTitle = "应用构建系统";
    }

    dialogWindowPara.operationType = "add";
    dialogWindowPara.recordId = StringUtility.Guid();

    var isPreview = this._FormRuntimeHost.IsPreview();

    var url;

    if (isPreview) {
      url = BaseUtility.BuildView("/HTML/Builder/Form/SubFormPreview.html", dialogWindowPara);
    } else {
      url = BaseUtility.BuildView("/HTML/Builder/Runtime/WebFormSubRuntime.html", dialogWindowPara);
    }

    DialogUtility.OpenIframeWindow(window, DialogUtility.DialogId, url, {
      title: dialogWindowPara.dialogWindowTitle,
      width: dialogWindowPara.windowWidth,
      height: dialogWindowPara.windowHeight
    }, 1);
  },
  Dialog_SubFormDialogCompletedEdit: function Dialog_SubFormDialogCompletedEdit(instanceName, operationType, serializationSubFormData) {
    var thisInstance = HTMLControl.GetInstance(instanceName);
    (function (operationType, serializationSubFormData) {
      var subFormMainRelationPO = FormRelationPOUtility.FindMainRelationPO(serializationSubFormData.formRecordDataRelationPOList);
      var oneDataRecord = FormRelationPOUtility.Get1To1DataRecord(subFormMainRelationPO);
      this.Dialog_AddRowToContainer(oneDataRecord, false, subFormMainRelationPO.pkFieldName);
    }).call(thisInstance, operationType, serializationSubFormData);
  },
  Dialog_AddRowToContainer: function Dialog_AddRowToContainer(oneDataRecord, dataIsFromServer, subTablePKFieldName) {
    if (oneDataRecord) {
      var $tr = this._$TemplateTableRow.clone();

      var controls = HTMLControl.FindALLControls($tr);

      for (var i = 0; i < controls.length; i++) {
        var control = $(controls[i]);
        var controlInstance = HTMLControl.GetControlInstanceByElem(control);
        var fieldName = HTMLControl.GetControlBindFieldName(control);
        var fieldPO = FormRelationPOUtility.FindFieldPOInOneDataRecord(oneDataRecord, fieldName);
        controlInstance.SetValue(control, fieldPO, null, null);
      }

      console.log(subTablePKFieldName);
      var idFieldPO = FormRelationPOUtility.FindFieldPOInOneDataRecord(oneDataRecord, subTablePKFieldName);
      var lastOperationTd = $("<td><div class='sflt-td-operation-outer-wrap'></div></td>");
      var lastOperationOuterDiv = lastOperationTd.find("div");

      if (dataIsFromServer) {
        if (this._Display_OPButtons_View) {
          this.Dialog_AddRow_AddViewButton(lastOperationOuterDiv, $tr, idFieldPO.value, oneDataRecord, this._$SingleControlElem, this._FormRuntimeHost.IsPreview());
        }

        if (this._Display_OPButtons_Update) {
          this.Dialog_AddRow_AddUpdateButton(lastOperationOuterDiv, $tr, idFieldPO.value, oneDataRecord, this._$SingleControlElem, this._FormRuntimeHost.IsPreview());
        }

        if (this._Display_OPButtons_Del) {
          this.Dialog_AddRow_AddDeleteButton(lastOperationOuterDiv, $tr, idFieldPO.value, oneDataRecord, this._$SingleControlElem, this._FormRuntimeHost.IsPreview());
        }
      } else {
        this.Dialog_AddRow_AddViewButton(lastOperationOuterDiv, $tr, idFieldPO.value, oneDataRecord, this._$SingleControlElem, this._FormRuntimeHost.IsPreview());
        this.Dialog_AddRow_AddUpdateButton(lastOperationOuterDiv, $tr, idFieldPO.value, oneDataRecord, this._$SingleControlElem, this._FormRuntimeHost.IsPreview());
        this.Dialog_AddRow_AddDeleteButton(lastOperationOuterDiv, $tr, idFieldPO.value, oneDataRecord, this._$SingleControlElem, this._FormRuntimeHost.IsPreview());
      }

      $tr.append(lastOperationTd);
      var idValue = idFieldPO.value;

      var $oldTrElem = this._$SingleControlElem.find("tr[tr_record_id='" + idValue + "']");

      if ($oldTrElem.length == 0) {
        this._$TableBodyElem.append($tr);
      } else {
        $oldTrElem.after($tr);
        $oldTrElem.remove();
      }

      var relationPO = this.TryGetRelationPOClone();
      relationPO = FormRelationPOUtility.Add1To1DataRecord(relationPO, oneDataRecord);
      this.SaveDataToRowAttr(relationPO, $tr);
    }
  }
};
"use strict";

var WFDCT_TabContainer = {
  RendererChain: function RendererChain(_rendererChainParas) {
    try {
      var $tabber = _rendererChainParas.$singleControlElem;
      $tabber.hide();
      var $labers = $tabber.children("[tab_id]");
      var $ul = $("<ul></ul>");

      for (var j = 0; j < $labers.length; j++) {
        var $laber = $($labers[j]);
        $ul.append("<li><a href='#" + $laber.attr("tab_id") + "'>" + $laber.text() + "</a><li>");
      }

      $labers.remove();
      $tabber.prepend($ul);
      $("#" + $tabber.attr("id")).tabs({
        activate: function activate(event, ui) {
          var newTabOnActivity = ui.newPanel.attr("onActivity");

          if (newTabOnActivity) {
            eval(newTabOnActivity + "(event,ui)");
          }

          console.log(ui);
          console.log(event);
        }
      });
      $tabber.show();
    } catch (e) {
      throw "WFDCT_TabContainer.RendererChain:" + e;
    }

    HTMLControl.RendererChain(_rendererChainParas);
  },
  RendererDataChain: HTMLControl.RendererDataChain,
  GetValue: HTMLControl.GetValue,
  SetValue: HTMLControl.SetValue
};
"use strict";

var WFDCT_TextArea = {
  RendererChain: function RendererChain(_rendererChainParas) {},
  RendererDataChain: function RendererDataChain() {},
  GetValue: HTMLControl.GetValue,
  SetValue: HTMLControl.SetValue,
  ToViewStatus: HTMLControl.ToViewStatus
};
"use strict";

var WFDCT_TextBox = {
  InitStyle: HTMLControl.InitStyle,
  RendererChain: function RendererChain(_rendererChainParas) {
    var $singleControlElem = _rendererChainParas.$singleControlElem;
    $singleControlElem.attr("autocomplete", "off");
  },
  RendererDataChain: function RendererDataChain() {},
  GetValue: HTMLControl.GetValue,
  SetValue: HTMLControl.SetValue,
  ToViewStatus: HTMLControl.ToViewStatus,
  TryBindUrlValue: HTMLControl.TryBindUrlValue
};
"use strict";

var WFDCT_TextDateTime = {
  InitStyle: HTMLControl.InitStyle,
  RendererChain: function RendererChain(_rendererChainParas) {
    var $singleControlElem = _rendererChainParas.$singleControlElem;
    $singleControlElem.attr("autocomplete", "off");
  },
  RendererDataChain: HTMLControl.RendererDataChain,
  GetValue: HTMLControl.GetValue,
  SetValue: function SetValue($elem, fieldPO, relationFormRecordComplexPo, _rendererDataChainParas) {
    if (fieldPO) {
      var ctValue = fieldPO.value;
      var ctDate = DateUtility.ConvertFromString(ctValue);
      ctValue = DateUtility.Format(ctDate, $elem.attr("datetimeformat"));
      $elem.val(ctValue);
      $elem.attr("control_value", ctValue);
      $elem.attr("control_time_value", fieldPO.value);
    }
  },
  ToViewStatus: HTMLControl.ToViewStatus
};
"use strict";

var WLDCT_DeleteButton = {
  _ListTableContainerInstance: null,
  RendererChain: HTMLControl.RendererChain,
  ResolveSelf: function ResolveSelf(_rendererChainParas) {
    var $singleControlElem = _rendererChainParas.$singleControlElem;
    var caption = $singleControlElem.attr("buttoncaption");
    var $button = $("<button class='wldct-list-button'>" + caption + "</button>");
    var attributes = $singleControlElem.prop("attributes");
    $.each(attributes, function () {
      $button.attr(this.name, this.value);
    });
    $button.bind("click", {
      "buttonElem": $button,
      "selfInstance": this
    }, this.ClickEvent);
    var isshow = $button.attr("isshow");

    if (isshow == "false") {
      $button.hide();
    }

    return $button;
  },
  RendererDataChain: function RendererDataChain(_rendererDataChainParas) {
    var $singleControlElem = _rendererDataChainParas.$singleControlElem;
    var $WLDCT_ListButtonContainer = $singleControlElem.parents("[singlename='WLDCT_ListButtonContainer']");
    var $WLDCT_ListTableContainerElem = $WLDCT_ListButtonContainer.nextAll("[client_resolve='WLDCT_ListTableContainer']");
    this._ListTableContainerInstance = HTMLControl.GetControlInstanceByElem($WLDCT_ListTableContainerElem);
  },
  ClickEvent: function ClickEvent(sender) {
    var $button = sender.data.buttonElem;
    var _self = sender.data.selfInstance;
    var bindauthority = $button.attr("bindauthority");
    var buttoncaption = $button.attr("buttoncaption");
    var buttontype = $button.attr("buttontype");
    var custclientclickbeforemethod = $button.attr("custclientclickbeforemethod");
    var custclientclickbeforemethodpara = $button.attr("custclientclickbeforemethodpara");
    var custclientrendereraftermethodpara = $button.attr("custclientrendereraftermethodpara");
    var custclientrendereraftermethodparapara = $button.attr("custclientrendereraftermethodparapara");
    var custclientrenderermethod = $button.attr("custclientrenderermethod");
    var custclientrenderermethodpara = $button.attr("custclientrenderermethodpara");
    var custserverresolvemethod = $button.attr("custserverresolvemethod");
    var custserverresolvemethodpara = $button.attr("custserverresolvemethodpara");
    var elemid = $button.attr("id");
    var buttonid = $button.attr("buttonid");
    var opentype = $button.attr("opentype");
    var operation = $button.attr("operation");
    var singlename = $button.attr("singlename");
    var windowcaption = $button.attr("windowcaption");
    var client_resolve = $button.attr("client_resolve");
    var isConfirm = $button.attr("isconfirm");
    var deleteTableAt = $button.attr("deletetableat");
    var deleteType = $button.attr("deletetype");
    var confirmField = $button.attr("confirmfield");
    var confirmFormat = $button.attr("confirmformat");
    var bindDataSetId = $button.attr("binddatasetid");
    var recordId = "";

    if (operation == "delete") {
      var checkedRecordObjs = _self._ListTableContainerInstance.GetCheckedRecord();

      if (checkedRecordObjs.length == 0) {
        DialogUtility.AlertText("请选择需要进行操作的记录!");
        return;
      } else if (checkedRecordObjs.length > 1) {
        DialogUtility.AlertText("一次只能操作一条记录!");
        return;
      } else {
        recordId = checkedRecordObjs[0].Id;
      }
    }

    if (StringUtility.toUpperCase(isConfirm) == "TRUE") {
      DialogUtility.Confirm(window, "您确认要删除吗?", function () {
        RuntimeGeneralInstance.DeleteDataSetRecord(elemid, bindDataSetId, recordId, this);
      }, this);
    }
  }
};
"use strict";

var WLDCT_FormButton = {
  _ListTableContainerInstance: null,
  RendererChain: HTMLControl.RendererChain,
  ResolveSelf: function ResolveSelf(_rendererChainParas) {
    var $singleControlElem = _rendererChainParas.$singleControlElem;
    var caption = $singleControlElem.attr("buttoncaption");
    var $button = $("<button class='wldct-list-button'>" + caption + "</button>");
    var attributes = $singleControlElem.prop("attributes");
    $.each(attributes, function () {
      $button.attr(this.name, this.value);
    });
    $button.bind("click", {
      "buttonElem": $button,
      "selfInstance": this
    }, this.ClickEvent);
    var isshow = $button.attr("isshow");

    if (isshow == "false") {
      $button.hide();
    }

    return $button;
  },
  RendererDataChain: function RendererDataChain(_rendererDataChainParas) {
    var $singleControlElem = _rendererDataChainParas.$singleControlElem;
    var $WLDCT_ListButtonContainer = $singleControlElem.parents("[singlename='WLDCT_ListButtonContainer']");
    var $WLDCT_ListTableContainerElem = $WLDCT_ListButtonContainer.nextAll("[client_resolve='WLDCT_ListTableContainer']");
    this._ListTableContainerInstance = HTMLControl.GetControlInstanceByElem($WLDCT_ListTableContainerElem);
  },
  ClickEvent: function ClickEvent(sender) {
    var $button = sender.data.buttonElem;
    var _self = sender.data.selfInstance;
    var bindauthority = $button.attr("bindauthority");
    var buttoncaption = $button.attr("buttoncaption");
    var buttontype = $button.attr("buttontype");
    var custclientclickbeforemethod = $button.attr("custclientclickbeforemethod");
    var custclientclickbeforemethodpara = $button.attr("custclientclickbeforemethodpara");
    var custclientrendereraftermethodpara = $button.attr("custclientrendereraftermethodpara");
    var custclientrendereraftermethodparapara = $button.attr("custclientrendereraftermethodparapara");
    var custclientrenderermethod = $button.attr("custclientrenderermethod");
    var custclientrenderermethodpara = $button.attr("custclientrenderermethodpara");
    var custserverresolvemethod = $button.attr("custserverresolvemethod");
    var custserverresolvemethodpara = $button.attr("custserverresolvemethodpara");
    var formcode = $button.attr("formcode");
    var formid = $button.attr("formid");
    var formmoduleid = $button.attr("formmoduleid");
    var formmodulename = $button.attr("formmodulename");
    var formname = $button.attr("formname");
    var elemid = $button.attr("id");
    var buttonid = $button.attr("buttonid");
    var innerbuttonjsonstring = $button.attr("innerbuttonjsonstring");
    var opentype = $button.attr("opentype");
    var operation = $button.attr("operation");
    var singlename = $button.attr("singlename");
    var windowcaption = $button.attr("windowcaption");
    var windowheight = $button.attr("windowheight");
    var windowwidth = $button.attr("windowwidth");
    var client_resolve = $button.attr("client_resolve");
    var recordId = "";

    if (operation == "update" || operation == "view") {
      var checkedRecordObjs = _self._ListTableContainerInstance.GetCheckedRecord();

      if (checkedRecordObjs.length == 0) {
        DialogUtility.AlertText("请选择需要进行操作的记录!");
        return;
      } else if (checkedRecordObjs.length > 1) {
        DialogUtility.AlertText("一次只能操作一条记录!");
        return;
      } else {
        recordId = checkedRecordObjs[0].Id;
      }
    }

    var paraStr = BaseUtility.GetUrlParaValue("menuRightUrlPara");
    DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, BaseUtility.BuildView("/JB4DCBuilderClient/HTML/Builder/Runtime/WebFormRuntime.html", {
      "formId": formid,
      "buttonId": buttonid,
      "listFormButtonElemId": elemid,
      "recordId": recordId,
      "operationType": operation,
      "windowWidth": windowwidth,
      "windowHeight": windowheight,
      "menuRightUrlPara": paraStr
    }), {
      "width": windowwidth,
      "height": windowheight,
      "title": windowcaption
    }, 1, true);
  }
};
"use strict";

var WLDCT_ListButtonContainer = {
  _objectType: "Instance",
  _prop: {
    $singleControlElem: null,
    instanceName: null,
    elemId: null,
    status: null
  },
  RendererChain: function RendererChain(_rendererChainParas) {
    var $singleControlElem = _rendererChainParas.$singleControlElem;
    var $buttonDivElemList = $singleControlElem.find("div" + HTMLControlAttrs.SELECTED_JBUILD4DC_CUSTOM);
    $singleControlElem.find("[is-op-button-wrap-table='true']").hide();
    var innerWrap = $singleControlElem.find(".wldct-list-button-inner-wrap");
    var innerInsideWrapDiv = $("<div class='wldct-list-button-inner-inside-wrap' />");

    for (var i = 0; i < $buttonDivElemList.length; i++) {
      var $buttonElem = $($buttonDivElemList[i]);
      var clientResolveName = $buttonElem.attr(HTMLControlAttrs.CLIENT_RESOLVE);
      var clientResolveObject = Object.create(eval(clientResolveName));
      var $resolvedElem = clientResolveObject.ResolveSelf({
        sourceHTML: _rendererChainParas.sourceHTML,
        $rootElem: _rendererChainParas.$rootElem,
        $parentControlElem: $singleControlElem,
        $singleControlElem: $buttonElem,
        allData: _rendererChainParas.allData
      });
      innerInsideWrapDiv.append($resolvedElem);
    }

    innerWrap.append(innerInsideWrapDiv);
    innerWrap.append("<div style=\"clear: both;\"></div>");

    if (this._prop.status == "disable" || RuntimeGeneralInstance.TryGetUrlParaViewOnly()) {
      $singleControlElem.hide();
    }
  },
  RendererDataChain: HTMLControl.RendererDataChain
};
"use strict";

var WLDCT_ListComplexSearchContainer = {
  _objectType: "Instance",
  _prop: {
    $singleControlElem: null,
    instanceName: null,
    elemId: null,
    status: null
  },
  _$SingleControlElem: null,
  _$ComplexSearchButton: null,
  _$ClearButton: null,
  _$CloseButton: null,
  RendererChain: function RendererChain(_rendererChainParas) {
    var $singleControlElem = _rendererChainParas.$singleControlElem;
    this._$SingleControlElem = $singleControlElem;
    $singleControlElem.hide();
    $singleControlElem.find(".wldct-list-complex-search-inner-wrap").height("305px");
    $singleControlElem.find(".wldct-list-complex-search-inner-wrap").css("overflow", "auto");
    $singleControlElem.find(".wldct-list-complex-search-inner-wrap").addClass("div-custom-scroll");
    var $searchButtonsWrap = $("<div class='wldct-list-complex-search-button-inner-wrap'><div class='button-inner-wrap'></div></div>");
    this._$ComplexSearchButton = $("<button>查询</button>");
    this._$ClearButton = $("<button>清空</button>");
    this._$CloseButton = $("<button>关闭</button>");
    $searchButtonsWrap.find(".button-inner-wrap").append(this._$ComplexSearchButton).append(this._$ClearButton).append(this._$CloseButton);
    $singleControlElem.append($searchButtonsWrap);
  },
  RendererDataChain: HTMLControl.RendererDataChain,
  BuilderSearchCondition: function BuilderSearchCondition() {
    var result = [];

    var allControls = this._$SingleControlElem.find(HTMLControlAttrs.SELECTED_JBUILD4DC_CUSTOM);

    for (var i = 0; i < allControls.length; i++) {
      var $elem = $(allControls[i]);
      var instance = HTMLControl.GetControlInstanceByElem($elem);
      var valObj = instance.GetValue($elem, {});
      var value = valObj.value;

      if (value) {
        result.push({
          operator: $elem.attr("columnoperator"),
          value: value,
          tableName: $elem.attr("columntablename"),
          fieldName: $elem.attr("columnname")
        });
      }
    }

    return result;
  },
  GetStatus: function GetStatus() {
    var status = this._$SingleControlElem.attr("status");

    if (status == "") {
      status = "enable";
    }

    return status;
  },
  Hide: function Hide() {
    this._$SingleControlElem.hide();
  }
};
"use strict";

var WLDCT_ListSimpleSearchContainer = {
  _objectType: "Instance",
  _prop: {
    $singleControlElem: null,
    instanceName: null,
    elemId: null,
    status: null
  },
  _$SimpleSearchButton: null,
  _$ShowComplexSearchButton: null,
  _$SingleControlElem: null,
  RendererChain: function RendererChain(_rendererChainParas) {
    var $singleControlElem = _rendererChainParas.$singleControlElem;
    this._$SingleControlElem = $singleControlElem;
    var pageWidth = PageStyleUtility.GetPageWidth();
    var buttonWrapWidth = 200;
    $singleControlElem.find("table:first").width(pageWidth - buttonWrapWidth);
    var $searchButtonsWrap = $("<div class='wldct-list-simple-search-button-inner-wrap' />");
    $searchButtonsWrap.width(buttonWrapWidth - 40);
    this._$SimpleSearchButton = $("<button>查询</button>");
    this._$ShowComplexSearchButton = $("<button>高级查询</button>");
    $searchButtonsWrap.append(this._$SimpleSearchButton);
    $searchButtonsWrap.append(this._$ShowComplexSearchButton);
    $singleControlElem.append($searchButtonsWrap);
    HTMLControl.RendererChain(_rendererChainParas);
  },
  RendererDataChain: HTMLControl.RendererDataChain,
  BuilderSearchCondition: function BuilderSearchCondition() {
    var result = [];

    var allControls = this._$SingleControlElem.find(HTMLControlAttrs.SELECTED_JBUILD4DC_CUSTOM);

    var hidControls = this._$SingleControlElem.parent().find("[singlename='WLDCT_HideContainer']").find("[columnname][columnoperator]");

    $.merge(allControls, hidControls);

    for (var i = 0; i < allControls.length; i++) {
      var $elem = $(allControls[i]);
      var instance = HTMLControl.GetControlInstanceByElem($elem);
      var valObj = instance.GetValue($elem, {});
      var value = valObj.value;

      if (value) {
        value = StringUtility.Trim(value);

        if (value) {
          result.push({
            operator: $elem.attr("columnoperator"),
            value: value,
            tableName: $elem.attr("columntablename"),
            fieldName: $elem.attr("columnname")
          });
        }
      }
    }

    return result;
  },
  GetStatus: function GetStatus() {
    var status = this._$SingleControlElem.attr("status");

    if (status == "") {
      status = "enable";
    }

    return status;
  },
  Hide: function Hide() {
    this._$SingleControlElem.hide();
  },
  HideComplexButton: function HideComplexButton() {
    this._$ShowComplexSearchButton.remove();

    this._$SimpleSearchButton.parent().width("80px");

    var pageWidth = PageStyleUtility.GetPageWidth();

    this._$SingleControlElem.find("table:first").width(pageWidth - 120);
  }
};
"use strict";

var WLDCT_ListTableCheckBox = {
  RendererChain: HTMLControl.RendererChain,
  RendererDataChain: function RendererDataChain(_rendererDataChainParas) {
    var value = _rendererDataChainParas.val;
    var $td = _rendererDataChainParas.$td;
    $td.css("textAlign", "center");
    var $checkbox = $("<input isrow_checkbox=\"true\" type=\"checkbox\" class=\"list-checkbox-c\" value=\"" + value + "\" row_checkbox_record_id=\"" + value + "\">");
    $checkbox.bind("click", {
      "selfInstance": this,
      "$elem": $checkbox
    }, this.ClickEvent);
    $td.html("");
    $td.append($checkbox);
  },
  ClickEvent: function ClickEvent(sender) {
    var $elem = sender.data.$elem;

    var listTableContainerInstance = WLDCT_ListTableContainer.__InnerElemGetInstance($elem);

    if ($elem.prop("checked")) {
      listTableContainerInstance.SaveCheckedRowData($elem.val());
    } else {
      listTableContainerInstance.DeleteCheckedRowData($elem.val());
    }
  }
};
"use strict";

var WLDCT_ListTableContainer = {
  GetHTML: function GetHTML() {
    return "<table id=\"example\" class=\"stripe row-border order-column\" style=\"width:100%\">\n" + "        <thead>\n" + "            <tr>\n" + "                <th colspan='2'>First name</th>\n" + "                <th>Position</th>\n" + "                <th>Office</th>\n" + "                <th colspan='2'>Age</th>\n" + "                <th>Salary</th>\n" + "                <th>Extn.</th>\n" + "                <th>E-mail</th>\n" + "            </tr>\n" + "            <tr>\n" + "                <th>First name</th>\n" + "                <th>Last name</th>\n" + "                <th>Position</th>\n" + "                <th>Office</th>\n" + "                <th>Age</th>\n" + "                <th>Start date</th>\n" + "                <th>Salary</th>\n" + "                <th>Extn.</th>\n" + "                <th>E-mail</th>\n" + "            </tr>\n" + "        </thead>\n" + "        <tbody>\n" + "            <tr>\n" + "                <td><a onclick='alert(1)'>Tiger</a></td>\n" + "                <td>Nixon</td>\n" + "                <td>System Architect</td>\n" + "                <td>Edinburgh</td>\n" + "                <td>61</td>\n" + "                <td>2011/04/25</td>\n" + "                <td>$320,800</td>\n" + "                <td>5421</td>\n" + "                <td>t.nixon@datatables.net</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td>Garrett</td>\n" + "                <td>Winters</td>\n" + "                <td>Accountant</td>\n" + "                <td>Tokyo</td>\n" + "                <td>63</td>\n" + "                <td>2011/07/25</td>\n" + "                <td>$170,750</td>\n" + "                <td>8422</td>\n" + "                <td>g.winters@datatables.net</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td>Ashton</td>\n" + "                <td>Cox</td>\n" + "                <td>Junior Technical Author</td>\n" + "                <td>San Francisco</td>\n" + "                <td>66</td>\n" + "                <td>2009/01/12</td>\n" + "                <td>$86,000</td>\n" + "                <td>1562</td>\n" + "                <td>a.cox@datatables.net</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td>Cedric</td>\n" + "                <td>Kelly</td>\n" + "                <td>Senior Javascript Developer</td>\n" + "                <td>Edinburgh</td>\n" + "                <td>22</td>\n" + "                <td>2012/03/29</td>\n" + "                <td>$433,060</td>\n" + "                <td>6224</td>\n" + "                <td>c.kelly@datatables.net</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td>Airi</td>\n" + "                <td>Satou</td>\n" + "                <td>Accountant</td>\n" + "                <td>Tokyo</td>\n" + "                <td>33</td>\n" + "                <td>2008/11/28</td>\n" + "                <td>$162,700</td>\n" + "                <td>5407</td>\n" + "                <td>a.satou@datatables.net</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td>Brielle</td>\n" + "                <td>Williamson</td>\n" + "                <td>Integration Specialist</td>\n" + "                <td>New York</td>\n" + "                <td>61</td>\n" + "                <td>2012/12/02</td>\n" + "                <td>$372,000</td>\n" + "                <td>4804</td>\n" + "                <td>b.williamson@datatables.net</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td>Herrod</td>\n" + "                <td>Chandler</td>\n" + "                <td>Sales Assistant</td>\n" + "                <td>San Francisco</td>\n" + "                <td>59</td>\n" + "                <td>2012/08/06</td>\n" + "                <td>$137,500</td>\n" + "                <td>9608</td>\n" + "                <td>h.chandler@datatables.net</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td>Rhona</td>\n" + "                <td>Davidson</td>\n" + "                <td>Integration Specialist</td>\n" + "                <td>Tokyo</td>\n" + "                <td>55</td>\n" + "                <td>2010/10/14</td>\n" + "                <td>$327,900</td>\n" + "                <td>6200</td>\n" + "                <td>r.davidson@datatables.net</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td>Colleen</td>\n" + "                <td>Hurst</td>\n" + "                <td>Javascript Developer</td>\n" + "                <td>San Francisco</td>\n" + "                <td>39</td>\n" + "                <td>2009/09/15</td>\n" + "                <td>$205,500</td>\n" + "                <td>2360</td>\n" + "                <td>c.hurst@datatables.net</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td>Sonya</td>\n" + "                <td>Frost</td>\n" + "                <td>Software Engineer</td>\n" + "                <td>Edinburgh</td>\n" + "                <td>23</td>\n" + "                <td>2008/12/13</td>\n" + "                <td>$103,600</td>\n" + "                <td>1667</td>\n" + "                <td>s.frost@datatables.net</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td>Jena</td>\n" + "                <td>Gaines</td>\n" + "                <td>Office Manager</td>\n" + "                <td>London</td>\n" + "                <td>30</td>\n" + "                <td>2008/12/19</td>\n" + "                <td>$90,560</td>\n" + "                <td>3814</td>\n" + "                <td>j.gaines@datatables.net</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td>Quinn</td>\n" + "                <td>Flynn</td>\n" + "                <td>Support Lead</td>\n" + "                <td>Edinburgh</td>\n" + "                <td>22</td>\n" + "                <td>2013/03/03</td>\n" + "                <td>$342,000</td>\n" + "                <td>9497</td>\n" + "                <td>q.flynn@datatables.net</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td>Charde</td>\n" + "                <td>Marshall</td>\n" + "                <td>Regional Director</td>\n" + "                <td>San Francisco</td>\n" + "                <td>36</td>\n" + "                <td>2008/10/16</td>\n" + "                <td>$470,600</td>\n" + "                <td>6741</td>\n" + "                <td>c.marshall@datatables.net</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td>Haley</td>\n" + "                <td>Kennedy</td>\n" + "                <td>Senior Marketing Designer</td>\n" + "                <td>London</td>\n" + "                <td>43</td>\n" + "                <td>2012/12/18</td>\n" + "                <td>$313,500</td>\n" + "                <td>3597</td>\n" + "                <td>h.kennedy@datatables.net</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td>Tatyana</td>\n" + "                <td>Fitzpatrick</td>\n" + "                <td>Regional Director</td>\n" + "                <td>London</td>\n" + "                <td>19</td>\n" + "                <td>2010/03/17</td>\n" + "                <td>$385,750</td>\n" + "                <td>1965</td>\n" + "                <td>t.fitzpatrick@datatables.net</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td>Michael</td>\n" + "                <td>Silva</td>\n" + "                <td>Marketing Designer</td>\n" + "                <td>London</td>\n" + "                <td>66</td>\n" + "                <td>2012/11/27</td>\n" + "                <td>$198,500</td>\n" + "                <td>1581</td>\n" + "                <td>m.silva@datatables.net</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td>Charde</td>\n" + "                <td>Marshall</td>\n" + "                <td>Regional Director</td>\n" + "                <td>San Francisco</td>\n" + "                <td>36</td>\n" + "                <td>2008/10/16</td>\n" + "                <td>$470,600</td>\n" + "                <td>6741</td>\n" + "                <td>c.marshall@datatables.net</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td>Haley</td>\n" + "                <td>Kennedy</td>\n" + "                <td>Senior Marketing Designer</td>\n" + "                <td>London</td>\n" + "                <td>43</td>\n" + "                <td>2012/12/18</td>\n" + "                <td>$313,500</td>\n" + "                <td>3597</td>\n" + "                <td>h.kennedy@datatables.net</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td>Tatyana</td>\n" + "                <td>Fitzpatrick</td>\n" + "                <td>Regional Director</td>\n" + "                <td>London</td>\n" + "                <td>19</td>\n" + "                <td>2010/03/17</td>\n" + "                <td>$385,750</td>\n" + "                <td>1965</td>\n" + "                <td>t.fitzpatrick@datatables.net</td>\n" + "            </tr>\n" + "            <tr>\n" + "                <td>Michael</td>\n" + "                <td>Silva</td>\n" + "                <td>Marketing Designer</td>\n" + "                <td>London</td>\n" + "                <td>66</td>\n" + "                <td>2012/11/27</td>\n" + "                <td>$198,500</td>\n" + "                <td>1581</td>\n" + "                <td>m.silva@datatables.net</td>\n" + "            </tr>\n" + "        </tbody>\n" + "    </table>";
  },
  _objectType: "Instance",
  _prop: {
    $singleControlElem: null,
    instanceName: null,
    elemId: null
  },
  _InstanceMap: {},
  _CurrentPageNum: 1,
  _DataSet: null,
  _Cache$SingleControlElem: null,
  _CacheRendererDataChainParas: null,
  _SimpleSearchContainerInstance: null,
  _ComplexSearchContainerInstance: null,
  _QueryPOList: [],
  _CheckedRecordArray: [],
  _$Elem: null,
  _ListRuntimeInstance: null,
  GetInstance: function GetInstance(name) {
    for (var key in this._InstanceMap) {
      if (key == name) {
        return this._InstanceMap[key];
      }
    }

    var instance = eval(name);
    this._InstanceMap[name] = instance;
    return instance;
  },
  Initialize: function Initialize() {},
  RendererChain: function RendererChain(_rendererChainParas) {
    var $singleControlElem = _rendererChainParas.$singleControlElem;
    this._ListRuntimeInstance = _rendererChainParas.listRuntimeInstance;
    this._$Elem = $singleControlElem;
    var $simpleSearchContainerElem = $singleControlElem.prevAll("[client_resolve='WLDCT_ListSimpleSearchContainer']");
    var $complexSearchContainerElem = $singleControlElem.prevAll("[client_resolve='WLDCT_ListComplexSearchContainer']");
    this._SimpleSearchContainerInstance = HTMLControl.GetControlInstanceByElem($simpleSearchContainerElem);
    this._ComplexSearchContainerInstance = HTMLControl.GetControlInstanceByElem($complexSearchContainerElem);

    this._SimpleSearchContainerInstance._$SimpleSearchButton.bind("click", {
      "listInstance": this
    }, this.SimpleSearchClickEvent);

    this._SimpleSearchContainerInstance._$ShowComplexSearchButton.bind("click", {
      "listInstance": this
    }, this.ShowComplexSearchClickEvent);

    this._ComplexSearchContainerInstance._$ComplexSearchButton.bind("click", {
      "listInstance": this
    }, this.ComplexSearchClickEvent);

    this._ComplexSearchContainerInstance._$ClearButton.bind("click", {
      "listInstance": this
    }, this.ComplexSearchClearClickEvent);

    this._ComplexSearchContainerInstance._$CloseButton.bind("click", {
      "listInstance": this
    }, this.ComplexSearchCloseClickEvent);

    if (this._SimpleSearchContainerInstance.GetStatus() == "disable") {
      this._SimpleSearchContainerInstance.Hide();
    }

    if (this._ComplexSearchContainerInstance.GetStatus() == "disable") {
      this._SimpleSearchContainerInstance.HideComplexButton();
    }

    var $templateTable = $singleControlElem.find("table");
    var $templateTableRow = $singleControlElem.find("table tbody tr");
    var $templateTableHeaderRows = $singleControlElem.find("table thead tr");
    this.AppendCheckBoxColumnTemplate($templateTable, $templateTableHeaderRows, $templateTableRow);
    HTMLControl.RendererChain(_rendererChainParas);
  },
  RendererDataChain: function RendererDataChain(_rendererDataChainParas, isReRenderer) {
    var usedTopDataSet = true;
    var dataSetId;
    var pageSize;

    if (usedTopDataSet) {
      dataSetId = _rendererDataChainParas.topDataSetId;
      pageSize = _rendererDataChainParas.po.listDatasetPageSize;
    }

    if (RuntimeGeneralInstance.TryGetUrlParaChangeMainDataSetId()) {
      dataSetId = RuntimeGeneralInstance.TryGetUrlParaChangeMainDataSetId();
    }

    if (!this._CacheRendererDataChainParas) {
      this._CacheRendererDataChainParas = _rendererDataChainParas;
      this._Cache$SingleControlElem = _rendererDataChainParas.$singleControlElem.clone();
    }

    if (isReRenderer) {
      var notScriptHTML = StringUtility.RemoveScript(this._Cache$SingleControlElem.html());

      _rendererDataChainParas.$singleControlElem.html(notScriptHTML);
    } else {
      var conditions = this._SimpleSearchContainerInstance.BuilderSearchCondition();

      this._QueryPOList = conditions;
    }

    if (_rendererDataChainParas.listRuntimeInstance.IsPreview()) {
      var mockDataSet = {
        "total": 1000,
        "list": [],
        "pageNum": 1,
        "pageSize": 5,
        "size": 5,
        "startRow": 1,
        "endRow": 5,
        "pages": 200,
        "prePage": 0,
        "nextPage": 2,
        "isFirstPage": true,
        "isLastPage": false,
        "hasPreviousPage": false,
        "hasNextPage": true,
        "navigatePages": 8,
        "navigatepageNums": [1, 2, 3, 4, 5, 6, 7, 8],
        "navigateFirstPage": 1,
        "navigateLastPage": 8,
        "firstPage": 1,
        "lastPage": 8
      };
      this._DataSet = mockDataSet;
      this.CreateTable(_rendererDataChainParas.$singleControlElem, mockDataSet, true);
    } else {
      DialogUtility.AlertLoading(window, DialogUtility.DialogLoadingId, {
        title: "系统提示",
        hide: {
          effect: "fade",
          duration: 500
        }
      }, "数据加载中,请稍候....");
      RuntimeGeneralInstance.GetDataSetData({
        dataSetId: dataSetId,
        pageSize: pageSize,
        pageNum: this._CurrentPageNum,
        listQueryPOList: this._QueryPOList,
        exValue1: "",
        exValue2: "",
        exValue3: ""
      }, function (result) {
        _rendererDataChainParas.dataSet = result.data;
        this._DataSet = result.data;
        this._CheckedRecordArray = [];
        this.CreateTable(_rendererDataChainParas.$singleControlElem, this._DataSet, false);
        window.setTimeout(function () {
          DialogUtility.CloseDialog(DialogUtility.DialogLoadingId);
        }, 500);
      }, this);
    }
  },
  CreateTable: function CreateTable($singleControlElem, dataSet, isPreview) {
    var $templateTable = $singleControlElem.find("table");
    var $templateTableRow = $singleControlElem.find("table tbody tr");
    var $templateTableHeaderRows = $singleControlElem.find("table thead tr");

    if ($templateTableRow.length > 0) {
      var $templateTableBody = $singleControlElem.find("table tbody");

      for (var i = 0; i < dataSet.list.length; i++) {
        $templateTableBody.append(this.RendererSingleRow($templateTable, $templateTableRow, dataSet, dataSet.list[i]));
      }

      $templateTableRow.remove();

      if (isPreview) {
        $templateTable.find("[singlename='WLDCT_ListTableInnerButtonContainer']").remove();
      }
    }

    $singleControlElem.find(".wldct-list-table-inner-wrap").append(this.CreatePaging());
    $singleControlElem.find(".wldct-list-table-inner-wrap").width(PageStyleUtility.GetPageWidth() - 20);
    $templateTable.addClass("stripe row-border order-column");
    $templateTable.width("100%");
    var scrollY = PageStyleUtility.GetPageHeight();
    scrollY = scrollY - 110;

    if ($(".wldct-list-button-outer-wrap").css("display") != "none") {
      scrollY = scrollY - $(".wldct-list-button-outer-wrap").height() - 12;
    }

    if ($(".wldct-list-simple-search-outer-wrap").css("display") != "none") {
      scrollY = scrollY - $(".wldct-list-simple-search-outer-wrap").height() - 10;
    }

    if (RuntimeGeneralInstance.TryGetUrlParaViewOnly()) {
      if ($singleControlElem.find("tr").find("th:last").text() == "操作") {
        $singleControlElem.find("tr").find("th:last").hide();
        $singleControlElem.find("tr").find("td:last").hide();
      }
    }

    var table = $templateTable.DataTable({
      scrollY: scrollY,
      scrollX: true,
      paging: false,
      "ordering": false,
      "searching": false,
      "info": false
    });
  },
  AppendCheckBoxColumnTemplate: function AppendCheckBoxColumnTemplate($templateTable, $templateTableHeaderRows, $templateTableRow) {
    var $th = $("<th style='width: 30px'>选择</th>");

    if ($templateTableHeaderRows.length > 1) {
      $th.attr("rowspan", $templateTableHeaderRows.length);
    }

    var primaryKey = this._ListRuntimeInstance._ListPO.listDatasetPrimaryKey;
    $($templateTableHeaderRows[0]).prepend($th);
    $($templateTableRow.eq(0)).prepend("<td>\n                                    <div \n                                    columnalign=\"\u5C45\u4E2D\u5BF9\u9F50\" \n                                    columncaption=" + primaryKey + " \n                                    columndatatypename=\"\u5B57\u7B26\u4E32\" \n                                    columnname=" + primaryKey + " \n                                    columntablename=\"\" \n                                    control_category=\"InputControl\" \n                                    custclientrenderermethod=\"\" \n                                    custclientrenderermethodpara=\"\" \n                                    custserverresolvemethod=\"\" \n                                    custserverresolvemethodpara=\"\" \n                                    defaulttext=\"\" \n                                    defaulttype=\"\" \n                                    defaultvalue=\"\" \n                                    desc=\"\" \n                                    id=\"check_box_template\" \n                                    is_jbuild4dc_data=\"true\" \n                                    jbuild4dc_custom=\"true\" \n                                    name=\"check_box_template\" \n                                    placeholder=\"\" \n                                    serialize=\"true\" \n                                    show_remove_button=\"true\" \n                                    singlename=\"WLDCT_ListTableCheckBox\" \n                                    style=\"\" \n                                    targetbuttonid=\"\" \n                                    client_resolve=\"WLDCT_ListTableCheckBox\">\n                                        ID\n                                    </div>\n                                  </td>");
  },
  RendererSingleRow: function RendererSingleRow($templateTable, $templateTableRow, dataSet, rowData) {
    var $cloneRow = $templateTableRow.clone();
    var $tds = $cloneRow.find("td");

    for (var i = 0; i < $tds.length; i++) {
      var $td = $($tds[i]);
      var $divCTElem = $td.find("div" + HTMLControlAttrs.SELECTED_JBUILD4DC_CUSTOM);

      if ($divCTElem.length > 0) {
        var bindToField = $divCTElem.attr("columnname");
        var val = rowData[bindToField] ? rowData[bindToField] : "";
        var clientResolveInstanceName = $divCTElem.attr(HTMLControlAttrs.CLIENT_RESOLVE);
        var instance = WLDCT_ListTableContainer.GetInstance(clientResolveInstanceName);
        instance.RendererDataChain({
          $templateTable: $templateTable,
          $templateTableRow: $templateTableRow,
          $singleControlElem: $divCTElem,
          dataSet: dataSet,
          rowData: rowData,
          $cloneRow: $cloneRow,
          $td: $td,
          val: val,
          listRuntimeInstance: this._ListRuntimeInstance
        });
      }
    }

    return $cloneRow;
  },
  CreatePaging: function CreatePaging($templateTable, $templateTableRow, dataSet, rowData, $row, $td, value) {
    var _self = this;

    var pagingOuterElem = $("<div class='table-paging-outer'><div class='table-paging-inner'></div></div>");
    var pagingInnerElem = pagingOuterElem.find("div");
    var firstPage = $("<div class='table-paging-button'>第一页</div>");
    firstPage.click(function () {
      _self.ChangePageNum(1);
    });
    var prePage = $("<div class='table-paging-button'>上一页</div>");
    prePage.click(function () {
      if (_self._CurrentPageNum > 1) {
        _self.ChangePageNum(_self._CurrentPageNum - 1);
      } else {
        DialogUtility.AlertText("已经到达第一页!");
      }
    });
    var lastPage = $("<div class='table-paging-button'>末页</div>");
    lastPage.click(function () {
      _self.ChangePageNum(_self._DataSet.pages);
    });
    var nextPage = $("<div class='table-paging-button'>下一页</div>");
    nextPage.click(function () {
      if (_self._CurrentPageNum < _self._DataSet.pages) {
        _self.ChangePageNum(_self._CurrentPageNum + 1);
      } else {
        DialogUtility.AlertText("已经到达最末页!");
      }
    });
    var info = $("<div class='table-paging-info'>总条数【" + _self._DataSet.total + "】&nbsp;&nbsp;页数【" + _self._CurrentPageNum + "/" + _self._DataSet.pages + "】</div>");
    pagingInnerElem.append(firstPage).append(prePage).append(nextPage).append(lastPage).append(info);
    return pagingOuterElem;
  },
  ChangePageNum: function ChangePageNum(pageNum) {
    this._CurrentPageNum = pageNum;
    this.RendererDataChain(this._CacheRendererDataChainParas, true);
  },
  TryReloadForListFormButton: function TryReloadForListFormButton(listFormButtonElemId) {
    var $listFormButtonElem = $("#" + listFormButtonElemId);
    var $listTemplate = $listFormButtonElem.parentsUntil("[singlename='WLDCT_ListTemplate']").last().parent();
    var $listTableContainer = $listTemplate.find("[singlename='WLDCT_ListTableContainer']");
    var $listTableContainerInstance = HTMLControl.GetControlInstanceByElem($listTableContainer);
    $listTableContainerInstance.RendererDataChain($listTableContainerInstance._CacheRendererDataChainParas, true);
  },
  SimpleSearchClickEvent: function SimpleSearchClickEvent(sender) {
    var _self = sender.data.listInstance;

    var conditions = _self._SimpleSearchContainerInstance.BuilderSearchCondition();

    _self._QueryPOList = conditions;

    _self.RendererDataChain(_self._CacheRendererDataChainParas, true);
  },
  ShowComplexSearchClickEvent: function ShowComplexSearchClickEvent(sender) {
    var _self = sender.data.listInstance;
    DialogUtility.DialogElemObj(_self._ComplexSearchContainerInstance._$SingleControlElem, {
      title: "高级查询",
      height: 410,
      width: 800,
      modal: true
    });
  },
  ComplexSearchClickEvent: function ComplexSearchClickEvent(sender) {
    console.log("高级查询.");
    var _self = sender.data.listInstance;

    var simpleConditions = _self._SimpleSearchContainerInstance.BuilderSearchCondition();

    var complexConditions = _self._ComplexSearchContainerInstance.BuilderSearchCondition();

    _self._QueryPOList = complexConditions.concat(simpleConditions);

    _self.RendererDataChain(_self._CacheRendererDataChainParas, true);

    DialogUtility.CloseDialogElem(_self._ComplexSearchContainerInstance._$SingleControlElem);
  },
  ComplexSearchCloseClickEvent: function ComplexSearchCloseClickEvent(sender) {
    var _self = sender.data.listInstance;
    DialogUtility.CloseDialogElem(_self._ComplexSearchContainerInstance._$SingleControlElem);
  },
  ComplexSearchClearClickEvent: function ComplexSearchClearClickEvent(sender) {
    var _self = sender.data.listInstance;
    DialogUtility.AlertText("未实现!");
  },
  GetRecordData: function GetRecordData(id) {
    var primaryKey = this._ListRuntimeInstance.GetPrimaryKey();

    if (!this._ListRuntimeInstance.CheckPrimaryKeyInDataSet(this._DataSet, primaryKey)) {
      DialogUtility.AlertText("数据集中找不到主键:" + primaryKey + ",请设置配置是否正确!");
      return;
    }

    console.log("主键为:" + primaryKey);

    for (var i = 0; i < this._DataSet.list.length; i++) {
      var recordData = this._DataSet.list[i];

      if (recordData[primaryKey] == id) {
        return recordData;
      }
    }

    DialogUtility.AlertText("找不到主键" + primaryKey + "为:" + id + "的记录!");
    return null;
  },
  SaveCheckedRowData: function SaveCheckedRowData(id) {
    var record = this.GetRecordData(id);

    if (record != null) {
      this._CheckedRecordArray.push({
        "Id": id,
        "Record": record
      });
    }
  },
  DeleteCheckedRowData: function DeleteCheckedRowData(id) {
    for (var i = 0; i < this._CheckedRecordArray.length; i++) {
      if (this._CheckedRecordArray[i].Id == id) {
        ArrayUtility.Delete(this._CheckedRecordArray, i);
      }
    }
  },
  GetCheckedRecord: function GetCheckedRecord() {
    return this._CheckedRecordArray;
  },
  GetLastCheckedRecord: function GetLastCheckedRecord() {
    if (this._CheckedRecordArray.length > 0) {
      return this._CheckedRecordArray[this._CheckedRecordArray.length - 1];
    }

    return null;
  },
  ClearAllCheckBox: function ClearAllCheckBox() {
    this._$Elem.find(":checkbox").prop('checked', false);

    this._CheckedRecordArray = [];
  },
  SetCheckBoxToCheckedStatus: function SetCheckBoxToCheckedStatus(id) {
    this._$Elem.find("[row_checkbox_record_id='" + id + "']:checkbox").prop('checked', true);

    this.SaveCheckedRowData(id);
  },
  __InnerElemGetInstance: function __InnerElemGetInstance($innerElem) {
    var $WLDCT_ListTableContainer = $innerElem.parents("[singlename='WLDCT_ListTableContainer']");
    var listTableContainerInstance = HTMLControl.GetControlInstanceByElem($WLDCT_ListTableContainer);
    return listTableContainerInstance;
  }
};
"use strict";

var WLDCT_ListTableInnerButtonContainer = {
  RendererChain: function RendererChain(_rendererChainParas) {
    var $singleControlElem = _rendererChainParas.$singleControlElem;
    var $divCTElem = $singleControlElem.find("div" + HTMLControlAttrs.SELECTED_JBUILD4DC_CUSTOM);
    $singleControlElem.html("");
    $singleControlElem.append($divCTElem);
  },
  RendererDataChain: HTMLControl.RendererDataChain
};
"use strict";

var WLDCT_ListTableInnerButtonSingle = {
  RendererChain: function RendererChain(_rendererChainParas) {},
  _ListRuntimeInstance: null,
  RendererDataChain: function RendererDataChain(_rendererDataChainParas) {
    var $singleControlElem = _rendererDataChainParas.$singleControlElem;
    this._ListRuntimeInstance = _rendererDataChainParas.listRuntimeInstance;
    $singleControlElem.bind("click", {
      "selfInstance": this,
      "$elem": $singleControlElem,
      rowData: _rendererDataChainParas.rowData
    }, this.ClickEvent);
    $singleControlElem.html("");
    $singleControlElem.attr("title", $singleControlElem.attr("caption"));
  },
  ClickEvent: function ClickEvent(sender) {
    var $elem = sender.data.$elem;
    var targetbuttonid = $elem.attr("targetbuttonid");
    var $listTableContainer = $elem.parentsUntil("[singlename='WLDCT_ListTableContainer']").last().parent();
    var listTableContainerInstance = HTMLControl.GetControlInstanceByElem($listTableContainer);
    listTableContainerInstance.ClearAllCheckBox();

    var primaryKey = sender.data.selfInstance._ListRuntimeInstance.GetPrimaryKey();

    listTableContainerInstance.SetCheckBoxToCheckedStatus(sender.data.rowData[primaryKey]);
    console.log(targetbuttonid);
    $("button#" + targetbuttonid).trigger("click");
    console.log(listTableContainerInstance);
  }
};
"use strict";

var WLDCT_ListTableLabel = {
  _objectType: "Static",
  _propMap: {},
  _prop: {
    $singleControlElem: null,
    instanceName: null,
    elemId: null,
    columnAlign: null,
    defFormat: null,
    targetButtonId: null,
    dictionaryGroupDataSourceId: null,
    omitLength: null
  },
  RendererChain: HTMLControl.RendererChain,
  RendererDataChain: function RendererDataChain(_rendererDataChainParas) {
    var $singleControlElem = _rendererDataChainParas.$singleControlElem;
    var value = _rendererDataChainParas.val;
    var elemId = $singleControlElem.attr("id");
    var _prop = this._propMap[elemId];
    _prop._ListRuntimeInstance = _rendererDataChainParas.listRuntimeInstance;
    var $td = _rendererDataChainParas.$td;

    if (_prop.columnAlign == "居中对齐") {
      $td.css("textAlign", "center");
    } else if (_prop.columnAlign == "左对齐") {
      $td.css("textAlign", "left");
    }

    if (_prop.defFormat == "yyyy-MM-dd") {
      if (value) {
        var ctDate = DateUtility.ConvertFromString(value);
        value = DateUtility.Format(ctDate, _prop.defFormat);
      }
    } else if (_prop.defFormat == "convertOrganIdToOrganName") {
      if (StringUtility.IsNotNullOrEmpty(value)) {
        var organData = _rendererDataChainParas.listRuntimeInstance._ListPO.exData.minOrganData[value];

        if (organData != null && organData != undefined) {
          var organName = organData.organName;
          value = organName;
        }
      }
    } else if (_prop.defFormat == "convertDDValueToDDText") {
      if (StringUtility.IsNotNullOrEmpty(value) && _prop.dictionaryGroupDataSourceId) {
        var key = _prop.dictionaryGroupDataSourceId + "_" + value;
        value = _rendererDataChainParas.listRuntimeInstance._ListPO.exData.minDictionaryData[key].TEXT;
      }
    }

    if (_prop.targetButtonId) {
      $td.addClass("list-td-click-enable");
      $td.bind("click", {
        "prop": _prop,
        rowData: _rendererDataChainParas.rowData
      }, this.ClickEvent);
    }

    if (_prop.omitLength && value) {
      var intOmitLength = parseInt(_prop.omitLength);

      if (intOmitLength > 0 && value.length > intOmitLength) {
        value = value.substring(0, intOmitLength) + "...";
      }
    }

    $td.html(value);
  },
  ClickEvent: function ClickEvent(sender) {
    var _prop = sender.data.prop;
    var rowData = sender.data.rowData;
    var targetbuttonid = _prop.targetButtonId;
    var $listTableContainer = $(this).parentsUntil("[singlename='WLDCT_ListTableContainer']").last().parent();
    var listTableContainerInstance = HTMLControl.GetControlInstanceByElem($listTableContainer);
    listTableContainerInstance.ClearAllCheckBox();

    var primaryKey = _prop._ListRuntimeInstance.GetPrimaryKey();

    listTableContainerInstance.SetCheckBoxToCheckedStatus(rowData[primaryKey]);
    console.log(targetbuttonid);
    $("button#" + targetbuttonid).trigger("click");
    console.log(listTableContainerInstance);
  }
};
"use strict";

var WLDCT_PrintButton = {
  _ListTableContainerInstance: null,
  RendererChain: HTMLControl.RendererChain,
  ResolveSelf: function ResolveSelf(_rendererChainParas) {
    var $singleControlElem = _rendererChainParas.$singleControlElem;
    var caption = $singleControlElem.attr("buttoncaption");
    var $button = $("<button class='wldct-list-button'>" + caption + "</button>");
    var attributes = $singleControlElem.prop("attributes");
    $.each(attributes, function () {
      $button.attr(this.name, this.value);
    });
    $button.bind("click", {
      "buttonElem": $button,
      "selfInstance": this
    }, this.ClickEvent);
    var isshow = $button.attr("isshow");

    if (isshow == "false") {
      $button.hide();
    }

    return $button;
  },
  RendererDataChain: function RendererDataChain(_rendererDataChainParas) {
    var $singleControlElem = _rendererDataChainParas.$singleControlElem;
    var $WLDCT_ListButtonContainer = $singleControlElem.parents("[singlename='WLDCT_ListButtonContainer']");
    var $WLDCT_ListTableContainerElem = $WLDCT_ListButtonContainer.nextAll("[client_resolve='WLDCT_ListTableContainer']");
    this._ListTableContainerInstance = HTMLControl.GetControlInstanceByElem($WLDCT_ListTableContainerElem);
  },
  ClickEvent: function ClickEvent(sender) {
    var $button = sender.data.buttonElem;
    var _self = sender.data.selfInstance;
    var bindauthority = $button.attr("bindauthority");
    var buttoncaption = $button.attr("buttoncaption");
    var buttontype = $button.attr("buttontype");
    var custclientclickbeforemethod = $button.attr("custclientclickbeforemethod");
    var custclientclickbeforemethodpara = $button.attr("custclientclickbeforemethodpara");
    var custclientrendereraftermethodpara = $button.attr("custclientrendereraftermethodpara");
    var custclientrendereraftermethodparapara = $button.attr("custclientrendereraftermethodparapara");
    var custclientrenderermethod = $button.attr("custclientrenderermethod");
    var custclientrenderermethodpara = $button.attr("custclientrenderermethodpara");
    var custserverresolvemethod = $button.attr("custserverresolvemethod");
    var custserverresolvemethodpara = $button.attr("custserverresolvemethodpara");
    var formcode = $button.attr("formcode");
    var formid = $button.attr("formid");
    var formmoduleid = $button.attr("formmoduleid");
    var formmodulename = $button.attr("formmodulename");
    var formname = $button.attr("formname");
    var elemid = $button.attr("id");
    var buttonid = $button.attr("buttonid");
    var innerbuttonjsonstring = $button.attr("innerbuttonjsonstring");
    var opentype = $button.attr("opentype");
    var operation = $button.attr("operation");
    var singlename = $button.attr("singlename");
    var windowcaption = $button.attr("windowcaption");
    var windowheight = $button.attr("windowheight");
    var windowwidth = $button.attr("windowwidth");
    var client_resolve = $button.attr("client_resolve");
    var recordId = "";

    if (operation == "update" || operation == "view") {
      var checkedRecordObjs = _self._ListTableContainerInstance.GetCheckedRecord();

      if (checkedRecordObjs.length == 0) {
        DialogUtility.AlertText("请选择需要进行操作的记录!");
        return;
      } else if (checkedRecordObjs.length > 1) {
        DialogUtility.AlertText("一次只能操作一条记录!");
        return;
      } else {
        recordId = checkedRecordObjs[0].Id;
      }
    }

    var paraStr = BaseUtility.GetUrlParaValue("menuRightUrlPara");
    var url = BaseUtility.BuildView("/HTML/Builder/Runtime/WebFormRuntimePrint.html", {
      "formId": formid,
      "buttonId": buttonid,
      "listFormButtonElemId": elemid,
      "recordId": recordId,
      "operationType": operation,
      "windowWidth": windowwidth,
      "windowHeight": windowheight,
      "menuRightUrlPara": paraStr
    });
    DialogUtility.OpenNewTabWindow(url);
  }
};
"use strict";

var WLDCT_Search_DropDownSelect = {
  RendererChain: function RendererChain(_rendererChainParas) {},
  RendererDataChain: function RendererDataChain(_rendererDataChainParas) {
    var $singleControlElem = _rendererDataChainParas.$singleControlElem;
  },
  GetValue: HTMLControl.GetValue,
  TryBindUrlValue: HTMLControl.TryBindUrlValue
};
"use strict";

var WLDCT_Search_TextBox = {
  RendererChain: HTMLControl.RendererChain,
  RendererDataChain: HTMLControl.RendererDataChain,
  GetValue: HTMLControl.GetValue,
  TryBindUrlValue: HTMLControl.TryBindUrlValue
};
"use strict";

var WLDCT_Search_TextDateTime = {
  RendererChain: HTMLControl.RendererChain,
  RendererDataChain: HTMLControl.RendererDataChain,
  GetValue: HTMLControl.GetValue,
  TryBindUrlValue: HTMLControl.TryBindUrlValue
};
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery', 'datatables.net'], function ($) {
      return factory($, window, document);
    });
  } else if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') {
    module.exports = function (root, $) {
      if (!root) {
        root = window;
      }

      if (!$ || !$.fn.dataTable) {
        $ = require('datatables.net')(root, $).$;
      }

      return factory($, root, root.document);
    };
  } else {
    factory(jQuery, window, document);
  }
})(function ($, window, document, undefined) {
  'use strict';

  var DataTable = $.fn.dataTable;

  var _firefoxScroll;

  var FixedColumns = function FixedColumns(dt, init) {
    var that = this;

    if (!(this instanceof FixedColumns)) {
      alert("FixedColumns warning: FixedColumns must be initialised with the 'new' keyword.");
      return;
    }

    if (init === undefined || init === true) {
      init = {};
    }

    var camelToHungarian = $.fn.dataTable.camelToHungarian;

    if (camelToHungarian) {
      camelToHungarian(FixedColumns.defaults, FixedColumns.defaults, true);
      camelToHungarian(FixedColumns.defaults, init);
    }

    var dtSettings = new $.fn.dataTable.Api(dt).settings()[0];
    this.s = {
      "dt": dtSettings,
      "iTableColumns": dtSettings.aoColumns.length,
      "aiOuterWidths": [],
      "aiInnerWidths": [],
      rtl: $(dtSettings.nTable).css('direction') === 'rtl'
    };
    this.dom = {
      "scroller": null,
      "header": null,
      "body": null,
      "footer": null,
      "grid": {
        "wrapper": null,
        "dt": null,
        "left": {
          "wrapper": null,
          "head": null,
          "body": null,
          "foot": null
        },
        "right": {
          "wrapper": null,
          "head": null,
          "body": null,
          "foot": null
        }
      },
      "clone": {
        "left": {
          "header": null,
          "body": null,
          "footer": null
        },
        "right": {
          "header": null,
          "body": null,
          "footer": null
        }
      }
    };

    if (dtSettings._oFixedColumns) {
      throw 'FixedColumns already initialised on this table';
    }

    dtSettings._oFixedColumns = this;

    if (!dtSettings._bInitComplete) {
      dtSettings.oApi._fnCallbackReg(dtSettings, 'aoInitComplete', function () {
        that._fnConstruct(init);
      }, 'FixedColumns');
    } else {
      this._fnConstruct(init);
    }
  };

  $.extend(FixedColumns.prototype, {
    "fnUpdate": function fnUpdate() {
      this._fnDraw(true);
    },
    "fnRedrawLayout": function fnRedrawLayout() {
      this._fnColCalc();

      this._fnGridLayout();

      this.fnUpdate();
    },
    "fnRecalculateHeight": function fnRecalculateHeight(nTr) {
      delete nTr._DTTC_iHeight;
      nTr.style.height = 'auto';
    },
    "fnSetRowHeight": function fnSetRowHeight(nTarget, iHeight) {
      nTarget.style.height = iHeight + "px";
    },
    "fnGetPosition": function fnGetPosition(node) {
      var idx;
      var inst = this.s.dt.oInstance;

      if (!$(node).parents('.DTFC_Cloned').length) {
        return inst.fnGetPosition(node);
      } else {
        if (node.nodeName.toLowerCase() === 'tr') {
          idx = $(node).index();
          return inst.fnGetPosition($('tr', this.s.dt.nTBody)[idx]);
        } else {
          var colIdx = $(node).index();
          idx = $(node.parentNode).index();
          var row = inst.fnGetPosition($('tr', this.s.dt.nTBody)[idx]);
          return [row, colIdx, inst.oApi._fnVisibleToColumnIndex(this.s.dt, colIdx)];
        }
      }
    },
    "_fnConstruct": function _fnConstruct(oInit) {
      var i,
          iLen,
          iWidth,
          that = this;

      if (typeof this.s.dt.oInstance.fnVersionCheck != 'function' || this.s.dt.oInstance.fnVersionCheck('1.8.0') !== true) {
        alert("FixedColumns " + FixedColumns.VERSION + " required DataTables 1.8.0 or later. " + "Please upgrade your DataTables installation");
        return;
      }

      if (this.s.dt.oScroll.sX === "") {
        this.s.dt.oInstance.oApi._fnLog(this.s.dt, 1, "FixedColumns is not needed (no " + "x-scrolling in DataTables enabled), so no action will be taken. Use 'FixedHeader' for " + "column fixing when scrolling is not enabled");

        return;
      }

      this.s = $.extend(true, this.s, FixedColumns.defaults, oInit);
      var classes = this.s.dt.oClasses;
      this.dom.grid.dt = $(this.s.dt.nTable).parents('div.' + classes.sScrollWrapper)[0];
      this.dom.scroller = $('div.' + classes.sScrollBody, this.dom.grid.dt)[0];

      this._fnColCalc();

      this._fnGridSetup();

      var mouseController;
      var mouseDown = false;
      $(this.s.dt.nTableWrapper).on('mousedown.DTFC', function (e) {
        if (e.button === 0) {
          mouseDown = true;
          $(document).one('mouseup', function () {
            mouseDown = false;
          });
        }
      });
      $(this.dom.scroller).on('mouseover.DTFC touchstart.DTFC', function () {
        if (!mouseDown) {
          mouseController = 'main';
        }
      }).on('scroll.DTFC', function (e) {
        if (!mouseController && e.originalEvent) {
          mouseController = 'main';
        }

        if (mouseController === 'main') {
          if (that.s.iLeftColumns > 0) {
            that.dom.grid.left.liner.scrollTop = that.dom.scroller.scrollTop;
          }

          if (that.s.iRightColumns > 0) {
            that.dom.grid.right.liner.scrollTop = that.dom.scroller.scrollTop;
          }
        }
      });
      var wheelType = 'onwheel' in document.createElement('div') ? 'wheel.DTFC' : 'mousewheel.DTFC';

      if (that.s.iLeftColumns > 0) {
        $(that.dom.grid.left.liner).on('mouseover.DTFC touchstart.DTFC', function () {
          if (!mouseDown) {
            mouseController = 'left';
          }
        }).on('scroll.DTFC', function (e) {
          if (!mouseController && e.originalEvent) {
            mouseController = 'left';
          }

          if (mouseController === 'left') {
            that.dom.scroller.scrollTop = that.dom.grid.left.liner.scrollTop;

            if (that.s.iRightColumns > 0) {
              that.dom.grid.right.liner.scrollTop = that.dom.grid.left.liner.scrollTop;
            }
          }
        }).on(wheelType, function (e) {
          var xDelta = e.type === 'wheel' ? -e.originalEvent.deltaX : e.originalEvent.wheelDeltaX;
          that.dom.scroller.scrollLeft -= xDelta;
        });
      }

      if (that.s.iRightColumns > 0) {
        $(that.dom.grid.right.liner).on('mouseover.DTFC touchstart.DTFC', function () {
          if (!mouseDown) {
            mouseController = 'right';
          }
        }).on('scroll.DTFC', function (e) {
          if (!mouseController && e.originalEvent) {
            mouseController = 'right';
          }

          if (mouseController === 'right') {
            that.dom.scroller.scrollTop = that.dom.grid.right.liner.scrollTop;

            if (that.s.iLeftColumns > 0) {
              that.dom.grid.left.liner.scrollTop = that.dom.grid.right.liner.scrollTop;
            }
          }
        }).on(wheelType, function (e) {
          var xDelta = e.type === 'wheel' ? -e.originalEvent.deltaX : e.originalEvent.wheelDeltaX;
          that.dom.scroller.scrollLeft -= xDelta;
        });
      }

      $(window).on('resize.DTFC', function () {
        that._fnGridLayout.call(that);
      });
      var bFirstDraw = true;
      var jqTable = $(this.s.dt.nTable);
      jqTable.on('draw.dt.DTFC', function () {
        that._fnColCalc();

        that._fnDraw.call(that, bFirstDraw);

        bFirstDraw = false;
      }).on('column-sizing.dt.DTFC', function () {
        that._fnColCalc();

        that._fnGridLayout(that);
      }).on('column-visibility.dt.DTFC', function (e, settings, column, vis, recalc) {
        if (recalc === undefined || recalc) {
          that._fnColCalc();

          that._fnGridLayout(that);

          that._fnDraw(true);
        }
      }).on('select.dt.DTFC deselect.dt.DTFC', function (e, dt, type, indexes) {
        if (e.namespace === 'dt') {
          that._fnDraw(false);
        }
      }).on('destroy.dt.DTFC', function () {
        jqTable.off('.DTFC');
        $(that.dom.scroller).off('.DTFC');
        $(window).off('.DTFC');
        $(that.s.dt.nTableWrapper).off('.DTFC');
        $(that.dom.grid.left.liner).off('.DTFC ' + wheelType);
        $(that.dom.grid.left.wrapper).remove();
        $(that.dom.grid.right.liner).off('.DTFC ' + wheelType);
        $(that.dom.grid.right.wrapper).remove();
      });

      this._fnGridLayout();

      this.s.dt.oInstance.fnDraw(false);
    },
    "_fnColCalc": function _fnColCalc() {
      var that = this;
      var iLeftWidth = 0;
      var iRightWidth = 0;
      this.s.aiInnerWidths = [];
      this.s.aiOuterWidths = [];
      $.each(this.s.dt.aoColumns, function (i, col) {
        var th = $(col.nTh);
        var border;

        if (!th.filter(':visible').length) {
          that.s.aiInnerWidths.push(0);
          that.s.aiOuterWidths.push(0);
        } else {
          var iWidth = th.outerWidth();

          if (that.s.aiOuterWidths.length === 0) {
            border = $(that.s.dt.nTable).css('border-left-width');
            iWidth += typeof border === 'string' && border.indexOf('px') === -1 ? 1 : parseInt(border, 10);
          }

          if (that.s.aiOuterWidths.length === that.s.dt.aoColumns.length - 1) {
            border = $(that.s.dt.nTable).css('border-right-width');
            iWidth += typeof border === 'string' && border.indexOf('px') === -1 ? 1 : parseInt(border, 10);
          }

          that.s.aiOuterWidths.push(iWidth);
          that.s.aiInnerWidths.push(th.width());

          if (i < that.s.iLeftColumns) {
            iLeftWidth += iWidth;
          }

          if (that.s.iTableColumns - that.s.iRightColumns <= i) {
            iRightWidth += iWidth;
          }
        }
      });
      this.s.iLeftWidth = iLeftWidth;
      this.s.iRightWidth = iRightWidth;
    },
    "_fnGridSetup": function _fnGridSetup() {
      var that = this;

      var oOverflow = this._fnDTOverflow();

      var block;
      this.dom.body = this.s.dt.nTable;
      this.dom.header = this.s.dt.nTHead.parentNode;
      this.dom.header.parentNode.parentNode.style.position = "relative";
      var nSWrapper = $('<div class="DTFC_ScrollWrapper" style="position:relative; clear:both;">' + '<div class="DTFC_LeftWrapper" style="position:absolute; top:0; left:0;" aria-hidden="true">' + '<div class="DTFC_LeftHeadWrapper" style="position:relative; top:0; left:0; overflow:hidden;"></div>' + '<div class="DTFC_LeftBodyWrapper" style="position:relative; top:0; left:0; overflow:hidden;">' + '<div class="DTFC_LeftBodyLiner" style="position:relative; top:0; left:0; overflow-y:scroll;"></div>' + '</div>' + '<div class="DTFC_LeftFootWrapper" style="position:relative; top:0; left:0; overflow:hidden;"></div>' + '</div>' + '<div class="DTFC_RightWrapper" style="position:absolute; top:0; right:0;" aria-hidden="true">' + '<div class="DTFC_RightHeadWrapper" style="position:relative; top:0; left:0;">' + '<div class="DTFC_RightHeadBlocker DTFC_Blocker" style="position:absolute; top:0; bottom:0;"></div>' + '</div>' + '<div class="DTFC_RightBodyWrapper" style="position:relative; top:0; left:0; overflow:hidden;">' + '<div class="DTFC_RightBodyLiner" style="position:relative; top:0; left:0; overflow-y:scroll;"></div>' + '</div>' + '<div class="DTFC_RightFootWrapper" style="position:relative; top:0; left:0;">' + '<div class="DTFC_RightFootBlocker DTFC_Blocker" style="position:absolute; top:0; bottom:0;"></div>' + '</div>' + '</div>' + '</div>')[0];
      var nLeft = nSWrapper.childNodes[0];
      var nRight = nSWrapper.childNodes[1];
      this.dom.grid.dt.parentNode.insertBefore(nSWrapper, this.dom.grid.dt);
      nSWrapper.appendChild(this.dom.grid.dt);
      this.dom.grid.wrapper = nSWrapper;

      if (this.s.iLeftColumns > 0) {
        this.dom.grid.left.wrapper = nLeft;
        this.dom.grid.left.head = nLeft.childNodes[0];
        this.dom.grid.left.body = nLeft.childNodes[1];
        this.dom.grid.left.liner = $('div.DTFC_LeftBodyLiner', nSWrapper)[0];
        nSWrapper.appendChild(nLeft);
      }

      if (this.s.iRightColumns > 0) {
        this.dom.grid.right.wrapper = nRight;
        this.dom.grid.right.head = nRight.childNodes[0];
        this.dom.grid.right.body = nRight.childNodes[1];
        this.dom.grid.right.liner = $('div.DTFC_RightBodyLiner', nSWrapper)[0];
        nRight.style.right = oOverflow.bar + "px";
        block = $('div.DTFC_RightHeadBlocker', nSWrapper)[0];
        block.style.width = oOverflow.bar + "px";
        block.style.right = -oOverflow.bar + "px";
        this.dom.grid.right.headBlock = block;
        block = $('div.DTFC_RightFootBlocker', nSWrapper)[0];
        block.style.width = oOverflow.bar + "px";
        block.style.right = -oOverflow.bar + "px";
        this.dom.grid.right.footBlock = block;
        nSWrapper.appendChild(nRight);
      }

      if (this.s.dt.nTFoot) {
        this.dom.footer = this.s.dt.nTFoot.parentNode;

        if (this.s.iLeftColumns > 0) {
          this.dom.grid.left.foot = nLeft.childNodes[2];
        }

        if (this.s.iRightColumns > 0) {
          this.dom.grid.right.foot = nRight.childNodes[2];
        }
      }

      if (this.s.rtl) {
        $('div.DTFC_RightHeadBlocker', nSWrapper).css({
          left: -oOverflow.bar + 'px',
          right: ''
        });
      }
    },
    "_fnGridLayout": function _fnGridLayout() {
      var that = this;
      var oGrid = this.dom.grid;
      var iWidth = $(oGrid.wrapper).width();
      var iBodyHeight = this.s.dt.nTable.parentNode.offsetHeight;
      var iFullHeight = this.s.dt.nTable.parentNode.parentNode.offsetHeight;

      var oOverflow = this._fnDTOverflow();

      var iLeftWidth = this.s.iLeftWidth;
      var iRightWidth = this.s.iRightWidth;
      var rtl = $(this.dom.body).css('direction') === 'rtl';
      var wrapper;

      var scrollbarAdjust = function scrollbarAdjust(node, width) {
        if (!oOverflow.bar) {
          node.style.width = width + 20 + "px";
          node.style.paddingRight = "20px";
          node.style.boxSizing = "border-box";
        } else if (that._firefoxScrollError()) {
          if ($(node).height() > 34) {
            node.style.width = width + oOverflow.bar + "px";
          }
        } else {
          node.style.width = width + oOverflow.bar + "px";
        }
      };

      if (oOverflow.x) {
        iBodyHeight -= oOverflow.bar;
      }

      oGrid.wrapper.style.height = iFullHeight + "px";

      if (this.s.iLeftColumns > 0) {
        wrapper = oGrid.left.wrapper;
        wrapper.style.width = iLeftWidth + 'px';
        wrapper.style.height = '1px';

        if (rtl) {
          wrapper.style.left = '';
          wrapper.style.right = 0;
        } else {
          wrapper.style.left = 0;
          wrapper.style.right = '';
        }

        oGrid.left.body.style.height = iBodyHeight + "px";

        if (oGrid.left.foot) {
          oGrid.left.foot.style.top = (oOverflow.x ? oOverflow.bar : 0) + "px";
        }

        scrollbarAdjust(oGrid.left.liner, iLeftWidth);
        oGrid.left.liner.style.height = iBodyHeight + "px";
        oGrid.left.liner.style.maxHeight = iBodyHeight + "px";
      }

      if (this.s.iRightColumns > 0) {
        wrapper = oGrid.right.wrapper;
        wrapper.style.width = iRightWidth + 'px';
        wrapper.style.height = '1px';

        if (this.s.rtl) {
          wrapper.style.left = oOverflow.y ? oOverflow.bar + 'px' : 0;
          wrapper.style.right = '';
        } else {
          wrapper.style.left = '';
          wrapper.style.right = oOverflow.y ? oOverflow.bar + 'px' : 0;
        }

        oGrid.right.body.style.height = iBodyHeight + "px";

        if (oGrid.right.foot) {
          oGrid.right.foot.style.top = (oOverflow.x ? oOverflow.bar : 0) + "px";
        }

        scrollbarAdjust(oGrid.right.liner, iRightWidth);
        oGrid.right.liner.style.height = iBodyHeight + "px";
        oGrid.right.liner.style.maxHeight = iBodyHeight + "px";
        oGrid.right.headBlock.style.display = oOverflow.y ? 'block' : 'none';
        oGrid.right.footBlock.style.display = oOverflow.y ? 'block' : 'none';
      }
    },
    "_fnDTOverflow": function _fnDTOverflow() {
      var nTable = this.s.dt.nTable;
      var nTableScrollBody = nTable.parentNode;
      var out = {
        "x": false,
        "y": false,
        "bar": this.s.dt.oScroll.iBarWidth
      };

      if (nTable.offsetWidth > nTableScrollBody.clientWidth) {
        out.x = true;
      }

      if (nTable.offsetHeight > nTableScrollBody.clientHeight) {
        out.y = true;
      }

      return out;
    },
    "_fnDraw": function _fnDraw(bAll) {
      this._fnGridLayout();

      this._fnCloneLeft(bAll);

      this._fnCloneRight(bAll);

      if (this.s.fnDrawCallback !== null) {
        this.s.fnDrawCallback.call(this, this.dom.clone.left, this.dom.clone.right);
      }

      $(this).trigger('draw.dtfc', {
        "leftClone": this.dom.clone.left,
        "rightClone": this.dom.clone.right
      });
    },
    "_fnCloneRight": function _fnCloneRight(bAll) {
      if (this.s.iRightColumns <= 0) {
        return;
      }

      var that = this,
          i,
          jq,
          aiColumns = [];

      for (i = this.s.iTableColumns - this.s.iRightColumns; i < this.s.iTableColumns; i++) {
        if (this.s.dt.aoColumns[i].bVisible) {
          aiColumns.push(i);
        }
      }

      this._fnClone(this.dom.clone.right, this.dom.grid.right, aiColumns, bAll);
    },
    "_fnCloneLeft": function _fnCloneLeft(bAll) {
      if (this.s.iLeftColumns <= 0) {
        return;
      }

      var that = this,
          i,
          jq,
          aiColumns = [];

      for (i = 0; i < this.s.iLeftColumns; i++) {
        if (this.s.dt.aoColumns[i].bVisible) {
          aiColumns.push(i);
        }
      }

      this._fnClone(this.dom.clone.left, this.dom.grid.left, aiColumns, bAll);
    },
    "_fnCopyLayout": function _fnCopyLayout(aoOriginal, aiColumns, events) {
      var aReturn = [];
      var aClones = [];
      var aCloned = [];

      for (var i = 0, iLen = aoOriginal.length; i < iLen; i++) {
        var aRow = [];
        aRow.nTr = $(aoOriginal[i].nTr).clone(events, false)[0];

        for (var j = 0, jLen = this.s.iTableColumns; j < jLen; j++) {
          if ($.inArray(j, aiColumns) === -1) {
            continue;
          }

          var iCloned = $.inArray(aoOriginal[i][j].cell, aCloned);

          if (iCloned === -1) {
            var nClone = $(aoOriginal[i][j].cell).clone(events, false)[0];
            aClones.push(nClone);
            aCloned.push(aoOriginal[i][j].cell);
            aRow.push({
              "cell": nClone,
              "unique": aoOriginal[i][j].unique
            });
          } else {
            aRow.push({
              "cell": aClones[iCloned],
              "unique": aoOriginal[i][j].unique
            });
          }
        }

        aReturn.push(aRow);
      }

      return aReturn;
    },
    "_fnClone": function _fnClone(oClone, oGrid, aiColumns, bAll) {
      var that = this,
          i,
          iLen,
          j,
          jLen,
          jq,
          nTarget,
          iColumn,
          nClone,
          iIndex,
          aoCloneLayout,
          jqCloneThead,
          aoFixedHeader,
          dt = this.s.dt;

      if (bAll) {
        $(oClone.header).remove();
        oClone.header = $(this.dom.header).clone(true, false)[0];
        oClone.header.className += " DTFC_Cloned";
        oClone.header.style.width = "100%";
        oGrid.head.appendChild(oClone.header);
        aoCloneLayout = this._fnCopyLayout(dt.aoHeader, aiColumns, true);
        jqCloneThead = $('>thead', oClone.header);
        jqCloneThead.empty();

        for (i = 0, iLen = aoCloneLayout.length; i < iLen; i++) {
          jqCloneThead[0].appendChild(aoCloneLayout[i].nTr);
        }

        dt.oApi._fnDrawHead(dt, aoCloneLayout, true);
      } else {
        aoCloneLayout = this._fnCopyLayout(dt.aoHeader, aiColumns, false);
        aoFixedHeader = [];

        dt.oApi._fnDetectHeader(aoFixedHeader, $('>thead', oClone.header)[0]);

        for (i = 0, iLen = aoCloneLayout.length; i < iLen; i++) {
          for (j = 0, jLen = aoCloneLayout[i].length; j < jLen; j++) {
            aoFixedHeader[i][j].cell.className = aoCloneLayout[i][j].cell.className;
            $('span.DataTables_sort_icon', aoFixedHeader[i][j].cell).each(function () {
              this.className = $('span.DataTables_sort_icon', aoCloneLayout[i][j].cell)[0].className;
            });
          }
        }
      }

      this._fnEqualiseHeights('thead', this.dom.header, oClone.header);

      if (this.s.sHeightMatch == 'auto') {
        $('>tbody>tr', that.dom.body).css('height', 'auto');
      }

      if (oClone.body !== null) {
        $(oClone.body).remove();
        oClone.body = null;
      }

      oClone.body = $(this.dom.body).clone(true)[0];
      oClone.body.className += " DTFC_Cloned";
      oClone.body.style.paddingBottom = dt.oScroll.iBarWidth + "px";
      oClone.body.style.marginBottom = dt.oScroll.iBarWidth * 2 + "px";

      if (oClone.body.getAttribute('id') !== null) {
        oClone.body.removeAttribute('id');
      }

      $('>thead>tr', oClone.body).empty();
      $('>tfoot', oClone.body).remove();
      var nBody = $('tbody', oClone.body)[0];
      $(nBody).empty();

      if (dt.aiDisplay.length > 0) {
        var nInnerThead = $('>thead>tr', oClone.body)[0];

        for (iIndex = 0; iIndex < aiColumns.length; iIndex++) {
          iColumn = aiColumns[iIndex];
          nClone = $(dt.aoColumns[iColumn].nTh).clone(true)[0];
          nClone.innerHTML = "";
          var oStyle = nClone.style;
          oStyle.paddingTop = "0";
          oStyle.paddingBottom = "0";
          oStyle.borderTopWidth = "0";
          oStyle.borderBottomWidth = "0";
          oStyle.height = 0;
          oStyle.width = that.s.aiInnerWidths[iColumn] + "px";
          nInnerThead.appendChild(nClone);
        }

        $('>tbody>tr', that.dom.body).each(function (z) {
          var i = that.s.dt.oFeatures.bServerSide === false ? that.s.dt.aiDisplay[that.s.dt._iDisplayStart + z] : z;
          var aTds = that.s.dt.aoData[i].anCells || $(this).children('td, th');
          var n = this.cloneNode(false);
          n.removeAttribute('id');
          n.setAttribute('data-dt-row', i);

          for (iIndex = 0; iIndex < aiColumns.length; iIndex++) {
            iColumn = aiColumns[iIndex];

            if (aTds.length > 0) {
              nClone = $(aTds[iColumn]).clone(true, true)[0];
              nClone.removeAttribute('id');
              nClone.setAttribute('data-dt-row', i);
              nClone.setAttribute('data-dt-column', iColumn);
              n.appendChild(nClone);
            }
          }

          nBody.appendChild(n);
        });
      } else {
        $('>tbody>tr', that.dom.body).each(function (z) {
          nClone = this.cloneNode(true);
          nClone.className += ' DTFC_NoData';
          $('td', nClone).html('');
          nBody.appendChild(nClone);
        });
      }

      oClone.body.style.width = "100%";
      oClone.body.style.margin = "0";
      oClone.body.style.padding = "0";

      if (dt.oScroller !== undefined) {
        var scrollerForcer = dt.oScroller.dom.force;

        if (!oGrid.forcer) {
          oGrid.forcer = scrollerForcer.cloneNode(true);
          oGrid.liner.appendChild(oGrid.forcer);
        } else {
          oGrid.forcer.style.height = scrollerForcer.style.height;
        }
      }

      oGrid.liner.appendChild(oClone.body);

      this._fnEqualiseHeights('tbody', that.dom.body, oClone.body);

      if (dt.nTFoot !== null) {
        if (bAll) {
          if (oClone.footer !== null) {
            oClone.footer.parentNode.removeChild(oClone.footer);
          }

          oClone.footer = $(this.dom.footer).clone(true, true)[0];
          oClone.footer.className += " DTFC_Cloned";
          oClone.footer.style.width = "100%";
          oGrid.foot.appendChild(oClone.footer);
          aoCloneLayout = this._fnCopyLayout(dt.aoFooter, aiColumns, true);
          var jqCloneTfoot = $('>tfoot', oClone.footer);
          jqCloneTfoot.empty();

          for (i = 0, iLen = aoCloneLayout.length; i < iLen; i++) {
            jqCloneTfoot[0].appendChild(aoCloneLayout[i].nTr);
          }

          dt.oApi._fnDrawHead(dt, aoCloneLayout, true);
        } else {
          aoCloneLayout = this._fnCopyLayout(dt.aoFooter, aiColumns, false);
          var aoCurrFooter = [];

          dt.oApi._fnDetectHeader(aoCurrFooter, $('>tfoot', oClone.footer)[0]);

          for (i = 0, iLen = aoCloneLayout.length; i < iLen; i++) {
            for (j = 0, jLen = aoCloneLayout[i].length; j < jLen; j++) {
              aoCurrFooter[i][j].cell.className = aoCloneLayout[i][j].cell.className;
            }
          }
        }

        this._fnEqualiseHeights('tfoot', this.dom.footer, oClone.footer);
      }

      var anUnique = dt.oApi._fnGetUniqueThs(dt, $('>thead', oClone.header)[0]);

      $(anUnique).each(function (i) {
        iColumn = aiColumns[i];
        this.style.width = that.s.aiInnerWidths[iColumn] + "px";
      });

      if (that.s.dt.nTFoot !== null) {
        anUnique = dt.oApi._fnGetUniqueThs(dt, $('>tfoot', oClone.footer)[0]);
        $(anUnique).each(function (i) {
          iColumn = aiColumns[i];
          this.style.width = that.s.aiInnerWidths[iColumn] + "px";
        });
      }
    },
    "_fnGetTrNodes": function _fnGetTrNodes(nIn) {
      var aOut = [];

      for (var i = 0, iLen = nIn.childNodes.length; i < iLen; i++) {
        if (nIn.childNodes[i].nodeName.toUpperCase() == "TR") {
          aOut.push(nIn.childNodes[i]);
        }
      }

      return aOut;
    },
    "_fnEqualiseHeights": function _fnEqualiseHeights(nodeName, original, clone) {
      if (this.s.sHeightMatch == 'none' && nodeName !== 'thead' && nodeName !== 'tfoot') {
        return;
      }

      var that = this,
          i,
          iLen,
          iHeight,
          iHeight2,
          iHeightOriginal,
          iHeightClone,
          rootOriginal = original.getElementsByTagName(nodeName)[0],
          rootClone = clone.getElementsByTagName(nodeName)[0],
          jqBoxHack = $('>' + nodeName + '>tr:eq(0)', original).children(':first'),
          iBoxHack = jqBoxHack.outerHeight() - jqBoxHack.height(),
          anOriginal = this._fnGetTrNodes(rootOriginal),
          anClone = this._fnGetTrNodes(rootClone),
          heights = [];

      for (i = 0, iLen = anClone.length; i < iLen; i++) {
        iHeightOriginal = anOriginal[i].offsetHeight;
        iHeightClone = anClone[i].offsetHeight;
        iHeight = iHeightClone > iHeightOriginal ? iHeightClone : iHeightOriginal;

        if (this.s.sHeightMatch == 'semiauto') {
          anOriginal[i]._DTTC_iHeight = iHeight;
        }

        heights.push(iHeight);
      }

      for (i = 0, iLen = anClone.length; i < iLen; i++) {
        anClone[i].style.height = heights[i] + "px";
        anOriginal[i].style.height = heights[i] + "px";
      }
    },
    _firefoxScrollError: function _firefoxScrollError() {
      if (_firefoxScroll === undefined) {
        var test = $('<div/>').css({
          position: 'absolute',
          top: 0,
          left: 0,
          height: 10,
          width: 50,
          overflow: 'scroll'
        }).appendTo('body');
        _firefoxScroll = test[0].clientWidth === test[0].offsetWidth && this._fnDTOverflow().bar !== 0;
        test.remove();
      }

      return _firefoxScroll;
    }
  });
  FixedColumns.defaults = {
    "iLeftColumns": 1,
    "iRightColumns": 0,
    "fnDrawCallback": null,
    "sHeightMatch": "semiauto"
  };
  FixedColumns.version = "3.2.5";
  DataTable.Api.register('fixedColumns()', function () {
    return this;
  });
  DataTable.Api.register('fixedColumns().update()', function () {
    return this.iterator('table', function (ctx) {
      if (ctx._oFixedColumns) {
        ctx._oFixedColumns.fnUpdate();
      }
    });
  });
  DataTable.Api.register('fixedColumns().relayout()', function () {
    return this.iterator('table', function (ctx) {
      if (ctx._oFixedColumns) {
        ctx._oFixedColumns.fnRedrawLayout();
      }
    });
  });
  DataTable.Api.register('rows().recalcHeight()', function () {
    return this.iterator('row', function (ctx, idx) {
      if (ctx._oFixedColumns) {
        ctx._oFixedColumns.fnRecalculateHeight(this.row(idx).node());
      }
    });
  });
  DataTable.Api.register('fixedColumns().rowIndex()', function (row) {
    row = $(row);
    return row.parents('.DTFC_Cloned').length ? this.rows({
      page: 'current'
    }).indexes()[row.index()] : this.row(row).index();
  });
  DataTable.Api.register('fixedColumns().cellIndex()', function (cell) {
    cell = $(cell);

    if (cell.parents('.DTFC_Cloned').length) {
      var rowClonedIdx = cell.parent().index();
      var rowIdx = this.rows({
        page: 'current'
      }).indexes()[rowClonedIdx];
      var columnIdx;

      if (cell.parents('.DTFC_LeftWrapper').length) {
        columnIdx = cell.index();
      } else {
        var columns = this.columns().flatten().length;
        columnIdx = columns - this.context[0]._oFixedColumns.s.iRightColumns + cell.index();
      }

      return {
        row: rowIdx,
        column: this.column.index('toData', columnIdx),
        columnVisible: columnIdx
      };
    } else {
      return this.cell(cell).index();
    }
  });
  $(document).on('init.dt.fixedColumns', function (e, settings) {
    if (e.namespace !== 'dt') {
      return;
    }

    var init = settings.oInit.fixedColumns;
    var defaults = DataTable.defaults.fixedColumns;

    if (init || defaults) {
      var opts = $.extend({}, init, defaults);

      if (init !== false) {
        new FixedColumns(settings, opts);
      }
    }
  });
  $.fn.dataTable.FixedColumns = FixedColumns;
  $.fn.DataTable.FixedColumns = FixedColumns;
  return FixedColumns;
});
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery', 'datatables.net'], function ($) {
      return factory($, window, document);
    });
  } else if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') {
    module.exports = function (root, $) {
      if (!root) {
        root = window;
      }

      if (!$ || !$.fn.dataTable) {
        $ = require('datatables.net')(root, $).$;
      }

      return factory($, root, root.document);
    };
  } else {
    factory(jQuery, window, document);
  }
})(function ($, window, document, undefined) {
  'use strict';

  var DataTable = $.fn.dataTable;
  var _instCounter = 0;

  var FixedHeader = function FixedHeader(dt, config) {
    if (!(this instanceof FixedHeader)) {
      throw "FixedHeader must be initialised with the 'new' keyword.";
    }

    if (config === true) {
      config = {};
    }

    dt = new DataTable.Api(dt);
    this.c = $.extend(true, {}, FixedHeader.defaults, config);
    this.s = {
      dt: dt,
      position: {
        theadTop: 0,
        tbodyTop: 0,
        tfootTop: 0,
        tfootBottom: 0,
        width: 0,
        left: 0,
        tfootHeight: 0,
        theadHeight: 0,
        windowHeight: $(window).height(),
        visible: true
      },
      headerMode: null,
      footerMode: null,
      autoWidth: dt.settings()[0].oFeatures.bAutoWidth,
      namespace: '.dtfc' + _instCounter++,
      scrollLeft: {
        header: -1,
        footer: -1
      },
      enable: true
    };
    this.dom = {
      floatingHeader: null,
      thead: $(dt.table().header()),
      tbody: $(dt.table().body()),
      tfoot: $(dt.table().footer()),
      header: {
        host: null,
        floating: null,
        placeholder: null
      },
      footer: {
        host: null,
        floating: null,
        placeholder: null
      }
    };
    this.dom.header.host = this.dom.thead.parent();
    this.dom.footer.host = this.dom.tfoot.parent();
    var dtSettings = dt.settings()[0];

    if (dtSettings._fixedHeader) {
      throw "FixedHeader already initialised on table " + dtSettings.nTable.id;
    }

    dtSettings._fixedHeader = this;

    this._constructor();
  };

  $.extend(FixedHeader.prototype, {
    enable: function enable(_enable) {
      this.s.enable = _enable;

      if (this.c.header) {
        this._modeChange('in-place', 'header', true);
      }

      if (this.c.footer && this.dom.tfoot.length) {
        this._modeChange('in-place', 'footer', true);
      }

      this.update();
    },
    headerOffset: function headerOffset(offset) {
      if (offset !== undefined) {
        this.c.headerOffset = offset;
        this.update();
      }

      return this.c.headerOffset;
    },
    footerOffset: function footerOffset(offset) {
      if (offset !== undefined) {
        this.c.footerOffset = offset;
        this.update();
      }

      return this.c.footerOffset;
    },
    update: function update() {
      this._positions();

      this._scroll(true);
    },
    _constructor: function _constructor() {
      var that = this;
      var dt = this.s.dt;
      $(window).on('scroll' + this.s.namespace, function () {
        that._scroll();
      }).on('resize' + this.s.namespace, DataTable.util.throttle(function () {
        that.s.position.windowHeight = $(window).height();
        that.update();
      }, 50));
      var autoHeader = $('.fh-fixedHeader');

      if (!this.c.headerOffset && autoHeader.length) {
        this.c.headerOffset = autoHeader.outerHeight();
      }

      var autoFooter = $('.fh-fixedFooter');

      if (!this.c.footerOffset && autoFooter.length) {
        this.c.footerOffset = autoFooter.outerHeight();
      }

      dt.on('column-reorder.dt.dtfc column-visibility.dt.dtfc draw.dt.dtfc column-sizing.dt.dtfc responsive-display.dt.dtfc', function () {
        that.update();
      });
      dt.on('destroy.dtfc', function () {
        if (that.c.header) {
          that._modeChange('in-place', 'header', true);
        }

        if (that.c.footer && that.dom.tfoot.length) {
          that._modeChange('in-place', 'footer', true);
        }

        dt.off('.dtfc');
        $(window).off(that.s.namespace);
      });

      this._positions();

      this._scroll();
    },
    _clone: function _clone(item, force) {
      var dt = this.s.dt;
      var itemDom = this.dom[item];
      var itemElement = item === 'header' ? this.dom.thead : this.dom.tfoot;

      if (!force && itemDom.floating) {
        itemDom.floating.removeClass('fixedHeader-floating fixedHeader-locked');
      } else {
        if (itemDom.floating) {
          itemDom.placeholder.remove();

          this._unsize(item);

          itemDom.floating.children().detach();
          itemDom.floating.remove();
        }

        itemDom.floating = $(dt.table().node().cloneNode(false)).css('table-layout', 'fixed').attr('aria-hidden', 'true').removeAttr('id').append(itemElement).appendTo('body');
        itemDom.placeholder = itemElement.clone(false);
        itemDom.placeholder.find('*[id]').removeAttr('id');
        itemDom.host.prepend(itemDom.placeholder);

        this._matchWidths(itemDom.placeholder, itemDom.floating);
      }
    },
    _matchWidths: function _matchWidths(from, to) {
      var get = function get(name) {
        return $(name, from).map(function () {
          return $(this).width();
        }).toArray();
      };

      var set = function set(name, toWidths) {
        $(name, to).each(function (i) {
          $(this).css({
            width: toWidths[i],
            minWidth: toWidths[i]
          });
        });
      };

      var thWidths = get('th');
      var tdWidths = get('td');
      set('th', thWidths);
      set('td', tdWidths);
    },
    _unsize: function _unsize(item) {
      var el = this.dom[item].floating;

      if (el && (item === 'footer' || item === 'header' && !this.s.autoWidth)) {
        $('th, td', el).css({
          width: '',
          minWidth: ''
        });
      } else if (el && item === 'header') {
        $('th, td', el).css('min-width', '');
      }
    },
    _horizontal: function _horizontal(item, scrollLeft) {
      var itemDom = this.dom[item];
      var position = this.s.position;
      var lastScrollLeft = this.s.scrollLeft;

      if (itemDom.floating && lastScrollLeft[item] !== scrollLeft) {
        itemDom.floating.css('left', position.left - scrollLeft);
        lastScrollLeft[item] = scrollLeft;
      }
    },
    _modeChange: function _modeChange(mode, item, forceChange) {
      var dt = this.s.dt;
      var itemDom = this.dom[item];
      var position = this.s.position;
      var tablePart = this.dom[item === 'footer' ? 'tfoot' : 'thead'];
      var focus = $.contains(tablePart[0], document.activeElement) ? document.activeElement : null;

      if (focus) {
        focus.blur();
      }

      if (mode === 'in-place') {
        if (itemDom.placeholder) {
          itemDom.placeholder.remove();
          itemDom.placeholder = null;
        }

        this._unsize(item);

        if (item === 'header') {
          itemDom.host.prepend(tablePart);
        } else {
          itemDom.host.append(tablePart);
        }

        if (itemDom.floating) {
          itemDom.floating.remove();
          itemDom.floating = null;
        }
      } else if (mode === 'in') {
        this._clone(item, forceChange);

        itemDom.floating.addClass('fixedHeader-floating').css(item === 'header' ? 'top' : 'bottom', this.c[item + 'Offset']).css('left', position.left + 'px').css('width', position.width + 'px');

        if (item === 'footer') {
          itemDom.floating.css('top', '');
        }
      } else if (mode === 'below') {
        this._clone(item, forceChange);

        itemDom.floating.addClass('fixedHeader-locked').css('top', position.tfootTop - position.theadHeight).css('left', position.left + 'px').css('width', position.width + 'px');
      } else if (mode === 'above') {
        this._clone(item, forceChange);

        itemDom.floating.addClass('fixedHeader-locked').css('top', position.tbodyTop).css('left', position.left + 'px').css('width', position.width + 'px');
      }

      if (focus && focus !== document.activeElement) {
        setTimeout(function () {
          focus.focus();
        }, 10);
      }

      this.s.scrollLeft.header = -1;
      this.s.scrollLeft.footer = -1;
      this.s[item + 'Mode'] = mode;
    },
    _positions: function _positions() {
      var dt = this.s.dt;
      var table = dt.table();
      var position = this.s.position;
      var dom = this.dom;
      var tableNode = $(table.node());
      var thead = tableNode.children('thead');
      var tfoot = tableNode.children('tfoot');
      var tbody = dom.tbody;
      position.visible = tableNode.is(':visible');
      position.width = tableNode.outerWidth();
      position.left = tableNode.offset().left;
      position.theadTop = thead.offset().top;
      position.tbodyTop = tbody.offset().top;
      position.theadHeight = position.tbodyTop - position.theadTop;

      if (tfoot.length) {
        position.tfootTop = tfoot.offset().top;
        position.tfootBottom = position.tfootTop + tfoot.outerHeight();
        position.tfootHeight = position.tfootBottom - position.tfootTop;
      } else {
        position.tfootTop = position.tbodyTop + tbody.outerHeight();
        position.tfootBottom = position.tfootTop;
        position.tfootHeight = position.tfootTop;
      }
    },
    _scroll: function _scroll(forceChange) {
      var windowTop = $(document).scrollTop();
      var windowLeft = $(document).scrollLeft();
      var position = this.s.position;
      var headerMode, footerMode;

      if (!this.s.enable) {
        return;
      }

      if (this.c.header) {
        if (!position.visible || windowTop <= position.theadTop - this.c.headerOffset) {
          headerMode = 'in-place';
        } else if (windowTop <= position.tfootTop - position.theadHeight - this.c.headerOffset) {
          headerMode = 'in';
        } else {
          headerMode = 'below';
        }

        if (forceChange || headerMode !== this.s.headerMode) {
          this._modeChange(headerMode, 'header', forceChange);
        }

        this._horizontal('header', windowLeft);
      }

      if (this.c.footer && this.dom.tfoot.length) {
        if (!position.visible || windowTop + position.windowHeight >= position.tfootBottom + this.c.footerOffset) {
          footerMode = 'in-place';
        } else if (position.windowHeight + windowTop > position.tbodyTop + position.tfootHeight + this.c.footerOffset) {
          footerMode = 'in';
        } else {
          footerMode = 'above';
        }

        if (forceChange || footerMode !== this.s.footerMode) {
          this._modeChange(footerMode, 'footer', forceChange);
        }

        this._horizontal('footer', windowLeft);
      }
    }
  });
  FixedHeader.version = "3.1.4";
  FixedHeader.defaults = {
    header: true,
    footer: false,
    headerOffset: 0,
    footerOffset: 0
  };
  $.fn.dataTable.FixedHeader = FixedHeader;
  $.fn.DataTable.FixedHeader = FixedHeader;
  $(document).on('init.dt.dtfh', function (e, settings, json) {
    if (e.namespace !== 'dt') {
      return;
    }

    var init = settings.oInit.fixedHeader;
    var defaults = DataTable.defaults.fixedHeader;

    if ((init || defaults) && !settings._fixedHeader) {
      var opts = $.extend({}, defaults, init);

      if (init !== false) {
        new FixedHeader(settings, opts);
      }
    }
  });
  DataTable.Api.register('fixedHeader()', function () {});
  DataTable.Api.register('fixedHeader.adjust()', function () {
    return this.iterator('table', function (ctx) {
      var fh = ctx._fixedHeader;

      if (fh) {
        fh.update();
      }
    });
  });
  DataTable.Api.register('fixedHeader.enable()', function (flag) {
    return this.iterator('table', function (ctx) {
      var fh = ctx._fixedHeader;
      flag = flag !== undefined ? flag : true;

      if (fh && flag !== fh.s.enable) {
        fh.enable(flag);
      }
    });
  });
  DataTable.Api.register('fixedHeader.disable()', function () {
    return this.iterator('table', function (ctx) {
      var fh = ctx._fixedHeader;

      if (fh && fh.s.enable) {
        fh.enable(false);
      }
    });
  });
  $.each(['header', 'footer'], function (i, el) {
    DataTable.Api.register('fixedHeader.' + el + 'Offset()', function (offset) {
      var ctx = this.context;

      if (offset === undefined) {
        return ctx.length && ctx[0]._fixedHeader ? ctx[0]._fixedHeader[el + 'Offset']() : undefined;
      }

      return this.iterator('table', function (ctx) {
        var fh = ctx._fixedHeader;

        if (fh) {
          fh[el + 'Offset'](offset);
        }
      });
    });
  });
  return FixedHeader;
});