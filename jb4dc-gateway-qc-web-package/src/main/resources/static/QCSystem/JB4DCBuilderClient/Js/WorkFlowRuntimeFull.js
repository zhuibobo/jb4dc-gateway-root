"use strict";

var ActionsRuntimeObject = {
  CreateALLActionButton: function CreateALLActionButton(isStartInstanceStatus, formRuntimeInst, pageHostInstance, pageReadyInnerParas) {
    if (pageReadyInnerParas.jb4dcActions && pageReadyInnerParas.jb4dcActions.jb4dcActionList) {
      var buttonElem;

      for (var i = 0; i < pageReadyInnerParas.jb4dcActions.jb4dcActionList.length; i++) {
        var actionObj = pageReadyInnerParas.jb4dcActions.jb4dcActionList[i];

        if (actionObj.juelRunResultPO.booleanResult) {
          if (actionObj.actionType == "send") {
            var sendActionObject = Object.create(SendAction);
            buttonElem = sendActionObject.Instance(isStartInstanceStatus, formRuntimeInst, pageHostInstance, pageReadyInnerParas, actionObj);
          } else if (actionObj.actionType == "recall") {
            var callbackActionObject = Object.create(RecallAction);
            buttonElem = callbackActionObject.Instance(isStartInstanceStatus, formRuntimeInst, pageHostInstance, pageReadyInnerParas, actionObj);
          } else if (actionObj.actionType == "deleteInstance") {
            var deleteInstanceActionObject = Object.create(DeleteInstanceAction);
            buttonElem = deleteInstanceActionObject.Instance(isStartInstanceStatus, formRuntimeInst, pageHostInstance, pageReadyInnerParas, actionObj);
          }

          $("#flowWorkActionButtonWrapOuter").append(buttonElem.elem);
        }
      }
    }
  },
  GetActionObj: function GetActionObj() {
    return {
      actionAutoSend: "false",
      actionCCReceiveObjects: "[]",
      actionCallApis: "[]",
      actionCallComplete: "true",
      actionCallJsMethod: null,
      actionCaption: "草稿",
      actionCode: "action_516009775",
      actionConfirm: "false",
      actionDisplayConditionEditText: null,
      actionDisplayConditionEditValue: null,
      actionExecuteVariables: "[]",
      actionHTMLClass: null,
      actionHTMLId: null,
      actionMainReceiveObjects: "[]",
      actionRunSqls: "[]",
      actionSendMessageId: null,
      actionSendSignalId: null,
      actionShowOpinionDialog: "false",
      actionType: "send",
      actionUpdateFields: "[]",
      actionValidate: "无",
      actionOpinionBindToElemId: null,
      actionOpinionBindToField: null,
      juelRunResultPO: {
        booleanResult: true,
        message: "",
        stringResult: "",
        success: true
      },
      actionDisable: "enable",
      actionRemark: ""
    };
  }
};
"use strict";

var FlowRuntimePageObject = {
  _webFormRTParas: null,
  _formRuntimeInst: null,
  FORM_RUNTIME_CATEGORY_FLOW: "IsDependenceFlow",
  _flowInstanceRuntimePO: null,
  _isCreatedModelerView: false,
  buildPageReadyInnerParas: function buildPageReadyInnerParas(isStartInstanceStatus, recordId, flowInstanceRuntimePO, flowInstanceRuntimePOCacheKey) {
    return {
      recordId: recordId,
      formId: flowInstanceRuntimePO.jb4dcFormId,
      currentNodeKey: flowInstanceRuntimePO.currentNodeKey,
      currentNodeName: flowInstanceRuntimePO.currentNodeName,
      modelId: flowInstanceRuntimePO.modelIntegratedEntity.modelId,
      modelReKey: flowInstanceRuntimePO.modelIntegratedEntity.modelReKey,
      currentTaskId: flowInstanceRuntimePO.executionTaskEntity ? flowInstanceRuntimePO.executionTaskEntity.extaskId : "",
      flowInstanceRuntimePOCacheKey: flowInstanceRuntimePOCacheKey,
      flowInstanceRuntimePO: flowInstanceRuntimePO,
      isStartInstanceStatus: isStartInstanceStatus,
      jb4dcActions: flowInstanceRuntimePO.jb4dcActions
    };
  },
  pageReadyForStartStatus: function pageReadyForStartStatus(isStartInstanceStatus, flowInstanceRuntimePO, flowInstanceRuntimePOCacheKey, pageHostInstance) {
    this._formRuntimeInst = Object.create(FormRuntime);
    FlowRuntimePageObject._flowInstanceRuntimePO = flowInstanceRuntimePO;
    var recordId = StringUtility.Guid();
    var pageReadyInnerParas = this.buildPageReadyInnerParas(isStartInstanceStatus, recordId, flowInstanceRuntimePO, flowInstanceRuntimePOCacheKey);

    this._formRuntimeInst.Initialization({
      "InstanceId": flowInstanceRuntimePO.instanceEntity.instId,
      "RendererToId": "htmlDesignRuntimeWrap",
      "FormId": pageReadyInnerParas.formId,
      "RecordId": recordId,
      "ButtonId": "",
      "OperationType": BaseUtility.GetAddOperationName(),
      "IsPreview": false,
      "RendererChainCompletedFunc": FlowRuntimePageObject.formRendererChainCompletedFunc,
      "ListFormButtonElemId": "",
      "WebFormRTParas": {},
      "FormRuntimeCategory": FlowRuntimePageObject.FORM_RUNTIME_CATEGORY_FLOW,
      "PreHandleFormHtmlRuntimeFunc": this.preHandleFormHtmlRuntimeFunc,
      "FlowInstanceRuntimePO": flowInstanceRuntimePO,
      "FlowModelRuntimePOCacheKey": pageReadyInnerParas.flowInstanceRuntimePOCacheKey,
      "IsStartInstanceStatus": isStartInstanceStatus,
      "CurrentNodeKey": pageReadyInnerParas.currentNodeKey,
      "CurrentNodeName": pageReadyInnerParas.currentNodeName,
      "ModelId": pageReadyInnerParas.modelId,
      "ModelReKey": pageReadyInnerParas.modelReKey,
      "CurrentTaskId": ""
    });

    this.rendererActionButtons(isStartInstanceStatus, this._formRuntimeInst, pageHostInstance, pageReadyInnerParas);
    return this._formRuntimeInst;
  },
  pageReadyForProcessStatus: function pageReadyForProcessStatus(isStartInstanceStatus, flowInstanceRuntimePO, flowInstanceRuntimePOCacheKey, pageHostInstance) {
    this._formRuntimeInst = Object.create(FormRuntime);
    FlowRuntimePageObject._flowInstanceRuntimePO = flowInstanceRuntimePO;
    var recordId = flowInstanceRuntimePO.instanceEntity.instRuBusinessKey;
    var pageReadyInnerParas = this.buildPageReadyInnerParas(isStartInstanceStatus, recordId, flowInstanceRuntimePO, flowInstanceRuntimePOCacheKey);

    this._formRuntimeInst.Initialization({
      "InstanceId": flowInstanceRuntimePO.instanceEntity.instId,
      "RendererToId": "htmlDesignRuntimeWrap",
      "FormId": pageReadyInnerParas.formId,
      "RecordId": recordId,
      "ButtonId": "",
      "OperationType": BaseUtility.GetUrlOPParaValue(),
      "IsPreview": false,
      "RendererChainCompletedFunc": FlowRuntimePageObject.formRendererChainCompletedFunc,
      "ListFormButtonElemId": "",
      "WebFormRTParas": {},
      "FormRuntimeCategory": FlowRuntimePageObject.FORM_RUNTIME_CATEGORY_FLOW,
      "PreHandleFormHtmlRuntimeFunc": this.preHandleFormHtmlRuntimeFunc,
      "FlowInstanceRuntimePO": flowInstanceRuntimePO,
      "FlowModelRuntimePOCacheKey": pageReadyInnerParas.flowInstanceRuntimePOCacheKey,
      "IsStartInstanceStatus": isStartInstanceStatus,
      "CurrentNodeKey": pageReadyInnerParas.currentNodeKey,
      "CurrentNodeName": pageReadyInnerParas.currentNodeName,
      "ModelId": pageReadyInnerParas.modelId,
      "ModelReKey": pageReadyInnerParas.modelReKey,
      "CurrentTaskId": ""
    });

    this.rendererActionButtons(isStartInstanceStatus, this._formRuntimeInst, pageHostInstance, pageReadyInnerParas);
    return this._formRuntimeInst;
  },
  rendererActionButtons: function rendererActionButtons(isStartInstanceStatus, formRuntimeInst, pageHostInstance, pageReadyInnerParas) {
    ActionsRuntimeObject.CreateALLActionButton(isStartInstanceStatus, formRuntimeInst, pageHostInstance, pageReadyInnerParas);
  },
  rendererFlowModelerForTabOnActivity: function rendererFlowModelerForTabOnActivity(event, ui) {
    if (!FlowRuntimePageObject._isCreatedModelerView) {
      CreateModelerView(FlowRuntimePageObject._flowInstanceRuntimePO);
      FlowRuntimePageObject._isCreatedModelerView = true;
    }
  },
  rendererFlowFileContainer: function rendererFlowFileContainer(flowInstanceRuntimePO) {
    FlowFilesListSinglePlugin.Renderer();
  },
  formRendererChainCompletedFunc: function formRendererChainCompletedFunc(senderConfig) {
    var flowInstanceRuntimePO = senderConfig.flowInstanceRuntimePO;
    FlowRuntimePageObject.rendererFlowFileContainer(flowInstanceRuntimePO);
  },
  preHandleFormHtmlRuntimeFunc: function preHandleFormHtmlRuntimeFunc(sourceRuntimeHtml, formRuntimeInst, propConfig) {
    var flowPageContainer = $("<div>" + sourceRuntimeHtml + "<div>");
    var flowInstanceRuntimePO = propConfig.FlowInstanceRuntimePO;

    if (flowPageContainer.children("[singlename='WFDCT_TabContainer']").length == 0) {
      flowPageContainer = $("<div><div class=\"wfdct-tabs-outer-wrap-runtime html-design-theme-default-root-elem-class\" control_category=\"ContainerControl\" desc=\"\" groupname=\"\" id=\"tabs_wrap_518627616\" is_jbuild4dc_data=\"false\" jbuild4dc_custom=\"true\" name=\"tabs_wrap_518627616\" placeholder=\"\" serialize=\"false\" show_remove_button=\"false\" singlename=\"WFDCT_TabContainer\" status=\"enable\" style=\"\" client_resolve=\"WFDCT_TabContainer\"><div>");
      flowPageContainer.children("[singlename='WFDCT_TabContainer']").append("<div class=\"wysiwyg-wfdct-tabs-label wfdct-tabs-label-runtime\" tab_id=\"tab_content_flow_form_999\">" + flowInstanceRuntimePO.modelName + "</div>");
      flowPageContainer.children("[singlename='WFDCT_TabContainer']").append("<div class=\"wysiwyg-wfdct-tabs-content wfdct-tabs-content-runtime\" id=\"tab_content_flow_form_999\">" + sourceRuntimeHtml + "</div>");
    }

    var tabContainer = flowPageContainer.children("[singlename='WFDCT_TabContainer']");

    if (flowInstanceRuntimePO.jb4dcContentDocumentPlugin == "uploadConvertToPDFPlugin") {
      tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-label wfdct-tabs-label-runtime\" tab_id=\"tab_content_uploadConvertToPDFPlugin_999\">正文</div>");
      tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-content wfdct-tabs-content-runtime\" id=\"tab_content_uploadConvertToPDFPlugin_999\">" + DocumentContentUploadConvertToPDFPlugin.GetHtmlElem(propConfig) + "</div>");
    } else if (flowInstanceRuntimePO.jb4dcContentDocumentPlugin == "wpsOnlineDocumentPlugin") {
      tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-label wfdct-tabs-label-runtime\" tab_id=\"tab_content_wpsOnlineDocumentPlugin_999\">正文</div>");
      tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-content wfdct-tabs-content-runtime\" id=\"tab_content_wpsOnlineDocumentPlugin_999\">未实现</div>");
    }

    tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-label wfdct-tabs-label-runtime\" tab_id=\"tab_content_flow_files_999\">附件</div>");
    tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-content wfdct-tabs-content-runtime\" id=\"tab_content_flow_files_999\">" + FlowFilesListSinglePlugin.GetHtmlElem(propConfig) + "</div>");
    tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-label wfdct-tabs-label-runtime\" tab_id=\"tab_content_flow_modeler_999\">流程图</div>");
    tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-content wfdct-tabs-content-runtime\" id=\"tab_content_flow_modeler_999\" style='height: calc(100% - 50px);' onActivity=\"FlowRuntimePageObject.rendererFlowModelerForTabOnActivity\"><div id=\"flow-canvas\" style=\"height:100%;\"></div></div>");
    tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-label wfdct-tabs-label-runtime\" tab_id=\"tab_content_flow_task_999\">流转信息</div>");
    tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-content wfdct-tabs-content-runtime\" id=\"tab_content_flow_task_999\">" + InstanceExTaskListPlugin.GetHtmlElem(propConfig) + "</div>");
    var newRuntimeHtml = flowPageContainer.html();
    return newRuntimeHtml;
  },
  changeTaskToView: function changeTaskToView(executionTaskEntity) {
    console.log("1111111111111111111");
    AjaxUtility.Post("/Rest/Workflow/RunTime/Client/InstanceRuntime/ChangeTaskToView", {
      extaskId: executionTaskEntity.extaskId
    }, function (result) {}, this);
  }
};
"use strict";

var FlowRuntimeVarBuilder = {
  BuilderSelectedReceiverToInstanceVar: function BuilderSelectedReceiverToInstanceVar(nextFlowNodeEntities, selectedReceiverData) {
    var resultData = [];

    for (var i = 0; i < selectedReceiverData.length; i++) {
      var receiver = selectedReceiverData[i];
      resultData.push({
        nextNodeId: receiver.flowNodeEntity.id,
        receiverId: receiver.id,
        receiverName: receiver.name,
        receiverTypeName: receiver.typeName,
        receiveType: receiver.receiveType
      });
    }

    return resultData;
  }
};
"use strict";

var DeleteInstanceAction = {
  acInterface: {},
  _Prop: {},
  Instance: function Instance(isStartInstanceStatus, formRuntimeInst, pageHostInstance, pageReadyInnerParas, actionObj) {
    var htmlId = actionObj.actionHTMLId ? actionObj.actionHTMLId : actionObj.actionCode;
    var elem = $('<button type="button" class="operation-button operation-button-primary" id="' + htmlId + '"><span>' + actionObj.actionCaption + '</span></button>');

    if (actionObj.actionDisable == "disable") {
      elem.attr("disable", "disable");
      elem.addClass("operation-button-primary-disabled");
    } else {
      this._Prop = {
        "sender": this,
        "flowInstanceRuntimePO": pageReadyInnerParas.flowInstanceRuntimePO,
        "flowInstanceRuntimePOCacheKey": pageReadyInnerParas.flowInstanceRuntimePOCacheKey,
        "jb4dcActions": pageReadyInnerParas.jb4dcActions,
        "formRuntimeInst": formRuntimeInst,
        "actionObj": actionObj,
        "isStartInstanceStatus": isStartInstanceStatus,
        "pageHostInstance": pageHostInstance,
        "currentNodeKey": pageReadyInnerParas.currentNodeKey,
        "currentNodeName": pageReadyInnerParas.currentNodeName,
        "recordId": pageReadyInnerParas.recordId,
        "modelId": pageReadyInnerParas.modelId,
        "modelReKey": pageReadyInnerParas.modelReKey,
        "currentTaskId": pageReadyInnerParas.currentTaskId,
        "instanceId": pageReadyInnerParas.flowInstanceRuntimePO.instanceEntity.instId
      };
      elem.bind("click", this._Prop, this.ButtonClickEvent);
    }

    if (actionObj.actionRemark) {
      elem.attr("title", actionObj.actionRemark);
    }

    return {
      elem: elem
    };
  },
  ButtonClickEvent: function ButtonClickEvent(sender) {
    var _this = sender.data.sender;
    DialogUtility.Confirm(window, "暂不支持该操作?", function () {
      return;
      DialogUtility.AlertLoading(window, DialogUtility.DialogLoadingId, {}, "系统处理中,请稍候!");
      AjaxUtility.Post(_this.acInterface.recallMySendTask, {
        extaskId: sender.data.currentTaskId
      }, function (result) {
        DialogUtility.CloseDialog(DialogUtility.DialogLoadingId);

        if (result.success) {
          if (window.OpenerWindowObj != null && window.OpenerWindowObj.instanceMainTaskProcessList != null) {
            window.OpenerWindowObj.instanceMainTaskProcessList.reloadData();
          }

          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {
            DialogUtility.Frame_CloseDialog(window);
          }, this);
        }
      }, _this);
    }, _this);
  }
};
"use strict";
"use strict";
"use strict";

var RecallAction = {
  acInterface: {
    recallMySendTask: "/Rest/Workflow/RunTime/Client/InstanceRuntime/RecallMySendTask"
  },
  _Prop: {},
  Instance: function Instance(isStartInstanceStatus, formRuntimeInst, pageHostInstance, pageReadyInnerParas, actionObj) {
    var htmlId = actionObj.actionHTMLId ? actionObj.actionHTMLId : actionObj.actionCode;
    var elem = $('<button type="button" class="operation-button operation-button-primary" id="' + htmlId + '"><span>' + actionObj.actionCaption + '</span></button>');

    if (actionObj.actionDisable == "disable") {
      elem.attr("disable", "disable");
      elem.addClass("operation-button-primary-disabled");
    } else {
      this._Prop = {
        "sender": this,
        "flowInstanceRuntimePO": pageReadyInnerParas.flowInstanceRuntimePO,
        "flowInstanceRuntimePOCacheKey": pageReadyInnerParas.flowInstanceRuntimePOCacheKey,
        "jb4dcActions": pageReadyInnerParas.jb4dcActions,
        "formRuntimeInst": formRuntimeInst,
        "actionObj": actionObj,
        "isStartInstanceStatus": isStartInstanceStatus,
        "pageHostInstance": pageHostInstance,
        "currentNodeKey": pageReadyInnerParas.currentNodeKey,
        "currentNodeName": pageReadyInnerParas.currentNodeName,
        "recordId": pageReadyInnerParas.recordId,
        "modelId": pageReadyInnerParas.modelId,
        "modelReKey": pageReadyInnerParas.modelReKey,
        "currentTaskId": pageReadyInnerParas.currentTaskId,
        "instanceId": pageReadyInnerParas.flowInstanceRuntimePO.instanceEntity.instId
      };
      elem.bind("click", this._Prop, this.ButtonClickEvent);
    }

    if (actionObj.actionRemark) {
      elem.attr("title", actionObj.actionRemark);
    }

    return {
      elem: elem
    };
  },
  ButtonClickEvent: function ButtonClickEvent(sender) {
    var _this = sender.data.sender;
    DialogUtility.Confirm(window, "确认执行撤回操作?", function () {
      DialogUtility.AlertLoading(window, DialogUtility.DialogLoadingId, {}, "系统处理中,请稍候!");
      AjaxUtility.Post(_this.acInterface.recallMySendTask, {
        extaskId: sender.data.currentTaskId
      }, function (result) {
        DialogUtility.CloseDialog(DialogUtility.DialogLoadingId);

        if (result.success) {
          if (window.OpenerWindowObj != null && window.OpenerWindowObj.instanceMainTaskProcessList != null) {
            window.OpenerWindowObj.instanceMainTaskProcessList.reloadData();
          }

          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {
            DialogUtility.Frame_CloseDialog(window);
          }, this);
        }
      }, _this);
    }, _this);
  }
};
"use strict";

var SendAction = {
  acInterface: {
    resolveNextPossibleFlowNode: "/Rest/Workflow/RunTime/Client/InstanceRuntime/ResolveNextPossibleFlowNode",
    completeTask: "/Rest/Workflow/RunTime/Client/InstanceRuntime/CompleteTask"
  },
  _Prop: {},
  newOpinionList: [],
  inputOpinionText: null,
  Instance: function Instance(isStartInstanceStatus, formRuntimeInst, pageHostInstance, pageReadyInnerParas, actionObj) {
    var htmlId = actionObj.actionHTMLId ? actionObj.actionHTMLId : actionObj.actionCode;
    var elem = $('<button type="button" class="operation-button operation-button-primary" id="' + htmlId + '"><span>' + actionObj.actionCaption + '</span></button>');
    this._Prop = {
      "sender": this,
      "flowInstanceRuntimePO": pageReadyInnerParas.flowInstanceRuntimePO,
      "flowInstanceRuntimePOCacheKey": pageReadyInnerParas.flowInstanceRuntimePOCacheKey,
      "jb4dcActions": pageReadyInnerParas.jb4dcActions,
      "formRuntimeInst": formRuntimeInst,
      "actionObj": actionObj,
      "isStartInstanceStatus": isStartInstanceStatus,
      "pageHostInstance": pageHostInstance,
      "currentNodeKey": pageReadyInnerParas.currentNodeKey,
      "currentNodeName": pageReadyInnerParas.currentNodeName,
      "recordId": pageReadyInnerParas.recordId,
      "modelId": pageReadyInnerParas.modelId,
      "modelReKey": pageReadyInnerParas.modelReKey,
      "currentTaskId": pageReadyInnerParas.currentTaskId,
      "instanceId": pageReadyInnerParas.flowInstanceRuntimePO.instanceEntity.instId,
      "actionShowOpinionDialog": actionObj.actionShowOpinionDialog,
      "actionOpinionBindToField": actionObj.actionOpinionBindToField,
      "actionOpinionBindToElemId": actionObj.actionOpinionBindToElemId
    };
    elem.bind("click", this._Prop, this.ButtonClickEvent);
    return {
      elem: elem
    };
  },
  TryGetOpinionBindToControlInstance: function TryGetOpinionBindToControlInstance(_prop) {
    var actionOpinionBindToElemId = _prop.actionOpinionBindToElemId;
    var actionOpinionBindToField = _prop.actionOpinionBindToField;
    var controlElem;

    if (actionOpinionBindToElemId) {
      controlElem = $("#" + actionOpinionBindToElemId);
    }

    if (controlElem && controlElem.length > 0) {
      return HTMLControl.GetControlInstanceByElem(controlElem);
    } else {
      controlElem = $("[fieldname='" + actionOpinionBindToField + "']");
    }

    if (controlElem && controlElem.length > 0) {
      return HTMLControl.GetControlInstanceByElem(controlElem);
    }

    return null;
  },
  ButtonClickEvent: function ButtonClickEvent(sender) {
    console.log(window);
    console.log(window.OpenerWindowObj);
    portletUtility.updateRefreshVersion();
    return;
    var validateResult = ValidateRulesRuntime.ValidateSubmitEnable();

    if (ValidateRulesRuntime.AlertValidateErrors(validateResult)) {
      var _prop = sender.data;
      var _this = _prop.sender;
      var actionShowOpinionDialog = _prop.actionShowOpinionDialog;

      if (actionShowOpinionDialog == "true") {
        DialogUtility.Prompt(window, {
          title: "系统提示",
          height: 300,
          width: 400
        }, DialogUtility.DialogPromptId, "请输入处理意见", function (inputText) {
          var opinionBindToControlInstance = _this.TryGetOpinionBindToControlInstance(_prop);

          if (opinionBindToControlInstance != null) {
            if (typeof opinionBindToControlInstance.SetNewValue == "function") {
              opinionBindToControlInstance.SetNewValue(inputText);
              _this.inputOpinionText = inputText;

              _this.BeginSelectReceiver(_this, _prop);
            } else {
              DialogUtility.AlertText("意见关联对象为实现SetNewValue方法!!");
            }
          }
        });
      } else {
        _this.BeginSelectReceiver(_this, _prop);
      }
    }
  },
  BeginSelectReceiver: function BeginSelectReceiver(_this, _prop) {
    DialogUtility.AlertLoading(window, DialogUtility.DialogLoadingId, {}, "");

    var sendData = _this.BuildSendToServerData(_prop, null);

    if (sendData.success) {
      AjaxUtility.Post(_this.acInterface.resolveNextPossibleFlowNode, sendData.data, function (result) {
        DialogUtility.CloseDialog(DialogUtility.DialogLoadingId);
        console.log(result);

        if (result.data.nextTaskIsEndEvent) {
          this.SelectReceiverCompleted(result.data.bpmnTaskList, []);
        } else if (result.data.currentTaskIsMultiInstance && result.data.currentTaskMultiCompletedInstances + 1 < result.data.currentTaskMultiCountEngInstances) {
          this.SelectReceiverCompleted(result.data.bpmnTaskList, []);
        } else {
          UserTaskReceiverDialogUtility.ShowDialog(_prop.sender, result.data.bpmnTaskList, _prop.sender.SelectReceiverCompleted);
        }
      }, _prop.sender);
    }
  },
  SelectReceiverCompleted: function SelectReceiverCompleted(nextTaskEntityList, selectedReceiverData) {
    DialogUtility.Confirm(window, "确认执行发送?", function () {
      var selectedReceiverVars = FlowRuntimeVarBuilder.BuilderSelectedReceiverToInstanceVar(nextTaskEntityList, selectedReceiverData);

      if (this.inputOpinionText != null) {
        this.newOpinionList.push(this.BuildNewOpinion(this.inputOpinionText));
      }

      var sendData = this.BuildSendToServerData(this._Prop, {
        selectedReceiverVars: encodeURIComponent(JsonUtility.JsonToString(selectedReceiverVars)),
        newOpinionListString: encodeURIComponent(JsonUtility.JsonToString(this.newOpinionList))
      });

      if (sendData.success) {
        DialogUtility.AlertLoading(window, DialogUtility.DialogLoadingId, {}, "系统处理中,请稍候!");
        AjaxUtility.Post(this.acInterface.completeTask, sendData.data, function (result) {
          DialogUtility.CloseDialog(DialogUtility.DialogLoadingId);

          if (result.success) {
            if (window.OpenerWindowObj != null && window.OpenerWindowObj.instanceMainTaskProcessList != null) {
              window.OpenerWindowObj.instanceMainTaskProcessList.reloadData();
            }

            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {
              DialogUtility.Frame_CloseDialog(window);
            }, this);
          } else {
            DialogUtility.AlertError(window, DialogUtility.DialogAlertErrorId, {}, result.data.message);
          }
        }, this._Prop.sender);
      }
    }, this);
  },
  BuildSendToServerData: function BuildSendToServerData(_prop, appendSendMap) {
    var formDataComplexPO = _prop.formRuntimeInst.SerializationFormData();

    var result = {
      success: true,
      data: {
        isStartInstanceStatus: _prop.isStartInstanceStatus,
        actionCode: _prop.actionObj.actionCode,
        flowInstanceRuntimePOCacheKey: _prop.flowInstanceRuntimePOCacheKey,
        "formRecordComplexPOString": encodeURIComponent(JsonUtility.JsonToString(formDataComplexPO)),
        "currentNodeKey": _prop.currentNodeKey,
        "currentNodeName": _prop.currentNodeName,
        "recordId": _prop.recordId,
        "modelId": _prop.modelId,
        "modelReKey": _prop.modelReKey,
        "currentTaskId": _prop.currentTaskId,
        "instanceId": _prop.instanceId,
        "newOpinionListString": ""
      }
    };

    if (appendSendMap) {
      for (var key in appendSendMap) {
        result.data[key] = appendSendMap[key];
      }
    }

    return result;
  },
  BuildNewOpinion: function BuildNewOpinion(opinionText) {
    return {
      opinionText: opinionText,
      opinionClientCode: StringUtility.Timestamp()
    };
  }
};
"use strict";
"use strict";

