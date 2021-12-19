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

var WorkFlowAction = {
  EmptyProp: {
    "sender": null,
    "flowInstanceRuntimePO": null,
    "flowInstanceRuntimePOCacheKey": null,
    "jb4dcActions": null,
    "formRuntimeInst": null,
    "actionObj": null,
    "isStartInstanceStatus": null,
    "pageHostInstance": null,
    "currentNodeKey": null,
    "currentNodeName": null,
    "recordId": null,
    "modelId": null,
    "modelReKey": null,
    "currentTaskId": null,
    "instanceId": null,
    "actionShowOpinionDialog": null,
    "actionOpinionBindToField": null,
    "actionOpinionBindToElemId": null,
    "htmlId": null
  },
  Instance: function Instance(isStartInstanceStatus, formRuntimeInst, pageHostInstance, pageReadyInnerParas, actionObj) {
    var htmlId = actionObj.actionHTMLId ? actionObj.actionHTMLId : actionObj.actionCode;
    var elem = $('<button type="button" class="operation-button operation-button-primary" id="' + htmlId + '"><span>' + actionObj.actionCaption + '</span></button>');

    if (actionObj.actionDisable == "disable") {
      elem.attr("disable", "disable");
      elem.addClass("operation-button-primary-disabled");
    } else {
      this._Prop = WorkFlowAction.BuildProp(this, pageReadyInnerParas, formRuntimeInst, actionObj, isStartInstanceStatus, pageHostInstance, htmlId);
      elem.bind("click", this._Prop, function (sender) {
        console.log(sender.data);
        sender.data.sender.ButtonClickEvent();
      });
    }

    if (actionObj.actionRemark) {
      elem.attr("title", actionObj.actionRemark);
    }

    return {
      elem: elem
    };
  },
  BuildProp: function BuildProp(sender, pageReadyInnerParas, formRuntimeInst, actionObj, isStartInstanceStatus, pageHostInstance, htmlId) {
    return {
      "sender": sender,
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
      "actionOpinionBindToElemId": actionObj.actionOpinionBindToElemId,
      "htmlId": htmlId
    };
  },
  RefreshParentListThenClose: function RefreshParentListThenClose(message) {
    if (window.OpenerWindowObj != null && window.OpenerWindowObj.instanceMainTaskProcessList != null) {
      window.OpenerWindowObj.instanceMainTaskProcessList.reloadData();
    }

    portletUtility.UpdateRefreshVersion();
    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, message, function () {
      DialogUtility.Frame_CloseDialog(window);
    }, this);
  }
};
"use strict";

var DeleteInstanceAction = {
  acInterface: {},
  _Prop: WorkFlowAction.EmptyProp,
  Instance: function Instance(isStartInstanceStatus, formRuntimeInst, pageHostInstance, pageReadyInnerParas, actionObj) {
    return WorkFlowAction.Instance.call(this, isStartInstanceStatus, formRuntimeInst, pageHostInstance, pageReadyInnerParas, actionObj);
  },
  ButtonClickEvent: function ButtonClickEvent(sender) {
    DialogUtility.Confirm(window, "暂不支持该操作?", function () {
      return;
    }, this);
  }
};
"use strict";
"use strict";
"use strict";

var RecallAction = {
  acInterface: {
    recallMySendTask: "/Rest/Workflow/RunTime/Client/InstanceRuntime/RecallMySendTask"
  },
  _Prop: WorkFlowAction.EmptyProp,
  Instance: function Instance(isStartInstanceStatus, formRuntimeInst, pageHostInstance, pageReadyInnerParas, actionObj) {
    return WorkFlowAction.Instance.call(this, isStartInstanceStatus, formRuntimeInst, pageHostInstance, pageReadyInnerParas, actionObj);
  },
  ButtonClickEvent: function ButtonClickEvent(sender) {
    DialogUtility.Confirm(window, "确认执行撤回操作?", function () {
      DialogUtility.AlertLoading(window, DialogUtility.DialogLoadingId, {}, "系统处理中,请稍候!");
      AjaxUtility.Post(this.acInterface.recallMySendTask, {
        extaskId: this._Prop.currentTaskId
      }, function (result) {
        DialogUtility.CloseDialog(DialogUtility.DialogLoadingId);

        if (result.success) {
          this.RefreshParentListThenClose(result.message);
        }
      }, this);
    }, this);
  },
  RefreshParentListThenClose: WorkFlowAction.RefreshParentListThenClose
};
"use strict";

