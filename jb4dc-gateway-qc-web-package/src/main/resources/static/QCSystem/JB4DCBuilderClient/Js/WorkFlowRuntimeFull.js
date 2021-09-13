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
      }
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
      tabContainer.append("<div class=\"wysiwyg-wfdct-tabs-content wfdct-tabs-content-runtime\" id=\"tab_content_uploadConvertToPDFPlugin_999\">" + DocumentContentUploadConvertToPDFPlugin.getHtmlElem() + "</div>");
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
  getHtmlElem: function getHtmlElem(propConfig) {
    return "<div \n                    control_category=\"InputControl\" \n                    id=\"document_content_upload_convert_to_pdf_plugin\" \n                    is_jbuild4dc_data=\"true\" \n                    jbuild4dc_custom=\"true\" \n                    name=\"document_content_upload_convert_to_pdf_plugin\" \n                    serialize=\"false\" \n                    singlename=\"WFDCT_DocumentContentUploadConvertToPDFContainer\" \n                    status=\"enable\" \n                    style=\"\" \n                    >\n                    \u672A\u5F00\u53D1!\n                </div>";
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFjdGlvbnNSdW50aW1lT2JqZWN0LmpzIiwiRmxvd1J1bnRpbWVQYWdlT2JqZWN0LmpzIiwiRmxvd1J1bnRpbWVWYXJCdWlsZGVyLmpzIiwiQWN0aW9ucy9DYWxsQmFja0FjdGlvbi5qcyIsIkFjdGlvbnMvSnVtcFRvQW55Tm9kZUFjdGlvbi5qcyIsIkFjdGlvbnMvUmVCb290SW5zdGFuY2VBY3Rpb24uanMiLCJBY3Rpb25zL1NlbmRBY3Rpb24uanMiLCJBY3Rpb25zL1RlbXBTYXZlQWN0aW9uLmpzIiwiRGlhbG9nL1VzZXJUYXNrUmVjZWl2ZXJEaWFsb2cuanMiLCJQbHVnaW5zL0RvY3VtZW50Q29udGVudFVwbG9hZENvbnZlcnRUb1BERlBsdWdpbi5qcyIsIlBsdWdpbnMvRmxvd0ZpbGVzTGlzdFNpbmdsZVBsdWdpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUNBQTtBQ0FBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RIQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJXb3JrRmxvd1J1bnRpbWVGdWxsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBBY3Rpb25zUnVudGltZU9iamVjdCA9IHtcbiAgQ3JlYXRlQUxMQWN0aW9uQnV0dG9uOiBmdW5jdGlvbiBDcmVhdGVBTExBY3Rpb25CdXR0b24oaXNTdGFydEluc3RhbmNlU3RhdHVzLCBmb3JtUnVudGltZUluc3QsIHBhZ2VIb3N0SW5zdGFuY2UsIHBhZ2VSZWFkeUlubmVyUGFyYXMpIHtcbiAgICBpZiAocGFnZVJlYWR5SW5uZXJQYXJhcy5qYjRkY0FjdGlvbnMgJiYgcGFnZVJlYWR5SW5uZXJQYXJhcy5qYjRkY0FjdGlvbnMuamI0ZGNBY3Rpb25MaXN0KSB7XG4gICAgICB2YXIgYnV0dG9uRWxlbTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYWdlUmVhZHlJbm5lclBhcmFzLmpiNGRjQWN0aW9ucy5qYjRkY0FjdGlvbkxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGFjdGlvbk9iaiA9IHBhZ2VSZWFkeUlubmVyUGFyYXMuamI0ZGNBY3Rpb25zLmpiNGRjQWN0aW9uTGlzdFtpXTtcblxuICAgICAgICBpZiAoYWN0aW9uT2JqLmp1ZWxSdW5SZXN1bHRQTy5ib29sZWFuUmVzdWx0KSB7XG4gICAgICAgICAgaWYgKGFjdGlvbk9iai5hY3Rpb25UeXBlID09IFwic2VuZFwiKSB7XG4gICAgICAgICAgICB2YXIgc2VuZEFjdGlvbk9iamVjdCA9IE9iamVjdC5jcmVhdGUoU2VuZEFjdGlvbik7XG4gICAgICAgICAgICBidXR0b25FbGVtID0gc2VuZEFjdGlvbk9iamVjdC5JbnN0YW5jZShpc1N0YXJ0SW5zdGFuY2VTdGF0dXMsIGZvcm1SdW50aW1lSW5zdCwgcGFnZUhvc3RJbnN0YW5jZSwgcGFnZVJlYWR5SW5uZXJQYXJhcywgYWN0aW9uT2JqKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAkKFwiI2Zsb3dXb3JrQWN0aW9uQnV0dG9uV3JhcE91dGVyXCIpLmFwcGVuZChidXR0b25FbGVtLmVsZW0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBHZXRBY3Rpb25PYmo6IGZ1bmN0aW9uIEdldEFjdGlvbk9iaigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYWN0aW9uQXV0b1NlbmQ6IFwiZmFsc2VcIixcbiAgICAgIGFjdGlvbkNDUmVjZWl2ZU9iamVjdHM6IFwiW11cIixcbiAgICAgIGFjdGlvbkNhbGxBcGlzOiBcIltdXCIsXG4gICAgICBhY3Rpb25DYWxsQ29tcGxldGU6IFwidHJ1ZVwiLFxuICAgICAgYWN0aW9uQ2FsbEpzTWV0aG9kOiBudWxsLFxuICAgICAgYWN0aW9uQ2FwdGlvbjogXCLojYnnqL9cIixcbiAgICAgIGFjdGlvbkNvZGU6IFwiYWN0aW9uXzUxNjAwOTc3NVwiLFxuICAgICAgYWN0aW9uQ29uZmlybTogXCJmYWxzZVwiLFxuICAgICAgYWN0aW9uRGlzcGxheUNvbmRpdGlvbkVkaXRUZXh0OiBudWxsLFxuICAgICAgYWN0aW9uRGlzcGxheUNvbmRpdGlvbkVkaXRWYWx1ZTogbnVsbCxcbiAgICAgIGFjdGlvbkV4ZWN1dGVWYXJpYWJsZXM6IFwiW11cIixcbiAgICAgIGFjdGlvbkhUTUxDbGFzczogbnVsbCxcbiAgICAgIGFjdGlvbkhUTUxJZDogbnVsbCxcbiAgICAgIGFjdGlvbk1haW5SZWNlaXZlT2JqZWN0czogXCJbXVwiLFxuICAgICAgYWN0aW9uUnVuU3FsczogXCJbXVwiLFxuICAgICAgYWN0aW9uU2VuZE1lc3NhZ2VJZDogbnVsbCxcbiAgICAgIGFjdGlvblNlbmRTaWduYWxJZDogbnVsbCxcbiAgICAgIGFjdGlvblNob3dPcGluaW9uRGlhbG9nOiBcImZhbHNlXCIsXG4gICAgICBhY3Rpb25UeXBlOiBcInNlbmRcIixcbiAgICAgIGFjdGlvblVwZGF0ZUZpZWxkczogXCJbXVwiLFxuICAgICAgYWN0aW9uVmFsaWRhdGU6IFwi5pegXCIsXG4gICAgICBhY3Rpb25zT3BpbmlvbkJpbmRUb0VsZW1JZDogbnVsbCxcbiAgICAgIGFjdGlvbnNPcGluaW9uQmluZFRvRmllbGQ6IG51bGwsXG4gICAgICBqdWVsUnVuUmVzdWx0UE86IHtcbiAgICAgICAgYm9vbGVhblJlc3VsdDogdHJ1ZSxcbiAgICAgICAgbWVzc2FnZTogXCJcIixcbiAgICAgICAgc3RyaW5nUmVzdWx0OiBcIlwiLFxuICAgICAgICBzdWNjZXNzOiB0cnVlXG4gICAgICB9XG4gICAgfTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEZsb3dSdW50aW1lUGFnZU9iamVjdCA9IHtcbiAgX3dlYkZvcm1SVFBhcmFzOiBudWxsLFxuICBfZm9ybVJ1bnRpbWVJbnN0OiBudWxsLFxuICBGT1JNX1JVTlRJTUVfQ0FURUdPUllfRkxPVzogXCJJc0RlcGVuZGVuY2VGbG93XCIsXG4gIF9mbG93SW5zdGFuY2VSdW50aW1lUE86IG51bGwsXG4gIF9pc0NyZWF0ZWRNb2RlbGVyVmlldzogZmFsc2UsXG4gIGJ1aWxkUGFnZVJlYWR5SW5uZXJQYXJhczogZnVuY3Rpb24gYnVpbGRQYWdlUmVhZHlJbm5lclBhcmFzKGlzU3RhcnRJbnN0YW5jZVN0YXR1cywgcmVjb3JkSWQsIGZsb3dJbnN0YW5jZVJ1bnRpbWVQTywgZmxvd0luc3RhbmNlUnVudGltZVBPQ2FjaGVLZXkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVjb3JkSWQ6IHJlY29yZElkLFxuICAgICAgZm9ybUlkOiBmbG93SW5zdGFuY2VSdW50aW1lUE8uamI0ZGNGb3JtSWQsXG4gICAgICBjdXJyZW50Tm9kZUtleTogZmxvd0luc3RhbmNlUnVudGltZVBPLmN1cnJlbnROb2RlS2V5LFxuICAgICAgY3VycmVudE5vZGVOYW1lOiBmbG93SW5zdGFuY2VSdW50aW1lUE8uY3VycmVudE5vZGVOYW1lLFxuICAgICAgbW9kZWxJZDogZmxvd0luc3RhbmNlUnVudGltZVBPLm1vZGVsSW50ZWdyYXRlZEVudGl0eS5tb2RlbElkLFxuICAgICAgbW9kZWxSZUtleTogZmxvd0luc3RhbmNlUnVudGltZVBPLm1vZGVsSW50ZWdyYXRlZEVudGl0eS5tb2RlbFJlS2V5LFxuICAgICAgY3VycmVudFRhc2tJZDogZmxvd0luc3RhbmNlUnVudGltZVBPLmV4ZWN1dGlvblRhc2tFbnRpdHkgPyBmbG93SW5zdGFuY2VSdW50aW1lUE8uZXhlY3V0aW9uVGFza0VudGl0eS5leHRhc2tJZCA6IFwiXCIsXG4gICAgICBmbG93SW5zdGFuY2VSdW50aW1lUE9DYWNoZUtleTogZmxvd0luc3RhbmNlUnVudGltZVBPQ2FjaGVLZXksXG4gICAgICBmbG93SW5zdGFuY2VSdW50aW1lUE86IGZsb3dJbnN0YW5jZVJ1bnRpbWVQTyxcbiAgICAgIGlzU3RhcnRJbnN0YW5jZVN0YXR1czogaXNTdGFydEluc3RhbmNlU3RhdHVzLFxuICAgICAgamI0ZGNBY3Rpb25zOiBmbG93SW5zdGFuY2VSdW50aW1lUE8uamI0ZGNBY3Rpb25zXG4gICAgfTtcbiAgfSxcbiAgcGFnZVJlYWR5Rm9yU3RhcnRTdGF0dXM6IGZ1bmN0aW9uIHBhZ2VSZWFkeUZvclN0YXJ0U3RhdHVzKGlzU3RhcnRJbnN0YW5jZVN0YXR1cywgZmxvd0luc3RhbmNlUnVudGltZVBPLCBmbG93SW5zdGFuY2VSdW50aW1lUE9DYWNoZUtleSwgcGFnZUhvc3RJbnN0YW5jZSkge1xuICAgIHRoaXMuX2Zvcm1SdW50aW1lSW5zdCA9IE9iamVjdC5jcmVhdGUoRm9ybVJ1bnRpbWUpO1xuICAgIEZsb3dSdW50aW1lUGFnZU9iamVjdC5fZmxvd0luc3RhbmNlUnVudGltZVBPID0gZmxvd0luc3RhbmNlUnVudGltZVBPO1xuICAgIHZhciByZWNvcmRJZCA9IFN0cmluZ1V0aWxpdHkuR3VpZCgpO1xuICAgIHZhciBwYWdlUmVhZHlJbm5lclBhcmFzID0gdGhpcy5idWlsZFBhZ2VSZWFkeUlubmVyUGFyYXMoaXNTdGFydEluc3RhbmNlU3RhdHVzLCByZWNvcmRJZCwgZmxvd0luc3RhbmNlUnVudGltZVBPLCBmbG93SW5zdGFuY2VSdW50aW1lUE9DYWNoZUtleSk7XG4gICAgY29uc29sZS5sb2cocGFnZVJlYWR5SW5uZXJQYXJhcyk7XG5cbiAgICB0aGlzLl9mb3JtUnVudGltZUluc3QuSW5pdGlhbGl6YXRpb24oe1xuICAgICAgXCJJbnN0YW5jZUlkXCI6IGZsb3dJbnN0YW5jZVJ1bnRpbWVQTy5pbnN0YW5jZUVudGl0eS5pbnN0SWQsXG4gICAgICBcIlJlbmRlcmVyVG9JZFwiOiBcImh0bWxEZXNpZ25SdW50aW1lV3JhcFwiLFxuICAgICAgXCJGb3JtSWRcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5mb3JtSWQsXG4gICAgICBcIlJlY29yZElkXCI6IHJlY29yZElkLFxuICAgICAgXCJCdXR0b25JZFwiOiBcIlwiLFxuICAgICAgXCJPcGVyYXRpb25UeXBlXCI6IEJhc2VVdGlsaXR5LkdldEFkZE9wZXJhdGlvbk5hbWUoKSxcbiAgICAgIFwiSXNQcmV2aWV3XCI6IGZhbHNlLFxuICAgICAgXCJSZW5kZXJlckNoYWluQ29tcGxldGVkRnVuY1wiOiBGbG93UnVudGltZVBhZ2VPYmplY3QuZm9ybVJlbmRlcmVyQ2hhaW5Db21wbGV0ZWRGdW5jLFxuICAgICAgXCJMaXN0Rm9ybUJ1dHRvbkVsZW1JZFwiOiBcIlwiLFxuICAgICAgXCJXZWJGb3JtUlRQYXJhc1wiOiB7fSxcbiAgICAgIFwiRm9ybVJ1bnRpbWVDYXRlZ29yeVwiOiBGbG93UnVudGltZVBhZ2VPYmplY3QuRk9STV9SVU5USU1FX0NBVEVHT1JZX0ZMT1csXG4gICAgICBcIlByZUhhbmRsZUZvcm1IdG1sUnVudGltZUZ1bmNcIjogdGhpcy5wcmVIYW5kbGVGb3JtSHRtbFJ1bnRpbWVGdW5jLFxuICAgICAgXCJGbG93SW5zdGFuY2VSdW50aW1lUE9cIjogZmxvd0luc3RhbmNlUnVudGltZVBPLFxuICAgICAgXCJGbG93TW9kZWxSdW50aW1lUE9DYWNoZUtleVwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLmZsb3dJbnN0YW5jZVJ1bnRpbWVQT0NhY2hlS2V5LFxuICAgICAgXCJJc1N0YXJ0SW5zdGFuY2VTdGF0dXNcIjogaXNTdGFydEluc3RhbmNlU3RhdHVzLFxuICAgICAgXCJDdXJyZW50Tm9kZUtleVwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLmN1cnJlbnROb2RlS2V5LFxuICAgICAgXCJDdXJyZW50Tm9kZU5hbWVcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5jdXJyZW50Tm9kZU5hbWUsXG4gICAgICBcIk1vZGVsSWRcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5tb2RlbElkLFxuICAgICAgXCJNb2RlbFJlS2V5XCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMubW9kZWxSZUtleSxcbiAgICAgIFwiQ3VycmVudFRhc2tJZFwiOiBcIlwiXG4gICAgfSk7XG5cbiAgICB0aGlzLnJlbmRlcmVyQWN0aW9uQnV0dG9ucyhpc1N0YXJ0SW5zdGFuY2VTdGF0dXMsIHRoaXMuX2Zvcm1SdW50aW1lSW5zdCwgcGFnZUhvc3RJbnN0YW5jZSwgcGFnZVJlYWR5SW5uZXJQYXJhcyk7XG4gICAgcmV0dXJuIHRoaXMuX2Zvcm1SdW50aW1lSW5zdDtcbiAgfSxcbiAgcGFnZVJlYWR5Rm9yUHJvY2Vzc1N0YXR1czogZnVuY3Rpb24gcGFnZVJlYWR5Rm9yUHJvY2Vzc1N0YXR1cyhpc1N0YXJ0SW5zdGFuY2VTdGF0dXMsIGZsb3dJbnN0YW5jZVJ1bnRpbWVQTywgZmxvd0luc3RhbmNlUnVudGltZVBPQ2FjaGVLZXksIHBhZ2VIb3N0SW5zdGFuY2UpIHtcbiAgICB0aGlzLl9mb3JtUnVudGltZUluc3QgPSBPYmplY3QuY3JlYXRlKEZvcm1SdW50aW1lKTtcbiAgICBGbG93UnVudGltZVBhZ2VPYmplY3QuX2Zsb3dJbnN0YW5jZVJ1bnRpbWVQTyA9IGZsb3dJbnN0YW5jZVJ1bnRpbWVQTztcbiAgICB2YXIgcmVjb3JkSWQgPSBmbG93SW5zdGFuY2VSdW50aW1lUE8uaW5zdGFuY2VFbnRpdHkuaW5zdFJ1QnVzaW5lc3NLZXk7XG4gICAgdmFyIHBhZ2VSZWFkeUlubmVyUGFyYXMgPSB0aGlzLmJ1aWxkUGFnZVJlYWR5SW5uZXJQYXJhcyhpc1N0YXJ0SW5zdGFuY2VTdGF0dXMsIHJlY29yZElkLCBmbG93SW5zdGFuY2VSdW50aW1lUE8sIGZsb3dJbnN0YW5jZVJ1bnRpbWVQT0NhY2hlS2V5KTtcbiAgICBjb25zb2xlLmxvZyhwYWdlUmVhZHlJbm5lclBhcmFzKTtcblxuICAgIHRoaXMuX2Zvcm1SdW50aW1lSW5zdC5Jbml0aWFsaXphdGlvbih7XG4gICAgICBcIkluc3RhbmNlSWRcIjogZmxvd0luc3RhbmNlUnVudGltZVBPLmluc3RhbmNlRW50aXR5Lmluc3RJZCxcbiAgICAgIFwiUmVuZGVyZXJUb0lkXCI6IFwiaHRtbERlc2lnblJ1bnRpbWVXcmFwXCIsXG4gICAgICBcIkZvcm1JZFwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLmZvcm1JZCxcbiAgICAgIFwiUmVjb3JkSWRcIjogcmVjb3JkSWQsXG4gICAgICBcIkJ1dHRvbklkXCI6IFwiXCIsXG4gICAgICBcIk9wZXJhdGlvblR5cGVcIjogQmFzZVV0aWxpdHkuR2V0VXBkYXRlT3BlcmF0aW9uTmFtZSgpLFxuICAgICAgXCJJc1ByZXZpZXdcIjogZmFsc2UsXG4gICAgICBcIlJlbmRlcmVyQ2hhaW5Db21wbGV0ZWRGdW5jXCI6IEZsb3dSdW50aW1lUGFnZU9iamVjdC5mb3JtUmVuZGVyZXJDaGFpbkNvbXBsZXRlZEZ1bmMsXG4gICAgICBcIkxpc3RGb3JtQnV0dG9uRWxlbUlkXCI6IFwiXCIsXG4gICAgICBcIldlYkZvcm1SVFBhcmFzXCI6IHt9LFxuICAgICAgXCJGb3JtUnVudGltZUNhdGVnb3J5XCI6IEZsb3dSdW50aW1lUGFnZU9iamVjdC5GT1JNX1JVTlRJTUVfQ0FURUdPUllfRkxPVyxcbiAgICAgIFwiUHJlSGFuZGxlRm9ybUh0bWxSdW50aW1lRnVuY1wiOiB0aGlzLnByZUhhbmRsZUZvcm1IdG1sUnVudGltZUZ1bmMsXG4gICAgICBcIkZsb3dJbnN0YW5jZVJ1bnRpbWVQT1wiOiBmbG93SW5zdGFuY2VSdW50aW1lUE8sXG4gICAgICBcIkZsb3dNb2RlbFJ1bnRpbWVQT0NhY2hlS2V5XCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMuZmxvd0luc3RhbmNlUnVudGltZVBPQ2FjaGVLZXksXG4gICAgICBcIklzU3RhcnRJbnN0YW5jZVN0YXR1c1wiOiBpc1N0YXJ0SW5zdGFuY2VTdGF0dXMsXG4gICAgICBcIkN1cnJlbnROb2RlS2V5XCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMuY3VycmVudE5vZGVLZXksXG4gICAgICBcIkN1cnJlbnROb2RlTmFtZVwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLmN1cnJlbnROb2RlTmFtZSxcbiAgICAgIFwiTW9kZWxJZFwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLm1vZGVsSWQsXG4gICAgICBcIk1vZGVsUmVLZXlcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5tb2RlbFJlS2V5LFxuICAgICAgXCJDdXJyZW50VGFza0lkXCI6IFwiXCJcbiAgICB9KTtcblxuICAgIHRoaXMucmVuZGVyZXJBY3Rpb25CdXR0b25zKGlzU3RhcnRJbnN0YW5jZVN0YXR1cywgdGhpcy5fZm9ybVJ1bnRpbWVJbnN0LCBwYWdlSG9zdEluc3RhbmNlLCBwYWdlUmVhZHlJbm5lclBhcmFzKTtcbiAgICByZXR1cm4gdGhpcy5fZm9ybVJ1bnRpbWVJbnN0O1xuICB9LFxuICByZW5kZXJlckFjdGlvbkJ1dHRvbnM6IGZ1bmN0aW9uIHJlbmRlcmVyQWN0aW9uQnV0dG9ucyhpc1N0YXJ0SW5zdGFuY2VTdGF0dXMsIGZvcm1SdW50aW1lSW5zdCwgcGFnZUhvc3RJbnN0YW5jZSwgcGFnZVJlYWR5SW5uZXJQYXJhcykge1xuICAgIEFjdGlvbnNSdW50aW1lT2JqZWN0LkNyZWF0ZUFMTEFjdGlvbkJ1dHRvbihpc1N0YXJ0SW5zdGFuY2VTdGF0dXMsIGZvcm1SdW50aW1lSW5zdCwgcGFnZUhvc3RJbnN0YW5jZSwgcGFnZVJlYWR5SW5uZXJQYXJhcyk7XG4gIH0sXG4gIHJlbmRlcmVyRmxvd01vZGVsZXJGb3JUYWJPbkFjdGl2aXR5OiBmdW5jdGlvbiByZW5kZXJlckZsb3dNb2RlbGVyRm9yVGFiT25BY3Rpdml0eShldmVudCwgdWkpIHtcbiAgICBpZiAoIUZsb3dSdW50aW1lUGFnZU9iamVjdC5faXNDcmVhdGVkTW9kZWxlclZpZXcpIHtcbiAgICAgIENyZWF0ZU1vZGVsZXJWaWV3KEZsb3dSdW50aW1lUGFnZU9iamVjdC5fZmxvd0luc3RhbmNlUnVudGltZVBPKTtcbiAgICAgIEZsb3dSdW50aW1lUGFnZU9iamVjdC5faXNDcmVhdGVkTW9kZWxlclZpZXcgPSB0cnVlO1xuICAgIH1cbiAgfSxcbiAgcmVuZGVyZXJGbG93RmlsZUNvbnRhaW5lcjogZnVuY3Rpb24gcmVuZGVyZXJGbG93RmlsZUNvbnRhaW5lcihmbG93SW5zdGFuY2VSdW50aW1lUE8pIHtcbiAgICBGbG93RmlsZXNMaXN0U2luZ2xlUGx1Z2luLlJlbmRlcmVyKCk7XG4gIH0sXG4gIGZvcm1SZW5kZXJlckNoYWluQ29tcGxldGVkRnVuYzogZnVuY3Rpb24gZm9ybVJlbmRlcmVyQ2hhaW5Db21wbGV0ZWRGdW5jKHNlbmRlckNvbmZpZykge1xuICAgIHZhciBmbG93SW5zdGFuY2VSdW50aW1lUE8gPSBzZW5kZXJDb25maWcuZmxvd0luc3RhbmNlUnVudGltZVBPO1xuICAgIEZsb3dSdW50aW1lUGFnZU9iamVjdC5yZW5kZXJlckZsb3dGaWxlQ29udGFpbmVyKGZsb3dJbnN0YW5jZVJ1bnRpbWVQTyk7XG4gIH0sXG4gIHByZUhhbmRsZUZvcm1IdG1sUnVudGltZUZ1bmM6IGZ1bmN0aW9uIHByZUhhbmRsZUZvcm1IdG1sUnVudGltZUZ1bmMoc291cmNlUnVudGltZUh0bWwsIGZvcm1SdW50aW1lSW5zdCwgcHJvcENvbmZpZykge1xuICAgIHZhciBmbG93UGFnZUNvbnRhaW5lciA9ICQoXCI8ZGl2PlwiICsgc291cmNlUnVudGltZUh0bWwgKyBcIjxkaXY+XCIpO1xuICAgIHZhciBmbG93SW5zdGFuY2VSdW50aW1lUE8gPSBwcm9wQ29uZmlnLkZsb3dJbnN0YW5jZVJ1bnRpbWVQTztcblxuICAgIGlmIChmbG93UGFnZUNvbnRhaW5lci5jaGlsZHJlbihcIltzaW5nbGVuYW1lPSdXRkRDVF9UYWJDb250YWluZXInXVwiKS5sZW5ndGggPT0gMCkge1xuICAgICAgZmxvd1BhZ2VDb250YWluZXIgPSAkKFwiPGRpdj48ZGl2IGNsYXNzPVxcXCJ3ZmRjdC10YWJzLW91dGVyLXdyYXAtcnVudGltZSBodG1sLWRlc2lnbi10aGVtZS1kZWZhdWx0LXJvb3QtZWxlbS1jbGFzc1xcXCIgY29udHJvbF9jYXRlZ29yeT1cXFwiQ29udGFpbmVyQ29udHJvbFxcXCIgZGVzYz1cXFwiXFxcIiBncm91cG5hbWU9XFxcIlxcXCIgaWQ9XFxcInRhYnNfd3JhcF81MTg2Mjc2MTZcXFwiIGlzX2pidWlsZDRkY19kYXRhPVxcXCJmYWxzZVxcXCIgamJ1aWxkNGRjX2N1c3RvbT1cXFwidHJ1ZVxcXCIgbmFtZT1cXFwidGFic193cmFwXzUxODYyNzYxNlxcXCIgcGxhY2Vob2xkZXI9XFxcIlxcXCIgc2VyaWFsaXplPVxcXCJmYWxzZVxcXCIgc2hvd19yZW1vdmVfYnV0dG9uPVxcXCJmYWxzZVxcXCIgc2luZ2xlbmFtZT1cXFwiV0ZEQ1RfVGFiQ29udGFpbmVyXFxcIiBzdGF0dXM9XFxcImVuYWJsZVxcXCIgc3R5bGU9XFxcIlxcXCIgY2xpZW50X3Jlc29sdmU9XFxcIldGRENUX1RhYkNvbnRhaW5lclxcXCI+PGRpdj5cIik7XG4gICAgICBmbG93UGFnZUNvbnRhaW5lci5jaGlsZHJlbihcIltzaW5nbGVuYW1lPSdXRkRDVF9UYWJDb250YWluZXInXVwiKS5hcHBlbmQoXCI8ZGl2IGNsYXNzPVxcXCJ3eXNpd3lnLXdmZGN0LXRhYnMtbGFiZWwgd2ZkY3QtdGFicy1sYWJlbC1ydW50aW1lXFxcIiB0YWJfaWQ9XFxcInRhYl9jb250ZW50X2Zsb3dfZm9ybV85OTlcXFwiPlwiICsgZmxvd0luc3RhbmNlUnVudGltZVBPLm1vZGVsTmFtZSArIFwiPC9kaXY+XCIpO1xuICAgICAgZmxvd1BhZ2VDb250YWluZXIuY2hpbGRyZW4oXCJbc2luZ2xlbmFtZT0nV0ZEQ1RfVGFiQ29udGFpbmVyJ11cIikuYXBwZW5kKFwiPGRpdiBjbGFzcz1cXFwid3lzaXd5Zy13ZmRjdC10YWJzLWNvbnRlbnQgd2ZkY3QtdGFicy1jb250ZW50LXJ1bnRpbWVcXFwiIGlkPVxcXCJ0YWJfY29udGVudF9mbG93X2Zvcm1fOTk5XFxcIj5cIiArIHNvdXJjZVJ1bnRpbWVIdG1sICsgXCI8L2Rpdj5cIik7XG4gICAgfVxuXG4gICAgdmFyIHRhYkNvbnRhaW5lciA9IGZsb3dQYWdlQ29udGFpbmVyLmNoaWxkcmVuKFwiW3NpbmdsZW5hbWU9J1dGRENUX1RhYkNvbnRhaW5lciddXCIpO1xuXG4gICAgaWYgKGZsb3dJbnN0YW5jZVJ1bnRpbWVQTy5qYjRkY0NvbnRlbnREb2N1bWVudFBsdWdpbiA9PSBcInVwbG9hZENvbnZlcnRUb1BERlBsdWdpblwiKSB7XG4gICAgICB0YWJDb250YWluZXIuYXBwZW5kKFwiPGRpdiBjbGFzcz1cXFwid3lzaXd5Zy13ZmRjdC10YWJzLWxhYmVsIHdmZGN0LXRhYnMtbGFiZWwtcnVudGltZVxcXCIgdGFiX2lkPVxcXCJ0YWJfY29udGVudF91cGxvYWRDb252ZXJ0VG9QREZQbHVnaW5fOTk5XFxcIj7mraPmloc8L2Rpdj5cIik7XG4gICAgICB0YWJDb250YWluZXIuYXBwZW5kKFwiPGRpdiBjbGFzcz1cXFwid3lzaXd5Zy13ZmRjdC10YWJzLWNvbnRlbnQgd2ZkY3QtdGFicy1jb250ZW50LXJ1bnRpbWVcXFwiIGlkPVxcXCJ0YWJfY29udGVudF91cGxvYWRDb252ZXJ0VG9QREZQbHVnaW5fOTk5XFxcIj5cIiArIERvY3VtZW50Q29udGVudFVwbG9hZENvbnZlcnRUb1BERlBsdWdpbi5nZXRIdG1sRWxlbSgpICsgXCI8L2Rpdj5cIik7XG4gICAgfSBlbHNlIGlmIChmbG93SW5zdGFuY2VSdW50aW1lUE8uamI0ZGNDb250ZW50RG9jdW1lbnRQbHVnaW4gPT0gXCJ3cHNPbmxpbmVEb2N1bWVudFBsdWdpblwiKSB7XG4gICAgICB0YWJDb250YWluZXIuYXBwZW5kKFwiPGRpdiBjbGFzcz1cXFwid3lzaXd5Zy13ZmRjdC10YWJzLWxhYmVsIHdmZGN0LXRhYnMtbGFiZWwtcnVudGltZVxcXCIgdGFiX2lkPVxcXCJ0YWJfY29udGVudF93cHNPbmxpbmVEb2N1bWVudFBsdWdpbl85OTlcXFwiPuato+aWhzwvZGl2PlwiKTtcbiAgICAgIHRhYkNvbnRhaW5lci5hcHBlbmQoXCI8ZGl2IGNsYXNzPVxcXCJ3eXNpd3lnLXdmZGN0LXRhYnMtY29udGVudCB3ZmRjdC10YWJzLWNvbnRlbnQtcnVudGltZVxcXCIgaWQ9XFxcInRhYl9jb250ZW50X3dwc09ubGluZURvY3VtZW50UGx1Z2luXzk5OVxcXCI+5pyq5a6e546wPC9kaXY+XCIpO1xuICAgIH1cblxuICAgIHRhYkNvbnRhaW5lci5hcHBlbmQoXCI8ZGl2IGNsYXNzPVxcXCJ3eXNpd3lnLXdmZGN0LXRhYnMtbGFiZWwgd2ZkY3QtdGFicy1sYWJlbC1ydW50aW1lXFxcIiB0YWJfaWQ9XFxcInRhYl9jb250ZW50X2Zsb3dfZmlsZXNfOTk5XFxcIj7pmYTku7Y8L2Rpdj5cIik7XG4gICAgdGFiQ29udGFpbmVyLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1jb250ZW50IHdmZGN0LXRhYnMtY29udGVudC1ydW50aW1lXFxcIiBpZD1cXFwidGFiX2NvbnRlbnRfZmxvd19maWxlc185OTlcXFwiPlwiICsgRmxvd0ZpbGVzTGlzdFNpbmdsZVBsdWdpbi5nZXRIdG1sRWxlbShwcm9wQ29uZmlnKSArIFwiPC9kaXY+XCIpO1xuICAgIHRhYkNvbnRhaW5lci5hcHBlbmQoXCI8ZGl2IGNsYXNzPVxcXCJ3eXNpd3lnLXdmZGN0LXRhYnMtbGFiZWwgd2ZkY3QtdGFicy1sYWJlbC1ydW50aW1lXFxcIiB0YWJfaWQ9XFxcInRhYl9jb250ZW50X2Zsb3dfbW9kZWxlcl85OTlcXFwiPua1geeoi+WbvjwvZGl2PlwiKTtcbiAgICB0YWJDb250YWluZXIuYXBwZW5kKFwiPGRpdiBjbGFzcz1cXFwid3lzaXd5Zy13ZmRjdC10YWJzLWNvbnRlbnQgd2ZkY3QtdGFicy1jb250ZW50LXJ1bnRpbWVcXFwiIGlkPVxcXCJ0YWJfY29udGVudF9mbG93X21vZGVsZXJfOTk5XFxcIiBzdHlsZT0naGVpZ2h0OiBjYWxjKDEwMCUgLSA1MHB4KTsnIG9uQWN0aXZpdHk9XFxcIkZsb3dSdW50aW1lUGFnZU9iamVjdC5yZW5kZXJlckZsb3dNb2RlbGVyRm9yVGFiT25BY3Rpdml0eVxcXCI+PGRpdiBpZD1cXFwiZmxvdy1jYW52YXNcXFwiIHN0eWxlPVxcXCJoZWlnaHQ6MTAwJTtcXFwiPjwvZGl2PjwvZGl2PlwiKTtcbiAgICB0YWJDb250YWluZXIuYXBwZW5kKFwiPGRpdiBjbGFzcz1cXFwid3lzaXd5Zy13ZmRjdC10YWJzLWxhYmVsIHdmZGN0LXRhYnMtbGFiZWwtcnVudGltZVxcXCIgdGFiX2lkPVxcXCJ0YWJfY29udGVudF9mbG93X3NlcXVlbmNlXzk5OVxcXCI+6aG65bqP5Zu+PC9kaXY+XCIpO1xuICAgIHRhYkNvbnRhaW5lci5hcHBlbmQoXCI8ZGl2IGNsYXNzPVxcXCJ3eXNpd3lnLXdmZGN0LXRhYnMtY29udGVudCB3ZmRjdC10YWJzLWNvbnRlbnQtcnVudGltZVxcXCIgaWQ9XFxcInRhYl9jb250ZW50X2Zsb3dfc2VxdWVuY2VfOTk5XFxcIj48L2Rpdj5cIik7XG4gICAgdGFiQ29udGFpbmVyLmFwcGVuZChcIjxkaXYgY2xhc3M9XFxcInd5c2l3eWctd2ZkY3QtdGFicy1sYWJlbCB3ZmRjdC10YWJzLWxhYmVsLXJ1bnRpbWVcXFwiIHRhYl9pZD1cXFwidGFiX2NvbnRlbnRfZmxvd190YXNrXzk5OVxcXCI+5rWB6L2s5L+h5oGvPC9kaXY+XCIpO1xuICAgIHRhYkNvbnRhaW5lci5hcHBlbmQoXCI8ZGl2IGNsYXNzPVxcXCJ3eXNpd3lnLXdmZGN0LXRhYnMtY29udGVudCB3ZmRjdC10YWJzLWNvbnRlbnQtcnVudGltZVxcXCIgaWQ9XFxcInRhYl9jb250ZW50X2Zsb3dfdGFza185OTlcXFwiPjwvZGl2PlwiKTtcbiAgICB2YXIgbmV3UnVudGltZUh0bWwgPSBmbG93UGFnZUNvbnRhaW5lci5odG1sKCk7XG4gICAgcmV0dXJuIG5ld1J1bnRpbWVIdG1sO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRmxvd1J1bnRpbWVWYXJCdWlsZGVyID0ge1xuICBCdWlsZGVyU2VsZWN0ZWRSZWNlaXZlclRvSW5zdGFuY2VWYXI6IGZ1bmN0aW9uIEJ1aWxkZXJTZWxlY3RlZFJlY2VpdmVyVG9JbnN0YW5jZVZhcihuZXh0Rmxvd05vZGVFbnRpdGllcywgc2VsZWN0ZWRSZWNlaXZlckRhdGEpIHtcbiAgICB2YXIgcmVzdWx0RGF0YSA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWxlY3RlZFJlY2VpdmVyRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHJlY2VpdmVyID0gc2VsZWN0ZWRSZWNlaXZlckRhdGFbaV07XG4gICAgICByZXN1bHREYXRhLnB1c2goe1xuICAgICAgICBuZXh0Tm9kZUlkOiByZWNlaXZlci5mbG93Tm9kZUVudGl0eS5pZCxcbiAgICAgICAgcmVjZWl2ZXJJZDogcmVjZWl2ZXIuaWQsXG4gICAgICAgIHJlY2VpdmVyTmFtZTogcmVjZWl2ZXIubmFtZSxcbiAgICAgICAgcmVjZWl2ZXJUeXBlTmFtZTogcmVjZWl2ZXIudHlwZU5hbWUsXG4gICAgICAgIHJlY2VpdmVUeXBlOiByZWNlaXZlci5yZWNlaXZlVHlwZVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdERhdGE7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7IiwiXCJ1c2Ugc3RyaWN0XCI7IiwiXCJ1c2Ugc3RyaWN0XCI7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBTZW5kQWN0aW9uID0ge1xuICBhY0ludGVyZmFjZToge1xuICAgIHJlc29sdmVOZXh0UG9zc2libGVGbG93Tm9kZTogXCIvUmVzdC9Xb3JrZmxvdy9SdW5UaW1lL0NsaWVudC9JbnN0YW5jZVJ1bnRpbWUvUmVzb2x2ZU5leHRQb3NzaWJsZUZsb3dOb2RlXCIsXG4gICAgY29tcGxldGVUYXNrOiBcIi9SZXN0L1dvcmtmbG93L1J1blRpbWUvQ2xpZW50L0luc3RhbmNlUnVudGltZS9Db21wbGV0ZVRhc2tcIlxuICB9LFxuICBfUHJvcDoge30sXG4gIEluc3RhbmNlOiBmdW5jdGlvbiBJbnN0YW5jZShpc1N0YXJ0SW5zdGFuY2VTdGF0dXMsIGZvcm1SdW50aW1lSW5zdCwgcGFnZUhvc3RJbnN0YW5jZSwgcGFnZVJlYWR5SW5uZXJQYXJhcywgYWN0aW9uT2JqKSB7XG4gICAgY29uc29sZS5sb2coYWN0aW9uT2JqKTtcbiAgICB2YXIgaHRtbElkID0gYWN0aW9uT2JqLmFjdGlvbkhUTUxJZCA/IGFjdGlvbk9iai5hY3Rpb25IVE1MSWQgOiBhY3Rpb25PYmouYWN0aW9uQ29kZTtcbiAgICB2YXIgZWxlbSA9ICQoJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwib3BlcmF0aW9uLWJ1dHRvbiBvcGVyYXRpb24tYnV0dG9uLXByaW1hcnlcIiBpZD1cIicgKyBodG1sSWQgKyAnXCI+PHNwYW4+JyArIGFjdGlvbk9iai5hY3Rpb25DYXB0aW9uICsgJzwvc3Bhbj48L2J1dHRvbj4nKTtcbiAgICB0aGlzLl9Qcm9wID0ge1xuICAgICAgXCJzZW5kZXJcIjogdGhpcyxcbiAgICAgIFwiZmxvd0luc3RhbmNlUnVudGltZVBPXCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMuZmxvd0luc3RhbmNlUnVudGltZVBPLFxuICAgICAgXCJmbG93SW5zdGFuY2VSdW50aW1lUE9DYWNoZUtleVwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLmZsb3dJbnN0YW5jZVJ1bnRpbWVQT0NhY2hlS2V5LFxuICAgICAgXCJqYjRkY0FjdGlvbnNcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5qYjRkY0FjdGlvbnMsXG4gICAgICBcImZvcm1SdW50aW1lSW5zdFwiOiBmb3JtUnVudGltZUluc3QsXG4gICAgICBcImFjdGlvbk9ialwiOiBhY3Rpb25PYmosXG4gICAgICBcImlzU3RhcnRJbnN0YW5jZVN0YXR1c1wiOiBpc1N0YXJ0SW5zdGFuY2VTdGF0dXMsXG4gICAgICBcInBhZ2VIb3N0SW5zdGFuY2VcIjogcGFnZUhvc3RJbnN0YW5jZSxcbiAgICAgIFwiY3VycmVudE5vZGVLZXlcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5jdXJyZW50Tm9kZUtleSxcbiAgICAgIFwiY3VycmVudE5vZGVOYW1lXCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMuY3VycmVudE5vZGVOYW1lLFxuICAgICAgXCJyZWNvcmRJZFwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLnJlY29yZElkLFxuICAgICAgXCJtb2RlbElkXCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMubW9kZWxJZCxcbiAgICAgIFwibW9kZWxSZUtleVwiOiBwYWdlUmVhZHlJbm5lclBhcmFzLm1vZGVsUmVLZXksXG4gICAgICBcImN1cnJlbnRUYXNrSWRcIjogcGFnZVJlYWR5SW5uZXJQYXJhcy5jdXJyZW50VGFza0lkLFxuICAgICAgXCJpbnN0YW5jZUlkXCI6IHBhZ2VSZWFkeUlubmVyUGFyYXMuZmxvd0luc3RhbmNlUnVudGltZVBPLmluc3RhbmNlRW50aXR5Lmluc3RJZFxuICAgIH07XG4gICAgZWxlbS5iaW5kKFwiY2xpY2tcIiwgdGhpcy5fUHJvcCwgdGhpcy5CdXR0b25DbGlja0V2ZW50KTtcbiAgICByZXR1cm4ge1xuICAgICAgZWxlbTogZWxlbVxuICAgIH07XG4gIH0sXG4gIEJ1dHRvbkNsaWNrRXZlbnQ6IGZ1bmN0aW9uIEJ1dHRvbkNsaWNrRXZlbnQoc2VuZGVyKSB7XG4gICAgdmFyIHZhbGlkYXRlUmVzdWx0ID0gVmFsaWRhdGVSdWxlc1J1bnRpbWUuVmFsaWRhdGVTdWJtaXRFbmFibGUoKTtcblxuICAgIGlmIChWYWxpZGF0ZVJ1bGVzUnVudGltZS5BbGVydFZhbGlkYXRlRXJyb3JzKHZhbGlkYXRlUmVzdWx0KSkge1xuICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydExvYWRpbmcod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0xvYWRpbmdJZCwge30sIFwiXCIpO1xuICAgICAgdmFyIF9wcm9wID0gc2VuZGVyLmRhdGE7XG4gICAgICB2YXIgX3RoaXMgPSBfcHJvcC5zZW5kZXI7XG5cbiAgICAgIHZhciBzZW5kRGF0YSA9IF90aGlzLkJ1aWxkU2VuZFRvU2VydmVyRGF0YShfcHJvcCwgbnVsbCk7XG5cbiAgICAgIGlmIChzZW5kRGF0YS5zdWNjZXNzKSB7XG4gICAgICAgIEFqYXhVdGlsaXR5LlBvc3QoX3RoaXMuYWNJbnRlcmZhY2UucmVzb2x2ZU5leHRQb3NzaWJsZUZsb3dOb2RlLCBzZW5kRGF0YS5kYXRhLCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZyhEaWFsb2dVdGlsaXR5LkRpYWxvZ0xvYWRpbmdJZCk7XG4gICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcblxuICAgICAgICAgIGlmIChyZXN1bHQuZGF0YS5uZXh0VGFza0lzRW5kRXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0UmVjZWl2ZXJDb21wbGV0ZWQocmVzdWx0LmRhdGEuYnBtblRhc2tMaXN0LCBbXSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChyZXN1bHQuZGF0YS5jdXJyZW50VGFza0lzTXVsdGlJbnN0YW5jZSAmJiByZXN1bHQuZGF0YS5jdXJyZW50VGFza011bHRpQ29tcGxldGVkSW5zdGFuY2VzICsgMSA8IHJlc3VsdC5kYXRhLmN1cnJlbnRUYXNrTXVsdGlDb3VudEVuZ0luc3RhbmNlcykge1xuICAgICAgICAgICAgdGhpcy5TZWxlY3RSZWNlaXZlckNvbXBsZXRlZChyZXN1bHQuZGF0YS5icG1uVGFza0xpc3QsIFtdKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgVXNlclRhc2tSZWNlaXZlckRpYWxvZ1V0aWxpdHkuU2hvd0RpYWxvZyhfcHJvcC5zZW5kZXIsIHJlc3VsdC5kYXRhLmJwbW5UYXNrTGlzdCwgX3Byb3Auc2VuZGVyLlNlbGVjdFJlY2VpdmVyQ29tcGxldGVkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIF9wcm9wLnNlbmRlcik7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBTZWxlY3RSZWNlaXZlckNvbXBsZXRlZDogZnVuY3Rpb24gU2VsZWN0UmVjZWl2ZXJDb21wbGV0ZWQobmV4dFRhc2tFbnRpdHlMaXN0LCBzZWxlY3RlZFJlY2VpdmVyRGF0YSkge1xuICAgIGNvbnNvbGUubG9nKHNlbGVjdGVkUmVjZWl2ZXJEYXRhKTtcbiAgICBjb25zb2xlLmxvZyh0aGlzLl9Qcm9wLmFjdGlvbk9iai5hY3Rpb25DYXB0aW9uKTtcbiAgICBEaWFsb2dVdGlsaXR5LkNvbmZpcm0od2luZG93LCBcIuehruiupOaJp+ihjOWPkemAgT9cIiwgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGVjdGVkUmVjZWl2ZXJWYXJzID0gRmxvd1J1bnRpbWVWYXJCdWlsZGVyLkJ1aWxkZXJTZWxlY3RlZFJlY2VpdmVyVG9JbnN0YW5jZVZhcihuZXh0VGFza0VudGl0eUxpc3QsIHNlbGVjdGVkUmVjZWl2ZXJEYXRhKTtcbiAgICAgIHZhciBzZW5kRGF0YSA9IHRoaXMuQnVpbGRTZW5kVG9TZXJ2ZXJEYXRhKHRoaXMuX1Byb3AsIHtcbiAgICAgICAgc2VsZWN0ZWRSZWNlaXZlclZhcnM6IGVuY29kZVVSSUNvbXBvbmVudChKc29uVXRpbGl0eS5Kc29uVG9TdHJpbmcoc2VsZWN0ZWRSZWNlaXZlclZhcnMpKVxuICAgICAgfSk7XG4gICAgICBjb25zb2xlLmxvZyhzZW5kRGF0YSk7XG5cbiAgICAgIGlmIChzZW5kRGF0YS5zdWNjZXNzKSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRMb2FkaW5nKHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dMb2FkaW5nSWQsIHt9LCBcIuezu+e7n+WkhOeQhuS4rSzor7fnqI3lgJkhXCIpO1xuICAgICAgICBBamF4VXRpbGl0eS5Qb3N0KHRoaXMuYWNJbnRlcmZhY2UuY29tcGxldGVUYXNrLCBzZW5kRGF0YS5kYXRhLCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZyhEaWFsb2dVdGlsaXR5LkRpYWxvZ0xvYWRpbmdJZCk7XG5cbiAgICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgIGlmICh3aW5kb3cuT3BlbmVyV2luZG93T2JqICE9IG51bGwgJiYgd2luZG93Lk9wZW5lcldpbmRvd09iai5pbnN0YW5jZU1haW5UYXNrUHJvY2Vzc0xpc3QgIT0gbnVsbCkge1xuICAgICAgICAgICAgICB3aW5kb3cuT3BlbmVyV2luZG93T2JqLmluc3RhbmNlTWFpblRhc2tQcm9jZXNzTGlzdC5yZWxvYWREYXRhKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICBEaWFsb2dVdGlsaXR5LkZyYW1lX0Nsb3NlRGlhbG9nKHdpbmRvdyk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydEVycm9yKHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydEVycm9ySWQsIHt9LCByZXN1bHQuZGF0YS5tZXNzYWdlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMuX1Byb3Auc2VuZGVyKTtcbiAgICAgIH1cbiAgICB9LCB0aGlzKTtcbiAgfSxcbiAgQnVpbGRTZW5kVG9TZXJ2ZXJEYXRhOiBmdW5jdGlvbiBCdWlsZFNlbmRUb1NlcnZlckRhdGEoX3Byb3AsIGFwcGVuZFNlbmRNYXApIHtcbiAgICB2YXIgZm9ybURhdGFDb21wbGV4UE8gPSBfcHJvcC5mb3JtUnVudGltZUluc3QuU2VyaWFsaXphdGlvbkZvcm1EYXRhKCk7XG5cbiAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgaXNTdGFydEluc3RhbmNlU3RhdHVzOiBfcHJvcC5pc1N0YXJ0SW5zdGFuY2VTdGF0dXMsXG4gICAgICAgIGFjdGlvbkNvZGU6IF9wcm9wLmFjdGlvbk9iai5hY3Rpb25Db2RlLFxuICAgICAgICBmbG93SW5zdGFuY2VSdW50aW1lUE9DYWNoZUtleTogX3Byb3AuZmxvd0luc3RhbmNlUnVudGltZVBPQ2FjaGVLZXksXG4gICAgICAgIFwiZm9ybVJlY29yZENvbXBsZXhQT1N0cmluZ1wiOiBlbmNvZGVVUklDb21wb25lbnQoSnNvblV0aWxpdHkuSnNvblRvU3RyaW5nKGZvcm1EYXRhQ29tcGxleFBPKSksXG4gICAgICAgIFwiY3VycmVudE5vZGVLZXlcIjogX3Byb3AuY3VycmVudE5vZGVLZXksXG4gICAgICAgIFwiY3VycmVudE5vZGVOYW1lXCI6IF9wcm9wLmN1cnJlbnROb2RlTmFtZSxcbiAgICAgICAgXCJyZWNvcmRJZFwiOiBfcHJvcC5yZWNvcmRJZCxcbiAgICAgICAgXCJtb2RlbElkXCI6IF9wcm9wLm1vZGVsSWQsXG4gICAgICAgIFwibW9kZWxSZUtleVwiOiBfcHJvcC5tb2RlbFJlS2V5LFxuICAgICAgICBcImN1cnJlbnRUYXNrSWRcIjogX3Byb3AuY3VycmVudFRhc2tJZCxcbiAgICAgICAgXCJpbnN0YW5jZUlkXCI6IF9wcm9wLmluc3RhbmNlSWRcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKGFwcGVuZFNlbmRNYXApIHtcbiAgICAgIGZvciAodmFyIGtleSBpbiBhcHBlbmRTZW5kTWFwKSB7XG4gICAgICAgIHJlc3VsdC5kYXRhW2tleV0gPSBhcHBlbmRTZW5kTWFwW2tleV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHVzZXJUYXNrUmVjZWl2ZXJEaWFsb2dPdXRlclZ1ZTtcbnZhciBVc2VyVGFza1JlY2VpdmVyRGlhbG9nVXRpbGl0eSA9IHtcbiAgU2hvd0RpYWxvZzogZnVuY3Rpb24gU2hvd0RpYWxvZyhzZW5kZXIsIG5leHRGbG93Tm9kZUVudGl0aWVzLCBzZWxlY3RSZWNlaXZlckNvbXBsZXRlZEZ1bmMpIHtcbiAgICBpZiAoIXVzZXJUYXNrUmVjZWl2ZXJEaWFsb2dPdXRlclZ1ZSkge1xuICAgICAgJChkb2N1bWVudC5ib2R5KS5hcHBlbmQoXCI8ZGl2IGlkPSd1c2VyVGFza1JlY2VpdmVyRGlhbG9nT3V0ZXInPjx1c2VyLXRhc2stcmVjZWl2ZXItZGlhbG9nIHJlZj0ndXNlclRhc2tSZWNlaXZlckRpYWxvZyc+PC91c2VyLXRhc2stcmVjZWl2ZXItZGlhbG9nPjwvZGl2PlwiKTtcbiAgICAgIHVzZXJUYXNrUmVjZWl2ZXJEaWFsb2dPdXRlclZ1ZSA9IG5ldyBWdWUoe1xuICAgICAgICBlbDogXCIjdXNlclRhc2tSZWNlaXZlckRpYWxvZ091dGVyXCIsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBhY0ludGVyZmFjZToge1xuICAgICAgICAgICAgZ2V0UnVudGltZU1vZGVsV2l0aFN0YXJ0OiBcIi9SZXN0L1dvcmtmbG93L1J1blRpbWUvQ2xpZW50L01vZGVsUnVudGltZS9HZXRSdW50aW1lTW9kZWxXaXRoU3RhcnRcIlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgbW91bnRlZDogZnVuY3Rpb24gbW91bnRlZCgpIHt9LFxuICAgICAgICBtZXRob2RzOiB7fVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdXNlclRhc2tSZWNlaXZlckRpYWxvZ091dGVyVnVlLiRyZWZzLnVzZXJUYXNrUmVjZWl2ZXJEaWFsb2cuYmVnaW5TZWxlY3RSZWNlaXZlcihzZW5kZXIsIG5leHRGbG93Tm9kZUVudGl0aWVzLCBzZWxlY3RSZWNlaXZlckNvbXBsZXRlZEZ1bmMpO1xuICB9LFxuICBDbG9zZURpYWxvZzogZnVuY3Rpb24gQ2xvc2VEaWFsb2coKSB7XG4gICAgRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZ0VsZW0odXNlclRhc2tSZWNlaXZlckRpYWxvZ091dGVyVnVlLiRyZWZzLnVzZXJUYXNrUmVjZWl2ZXJEaWFsb2cuJHJlZnMudXNlclRhc2tSZWNlaXZlckRpYWxvZ1dyYXApO1xuICAgIHVzZXJUYXNrUmVjZWl2ZXJEaWFsb2dPdXRlclZ1ZSA9IG51bGw7XG4gICAgJChcIiN1c2VyVGFza1JlY2VpdmVyRGlhbG9nT3V0ZXJcIikucmVtb3ZlKCk7XG4gICAgRGlhbG9nVXRpbGl0eS5SZW1vdmVEaWFsb2dSZW1haW5pbmdFbGVtKFwidXNlclRhc2tSZWNlaXZlckRpYWxvZ0lubmVyXCIpO1xuICB9XG59O1xuVnVlLmNvbXBvbmVudChcInVzZXItdGFzay1yZWNlaXZlci1kaWFsb2dcIiwge1xuICBkYXRhOiBmdW5jdGlvbiBkYXRhKCkge1xuICAgIHJldHVybiB7XG4gICAgICBhY0ludGVyZmFjZToge30sXG4gICAgICBuZXh0Rmxvd05vZGVFbnRpdGllczogW10sXG4gICAgICByZWNlaXZlclRyZWU6IHtcbiAgICAgICAgdHJlZVNldHRpbmc6IHtcbiAgICAgICAgICB2aWV3OiB7XG4gICAgICAgICAgICBkYmxDbGlja0V4cGFuZDogZmFsc2UsXG4gICAgICAgICAgICBzaG93TGluZTogdHJ1ZSxcbiAgICAgICAgICAgIGZvbnRDc3M6IHtcbiAgICAgICAgICAgICAgJ2NvbG9yJzogJ2JsYWNrJyxcbiAgICAgICAgICAgICAgJ2ZvbnQtd2VpZ2h0JzogJ25vcm1hbCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNoZWNrOiB7XG4gICAgICAgICAgICBlbmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgbm9jaGVja0luaGVyaXQ6IGZhbHNlLFxuICAgICAgICAgICAgcmFkaW9UeXBlOiBcImFsbFwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBhc3luYzoge1xuICAgICAgICAgICAgZW5hYmxlOiB0cnVlLFxuICAgICAgICAgICAgY29udGVudFR5cGU6IFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCIsXG4gICAgICAgICAgICB1cmw6IEJhc2VVdGlsaXR5LkJ1aWxkQWN0aW9uKFwiL1Jlc3QvV29ya2Zsb3cvUnVuVGltZS9DbGllbnQvUmVjZWl2ZXJSdW50aW1lL0dldEFzeW5jUmVjZWl2ZXJzXCIpLFxuICAgICAgICAgICAgYXV0b1BhcmFtOiBbXCJpZFwiLCBcInR5cGVOYW1lXCIsIFwibmFtZVwiXVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAga2V5OiB7XG4gICAgICAgICAgICAgIG5hbWU6IFwibmFtZVwiLFxuICAgICAgICAgICAgICBjaGlsZHJlbjogXCJydW50aW1lUmVjZWl2ZVVzZXJzXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzaW1wbGVEYXRhOiB7XG4gICAgICAgICAgICAgIGVuYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgaWRLZXk6IFwiaWRcIixcbiAgICAgICAgICAgICAgcElkS2V5OiBcInBhcmVudElkXCIsXG4gICAgICAgICAgICAgIHJvb3RQSWQ6IG51bGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGNhbGxiYWNrOiB7XG4gICAgICAgICAgICBvbkNsaWNrOiBmdW5jdGlvbiBvbkNsaWNrKGV2ZW50LCB0cmVlSWQsIHRyZWVOb2RlKSB7fSxcbiAgICAgICAgICAgIG9uRGJsQ2xpY2s6IGZ1bmN0aW9uIG9uRGJsQ2xpY2soZXZlbnQsIHRyZWVJZCwgdHJlZU5vZGUpIHtcbiAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcy5nZXRaVHJlZU9iaih0cmVlSWQpLl9ob3N0O1xuXG4gICAgICAgICAgICAgIHZhciBmbG93Tm9kZUVudGl0eSA9IHRoaXMuZ2V0WlRyZWVPYmoodHJlZUlkKS5mbG93Tm9kZUVudGl0eTtcbiAgICAgICAgICAgICAgdmFyIHJlY2VpdmVUeXBlID0gdGhpcy5nZXRaVHJlZU9iaih0cmVlSWQpLnJlY2VpdmVUeXBlO1xuXG4gICAgICAgICAgICAgIF90aGlzLmFkZFJlY2VpdmVyVG9TZWxlY3RlZCh0cmVlTm9kZSwgZmxvd05vZGVFbnRpdHksIHJlY2VpdmVUeXBlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBiZWZvcmVBc3luYzogZnVuY3Rpb24gYmVmb3JlQXN5bmModHJlZUlkLCB0cmVlTm9kZSkge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0cmVlSWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgdHJlZU9iak1hcDoge31cbiAgICAgIH0sXG4gICAgICBzZWxlY3RlZFJlY2VpdmVyOiB7XG4gICAgICAgIGNvbHVtbnNDb25maWc6IFt7XG4gICAgICAgICAgdGl0bGU6ICflt7LpgInnlKjmiLcnLFxuICAgICAgICAgIGtleTogJ25hbWUnLFxuICAgICAgICAgIHdpZHRoOiAxODgsXG4gICAgICAgICAgYWxpZ246IFwiY2VudGVyXCJcbiAgICAgICAgfSwge1xuICAgICAgICAgIHRpdGxlOiAn5pON5L2cJyxcbiAgICAgICAgICBzbG90OiAnYWN0aW9uJyxcbiAgICAgICAgICB3aWR0aDogNzAsXG4gICAgICAgICAgYWxpZ246IFwiY2VudGVyXCJcbiAgICAgICAgfV0sXG4gICAgICAgIHJlY2VpdmVyRGF0YTogW11cbiAgICAgIH1cbiAgICB9O1xuICB9LFxuICBtb3VudGVkOiBmdW5jdGlvbiBtb3VudGVkKCkge30sXG4gIGZpbHRlcnM6IHtcbiAgICBmaWx0ZXJSZWNlaXZlckRhdGE6IGZ1bmN0aW9uIGZpbHRlclJlY2VpdmVyRGF0YShyZWNlaXZlckRhdGEsIGZsb3dOb2RlRW50aXR5LCByZWNlaXZlVHlwZSkge1xuICAgICAgcmV0dXJuIHJlY2VpdmVyRGF0YS5maWx0ZXIoZnVuY3Rpb24gKHJlY2VpdmVyKSB7XG4gICAgICAgIHJldHVybiByZWNlaXZlci5mbG93Tm9kZUVudGl0eS5pZCA9PSBmbG93Tm9kZUVudGl0eS5pZCAmJiByZWNlaXZlci5yZWNlaXZlVHlwZSA9PSByZWNlaXZlVHlwZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgbWV0aG9kczoge1xuICAgIGJlZ2luU2VsZWN0UmVjZWl2ZXI6IGZ1bmN0aW9uIGJlZ2luU2VsZWN0UmVjZWl2ZXIoc2VuZGVyLCBuZXh0Rmxvd05vZGVFbnRpdGllcywgc2VsZWN0UmVjZWl2ZXJDb21wbGV0ZWRGdW5jKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICB2YXIgZWxlbSA9IHRoaXMuJHJlZnMudXNlclRhc2tSZWNlaXZlckRpYWxvZ1dyYXA7XG4gICAgICBEaWFsb2dVdGlsaXR5LkRpYWxvZ0VsZW1PYmooZWxlbSwge1xuICAgICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgICAgd2lkdGg6IDY1MCxcbiAgICAgICAgaGVpZ2h0OiA2MDAsXG4gICAgICAgIHRpdGxlOiBcIumAieaLqeaOpeaUtuS6uuWRmFwiLFxuICAgICAgICByZXNpemFibGU6IGZhbHNlLFxuICAgICAgICBidXR0b25zOiB7XG4gICAgICAgICAgXCLnoa7orqRcIjogZnVuY3Rpb24gXygpIHtcbiAgICAgICAgICAgIGlmIChfdGhpcy52YWxpZGF0ZUNvbXBsZXRlRW5hYmxlKCkuc3VjY2Vzcykge1xuICAgICAgICAgICAgICBzZWxlY3RSZWNlaXZlckNvbXBsZXRlZEZ1bmMuY2FsbChzZW5kZXIsIF90aGlzLm5leHRGbG93Tm9kZUVudGl0aWVzLCBfdGhpcy5zZWxlY3RlZFJlY2VpdmVyLnJlY2VpdmVyRGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIuWPlua2iFwiOiBmdW5jdGlvbiBfKCkge1xuICAgICAgICAgICAgVXNlclRhc2tSZWNlaXZlckRpYWxvZ1V0aWxpdHkuQ2xvc2VEaWFsb2coKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG9wZW46IGZ1bmN0aW9uIG9wZW4oZXZlbnQsIHVpKSB7XG4gICAgICAgICAgJChcIi51aS1kaWFsb2ctdGl0bGViYXItY2xvc2VcIiwgJCh0aGlzKS5wYXJlbnQoKSkuaGlkZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMubmV4dEZsb3dOb2RlRW50aXRpZXMgPSBuZXh0Rmxvd05vZGVFbnRpdGllcztcbiAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KHRoaXMuaW5pdFRyZWUsIDUwMCk7XG4gICAgfSxcbiAgICBnZXRSb290T3JnYW5NYWluUmVjZWl2ZU9iamVjdHM6IGZ1bmN0aW9uIGdldFJvb3RPcmdhbk1haW5SZWNlaXZlT2JqZWN0cygpIHtcbiAgICAgIHJldHVybiBbe1xuICAgICAgICBcInZhbHVlXCI6IG51bGwsXG4gICAgICAgIFwidGV4dFwiOiBudWxsLFxuICAgICAgICBcImlkXCI6IFwiMFwiLFxuICAgICAgICBcInBhcmVudElkXCI6IG51bGwsXG4gICAgICAgIFwib3V0ZXJJZFwiOiBudWxsLFxuICAgICAgICBcImNvZGVcIjogXCIwMDAwXCIsXG4gICAgICAgIFwiYXR0cjFcIjogbnVsbCxcbiAgICAgICAgXCJhdHRyMlwiOiBudWxsLFxuICAgICAgICBcImF0dHIzXCI6IG51bGwsXG4gICAgICAgIFwiYXR0cjRcIjogbnVsbCxcbiAgICAgICAgXCJub2RlVHlwZU5hbWVcIjogbnVsbCxcbiAgICAgICAgXCJpY29uXCI6IG51bGwsXG4gICAgICAgIFwibm9jaGVja1wiOiBmYWxzZSxcbiAgICAgICAgXCJpc1BhcmVudFwiOiBcInRydWVcIixcbiAgICAgICAgXCJvcGVuXCI6IGZhbHNlLFxuICAgICAgICBcIm5hbWVcIjogXCLnu4Tnu4fmnLrmnoTnrqHnkIZcIixcbiAgICAgICAgXCJ0eXBlTmFtZVwiOiBcIk9yZ2Fuc1wiLFxuICAgICAgICBcImRlc2NcIjogbnVsbCxcbiAgICAgICAgXCJzdGF0dXNcIjogXCLlkK/nlKhcIixcbiAgICAgICAgXCJmaWx0ZXJcIjogXCJcIixcbiAgICAgICAgXCJvcmRlck51bVwiOiAyMixcbiAgICAgICAgXCJydW50aW1lUmVjZWl2ZVVzZXJzXCI6IG51bGwsXG4gICAgICAgIFwiZ3JvdXBcIjogdHJ1ZSxcbiAgICAgICAgXCJjdXN0TmFtZVwiOiBmYWxzZVxuICAgICAgfV07XG4gICAgfSxcbiAgICBpbml0VHJlZTogZnVuY3Rpb24gaW5pdFRyZWUoKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubmV4dEZsb3dOb2RlRW50aXRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGZsb3dOb2RlRW50aXR5ID0gdGhpcy5uZXh0Rmxvd05vZGVFbnRpdGllc1tpXTtcblxuICAgICAgICBpZiAoZmxvd05vZGVFbnRpdHkuZXh0ZW5zaW9uRWxlbWVudHMgJiYgZmxvd05vZGVFbnRpdHkuZXh0ZW5zaW9uRWxlbWVudHMuamI0ZGNNYWluUmVjZWl2ZU9iamVjdHMgJiYgZmxvd05vZGVFbnRpdHkuZXh0ZW5zaW9uRWxlbWVudHMuamI0ZGNNYWluUmVjZWl2ZU9iamVjdHMucnVudGltZVJlY2VpdmVHcm91cHMpIHtcbiAgICAgICAgICB2YXIgdHJlZU9iaktleSA9IHRoaXMuYnVpbGRVbFRyZWVJZChmbG93Tm9kZUVudGl0eSwgXCJtYWluXCIpO1xuICAgICAgICAgIHRoaXMucmVjZWl2ZXJUcmVlLnRyZWVPYmpNYXBbdHJlZU9iaktleV0gPSAkLmZuLnpUcmVlLmluaXQoJChcIiNcIiArIHRyZWVPYmpLZXkpLCB0aGlzLnJlY2VpdmVyVHJlZS50cmVlU2V0dGluZywgZmxvd05vZGVFbnRpdHkuZXh0ZW5zaW9uRWxlbWVudHMuamI0ZGNNYWluUmVjZWl2ZU9iamVjdHMucnVudGltZVJlY2VpdmVHcm91cHMpO1xuICAgICAgICAgIHRoaXMucmVjZWl2ZXJUcmVlLnRyZWVPYmpNYXBbdHJlZU9iaktleV0uX2hvc3QgPSB0aGlzO1xuICAgICAgICAgIHRoaXMucmVjZWl2ZXJUcmVlLnRyZWVPYmpNYXBbdHJlZU9iaktleV0uZmxvd05vZGVFbnRpdHkgPSBmbG93Tm9kZUVudGl0eTtcbiAgICAgICAgICB0aGlzLnJlY2VpdmVyVHJlZS50cmVlT2JqTWFwW3RyZWVPYmpLZXldLnJlY2VpdmVUeXBlID0gXCJtYWluXCI7XG4gICAgICAgIH0gZWxzZSBpZiAoIWZsb3dOb2RlRW50aXR5LmV4dGVuc2lvbkVsZW1lbnRzIHx8ICFmbG93Tm9kZUVudGl0eS5leHRlbnNpb25FbGVtZW50cy5qYjRkY01haW5SZWNlaXZlT2JqZWN0cyB8fCAhZmxvd05vZGVFbnRpdHkuZXh0ZW5zaW9uRWxlbWVudHMuamI0ZGNNYWluUmVjZWl2ZU9iamVjdHMuamI0ZGNSZWNlaXZlT2JqZWN0TGlzdCkge1xuICAgICAgICAgIHZhciBfdHJlZU9iaktleSA9IHRoaXMuYnVpbGRVbFRyZWVJZChmbG93Tm9kZUVudGl0eSwgXCJtYWluXCIpO1xuXG4gICAgICAgICAgdGhpcy5yZWNlaXZlclRyZWUudHJlZU9iak1hcFtfdHJlZU9iaktleV0gPSAkLmZuLnpUcmVlLmluaXQoJChcIiNcIiArIF90cmVlT2JqS2V5KSwgdGhpcy5yZWNlaXZlclRyZWUudHJlZVNldHRpbmcsIHRoaXMuZ2V0Um9vdE9yZ2FuTWFpblJlY2VpdmVPYmplY3RzKCkpO1xuICAgICAgICAgIHRoaXMucmVjZWl2ZXJUcmVlLnRyZWVPYmpNYXBbX3RyZWVPYmpLZXldLl9ob3N0ID0gdGhpcztcbiAgICAgICAgICB0aGlzLnJlY2VpdmVyVHJlZS50cmVlT2JqTWFwW190cmVlT2JqS2V5XS5mbG93Tm9kZUVudGl0eSA9IGZsb3dOb2RlRW50aXR5O1xuICAgICAgICAgIHRoaXMucmVjZWl2ZXJUcmVlLnRyZWVPYmpNYXBbX3RyZWVPYmpLZXldLnJlY2VpdmVUeXBlID0gXCJtYWluXCI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZmxvd05vZGVFbnRpdHkuZXh0ZW5zaW9uRWxlbWVudHMgJiYgZmxvd05vZGVFbnRpdHkuZXh0ZW5zaW9uRWxlbWVudHMuamI0ZGNDQ1JlY2VpdmVPYmplY3RzICYmIGZsb3dOb2RlRW50aXR5LmV4dGVuc2lvbkVsZW1lbnRzLmpiNGRjQ0NSZWNlaXZlT2JqZWN0cy5ydW50aW1lUmVjZWl2ZUdyb3Vwcykge1xuICAgICAgICAgIHZhciBfdHJlZU9iaktleTIgPSB0aGlzLmJ1aWxkVWxUcmVlSWQoZmxvd05vZGVFbnRpdHksIFwiY2NcIik7XG5cbiAgICAgICAgICB0aGlzLnJlY2VpdmVyVHJlZS50cmVlT2JqTWFwW190cmVlT2JqS2V5Ml0gPSAkLmZuLnpUcmVlLmluaXQoJChcIiNcIiArIF90cmVlT2JqS2V5MiksIHRoaXMucmVjZWl2ZXJUcmVlLnRyZWVTZXR0aW5nLCBmbG93Tm9kZUVudGl0eS5leHRlbnNpb25FbGVtZW50cy5qYjRkY0NDUmVjZWl2ZU9iamVjdHMucnVudGltZVJlY2VpdmVHcm91cHMpO1xuICAgICAgICAgIHRoaXMucmVjZWl2ZXJUcmVlLnRyZWVPYmpNYXBbX3RyZWVPYmpLZXkyXS5faG9zdCA9IHRoaXM7XG4gICAgICAgICAgdGhpcy5yZWNlaXZlclRyZWUudHJlZU9iak1hcFtfdHJlZU9iaktleTJdLmZsb3dOb2RlRW50aXR5ID0gZmxvd05vZGVFbnRpdHk7XG4gICAgICAgICAgdGhpcy5yZWNlaXZlclRyZWUudHJlZU9iak1hcFtfdHJlZU9iaktleTJdLnJlY2VpdmVUeXBlID0gXCJjY1wiO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBidWlsZFVsVHJlZUlkOiBmdW5jdGlvbiBidWlsZFVsVHJlZUlkKGZsb3dOb2RlRW50aXR5LCByZWNlaXZlVHlwZSkge1xuICAgICAgcmV0dXJuICd1bFRyZWVfJyArIHJlY2VpdmVUeXBlICsgXCJfXCIgKyBmbG93Tm9kZUVudGl0eS5pZDtcbiAgICB9LFxuICAgIGFkZFRyZWVTZWxlY3RlZFJlY2VpdmVyVG9TZWxlY3RlZDogZnVuY3Rpb24gYWRkVHJlZVNlbGVjdGVkUmVjZWl2ZXJUb1NlbGVjdGVkKGZsb3dOb2RlRW50aXR5LCByZWNlaXZlVHlwZSkge1xuICAgICAgdmFyIHRyZWVLZXkgPSB0aGlzLmJ1aWxkVWxUcmVlSWQoZmxvd05vZGVFbnRpdHksIHJlY2VpdmVUeXBlKTtcbiAgICAgIHZhciB0cmVlT2JqZWN0ID0gdGhpcy5yZWNlaXZlclRyZWUudHJlZU9iak1hcFt0cmVlS2V5XTtcblxuICAgICAgaWYgKHRyZWVPYmplY3QpIHtcbiAgICAgICAgdmFyIHNlbGVjdE5vZGVzID0gdHJlZU9iamVjdC5nZXRTZWxlY3RlZE5vZGVzKCk7XG5cbiAgICAgICAgaWYgKHNlbGVjdE5vZGVzICYmIHNlbGVjdE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aGlzLmFkZFJlY2VpdmVyVG9TZWxlY3RlZChzZWxlY3ROb2Rlc1swXSwgZmxvd05vZGVFbnRpdHksIHJlY2VpdmVUeXBlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgYWRkUmVjZWl2ZXJUb1NlbGVjdGVkOiBmdW5jdGlvbiBhZGRSZWNlaXZlclRvU2VsZWN0ZWQoc2VsZWN0Tm9kZSwgZmxvd05vZGVFbnRpdHksIHJlY2VpdmVUeXBlKSB7XG4gICAgICB2YXIgaXNNdWx0aUluc3RhbmNlVGFzayA9IHRoaXMuaXNNdWx0aUluc3RhbmNlVGFzayhmbG93Tm9kZUVudGl0eSk7XG4gICAgICB2YXIgaW5uZXJTaW5nbGVJZCA9IGZsb3dOb2RlRW50aXR5LmlkICsgXCJfXCIgKyByZWNlaXZlVHlwZSArIFwiX1wiICsgc2VsZWN0Tm9kZS5pZDtcblxuICAgICAgaWYgKHNlbGVjdE5vZGUudHlwZU5hbWUgPT0gXCJTaW5nbGVVc2VyXCIpIHtcbiAgICAgICAgc2VsZWN0Tm9kZS5pbm5lclNpbmdsZUlkID0gaW5uZXJTaW5nbGVJZDtcbiAgICAgICAgc2VsZWN0Tm9kZS5mbG93Tm9kZUVudGl0eSA9IGZsb3dOb2RlRW50aXR5O1xuICAgICAgICBzZWxlY3ROb2RlLnJlY2VpdmVUeXBlID0gcmVjZWl2ZVR5cGU7XG5cbiAgICAgICAgaWYgKChyZWNlaXZlVHlwZSA9PSBcImNjXCIgfHwgaXNNdWx0aUluc3RhbmNlVGFzaykgJiYgIUFycmF5VXRpbGl0eS5FeGlzdCh0aGlzLnNlbGVjdGVkUmVjZWl2ZXIucmVjZWl2ZXJEYXRhLCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgIHJldHVybiBpdGVtLmlubmVyU2luZ2xlSWQgPT0gaW5uZXJTaW5nbGVJZDtcbiAgICAgICAgfSkpIHtcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkUmVjZWl2ZXIucmVjZWl2ZXJEYXRhLnB1c2goc2VsZWN0Tm9kZSk7XG4gICAgICAgIH0gZWxzZSBpZiAocmVjZWl2ZVR5cGUgPT0gXCJtYWluXCIgJiYgIWlzTXVsdGlJbnN0YW5jZVRhc2spIHtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGVkUmVjZWl2ZXIucmVjZWl2ZXJEYXRhW2ldLmZsb3dOb2RlRW50aXR5LmlkID09IGZsb3dOb2RlRW50aXR5LmlkICYmIHRoaXMuc2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGFbaV0ucmVjZWl2ZVR5cGUgPT0gcmVjZWl2ZVR5cGUpIHtcbiAgICAgICAgICAgICAgQXJyYXlVdGlsaXR5LkRlbGV0ZSh0aGlzLnNlbGVjdGVkUmVjZWl2ZXIucmVjZWl2ZXJEYXRhLCBpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLnNlbGVjdGVkUmVjZWl2ZXIucmVjZWl2ZXJEYXRhLnB1c2goc2VsZWN0Tm9kZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoaXNNdWx0aUluc3RhbmNlVGFzayAmJiAoc2VsZWN0Tm9kZS50eXBlTmFtZSA9PSBcIlVzZXJzXCIgfHwgc2VsZWN0Tm9kZS50eXBlTmFtZSA9PSBcIlJvbGVcIiB8fCBzZWxlY3ROb2RlLnR5cGVOYW1lID09IFwiT3JnYW5zXCIpKSB7XG4gICAgICAgIGlmIChzZWxlY3ROb2RlLnJ1bnRpbWVSZWNlaXZlVXNlcnMgIT0gbnVsbCAmJiBzZWxlY3ROb2RlLnJ1bnRpbWVSZWNlaXZlVXNlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBzZWxlY3ROb2RlLnJ1bnRpbWVSZWNlaXZlVXNlcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgY2hpbGROb2RlID0gc2VsZWN0Tm9kZS5ydW50aW1lUmVjZWl2ZVVzZXJzW19pXTtcblxuICAgICAgICAgICAgaWYgKGNoaWxkTm9kZS50eXBlTmFtZSA9PSBcIlNpbmdsZVVzZXJcIikge1xuICAgICAgICAgICAgICB0aGlzLmFkZFJlY2VpdmVyVG9TZWxlY3RlZChjaGlsZE5vZGUsIGZsb3dOb2RlRW50aXR5LCByZWNlaXZlVHlwZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBjbGVhclNlbGVjdGVkUmVjZWl2ZXJUb1NlbGVjdGVkOiBmdW5jdGlvbiBjbGVhclNlbGVjdGVkUmVjZWl2ZXJUb1NlbGVjdGVkKGZsb3dOb2RlRW50aXR5LCByZWNlaXZlVHlwZSkge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMuc2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGEubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgdmFyIHJlY2VpdmVyID0gdGhpcy5zZWxlY3RlZFJlY2VpdmVyLnJlY2VpdmVyRGF0YVtpXTtcblxuICAgICAgICBpZiAocmVjZWl2ZXIuZmxvd05vZGVFbnRpdHkuaWQgPT0gZmxvd05vZGVFbnRpdHkuaWQgJiYgcmVjZWl2ZXIucmVjZWl2ZVR5cGUgPT0gcmVjZWl2ZVR5cGUpIHtcbiAgICAgICAgICBBcnJheVV0aWxpdHkuRGVsZXRlKHRoaXMuc2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGEsIGkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBkZWxldGVTZWxlY3RlZFJlY2VpdmVyOiBmdW5jdGlvbiBkZWxldGVTZWxlY3RlZFJlY2VpdmVyKGluZGV4LCByb3cpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zZWxlY3RlZFJlY2VpdmVyLnJlY2VpdmVyRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZFJlY2VpdmVyLnJlY2VpdmVyRGF0YVtpXS5pbm5lclNpbmdsZUlkID09IHJvdy5pbm5lclNpbmdsZUlkKSB7XG4gICAgICAgICAgQXJyYXlVdGlsaXR5LkRlbGV0ZSh0aGlzLnNlbGVjdGVkUmVjZWl2ZXIucmVjZWl2ZXJEYXRhLCBpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgaXNNdWx0aUluc3RhbmNlVGFzazogZnVuY3Rpb24gaXNNdWx0aUluc3RhbmNlVGFzayhmbG93Tm9kZUVudGl0eSkge1xuICAgICAgcmV0dXJuIGZsb3dOb2RlRW50aXR5Lm11bHRpSW5zdGFuY2VUYXNrO1xuICAgIH0sXG4gICAgYnVpbGRUYWJMYWJlbDogZnVuY3Rpb24gYnVpbGRUYWJMYWJlbChmbG93Tm9kZUVudGl0eSkge1xuICAgICAgcmV0dXJuIGZsb3dOb2RlRW50aXR5Lm5hbWUgKyBcIiBbXCIgKyAodGhpcy5pc011bHRpSW5zdGFuY2VUYXNrKGZsb3dOb2RlRW50aXR5KSA/IFwi5aSa5Lq6XCIgOiBcIuWNleS6ulwiKSArIFwiXVwiO1xuICAgIH0sXG4gICAgdmFsaWRhdGVDb21wbGV0ZUVuYWJsZTogZnVuY3Rpb24gdmFsaWRhdGVDb21wbGV0ZUVuYWJsZSgpIHtcbiAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICB2YXIgZXJyb3JNZXNzYWdlcyA9IFtdO1xuICAgICAgdmFyIHN1Y2Nlc3MgPSB0cnVlO1xuXG4gICAgICB2YXIgX2xvb3AgPSBmdW5jdGlvbiBfbG9vcChpKSB7XG4gICAgICAgIGlmIChfdGhpczIubmV4dEZsb3dOb2RlRW50aXRpZXNbaV0udGFza1R5cGVOYW1lID09IFwiY29tLmpiNGRjLndvcmtmbG93LnBvLmJwbW4ucHJvY2Vzcy5CcG1uVXNlclRhc2tcIikge1xuICAgICAgICAgIGlmICghQXJyYXlVdGlsaXR5LkV4aXN0KF90aGlzMi5zZWxlY3RlZFJlY2VpdmVyLnJlY2VpdmVyRGF0YSwgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtLmZsb3dOb2RlRW50aXR5LmlkID09IF90aGlzMi5uZXh0Rmxvd05vZGVFbnRpdGllc1tpXS5pZCAmJiBpdGVtLnJlY2VpdmVUeXBlID09IFwibWFpblwiO1xuICAgICAgICAgIH0pKSB7XG4gICAgICAgICAgICBlcnJvck1lc3NhZ2VzLnB1c2goe1xuICAgICAgICAgICAgICB0YXNrTmFtZTogX3RoaXMyLm5leHRGbG93Tm9kZUVudGl0aWVzW2ldLm5hbWUsXG4gICAgICAgICAgICAgIGZsb3dOb2RlRW50aXR5OiBfdGhpczIubmV4dEZsb3dOb2RlRW50aXRpZXNbaV0sXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IFwi546v6IqCW1wiICsgX3RoaXMyLm5leHRGbG93Tm9kZUVudGl0aWVzW2ldLm5hbWUgKyBcIl3oh7PlsJHpnIDopoHorr7nva7kuIDkuKrmjqXmlLbnlKjmiLchXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm5leHRGbG93Tm9kZUVudGl0aWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIF9sb29wKGkpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXJyb3JNZXNzYWdlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHZhciBlcnJvclRleHRBcnkgPSBbXTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVycm9yTWVzc2FnZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBlcnJvclRleHRBcnkucHVzaChlcnJvck1lc3NhZ2VzW2ldLm1lc3NhZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydFRleHQoZXJyb3JUZXh0QXJ5LmpvaW4oXCI8YnIgLz5cIiksIHRoaXMpO1xuICAgICAgICBzdWNjZXNzID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN1Y2Nlc3M6IHN1Y2Nlc3NcbiAgICAgIH07XG4gICAgfVxuICB9LFxuICB0ZW1wbGF0ZTogXCI8ZGl2IGlkPVxcXCJ1c2VyVGFza1JlY2VpdmVyRGlhbG9nSW5uZXJcXFwiIHJlZj1cXFwidXNlclRhc2tSZWNlaXZlckRpYWxvZ1dyYXBcXFwiIHN0eWxlPVxcXCJkaXNwbGF5OiBub25lXFxcIj5cXG4gICAgICAgICAgICAgICAgPHRhYnMgbmFtZT1cXFwidXNlclRhc2tSZWNlaXZlckRpYWxvZ1RhYnNcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPHRhYi1wYW5lIDpsYWJlbD1cXFwiYnVpbGRUYWJMYWJlbChmbG93Tm9kZUVudGl0eSlcXFwiIHRhYj1cXFwidXNlclRhc2tSZWNlaXZlckRpYWxvZ1RhYnNcXFwiIHYtZm9yPVxcXCJmbG93Tm9kZUVudGl0eSBpbiBuZXh0Rmxvd05vZGVFbnRpdGllc1xcXCIgOmtleT1cXFwiZmxvd05vZGVFbnRpdHkuaWRcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxjb2xsYXBzZSBhY2NvcmRpb24gdmFsdWU9XFxcIm1haW5SZWNlaXZlclxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYW5lbCBuYW1lPVxcXCJtYWluUmVjZWl2ZXJcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFx1NEUzQlxcdTkwMDFcXHU0RUJBXFx1NTQ1OFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzbG90PVxcXCJjb250ZW50XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJ1c2VyLXRhc2stcmVjZWl2ZXItZGlhbG9nLW91dGVyLXdyYXBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJzZWxlY3RFbmFibGVVc2VyTGlzdFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dWwgOmlkPVxcXCJidWlsZFVsVHJlZUlkKGZsb3dOb2RlRW50aXR5LCdtYWluJylcXFwiIGNsYXNzPVxcXCJ6dHJlZVxcXCIgc3R5bGU9XFxcIndpZHRoOiAyMDBweFxcXCI+PC91bD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNlbGVjdE9wQnV0dG9uQ29udGFpbmVyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNpbmdsZS1vcC1idXR0b25cXFwiIHRpdGxlPVxcXCJcXHU2REZCXFx1NTJBMFxcdTRFQkFcXHU1NDU4XFxcIiBAY2xpY2s9XFxcImFkZFRyZWVTZWxlY3RlZFJlY2VpdmVyVG9TZWxlY3RlZChmbG93Tm9kZUVudGl0eSwnbWFpbicpXFxcIj48SWNvbiB0eXBlPVxcXCJtZC1hcnJvdy1yb3VuZC1mb3J3YXJkXFxcIiAvPjwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic2luZ2xlLW9wLWJ1dHRvblxcXCIgdGl0bGU9XFxcIlxcdTZFMDVcXHU3QTdBXFx1NURGMlxcdTkwMDlcXHU0RUJBXFx1NTQ1OFxcXCIgQGNsaWNrPVxcXCJjbGVhclNlbGVjdGVkUmVjZWl2ZXJUb1NlbGVjdGVkKGZsb3dOb2RlRW50aXR5LCdtYWluJylcXFwiPjxJY29uIHR5cGU9XFxcIm1kLWJhY2tzcGFjZVxcXCIgLz48L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNlbGVjdGVkVXNlckxpc3RcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktdGFibGUgaGVpZ2h0PVxcXCIzMjdcXFwiIHdpZHRoPVxcXCIyNjBcXFwiIHN0cmlwZSA6Y29sdW1ucz1cXFwic2VsZWN0ZWRSZWNlaXZlci5jb2x1bW5zQ29uZmlnXFxcIiA6ZGF0YT1cXFwic2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGEgfCBmaWx0ZXJSZWNlaXZlckRhdGEoZmxvd05vZGVFbnRpdHksICdtYWluJylcXFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVxcXCJpdi1saXN0LXRhYmxlXFxcIiBzaXplPVxcXCJzbWFsbFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZW1wbGF0ZSBzbG90LXNjb3BlPVxcXCJ7IHJvdywgaW5kZXggfVxcXCIgc2xvdD1cXFwiYWN0aW9uXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibGlzdC1mb250LWljb24tYnV0dG9uLWNsYXNzXFxcIiBAY2xpY2s9XFxcImRlbGV0ZVNlbGVjdGVkUmVjZWl2ZXIoaW5kZXgscm93KVxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SWNvbiB0eXBlPVxcXCJtZC1jbG9zZVxcXCIgLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZW1wbGF0ZT4gICAgIFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pLXRhYmxlPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3BhbmVsPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGFuZWwgbmFtZT1cXFwiY2NSZWNlaXZlclxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXHU2Mjg0XFx1OTAwMVxcdTRFQkFcXHU1NDU4XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHNsb3Q9XFxcImNvbnRlbnRcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInVzZXItdGFzay1yZWNlaXZlci1kaWFsb2ctb3V0ZXItd3JhcFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNlbGVjdEVuYWJsZVVzZXJMaXN0XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1bCA6aWQ9XFxcImJ1aWxkVWxUcmVlSWQoZmxvd05vZGVFbnRpdHksJ2NjJylcXFwiIGNsYXNzPVxcXCJ6dHJlZVxcXCIgc3R5bGU9XFxcIndpZHRoOiAyMDBweFxcXCI+PC91bD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNlbGVjdE9wQnV0dG9uQ29udGFpbmVyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNpbmdsZS1vcC1idXR0b25cXFwiIHRpdGxlPVxcXCJcXHU2REZCXFx1NTJBMFxcdTRFQkFcXHU1NDU4XFxcIiBAY2xpY2s9XFxcImFkZFJlY2VpdmVyVG9TZWxlY3RlZChmbG93Tm9kZUVudGl0eSwnY2MnKVxcXCI+PEljb24gdHlwZT1cXFwibWQtYXJyb3ctcm91bmQtZm9yd2FyZFxcXCIgLz48L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNpbmdsZS1vcC1idXR0b25cXFwiIHRpdGxlPVxcXCJcXHU2RTA1XFx1N0E3QVxcdTVERjJcXHU5MDA5XFx1NEVCQVxcdTU0NThcXFwiPjxJY29uIHR5cGU9XFxcIm1kLWJhY2tzcGFjZVxcXCIgLz48L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNlbGVjdGVkVXNlckxpc3RcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGktdGFibGUgaGVpZ2h0PVxcXCIzMjdcXFwiIHdpZHRoPVxcXCIyNjBcXFwiIHN0cmlwZSA6Y29sdW1ucz1cXFwic2VsZWN0ZWRSZWNlaXZlci5jb2x1bW5zQ29uZmlnXFxcIiA6ZGF0YT1cXFwic2VsZWN0ZWRSZWNlaXZlci5yZWNlaXZlckRhdGEgfCBmaWx0ZXJSZWNlaXZlckRhdGEoZmxvd05vZGVFbnRpdHksICdjYycpXFxcIlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cXFwiaXYtbGlzdC10YWJsZVxcXCIgc2l6ZT1cXFwic21hbGxcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGVtcGxhdGUgc2xvdC1zY29wZT1cXFwieyByb3csIGluZGV4IH1cXFwiIHNsb3Q9XFxcImFjdGlvblxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImxpc3QtZm9udC1pY29uLWJ1dHRvbi1jbGFzc1xcXCIgQGNsaWNrPVxcXCJkZWxldGVTZWxlY3RlZFJlY2VpdmVyKGluZGV4LHJvdylcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEljb24gdHlwZT1cXFwibWQtY2xvc2VcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGVtcGxhdGU+ICAgICBcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaS10YWJsZT5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9wYW5lbD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2NvbGxhcHNlPlxcbiAgICAgICAgICAgICAgICAgICAgPC90YWItcGFuZT5cXG4gICAgICAgICAgICAgICAgPC90YWJzPlxcbiAgICAgICAgICAgIDwvZGl2PlwiXG59KTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIERvY3VtZW50Q29udGVudFVwbG9hZENvbnZlcnRUb1BERlBsdWdpbiA9IHtcbiAgZ2V0SHRtbEVsZW06IGZ1bmN0aW9uIGdldEh0bWxFbGVtKHByb3BDb25maWcpIHtcbiAgICByZXR1cm4gXCI8ZGl2IFxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbF9jYXRlZ29yeT1cXFwiSW5wdXRDb250cm9sXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgIGlkPVxcXCJkb2N1bWVudF9jb250ZW50X3VwbG9hZF9jb252ZXJ0X3RvX3BkZl9wbHVnaW5cXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgaXNfamJ1aWxkNGRjX2RhdGE9XFxcInRydWVcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgamJ1aWxkNGRjX2N1c3RvbT1cXFwidHJ1ZVxcXCIgXFxuICAgICAgICAgICAgICAgICAgICBuYW1lPVxcXCJkb2N1bWVudF9jb250ZW50X3VwbG9hZF9jb252ZXJ0X3RvX3BkZl9wbHVnaW5cXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgc2VyaWFsaXplPVxcXCJmYWxzZVxcXCIgXFxuICAgICAgICAgICAgICAgICAgICBzaW5nbGVuYW1lPVxcXCJXRkRDVF9Eb2N1bWVudENvbnRlbnRVcGxvYWRDb252ZXJ0VG9QREZDb250YWluZXJcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzPVxcXCJlbmFibGVcXFwiIFxcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9XFxcIlxcXCIgXFxuICAgICAgICAgICAgICAgICAgICA+XFxuICAgICAgICAgICAgICAgICAgICBcXHU2NzJBXFx1NUYwMFxcdTUzRDEhXFxuICAgICAgICAgICAgICAgIDwvZGl2PlwiO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRmxvd0ZpbGVzTGlzdFNpbmdsZVBsdWdpbiA9IHtcbiAgX3Byb3A6IHt9LFxuICBfZmxvd0luc3RhbmNlUnVudGltZVBPOiBudWxsLFxuICBfY3VycmVudE5vZGU6IG51bGwsXG4gIF9hdXRob3JpdGllc0ZpbGVBdXRob3JpdHk6IG51bGwsXG4gIF9hdXRob3JpdGllc09ubHlTZW5kQmFja0NhbkVkaXQ6IFwiZmFsc2VcIixcbiAgZ2V0SHRtbEVsZW06IGZ1bmN0aW9uIGdldEh0bWxFbGVtKHByb3BDb25maWcpIHtcbiAgICBGbG93RmlsZXNMaXN0U2luZ2xlUGx1Z2luLl9wcm9wID0gcHJvcENvbmZpZztcbiAgICBGbG93RmlsZXNMaXN0U2luZ2xlUGx1Z2luLl9mbG93SW5zdGFuY2VSdW50aW1lUE8gPSBwcm9wQ29uZmlnLkZsb3dJbnN0YW5jZVJ1bnRpbWVQTztcbiAgICBGbG93RmlsZXNMaXN0U2luZ2xlUGx1Z2luLl9jdXJyZW50Tm9kZSA9IEFycmF5VXRpbGl0eS5XaGVyZShGbG93RmlsZXNMaXN0U2luZ2xlUGx1Z2luLl9mbG93SW5zdGFuY2VSdW50aW1lUE8uYnBtbkRlZmluaXRpb25zLmJwbW5Qcm9jZXNzLnVzZXJUYXNrTGlzdCwgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHJldHVybiBpdGVtLmlkID09IEZsb3dGaWxlc0xpc3RTaW5nbGVQbHVnaW4uX2Zsb3dJbnN0YW5jZVJ1bnRpbWVQTy5jdXJyZW50Tm9kZUtleTtcbiAgICB9KTtcblxuICAgIGlmIChGbG93RmlsZXNMaXN0U2luZ2xlUGx1Z2luLl9jdXJyZW50Tm9kZS5sZW5ndGggPT0gMCkge1xuICAgICAgRmxvd0ZpbGVzTGlzdFNpbmdsZVBsdWdpbi5fY3VycmVudE5vZGUgPSBGbG93RmlsZXNMaXN0U2luZ2xlUGx1Z2luLl9mbG93SW5zdGFuY2VSdW50aW1lUE8uYnBtbkRlZmluaXRpb25zLmJwbW5Qcm9jZXNzLnN0YXJ0RXZlbnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIEZsb3dGaWxlc0xpc3RTaW5nbGVQbHVnaW4uX2N1cnJlbnROb2RlID0gRmxvd0ZpbGVzTGlzdFNpbmdsZVBsdWdpbi5fY3VycmVudE5vZGVbMF07XG4gICAgfVxuXG4gICAgaWYgKEZsb3dGaWxlc0xpc3RTaW5nbGVQbHVnaW4uX2N1cnJlbnROb2RlLmV4dGVuc2lvbkVsZW1lbnRzKSB7XG4gICAgICBGbG93RmlsZXNMaXN0U2luZ2xlUGx1Z2luLl9hdXRob3JpdGllc0ZpbGVBdXRob3JpdHkgPSBKc29uVXRpbGl0eS5TdHJpbmdUb0pzb24oRmxvd0ZpbGVzTGlzdFNpbmdsZVBsdWdpbi5fY3VycmVudE5vZGUuZXh0ZW5zaW9uRWxlbWVudHMuamI0ZGNBdXRob3JpdGllcy5hdXRob3JpdGllc0ZpbGVBdXRob3JpdHkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBGbG93RmlsZXNMaXN0U2luZ2xlUGx1Z2luLl9hdXRob3JpdGllc0ZpbGVBdXRob3JpdHkgPSB7XG4gICAgICAgIGFkZEZpbGU6IFwidHJ1ZVwiXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBcIjxkaXYgaWQ9XFxcIkZsb3dGaWxlc0xpc3RQbHVnaW5Db250YWluZXJcXFwiPlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cIjtcbiAgfSxcbiAgYWNJbnRlcmZhY2U6IHtcbiAgICBnZXRGaWxlTGlzdERhdGE6IFwiL1Jlc3QvV29ya2Zsb3cvUnVuVGltZS9DbGllbnQvSW5zdGFuY2VGaWxlUnVudGltZS9HZXRBdHRhY2htZW50RmlsZUxpc3REYXRhXCIsXG4gICAgdXBsb2FkRmlsZTogXCIvUmVzdC9Xb3JrZmxvdy9SdW5UaW1lL0NsaWVudC9JbnN0YW5jZUZpbGVSdW50aW1lL1VwbG9hZEZpbGVcIixcbiAgICBkb3dubG9hZEZpbGU6IFwiL1Jlc3QvQnVpbGRlci9SdW5UaW1lL0ZpbGVSdW50aW1lL0Rvd25Mb2FkRmlsZUJ5RmlsZUlkXCIsXG4gICAgZGVsZXRlRmlsZTogXCIvUmVzdC9CdWlsZGVyL1J1blRpbWUvRmlsZVJ1bnRpbWUvRGVsZXRlRmlsZUJ5RmlsZUlkXCJcbiAgfSxcbiAgUmVuZGVyZXI6IGZ1bmN0aW9uIFJlbmRlcmVyKCkge1xuICAgIGNvbnNvbGUubG9nKHRoaXMuX3Byb3ApO1xuICAgIHRoaXMuQnVpbGRVcGxvYWRDb250YWluZXIoKTtcbiAgICB0aGlzLkJ1aWxkRmlsZUxpc3QoKTtcbiAgfSxcbiAgVG9WaWV3U3RhdHVzOiBmdW5jdGlvbiBUb1ZpZXdTdGF0dXMoJGVsZW0sIGZpZWxkUE8sIHJlbGF0aW9uRm9ybVJlY29yZENvbXBsZXhQbywgX3JlbmRlcmVyRGF0YUNoYWluUGFyYXMpIHtcbiAgICAkKFwiI1wiICsgdGhpcy5fcHJvcC51cGxvYWRXYXJwSWQpLmhpZGUoKTtcbiAgICAkKFwiI1wiICsgdGhpcy5fcHJvcC5lbGVtSWQpLmZpbmQoXCIuZGVsZXRlLWJ1dHRvbi1lbGVtXCIpLmhpZGUoKTtcbiAgICAkKFwiI1wiICsgdGhpcy5fcHJvcC5lbGVtSWQpLmZpbmQoXCIubW92ZS11cC1idXR0b24tZWxlbVwiKS5oaWRlKCk7XG4gICAgJChcIiNcIiArIHRoaXMuX3Byb3AuZWxlbUlkKS5maW5kKFwiLm1vdmUtZG93bi1idXR0b24tZWxlbVwiKS5oaWRlKCk7XG4gIH0sXG4gIEdldFRoaXNSZWNvcmRJZDogZnVuY3Rpb24gR2V0VGhpc1JlY29yZElkKCkge1xuICAgIHZhciBvYmpJZCA9IFwiXCI7XG5cbiAgICBpZiAoZm9ybVJ1bnRpbWVJbnN0ICYmIGZvcm1SdW50aW1lSW5zdC5HZXRXZWJGb3JtUlRQYXJhcygpICYmIGZvcm1SdW50aW1lSW5zdC5HZXRXZWJGb3JtUlRQYXJhcygpLlJlY29yZElkKSB7XG4gICAgICBvYmpJZCA9IGZvcm1SdW50aW1lSW5zdC5HZXRXZWJGb3JtUlRQYXJhcygpLlJlY29yZElkO1xuICAgIH0gZWxzZSB7XG4gICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChcIuafpeaJvuS4jeWIsOe7keWumueahOiusOW9lUlEXCIpO1xuICAgIH1cblxuICAgIHJldHVybiBvYmpJZDtcbiAgfSxcbiAgR2V0VGhpc1JlY29yZFR5cGU6IGZ1bmN0aW9uIEdldFRoaXNSZWNvcmRUeXBlKCkge1xuICAgIHJldHVybiB0aGlzLl9wcm9wLm9ialR5cGU7XG4gIH0sXG4gIEdldFVwbG9hZEVuZFBvaW50UmVxdWVzdDogZnVuY3Rpb24gR2V0VXBsb2FkRW5kUG9pbnRSZXF1ZXN0KCkge1xuICAgIHZhciBlbmRQb2ludCA9IEJhc2VVdGlsaXR5LkdldFJvb3RQYXRoKCkgKyB0aGlzLmFjSW50ZXJmYWNlLnVwbG9hZEZpbGU7XG4gICAgdmFyIHBhcmFzID0ge1xuICAgICAgZmlsZVR5cGU6IFwiQXR0YWNobWVudFwiLFxuICAgICAgaW5zdGFuY2VJZDogdGhpcy5fcHJvcC5GbG93SW5zdGFuY2VSdW50aW1lUE8uaW5zdGFuY2VFbnRpdHkuaW5zdElkLFxuICAgICAgYnVzaW5lc3NLZXk6IHRoaXMuX3Byb3AuUmVjb3JkSWRcbiAgICB9O1xuICAgIHJldHVybiB7XG4gICAgICBlbmRwb2ludDogZW5kUG9pbnQsXG4gICAgICBwYXJhbXM6IHBhcmFzXG4gICAgfTtcbiAgfSxcbiAgQ3JlYXRlRGVmYXVsdFRlbXBsYXRlOiBmdW5jdGlvbiBDcmVhdGVEZWZhdWx0VGVtcGxhdGUodGVtcGxhdGVJZCkge1xuICAgICQod2luZG93LmRvY3VtZW50LmJvZHkpLmFwcGVuZChcIjxzY3JpcHQgdHlwZT1cXFwidGV4dC90ZW1wbGF0ZVxcXCIgaWQ9XFxcIlwiICsgdGVtcGxhdGVJZCArIFwiXFxcIj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcInFxLXVwbG9hZGVyLXNlbGVjdG9yIHFxLXVwbG9hZGVyIHFxLWdhbGxlcnlcXFwiIHFxLWRyb3AtYXJlYS10ZXh0PVxcXCJcXHU2MkQ2XFx1NjUzRVxcdTY1ODdcXHU0RUY2XFx1NTIzMFxcdThGRDlcXHU5MUNDXFx1OEZEQlxcdTg4NENcXHU0RTBBXFx1NEYyMFxcdTMwMDJcXFwiIHN0eWxlPVxcXCJtaW4taGVpZ2h0OiA3OHB4O1xcXCI+XFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwicXEtdG90YWwtcHJvZ3Jlc3MtYmFyLWNvbnRhaW5lci1zZWxlY3RvciBxcS10b3RhbC1wcm9ncmVzcy1iYXItY29udGFpbmVyXFxcIj5cXG4gICAgICAgICAgICAgICAgPGRpdiByb2xlPVxcXCJwcm9ncmVzc2JhclxcXCIgYXJpYS12YWx1ZW5vdz1cXFwiMFxcXCIgYXJpYS12YWx1ZW1pbj1cXFwiMFxcXCIgYXJpYS12YWx1ZW1heD1cXFwiMTAwXFxcIiBjbGFzcz1cXFwicXEtdG90YWwtcHJvZ3Jlc3MtYmFyLXNlbGVjdG9yIHFxLXByb2dyZXNzLWJhciBxcS10b3RhbC1wcm9ncmVzcy1iYXJcXFwiPjwvZGl2PlxcbiAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInFxLXVwbG9hZC1kcm9wLWFyZWEtc2VsZWN0b3IgcXEtdXBsb2FkLWRyb3AtYXJlYVxcXCIgcXEtaGlkZS1kcm9wem9uZT5cXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcInFxLXVwbG9hZC1kcm9wLWFyZWEtdGV4dC1zZWxlY3RvclxcXCI+PC9zcGFuPlxcbiAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInFxLXVwbG9hZC1idXR0b24tc2VsZWN0b3IgcXEtdXBsb2FkLWJ1dHRvblxcXCIgc3R5bGU9XFxcImZsb2F0OiByaWdodFxcXCI+XFxuICAgICAgICAgICAgICAgIDxkaXY+XFx1OTAwOVxcdTYyRTlcXHU2NTg3XFx1NEVGNjwvZGl2PlxcbiAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJxcS1kcm9wLXByb2Nlc3Npbmctc2VsZWN0b3IgcXEtZHJvcC1wcm9jZXNzaW5nXFxcIj5cXG4gICAgICAgICAgICAgICAgPHNwYW4+UHJvY2Vzc2luZyBkcm9wcGVkIGZpbGVzLi4uPC9zcGFuPlxcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwicXEtZHJvcC1wcm9jZXNzaW5nLXNwaW5uZXItc2VsZWN0b3IgcXEtZHJvcC1wcm9jZXNzaW5nLXNwaW5uZXJcXFwiPjwvc3Bhbj5cXG4gICAgICAgICAgICA8L3NwYW4+XFxuICAgICAgICAgICAgPHVsIGNsYXNzPVxcXCJxcS11cGxvYWQtbGlzdC1zZWxlY3RvciBxcS11cGxvYWQtbGlzdFxcXCIgcm9sZT1cXFwicmVnaW9uXFxcIiBhcmlhLWxpdmU9XFxcInBvbGl0ZVxcXCIgYXJpYS1yZWxldmFudD1cXFwiYWRkaXRpb25zIHJlbW92YWxzXFxcIiBzdHlsZT1cXFwiZGlzcGxheTogbm9uZVxcXCI+XFxuICAgICAgICAgICAgICAgIDxsaT5cXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIHJvbGU9XFxcInN0YXR1c1xcXCIgY2xhc3M9XFxcInFxLXVwbG9hZC1zdGF0dXMtdGV4dC1zZWxlY3RvciBxcS11cGxvYWQtc3RhdHVzLXRleHRcXFwiPjwvc3Bhbj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInFxLXByb2dyZXNzLWJhci1jb250YWluZXItc2VsZWN0b3IgcXEtcHJvZ3Jlc3MtYmFyLWNvbnRhaW5lclxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiByb2xlPVxcXCJwcm9ncmVzc2JhclxcXCIgYXJpYS12YWx1ZW5vdz1cXFwiMFxcXCIgYXJpYS12YWx1ZW1pbj1cXFwiMFxcXCIgYXJpYS12YWx1ZW1heD1cXFwiMTAwXFxcIiBjbGFzcz1cXFwicXEtcHJvZ3Jlc3MtYmFyLXNlbGVjdG9yIHFxLXByb2dyZXNzLWJhclxcXCI+PC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJxcS11cGxvYWQtc3Bpbm5lci1zZWxlY3RvciBxcS11cGxvYWQtc3Bpbm5lclxcXCI+PC9zcGFuPlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwicXEtdGh1bWJuYWlsLXdyYXBwZXJcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgY2xhc3M9XFxcInFxLXRodW1ibmFpbC1zZWxlY3RvclxcXCIgcXEtbWF4LXNpemU9XFxcIjEyMFxcXCIgcXEtc2VydmVyLXNjYWxlPlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcInFxLXVwbG9hZC1jYW5jZWwtc2VsZWN0b3IgcXEtdXBsb2FkLWNhbmNlbFxcXCI+WDwvYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJxcS11cGxvYWQtcmV0cnktc2VsZWN0b3IgcXEtdXBsb2FkLXJldHJ5XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwicXEtYnRuIHFxLXJldHJ5LWljb25cXFwiIGFyaWEtbGFiZWw9XFxcIlJldHJ5XFxcIj48L3NwYW4+XFxuICAgICAgICAgICAgICAgICAgICAgICAgUmV0cnlcXG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxcblxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwicXEtZmlsZS1pbmZvXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJxcS1maWxlLW5hbWVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwicXEtdXBsb2FkLWZpbGUtc2VsZWN0b3IgcXEtdXBsb2FkLWZpbGVcXFwiPjwvc3Bhbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcInFxLWVkaXQtZmlsZW5hbWUtaWNvbi1zZWxlY3RvciBxcS1idG4gcXEtZWRpdC1maWxlbmFtZS1pY29uXFxcIiBhcmlhLWxhYmVsPVxcXCJFZGl0IGZpbGVuYW1lXFxcIj48L3NwYW4+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzPVxcXCJxcS1lZGl0LWZpbGVuYW1lLXNlbGVjdG9yIHFxLWVkaXQtZmlsZW5hbWVcXFwiIHRhYmluZGV4PVxcXCIwXFxcIiB0eXBlPVxcXCJ0ZXh0XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwicXEtdXBsb2FkLXNpemUtc2VsZWN0b3IgcXEtdXBsb2FkLXNpemVcXFwiPjwvc3Bhbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcInFxLWJ0biBxcS11cGxvYWQtZGVsZXRlLXNlbGVjdG9yIHFxLXVwbG9hZC1kZWxldGVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwicXEtYnRuIHFxLWRlbGV0ZS1pY29uXFxcIiBhcmlhLWxhYmVsPVxcXCJEZWxldGVcXFwiPjwvc3Bhbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcInFxLWJ0biBxcS11cGxvYWQtcGF1c2Utc2VsZWN0b3IgcXEtdXBsb2FkLXBhdXNlXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcInFxLWJ0biBxcS1wYXVzZS1pY29uXFxcIiBhcmlhLWxhYmVsPVxcXCJQYXVzZVxcXCI+PC9zcGFuPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwicXEtYnRuIHFxLXVwbG9hZC1jb250aW51ZS1zZWxlY3RvciBxcS11cGxvYWQtY29udGludWVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwicXEtYnRuIHFxLWNvbnRpbnVlLWljb25cXFwiIGFyaWEtbGFiZWw9XFxcIkNvbnRpbnVlXFxcIj48L3NwYW4+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgPC9saT5cXG4gICAgICAgICAgICA8L3VsPlxcblxcbiAgICAgICAgICAgIDxkaWFsb2cgY2xhc3M9XFxcInFxLWFsZXJ0LWRpYWxvZy1zZWxlY3RvclxcXCI+XFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInFxLWRpYWxvZy1tZXNzYWdlLXNlbGVjdG9yXFxcIj48L2Rpdj5cXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwicXEtZGlhbG9nLWJ1dHRvbnNcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJxcS1jYW5jZWwtYnV0dG9uLXNlbGVjdG9yXFxcIj5DbG9zZTwvYnV0dG9uPlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICA8L2RpYWxvZz5cXG5cXG4gICAgICAgICAgICA8ZGlhbG9nIGNsYXNzPVxcXCJxcS1jb25maXJtLWRpYWxvZy1zZWxlY3RvclxcXCI+XFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInFxLWRpYWxvZy1tZXNzYWdlLXNlbGVjdG9yXFxcIj48L2Rpdj5cXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwicXEtZGlhbG9nLWJ1dHRvbnNcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJxcS1jYW5jZWwtYnV0dG9uLXNlbGVjdG9yXFxcIj5ObzwvYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJxcS1vay1idXR0b24tc2VsZWN0b3JcXFwiPlllczwvYnV0dG9uPlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICA8L2RpYWxvZz5cXG5cXG4gICAgICAgICAgICA8ZGlhbG9nIGNsYXNzPVxcXCJxcS1wcm9tcHQtZGlhbG9nLXNlbGVjdG9yXFxcIj5cXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwicXEtZGlhbG9nLW1lc3NhZ2Utc2VsZWN0b3JcXFwiPjwvZGl2PlxcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCI+XFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInFxLWRpYWxvZy1idXR0b25zXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwicXEtY2FuY2VsLWJ1dHRvbi1zZWxlY3RvclxcXCI+Q2FuY2VsPC9idXR0b24+XFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcInFxLW9rLWJ1dHRvbi1zZWxlY3RvclxcXCI+T2s8L2J1dHRvbj5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgPC9kaWFsb2c+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgPC9zY3JpcHQ+XCIpO1xuICB9LFxuICBCdWlsZFVwbG9hZENvbnRhaW5lcjogZnVuY3Rpb24gQnVpbGRVcGxvYWRDb250YWluZXIoKSB7XG4gICAgaWYgKHRoaXMuX2F1dGhvcml0aWVzRmlsZUF1dGhvcml0eS5hZGRGaWxlID09IFwidHJ1ZVwiKSB7XG4gICAgICB2YXIgJHNpbmdsZUNvbnRyb2xFbGVtID0gJChcIiNGbG93RmlsZXNMaXN0UGx1Z2luQ29udGFpbmVyXCIpO1xuICAgICAgdmFyIHVwbG9hZFdhcnBJZCA9ICd1cGxvYWRXYXJwXycgKyBTdHJpbmdVdGlsaXR5LlRpbWVzdGFtcCgpO1xuICAgICAgdGhpcy5fcHJvcC51cGxvYWRXYXJwSWQgPSB1cGxvYWRXYXJwSWQ7XG4gICAgICB2YXIgJHVwbG9hZFdhcnAgPSAkKFwiPGRpdiBpZD0nXCIgKyB1cGxvYWRXYXJwSWQgKyBcIic+PC9kaXY+XCIpO1xuICAgICAgJHNpbmdsZUNvbnRyb2xFbGVtLmFwcGVuZCgkdXBsb2FkV2FycCk7XG4gICAgICB2YXIgdGVtcGxhdGVJZCA9IFwicXEtdGVtcGxhdGVfXCIgKyB0aGlzLl9wcm9wLmVsZW1JZDtcbiAgICAgIHRoaXMuQ3JlYXRlRGVmYXVsdFRlbXBsYXRlKHRlbXBsYXRlSWQpO1xuXG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICB2YXIgZ2FsbGVyeVVwbG9hZGVyID0gbmV3IHFxLkZpbmVVcGxvYWRlcih7XG4gICAgICAgIGVsZW1lbnQ6ICR1cGxvYWRXYXJwWzBdLFxuICAgICAgICB0ZW1wbGF0ZTogdGVtcGxhdGVJZCxcbiAgICAgICAgbXVsdGlwbGU6IGZhbHNlLFxuICAgICAgICByZXF1ZXN0OiB0aGlzLkdldFVwbG9hZEVuZFBvaW50UmVxdWVzdCgpLFxuICAgICAgICBjYWxsYmFja3M6IHtcbiAgICAgICAgICBvbkNvbXBsZXRlOiBmdW5jdGlvbiBvbkNvbXBsZXRlKGlkLCBuYW1lLCByZXNwb25zZUpTT04sIHhocikge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlSlNPTi5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgIF90aGlzLkJ1aWxkRmlsZUxpc3QoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KHJlc3BvbnNlSlNPTi5tZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgQnVpbGRGaWxlTGlzdDogZnVuY3Rpb24gQnVpbGRGaWxlTGlzdCgpIHtcbiAgICB2YXIgJHNpbmdsZUNvbnRyb2xFbGVtID0gJChcIiNGbG93RmlsZXNMaXN0UGx1Z2luQ29udGFpbmVyXCIpO1xuICAgIHZhciB1cGxvYWRfZmlsZV9saXN0X3dyYXBfaWQgPSBcInVwbG9hZF9maWxlX2xpc3Rfd2FycF9cIiArIFN0cmluZ1V0aWxpdHkuVGltZXN0YW1wKCk7XG4gICAgJChcIiNcIiArIHVwbG9hZF9maWxlX2xpc3Rfd3JhcF9pZCkucmVtb3ZlKCk7XG4gICAgdmFyICRkaXZXYXJwID0gJChcIjxkaXYgY2xhc3M9J3VwbG9hZF9maWxlX2xpc3Rfd3JhcCcgaWQ9J1wiICsgdXBsb2FkX2ZpbGVfbGlzdF93cmFwX2lkICsgXCInPjx0YWJsZSBjbGFzcz0nZmlsZV9saXN0X3RhYmxlJz48dGhlYWQ+PHRyPjx0aD7mlofku7blkI3np7A8L3RoPjx0aCBzdHlsZT0nd2lkdGg6IDE0MHB4Jz7kuIrkvKDml7bpl7Q8L3RoPjx0aCBzdHlsZT0nd2lkdGg6IDE0MHB4Jz7kuIrkvKDkuro8L3RoPjx0aCBzdHlsZT0nd2lkdGg6IDE0MHB4Jz7mlofku7blpKflsI88L3RoPjx0aCBzdHlsZT0nd2lkdGg6IDE0MHB4Jz7mk43kvZw8L3RoPjwvdHI+PC90aGVhZD48dGJvZHk+PC90Ym9keT48L3RhYmxlPjwvZGl2PlwiKTtcbiAgICB2YXIgJHRib2R5ID0gJGRpdldhcnAuZmluZChcInRib2R5XCIpO1xuICAgIHZhciBpbnN0YW5jZUlkID0gdGhpcy5fcHJvcC5GbG93SW5zdGFuY2VSdW50aW1lUE8uaW5zdGFuY2VFbnRpdHkuaW5zdElkO1xuICAgIEFqYXhVdGlsaXR5LlBvc3QodGhpcy5hY0ludGVyZmFjZS5nZXRGaWxlTGlzdERhdGEsIHtcbiAgICAgIGluc3RhbmNlSWQ6IGluc3RhbmNlSWRcbiAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xuXG4gICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN1bHQuZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciBmaWxlSW5mbyA9IHJlc3VsdC5kYXRhW2ldO1xuICAgICAgICAgICR0Ym9keS5hcHBlbmQodGhpcy5CdWlsZEZpbGVJbmZvVGFibGVSb3cocmVzdWx0LCBmaWxlSW5mbykpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwgdGhpcyk7XG4gICAgJCgkc2luZ2xlQ29udHJvbEVsZW0uYXBwZW5kKCRkaXZXYXJwKSk7XG4gIH0sXG4gIEJ1aWxkRmlsZUluZm9UYWJsZVJvdzogZnVuY3Rpb24gQnVpbGRGaWxlSW5mb1RhYmxlUm93KHJlc3BvbnNlSlNPTiwgZmlsZUluZm8pIHtcbiAgICB2YXIgZmlsZU5hbWUgPSBTdHJpbmdVdGlsaXR5LkVuY29kZUh0bWwoZmlsZUluZm8uZmlsZU5hbWUpO1xuICAgIHZhciBmaWxlQ3JlYXRlVGltZSA9IERhdGVVdGlsaXR5LkRhdGFGb3JtYXRCeVRpbWVTdGFtcChmaWxlSW5mby5maWxlQ3JlYXRlVGltZSwgXCJ5eXl5LU1NLWRkXCIpO1xuICAgIHZhciBmaWxlU2l6ZSA9IEhhcmREaXNrVXRpbGl0eS5CeXRlQ29udmVydChmaWxlSW5mby5maWxlU2l6ZSk7XG4gICAgdmFyIGZpbGVDcmVhdG9yTmFtZSA9IFN0cmluZ1V0aWxpdHkuRW5jb2RlSHRtbChmaWxlSW5mby5maWxlQ3JlYXRvcik7XG4gICAgdmFyICR0ck9iaiA9ICQoXCI8dHI+PHRkPlwiLmNvbmNhdChmaWxlTmFtZSwgXCI8L3RkPjx0ZCBzdHlsZT1cXFwidGV4dC1hbGlnbjogY2VudGVyXFxcIj5cIikuY29uY2F0KGZpbGVDcmVhdGVUaW1lLCBcIjwvdGQ+PHRkIHN0eWxlPVxcXCJ0ZXh0LWFsaWduOiBjZW50ZXJcXFwiPlwiKS5jb25jYXQoZmlsZUNyZWF0b3JOYW1lLCBcIjwvdGQ+PHRkIHN0eWxlPVxcXCJ0ZXh0LWFsaWduOiBjZW50ZXJcXFwiPlwiKS5jb25jYXQoZmlsZVNpemUsIFwiPC90ZD48dGQgc3R5bGU9XFxcInRleHQtYWxpZ246IGNlbnRlclxcXCI+PC90ZD48L3RyPlwiKSk7XG4gICAgdGhpcy5CdWlsZEZpbGVJbmZvVGFibGVSb3dJbm5lckJ1dHRvbnMocmVzcG9uc2VKU09OLCBmaWxlSW5mbywgJHRyT2JqKTtcbiAgICByZXR1cm4gJHRyT2JqO1xuICB9LFxuICBCdWlsZEZpbGVJbmZvVGFibGVSb3dJbm5lckJ1dHRvbnM6IGZ1bmN0aW9uIEJ1aWxkRmlsZUluZm9UYWJsZVJvd0lubmVyQnV0dG9ucyhyZXNwb25zZUpTT04sIGZpbGVJbmZvLCAkdHIpIHtcbiAgICBpZiAoIXRoaXMuX3Byb3AuZG93bmxvYWRFbmFibGUgJiYgIXRoaXMuX3Byb3AuZGVsZXRlRW5hYmxlICYmIHRoaXMuX3Byb3AucHJldmlld0VuYWJsZSAmJiB0aGlzLl9wcm9wLm1vdmVPcmRlckVuYWJsZSkge31cblxuICAgIHZhciAkdHJMYXN0VGQgPSAkdHIuZmluZChcInRkOmxhc3RcIik7XG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKHRoaXMuX3Byb3AuZGVsZXRlRW5hYmxlKSB7XG4gICAgICB2YXIgJGRlbGV0ZUVsZW0gPSAkKFwiPGRpdiBjbGFzcz0nZmlsZS1saXN0LWlubmVyLWJ1dHRvbiBkZWxldGUtYnV0dG9uLWVsZW0nIHRpdGxlPSfngrnlh7vliKDpmaQnPjwvZGl2PlwiKTtcbiAgICAgICRkZWxldGVFbGVtLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5Db25maXJtKHdpbmRvdywgXCLnoa7orqTliKDpmaTpmYTku7bjgJBcIiArIGZpbGVJbmZvLmZpbGVOYW1lICsgXCLjgJHlkJc/XCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBBamF4VXRpbGl0eS5Qb3N0KF90aGlzLmFjSW50ZXJmYWNlLmRlbGV0ZUZpbGUsIHtcbiAgICAgICAgICAgIGZpbGVJZDogZmlsZUluZm8uZmlsZUlkXG4gICAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICRkZWxldGVFbGVtLnBhcmVudCgpLnBhcmVudCgpLnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIF90aGlzKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgICR0ckxhc3RUZC5hcHBlbmQoJGRlbGV0ZUVsZW0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9wcm9wLm1vdmVPcmRlckVuYWJsZSB8fCB0cnVlKSB7XG4gICAgICB2YXIgJG1vdmVVcEVsZW0gPSAkKFwiPGRpdiBjbGFzcz0nZmlsZS1saXN0LWlubmVyLWJ1dHRvbiBtb3ZlLXVwLWJ1dHRvbi1lbGVtJyB0aXRsZT0n54K55Ye75LiK56e7Jz48L2Rpdj5cIik7XG4gICAgICAkbW92ZVVwRWxlbS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KFwi5pqC5LiN5pSv5oyBIVwiKTtcbiAgICAgIH0pO1xuICAgICAgdmFyICRtb3ZlRG93bkVsZW0gPSAkKFwiPGRpdiBjbGFzcz0nZmlsZS1saXN0LWlubmVyLWJ1dHRvbiBtb3ZlLWRvd24tYnV0dG9uLWVsZW0nIHRpdGxlPSfngrnlh7vkuIvnp7snPjwvZGl2PlwiKTtcbiAgICAgICRtb3ZlRG93bkVsZW0uY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChcIuaaguS4jeaUr+aMgSFcIik7XG4gICAgICB9KTtcbiAgICAgICR0ckxhc3RUZC5hcHBlbmQoJG1vdmVVcEVsZW0pO1xuICAgICAgJHRyTGFzdFRkLmFwcGVuZCgkbW92ZURvd25FbGVtKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fcHJvcC5kb3dubG9hZEVuYWJsZSkge1xuICAgICAgdmFyICRkb3dubG9hZEVsZW0gPSAkKFwiPGRpdiBjbGFzcz0nZmlsZS1saXN0LWlubmVyLWJ1dHRvbiBkb3dubG9hZC1idXR0b24tZWxlbScgdGl0bGU9J+eCueWHu+S4i+i9vSc+PC9kaXY+XCIpO1xuICAgICAgJGRvd25sb2FkRWxlbS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB1cmwgPSBCYXNlVXRpbGl0eS5HZXRSb290UGF0aCgpICsgX3RoaXMuYWNJbnRlcmZhY2UuZG93bmxvYWRGaWxlICsgXCI/ZmlsZUlkPVwiICsgZmlsZUluZm8uZmlsZUlkO1xuICAgICAgICB3aW5kb3cub3Blbih1cmwpO1xuICAgICAgfSk7XG4gICAgICAkdHJMYXN0VGQuYXBwZW5kKCRkb3dubG9hZEVsZW0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9wcm9wLnByZXZpZXdFbmFibGUgfHwgdHJ1ZSkge1xuICAgICAgdmFyICRwcmV2aWV3RWxlbSA9ICQoXCI8ZGl2IGNsYXNzPSdmaWxlLWxpc3QtaW5uZXItYnV0dG9uIHByZXZpZXctYnV0dG9uLWVsZW0nIHRpdGxlPSfngrnlh7vpooTop4gnPjwvZGl2PlwiKTtcbiAgICAgICRwcmV2aWV3RWxlbS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KFwi5pqC5LiN5pSv5oyBIVwiKTtcbiAgICAgIH0pO1xuICAgICAgJHRyTGFzdFRkLmFwcGVuZCgkcHJldmlld0VsZW0pO1xuICAgIH1cbiAgfSxcbiAgVGVzdEZpbGVQcmV2aWV3RW5hYmxlOiBmdW5jdGlvbiBUZXN0RmlsZVByZXZpZXdFbmFibGUoZmlsZUluZm8pIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTsiXX0=