var userTaskReceiverDialogOuterVue;
var UserTaskReceiverDialogUtility = {
  ShowDialog: function ShowDialog(sender, nextFlowNodeEntities, selectReceiverCompletedFunc) {
    if (!userTaskReceiverDialogOuterVue) {
      $(document.body).append("<div id='userTaskReceiverDialogOuter'><user-task-receiver-dialog ref='userTaskReceiverDialog'></user-task-receiver-dialog></div>");
      userTaskReceiverDialogOuterVue = new Vue({
        el: "#userTaskReceiverDialogOuter",
        data: {
          acInterface: {
            getRuntimeModelWithStart: "/Rest/Workflow/RunTime/Client/ModelRuntime/GetRuntimeModelWithStart"
          }
        },
        mounted: function mounted() {},
        methods: {}
      });
    }

    userTaskReceiverDialogOuterVue.$refs.userTaskReceiverDialog.beginSelectReceiver(sender, nextFlowNodeEntities, selectReceiverCompletedFunc);
  },
  CloseDialog: function CloseDialog() {
    DialogUtility.CloseDialogElem(userTaskReceiverDialogOuterVue.$refs.userTaskReceiverDialog.$refs.userTaskReceiverDialogWrap);
    userTaskReceiverDialogOuterVue = null;
    $("#userTaskReceiverDialogOuter").remove();
    DialogUtility.RemoveDialogRemainingElem("userTaskReceiverDialogInner");
  }
};
Vue.component("user-task-receiver-dialog", {
  data: function data() {
    return {
      acInterface: {},
      nextFlowNodeEntities: [],
      receiverTree: {
        treeSetting: {
          view: {
            dblClickExpand: false,
            showLine: true,
            fontCss: {
              'color': 'black',
              'font-weight': 'normal'
            }
          },
          check: {
            enable: false,
            nocheckInherit: false,
            radioType: "all"
          },
          async: {
            enable: true,
            contentType: "application/x-www-form-urlencoded",
            url: BaseUtility.BuildAction("/Rest/Workflow/RunTime/Client/ReceiverRuntime/GetAsyncReceivers"),
            autoParam: ["id", "typeName", "name"]
          },
          data: {
            key: {
              name: "name",
              children: "runtimeReceiveUsers"
            },
            simpleData: {
              enable: true,
              idKey: "id",
              pIdKey: "parentId",
              rootPId: null
            }
          },
          callback: {
            onClick: function onClick(event, treeId, treeNode) {},
            onDblClick: function onDblClick(event, treeId, treeNode) {
              var _this = this.getZTreeObj(treeId)._host;

              var flowNodeEntity = this.getZTreeObj(treeId).flowNodeEntity;
              var receiveType = this.getZTreeObj(treeId).receiveType;

              _this.addReceiverToSelected(treeNode, flowNodeEntity, receiveType);
            },
            beforeAsync: function beforeAsync(treeId, treeNode) {
              console.log(treeId);
            }
          }
        },
        treeObjMap: {}
      },
      selectedReceiver: {
        columnsConfig: [{
          title: '已选用户',
          key: 'name',
          width: 188,
          align: "center"
        }, {
          title: '操作',
          slot: 'action',
          width: 70,
          align: "center"
        }],
        receiverData: []
      }
    };
  },
  mounted: function mounted() {},
  filters: {
    filterReceiverData: function filterReceiverData(receiverData, flowNodeEntity, receiveType) {
      return receiverData.filter(function (receiver) {
        return receiver.flowNodeEntity.id == flowNodeEntity.id && receiver.receiveType == receiveType;
      });
    }
  },
  methods: {
    beginSelectReceiver: function beginSelectReceiver(sender, nextFlowNodeEntities, selectReceiverCompletedFunc) {
      var _this = this;

      var elem = this.$refs.userTaskReceiverDialogWrap;
      DialogUtility.DialogElemObj(elem, {
        modal: true,
        width: 650,
        height: 600,
        title: "选择接收人员",
        resizable: false,
        buttons: {
          "确认": function _() {
            if (_this.validateCompleteEnable().success) {
              selectReceiverCompletedFunc.call(sender, _this.nextFlowNodeEntities, _this.selectedReceiver.receiverData);
            }
          },
          "取消": function _() {
            UserTaskReceiverDialogUtility.CloseDialog();
          }
        },
        open: function open(event, ui) {
          $(".ui-dialog-titlebar-close", $(this).parent()).hide();
        }
      });
      this.nextFlowNodeEntities = nextFlowNodeEntities;
      window.setTimeout(this.initTree, 500);
    },
    getRootOrganMainReceiveObjects: function getRootOrganMainReceiveObjects() {
      return [{
        "value": null,
        "text": null,
        "id": "0",
        "parentId": null,
        "outerId": null,
        "code": "0000",
        "attr1": null,
        "attr2": null,
        "attr3": null,
        "attr4": null,
        "nodeTypeName": null,
        "icon": null,
        "nocheck": false,
        "isParent": "true",
        "open": false,
        "name": "组织机构管理",
        "typeName": "Organs",
        "desc": null,
        "status": "启用",
        "filter": "",
        "orderNum": 22,
        "runtimeReceiveUsers": null,
        "group": true,
        "custName": false
      }];
    },
    initTree: function initTree() {
      for (var i = 0; i < this.nextFlowNodeEntities.length; i++) {
        var flowNodeEntity = this.nextFlowNodeEntities[i];

        if (flowNodeEntity.extensionElements && flowNodeEntity.extensionElements.jb4dcMainReceiveObjects && flowNodeEntity.extensionElements.jb4dcMainReceiveObjects.runtimeReceiveGroups) {
          var treeObjKey = this.buildUlTreeId(flowNodeEntity, "main");
          this.receiverTree.treeObjMap[treeObjKey] = $.fn.zTree.init($("#" + treeObjKey), this.receiverTree.treeSetting, flowNodeEntity.extensionElements.jb4dcMainReceiveObjects.runtimeReceiveGroups);
          this.receiverTree.treeObjMap[treeObjKey]._host = this;
          this.receiverTree.treeObjMap[treeObjKey].flowNodeEntity = flowNodeEntity;
          this.receiverTree.treeObjMap[treeObjKey].receiveType = "main";
        } else if (!flowNodeEntity.extensionElements || !flowNodeEntity.extensionElements.jb4dcMainReceiveObjects || !flowNodeEntity.extensionElements.jb4dcMainReceiveObjects.jb4dcReceiveObjectList) {
          var _treeObjKey = this.buildUlTreeId(flowNodeEntity, "main");

          this.receiverTree.treeObjMap[_treeObjKey] = $.fn.zTree.init($("#" + _treeObjKey), this.receiverTree.treeSetting, this.getRootOrganMainReceiveObjects());
          this.receiverTree.treeObjMap[_treeObjKey]._host = this;
          this.receiverTree.treeObjMap[_treeObjKey].flowNodeEntity = flowNodeEntity;
          this.receiverTree.treeObjMap[_treeObjKey].receiveType = "main";
        }

        if (flowNodeEntity.extensionElements && flowNodeEntity.extensionElements.jb4dcCCReceiveObjects && flowNodeEntity.extensionElements.jb4dcCCReceiveObjects.runtimeReceiveGroups) {
          var _treeObjKey2 = this.buildUlTreeId(flowNodeEntity, "cc");

          this.receiverTree.treeObjMap[_treeObjKey2] = $.fn.zTree.init($("#" + _treeObjKey2), this.receiverTree.treeSetting, flowNodeEntity.extensionElements.jb4dcCCReceiveObjects.runtimeReceiveGroups);
          this.receiverTree.treeObjMap[_treeObjKey2]._host = this;
          this.receiverTree.treeObjMap[_treeObjKey2].flowNodeEntity = flowNodeEntity;
          this.receiverTree.treeObjMap[_treeObjKey2].receiveType = "cc";
        }
      }
    },
    buildUlTreeId: function buildUlTreeId(flowNodeEntity, receiveType) {
      return 'ulTree_' + receiveType + "_" + flowNodeEntity.id;
    },
    addTreeSelectedReceiverToSelected: function addTreeSelectedReceiverToSelected(flowNodeEntity, receiveType) {
      var treeKey = this.buildUlTreeId(flowNodeEntity, receiveType);
      var treeObject = this.receiverTree.treeObjMap[treeKey];

      if (treeObject) {
        var selectNodes = treeObject.getSelectedNodes();

        if (selectNodes && selectNodes.length > 0) {
          this.addReceiverToSelected(selectNodes[0], flowNodeEntity, receiveType);
        }
      }
    },
    addReceiverToSelected: function addReceiverToSelected(selectNode, flowNodeEntity, receiveType) {
      var isMultiInstanceTask = this.isMultiInstanceTask(flowNodeEntity);
      var innerSingleId = flowNodeEntity.id + "_" + receiveType + "_" + selectNode.id;

      if (selectNode.typeName == "SingleUser") {
        selectNode.innerSingleId = innerSingleId;
        selectNode.flowNodeEntity = flowNodeEntity;
        selectNode.receiveType = receiveType;

        if ((receiveType == "cc" || isMultiInstanceTask) && !ArrayUtility.Exist(this.selectedReceiver.receiverData, function (item) {
          return item.innerSingleId == innerSingleId;
        })) {
          this.selectedReceiver.receiverData.push(selectNode);
        } else if (receiveType == "main" && !isMultiInstanceTask) {
          for (var i = 0; i < this.selectedReceiver.receiverData.length; i++) {
            if (this.selectedReceiver.receiverData[i].flowNodeEntity.id == flowNodeEntity.id && this.selectedReceiver.receiverData[i].receiveType == receiveType) {
              ArrayUtility.Delete(this.selectedReceiver.receiverData, i);
            }
          }

          this.selectedReceiver.receiverData.push(selectNode);
        }
      } else if (isMultiInstanceTask && (selectNode.typeName == "Users" || selectNode.typeName == "Role" || selectNode.typeName == "Organs")) {
        if (selectNode.runtimeReceiveUsers != null && selectNode.runtimeReceiveUsers.length > 0) {
          for (var _i = 0; _i < selectNode.runtimeReceiveUsers.length; _i++) {
            var childNode = selectNode.runtimeReceiveUsers[_i];

            if (childNode.typeName == "SingleUser") {
              this.addReceiverToSelected(childNode, flowNodeEntity, receiveType);
            }
          }
        }
      }
    },
    clearSelectedReceiverToSelected: function clearSelectedReceiverToSelected(flowNodeEntity, receiveType) {
      for (var i = this.selectedReceiver.receiverData.length - 1; i >= 0; i--) {
        var receiver = this.selectedReceiver.receiverData[i];

        if (receiver.flowNodeEntity.id == flowNodeEntity.id && receiver.receiveType == receiveType) {
          ArrayUtility.Delete(this.selectedReceiver.receiverData, i);
        }
      }
    },
    deleteSelectedReceiver: function deleteSelectedReceiver(index, row) {
      for (var i = 0; i < this.selectedReceiver.receiverData.length; i++) {
        if (this.selectedReceiver.receiverData[i].innerSingleId == row.innerSingleId) {
          ArrayUtility.Delete(this.selectedReceiver.receiverData, i);
        }
      }
    },
    isMultiInstanceTask: function isMultiInstanceTask(flowNodeEntity) {
      return flowNodeEntity.multiInstanceTask;
    },
    buildTabLabel: function buildTabLabel(flowNodeEntity) {
      return flowNodeEntity.name + " [" + (this.isMultiInstanceTask(flowNodeEntity) ? "多人" : "单人") + "]";
    },
    validateCompleteEnable: function validateCompleteEnable() {
      var _this2 = this;

      var errorMessages = [];
      var success = true;

      var _loop = function _loop(i) {
        if (_this2.nextFlowNodeEntities[i].taskTypeName == "com.jb4dc.workflow.po.bpmn.process.BpmnUserTask") {
          if (!ArrayUtility.Exist(_this2.selectedReceiver.receiverData, function (item) {
            return item.flowNodeEntity.id == _this2.nextFlowNodeEntities[i].id && item.receiveType == "main";
          })) {
            errorMessages.push({
              taskName: _this2.nextFlowNodeEntities[i].name,
              flowNodeEntity: _this2.nextFlowNodeEntities[i],
              message: "环节[" + _this2.nextFlowNodeEntities[i].name + "]至少需要设置一个接收用户!"
            });
          }
        }
      };

      for (var i = 0; i < this.nextFlowNodeEntities.length; i++) {
        _loop(i);
      }

      if (errorMessages.length > 0) {
        var errorTextAry = [];

        for (var i = 0; i < errorMessages.length; i++) {
          errorTextAry.push(errorMessages[i].message);
        }

        DialogUtility.AlertText(errorTextAry.join("<br />"), this);
        success = false;
      }

      return {
        success: success
      };
    }
  },
  template: "<div id=\"userTaskReceiverDialogInner\" ref=\"userTaskReceiverDialogWrap\" style=\"display: none\">\n                <tabs name=\"userTaskReceiverDialogTabs\">\n                    <tab-pane :label=\"buildTabLabel(flowNodeEntity)\" tab=\"userTaskReceiverDialogTabs\" v-for=\"flowNodeEntity in nextFlowNodeEntities\" :key=\"flowNodeEntity.id\">\n                        <collapse accordion value=\"mainReceiver\">\n                            <panel name=\"mainReceiver\">\n                                \u4E3B\u9001\u4EBA\u5458\n                                <div slot=\"content\">\n                                    <div class=\"user-task-receiver-dialog-outer-wrap\">\n                                        <div class=\"selectEnableUserList\">\n                                            <ul :id=\"buildUlTreeId(flowNodeEntity,'main')\" class=\"ztree\" style=\"width: 200px\"></ul>\n                                        </div>\n                                        <div class=\"selectOpButtonContainer\">\n                                            <div class=\"single-op-button\" title=\"\u6DFB\u52A0\u4EBA\u5458\" @click=\"addTreeSelectedReceiverToSelected(flowNodeEntity,'main')\"><Icon type=\"md-arrow-round-forward\" /></div>\n                                            <div class=\"single-op-button\" title=\"\u6E05\u7A7A\u5DF2\u9009\u4EBA\u5458\" @click=\"clearSelectedReceiverToSelected(flowNodeEntity,'main')\"><Icon type=\"md-backspace\" /></div>\n                                        </div>\n                                        <div class=\"selectedUserList\">\n                                            <i-table height=\"327\" width=\"260\" stripe :columns=\"selectedReceiver.columnsConfig\" :data=\"selectedReceiver.receiverData | filterReceiverData(flowNodeEntity, 'main')\"\n                                                 class=\"iv-list-table\" size=\"small\">\n                                                 <template slot-scope=\"{ row, index }\" slot=\"action\">\n                                                    <div class=\"list-font-icon-button-class\" @click=\"deleteSelectedReceiver(index,row)\">\n                                                        <Icon type=\"md-close\" />\n                                                    </div>\n                                                </template>     \n                                            </i-table>\n                                        </div>\n                                    </div>\n                                </div>\n                            </panel>\n                            <panel name=\"ccReceiver\">\n                                \u6284\u9001\u4EBA\u5458\n                                <div slot=\"content\">\n                                    <div class=\"user-task-receiver-dialog-outer-wrap\">\n                                        <div class=\"selectEnableUserList\">\n                                            <ul :id=\"buildUlTreeId(flowNodeEntity,'cc')\" class=\"ztree\" style=\"width: 200px\"></ul>\n                                        </div>\n                                        <div class=\"selectOpButtonContainer\">\n                                            <div class=\"single-op-button\" title=\"\u6DFB\u52A0\u4EBA\u5458\" @click=\"addReceiverToSelected(flowNodeEntity,'cc')\"><Icon type=\"md-arrow-round-forward\" /></div>\n                                            <div class=\"single-op-button\" title=\"\u6E05\u7A7A\u5DF2\u9009\u4EBA\u5458\"><Icon type=\"md-backspace\" /></div>\n                                        </div>\n                                        <div class=\"selectedUserList\">\n                                            <i-table height=\"327\" width=\"260\" stripe :columns=\"selectedReceiver.columnsConfig\" :data=\"selectedReceiver.receiverData | filterReceiverData(flowNodeEntity, 'cc')\"\n                                                 class=\"iv-list-table\" size=\"small\">\n                                                 <template slot-scope=\"{ row, index }\" slot=\"action\">\n                                                    <div class=\"list-font-icon-button-class\" @click=\"deleteSelectedReceiver(index,row)\">\n                                                        <Icon type=\"md-close\" />\n                                                    </div>\n                                                </template>     \n                                            </i-table>\n                                        </div>\n                                    </div>\n                                </div>\n                            </panel>\n                        </collapse>\n                    </tab-pane>\n                </tabs>\n            </div>"
});
"use strict";

var DocumentContentUploadConvertToPDFPlugin = {
  onchangeFile: function onchangeFile(sender) {
    $("#doc-selected-file").html($(sender).val());
  },
  uploadAndConvertToPDF: function uploadAndConvertToPDF(sender, instanceId, businessKey) {
    if (!$("#sourceFile").val()) {
      DialogUtility.AlertText("请选择要上传的文件!", this);
    } else {
      var formData = new FormData();
      formData.append("file", document.getElementById('sourceFile').files[0]);
      var xhr = new XMLHttpRequest();
      xhr.open('POST', BaseUtility.BuildAction("/Rest/Workflow/RunTime/Client/DocumentFileRuntime/UploadFileAndConvertToPDF?instanceId=" + instanceId + "&businessKey=" + businessKey));

      xhr.onload = function () {
        console.log(xhr);

        if (xhr.status === 200) {
          var result = JsonUtility.StringToJson(xhr.response);
          DocumentContentUploadConvertToPDFPlugin.loadPDFFileToViewer(result.data.fileId);
          DialogUtility.CloseByElemId(DialogUtility.DialogLoadingId);
        } else {
          DialogUtility.AlertText("执行出错!" + xhr.responseText);
          DialogUtility.CloseByElemId(DialogUtility.DialogLoadingId);
        }
      };

      xhr.upload.onprogress = function (event) {
        if (event.lengthComputable) {
          DialogUtility.AlertLoading(window, DialogUtility.DialogLoadingId, {}, "");
          var percent = Math.floor(event.loaded / event.total * 100);
          $("#upload-process").html(percent + "%");
        }
      };

      xhr.send(formData);
    }
  },
  tryLoadHistoryDocument: function tryLoadHistoryDocument(propConfig) {
    AjaxUtility.Get("/Rest/Workflow/RunTime/Client/DocumentFileRuntime/TryGetLastOnlineDocument", {
      instanceId: propConfig.InstanceId
    }, function (result) {
      if (result.success && result.data) {
        this.loadPDFFileToViewer(result.data.fileId);
      }
    }, this);
  },
  loadPDFFileToViewer: function loadPDFFileToViewer(fileId) {
    var fileUrl = BaseUtility.GetRootPath() + "/Rest/Workflow/RunTime/Client/DocumentFileRuntime/DownLoadPdfDocumentByFileId?fileId=" + fileId;
    $("#pdfViewer").attr("src", "/Js/External/PDFJS-2.9.359-dist/web/viewer.html?file=" + encodeURIComponent(fileUrl));
  },
  GetHtmlElem: function GetHtmlElem(propConfig) {
    var instanceId = propConfig.InstanceId;
    var businessKey = propConfig.RecordId;
    this.tryLoadHistoryDocument(propConfig);
    return "<div class=\"document-outer-wrap\">\n                    <div class=\"document-buttons-outer\">\n                        <div class=\"document-buttons-inner\">\n                            <button type=\"button\" class=\"upload-and-convert-button\" disabled>\u4E0B\u8F7DPDF\u6587\u4EF6</button>\n                            <button type=\"button\" class=\"upload-and-convert-button\" disabled>\u4E0B\u8F7D\u539F\u59CB\u6587\u4EF6</button>\n                            <button type=\"button\" class=\"upload-and-convert-button\" onclick=\"DocumentContentUploadConvertToPDFPlugin.uploadAndConvertToPDF(this,'".concat(instanceId, "','").concat(businessKey, "')\">\u4E0A\u4F20\u5E76\u8F6C\u6362\u4E3Apdf</button>\n                            <div class=\"file-upload\">\u9009\u62E9\u6587\u4EF6\n                               <input\n                                   id=\"sourceFile\"\n                                   type=\"file\"\n                                   name=\"inputFile\" accept=\".doc,.docx,.pdf\" onchange=\"DocumentContentUploadConvertToPDFPlugin.onchangeFile(this)\" />\n                            </div>\n                            <div class=\"selected-file-message\">\u5DF2\u9009\u6587\u4EF6:<span id=\"doc-selected-file\"></span></div>\n                            <div class=\"upload-process\" id=\"upload-process\"></div>\n                        </div>\n                    </div>\n                    <div class=\"document-content\">\n                        <iframe id=\"pdfViewer\" src=\"\" style=\"width: 100%;height: 100%;border: 0px\"></iframe>\n                    </div>\n                </div>");
  }
};
"use strict";

