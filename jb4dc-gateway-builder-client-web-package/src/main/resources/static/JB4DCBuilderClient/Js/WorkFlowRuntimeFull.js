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
      actionsOpinionBindToElemId: null,
      actionsOpinionBindToField: null,
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
    console.log(pageReadyInnerParas);

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
    console.log(pageReadyInnerParas);

    this._formRuntimeInst.Initialization({
      "InstanceId": flowInstanceRuntimePO.instanceEntity.instId,
      "RendererToId": "htmlDesignRuntimeWrap",
      "FormId": pageReadyInnerParas.formId,
      "RecordId": recordId,
      "ButtonId": "",
      "OperationType": BaseUtility.GetUpdateOperationName(),
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
      tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-content wfdct-tabs-content-runtime\" id=\"tab_content_uploadConvertToPDFPlugin_999\">" + DocumentContentUploadConvertToPDFPlugin.getHtmlElem(propConfig) + "</div>");
    } else if (flowInstanceRuntimePO.jb4dcContentDocumentPlugin == "wpsOnlineDocumentPlugin") {
      tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-label wfdct-tabs-label-runtime\" tab_id=\"tab_content_wpsOnlineDocumentPlugin_999\">正文</div>");
      tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-content wfdct-tabs-content-runtime\" id=\"tab_content_wpsOnlineDocumentPlugin_999\">未实现</div>");
    }

    tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-label wfdct-tabs-label-runtime\" tab_id=\"tab_content_flow_files_999\">附件</div>");
    tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-content wfdct-tabs-content-runtime\" id=\"tab_content_flow_files_999\">" + FlowFilesListSinglePlugin.getHtmlElem(propConfig) + "</div>");
    tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-label wfdct-tabs-label-runtime\" tab_id=\"tab_content_flow_modeler_999\">流程图</div>");
    tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-content wfdct-tabs-content-runtime\" id=\"tab_content_flow_modeler_999\" style='height: calc(100% - 50px);' onActivity=\"FlowRuntimePageObject.rendererFlowModelerForTabOnActivity\"><div id=\"flow-canvas\" style=\"height:100%;\"></div></div>");
    tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-label wfdct-tabs-label-runtime\" tab_id=\"tab_content_flow_sequence_999\">顺序图</div>");
    tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-content wfdct-tabs-content-runtime\" id=\"tab_content_flow_sequence_999\"></div>");
    tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-label wfdct-tabs-label-runtime\" tab_id=\"tab_content_flow_task_999\">流转信息</div>");
    tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-content wfdct-tabs-content-runtime\" id=\"tab_content_flow_task_999\"></div>");
    var newRuntimeHtml = flowPageContainer.html();
    return newRuntimeHtml;
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
"use strict";
"use strict";