var SendAction = {
  acInterface: {
    resolveNextPossibleFlowNode: "/Rest/Workflow/RunTime/Client/InstanceRuntime/ResolveNextPossibleFlowNode",
    completeTask: "/Rest/Workflow/RunTime/Client/InstanceRuntime/CompleteTask"
  },
  _Prop: WorkFlowAction.EmptyProp,
  newOpinionList: [],
  inputOpinionText: null,
  Instance: function Instance(isStartInstanceStatus, formRuntimeInst, pageHostInstance, pageReadyInnerParas, actionObj) {
    return WorkFlowAction.Instance.call(this, isStartInstanceStatus, formRuntimeInst, pageHostInstance, pageReadyInnerParas, actionObj);
  },
  ButtonClickEvent: function ButtonClickEvent() {
    var validateResult = ValidateRulesRuntime.ValidateSubmitEnable();

    if (ValidateRulesRuntime.AlertValidateErrors(validateResult)) {
      var actionShowOpinionDialog = this._Prop.actionShowOpinionDialog;

      if (actionShowOpinionDialog == "true") {
        DialogUtility.Prompt(window, {
          title: "系统提示",
          height: 300,
          width: 400
        }, DialogUtility.DialogPromptId, "请输入处理意见1", function (inputText) {
          var opinionBindToControlInstance = this.TryGetOpinionBindToControlInstance(this._Prop);

          if (opinionBindToControlInstance != null) {
            if (typeof opinionBindToControlInstance.SetNewValue == "function") {
              opinionBindToControlInstance.SetNewValue(inputText);
              this.inputOpinionText = inputText;
              this.BeginSelectReceiver(this, this._Prop);
            } else {
              DialogUtility.AlertText("意见关联对象为实现SetNewValue方法!!");
            }
          }
        }, this);
      } else {
        this.BeginSelectReceiver(this, this._Prop);
      }
    }
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
  BeginSelectReceiver: function BeginSelectReceiver(_this, _prop) {
    DialogUtility.AlertLoading(window, DialogUtility.DialogLoadingId, {}, "");
    var sendData = this.BuildSendToServerData(this._Prop, null);

    if (sendData.success) {
      AjaxUtility.Post(this.acInterface.resolveNextPossibleFlowNode, sendData.data, function (result) {
        DialogUtility.CloseDialog(DialogUtility.DialogLoadingId);
        console.log(result);

        if (result.data.nextTaskIsEndEvent) {
          this.SelectReceiverCompleted(result.data.bpmnTaskList, []);
        } else if (result.data.currentTaskIsMultiInstance && result.data.currentTaskMultiCompletedInstances + 1 < result.data.currentTaskMultiCountEngInstances) {
          this.SelectReceiverCompleted(result.data.bpmnTaskList, []);
        } else {
          UserTaskReceiverDialogUtility.ShowDialog(this, result.data.bpmnTaskList, this.SelectReceiverCompleted);
        }
      }, this);
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
            this.RefreshParentListThenClose(result.message);
          } else {
            DialogUtility.AlertError(window, DialogUtility.DialogAlertErrorId, {}, result.data.message);
          }
        }, this);
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
  },
  RefreshParentListThenClose: WorkFlowAction.RefreshParentListThenClose
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFjdGlvbnNSdW50aW1lT2JqZWN0LmpzIiwiRmxvd1J1bnRpbWVQYWdlT2JqZWN0LmpzIiwiRmxvd1J1bnRpbWVWYXJCdWlsZGVyLmpzIiwiV29ya0Zsb3dBY3Rpb24uanMiLCJBY3Rpb25zL0RlbGV0ZUluc3RhbmNlQWN0aW9uLmpzIiwiQWN0aW9ucy9KdW1wVG9BbnlOb2RlQWN0aW9uLmpzIiwiQWN0aW9ucy9SZUJvb3RJbnN0YW5jZUFjdGlvbi5qcyIsIkFjdGlvbnMvUmVjYWxsQWN0aW9uLmpzIiwiQWN0aW9ucy9TZW5kQWN0aW9uLmpzIiwiQWN0aW9ucy9UZW1wU2F2ZUFjdGlvbi5qcyIsIkRpYWxvZy9Vc2VyVGFza1JlY2VpdmVyRGlhbG9nLmpzIiwiUGx1Z2lucy9Eb2N1bWVudENvbnRlbnRVcGxvYWRDb252ZXJ0VG9QREZQbHVnaW4uanMiLCJQbHVnaW5zL0Zsb3dGaWxlc0xpc3RTaW5nbGVQbHVnaW4uanMiLCJQbHVnaW5zL0luc3RhbmNlRXhUYXNrTGlzdFBsdWdpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2JBO0FDQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqSkE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaFRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJXb3JrRmxvd1J1bnRpbWVGdWxsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBBY3Rpb25zUnVudGltZU9iamVjdCA9IHtcbiAgQ3JlYXRlQUxMQWN0aW9uQnV0dG9uOiBmdW5jdGlvbiBDcmVhdGVBTExBY3Rpb25CdXR0b24oaXNTdGFydEluc3RhbmNlU3RhdHVzLCBmb3JtUnVudGltZUluc3QsIHBhZ2VIb3N0SW5zdGFuY2UsIHBhZ2VSZWFkeUlubmVyUGFyYXMpIHtcbiAgICBpZiAocGFnZVJlYWR5SW5uZXJQYXJhcy5qYjRkY0FjdGlvbnMgJiYgcGFnZVJlYWR5SW5uZXJQYXJhcy5qYjRkY0FjdGlvbnMuamI0ZGNBY3Rpb25MaXN0KSB7XG4gICAgICB2YXIgYnV0dG9uRWxlbTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYWdlUmVhZHlJbm5lclBhcmFzLmpiNGRjQWN0aW9ucy5qYjRkY0FjdGlvbkxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGFjdGlvbk9iaiA9IHBhZ2VSZWFkeUlubmVyUGFyYXMuamI0ZGNBY3Rpb25zLmpiNGRjQWN0aW9uTGlzdFtpXTtcblxuICAgICAgICBpZiAoYWN0aW9uT2JqLmp1ZWxSdW5SZXN1bHRQTy5ib29sZWFuUmVzdWx0KSB7XG4gICAgICAgICAgaWYgKGFjdGlvbk9iai5hY3Rpb25UeXBlID09IFwic2VuZFwiKSB7XG4gICAgICAgICAgICB2YXIgc2VuZEFjdGlvbk9iamVjdCA9IE9iamVjdC5jcmVhdGUoU2VuZEFjdGlvbik7XG4gICAgICAgICAgICBidXR0b25FbGVtID0gc2VuZEFjdGlvbk9iamVjdC5JbnN0YW5jZShpc1N0YXJ0SW5zdGFuY2VTdGF0dXMsIGZvcm1SdW50aW1lSW5zdCwgcGFnZUhvc3RJbnN0YW5jZSwgcGFnZVJlYWR5SW5uZXJQYXJhcywgYWN0aW9uT2JqKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGFjdGlvbk9iai5hY3Rpb25UeXBlID09IFwicmVjYWxsXCIpIHtcbiAgICAgICAgICAgIHZhciBjYWxsYmFja0FjdGlvbk9iamVjdCA9IE9iamVjdC5jcmVhdGUoUmVjYWxsQWN0aW9uKTtcbiAgICAgICAgICAgIGJ1dHRvbkVsZW0gPSBjYWxsYmFja0FjdGlvbk9iamVjdC5JbnN0YW5jZShpc1N0YXJ0SW5zdGFuY2VTdGF0dXMsIGZvcm1SdW50aW1lSW5zdCwgcGFnZUhvc3RJbnN0YW5jZSwgcGFnZVJlYWR5SW5uZXJQYXJhcywgYWN0aW9uT2JqKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGFjdGlvbk9iai5hY3Rpb25UeXBlID09IFwiZGVsZXRlSW5zdGFuY2VcIikge1xuICAgICAgICAgICAgdmFyIGRlbGV0ZUluc3RhbmNlQWN0aW9uT2JqZWN0ID0gT2JqZWN0LmNyZWF0ZShEZWxldGVJbnN0YW5jZUFjdGlvbik7XG4gICAgICAgICAgICBidXR0b25FbGVtID0gZGVsZXRlSW5zdGFuY2VBY3Rpb25PYmplY3QuSW5zdGFuY2UoaXNTdGFydEluc3RhbmNlU3RhdHVzLCBmb3JtUnVudGltZUluc3QsIHBhZ2VIb3N0SW5zdGFuY2UsIHBhZ2VSZWFkeUlubmVyUGFyYXMsIGFjdGlvbk9iaik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgJChcIiNmbG93V29ya0FjdGlvbkJ1dHRvbldyYXBPdXRlclwiKS5hcHBlbmQoYnV0dG9uRWxlbS5lbGVtKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgR2V0QWN0aW9uT2JqOiBmdW5jdGlvbiBHZXRBY3Rpb25PYmooKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFjdGlvbkF1dG9TZW5kOiBcImZhbHNlXCIsXG4gICAgICBhY3Rpb25DQ1JlY2VpdmVPYmplY3RzOiBcIltdXCIsXG4gICAgICBhY3Rpb25DYWxsQXBpczogXCJbXVwiLFxuICAgICAgYWN0aW9uQ2FsbENvbXBsZXRlOiBcInRydWVcIixcbiAgICAgIGFjdGlvbkNhbGxKc01ldGhvZDogbnVsbCxcbiAgICAgIGFjdGlvbkNhcHRpb246IFwi6I2J56i/XCIsXG4gICAgICBhY3Rpb25Db2RlOiBcImFjdGlvbl81MTYwMDk3NzVcIixcbiAgICAgIGFjdGlvbkNvbmZpcm06IFwiZmFsc2VcIixcbiAgICAgIGFjdGlvbkRpc3BsYXlDb25kaXRpb25FZGl0VGV4dDogbnVsbCxcbiAgICAgIGFjdGlvbkRpc3BsYXlDb25kaXRpb25FZGl0VmFsdWU6IG51bGwsXG4gICAgICBhY3Rpb25FeGVjdXRlVmFyaWFibGVzOiBcIltdXCIsXG4gICAgICBhY3Rpb25IVE1MQ2xhc3M6IG51bGwsXG4gICAgICBhY3Rpb25IVE1MSWQ6IG51bGwsXG4gICAgICBhY3Rpb25NYWluUmVjZWl2ZU9iamVjdHM6IFwiW11cIixcbiAgICAgIGFjdGlvblJ1blNxbHM6IFwiW11cIixcbiAgICAgIGFjdGlvblNlbmRNZXNzYWdlSWQ6IG51bGwsXG4gICAgICBhY3Rpb25TZW5kU2lnbmFsSWQ6IG51bGwsXG4gICAgICBhY3Rpb25TaG93T3BpbmlvbkRpYWxvZzogXCJmYWxzZVwiLFxuICAgICAgYWN0aW9uVHlwZTogXCJzZW5kXCIsXG4gICAgICBhY3Rpb25VcGRhdGVGaWVsZHM6IFwiW11cIixcbiAgICAgIGFjdGlvblZhbGlkYXRlOiBcIuaXoFwiLFxuICAgICAgYWN0aW9uT3BpbmlvbkJpbmRUb0VsZW1JZDogbnVsbCxcbiAgICAgIGFjdGlvbk9waW5pb25CaW5kVG9GaWVsZDogbnVsbCxcbiAgICAgIGp1ZWxSdW5SZXN1bHRQTzoge1xuICAgICAgICBib29sZWFuUmVzdWx0OiB0cnVlLFxuICAgICAgICBtZXNzYWdlOiBcIlwiLFxuICAgICAgICBzdHJpbmdSZXN1bHQ6IFwiXCIsXG4gICAgICAgIHN1Y2Nlc3M6IHRydWVcbiAgICAgIH0sXG4gICAgICBhY3Rpb25EaXNhYmxlOiBcImVuYWJsZVwiLFxuICAgICAgYWN0aW9uUmVtYXJrOiBcIlwiXG4gICAgfTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEZsb3dSdW50aW1lUGFnZU9iamVjdCA9IHtcbiAgX3dlYkZvcm1SVFBhcmFzOiBudWxsLFxuICBfZm9ybVJ1bnRpbWVJbnN0OiBudWxsLFxuICBGT1JNX1JVTlRJTUVfQ0FURUdPUllfRkxPVzogXCJJc0RlcGVuZGVuY2VGbG93XCIsXG4gIF9mbG93SW5zdGFuY2VSdW50aW1lUE86IG51bGwsXG4gIF9pc0NyZWF0ZWRNb2RlbGVyVmlldzogZmFsc2UsXG4gIGJ1aWxkUGFnZVJlYWR5SW5uZXJQYXJhczogZnVuY3Rpb24gYnVpbGRQYWdlUmVhZHlJbm5lclBhcmFzKGlzU3RhcnRJbnN0YW5jZVN0YXR1cywgcmVjb3JkSWQsIGZsb3dJbnN0YW5jZVJ1bnRpbWVQTywgZmxvd0luc3RhbmNlUnVudGltZVBPQ2FjaGVLZXkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVjb3JkSWQ6IHJlY29yZElkLFxuICAgICAgZm9ybUlkOiBmbG93SW5zdGFuY2VSdW50aW1lUE8uamI0ZGNGb3JtSWQsXG4gICAgICBjdXJyZW50Tm9kZUtleTogZmxvd0luc3RhbmNlUnVudGltZVBPLmN1cnJlbnROb2RlS2V5LFxuICAgICAgY3VycmVudE5vZGVOYW1lOiBmbG93SW5zdGFuY2VSdW50aW1lUE8uY3VycmVudE5vZGVOYW1lLFxuICAgICAgbW9kZWxJZDogZmxvd0luc3RhbmNlUnVudGltZVBPLm1vZGVsSW50ZWdyYXRlZEVudGl0eS5tb2RlbElkLFxuICAgICAgbW9kZWxSZUtleTogZmxvd0luc3RhbmNlUnVudGltZVBPLm1vZGVsSW50ZWdyYXRlZEVudGl0eS5tb2RlbFJlS2V5LFxuICAgICAgY3VycmVudFRhc2tJZDogZmxvd0luc3RhbmNlUnVudGltZVBPLmV4ZWN1dGlvblRhc2tFbnRpdHkgPyBmbG93SW5zdGFuY2VSdW50aW1lUE8uZXhlY3V0aW9uVGFza0VudGl0eS5leHRhc2tJZCA6IFwiXCIsXG4gICAgICBmbG93SW5zdGFuY2VSdW50aW1lUE9DYWNoZUtleTogZmxvd0luc3RhbmNlUnVudGltZVBPQ2FjaGVLZXksXG4gICAgICBmbG93SW5zdGFuY2VSdW50aW1lUE86IGZsb3dJbnN0YW5jZVJ1bnRpbWVQTyxcbiAgICAgIGlzU3RhcnRJbnN0YW5jZVN0YXR1czogaXNTdGFydEluc3RhbmNlU3RhdHVzLFxuICAgICAgamI0ZGNBY3Rpb25zOiBmbG93SW5zdGFuY2VSdW50aW1lUE8uamI0ZGNBY3Rpb25zXG4gICAgfTtcbiAgfSxcbiAgcGFnZVJlYWR5Rm9yU3RhcnRTdGF0dXM6IGZ1bmN0aW9uIHBhZ2VSZWFkeUZvclN0YXJ0U3RhdHVzKGlzU3RhcnRJbnN0YW5jZVN0YXR1cywgZmxvd0luc3RhbmNlUnVudGltZVBPLCBmbG93SW5zdGFuY2VSdW50aW1lUE9DYWNoZUtleSwgcGFnZUhvc3RJbnN0YW5jZSkge1xuICAgIHRoaXMuX2Zvcm1SdW50aW1lSW5zdCA9IE9iamVjdC5jcmVhdGUoRm9ybVJ1bnRpbWUpO1xuICAgIEZsb3dSdW50aW1lUGFnZU9iamVjdC5fZmxvd0luc3RhbmNlUnVudGltZVBPID0gZmxvd0luc3RhbmNlUnVudGltZVBPO1xuICAgIHZhciByZWNvcmRJZCA9IFN0cmluZ1V0aWxpdHkuR3VpZCgpO1xuICAgIHZhciBwYWdlUmVhZHlJbm5lclBhcmFzID0gdGhpcy5idWlsZFBhZ2VSZWFkeUlubmVyUGFyYXMoaXNTdGFydEluc3RhbmNlU3RhdHVzLCByZWNvcmRJZCwgZmxvd0luc3RhbmNlUnVudGltZVBPLCBmbG93SW5zdGFuY2VSdW50aW1lUE9DYWNoZUtleSk7XG5cbiAgICB0aGlzLl9mb3JtUnVudGltZUluc3QuSW5pdGlhbGl6YXRpb24oe1xuICAgICAgXCJJbnN0YW5jZUlkXCI6IGZsb3dJbnN0YW5jZVJ1bnRpbWVQTy5pbnN0YW5jZUVudGl0eS5pbnN0SWQsXG4gICAgICBcIlJlbmRlcmVyVG9JZFwiOiBcImh0bWxEZXNpZ25SdW50aW1lV3JhcFwiLFxuICAgICAgXCJGb3JtSWRcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5mb3JtSWQsXG4gICAgICBcIlJlY29yZElkXCI6IHJlY29yZElkLFxuICAgICAgXCJCdXR0b25JZFwiOiBcIlwiLFxuICAgICAgXCJPcGVyYXRpb25UeXBlXCI6IEJhc2VVdGlsaXR5LkdldEFkZE9wZXJhdGlvbk5hbWUoKSxcbiAgICAgIFwiSXNQcmV2aWV3XCI6IGZhbHNlLFxuICAgICAgXCJSZW5kZXJlckNoYWluQ29tcGxldGVkRnVuY1wiOiBGbG93UnVudGltZVBhZ2VPYmplY3QuZm9ybVJlbmRlcmVyQ2hhaW5Db21wbGV0ZWRGdW5jLFxuICAgICAgXCJMaXN0Rm9ybUJ1dHRvbkVsZW1JZFwiOiBcIlwiLFxuICAgICAgXCJXZWJGb3JtUlRQYXJhc1wiOiB7fSxcbiAgICAgIFwiRm9ybVJ1bnRpbWVDYXRlZ29yeVwiOiBGbG93UnVudGltZVBhZ2VPYmplY3QuRk9STV9SVU5USU1FX0NBVEVHT1JZX0ZMT1csXG4gICAgICBcIlByZUhhbmRsZUZvcm1IdG1sUnVudGltZUZ1bmNcIjogdGhpcy5wcmVIYW5kbGVGb3JtSHRtbFJ1bnRpbWVGdW5jLFxuICAgICAgXCJGbG93SW5zdGFuY2VSdW50aW1lUE9cIjogZmxvd0luc3RhbmNlUnVudGltZVBPLFxuICAgICAgXCJGbG93TW9kZWxSdW50aW1lUE9DYWNoZUtleVwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLmZsb3dJbnN0YW5jZVJ1bnRpbWVQT0NhY2hlS2V5LFxuICAgICAgXCJJc1N0YXJ0SW5zdGFuY2VTdGF0dXNcIjogaXNTdGFydEluc3RhbmNlU3RhdHVzLFxuICAgICAgXCJDdXJyZW50Tm9kZUtleVwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLmN1cnJlbnROb2RlS2V5LFxuICAgICAgXCJDdXJyZW50Tm9kZU5hbWVcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5jdXJyZW50Tm9kZU5hbWUsXG4gICAgICBcIk1vZGVsSWRcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5tb2RlbElkLFxuICAgICAgXCJNb2RlbFJlS2V5XCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMubW9kZWxSZUtleSxcbiAgICAgIFwiQ3VycmVudFRhc2tJZFwiOiBcIlwiXG4gICAgfSk7XG5cbiAgICB0aGlzLnJlbmRlcmVyQWN0aW9uQnV0dG9ucyhpc1N0YXJ0SW5zdGFuY2VTdGF0dXMsIHRoaXMuX2Zvcm1SdW50aW1lSW5zdCwgcGFnZUhvc3RJbnN0YW5jZSwgcGFnZVJlYWR5SW5uZXJQYXJhcyk7XG4gICAgcmV0dXJuIHRoaXMuX2Zvcm1SdW50aW1lSW5zdDtcbiAgfSxcbiAgcGFnZVJlYWR5Rm9yUHJvY2Vzc1N0YXR1czogZnVuY3Rpb24gcGFnZVJlYWR5Rm9yUHJvY2Vzc1N0YXR1cyhpc1N0YXJ0SW5zdGFuY2VTdGF0dXMsIGZsb3dJbnN0YW5jZVJ1bnRpbWVQTywgZmxvd0luc3RhbmNlUnVudGltZVBPQ2FjaGVLZXksIHBhZ2VIb3N0SW5zdGFuY2UpIHtcbiAgICB0aGlzLl9mb3JtUnVudGltZUluc3QgPSBPYmplY3QuY3JlYXRlKEZvcm1SdW50aW1lKTtcbiAgICBGbG93UnVudGltZVBhZ2VPYmplY3QuX2Zsb3dJbnN0YW5jZVJ1bnRpbWVQTyA9IGZsb3dJbnN0YW5jZVJ1bnRpbWVQTztcbiAgICB2YXIgcmVjb3JkSWQgPSBmbG93SW5zdGFuY2VSdW50aW1lUE8uaW5zdGFuY2VFbnRpdHkuaW5zdFJ1QnVzaW5lc3NLZXk7XG4gICAgdmFyIHBhZ2VSZWFkeUlubmVyUGFyYXMgPSB0aGlzLmJ1aWxkUGFnZVJlYWR5SW5uZXJQYXJhcyhpc1N0YXJ0SW5zdGFuY2VTdGF0dXMsIHJlY29yZElkLCBmbG93SW5zdGFuY2VSdW50aW1lUE8sIGZsb3dJbnN0YW5jZVJ1bnRpbWVQT0NhY2hlS2V5KTtcblxuICAgIHRoaXMuX2Zvcm1SdW50aW1lSW5zdC5Jbml0aWFsaXphdGlvbih7XG4gICAgICBcIkluc3RhbmNlSWRcIjogZmxvd0luc3RhbmNlUnVudGltZVBPLmluc3RhbmNlRW50aXR5Lmluc3RJZCxcbiAgICAgIFwiUmVuZGVyZXJUb0lkXCI6IFwiaHRtbERlc2lnblJ1bnRpbWVXcmFwXCIsXG4gICAgICBcIkZvcm1JZFwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLmZvcm1JZCxcbiAgICAgIFwiUmVjb3JkSWRcIjogcmVjb3JkSWQsXG4gICAgICBcIkJ1dHRvbklkXCI6IFwiXCIsXG4gICAgICBcIk9wZXJhdGlvblR5cGVcIjogQmFzZVV0aWxpdHkuR2V0VXJsT1BQYXJhVmFsdWUoKSxcbiAgICAgIFwiSXNQcmV2aWV3XCI6IGZhbHNlLFxuICAgICAgXCJSZW5kZXJlckNoYWluQ29tcGxldGVkRnVuY1wiOiBGbG93UnVudGltZVBhZ2VPYmplY3QuZm9ybVJlbmRlcmVyQ2hhaW5Db21wbGV0ZWRGdW5jLFxuICAgICAgXCJMaXN0Rm9ybUJ1dHRvbkVsZW1JZFwiOiBcIlwiLFxuICAgICAgXCJXZWJGb3JtUlRQYXJhc1wiOiB7fSxcbiAgICAgIFwiRm9ybVJ1bnRpbWVDYXRlZ29yeVwiOiBGbG93UnVudGltZVBhZ2VPYmplY3QuRk9STV9SVU5USU1FX0NBVEVHT1JZX0ZMT1csXG4gICAgICBcIlByZUhhbmRsZUZvcm1IdG1sUnVudGltZUZ1bmNcIjogdGhpcy5wcmVIYW5kbGVGb3JtSHRtbFJ1bnRpbWVGdW5jLFxuICAgICAgXCJGbG93SW5zdGFuY2VSdW50aW1lUE9cIjogZmxvd0luc3RhbmNlUnVudGltZVBPLFxuICAgICAgXCJGbG93TW9kZWxSdW50aW1lUE9DYWNoZUtleVwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLmZsb3dJbnN0YW5jZVJ1bnRpbWVQT0NhY2hlS2V5LFxuICAgICAgXCJJc1N0YXJ0SW5zdGFuY2VTdGF0dXNcIjogaXNTdGFydEluc3RhbmNlU3RhdHVzLFxuICAgICAgXCJDdXJyZW50Tm9kZUtleVwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLmN1cnJlbnROb2RlS2V5LFxuICAgICAgXCJDdXJyZW50Tm9kZU5hbWVcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5jdXJyZW50Tm9kZU5hbWUsXG4gICAgICBcIk1vZGVsSWRcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5tb2RlbElkLFxuICAgICAgXCJNb2RlbFJlS2V5XCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMubW9kZWxSZUtleSxcbiAgICAgIFwiQ3VycmVudFRhc2tJZFwiOiBcIlwiXG4gICAgfSk7XG5cbiAgICB0aGlzLnJlbmRlcmVyQWN0aW9uQnV0dG9ucyhpc1N0YXJ0SW5zdGFuY2VTdGF0dXMsIHRoaXMuX2Zvcm1SdW50aW1lSW5zdCwgcGFnZUhvc3RJbnN0YW5jZSwgcGFnZVJlYWR5SW5uZXJQYXJhcyk7XG4gICAgcmV0dXJuIHRoaXMuX2Zvcm1SdW50aW1lSW5zdDtcbiAgfSxcbiAgcmVuZGVyZXJBY3Rpb25CdXR0b25zOiBmdW5jdGlvbiByZW5kZXJlckFjdGlvbkJ1dHRvbnMoaXNTdGFydEluc3RhbmNlU3RhdHVzLCBmb3JtUnVudGltZUluc3QsIHBhZ2VIb3N0SW5zdGFuY2UsIHBhZ2VSZWFkeUlubmVyUGFyYXMpIHtcbiAgICBBY3Rpb25zUnVudGltZU9iamVjdC5DcmVhdGVBTExBY3Rpb25CdXR0b24oaXNTdGFydEluc3RhbmNlU3RhdHVzLCBmb3JtUnVudGltZUluc3QsIHBhZ2VIb3N0SW5zdGFuY2UsIHBhZ2VSZWFkeUlubmVyUGFyYXMpO1xuICB9LFxuICByZW5kZXJlckZsb3dNb2RlbGVyRm9yVGFiT25BY3Rpdml0eTogZnVuY3Rpb24gcmVuZGVyZXJGbG93TW9kZWxlckZvclRhYk9uQWN0aXZpdHkoZXZlbnQsIHVpKSB7XG4gICAgaWYgKCFGbG93UnVudGltZVBhZ2VPYmplY3QuX2lzQ3JlYXRlZE1vZGVsZXJWaWV3KSB7XG4gICAgICBDcmVhdGVNb2RlbGVyVmlldyhGbG93UnVudGltZVBhZ2VPYmplY3QuX2Zsb3dJbnN0YW5jZVJ1bnRpbWVQTyk7XG4gICAgICBGbG93UnVudGltZVBhZ2VPYmplY3QuX2lzQ3JlYXRlZE1vZGVsZXJWaWV3ID0gdHJ1ZTtcbiAgICB9XG4gIH0sXG4gIHJlbmRlcmVyRmxvd0ZpbGVDb250YWluZXI6IGZ1bmN0aW9uIHJlbmRlcmVyRmxvd0ZpbGVDb250YWluZXIoZmxvd0luc3RhbmNlUnVudGltZVBPKSB7XG4gICAgRmxvd0ZpbGVzTGlzdFNpbmdsZVBsdWdpbi5SZW5kZXJlcigpO1xuICB9LFxuICBmb3JtUmVuZGVyZXJDaGFpbkNvbXBsZXRlZEZ1bmM6IGZ1bmN0aW9uIGZvcm1SZW5kZXJlckNoYWluQ29tcGxldGVkRnVuYyhzZW5kZXJDb25maWcpIHtcbiAgICB2YXIgZmxvd0luc3RhbmNlUnVudGltZVBPID0gc2VuZGVyQ29uZmlnLmZsb3dJbnN0YW5jZVJ1bnRpbWVQTztcbiAgICBGbG93UnVudGltZVBhZ2VPYmplY3QucmVuZGVyZXJGbG93RmlsZUNvbnRhaW5lcihmbG93SW5zdGFuY2VSdW50aW1lUE8pO1xuICB9LFxuICBwcmVIYW5kbGVGb3JtSHRtbFJ1bnRpbWVGdW5jOiBmdW5jdGlvbiBwcmVIYW5kbGVGb3JtSHRtbFJ1bnRpbWVGdW5jKHNvdXJjZVJ1bnRpbWVIdG1sLCBmb3JtUnVudGltZUluc3QsIHByb3BDb25maWcpIHtcbiAgICB2YXIgZmxvd1BhZ2VDb250YWluZXIgPSAkKFwiPGRpdj5cIiArIHNvdXJjZVJ1bnRpbWVIdG1sICsgXCI8ZGl2PlwiKTtcbiAgICB2YXIgZmxvd0luc3RhbmNlUnVudGltZVBPID0gcHJvcENvbmZpZy5GbG93SW5zdGFuY2VSdW50aW1lUE87XG5cbiAgICBpZiAoZmxvd1BhZ2VDb250YWluZXIuY2hpbGRyZW4oXCJbc2luZ2xlbmFtZT0nV0ZEQ1RfVGFiQ29udGFpbmVyJ11cIikubGVuZ3RoID09IDApIHtcbiAgICAgIGZsb3dQYWdlQ29udGFpbmVyID0gJChcIjxkaXY+PGRpdiBjbGFzcz1cXFwid2ZkY3QtdGFicy1vdXRlci13cmFwLXJ1bnRpbWUgaHRtbC1kZXNpZ24tdGhlbWUtZGVmYXVsdC1yb290LWVsZW0tY2xhc3NcXFwiIGNvbnRyb2xfY2F0ZWdvcnk9XFxcIkNvbnRhaW5lckNvbnRyb2xcXFwiIGRlc2M9XFxcIlxcXCIgZ3JvdXBuYW1lPVxcXCJcXFwiIGlkPVxcXCJ0YWJzX3dyYXBfNTE4NjI3NjE2XFxcIiBpc19qYnVpbGQ0ZGNfZGF0YT1cXFwiZmFsc2VcXFwiIGpidWlsZDRkY19jdXN0b209XFxcInRydWVcXFwiIG5hbWU9XFxcInRhYnNfd3JhcF81MTg2Mjc2MTZcXFwiIHBsYWNlaG9sZGVyPVxcXCJcXFwiIHNlcmlhbGl6ZT1cXFwiZmFsc2VcXFwiIHNob3dfcmVtb3ZlX2J1dHRvbj1cXFwiZmFsc2VcXFwiIHNpbmdsZW5hbWU9XFxcIldGRENUX1RhYkNvbnRhaW5lclxcXCIgc3RhdHVzPVxcXCJlbmFibGVcXFwiIHN0eWxlPVxcXCJcXFwiIGNsaWVudF9yZXNvbHZlPVxcXCJXRkRDVF9UYWJDb250YWluZXJcXFwiPjxkaXY+XCIpO1xuICAgICAgZmxvd1BhZ2VDb250YWluZXIuY2hpbGRyZW4oXCJbc2luZ2xlbmFtZT0nV0ZEQ1RfVGFiQ29udGFpbmVyJ11cIikuYXBwZW5kKFwiPGRpdiBjbGFzcz1cXFwid3lzaXd5Zy13ZmRjdC10YWJzLWxhYmVsIHdmZGN0LXRhYnMtbGFiZWwtcnVudGltZVxcXCIgdGFiX2lkPVxcXCJ0YWJfY29udGVudF9mbG93X2Zvcm1fOTk5XFxcIj5cIiArIGZsb3dJbnN0YW5jZVJ1bnRpbWVQTy5tb2RlbE5hbWUgKyBcIjwvZGl2PlwiKTtcbiAgICAgIGZsb3dQYWdlQ29udGFpbmVyLmNoaWxkcmVuKFwiW3NpbmdsZW5hbWU9J1dGRENUX1RhYkNvbnRhaW5lciddXCIpLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1jb250ZW50IHdmZGN0LXRhYnMtY29udGVudC1ydW50aW1lXFxcIiBpZD1cXFwidGFiX2NvbnRlbnRfZmxvd19mb3JtXzk5OVxcXCI+XCIgKyBzb3VyY2VSdW50aW1lSHRtbCArIFwiPC9kaXY+XCIpO1xuICAgIH1cblxuICAgIHZhciB0YWJDb250YWluZXIgPSBmbG93UGFnZUNvbnRhaW5lci5jaGlsZHJlbihcIltzaW5nbGVuYW1lPSdXRkRDVF9UYWJDb250YWluZXInXVwiKTtcblxuICAgIGlmIChmbG93SW5zdGFuY2VSdW50aW1lUE8uamI0ZGNDb250ZW50RG9jdW1lbnRQbHVnaW4gPT0gXCJ1cGxvYWRDb252ZXJ0VG9QREZQbHVnaW5cIikge1xuICAgICAgdGFiQ29udGFpbmVyLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1sYWJlbCB3ZmRjdC10YWJzLWxhYmVsLXJ1bnRpbWVcXFwiIHRhYl9pZD1cXFwidGFiX2NvbnRlbnRfdXBsb2FkQ29udmVydFRvUERGUGx1Z2luXzk5OVxcXCI+5q2j5paHPC9kaXY+XCIpO1xuICAgICAgdGFiQ29udGFpbmVyLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1jb250ZW50IHdmZGN0LXRhYnMtY29udGVudC1ydW50aW1lXFxcIiBpZD1cXFwidGFiX2NvbnRlbnRfdXBsb2FkQ29udmVydFRvUERGUGx1Z2luXzk5OVxcXCI+XCIgKyBEb2N1bWVudENvbnRlbnRVcGxvYWRDb252ZXJ0VG9QREZQbHVnaW4uR2V0SHRtbEVsZW0ocHJvcENvbmZpZykgKyBcIjwvZGl2PlwiKTtcbiAgICB9IGVsc2UgaWYgKGZsb3dJbnN0YW5jZVJ1bnRpbWVQTy5qYjRkY0NvbnRlbnREb2N1bWVudFBsdWdpbiA9PSBcIndwc09ubGluZURvY3VtZW50UGx1Z2luXCIpIHtcbiAgICAgIHRhYkNvbnRhaW5lci5hcHBlbmQoXCI8ZGl2IGNsYXNzPVxcXCJ3eXNpd3lnLXdmZGN0LXRhYnMtbGFiZWwgd2ZkY3QtdGFicy1sYWJlbC1ydW50aW1lXFxcIiB0YWJfaWQ9XFxcInRhYl9jb250ZW50X3dwc09ubGluZURvY3VtZW50UGx1Z2luXzk5OVxcXCI+5q2j5paHPC9kaXY+XCIpO1xuICAgICAgdGFiQ29udGFpbmVyLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1jb250ZW50IHdmZGN0LXRhYnMtY29udGVudC1ydW50aW1lXFxcIiBpZD1cXFwidGFiX2NvbnRlbnRfd3BzT25saW5lRG9jdW1lbnRQbHVnaW5fOTk5XFxcIj7mnKrlrp7njrA8L2Rpdj5cIik7XG4gICAgfVxuXG4gICAgdGFiQ29udGFpbmVyLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1sYWJlbCB3ZmRjdC10YWJzLWxhYmVsLXJ1bnRpbWVcXFwiIHRhYl9pZD1cXFwidGFiX2NvbnRlbnRfZmxvd19maWxlc185OTlcXFwiPumZhOS7tjwvZGl2PlwiKTtcbiAgICB0YWJDb250YWluZXIuYXBwZW5kKFwiPGRpdiBjbGFzcz1cXFwid3lzaXd5Zy13ZmRjdC10YWJzLWNvbnRlbnQgd2ZkY3QtdGFicy1jb250ZW50LXJ1bnRpbWVcXFwiIGlkPVxcXCJ0YWJfY29udGVudF9mbG93X2ZpbGVzXzk5OVxcXCI+XCIgKyBGbG93RmlsZXNMaXN0U2luZ2xlUGx1Z2luLkdldEh0bWxFbGVtKHByb3BDb25maWcpICsgXCI8L2Rpdj5cIik7XG4gICAgdGFiQ29udGFpbmVyLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1sYWJlbCB3ZmRjdC10YWJzLWxhYmVsLXJ1bnRpbWVcXFwiIHRhYl9pZD1cXFwidGFiX2NvbnRlbnRfZmxvd19tb2RlbGVyXzk5OVxcXCI+5rWB56iL5Zu+PC9kaXY+XCIpO1xuICAgIHRhYkNvbnRhaW5lci5hcHBlbmQoXCI8ZGl2IGNsYXNzPVxcXCJ3eXNpd3lnLXdmZGN0LXRhYnMtY29udGVudCB3ZmRjdC10YWJzLWNvbnRlbnQtcnVudGltZVxcXCIgaWQ9XFxcInRhYl9jb250ZW50X2Zsb3dfbW9kZWxlcl85OTlcXFwiIHN0eWxlPSdoZWlnaHQ6IGNhbGMoMTAwJSAtIDUwcHgpOycgb25BY3Rpdml0eT1cXFwiRmxvd1J1bnRpbWVQYWdlT2JqZWN0LnJlbmRlcmVyRmxvd01vZGVsZXJGb3JUYWJPbkFjdGl2aXR5XFxcIj48ZGl2IGlkPVxcXCJmbG93LWNhbnZhc1xcXCIgc3R5bGU9XFxcImhlaWdodDoxMDAlO1xcXCI+PC9kaXY+PC9kaXY+XCIpO1xuICAgIHRhYkNvbnRhaW5lci5hcHBlbmQoXCI8ZGl2IGNsYXNzPVxcXCJ3eXNpd3lnLXdmZGN0LXRhYnMtbGFiZWwgd2ZkY3QtdGFicy1sYWJlbC1ydW50aW1lXFxcIiB0YWJfaWQ9XFxcInRhYl9jb250ZW50X2Zsb3dfdGFza185OTlcXFwiPua1gei9rOS/oeaBrzwvZGl2PlwiKTtcbiAgICB0YWJDb250YWluZXIuYXBwZW5kKFwiPGRpdiBjbGFzcz1cXFwid3lzaXd5Zy13ZmRjdC10YWJzLWNvbnRlbnQgd2ZkY3QtdGFicy1jb250ZW50LXJ1bnRpbWVcXFwiIGlkPVxcXCJ0YWJfY29udGVudF9mbG93X3Rhc2tfOTk5XFxcIj5cIiArIEluc3RhbmNlRXhUYXNrTGlzdFBsdWdpbi5HZXRIdG1sRWxlbShwcm9wQ29uZmlnKSArIFwiPC9kaXY+XCIpO1xuICAgIHZhciBuZXdSdW50aW1lSHRtbCA9IGZsb3dQYWdlQ29udGFpbmVyLmh0bWwoKTtcbiAgICByZXR1cm4gbmV3UnVudGltZUh0bWw7XG4gIH0sXG4gIGNoYW5nZVRhc2tUb1ZpZXc6IGZ1bmN0aW9uIGNoYW5nZVRhc2tUb1ZpZXcoZXhlY3V0aW9uVGFza0VudGl0eSkge1xuICAgIGNvbnNvbGUubG9nKFwiMTExMTExMTExMTExMTExMTExMVwiKTtcbiAgICBBamF4VXRpbGl0eS5Qb3N0KFwiL1Jlc3QvV29ya2Zsb3cvUnVuVGltZS9DbGllbnQvSW5zdGFuY2VSdW50aW1lL0NoYW5nZVRhc2tUb1ZpZXdcIiwge1xuICAgICAgZXh0YXNrSWQ6IGV4ZWN1dGlvblRhc2tFbnRpdHkuZXh0YXNrSWRcbiAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7fSwgdGhpcyk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBGbG93UnVudGltZVZhckJ1aWxkZXIgPSB7XG4gIEJ1aWxkZXJTZWxlY3RlZFJlY2VpdmVyVG9JbnN0YW5jZVZhcjogZnVuY3Rpb24gQnVpbGRlclNlbGVjdGVkUmVjZWl2ZXJUb0luc3RhbmNlVmFyKG5leHRGbG93Tm9kZUVudGl0aWVzLCBzZWxlY3RlZFJlY2VpdmVyRGF0YSkge1xuICAgIHZhciByZXN1bHREYXRhID0gW107XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlbGVjdGVkUmVjZWl2ZXJEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgcmVjZWl2ZXIgPSBzZWxlY3RlZFJlY2VpdmVyRGF0YVtpXTtcbiAgICAgIHJlc3VsdERhdGEucHVzaCh7XG4gICAgICAgIG5leHROb2RlSWQ6IHJlY2VpdmVyLmZsb3dOb2RlRW50aXR5LmlkLFxuICAgICAgICByZWNlaXZlcklkOiByZWNlaXZlci5pZCxcbiAgICAgICAgcmVjZWl2ZXJOYW1lOiByZWNlaXZlci5uYW1lLFxuICAgICAgICByZWNlaXZlclR5cGVOYW1lOiByZWNlaXZlci50eXBlTmFtZSxcbiAgICAgICAgcmVjZWl2ZVR5cGU6IHJlY2VpdmVyLnJlY2VpdmVUeXBlXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0RGF0YTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFdvcmtGbG93QWN0aW9uID0ge1xuICBFbXB0eVByb3A6IHtcbiAgICBcInNlbmRlclwiOiBudWxsLFxuICAgIFwiZmxvd0luc3RhbmNlUnVudGltZVBPXCI6IG51bGwsXG4gICAgXCJmbG93SW5zdGFuY2VSdW50aW1lUE9DYWNoZUtleVwiOiBudWxsLFxuICAgIFwiamI0ZGNBY3Rpb25zXCI6IG51bGwsXG4gICAgXCJmb3JtUnVudGltZUluc3RcIjogbnVsbCxcbiAgICBcImFjdGlvbk9ialwiOiBudWxsLFxuICAgIFwiaXNTdGFydEluc3RhbmNlU3RhdHVzXCI6IG51bGwsXG4gICAgXCJwYWdlSG9zdEluc3RhbmNlXCI6IG51bGwsXG4gICAgXCJjdXJyZW50Tm9kZUtleVwiOiBudWxsLFxuICAgIFwiY3VycmVudE5vZGVOYW1lXCI6IG51bGwsXG4gICAgXCJyZWNvcmRJZFwiOiBudWxsLFxuICAgIFwibW9kZWxJZFwiOiBudWxsLFxuICAgIFwibW9kZWxSZUtleVwiOiBudWxsLFxuICAgIFwiY3VycmVudFRhc2tJZFwiOiBudWxsLFxuICAgIFwiaW5zdGFuY2VJZFwiOiBudWxsLFxuICAgIFwiYWN0aW9uU2hvd09waW5pb25EaWFsb2dcIjogbnVsbCxcbiAgICBcImFjdGlvbk9waW5pb25CaW5kVG9GaWVsZFwiOiBudWxsLFxuICAgIFwiYWN0aW9uT3BpbmlvbkJpbmRUb0VsZW1JZFwiOiBudWxsLFxuICAgIFwiaHRtbElkXCI6IG51bGxcbiAgfSxcbiAgSW5zdGFuY2U6IGZ1bmN0aW9uIEluc3RhbmNlKGlzU3RhcnRJbnN0YW5jZVN0YXR1cywgZm9ybVJ1bnRpbWVJbnN0LCBwYWdlSG9zdEluc3RhbmNlLCBwYWdlUmVhZHlJbm5lclBhcmFzLCBhY3Rpb25PYmopIHtcbiAgICB2YXIgaHRtbElkID0gYWN0aW9uT2JqLmFjdGlvbkhUTUxJZCA/IGFjdGlvbk9iai5hY3Rpb25IVE1MSWQgOiBhY3Rpb25PYmouYWN0aW9uQ29kZTtcbiAgICB2YXIgZWxlbSA9ICQoJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwib3BlcmF0aW9uLWJ1dHRvbiBvcGVyYXRpb24tYnV0dG9uLXByaW1hcnlcIiBpZD1cIicgKyBodG1sSWQgKyAnXCI+PHNwYW4+JyArIGFjdGlvbk9iai5hY3Rpb25DYXB0aW9uICsgJzwvc3Bhbj48L2J1dHRvbj4nKTtcblxuICAgIGlmIChhY3Rpb25PYmouYWN0aW9uRGlzYWJsZSA9PSBcImRpc2FibGVcIikge1xuICAgICAgZWxlbS5hdHRyKFwiZGlzYWJsZVwiLCBcImRpc2FibGVcIik7XG4gICAgICBlbGVtLmFkZENsYXNzKFwib3BlcmF0aW9uLWJ1dHRvbi1wcmltYXJ5LWRpc2FibGVkXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9Qcm9wID0gV29ya0Zsb3dBY3Rpb24uQnVpbGRQcm9wKHRoaXMsIHBhZ2VSZWFkeUlubmVyUGFyYXMsIGZvcm1SdW50aW1lSW5zdCwgYWN0aW9uT2JqLCBpc1N0YXJ0SW5zdGFuY2VTdGF0dXMsIHBhZ2VIb3N0SW5zdGFuY2UsIGh0bWxJZCk7XG4gICAgICBlbGVtLmJpbmQoXCJjbGlja1wiLCB0aGlzLl9Qcm9wLCBmdW5jdGlvbiAoc2VuZGVyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHNlbmRlci5kYXRhKTtcbiAgICAgICAgc2VuZGVyLmRhdGEuc2VuZGVyLkJ1dHRvbkNsaWNrRXZlbnQoKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChhY3Rpb25PYmouYWN0aW9uUmVtYXJrKSB7XG4gICAgICBlbGVtLmF0dHIoXCJ0aXRsZVwiLCBhY3Rpb25PYmouYWN0aW9uUmVtYXJrKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgZWxlbTogZWxlbVxuICAgIH07XG4gIH0sXG4gIEJ1aWxkUHJvcDogZnVuY3Rpb24gQnVpbGRQcm9wKHNlbmRlciwgcGFnZVJlYWR5SW5uZXJQYXJhcywgZm9ybVJ1bnRpbWVJbnN0LCBhY3Rpb25PYmosIGlzU3RhcnRJbnN0YW5jZVN0YXR1cywgcGFnZUhvc3RJbnN0YW5jZSwgaHRtbElkKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIFwic2VuZGVyXCI6IHNlbmRlcixcbiAgICAgIFwiZmxvd0luc3RhbmNlUnVudGltZVBPXCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMuZmxvd0luc3RhbmNlUnVudGltZVBPLFxuICAgICAgXCJmbG93SW5zdGFuY2VSdW50aW1lUE9DYWNoZUtleVwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLmZsb3dJbnN0YW5jZVJ1bnRpbWVQT0NhY2hlS2V5LFxuICAgICAgXCJqYjRkY0FjdGlvbnNcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5qYjRkY0FjdGlvbnMsXG4gICAgICBcImZvcm1SdW50aW1lSW5zdFwiOiBmb3JtUnVudGltZUluc3QsXG4gICAgICBcImFjdGlvbk9ialwiOiBhY3Rpb25PYmosXG4gICAgICBcImlzU3RhcnRJbnN0YW5jZVN0YXR1c1wiOiBpc1N0YXJ0SW5zdGFuY2VTdGF0dXMsXG4gICAgICBcInBhZ2VIb3N0SW5zdGFuY2VcIjogcGFnZUhvc3RJbnN0YW5jZSxcbiAgICAgIFwiY3VycmVudE5vZGVLZXlcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5jdXJyZW50Tm9kZUtleSxcbiAgICAgIFwiY3VycmVudE5vZGVOYW1lXCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMuY3VycmVudE5vZGVOYW1lLFxuICAgICAgXCJyZWNvcmRJZFwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLnJlY29yZElkLFxuICAgICAgXCJtb2RlbElkXCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMubW9kZWxJZCxcbiAgICAgIFwibW9kZWxSZUtleVwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLm1vZGVsUmVLZXksXG4gICAgICBcImN1cnJlbnRUYXNrSWRcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5jdXJyZW50VGFza0lkLFxuICAgICAgXCJpbnN0YW5jZUlkXCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMuZmxvd0luc3RhbmNlUnVudGltZVBPLmluc3RhbmNlRW50aXR5Lmluc3RJZCxcbiAgICAgIFwiYWN0aW9uU2hvd09waW5pb25EaWFsb2dcIjogYWN0aW9uT2JqLmFjdGlvblNob3dPcGluaW9uRGlhbG9nLFxuICAgICAgXCJhY3Rpb25PcGluaW9uQmluZFRvRmllbGRcIjogYWN0aW9uT2JqLmFjdGlvbk9waW5pb25CaW5kVG9GaWVsZCxcbiAgICAgIFwiYWN0aW9uT3BpbmlvbkJpbmRUb0VsZW1JZFwiOiBhY3Rpb25PYmouYWN0aW9uT3BpbmlvbkJpbmRUb0VsZW1JZCxcbiAgICAgIFwiaHRtbElkXCI6IGh0bWxJZFxuICAgIH07XG4gIH0sXG4gIFJlZnJlc2hQYXJlbnRMaXN0VGhlbkNsb3NlOiBmdW5jdGlvbiBSZWZyZXNoUGFyZW50TGlzdFRoZW5DbG9zZShtZXNzYWdlKSB7XG4gICAgaWYgKHdpbmRvdy5PcGVuZXJXaW5kb3dPYmogIT0gbnVsbCAmJiB3aW5kb3cuT3BlbmVyV2luZG93T2JqLmluc3RhbmNlTWFpblRhc2tQcm9jZXNzTGlzdCAhPSBudWxsKSB7XG4gICAgICB3aW5kb3cuT3BlbmVyV2luZG93T2JqLmluc3RhbmNlTWFpblRhc2tQcm9jZXNzTGlzdC5yZWxvYWREYXRhKCk7XG4gICAgfVxuXG4gICAgcG9ydGxldFV0aWxpdHkuVXBkYXRlUmVmcmVzaFZlcnNpb24oKTtcbiAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgbWVzc2FnZSwgZnVuY3Rpb24gKCkge1xuICAgICAgRGlhbG9nVXRpbGl0eS5GcmFtZV9DbG9zZURpYWxvZyh3aW5kb3cpO1xuICAgIH0sIHRoaXMpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRGVsZXRlSW5zdGFuY2VBY3Rpb24gPSB7XG4gIGFjSW50ZXJmYWNlOiB7fSxcbiAgX1Byb3A6IFdvcmtGbG93QWN0aW9uLkVtcHR5UHJvcCxcbiAgSW5zdGFuY2U6IGZ1bmN0aW9uIEluc3RhbmNlKGlzU3RhcnRJbnN0YW5jZVN0YXR1cywgZm9ybVJ1bnRpbWVJbnN0LCBwYWdlSG9zdEluc3RhbmNlLCBwYWdlUmVhZHlJbm5lclBhcmFzLCBhY3Rpb25PYmopIHtcbiAgICByZXR1cm4gV29ya0Zsb3dBY3Rpb24uSW5zdGFuY2UuY2FsbCh0aGlzLCBpc1N0YXJ0SW5zdGFuY2VTdGF0dXMsIGZvcm1SdW50aW1lSW5zdCwgcGFnZUhvc3RJbnN0YW5jZSwgcGFnZVJlYWR5SW5uZXJQYXJhcywgYWN0aW9uT2JqKTtcbiAgfSxcbiAgQnV0dG9uQ2xpY2tFdmVudDogZnVuY3Rpb24gQnV0dG9uQ2xpY2tFdmVudChzZW5kZXIpIHtcbiAgICBEaWFsb2dVdGlsaXR5LkNvbmZpcm0od2luZG93LCBcIuaaguS4jeaUr+aMgeivpeaTjeS9nD9cIiwgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuO1xuICAgIH0sIHRoaXMpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiOyIsIlwidXNlIHN0cmljdFwiOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgUmVjYWxsQWN0aW9uID0ge1xuICBhY0ludGVyZmFjZToge1xuICAgIHJlY2FsbE15U2VuZFRhc2s6IFwiL1Jlc3QvV29ya2Zsb3cvUnVuVGltZS9DbGllbnQvSW5zdGFuY2VSdW50aW1lL1JlY2FsbE15U2VuZFRhc2tcIlxuICB9LFxuICBfUHJvcDogV29ya0Zsb3dBY3Rpb24uRW1wdHlQcm9wLFxuICBJbnN0YW5jZTogZnVuY3Rpb24gSW5zdGFuY2UoaXNTdGFydEluc3RhbmNlU3RhdHVzLCBmb3JtUnVudGltZUluc3QsIHBhZ2VIb3N0SW5zdGFuY2UsIHBhZ2VSZWFkeUlubmVyUGFyYXMsIGFjdGlvbk9iaikge1xuICAgIHJldHVybiBXb3JrRmxvd0FjdGlvbi5JbnN0YW5jZS5jYWxsKHRoaXMsIGlzU3RhcnRJbnN0YW5jZVN0YXR1cywgZm9ybVJ1bnRpbWVJbnN0LCBwYWdlSG9zdEluc3RhbmNlLCBwYWdlUmVhZHlJbm5lclBhcmFzLCBhY3Rpb25PYmopO1xuICB9LFxuICBCdXR0b25DbGlja0V2ZW50OiBmdW5jdGlvbiBCdXR0b25DbGlja0V2ZW50KHNlbmRlcikge1xuICAgIERpYWxvZ1V0aWxpdHkuQ29uZmlybSh3aW5kb3csIFwi56Gu6K6k5omn6KGM5pKk5Zue5pON5L2cP1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0TG9hZGluZyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nTG9hZGluZ0lkLCB7fSwgXCLns7vnu5/lpITnkIbkuK0s6K+356iN5YCZIVwiKTtcbiAgICAgIEFqYXhVdGlsaXR5LlBvc3QodGhpcy5hY0ludGVyZmFjZS5yZWNhbGxNeVNlbmRUYXNrLCB7XG4gICAgICAgIGV4dGFza0lkOiB0aGlzLl9Qcm9wLmN1cnJlbnRUYXNrSWRcbiAgICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZyhEaWFsb2dVdGlsaXR5LkRpYWxvZ0xvYWRpbmdJZCk7XG5cbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgdGhpcy5SZWZyZXNoUGFyZW50TGlzdFRoZW5DbG9zZShyZXN1bHQubWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgIH0sIHRoaXMpO1xuICAgIH0sIHRoaXMpO1xuICB9LFxuICBSZWZyZXNoUGFyZW50TGlzdFRoZW5DbG9zZTogV29ya0Zsb3dBY3Rpb24uUmVmcmVzaFBhcmVudExpc3RUaGVuQ2xvc2Vcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBTZW5kQWN0aW9uID0ge1xuICBhY0ludGVyZmFjZToge1xuICAgIHJlc29sdmVOZXh0UG9zc2libGVGbG93Tm9kZTogXCIvUmVzdC9Xb3JrZmxvdy9SdW5UaW1lL0NsaWVudC9JbnN0YW5jZVJ1bnRpbWUvUmVzb2x2ZU5leHRQb3NzaWJsZUZsb3dOb2RlXCIsXG4gICAgY29tcGxldGVUYXNrOiBcIi9SZXN0L1dvcmtmbG93L1J1blRpbWUvQ2xpZW50L0luc3RhbmNlUnVudGltZS9Db21wbGV0ZVRhc2tcIlxuICB9LFxuICBfUHJvcDogV29ya0Zsb3dBY3Rpb24uRW1wdHlQcm9wLFxuICBuZXdPcGluaW9uTGlzdDogW10sXG4gIGlucHV0T3BpbmlvblRleHQ6IG51bGwsXG4gIEluc3RhbmNlOiBmdW5jdGlvbiBJbnN0YW5jZShpc1N0YXJ0SW5zdGFuY2VTdGF0dXMsIGZvcm1SdW50aW1lSW5zdCwgcGFnZUhvc3RJbnN0YW5jZSwgcGFnZVJlYWR5SW5uZXJQYXJhcywgYWN0aW9uT2JqKSB7XG4gICAgcmV0dXJuIFdvcmtGbG93QWN0aW9uLkluc3RhbmNlLmNhbGwodGhpcywgaXNTdGFydEluc3RhbmNlU3RhdHVzLCBmb3JtUnVudGltZUluc3QsIHBhZ2VIb3N0SW5zdGFuY2UsIHBhZ2VSZWFkeUlubmVyUGFyYXMsIGFjdGlvbk9iaik7XG4gIH0sXG4gIEJ1dHRvbkNsaWNrRXZlbnQ6IGZ1bmN0aW9uIEJ1dHRvbkNsaWNrRXZlbnQoKSB7XG4gICAgdmFyIHZhbGlkYXRlUmVzdWx0ID0gVmFsaWRhdGVSdWxlc1J1bnRpbWUuVmFsaWRhdGVTdWJtaXRFbmFibGUoKTtcblxuICAgIGlmIChWYWxpZGF0ZVJ1bGVzUnVudGltZS5BbGVydFZhbGlkYXRlRXJyb3JzKHZhbGlkYXRlUmVzdWx0KSkge1xuICAgICAgdmFyIGFjdGlvblNob3dPcGluaW9uRGlhbG9nID0gdGhpcy5fUHJvcC5hY3Rpb25TaG93T3BpbmlvbkRpYWxvZztcblxuICAgICAgaWYgKGFjdGlvblNob3dPcGluaW9uRGlhbG9nID09IFwidHJ1ZVwiKSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuUHJvbXB0KHdpbmRvdywge1xuICAgICAgICAgIHRpdGxlOiBcIuezu+e7n+aPkOekulwiLFxuICAgICAgICAgIGhlaWdodDogMzAwLFxuICAgICAgICAgIHdpZHRoOiA0MDBcbiAgICAgICAgfSwgRGlhbG9nVXRpbGl0eS5EaWFsb2dQcm9tcHRJZCwgXCLor7fovpPlhaXlpITnkIbmhI/op4ExXCIsIGZ1bmN0aW9uIChpbnB1dFRleHQpIHtcbiAgICAgICAgICB2YXIgb3BpbmlvbkJpbmRUb0NvbnRyb2xJbnN0YW5jZSA9IHRoaXMuVHJ5R2V0T3BpbmlvbkJpbmRUb0NvbnRyb2xJbnN0YW5jZSh0aGlzLl9Qcm9wKTtcblxuICAgICAgICAgIGlmIChvcGluaW9uQmluZFRvQ29udHJvbEluc3RhbmNlICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb3BpbmlvbkJpbmRUb0NvbnRyb2xJbnN0YW5jZS5TZXROZXdWYWx1ZSA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgb3BpbmlvbkJpbmRUb0NvbnRyb2xJbnN0YW5jZS5TZXROZXdWYWx1ZShpbnB1dFRleHQpO1xuICAgICAgICAgICAgICB0aGlzLmlucHV0T3BpbmlvblRleHQgPSBpbnB1dFRleHQ7XG4gICAgICAgICAgICAgIHRoaXMuQmVnaW5TZWxlY3RSZWNlaXZlcih0aGlzLCB0aGlzLl9Qcm9wKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KFwi5oSP6KeB5YWz6IGU5a+56LGh5Li65a6e546wU2V0TmV3VmFsdWXmlrnms5UhIVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5CZWdpblNlbGVjdFJlY2VpdmVyKHRoaXMsIHRoaXMuX1Byb3ApO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgVHJ5R2V0T3BpbmlvbkJpbmRUb0NvbnRyb2xJbnN0YW5jZTogZnVuY3Rpb24gVHJ5R2V0T3BpbmlvbkJpbmRUb0NvbnRyb2xJbnN0YW5jZShfcHJvcCkge1xuICAgIHZhciBhY3Rpb25PcGluaW9uQmluZFRvRWxlbUlkID0gX3Byb3AuYWN0aW9uT3BpbmlvbkJpbmRUb0VsZW1JZDtcbiAgICB2YXIgYWN0aW9uT3BpbmlvbkJpbmRUb0ZpZWxkID0gX3Byb3AuYWN0aW9uT3BpbmlvbkJpbmRUb0ZpZWxkO1xuICAgIHZhciBjb250cm9sRWxlbTtcblxuICAgIGlmIChhY3Rpb25PcGluaW9uQmluZFRvRWxlbUlkKSB7XG4gICAgICBjb250cm9sRWxlbSA9ICQoXCIjXCIgKyBhY3Rpb25PcGluaW9uQmluZFRvRWxlbUlkKTtcbiAgICB9XG5cbiAgICBpZiAoY29udHJvbEVsZW0gJiYgY29udHJvbEVsZW0ubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIEhUTUxDb250cm9sLkdldENvbnRyb2xJbnN0YW5jZUJ5RWxlbShjb250cm9sRWxlbSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnRyb2xFbGVtID0gJChcIltmaWVsZG5hbWU9J1wiICsgYWN0aW9uT3BpbmlvbkJpbmRUb0ZpZWxkICsgXCInXVwiKTtcbiAgICB9XG5cbiAgICBpZiAoY29udHJvbEVsZW0gJiYgY29udHJvbEVsZW0ubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIEhUTUxDb250cm9sLkdldENvbnRyb2xJbnN0YW5jZUJ5RWxlbShjb250cm9sRWxlbSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH0sXG4gIEJlZ2luU2VsZWN0UmVjZWl2ZXI6IGZ1bmN0aW9uIEJlZ2luU2VsZWN0UmVjZWl2ZXIoX3RoaXMsIF9wcm9wKSB7XG4gICAgRGlhbG9nVXRpbGl0eS5BbGVydExvYWRpbmcod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0xvYWRpbmdJZCwge30sIFwiXCIpO1xuICAgIHZhciBzZW5kRGF0YSA9IHRoaXMuQnVpbGRTZW5kVG9TZXJ2ZXJEYXRhKHRoaXMuX1Byb3AsIG51bGwpO1xuXG4gICAgaWYgKHNlbmREYXRhLnN1Y2Nlc3MpIHtcbiAgICAgIEFqYXhVdGlsaXR5LlBvc3QodGhpcy5hY0ludGVyZmFjZS5yZXNvbHZlTmV4dFBvc3NpYmxlRmxvd05vZGUsIHNlbmREYXRhLmRhdGEsIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZyhEaWFsb2dVdGlsaXR5LkRpYWxvZ0xvYWRpbmdJZCk7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG5cbiAgICAgICAgaWYgKHJlc3VsdC5kYXRhLm5leHRUYXNrSXNFbmRFdmVudCkge1xuICAgICAgICAgIHRoaXMuU2VsZWN0UmVjZWl2ZXJDb21wbGV0ZWQocmVzdWx0LmRhdGEuYnBtblRhc2tMaXN0LCBbXSk7XG4gICAgICAgIH0gZWxzZSBpZiAocmVzdWx0LmRhdGEuY3VycmVudFRhc2tJc011bHRpSW5zdGFuY2UgJiYgcmVzdWx0LmRhdGEuY3VycmVudFRhc2tNdWx0aUNvbXBsZXRlZEluc3RhbmNlcyArIDEgPCByZXN1bHQuZGF0YS5jdXJyZW50VGFza011bHRpQ291bnRFbmdJbnN0YW5jZXMpIHtcbiAgICAgICAgICB0aGlzLlNlbGVjdFJlY2VpdmVyQ29tcGxldGVkKHJlc3VsdC5kYXRhLmJwbW5UYXNrTGlzdCwgW10pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIFVzZXJUYXNrUmVjZWl2ZXJEaWFsb2dVdGlsaXR5LlNob3dEaWFsb2codGhpcywgcmVzdWx0LmRhdGEuYnBtblRhc2tMaXN0LCB0aGlzLlNlbGVjdFJlY2VpdmVyQ29tcGxldGVkKTtcbiAgICAgICAgfVxuICAgICAgfSwgdGhpcyk7XG4gICAgfVxuICB9LFxuICBTZWxlY3RSZWNlaXZlckNvbXBsZXRlZDogZnVuY3Rpb24gU2VsZWN0UmVjZWl2ZXJDb21wbGV0ZWQobmV4dFRhc2tFbnRpdHlMaXN0LCBzZWxlY3RlZFJlY2VpdmVyRGF0YSkge1xuICAgIERpYWxvZ1V0aWxpdHkuQ29uZmlybSh3aW5kb3csIFwi56Gu6K6k5omn6KGM5Y+R6YCBP1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZWN0ZWRSZWNlaXZlclZhcnMgPSBGbG93UnVudGltZVZhckJ1aWxkZXIuQnVpbGRlclNlbGVjdGVkUmVjZWl2ZXJUb0luc3RhbmNlVmFyKG5leHRUYXNrRW50aXR5TGlzdCwgc2VsZWN0ZWRSZWNlaXZlckRhdGEpO1xuXG4gICAgICBpZiAodGhpcy5pbnB1dE9waW5pb25UZXh0ICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5uZXdPcGluaW9uTGlzdC5wdXNoKHRoaXMuQnVpbGROZXdPcGluaW9uKHRoaXMuaW5wdXRPcGluaW9uVGV4dCkpO1xuICAgICAgfVxuXG4gICAgICB2YXIgc2VuZERhdGEgPSB0aGlzLkJ1aWxkU2VuZFRvU2VydmVyRGF0YSh0aGlzLl9Qcm9wLCB7XG4gICAgICAgIHNlbGVjdGVkUmVjZWl2ZXJWYXJzOiBlbmNvZGVVUklDb21wb25lbnQoSnNvblV0aWxpdHkuSnNvblRvU3RyaW5nKHNlbGVjdGVkUmVjZWl2ZXJWYXJzKSksXG4gICAgICAgIG5ld09waW5pb25MaXN0U3RyaW5nOiBlbmNvZGVVUklDb21wb25lbnQoSnNvblV0aWxpdHkuSnNvblRvU3RyaW5nKHRoaXMubmV3T3Bpbmlvbkxpc3QpKVxuICAgICAgfSk7XG5cbiAgICAgIGlmIChzZW5kRGF0YS5zdWNjZXNzKSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRMb2FkaW5nKHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dMb2FkaW5nSWQsIHt9LCBcIuezu+e7n+WkhOeQhuS4rSzor7fnqI3lgJkhXCIpO1xuICAgICAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuYWNJbnRlcmZhY2UuY29tcGxldGVUYXNrLCBzZW5kRGF0YS5kYXRhLCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZyhEaWFsb2dVdGlsaXR5LkRpYWxvZ0xvYWRpbmdJZCk7XG5cbiAgICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgIHRoaXMuUmVmcmVzaFBhcmVudExpc3RUaGVuQ2xvc2UocmVzdWx0Lm1lc3NhZ2UpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0RXJyb3Iod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0RXJyb3JJZCwge30sIHJlc3VsdC5kYXRhLm1lc3NhZ2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICB9XG4gICAgfSwgdGhpcyk7XG4gIH0sXG4gIEJ1aWxkU2VuZFRvU2VydmVyRGF0YTogZnVuY3Rpb24gQnVpbGRTZW5kVG9TZXJ2ZXJEYXRhKF9wcm9wLCBhcHBlbmRTZW5kTWFwKSB7XG4gICAgdmFyIGZvcm1EYXRhQ29tcGxleFBPID0gX3Byb3AuZm9ybVJ1bnRpbWVJbnN0LlNlcmlhbGl6YXRpb25Gb3JtRGF0YSgpO1xuXG4gICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGlzU3RhcnRJbnN0YW5jZVN0YXR1czogX3Byb3AuaXNTdGFydEluc3RhbmNlU3RhdHVzLFxuICAgICAgICBhY3Rpb25Db2RlOiBfcHJvcC5hY3Rpb25PYmouYWN0aW9uQ29kZSxcbiAgICAgICAgZmxvd0luc3RhbmNlUnVudGltZVBPQ2FjaGVLZXk6IF9wcm9wLmZsb3dJbnN0YW5jZVJ1bnRpbWVQT0NhY2hlS2V5LFxuICAgICAgICBcImZvcm1SZWNvcmRDb21wbGV4UE9TdHJpbmdcIjogZW5jb2RlVVJJQ29tcG9uZW50KEpzb25VdGlsaXR5Lkpzb25Ub1N0cmluZyhmb3JtRGF0YUNvbXBsZXhQTykpLFxuICAgICAgICBcImN1cnJlbnROb2RlS2V5XCI6IF9wcm9wLmN1cnJlbnROb2RlS2V5LFxuICAgICAgICBcImN1cnJlbnROb2RlTmFtZVwiOiBfcHJvcC5jdXJyZW50Tm9kZU5hbWUsXG4gICAgICAgIFwicmVjb3JkSWRcIjogX3Byb3AucmVjb3JkSWQsXG4gICAgICAgIFwibW9kZWxJZFwiOiBfcHJvcC5tb2RlbElkLFxuICAgICAgICBcIm1vZGVsUmVLZXlcIjogX3Byb3AubW9kZWxSZUtleSxcbiAgICAgICAgXCJjdXJyZW50VGFza0lkXCI6IF9wcm9wLmN1cnJlbnRUYXNrSWQsXG4gICAgICAgIFwiaW5zdGFuY2VJZFwiOiBfcHJvcC5pbnN0YW5jZUlkLFxuICAgICAgICBcIm5ld09waW5pb25MaXN0U3RyaW5nXCI6IFwiXCJcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKGFwcGVuZFNlbmRNYXApIHtcbiAgICAgIGZvciAodmFyIGtleSBpbiBhcHBlbmRTZW5kTWFwKSB7XG4gICAgICAgIHJlc3VsdC5kYXRhW2tleV0gPSBhcHBlbmRTZW5kTWFwW2tleV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcbiAgQnVpbGROZXdPcGluaW9uOiBmdW5jdGlvbiBCdWlsZE5ld09waW5pb24ob3BpbmlvblRleHQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgb3BpbmlvblRleHQ6IG9waW5pb25UZXh0LFxuICAgICAgb3BpbmlvbkNsaWVudENvZGU6IFN0cmluZ1V0aWxpdHkuVGltZXN0YW1wKClcbiAgICB9O1xuICB9LFxuICBSZWZyZXNoUGFyZW50TGlzdFRoZW5DbG9zZTogV29ya0Zsb3dBY3Rpb24uUmVmcmVzaFBhcmVudExpc3RUaGVuQ2xvc2Vcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciB1c2VyVGFza1JlY2VpdmVyRGlhbG9nT3V0ZXJWdWU7XG52YXIgVXNlclRhc2tSZWNlaXZlckRpYWxvZ1V0aWxpdHkgPSB7XG4gIFNob3dEaWFsb2c6IGZ1bmN0aW9uIFNob3dEaWFsb2coc2VuZGVyLCBuZXh0Rmxvd05vZGVFbnRpdGllcywgc2VsZWN0UmVjZWl2ZXJDb21wbGV0ZWRGdW5jKSB7XG4gICAgaWYgKCF1c2VyVGFza1JlY2VpdmVyRGlhbG9nT3V0ZXJWdWUpIHtcbiAgICAgICQoZG9jdW1lbnQuYm9keSkuYXBwZW5kKFwiPGRpdiBpZD0ndXNlclRhc2tSZWNlaXZlckRpYWxvZ091dGVyJz48dXNlci10YXNrLXJlY2VpdmVyLWRpYWxvZyByZWY9J3VzZXJUYXNrUmVjZWl2ZXJEaWFsb2cnPjwvdXNlci10YXNrLXJlY2VpdmVyLWRpYWxvZz48L2Rpdj5cIik7XG4gICAgICB1c2VyVGFza1JlY2VpdmVyRGlhbG9nT3V0ZXJWdWUgPSBuZXcgVnVlKHtcbiAgICAgICAgZWw6IFwiI3VzZXJUYXNrUmVjZWl2ZXJEaWFsb2dPdXRlclwiLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgYWNJbnRlcmZhY2U6IHtcbiAgICAgICAgICAgIGdldFJ1bnRpbWVNb2RlbFdpdGhTdGFydDogXCIvUmVzdC9Xb3JrZmxvdy9SdW5UaW1lL0NsaWVudC9Nb2RlbFJ1bnRpbWUvR2V0UnVudGltZU1vZGVsV2l0aFN0YXJ0XCJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG1vdW50ZWQ6IGZ1bmN0aW9uIG1vdW50ZWQoKSB7fSxcbiAgICAgICAgbWV0aG9kczoge31cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHVzZXJUYXNrUmVjZWl2ZXJEaWFsb2dPdXRlclZ1ZS4kcmVmcy51c2VyVGFza1JlY2VpdmVyRGlhbG9nLmJlZ2luU2VsZWN0UmVjZWl2ZXIoc2VuZGVyLCBuZXh0Rmxvd05vZGVFbnRpdGllcywgc2VsZWN0UmVjZWl2ZXJDb21wbGV0ZWRGdW5jKTtcbiAgfSxcbiAgQ2xvc2VEaWFsb2c6IGZ1bmN0aW9uIENsb3NlRGlhbG9nKCkge1xuICAgIERpYWxvZ1V0aWxpdHkuQ2xvc2VEaWFsb2dFbGVtKHVzZXJUYXNrUmVjZWl2ZXJEaWFsb2dPdXRlclZ1ZS4kcmVmcy51c2VyVGFza1JlY2VpdmVyRGlhbG9nLiRyZWZzLnVzZXJUYXNrUmVjZWl2ZXJEaWFsb2dXcmFwKTtcbiAgICB1c2VyVGFza1JlY2VpdmVyRGlhbG9nT3V0ZXJWdWUgPSBudWxsO1xuICAgICQoXCIjdXNlclRhc2tSZWNlaXZlckRpYWxvZ091dGVyXCIpLnJlbW92ZSgpO1xuICAgIERpYWxvZ1V0aWxpdHkuUmVtb3ZlRGlhbG9nUmVtYWluaW5nRWxlbShcInVzZXJUYXNrUmVjZWl2ZXJEaWFsb2dJbm5lclwiKTtcbiAgfVxufTtcblZ1ZS5jb21wb25lbnQoXCJ1c2VyLXRhc2stcmVjZWl2ZXItZGlhbG9nXCIsIHtcbiAgZGF0YTogZnVuY3Rpb24gZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYWNJbnRlcmZhY2U6IHt9LFxuICAgICAgbmV4dEZsb3dOb2RlRW50aXRpZXM6IFtdLFxuICAgICAgcmVjZWl2ZXJUcmVlOiB7XG4gICAgICAgIHRyZWVTZXR0aW5nOiB7XG4gICAgICAgICAgdmlldzoge1xuICAgICAgICAgICAgZGJsQ2xpY2tFeHBhbmQ6IGZhbHNlLFxuICAgICAgICAgICAgc2hvd0xpbmU6IHRydWUsXG4gICAgICAgICAgICBmb250Q3NzOiB7XG4gICAgICAgICAgICAgICdjb2xvcic6ICdibGFjaycsXG4gICAgICAgICAgICAgICdmb250LXdlaWdodCc6ICdub3JtYWwnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjaGVjazoge1xuICAgICAgICAgICAgZW5hYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIG5vY2hlY2tJbmhlcml0OiBmYWxzZSxcbiAgICAgICAgICAgIHJhZGlvVHlwZTogXCJhbGxcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgYXN5bmM6IHtcbiAgICAgICAgICAgIGVuYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiLFxuICAgICAgICAgICAgdXJsOiBCYXNlVXRpbGl0eS5CdWlsZEFjdGlvbihcIi9SZXN0L1dvcmtmbG93L1J1blRpbWUvQ2xpZW50L1JlY2VpdmVyUnVudGltZS9HZXRBc3luY1JlY2VpdmVyc1wiKSxcbiAgICAgICAgICAgIGF1dG9QYXJhbTogW1wiaWRcIiwgXCJ0eXBlTmFtZVwiLCBcIm5hbWVcIl1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGtleToge1xuICAgICAgICAgICAgICBuYW1lOiBcIm5hbWVcIixcbiAgICAgICAgICAgICAgY2hpbGRyZW46IFwicnVudGltZVJlY2VpdmVVc2Vyc1wiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2ltcGxlRGF0YToge1xuICAgICAgICAgICAgICBlbmFibGU6IHRydWUsXG4gICAgICAgICAgICAgIGlkS2V5OiBcImlkXCIsXG4gICAgICAgICAgICAgIHBJZEtleTogXCJwYXJlbnRJZFwiLFxuICAgICAgICAgICAgICByb290UElkOiBudWxsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjYWxsYmFjazoge1xuICAgICAgICAgICAgb25DbGljazogZnVuY3Rpb24gb25DbGljayhldmVudCwgdHJlZUlkLCB0cmVlTm9kZSkge30sXG4gICAgICAgICAgICBvbkRibENsaWNrOiBmdW5jdGlvbiBvbkRibENsaWNrKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlKSB7XG4gICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXMuZ2V0WlRyZWVPYmoodHJlZUlkKS5faG9zdDtcblxuICAgICAgICAgICAgICB2YXIgZmxvd05vZGVFbnRpdHkgPSB0aGlzLmdldFpUcmVlT2JqKHRyZWVJZCkuZmxvd05vZGVFbnRpdHk7XG4gICAgICAgICAgICAgIHZhciByZWNlaXZlVHlwZSA9IHRoaXMuZ2V0WlRyZWVPYmoodHJlZUlkKS5yZWNlaXZlVHlwZTtcblxuICAgICAgICAgICAgICBfdGhpcy5hZGRSZWNlaXZlclRvU2VsZWN0ZWQodHJlZU5vZGUsIGZsb3dOb2RlRW50aXR5LCByZWNlaXZlVHlwZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYmVmb3JlQXN5bmM6IGZ1bmN0aW9uIGJlZm9yZUFzeW5jKHRyZWVJZCwgdHJlZU5vZGUpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2codHJlZUlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHRyZWVPYmpNYXA6IHt9XG4gICAgICB9LFxuICAgICAgc2VsZWN0ZWRSZWNlaXZlcjoge1xuICAgICAgICBjb2x1bW5zQ29uZmlnOiBbe1xuICAgICAgICAgIHRpdGxlOiAn5bey6YCJ55So5oi3JyxcbiAgICAgICAgICBrZXk6ICduYW1lJyxcbiAgICAgICAgICB3aWR0aDogMTg4LFxuICAgICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0aXRsZTogJ+aTjeS9nCcsXG4gICAgICAgICAgc2xvdDogJ2FjdGlvbicsXG4gICAgICAgICAgd2lkdGg6IDcwLFxuICAgICAgICAgIGFsaWduOiBcImNlbnRlclwiXG4gICAgICAgIH1dLFxuICAgICAgICByZWNlaXZlckRhdGE6IFtdXG4gICAgICB9XG4gICAgfTtcbiAgfSxcbiAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHt9LFxuICBmaWx0ZXJzOiB7XG4gICAgZmlsdGVyUmVjZWl2ZXJEYXRhOiBmdW5jdGlvbiBmaWx0ZXJSZWNlaXZlckRhdGEocmVjZWl2ZXJEYXRhLCBmbG93Tm9kZUVudGl0eSwgcmVjZWl2ZVR5cGUpIHtcbiAgICAgIHJldHVybiByZWNlaXZlckRhdGEuZmlsdGVyKGZ1bmN0aW9uIChyZWNlaXZlcikge1xuICAgICAgICByZXR1cm4gcmVjZWl2ZXIuZmxvd05vZGVFbnRpdHkuaWQgPT0gZmxvd05vZGVFbnRpdHkuaWQgJiYgcmVjZWl2ZXIucmVjZWl2ZVR5cGUgPT0gcmVjZWl2ZVR5cGU7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBiZWdpblNlbGVjdFJlY2VpdmVyOiBmdW5jdGlvbiBiZWdpblNlbGVjdFJlY2VpdmVyKHNlbmRlciwgbmV4dEZsb3dOb2RlRW50aXRpZXMsIHNlbGVjdFJlY2VpdmVyQ29tcGxldGVkRnVuYykge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgdmFyIGVsZW0gPSB0aGlzLiRyZWZzLnVzZXJUYXNrUmVjZWl2ZXJEaWFsb2dXcmFwO1xuICAgICAgRGlhbG9nVXRpbGl0eS5EaWFsb2dFbGVtT2JqKGVsZW0sIHtcbiAgICAgICAgbW9kYWw6IHRydWUsXG4gICAgICAgIHdpZHRoOiA2NTAsXG4gICAgICAgIGhlaWdodDogNjAwLFxuICAgICAgICB0aXRsZTogXCLpgInmi6nmjqXmlLbkurrlkZhcIixcbiAgICAgICAgcmVzaXphYmxlOiBmYWxzZSxcbiAgICAgICAgYnV0dG9uczoge1xuICAgICAgICAgIFwi56Gu6K6kXCI6IGZ1bmN0aW9uIF8oKSB7XG4gICAgICAgICAgICBpZiAoX3RoaXMudmFsaWRhdGVDb21wbGV0ZUVuYWJsZSgpLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgc2VsZWN0UmVjZWl2ZXJDb21wbGV0ZWRGdW5jLmNhbGwoc2VuZGVyLCBfdGhpcy5uZXh0Rmxvd05vZGVFbnRpdGllcywgX3RoaXMuc2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCLlj5bmtohcIjogZnVuY3Rpb24gXygpIHtcbiAgICAgICAgICAgIFVzZXJUYXNrUmVjZWl2ZXJEaWFsb2dVdGlsaXR5LkNsb3NlRGlhbG9nKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBvcGVuOiBmdW5jdGlvbiBvcGVuKGV2ZW50LCB1aSkge1xuICAgICAgICAgICQoXCIudWktZGlhbG9nLXRpdGxlYmFyLWNsb3NlXCIsICQodGhpcykucGFyZW50KCkpLmhpZGUoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLm5leHRGbG93Tm9kZUVudGl0aWVzID0gbmV4dEZsb3dOb2RlRW50aXRpZXM7XG4gICAgICB3aW5kb3cuc2V0VGltZW91dCh0aGlzLmluaXRUcmVlLCA1MDApO1xuICAgIH0sXG4gICAgZ2V0Um9vdE9yZ2FuTWFpblJlY2VpdmVPYmplY3RzOiBmdW5jdGlvbiBnZXRSb290T3JnYW5NYWluUmVjZWl2ZU9iamVjdHMoKSB7XG4gICAgICByZXR1cm4gW3tcbiAgICAgICAgXCJ2YWx1ZVwiOiBudWxsLFxuICAgICAgICBcInRleHRcIjogbnVsbCxcbiAgICAgICAgXCJpZFwiOiBcIjBcIixcbiAgICAgICAgXCJwYXJlbnRJZFwiOiBudWxsLFxuICAgICAgICBcIm91dGVySWRcIjogbnVsbCxcbiAgICAgICAgXCJjb2RlXCI6IFwiMDAwMFwiLFxuICAgICAgICBcImF0dHIxXCI6IG51bGwsXG4gICAgICAgIFwiYXR0cjJcIjogbnVsbCxcbiAgICAgICAgXCJhdHRyM1wiOiBudWxsLFxuICAgICAgICBcImF0dHI0XCI6IG51bGwsXG4gICAgICAgIFwibm9kZVR5cGVOYW1lXCI6IG51bGwsXG4gICAgICAgIFwiaWNvblwiOiBudWxsLFxuICAgICAgICBcIm5vY2hlY2tcIjogZmFsc2UsXG4gICAgICAgIFwiaXNQYXJlbnRcIjogXCJ0cnVlXCIsXG4gICAgICAgIFwib3BlblwiOiBmYWxzZSxcbiAgICAgICAgXCJuYW1lXCI6IFwi57uE57uH5py65p6E566h55CGXCIsXG4gICAgICAgIFwidHlwZU5hbWVcIjogXCJPcmdhbnNcIixcbiAgICAgICAgXCJkZXNjXCI6IG51bGwsXG4gICAgICAgIFwic3RhdHVzXCI6IFwi5ZCv55SoXCIsXG4gICAgICAgIFwiZmlsdGVyXCI6IFwiXCIsXG4gICAgICAgIFwib3JkZXJOdW1cIjogMjIsXG4gICAgICAgIFwicnVudGltZVJlY2VpdmVVc2Vyc1wiOiBudWxsLFxuICAgICAgICBcImdyb3VwXCI6IHRydWUsXG4gICAgICAgIFwiY3VzdE5hbWVcIjogZmFsc2VcbiAgICAgIH1dO1xuICAgIH0sXG4gICAgaW5pdFRyZWU6IGZ1bmN0aW9uIGluaXRUcmVlKCkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm5leHRGbG93Tm9kZUVudGl0aWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBmbG93Tm9kZUVudGl0eSA9IHRoaXMubmV4dEZsb3dOb2RlRW50aXRpZXNbaV07XG5cbiAgICAgICAgaWYgKGZsb3dOb2RlRW50aXR5LmV4dGVuc2lvbkVsZW1lbnRzICYmIGZsb3dOb2RlRW50aXR5LmV4dGVuc2lvbkVsZW1lbnRzLmpiNGRjTWFpblJlY2VpdmVPYmplY3RzICYmIGZsb3dOb2RlRW50aXR5LmV4dGVuc2lvbkVsZW1lbnRzLmpiNGRjTWFpblJlY2VpdmVPYmplY3RzLnJ1bnRpbWVSZWNlaXZlR3JvdXBzKSB7XG4gICAgICAgICAgdmFyIHRyZWVPYmpLZXkgPSB0aGlzLmJ1aWxkVWxUcmVlSWQoZmxvd05vZGVFbnRpdHksIFwibWFpblwiKTtcbiAgICAgICAgICB0aGlzLnJlY2VpdmVyVHJlZS50cmVlT2JqTWFwW3RyZWVPYmpLZXldID0gJC5mbi56VHJlZS5pbml0KCQoXCIjXCIgKyB0cmVlT2JqS2V5KSwgdGhpcy5yZWNlaXZlclRyZWUudHJlZVNldHRpbmcsIGZsb3dOb2RlRW50aXR5LmV4dGVuc2lvbkVsZW1lbnRzLmpiNGRjTWFpblJlY2VpdmVPYmplY3RzLnJ1bnRpbWVSZWNlaXZlR3JvdXBzKTtcbiAgICAgICAgICB0aGlzLnJlY2VpdmVyVHJlZS50cmVlT2JqTWFwW3RyZWVPYmpLZXldLl9ob3N0ID0gdGhpcztcbiAgICAgICAgICB0aGlzLnJlY2VpdmVyVHJlZS50cmVlT2JqTWFwW3RyZWVPYmpLZXldLmZsb3dOb2RlRW50aXR5ID0gZmxvd05vZGVFbnRpdHk7XG4gICAgICAgICAgdGhpcy5yZWNlaXZlclRyZWUudHJlZU9iak1hcFt0cmVlT2JqS2V5XS5yZWNlaXZlVHlwZSA9IFwibWFpblwiO1xuICAgICAgICB9IGVsc2UgaWYgKCFmbG93Tm9kZUVudGl0eS5leHRlbnNpb25FbGVtZW50cyB8fCAhZmxvd05vZGVFbnRpdHkuZXh0ZW5zaW9uRWxlbWVudHMuamI0ZGNNYWluUmVjZWl2ZU9iamVjdHMgfHwgIWZsb3dOb2RlRW50aXR5LmV4dGVuc2lvbkVsZW1lbnRzLmpiNGRjTWFpblJlY2VpdmVPYmplY3RzLmpiNGRjUmVjZWl2ZU9iamVjdExpc3QpIHtcbiAgICAgICAgICB2YXIgX3RyZWVPYmpLZXkgPSB0aGlzLmJ1aWxkVWxUcmVlSWQoZmxvd05vZGVFbnRpdHksIFwibWFpblwiKTtcblxuICAgICAgICAgIHRoaXMucmVjZWl2ZXJUcmVlLnRyZWVPYmpNYXBbX3RyZWVPYmpLZXldID0gJC5mbi56VHJlZS5pbml0KCQoXCIjXCIgKyBfdHJlZU9iaktleSksIHRoaXMucmVjZWl2ZXJUcmVlLnRyZWVTZXR0aW5nLCB0aGlzLmdldFJvb3RPcmdhbk1haW5SZWNlaXZlT2JqZWN0cygpKTtcbiAgICAgICAgICB0aGlzLnJlY2VpdmVyVHJlZS50cmVlT2JqTWFwW190cmVlT2JqS2V5XS5faG9zdCA9IHRoaXM7XG4gICAgICAgICAgdGhpcy5yZWNlaXZlclRyZWUudHJlZU9iak1hcFtfdHJlZU9iaktleV0uZmxvd05vZGVFbnRpdHkgPSBmbG93Tm9kZUVudGl0eTtcbiAgICAgICAgICB0aGlzLnJlY2VpdmVyVHJlZS50cmVlT2JqTWFwW190cmVlT2JqS2V5XS5yZWNlaXZlVHlwZSA9IFwibWFpblwiO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZsb3dOb2RlRW50aXR5LmV4dGVuc2lvbkVsZW1lbnRzICYmIGZsb3dOb2RlRW50aXR5LmV4dGVuc2lvbkVsZW1lbnRzLmpiNGRjQ0NSZWNlaXZlT2JqZWN0cyAmJiBmbG93Tm9kZUVudGl0eS5leHRlbnNpb25FbGVtZW50cy5qYjRkY0NDUmVjZWl2ZU9iamVjdHMucnVudGltZVJlY2VpdmVHcm91cHMpIHtcbiAgICAgICAgICB2YXIgX3RyZWVPYmpLZXkyID0gdGhpcy5idWlsZFVsVHJlZUlkKGZsb3dOb2RlRW50aXR5LCBcImNjXCIpO1xuXG4gICAgICAgICAgdGhpcy5yZWNlaXZlclRyZWUudHJlZU9iak1hcFtfdHJlZU9iaktleTJdID0gJC5mbi56VHJlZS5pbml0KCQoXCIjXCIgKyBfdHJlZU9iaktleTIpLCB0aGlzLnJlY2VpdmVyVHJlZS50cmVlU2V0dGluZywgZmxvd05vZGVFbnRpdHkuZXh0ZW5zaW9uRWxlbWVudHMuamI0ZGNDQ1JlY2VpdmVPYmplY3RzLnJ1bnRpbWVSZWNlaXZlR3JvdXBzKTtcbiAgICAgICAgICB0aGlzLnJlY2VpdmVyVHJlZS50cmVlT2JqTWFwW190cmVlT2JqS2V5Ml0uX2hvc3QgPSB0aGlzO1xuICAgICAgICAgIHRoaXMucmVjZWl2ZXJUcmVlLnRyZWVPYmpNYXBbX3RyZWVPYmpLZXkyXS5mbG93Tm9kZUVudGl0eSA9IGZsb3dOb2RlRW50aXR5O1xuICAgICAgICAgIHRoaXMucmVjZWl2ZXJUcmVlLnRyZWVPYmpNYXBbX3RyZWVPYmpLZXkyXS5yZWNlaXZlVHlwZSA9IFwiY2NcIjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgYnVpbGRVbFRyZWVJZDogZnVuY3Rpb24gYnVpbGRVbFRyZWVJZChmbG93Tm9kZUVudGl0eSwgcmVjZWl2ZVR5cGUpIHtcbiAgICAgIHJldHVybiAndWxUcmVlXycgKyByZWNlaXZlVHlwZSArIFwiX1wiICsgZmxvd05vZGVFbnRpdHkuaWQ7XG4gICAgfSxcbiAgICBhZGRUcmVlU2VsZWN0ZWRSZWNlaXZlclRvU2VsZWN0ZWQ6IGZ1bmN0aW9uIGFkZFRyZWVTZWxlY3RlZFJlY2VpdmVyVG9TZWxlY3RlZChmbG93Tm9kZUVudGl0eSwgcmVjZWl2ZVR5cGUpIHtcbiAgICAgIHZhciB0cmVlS2V5ID0gdGhpcy5idWlsZFVsVHJlZUlkKGZsb3dOb2RlRW50aXR5LCByZWNlaXZlVHlwZSk7XG4gICAgICB2YXIgdHJlZU9iamVjdCA9IHRoaXMucmVjZWl2ZXJUcmVlLnRyZWVPYmpNYXBbdHJlZUtleV07XG5cbiAgICAgIGlmICh0cmVlT2JqZWN0KSB7XG4gICAgICAgIHZhciBzZWxlY3ROb2RlcyA9IHRyZWVPYmplY3QuZ2V0U2VsZWN0ZWROb2RlcygpO1xuXG4gICAgICAgIGlmIChzZWxlY3ROb2RlcyAmJiBzZWxlY3ROb2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgdGhpcy5hZGRSZWNlaXZlclRvU2VsZWN0ZWQoc2VsZWN0Tm9kZXNbMF0sIGZsb3dOb2RlRW50aXR5LCByZWNlaXZlVHlwZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGFkZFJlY2VpdmVyVG9TZWxlY3RlZDogZnVuY3Rpb24gYWRkUmVjZWl2ZXJUb1NlbGVjdGVkKHNlbGVjdE5vZGUsIGZsb3dOb2RlRW50aXR5LCByZWNlaXZlVHlwZSkge1xuICAgICAgdmFyIGlzTXVsdGlJbnN0YW5jZVRhc2sgPSB0aGlzLmlzTXVsdGlJbnN0YW5jZVRhc2soZmxvd05vZGVFbnRpdHkpO1xuICAgICAgdmFyIGlubmVyU2luZ2xlSWQgPSBmbG93Tm9kZUVudGl0eS5pZCArIFwiX1wiICsgcmVjZWl2ZVR5cGUgKyBcIl9cIiArIHNlbGVjdE5vZGUuaWQ7XG5cbiAgICAgIGlmIChzZWxlY3ROb2RlLnR5cGVOYW1lID09IFwiU2luZ2xlVXNlclwiKSB7XG4gICAgICAgIHNlbGVjdE5vZGUuaW5uZXJTaW5nbGVJZCA9IGlubmVyU2luZ2xlSWQ7XG4gICAgICAgIHNlbGVjdE5vZGUuZmxvd05vZGVFbnRpdHkgPSBmbG93Tm9kZUVudGl0eTtcbiAgICAgICAgc2VsZWN0Tm9kZS5yZWNlaXZlVHlwZSA9IHJlY2VpdmVUeXBlO1xuXG4gICAgICAgIGlmICgocmVjZWl2ZVR5cGUgPT0gXCJjY1wiIHx8IGlzTXVsdGlJbnN0YW5jZVRhc2spICYmICFBcnJheVV0aWxpdHkuRXhpc3QodGhpcy5zZWxlY3RlZFJlY2VpdmVyLnJlY2VpdmVyRGF0YSwgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICByZXR1cm4gaXRlbS5pbm5lclNpbmdsZUlkID09IGlubmVyU2luZ2xlSWQ7XG4gICAgICAgIH0pKSB7XG4gICAgICAgICAgdGhpcy5zZWxlY3RlZFJlY2VpdmVyLnJlY2VpdmVyRGF0YS5wdXNoKHNlbGVjdE5vZGUpO1xuICAgICAgICB9IGVsc2UgaWYgKHJlY2VpdmVUeXBlID09IFwibWFpblwiICYmICFpc011bHRpSW5zdGFuY2VUYXNrKSB7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnNlbGVjdGVkUmVjZWl2ZXIucmVjZWl2ZXJEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZFJlY2VpdmVyLnJlY2VpdmVyRGF0YVtpXS5mbG93Tm9kZUVudGl0eS5pZCA9PSBmbG93Tm9kZUVudGl0eS5pZCAmJiB0aGlzLnNlbGVjdGVkUmVjZWl2ZXIucmVjZWl2ZXJEYXRhW2ldLnJlY2VpdmVUeXBlID09IHJlY2VpdmVUeXBlKSB7XG4gICAgICAgICAgICAgIEFycmF5VXRpbGl0eS5EZWxldGUodGhpcy5zZWxlY3RlZFJlY2VpdmVyLnJlY2VpdmVyRGF0YSwgaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5zZWxlY3RlZFJlY2VpdmVyLnJlY2VpdmVyRGF0YS5wdXNoKHNlbGVjdE5vZGUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGlzTXVsdGlJbnN0YW5jZVRhc2sgJiYgKHNlbGVjdE5vZGUudHlwZU5hbWUgPT0gXCJVc2Vyc1wiIHx8IHNlbGVjdE5vZGUudHlwZU5hbWUgPT0gXCJSb2xlXCIgfHwgc2VsZWN0Tm9kZS50eXBlTmFtZSA9PSBcIk9yZ2Fuc1wiKSkge1xuICAgICAgICBpZiAoc2VsZWN0Tm9kZS5ydW50aW1lUmVjZWl2ZVVzZXJzICE9IG51bGwgJiYgc2VsZWN0Tm9kZS5ydW50aW1lUmVjZWl2ZVVzZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgc2VsZWN0Tm9kZS5ydW50aW1lUmVjZWl2ZVVzZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdmFyIGNoaWxkTm9kZSA9IHNlbGVjdE5vZGUucnVudGltZVJlY2VpdmVVc2Vyc1tfaV07XG5cbiAgICAgICAgICAgIGlmIChjaGlsZE5vZGUudHlwZU5hbWUgPT0gXCJTaW5nbGVVc2VyXCIpIHtcbiAgICAgICAgICAgICAgdGhpcy5hZGRSZWNlaXZlclRvU2VsZWN0ZWQoY2hpbGROb2RlLCBmbG93Tm9kZUVudGl0eSwgcmVjZWl2ZVR5cGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgY2xlYXJTZWxlY3RlZFJlY2VpdmVyVG9TZWxlY3RlZDogZnVuY3Rpb24gY2xlYXJTZWxlY3RlZFJlY2VpdmVyVG9TZWxlY3RlZChmbG93Tm9kZUVudGl0eSwgcmVjZWl2ZVR5cGUpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnNlbGVjdGVkUmVjZWl2ZXIucmVjZWl2ZXJEYXRhLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIHZhciByZWNlaXZlciA9IHRoaXMuc2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGFbaV07XG5cbiAgICAgICAgaWYgKHJlY2VpdmVyLmZsb3dOb2RlRW50aXR5LmlkID09IGZsb3dOb2RlRW50aXR5LmlkICYmIHJlY2VpdmVyLnJlY2VpdmVUeXBlID09IHJlY2VpdmVUeXBlKSB7XG4gICAgICAgICAgQXJyYXlVdGlsaXR5LkRlbGV0ZSh0aGlzLnNlbGVjdGVkUmVjZWl2ZXIucmVjZWl2ZXJEYXRhLCBpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgZGVsZXRlU2VsZWN0ZWRSZWNlaXZlcjogZnVuY3Rpb24gZGVsZXRlU2VsZWN0ZWRSZWNlaXZlcihpbmRleCwgcm93KSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGFbaV0uaW5uZXJTaW5nbGVJZCA9PSByb3cuaW5uZXJTaW5nbGVJZCkge1xuICAgICAgICAgIEFycmF5VXRpbGl0eS5EZWxldGUodGhpcy5zZWxlY3RlZFJlY2VpdmVyLnJlY2VpdmVyRGF0YSwgaSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGlzTXVsdGlJbnN0YW5jZVRhc2s6IGZ1bmN0aW9uIGlzTXVsdGlJbnN0YW5jZVRhc2soZmxvd05vZGVFbnRpdHkpIHtcbiAgICAgIHJldHVybiBmbG93Tm9kZUVudGl0eS5tdWx0aUluc3RhbmNlVGFzaztcbiAgICB9LFxuICAgIGJ1aWxkVGFiTGFiZWw6IGZ1bmN0aW9uIGJ1aWxkVGFiTGFiZWwoZmxvd05vZGVFbnRpdHkpIHtcbiAgICAgIHJldHVybiBmbG93Tm9kZUVudGl0eS5uYW1lICsgXCIgW1wiICsgKHRoaXMuaXNNdWx0aUluc3RhbmNlVGFzayhmbG93Tm9kZUVudGl0eSkgPyBcIuWkmuS6ulwiIDogXCLljZXkurpcIikgKyBcIl1cIjtcbiAgICB9LFxuICAgIHZhbGlkYXRlQ29tcGxldGVFbmFibGU6IGZ1bmN0aW9uIHZhbGlkYXRlQ29tcGxldGVFbmFibGUoKSB7XG4gICAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgICAgdmFyIGVycm9yTWVzc2FnZXMgPSBbXTtcbiAgICAgIHZhciBzdWNjZXNzID0gdHJ1ZTtcblxuICAgICAgdmFyIF9sb29wID0gZnVuY3Rpb24gX2xvb3AoaSkge1xuICAgICAgICBpZiAoX3RoaXMyLm5leHRGbG93Tm9kZUVudGl0aWVzW2ldLnRhc2tUeXBlTmFtZSA9PSBcImNvbS5qYjRkYy53b3JrZmxvdy5wby5icG1uLnByb2Nlc3MuQnBtblVzZXJUYXNrXCIpIHtcbiAgICAgICAgICBpZiAoIUFycmF5VXRpbGl0eS5FeGlzdChfdGhpczIuc2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGEsIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlbS5mbG93Tm9kZUVudGl0eS5pZCA9PSBfdGhpczIubmV4dEZsb3dOb2RlRW50aXRpZXNbaV0uaWQgJiYgaXRlbS5yZWNlaXZlVHlwZSA9PSBcIm1haW5cIjtcbiAgICAgICAgICB9KSkge1xuICAgICAgICAgICAgZXJyb3JNZXNzYWdlcy5wdXNoKHtcbiAgICAgICAgICAgICAgdGFza05hbWU6IF90aGlzMi5uZXh0Rmxvd05vZGVFbnRpdGllc1tpXS5uYW1lLFxuICAgICAgICAgICAgICBmbG93Tm9kZUVudGl0eTogX3RoaXMyLm5leHRGbG93Tm9kZUVudGl0aWVzW2ldLFxuICAgICAgICAgICAgICBtZXNzYWdlOiBcIueOr+iKgltcIiArIF90aGlzMi5uZXh0Rmxvd05vZGVFbnRpdGllc1tpXS5uYW1lICsgXCJd6Iez5bCR6ZyA6KaB6K6+572u5LiA5Liq5o6l5pS255So5oi3IVwiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5uZXh0Rmxvd05vZGVFbnRpdGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBfbG9vcChpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGVycm9yTWVzc2FnZXMubGVuZ3RoID4gMCkge1xuICAgICAgICB2YXIgZXJyb3JUZXh0QXJ5ID0gW107XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlcnJvck1lc3NhZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgZXJyb3JUZXh0QXJ5LnB1c2goZXJyb3JNZXNzYWdlc1tpXS5tZXNzYWdlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KGVycm9yVGV4dEFyeS5qb2luKFwiPGJyIC8+XCIpLCB0aGlzKTtcbiAgICAgICAgc3VjY2VzcyA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBzdWNjZXNzOiBzdWNjZXNzXG4gICAgICB9O1xuICAgIH1cbiAgfSxcbiAgdGVtcGxhdGU6IFwiPGRpdiBpZD1cXFwidXNlclRhc2tSZWNlaXZlckRpYWxvZ0lubmVyXFxcIiByZWY9XFxcInVzZXJUYXNrUmVjZWl2ZXJEaWFsb2dXcmFwXFxcIiBzdHlsZT1cXFwiZGlzcGxheTogbm9uZVxcXCI+XFxuICAgICAgICAgICAgICAgIDx0YWJzIG5hbWU9XFxcInVzZXJUYXNrUmVjZWl2ZXJEaWFsb2dUYWJzXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDx0YWItcGFuZSA6bGFiZWw9XFxcImJ1aWxkVGFiTGFiZWwoZmxvd05vZGVFbnRpdHkpXFxcIiB0YWI9XFxcInVzZXJUYXNrUmVjZWl2ZXJEaWFsb2dUYWJzXFxcIiB2LWZvcj1cXFwiZmxvd05vZGVFbnRpdHkgaW4gbmV4dEZsb3dOb2RlRW50aXRpZXNcXFwiIDprZXk9XFxcImZsb3dOb2RlRW50aXR5LmlkXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8Y29sbGFwc2UgYWNjb3JkaW9uIHZhbHVlPVxcXCJtYWluUmVjZWl2ZXJcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGFuZWwgbmFtZT1cXFwibWFpblJlY2VpdmVyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdTRFM0JcXHU5MDAxXFx1NEVCQVxcdTU0NThcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc2xvdD1cXFwiY29udGVudFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwidXNlci10YXNrLXJlY2VpdmVyLWRpYWxvZy1vdXRlci13cmFwXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic2VsZWN0RW5hYmxlVXNlckxpc3RcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVsIDppZD1cXFwiYnVpbGRVbFRyZWVJZChmbG93Tm9kZUVudGl0eSwnbWFpbicpXFxcIiBjbGFzcz1cXFwienRyZWVcXFwiIHN0eWxlPVxcXCJ3aWR0aDogMjAwcHhcXFwiPjwvdWw+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJzZWxlY3RPcEJ1dHRvbkNvbnRhaW5lclxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJzaW5nbGUtb3AtYnV0dG9uXFxcIiB0aXRsZT1cXFwiXFx1NkRGQlxcdTUyQTBcXHU0RUJBXFx1NTQ1OFxcXCIgQGNsaWNrPVxcXCJhZGRUcmVlU2VsZWN0ZWRSZWNlaXZlclRvU2VsZWN0ZWQoZmxvd05vZGVFbnRpdHksJ21haW4nKVxcXCI+PEljb24gdHlwZT1cXFwibWQtYXJyb3ctcm91bmQtZm9yd2FyZFxcXCIgLz48L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNpbmdsZS1vcC1idXR0b25cXFwiIHRpdGxlPVxcXCJcXHU2RTA1XFx1N0E3QVxcdTVERjJcXHU5MDA5XFx1NEVCQVxcdTU0NThcXFwiIEBjbGljaz1cXFwiY2xlYXJTZWxlY3RlZFJlY2VpdmVyVG9TZWxlY3RlZChmbG93Tm9kZUVudGl0eSwnbWFpbicpXFxcIj48SWNvbiB0eXBlPVxcXCJtZC1iYWNrc3BhY2VcXFwiIC8+PC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJzZWxlY3RlZFVzZXJMaXN0XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLXRhYmxlIGhlaWdodD1cXFwiMzI3XFxcIiB3aWR0aD1cXFwiMjYwXFxcIiBzdHJpcGUgOmNvbHVtbnM9XFxcInNlbGVjdGVkUmVjZWl2ZXIuY29sdW1uc0NvbmZpZ1xcXCIgOmRhdGE9XFxcInNlbGVjdGVkUmVjZWl2ZXIucmVjZWl2ZXJEYXRhIHwgZmlsdGVyUmVjZWl2ZXJEYXRhKGZsb3dOb2RlRW50aXR5LCAnbWFpbicpXFxcIlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cXFwiaXYtbGlzdC10YWJsZVxcXCIgc2l6ZT1cXFwic21hbGxcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGVtcGxhdGUgc2xvdC1zY29wZT1cXFwieyByb3csIGluZGV4IH1cXFwiIHNsb3Q9XFxcImFjdGlvblxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImxpc3QtZm9udC1pY29uLWJ1dHRvbi1jbGFzc1xcXCIgQGNsaWNrPVxcXCJkZWxldGVTZWxlY3RlZFJlY2VpdmVyKGluZGV4LHJvdylcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEljb24gdHlwZT1cXFwibWQtY2xvc2VcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGVtcGxhdGU+ICAgICBcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaS10YWJsZT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9wYW5lbD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhbmVsIG5hbWU9XFxcImNjUmVjZWl2ZXJcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFx1NjI4NFxcdTkwMDFcXHU0RUJBXFx1NTQ1OFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzbG90PVxcXCJjb250ZW50XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJ1c2VyLXRhc2stcmVjZWl2ZXItZGlhbG9nLW91dGVyLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJzZWxlY3RFbmFibGVVc2VyTGlzdFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dWwgOmlkPVxcXCJidWlsZFVsVHJlZUlkKGZsb3dOb2RlRW50aXR5LCdjYycpXFxcIiBjbGFzcz1cXFwienRyZWVcXFwiIHN0eWxlPVxcXCJ3aWR0aDogMjAwcHhcXFwiPjwvdWw+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJzZWxlY3RPcEJ1dHRvbkNvbnRhaW5lclxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJzaW5nbGUtb3AtYnV0dG9uXFxcIiB0aXRsZT1cXFwiXFx1NkRGQlxcdTUyQTBcXHU0RUJBXFx1NTQ1OFxcXCIgQGNsaWNrPVxcXCJhZGRSZWNlaXZlclRvU2VsZWN0ZWQoZmxvd05vZGVFbnRpdHksJ2NjJylcXFwiPjxJY29uIHR5cGU9XFxcIm1kLWFycm93LXJvdW5kLWZvcndhcmRcXFwiIC8+PC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJzaW5nbGUtb3AtYnV0dG9uXFxcIiB0aXRsZT1cXFwiXFx1NkUwNVxcdTdBN0FcXHU1REYyXFx1OTAwOVxcdTRFQkFcXHU1NDU4XFxcIj48SWNvbiB0eXBlPVxcXCJtZC1iYWNrc3BhY2VcXFwiIC8+PC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJzZWxlY3RlZFVzZXJMaXN0XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpLXRhYmxlIGhlaWdodD1cXFwiMzI3XFxcIiB3aWR0aD1cXFwiMjYwXFxcIiBzdHJpcGUgOmNvbHVtbnM9XFxcInNlbGVjdGVkUmVjZWl2ZXIuY29sdW1uc0NvbmZpZ1xcXCIgOmRhdGE9XFxcInNlbGVjdGVkUmVjZWl2ZXIucmVjZWl2ZXJEYXRhIHwgZmlsdGVyUmVjZWl2ZXJEYXRhKGZsb3dOb2RlRW50aXR5LCAnY2MnKVxcXCJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XFxcIml2LWxpc3QtdGFibGVcXFwiIHNpemU9XFxcInNtYWxsXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRlbXBsYXRlIHNsb3Qtc2NvcGU9XFxcInsgcm93LCBpbmRleCB9XFxcIiBzbG90PVxcXCJhY3Rpb25cXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJsaXN0LWZvbnQtaWNvbi1idXR0b24tY2xhc3NcXFwiIEBjbGljaz1cXFwiZGVsZXRlU2VsZWN0ZWRSZWNlaXZlcihpbmRleCxyb3cpXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxJY29uIHR5cGU9XFxcIm1kLWNsb3NlXFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RlbXBsYXRlPiAgICAgXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2ktdGFibGU+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvcGFuZWw+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9jb2xsYXBzZT5cXG4gICAgICAgICAgICAgICAgICAgIDwvdGFiLXBhbmU+XFxuICAgICAgICAgICAgICAgIDwvdGFicz5cXG4gICAgICAgICAgICA8L2Rpdj5cIlxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBEb2N1bWVudENvbnRlbnRVcGxvYWRDb252ZXJ0VG9QREZQbHVnaW4gPSB7XG4gIG9uY2hhbmdlRmlsZTogZnVuY3Rpb24gb25jaGFuZ2VGaWxlKHNlbmRlcikge1xuICAgICQoXCIjZG9jLXNlbGVjdGVkLWZpbGVcIikuaHRtbCgkKHNlbmRlcikudmFsKCkpO1xuICB9LFxuICB1cGxvYWRBbmRDb252ZXJ0VG9QREY6IGZ1bmN0aW9uIHVwbG9hZEFuZENvbnZlcnRUb1BERihzZW5kZXIsIGluc3RhbmNlSWQsIGJ1c2luZXNzS2V5KSB7XG4gICAgaWYgKCEkKFwiI3NvdXJjZUZpbGVcIikudmFsKCkpIHtcbiAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KFwi6K+36YCJ5oup6KaB5LiK5Lyg55qE5paH5Lu2IVwiLCB0aGlzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgICBmb3JtRGF0YS5hcHBlbmQoXCJmaWxlXCIsIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzb3VyY2VGaWxlJykuZmlsZXNbMF0pO1xuICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgeGhyLm9wZW4oJ1BPU1QnLCBCYXNlVXRpbGl0eS5CdWlsZEFjdGlvbihcIi9SZXN0L1dvcmtmbG93L1J1blRpbWUvQ2xpZW50L0RvY3VtZW50RmlsZVJ1bnRpbWUvVXBsb2FkRmlsZUFuZENvbnZlcnRUb1BERj9pbnN0YW5jZUlkPVwiICsgaW5zdGFuY2VJZCArIFwiJmJ1c2luZXNzS2V5PVwiICsgYnVzaW5lc3NLZXkpKTtcblxuICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coeGhyKTtcblxuICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgdmFyIHJlc3VsdCA9IEpzb25VdGlsaXR5LlN0cmluZ1RvSnNvbih4aHIucmVzcG9uc2UpO1xuICAgICAgICAgIERvY3VtZW50Q29udGVudFVwbG9hZENvbnZlcnRUb1BERlBsdWdpbi5sb2FkUERGRmlsZVRvVmlld2VyKHJlc3VsdC5kYXRhLmZpbGVJZCk7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5DbG9zZUJ5RWxlbUlkKERpYWxvZ1V0aWxpdHkuRGlhbG9nTG9hZGluZ0lkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChcIuaJp+ihjOWHuumUmSFcIiArIHhoci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQ2xvc2VCeUVsZW1JZChEaWFsb2dVdGlsaXR5LkRpYWxvZ0xvYWRpbmdJZCk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHhoci51cGxvYWQub25wcm9ncmVzcyA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBpZiAoZXZlbnQubGVuZ3RoQ29tcHV0YWJsZSkge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRMb2FkaW5nKHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dMb2FkaW5nSWQsIHt9LCBcIlwiKTtcbiAgICAgICAgICB2YXIgcGVyY2VudCA9IE1hdGguZmxvb3IoZXZlbnQubG9hZGVkIC8gZXZlbnQudG90YWwgKiAxMDApO1xuICAgICAgICAgICQoXCIjdXBsb2FkLXByb2Nlc3NcIikuaHRtbChwZXJjZW50ICsgXCIlXCIpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICB4aHIuc2VuZChmb3JtRGF0YSk7XG4gICAgfVxuICB9LFxuICB0cnlMb2FkSGlzdG9yeURvY3VtZW50OiBmdW5jdGlvbiB0cnlMb2FkSGlzdG9yeURvY3VtZW50KHByb3BDb25maWcpIHtcbiAgICBBamF4VXRpbGl0eS5HZXQoXCIvUmVzdC9Xb3JrZmxvdy9SdW5UaW1lL0NsaWVudC9Eb2N1bWVudEZpbGVSdW50aW1lL1RyeUdldExhc3RPbmxpbmVEb2N1bWVudFwiLCB7XG4gICAgICBpbnN0YW5jZUlkOiBwcm9wQ29uZmlnLkluc3RhbmNlSWRcbiAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MgJiYgcmVzdWx0LmRhdGEpIHtcbiAgICAgICAgdGhpcy5sb2FkUERGRmlsZVRvVmlld2VyKHJlc3VsdC5kYXRhLmZpbGVJZCk7XG4gICAgICB9XG4gICAgfSwgdGhpcyk7XG4gIH0sXG4gIGxvYWRQREZGaWxlVG9WaWV3ZXI6IGZ1bmN0aW9uIGxvYWRQREZGaWxlVG9WaWV3ZXIoZmlsZUlkKSB7XG4gICAgdmFyIGZpbGVVcmwgPSBCYXNlVXRpbGl0eS5HZXRSb290UGF0aCgpICsgXCIvUmVzdC9Xb3JrZmxvdy9SdW5UaW1lL0NsaWVudC9Eb2N1bWVudEZpbGVSdW50aW1lL0Rvd25Mb2FkUGRmRG9jdW1lbnRCeUZpbGVJZD9maWxlSWQ9XCIgKyBmaWxlSWQ7XG4gICAgJChcIiNwZGZWaWV3ZXJcIikuYXR0cihcInNyY1wiLCBcIi9Kcy9FeHRlcm5hbC9QREZKUy0yLjkuMzU5LWRpc3Qvd2ViL3ZpZXdlci5odG1sP2ZpbGU9XCIgKyBlbmNvZGVVUklDb21wb25lbnQoZmlsZVVybCkpO1xuICB9LFxuICBHZXRIdG1sRWxlbTogZnVuY3Rpb24gR2V0SHRtbEVsZW0ocHJvcENvbmZpZykge1xuICAgIHZhciBpbnN0YW5jZUlkID0gcHJvcENvbmZpZy5JbnN0YW5jZUlkO1xuICAgIHZhciBidXNpbmVzc0tleSA9IHByb3BDb25maWcuUmVjb3JkSWQ7XG4gICAgdGhpcy50cnlMb2FkSGlzdG9yeURvY3VtZW50KHByb3BDb25maWcpO1xuICAgIHJldHVybiBcIjxkaXYgY2xhc3M9XFxcImRvY3VtZW50LW91dGVyLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiZG9jdW1lbnQtYnV0dG9ucy1vdXRlclxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiZG9jdW1lbnQtYnV0dG9ucy1pbm5lclxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwidXBsb2FkLWFuZC1jb252ZXJ0LWJ1dHRvblxcXCIgZGlzYWJsZWQ+XFx1NEUwQlxcdThGN0RQREZcXHU2NTg3XFx1NEVGNjwvYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcInVwbG9hZC1hbmQtY29udmVydC1idXR0b25cXFwiIGRpc2FibGVkPlxcdTRFMEJcXHU4RjdEXFx1NTM5RlxcdTU5Q0JcXHU2NTg3XFx1NEVGNjwvYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcInVwbG9hZC1hbmQtY29udmVydC1idXR0b25cXFwiIG9uY2xpY2s9XFxcIkRvY3VtZW50Q29udGVudFVwbG9hZENvbnZlcnRUb1BERlBsdWdpbi51cGxvYWRBbmRDb252ZXJ0VG9QREYodGhpcywnXCIuY29uY2F0KGluc3RhbmNlSWQsIFwiJywnXCIpLmNvbmNhdChidXNpbmVzc0tleSwgXCInKVxcXCI+XFx1NEUwQVxcdTRGMjBcXHU1RTc2XFx1OEY2Q1xcdTYzNjJcXHU0RTNBcGRmPC9idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImZpbGUtdXBsb2FkXFxcIj5cXHU5MDA5XFx1NjJFOVxcdTY1ODdcXHU0RUY2XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9XFxcInNvdXJjZUZpbGVcXFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVxcXCJmaWxlXFxcIlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZT1cXFwiaW5wdXRGaWxlXFxcIiBhY2NlcHQ9XFxcIi5kb2MsLmRvY3gsLnBkZlxcXCIgb25jaGFuZ2U9XFxcIkRvY3VtZW50Q29udGVudFVwbG9hZENvbnZlcnRUb1BERlBsdWdpbi5vbmNoYW5nZUZpbGUodGhpcylcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJzZWxlY3RlZC1maWxlLW1lc3NhZ2VcXFwiPlxcdTVERjJcXHU5MDA5XFx1NjU4N1xcdTRFRjY6PHNwYW4gaWQ9XFxcImRvYy1zZWxlY3RlZC1maWxlXFxcIj48L3NwYW4+PC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInVwbG9hZC1wcm9jZXNzXFxcIiBpZD1cXFwidXBsb2FkLXByb2Nlc3NcXFwiPjwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkb2N1bWVudC1jb250ZW50XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8aWZyYW1lIGlkPVxcXCJwZGZWaWV3ZXJcXFwiIHNyYz1cXFwiXFxcIiBzdHlsZT1cXFwid2lkdGg6IDEwMCU7aGVpZ2h0OiAxMDAlO2JvcmRlcjogMHB4XFxcIj48L2lmcmFtZT5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cIik7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBGbG93RmlsZXNMaXN0U2luZ2xlUGx1Z2luID0ge1xuICBfcHJvcDoge30sXG4gIF9mbG93SW5zdGFuY2VSdW50aW1lUE86IG51bGwsXG4gIF9jdXJyZW50Tm9kZTogbnVsbCxcbiAgX2F1dGhvcml0aWVzRmlsZUF1dGhvcml0eTogbnVsbCxcbiAgX2F1dGhvcml0aWVzT25seVNlbmRCYWNrQ2FuRWRpdDogXCJmYWxzZVwiLFxuICBHZXRIdG1sRWxlbTogZnVuY3Rpb24gR2V0SHRtbEVsZW0ocHJvcENvbmZpZykge1xuICAgIEZsb3dGaWxlc0xpc3RTaW5nbGVQbHVnaW4uX3Byb3AgPSBwcm9wQ29uZmlnO1xuICAgIEZsb3dGaWxlc0xpc3RTaW5nbGVQbHVnaW4uX2Zsb3dJbnN0YW5jZVJ1bnRpbWVQTyA9IHByb3BDb25maWcuRmxvd0luc3RhbmNlUnVudGltZVBPO1xuICAgIEZsb3dGaWxlc0xpc3RTaW5nbGVQbHVnaW4uX2N1cnJlbnROb2RlID0gQXJyYXlVdGlsaXR5LldoZXJlKEZsb3dGaWxlc0xpc3RTaW5nbGVQbHVnaW4uX2Zsb3dJbnN0YW5jZVJ1bnRpbWVQTy5icG1uRGVmaW5pdGlvbnMuYnBtblByb2Nlc3MudXNlclRhc2tMaXN0LCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgcmV0dXJuIGl0ZW0uaWQgPT0gRmxvd0ZpbGVzTGlzdFNpbmdsZVBsdWdpbi5fZmxvd0luc3RhbmNlUnVudGltZVBPLmN1cnJlbnROb2RlS2V5O1xuICAgIH0pO1xuXG4gICAgaWYgKEZsb3dGaWxlc0xpc3RTaW5nbGVQbHVnaW4uX2N1cnJlbnROb2RlLmxlbmd0aCA9PSAwKSB7XG4gICAgICBGbG93RmlsZXNMaXN0U2luZ2xlUGx1Z2luLl9jdXJyZW50Tm9kZSA9IEZsb3dGaWxlc0xpc3RTaW5nbGVQbHVnaW4uX2Zsb3dJbnN0YW5jZVJ1bnRpbWVQTy5icG1uRGVmaW5pdGlvbnMuYnBtblByb2Nlc3Muc3RhcnRFdmVudDtcbiAgICB9IGVsc2Uge1xuICAgICAgRmxvd0ZpbGVzTGlzdFNpbmdsZVBsdWdpbi5fY3VycmVudE5vZGUgPSBGbG93RmlsZXNMaXN0U2luZ2xlUGx1Z2luLl9jdXJyZW50Tm9kZVswXTtcbiAgICB9XG5cbiAgICBpZiAoRmxvd0ZpbGVzTGlzdFNpbmdsZVBsdWdpbi5fY3VycmVudE5vZGUuZXh0ZW5zaW9uRWxlbWVudHMpIHtcbiAgICAgIEZsb3dGaWxlc0xpc3RTaW5nbGVQbHVnaW4uX2F1dGhvcml0aWVzRmlsZUF1dGhvcml0eSA9IEpzb25VdGlsaXR5LlN0cmluZ1RvSnNvbihGbG93RmlsZXNMaXN0U2luZ2xlUGx1Z2luLl9jdXJyZW50Tm9kZS5leHRlbnNpb25FbGVtZW50cy5qYjRkY0F1dGhvcml0aWVzLmF1dGhvcml0aWVzRmlsZUF1dGhvcml0eSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIEZsb3dGaWxlc0xpc3RTaW5nbGVQbHVnaW4uX2F1dGhvcml0aWVzRmlsZUF1dGhvcml0eSA9IHtcbiAgICAgICAgYWRkRmlsZTogXCJ0cnVlXCJcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIFwiPGRpdiBpZD1cXFwiRmxvd0ZpbGVzTGlzdFBsdWdpbkNvbnRhaW5lclxcXCI+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlwiO1xuICB9LFxuICBhY0ludGVyZmFjZToge1xuICAgIGdldEZpbGVMaXN0RGF0YTogXCIvUmVzdC9Xb3JrZmxvdy9SdW5UaW1lL0NsaWVudC9JbnN0YW5jZUZpbGVSdW50aW1lL0dldEF0dGFjaG1lbnRGaWxlTGlzdERhdGFcIixcbiAgICB1cGxvYWRGaWxlOiBcIi9SZXN0L1dvcmtmbG93L1J1blRpbWUvQ2xpZW50L0luc3RhbmNlRmlsZVJ1bnRpbWUvVXBsb2FkRmlsZVwiLFxuICAgIGRvd25sb2FkRmlsZTogXCIvUmVzdC9CdWlsZGVyL1J1blRpbWUvRmlsZVJ1bnRpbWUvRG93bkxvYWRGaWxlQnlGaWxlSWRcIixcbiAgICBkZWxldGVGaWxlOiBcIi9SZXN0L0J1aWxkZXIvUnVuVGltZS9GaWxlUnVudGltZS9EZWxldGVGaWxlQnlGaWxlSWRcIlxuICB9LFxuICBSZW5kZXJlcjogZnVuY3Rpb24gUmVuZGVyZXIoKSB7XG4gICAgdGhpcy5CdWlsZFVwbG9hZENvbnRhaW5lcigpO1xuICAgIHRoaXMuQnVpbGRGaWxlTGlzdCgpO1xuICB9LFxuICBUb1ZpZXdTdGF0dXM6IGZ1bmN0aW9uIFRvVmlld1N0YXR1cygkZWxlbSwgZmllbGRQTywgcmVsYXRpb25Gb3JtUmVjb3JkQ29tcGxleFBvLCBfcmVuZGVyZXJEYXRhQ2hhaW5QYXJhcykge1xuICAgICQoXCIjXCIgKyB0aGlzLl9wcm9wLnVwbG9hZFdhcnBJZCkuaGlkZSgpO1xuICAgICQoXCIjXCIgKyB0aGlzLl9wcm9wLmVsZW1JZCkuZmluZChcIi5kZWxldGUtYnV0dG9uLWVsZW1cIikuaGlkZSgpO1xuICAgICQoXCIjXCIgKyB0aGlzLl9wcm9wLmVsZW1JZCkuZmluZChcIi5tb3ZlLXVwLWJ1dHRvbi1lbGVtXCIpLmhpZGUoKTtcbiAgICAkKFwiI1wiICsgdGhpcy5fcHJvcC5lbGVtSWQpLmZpbmQoXCIubW92ZS1kb3duLWJ1dHRvbi1lbGVtXCIpLmhpZGUoKTtcbiAgfSxcbiAgR2V0VGhpc1JlY29yZElkOiBmdW5jdGlvbiBHZXRUaGlzUmVjb3JkSWQoKSB7XG4gICAgdmFyIG9iaklkID0gXCJcIjtcblxuICAgIGlmIChmb3JtUnVudGltZUluc3QgJiYgZm9ybVJ1bnRpbWVJbnN0LkdldFdlYkZvcm1SVFBhcmFzKCkgJiYgZm9ybVJ1bnRpbWVJbnN0LkdldFdlYkZvcm1SVFBhcmFzKCkuUmVjb3JkSWQpIHtcbiAgICAgIG9iaklkID0gZm9ybVJ1bnRpbWVJbnN0LkdldFdlYkZvcm1SVFBhcmFzKCkuUmVjb3JkSWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KFwi5p+l5om+5LiN5Yiw57uR5a6a55qE6K6w5b2VSURcIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iaklkO1xuICB9LFxuICBHZXRUaGlzUmVjb3JkVHlwZTogZnVuY3Rpb24gR2V0VGhpc1JlY29yZFR5cGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Byb3Aub2JqVHlwZTtcbiAgfSxcbiAgR2V0VXBsb2FkRW5kUG9pbnRSZXF1ZXN0OiBmdW5jdGlvbiBHZXRVcGxvYWRFbmRQb2ludFJlcXVlc3QoKSB7XG4gICAgdmFyIGVuZFBvaW50ID0gQmFzZVV0aWxpdHkuR2V0Um9vdFBhdGgoKSArIHRoaXMuYWNJbnRlcmZhY2UudXBsb2FkRmlsZTtcbiAgICB2YXIgcGFyYXMgPSB7XG4gICAgICBmaWxlVHlwZTogXCJBdHRhY2htZW50XCIsXG4gICAgICBpbnN0YW5jZUlkOiB0aGlzLl9wcm9wLkZsb3dJbnN0YW5jZVJ1bnRpbWVQTy5pbnN0YW5jZUVudGl0eS5pbnN0SWQsXG4gICAgICBidXNpbmVzc0tleTogdGhpcy5fcHJvcC5SZWNvcmRJZFxuICAgIH07XG4gICAgcmV0dXJuIHtcbiAgICAgIGVuZHBvaW50OiBlbmRQb2ludCxcbiAgICAgIHBhcmFtczogcGFyYXNcbiAgICB9O1xuICB9LFxuICBDcmVhdGVEZWZhdWx0VGVtcGxhdGU6IGZ1bmN0aW9uIENyZWF0ZURlZmF1bHRUZW1wbGF0ZSh0ZW1wbGF0ZUlkKSB7XG4gICAgJCh3aW5kb3cuZG9jdW1lbnQuYm9keSkuYXBwZW5kKFwiPHNjcmlwdCB0eXBlPVxcXCJ0ZXh0L3RlbXBsYXRlXFxcIiBpZD1cXFwiXCIgKyB0ZW1wbGF0ZUlkICsgXCJcXFwiPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwicXEtdXBsb2FkZXItc2VsZWN0b3IgcXEtdXBsb2FkZXIgcXEtZ2FsbGVyeVxcXCIgcXEtZHJvcC1hcmVhLXRleHQ9XFxcIlxcdTYyRDZcXHU2NTNFXFx1NjU4N1xcdTRFRjZcXHU1MjMwXFx1OEZEOVxcdTkxQ0NcXHU4RkRCXFx1ODg0Q1xcdTRFMEFcXHU0RjIwXFx1MzAwMlxcXCIgc3R5bGU9XFxcIm1pbi1oZWlnaHQ6IDc4cHg7XFxcIj5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJxcS10b3RhbC1wcm9ncmVzcy1iYXItY29udGFpbmVyLXNlbGVjdG9yIHFxLXRvdGFsLXByb2dyZXNzLWJhci1jb250YWluZXJcXFwiPlxcbiAgICAgICAgICAgICAgICA8ZGl2IHJvbGU9XFxcInByb2dyZXNzYmFyXFxcIiBhcmlhLXZhbHVlbm93PVxcXCIwXFxcIiBhcmlhLXZhbHVlbWluPVxcXCIwXFxcIiBhcmlhLXZhbHVlbWF4PVxcXCIxMDBcXFwiIGNsYXNzPVxcXCJxcS10b3RhbC1wcm9ncmVzcy1iYXItc2VsZWN0b3IgcXEtcHJvZ3Jlc3MtYmFyIHFxLXRvdGFsLXByb2dyZXNzLWJhclxcXCI+PC9kaXY+XFxuICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwicXEtdXBsb2FkLWRyb3AtYXJlYS1zZWxlY3RvciBxcS11cGxvYWQtZHJvcC1hcmVhXFxcIiBxcS1oaWRlLWRyb3B6b25lPlxcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwicXEtdXBsb2FkLWRyb3AtYXJlYS10ZXh0LXNlbGVjdG9yXFxcIj48L3NwYW4+XFxuICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwicXEtdXBsb2FkLWJ1dHRvbi1zZWxlY3RvciBxcS11cGxvYWQtYnV0dG9uXFxcIiBzdHlsZT1cXFwiZmxvYXQ6IHJpZ2h0XFxcIj5cXG4gICAgICAgICAgICAgICAgPGRpdj5cXHU5MDA5XFx1NjJFOVxcdTY1ODdcXHU0RUY2PC9kaXY+XFxuICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcInFxLWRyb3AtcHJvY2Vzc2luZy1zZWxlY3RvciBxcS1kcm9wLXByb2Nlc3NpbmdcXFwiPlxcbiAgICAgICAgICAgICAgICA8c3Bhbj5Qcm9jZXNzaW5nIGRyb3BwZWQgZmlsZXMuLi48L3NwYW4+XFxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJxcS1kcm9wLXByb2Nlc3Npbmctc3Bpbm5lci1zZWxlY3RvciBxcS1kcm9wLXByb2Nlc3Npbmctc3Bpbm5lclxcXCI+PC9zcGFuPlxcbiAgICAgICAgICAgIDwvc3Bhbj5cXG4gICAgICAgICAgICA8dWwgY2xhc3M9XFxcInFxLXVwbG9hZC1saXN0LXNlbGVjdG9yIHFxLXVwbG9hZC1saXN0XFxcIiByb2xlPVxcXCJyZWdpb25cXFwiIGFyaWEtbGl2ZT1cXFwicG9saXRlXFxcIiBhcmlhLXJlbGV2YW50PVxcXCJhZGRpdGlvbnMgcmVtb3ZhbHNcXFwiIHN0eWxlPVxcXCJkaXNwbGF5OiBub25lXFxcIj5cXG4gICAgICAgICAgICAgICAgPGxpPlxcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gcm9sZT1cXFwic3RhdHVzXFxcIiBjbGFzcz1cXFwicXEtdXBsb2FkLXN0YXR1cy10ZXh0LXNlbGVjdG9yIHFxLXVwbG9hZC1zdGF0dXMtdGV4dFxcXCI+PC9zcGFuPlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwicXEtcHJvZ3Jlc3MtYmFyLWNvbnRhaW5lci1zZWxlY3RvciBxcS1wcm9ncmVzcy1iYXItY29udGFpbmVyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHJvbGU9XFxcInByb2dyZXNzYmFyXFxcIiBhcmlhLXZhbHVlbm93PVxcXCIwXFxcIiBhcmlhLXZhbHVlbWluPVxcXCIwXFxcIiBhcmlhLXZhbHVlbWF4PVxcXCIxMDBcXFwiIGNsYXNzPVxcXCJxcS1wcm9ncmVzcy1iYXItc2VsZWN0b3IgcXEtcHJvZ3Jlc3MtYmFyXFxcIj48L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcInFxLXVwbG9hZC1zcGlubmVyLXNlbGVjdG9yIHFxLXVwbG9hZC1zcGlubmVyXFxcIj48L3NwYW4+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJxcS10aHVtYm5haWwtd3JhcHBlclxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGltZyBjbGFzcz1cXFwicXEtdGh1bWJuYWlsLXNlbGVjdG9yXFxcIiBxcS1tYXgtc2l6ZT1cXFwiMTIwXFxcIiBxcS1zZXJ2ZXItc2NhbGU+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwicXEtdXBsb2FkLWNhbmNlbC1zZWxlY3RvciBxcS11cGxvYWQtY2FuY2VsXFxcIj5YPC9idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcInFxLXVwbG9hZC1yZXRyeS1zZWxlY3RvciBxcS11cGxvYWQtcmV0cnlcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJxcS1idG4gcXEtcmV0cnktaWNvblxcXCIgYXJpYS1sYWJlbD1cXFwiUmV0cnlcXFwiPjwvc3Bhbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICBSZXRyeVxcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XFxuXFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJxcS1maWxlLWluZm9cXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInFxLWZpbGUtbmFtZVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJxcS11cGxvYWQtZmlsZS1zZWxlY3RvciBxcS11cGxvYWQtZmlsZVxcXCI+PC9zcGFuPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwicXEtZWRpdC1maWxlbmFtZS1pY29uLXNlbGVjdG9yIHFxLWJ0biBxcS1lZGl0LWZpbGVuYW1lLWljb25cXFwiIGFyaWEtbGFiZWw9XFxcIkVkaXQgZmlsZW5hbWVcXFwiPjwvc3Bhbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3M9XFxcInFxLWVkaXQtZmlsZW5hbWUtc2VsZWN0b3IgcXEtZWRpdC1maWxlbmFtZVxcXCIgdGFiaW5kZXg9XFxcIjBcXFwiIHR5cGU9XFxcInRleHRcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJxcS11cGxvYWQtc2l6ZS1zZWxlY3RvciBxcS11cGxvYWQtc2l6ZVxcXCI+PC9zcGFuPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwicXEtYnRuIHFxLXVwbG9hZC1kZWxldGUtc2VsZWN0b3IgcXEtdXBsb2FkLWRlbGV0ZVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJxcS1idG4gcXEtZGVsZXRlLWljb25cXFwiIGFyaWEtbGFiZWw9XFxcIkRlbGV0ZVxcXCI+PC9zcGFuPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwicXEtYnRuIHFxLXVwbG9hZC1wYXVzZS1zZWxlY3RvciBxcS11cGxvYWQtcGF1c2VcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwicXEtYnRuIHFxLXBhdXNlLWljb25cXFwiIGFyaWEtbGFiZWw9XFxcIlBhdXNlXFxcIj48L3NwYW4+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJxcS1idG4gcXEtdXBsb2FkLWNvbnRpbnVlLXNlbGVjdG9yIHFxLXVwbG9hZC1jb250aW51ZVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJxcS1idG4gcXEtY29udGludWUtaWNvblxcXCIgYXJpYS1sYWJlbD1cXFwiQ29udGludWVcXFwiPjwvc3Bhbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICA8L2xpPlxcbiAgICAgICAgICAgIDwvdWw+XFxuXFxuICAgICAgICAgICAgPGRpYWxvZyBjbGFzcz1cXFwicXEtYWxlcnQtZGlhbG9nLXNlbGVjdG9yXFxcIj5cXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwicXEtZGlhbG9nLW1lc3NhZ2Utc2VsZWN0b3JcXFwiPjwvZGl2PlxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJxcS1kaWFsb2ctYnV0dG9uc1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcInFxLWNhbmNlbC1idXR0b24tc2VsZWN0b3JcXFwiPkNsb3NlPC9idXR0b24+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgIDwvZGlhbG9nPlxcblxcbiAgICAgICAgICAgIDxkaWFsb2cgY2xhc3M9XFxcInFxLWNvbmZpcm0tZGlhbG9nLXNlbGVjdG9yXFxcIj5cXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwicXEtZGlhbG9nLW1lc3NhZ2Utc2VsZWN0b3JcXFwiPjwvZGl2PlxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJxcS1kaWFsb2ctYnV0dG9uc1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcInFxLWNhbmNlbC1idXR0b24tc2VsZWN0b3JcXFwiPk5vPC9idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcInFxLW9rLWJ1dHRvbi1zZWxlY3RvclxcXCI+WWVzPC9idXR0b24+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgIDwvZGlhbG9nPlxcblxcbiAgICAgICAgICAgIDxkaWFsb2cgY2xhc3M9XFxcInFxLXByb21wdC1kaWFsb2ctc2VsZWN0b3JcXFwiPlxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJxcS1kaWFsb2ctbWVzc2FnZS1zZWxlY3RvclxcXCI+PC9kaXY+XFxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIj5cXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwicXEtZGlhbG9nLWJ1dHRvbnNcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJxcS1jYW5jZWwtYnV0dG9uLXNlbGVjdG9yXFxcIj5DYW5jZWw8L2J1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwicXEtb2stYnV0dG9uLXNlbGVjdG9yXFxcIj5PazwvYnV0dG9uPlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICA8L2RpYWxvZz5cXG4gICAgICAgIDwvZGl2PlxcbiAgICA8L3NjcmlwdD5cIik7XG4gIH0sXG4gIEJ1aWxkVXBsb2FkQ29udGFpbmVyOiBmdW5jdGlvbiBCdWlsZFVwbG9hZENvbnRhaW5lcigpIHtcbiAgICBpZiAodGhpcy5fYXV0aG9yaXRpZXNGaWxlQXV0aG9yaXR5LmFkZEZpbGUgPT0gXCJ0cnVlXCIpIHtcbiAgICAgIHZhciAkc2luZ2xlQ29udHJvbEVsZW0gPSAkKFwiI0Zsb3dGaWxlc0xpc3RQbHVnaW5Db250YWluZXJcIik7XG4gICAgICB2YXIgdXBsb2FkV2FycElkID0gJ3VwbG9hZFdhcnBfJyArIFN0cmluZ1V0aWxpdHkuVGltZXN0YW1wKCk7XG4gICAgICB0aGlzLl9wcm9wLnVwbG9hZFdhcnBJZCA9IHVwbG9hZFdhcnBJZDtcbiAgICAgIHZhciAkdXBsb2FkV2FycCA9ICQoXCI8ZGl2IGlkPSdcIiArIHVwbG9hZFdhcnBJZCArIFwiJz48L2Rpdj5cIik7XG4gICAgICAkc2luZ2xlQ29udHJvbEVsZW0uYXBwZW5kKCR1cGxvYWRXYXJwKTtcbiAgICAgIHZhciB0ZW1wbGF0ZUlkID0gXCJxcS10ZW1wbGF0ZV9cIiArIHRoaXMuX3Byb3AuZWxlbUlkO1xuICAgICAgdGhpcy5DcmVhdGVEZWZhdWx0VGVtcGxhdGUodGVtcGxhdGVJZCk7XG5cbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIHZhciBnYWxsZXJ5VXBsb2FkZXIgPSBuZXcgcXEuRmluZVVwbG9hZGVyKHtcbiAgICAgICAgZWxlbWVudDogJHVwbG9hZFdhcnBbMF0sXG4gICAgICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZUlkLFxuICAgICAgICBtdWx0aXBsZTogZmFsc2UsXG4gICAgICAgIHJlcXVlc3Q6IHRoaXMuR2V0VXBsb2FkRW5kUG9pbnRSZXF1ZXN0KCksXG4gICAgICAgIGNhbGxiYWNrczoge1xuICAgICAgICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uIG9uQ29tcGxldGUoaWQsIG5hbWUsIHJlc3BvbnNlSlNPTiwgeGhyKSB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2VKU09OLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgX3RoaXMuQnVpbGRGaWxlTGlzdCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQocmVzcG9uc2VKU09OLm1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9LFxuICBCdWlsZEZpbGVMaXN0OiBmdW5jdGlvbiBCdWlsZEZpbGVMaXN0KCkge1xuICAgIHZhciAkc2luZ2xlQ29udHJvbEVsZW0gPSAkKFwiI0Zsb3dGaWxlc0xpc3RQbHVnaW5Db250YWluZXJcIik7XG4gICAgdmFyIHVwbG9hZF9maWxlX2xpc3Rfd3JhcF9pZCA9IFwiZmxvd19maWxlX3BsdWdpbl91cGxvYWRfZmlsZV9saXN0X3dhcnBcIjtcbiAgICAkKFwiI1wiICsgdXBsb2FkX2ZpbGVfbGlzdF93cmFwX2lkKS5yZW1vdmUoKTtcbiAgICB2YXIgJGRpdldhcnAgPSAkKFwiPGRpdiBjbGFzcz0ndXBsb2FkX2ZpbGVfbGlzdF93cmFwJyBpZD0nXCIgKyB1cGxvYWRfZmlsZV9saXN0X3dyYXBfaWQgKyBcIic+PHRhYmxlIGNsYXNzPSdmaWxlX2xpc3RfdGFibGUnPjx0aGVhZD48dHI+PHRoPuaWh+S7tuWQjeensDwvdGg+PHRoIHN0eWxlPSd3aWR0aDogMTQwcHgnPuS4iuS8oOaXtumXtDwvdGg+PHRoIHN0eWxlPSd3aWR0aDogMTQwcHgnPuS4iuS8oOS6ujwvdGg+PHRoIHN0eWxlPSd3aWR0aDogMTQwcHgnPuaWh+S7tuWkp+WwjzwvdGg+PHRoIHN0eWxlPSd3aWR0aDogMTQwcHgnPuaTjeS9nDwvdGg+PC90cj48L3RoZWFkPjx0Ym9keT48L3Rib2R5PjwvdGFibGU+PC9kaXY+XCIpO1xuICAgIHZhciAkdGJvZHkgPSAkZGl2V2FycC5maW5kKFwidGJvZHlcIik7XG4gICAgdmFyIGluc3RhbmNlSWQgPSB0aGlzLl9wcm9wLkZsb3dJbnN0YW5jZVJ1bnRpbWVQTy5pbnN0YW5jZUVudGl0eS5pbnN0SWQ7XG4gICAgQWpheFV0aWxpdHkuUG9zdCh0aGlzLmFjSW50ZXJmYWNlLmdldEZpbGVMaXN0RGF0YSwge1xuICAgICAgaW5zdGFuY2VJZDogaW5zdGFuY2VJZFxuICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3VsdC5kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFyIGZpbGVJbmZvID0gcmVzdWx0LmRhdGFbaV07XG4gICAgICAgICAgJHRib2R5LmFwcGVuZCh0aGlzLkJ1aWxkRmlsZUluZm9UYWJsZVJvdyhyZXN1bHQsIGZpbGVJbmZvKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB0aGlzKTtcbiAgICAkKCRzaW5nbGVDb250cm9sRWxlbS5hcHBlbmQoJGRpdldhcnApKTtcbiAgfSxcbiAgQnVpbGRGaWxlSW5mb1RhYmxlUm93OiBmdW5jdGlvbiBCdWlsZEZpbGVJbmZvVGFibGVSb3cocmVzcG9uc2VKU09OLCBmaWxlSW5mbykge1xuICAgIHZhciBmaWxlTmFtZSA9IFN0cmluZ1V0aWxpdHkuRW5jb2RlSHRtbChmaWxlSW5mby5maWxlTmFtZSk7XG4gICAgdmFyIGZpbGVDcmVhdGVUaW1lID0gRGF0ZVV0aWxpdHkuRGF0ZUZvcm1hdEJ5VGltZVN0YW1wKGZpbGVJbmZvLmZpbGVDcmVhdGVUaW1lLCBcInl5eXktTU0tZGRcIik7XG4gICAgdmFyIGZpbGVTaXplID0gSGFyZERpc2tVdGlsaXR5LkJ5dGVDb252ZXJ0KGZpbGVJbmZvLmZpbGVTaXplKTtcbiAgICB2YXIgZmlsZUNyZWF0b3JOYW1lID0gU3RyaW5nVXRpbGl0eS5FbmNvZGVIdG1sKGZpbGVJbmZvLmZpbGVDcmVhdG9yKTtcbiAgICB2YXIgJHRyT2JqID0gJChcIjx0cj48dGQ+XCIuY29uY2F0KGZpbGVOYW1lLCBcIjwvdGQ+PHRkIHN0eWxlPVxcXCJ0ZXh0LWFsaWduOiBjZW50ZXJcXFwiPlwiKS5jb25jYXQoZmlsZUNyZWF0ZVRpbWUsIFwiPC90ZD48dGQgc3R5bGU9XFxcInRleHQtYWxpZ246IGNlbnRlclxcXCI+XCIpLmNvbmNhdChmaWxlQ3JlYXRvck5hbWUsIFwiPC90ZD48dGQgc3R5bGU9XFxcInRleHQtYWxpZ246IGNlbnRlclxcXCI+XCIpLmNvbmNhdChmaWxlU2l6ZSwgXCI8L3RkPjx0ZCBzdHlsZT1cXFwidGV4dC1hbGlnbjogY2VudGVyXFxcIj48L3RkPjwvdHI+XCIpKTtcbiAgICB0aGlzLkJ1aWxkRmlsZUluZm9UYWJsZVJvd0lubmVyQnV0dG9ucyhyZXNwb25zZUpTT04sIGZpbGVJbmZvLCAkdHJPYmopO1xuICAgIHJldHVybiAkdHJPYmo7XG4gIH0sXG4gIEJ1aWxkRmlsZUluZm9UYWJsZVJvd0lubmVyQnV0dG9uczogZnVuY3Rpb24gQnVpbGRGaWxlSW5mb1RhYmxlUm93SW5uZXJCdXR0b25zKHJlc3BvbnNlSlNPTiwgZmlsZUluZm8sICR0cikge1xuICAgIGlmICghdGhpcy5fcHJvcC5kb3dubG9hZEVuYWJsZSAmJiAhdGhpcy5fcHJvcC5kZWxldGVFbmFibGUgJiYgdGhpcy5fcHJvcC5wcmV2aWV3RW5hYmxlICYmIHRoaXMuX3Byb3AubW92ZU9yZGVyRW5hYmxlKSB7fVxuXG4gICAgdmFyICR0ckxhc3RUZCA9ICR0ci5maW5kKFwidGQ6bGFzdFwiKTtcblxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAodGhpcy5fcHJvcC5kZWxldGVFbmFibGUpIHtcbiAgICAgIHZhciAkZGVsZXRlRWxlbSA9ICQoXCI8ZGl2IGNsYXNzPSdmaWxlLWxpc3QtaW5uZXItYnV0dG9uIGRlbGV0ZS1idXR0b24tZWxlbScgdGl0bGU9J+eCueWHu+WIoOmZpCc+PC9kaXY+XCIpO1xuICAgICAgJGRlbGV0ZUVsZW0uY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkNvbmZpcm0od2luZG93LCBcIuehruiupOWIoOmZpOmZhOS7tuOAkFwiICsgZmlsZUluZm8uZmlsZU5hbWUgKyBcIuOAkeWQlz9cIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIEFqYXhVdGlsaXR5LlBvc3QoX3RoaXMuYWNJbnRlcmZhY2UuZGVsZXRlRmlsZSwge1xuICAgICAgICAgICAgZmlsZUlkOiBmaWxlSW5mby5maWxlSWRcbiAgICAgICAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgJGRlbGV0ZUVsZW0ucGFyZW50KCkucGFyZW50KCkucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgX3RoaXMpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgJHRyTGFzdFRkLmFwcGVuZCgkZGVsZXRlRWxlbSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3Byb3AubW92ZU9yZGVyRW5hYmxlIHx8IHRydWUpIHtcbiAgICAgIHZhciAkbW92ZVVwRWxlbSA9ICQoXCI8ZGl2IGNsYXNzPSdmaWxlLWxpc3QtaW5uZXItYnV0dG9uIG1vdmUtdXAtYnV0dG9uLWVsZW0nIHRpdGxlPSfngrnlh7vkuIrnp7snPjwvZGl2PlwiKTtcbiAgICAgICRtb3ZlVXBFbGVtLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQoXCLmmoLkuI3mlK/mjIEhXCIpO1xuICAgICAgfSk7XG4gICAgICB2YXIgJG1vdmVEb3duRWxlbSA9ICQoXCI8ZGl2IGNsYXNzPSdmaWxlLWxpc3QtaW5uZXItYnV0dG9uIG1vdmUtZG93bi1idXR0b24tZWxlbScgdGl0bGU9J+eCueWHu+S4i+enuyc+PC9kaXY+XCIpO1xuICAgICAgJG1vdmVEb3duRWxlbS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KFwi5pqC5LiN5pSv5oyBIVwiKTtcbiAgICAgIH0pO1xuICAgICAgJHRyTGFzdFRkLmFwcGVuZCgkbW92ZVVwRWxlbSk7XG4gICAgICAkdHJMYXN0VGQuYXBwZW5kKCRtb3ZlRG93bkVsZW0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9wcm9wLmRvd25sb2FkRW5hYmxlKSB7XG4gICAgICB2YXIgJGRvd25sb2FkRWxlbSA9ICQoXCI8ZGl2IGNsYXNzPSdmaWxlLWxpc3QtaW5uZXItYnV0dG9uIGRvd25sb2FkLWJ1dHRvbi1lbGVtJyB0aXRsZT0n54K55Ye75LiL6L29Jz48L2Rpdj5cIik7XG4gICAgICAkZG93bmxvYWRFbGVtLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHVybCA9IEJhc2VVdGlsaXR5LkdldFJvb3RQYXRoKCkgKyBfdGhpcy5hY0ludGVyZmFjZS5kb3dubG9hZEZpbGUgKyBcIj9maWxlSWQ9XCIgKyBmaWxlSW5mby5maWxlSWQ7XG4gICAgICAgIHdpbmRvdy5vcGVuKHVybCk7XG4gICAgICB9KTtcbiAgICAgICR0ckxhc3RUZC5hcHBlbmQoJGRvd25sb2FkRWxlbSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3Byb3AucHJldmlld0VuYWJsZSB8fCB0cnVlKSB7XG4gICAgICB2YXIgJHByZXZpZXdFbGVtID0gJChcIjxkaXYgY2xhc3M9J2ZpbGUtbGlzdC1pbm5lci1idXR0b24gcHJldmlldy1idXR0b24tZWxlbScgdGl0bGU9J+eCueWHu+mihOiniCc+PC9kaXY+XCIpO1xuICAgICAgJHByZXZpZXdFbGVtLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQoXCLmmoLkuI3mlK/mjIEhXCIpO1xuICAgICAgfSk7XG4gICAgICAkdHJMYXN0VGQuYXBwZW5kKCRwcmV2aWV3RWxlbSk7XG4gICAgfVxuICB9LFxuICBUZXN0RmlsZVByZXZpZXdFbmFibGU6IGZ1bmN0aW9uIFRlc3RGaWxlUHJldmlld0VuYWJsZShmaWxlSW5mbykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgSW5zdGFuY2VFeFRhc2tMaXN0UGx1Z2luID0ge1xuICBfZmxvd0luc3RhbmNlUnVudGltZVBPOiBudWxsLFxuICBfaGlzdG9yeUV4ZWN1dGlvblRhc2tFbnRpdHlMaXN0OiBudWxsLFxuICBfY3VycmVudEV4VGFzazogbnVsbCxcbiAgR2V0SHRtbEVsZW06IGZ1bmN0aW9uIEdldEh0bWxFbGVtKHByb3BDb25maWcpIHtcbiAgICB0aGlzLl9mbG93SW5zdGFuY2VSdW50aW1lUE8gPSBwcm9wQ29uZmlnLkZsb3dJbnN0YW5jZVJ1bnRpbWVQTztcbiAgICB0aGlzLl9oaXN0b3J5RXhlY3V0aW9uVGFza0VudGl0eUxpc3QgPSBwcm9wQ29uZmlnLkZsb3dJbnN0YW5jZVJ1bnRpbWVQTy5oaXN0b3J5RXhlY3V0aW9uVGFza0VudGl0eUxpc3Q7XG4gICAgdGhpcy5fY3VycmVudEV4VGFzayA9IHByb3BDb25maWcuRmxvd0luc3RhbmNlUnVudGltZVBPLmV4ZWN1dGlvblRhc2tFbnRpdHk7XG5cbiAgICBpZiAodGhpcy5faGlzdG9yeUV4ZWN1dGlvblRhc2tFbnRpdHlMaXN0KSB7XG4gICAgICByZXR1cm4gdGhpcy5SZW5kZXJlcigpO1xuICAgIH1cblxuICAgIHJldHVybiBcIlwiO1xuICB9LFxuICBWaWV3RGV0YWlsOiBmdW5jdGlvbiBWaWV3RGV0YWlsKGV4VGFza0lkKSB7XG4gICAgdmFyIGV4VGFzayA9IEFycmF5VXRpbGl0eS5XaGVyZVNpbmdsZSh0aGlzLl9oaXN0b3J5RXhlY3V0aW9uVGFza0VudGl0eUxpc3QsIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICByZXR1cm4gaXRlbS5leHRhc2tJZCA9PSBleFRhc2tJZDtcbiAgICB9KTtcbiAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0SnNvbkNvZGUoZXhUYXNrKTtcbiAgfSxcbiAgQ29udmVydFN0YXR1c1RvQ05OYW1lOiBmdW5jdGlvbiBDb252ZXJ0U3RhdHVzVG9DTk5hbWUoc3RhdHVzKSB7XG4gICAgaWYgKHN0YXR1cyA9PSBcIlByb2Nlc3NpbmdcIikge1xuICAgICAgcmV0dXJuIFwi5Yqe55CG5LitXCI7XG4gICAgfSBlbHNlIGlmIChzdGF0dXMgPT0gXCJFbmRcIikge1xuICAgICAgcmV0dXJuIFwi5bey5Yqe55CGXCI7XG4gICAgfSBlbHNlIGlmIChzdGF0dXMgPT0gXCJDYW5jZWxcIikge1xuICAgICAgcmV0dXJuIFwi6KKr5pKk5ZueXCI7XG4gICAgfSBlbHNlIGlmIChzdGF0dXMgPT0gXCJDYW5jZWxFbmRcIikge1xuICAgICAgcmV0dXJuIFwi5Yqe55CGJiMxMDUyMjsmIzEwMjMwO+aSpOWbnlwiO1xuICAgIH1cblxuICAgIHJldHVybiBcIuacquefpVwiO1xuICB9LFxuICBSZW5kZXJlcjogZnVuY3Rpb24gUmVuZGVyZXIoKSB7XG4gICAgdmFyIGh0bWxUYWJsZSA9IFwiPGRpdiBjbGFzcz0naW5zdGFuY2UtZXgtdGFzay1saXN0LXBsdWdpbic+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzcz0nZXgtdGFzay10YWJsZSc+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGhlYWQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPjx0aD5cXHU3M0FGXFx1ODI4MlxcdTU0MERcXHU3OUYwPC90aD48dGg+XFx1NTNEMVxcdTkwMDFcXHU0RUJBPC90aD48dGg+XFx1NTNEMVxcdTkwMDFcXHU2NUY2XFx1OTVGNDwvdGg+PHRoPlxcdTY3RTVcXHU3NzBCXFx1NjVGNlxcdTk1RjQ8L3RoPjx0aD5cXHU2M0E1XFx1NjUzNlxcdTRFQkEvXFx1NTkwNFxcdTc0MDZcXHU0RUJBPC90aD48dGg+XFx1NTkwNFxcdTc0MDZcXHU2NUY2XFx1OTVGNDwvdGg+PHRoPlxcdTYyNjdcXHU4ODRDXFx1NTJBOFxcdTRGNUM8L3RoPjx0aD5cXHU3MkI2XFx1NjAwMTwvdGg+PHRoIHN0eWxlPVxcXCJ3aWR0aDogMjAwcHhcXFwiPlxcdTY0Q0RcXHU0RjVDPC90aD48L3RyPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aGVhZD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0Ym9keT5cIjtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5faGlzdG9yeUV4ZWN1dGlvblRhc2tFbnRpdHlMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZXhUYXNrID0gdGhpcy5faGlzdG9yeUV4ZWN1dGlvblRhc2tFbnRpdHlMaXN0W2ldO1xuICAgICAgdmFyIGV4dGFza0lkID0gU3RyaW5nVXRpbGl0eS5OdWxsVG9FUyhleFRhc2suZXh0YXNrSWQpO1xuICAgICAgdmFyIGV4dGFza0N1ck5vZGVOYW1lID0gU3RyaW5nVXRpbGl0eS5OdWxsVG9FUyhleFRhc2suZXh0YXNrQ3VyTm9kZU5hbWUpO1xuICAgICAgdmFyIGV4dGFza1NlbmRlck5hbWUgPSBTdHJpbmdVdGlsaXR5Lk51bGxUb0VTKGV4VGFzay5leHRhc2tTZW5kZXJOYW1lKTtcbiAgICAgIHZhciBleHRhc2tTdGFydFRpbWUgPSBTdHJpbmdVdGlsaXR5Lk51bGxUb0VTKGV4VGFzay5leHRhc2tTdGFydFRpbWUpO1xuICAgICAgdmFyIGV4dGFza1ZpZXdUaW1lID0gU3RyaW5nVXRpbGl0eS5OdWxsVG9FUyhleFRhc2suZXh0YXNrVmlld1RpbWUpO1xuICAgICAgdmFyIHJoTmFtZSA9IFN0cmluZ1V0aWxpdHkuTnVsbFRvRVMoZXhUYXNrLmV4dGFza1JlY2VpdmVyTmFtZSk7XG4gICAgICB2YXIgZXh0YXNrSGFuZGxlcklkID0gU3RyaW5nVXRpbGl0eS5OdWxsVG9FUyhleFRhc2suZXh0YXNrSGFuZGxlcklkKTtcbiAgICAgIHZhciBleHRhc2tSZWNlaXZlcklkID0gU3RyaW5nVXRpbGl0eS5OdWxsVG9FUyhleFRhc2suZXh0YXNrUmVjZWl2ZXJJZCk7XG5cbiAgICAgIGlmICghU3RyaW5nVXRpbGl0eS5Jc051bGxPckVtcHR5KGV4dGFza0hhbmRsZXJJZCkgJiYgZXh0YXNrUmVjZWl2ZXJJZCAhPSBleHRhc2tIYW5kbGVySWQpIHtcbiAgICAgICAgcmhOYW1lID0gU3RyaW5nVXRpbGl0eS5OdWxsVG9FUyhleFRhc2suZXh0YXNrUmVjZWl2ZXJOYW1lKSArIFwiL1wiICsgU3RyaW5nVXRpbGl0eS5OdWxsVG9FUyhleFRhc2suZXh0YXNrSGFuZGxlck5hbWUpO1xuICAgICAgfVxuXG4gICAgICB2YXIgZXh0YXNrSGFuZGxlck5hbWUgPSBTdHJpbmdVdGlsaXR5Lk51bGxUb0VTKGV4VGFzay5leHRhc2tIYW5kbGVyTmFtZSk7XG4gICAgICB2YXIgZXh0YXNrRW5kVGltZSA9IFN0cmluZ1V0aWxpdHkuTnVsbFRvRVMoZXhUYXNrLmV4dGFza0VuZFRpbWUpO1xuICAgICAgdmFyIGV4dGFza0hhbmRsZUFjdGlvbk5hbWUgPSBTdHJpbmdVdGlsaXR5Lk51bGxUb0VTKGV4VGFzay5leHRhc2tIYW5kbGVBY3Rpb25OYW1lKTtcbiAgICAgIHZhciBleHRhc2tTdGF0dXMgPSB0aGlzLkNvbnZlcnRTdGF0dXNUb0NOTmFtZShTdHJpbmdVdGlsaXR5Lk51bGxUb0VTKGV4VGFzay5leHRhc2tTdGF0dXMpKTtcbiAgICAgIHZhciBjbGFzc05hbWUgPSBcIm4tdGFzay10clwiO1xuXG4gICAgICBpZiAodGhpcy5fY3VycmVudEV4VGFzay5leHRhc2tJZCA9PSBleHRhc2tJZCkge1xuICAgICAgICBjbGFzc05hbWUgPSBcIm15LXRoaXMtdGFzay10clwiO1xuICAgICAgfVxuXG4gICAgICBodG1sVGFibGUgKz0gXCI8dHIgY2xhc3M9XFxcIlwiLmNvbmNhdChjbGFzc05hbWUsIFwiXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlwiKS5jb25jYXQoZXh0YXNrQ3VyTm9kZU5hbWUsIFwiPC90ZD48dGQ+XCIpLmNvbmNhdChleHRhc2tTZW5kZXJOYW1lLCBcIjwvdGQ+PHRkPlwiKS5jb25jYXQoZXh0YXNrU3RhcnRUaW1lLCBcIjwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cIikuY29uY2F0KGV4dGFza1ZpZXdUaW1lLCBcIjwvdGQ+PHRkPlwiKS5jb25jYXQocmhOYW1lLCBcIjwvdGQ+PHRkPlwiKS5jb25jYXQoZXh0YXNrRW5kVGltZSwgXCI8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XCIpLmNvbmNhdChleHRhc2tIYW5kbGVBY3Rpb25OYW1lLCBcIjwvdGQ+PHRkPlwiKS5jb25jYXQoZXh0YXNrU3RhdHVzLCBcIjwvdGQ+PHRkPjxhIG9uY2xpY2s9XFxcIkluc3RhbmNlRXhUYXNrTGlzdFBsdWdpbi5WaWV3RGV0YWlsKCdcIikuY29uY2F0KGV4dGFza0lkLCBcIicpXFxcIj5cXHU4QkU2XFx1NjBDNTwvYT48L3RkPjwvdHI+XCIpO1xuICAgIH1cblxuICAgIGh0bWxUYWJsZSArPSBcIjwvdGJvZHk+PC90YWJsZT48L2Rpdj5cIjtcbiAgICByZXR1cm4gaHRtbFRhYmxlO1xuICB9XG59OyJdfQ==