var FlowFilesListSinglePlugin = {
  _prop: {},
  _flowInstanceRuntimePO: null,
  _currentNode: null,
  _authoritiesFileAuthority: null,
  _authoritiesOnlySendBackCanEdit: "false",
  GetHtmlElem: function GetHtmlElem(propConfig) {
    FlowFilesListSinglePlugin._prop = propConfig;
    FlowFilesListSinglePlugin._flowInstanceRuntimePO = propConfig.FlowInstanceRuntimePO;
    FlowFilesListSinglePlugin._currentNode = ArrayUtility.Where(FlowFilesListSinglePlugin._flowInstanceRuntimePO.bpmnDefinitions.bpmnProcess.userTaskList, function (item) {
      return item.id == FlowFilesListSinglePlugin._flowInstanceRuntimePO.currentNodeKey;
    });

    if (FlowFilesListSinglePlugin._currentNode.length == 0) {
      FlowFilesListSinglePlugin._currentNode = FlowFilesListSinglePlugin._flowInstanceRuntimePO.bpmnDefinitions.bpmnProcess.startEvent;
    } else {
      FlowFilesListSinglePlugin._currentNode = FlowFilesListSinglePlugin._currentNode[0];
    }

    if (FlowFilesListSinglePlugin._currentNode.extensionElements) {
      FlowFilesListSinglePlugin._authoritiesFileAuthority = JsonUtility.StringToJson(FlowFilesListSinglePlugin._currentNode.extensionElements.jb4dcAuthorities.authoritiesFileAuthority);
    } else {
      FlowFilesListSinglePlugin._authoritiesFileAuthority = {
        addFile: "true"
      };
    }

    return "<div id=\"FlowFilesListPluginContainer\">\n                </div>";
  },
  acInterface: {
    getFileListData: "/Rest/Workflow/RunTime/Client/InstanceFileRuntime/GetAttachmentFileListData",
    uploadFile: "/Rest/Workflow/RunTime/Client/InstanceFileRuntime/UploadFile",
    downloadFile: "/Rest/Builder/RunTime/FileRuntime/DownLoadFileByFileId",
    deleteFile: "/Rest/Builder/RunTime/FileRuntime/DeleteFileByFileId"
  },
  Renderer: function Renderer() {
    this.BuildUploadContainer();
    this.BuildFileList();
  },
  ToViewStatus: function ToViewStatus($elem, fieldPO, relationFormRecordComplexPo, _rendererDataChainParas) {
    $("#" + this._prop.uploadWarpId).hide();
    $("#" + this._prop.elemId).find(".delete-button-elem").hide();
    $("#" + this._prop.elemId).find(".move-up-button-elem").hide();
    $("#" + this._prop.elemId).find(".move-down-button-elem").hide();
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
      fileType: "Attachment",
      instanceId: this._prop.FlowInstanceRuntimePO.instanceEntity.instId,
      businessKey: this._prop.RecordId
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
    if (this._authoritiesFileAuthority.addFile == "true") {
      var $singleControlElem = $("#FlowFilesListPluginContainer");
      var uploadWarpId = 'uploadWarp_' + StringUtility.Timestamp();
      this._prop.uploadWarpId = uploadWarpId;
      var $uploadWarp = $("<div id='" + uploadWarpId + "'></div>");
      $singleControlElem.append($uploadWarp);
      var templateId = "qq-template_" + this._prop.elemId;
      this.CreateDefaultTemplate(templateId);

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
    var $singleControlElem = $("#FlowFilesListPluginContainer");
    var upload_file_list_wrap_id = "flow_file_plugin_upload_file_list_warp";
    $("#" + upload_file_list_wrap_id).remove();
    var $divWarp = $("<div class='upload_file_list_wrap' id='" + upload_file_list_wrap_id + "'><table class='file_list_table'><thead><tr><th>文件名称</th><th style='width: 140px'>上传时间</th><th style='width: 140px'>上传人</th><th style='width: 140px'>文件大小</th><th style='width: 140px'>操作</th></tr></thead><tbody></tbody></table></div>");
    var $tbody = $divWarp.find("tbody");
    var instanceId = this._prop.FlowInstanceRuntimePO.instanceEntity.instId;
    AjaxUtility.Post(this.acInterface.getFileListData, {
      instanceId: instanceId
    }, function (result) {
      if (result.success) {
        for (var i = 0; i < result.data.length; i++) {
          var fileInfo = result.data[i];
          $tbody.append(this.BuildFileInfoTableRow(result, fileInfo));
        }
      }
    }, this);
    $($singleControlElem.append($divWarp));
  },
  BuildFileInfoTableRow: function BuildFileInfoTableRow(responseJSON, fileInfo) {
    var fileName = StringUtility.EncodeHtml(fileInfo.fileName);
    var fileCreateTime = DateUtility.DateFormatByTimeStamp(fileInfo.fileCreateTime, "yyyy-MM-dd");
    var fileSize = HardDiskUtility.ByteConvert(fileInfo.fileSize);
    var fileCreatorName = StringUtility.EncodeHtml(fileInfo.fileCreator);
    var $trObj = $("<tr><td>".concat(fileName, "</td><td style=\"text-align: center\">").concat(fileCreateTime, "</td><td style=\"text-align: center\">").concat(fileCreatorName, "</td><td style=\"text-align: center\">").concat(fileSize, "</td><td style=\"text-align: center\"></td></tr>"));
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

var InstanceExTaskListPlugin = {
  _flowInstanceRuntimePO: null,
  _historyExecutionTaskEntityList: null,
  _currentExTask: null,
  GetHtmlElem: function GetHtmlElem(propConfig) {
    this._flowInstanceRuntimePO = propConfig.FlowInstanceRuntimePO;
    this._historyExecutionTaskEntityList = propConfig.FlowInstanceRuntimePO.historyExecutionTaskEntityList;
    this._currentExTask = propConfig.FlowInstanceRuntimePO.executionTaskEntity;

    if (this._historyExecutionTaskEntityList) {
      return this.Renderer();
    }

    return "";
  },
  ViewDetail: function ViewDetail(exTaskId) {
    var exTask = ArrayUtility.WhereSingle(this._historyExecutionTaskEntityList, function (item) {
      return item.extaskId == exTaskId;
    });
    DialogUtility.AlertJsonCode(exTask);
  },
  ConvertStatusToCNName: function ConvertStatusToCNName(status) {
    if (status == "Processing") {
      return "办理中";
    } else if (status == "End") {
      return "已办理";
    } else if (status == "Cancel") {
      return "被撤回";
    } else if (status == "CancelEnd") {
      return "办理&#10522;&#10230;撤回";
    }

    return "未知";
  },
  Renderer: function Renderer() {
    var htmlTable = "<div class='instance-ex-task-list-plugin'>\n                            <table class='ex-task-table'>\n                                <thead>\n                                    <tr><th>\u73AF\u8282\u540D\u79F0</th><th>\u53D1\u9001\u4EBA</th><th>\u53D1\u9001\u65F6\u95F4</th><th>\u67E5\u770B\u65F6\u95F4</th><th>\u63A5\u6536\u4EBA/\u5904\u7406\u4EBA</th><th>\u5904\u7406\u65F6\u95F4</th><th>\u6267\u884C\u52A8\u4F5C</th><th>\u72B6\u6001</th><th style=\"width: 200px\">\u64CD\u4F5C</th></tr>\n                                </thead>\n                                <tbody>";

    for (var i = 0; i < this._historyExecutionTaskEntityList.length; i++) {
      var exTask = this._historyExecutionTaskEntityList[i];
      var extaskId = StringUtility.NullToES(exTask.extaskId);
      var extaskCurNodeName = StringUtility.NullToES(exTask.extaskCurNodeName);
      var extaskSenderName = StringUtility.NullToES(exTask.extaskSenderName);
      var extaskStartTime = StringUtility.NullToES(exTask.extaskStartTime);
      var extaskViewTime = StringUtility.NullToES(exTask.extaskViewTime);
      var rhName = StringUtility.NullToES(exTask.extaskReceiverName);
      var extaskHandlerId = StringUtility.NullToES(exTask.extaskHandlerId);
      var extaskReceiverId = StringUtility.NullToES(exTask.extaskReceiverId);

      if (!StringUtility.IsNullOrEmpty(extaskHandlerId) && extaskReceiverId != extaskHandlerId) {
        rhName = StringUtility.NullToES(exTask.extaskReceiverName) + "/" + StringUtility.NullToES(exTask.extaskHandlerName);
      }

      var extaskHandlerName = StringUtility.NullToES(exTask.extaskHandlerName);
      var extaskEndTime = StringUtility.NullToES(exTask.extaskEndTime);
      var extaskHandleActionName = StringUtility.NullToES(exTask.extaskHandleActionName);
      var extaskStatus = this.ConvertStatusToCNName(StringUtility.NullToES(exTask.extaskStatus));
      var className = "n-task-tr";

      if (this._currentExTask.extaskId == extaskId) {
        className = "my-this-task-tr";
      }

      htmlTable += "<tr class=\"".concat(className, "\">\n                            <td>").concat(extaskCurNodeName, "</td><td>").concat(extaskSenderName, "</td><td>").concat(extaskStartTime, "</td>\n                            <td>").concat(extaskViewTime, "</td><td>").concat(rhName, "</td><td>").concat(extaskEndTime, "</td>\n                            <td>").concat(extaskHandleActionName, "</td><td>").concat(extaskStatus, "</td><td><a onclick=\"InstanceExTaskListPlugin.ViewDetail('").concat(extaskId, "')\">\u8BE6\u60C5</a></td></tr>");
    }

    htmlTable += "</tbody></table></div>";
    return htmlTable;
  }
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFjdGlvbnNSdW50aW1lT2JqZWN0LmpzIiwiRmxvd1J1bnRpbWVQYWdlT2JqZWN0LmpzIiwiRmxvd1J1bnRpbWVWYXJCdWlsZGVyLmpzIiwiQWN0aW9ucy9EZWxldGVJbnN0YW5jZUFjdGlvbi5qcyIsIkFjdGlvbnMvSnVtcFRvQW55Tm9kZUFjdGlvbi5qcyIsIkFjdGlvbnMvUmVCb290SW5zdGFuY2VBY3Rpb24uanMiLCJBY3Rpb25zL1JlY2FsbEFjdGlvbi5qcyIsIkFjdGlvbnMvU2VuZEFjdGlvbi5qcyIsIkFjdGlvbnMvVGVtcFNhdmVBY3Rpb24uanMiLCJEaWFsb2cvVXNlclRhc2tSZWNlaXZlckRpYWxvZy5qcyIsIlBsdWdpbnMvRG9jdW1lbnRDb250ZW50VXBsb2FkQ29udmVydFRvUERGUGx1Z2luLmpzIiwiUGx1Z2lucy9GbG93RmlsZXNMaXN0U2luZ2xlUGx1Z2luLmpzIiwiUGx1Z2lucy9JbnN0YW5jZUV4VGFza0xpc3RQbHVnaW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvREE7QUNBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2TEE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaFRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJXb3JrRmxvd1J1bnRpbWVGdWxsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBBY3Rpb25zUnVudGltZU9iamVjdCA9IHtcbiAgQ3JlYXRlQUxMQWN0aW9uQnV0dG9uOiBmdW5jdGlvbiBDcmVhdGVBTExBY3Rpb25CdXR0b24oaXNTdGFydEluc3RhbmNlU3RhdHVzLCBmb3JtUnVudGltZUluc3QsIHBhZ2VIb3N0SW5zdGFuY2UsIHBhZ2VSZWFkeUlubmVyUGFyYXMpIHtcbiAgICBpZiAocGFnZVJlYWR5SW5uZXJQYXJhcy5qYjRkY0FjdGlvbnMgJiYgcGFnZVJlYWR5SW5uZXJQYXJhcy5qYjRkY0FjdGlvbnMuamI0ZGNBY3Rpb25MaXN0KSB7XG4gICAgICB2YXIgYnV0dG9uRWxlbTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYWdlUmVhZHlJbm5lclBhcmFzLmpiNGRjQWN0aW9ucy5qYjRkY0FjdGlvbkxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGFjdGlvbk9iaiA9IHBhZ2VSZWFkeUlubmVyUGFyYXMuamI0ZGNBY3Rpb25zLmpiNGRjQWN0aW9uTGlzdFtpXTtcblxuICAgICAgICBpZiAoYWN0aW9uT2JqLmp1ZWxSdW5SZXN1bHRQTy5ib29sZWFuUmVzdWx0KSB7XG4gICAgICAgICAgaWYgKGFjdGlvbk9iai5hY3Rpb25UeXBlID09IFwic2VuZFwiKSB7XG4gICAgICAgICAgICB2YXIgc2VuZEFjdGlvbk9iamVjdCA9IE9iamVjdC5jcmVhdGUoU2VuZEFjdGlvbik7XG4gICAgICAgICAgICBidXR0b25FbGVtID0gc2VuZEFjdGlvbk9iamVjdC5JbnN0YW5jZShpc1N0YXJ0SW5zdGFuY2VTdGF0dXMsIGZvcm1SdW50aW1lSW5zdCwgcGFnZUhvc3RJbnN0YW5jZSwgcGFnZVJlYWR5SW5uZXJQYXJhcywgYWN0aW9uT2JqKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGFjdGlvbk9iai5hY3Rpb25UeXBlID09IFwicmVjYWxsXCIpIHtcbiAgICAgICAgICAgIHZhciBjYWxsYmFja0FjdGlvbk9iamVjdCA9IE9iamVjdC5jcmVhdGUoUmVjYWxsQWN0aW9uKTtcbiAgICAgICAgICAgIGJ1dHRvbkVsZW0gPSBjYWxsYmFja0FjdGlvbk9iamVjdC5JbnN0YW5jZShpc1N0YXJ0SW5zdGFuY2VTdGF0dXMsIGZvcm1SdW50aW1lSW5zdCwgcGFnZUhvc3RJbnN0YW5jZSwgcGFnZVJlYWR5SW5uZXJQYXJhcywgYWN0aW9uT2JqKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGFjdGlvbk9iai5hY3Rpb25UeXBlID09IFwiZGVsZXRlSW5zdGFuY2VcIikge1xuICAgICAgICAgICAgdmFyIGRlbGV0ZUluc3RhbmNlQWN0aW9uT2JqZWN0ID0gT2JqZWN0LmNyZWF0ZShEZWxldGVJbnN0YW5jZUFjdGlvbik7XG4gICAgICAgICAgICBidXR0b25FbGVtID0gZGVsZXRlSW5zdGFuY2VBY3Rpb25PYmplY3QuSW5zdGFuY2UoaXNTdGFydEluc3RhbmNlU3RhdHVzLCBmb3JtUnVudGltZUluc3QsIHBhZ2VIb3N0SW5zdGFuY2UsIHBhZ2VSZWFkeUlubmVyUGFyYXMsIGFjdGlvbk9iaik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgJChcIiNmbG93V29ya0FjdGlvbkJ1dHRvbldyYXBPdXRlclwiKS5hcHBlbmQoYnV0dG9uRWxlbS5lbGVtKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgR2V0QWN0aW9uT2JqOiBmdW5jdGlvbiBHZXRBY3Rpb25PYmooKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFjdGlvbkF1dG9TZW5kOiBcImZhbHNlXCIsXG4gICAgICBhY3Rpb25DQ1JlY2VpdmVPYmplY3RzOiBcIltdXCIsXG4gICAgICBhY3Rpb25DYWxsQXBpczogXCJbXVwiLFxuICAgICAgYWN0aW9uQ2FsbENvbXBsZXRlOiBcInRydWVcIixcbiAgICAgIGFjdGlvbkNhbGxKc01ldGhvZDogbnVsbCxcbiAgICAgIGFjdGlvbkNhcHRpb246IFwi6I2J56i/XCIsXG4gICAgICBhY3Rpb25Db2RlOiBcImFjdGlvbl81MTYwMDk3NzVcIixcbiAgICAgIGFjdGlvbkNvbmZpcm06IFwiZmFsc2VcIixcbiAgICAgIGFjdGlvbkRpc3BsYXlDb25kaXRpb25FZGl0VGV4dDogbnVsbCxcbiAgICAgIGFjdGlvbkRpc3BsYXlDb25kaXRpb25FZGl0VmFsdWU6IG51bGwsXG4gICAgICBhY3Rpb25FeGVjdXRlVmFyaWFibGVzOiBcIltdXCIsXG4gICAgICBhY3Rpb25IVE1MQ2xhc3M6IG51bGwsXG4gICAgICBhY3Rpb25IVE1MSWQ6IG51bGwsXG4gICAgICBhY3Rpb25NYWluUmVjZWl2ZU9iamVjdHM6IFwiW11cIixcbiAgICAgIGFjdGlvblJ1blNxbHM6IFwiW11cIixcbiAgICAgIGFjdGlvblNlbmRNZXNzYWdlSWQ6IG51bGwsXG4gICAgICBhY3Rpb25TZW5kU2lnbmFsSWQ6IG51bGwsXG4gICAgICBhY3Rpb25TaG93T3BpbmlvbkRpYWxvZzogXCJmYWxzZVwiLFxuICAgICAgYWN0aW9uVHlwZTogXCJzZW5kXCIsXG4gICAgICBhY3Rpb25VcGRhdGVGaWVsZHM6IFwiW11cIixcbiAgICAgIGFjdGlvblZhbGlkYXRlOiBcIuaXoFwiLFxuICAgICAgYWN0aW9uT3BpbmlvbkJpbmRUb0VsZW1JZDogbnVsbCxcbiAgICAgIGFjdGlvbk9waW5pb25CaW5kVG9GaWVsZDogbnVsbCxcbiAgICAgIGp1ZWxSdW5SZXN1bHRQTzoge1xuICAgICAgICBib29sZWFuUmVzdWx0OiB0cnVlLFxuICAgICAgICBtZXNzYWdlOiBcIlwiLFxuICAgICAgICBzdHJpbmdSZXN1bHQ6IFwiXCIsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0sXG4gICAgICBhY3Rpb25EaXNhYmxlOiBcImVuYWJsZVwiLFxuICAgICAgYWN0aW9uUmVtYXJrOiBcIlwiXG4gICAgfTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEZsb3dSdW50aW1lUGFnZU9iamVjdCA9IHtcbiAgX3dlYkZvcm1SVFBhcmFzOiBudWxsLFxuICBfZm9ybVJ1bnRpbWVJbnN0OiBudWxsLFxuICBGT1JNX1JVTlRJTUVfQ0FURUdPUllfRkxPVzogXCJJc0RlcGVuZGVuY2VGbG93XCIsXG4gIF9mbG93SW5zdGFuY2VSdW50aW1lUE86IG51bGwsXG4gIF9pc0NyZWF0ZWRNb2RlbGVyVmlldzogZmFsc2UsXG4gIGJ1aWxkUGFnZVJlYWR5SW5uZXJQYXJhczogZnVuY3Rpb24gYnVpbGRQYWdlUmVhZHlJbm5lclBhcmFzKGlzU3RhcnRJbnN0YW5jZVN0YXR1cywgcmVjb3JkSWQsIGZsb3dJbnN0YW5jZVJ1bnRpbWVQTywgZmxvd0luc3RhbmNlUnVudGltZVBPQ2FjaGVLZXkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVjb3JkSWQ6IHJlY29yZElkLFxuICAgICAgZm9ybUlkOiBmbG93SW5zdGFuY2VSdW50aW1lUE8uamI0ZGNGb3JtSWQsXG4gICAgICBjdXJyZW50Tm9kZUtleTogZmxvd0luc3RhbmNlUnVudGltZVBPLmN1cnJlbnROb2RlS2V5LFxuICAgICAgY3VycmVudE5vZGVOYW1lOiBmbG93SW5zdGFuY2VSdW50aW1lUE8uY3VycmVudE5vZGVOYW1lLFxuICAgICAgbW9kZWxJZDogZmxvd0luc3RhbmNlUnVudGltZVBPLm1vZGVsSW50ZWdyYXRlZEVudGl0eS5tb2RlbElkLFxuICAgICAgbW9kZWxSZUtleTogZmxvd0luc3RhbmNlUnVudGltZVBPLm1vZGVsSW50ZWdyYXRlZEVudGl0eS5tb2RlbFJlS2V5LFxuICAgICAgY3VycmVudFRhc2tJZDogZmxvd0luc3RhbmNlUnVudGltZVBPLmV4ZWN1dGlvblRhc2tFbnRpdHkgPyBmbG93SW5zdGFuY2VSdW50aW1lUE8uZXhlY3V0aW9uVGFza0VudGl0eS5leHRhc2tJZCA6IFwiXCIsXG4gICAgICBmbG93SW5zdGFuY2VSdW50aW1lUE9DYWNoZUtleTogZmxvd0luc3RhbmNlUnVudGltZVBPQ2FjaGVLZXksXG4gICAgICBmbG93SW5zdGFuY2VSdW50aW1lUE86IGZsb3dJbnN0YW5jZVJ1bnRpbWVQTyxcbiAgICAgIGlzU3RhcnRJbnN0YW5jZVN0YXR1czogaXNTdGFydEluc3RhbmNlU3RhdHVzLFxuICAgICAgamI0ZGNBY3Rpb25zOiBmbG93SW5zdGFuY2VSdW50aW1lUE8uamI0ZGNBY3Rpb25zXG4gICAgfTtcbiAgfSxcbiAgcGFnZVJlYWR5Rm9yU3RhcnRTdGF0dXM6IGZ1bmN0aW9uIHBhZ2VSZWFkeUZvclN0YXJ0U3RhdHVzKGlzU3RhcnRJbnN0YW5jZVN0YXR1cywgZmxvd0luc3RhbmNlUnVudGltZVBPLCBmbG93SW5zdGFuY2VSdW50aW1lUE9DYWNoZUtleSwgcGFnZUhvc3RJbnN0YW5jZSkge1xuICAgIHRoaXMuX2Zvcm1SdW50aW1lSW5zdCA9IE9iamVjdC5jcmVhdGUoRm9ybVJ1bnRpbWUpO1xuICAgIEZsb3dSdW50aW1lUGFnZU9iamVjdC5fZmxvd0luc3RhbmNlUnVudGltZVBPID0gZmxvd0luc3RhbmNlUnVudGltZVBPO1xuICAgIHZhciByZWNvcmRJZCA9IFN0cmluZ1V0aWxpdHkuR3VpZCgpO1xuICAgIHZhciBwYWdlUmVhZHlJbm5lclBhcmFzID0gdGhpcy5idWlsZFBhZ2VSZWFkeUlubmVyUGFyYXMoaXNTdGFydEluc3RhbmNlU3RhdHVzLCByZWNvcmRJZCwgZmxvd0luc3RhbmNlUnVudGltZVBPLCBmbG93SW5zdGFuY2VSdW50aW1lUE9DYWNoZUtleSk7XG5cbiAgICB0aGlzLl9mb3JtUnVudGltZUluc3QuSW5pdGlhbGl6YXRpb24oe1xuICAgICAgXCJJbnN0YW5jZUlkXCI6IGZsb3dJbnN0YW5jZVJ1bnRpbWVQTy5pbnN0YW5jZUVudGl0eS5pbnN0SWQsXG4gICAgICBcIlJlbmRlcmVyVG9JZFwiOiBcImh0bWxEZXNpZ25SdW50aW1lV3JhcFwiLFxuICAgICAgXCJGb3JtSWRcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5mb3JtSWQsXG4gICAgICBcIlJlY29yZElkXCI6IHJlY29yZElkLFxuICAgICAgXCJCdXR0b25JZFwiOiBcIlwiLFxuICAgICAgXCJPcGVyYXRpb25UeXBlXCI6IEJhc2VVdGlsaXR5LkdldEFkZE9wZXJhdGlvbk5hbWUoKSxcbiAgICAgIFwiSXNQcmV2aWV3XCI6IGZhbHNlLFxuICAgICAgXCJSZW5kZXJlckNoYWluQ29tcGxldGVkRnVuY1wiOiBGbG93UnVudGltZVBhZ2VPYmplY3QuZm9ybVJlbmRlcmVyQ2hhaW5Db21wbGV0ZWRGdW5jLFxuICAgICAgXCJMaXN0Rm9ybUJ1dHRvbkVsZW1JZFwiOiBcIlwiLFxuICAgICAgXCJXZWJGb3JtUlRQYXJhc1wiOiB7fSxcbiAgICAgIFwiRm9ybVJ1bnRpbWVDYXRlZ29yeVwiOiBGbG93UnVudGltZVBhZ2VPYmplY3QuRk9STV9SVU5USU1FX0NBVEVHT1JZX0ZMT1csXG4gICAgICBcIlByZUhhbmRsZUZvcm1IdG1sUnVudGltZUZ1bmNcIjogdGhpcy5wcmVIYW5kbGVGb3JtSHRtbFJ1bnRpbWVGdW5jLFxuICAgICAgXCJGbG93SW5zdGFuY2VSdW50aW1lUE9cIjogZmxvd0luc3RhbmNlUnVudGltZVBPLFxuICAgICAgXCJGbG93TW9kZWxSdW50aW1lUE9DYWNoZUtleVwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLmZsb3dJbnN0YW5jZVJ1bnRpbWVQT0NhY2hlS2V5LFxuICAgICAgXCJJc1N0YXJ0SW5zdGFuY2VTdGF0dXNcIjogaXNTdGFydEluc3RhbmNlU3RhdHVzLFxuICAgICAgXCJDdXJyZW50Tm9kZUtleVwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLmN1cnJlbnROb2RlS2V5LFxuICAgICAgXCJDdXJyZW50Tm9kZU5hbWVcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5jdXJyZW50Tm9kZU5hbWUsXG4gICAgICBcIk1vZGVsSWRcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5tb2RlbElkLFxuICAgICAgXCJNb2RlbFJlS2V5XCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMubW9kZWxSZUtleSxcbiAgICAgIFwiQ3VycmVudFRhc2tJZFwiOiBcIlwiXG4gICAgfSk7XG5cbiAgICB0aGlzLnJlbmRlcmVyQWN0aW9uQnV0dG9ucyhpc1N0YXJ0SW5zdGFuY2VTdGF0dXMsIHRoaXMuX2Zvcm1SdW50aW1lSW5zdCwgcGFnZUhvc3RJbnN0YW5jZSwgcGFnZVJlYWR5SW5uZXJQYXJhcyk7XG4gICAgcmV0dXJuIHRoaXMuX2Zvcm1SdW50aW1lSW5zdDtcbiAgfSxcbiAgcGFnZVJlYWR5Rm9yUHJvY2Vzc1N0YXR1czogZnVuY3Rpb24gcGFnZVJlYWR5Rm9yUHJvY2Vzc1N0YXR1cyhpc1N0YXJ0SW5zdGFuY2VTdGF0dXMsIGZsb3dJbnN0YW5jZVJ1bnRpbWVQTywgZmxvd0luc3RhbmNlUnVudGltZVBPQ2FjaGVLZXksIHBhZ2VIb3N0SW5zdGFuY2UpIHtcbiAgICB0aGlzLl9mb3JtUnVudGltZUluc3QgPSBPYmplY3QuY3JlYXRlKEZvcm1SdW50aW1lKTtcbiAgICBGbG93UnVudGltZVBhZ2VPYmplY3QuX2Zsb3dJbnN0YW5jZVJ1bnRpbWVQTyA9IGZsb3dJbnN0YW5jZVJ1bnRpbWVQTztcbiAgICB2YXIgcmVjb3JkSWQgPSBmbG93SW5zdGFuY2VSdW50aW1lUE8uaW5zdGFuY2VFbnRpdHkuaW5zdFJ1QnVzaW5lc3NLZXk7XG4gICAgdmFyIHBhZ2VSZWFkeUlubmVyUGFyYXMgPSB0aGlzLmJ1aWxkUGFnZVJlYWR5SW5uZXJQYXJhcyhpc1N0YXJ0SW5zdGFuY2VTdGF0dXMsIHJlY29yZElkLCBmbG93SW5zdGFuY2VSdW50aW1lUE8sIGZsb3dJbnN0YW5jZVJ1bnRpbWVQT0NhY2hlS2V5KTtcblxuICAgIHRoaXMuX2Zvcm1SdW50aW1lSW5zdC5Jbml0aWFsaXphdGlvbih7XG4gICAgICBcIkluc3RhbmNlSWRcIjogZmxvd0luc3RhbmNlUnVudGltZVBPLmluc3RhbmNlRW50aXR5Lmluc3RJZCxcbiAgICAgIFwiUmVuZGVyZXJUb0lkXCI6IFwiaHRtbERlc2lnblJ1bnRpbWVXcmFwXCIsXG4gICAgICBcIkZvcm1JZFwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLmZvcm1JZCxcbiAgICAgIFwiUmVjb3JkSWRcIjogcmVjb3JkSWQsXG4gICAgICBcIkJ1dHRvbklkXCI6IFwiXCIsXG4gICAgICBcIk9wZXJhdGlvblR5cGVcIjogQmFzZVV0aWxpdHkuR2V0VXJsT1BQYXJhVmFsdWUoKSxcbiAgICAgIFwiSXNQcmV2aWV3XCI6IGZhbHNlLFxuICAgICAgXCJSZW5kZXJlckNoYWluQ29tcGxldGVkRnVuY1wiOiBGbG93UnVudGltZVBhZ2VPYmplY3QuZm9ybVJlbmRlcmVyQ2hhaW5Db21wbGV0ZWRGdW5jLFxuICAgICAgXCJMaXN0Rm9ybUJ1dHRvbkVsZW1JZFwiOiBcIlwiLFxuICAgICAgXCJXZWJGb3JtUlRQYXJhc1wiOiB7fSxcbiAgICAgIFwiRm9ybVJ1bnRpbWVDYXRlZ29yeVwiOiBGbG93UnVudGltZVBhZ2VPYmplY3QuRk9STV9SVU5USU1FX0NBVEVHT1JZX0ZMT1csXG4gICAgICBcIlByZUhhbmRsZUZvcm1IdG1sUnVudGltZUZ1bmNcIjogdGhpcy5wcmVIYW5kbGVGb3JtSHRtbFJ1bnRpbWVGdW5jLFxuICAgICAgXCJGbG93SW5zdGFuY2VSdW50aW1lUE9cIjogZmxvd0luc3RhbmNlUnVudGltZVBPLFxuICAgICAgXCJGbG93TW9kZWxSdW50aW1lUE9DYWNoZUtleVwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLmZsb3dJbnN0YW5jZVJ1bnRpbWVQT0NhY2hlS2V5LFxuICAgICAgXCJJc1N0YXJ0SW5zdGFuY2VTdGF0dXNcIjogaXNTdGFydEluc3RhbmNlU3RhdHVzLFxuICAgICAgXCJDdXJyZW50Tm9kZUtleVwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLmN1cnJlbnROb2RlS2V5LFxuICAgICAgXCJDdXJyZW50Tm9kZU5hbWVcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5jdXJyZW50Tm9kZU5hbWUsXG4gICAgICBcIk1vZGVsSWRcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5tb2RlbElkLFxuICAgICAgXCJNb2RlbFJlS2V5XCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMubW9kZWxSZUtleSxcbiAgICAgIFwiQ3VycmVudFRhc2tJZFwiOiBcIlwiXG4gICAgfSk7XG5cbiAgICB0aGlzLnJlbmRlcmVyQWN0aW9uQnV0dG9ucyhpc1N0YXJ0SW5zdGFuY2VTdGF0dXMsIHRoaXMuX2Zvcm1SdW50aW1lSW5zdCwgcGFnZUhvc3RJbnN0YW5jZSwgcGFnZVJlYWR5SW5uZXJQYXJhcyk7XG4gICAgcmV0dXJuIHRoaXMuX2Zvcm1SdW50aW1lSW5zdDtcbiAgfSxcbiAgcmVuZGVyZXJBY3Rpb25CdXR0b25zOiBmdW5jdGlvbiByZW5kZXJlckFjdGlvbkJ1dHRvbnMoaXNTdGFydEluc3RhbmNlU3RhdHVzLCBmb3JtUnVudGltZUluc3QsIHBhZ2VIb3N0SW5zdGFuY2UsIHBhZ2VSZWFkeUlubmVyUGFyYXMpIHtcbiAgICBBY3Rpb25zUnVudGltZU9iamVjdC5DcmVhdGVBTExBY3Rpb25CdXR0b24oaXNTdGFydEluc3RhbmNlU3RhdHVzLCBmb3JtUnVudGltZUluc3QsIHBhZ2VIb3N0SW5zdGFuY2UsIHBhZ2VSZWFkeUlubmVyUGFyYXMpO1xuICB9LFxuICByZW5kZXJlckZsb3dNb2RlbGVyRm9yVGFiT25BY3Rpdml0eTogZnVuY3Rpb24gcmVuZGVyZXJGbG93TW9kZWxlckZvclRhYk9uQWN0aXZpdHkoZXZlbnQsIHVpKSB7XG4gICAgaWYgKCFGbG93UnVudGltZVBhZ2VPYmplY3QuX2lzQ3JlYXRlZE1vZGVsZXJWaWV3KSB7XG4gICAgICBDcmVhdGVNb2RlbGVyVmlldyhGbG93UnVudGltZVBhZ2VPYmplY3QuX2Zsb3dJbnN0YW5jZVJ1bnRpbWVQTyk7XG4gICAgICBGbG93UnVudGltZVBhZ2VPYmplY3QuX2lzQ3JlYXRlZE1vZGVsZXJWaWV3ID0gdHJ1ZTtcbiAgICB9XG4gIH0sXG4gIHJlbmRlcmVyRmxvd0ZpbGVDb250YWluZXI6IGZ1bmN0aW9uIHJlbmRlcmVyRmxvd0ZpbGVDb250YWluZXIoZmxvd0luc3RhbmNlUnVudGltZVBPKSB7XG4gICAgRmxvd0ZpbGVzTGlzdFNpbmdsZVBsdWdpbi5SZW5kZXJlcigpO1xuICB9LFxuICBmb3JtUmVuZGVyZXJDaGFpbkNvbXBsZXRlZEZ1bmM6IGZ1bmN0aW9uIGZvcm1SZW5kZXJlckNoYWluQ29tcGxldGVkRnVuYyhzZW5kZXJDb25maWcpIHtcbiAgICB2YXIgZmxvd0luc3RhbmNlUnVudGltZVBPID0gc2VuZGVyQ29uZmlnLmZsb3dJbnN0YW5jZVJ1bnRpbWVQTztcbiAgICBGbG93UnVudGltZVBhZ2VPYmplY3QucmVuZGVyZXJGbG93RmlsZUNvbnRhaW5lcihmbG93SW5zdGFuY2VSdW50aW1lUE8pO1xuICB9LFxuICBwcmVIYW5kbGVGb3JtSHRtbFJ1bnRpbWVGdW5jOiBmdW5jdGlvbiBwcmVIYW5kbGVGb3JtSHRtbFJ1bnRpbWVGdW5jKHNvdXJjZVJ1bnRpbWVIdG1sLCBmb3JtUnVudGltZUluc3QsIHByb3BDb25maWcpIHtcbiAgICB2YXIgZmxvd1BhZ2VDb250YWluZXIgPSAkKFwiPGRpdj5cIiArIHNvdXJjZVJ1bnRpbWVIdG1sICsgXCI8ZGl2PlwiKTtcbiAgICB2YXIgZmxvd0luc3RhbmNlUnVudGltZVBPID0gcHJvcENvbmZpZy5GbG93SW5zdGFuY2VSdW50aW1lUE87XG5cbiAgICBpZiAoZmxvd1BhZ2VDb250YWluZXIuY2hpbGRyZW4oXCJbc2luZ2xlbmFtZT0nV0ZEQ1RfVGFiQ29udGFpbmVyJ11cIikubGVuZ3RoID09IDApIHtcbiAgICAgIGZsb3dQYWdlQ29udGFpbmVyID0gJChcIjxkaXY+PGRpdiBjbGFzcz1cXFwid2ZkY3QtdGFicy1vdXRlci13cmFwLXJ1bnRpbWUgaHRtbC1kZXNpZ24tdGhlbWUtZGVmYXVsdC1yb290LWVsZW0tY2xhc3NcXFwiIGNvbnRyb2xfY2F0ZWdvcnk9XFxcIkNvbnRhaW5lckNvbnRyb2xcXFwiIGRlc2M9XFxcIlxcXCIgZ3JvdXBuYW1lPVxcXCJcXFwiIGlkPVxcXCJ0YWJzX3dyYXBfNTE4NjI3NjE2XFxcIiBpc19qYnVpbGQ0ZGNfZGF0YT1cXFwiZmFsc2VcXFwiIGpidWlsZDRkY19jdXN0b209XFxcInRydWVcXFwiIG5hbWU9XFxcInRhYnNfd3JhcF81MTg2Mjc2MTZcXFwiIHBsYWNlaG9sZGVyPVxcXCJcXFwiIHNlcmlhbGl6ZT1cXFwiZmFsc2VcXFwiIHNob3dfcmVtb3ZlX2J1dHRvbj1cXFwiZmFsc2VcXFwiIHNpbmdsZW5hbWU9XFxcIldGRENUX1RhYkNvbnRhaW5lclxcXCIgc3RhdHVzPVxcXCJlbmFibGVcXFwiIHN0eWxlPVxcXCJcXFwiIGNsaWVudF9yZXNvbHZlPVxcXCJXRkRDVF9UYWJDb250YWluZXJcXFwiPjxkaXY+XCIpO1xuICAgICAgZmxvd1BhZ2VDb250YWluZXIuY2hpbGRyZW4oXCJbc2luZ2xlbmFtZT0nV0ZEQ1RfVGFiQ29udGFpbmVyJ11cIikuYXBwZW5kKFwiPGRpdiBjbGFzcz1cXFwid3lzaXd5Zy13ZmRjdC10YWJzLWxhYmVsIHdmZGN0LXRhYnMtbGFiZWwtcnVudGltZVxcXCIgdGFiX2lkPVxcXCJ0YWJfY29udGVudF9mbG93X2Zvcm1fOTk5XFxcIj5cIiArIGZsb3dJbnN0YW5jZVJ1bnRpbWVQTy5tb2RlbE5hbWUgKyBcIjwvZGl2PlwiKTtcbiAgICAgIGZsb3dQYWdlQ29udGFpbmVyLmNoaWxkcmVuKFwiW3NpbmdsZW5hbWU9J1dGRENUX1RhYkNvbnRhaW5lciddXCIpLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1jb250ZW50IHdmZGN0LXRhYnMtY29udGVudC1ydW50aW1lXFxcIiBpZD1cXFwidGFiX2NvbnRlbnRfZmxvd19mb3JtXzk5OVxcXCI+XCIgKyBzb3VyY2VSdW50aW1lSHRtbCArIFwiPC9kaXY+XCIpO1xuICAgIH1cblxuICAgIHZhciB0YWJDb250YWluZXIgPSBmbG93UGFnZUNvbnRhaW5lci5jaGlsZHJlbihcIltzaW5nbGVuYW1lPSdXRkRDVF9UYWJDb250YWluZXInXVwiKTtcblxuICAgIGlmIChmbG93SW5zdGFuY2VSdW50aW1lUE8uamI0ZGNDb250ZW50RG9jdW1lbnRQbHVnaW4gPT0gXCJ1cGxvYWRDb252ZXJ0VG9QREZQbHVnaW5cIikge1xuICAgICAgdGFiQ29udGFpbmVyLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1sYWJlbCB3ZmRjdC10YWJzLWxhYmVsLXJ1bnRpbWVcXFwiIHRhYl9pZD1cXFwidGFiX2NvbnRlbnRfdXBsb2FkQ29udmVydFRvUERGUGx1Z2luXzk5OVxcXCI+5q2j5paHPC9kaXY+XCIpO1xuICAgICAgdGFiQ29udGFpbmVyLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1jb250ZW50IHdmZGN0LXRhYnMtY29udGVudC1ydW50aW1lXFxcIiBpZD1cXFwidGFiX2NvbnRlbnRfdXBsb2FkQ29udmVydFRvUERGUGx1Z2luXzk5OVxcXCI+XCIgKyBEb2N1bWVudENvbnRlbnRVcGxvYWRDb252ZXJ0VG9QREZQbHVnaW4uR2V0SHRtbEVsZW0ocHJvcENvbmZpZykgKyBcIjwvZGl2PlwiKTtcbiAgICB9IGVsc2UgaWYgKGZsb3dJbnN0YW5jZVJ1bnRpbWVQTy5qYjRkY0NvbnRlbnREb2N1bWVudFBsdWdpbiA9PSBcIndwc09ubGluZURvY3VtZW50UGx1Z2luXCIpIHtcbiAgICAgIHRhYkNvbnRhaW5lci5hcHBlbmQoXCI8ZGl2IGNsYXNzPVxcXCJ3eXNpd3lnLXdmZGN0LXRhYnMtbGFiZWwgd2ZkY3QtdGFicy1sYWJlbC1ydW50aW1lXFxcIiB0YWJfaWQ9XFxcInRhYl9jb250ZW50X3dwc09ubGluZURvY3VtZW50UGx1Z2luXzk5OVxcXCI+5q2j5paHPC9kaXY+XCIpO1xuICAgICAgdGFiQ29udGFpbmVyLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1jb250ZW50IHdmZGN0LXRhYnMtY29udGVudC1ydW50aW1lXFxcIiBpZD1cXFwidGFiX2NvbnRlbnRfd3BzT25saW5lRG9jdW1lbnRQbHVnaW5fOTk5XFxcIj7mnKrlrp7njrA8L2Rpdj5cIik7XG4gICAgfVxuXG4gICAgdGFiQ29udGFpbmVyLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1sYWJlbCB3ZmRjdC10YWJzLWxhYmVsLXJ1bnRpbWVcXFwiIHRhYl9pZD1cXFwidGFiX2NvbnRlbnRfZmxvd19maWxlc185OTlcXFwiPumZhOS7tjwvZGl2PlwiKTtcbiAgICB0YWJDb250YWluZXIuYXBwZW5kKFwiPGRpdiBjbGFzcz1cXFwid3lzaXd5Zy13ZmRjdC10YWJzLWNvbnRlbnQgd2ZkY3QtdGFicy1jb250ZW50LXJ1bnRpbWVcXFwiIGlkPVxcXCJ0YWJfY29udGVudF9mbG93X2ZpbGVzXzk5OVxcXCI+XCIgKyBGbG93RmlsZXNMaXN0U2luZ2xlUGx1Z2luLkdldEh0bWxFbGVtKHByb3BDb25maWcpICsgXCI8L2Rpdj5cIik7XG4gICAgdGFiQ29udGFpbmVyLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1sYWJlbCB3ZmRjdC10YWJzLWxhYmVsLXJ1bnRpbWVcXFwiIHRhYl9pZD1cXFwidGFiX2NvbnRlbnRfZmxvd19tb2RlbGVyXzk5OVxcXCI+5rWB56iL5Zu+PC9kaXY+XCIpO1xuICAgIHRhYkNvbnRhaW5lci5hcHBlbmQoXCI8ZGl2IGNsYXNzPVxcXCJ3eXNpd3lnLXdmZGN0LXRhYnMtY29udGVudCB3ZmRjdC10YWJzLWNvbnRlbnQtcnVudGltZVxcXCIgaWQ9XFxcInRhYl9jb250ZW50X2Zsb3dfbW9kZWxlcl85OTlcXFwiIHN0eWxlPSdoZWlnaHQ6IGNhbGMoMTAwJSAtIDUwcHgpOycgb25BY3Rpdml0eT1cXFwiRmxvd1J1bnRpbWVQYWdlT2JqZWN0LnJlbmRlcmVyRmxvd01vZGVsZXJGb3JUYWJPbkFjdGl2aXR5XFxcIj48ZGl2IGlkPVxcXCJmbG93LWNhbnZhc1xcXCIgc3R5bGU9XFxcImhlaWdodDoxMDAlO1xcXCI+PC9kaXY+PC9kaXY+XCIpO1xuICAgIHRhYkNvbnRhaW5lci5hcHBlbmQoXCI8ZGl2IGNsYXNzPVxcXCJ3eXNpd3lnLXdmZGN0LXRhYnMtbGFiZWwgd2ZkY3QtdGFicy1sYWJlbC1ydW50aW1lXFxcIiB0YWJfaWQ9XFxcInRhYl9jb250ZW50X2Zsb3dfdGFza185OTlcXFwiPua1gei9rOS/oeaBrzwvZGl2PlwiKTtcbiAgICB0YWJDb250YWluZXIuYXBwZW5kKFwiPGRpdiBjbGFzcz1cXFwid3lzaXd5Zy13ZmRjdC10YWJzLWNvbnRlbnQgd2ZkY3QtdGFicy1jb250ZW50LXJ1bnRpbWVcXFwiIGlkPVxcXCJ0YWJfY29udGVudF9mbG93X3Rhc2tfOTk5XFxcIj5cIiArIEluc3RhbmNlRXhUYXNrTGlzdFBsdWdpbi5HZXRIdG1sRWxlbShwcm9wQ29uZmlnKSArIFwiPC9kaXY+XCIpO1xuICAgIHZhciBuZXdSdW50aW1lSHRtbCA9IGZsb3dQYWdlQ29udGFpbmVyLmh0bWwoKTtcbiAgICByZXR1cm4gbmV3UnVudGltZUh0bWw7XG4gIH0sXG4gIGNoYW5nZVRhc2tUb1ZpZXc6IGZ1bmN0aW9uIGNoYW5nZVRhc2tUb1ZpZXcoZXhlY3V0aW9uVGFza0VudGl0eSkge1xuICAgIGNvbnNvbGUubG9nKFwiMTExMTExMTExMTExMTExMTExMVwiKTtcbiAgICBBamF4VXRpbGl0eS5Qb3N0KFwiL1Jlc3QvV29ya2Zsb3cvUnVuVGltZS9DbGllbnQvSW5zdGFuY2VSdW50aW1lL0NoYW5nZVRhc2tUb1ZpZXdcIiwge1xuICAgICAgZXh0YXNrSWQ6IGV4ZWN1dGlvblRhc2tFbnRpdHkuZXh0YXNrSWRcbiAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7fSwgdGhpcyk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBGbG93UnVudGltZVZhckJ1aWxkZXIgPSB7XG4gIEJ1aWxkZXJTZWxlY3RlZFJlY2VpdmVyVG9JbnN0YW5jZVZhcjogZnVuY3Rpb24gQnVpbGRlclNlbGVjdGVkUmVjZWl2ZXJUb0luc3RhbmNlVmFyKG5leHRGbG93Tm9kZUVudGl0aWVzLCBzZWxlY3RlZFJlY2VpdmVyRGF0YSkge1xuICAgIHZhciByZXN1bHREYXRhID0gW107XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlbGVjdGVkUmVjZWl2ZXJEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgcmVjZWl2ZXIgPSBzZWxlY3RlZFJlY2VpdmVyRGF0YVtpXTtcbiAgICAgIHJlc3VsdERhdGEucHVzaCh7XG4gICAgICAgIG5leHROb2RlSWQ6IHJlY2VpdmVyLmZsb3dOb2RlRW50aXR5LmlkLFxuICAgICAgICByZWNlaXZlcklkOiByZWNlaXZlci5pZCxcbiAgICAgICAgcmVjZWl2ZXJOYW1lOiByZWNlaXZlci5uYW1lLFxuICAgICAgICByZWNlaXZlclR5cGVOYW1lOiByZWNlaXZlci50eXBlTmFtZSxcbiAgICAgICAgcmVjZWl2ZVR5cGU6IHJlY2VpdmVyLnJlY2VpdmVUeXBlXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0RGF0YTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIERlbGV0ZUluc3RhbmNlQWN0aW9uID0ge1xuICBhY0ludGVyZmFjZToge30sXG4gIF9Qcm9wOiB7fSxcbiAgSW5zdGFuY2U6IGZ1bmN0aW9uIEluc3RhbmNlKGlzU3RhcnRJbnN0YW5jZVN0YXR1cywgZm9ybVJ1bnRpbWVJbnN0LCBwYWdlSG9zdEluc3RhbmNlLCBwYWdlUmVhZHlJbm5lclBhcmFzLCBhY3Rpb25PYmopIHtcbiAgICB2YXIgaHRtbElkID0gYWN0aW9uT2JqLmFjdGlvbkhUTUxJZCA/IGFjdGlvbk9iai5hY3Rpb25IVE1MSWQgOiBhY3Rpb25PYmouYWN0aW9uQ29kZTtcbiAgICB2YXIgZWxlbSA9ICQoJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwib3BlcmF0aW9uLWJ1dHRvbiBvcGVyYXRpb24tYnV0dG9uLXByaW1hcnlcIiBpZD1cIicgKyBodG1sSWQgKyAnXCI+PHNwYW4+JyArIGFjdGlvbk9iai5hY3Rpb25DYXB0aW9uICsgJzwvc3Bhbj48L2J1dHRvbj4nKTtcblxuICAgIGlmIChhY3Rpb25PYmouYWN0aW9uRGlzYWJsZSA9PSBcImRpc2FibGVcIikge1xuICAgICAgZWxlbS5hdHRyKFwiZGlzYWJsZVwiLCBcImRpc2FibGVcIik7XG4gICAgICBlbGVtLmFkZENsYXNzKFwib3BlcmF0aW9uLWJ1dHRvbi1wcmltYXJ5LWRpc2FibGVkXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9Qcm9wID0ge1xuICAgICAgICBcInNlbmRlclwiOiB0aGlzLFxuICAgICAgICBcImZsb3dJbnN0YW5jZVJ1bnRpbWVQT1wiOiBwYWdlUmVhZHlJbm5lclBhcmFzLmZsb3dJbnN0YW5jZVJ1bnRpbWVQTyxcbiAgICAgICAgXCJmbG93SW5zdGFuY2VSdW50aW1lUE9DYWNoZUtleVwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLmZsb3dJbnN0YW5jZVJ1bnRpbWVQT0NhY2hlS2V5LFxuICAgICAgICBcImpiNGRjQWN0aW9uc1wiOiBwYWdlUmVhZHlJbm5lclBhcmFzLmpiNGRjQWN0aW9ucyxcbiAgICAgICAgXCJmb3JtUnVudGltZUluc3RcIjogZm9ybVJ1bnRpbWVJbnN0LFxuICAgICAgICBcImFjdGlvbk9ialwiOiBhY3Rpb25PYmosXG4gICAgICAgIFwiaXNTdGFydEluc3RhbmNlU3RhdHVzXCI6IGlzU3RhcnRJbnN0YW5jZVN0YXR1cyxcbiAgICAgICAgXCJwYWdlSG9zdEluc3RhbmNlXCI6IHBhZ2VIb3N0SW5zdGFuY2UsXG4gICAgICAgIFwiY3VycmVudE5vZGVLZXlcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5jdXJyZW50Tm9kZUtleSxcbiAgICAgICAgXCJjdXJyZW50Tm9kZU5hbWVcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5jdXJyZW50Tm9kZU5hbWUsXG4gICAgICAgIFwicmVjb3JkSWRcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5yZWNvcmRJZCxcbiAgICAgICAgXCJtb2RlbElkXCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMubW9kZWxJZCxcbiAgICAgICAgXCJtb2RlbFJlS2V5XCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMubW9kZWxSZUtleSxcbiAgICAgICAgXCJjdXJyZW50VGFza0lkXCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMuY3VycmVudFRhc2tJZCxcbiAgICAgICAgXCJpbnN0YW5jZUlkXCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMuZmxvd0luc3RhbmNlUnVudGltZVBPLmluc3RhbmNlRW50aXR5Lmluc3RJZFxuICAgICAgfTtcbiAgICAgIGVsZW0uYmluZChcImNsaWNrXCIsIHRoaXMuX1Byb3AsIHRoaXMuQnV0dG9uQ2xpY2tFdmVudCk7XG4gICAgfVxuXG4gICAgaWYgKGFjdGlvbk9iai5hY3Rpb25SZW1hcmspIHtcbiAgICAgIGVsZW0uYXR0cihcInRpdGxlXCIsIGFjdGlvbk9iai5hY3Rpb25SZW1hcmspO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBlbGVtOiBlbGVtXG4gICAgfTtcbiAgfSxcbiAgQnV0dG9uQ2xpY2tFdmVudDogZnVuY3Rpb24gQnV0dG9uQ2xpY2tFdmVudChzZW5kZXIpIHtcbiAgICB2YXIgX3RoaXMgPSBzZW5kZXIuZGF0YS5zZW5kZXI7XG4gICAgRGlhbG9nVXRpbGl0eS5Db25maXJtKHdpbmRvdywgXCLmmoLkuI3mlK/mjIHor6Xmk43kvZw/XCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybjtcbiAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRMb2FkaW5nKHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dMb2FkaW5nSWQsIHt9LCBcIuezu+e7n+WkhOeQhuS4rSzor7fnqI3lgJkhXCIpO1xuICAgICAgQWpheFV0aWxpdHkuUG9zdChfdGhpcy5hY0ludGVyZmFjZS5yZWNhbGxNeVNlbmRUYXNrLCB7XG4gICAgICAgIGV4dGFza0lkOiBzZW5kZXIuZGF0YS5jdXJyZW50VGFza0lkXG4gICAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQ2xvc2VEaWFsb2coRGlhbG9nVXRpbGl0eS5EaWFsb2dMb2FkaW5nSWQpO1xuXG4gICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgIGlmICh3aW5kb3cuT3BlbmVyV2luZG93T2JqICE9IG51bGwgJiYgd2luZG93Lk9wZW5lcldpbmRvd09iai5pbnN0YW5jZU1haW5UYXNrUHJvY2Vzc0xpc3QgIT0gbnVsbCkge1xuICAgICAgICAgICAgd2luZG93Lk9wZW5lcldpbmRvd09iai5pbnN0YW5jZU1haW5UYXNrUHJvY2Vzc0xpc3QucmVsb2FkRGF0YSgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgRGlhbG9nVXRpbGl0eS5GcmFtZV9DbG9zZURpYWxvZyh3aW5kb3cpO1xuICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB9XG4gICAgICB9LCBfdGhpcyk7XG4gICAgfSwgX3RoaXMpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiOyIsIlwidXNlIHN0cmljdFwiOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgUmVjYWxsQWN0aW9uID0ge1xuICBhY0ludGVyZmFjZToge1xuICAgIHJlY2FsbE15U2VuZFRhc2s6IFwiL1Jlc3QvV29ya2Zsb3cvUnVuVGltZS9DbGllbnQvSW5zdGFuY2VSdW50aW1lL1JlY2FsbE15U2VuZFRhc2tcIlxuICB9LFxuICBfUHJvcDoge30sXG4gIEluc3RhbmNlOiBmdW5jdGlvbiBJbnN0YW5jZShpc1N0YXJ0SW5zdGFuY2VTdGF0dXMsIGZvcm1SdW50aW1lSW5zdCwgcGFnZUhvc3RJbnN0YW5jZSwgcGFnZVJlYWR5SW5uZXJQYXJhcywgYWN0aW9uT2JqKSB7XG4gICAgdmFyIGh0bWxJZCA9IGFjdGlvbk9iai5hY3Rpb25IVE1MSWQgPyBhY3Rpb25PYmouYWN0aW9uSFRNTElkIDogYWN0aW9uT2JqLmFjdGlvbkNvZGU7XG4gICAgdmFyIGVsZW0gPSAkKCc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cIm9wZXJhdGlvbi1idXR0b24gb3BlcmF0aW9uLWJ1dHRvbi1wcmltYXJ5XCIgaWQ9XCInICsgaHRtbElkICsgJ1wiPjxzcGFuPicgKyBhY3Rpb25PYmouYWN0aW9uQ2FwdGlvbiArICc8L3NwYW4+PC9idXR0b24+Jyk7XG5cbiAgICBpZiAoYWN0aW9uT2JqLmFjdGlvbkRpc2FibGUgPT0gXCJkaXNhYmxlXCIpIHtcbiAgICAgIGVsZW0uYXR0cihcImRpc2FibGVcIiwgXCJkaXNhYmxlXCIpO1xuICAgICAgZWxlbS5hZGRDbGFzcyhcIm9wZXJhdGlvbi1idXR0b24tcHJpbWFyeS1kaXNhYmxlZFwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fUHJvcCA9IHtcbiAgICAgICAgXCJzZW5kZXJcIjogdGhpcyxcbiAgICAgICAgXCJmbG93SW5zdGFuY2VSdW50aW1lUE9cIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5mbG93SW5zdGFuY2VSdW50aW1lUE8sXG4gICAgICAgIFwiZmxvd0luc3RhbmNlUnVudGltZVBPQ2FjaGVLZXlcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5mbG93SW5zdGFuY2VSdW50aW1lUE9DYWNoZUtleSxcbiAgICAgICAgXCJqYjRkY0FjdGlvbnNcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5qYjRkY0FjdGlvbnMsXG4gICAgICAgIFwiZm9ybVJ1bnRpbWVJbnN0XCI6IGZvcm1SdW50aW1lSW5zdCxcbiAgICAgICAgXCJhY3Rpb25PYmpcIjogYWN0aW9uT2JqLFxuICAgICAgICBcImlzU3RhcnRJbnN0YW5jZVN0YXR1c1wiOiBpc1N0YXJ0SW5zdGFuY2VTdGF0dXMsXG4gICAgICAgIFwicGFnZUhvc3RJbnN0YW5jZVwiOiBwYWdlSG9zdEluc3RhbmNlLFxuICAgICAgICBcImN1cnJlbnROb2RlS2V5XCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMuY3VycmVudE5vZGVLZXksXG4gICAgICAgIFwiY3VycmVudE5vZGVOYW1lXCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMuY3VycmVudE5vZGVOYW1lLFxuICAgICAgICBcInJlY29yZElkXCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMucmVjb3JkSWQsXG4gICAgICAgIFwibW9kZWxJZFwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLm1vZGVsSWQsXG4gICAgICAgIFwibW9kZWxSZUtleVwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLm1vZGVsUmVLZXksXG4gICAgICAgIFwiY3VycmVudFRhc2tJZFwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLmN1cnJlbnRUYXNrSWQsXG4gICAgICAgIFwiaW5zdGFuY2VJZFwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLmZsb3dJbnN0YW5jZVJ1bnRpbWVQTy5pbnN0YW5jZUVudGl0eS5pbnN0SWRcbiAgICAgIH07XG4gICAgICBlbGVtLmJpbmQoXCJjbGlja1wiLCB0aGlzLl9Qcm9wLCB0aGlzLkJ1dHRvbkNsaWNrRXZlbnQpO1xuICAgIH1cblxuICAgIGlmIChhY3Rpb25PYmouYWN0aW9uUmVtYXJrKSB7XG4gICAgICBlbGVtLmF0dHIoXCJ0aXRsZVwiLCBhY3Rpb25PYmouYWN0aW9uUmVtYXJrKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgZWxlbTogZWxlbVxuICAgIH07XG4gIH0sXG4gIEJ1dHRvbkNsaWNrRXZlbnQ6IGZ1bmN0aW9uIEJ1dHRvbkNsaWNrRXZlbnQoc2VuZGVyKSB7XG4gICAgdmFyIF90aGlzID0gc2VuZGVyLmRhdGEuc2VuZGVyO1xuICAgIERpYWxvZ1V0aWxpdHkuQ29uZmlybSh3aW5kb3csIFwi56Gu6K6k5omn6KGM5pKk5Zue5pON5L2cP1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0TG9hZGluZyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nTG9hZGluZ0lkLCB7fSwgXCLns7vnu5/lpITnkIbkuK0s6K+356iN5YCZIVwiKTtcbiAgICAgIEFqYXhVdGlsaXR5LlBvc3QoX3RoaXMuYWNJbnRlcmZhY2UucmVjYWxsTXlTZW5kVGFzaywge1xuICAgICAgICBleHRhc2tJZDogc2VuZGVyLmRhdGEuY3VycmVudFRhc2tJZFxuICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkNsb3NlRGlhbG9nKERpYWxvZ1V0aWxpdHkuRGlhbG9nTG9hZGluZ0lkKTtcblxuICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICBpZiAod2luZG93Lk9wZW5lcldpbmRvd09iaiAhPSBudWxsICYmIHdpbmRvdy5PcGVuZXJXaW5kb3dPYmouaW5zdGFuY2VNYWluVGFza1Byb2Nlc3NMaXN0ICE9IG51bGwpIHtcbiAgICAgICAgICAgIHdpbmRvdy5PcGVuZXJXaW5kb3dPYmouaW5zdGFuY2VNYWluVGFza1Byb2Nlc3NMaXN0LnJlbG9hZERhdGEoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIERpYWxvZ1V0aWxpdHkuRnJhbWVfQ2xvc2VEaWFsb2cod2luZG93KTtcbiAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgfVxuICAgICAgfSwgX3RoaXMpO1xuICAgIH0sIF90aGlzKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFNlbmRBY3Rpb24gPSB7XG4gIGFjSW50ZXJmYWNlOiB7XG4gICAgcmVzb2x2ZU5leHRQb3NzaWJsZUZsb3dOb2RlOiBcIi9SZXN0L1dvcmtmbG93L1J1blRpbWUvQ2xpZW50L0luc3RhbmNlUnVudGltZS9SZXNvbHZlTmV4dFBvc3NpYmxlRmxvd05vZGVcIixcbiAgICBjb21wbGV0ZVRhc2s6IFwiL1Jlc3QvV29ya2Zsb3cvUnVuVGltZS9DbGllbnQvSW5zdGFuY2VSdW50aW1lL0NvbXBsZXRlVGFza1wiXG4gIH0sXG4gIF9Qcm9wOiB7fSxcbiAgbmV3T3Bpbmlvbkxpc3Q6IFtdLFxuICBpbnB1dE9waW5pb25UZXh0OiBudWxsLFxuICBJbnN0YW5jZTogZnVuY3Rpb24gSW5zdGFuY2UoaXNTdGFydEluc3RhbmNlU3RhdHVzLCBmb3JtUnVudGltZUluc3QsIHBhZ2VIb3N0SW5zdGFuY2UsIHBhZ2VSZWFkeUlubmVyUGFyYXMsIGFjdGlvbk9iaikge1xuICAgIHZhciBodG1sSWQgPSBhY3Rpb25PYmouYWN0aW9uSFRNTElkID8gYWN0aW9uT2JqLmFjdGlvbkhUTUxJZCA6IGFjdGlvbk9iai5hY3Rpb25Db2RlO1xuICAgIHZhciBlbGVtID0gJCgnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJvcGVyYXRpb24tYnV0dG9uIG9wZXJhdGlvbi1idXR0b24tcHJpbWFyeVwiIGlkPVwiJyArIGh0bWxJZCArICdcIj48c3Bhbj4nICsgYWN0aW9uT2JqLmFjdGlvbkNhcHRpb24gKyAnPC9zcGFuPjwvYnV0dG9uPicpO1xuICAgIHRoaXMuX1Byb3AgPSB7XG4gICAgICBcInNlbmRlclwiOiB0aGlzLFxuICAgICAgXCJmbG93SW5zdGFuY2VSdW50aW1lUE9cIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5mbG93SW5zdGFuY2VSdW50aW1lUE8sXG4gICAgICBcImZsb3dJbnN0YW5jZVJ1bnRpbWVQT0NhY2hlS2V5XCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMuZmxvd0luc3RhbmNlUnVudGltZVBPQ2FjaGVLZXksXG4gICAgICBcImpiNGRjQWN0aW9uc1wiOiBwYWdlUmVhZHlJbm5lclBhcmFzLmpiNGRjQWN0aW9ucyxcbiAgICAgIFwiZm9ybVJ1bnRpbWVJbnN0XCI6IGZvcm1SdW50aW1lSW5zdCxcbiAgICAgIFwiYWN0aW9uT2JqXCI6IGFjdGlvbk9iaixcbiAgICAgIFwiaXNTdGFydEluc3RhbmNlU3RhdHVzXCI6IGlzU3RhcnRJbnN0YW5jZVN0YXR1cyxcbiAgICAgIFwicGFnZUhvc3RJbnN0YW5jZVwiOiBwYWdlSG9zdEluc3RhbmNlLFxuICAgICAgXCJjdXJyZW50Tm9kZUtleVwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLmN1cnJlbnROb2RlS2V5LFxuICAgICAgXCJjdXJyZW50Tm9kZU5hbWVcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5jdXJyZW50Tm9kZU5hbWUsXG4gICAgICBcInJlY29yZElkXCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMucmVjb3JkSWQsXG4gICAgICBcIm1vZGVsSWRcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5tb2RlbElkLFxuICAgICAgXCJtb2RlbFJlS2V5XCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMubW9kZWxSZUtleSxcbiAgICAgIFwiY3VycmVudFRhc2tJZFwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLmN1cnJlbnRUYXNrSWQsXG4gICAgICBcImluc3RhbmNlSWRcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5mbG93SW5zdGFuY2VSdW50aW1lUE8uaW5zdGFuY2VFbnRpdHkuaW5zdElkLFxuICAgICAgXCJhY3Rpb25TaG93T3BpbmlvbkRpYWxvZ1wiOiBhY3Rpb25PYmouYWN0aW9uU2hvd09waW5pb25EaWFsb2csXG4gICAgICBcImFjdGlvbk9waW5pb25CaW5kVG9GaWVsZFwiOiBhY3Rpb25PYmouYWN0aW9uT3BpbmlvbkJpbmRUb0ZpZWxkLFxuICAgICAgXCJhY3Rpb25PcGluaW9uQmluZFRvRWxlbUlkXCI6IGFjdGlvbk9iai5hY3Rpb25PcGluaW9uQmluZFRvRWxlbUlkXG4gICAgfTtcbiAgICBlbGVtLmJpbmQoXCJjbGlja1wiLCB0aGlzLl9Qcm9wLCB0aGlzLkJ1dHRvbkNsaWNrRXZlbnQpO1xuICAgIHJldHVybiB7XG4gICAgICBlbGVtOiBlbGVtXG4gICAgfTtcbiAgfSxcbiAgVHJ5R2V0T3BpbmlvbkJpbmRUb0NvbnRyb2xJbnN0YW5jZTogZnVuY3Rpb24gVHJ5R2V0T3BpbmlvbkJpbmRUb0NvbnRyb2xJbnN0YW5jZShfcHJvcCkge1xuICAgIHZhciBhY3Rpb25PcGluaW9uQmluZFRvRWxlbUlkID0gX3Byb3AuYWN0aW9uT3BpbmlvbkJpbmRUb0VsZW1JZDtcbiAgICB2YXIgYWN0aW9uT3BpbmlvbkJpbmRUb0ZpZWxkID0gX3Byb3AuYWN0aW9uT3BpbmlvbkJpbmRUb0ZpZWxkO1xuICAgIHZhciBjb250cm9sRWxlbTtcblxuICAgIGlmIChhY3Rpb25PcGluaW9uQmluZFRvRWxlbUlkKSB7XG4gICAgICBjb250cm9sRWxlbSA9ICQoXCIjXCIgKyBhY3Rpb25PcGluaW9uQmluZFRvRWxlbUlkKTtcbiAgICB9XG5cbiAgICBpZiAoY29udHJvbEVsZW0gJiYgY29udHJvbEVsZW0ubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIEhUTUxDb250cm9sLkdldENvbnRyb2xJbnN0YW5jZUJ5RWxlbShjb250cm9sRWxlbSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnRyb2xFbGVtID0gJChcIltmaWVsZG5hbWU9J1wiICsgYWN0aW9uT3BpbmlvbkJpbmRUb0ZpZWxkICsgXCInXVwiKTtcbiAgICB9XG5cbiAgICBpZiAoY29udHJvbEVsZW0gJiYgY29udHJvbEVsZW0ubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIEhUTUxDb250cm9sLkdldENvbnRyb2xJbnN0YW5jZUJ5RWxlbShjb250cm9sRWxlbSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH0sXG4gIEJ1dHRvbkNsaWNrRXZlbnQ6IGZ1bmN0aW9uIEJ1dHRvbkNsaWNrRXZlbnQoc2VuZGVyKSB7XG4gICAgY29uc29sZS5sb2cod2luZG93KTtcbiAgICBjb25zb2xlLmxvZyh3aW5kb3cuT3BlbmVyV2luZG93T2JqKTtcbiAgICBwb3J0bGV0VXRpbGl0eS51cGRhdGVSZWZyZXNoVmVyc2lvbigpO1xuICAgIHJldHVybjtcbiAgICB2YXIgdmFsaWRhdGVSZXN1bHQgPSBWYWxpZGF0ZVJ1bGVzUnVudGltZS5WYWxpZGF0ZVN1Ym1pdEVuYWJsZSgpO1xuXG4gICAgaWYgKFZhbGlkYXRlUnVsZXNSdW50aW1lLkFsZXJ0VmFsaWRhdGVFcnJvcnModmFsaWRhdGVSZXN1bHQpKSB7XG4gICAgICB2YXIgX3Byb3AgPSBzZW5kZXIuZGF0YTtcbiAgICAgIHZhciBfdGhpcyA9IF9wcm9wLnNlbmRlcjtcbiAgICAgIHZhciBhY3Rpb25TaG93T3BpbmlvbkRpYWxvZyA9IF9wcm9wLmFjdGlvblNob3dPcGluaW9uRGlhbG9nO1xuXG4gICAgICBpZiAoYWN0aW9uU2hvd09waW5pb25EaWFsb2cgPT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5Qcm9tcHQod2luZG93LCB7XG4gICAgICAgICAgdGl0bGU6IFwi57O757uf5o+Q56S6XCIsXG4gICAgICAgICAgaGVpZ2h0OiAzMDAsXG4gICAgICAgICAgd2lkdGg6IDQwMFxuICAgICAgICB9LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ1Byb21wdElkLCBcIuivt+i+k+WFpeWkhOeQhuaEj+ingVwiLCBmdW5jdGlvbiAoaW5wdXRUZXh0KSB7XG4gICAgICAgICAgdmFyIG9waW5pb25CaW5kVG9Db250cm9sSW5zdGFuY2UgPSBfdGhpcy5UcnlHZXRPcGluaW9uQmluZFRvQ29udHJvbEluc3RhbmNlKF9wcm9wKTtcblxuICAgICAgICAgIGlmIChvcGluaW9uQmluZFRvQ29udHJvbEluc3RhbmNlICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb3BpbmlvbkJpbmRUb0NvbnRyb2xJbnN0YW5jZS5TZXROZXdWYWx1ZSA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgb3BpbmlvbkJpbmRUb0NvbnRyb2xJbnN0YW5jZS5TZXROZXdWYWx1ZShpbnB1dFRleHQpO1xuICAgICAgICAgICAgICBfdGhpcy5pbnB1dE9waW5pb25UZXh0ID0gaW5wdXRUZXh0O1xuXG4gICAgICAgICAgICAgIF90aGlzLkJlZ2luU2VsZWN0UmVjZWl2ZXIoX3RoaXMsIF9wcm9wKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KFwi5oSP6KeB5YWz6IGU5a+56LGh5Li65a6e546wU2V0TmV3VmFsdWXmlrnms5UhIVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX3RoaXMuQmVnaW5TZWxlY3RSZWNlaXZlcihfdGhpcywgX3Byb3ApO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgQmVnaW5TZWxlY3RSZWNlaXZlcjogZnVuY3Rpb24gQmVnaW5TZWxlY3RSZWNlaXZlcihfdGhpcywgX3Byb3ApIHtcbiAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0TG9hZGluZyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nTG9hZGluZ0lkLCB7fSwgXCJcIik7XG5cbiAgICB2YXIgc2VuZERhdGEgPSBfdGhpcy5CdWlsZFNlbmRUb1NlcnZlckRhdGEoX3Byb3AsIG51bGwpO1xuXG4gICAgaWYgKHNlbmREYXRhLnN1Y2Nlc3MpIHtcbiAgICAgIEFqYXhVdGlsaXR5LlBvc3QoX3RoaXMuYWNJbnRlcmZhY2UucmVzb2x2ZU5leHRQb3NzaWJsZUZsb3dOb2RlLCBzZW5kRGF0YS5kYXRhLCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQ2xvc2VEaWFsb2coRGlhbG9nVXRpbGl0eS5EaWFsb2dMb2FkaW5nSWQpO1xuICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xuXG4gICAgICAgIGlmIChyZXN1bHQuZGF0YS5uZXh0VGFza0lzRW5kRXZlbnQpIHtcbiAgICAgICAgICB0aGlzLlNlbGVjdFJlY2VpdmVyQ29tcGxldGVkKHJlc3VsdC5kYXRhLmJwbW5UYXNrTGlzdCwgW10pO1xuICAgICAgICB9IGVsc2UgaWYgKHJlc3VsdC5kYXRhLmN1cnJlbnRUYXNrSXNNdWx0aUluc3RhbmNlICYmIHJlc3VsdC5kYXRhLmN1cnJlbnRUYXNrTXVsdGlDb21wbGV0ZWRJbnN0YW5jZXMgKyAxIDwgcmVzdWx0LmRhdGEuY3VycmVudFRhc2tNdWx0aUNvdW50RW5nSW5zdGFuY2VzKSB7XG4gICAgICAgICAgdGhpcy5TZWxlY3RSZWNlaXZlckNvbXBsZXRlZChyZXN1bHQuZGF0YS5icG1uVGFza0xpc3QsIFtdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBVc2VyVGFza1JlY2VpdmVyRGlhbG9nVXRpbGl0eS5TaG93RGlhbG9nKF9wcm9wLnNlbmRlciwgcmVzdWx0LmRhdGEuYnBtblRhc2tMaXN0LCBfcHJvcC5zZW5kZXIuU2VsZWN0UmVjZWl2ZXJDb21wbGV0ZWQpO1xuICAgICAgICB9XG4gICAgICB9LCBfcHJvcC5zZW5kZXIpO1xuICAgIH1cbiAgfSxcbiAgU2VsZWN0UmVjZWl2ZXJDb21wbGV0ZWQ6IGZ1bmN0aW9uIFNlbGVjdFJlY2VpdmVyQ29tcGxldGVkKG5leHRUYXNrRW50aXR5TGlzdCwgc2VsZWN0ZWRSZWNlaXZlckRhdGEpIHtcbiAgICBEaWFsb2dVdGlsaXR5LkNvbmZpcm0od2luZG93LCBcIuehruiupOaJp+ihjOWPkemAgT9cIiwgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGVjdGVkUmVjZWl2ZXJWYXJzID0gRmxvd1J1bnRpbWVWYXJCdWlsZGVyLkJ1aWxkZXJTZWxlY3RlZFJlY2VpdmVyVG9JbnN0YW5jZVZhcihuZXh0VGFza0VudGl0eUxpc3QsIHNlbGVjdGVkUmVjZWl2ZXJEYXRhKTtcblxuICAgICAgaWYgKHRoaXMuaW5wdXRPcGluaW9uVGV4dCAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMubmV3T3Bpbmlvbkxpc3QucHVzaCh0aGlzLkJ1aWxkTmV3T3Bpbmlvbih0aGlzLmlucHV0T3BpbmlvblRleHQpKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHNlbmREYXRhID0gdGhpcy5CdWlsZFNlbmRUb1NlcnZlckRhdGEodGhpcy5fUHJvcCwge1xuICAgICAgICBzZWxlY3RlZFJlY2VpdmVyVmFyczogZW5jb2RlVVJJQ29tcG9uZW50KEpzb25VdGlsaXR5Lkpzb25Ub1N0cmluZyhzZWxlY3RlZFJlY2VpdmVyVmFycykpLFxuICAgICAgICBuZXdPcGluaW9uTGlzdFN0cmluZzogZW5jb2RlVVJJQ29tcG9uZW50KEpzb25VdGlsaXR5Lkpzb25Ub1N0cmluZyh0aGlzLm5ld09waW5pb25MaXN0KSlcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoc2VuZERhdGEuc3VjY2Vzcykge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0TG9hZGluZyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nTG9hZGluZ0lkLCB7fSwgXCLns7vnu5/lpITnkIbkuK0s6K+356iN5YCZIVwiKTtcbiAgICAgICAgQWpheFV0aWxpdHkuUG9zdCh0aGlzLmFjSW50ZXJmYWNlLmNvbXBsZXRlVGFzaywgc2VuZERhdGEuZGF0YSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQ2xvc2VEaWFsb2coRGlhbG9nVXRpbGl0eS5EaWFsb2dMb2FkaW5nSWQpO1xuXG4gICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgICBpZiAod2luZG93Lk9wZW5lcldpbmRvd09iaiAhPSBudWxsICYmIHdpbmRvdy5PcGVuZXJXaW5kb3dPYmouaW5zdGFuY2VNYWluVGFza1Byb2Nlc3NMaXN0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgd2luZG93Lk9wZW5lcldpbmRvd09iai5pbnN0YW5jZU1haW5UYXNrUHJvY2Vzc0xpc3QucmVsb2FkRGF0YSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgRGlhbG9nVXRpbGl0eS5GcmFtZV9DbG9zZURpYWxvZyh3aW5kb3cpO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRFcnJvcih3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRFcnJvcklkLCB7fSwgcmVzdWx0LmRhdGEubWVzc2FnZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzLl9Qcm9wLnNlbmRlcik7XG4gICAgICB9XG4gICAgfSwgdGhpcyk7XG4gIH0sXG4gIEJ1aWxkU2VuZFRvU2VydmVyRGF0YTogZnVuY3Rpb24gQnVpbGRTZW5kVG9TZXJ2ZXJEYXRhKF9wcm9wLCBhcHBlbmRTZW5kTWFwKSB7XG4gICAgdmFyIGZvcm1EYXRhQ29tcGxleFBPID0gX3Byb3AuZm9ybVJ1bnRpbWVJbnN0LlNlcmlhbGl6YXRpb25Gb3JtRGF0YSgpO1xuXG4gICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGlzU3RhcnRJbnN0YW5jZVN0YXR1czogX3Byb3AuaXNTdGFydEluc3RhbmNlU3RhdHVzLFxuICAgICAgICBhY3Rpb25Db2RlOiBfcHJvcC5hY3Rpb25PYmouYWN0aW9uQ29kZSxcbiAgICAgICAgZmxvd0luc3RhbmNlUnVudGltZVBPQ2FjaGVLZXk6IF9wcm9wLmZsb3dJbnN0YW5jZVJ1bnRpbWVQT0NhY2hlS2V5LFxuICAgICAgICBcImZvcm1SZWNvcmRDb21wbGV4UE9TdHJpbmdcIjogZW5jb2RlVVJJQ29tcG9uZW50KEpzb25VdGlsaXR5Lkpzb25Ub1N0cmluZyhmb3JtRGF0YUNvbXBsZXhQTykpLFxuICAgICAgICBcImN1cnJlbnROb2RlS2V5XCI6IF9wcm9wLmN1cnJlbnROb2RlS2V5LFxuICAgICAgICBcImN1cnJlbnROb2RlTmFtZVwiOiBfcHJvcC5jdXJyZW50Tm9kZU5hbWUsXG4gICAgICAgIFwicmVjb3JkSWRcIjogX3Byb3AucmVjb3JkSWQsXG4gICAgICAgIFwibW9kZWxJZFwiOiBfcHJvcC5tb2RlbElkLFxuICAgICAgICBcIm1vZGVsUmVLZXlcIjogX3Byb3AubW9kZWxSZUtleSxcbiAgICAgICAgXCJjdXJyZW50VGFza0lkXCI6IF9wcm9wLmN1cnJlbnRUYXNrSWQsXG4gICAgICAgIFwiaW5zdGFuY2VJZFwiOiBfcHJvcC5pbnN0YW5jZUlkLFxuICAgICAgICBcIm5ld09waW5pb25MaXN0U3RyaW5nXCI6IFwiXCJcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKGFwcGVuZFNlbmRNYXApIHtcbiAgICAgIGZvciAodmFyIGtleSBpbiBhcHBlbmRTZW5kTWFwKSB7XG4gICAgICAgIHJlc3VsdC5kYXRhW2tleV0gPSBhcHBlbmRTZW5kTWFwW2tleV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcbiAgQnVpbGROZXdPcGluaW9uOiBmdW5jdGlvbiBCdWlsZE5ld09waW5pb24ob3BpbmlvblRleHQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgb3BpbmlvblRleHQ6IG9waW5pb25UZXh0LFxuICAgICAgb3BpbmlvbkNsaWVudENvZGU6IFN0cmluZ1V0aWxpdHkuVGltZXN0YW1wKClcbiAgICB9O1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgdXNlclRhc2tSZWNlaXZlckRpYWxvZ091dGVyVnVlO1xudmFyIFVzZXJUYXNrUmVjZWl2ZXJEaWFsb2dVdGlsaXR5ID0ge1xuICBTaG93RGlhbG9nOiBmdW5jdGlvbiBTaG93RGlhbG9nKHNlbmRlciwgbmV4dEZsb3dOb2RlRW50aXRpZXMsIHNlbGVjdFJlY2VpdmVyQ29tcGxldGVkRnVuYykge1xuICAgIGlmICghdXNlclRhc2tSZWNlaXZlckRpYWxvZ091dGVyVnVlKSB7XG4gICAgICAkKGRvY3VtZW50LmJvZHkpLmFwcGVuZChcIjxkaXYgaWQ9J3VzZXJUYXNrUmVjZWl2ZXJEaWFsb2dPdXRlcic+PHVzZXItdGFzay1yZWNlaXZlci1kaWFsb2cgcmVmPSd1c2VyVGFza1JlY2VpdmVyRGlhbG9nJz48L3VzZXItdGFzay1yZWNlaXZlci1kaWFsb2c+PC9kaXY+XCIpO1xuICAgICAgdXNlclRhc2tSZWNlaXZlckRpYWxvZ091dGVyVnVlID0gbmV3IFZ1ZSh7XG4gICAgICAgIGVsOiBcIiN1c2VyVGFza1JlY2VpdmVyRGlhbG9nT3V0ZXJcIixcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGFjSW50ZXJmYWNlOiB7XG4gICAgICAgICAgICBnZXRSdW50aW1lTW9kZWxXaXRoU3RhcnQ6IFwiL1Jlc3QvV29ya2Zsb3cvUnVuVGltZS9DbGllbnQvTW9kZWxSdW50aW1lL0dldFJ1bnRpbWVNb2RlbFdpdGhTdGFydFwiXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBtb3VudGVkOiBmdW5jdGlvbiBtb3VudGVkKCkge30sXG4gICAgICAgIG1ldGhvZHM6IHt9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB1c2VyVGFza1JlY2VpdmVyRGlhbG9nT3V0ZXJWdWUuJHJlZnMudXNlclRhc2tSZWNlaXZlckRpYWxvZy5iZWdpblNlbGVjdFJlY2VpdmVyKHNlbmRlciwgbmV4dEZsb3dOb2RlRW50aXRpZXMsIHNlbGVjdFJlY2VpdmVyQ29tcGxldGVkRnVuYyk7XG4gIH0sXG4gIENsb3NlRGlhbG9nOiBmdW5jdGlvbiBDbG9zZURpYWxvZygpIHtcbiAgICBEaWFsb2dVdGlsaXR5LkNsb3NlRGlhbG9nRWxlbSh1c2VyVGFza1JlY2VpdmVyRGlhbG9nT3V0ZXJWdWUuJHJlZnMudXNlclRhc2tSZWNlaXZlckRpYWxvZy4kcmVmcy51c2VyVGFza1JlY2VpdmVyRGlhbG9nV3JhcCk7XG4gICAgdXNlclRhc2tSZWNlaXZlckRpYWxvZ091dGVyVnVlID0gbnVsbDtcbiAgICAkKFwiI3VzZXJUYXNrUmVjZWl2ZXJEaWFsb2dPdXRlclwiKS5yZW1vdmUoKTtcbiAgICBEaWFsb2dVdGlsaXR5LlJlbW92ZURpYWxvZ1JlbWFpbmluZ0VsZW0oXCJ1c2VyVGFza1JlY2VpdmVyRGlhbG9nSW5uZXJcIik7XG4gIH1cbn07XG5WdWUuY29tcG9uZW50KFwidXNlci10YXNrLXJlY2VpdmVyLWRpYWxvZ1wiLCB7XG4gIGRhdGE6IGZ1bmN0aW9uIGRhdGEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFjSW50ZXJmYWNlOiB7fSxcbiAgICAgIG5leHRGbG93Tm9kZUVudGl0aWVzOiBbXSxcbiAgICAgIHJlY2VpdmVyVHJlZToge1xuICAgICAgICB0cmVlU2V0dGluZzoge1xuICAgICAgICAgIHZpZXc6IHtcbiAgICAgICAgICAgIGRibENsaWNrRXhwYW5kOiBmYWxzZSxcbiAgICAgICAgICAgIHNob3dMaW5lOiB0cnVlLFxuICAgICAgICAgICAgZm9udENzczoge1xuICAgICAgICAgICAgICAnY29sb3InOiAnYmxhY2snLFxuICAgICAgICAgICAgICAnZm9udC13ZWlnaHQnOiAnbm9ybWFsJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY2hlY2s6IHtcbiAgICAgICAgICAgIGVuYWJsZTogZmFsc2UsXG4gICAgICAgICAgICBub2NoZWNrSW5oZXJpdDogZmFsc2UsXG4gICAgICAgICAgICByYWRpb1R5cGU6IFwiYWxsXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIGFzeW5jOiB7XG4gICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICBjb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIixcbiAgICAgICAgICAgIHVybDogQmFzZVV0aWxpdHkuQnVpbGRBY3Rpb24oXCIvUmVzdC9Xb3JrZmxvdy9SdW5UaW1lL0NsaWVudC9SZWNlaXZlclJ1bnRpbWUvR2V0QXN5bmNSZWNlaXZlcnNcIiksXG4gICAgICAgICAgICBhdXRvUGFyYW06IFtcImlkXCIsIFwidHlwZU5hbWVcIiwgXCJuYW1lXCJdXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBrZXk6IHtcbiAgICAgICAgICAgICAgbmFtZTogXCJuYW1lXCIsXG4gICAgICAgICAgICAgIGNoaWxkcmVuOiBcInJ1bnRpbWVSZWNlaXZlVXNlcnNcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNpbXBsZURhdGE6IHtcbiAgICAgICAgICAgICAgZW5hYmxlOiB0cnVlLFxuICAgICAgICAgICAgICBpZEtleTogXCJpZFwiLFxuICAgICAgICAgICAgICBwSWRLZXk6IFwicGFyZW50SWRcIixcbiAgICAgICAgICAgICAgcm9vdFBJZDogbnVsbFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY2FsbGJhY2s6IHtcbiAgICAgICAgICAgIG9uQ2xpY2s6IGZ1bmN0aW9uIG9uQ2xpY2soZXZlbnQsIHRyZWVJZCwgdHJlZU5vZGUpIHt9LFxuICAgICAgICAgICAgb25EYmxDbGljazogZnVuY3Rpb24gb25EYmxDbGljayhldmVudCwgdHJlZUlkLCB0cmVlTm9kZSkge1xuICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzLmdldFpUcmVlT2JqKHRyZWVJZCkuX2hvc3Q7XG5cbiAgICAgICAgICAgICAgdmFyIGZsb3dOb2RlRW50aXR5ID0gdGhpcy5nZXRaVHJlZU9iaih0cmVlSWQpLmZsb3dOb2RlRW50aXR5O1xuICAgICAgICAgICAgICB2YXIgcmVjZWl2ZVR5cGUgPSB0aGlzLmdldFpUcmVlT2JqKHRyZWVJZCkucmVjZWl2ZVR5cGU7XG5cbiAgICAgICAgICAgICAgX3RoaXMuYWRkUmVjZWl2ZXJUb1NlbGVjdGVkKHRyZWVOb2RlLCBmbG93Tm9kZUVudGl0eSwgcmVjZWl2ZVR5cGUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJlZm9yZUFzeW5jOiBmdW5jdGlvbiBiZWZvcmVBc3luYyh0cmVlSWQsIHRyZWVOb2RlKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRyZWVJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB0cmVlT2JqTWFwOiB7fVxuICAgICAgfSxcbiAgICAgIHNlbGVjdGVkUmVjZWl2ZXI6IHtcbiAgICAgICAgY29sdW1uc0NvbmZpZzogW3tcbiAgICAgICAgICB0aXRsZTogJ+W3sumAieeUqOaItycsXG4gICAgICAgICAga2V5OiAnbmFtZScsXG4gICAgICAgICAgd2lkdGg6IDE4OCxcbiAgICAgICAgICBhbGlnbjogXCJjZW50ZXJcIlxuICAgICAgICB9LCB7XG4gICAgICAgICAgdGl0bGU6ICfmk43kvZwnLFxuICAgICAgICAgIHNsb3Q6ICdhY3Rpb24nLFxuICAgICAgICAgIHdpZHRoOiA3MCxcbiAgICAgICAgICBhbGlnbjogXCJjZW50ZXJcIlxuICAgICAgICB9XSxcbiAgICAgICAgcmVjZWl2ZXJEYXRhOiBbXVxuICAgICAgfVxuICAgIH07XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7fSxcbiAgZmlsdGVyczoge1xuICAgIGZpbHRlclJlY2VpdmVyRGF0YTogZnVuY3Rpb24gZmlsdGVyUmVjZWl2ZXJEYXRhKHJlY2VpdmVyRGF0YSwgZmxvd05vZGVFbnRpdHksIHJlY2VpdmVUeXBlKSB7XG4gICAgICByZXR1cm4gcmVjZWl2ZXJEYXRhLmZpbHRlcihmdW5jdGlvbiAocmVjZWl2ZXIpIHtcbiAgICAgICAgcmV0dXJuIHJlY2VpdmVyLmZsb3dOb2RlRW50aXR5LmlkID09IGZsb3dOb2RlRW50aXR5LmlkICYmIHJlY2VpdmVyLnJlY2VpdmVUeXBlID09IHJlY2VpdmVUeXBlO1xuICAgICAgfSk7XG4gICAgfVxuICB9LFxuICBtZXRob2RzOiB7XG4gICAgYmVnaW5TZWxlY3RSZWNlaXZlcjogZnVuY3Rpb24gYmVnaW5TZWxlY3RSZWNlaXZlcihzZW5kZXIsIG5leHRGbG93Tm9kZUVudGl0aWVzLCBzZWxlY3RSZWNlaXZlckNvbXBsZXRlZEZ1bmMpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIHZhciBlbGVtID0gdGhpcy4kcmVmcy51c2VyVGFza1JlY2VpdmVyRGlhbG9nV3JhcDtcbiAgICAgIERpYWxvZ1V0aWxpdHkuRGlhbG9nRWxlbU9iaihlbGVtLCB7XG4gICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICB3aWR0aDogNjUwLFxuICAgICAgICBoZWlnaHQ6IDYwMCxcbiAgICAgICAgdGl0bGU6IFwi6YCJ5oup5o6l5pS25Lq65ZGYXCIsXG4gICAgICAgIHJlc2l6YWJsZTogZmFsc2UsXG4gICAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgICBcIuehruiupFwiOiBmdW5jdGlvbiBfKCkge1xuICAgICAgICAgICAgaWYgKF90aGlzLnZhbGlkYXRlQ29tcGxldGVFbmFibGUoKS5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgIHNlbGVjdFJlY2VpdmVyQ29tcGxldGVkRnVuYy5jYWxsKHNlbmRlciwgX3RoaXMubmV4dEZsb3dOb2RlRW50aXRpZXMsIF90aGlzLnNlbGVjdGVkUmVjZWl2ZXIucmVjZWl2ZXJEYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwi5Y+W5raIXCI6IGZ1bmN0aW9uIF8oKSB7XG4gICAgICAgICAgICBVc2VyVGFza1JlY2VpdmVyRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgb3BlbjogZnVuY3Rpb24gb3BlbihldmVudCwgdWkpIHtcbiAgICAgICAgICAkKFwiLnVpLWRpYWxvZy10aXRsZWJhci1jbG9zZVwiLCAkKHRoaXMpLnBhcmVudCgpKS5oaWRlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy5uZXh0Rmxvd05vZGVFbnRpdGllcyA9IG5leHRGbG93Tm9kZUVudGl0aWVzO1xuICAgICAgd2luZG93LnNldFRpbWVvdXQodGhpcy5pbml0VHJlZSwgNTAwKTtcbiAgICB9LFxuICAgIGdldFJvb3RPcmdhbk1haW5SZWNlaXZlT2JqZWN0czogZnVuY3Rpb24gZ2V0Um9vdE9yZ2FuTWFpblJlY2VpdmVPYmplY3RzKCkge1xuICAgICAgcmV0dXJuIFt7XG4gICAgICAgIFwidmFsdWVcIjogbnVsbCxcbiAgICAgICAgXCJ0ZXh0XCI6IG51bGwsXG4gICAgICAgIFwiaWRcIjogXCIwXCIsXG4gICAgICAgIFwicGFyZW50SWRcIjogbnVsbCxcbiAgICAgICAgXCJvdXRlcklkXCI6IG51bGwsXG4gICAgICAgIFwiY29kZVwiOiBcIjAwMDBcIixcbiAgICAgICAgXCJhdHRyMVwiOiBudWxsLFxuICAgICAgICBcImF0dHIyXCI6IG51bGwsXG4gICAgICAgIFwiYXR0cjNcIjogbnVsbCxcbiAgICAgICAgXCJhdHRyNFwiOiBudWxsLFxuICAgICAgICBcIm5vZGVUeXBlTmFtZVwiOiBudWxsLFxuICAgICAgICBcImljb25cIjogbnVsbCxcbiAgICAgICAgXCJub2NoZWNrXCI6IGZhbHNlLFxuICAgICAgICBcImlzUGFyZW50XCI6IFwidHJ1ZVwiLFxuICAgICAgICBcIm9wZW5cIjogZmFsc2UsXG4gICAgICAgIFwibmFtZVwiOiBcIue7hOe7h+acuuaehOeuoeeQhlwiLFxuICAgICAgICBcInR5cGVOYW1lXCI6IFwiT3JnYW5zXCIsXG4gICAgICAgIFwiZGVzY1wiOiBudWxsLFxuICAgICAgICBcInN0YXR1c1wiOiBcIuWQr+eUqFwiLFxuICAgICAgICBcImZpbHRlclwiOiBcIlwiLFxuICAgICAgICBcIm9yZGVyTnVtXCI6IDIyLFxuICAgICAgICBcInJ1bnRpbWVSZWNlaXZlVXNlcnNcIjogbnVsbCxcbiAgICAgICAgXCJncm91cFwiOiB0cnVlLFxuICAgICAgICBcImN1c3ROYW1lXCI6IGZhbHNlXG4gICAgICB9XTtcbiAgICB9LFxuICAgIGluaXRUcmVlOiBmdW5jdGlvbiBpbml0VHJlZSgpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5uZXh0Rmxvd05vZGVFbnRpdGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZmxvd05vZGVFbnRpdHkgPSB0aGlzLm5leHRGbG93Tm9kZUVudGl0aWVzW2ldO1xuXG4gICAgICAgIGlmIChmbG93Tm9kZUVudGl0eS5leHRlbnNpb25FbGVtZW50cyAmJiBmbG93Tm9kZUVudGl0eS5leHRlbnNpb25FbGVtZW50cy5qYjRkY01haW5SZWNlaXZlT2JqZWN0cyAmJiBmbG93Tm9kZUVudGl0eS5leHRlbnNpb25FbGVtZW50cy5qYjRkY01haW5SZWNlaXZlT2JqZWN0cy5ydW50aW1lUmVjZWl2ZUdyb3Vwcykge1xuICAgICAgICAgIHZhciB0cmVlT2JqS2V5ID0gdGhpcy5idWlsZFVsVHJlZUlkKGZsb3dOb2RlRW50aXR5LCBcIm1haW5cIik7XG4gICAgICAgICAgdGhpcy5yZWNlaXZlclRyZWUudHJlZU9iak1hcFt0cmVlT2JqS2V5XSA9ICQuZm4uelRyZWUuaW5pdCgkKFwiI1wiICsgdHJlZU9iaktleSksIHRoaXMucmVjZWl2ZXJUcmVlLnRyZWVTZXR0aW5nLCBmbG93Tm9kZUVudGl0eS5leHRlbnNpb25FbGVtZW50cy5qYjRkY01haW5SZWNlaXZlT2JqZWN0cy5ydW50aW1lUmVjZWl2ZUdyb3Vwcyk7XG4gICAgICAgICAgdGhpcy5yZWNlaXZlclRyZWUudHJlZU9iak1hcFt0cmVlT2JqS2V5XS5faG9zdCA9IHRoaXM7XG4gICAgICAgICAgdGhpcy5yZWNlaXZlclRyZWUudHJlZU9iak1hcFt0cmVlT2JqS2V5XS5mbG93Tm9kZUVudGl0eSA9IGZsb3dOb2RlRW50aXR5O1xuICAgICAgICAgIHRoaXMucmVjZWl2ZXJUcmVlLnRyZWVPYmpNYXBbdHJlZU9iaktleV0ucmVjZWl2ZVR5cGUgPSBcIm1haW5cIjtcbiAgICAgICAgfSBlbHNlIGlmICghZmxvd05vZGVFbnRpdHkuZXh0ZW5zaW9uRWxlbWVudHMgfHwgIWZsb3dOb2RlRW50aXR5LmV4dGVuc2lvbkVsZW1lbnRzLmpiNGRjTWFpblJlY2VpdmVPYmplY3RzIHx8ICFmbG93Tm9kZUVudGl0eS5leHRlbnNpb25FbGVtZW50cy5qYjRkY01haW5SZWNlaXZlT2JqZWN0cy5qYjRkY1JlY2VpdmVPYmplY3RMaXN0KSB7XG4gICAgICAgICAgdmFyIF90cmVlT2JqS2V5ID0gdGhpcy5idWlsZFVsVHJlZUlkKGZsb3dOb2RlRW50aXR5LCBcIm1haW5cIik7XG5cbiAgICAgICAgICB0aGlzLnJlY2VpdmVyVHJlZS50cmVlT2JqTWFwW190cmVlT2JqS2V5XSA9ICQuZm4uelRyZWUuaW5pdCgkKFwiI1wiICsgX3RyZWVPYmpLZXkpLCB0aGlzLnJlY2VpdmVyVHJlZS50cmVlU2V0dGluZywgdGhpcy5nZXRSb290T3JnYW5NYWluUmVjZWl2ZU9iamVjdHMoKSk7XG4gICAgICAgICAgdGhpcy5yZWNlaXZlclRyZWUudHJlZU9iak1hcFtfdHJlZU9iaktleV0uX2hvc3QgPSB0aGlzO1xuICAgICAgICAgIHRoaXMucmVjZWl2ZXJUcmVlLnRyZWVPYmpNYXBbX3RyZWVPYmpLZXldLmZsb3dOb2RlRW50aXR5ID0gZmxvd05vZGVFbnRpdHk7XG4gICAgICAgICAgdGhpcy5yZWNlaXZlclRyZWUudHJlZU9iak1hcFtfdHJlZU9iaktleV0ucmVjZWl2ZVR5cGUgPSBcIm1haW5cIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmbG93Tm9kZUVudGl0eS5leHRlbnNpb25FbGVtZW50cyAmJiBmbG93Tm9kZUVudGl0eS5leHRlbnNpb25FbGVtZW50cy5qYjRkY0NDUmVjZWl2ZU9iamVjdHMgJiYgZmxvd05vZGVFbnRpdHkuZXh0ZW5zaW9uRWxlbWVudHMuamI0ZGNDQ1JlY2VpdmVPYmplY3RzLnJ1bnRpbWVSZWNlaXZlR3JvdXBzKSB7XG4gICAgICAgICAgdmFyIF90cmVlT2JqS2V5MiA9IHRoaXMuYnVpbGRVbFRyZWVJZChmbG93Tm9kZUVudGl0eSwgXCJjY1wiKTtcblxuICAgICAgICAgIHRoaXMucmVjZWl2ZXJUcmVlLnRyZWVPYmpNYXBbX3RyZWVPYmpLZXkyXSA9ICQuZm4uelRyZWUuaW5pdCgkKFwiI1wiICsgX3RyZWVPYmpLZXkyKSwgdGhpcy5yZWNlaXZlclRyZWUudHJlZVNldHRpbmcsIGZsb3dOb2RlRW50aXR5LmV4dGVuc2lvbkVsZW1lbnRzLmpiNGRjQ0NSZWNlaXZlT2JqZWN0cy5ydW50aW1lUmVjZWl2ZUdyb3Vwcyk7XG4gICAgICAgICAgdGhpcy5yZWNlaXZlclRyZWUudHJlZU9iak1hcFtfdHJlZU9iaktleTJdLl9ob3N0ID0gdGhpcztcbiAgICAgICAgICB0aGlzLnJlY2VpdmVyVHJlZS50cmVlT2JqTWFwW190cmVlT2JqS2V5Ml0uZmxvd05vZGVFbnRpdHkgPSBmbG93Tm9kZUVudGl0eTtcbiAgICAgICAgICB0aGlzLnJlY2VpdmVyVHJlZS50cmVlT2JqTWFwW190cmVlT2JqS2V5Ml0ucmVjZWl2ZVR5cGUgPSBcImNjXCI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGJ1aWxkVWxUcmVlSWQ6IGZ1bmN0aW9uIGJ1aWxkVWxUcmVlSWQoZmxvd05vZGVFbnRpdHksIHJlY2VpdmVUeXBlKSB7XG4gICAgICByZXR1cm4gJ3VsVHJlZV8nICsgcmVjZWl2ZVR5cGUgKyBcIl9cIiArIGZsb3dOb2RlRW50aXR5LmlkO1xuICAgIH0sXG4gICAgYWRkVHJlZVNlbGVjdGVkUmVjZWl2ZXJUb1NlbGVjdGVkOiBmdW5jdGlvbiBhZGRUcmVlU2VsZWN0ZWRSZWNlaXZlclRvU2VsZWN0ZWQoZmxvd05vZGVFbnRpdHksIHJlY2VpdmVUeXBlKSB7XG4gICAgICB2YXIgdHJlZUtleSA9IHRoaXMuYnVpbGRVbFRyZWVJZChmbG93Tm9kZUVudGl0eSwgcmVjZWl2ZVR5cGUpO1xuICAgICAgdmFyIHRyZWVPYmplY3QgPSB0aGlzLnJlY2VpdmVyVHJlZS50cmVlT2JqTWFwW3RyZWVLZXldO1xuXG4gICAgICBpZiAodHJlZU9iamVjdCkge1xuICAgICAgICB2YXIgc2VsZWN0Tm9kZXMgPSB0cmVlT2JqZWN0LmdldFNlbGVjdGVkTm9kZXMoKTtcblxuICAgICAgICBpZiAoc2VsZWN0Tm9kZXMgJiYgc2VsZWN0Tm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHRoaXMuYWRkUmVjZWl2ZXJUb1NlbGVjdGVkKHNlbGVjdE5vZGVzWzBdLCBmbG93Tm9kZUVudGl0eSwgcmVjZWl2ZVR5cGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBhZGRSZWNlaXZlclRvU2VsZWN0ZWQ6IGZ1bmN0aW9uIGFkZFJlY2VpdmVyVG9TZWxlY3RlZChzZWxlY3ROb2RlLCBmbG93Tm9kZUVudGl0eSwgcmVjZWl2ZVR5cGUpIHtcbiAgICAgIHZhciBpc011bHRpSW5zdGFuY2VUYXNrID0gdGhpcy5pc011bHRpSW5zdGFuY2VUYXNrKGZsb3dOb2RlRW50aXR5KTtcbiAgICAgIHZhciBpbm5lclNpbmdsZUlkID0gZmxvd05vZGVFbnRpdHkuaWQgKyBcIl9cIiArIHJlY2VpdmVUeXBlICsgXCJfXCIgKyBzZWxlY3ROb2RlLmlkO1xuXG4gICAgICBpZiAoc2VsZWN0Tm9kZS50eXBlTmFtZSA9PSBcIlNpbmdsZVVzZXJcIikge1xuICAgICAgICBzZWxlY3ROb2RlLmlubmVyU2luZ2xlSWQgPSBpbm5lclNpbmdsZUlkO1xuICAgICAgICBzZWxlY3ROb2RlLmZsb3dOb2RlRW50aXR5ID0gZmxvd05vZGVFbnRpdHk7XG4gICAgICAgIHNlbGVjdE5vZGUucmVjZWl2ZVR5cGUgPSByZWNlaXZlVHlwZTtcblxuICAgICAgICBpZiAoKHJlY2VpdmVUeXBlID09IFwiY2NcIiB8fCBpc011bHRpSW5zdGFuY2VUYXNrKSAmJiAhQXJyYXlVdGlsaXR5LkV4aXN0KHRoaXMuc2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGEsIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgcmV0dXJuIGl0ZW0uaW5uZXJTaW5nbGVJZCA9PSBpbm5lclNpbmdsZUlkO1xuICAgICAgICB9KSkge1xuICAgICAgICAgIHRoaXMuc2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGEucHVzaChzZWxlY3ROb2RlKTtcbiAgICAgICAgfSBlbHNlIGlmIChyZWNlaXZlVHlwZSA9PSBcIm1haW5cIiAmJiAhaXNNdWx0aUluc3RhbmNlVGFzaykge1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zZWxlY3RlZFJlY2VpdmVyLnJlY2VpdmVyRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGFbaV0uZmxvd05vZGVFbnRpdHkuaWQgPT0gZmxvd05vZGVFbnRpdHkuaWQgJiYgdGhpcy5zZWxlY3RlZFJlY2VpdmVyLnJlY2VpdmVyRGF0YVtpXS5yZWNlaXZlVHlwZSA9PSByZWNlaXZlVHlwZSkge1xuICAgICAgICAgICAgICBBcnJheVV0aWxpdHkuRGVsZXRlKHRoaXMuc2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGEsIGkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuc2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGEucHVzaChzZWxlY3ROb2RlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChpc011bHRpSW5zdGFuY2VUYXNrICYmIChzZWxlY3ROb2RlLnR5cGVOYW1lID09IFwiVXNlcnNcIiB8fCBzZWxlY3ROb2RlLnR5cGVOYW1lID09IFwiUm9sZVwiIHx8IHNlbGVjdE5vZGUudHlwZU5hbWUgPT0gXCJPcmdhbnNcIikpIHtcbiAgICAgICAgaWYgKHNlbGVjdE5vZGUucnVudGltZVJlY2VpdmVVc2VycyAhPSBudWxsICYmIHNlbGVjdE5vZGUucnVudGltZVJlY2VpdmVVc2Vycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IHNlbGVjdE5vZGUucnVudGltZVJlY2VpdmVVc2Vycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciBjaGlsZE5vZGUgPSBzZWxlY3ROb2RlLnJ1bnRpbWVSZWNlaXZlVXNlcnNbX2ldO1xuXG4gICAgICAgICAgICBpZiAoY2hpbGROb2RlLnR5cGVOYW1lID09IFwiU2luZ2xlVXNlclwiKSB7XG4gICAgICAgICAgICAgIHRoaXMuYWRkUmVjZWl2ZXJUb1NlbGVjdGVkKGNoaWxkTm9kZSwgZmxvd05vZGVFbnRpdHksIHJlY2VpdmVUeXBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGNsZWFyU2VsZWN0ZWRSZWNlaXZlclRvU2VsZWN0ZWQ6IGZ1bmN0aW9uIGNsZWFyU2VsZWN0ZWRSZWNlaXZlclRvU2VsZWN0ZWQoZmxvd05vZGVFbnRpdHksIHJlY2VpdmVUeXBlKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy5zZWxlY3RlZFJlY2VpdmVyLnJlY2VpdmVyRGF0YS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICB2YXIgcmVjZWl2ZXIgPSB0aGlzLnNlbGVjdGVkUmVjZWl2ZXIucmVjZWl2ZXJEYXRhW2ldO1xuXG4gICAgICAgIGlmIChyZWNlaXZlci5mbG93Tm9kZUVudGl0eS5pZCA9PSBmbG93Tm9kZUVudGl0eS5pZCAmJiByZWNlaXZlci5yZWNlaXZlVHlwZSA9PSByZWNlaXZlVHlwZSkge1xuICAgICAgICAgIEFycmF5VXRpbGl0eS5EZWxldGUodGhpcy5zZWxlY3RlZFJlY2VpdmVyLnJlY2VpdmVyRGF0YSwgaSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGRlbGV0ZVNlbGVjdGVkUmVjZWl2ZXI6IGZ1bmN0aW9uIGRlbGV0ZVNlbGVjdGVkUmVjZWl2ZXIoaW5kZXgsIHJvdykge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnNlbGVjdGVkUmVjZWl2ZXIucmVjZWl2ZXJEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkUmVjZWl2ZXIucmVjZWl2ZXJEYXRhW2ldLmlubmVyU2luZ2xlSWQgPT0gcm93LmlubmVyU2luZ2xlSWQpIHtcbiAgICAgICAgICBBcnJheVV0aWxpdHkuRGVsZXRlKHRoaXMuc2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGEsIGkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBpc011bHRpSW5zdGFuY2VUYXNrOiBmdW5jdGlvbiBpc011bHRpSW5zdGFuY2VUYXNrKGZsb3dOb2RlRW50aXR5KSB7XG4gICAgICByZXR1cm4gZmxvd05vZGVFbnRpdHkubXVsdGlJbnN0YW5jZVRhc2s7XG4gICAgfSxcbiAgICBidWlsZFRhYkxhYmVsOiBmdW5jdGlvbiBidWlsZFRhYkxhYmVsKGZsb3dOb2RlRW50aXR5KSB7XG4gICAgICByZXR1cm4gZmxvd05vZGVFbnRpdHkubmFtZSArIFwiIFtcIiArICh0aGlzLmlzTXVsdGlJbnN0YW5jZVRhc2soZmxvd05vZGVFbnRpdHkpID8gXCLlpJrkurpcIiA6IFwi5Y2V5Lq6XCIpICsgXCJdXCI7XG4gICAgfSxcbiAgICB2YWxpZGF0ZUNvbXBsZXRlRW5hYmxlOiBmdW5jdGlvbiB2YWxpZGF0ZUNvbXBsZXRlRW5hYmxlKCkge1xuICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgIHZhciBlcnJvck1lc3NhZ2VzID0gW107XG4gICAgICB2YXIgc3VjY2VzcyA9IHRydWU7XG5cbiAgICAgIHZhciBfbG9vcCA9IGZ1bmN0aW9uIF9sb29wKGkpIHtcbiAgICAgICAgaWYgKF90aGlzMi5uZXh0Rmxvd05vZGVFbnRpdGllc1tpXS50YXNrVHlwZU5hbWUgPT0gXCJjb20uamI0ZGMud29ya2Zsb3cucG8uYnBtbi5wcm9jZXNzLkJwbW5Vc2VyVGFza1wiKSB7XG4gICAgICAgICAgaWYgKCFBcnJheVV0aWxpdHkuRXhpc3QoX3RoaXMyLnNlbGVjdGVkUmVjZWl2ZXIucmVjZWl2ZXJEYXRhLCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW0uZmxvd05vZGVFbnRpdHkuaWQgPT0gX3RoaXMyLm5leHRGbG93Tm9kZUVudGl0aWVzW2ldLmlkICYmIGl0ZW0ucmVjZWl2ZVR5cGUgPT0gXCJtYWluXCI7XG4gICAgICAgICAgfSkpIHtcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZXMucHVzaCh7XG4gICAgICAgICAgICAgIHRhc2tOYW1lOiBfdGhpczIubmV4dEZsb3dOb2RlRW50aXRpZXNbaV0ubmFtZSxcbiAgICAgICAgICAgICAgZmxvd05vZGVFbnRpdHk6IF90aGlzMi5uZXh0Rmxvd05vZGVFbnRpdGllc1tpXSxcbiAgICAgICAgICAgICAgbWVzc2FnZTogXCLnjq/oioJbXCIgKyBfdGhpczIubmV4dEZsb3dOb2RlRW50aXRpZXNbaV0ubmFtZSArIFwiXeiHs+WwkemcgOimgeiuvue9ruS4gOS4quaOpeaUtueUqOaItyFcIlxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubmV4dEZsb3dOb2RlRW50aXRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgX2xvb3AoaSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChlcnJvck1lc3NhZ2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdmFyIGVycm9yVGV4dEFyeSA9IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXJyb3JNZXNzYWdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGVycm9yVGV4dEFyeS5wdXNoKGVycm9yTWVzc2FnZXNbaV0ubWVzc2FnZSk7XG4gICAgICAgIH1cblxuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChlcnJvclRleHRBcnkuam9pbihcIjxiciAvPlwiKSwgdGhpcyk7XG4gICAgICAgIHN1Y2Nlc3MgPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3VjY2Vzczogc3VjY2Vzc1xuICAgICAgfTtcbiAgICB9XG4gIH0sXG4gIHRlbXBsYXRlOiBcIjxkaXYgaWQ9XFxcInVzZXJUYXNrUmVjZWl2ZXJEaWFsb2dJbm5lclxcXCIgcmVmPVxcXCJ1c2VyVGFza1JlY2VpdmVyRGlhbG9nV3JhcFxcXCIgc3R5bGU9XFxcImRpc3BsYXk6IG5vbmVcXFwiPlxcbiAgICAgICAgICAgICAgICA8dGFicyBuYW1lPVxcXCJ1c2VyVGFza1JlY2VpdmVyRGlhbG9nVGFic1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8dGFiLXBhbmUgOmxhYmVsPVxcXCJidWlsZFRhYkxhYmVsKGZsb3dOb2RlRW50aXR5KVxcXCIgdGFiPVxcXCJ1c2VyVGFza1JlY2VpdmVyRGlhbG9nVGFic1xcXCIgdi1mb3I9XFxcImZsb3dOb2RlRW50aXR5IGluIG5leHRGbG93Tm9kZUVudGl0aWVzXFxcIiA6a2V5PVxcXCJmbG93Tm9kZUVudGl0eS5pZFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGNvbGxhcHNlIGFjY29yZGlvbiB2YWx1ZT1cXFwibWFpblJlY2VpdmVyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhbmVsIG5hbWU9XFxcIm1haW5SZWNlaXZlclxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXHU0RTNCXFx1OTAwMVxcdTRFQkFcXHU1NDU4XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHNsb3Q9XFxcImNvbnRlbnRcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInVzZXItdGFzay1yZWNlaXZlci1kaWFsb2ctb3V0ZXItd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNlbGVjdEVuYWJsZVVzZXJMaXN0XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1bCA6aWQ9XFxcImJ1aWxkVWxUcmVlSWQoZmxvd05vZGVFbnRpdHksJ21haW4nKVxcXCIgY2xhc3M9XFxcInp0cmVlXFxcIiBzdHlsZT1cXFwid2lkdGg6IDIwMHB4XFxcIj48L3VsPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic2VsZWN0T3BCdXR0b25Db250YWluZXJcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic2luZ2xlLW9wLWJ1dHRvblxcXCIgdGl0bGU9XFxcIlxcdTZERkJcXHU1MkEwXFx1NEVCQVxcdTU0NThcXFwiIEBjbGljaz1cXFwiYWRkVHJlZVNlbGVjdGVkUmVjZWl2ZXJUb1NlbGVjdGVkKGZsb3dOb2RlRW50aXR5LCdtYWluJylcXFwiPjxJY29uIHR5cGU9XFxcIm1kLWFycm93LXJvdW5kLWZvcndhcmRcXFwiIC8+PC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJzaW5nbGUtb3AtYnV0dG9uXFxcIiB0aXRsZT1cXFwiXFx1NkUwNVxcdTdBN0FcXHU1REYyXFx1OTAwOVxcdTRFQkFcXHU1NDU4XFxcIiBAY2xpY2s9XFxcImNsZWFyU2VsZWN0ZWRSZWNlaXZlclRvU2VsZWN0ZWQoZmxvd05vZGVFbnRpdHksJ21haW4nKVxcXCI+PEljb24gdHlwZT1cXFwibWQtYmFja3NwYWNlXFxcIiAvPjwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic2VsZWN0ZWRVc2VyTGlzdFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS10YWJsZSBoZWlnaHQ9XFxcIjMyN1xcXCIgd2lkdGg9XFxcIjI2MFxcXCIgc3RyaXBlIDpjb2x1bW5zPVxcXCJzZWxlY3RlZFJlY2VpdmVyLmNvbHVtbnNDb25maWdcXFwiIDpkYXRhPVxcXCJzZWxlY3RlZFJlY2VpdmVyLnJlY2VpdmVyRGF0YSB8IGZpbHRlclJlY2VpdmVyRGF0YShmbG93Tm9kZUVudGl0eSwgJ21haW4nKVxcXCJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XFxcIml2LWxpc3QtdGFibGVcXFwiIHNpemU9XFxcInNtYWxsXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRlbXBsYXRlIHNsb3Qtc2NvcGU9XFxcInsgcm93LCBpbmRleCB9XFxcIiBzbG90PVxcXCJhY3Rpb25cXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJsaXN0LWZvbnQtaWNvbi1idXR0b24tY2xhc3NcXFwiIEBjbGljaz1cXFwiZGVsZXRlU2VsZWN0ZWRSZWNlaXZlcihpbmRleCxyb3cpXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxJY29uIHR5cGU9XFxcIm1kLWNsb3NlXFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RlbXBsYXRlPiAgICAgXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktdGFibGU+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvcGFuZWw+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYW5lbCBuYW1lPVxcXCJjY1JlY2VpdmVyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdTYyODRcXHU5MDAxXFx1NEVCQVxcdTU0NThcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc2xvdD1cXFwiY29udGVudFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwidXNlci10YXNrLXJlY2VpdmVyLWRpYWxvZy1vdXRlci13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic2VsZWN0RW5hYmxlVXNlckxpc3RcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVsIDppZD1cXFwiYnVpbGRVbFRyZWVJZChmbG93Tm9kZUVudGl0eSwnY2MnKVxcXCIgY2xhc3M9XFxcInp0cmVlXFxcIiBzdHlsZT1cXFwid2lkdGg6IDIwMHB4XFxcIj48L3VsPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic2VsZWN0T3BCdXR0b25Db250YWluZXJcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic2luZ2xlLW9wLWJ1dHRvblxcXCIgdGl0bGU9XFxcIlxcdTZERkJcXHU1MkEwXFx1NEVCQVxcdTU0NThcXFwiIEBjbGljaz1cXFwiYWRkUmVjZWl2ZXJUb1NlbGVjdGVkKGZsb3dOb2RlRW50aXR5LCdjYycpXFxcIj48SWNvbiB0eXBlPVxcXCJtZC1hcnJvdy1yb3VuZC1mb3J3YXJkXFxcIiAvPjwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic2luZ2xlLW9wLWJ1dHRvblxcXCIgdGl0bGU9XFxcIlxcdTZFMDVcXHU3QTdBXFx1NURGMlxcdTkwMDlcXHU0RUJBXFx1NTQ1OFxcXCI+PEljb24gdHlwZT1cXFwibWQtYmFja3NwYWNlXFxcIiAvPjwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic2VsZWN0ZWRVc2VyTGlzdFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aS10YWJsZSBoZWlnaHQ9XFxcIjMyN1xcXCIgd2lkdGg9XFxcIjI2MFxcXCIgc3RyaXBlIDpjb2x1bW5zPVxcXCJzZWxlY3RlZFJlY2VpdmVyLmNvbHVtbnNDb25maWdcXFwiIDpkYXRhPVxcXCJzZWxlY3RlZFJlY2VpdmVyLnJlY2VpdmVyRGF0YSB8IGZpbHRlclJlY2VpdmVyRGF0YShmbG93Tm9kZUVudGl0eSwgJ2NjJylcXFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJpdi1saXN0LXRhYmxlXFxcIiBzaXplPVxcXCJzbWFsbFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZW1wbGF0ZSBzbG90LXNjb3BlPVxcXCJ7IHJvdywgaW5kZXggfVxcXCIgc2xvdD1cXFwiYWN0aW9uXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibGlzdC1mb250LWljb24tYnV0dG9uLWNsYXNzXFxcIiBAY2xpY2s9XFxcImRlbGV0ZVNlbGVjdGVkUmVjZWl2ZXIoaW5kZXgscm93KVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SWNvbiB0eXBlPVxcXCJtZC1jbG9zZVxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZW1wbGF0ZT4gICAgIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pLXRhYmxlPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3BhbmVsPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvY29sbGFwc2U+XFxuICAgICAgICAgICAgICAgICAgICA8L3RhYi1wYW5lPlxcbiAgICAgICAgICAgICAgICA8L3RhYnM+XFxuICAgICAgICAgICAgPC9kaXY+XCJcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRG9jdW1lbnRDb250ZW50VXBsb2FkQ29udmVydFRvUERGUGx1Z2luID0ge1xuICBvbmNoYW5nZUZpbGU6IGZ1bmN0aW9uIG9uY2hhbmdlRmlsZShzZW5kZXIpIHtcbiAgICAkKFwiI2RvYy1zZWxlY3RlZC1maWxlXCIpLmh0bWwoJChzZW5kZXIpLnZhbCgpKTtcbiAgfSxcbiAgdXBsb2FkQW5kQ29udmVydFRvUERGOiBmdW5jdGlvbiB1cGxvYWRBbmRDb252ZXJ0VG9QREYoc2VuZGVyLCBpbnN0YW5jZUlkLCBidXNpbmVzc0tleSkge1xuICAgIGlmICghJChcIiNzb3VyY2VGaWxlXCIpLnZhbCgpKSB7XG4gICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChcIuivt+mAieaLqeimgeS4iuS8oOeahOaWh+S7tiFcIiwgdGhpcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICAgICAgZm9ybURhdGEuYXBwZW5kKFwiZmlsZVwiLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc291cmNlRmlsZScpLmZpbGVzWzBdKTtcbiAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgIHhoci5vcGVuKCdQT1NUJywgQmFzZVV0aWxpdHkuQnVpbGRBY3Rpb24oXCIvUmVzdC9Xb3JrZmxvdy9SdW5UaW1lL0NsaWVudC9Eb2N1bWVudEZpbGVSdW50aW1lL1VwbG9hZEZpbGVBbmRDb252ZXJ0VG9QREY/aW5zdGFuY2VJZD1cIiArIGluc3RhbmNlSWQgKyBcIiZidXNpbmVzc0tleT1cIiArIGJ1c2luZXNzS2V5KSk7XG5cbiAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHhocik7XG5cbiAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgIHZhciByZXN1bHQgPSBKc29uVXRpbGl0eS5TdHJpbmdUb0pzb24oeGhyLnJlc3BvbnNlKTtcbiAgICAgICAgICBEb2N1bWVudENvbnRlbnRVcGxvYWRDb252ZXJ0VG9QREZQbHVnaW4ubG9hZFBERkZpbGVUb1ZpZXdlcihyZXN1bHQuZGF0YS5maWxlSWQpO1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQ2xvc2VCeUVsZW1JZChEaWFsb2dVdGlsaXR5LkRpYWxvZ0xvYWRpbmdJZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQoXCLmiafooYzlh7rplJkhXCIgKyB4aHIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkNsb3NlQnlFbGVtSWQoRGlhbG9nVXRpbGl0eS5EaWFsb2dMb2FkaW5nSWQpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICB4aHIudXBsb2FkLm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50Lmxlbmd0aENvbXB1dGFibGUpIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0TG9hZGluZyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nTG9hZGluZ0lkLCB7fSwgXCJcIik7XG4gICAgICAgICAgdmFyIHBlcmNlbnQgPSBNYXRoLmZsb29yKGV2ZW50LmxvYWRlZCAvIGV2ZW50LnRvdGFsICogMTAwKTtcbiAgICAgICAgICAkKFwiI3VwbG9hZC1wcm9jZXNzXCIpLmh0bWwocGVyY2VudCArIFwiJVwiKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgeGhyLnNlbmQoZm9ybURhdGEpO1xuICAgIH1cbiAgfSxcbiAgdHJ5TG9hZEhpc3RvcnlEb2N1bWVudDogZnVuY3Rpb24gdHJ5TG9hZEhpc3RvcnlEb2N1bWVudChwcm9wQ29uZmlnKSB7XG4gICAgQWpheFV0aWxpdHkuR2V0KFwiL1Jlc3QvV29ya2Zsb3cvUnVuVGltZS9DbGllbnQvRG9jdW1lbnRGaWxlUnVudGltZS9UcnlHZXRMYXN0T25saW5lRG9jdW1lbnRcIiwge1xuICAgICAgaW5zdGFuY2VJZDogcHJvcENvbmZpZy5JbnN0YW5jZUlkXG4gICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzICYmIHJlc3VsdC5kYXRhKSB7XG4gICAgICAgIHRoaXMubG9hZFBERkZpbGVUb1ZpZXdlcihyZXN1bHQuZGF0YS5maWxlSWQpO1xuICAgICAgfVxuICAgIH0sIHRoaXMpO1xuICB9LFxuICBsb2FkUERGRmlsZVRvVmlld2VyOiBmdW5jdGlvbiBsb2FkUERGRmlsZVRvVmlld2VyKGZpbGVJZCkge1xuICAgIHZhciBmaWxlVXJsID0gQmFzZVV0aWxpdHkuR2V0Um9vdFBhdGgoKSArIFwiL1Jlc3QvV29ya2Zsb3cvUnVuVGltZS9DbGllbnQvRG9jdW1lbnRGaWxlUnVudGltZS9Eb3duTG9hZFBkZkRvY3VtZW50QnlGaWxlSWQ/ZmlsZUlkPVwiICsgZmlsZUlkO1xuICAgICQoXCIjcGRmVmlld2VyXCIpLmF0dHIoXCJzcmNcIiwgXCIvSnMvRXh0ZXJuYWwvUERGSlMtMi45LjM1OS1kaXN0L3dlYi92aWV3ZXIuaHRtbD9maWxlPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KGZpbGVVcmwpKTtcbiAgfSxcbiAgR2V0SHRtbEVsZW06IGZ1bmN0aW9uIEdldEh0bWxFbGVtKHByb3BDb25maWcpIHtcbiAgICB2YXIgaW5zdGFuY2VJZCA9IHByb3BDb25maWcuSW5zdGFuY2VJZDtcbiAgICB2YXIgYnVzaW5lc3NLZXkgPSBwcm9wQ29uZmlnLlJlY29yZElkO1xuICAgIHRoaXMudHJ5TG9hZEhpc3RvcnlEb2N1bWVudChwcm9wQ29uZmlnKTtcbiAgICByZXR1cm4gXCI8ZGl2IGNsYXNzPVxcXCJkb2N1bWVudC1vdXRlci13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImRvY3VtZW50LWJ1dHRvbnMtb3V0ZXJcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImRvY3VtZW50LWJ1dHRvbnMtaW5uZXJcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcInVwbG9hZC1hbmQtY29udmVydC1idXR0b25cXFwiIGRpc2FibGVkPlxcdTRFMEJcXHU4RjdEUERGXFx1NjU4N1xcdTRFRjY8L2J1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJ1cGxvYWQtYW5kLWNvbnZlcnQtYnV0dG9uXFxcIiBkaXNhYmxlZD5cXHU0RTBCXFx1OEY3RFxcdTUzOUZcXHU1OUNCXFx1NjU4N1xcdTRFRjY8L2J1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJ1cGxvYWQtYW5kLWNvbnZlcnQtYnV0dG9uXFxcIiBvbmNsaWNrPVxcXCJEb2N1bWVudENvbnRlbnRVcGxvYWRDb252ZXJ0VG9QREZQbHVnaW4udXBsb2FkQW5kQ29udmVydFRvUERGKHRoaXMsJ1wiLmNvbmNhdChpbnN0YW5jZUlkLCBcIicsJ1wiKS5jb25jYXQoYnVzaW5lc3NLZXksIFwiJylcXFwiPlxcdTRFMEFcXHU0RjIwXFx1NUU3NlxcdThGNkNcXHU2MzYyXFx1NEUzQXBkZjwvYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJmaWxlLXVwbG9hZFxcXCI+XFx1OTAwOVxcdTYyRTlcXHU2NTg3XFx1NEVGNlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkPVxcXCJzb3VyY2VGaWxlXFxcIlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cXFwiZmlsZVxcXCJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU9XFxcImlucHV0RmlsZVxcXCIgYWNjZXB0PVxcXCIuZG9jLC5kb2N4LC5wZGZcXFwiIG9uY2hhbmdlPVxcXCJEb2N1bWVudENvbnRlbnRVcGxvYWRDb252ZXJ0VG9QREZQbHVnaW4ub25jaGFuZ2VGaWxlKHRoaXMpXFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic2VsZWN0ZWQtZmlsZS1tZXNzYWdlXFxcIj5cXHU1REYyXFx1OTAwOVxcdTY1ODdcXHU0RUY2OjxzcGFuIGlkPVxcXCJkb2Mtc2VsZWN0ZWQtZmlsZVxcXCI+PC9zcGFuPjwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJ1cGxvYWQtcHJvY2Vzc1xcXCIgaWQ9XFxcInVwbG9hZC1wcm9jZXNzXFxcIj48L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiZG9jdW1lbnQtY29udGVudFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGlmcmFtZSBpZD1cXFwicGRmVmlld2VyXFxcIiBzcmM9XFxcIlxcXCIgc3R5bGU9XFxcIndpZHRoOiAxMDAlO2hlaWdodDogMTAwJTtib3JkZXI6IDBweFxcXCI+PC9pZnJhbWU+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XCIpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRmxvd0ZpbGVzTGlzdFNpbmdsZVBsdWdpbiA9IHtcbiAgX3Byb3A6IHt9LFxuICBfZmxvd0luc3RhbmNlUnVudGltZVBPOiBudWxsLFxuICBfY3VycmVudE5vZGU6IG51bGwsXG4gIF9hdXRob3JpdGllc0ZpbGVBdXRob3JpdHk6IG51bGwsXG4gIF9hdXRob3JpdGllc09ubHlTZW5kQmFja0NhbkVkaXQ6IFwiZmFsc2VcIixcbiAgR2V0SHRtbEVsZW06IGZ1bmN0aW9uIEdldEh0bWxFbGVtKHByb3BDb25maWcpIHtcbiAgICBGbG93RmlsZXNMaXN0U2luZ2xlUGx1Z2luLl9wcm9wID0gcHJvcENvbmZpZztcbiAgICBGbG93RmlsZXNMaXN0U2luZ2xlUGx1Z2luLl9mbG93SW5zdGFuY2VSdW50aW1lUE8gPSBwcm9wQ29uZmlnLkZsb3dJbnN0YW5jZVJ1bnRpbWVQTztcbiAgICBGbG93RmlsZXNMaXN0U2luZ2xlUGx1Z2luLl9jdXJyZW50Tm9kZSA9IEFycmF5VXRpbGl0eS5XaGVyZShGbG93RmlsZXNMaXN0U2luZ2xlUGx1Z2luLl9mbG93SW5zdGFuY2VSdW50aW1lUE8uYnBtbkRlZmluaXRpb25zLmJwbW5Qcm9jZXNzLnVzZXJUYXNrTGlzdCwgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHJldHVybiBpdGVtLmlkID09IEZsb3dGaWxlc0xpc3RTaW5nbGVQbHVnaW4uX2Zsb3dJbnN0YW5jZVJ1bnRpbWVQTy5jdXJyZW50Tm9kZUtleTtcbiAgICB9KTtcblxuICAgIGlmIChGbG93RmlsZXNMaXN0U2luZ2xlUGx1Z2luLl9jdXJyZW50Tm9kZS5sZW5ndGggPT0gMCkge1xuICAgICAgRmxvd0ZpbGVzTGlzdFNpbmdsZVBsdWdpbi5fY3VycmVudE5vZGUgPSBGbG93RmlsZXNMaXN0U2luZ2xlUGx1Z2luLl9mbG93SW5zdGFuY2VSdW50aW1lUE8uYnBtbkRlZmluaXRpb25zLmJwbW5Qcm9jZXNzLnN0YXJ0RXZlbnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIEZsb3dGaWxlc0xpc3RTaW5nbGVQbHVnaW4uX2N1cnJlbnROb2RlID0gRmxvd0ZpbGVzTGlzdFNpbmdsZVBsdWdpbi5fY3VycmVudE5vZGVbMF07XG4gICAgfVxuXG4gICAgaWYgKEZsb3dGaWxlc0xpc3RTaW5nbGVQbHVnaW4uX2N1cnJlbnROb2RlLmV4dGVuc2lvbkVsZW1lbnRzKSB7XG4gICAgICBGbG93RmlsZXNMaXN0U2luZ2xlUGx1Z2luLl9hdXRob3JpdGllc0ZpbGVBdXRob3JpdHkgPSBKc29uVXRpbGl0eS5TdHJpbmdUb0pzb24oRmxvd0ZpbGVzTGlzdFNpbmdsZVBsdWdpbi5fY3VycmVudE5vZGUuZXh0ZW5zaW9uRWxlbWVudHMuamI0ZGNBdXRob3JpdGllcy5hdXRob3JpdGllc0ZpbGVBdXRob3JpdHkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBGbG93RmlsZXNMaXN0U2luZ2xlUGx1Z2luLl9hdXRob3JpdGllc0ZpbGVBdXRob3JpdHkgPSB7XG4gICAgICAgIGFkZEZpbGU6IFwidHJ1ZVwiXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBcIjxkaXYgaWQ9XFxcIkZsb3dGaWxlc0xpc3RQbHVnaW5Db250YWluZXJcXFwiPlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cIjtcbiAgfSxcbiAgYWNJbnRlcmZhY2U6IHtcbiAgICBnZXRGaWxlTGlzdERhdGE6IFwiL1Jlc3QvV29ya2Zsb3cvUnVuVGltZS9DbGllbnQvSW5zdGFuY2VGaWxlUnVudGltZS9HZXRBdHRhY2htZW50RmlsZUxpc3REYXRhXCIsXG4gICAgdXBsb2FkRmlsZTogXCIvUmVzdC9Xb3JrZmxvdy9SdW5UaW1lL0NsaWVudC9JbnN0YW5jZUZpbGVSdW50aW1lL1VwbG9hZEZpbGVcIixcbiAgICBkb3dubG9hZEZpbGU6IFwiL1Jlc3QvQnVpbGRlci9SdW5UaW1lL0ZpbGVSdW50aW1lL0Rvd25Mb2FkRmlsZUJ5RmlsZUlkXCIsXG4gICAgZGVsZXRlRmlsZTogXCIvUmVzdC9CdWlsZGVyL1J1blRpbWUvRmlsZVJ1bnRpbWUvRGVsZXRlRmlsZUJ5RmlsZUlkXCJcbiAgfSxcbiAgUmVuZGVyZXI6IGZ1bmN0aW9uIFJlbmRlcmVyKCkge1xuICAgIHRoaXMuQnVpbGRVcGxvYWRDb250YWluZXIoKTtcbiAgICB0aGlzLkJ1aWxkRmlsZUxpc3QoKTtcbiAgfSxcbiAgVG9WaWV3U3RhdHVzOiBmdW5jdGlvbiBUb1ZpZXdTdGF0dXMoJGVsZW0sIGZpZWxkUE8sIHJlbGF0aW9uRm9ybVJlY29yZENvbXBsZXhQbywgX3JlbmRlcmVyRGF0YUNoYWluUGFyYXMpIHtcbiAgICAkKFwiI1wiICsgdGhpcy5fcHJvcC51cGxvYWRXYXJwSWQpLmhpZGUoKTtcbiAgICAkKFwiI1wiICsgdGhpcy5fcHJvcC5lbGVtSWQpLmZpbmQoXCIuZGVsZXRlLWJ1dHRvbi1lbGVtXCIpLmhpZGUoKTtcbiAgICAkKFwiI1wiICsgdGhpcy5fcHJvcC5lbGVtSWQpLmZpbmQoXCIubW92ZS11cC1idXR0b24tZWxlbVwiKS5oaWRlKCk7XG4gICAgJChcIiNcIiArIHRoaXMuX3Byb3AuZWxlbUlkKS5maW5kKFwiLm1vdmUtZG93bi1idXR0b24tZWxlbVwiKS5oaWRlKCk7XG4gIH0sXG4gIEdldFRoaXNSZWNvcmRJZDogZnVuY3Rpb24gR2V0VGhpc1JlY29yZElkKCkge1xuICAgIHZhciBvYmpJZCA9IFwiXCI7XG5cbiAgICBpZiAoZm9ybVJ1bnRpbWVJbnN0ICYmIGZvcm1SdW50aW1lSW5zdC5HZXRXZWJGb3JtUlRQYXJhcygpICYmIGZvcm1SdW50aW1lSW5zdC5HZXRXZWJGb3JtUlRQYXJhcygpLlJlY29yZElkKSB7XG4gICAgICBvYmpJZCA9IGZvcm1SdW50aW1lSW5zdC5HZXRXZWJGb3JtUlRQYXJhcygpLlJlY29yZElkO1xuICAgIH0gZWxzZSB7XG4gICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChcIuafpeaJvuS4jeWIsOe7keWumueahOiusOW9lUlEXCIpO1xuICAgIH1cblxuICAgIHJldHVybiBvYmpJZDtcbiAgfSxcbiAgR2V0VGhpc1JlY29yZFR5cGU6IGZ1bmN0aW9uIEdldFRoaXNSZWNvcmRUeXBlKCkge1xuICAgIHJldHVybiB0aGlzLl9wcm9wLm9ialR5cGU7XG4gIH0sXG4gIEdldFVwbG9hZEVuZFBvaW50UmVxdWVzdDogZnVuY3Rpb24gR2V0VXBsb2FkRW5kUG9pbnRSZXF1ZXN0KCkge1xuICAgIHZhciBlbmRQb2ludCA9IEJhc2VVdGlsaXR5LkdldFJvb3RQYXRoKCkgKyB0aGlzLmFjSW50ZXJmYWNlLnVwbG9hZEZpbGU7XG4gICAgdmFyIHBhcmFzID0ge1xuICAgICAgZmlsZVR5cGU6IFwiQXR0YWNobWVudFwiLFxuICAgICAgaW5zdGFuY2VJZDogdGhpcy5fcHJvcC5GbG93SW5zdGFuY2VSdW50aW1lUE8uaW5zdGFuY2VFbnRpdHkuaW5zdElkLFxuICAgICAgYnVzaW5lc3NLZXk6IHRoaXMuX3Byb3AuUmVjb3JkSWRcbiAgICB9O1xuICAgIHJldHVybiB7XG4gICAgICBlbmRwb2ludDogZW5kUG9pbnQsXG4gICAgICBwYXJhbXM6IHBhcmFzXG4gICAgfTtcbiAgfSxcbiAgQ3JlYXRlRGVmYXVsdFRlbXBsYXRlOiBmdW5jdGlvbiBDcmVhdGVEZWZhdWx0VGVtcGxhdGUodGVtcGxhdGVJZCkge1xuICAgICQod2luZG93LmRvY3VtZW50LmJvZHkpLmFwcGVuZChcIjxzY3JpcHQgdHlwZT1cXFwidGV4dC90ZW1wbGF0ZVxcXCIgaWQ9XFxcIlwiICsgdGVtcGxhdGVJZCArIFwiXFxcIj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcInFxLXVwbG9hZGVyLXNlbGVjdG9yIHFxLXVwbG9hZGVyIHFxLWdhbGxlcnlcXFwiIHFxLWRyb3AtYXJlYS10ZXh0PVxcXCJcXHU2MkQ2XFx1NjUzRVxcdTY1ODdcXHU0RUY2XFx1NTIzMFxcdThGRDlcXHU5MUNDXFx1OEZEQlxcdTg4NENcXHU0RTBBXFx1NEYyMFxcdTMwMDJcXFwiIHN0eWxlPVxcXCJtaW4taGVpZ2h0OiA3OHB4O1xcXCI+XFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwicXEtdG90YWwtcHJvZ3Jlc3MtYmFyLWNvbnRhaW5lci1zZWxlY3RvciBxcS10b3RhbC1wcm9ncmVzcy1iYXItY29udGFpbmVyXFxcIj5cXG4gICAgICAgICAgICAgICAgPGRpdiByb2xlPVxcXCJwcm9ncmVzc2JhclxcXCIgYXJpYS12YWx1ZW5vdz1cXFwiMFxcXCIgYXJpYS12YWx1ZW1pbj1cXFwiMFxcXCIgYXJpYS12YWx1ZW1heD1cXFwiMTAwXFxcIiBjbGFzcz1cXFwicXEtdG90YWwtcHJvZ3Jlc3MtYmFyLXNlbGVjdG9yIHFxLXByb2dyZXNzLWJhciBxcS10b3RhbC1wcm9ncmVzcy1iYXJcXFwiPjwvZGl2PlxcbiAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInFxLXVwbG9hZC1kcm9wLWFyZWEtc2VsZWN0b3IgcXEtdXBsb2FkLWRyb3AtYXJlYVxcXCIgcXEtaGlkZS1kcm9wem9uZT5cXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcInFxLXVwbG9hZC1kcm9wLWFyZWEtdGV4dC1zZWxlY3RvclxcXCI+PC9zcGFuPlxcbiAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInFxLXVwbG9hZC1idXR0b24tc2VsZWN0b3IgcXEtdXBsb2FkLWJ1dHRvblxcXCIgc3R5bGU9XFxcImZsb2F0OiByaWdodFxcXCI+XFxuICAgICAgICAgICAgICAgIDxkaXY+XFx1OTAwOVxcdTYyRTlcXHU2NTg3XFx1NEVGNjwvZGl2PlxcbiAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJxcS1kcm9wLXByb2Nlc3Npbmctc2VsZWN0b3IgcXEtZHJvcC1wcm9jZXNzaW5nXFxcIj5cXG4gICAgICAgICAgICAgICAgPHNwYW4+UHJvY2Vzc2luZyBkcm9wcGVkIGZpbGVzLi4uPC9zcGFuPlxcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwicXEtZHJvcC1wcm9jZXNzaW5nLXNwaW5uZXItc2VsZWN0b3IgcXEtZHJvcC1wcm9jZXNzaW5nLXNwaW5uZXJcXFwiPjwvc3Bhbj5cXG4gICAgICAgICAgICA8L3NwYW4+XFxuICAgICAgICAgICAgPHVsIGNsYXNzPVxcXCJxcS11cGxvYWQtbGlzdC1zZWxlY3RvciBxcS11cGxvYWQtbGlzdFxcXCIgcm9sZT1cXFwicmVnaW9uXFxcIiBhcmlhLWxpdmU9XFxcInBvbGl0ZVxcXCIgYXJpYS1yZWxldmFudD1cXFwiYWRkaXRpb25zIHJlbW92YWxzXFxcIiBzdHlsZT1cXFwiZGlzcGxheTogbm9uZVxcXCI+XFxuICAgICAgICAgICAgICAgIDxsaT5cXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIHJvbGU9XFxcInN0YXR1c1xcXCIgY2xhc3M9XFxcInFxLXVwbG9hZC1zdGF0dXMtdGV4dC1zZWxlY3RvciBxcS11cGxvYWQtc3RhdHVzLXRleHRcXFwiPjwvc3Bhbj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInFxLXByb2dyZXNzLWJhci1jb250YWluZXItc2VsZWN0b3IgcXEtcHJvZ3Jlc3MtYmFyLWNvbnRhaW5lclxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiByb2xlPVxcXCJwcm9ncmVzc2JhclxcXCIgYXJpYS12YWx1ZW5vdz1cXFwiMFxcXCIgYXJpYS12YWx1ZW1pbj1cXFwiMFxcXCIgYXJpYS12YWx1ZW1heD1cXFwiMTAwXFxcIiBjbGFzcz1cXFwicXEtcHJvZ3Jlc3MtYmFyLXNlbGVjdG9yIHFxLXByb2dyZXNzLWJhclxcXCI+PC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJxcS11cGxvYWQtc3Bpbm5lci1zZWxlY3RvciBxcS11cGxvYWQtc3Bpbm5lclxcXCI+PC9zcGFuPlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwicXEtdGh1bWJuYWlsLXdyYXBwZXJcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgY2xhc3M9XFxcInFxLXRodW1ibmFpbC1zZWxlY3RvclxcXCIgcXEtbWF4LXNpemU9XFxcIjEyMFxcXCIgcXEtc2VydmVyLXNjYWxlPlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcInFxLXVwbG9hZC1jYW5jZWwtc2VsZWN0b3IgcXEtdXBsb2FkLWNhbmNlbFxcXCI+WDwvYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJxcS11cGxvYWQtcmV0cnktc2VsZWN0b3IgcXEtdXBsb2FkLXJldHJ5XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwicXEtYnRuIHFxLXJldHJ5LWljb25cXFwiIGFyaWEtbGFiZWw9XFxcIlJldHJ5XFxcIj48L3NwYW4+XFxuICAgICAgICAgICAgICAgICAgICAgICAgUmV0cnlcXG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxcblxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwicXEtZmlsZS1pbmZvXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJxcS1maWxlLW5hbWVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwicXEtdXBsb2FkLWZpbGUtc2VsZWN0b3IgcXEtdXBsb2FkLWZpbGVcXFwiPjwvc3Bhbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcInFxLWVkaXQtZmlsZW5hbWUtaWNvbi1zZWxlY3RvciBxcS1idG4gcXEtZWRpdC1maWxlbmFtZS1pY29uXFxcIiBhcmlhLWxhYmVsPVxcXCJFZGl0IGZpbGVuYW1lXFxcIj48L3NwYW4+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzPVxcXCJxcS1lZGl0LWZpbGVuYW1lLXNlbGVjdG9yIHFxLWVkaXQtZmlsZW5hbWVcXFwiIHRhYmluZGV4PVxcXCIwXFxcIiB0eXBlPVxcXCJ0ZXh0XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwicXEtdXBsb2FkLXNpemUtc2VsZWN0b3IgcXEtdXBsb2FkLXNpemVcXFwiPjwvc3Bhbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcInFxLWJ0biBxcS11cGxvYWQtZGVsZXRlLXNlbGVjdG9yIHFxLXVwbG9hZC1kZWxldGVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwicXEtYnRuIHFxLWRlbGV0ZS1pY29uXFxcIiBhcmlhLWxhYmVsPVxcXCJEZWxldGVcXFwiPjwvc3Bhbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcInFxLWJ0biBxcS11cGxvYWQtcGF1c2Utc2VsZWN0b3IgcXEtdXBsb2FkLXBhdXNlXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcInFxLWJ0biBxcS1wYXVzZS1pY29uXFxcIiBhcmlhLWxhYmVsPVxcXCJQYXVzZVxcXCI+PC9zcGFuPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwicXEtYnRuIHFxLXVwbG9hZC1jb250aW51ZS1zZWxlY3RvciBxcS11cGxvYWQtY29udGludWVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwicXEtYnRuIHFxLWNvbnRpbnVlLWljb25cXFwiIGFyaWEtbGFiZWw9XFxcIkNvbnRpbnVlXFxcIj48L3NwYW4+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgPC9saT5cXG4gICAgICAgICAgICA8L3VsPlxcblxcbiAgICAgICAgICAgIDxkaWFsb2cgY2xhc3M9XFxcInFxLWFsZXJ0LWRpYWxvZy1zZWxlY3RvclxcXCI+XFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInFxLWRpYWxvZy1tZXNzYWdlLXNlbGVjdG9yXFxcIj48L2Rpdj5cXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwicXEtZGlhbG9nLWJ1dHRvbnNcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJxcS1jYW5jZWwtYnV0dG9uLXNlbGVjdG9yXFxcIj5DbG9zZTwvYnV0dG9uPlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICA8L2RpYWxvZz5cXG5cXG4gICAgICAgICAgICA8ZGlhbG9nIGNsYXNzPVxcXCJxcS1jb25maXJtLWRpYWxvZy1zZWxlY3RvclxcXCI+XFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInFxLWRpYWxvZy1tZXNzYWdlLXNlbGVjdG9yXFxcIj48L2Rpdj5cXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwicXEtZGlhbG9nLWJ1dHRvbnNcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJxcS1jYW5jZWwtYnV0dG9uLXNlbGVjdG9yXFxcIj5ObzwvYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJxcS1vay1idXR0b24tc2VsZWN0b3JcXFwiPlllczwvYnV0dG9uPlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICA8L2RpYWxvZz5cXG5cXG4gICAgICAgICAgICA8ZGlhbG9nIGNsYXNzPVxcXCJxcS1wcm9tcHQtZGlhbG9nLXNlbGVjdG9yXFxcIj5cXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwicXEtZGlhbG9nLW1lc3NhZ2Utc2VsZWN0b3JcXFwiPjwvZGl2PlxcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCI+XFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInFxLWRpYWxvZy1idXR0b25zXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwicXEtY2FuY2VsLWJ1dHRvbi1zZWxlY3RvclxcXCI+Q2FuY2VsPC9idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcInFxLW9rLWJ1dHRvbi1zZWxlY3RvclxcXCI+T2s8L2J1dHRvbj5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgPC9kaWFsb2c+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgPC9zY3JpcHQ+XCIpO1xuICB9LFxuICBCdWlsZFVwbG9hZENvbnRhaW5lcjogZnVuY3Rpb24gQnVpbGRVcGxvYWRDb250YWluZXIoKSB7XG4gICAgaWYgKHRoaXMuX2F1dGhvcml0aWVzRmlsZUF1dGhvcml0eS5hZGRGaWxlID09IFwidHJ1ZVwiKSB7XG4gICAgICB2YXIgJHNpbmdsZUNvbnRyb2xFbGVtID0gJChcIiNGbG93RmlsZXNMaXN0UGx1Z2luQ29udGFpbmVyXCIpO1xuICAgICAgdmFyIHVwbG9hZFdhcnBJZCA9ICd1cGxvYWRXYXJwXycgKyBTdHJpbmdVdGlsaXR5LlRpbWVzdGFtcCgpO1xuICAgICAgdGhpcy5fcHJvcC51cGxvYWRXYXJwSWQgPSB1cGxvYWRXYXJwSWQ7XG4gICAgICB2YXIgJHVwbG9hZFdhcnAgPSAkKFwiPGRpdiBpZD0nXCIgKyB1cGxvYWRXYXJwSWQgKyBcIic+PC9kaXY+XCIpO1xuICAgICAgJHNpbmdsZUNvbnRyb2xFbGVtLmFwcGVuZCgkdXBsb2FkV2FycCk7XG4gICAgICB2YXIgdGVtcGxhdGVJZCA9IFwicXEtdGVtcGxhdGVfXCIgKyB0aGlzLl9wcm9wLmVsZW1JZDtcbiAgICAgIHRoaXMuQ3JlYXRlRGVmYXVsdFRlbXBsYXRlKHRlbXBsYXRlSWQpO1xuXG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICB2YXIgZ2FsbGVyeVVwbG9hZGVyID0gbmV3IHFxLkZpbmVVcGxvYWRlcih7XG4gICAgICAgIGVsZW1lbnQ6ICR1cGxvYWRXYXJwWzBdLFxuICAgICAgICB0ZW1wbGF0ZTogdGVtcGxhdGVJZCxcbiAgICAgICAgbXVsdGlwbGU6IGZhbHNlLFxuICAgICAgICByZXF1ZXN0OiB0aGlzLkdldFVwbG9hZEVuZFBvaW50UmVxdWVzdCgpLFxuICAgICAgICBjYWxsYmFja3M6IHtcbiAgICAgICAgICBvbkNvbXBsZXRlOiBmdW5jdGlvbiBvbkNvbXBsZXRlKGlkLCBuYW1lLCByZXNwb25zZUpTT04sIHhocikge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlSlNPTi5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgIF90aGlzLkJ1aWxkRmlsZUxpc3QoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KHJlc3BvbnNlSlNPTi5tZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgQnVpbGRGaWxlTGlzdDogZnVuY3Rpb24gQnVpbGRGaWxlTGlzdCgpIHtcbiAgICB2YXIgJHNpbmdsZUNvbnRyb2xFbGVtID0gJChcIiNGbG93RmlsZXNMaXN0UGx1Z2luQ29udGFpbmVyXCIpO1xuICAgIHZhciB1cGxvYWRfZmlsZV9saXN0X3dyYXBfaWQgPSBcImZsb3dfZmlsZV9wbHVnaW5fdXBsb2FkX2ZpbGVfbGlzdF93YXJwXCI7XG4gICAgJChcIiNcIiArIHVwbG9hZF9maWxlX2xpc3Rfd3JhcF9pZCkucmVtb3ZlKCk7XG4gICAgdmFyICRkaXZXYXJwID0gJChcIjxkaXYgY2xhc3M9J3VwbG9hZF9maWxlX2xpc3Rfd3JhcCcgaWQ9J1wiICsgdXBsb2FkX2ZpbGVfbGlzdF93cmFwX2lkICsgXCInPjx0YWJsZSBjbGFzcz0nZmlsZV9saXN0X3RhYmxlJz48dGhlYWQ+PHRyPjx0aD7mlofku7blkI3np7A8L3RoPjx0aCBzdHlsZT0nd2lkdGg6IDE0MHB4Jz7kuIrkvKDml7bpl7Q8L3RoPjx0aCBzdHlsZT0nd2lkdGg6IDE0MHB4Jz7kuIrkvKDkuro8L3RoPjx0aCBzdHlsZT0nd2lkdGg6IDE0MHB4Jz7mlofku7blpKflsI88L3RoPjx0aCBzdHlsZT0nd2lkdGg6IDE0MHB4Jz7mk43kvZw8L3RoPjwvdHI+PC90aGVhZD48dGJvZHk+PC90Ym9keT48L3RhYmxlPjwvZGl2PlwiKTtcbiAgICB2YXIgJHRib2R5ID0gJGRpdldhcnAuZmluZChcInRib2R5XCIpO1xuICAgIHZhciBpbnN0YW5jZUlkID0gdGhpcy5fcHJvcC5GbG93SW5zdGFuY2VSdW50aW1lUE8uaW5zdGFuY2VFbnRpdHkuaW5zdElkO1xuICAgIEFqYXhVdGlsaXR5LlBvc3QodGhpcy5hY0ludGVyZmFjZS5nZXRGaWxlTGlzdERhdGEsIHtcbiAgICAgIGluc3RhbmNlSWQ6IGluc3RhbmNlSWRcbiAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN1bHQuZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciBmaWxlSW5mbyA9IHJlc3VsdC5kYXRhW2ldO1xuICAgICAgICAgICR0Ym9keS5hcHBlbmQodGhpcy5CdWlsZEZpbGVJbmZvVGFibGVSb3cocmVzdWx0LCBmaWxlSW5mbykpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwgdGhpcyk7XG4gICAgJCgkc2luZ2xlQ29udHJvbEVsZW0uYXBwZW5kKCRkaXZXYXJwKSk7XG4gIH0sXG4gIEJ1aWxkRmlsZUluZm9UYWJsZVJvdzogZnVuY3Rpb24gQnVpbGRGaWxlSW5mb1RhYmxlUm93KHJlc3BvbnNlSlNPTiwgZmlsZUluZm8pIHtcbiAgICB2YXIgZmlsZU5hbWUgPSBTdHJpbmdVdGlsaXR5LkVuY29kZUh0bWwoZmlsZUluZm8uZmlsZU5hbWUpO1xuICAgIHZhciBmaWxlQ3JlYXRlVGltZSA9IERhdGVVdGlsaXR5LkRhdGVGb3JtYXRCeVRpbWVTdGFtcChmaWxlSW5mby5maWxlQ3JlYXRlVGltZSwgXCJ5eXl5LU1NLWRkXCIpO1xuICAgIHZhciBmaWxlU2l6ZSA9IEhhcmREaXNrVXRpbGl0eS5CeXRlQ29udmVydChmaWxlSW5mby5maWxlU2l6ZSk7XG4gICAgdmFyIGZpbGVDcmVhdG9yTmFtZSA9IFN0cmluZ1V0aWxpdHkuRW5jb2RlSHRtbChmaWxlSW5mby5maWxlQ3JlYXRvcik7XG4gICAgdmFyICR0ck9iaiA9ICQoXCI8dHI+PHRkPlwiLmNvbmNhdChmaWxlTmFtZSwgXCI8L3RkPjx0ZCBzdHlsZT1cXFwidGV4dC1hbGlnbjogY2VudGVyXFxcIj5cIikuY29uY2F0KGZpbGVDcmVhdGVUaW1lLCBcIjwvdGQ+PHRkIHN0eWxlPVxcXCJ0ZXh0LWFsaWduOiBjZW50ZXJcXFwiPlwiKS5jb25jYXQoZmlsZUNyZWF0b3JOYW1lLCBcIjwvdGQ+PHRkIHN0eWxlPVxcXCJ0ZXh0LWFsaWduOiBjZW50ZXJcXFwiPlwiKS5jb25jYXQoZmlsZVNpemUsIFwiPC90ZD48dGQgc3R5bGU9XFxcInRleHQtYWxpZ246IGNlbnRlclxcXCI+PC90ZD48L3RyPlwiKSk7XG4gICAgdGhpcy5CdWlsZEZpbGVJbmZvVGFibGVSb3dJbm5lckJ1dHRvbnMocmVzcG9uc2VKU09OLCBmaWxlSW5mbywgJHRyT2JqKTtcbiAgICByZXR1cm4gJHRyT2JqO1xuICB9LFxuICBCdWlsZEZpbGVJbmZvVGFibGVSb3dJbm5lckJ1dHRvbnM6IGZ1bmN0aW9uIEJ1aWxkRmlsZUluZm9UYWJsZVJvd0lubmVyQnV0dG9ucyhyZXNwb25zZUpTT04sIGZpbGVJbmZvLCAkdHIpIHtcbiAgICBpZiAoIXRoaXMuX3Byb3AuZG93bmxvYWRFbmFibGUgJiYgIXRoaXMuX3Byb3AuZGVsZXRlRW5hYmxlICYmIHRoaXMuX3Byb3AucHJldmlld0VuYWJsZSAmJiB0aGlzLl9wcm9wLm1vdmVPcmRlckVuYWJsZSkge31cblxuICAgIHZhciAkdHJMYXN0VGQgPSAkdHIuZmluZChcInRkOmxhc3RcIik7XG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKHRoaXMuX3Byb3AuZGVsZXRlRW5hYmxlKSB7XG4gICAgICB2YXIgJGRlbGV0ZUVsZW0gPSAkKFwiPGRpdiBjbGFzcz0nZmlsZS1saXN0LWlubmVyLWJ1dHRvbiBkZWxldGUtYnV0dG9uLWVsZW0nIHRpdGxlPSfngrnlh7vliKDpmaQnPjwvZGl2PlwiKTtcbiAgICAgICRkZWxldGVFbGVtLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5Db25maXJtKHdpbmRvdywgXCLnoa7orqTliKDpmaTpmYTku7bjgJBcIiArIGZpbGVJbmZvLmZpbGVOYW1lICsgXCLjgJHlkJc/XCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBBamF4VXRpbGl0eS5Qb3N0KF90aGlzLmFjSW50ZXJmYWNlLmRlbGV0ZUZpbGUsIHtcbiAgICAgICAgICAgIGZpbGVJZDogZmlsZUluZm8uZmlsZUlkXG4gICAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICRkZWxldGVFbGVtLnBhcmVudCgpLnBhcmVudCgpLnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIF90aGlzKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgICR0ckxhc3RUZC5hcHBlbmQoJGRlbGV0ZUVsZW0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9wcm9wLm1vdmVPcmRlckVuYWJsZSB8fCB0cnVlKSB7XG4gICAgICB2YXIgJG1vdmVVcEVsZW0gPSAkKFwiPGRpdiBjbGFzcz0nZmlsZS1saXN0LWlubmVyLWJ1dHRvbiBtb3ZlLXVwLWJ1dHRvbi1lbGVtJyB0aXRsZT0n54K55Ye75LiK56e7Jz48L2Rpdj5cIik7XG4gICAgICAkbW92ZVVwRWxlbS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KFwi5pqC5LiN5pSv5oyBIVwiKTtcbiAgICAgIH0pO1xuICAgICAgdmFyICRtb3ZlRG93bkVsZW0gPSAkKFwiPGRpdiBjbGFzcz0nZmlsZS1saXN0LWlubmVyLWJ1dHRvbiBtb3ZlLWRvd24tYnV0dG9uLWVsZW0nIHRpdGxlPSfngrnlh7vkuIvnp7snPjwvZGl2PlwiKTtcbiAgICAgICRtb3ZlRG93bkVsZW0uY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChcIuaaguS4jeaUr+aMgSFcIik7XG4gICAgICB9KTtcbiAgICAgICR0ckxhc3RUZC5hcHBlbmQoJG1vdmVVcEVsZW0pO1xuICAgICAgJHRyTGFzdFRkLmFwcGVuZCgkbW92ZURvd25FbGVtKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fcHJvcC5kb3dubG9hZEVuYWJsZSkge1xuICAgICAgdmFyICRkb3dubG9hZEVsZW0gPSAkKFwiPGRpdiBjbGFzcz0nZmlsZS1saXN0LWlubmVyLWJ1dHRvbiBkb3dubG9hZC1idXR0b24tZWxlbScgdGl0bGU9J+eCueWHu+S4i+i9vSc+PC9kaXY+XCIpO1xuICAgICAgJGRvd25sb2FkRWxlbS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB1cmwgPSBCYXNlVXRpbGl0eS5HZXRSb290UGF0aCgpICsgX3RoaXMuYWNJbnRlcmZhY2UuZG93bmxvYWRGaWxlICsgXCI/ZmlsZUlkPVwiICsgZmlsZUluZm8uZmlsZUlkO1xuICAgICAgICB3aW5kb3cub3Blbih1cmwpO1xuICAgICAgfSk7XG4gICAgICAkdHJMYXN0VGQuYXBwZW5kKCRkb3dubG9hZEVsZW0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9wcm9wLnByZXZpZXdFbmFibGUgfHwgdHJ1ZSkge1xuICAgICAgdmFyICRwcmV2aWV3RWxlbSA9ICQoXCI8ZGl2IGNsYXNzPSdmaWxlLWxpc3QtaW5uZXItYnV0dG9uIHByZXZpZXctYnV0dG9uLWVsZW0nIHRpdGxlPSfngrnlh7vpooTop4gnPjwvZGl2PlwiKTtcbiAgICAgICRwcmV2aWV3RWxlbS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KFwi5pqC5LiN5pSv5oyBIVwiKTtcbiAgICAgIH0pO1xuICAgICAgJHRyTGFzdFRkLmFwcGVuZCgkcHJldmlld0VsZW0pO1xuICAgIH1cbiAgfSxcbiAgVGVzdEZpbGVQcmV2aWV3RW5hYmxlOiBmdW5jdGlvbiBUZXN0RmlsZVByZXZpZXdFbmFibGUoZmlsZUluZm8pIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEluc3RhbmNlRXhUYXNrTGlzdFBsdWdpbiA9IHtcbiAgX2Zsb3dJbnN0YW5jZVJ1bnRpbWVQTzogbnVsbCxcbiAgX2hpc3RvcnlFeGVjdXRpb25UYXNrRW50aXR5TGlzdDogbnVsbCxcbiAgX2N1cnJlbnRFeFRhc2s6IG51bGwsXG4gIEdldEh0bWxFbGVtOiBmdW5jdGlvbiBHZXRIdG1sRWxlbShwcm9wQ29uZmlnKSB7XG4gICAgdGhpcy5fZmxvd0luc3RhbmNlUnVudGltZVBPID0gcHJvcENvbmZpZy5GbG93SW5zdGFuY2VSdW50aW1lUE87XG4gICAgdGhpcy5faGlzdG9yeUV4ZWN1dGlvblRhc2tFbnRpdHlMaXN0ID0gcHJvcENvbmZpZy5GbG93SW5zdGFuY2VSdW50aW1lUE8uaGlzdG9yeUV4ZWN1dGlvblRhc2tFbnRpdHlMaXN0O1xuICAgIHRoaXMuX2N1cnJlbnRFeFRhc2sgPSBwcm9wQ29uZmlnLkZsb3dJbnN0YW5jZVJ1bnRpbWVQTy5leGVjdXRpb25UYXNrRW50aXR5O1xuXG4gICAgaWYgKHRoaXMuX2hpc3RvcnlFeGVjdXRpb25UYXNrRW50aXR5TGlzdCkge1xuICAgICAgcmV0dXJuIHRoaXMuUmVuZGVyZXIoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gXCJcIjtcbiAgfSxcbiAgVmlld0RldGFpbDogZnVuY3Rpb24gVmlld0RldGFpbChleFRhc2tJZCkge1xuICAgIHZhciBleFRhc2sgPSBBcnJheVV0aWxpdHkuV2hlcmVTaW5nbGUodGhpcy5faGlzdG9yeUV4ZWN1dGlvblRhc2tFbnRpdHlMaXN0LCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgcmV0dXJuIGl0ZW0uZXh0YXNrSWQgPT0gZXhUYXNrSWQ7XG4gICAgfSk7XG4gICAgRGlhbG9nVXRpbGl0eS5BbGVydEpzb25Db2RlKGV4VGFzayk7XG4gIH0sXG4gIENvbnZlcnRTdGF0dXNUb0NOTmFtZTogZnVuY3Rpb24gQ29udmVydFN0YXR1c1RvQ05OYW1lKHN0YXR1cykge1xuICAgIGlmIChzdGF0dXMgPT0gXCJQcm9jZXNzaW5nXCIpIHtcbiAgICAgIHJldHVybiBcIuWKnueQhuS4rVwiO1xuICAgIH0gZWxzZSBpZiAoc3RhdHVzID09IFwiRW5kXCIpIHtcbiAgICAgIHJldHVybiBcIuW3suWKnueQhlwiO1xuICAgIH0gZWxzZSBpZiAoc3RhdHVzID09IFwiQ2FuY2VsXCIpIHtcbiAgICAgIHJldHVybiBcIuiiq+aSpOWbnlwiO1xuICAgIH0gZWxzZSBpZiAoc3RhdHVzID09IFwiQ2FuY2VsRW5kXCIpIHtcbiAgICAgIHJldHVybiBcIuWKnueQhiYjMTA1MjI7JiMxMDIzMDvmkqTlm55cIjtcbiAgICB9XG5cbiAgICByZXR1cm4gXCLmnKrnn6VcIjtcbiAgfSxcbiAgUmVuZGVyZXI6IGZ1bmN0aW9uIFJlbmRlcmVyKCkge1xuICAgIHZhciBodG1sVGFibGUgPSBcIjxkaXYgY2xhc3M9J2luc3RhbmNlLWV4LXRhc2stbGlzdC1wbHVnaW4nPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3M9J2V4LXRhc2stdGFibGUnPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoZWFkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj48dGg+XFx1NzNBRlxcdTgyODJcXHU1NDBEXFx1NzlGMDwvdGg+PHRoPlxcdTUzRDFcXHU5MDAxXFx1NEVCQTwvdGg+PHRoPlxcdTUzRDFcXHU5MDAxXFx1NjVGNlxcdTk1RjQ8L3RoPjx0aD5cXHU2N0U1XFx1NzcwQlxcdTY1RjZcXHU5NUY0PC90aD48dGg+XFx1NjNBNVxcdTY1MzZcXHU0RUJBL1xcdTU5MDRcXHU3NDA2XFx1NEVCQTwvdGg+PHRoPlxcdTU5MDRcXHU3NDA2XFx1NjVGNlxcdTk1RjQ8L3RoPjx0aD5cXHU2MjY3XFx1ODg0Q1xcdTUyQThcXHU0RjVDPC90aD48dGg+XFx1NzJCNlxcdTYwMDE8L3RoPjx0aCBzdHlsZT1cXFwid2lkdGg6IDIwMHB4XFxcIj5cXHU2NENEXFx1NEY1QzwvdGg+PC90cj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGhlYWQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XCI7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX2hpc3RvcnlFeGVjdXRpb25UYXNrRW50aXR5TGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGV4VGFzayA9IHRoaXMuX2hpc3RvcnlFeGVjdXRpb25UYXNrRW50aXR5TGlzdFtpXTtcbiAgICAgIHZhciBleHRhc2tJZCA9IFN0cmluZ1V0aWxpdHkuTnVsbFRvRVMoZXhUYXNrLmV4dGFza0lkKTtcbiAgICAgIHZhciBleHRhc2tDdXJOb2RlTmFtZSA9IFN0cmluZ1V0aWxpdHkuTnVsbFRvRVMoZXhUYXNrLmV4dGFza0N1ck5vZGVOYW1lKTtcbiAgICAgIHZhciBleHRhc2tTZW5kZXJOYW1lID0gU3RyaW5nVXRpbGl0eS5OdWxsVG9FUyhleFRhc2suZXh0YXNrU2VuZGVyTmFtZSk7XG4gICAgICB2YXIgZXh0YXNrU3RhcnRUaW1lID0gU3RyaW5nVXRpbGl0eS5OdWxsVG9FUyhleFRhc2suZXh0YXNrU3RhcnRUaW1lKTtcbiAgICAgIHZhciBleHRhc2tWaWV3VGltZSA9IFN0cmluZ1V0aWxpdHkuTnVsbFRvRVMoZXhUYXNrLmV4dGFza1ZpZXdUaW1lKTtcbiAgICAgIHZhciByaE5hbWUgPSBTdHJpbmdVdGlsaXR5Lk51bGxUb0VTKGV4VGFzay5leHRhc2tSZWNlaXZlck5hbWUpO1xuICAgICAgdmFyIGV4dGFza0hhbmRsZXJJZCA9IFN0cmluZ1V0aWxpdHkuTnVsbFRvRVMoZXhUYXNrLmV4dGFza0hhbmRsZXJJZCk7XG4gICAgICB2YXIgZXh0YXNrUmVjZWl2ZXJJZCA9IFN0cmluZ1V0aWxpdHkuTnVsbFRvRVMoZXhUYXNrLmV4dGFza1JlY2VpdmVySWQpO1xuXG4gICAgICBpZiAoIVN0cmluZ1V0aWxpdHkuSXNOdWxsT3JFbXB0eShleHRhc2tIYW5kbGVySWQpICYmIGV4dGFza1JlY2VpdmVySWQgIT0gZXh0YXNrSGFuZGxlcklkKSB7XG4gICAgICAgIHJoTmFtZSA9IFN0cmluZ1V0aWxpdHkuTnVsbFRvRVMoZXhUYXNrLmV4dGFza1JlY2VpdmVyTmFtZSkgKyBcIi9cIiArIFN0cmluZ1V0aWxpdHkuTnVsbFRvRVMoZXhUYXNrLmV4dGFza0hhbmRsZXJOYW1lKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGV4dGFza0hhbmRsZXJOYW1lID0gU3RyaW5nVXRpbGl0eS5OdWxsVG9FUyhleFRhc2suZXh0YXNrSGFuZGxlck5hbWUpO1xuICAgICAgdmFyIGV4dGFza0VuZFRpbWUgPSBTdHJpbmdVdGlsaXR5Lk51bGxUb0VTKGV4VGFzay5leHRhc2tFbmRUaW1lKTtcbiAgICAgIHZhciBleHRhc2tIYW5kbGVBY3Rpb25OYW1lID0gU3RyaW5nVXRpbGl0eS5OdWxsVG9FUyhleFRhc2suZXh0YXNrSGFuZGxlQWN0aW9uTmFtZSk7XG4gICAgICB2YXIgZXh0YXNrU3RhdHVzID0gdGhpcy5Db252ZXJ0U3RhdHVzVG9DTk5hbWUoU3RyaW5nVXRpbGl0eS5OdWxsVG9FUyhleFRhc2suZXh0YXNrU3RhdHVzKSk7XG4gICAgICB2YXIgY2xhc3NOYW1lID0gXCJuLXRhc2stdHJcIjtcblxuICAgICAgaWYgKHRoaXMuX2N1cnJlbnRFeFRhc2suZXh0YXNrSWQgPT0gZXh0YXNrSWQpIHtcbiAgICAgICAgY2xhc3NOYW1lID0gXCJteS10aGlzLXRhc2stdHJcIjtcbiAgICAgIH1cblxuICAgICAgaHRtbFRhYmxlICs9IFwiPHRyIGNsYXNzPVxcXCJcIi5jb25jYXQoY2xhc3NOYW1lLCBcIlxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cIikuY29uY2F0KGV4dGFza0N1ck5vZGVOYW1lLCBcIjwvdGQ+PHRkPlwiKS5jb25jYXQoZXh0YXNrU2VuZGVyTmFtZSwgXCI8L3RkPjx0ZD5cIikuY29uY2F0KGV4dGFza1N0YXJ0VGltZSwgXCI8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XCIpLmNvbmNhdChleHRhc2tWaWV3VGltZSwgXCI8L3RkPjx0ZD5cIikuY29uY2F0KHJoTmFtZSwgXCI8L3RkPjx0ZD5cIikuY29uY2F0KGV4dGFza0VuZFRpbWUsIFwiPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlwiKS5jb25jYXQoZXh0YXNrSGFuZGxlQWN0aW9uTmFtZSwgXCI8L3RkPjx0ZD5cIikuY29uY2F0KGV4dGFza1N0YXR1cywgXCI8L3RkPjx0ZD48YSBvbmNsaWNrPVxcXCJJbnN0YW5jZUV4VGFza0xpc3RQbHVnaW4uVmlld0RldGFpbCgnXCIpLmNvbmNhdChleHRhc2tJZCwgXCInKVxcXCI+XFx1OEJFNlxcdTYwQzU8L2E+PC90ZD48L3RyPlwiKTtcbiAgICB9XG5cbiAgICBodG1sVGFibGUgKz0gXCI8L3Rib2R5PjwvdGFibGU+PC9kaXY+XCI7XG4gICAgcmV0dXJuIGh0bWxUYWJsZTtcbiAgfVxufTsiXX0=