var RecallAction = {
  acInterface: {
    resolveNextPossibleFlowNode: "/Rest/Workflow/RunTime/Client/InstanceRuntime/ResolveNextPossibleFlowNode",
    recallMySendTask: "/Rest/Workflow/RunTime/Client/InstanceRuntime/RecallMySendTask"
  },
  _Prop: {},
  Instance: function Instance(isStartInstanceStatus, formRuntimeInst, pageHostInstance, pageReadyInnerParas, actionObj) {
    console.log(actionObj);
    var htmlId = actionObj.actionHTMLId ? actionObj.actionHTMLId : actionObj.actionCode;
    var elem = $('<button type="button" class="operation-button operation-button-primary" id="' + htmlId + '"><span>' + actionObj.actionCaption + '</span></button>');

    if (actionObj.actionDisable == "disable") {
      elem.attr("disable", "disable");
      elem.addClass("operation-button-primary-disabled");
    }

    if (actionObj.actionRemark) {
      elem.attr("title", actionObj.actionRemark);
    }

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
  Instance: function Instance(isStartInstanceStatus, formRuntimeInst, pageHostInstance, pageReadyInnerParas, actionObj) {
    console.log(actionObj);
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
      "instanceId": pageReadyInnerParas.flowInstanceRuntimePO.instanceEntity.instId
    };
    elem.bind("click", this._Prop, this.ButtonClickEvent);
    return {
      elem: elem
    };
  },
  ButtonClickEvent: function ButtonClickEvent(sender) {
    var validateResult = ValidateRulesRuntime.ValidateSubmitEnable();

    if (ValidateRulesRuntime.AlertValidateErrors(validateResult)) {
      DialogUtility.AlertLoading(window, DialogUtility.DialogLoadingId, {}, "");
      var _prop = sender.data;
      var _this = _prop.sender;

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
    }
  },
  SelectReceiverCompleted: function SelectReceiverCompleted(nextTaskEntityList, selectedReceiverData) {
    console.log(selectedReceiverData);
    console.log(this._Prop.actionObj.actionCaption);
    DialogUtility.Confirm(window, "确认执行发送?", function () {
      var selectedReceiverVars = FlowRuntimeVarBuilder.BuilderSelectedReceiverToInstanceVar(nextTaskEntityList, selectedReceiverData);
      var sendData = this.BuildSendToServerData(this._Prop, {
        selectedReceiverVars: encodeURIComponent(JsonUtility.JsonToString(selectedReceiverVars))
      });
      console.log(sendData);

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
        "instanceId": _prop.instanceId
      }
    };

    if (appendSendMap) {
      for (var key in appendSendMap) {
        result.data[key] = appendSendMap[key];
      }
    }

    return result;
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
      console.log(result);

      if (result.success && result.data) {
        this.loadPDFFileToViewer(result.data.fileId);
      }
    }, this);
  },
  loadPDFFileToViewer: function loadPDFFileToViewer(fileId) {
    var fileUrl = BaseUtility.GetRootPath() + "/Rest/Workflow/RunTime/Client/DocumentFileRuntime/DownLoadPdfDocumentByFileId?fileId=" + fileId;
    $("#pdfViewer").attr("src", "/Js/External/PDFJS-2.9.359-dist/web/viewer.html?file=" + encodeURIComponent(fileUrl));
  },
  getHtmlElem: function getHtmlElem(propConfig) {
    console.log(propConfig);
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
  getHtmlElem: function getHtmlElem(propConfig) {
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
    console.log(this._prop);
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
    var upload_file_list_wrap_id = "upload_file_list_warp_" + StringUtility.Timestamp();
    $("#" + upload_file_list_wrap_id).remove();
    var $divWarp = $("<div class='upload_file_list_wrap' id='" + upload_file_list_wrap_id + "'><table class='file_list_table'><thead><tr><th>文件名称</th><th style='width: 140px'>上传时间</th><th style='width: 140px'>上传人</th><th style='width: 140px'>文件大小</th><th style='width: 140px'>操作</th></tr></thead><tbody></tbody></table></div>");
    var $tbody = $divWarp.find("tbody");
    var instanceId = this._prop.FlowInstanceRuntimePO.instanceEntity.instId;
    AjaxUtility.Post(this.acInterface.getFileListData, {
      instanceId: instanceId
    }, function (result) {
      console.log(result);

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
    var fileCreateTime = DateUtility.DataFormatByTimeStamp(fileInfo.fileCreateTime, "yyyy-MM-dd");
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFjdGlvbnNSdW50aW1lT2JqZWN0LmpzIiwiRmxvd1J1bnRpbWVQYWdlT2JqZWN0LmpzIiwiRmxvd1J1bnRpbWVWYXJCdWlsZGVyLmpzIiwiQWN0aW9ucy9KdW1wVG9BbnlOb2RlQWN0aW9uLmpzIiwiQWN0aW9ucy9SZUJvb3RJbnN0YW5jZUFjdGlvbi5qcyIsIkFjdGlvbnMvUmVjYWxsQWN0aW9uLmpzIiwiQWN0aW9ucy9TZW5kQWN0aW9uLmpzIiwiQWN0aW9ucy9UZW1wU2F2ZUFjdGlvbi5qcyIsIkRpYWxvZy9Vc2VyVGFza1JlY2VpdmVyRGlhbG9nLmpzIiwiUGx1Z2lucy9Eb2N1bWVudENvbnRlbnRVcGxvYWRDb252ZXJ0VG9QREZQbHVnaW4uanMiLCJQbHVnaW5zL0Zsb3dGaWxlc0xpc3RTaW5nbGVQbHVnaW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQ0FBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0SEE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaFRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiV29ya0Zsb3dSdW50aW1lRnVsbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG52YXIgQWN0aW9uc1J1bnRpbWVPYmplY3QgPSB7XG4gIENyZWF0ZUFMTEFjdGlvbkJ1dHRvbjogZnVuY3Rpb24gQ3JlYXRlQUxMQWN0aW9uQnV0dG9uKGlzU3RhcnRJbnN0YW5jZVN0YXR1cywgZm9ybVJ1bnRpbWVJbnN0LCBwYWdlSG9zdEluc3RhbmNlLCBwYWdlUmVhZHlJbm5lclBhcmFzKSB7XG4gICAgaWYgKHBhZ2VSZWFkeUlubmVyUGFyYXMuamI0ZGNBY3Rpb25zICYmIHBhZ2VSZWFkeUlubmVyUGFyYXMuamI0ZGNBY3Rpb25zLmpiNGRjQWN0aW9uTGlzdCkge1xuICAgICAgdmFyIGJ1dHRvbkVsZW07XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFnZVJlYWR5SW5uZXJQYXJhcy5qYjRkY0FjdGlvbnMuamI0ZGNBY3Rpb25MaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBhY3Rpb25PYmogPSBwYWdlUmVhZHlJbm5lclBhcmFzLmpiNGRjQWN0aW9ucy5qYjRkY0FjdGlvbkxpc3RbaV07XG5cbiAgICAgICAgaWYgKGFjdGlvbk9iai5qdWVsUnVuUmVzdWx0UE8uYm9vbGVhblJlc3VsdCkge1xuICAgICAgICAgIGlmIChhY3Rpb25PYmouYWN0aW9uVHlwZSA9PSBcInNlbmRcIikge1xuICAgICAgICAgICAgdmFyIHNlbmRBY3Rpb25PYmplY3QgPSBPYmplY3QuY3JlYXRlKFNlbmRBY3Rpb24pO1xuICAgICAgICAgICAgYnV0dG9uRWxlbSA9IHNlbmRBY3Rpb25PYmplY3QuSW5zdGFuY2UoaXNTdGFydEluc3RhbmNlU3RhdHVzLCBmb3JtUnVudGltZUluc3QsIHBhZ2VIb3N0SW5zdGFuY2UsIHBhZ2VSZWFkeUlubmVyUGFyYXMsIGFjdGlvbk9iaik7XG4gICAgICAgICAgfSBlbHNlIGlmIChhY3Rpb25PYmouYWN0aW9uVHlwZSA9PSBcInJlY2FsbFwiKSB7XG4gICAgICAgICAgICB2YXIgY2FsbGJhY2tBY3Rpb25PYmplY3QgPSBPYmplY3QuY3JlYXRlKFJlY2FsbEFjdGlvbik7XG4gICAgICAgICAgICBidXR0b25FbGVtID0gY2FsbGJhY2tBY3Rpb25PYmplY3QuSW5zdGFuY2UoaXNTdGFydEluc3RhbmNlU3RhdHVzLCBmb3JtUnVudGltZUluc3QsIHBhZ2VIb3N0SW5zdGFuY2UsIHBhZ2VSZWFkeUlubmVyUGFyYXMsIGFjdGlvbk9iaik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgJChcIiNmbG93V29ya0FjdGlvbkJ1dHRvbldyYXBPdXRlclwiKS5hcHBlbmQoYnV0dG9uRWxlbS5lbGVtKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgR2V0QWN0aW9uT2JqOiBmdW5jdGlvbiBHZXRBY3Rpb25PYmooKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFjdGlvbkF1dG9TZW5kOiBcImZhbHNlXCIsXG4gICAgICBhY3Rpb25DQ1JlY2VpdmVPYmplY3RzOiBcIltdXCIsXG4gICAgICBhY3Rpb25DYWxsQXBpczogXCJbXVwiLFxuICAgICAgYWN0aW9uQ2FsbENvbXBsZXRlOiBcInRydWVcIixcbiAgICAgIGFjdGlvbkNhbGxKc01ldGhvZDogbnVsbCxcbiAgICAgIGFjdGlvbkNhcHRpb246IFwi6I2J56i/XCIsXG4gICAgICBhY3Rpb25Db2RlOiBcImFjdGlvbl81MTYwMDk3NzVcIixcbiAgICAgIGFjdGlvbkNvbmZpcm06IFwiZmFsc2VcIixcbiAgICAgIGFjdGlvbkRpc3BsYXlDb25kaXRpb25FZGl0VGV4dDogbnVsbCxcbiAgICAgIGFjdGlvbkRpc3BsYXlDb25kaXRpb25FZGl0VmFsdWU6IG51bGwsXG4gICAgICBhY3Rpb25FeGVjdXRlVmFyaWFibGVzOiBcIltdXCIsXG4gICAgICBhY3Rpb25IVE1MQ2xhc3M6IG51bGwsXG4gICAgICBhY3Rpb25IVE1MSWQ6IG51bGwsXG4gICAgICBhY3Rpb25NYWluUmVjZWl2ZU9iamVjdHM6IFwiW11cIixcbiAgICAgIGFjdGlvblJ1blNxbHM6IFwiW11cIixcbiAgICAgIGFjdGlvblNlbmRNZXNzYWdlSWQ6IG51bGwsXG4gICAgICBhY3Rpb25TZW5kU2lnbmFsSWQ6IG51bGwsXG4gICAgICBhY3Rpb25TaG93T3BpbmlvbkRpYWxvZzogXCJmYWxzZVwiLFxuICAgICAgYWN0aW9uVHlwZTogXCJzZW5kXCIsXG4gICAgICBhY3Rpb25VcGRhdGVGaWVsZHM6IFwiW11cIixcbiAgICAgIGFjdGlvblZhbGlkYXRlOiBcIuaXoFwiLFxuICAgICAgYWN0aW9uc09waW5pb25CaW5kVG9FbGVtSWQ6IG51bGwsXG4gICAgICBhY3Rpb25zT3BpbmlvbkJpbmRUb0ZpZWxkOiBudWxsLFxuICAgICAganVlbFJ1blJlc3VsdFBPOiB7XG4gICAgICAgIGJvb2xlYW5SZXN1bHQ6IHRydWUsXG4gICAgICAgIG1lc3NhZ2U6IFwiXCIsXG4gICAgICAgIHN0cmluZ1Jlc3VsdDogXCJcIixcbiAgICAgICAgc3VjY2VzczogdHJ1ZVxuICAgICAgfSxcbiAgICAgIGFjdGlvbkRpc2FibGU6IFwiZW5hYmxlXCIsXG4gICAgICBhY3Rpb25SZW1hcms6IFwiXCJcbiAgICB9O1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRmxvd1J1bnRpbWVQYWdlT2JqZWN0ID0ge1xuICBfd2ViRm9ybVJUUGFyYXM6IG51bGwsXG4gIF9mb3JtUnVudGltZUluc3Q6IG51bGwsXG4gIEZPUk1fUlVOVElNRV9DQVRFR09SWV9GTE9XOiBcIklzRGVwZW5kZW5jZUZsb3dcIixcbiAgX2Zsb3dJbnN0YW5jZVJ1bnRpbWVQTzogbnVsbCxcbiAgX2lzQ3JlYXRlZE1vZGVsZXJWaWV3OiBmYWxzZSxcbiAgYnVpbGRQYWdlUmVhZHlJbm5lclBhcmFzOiBmdW5jdGlvbiBidWlsZFBhZ2VSZWFkeUlubmVyUGFyYXMoaXNTdGFydEluc3RhbmNlU3RhdHVzLCByZWNvcmRJZCwgZmxvd0luc3RhbmNlUnVudGltZVBPLCBmbG93SW5zdGFuY2VSdW50aW1lUE9DYWNoZUtleSkge1xuICAgIHJldHVybiB7XG4gICAgICByZWNvcmRJZDogcmVjb3JkSWQsXG4gICAgICBmb3JtSWQ6IGZsb3dJbnN0YW5jZVJ1bnRpbWVQTy5qYjRkY0Zvcm1JZCxcbiAgICAgIGN1cnJlbnROb2RlS2V5OiBmbG93SW5zdGFuY2VSdW50aW1lUE8uY3VycmVudE5vZGVLZXksXG4gICAgICBjdXJyZW50Tm9kZU5hbWU6IGZsb3dJbnN0YW5jZVJ1bnRpbWVQTy5jdXJyZW50Tm9kZU5hbWUsXG4gICAgICBtb2RlbElkOiBmbG93SW5zdGFuY2VSdW50aW1lUE8ubW9kZWxJbnRlZ3JhdGVkRW50aXR5Lm1vZGVsSWQsXG4gICAgICBtb2RlbFJlS2V5OiBmbG93SW5zdGFuY2VSdW50aW1lUE8ubW9kZWxJbnRlZ3JhdGVkRW50aXR5Lm1vZGVsUmVLZXksXG4gICAgICBjdXJyZW50VGFza0lkOiBmbG93SW5zdGFuY2VSdW50aW1lUE8uZXhlY3V0aW9uVGFza0VudGl0eSA/IGZsb3dJbnN0YW5jZVJ1bnRpbWVQTy5leGVjdXRpb25UYXNrRW50aXR5LmV4dGFza0lkIDogXCJcIixcbiAgICAgIGZsb3dJbnN0YW5jZVJ1bnRpbWVQT0NhY2hlS2V5OiBmbG93SW5zdGFuY2VSdW50aW1lUE9DYWNoZUtleSxcbiAgICAgIGZsb3dJbnN0YW5jZVJ1bnRpbWVQTzogZmxvd0luc3RhbmNlUnVudGltZVBPLFxuICAgICAgaXNTdGFydEluc3RhbmNlU3RhdHVzOiBpc1N0YXJ0SW5zdGFuY2VTdGF0dXMsXG4gICAgICBqYjRkY0FjdGlvbnM6IGZsb3dJbnN0YW5jZVJ1bnRpbWVQTy5qYjRkY0FjdGlvbnNcbiAgICB9O1xuICB9LFxuICBwYWdlUmVhZHlGb3JTdGFydFN0YXR1czogZnVuY3Rpb24gcGFnZVJlYWR5Rm9yU3RhcnRTdGF0dXMoaXNTdGFydEluc3RhbmNlU3RhdHVzLCBmbG93SW5zdGFuY2VSdW50aW1lUE8sIGZsb3dJbnN0YW5jZVJ1bnRpbWVQT0NhY2hlS2V5LCBwYWdlSG9zdEluc3RhbmNlKSB7XG4gICAgdGhpcy5fZm9ybVJ1bnRpbWVJbnN0ID0gT2JqZWN0LmNyZWF0ZShGb3JtUnVudGltZSk7XG4gICAgRmxvd1J1bnRpbWVQYWdlT2JqZWN0Ll9mbG93SW5zdGFuY2VSdW50aW1lUE8gPSBmbG93SW5zdGFuY2VSdW50aW1lUE87XG4gICAgdmFyIHJlY29yZElkID0gU3RyaW5nVXRpbGl0eS5HdWlkKCk7XG4gICAgdmFyIHBhZ2VSZWFkeUlubmVyUGFyYXMgPSB0aGlzLmJ1aWxkUGFnZVJlYWR5SW5uZXJQYXJhcyhpc1N0YXJ0SW5zdGFuY2VTdGF0dXMsIHJlY29yZElkLCBmbG93SW5zdGFuY2VSdW50aW1lUE8sIGZsb3dJbnN0YW5jZVJ1bnRpbWVQT0NhY2hlS2V5KTtcbiAgICBjb25zb2xlLmxvZyhwYWdlUmVhZHlJbm5lclBhcmFzKTtcblxuICAgIHRoaXMuX2Zvcm1SdW50aW1lSW5zdC5Jbml0aWFsaXphdGlvbih7XG4gICAgICBcIkluc3RhbmNlSWRcIjogZmxvd0luc3RhbmNlUnVudGltZVBPLmluc3RhbmNlRW50aXR5Lmluc3RJZCxcbiAgICAgIFwiUmVuZGVyZXJUb0lkXCI6IFwiaHRtbERlc2lnblJ1bnRpbWVXcmFwXCIsXG4gICAgICBcIkZvcm1JZFwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLmZvcm1JZCxcbiAgICAgIFwiUmVjb3JkSWRcIjogcmVjb3JkSWQsXG4gICAgICBcIkJ1dHRvbklkXCI6IFwiXCIsXG4gICAgICBcIk9wZXJhdGlvblR5cGVcIjogQmFzZVV0aWxpdHkuR2V0QWRkT3BlcmF0aW9uTmFtZSgpLFxuICAgICAgXCJJc1ByZXZpZXdcIjogZmFsc2UsXG4gICAgICBcIlJlbmRlcmVyQ2hhaW5Db21wbGV0ZWRGdW5jXCI6IEZsb3dSdW50aW1lUGFnZU9iamVjdC5mb3JtUmVuZGVyZXJDaGFpbkNvbXBsZXRlZEZ1bmMsXG4gICAgICBcIkxpc3RGb3JtQnV0dG9uRWxlbUlkXCI6IFwiXCIsXG4gICAgICBcIldlYkZvcm1SVFBhcmFzXCI6IHt9LFxuICAgICAgXCJGb3JtUnVudGltZUNhdGVnb3J5XCI6IEZsb3dSdW50aW1lUGFnZU9iamVjdC5GT1JNX1JVTlRJTUVfQ0FURUdPUllfRkxPVyxcbiAgICAgIFwiUHJlSGFuZGxlRm9ybUh0bWxSdW50aW1lRnVuY1wiOiB0aGlzLnByZUhhbmRsZUZvcm1IdG1sUnVudGltZUZ1bmMsXG4gICAgICBcIkZsb3dJbnN0YW5jZVJ1bnRpbWVQT1wiOiBmbG93SW5zdGFuY2VSdW50aW1lUE8sXG4gICAgICBcIkZsb3dNb2RlbFJ1bnRpbWVQT0NhY2hlS2V5XCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMuZmxvd0luc3RhbmNlUnVudGltZVBPQ2FjaGVLZXksXG4gICAgICBcIklzU3RhcnRJbnN0YW5jZVN0YXR1c1wiOiBpc1N0YXJ0SW5zdGFuY2VTdGF0dXMsXG4gICAgICBcIkN1cnJlbnROb2RlS2V5XCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMuY3VycmVudE5vZGVLZXksXG4gICAgICBcIkN1cnJlbnROb2RlTmFtZVwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLmN1cnJlbnROb2RlTmFtZSxcbiAgICAgIFwiTW9kZWxJZFwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLm1vZGVsSWQsXG4gICAgICBcIk1vZGVsUmVLZXlcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5tb2RlbFJlS2V5LFxuICAgICAgXCJDdXJyZW50VGFza0lkXCI6IFwiXCJcbiAgICB9KTtcblxuICAgIHRoaXMucmVuZGVyZXJBY3Rpb25CdXR0b25zKGlzU3RhcnRJbnN0YW5jZVN0YXR1cywgdGhpcy5fZm9ybVJ1bnRpbWVJbnN0LCBwYWdlSG9zdEluc3RhbmNlLCBwYWdlUmVhZHlJbm5lclBhcmFzKTtcbiAgICByZXR1cm4gdGhpcy5fZm9ybVJ1bnRpbWVJbnN0O1xuICB9LFxuICBwYWdlUmVhZHlGb3JQcm9jZXNzU3RhdHVzOiBmdW5jdGlvbiBwYWdlUmVhZHlGb3JQcm9jZXNzU3RhdHVzKGlzU3RhcnRJbnN0YW5jZVN0YXR1cywgZmxvd0luc3RhbmNlUnVudGltZVBPLCBmbG93SW5zdGFuY2VSdW50aW1lUE9DYWNoZUtleSwgcGFnZUhvc3RJbnN0YW5jZSkge1xuICAgIHRoaXMuX2Zvcm1SdW50aW1lSW5zdCA9IE9iamVjdC5jcmVhdGUoRm9ybVJ1bnRpbWUpO1xuICAgIEZsb3dSdW50aW1lUGFnZU9iamVjdC5fZmxvd0luc3RhbmNlUnVudGltZVBPID0gZmxvd0luc3RhbmNlUnVudGltZVBPO1xuICAgIHZhciByZWNvcmRJZCA9IGZsb3dJbnN0YW5jZVJ1bnRpbWVQTy5pbnN0YW5jZUVudGl0eS5pbnN0UnVCdXNpbmVzc0tleTtcbiAgICB2YXIgcGFnZVJlYWR5SW5uZXJQYXJhcyA9IHRoaXMuYnVpbGRQYWdlUmVhZHlJbm5lclBhcmFzKGlzU3RhcnRJbnN0YW5jZVN0YXR1cywgcmVjb3JkSWQsIGZsb3dJbnN0YW5jZVJ1bnRpbWVQTywgZmxvd0luc3RhbmNlUnVudGltZVBPQ2FjaGVLZXkpO1xuICAgIGNvbnNvbGUubG9nKHBhZ2VSZWFkeUlubmVyUGFyYXMpO1xuXG4gICAgdGhpcy5fZm9ybVJ1bnRpbWVJbnN0LkluaXRpYWxpemF0aW9uKHtcbiAgICAgIFwiSW5zdGFuY2VJZFwiOiBmbG93SW5zdGFuY2VSdW50aW1lUE8uaW5zdGFuY2VFbnRpdHkuaW5zdElkLFxuICAgICAgXCJSZW5kZXJlclRvSWRcIjogXCJodG1sRGVzaWduUnVudGltZVdyYXBcIixcbiAgICAgIFwiRm9ybUlkXCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMuZm9ybUlkLFxuICAgICAgXCJSZWNvcmRJZFwiOiByZWNvcmRJZCxcbiAgICAgIFwiQnV0dG9uSWRcIjogXCJcIixcbiAgICAgIFwiT3BlcmF0aW9uVHlwZVwiOiBCYXNlVXRpbGl0eS5HZXRVcGRhdGVPcGVyYXRpb25OYW1lKCksXG4gICAgICBcIklzUHJldmlld1wiOiBmYWxzZSxcbiAgICAgIFwiUmVuZGVyZXJDaGFpbkNvbXBsZXRlZEZ1bmNcIjogRmxvd1J1bnRpbWVQYWdlT2JqZWN0LmZvcm1SZW5kZXJlckNoYWluQ29tcGxldGVkRnVuYyxcbiAgICAgIFwiTGlzdEZvcm1CdXR0b25FbGVtSWRcIjogXCJcIixcbiAgICAgIFwiV2ViRm9ybVJUUGFyYXNcIjoge30sXG4gICAgICBcIkZvcm1SdW50aW1lQ2F0ZWdvcnlcIjogRmxvd1J1bnRpbWVQYWdlT2JqZWN0LkZPUk1fUlVOVElNRV9DQVRFR09SWV9GTE9XLFxuICAgICAgXCJQcmVIYW5kbGVGb3JtSHRtbFJ1bnRpbWVGdW5jXCI6IHRoaXMucHJlSGFuZGxlRm9ybUh0bWxSdW50aW1lRnVuYyxcbiAgICAgIFwiRmxvd0luc3RhbmNlUnVudGltZVBPXCI6IGZsb3dJbnN0YW5jZVJ1bnRpbWVQTyxcbiAgICAgIFwiRmxvd01vZGVsUnVudGltZVBPQ2FjaGVLZXlcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5mbG93SW5zdGFuY2VSdW50aW1lUE9DYWNoZUtleSxcbiAgICAgIFwiSXNTdGFydEluc3RhbmNlU3RhdHVzXCI6IGlzU3RhcnRJbnN0YW5jZVN0YXR1cyxcbiAgICAgIFwiQ3VycmVudE5vZGVLZXlcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5jdXJyZW50Tm9kZUtleSxcbiAgICAgIFwiQ3VycmVudE5vZGVOYW1lXCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMuY3VycmVudE5vZGVOYW1lLFxuICAgICAgXCJNb2RlbElkXCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMubW9kZWxJZCxcbiAgICAgIFwiTW9kZWxSZUtleVwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLm1vZGVsUmVLZXksXG4gICAgICBcIkN1cnJlbnRUYXNrSWRcIjogXCJcIlxuICAgIH0pO1xuXG4gICAgdGhpcy5yZW5kZXJlckFjdGlvbkJ1dHRvbnMoaXNTdGFydEluc3RhbmNlU3RhdHVzLCB0aGlzLl9mb3JtUnVudGltZUluc3QsIHBhZ2VIb3N0SW5zdGFuY2UsIHBhZ2VSZWFkeUlubmVyUGFyYXMpO1xuICAgIHJldHVybiB0aGlzLl9mb3JtUnVudGltZUluc3Q7XG4gIH0sXG4gIHJlbmRlcmVyQWN0aW9uQnV0dG9uczogZnVuY3Rpb24gcmVuZGVyZXJBY3Rpb25CdXR0b25zKGlzU3RhcnRJbnN0YW5jZVN0YXR1cywgZm9ybVJ1bnRpbWVJbnN0LCBwYWdlSG9zdEluc3RhbmNlLCBwYWdlUmVhZHlJbm5lclBhcmFzKSB7XG4gICAgQWN0aW9uc1J1bnRpbWVPYmplY3QuQ3JlYXRlQUxMQWN0aW9uQnV0dG9uKGlzU3RhcnRJbnN0YW5jZVN0YXR1cywgZm9ybVJ1bnRpbWVJbnN0LCBwYWdlSG9zdEluc3RhbmNlLCBwYWdlUmVhZHlJbm5lclBhcmFzKTtcbiAgfSxcbiAgcmVuZGVyZXJGbG93TW9kZWxlckZvclRhYk9uQWN0aXZpdHk6IGZ1bmN0aW9uIHJlbmRlcmVyRmxvd01vZGVsZXJGb3JUYWJPbkFjdGl2aXR5KGV2ZW50LCB1aSkge1xuICAgIGlmICghRmxvd1J1bnRpbWVQYWdlT2JqZWN0Ll9pc0NyZWF0ZWRNb2RlbGVyVmlldykge1xuICAgICAgQ3JlYXRlTW9kZWxlclZpZXcoRmxvd1J1bnRpbWVQYWdlT2JqZWN0Ll9mbG93SW5zdGFuY2VSdW50aW1lUE8pO1xuICAgICAgRmxvd1J1bnRpbWVQYWdlT2JqZWN0Ll9pc0NyZWF0ZWRNb2RlbGVyVmlldyA9IHRydWU7XG4gICAgfVxuICB9LFxuICByZW5kZXJlckZsb3dGaWxlQ29udGFpbmVyOiBmdW5jdGlvbiByZW5kZXJlckZsb3dGaWxlQ29udGFpbmVyKGZsb3dJbnN0YW5jZVJ1bnRpbWVQTykge1xuICAgIEZsb3dGaWxlc0xpc3RTaW5nbGVQbHVnaW4uUmVuZGVyZXIoKTtcbiAgfSxcbiAgZm9ybVJlbmRlcmVyQ2hhaW5Db21wbGV0ZWRGdW5jOiBmdW5jdGlvbiBmb3JtUmVuZGVyZXJDaGFpbkNvbXBsZXRlZEZ1bmMoc2VuZGVyQ29uZmlnKSB7XG4gICAgdmFyIGZsb3dJbnN0YW5jZVJ1bnRpbWVQTyA9IHNlbmRlckNvbmZpZy5mbG93SW5zdGFuY2VSdW50aW1lUE87XG4gICAgRmxvd1J1bnRpbWVQYWdlT2JqZWN0LnJlbmRlcmVyRmxvd0ZpbGVDb250YWluZXIoZmxvd0luc3RhbmNlUnVudGltZVBPKTtcbiAgfSxcbiAgcHJlSGFuZGxlRm9ybUh0bWxSdW50aW1lRnVuYzogZnVuY3Rpb24gcHJlSGFuZGxlRm9ybUh0bWxSdW50aW1lRnVuYyhzb3VyY2VSdW50aW1lSHRtbCwgZm9ybVJ1bnRpbWVJbnN0LCBwcm9wQ29uZmlnKSB7XG4gICAgdmFyIGZsb3dQYWdlQ29udGFpbmVyID0gJChcIjxkaXY+XCIgKyBzb3VyY2VSdW50aW1lSHRtbCArIFwiPGRpdj5cIik7XG4gICAgdmFyIGZsb3dJbnN0YW5jZVJ1bnRpbWVQTyA9IHByb3BDb25maWcuRmxvd0luc3RhbmNlUnVudGltZVBPO1xuXG4gICAgaWYgKGZsb3dQYWdlQ29udGFpbmVyLmNoaWxkcmVuKFwiW3NpbmdsZW5hbWU9J1dGRENUX1RhYkNvbnRhaW5lciddXCIpLmxlbmd0aCA9PSAwKSB7XG4gICAgICBmbG93UGFnZUNvbnRhaW5lciA9ICQoXCI8ZGl2PjxkaXYgY2xhc3M9XFxcIndmZGN0LXRhYnMtb3V0ZXItd3JhcC1ydW50aW1lIGh0bWwtZGVzaWduLXRoZW1lLWRlZmF1bHQtcm9vdC1lbGVtLWNsYXNzXFxcIiBjb250cm9sX2NhdGVnb3J5PVxcXCJDb250YWluZXJDb250cm9sXFxcIiBkZXNjPVxcXCJcXFwiIGdyb3VwbmFtZT1cXFwiXFxcIiBpZD1cXFwidGFic193cmFwXzUxODYyNzYxNlxcXCIgaXNfamJ1aWxkNGRjX2RhdGE9XFxcImZhbHNlXFxcIiBqYnVpbGQ0ZGNfY3VzdG9tPVxcXCJ0cnVlXFxcIiBuYW1lPVxcXCJ0YWJzX3dyYXBfNTE4NjI3NjE2XFxcIiBwbGFjZWhvbGRlcj1cXFwiXFxcIiBzZXJpYWxpemU9XFxcImZhbHNlXFxcIiBzaG93X3JlbW92ZV9idXR0b249XFxcImZhbHNlXFxcIiBzaW5nbGVuYW1lPVxcXCJXRkRDVF9UYWJDb250YWluZXJcXFwiIHN0YXR1cz1cXFwiZW5hYmxlXFxcIiBzdHlsZT1cXFwiXFxcIiBjbGllbnRfcmVzb2x2ZT1cXFwiV0ZEQ1RfVGFiQ29udGFpbmVyXFxcIj48ZGl2PlwiKTtcbiAgICAgIGZsb3dQYWdlQ29udGFpbmVyLmNoaWxkcmVuKFwiW3NpbmdsZW5hbWU9J1dGRENUX1RhYkNvbnRhaW5lciddXCIpLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1sYWJlbCB3ZmRjdC10YWJzLWxhYmVsLXJ1bnRpbWVcXFwiIHRhYl9pZD1cXFwidGFiX2NvbnRlbnRfZmxvd19mb3JtXzk5OVxcXCI+XCIgKyBmbG93SW5zdGFuY2VSdW50aW1lUE8ubW9kZWxOYW1lICsgXCI8L2Rpdj5cIik7XG4gICAgICBmbG93UGFnZUNvbnRhaW5lci5jaGlsZHJlbihcIltzaW5nbGVuYW1lPSdXRkRDVF9UYWJDb250YWluZXInXVwiKS5hcHBlbmQoXCI8ZGl2IGNsYXNzPVxcXCJ3eXNpd3lnLXdmZGN0LXRhYnMtY29udGVudCB3ZmRjdC10YWJzLWNvbnRlbnQtcnVudGltZVxcXCIgaWQ9XFxcInRhYl9jb250ZW50X2Zsb3dfZm9ybV85OTlcXFwiPlwiICsgc291cmNlUnVudGltZUh0bWwgKyBcIjwvZGl2PlwiKTtcbiAgICB9XG5cbiAgICB2YXIgdGFiQ29udGFpbmVyID0gZmxvd1BhZ2VDb250YWluZXIuY2hpbGRyZW4oXCJbc2luZ2xlbmFtZT0nV0ZEQ1RfVGFiQ29udGFpbmVyJ11cIik7XG5cbiAgICBpZiAoZmxvd0luc3RhbmNlUnVudGltZVBPLmpiNGRjQ29udGVudERvY3VtZW50UGx1Z2luID09IFwidXBsb2FkQ29udmVydFRvUERGUGx1Z2luXCIpIHtcbiAgICAgIHRhYkNvbnRhaW5lci5hcHBlbmQoXCI8ZGl2IGNsYXNzPVxcXCJ3eXNpd3lnLXdmZGN0LXRhYnMtbGFiZWwgd2ZkY3QtdGFicy1sYWJlbC1ydW50aW1lXFxcIiB0YWJfaWQ9XFxcInRhYl9jb250ZW50X3VwbG9hZENvbnZlcnRUb1BERlBsdWdpbl85OTlcXFwiPuato+aWhzwvZGl2PlwiKTtcbiAgICAgIHRhYkNvbnRhaW5lci5hcHBlbmQoXCI8ZGl2IGNsYXNzPVxcXCJ3eXNpd3lnLXdmZGN0LXRhYnMtY29udGVudCB3ZmRjdC10YWJzLWNvbnRlbnQtcnVudGltZVxcXCIgaWQ9XFxcInRhYl9jb250ZW50X3VwbG9hZENvbnZlcnRUb1BERlBsdWdpbl85OTlcXFwiPlwiICsgRG9jdW1lbnRDb250ZW50VXBsb2FkQ29udmVydFRvUERGUGx1Z2luLmdldEh0bWxFbGVtKHByb3BDb25maWcpICsgXCI8L2Rpdj5cIik7XG4gICAgfSBlbHNlIGlmIChmbG93SW5zdGFuY2VSdW50aW1lUE8uamI0ZGNDb250ZW50RG9jdW1lbnRQbHVnaW4gPT0gXCJ3cHNPbmxpbmVEb2N1bWVudFBsdWdpblwiKSB7XG4gICAgICB0YWJDb250YWluZXIuYXBwZW5kKFwiPGRpdiBjbGFzcz1cXFwid3lzaXd5Zy13ZmRjdC10YWJzLWxhYmVsIHdmZGN0LXRhYnMtbGFiZWwtcnVudGltZVxcXCIgdGFiX2lkPVxcXCJ0YWJfY29udGVudF93cHNPbmxpbmVEb2N1bWVudFBsdWdpbl85OTlcXFwiPuato+aWhzwvZGl2PlwiKTtcbiAgICAgIHRhYkNvbnRhaW5lci5hcHBlbmQoXCI8ZGl2IGNsYXNzPVxcXCJ3eXNpd3lnLXdmZGN0LXRhYnMtY29udGVudCB3ZmRjdC10YWJzLWNvbnRlbnQtcnVudGltZVxcXCIgaWQ9XFxcInRhYl9jb250ZW50X3dwc09ubGluZURvY3VtZW50UGx1Z2luXzk5OVxcXCI+5pyq5a6e546wPC9kaXY+XCIpO1xuICAgIH1cblxuICAgIHRhYkNvbnRhaW5lci5hcHBlbmQoXCI8ZGl2IGNsYXNzPVxcXCJ3eXNpd3lnLXdmZGN0LXRhYnMtbGFiZWwgd2ZkY3QtdGFicy1sYWJlbC1ydW50aW1lXFxcIiB0YWJfaWQ9XFxcInRhYl9jb250ZW50X2Zsb3dfZmlsZXNfOTk5XFxcIj7pmYTku7Y8L2Rpdj5cIik7XG4gICAgdGFiQ29udGFpbmVyLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1jb250ZW50IHdmZGN0LXRhYnMtY29udGVudC1ydW50aW1lXFxcIiBpZD1cXFwidGFiX2NvbnRlbnRfZmxvd19maWxlc185OTlcXFwiPlwiICsgRmxvd0ZpbGVzTGlzdFNpbmdsZVBsdWdpbi5nZXRIdG1sRWxlbShwcm9wQ29uZmlnKSArIFwiPC9kaXY+XCIpO1xuICAgIHRhYkNvbnRhaW5lci5hcHBlbmQoXCI8ZGl2IGNsYXNzPVxcXCJ3eXNpd3lnLXdmZGN0LXRhYnMtbGFiZWwgd2ZkY3QtdGFicy1sYWJlbC1ydW50aW1lXFxcIiB0YWJfaWQ9XFxcInRhYl9jb250ZW50X2Zsb3dfbW9kZWxlcl85OTlcXFwiPua1geeoi+WbvjwvZGl2PlwiKTtcbiAgICB0YWJDb250YWluZXIuYXBwZW5kKFwiPGRpdiBjbGFzcz1cXFwid3lzaXd5Zy13ZmRjdC10YWJzLWNvbnRlbnQgd2ZkY3QtdGFicy1jb250ZW50LXJ1bnRpbWVcXFwiIGlkPVxcXCJ0YWJfY29udGVudF9mbG93X21vZGVsZXJfOTk5XFxcIiBzdHlsZT0naGVpZ2h0OiBjYWxjKDEwMCUgLSA1MHB4KTsnIG9uQWN0aXZpdHk9XFxcIkZsb3dSdW50aW1lUGFnZU9iamVjdC5yZW5kZXJlckZsb3dNb2RlbGVyRm9yVGFiT25BY3Rpdml0eVxcXCI+PGRpdiBpZD1cXFwiZmxvdy1jYW52YXNcXFwiIHN0eWxlPVxcXCJoZWlnaHQ6MTAwJTtcXFwiPjwvZGl2PjwvZGl2PlwiKTtcbiAgICB0YWJDb250YWluZXIuYXBwZW5kKFwiPGRpdiBjbGFzcz1cXFwid3lzaXd5Zy13ZmRjdC10YWJzLWxhYmVsIHdmZGN0LXRhYnMtbGFiZWwtcnVudGltZVxcXCIgdGFiX2lkPVxcXCJ0YWJfY29udGVudF9mbG93X3NlcXVlbmNlXzk5OVxcXCI+6aG65bqP5Zu+PC9kaXY+XCIpO1xuICAgIHRhYkNvbnRhaW5lci5hcHBlbmQoXCI8ZGl2IGNsYXNzPVxcXCJ3eXNpd3lnLXdmZGN0LXRhYnMtY29udGVudCB3ZmRjdC10YWJzLWNvbnRlbnQtcnVudGltZVxcXCIgaWQ9XFxcInRhYl9jb250ZW50X2Zsb3dfc2VxdWVuY2VfOTk5XFxcIj48L2Rpdj5cIik7XG4gICAgdGFiQ29udGFpbmVyLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1sYWJlbCB3ZmRjdC10YWJzLWxhYmVsLXJ1bnRpbWVcXFwiIHRhYl9pZD1cXFwidGFiX2NvbnRlbnRfZmxvd190YXNrXzk5OVxcXCI+5rWB6L2s5L+h5oGvPC9kaXY+XCIpO1xuICAgIHRhYkNvbnRhaW5lci5hcHBlbmQoXCI8ZGl2IGNsYXNzPVxcXCJ3eXNpd3lnLXdmZGN0LXRhYnMtY29udGVudCB3ZmRjdC10YWJzLWNvbnRlbnQtcnVudGltZVxcXCIgaWQ9XFxcInRhYl9jb250ZW50X2Zsb3dfdGFza185OTlcXFwiPjwvZGl2PlwiKTtcbiAgICB2YXIgbmV3UnVudGltZUh0bWwgPSBmbG93UGFnZUNvbnRhaW5lci5odG1sKCk7XG4gICAgcmV0dXJuIG5ld1J1bnRpbWVIdG1sO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRmxvd1J1bnRpbWVWYXJCdWlsZGVyID0ge1xuICBCdWlsZGVyU2VsZWN0ZWRSZWNlaXZlclRvSW5zdGFuY2VWYXI6IGZ1bmN0aW9uIEJ1aWxkZXJTZWxlY3RlZFJlY2VpdmVyVG9JbnN0YW5jZVZhcihuZXh0Rmxvd05vZGVFbnRpdGllcywgc2VsZWN0ZWRSZWNlaXZlckRhdGEpIHtcbiAgICB2YXIgcmVzdWx0RGF0YSA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWxlY3RlZFJlY2VpdmVyRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHJlY2VpdmVyID0gc2VsZWN0ZWRSZWNlaXZlckRhdGFbaV07XG4gICAgICByZXN1bHREYXRhLnB1c2goe1xuICAgICAgICBuZXh0Tm9kZUlkOiByZWNlaXZlci5mbG93Tm9kZUVudGl0eS5pZCxcbiAgICAgICAgcmVjZWl2ZXJJZDogcmVjZWl2ZXIuaWQsXG4gICAgICAgIHJlY2VpdmVyTmFtZTogcmVjZWl2ZXIubmFtZSxcbiAgICAgICAgcmVjZWl2ZXJUeXBlTmFtZTogcmVjZWl2ZXIudHlwZU5hbWUsXG4gICAgICAgIHJlY2VpdmVUeXBlOiByZWNlaXZlci5yZWNlaXZlVHlwZVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdERhdGE7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7IiwiXCJ1c2Ugc3RyaWN0XCI7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBSZWNhbGxBY3Rpb24gPSB7XG4gIGFjSW50ZXJmYWNlOiB7XG4gICAgcmVzb2x2ZU5leHRQb3NzaWJsZUZsb3dOb2RlOiBcIi9SZXN0L1dvcmtmbG93L1J1blRpbWUvQ2xpZW50L0luc3RhbmNlUnVudGltZS9SZXNvbHZlTmV4dFBvc3NpYmxlRmxvd05vZGVcIixcbiAgICByZWNhbGxNeVNlbmRUYXNrOiBcIi9SZXN0L1dvcmtmbG93L1J1blRpbWUvQ2xpZW50L0luc3RhbmNlUnVudGltZS9SZWNhbGxNeVNlbmRUYXNrXCJcbiAgfSxcbiAgX1Byb3A6IHt9LFxuICBJbnN0YW5jZTogZnVuY3Rpb24gSW5zdGFuY2UoaXNTdGFydEluc3RhbmNlU3RhdHVzLCBmb3JtUnVudGltZUluc3QsIHBhZ2VIb3N0SW5zdGFuY2UsIHBhZ2VSZWFkeUlubmVyUGFyYXMsIGFjdGlvbk9iaikge1xuICAgIGNvbnNvbGUubG9nKGFjdGlvbk9iaik7XG4gICAgdmFyIGh0bWxJZCA9IGFjdGlvbk9iai5hY3Rpb25IVE1MSWQgPyBhY3Rpb25PYmouYWN0aW9uSFRNTElkIDogYWN0aW9uT2JqLmFjdGlvbkNvZGU7XG4gICAgdmFyIGVsZW0gPSAkKCc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cIm9wZXJhdGlvbi1idXR0b24gb3BlcmF0aW9uLWJ1dHRvbi1wcmltYXJ5XCIgaWQ9XCInICsgaHRtbElkICsgJ1wiPjxzcGFuPicgKyBhY3Rpb25PYmouYWN0aW9uQ2FwdGlvbiArICc8L3NwYW4+PC9idXR0b24+Jyk7XG5cbiAgICBpZiAoYWN0aW9uT2JqLmFjdGlvbkRpc2FibGUgPT0gXCJkaXNhYmxlXCIpIHtcbiAgICAgIGVsZW0uYXR0cihcImRpc2FibGVcIiwgXCJkaXNhYmxlXCIpO1xuICAgICAgZWxlbS5hZGRDbGFzcyhcIm9wZXJhdGlvbi1idXR0b24tcHJpbWFyeS1kaXNhYmxlZFwiKTtcbiAgICB9XG5cbiAgICBpZiAoYWN0aW9uT2JqLmFjdGlvblJlbWFyaykge1xuICAgICAgZWxlbS5hdHRyKFwidGl0bGVcIiwgYWN0aW9uT2JqLmFjdGlvblJlbWFyayk7XG4gICAgfVxuXG4gICAgdGhpcy5fUHJvcCA9IHtcbiAgICAgIFwic2VuZGVyXCI6IHRoaXMsXG4gICAgICBcImZsb3dJbnN0YW5jZVJ1bnRpbWVQT1wiOiBwYWdlUmVhZHlJbm5lclBhcmFzLmZsb3dJbnN0YW5jZVJ1bnRpbWVQTyxcbiAgICAgIFwiZmxvd0luc3RhbmNlUnVudGltZVBPQ2FjaGVLZXlcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5mbG93SW5zdGFuY2VSdW50aW1lUE9DYWNoZUtleSxcbiAgICAgIFwiamI0ZGNBY3Rpb25zXCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMuamI0ZGNBY3Rpb25zLFxuICAgICAgXCJmb3JtUnVudGltZUluc3RcIjogZm9ybVJ1bnRpbWVJbnN0LFxuICAgICAgXCJhY3Rpb25PYmpcIjogYWN0aW9uT2JqLFxuICAgICAgXCJpc1N0YXJ0SW5zdGFuY2VTdGF0dXNcIjogaXNTdGFydEluc3RhbmNlU3RhdHVzLFxuICAgICAgXCJwYWdlSG9zdEluc3RhbmNlXCI6IHBhZ2VIb3N0SW5zdGFuY2UsXG4gICAgICBcImN1cnJlbnROb2RlS2V5XCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMuY3VycmVudE5vZGVLZXksXG4gICAgICBcImN1cnJlbnROb2RlTmFtZVwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLmN1cnJlbnROb2RlTmFtZSxcbiAgICAgIFwicmVjb3JkSWRcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5yZWNvcmRJZCxcbiAgICAgIFwibW9kZWxJZFwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLm1vZGVsSWQsXG4gICAgICBcIm1vZGVsUmVLZXlcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5tb2RlbFJlS2V5LFxuICAgICAgXCJjdXJyZW50VGFza0lkXCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMuY3VycmVudFRhc2tJZCxcbiAgICAgIFwiaW5zdGFuY2VJZFwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLmZsb3dJbnN0YW5jZVJ1bnRpbWVQTy5pbnN0YW5jZUVudGl0eS5pbnN0SWRcbiAgICB9O1xuICAgIGVsZW0uYmluZChcImNsaWNrXCIsIHRoaXMuX1Byb3AsIHRoaXMuQnV0dG9uQ2xpY2tFdmVudCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGVsZW06IGVsZW1cbiAgICB9O1xuICB9LFxuICBCdXR0b25DbGlja0V2ZW50OiBmdW5jdGlvbiBCdXR0b25DbGlja0V2ZW50KHNlbmRlcikge1xuICAgIHZhciBfdGhpcyA9IHNlbmRlci5kYXRhLnNlbmRlcjtcbiAgICBEaWFsb2dVdGlsaXR5LkNvbmZpcm0od2luZG93LCBcIuehruiupOaJp+ihjOaSpOWbnuaTjeS9nD9cIiwgZnVuY3Rpb24gKCkge1xuICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydExvYWRpbmcod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0xvYWRpbmdJZCwge30sIFwi57O757uf5aSE55CG5LitLOivt+eojeWAmSFcIik7XG4gICAgICBBamF4VXRpbGl0eS5Qb3N0KF90aGlzLmFjSW50ZXJmYWNlLnJlY2FsbE15U2VuZFRhc2ssIHtcbiAgICAgICAgZXh0YXNrSWQ6IHNlbmRlci5kYXRhLmN1cnJlbnRUYXNrSWRcbiAgICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZyhEaWFsb2dVdGlsaXR5LkRpYWxvZ0xvYWRpbmdJZCk7XG5cbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgaWYgKHdpbmRvdy5PcGVuZXJXaW5kb3dPYmogIT0gbnVsbCAmJiB3aW5kb3cuT3BlbmVyV2luZG93T2JqLmluc3RhbmNlTWFpblRhc2tQcm9jZXNzTGlzdCAhPSBudWxsKSB7XG4gICAgICAgICAgICB3aW5kb3cuT3BlbmVyV2luZG93T2JqLmluc3RhbmNlTWFpblRhc2tQcm9jZXNzTGlzdC5yZWxvYWREYXRhKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBEaWFsb2dVdGlsaXR5LkZyYW1lX0Nsb3NlRGlhbG9nKHdpbmRvdyk7XG4gICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIH1cbiAgICAgIH0sIF90aGlzKTtcbiAgICB9LCBfdGhpcyk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBTZW5kQWN0aW9uID0ge1xuICBhY0ludGVyZmFjZToge1xuICAgIHJlc29sdmVOZXh0UG9zc2libGVGbG93Tm9kZTogXCIvUmVzdC9Xb3JrZmxvdy9SdW5UaW1lL0NsaWVudC9JbnN0YW5jZVJ1bnRpbWUvUmVzb2x2ZU5leHRQb3NzaWJsZUZsb3dOb2RlXCIsXG4gICAgY29tcGxldGVUYXNrOiBcIi9SZXN0L1dvcmtmbG93L1J1blRpbWUvQ2xpZW50L0luc3RhbmNlUnVudGltZS9Db21wbGV0ZVRhc2tcIlxuICB9LFxuICBfUHJvcDoge30sXG4gIEluc3RhbmNlOiBmdW5jdGlvbiBJbnN0YW5jZShpc1N0YXJ0SW5zdGFuY2VTdGF0dXMsIGZvcm1SdW50aW1lSW5zdCwgcGFnZUhvc3RJbnN0YW5jZSwgcGFnZVJlYWR5SW5uZXJQYXJhcywgYWN0aW9uT2JqKSB7XG4gICAgY29uc29sZS5sb2coYWN0aW9uT2JqKTtcbiAgICB2YXIgaHRtbElkID0gYWN0aW9uT2JqLmFjdGlvbkhUTUxJZCA/IGFjdGlvbk9iai5hY3Rpb25IVE1MSWQgOiBhY3Rpb25PYmouYWN0aW9uQ29kZTtcbiAgICB2YXIgZWxlbSA9ICQoJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwib3BlcmF0aW9uLWJ1dHRvbiBvcGVyYXRpb24tYnV0dG9uLXByaW1hcnlcIiBpZD1cIicgKyBodG1sSWQgKyAnXCI+PHNwYW4+JyArIGFjdGlvbk9iai5hY3Rpb25DYXB0aW9uICsgJzwvc3Bhbj48L2J1dHRvbj4nKTtcbiAgICB0aGlzLl9Qcm9wID0ge1xuICAgICAgXCJzZW5kZXJcIjogdGhpcyxcbiAgICAgIFwiZmxvd0luc3RhbmNlUnVudGltZVBPXCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMuZmxvd0luc3RhbmNlUnVudGltZVBPLFxuICAgICAgXCJmbG93SW5zdGFuY2VSdW50aW1lUE9DYWNoZUtleVwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLmZsb3dJbnN0YW5jZVJ1bnRpbWVQT0NhY2hlS2V5LFxuICAgICAgXCJqYjRkY0FjdGlvbnNcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5qYjRkY0FjdGlvbnMsXG4gICAgICBcImZvcm1SdW50aW1lSW5zdFwiOiBmb3JtUnVudGltZUluc3QsXG4gICAgICBcImFjdGlvbk9ialwiOiBhY3Rpb25PYmosXG4gICAgICBcImlzU3RhcnRJbnN0YW5jZVN0YXR1c1wiOiBpc1N0YXJ0SW5zdGFuY2VTdGF0dXMsXG4gICAgICBcInBhZ2VIb3N0SW5zdGFuY2VcIjogcGFnZUhvc3RJbnN0YW5jZSxcbiAgICAgIFwiY3VycmVudE5vZGVLZXlcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5jdXJyZW50Tm9kZUtleSxcbiAgICAgIFwiY3VycmVudE5vZGVOYW1lXCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMuY3VycmVudE5vZGVOYW1lLFxuICAgICAgXCJyZWNvcmRJZFwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLnJlY29yZElkLFxuICAgICAgXCJtb2RlbElkXCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMubW9kZWxJZCxcbiAgICAgIFwibW9kZWxSZUtleVwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLm1vZGVsUmVLZXksXG4gICAgICBcImN1cnJlbnRUYXNrSWRcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5jdXJyZW50VGFza0lkLFxuICAgICAgXCJpbnN0YW5jZUlkXCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMuZmxvd0luc3RhbmNlUnVudGltZVBPLmluc3RhbmNlRW50aXR5Lmluc3RJZFxuICAgIH07XG4gICAgZWxlbS5iaW5kKFwiY2xpY2tcIiwgdGhpcy5fUHJvcCwgdGhpcy5CdXR0b25DbGlja0V2ZW50KTtcbiAgICByZXR1cm4ge1xuICAgICAgZWxlbTogZWxlbVxuICAgIH07XG4gIH0sXG4gIEJ1dHRvbkNsaWNrRXZlbnQ6IGZ1bmN0aW9uIEJ1dHRvbkNsaWNrRXZlbnQoc2VuZGVyKSB7XG4gICAgdmFyIHZhbGlkYXRlUmVzdWx0ID0gVmFsaWRhdGVSdWxlc1J1bnRpbWUuVmFsaWRhdGVTdWJtaXRFbmFibGUoKTtcblxuICAgIGlmIChWYWxpZGF0ZVJ1bGVzUnVudGltZS5BbGVydFZhbGlkYXRlRXJyb3JzKHZhbGlkYXRlUmVzdWx0KSkge1xuICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydExvYWRpbmcod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0xvYWRpbmdJZCwge30sIFwiXCIpO1xuICAgICAgdmFyIF9wcm9wID0gc2VuZGVyLmRhdGE7XG4gICAgICB2YXIgX3RoaXMgPSBfcHJvcC5zZW5kZXI7XG5cbiAgICAgIHZhciBzZW5kRGF0YSA9IF90aGlzLkJ1aWxkU2VuZFRvU2VydmVyRGF0YShfcHJvcCwgbnVsbCk7XG5cbiAgICAgIGlmIChzZW5kRGF0YS5zdWNjZXNzKSB7XG4gICAgICAgIEFqYXhVdGlsaXR5LlBvc3QoX3RoaXMuYWNJbnRlcmZhY2UucmVzb2x2ZU5leHRQb3NzaWJsZUZsb3dOb2RlLCBzZW5kRGF0YS5kYXRhLCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZyhEaWFsb2dVdGlsaXR5LkRpYWxvZ0xvYWRpbmdJZCk7XG4gICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcblxuICAgICAgICAgIGlmIChyZXN1bHQuZGF0YS5uZXh0VGFza0lzRW5kRXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0UmVjZWl2ZXJDb21wbGV0ZWQocmVzdWx0LmRhdGEuYnBtblRhc2tMaXN0LCBbXSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChyZXN1bHQuZGF0YS5jdXJyZW50VGFza0lzTXVsdGlJbnN0YW5jZSAmJiByZXN1bHQuZGF0YS5jdXJyZW50VGFza011bHRpQ29tcGxldGVkSW5zdGFuY2VzICsgMSA8IHJlc3VsdC5kYXRhLmN1cnJlbnRUYXNrTXVsdGlDb3VudEVuZ0luc3RhbmNlcykge1xuICAgICAgICAgICAgdGhpcy5TZWxlY3RSZWNlaXZlckNvbXBsZXRlZChyZXN1bHQuZGF0YS5icG1uVGFza0xpc3QsIFtdKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgVXNlclRhc2tSZWNlaXZlckRpYWxvZ1V0aWxpdHkuU2hvd0RpYWxvZyhfcHJvcC5zZW5kZXIsIHJlc3VsdC5kYXRhLmJwbW5UYXNrTGlzdCwgX3Byb3Auc2VuZGVyLlNlbGVjdFJlY2VpdmVyQ29tcGxldGVkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIF9wcm9wLnNlbmRlcik7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBTZWxlY3RSZWNlaXZlckNvbXBsZXRlZDogZnVuY3Rpb24gU2VsZWN0UmVjZWl2ZXJDb21wbGV0ZWQobmV4dFRhc2tFbnRpdHlMaXN0LCBzZWxlY3RlZFJlY2VpdmVyRGF0YSkge1xuICAgIGNvbnNvbGUubG9nKHNlbGVjdGVkUmVjZWl2ZXJEYXRhKTtcbiAgICBjb25zb2xlLmxvZyh0aGlzLl9Qcm9wLmFjdGlvbk9iai5hY3Rpb25DYXB0aW9uKTtcbiAgICBEaWFsb2dVdGlsaXR5LkNvbmZpcm0od2luZG93LCBcIuehruiupOaJp+ihjOWPkemAgT9cIiwgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGVjdGVkUmVjZWl2ZXJWYXJzID0gRmxvd1J1bnRpbWVWYXJCdWlsZGVyLkJ1aWxkZXJTZWxlY3RlZFJlY2VpdmVyVG9JbnN0YW5jZVZhcihuZXh0VGFza0VudGl0eUxpc3QsIHNlbGVjdGVkUmVjZWl2ZXJEYXRhKTtcbiAgICAgIHZhciBzZW5kRGF0YSA9IHRoaXMuQnVpbGRTZW5kVG9TZXJ2ZXJEYXRhKHRoaXMuX1Byb3AsIHtcbiAgICAgICAgc2VsZWN0ZWRSZWNlaXZlclZhcnM6IGVuY29kZVVSSUNvbXBvbmVudChKc29uVXRpbGl0eS5Kc29uVG9TdHJpbmcoc2VsZWN0ZWRSZWNlaXZlclZhcnMpKVxuICAgICAgfSk7XG4gICAgICBjb25zb2xlLmxvZyhzZW5kRGF0YSk7XG5cbiAgICAgIGlmIChzZW5kRGF0YS5zdWNjZXNzKSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRMb2FkaW5nKHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dMb2FkaW5nSWQsIHt9LCBcIuezu+e7n+WkhOeQhuS4rSzor7fnqI3lgJkhXCIpO1xuICAgICAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuYWNJbnRlcmZhY2UuY29tcGxldGVUYXNrLCBzZW5kRGF0YS5kYXRhLCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZyhEaWFsb2dVdGlsaXR5LkRpYWxvZ0xvYWRpbmdJZCk7XG5cbiAgICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgIGlmICh3aW5kb3cuT3BlbmVyV2luZG93T2JqICE9IG51bGwgJiYgd2luZG93Lk9wZW5lcldpbmRvd09iai5pbnN0YW5jZU1haW5UYXNrUHJvY2Vzc0xpc3QgIT0gbnVsbCkge1xuICAgICAgICAgICAgICB3aW5kb3cuT3BlbmVyV2luZG93T2JqLmluc3RhbmNlTWFpblRhc2tQcm9jZXNzTGlzdC5yZWxvYWREYXRhKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICBEaWFsb2dVdGlsaXR5LkZyYW1lX0Nsb3NlRGlhbG9nKHdpbmRvdyk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydEVycm9yKHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydEVycm9ySWQsIHt9LCByZXN1bHQuZGF0YS5tZXNzYWdlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMuX1Byb3Auc2VuZGVyKTtcbiAgICAgIH1cbiAgICB9LCB0aGlzKTtcbiAgfSxcbiAgQnVpbGRTZW5kVG9TZXJ2ZXJEYXRhOiBmdW5jdGlvbiBCdWlsZFNlbmRUb1NlcnZlckRhdGEoX3Byb3AsIGFwcGVuZFNlbmRNYXApIHtcbiAgICB2YXIgZm9ybURhdGFDb21wbGV4UE8gPSBfcHJvcC5mb3JtUnVudGltZUluc3QuU2VyaWFsaXphdGlvbkZvcm1EYXRhKCk7XG5cbiAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgaXNTdGFydEluc3RhbmNlU3RhdHVzOiBfcHJvcC5pc1N0YXJ0SW5zdGFuY2VTdGF0dXMsXG4gICAgICAgIGFjdGlvbkNvZGU6IF9wcm9wLmFjdGlvbk9iai5hY3Rpb25Db2RlLFxuICAgICAgICBmbG93SW5zdGFuY2VSdW50aW1lUE9DYWNoZUtleTogX3Byb3AuZmxvd0luc3RhbmNlUnVudGltZVBPQ2FjaGVLZXksXG4gICAgICAgIFwiZm9ybVJlY29yZENvbXBsZXhQT1N0cmluZ1wiOiBlbmNvZGVVUklDb21wb25lbnQoSnNvblV0aWxpdHkuSnNvblRvU3RyaW5nKGZvcm1EYXRhQ29tcGxleFBPKSksXG4gICAgICAgIFwiY3VycmVudE5vZGVLZXlcIjogX3Byb3AuY3VycmVudE5vZGVLZXksXG4gICAgICAgIFwiY3VycmVudE5vZGVOYW1lXCI6IF9wcm9wLmN1cnJlbnROb2RlTmFtZSxcbiAgICAgICAgXCJyZWNvcmRJZFwiOiBfcHJvcC5yZWNvcmRJZCxcbiAgICAgICAgXCJtb2RlbElkXCI6IF9wcm9wLm1vZGVsSWQsXG4gICAgICAgIFwibW9kZWxSZUtleVwiOiBfcHJvcC5tb2RlbFJlS2V5LFxuICAgICAgICBcImN1cnJlbnRUYXNrSWRcIjogX3Byb3AuY3VycmVudFRhc2tJZCxcbiAgICAgICAgXCJpbnN0YW5jZUlkXCI6IF9wcm9wLmluc3RhbmNlSWRcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKGFwcGVuZFNlbmRNYXApIHtcbiAgICAgIGZvciAodmFyIGtleSBpbiBhcHBlbmRTZW5kTWFwKSB7XG4gICAgICAgIHJlc3VsdC5kYXRhW2tleV0gPSBhcHBlbmRTZW5kTWFwW2tleV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHVzZXJUYXNrUmVjZWl2ZXJEaWFsb2dPdXRlclZ1ZTtcbnZhciBVc2VyVGFza1JlY2VpdmVyRGlhbG9nVXRpbGl0eSA9IHtcbiAgU2hvd0RpYWxvZzogZnVuY3Rpb24gU2hvd0RpYWxvZyhzZW5kZXIsIG5leHRGbG93Tm9kZUVudGl0aWVzLCBzZWxlY3RSZWNlaXZlckNvbXBsZXRlZEZ1bmMpIHtcbiAgICBpZiAoIXVzZXJUYXNrUmVjZWl2ZXJEaWFsb2dPdXRlclZ1ZSkge1xuICAgICAgJChkb2N1bWVudC5ib2R5KS5hcHBlbmQoXCI8ZGl2IGlkPSd1c2VyVGFza1JlY2VpdmVyRGlhbG9nT3V0ZXInPjx1c2VyLXRhc2stcmVjZWl2ZXItZGlhbG9nIHJlZj0ndXNlclRhc2tSZWNlaXZlckRpYWxvZyc+PC91c2VyLXRhc2stcmVjZWl2ZXItZGlhbG9nPjwvZGl2PlwiKTtcbiAgICAgIHVzZXJUYXNrUmVjZWl2ZXJEaWFsb2dPdXRlclZ1ZSA9IG5ldyBWdWUoe1xuICAgICAgICBlbDogXCIjdXNlclRhc2tSZWNlaXZlckRpYWxvZ091dGVyXCIsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBhY0ludGVyZmFjZToge1xuICAgICAgICAgICAgZ2V0UnVudGltZU1vZGVsV2l0aFN0YXJ0OiBcIi9SZXN0L1dvcmtmbG93L1J1blRpbWUvQ2xpZW50L01vZGVsUnVudGltZS9HZXRSdW50aW1lTW9kZWxXaXRoU3RhcnRcIlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHt9LFxuICAgICAgICBtZXRob2RzOiB7fVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdXNlclRhc2tSZWNlaXZlckRpYWxvZ091dGVyVnVlLiRyZWZzLnVzZXJUYXNrUmVjZWl2ZXJEaWFsb2cuYmVnaW5TZWxlY3RSZWNlaXZlcihzZW5kZXIsIG5leHRGbG93Tm9kZUVudGl0aWVzLCBzZWxlY3RSZWNlaXZlckNvbXBsZXRlZEZ1bmMpO1xuICB9LFxuICBDbG9zZURpYWxvZzogZnVuY3Rpb24gQ2xvc2VEaWFsb2coKSB7XG4gICAgRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZ0VsZW0odXNlclRhc2tSZWNlaXZlckRpYWxvZ091dGVyVnVlLiRyZWZzLnVzZXJUYXNrUmVjZWl2ZXJEaWFsb2cuJHJlZnMudXNlclRhc2tSZWNlaXZlckRpYWxvZ1dyYXApO1xuICAgIHVzZXJUYXNrUmVjZWl2ZXJEaWFsb2dPdXRlclZ1ZSA9IG51bGw7XG4gICAgJChcIiN1c2VyVGFza1JlY2VpdmVyRGlhbG9nT3V0ZXJcIikucmVtb3ZlKCk7XG4gICAgRGlhbG9nVXRpbGl0eS5SZW1vdmVEaWFsb2dSZW1haW5pbmdFbGVtKFwidXNlclRhc2tSZWNlaXZlckRpYWxvZ0lubmVyXCIpO1xuICB9XG59O1xuVnVlLmNvbXBvbmVudChcInVzZXItdGFzay1yZWNlaXZlci1kaWFsb2dcIiwge1xuICBkYXRhOiBmdW5jdGlvbiBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBhY0ludGVyZmFjZToge30sXG4gICAgICBuZXh0Rmxvd05vZGVFbnRpdGllczogW10sXG4gICAgICByZWNlaXZlclRyZWU6IHtcbiAgICAgICAgdHJlZVNldHRpbmc6IHtcbiAgICAgICAgICB2aWV3OiB7XG4gICAgICAgICAgICBkYmxDbGlja0V4cGFuZDogZmFsc2UsXG4gICAgICAgICAgICBzaG93TGluZTogdHJ1ZSxcbiAgICAgICAgICAgIGZvbnRDc3M6IHtcbiAgICAgICAgICAgICAgJ2NvbG9yJzogJ2JsYWNrJyxcbiAgICAgICAgICAgICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNoZWNrOiB7XG4gICAgICAgICAgICBlbmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgbm9jaGVja0luaGVyaXQ6IGZhbHNlLFxuICAgICAgICAgICAgcmFkaW9UeXBlOiBcImFsbFwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBhc3luYzoge1xuICAgICAgICAgICAgZW5hYmxlOiB0cnVlLFxuICAgICAgICAgICAgY29udGVudFR5cGU6IFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCIsXG4gICAgICAgICAgICB1cmw6IEJhc2VVdGlsaXR5LkJ1aWxkQWN0aW9uKFwiL1Jlc3QvV29ya2Zsb3cvUnVuVGltZS9DbGllbnQvUmVjZWl2ZXJSdW50aW1lL0dldEFzeW5jUmVjZWl2ZXJzXCIpLFxuICAgICAgICAgICAgYXV0b1BhcmFtOiBbXCJpZFwiLCBcInR5cGVOYW1lXCIsIFwibmFtZVwiXVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAga2V5OiB7XG4gICAgICAgICAgICAgIG5hbWU6IFwibmFtZVwiLFxuICAgICAgICAgICAgICBjaGlsZHJlbjogXCJydW50aW1lUmVjZWl2ZVVzZXJzXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzaW1wbGVEYXRhOiB7XG4gICAgICAgICAgICAgIGVuYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgaWRLZXk6IFwiaWRcIixcbiAgICAgICAgICAgICAgcElkS2V5OiBcInBhcmVudElkXCIsXG4gICAgICAgICAgICAgIHJvb3RQSWQ6IG51bGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNhbGxiYWNrOiB7XG4gICAgICAgICAgICBvbkNsaWNrOiBmdW5jdGlvbiBvbkNsaWNrKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlKSB7fSxcbiAgICAgICAgICAgIG9uRGJsQ2xpY2s6IGZ1bmN0aW9uIG9uRGJsQ2xpY2soZXZlbnQsIHRyZWVJZCwgdHJlZU5vZGUpIHtcbiAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcy5nZXRaVHJlZU9iaih0cmVlSWQpLl9ob3N0O1xuXG4gICAgICAgICAgICAgIHZhciBmbG93Tm9kZUVudGl0eSA9IHRoaXMuZ2V0WlRyZWVPYmoodHJlZUlkKS5mbG93Tm9kZUVudGl0eTtcbiAgICAgICAgICAgICAgdmFyIHJlY2VpdmVUeXBlID0gdGhpcy5nZXRaVHJlZU9iaih0cmVlSWQpLnJlY2VpdmVUeXBlO1xuXG4gICAgICAgICAgICAgIF90aGlzLmFkZFJlY2VpdmVyVG9TZWxlY3RlZCh0cmVlTm9kZSwgZmxvd05vZGVFbnRpdHksIHJlY2VpdmVUeXBlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBiZWZvcmVBc3luYzogZnVuY3Rpb24gYmVmb3JlQXN5bmModHJlZUlkLCB0cmVlTm9kZSkge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0cmVlSWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgdHJlZU9iak1hcDoge31cbiAgICAgIH0sXG4gICAgICBzZWxlY3RlZFJlY2VpdmVyOiB7XG4gICAgICAgIGNvbHVtbnNDb25maWc6IFt7XG4gICAgICAgICAgdGl0bGU6ICflt7LpgInnlKjmiLcnLFxuICAgICAgICAgIGtleTogJ25hbWUnLFxuICAgICAgICAgIHdpZHRoOiAxODgsXG4gICAgICAgICAgYWxpZ246IFwiY2VudGVyXCJcbiAgICAgICAgfSwge1xuICAgICAgICAgIHRpdGxlOiAn5pON5L2cJyxcbiAgICAgICAgICBzbG90OiAnYWN0aW9uJyxcbiAgICAgICAgICB3aWR0aDogNzAsXG4gICAgICAgICAgYWxpZ246IFwiY2VudGVyXCJcbiAgICAgICAgfV0sXG4gICAgICAgIHJlY2VpdmVyRGF0YTogW11cbiAgICAgIH1cbiAgICB9O1xuICB9LFxuICBtb3VudGVkOiBmdW5jdGlvbiBtb3VudGVkKCkge30sXG4gIGZpbHRlcnM6IHtcbiAgICBmaWx0ZXJSZWNlaXZlckRhdGE6IGZ1bmN0aW9uIGZpbHRlclJlY2VpdmVyRGF0YShyZWNlaXZlckRhdGEsIGZsb3dOb2RlRW50aXR5LCByZWNlaXZlVHlwZSkge1xuICAgICAgcmV0dXJuIHJlY2VpdmVyRGF0YS5maWx0ZXIoZnVuY3Rpb24gKHJlY2VpdmVyKSB7XG4gICAgICAgIHJldHVybiByZWNlaXZlci5mbG93Tm9kZUVudGl0eS5pZCA9PSBmbG93Tm9kZUVudGl0eS5pZCAmJiByZWNlaXZlci5yZWNlaXZlVHlwZSA9PSByZWNlaXZlVHlwZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgbWV0aG9kczoge1xuICAgIGJlZ2luU2VsZWN0UmVjZWl2ZXI6IGZ1bmN0aW9uIGJlZ2luU2VsZWN0UmVjZWl2ZXIoc2VuZGVyLCBuZXh0Rmxvd05vZGVFbnRpdGllcywgc2VsZWN0UmVjZWl2ZXJDb21wbGV0ZWRGdW5jKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICB2YXIgZWxlbSA9IHRoaXMuJHJlZnMudXNlclRhc2tSZWNlaXZlckRpYWxvZ1dyYXA7XG4gICAgICBEaWFsb2dVdGlsaXR5LkRpYWxvZ0VsZW1PYmooZWxlbSwge1xuICAgICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgICAgd2lkdGg6IDY1MCxcbiAgICAgICAgaGVpZ2h0OiA2MDAsXG4gICAgICAgIHRpdGxlOiBcIumAieaLqeaOpeaUtuS6uuWRmFwiLFxuICAgICAgICByZXNpemFibGU6IGZhbHNlLFxuICAgICAgICBidXR0b25zOiB7XG4gICAgICAgICAgXCLnoa7orqRcIjogZnVuY3Rpb24gXygpIHtcbiAgICAgICAgICAgIGlmIChfdGhpcy52YWxpZGF0ZUNvbXBsZXRlRW5hYmxlKCkuc3VjY2Vzcykge1xuICAgICAgICAgICAgICBzZWxlY3RSZWNlaXZlckNvbXBsZXRlZEZ1bmMuY2FsbChzZW5kZXIsIF90aGlzLm5leHRGbG93Tm9kZUVudGl0aWVzLCBfdGhpcy5zZWxlY3RlZFJlY2VpdmVyLnJlY2VpdmVyRGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIuWPlua2iFwiOiBmdW5jdGlvbiBfKCkge1xuICAgICAgICAgICAgVXNlclRhc2tSZWNlaXZlckRpYWxvZ1V0aWxpdHkuQ2xvc2VEaWFsb2coKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG9wZW46IGZ1bmN0aW9uIG9wZW4oZXZlbnQsIHVpKSB7XG4gICAgICAgICAgJChcIi51aS1kaWFsb2ctdGl0bGViYXItY2xvc2VcIiwgJCh0aGlzKS5wYXJlbnQoKSkuaGlkZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMubmV4dEZsb3dOb2RlRW50aXRpZXMgPSBuZXh0Rmxvd05vZGVFbnRpdGllcztcbiAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KHRoaXMuaW5pdFRyZWUsIDUwMCk7XG4gICAgfSxcbiAgICBnZXRSb290T3JnYW5NYWluUmVjZWl2ZU9iamVjdHM6IGZ1bmN0aW9uIGdldFJvb3RPcmdhbk1haW5SZWNlaXZlT2JqZWN0cygpIHtcbiAgICAgIHJldHVybiBbe1xuICAgICAgICBcInZhbHVlXCI6IG51bGwsXG4gICAgICAgIFwidGV4dFwiOiBudWxsLFxuICAgICAgICBcImlkXCI6IFwiMFwiLFxuICAgICAgICBcInBhcmVudElkXCI6IG51bGwsXG4gICAgICAgIFwib3V0ZXJJZFwiOiBudWxsLFxuICAgICAgICBcImNvZGVcIjogXCIwMDAwXCIsXG4gICAgICAgIFwiYXR0cjFcIjogbnVsbCxcbiAgICAgICAgXCJhdHRyMlwiOiBudWxsLFxuICAgICAgICBcImF0dHIzXCI6IG51bGwsXG4gICAgICAgIFwiYXR0cjRcIjogbnVsbCxcbiAgICAgICAgXCJub2RlVHlwZU5hbWVcIjogbnVsbCxcbiAgICAgICAgXCJpY29uXCI6IG51bGwsXG4gICAgICAgIFwibm9jaGVja1wiOiBmYWxzZSxcbiAgICAgICAgXCJpc1BhcmVudFwiOiBcInRydWVcIixcbiAgICAgICAgXCJvcGVuXCI6IGZhbHNlLFxuICAgICAgICBcIm5hbWVcIjogXCLnu4Tnu4fmnLrmnoTnrqHnkIZcIixcbiAgICAgICAgXCJ0eXBlTmFtZVwiOiBcIk9yZ2Fuc1wiLFxuICAgICAgICBcImRlc2NcIjogbnVsbCxcbiAgICAgICAgXCJzdGF0dXNcIjogXCLlkK/nlKhcIixcbiAgICAgICAgXCJmaWx0ZXJcIjogXCJcIixcbiAgICAgICAgXCJvcmRlck51bVwiOiAyMixcbiAgICAgICAgXCJydW50aW1lUmVjZWl2ZVVzZXJzXCI6IG51bGwsXG4gICAgICAgIFwiZ3JvdXBcIjogdHJ1ZSxcbiAgICAgICAgXCJjdXN0TmFtZVwiOiBmYWxzZVxuICAgICAgfV07XG4gICAgfSxcbiAgICBpbml0VHJlZTogZnVuY3Rpb24gaW5pdFRyZWUoKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubmV4dEZsb3dOb2RlRW50aXRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGZsb3dOb2RlRW50aXR5ID0gdGhpcy5uZXh0Rmxvd05vZGVFbnRpdGllc1tpXTtcblxuICAgICAgICBpZiAoZmxvd05vZGVFbnRpdHkuZXh0ZW5zaW9uRWxlbWVudHMgJiYgZmxvd05vZGVFbnRpdHkuZXh0ZW5zaW9uRWxlbWVudHMuamI0ZGNNYWluUmVjZWl2ZU9iamVjdHMgJiYgZmxvd05vZGVFbnRpdHkuZXh0ZW5zaW9uRWxlbWVudHMuamI0ZGNNYWluUmVjZWl2ZU9iamVjdHMucnVudGltZVJlY2VpdmVHcm91cHMpIHtcbiAgICAgICAgICB2YXIgdHJlZU9iaktleSA9IHRoaXMuYnVpbGRVbFRyZWVJZChmbG93Tm9kZUVudGl0eSwgXCJtYWluXCIpO1xuICAgICAgICAgIHRoaXMucmVjZWl2ZXJUcmVlLnRyZWVPYmpNYXBbdHJlZU9iaktleV0gPSAkLmZuLnpUcmVlLmluaXQoJChcIiNcIiArIHRyZWVPYmpLZXkpLCB0aGlzLnJlY2VpdmVyVHJlZS50cmVlU2V0dGluZywgZmxvd05vZGVFbnRpdHkuZXh0ZW5zaW9uRWxlbWVudHMuamI0ZGNNYWluUmVjZWl2ZU9iamVjdHMucnVudGltZVJlY2VpdmVHcm91cHMpO1xuICAgICAgICAgIHRoaXMucmVjZWl2ZXJUcmVlLnRyZWVPYmpNYXBbdHJlZU9iaktleV0uX2hvc3QgPSB0aGlzO1xuICAgICAgICAgIHRoaXMucmVjZWl2ZXJUcmVlLnRyZWVPYmpNYXBbdHJlZU9iaktleV0uZmxvd05vZGVFbnRpdHkgPSBmbG93Tm9kZUVudGl0eTtcbiAgICAgICAgICB0aGlzLnJlY2VpdmVyVHJlZS50cmVlT2JqTWFwW3RyZWVPYmpLZXldLnJlY2VpdmVUeXBlID0gXCJtYWluXCI7XG4gICAgICAgIH0gZWxzZSBpZiAoIWZsb3dOb2RlRW50aXR5LmV4dGVuc2lvbkVsZW1lbnRzIHx8ICFmbG93Tm9kZUVudGl0eS5leHRlbnNpb25FbGVtZW50cy5qYjRkY01haW5SZWNlaXZlT2JqZWN0cyB8fCAhZmxvd05vZGVFbnRpdHkuZXh0ZW5zaW9uRWxlbWVudHMuamI0ZGNNYWluUmVjZWl2ZU9iamVjdHMuamI0ZGNSZWNlaXZlT2JqZWN0TGlzdCkge1xuICAgICAgICAgIHZhciBfdHJlZU9iaktleSA9IHRoaXMuYnVpbGRVbFRyZWVJZChmbG93Tm9kZUVudGl0eSwgXCJtYWluXCIpO1xuXG4gICAgICAgICAgdGhpcy5yZWNlaXZlclRyZWUudHJlZU9iak1hcFtfdHJlZU9iaktleV0gPSAkLmZuLnpUcmVlLmluaXQoJChcIiNcIiArIF90cmVlT2JqS2V5KSwgdGhpcy5yZWNlaXZlclRyZWUudHJlZVNldHRpbmcsIHRoaXMuZ2V0Um9vdE9yZ2FuTWFpblJlY2VpdmVPYmplY3RzKCkpO1xuICAgICAgICAgIHRoaXMucmVjZWl2ZXJUcmVlLnRyZWVPYmpNYXBbX3RyZWVPYmpLZXldLl9ob3N0ID0gdGhpcztcbiAgICAgICAgICB0aGlzLnJlY2VpdmVyVHJlZS50cmVlT2JqTWFwW190cmVlT2JqS2V5XS5mbG93Tm9kZUVudGl0eSA9IGZsb3dOb2RlRW50aXR5O1xuICAgICAgICAgIHRoaXMucmVjZWl2ZXJUcmVlLnRyZWVPYmpNYXBbX3RyZWVPYmpLZXldLnJlY2VpdmVUeXBlID0gXCJtYWluXCI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZmxvd05vZGVFbnRpdHkuZXh0ZW5zaW9uRWxlbWVudHMgJiYgZmxvd05vZGVFbnRpdHkuZXh0ZW5zaW9uRWxlbWVudHMuamI0ZGNDQ1JlY2VpdmVPYmplY3RzICYmIGZsb3dOb2RlRW50aXR5LmV4dGVuc2lvbkVsZW1lbnRzLmpiNGRjQ0NSZWNlaXZlT2JqZWN0cy5ydW50aW1lUmVjZWl2ZUdyb3Vwcykge1xuICAgICAgICAgIHZhciBfdHJlZU9iaktleTIgPSB0aGlzLmJ1aWxkVWxUcmVlSWQoZmxvd05vZGVFbnRpdHksIFwiY2NcIik7XG5cbiAgICAgICAgICB0aGlzLnJlY2VpdmVyVHJlZS50cmVlT2JqTWFwW190cmVlT2JqS2V5Ml0gPSAkLmZuLnpUcmVlLmluaXQoJChcIiNcIiArIF90cmVlT2JqS2V5MiksIHRoaXMucmVjZWl2ZXJUcmVlLnRyZWVTZXR0aW5nLCBmbG93Tm9kZUVudGl0eS5leHRlbnNpb25FbGVtZW50cy5qYjRkY0NDUmVjZWl2ZU9iamVjdHMucnVudGltZVJlY2VpdmVHcm91cHMpO1xuICAgICAgICAgIHRoaXMucmVjZWl2ZXJUcmVlLnRyZWVPYmpNYXBbX3RyZWVPYmpLZXkyXS5faG9zdCA9IHRoaXM7XG4gICAgICAgICAgdGhpcy5yZWNlaXZlclRyZWUudHJlZU9iak1hcFtfdHJlZU9iaktleTJdLmZsb3dOb2RlRW50aXR5ID0gZmxvd05vZGVFbnRpdHk7XG4gICAgICAgICAgdGhpcy5yZWNlaXZlclRyZWUudHJlZU9iak1hcFtfdHJlZU9iaktleTJdLnJlY2VpdmVUeXBlID0gXCJjY1wiO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBidWlsZFVsVHJlZUlkOiBmdW5jdGlvbiBidWlsZFVsVHJlZUlkKGZsb3dOb2RlRW50aXR5LCByZWNlaXZlVHlwZSkge1xuICAgICAgcmV0dXJuICd1bFRyZWVfJyArIHJlY2VpdmVUeXBlICsgXCJfXCIgKyBmbG93Tm9kZUVudGl0eS5pZDtcbiAgICB9LFxuICAgIGFkZFRyZWVTZWxlY3RlZFJlY2VpdmVyVG9TZWxlY3RlZDogZnVuY3Rpb24gYWRkVHJlZVNlbGVjdGVkUmVjZWl2ZXJUb1NlbGVjdGVkKGZsb3dOb2RlRW50aXR5LCByZWNlaXZlVHlwZSkge1xuICAgICAgdmFyIHRyZWVLZXkgPSB0aGlzLmJ1aWxkVWxUcmVlSWQoZmxvd05vZGVFbnRpdHksIHJlY2VpdmVUeXBlKTtcbiAgICAgIHZhciB0cmVlT2JqZWN0ID0gdGhpcy5yZWNlaXZlclRyZWUudHJlZU9iak1hcFt0cmVlS2V5XTtcblxuICAgICAgaWYgKHRyZWVPYmplY3QpIHtcbiAgICAgICAgdmFyIHNlbGVjdE5vZGVzID0gdHJlZU9iamVjdC5nZXRTZWxlY3RlZE5vZGVzKCk7XG5cbiAgICAgICAgaWYgKHNlbGVjdE5vZGVzICYmIHNlbGVjdE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aGlzLmFkZFJlY2VpdmVyVG9TZWxlY3RlZChzZWxlY3ROb2Rlc1swXSwgZmxvd05vZGVFbnRpdHksIHJlY2VpdmVUeXBlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgYWRkUmVjZWl2ZXJUb1NlbGVjdGVkOiBmdW5jdGlvbiBhZGRSZWNlaXZlclRvU2VsZWN0ZWQoc2VsZWN0Tm9kZSwgZmxvd05vZGVFbnRpdHksIHJlY2VpdmVUeXBlKSB7XG4gICAgICB2YXIgaXNNdWx0aUluc3RhbmNlVGFzayA9IHRoaXMuaXNNdWx0aUluc3RhbmNlVGFzayhmbG93Tm9kZUVudGl0eSk7XG4gICAgICB2YXIgaW5uZXJTaW5nbGVJZCA9IGZsb3dOb2RlRW50aXR5LmlkICsgXCJfXCIgKyByZWNlaXZlVHlwZSArIFwiX1wiICsgc2VsZWN0Tm9kZS5pZDtcblxuICAgICAgaWYgKHNlbGVjdE5vZGUudHlwZU5hbWUgPT0gXCJTaW5nbGVVc2VyXCIpIHtcbiAgICAgICAgc2VsZWN0Tm9kZS5pbm5lclNpbmdsZUlkID0gaW5uZXJTaW5nbGVJZDtcbiAgICAgICAgc2VsZWN0Tm9kZS5mbG93Tm9kZUVudGl0eSA9IGZsb3dOb2RlRW50aXR5O1xuICAgICAgICBzZWxlY3ROb2RlLnJlY2VpdmVUeXBlID0gcmVjZWl2ZVR5cGU7XG5cbiAgICAgICAgaWYgKChyZWNlaXZlVHlwZSA9PSBcImNjXCIgfHwgaXNNdWx0aUluc3RhbmNlVGFzaykgJiYgIUFycmF5VXRpbGl0eS5FeGlzdCh0aGlzLnNlbGVjdGVkUmVjZWl2ZXIucmVjZWl2ZXJEYXRhLCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgIHJldHVybiBpdGVtLmlubmVyU2luZ2xlSWQgPT0gaW5uZXJTaW5nbGVJZDtcbiAgICAgICAgfSkpIHtcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkUmVjZWl2ZXIucmVjZWl2ZXJEYXRhLnB1c2goc2VsZWN0Tm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAocmVjZWl2ZVR5cGUgPT0gXCJtYWluXCIgJiYgIWlzTXVsdGlJbnN0YW5jZVRhc2spIHtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGVkUmVjZWl2ZXIucmVjZWl2ZXJEYXRhW2ldLmZsb3dOb2RlRW50aXR5LmlkID09IGZsb3dOb2RlRW50aXR5LmlkICYmIHRoaXMuc2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGFbaV0ucmVjZWl2ZVR5cGUgPT0gcmVjZWl2ZVR5cGUpIHtcbiAgICAgICAgICAgICAgQXJyYXlVdGlsaXR5LkRlbGV0ZSh0aGlzLnNlbGVjdGVkUmVjZWl2ZXIucmVjZWl2ZXJEYXRhLCBpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLnNlbGVjdGVkUmVjZWl2ZXIucmVjZWl2ZXJEYXRhLnB1c2goc2VsZWN0Tm9kZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoaXNNdWx0aUluc3RhbmNlVGFzayAmJiAoc2VsZWN0Tm9kZS50eXBlTmFtZSA9PSBcIlVzZXJzXCIgfHwgc2VsZWN0Tm9kZS50eXBlTmFtZSA9PSBcIlJvbGVcIiB8fCBzZWxlY3ROb2RlLnR5cGVOYW1lID09IFwiT3JnYW5zXCIpKSB7XG4gICAgICAgIGlmIChzZWxlY3ROb2RlLnJ1bnRpbWVSZWNlaXZlVXNlcnMgIT0gbnVsbCAmJiBzZWxlY3ROb2RlLnJ1bnRpbWVSZWNlaXZlVXNlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBzZWxlY3ROb2RlLnJ1bnRpbWVSZWNlaXZlVXNlcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgY2hpbGROb2RlID0gc2VsZWN0Tm9kZS5ydW50aW1lUmVjZWl2ZVVzZXJzW19pXTtcblxuICAgICAgICAgICAgaWYgKGNoaWxkTm9kZS50eXBlTmFtZSA9PSBcIlNpbmdsZVVzZXJcIikge1xuICAgICAgICAgICAgICB0aGlzLmFkZFJlY2VpdmVyVG9TZWxlY3RlZChjaGlsZE5vZGUsIGZsb3dOb2RlRW50aXR5LCByZWNlaXZlVHlwZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBjbGVhclNlbGVjdGVkUmVjZWl2ZXJUb1NlbGVjdGVkOiBmdW5jdGlvbiBjbGVhclNlbGVjdGVkUmVjZWl2ZXJUb1NlbGVjdGVkKGZsb3dOb2RlRW50aXR5LCByZWNlaXZlVHlwZSkge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMuc2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGEubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgdmFyIHJlY2VpdmVyID0gdGhpcy5zZWxlY3RlZFJlY2VpdmVyLnJlY2VpdmVyRGF0YVtpXTtcblxuICAgICAgICBpZiAocmVjZWl2ZXIuZmxvd05vZGVFbnRpdHkuaWQgPT0gZmxvd05vZGVFbnRpdHkuaWQgJiYgcmVjZWl2ZXIucmVjZWl2ZVR5cGUgPT0gcmVjZWl2ZVR5cGUpIHtcbiAgICAgICAgICBBcnJheVV0aWxpdHkuRGVsZXRlKHRoaXMuc2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGEsIGkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBkZWxldGVTZWxlY3RlZFJlY2VpdmVyOiBmdW5jdGlvbiBkZWxldGVTZWxlY3RlZFJlY2VpdmVyKGluZGV4LCByb3cpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zZWxlY3RlZFJlY2VpdmVyLnJlY2VpdmVyRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZFJlY2VpdmVyLnJlY2VpdmVyRGF0YVtpXS5pbm5lclNpbmdsZUlkID09IHJvdy5pbm5lclNpbmdsZUlkKSB7XG4gICAgICAgICAgQXJyYXlVdGlsaXR5LkRlbGV0ZSh0aGlzLnNlbGVjdGVkUmVjZWl2ZXIucmVjZWl2ZXJEYXRhLCBpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgaXNNdWx0aUluc3RhbmNlVGFzazogZnVuY3Rpb24gaXNNdWx0aUluc3RhbmNlVGFzayhmbG93Tm9kZUVudGl0eSkge1xuICAgICAgcmV0dXJuIGZsb3dOb2RlRW50aXR5Lm11bHRpSW5zdGFuY2VUYXNrO1xuICAgIH0sXG4gICAgYnVpbGRUYWJMYWJlbDogZnVuY3Rpb24gYnVpbGRUYWJMYWJlbChmbG93Tm9kZUVudGl0eSkge1xuICAgICAgcmV0dXJuIGZsb3dOb2RlRW50aXR5Lm5hbWUgKyBcIiBbXCIgKyAodGhpcy5pc011bHRpSW5zdGFuY2VUYXNrKGZsb3dOb2RlRW50aXR5KSA/IFwi5aSa5Lq6XCIgOiBcIuWNleS6ulwiKSArIFwiXVwiO1xuICAgIH0sXG4gICAgdmFsaWRhdGVDb21wbGV0ZUVuYWJsZTogZnVuY3Rpb24gdmFsaWRhdGVDb21wbGV0ZUVuYWJsZSgpIHtcbiAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICB2YXIgZXJyb3JNZXNzYWdlcyA9IFtdO1xuICAgICAgdmFyIHN1Y2Nlc3MgPSB0cnVlO1xuXG4gICAgICB2YXIgX2xvb3AgPSBmdW5jdGlvbiBfbG9vcChpKSB7XG4gICAgICAgIGlmIChfdGhpczIubmV4dEZsb3dOb2RlRW50aXRpZXNbaV0udGFza1R5cGVOYW1lID09IFwiY29tLmpiNGRjLndvcmtmbG93LnBvLmJwbW4ucHJvY2Vzcy5CcG1uVXNlclRhc2tcIikge1xuICAgICAgICAgIGlmICghQXJyYXlVdGlsaXR5LkV4aXN0KF90aGlzMi5zZWxlY3RlZFJlY2VpdmVyLnJlY2VpdmVyRGF0YSwgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtLmZsb3dOb2RlRW50aXR5LmlkID09IF90aGlzMi5uZXh0Rmxvd05vZGVFbnRpdGllc1tpXS5pZCAmJiBpdGVtLnJlY2VpdmVUeXBlID09IFwibWFpblwiO1xuICAgICAgICAgIH0pKSB7XG4gICAgICAgICAgICBlcnJvck1lc3NhZ2VzLnB1c2goe1xuICAgICAgICAgICAgICB0YXNrTmFtZTogX3RoaXMyLm5leHRGbG93Tm9kZUVudGl0aWVzW2ldLm5hbWUsXG4gICAgICAgICAgICAgIGZsb3dOb2RlRW50aXR5OiBfdGhpczIubmV4dEZsb3dOb2RlRW50aXRpZXNbaV0sXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IFwi546v6IqCW1wiICsgX3RoaXMyLm5leHRGbG93Tm9kZUVudGl0aWVzW2ldLm5hbWUgKyBcIl3oh7PlsJHpnIDopoHorr7nva7kuIDkuKrmjqXmlLbnlKjmiLchXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm5leHRGbG93Tm9kZUVudGl0aWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIF9sb29wKGkpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXJyb3JNZXNzYWdlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHZhciBlcnJvclRleHRBcnkgPSBbXTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVycm9yTWVzc2FnZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBlcnJvclRleHRBcnkucHVzaChlcnJvck1lc3NhZ2VzW2ldLm1lc3NhZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQoZXJyb3JUZXh0QXJ5LmpvaW4oXCI8YnIgLz5cIiksIHRoaXMpO1xuICAgICAgICBzdWNjZXNzID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN1Y2Nlc3M6IHN1Y2Nlc3NcbiAgICAgIH07XG4gICAgfVxuICB9LFxuICB0ZW1wbGF0ZTogXCI8ZGl2IGlkPVxcXCJ1c2VyVGFza1JlY2VpdmVyRGlhbG9nSW5uZXJcXFwiIHJlZj1cXFwidXNlclRhc2tSZWNlaXZlckRpYWxvZ1dyYXBcXFwiIHN0eWxlPVxcXCJkaXNwbGF5OiBub25lXFxcIj5cXG4gICAgICAgICAgICAgICAgPHRhYnMgbmFtZT1cXFwidXNlclRhc2tSZWNlaXZlckRpYWxvZ1RhYnNcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPHRhYi1wYW5lIDpsYWJlbD1cXFwiYnVpbGRUYWJMYWJlbChmbG93Tm9kZUVudGl0eSlcXFwiIHRhYj1cXFwidXNlclRhc2tSZWNlaXZlckRpYWxvZ1RhYnNcXFwiIHYtZm9yPVxcXCJmbG93Tm9kZUVudGl0eSBpbiBuZXh0Rmxvd05vZGVFbnRpdGllc1xcXCIgOmtleT1cXFwiZmxvd05vZGVFbnRpdHkuaWRcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxjb2xsYXBzZSBhY2NvcmRpb24gdmFsdWU9XFxcIm1haW5SZWNlaXZlclxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYW5lbCBuYW1lPVxcXCJtYWluUmVjZWl2ZXJcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFx1NEUzQlxcdTkwMDFcXHU0RUJBXFx1NTQ1OFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzbG90PVxcXCJjb250ZW50XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJ1c2VyLXRhc2stcmVjZWl2ZXItZGlhbG9nLW91dGVyLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJzZWxlY3RFbmFibGVVc2VyTGlzdFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dWwgOmlkPVxcXCJidWlsZFVsVHJlZUlkKGZsb3dOb2RlRW50aXR5LCdtYWluJylcXFwiIGNsYXNzPVxcXCJ6dHJlZVxcXCIgc3R5bGU9XFxcIndpZHRoOiAyMDBweFxcXCI+PC91bD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNlbGVjdE9wQnV0dG9uQ29udGFpbmVyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNpbmdsZS1vcC1idXR0b25cXFwiIHRpdGxlPVxcXCJcXHU2REZCXFx1NTJBMFxcdTRFQkFcXHU1NDU4XFxcIiBAY2xpY2s9XFxcImFkZFRyZWVTZWxlY3RlZFJlY2VpdmVyVG9TZWxlY3RlZChmbG93Tm9kZUVudGl0eSwnbWFpbicpXFxcIj48SWNvbiB0eXBlPVxcXCJtZC1hcnJvdy1yb3VuZC1mb3J3YXJkXFxcIiAvPjwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic2luZ2xlLW9wLWJ1dHRvblxcXCIgdGl0bGU9XFxcIlxcdTZFMDVcXHU3QTdBXFx1NURGMlxcdTkwMDlcXHU0RUJBXFx1NTQ1OFxcXCIgQGNsaWNrPVxcXCJjbGVhclNlbGVjdGVkUmVjZWl2ZXJUb1NlbGVjdGVkKGZsb3dOb2RlRW50aXR5LCdtYWluJylcXFwiPjxJY29uIHR5cGU9XFxcIm1kLWJhY2tzcGFjZVxcXCIgLz48L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNlbGVjdGVkVXNlckxpc3RcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktdGFibGUgaGVpZ2h0PVxcXCIzMjdcXFwiIHdpZHRoPVxcXCIyNjBcXFwiIHN0cmlwZSA6Y29sdW1ucz1cXFwic2VsZWN0ZWRSZWNlaXZlci5jb2x1bW5zQ29uZmlnXFxcIiA6ZGF0YT1cXFwic2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGEgfCBmaWx0ZXJSZWNlaXZlckRhdGEoZmxvd05vZGVFbnRpdHksICdtYWluJylcXFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJpdi1saXN0LXRhYmxlXFxcIiBzaXplPVxcXCJzbWFsbFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZW1wbGF0ZSBzbG90LXNjb3BlPVxcXCJ7IHJvdywgaW5kZXggfVxcXCIgc2xvdD1cXFwiYWN0aW9uXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibGlzdC1mb250LWljb24tYnV0dG9uLWNsYXNzXFxcIiBAY2xpY2s9XFxcImRlbGV0ZVNlbGVjdGVkUmVjZWl2ZXIoaW5kZXgscm93KVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SWNvbiB0eXBlPVxcXCJtZC1jbG9zZVxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZW1wbGF0ZT4gICAgIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pLXRhYmxlPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3BhbmVsPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGFuZWwgbmFtZT1cXFwiY2NSZWNlaXZlclxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXHU2Mjg0XFx1OTAwMVxcdTRFQkFcXHU1NDU4XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHNsb3Q9XFxcImNvbnRlbnRcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInVzZXItdGFzay1yZWNlaXZlci1kaWFsb2ctb3V0ZXItd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNlbGVjdEVuYWJsZVVzZXJMaXN0XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1bCA6aWQ9XFxcImJ1aWxkVWxUcmVlSWQoZmxvd05vZGVFbnRpdHksJ2NjJylcXFwiIGNsYXNzPVxcXCJ6dHJlZVxcXCIgc3R5bGU9XFxcIndpZHRoOiAyMDBweFxcXCI+PC91bD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNlbGVjdE9wQnV0dG9uQ29udGFpbmVyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNpbmdsZS1vcC1idXR0b25cXFwiIHRpdGxlPVxcXCJcXHU2REZCXFx1NTJBMFxcdTRFQkFcXHU1NDU4XFxcIiBAY2xpY2s9XFxcImFkZFJlY2VpdmVyVG9TZWxlY3RlZChmbG93Tm9kZUVudGl0eSwnY2MnKVxcXCI+PEljb24gdHlwZT1cXFwibWQtYXJyb3ctcm91bmQtZm9yd2FyZFxcXCIgLz48L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNpbmdsZS1vcC1idXR0b25cXFwiIHRpdGxlPVxcXCJcXHU2RTA1XFx1N0E3QVxcdTVERjJcXHU5MDA5XFx1NEVCQVxcdTU0NThcXFwiPjxJY29uIHR5cGU9XFxcIm1kLWJhY2tzcGFjZVxcXCIgLz48L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNlbGVjdGVkVXNlckxpc3RcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktdGFibGUgaGVpZ2h0PVxcXCIzMjdcXFwiIHdpZHRoPVxcXCIyNjBcXFwiIHN0cmlwZSA6Y29sdW1ucz1cXFwic2VsZWN0ZWRSZWNlaXZlci5jb2x1bW5zQ29uZmlnXFxcIiA6ZGF0YT1cXFwic2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGEgfCBmaWx0ZXJSZWNlaXZlckRhdGEoZmxvd05vZGVFbnRpdHksICdjYycpXFxcIlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cXFwiaXYtbGlzdC10YWJsZVxcXCIgc2l6ZT1cXFwic21hbGxcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGVtcGxhdGUgc2xvdC1zY29wZT1cXFwieyByb3csIGluZGV4IH1cXFwiIHNsb3Q9XFxcImFjdGlvblxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImxpc3QtZm9udC1pY29uLWJ1dHRvbi1jbGFzc1xcXCIgQGNsaWNrPVxcXCJkZWxldGVTZWxlY3RlZFJlY2VpdmVyKGluZGV4LHJvdylcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEljb24gdHlwZT1cXFwibWQtY2xvc2VcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGVtcGxhdGU+ICAgICBcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaS10YWJsZT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9wYW5lbD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2NvbGxhcHNlPlxcbiAgICAgICAgICAgICAgICAgICAgPC90YWItcGFuZT5cXG4gICAgICAgICAgICAgICAgPC90YWJzPlxcbiAgICAgICAgICAgIDwvZGl2PlwiXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIERvY3VtZW50Q29udGVudFVwbG9hZENvbnZlcnRUb1BERlBsdWdpbiA9IHtcbiAgb25jaGFuZ2VGaWxlOiBmdW5jdGlvbiBvbmNoYW5nZUZpbGUoc2VuZGVyKSB7XG4gICAgJChcIiNkb2Mtc2VsZWN0ZWQtZmlsZVwiKS5odG1sKCQoc2VuZGVyKS52YWwoKSk7XG4gIH0sXG4gIHVwbG9hZEFuZENvbnZlcnRUb1BERjogZnVuY3Rpb24gdXBsb2FkQW5kQ29udmVydFRvUERGKHNlbmRlciwgaW5zdGFuY2VJZCwgYnVzaW5lc3NLZXkpIHtcbiAgICBpZiAoISQoXCIjc291cmNlRmlsZVwiKS52YWwoKSkge1xuICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQoXCLor7fpgInmi6nopoHkuIrkvKDnmoTmlofku7YhXCIsIHRoaXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcbiAgICAgIGZvcm1EYXRhLmFwcGVuZChcImZpbGVcIiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NvdXJjZUZpbGUnKS5maWxlc1swXSk7XG4gICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICB4aHIub3BlbignUE9TVCcsIEJhc2VVdGlsaXR5LkJ1aWxkQWN0aW9uKFwiL1Jlc3QvV29ya2Zsb3cvUnVuVGltZS9DbGllbnQvRG9jdW1lbnRGaWxlUnVudGltZS9VcGxvYWRGaWxlQW5kQ29udmVydFRvUERGP2luc3RhbmNlSWQ9XCIgKyBpbnN0YW5jZUlkICsgXCImYnVzaW5lc3NLZXk9XCIgKyBidXNpbmVzc0tleSkpO1xuXG4gICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zb2xlLmxvZyh4aHIpO1xuXG4gICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICB2YXIgcmVzdWx0ID0gSnNvblV0aWxpdHkuU3RyaW5nVG9Kc29uKHhoci5yZXNwb25zZSk7XG4gICAgICAgICAgRG9jdW1lbnRDb250ZW50VXBsb2FkQ29udmVydFRvUERGUGx1Z2luLmxvYWRQREZGaWxlVG9WaWV3ZXIocmVzdWx0LmRhdGEuZmlsZUlkKTtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkNsb3NlQnlFbGVtSWQoRGlhbG9nVXRpbGl0eS5EaWFsb2dMb2FkaW5nSWQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KFwi5omn6KGM5Ye66ZSZIVwiICsgeGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5DbG9zZUJ5RWxlbUlkKERpYWxvZ1V0aWxpdHkuRGlhbG9nTG9hZGluZ0lkKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgeGhyLnVwbG9hZC5vbnByb2dyZXNzID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC5sZW5ndGhDb21wdXRhYmxlKSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydExvYWRpbmcod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0xvYWRpbmdJZCwge30sIFwiXCIpO1xuICAgICAgICAgIHZhciBwZXJjZW50ID0gTWF0aC5mbG9vcihldmVudC5sb2FkZWQgLyBldmVudC50b3RhbCAqIDEwMCk7XG4gICAgICAgICAgJChcIiN1cGxvYWQtcHJvY2Vzc1wiKS5odG1sKHBlcmNlbnQgKyBcIiVcIik7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHhoci5zZW5kKGZvcm1EYXRhKTtcbiAgICB9XG4gIH0sXG4gIHRyeUxvYWRIaXN0b3J5RG9jdW1lbnQ6IGZ1bmN0aW9uIHRyeUxvYWRIaXN0b3J5RG9jdW1lbnQocHJvcENvbmZpZykge1xuICAgIEFqYXhVdGlsaXR5LkdldChcIi9SZXN0L1dvcmtmbG93L1J1blRpbWUvQ2xpZW50L0RvY3VtZW50RmlsZVJ1bnRpbWUvVHJ5R2V0TGFzdE9ubGluZURvY3VtZW50XCIsIHtcbiAgICAgIGluc3RhbmNlSWQ6IHByb3BDb25maWcuSW5zdGFuY2VJZFxuICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG5cbiAgICAgIGlmIChyZXN1bHQuc3VjY2VzcyAmJiByZXN1bHQuZGF0YSkge1xuICAgICAgICB0aGlzLmxvYWRQREZGaWxlVG9WaWV3ZXIocmVzdWx0LmRhdGEuZmlsZUlkKTtcbiAgICAgIH1cbiAgICB9LCB0aGlzKTtcbiAgfSxcbiAgbG9hZFBERkZpbGVUb1ZpZXdlcjogZnVuY3Rpb24gbG9hZFBERkZpbGVUb1ZpZXdlcihmaWxlSWQpIHtcbiAgICB2YXIgZmlsZVVybCA9IEJhc2VVdGlsaXR5LkdldFJvb3RQYXRoKCkgKyBcIi9SZXN0L1dvcmtmbG93L1J1blRpbWUvQ2xpZW50L0RvY3VtZW50RmlsZVJ1bnRpbWUvRG93bkxvYWRQZGZEb2N1bWVudEJ5RmlsZUlkP2ZpbGVJZD1cIiArIGZpbGVJZDtcbiAgICAkKFwiI3BkZlZpZXdlclwiKS5hdHRyKFwic3JjXCIsIFwiL0pzL0V4dGVybmFsL1BERkpTLTIuOS4zNTktZGlzdC93ZWIvdmlld2VyLmh0bWw/ZmlsZT1cIiArIGVuY29kZVVSSUNvbXBvbmVudChmaWxlVXJsKSk7XG4gIH0sXG4gIGdldEh0bWxFbGVtOiBmdW5jdGlvbiBnZXRIdG1sRWxlbShwcm9wQ29uZmlnKSB7XG4gICAgY29uc29sZS5sb2cocHJvcENvbmZpZyk7XG4gICAgdmFyIGluc3RhbmNlSWQgPSBwcm9wQ29uZmlnLkluc3RhbmNlSWQ7XG4gICAgdmFyIGJ1c2luZXNzS2V5ID0gcHJvcENvbmZpZy5SZWNvcmRJZDtcbiAgICB0aGlzLnRyeUxvYWRIaXN0b3J5RG9jdW1lbnQocHJvcENvbmZpZyk7XG4gICAgcmV0dXJuIFwiPGRpdiBjbGFzcz1cXFwiZG9jdW1lbnQtb3V0ZXItd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkb2N1bWVudC1idXR0b25zLW91dGVyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJkb2N1bWVudC1idXR0b25zLWlubmVyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJ1cGxvYWQtYW5kLWNvbnZlcnQtYnV0dG9uXFxcIiBkaXNhYmxlZD5cXHU0RTBCXFx1OEY3RFBERlxcdTY1ODdcXHU0RUY2PC9idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwidXBsb2FkLWFuZC1jb252ZXJ0LWJ1dHRvblxcXCIgZGlzYWJsZWQ+XFx1NEUwQlxcdThGN0RcXHU1MzlGXFx1NTlDQlxcdTY1ODdcXHU0RUY2PC9idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwidXBsb2FkLWFuZC1jb252ZXJ0LWJ1dHRvblxcXCIgb25jbGljaz1cXFwiRG9jdW1lbnRDb250ZW50VXBsb2FkQ29udmVydFRvUERGUGx1Z2luLnVwbG9hZEFuZENvbnZlcnRUb1BERih0aGlzLCdcIi5jb25jYXQoaW5zdGFuY2VJZCwgXCInLCdcIikuY29uY2F0KGJ1c2luZXNzS2V5LCBcIicpXFxcIj5cXHU0RTBBXFx1NEYyMFxcdTVFNzZcXHU4RjZDXFx1NjM2MlxcdTRFM0FwZGY8L2J1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiZmlsZS11cGxvYWRcXFwiPlxcdTkwMDlcXHU2MkU5XFx1NjU4N1xcdTRFRjZcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZD1cXFwic291cmNlRmlsZVxcXCJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XFxcImZpbGVcXFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lPVxcXCJpbnB1dEZpbGVcXFwiIGFjY2VwdD1cXFwiLmRvYywuZG9jeCwucGRmXFxcIiBvbmNoYW5nZT1cXFwiRG9jdW1lbnRDb250ZW50VXBsb2FkQ29udmVydFRvUERGUGx1Z2luLm9uY2hhbmdlRmlsZSh0aGlzKVxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNlbGVjdGVkLWZpbGUtbWVzc2FnZVxcXCI+XFx1NURGMlxcdTkwMDlcXHU2NTg3XFx1NEVGNjo8c3BhbiBpZD1cXFwiZG9jLXNlbGVjdGVkLWZpbGVcXFwiPjwvc3Bhbj48L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwidXBsb2FkLXByb2Nlc3NcXFwiIGlkPVxcXCJ1cGxvYWQtcHJvY2Vzc1xcXCI+PC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImRvY3VtZW50LWNvbnRlbnRcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpZnJhbWUgaWQ9XFxcInBkZlZpZXdlclxcXCIgc3JjPVxcXCJcXFwiIHN0eWxlPVxcXCJ3aWR0aDogMTAwJTtoZWlnaHQ6IDEwMCU7Ym9yZGVyOiAwcHhcXFwiPjwvaWZyYW1lPlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlwiKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEZsb3dGaWxlc0xpc3RTaW5nbGVQbHVnaW4gPSB7XG4gIF9wcm9wOiB7fSxcbiAgX2Zsb3dJbnN0YW5jZVJ1bnRpbWVQTzogbnVsbCxcbiAgX2N1cnJlbnROb2RlOiBudWxsLFxuICBfYXV0aG9yaXRpZXNGaWxlQXV0aG9yaXR5OiBudWxsLFxuICBfYXV0aG9yaXRpZXNPbmx5U2VuZEJhY2tDYW5FZGl0OiBcImZhbHNlXCIsXG4gIGdldEh0bWxFbGVtOiBmdW5jdGlvbiBnZXRIdG1sRWxlbShwcm9wQ29uZmlnKSB7XG4gICAgRmxvd0ZpbGVzTGlzdFNpbmdsZVBsdWdpbi5fcHJvcCA9IHByb3BDb25maWc7XG4gICAgRmxvd0ZpbGVzTGlzdFNpbmdsZVBsdWdpbi5fZmxvd0luc3RhbmNlUnVudGltZVBPID0gcHJvcENvbmZpZy5GbG93SW5zdGFuY2VSdW50aW1lUE87XG4gICAgRmxvd0ZpbGVzTGlzdFNpbmdsZVBsdWdpbi5fY3VycmVudE5vZGUgPSBBcnJheVV0aWxpdHkuV2hlcmUoRmxvd0ZpbGVzTGlzdFNpbmdsZVBsdWdpbi5fZmxvd0luc3RhbmNlUnVudGltZVBPLmJwbW5EZWZpbml0aW9ucy5icG1uUHJvY2Vzcy51c2VyVGFza0xpc3QsIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICByZXR1cm4gaXRlbS5pZCA9PSBGbG93RmlsZXNMaXN0U2luZ2xlUGx1Z2luLl9mbG93SW5zdGFuY2VSdW50aW1lUE8uY3VycmVudE5vZGVLZXk7XG4gICAgfSk7XG5cbiAgICBpZiAoRmxvd0ZpbGVzTGlzdFNpbmdsZVBsdWdpbi5fY3VycmVudE5vZGUubGVuZ3RoID09IDApIHtcbiAgICAgIEZsb3dGaWxlc0xpc3RTaW5nbGVQbHVnaW4uX2N1cnJlbnROb2RlID0gRmxvd0ZpbGVzTGlzdFNpbmdsZVBsdWdpbi5fZmxvd0luc3RhbmNlUnVudGltZVBPLmJwbW5EZWZpbml0aW9ucy5icG1uUHJvY2Vzcy5zdGFydEV2ZW50O1xuICAgIH0gZWxzZSB7XG4gICAgICBGbG93RmlsZXNMaXN0U2luZ2xlUGx1Z2luLl9jdXJyZW50Tm9kZSA9IEZsb3dGaWxlc0xpc3RTaW5nbGVQbHVnaW4uX2N1cnJlbnROb2RlWzBdO1xuICAgIH1cblxuICAgIGlmIChGbG93RmlsZXNMaXN0U2luZ2xlUGx1Z2luLl9jdXJyZW50Tm9kZS5leHRlbnNpb25FbGVtZW50cykge1xuICAgICAgRmxvd0ZpbGVzTGlzdFNpbmdsZVBsdWdpbi5fYXV0aG9yaXRpZXNGaWxlQXV0aG9yaXR5ID0gSnNvblV0aWxpdHkuU3RyaW5nVG9Kc29uKEZsb3dGaWxlc0xpc3RTaW5nbGVQbHVnaW4uX2N1cnJlbnROb2RlLmV4dGVuc2lvbkVsZW1lbnRzLmpiNGRjQXV0aG9yaXRpZXMuYXV0aG9yaXRpZXNGaWxlQXV0aG9yaXR5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgRmxvd0ZpbGVzTGlzdFNpbmdsZVBsdWdpbi5fYXV0aG9yaXRpZXNGaWxlQXV0aG9yaXR5ID0ge1xuICAgICAgICBhZGRGaWxlOiBcInRydWVcIlxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gXCI8ZGl2IGlkPVxcXCJGbG93RmlsZXNMaXN0UGx1Z2luQ29udGFpbmVyXFxcIj5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XCI7XG4gIH0sXG4gIGFjSW50ZXJmYWNlOiB7XG4gICAgZ2V0RmlsZUxpc3REYXRhOiBcIi9SZXN0L1dvcmtmbG93L1J1blRpbWUvQ2xpZW50L0luc3RhbmNlRmlsZVJ1bnRpbWUvR2V0QXR0YWNobWVudEZpbGVMaXN0RGF0YVwiLFxuICAgIHVwbG9hZEZpbGU6IFwiL1Jlc3QvV29ya2Zsb3cvUnVuVGltZS9DbGllbnQvSW5zdGFuY2VGaWxlUnVudGltZS9VcGxvYWRGaWxlXCIsXG4gICAgZG93bmxvYWRGaWxlOiBcIi9SZXN0L0J1aWxkZXIvUnVuVGltZS9GaWxlUnVudGltZS9Eb3duTG9hZEZpbGVCeUZpbGVJZFwiLFxuICAgIGRlbGV0ZUZpbGU6IFwiL1Jlc3QvQnVpbGRlci9SdW5UaW1lL0ZpbGVSdW50aW1lL0RlbGV0ZUZpbGVCeUZpbGVJZFwiXG4gIH0sXG4gIFJlbmRlcmVyOiBmdW5jdGlvbiBSZW5kZXJlcigpIHtcbiAgICBjb25zb2xlLmxvZyh0aGlzLl9wcm9wKTtcbiAgICB0aGlzLkJ1aWxkVXBsb2FkQ29udGFpbmVyKCk7XG4gICAgdGhpcy5CdWlsZEZpbGVMaXN0KCk7XG4gIH0sXG4gIFRvVmlld1N0YXR1czogZnVuY3Rpb24gVG9WaWV3U3RhdHVzKCRlbGVtLCBmaWVsZFBPLCByZWxhdGlvbkZvcm1SZWNvcmRDb21wbGV4UG8sIF9yZW5kZXJlckRhdGFDaGFpblBhcmFzKSB7XG4gICAgJChcIiNcIiArIHRoaXMuX3Byb3AudXBsb2FkV2FycElkKS5oaWRlKCk7XG4gICAgJChcIiNcIiArIHRoaXMuX3Byb3AuZWxlbUlkKS5maW5kKFwiLmRlbGV0ZS1idXR0b24tZWxlbVwiKS5oaWRlKCk7XG4gICAgJChcIiNcIiArIHRoaXMuX3Byb3AuZWxlbUlkKS5maW5kKFwiLm1vdmUtdXAtYnV0dG9uLWVsZW1cIikuaGlkZSgpO1xuICAgICQoXCIjXCIgKyB0aGlzLl9wcm9wLmVsZW1JZCkuZmluZChcIi5tb3ZlLWRvd24tYnV0dG9uLWVsZW1cIikuaGlkZSgpO1xuICB9LFxuICBHZXRUaGlzUmVjb3JkSWQ6IGZ1bmN0aW9uIEdldFRoaXNSZWNvcmRJZCgpIHtcbiAgICB2YXIgb2JqSWQgPSBcIlwiO1xuXG4gICAgaWYgKGZvcm1SdW50aW1lSW5zdCAmJiBmb3JtUnVudGltZUluc3QuR2V0V2ViRm9ybVJUUGFyYXMoKSAmJiBmb3JtUnVudGltZUluc3QuR2V0V2ViRm9ybVJUUGFyYXMoKS5SZWNvcmRJZCkge1xuICAgICAgb2JqSWQgPSBmb3JtUnVudGltZUluc3QuR2V0V2ViRm9ybVJUUGFyYXMoKS5SZWNvcmRJZDtcbiAgICB9IGVsc2Uge1xuICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQoXCLmn6Xmib7kuI3liLDnu5HlrprnmoTorrDlvZVJRFwiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gb2JqSWQ7XG4gIH0sXG4gIEdldFRoaXNSZWNvcmRUeXBlOiBmdW5jdGlvbiBHZXRUaGlzUmVjb3JkVHlwZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fcHJvcC5vYmpUeXBlO1xuICB9LFxuICBHZXRVcGxvYWRFbmRQb2ludFJlcXVlc3Q6IGZ1bmN0aW9uIEdldFVwbG9hZEVuZFBvaW50UmVxdWVzdCgpIHtcbiAgICB2YXIgZW5kUG9pbnQgPSBCYXNlVXRpbGl0eS5HZXRSb290UGF0aCgpICsgdGhpcy5hY0ludGVyZmFjZS51cGxvYWRGaWxlO1xuICAgIHZhciBwYXJhcyA9IHtcbiAgICAgIGZpbGVUeXBlOiBcIkF0dGFjaG1lbnRcIixcbiAgICAgIGluc3RhbmNlSWQ6IHRoaXMuX3Byb3AuRmxvd0luc3RhbmNlUnVudGltZVBPLmluc3RhbmNlRW50aXR5Lmluc3RJZCxcbiAgICAgIGJ1c2luZXNzS2V5OiB0aGlzLl9wcm9wLlJlY29yZElkXG4gICAgfTtcbiAgICByZXR1cm4ge1xuICAgICAgZW5kcG9pbnQ6IGVuZFBvaW50LFxuICAgICAgcGFyYW1zOiBwYXJhc1xuICAgIH07XG4gIH0sXG4gIENyZWF0ZURlZmF1bHRUZW1wbGF0ZTogZnVuY3Rpb24gQ3JlYXRlRGVmYXVsdFRlbXBsYXRlKHRlbXBsYXRlSWQpIHtcbiAgICAkKHdpbmRvdy5kb2N1bWVudC5ib2R5KS5hcHBlbmQoXCI8c2NyaXB0IHR5cGU9XFxcInRleHQvdGVtcGxhdGVcXFwiIGlkPVxcXCJcIiArIHRlbXBsYXRlSWQgKyBcIlxcXCI+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJxcS11cGxvYWRlci1zZWxlY3RvciBxcS11cGxvYWRlciBxcS1nYWxsZXJ5XFxcIiBxcS1kcm9wLWFyZWEtdGV4dD1cXFwiXFx1NjJENlxcdTY1M0VcXHU2NTg3XFx1NEVGNlxcdTUyMzBcXHU4RkQ5XFx1OTFDQ1xcdThGREJcXHU4ODRDXFx1NEUwQVxcdTRGMjBcXHUzMDAyXFxcIiBzdHlsZT1cXFwibWluLWhlaWdodDogNzhweDtcXFwiPlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInFxLXRvdGFsLXByb2dyZXNzLWJhci1jb250YWluZXItc2VsZWN0b3IgcXEtdG90YWwtcHJvZ3Jlc3MtYmFyLWNvbnRhaW5lclxcXCI+XFxuICAgICAgICAgICAgICAgIDxkaXYgcm9sZT1cXFwicHJvZ3Jlc3NiYXJcXFwiIGFyaWEtdmFsdWVub3c9XFxcIjBcXFwiIGFyaWEtdmFsdWVtaW49XFxcIjBcXFwiIGFyaWEtdmFsdWVtYXg9XFxcIjEwMFxcXCIgY2xhc3M9XFxcInFxLXRvdGFsLXByb2dyZXNzLWJhci1zZWxlY3RvciBxcS1wcm9ncmVzcy1iYXIgcXEtdG90YWwtcHJvZ3Jlc3MtYmFyXFxcIj48L2Rpdj5cXG4gICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJxcS11cGxvYWQtZHJvcC1hcmVhLXNlbGVjdG9yIHFxLXVwbG9hZC1kcm9wLWFyZWFcXFwiIHFxLWhpZGUtZHJvcHpvbmU+XFxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJxcS11cGxvYWQtZHJvcC1hcmVhLXRleHQtc2VsZWN0b3JcXFwiPjwvc3Bhbj5cXG4gICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJxcS11cGxvYWQtYnV0dG9uLXNlbGVjdG9yIHFxLXVwbG9hZC1idXR0b25cXFwiIHN0eWxlPVxcXCJmbG9hdDogcmlnaHRcXFwiPlxcbiAgICAgICAgICAgICAgICA8ZGl2PlxcdTkwMDlcXHU2MkU5XFx1NjU4N1xcdTRFRjY8L2Rpdj5cXG4gICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwicXEtZHJvcC1wcm9jZXNzaW5nLXNlbGVjdG9yIHFxLWRyb3AtcHJvY2Vzc2luZ1xcXCI+XFxuICAgICAgICAgICAgICAgIDxzcGFuPlByb2Nlc3NpbmcgZHJvcHBlZCBmaWxlcy4uLjwvc3Bhbj5cXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcInFxLWRyb3AtcHJvY2Vzc2luZy1zcGlubmVyLXNlbGVjdG9yIHFxLWRyb3AtcHJvY2Vzc2luZy1zcGlubmVyXFxcIj48L3NwYW4+XFxuICAgICAgICAgICAgPC9zcGFuPlxcbiAgICAgICAgICAgIDx1bCBjbGFzcz1cXFwicXEtdXBsb2FkLWxpc3Qtc2VsZWN0b3IgcXEtdXBsb2FkLWxpc3RcXFwiIHJvbGU9XFxcInJlZ2lvblxcXCIgYXJpYS1saXZlPVxcXCJwb2xpdGVcXFwiIGFyaWEtcmVsZXZhbnQ9XFxcImFkZGl0aW9ucyByZW1vdmFsc1xcXCIgc3R5bGU9XFxcImRpc3BsYXk6IG5vbmVcXFwiPlxcbiAgICAgICAgICAgICAgICA8bGk+XFxuICAgICAgICAgICAgICAgICAgICA8c3BhbiByb2xlPVxcXCJzdGF0dXNcXFwiIGNsYXNzPVxcXCJxcS11cGxvYWQtc3RhdHVzLXRleHQtc2VsZWN0b3IgcXEtdXBsb2FkLXN0YXR1cy10ZXh0XFxcIj48L3NwYW4+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJxcS1wcm9ncmVzcy1iYXItY29udGFpbmVyLXNlbGVjdG9yIHFxLXByb2dyZXNzLWJhci1jb250YWluZXJcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgcm9sZT1cXFwicHJvZ3Jlc3NiYXJcXFwiIGFyaWEtdmFsdWVub3c9XFxcIjBcXFwiIGFyaWEtdmFsdWVtaW49XFxcIjBcXFwiIGFyaWEtdmFsdWVtYXg9XFxcIjEwMFxcXCIgY2xhc3M9XFxcInFxLXByb2dyZXNzLWJhci1zZWxlY3RvciBxcS1wcm9ncmVzcy1iYXJcXFwiPjwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwicXEtdXBsb2FkLXNwaW5uZXItc2VsZWN0b3IgcXEtdXBsb2FkLXNwaW5uZXJcXFwiPjwvc3Bhbj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInFxLXRodW1ibmFpbC13cmFwcGVyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8aW1nIGNsYXNzPVxcXCJxcS10aHVtYm5haWwtc2VsZWN0b3JcXFwiIHFxLW1heC1zaXplPVxcXCIxMjBcXFwiIHFxLXNlcnZlci1zY2FsZT5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJxcS11cGxvYWQtY2FuY2VsLXNlbGVjdG9yIHFxLXVwbG9hZC1jYW5jZWxcXFwiPlg8L2J1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwicXEtdXBsb2FkLXJldHJ5LXNlbGVjdG9yIHFxLXVwbG9hZC1yZXRyeVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcInFxLWJ0biBxcS1yZXRyeS1pY29uXFxcIiBhcmlhLWxhYmVsPVxcXCJSZXRyeVxcXCI+PC9zcGFuPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJldHJ5XFxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cXG5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInFxLWZpbGUtaW5mb1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwicXEtZmlsZS1uYW1lXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcInFxLXVwbG9hZC1maWxlLXNlbGVjdG9yIHFxLXVwbG9hZC1maWxlXFxcIj48L3NwYW4+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJxcS1lZGl0LWZpbGVuYW1lLWljb24tc2VsZWN0b3IgcXEtYnRuIHFxLWVkaXQtZmlsZW5hbWUtaWNvblxcXCIgYXJpYS1sYWJlbD1cXFwiRWRpdCBmaWxlbmFtZVxcXCI+PC9zcGFuPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cXFwicXEtZWRpdC1maWxlbmFtZS1zZWxlY3RvciBxcS1lZGl0LWZpbGVuYW1lXFxcIiB0YWJpbmRleD1cXFwiMFxcXCIgdHlwZT1cXFwidGV4dFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcInFxLXVwbG9hZC1zaXplLXNlbGVjdG9yIHFxLXVwbG9hZC1zaXplXFxcIj48L3NwYW4+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJxcS1idG4gcXEtdXBsb2FkLWRlbGV0ZS1zZWxlY3RvciBxcS11cGxvYWQtZGVsZXRlXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcInFxLWJ0biBxcS1kZWxldGUtaWNvblxcXCIgYXJpYS1sYWJlbD1cXFwiRGVsZXRlXFxcIj48L3NwYW4+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJxcS1idG4gcXEtdXBsb2FkLXBhdXNlLXNlbGVjdG9yIHFxLXVwbG9hZC1wYXVzZVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJxcS1idG4gcXEtcGF1c2UtaWNvblxcXCIgYXJpYS1sYWJlbD1cXFwiUGF1c2VcXFwiPjwvc3Bhbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcInFxLWJ0biBxcS11cGxvYWQtY29udGludWUtc2VsZWN0b3IgcXEtdXBsb2FkLWNvbnRpbnVlXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcInFxLWJ0biBxcS1jb250aW51ZS1pY29uXFxcIiBhcmlhLWxhYmVsPVxcXCJDb250aW51ZVxcXCI+PC9zcGFuPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgIDwvbGk+XFxuICAgICAgICAgICAgPC91bD5cXG5cXG4gICAgICAgICAgICA8ZGlhbG9nIGNsYXNzPVxcXCJxcS1hbGVydC1kaWFsb2ctc2VsZWN0b3JcXFwiPlxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJxcS1kaWFsb2ctbWVzc2FnZS1zZWxlY3RvclxcXCI+PC9kaXY+XFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInFxLWRpYWxvZy1idXR0b25zXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwicXEtY2FuY2VsLWJ1dHRvbi1zZWxlY3RvclxcXCI+Q2xvc2U8L2J1dHRvbj5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgPC9kaWFsb2c+XFxuXFxuICAgICAgICAgICAgPGRpYWxvZyBjbGFzcz1cXFwicXEtY29uZmlybS1kaWFsb2ctc2VsZWN0b3JcXFwiPlxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJxcS1kaWFsb2ctbWVzc2FnZS1zZWxlY3RvclxcXCI+PC9kaXY+XFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInFxLWRpYWxvZy1idXR0b25zXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwicXEtY2FuY2VsLWJ1dHRvbi1zZWxlY3RvclxcXCI+Tm88L2J1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwicXEtb2stYnV0dG9uLXNlbGVjdG9yXFxcIj5ZZXM8L2J1dHRvbj5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgPC9kaWFsb2c+XFxuXFxuICAgICAgICAgICAgPGRpYWxvZyBjbGFzcz1cXFwicXEtcHJvbXB0LWRpYWxvZy1zZWxlY3RvclxcXCI+XFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInFxLWRpYWxvZy1tZXNzYWdlLXNlbGVjdG9yXFxcIj48L2Rpdj5cXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiPlxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJxcS1kaWFsb2ctYnV0dG9uc1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcInFxLWNhbmNlbC1idXR0b24tc2VsZWN0b3JcXFwiPkNhbmNlbDwvYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJxcS1vay1idXR0b24tc2VsZWN0b3JcXFwiPk9rPC9idXR0b24+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgIDwvZGlhbG9nPlxcbiAgICAgICAgPC9kaXY+XFxuICAgIDwvc2NyaXB0PlwiKTtcbiAgfSxcbiAgQnVpbGRVcGxvYWRDb250YWluZXI6IGZ1bmN0aW9uIEJ1aWxkVXBsb2FkQ29udGFpbmVyKCkge1xuICAgIGlmICh0aGlzLl9hdXRob3JpdGllc0ZpbGVBdXRob3JpdHkuYWRkRmlsZSA9PSBcInRydWVcIikge1xuICAgICAgdmFyICRzaW5nbGVDb250cm9sRWxlbSA9ICQoXCIjRmxvd0ZpbGVzTGlzdFBsdWdpbkNvbnRhaW5lclwiKTtcbiAgICAgIHZhciB1cGxvYWRXYXJwSWQgPSAndXBsb2FkV2FycF8nICsgU3RyaW5nVXRpbGl0eS5UaW1lc3RhbXAoKTtcbiAgICAgIHRoaXMuX3Byb3AudXBsb2FkV2FycElkID0gdXBsb2FkV2FycElkO1xuICAgICAgdmFyICR1cGxvYWRXYXJwID0gJChcIjxkaXYgaWQ9J1wiICsgdXBsb2FkV2FycElkICsgXCInPjwvZGl2PlwiKTtcbiAgICAgICRzaW5nbGVDb250cm9sRWxlbS5hcHBlbmQoJHVwbG9hZFdhcnApO1xuICAgICAgdmFyIHRlbXBsYXRlSWQgPSBcInFxLXRlbXBsYXRlX1wiICsgdGhpcy5fcHJvcC5lbGVtSWQ7XG4gICAgICB0aGlzLkNyZWF0ZURlZmF1bHRUZW1wbGF0ZSh0ZW1wbGF0ZUlkKTtcblxuICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgdmFyIGdhbGxlcnlVcGxvYWRlciA9IG5ldyBxcS5GaW5lVXBsb2FkZXIoe1xuICAgICAgICBlbGVtZW50OiAkdXBsb2FkV2FycFswXSxcbiAgICAgICAgdGVtcGxhdGU6IHRlbXBsYXRlSWQsXG4gICAgICAgIG11bHRpcGxlOiBmYWxzZSxcbiAgICAgICAgcmVxdWVzdDogdGhpcy5HZXRVcGxvYWRFbmRQb2ludFJlcXVlc3QoKSxcbiAgICAgICAgY2FsbGJhY2tzOiB7XG4gICAgICAgICAgb25Db21wbGV0ZTogZnVuY3Rpb24gb25Db21wbGV0ZShpZCwgbmFtZSwgcmVzcG9uc2VKU09OLCB4aHIpIHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZUpTT04uc3VjY2Vzcykge1xuICAgICAgICAgICAgICBfdGhpcy5CdWlsZEZpbGVMaXN0KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChyZXNwb25zZUpTT04ubWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIEJ1aWxkRmlsZUxpc3Q6IGZ1bmN0aW9uIEJ1aWxkRmlsZUxpc3QoKSB7XG4gICAgdmFyICRzaW5nbGVDb250cm9sRWxlbSA9ICQoXCIjRmxvd0ZpbGVzTGlzdFBsdWdpbkNvbnRhaW5lclwiKTtcbiAgICB2YXIgdXBsb2FkX2ZpbGVfbGlzdF93cmFwX2lkID0gXCJ1cGxvYWRfZmlsZV9saXN0X3dhcnBfXCIgKyBTdHJpbmdVdGlsaXR5LlRpbWVzdGFtcCgpO1xuICAgICQoXCIjXCIgKyB1cGxvYWRfZmlsZV9saXN0X3dyYXBfaWQpLnJlbW92ZSgpO1xuICAgIHZhciAkZGl2V2FycCA9ICQoXCI8ZGl2IGNsYXNzPSd1cGxvYWRfZmlsZV9saXN0X3dyYXAnIGlkPSdcIiArIHVwbG9hZF9maWxlX2xpc3Rfd3JhcF9pZCArIFwiJz48dGFibGUgY2xhc3M9J2ZpbGVfbGlzdF90YWJsZSc+PHRoZWFkPjx0cj48dGg+5paH5Lu25ZCN56ewPC90aD48dGggc3R5bGU9J3dpZHRoOiAxNDBweCc+5LiK5Lyg5pe26Ze0PC90aD48dGggc3R5bGU9J3dpZHRoOiAxNDBweCc+5LiK5Lyg5Lq6PC90aD48dGggc3R5bGU9J3dpZHRoOiAxNDBweCc+5paH5Lu25aSn5bCPPC90aD48dGggc3R5bGU9J3dpZHRoOiAxNDBweCc+5pON5L2cPC90aD48L3RyPjwvdGhlYWQ+PHRib2R5PjwvdGJvZHk+PC90YWJsZT48L2Rpdj5cIik7XG4gICAgdmFyICR0Ym9keSA9ICRkaXZXYXJwLmZpbmQoXCJ0Ym9keVwiKTtcbiAgICB2YXIgaW5zdGFuY2VJZCA9IHRoaXMuX3Byb3AuRmxvd0luc3RhbmNlUnVudGltZVBPLmluc3RhbmNlRW50aXR5Lmluc3RJZDtcbiAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuYWNJbnRlcmZhY2UuZ2V0RmlsZUxpc3REYXRhLCB7XG4gICAgICBpbnN0YW5jZUlkOiBpbnN0YW5jZUlkXG4gICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcblxuICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzdWx0LmRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgZmlsZUluZm8gPSByZXN1bHQuZGF0YVtpXTtcbiAgICAgICAgICAkdGJvZHkuYXBwZW5kKHRoaXMuQnVpbGRGaWxlSW5mb1RhYmxlUm93KHJlc3VsdCwgZmlsZUluZm8pKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHRoaXMpO1xuICAgICQoJHNpbmdsZUNvbnRyb2xFbGVtLmFwcGVuZCgkZGl2V2FycCkpO1xuICB9LFxuICBCdWlsZEZpbGVJbmZvVGFibGVSb3c6IGZ1bmN0aW9uIEJ1aWxkRmlsZUluZm9UYWJsZVJvdyhyZXNwb25zZUpTT04sIGZpbGVJbmZvKSB7XG4gICAgdmFyIGZpbGVOYW1lID0gU3RyaW5nVXRpbGl0eS5FbmNvZGVIdG1sKGZpbGVJbmZvLmZpbGVOYW1lKTtcbiAgICB2YXIgZmlsZUNyZWF0ZVRpbWUgPSBEYXRlVXRpbGl0eS5EYXRhRm9ybWF0QnlUaW1lU3RhbXAoZmlsZUluZm8uZmlsZUNyZWF0ZVRpbWUsIFwieXl5eS1NTS1kZFwiKTtcbiAgICB2YXIgZmlsZVNpemUgPSBIYXJkRGlza1V0aWxpdHkuQnl0ZUNvbnZlcnQoZmlsZUluZm8uZmlsZVNpemUpO1xuICAgIHZhciBmaWxlQ3JlYXRvck5hbWUgPSBTdHJpbmdVdGlsaXR5LkVuY29kZUh0bWwoZmlsZUluZm8uZmlsZUNyZWF0b3IpO1xuICAgIHZhciAkdHJPYmogPSAkKFwiPHRyPjx0ZD5cIi5jb25jYXQoZmlsZU5hbWUsIFwiPC90ZD48dGQgc3R5bGU9XFxcInRleHQtYWxpZ246IGNlbnRlclxcXCI+XCIpLmNvbmNhdChmaWxlQ3JlYXRlVGltZSwgXCI8L3RkPjx0ZCBzdHlsZT1cXFwidGV4dC1hbGlnbjogY2VudGVyXFxcIj5cIikuY29uY2F0KGZpbGVDcmVhdG9yTmFtZSwgXCI8L3RkPjx0ZCBzdHlsZT1cXFwidGV4dC1hbGlnbjogY2VudGVyXFxcIj5cIikuY29uY2F0KGZpbGVTaXplLCBcIjwvdGQ+PHRkIHN0eWxlPVxcXCJ0ZXh0LWFsaWduOiBjZW50ZXJcXFwiPjwvdGQ+PC90cj5cIikpO1xuICAgIHRoaXMuQnVpbGRGaWxlSW5mb1RhYmxlUm93SW5uZXJCdXR0b25zKHJlc3BvbnNlSlNPTiwgZmlsZUluZm8sICR0ck9iaik7XG4gICAgcmV0dXJuICR0ck9iajtcbiAgfSxcbiAgQnVpbGRGaWxlSW5mb1RhYmxlUm93SW5uZXJCdXR0b25zOiBmdW5jdGlvbiBCdWlsZEZpbGVJbmZvVGFibGVSb3dJbm5lckJ1dHRvbnMocmVzcG9uc2VKU09OLCBmaWxlSW5mbywgJHRyKSB7XG4gICAgaWYgKCF0aGlzLl9wcm9wLmRvd25sb2FkRW5hYmxlICYmICF0aGlzLl9wcm9wLmRlbGV0ZUVuYWJsZSAmJiB0aGlzLl9wcm9wLnByZXZpZXdFbmFibGUgJiYgdGhpcy5fcHJvcC5tb3ZlT3JkZXJFbmFibGUpIHt9XG5cbiAgICB2YXIgJHRyTGFzdFRkID0gJHRyLmZpbmQoXCJ0ZDpsYXN0XCIpO1xuXG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGlmICh0aGlzLl9wcm9wLmRlbGV0ZUVuYWJsZSkge1xuICAgICAgdmFyICRkZWxldGVFbGVtID0gJChcIjxkaXYgY2xhc3M9J2ZpbGUtbGlzdC1pbm5lci1idXR0b24gZGVsZXRlLWJ1dHRvbi1lbGVtJyB0aXRsZT0n54K55Ye75Yig6ZmkJz48L2Rpdj5cIik7XG4gICAgICAkZGVsZXRlRWxlbS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQ29uZmlybSh3aW5kb3csIFwi56Gu6K6k5Yig6Zmk6ZmE5Lu244CQXCIgKyBmaWxlSW5mby5maWxlTmFtZSArIFwi44CR5ZCXP1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgQWpheFV0aWxpdHkuUG9zdChfdGhpcy5hY0ludGVyZmFjZS5kZWxldGVGaWxlLCB7XG4gICAgICAgICAgICBmaWxlSWQ6IGZpbGVJbmZvLmZpbGVJZFxuICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAkZGVsZXRlRWxlbS5wYXJlbnQoKS5wYXJlbnQoKS5yZW1vdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCBfdGhpcyk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICAkdHJMYXN0VGQuYXBwZW5kKCRkZWxldGVFbGVtKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fcHJvcC5tb3ZlT3JkZXJFbmFibGUgfHwgdHJ1ZSkge1xuICAgICAgdmFyICRtb3ZlVXBFbGVtID0gJChcIjxkaXYgY2xhc3M9J2ZpbGUtbGlzdC1pbm5lci1idXR0b24gbW92ZS11cC1idXR0b24tZWxlbScgdGl0bGU9J+eCueWHu+S4iuenuyc+PC9kaXY+XCIpO1xuICAgICAgJG1vdmVVcEVsZW0uY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChcIuaaguS4jeaUr+aMgSFcIik7XG4gICAgICB9KTtcbiAgICAgIHZhciAkbW92ZURvd25FbGVtID0gJChcIjxkaXYgY2xhc3M9J2ZpbGUtbGlzdC1pbm5lci1idXR0b24gbW92ZS1kb3duLWJ1dHRvbi1lbGVtJyB0aXRsZT0n54K55Ye75LiL56e7Jz48L2Rpdj5cIik7XG4gICAgICAkbW92ZURvd25FbGVtLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQoXCLmmoLkuI3mlK/mjIEhXCIpO1xuICAgICAgfSk7XG4gICAgICAkdHJMYXN0VGQuYXBwZW5kKCRtb3ZlVXBFbGVtKTtcbiAgICAgICR0ckxhc3RUZC5hcHBlbmQoJG1vdmVEb3duRWxlbSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3Byb3AuZG93bmxvYWRFbmFibGUpIHtcbiAgICAgIHZhciAkZG93bmxvYWRFbGVtID0gJChcIjxkaXYgY2xhc3M9J2ZpbGUtbGlzdC1pbm5lci1idXR0b24gZG93bmxvYWQtYnV0dG9uLWVsZW0nIHRpdGxlPSfngrnlh7vkuIvovb0nPjwvZGl2PlwiKTtcbiAgICAgICRkb3dubG9hZEVsZW0uY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdXJsID0gQmFzZVV0aWxpdHkuR2V0Um9vdFBhdGgoKSArIF90aGlzLmFjSW50ZXJmYWNlLmRvd25sb2FkRmlsZSArIFwiP2ZpbGVJZD1cIiArIGZpbGVJbmZvLmZpbGVJZDtcbiAgICAgICAgd2luZG93Lm9wZW4odXJsKTtcbiAgICAgIH0pO1xuICAgICAgJHRyTGFzdFRkLmFwcGVuZCgkZG93bmxvYWRFbGVtKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fcHJvcC5wcmV2aWV3RW5hYmxlIHx8IHRydWUpIHtcbiAgICAgIHZhciAkcHJldmlld0VsZW0gPSAkKFwiPGRpdiBjbGFzcz0nZmlsZS1saXN0LWlubmVyLWJ1dHRvbiBwcmV2aWV3LWJ1dHRvbi1lbGVtJyB0aXRsZT0n54K55Ye76aKE6KeIJz48L2Rpdj5cIik7XG4gICAgICAkcHJldmlld0VsZW0uY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChcIuaaguS4jeaUr+aMgSFcIik7XG4gICAgICB9KTtcbiAgICAgICR0ckxhc3RUZC5hcHBlbmQoJHByZXZpZXdFbGVtKTtcbiAgICB9XG4gIH0sXG4gIFRlc3RGaWxlUHJldmlld0VuYWJsZTogZnVuY3Rpb24gVGVzdEZpbGVQcmV2aWV3RW5hYmxlKGZpbGVJbmZvKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07Il19
