let SendAction={
    acInterface:{
        resolveNextPossibleFlowNode:"/Rest/Workflow/RunTime/Client/InstanceRuntime/ResolveNextPossibleFlowNode",
        completeTask:"/Rest/Workflow/RunTime/Client/InstanceRuntime/CompleteTask"
    },
    _Prop:WorkFlowAction.EmptyProp,
    newOpinionList:[],
    inputOpinionText:null,
    Instance:function (isStartInstanceStatus,formRuntimeInst,pageHostInstance,pageReadyInnerParas,actionObj) {
        return WorkFlowAction.Instance.call(this,isStartInstanceStatus,formRuntimeInst,pageHostInstance,pageReadyInnerParas,actionObj);
        //console.log(actionObj);
        /*let htmlId = actionObj.actionHTMLId ? actionObj.actionHTMLId : actionObj.actionCode;
        let elem = $('<button type="button" class="operation-button operation-button-primary" id="' + htmlId + '"><span>' + actionObj.actionCaption + '</span></button>');*/
        /*this._Prop = {
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
            "actionOpinionBindToElemId": actionObj.actionOpinionBindToElemId,
            "htmlId": htmlId
        }*/
        //this._Prop = WorkFlowAction.BuildProp(this, pageReadyInnerParas, actionObj, isStartInstanceStatus, pageHostInstance, htmlId);
        //elem.bind("click", this._Prop, this.ButtonClickEvent);
        //elem.bind("click", this._Prop, function (sender) {
            //console.log(sender.data);
        //    sender.data.sender.ButtonClickEvent();
        //});
        //return {
        //    elem: elem
        //}
    },
    ButtonClickEvent:function () {
        //WorkFlowBaseAction.ResolveNextPossibleFlowNodeDialogAndCallSelectReceiverCompleted(sender.data);
        /*var validateResult = ValidateRulesRuntime.ValidateSubmitEnable();
        var _this = sender.data._this;
        if (ValidateRulesRuntime.AlertValidateErrors(validateResult)) {
            var formDataComplexPO = sender.data.formRuntimeInst.SerializationFormData();
            DialogUtility.AlertLoading(window, DialogUtility.DialogLoadingId, {}, "");
            AjaxUtility.Post(WorkFlowBaseAction.acInterface.resolveNextPossibleFlowNode, {
                isStartInstanceStatus: sender.data.isStartInstanceStatus,
                actionCode: sender.data.actionObj.actionCode,
                flowInstanceRuntimePOCacheKey: sender.data.flowInstanceRuntimePOCacheKey,
                "formRecordComplexPOString": encodeURIComponent(JsonUtility.JsonToString(formDataComplexPO)),
            }, function (result) {
                DialogUtility.CloseDialog(DialogUtility.DialogLoadingId);
                console.log(result);
                UserTaskReceiverDialogUtility.ShowDialog(_this, result.data, _this.SelectReceiverCompleted);
            }, _this);
        }*/
        //console.log(window);
        //console.log(window.OpenerWindowObj);
        //portletUtility.UpdateRefreshVersion();
        //return;
        let validateResult = ValidateRulesRuntime.ValidateSubmitEnable();

        if (ValidateRulesRuntime.AlertValidateErrors(validateResult)) {
            //let _prop = this._Prop;
            //let _this = _prop.sender;
            let actionShowOpinionDialog = this._Prop.actionShowOpinionDialog;
            if (actionShowOpinionDialog == "true") {
                DialogUtility.Prompt(window, {
                    title: "????????????",
                    height: 300,
                    width: 400,
                }, DialogUtility.DialogPromptId, "?????????????????????1", function (inputText) {
                    let opinionBindToControlInstance=this.TryGetOpinionBindToControlInstance(this._Prop);
                    if(opinionBindToControlInstance!=null) {
                        if (typeof (opinionBindToControlInstance.SetNewValue) == "function") {
                            opinionBindToControlInstance.SetNewValue(inputText);
                            this.inputOpinionText=inputText;
                            this.BeginSelectReceiver(this, this._Prop);
                        } else {
                            DialogUtility.AlertText("???????????????????????????SetNewValue??????!!");
                        }
                    }
                },this);
            } else {
                this.BeginSelectReceiver(this, this._Prop);
            }
        }
    },
    TryGetOpinionBindToControlInstance:function (_prop){
        let actionOpinionBindToElemId=_prop.actionOpinionBindToElemId;
        let actionOpinionBindToField=_prop.actionOpinionBindToField;

        let controlElem;
        if(actionOpinionBindToElemId){
            controlElem=$("#"+actionOpinionBindToElemId);
        }
        if(controlElem&&controlElem.length>0){
            return HTMLControl.GetControlInstanceByElem(controlElem);
        }
        else{
            controlElem=$("[fieldname='"+actionOpinionBindToField+"']");
        }
        if(controlElem&&controlElem.length>0){
            return HTMLControl.GetControlInstanceByElem(controlElem);
        }
        return null;
    },
    BeginSelectReceiver:function (_this,_prop) {
        DialogUtility.AlertLoading(window, DialogUtility.DialogLoadingId, {}, "");

        let sendData = this.BuildSendToServerData(this._Prop, null);
        if (sendData.success) {
            AjaxUtility.Post(this.acInterface.resolveNextPossibleFlowNode, sendData.data, function (result) {
                DialogUtility.CloseDialog(DialogUtility.DialogLoadingId);
                //DialogUtility.CloseDialog(DialogUtility.DialogLoadingId);1
                console.log(result);
                if (result.data.nextTaskIsEndEvent) {
                    this.SelectReceiverCompleted(result.data.bpmnTaskList, [])
                } else if (result.data.currentTaskIsMultiInstance && (result.data.currentTaskMultiCompletedInstances + 1) < result.data.currentTaskMultiCountEngInstances) {
                    this.SelectReceiverCompleted(result.data.bpmnTaskList, [])
                } else {
                    //???????????????????????????????????????????????????
                    UserTaskReceiverDialogUtility.ShowDialog(this, result.data.bpmnTaskList, this.SelectReceiverCompleted);
                }

            }, this);
        }
    },
    SelectReceiverCompleted:function (nextTaskEntityList,selectedReceiverData) {
        //console.log(selectedReceiverData);
        //console.log(this._Prop.actionObj.actionCaption);
        DialogUtility.Confirm(window, "???????????????????", function () {
            var selectedReceiverVars = FlowRuntimeVarBuilder.BuilderSelectedReceiverToInstanceVar(nextTaskEntityList, selectedReceiverData);

            if(this.inputOpinionText!=null){
                this.newOpinionList.push(this.BuildNewOpinion(this.inputOpinionText));
            }

            var sendData = this.BuildSendToServerData(this._Prop, {
                selectedReceiverVars: encodeURIComponent(JsonUtility.JsonToString(selectedReceiverVars)),
                newOpinionListString:encodeURIComponent(JsonUtility.JsonToString(this.newOpinionList))
            });
            //console.log(sendData);
            //return;
            //console.log(sendData);
            if (sendData.success) {
                DialogUtility.AlertLoading(window, DialogUtility.DialogLoadingId, {}, "???????????????,?????????!");

                AjaxUtility.Post(this.acInterface.completeTask, sendData.data, function (result) {
                    DialogUtility.CloseDialog(DialogUtility.DialogLoadingId);
                    if (result.success) {
                        /*if (window.OpenerWindowObj != null && window.OpenerWindowObj.instanceMainTaskProcessList != null) {
                            window.OpenerWindowObj.instanceMainTaskProcessList.reloadData();
                        }
                        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {
                            DialogUtility.Frame_CloseDialog(window);
                        }, this);*/
                        this.RefreshParentListThenClose(result.message);
                    } else {
                        DialogUtility.AlertError(window, DialogUtility.DialogAlertErrorId, {}, result.data.message);
                    }
                }, this);
            }
        }, this);
    },
    BuildSendToServerData:function (_prop,appendSendMap){
        let formDataComplexPO = _prop.formRuntimeInst.SerializationFormData();
        let result = {
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
                "newOpinionListString":"",
            }
        };
        if(appendSendMap){
            for (let key in appendSendMap) {
                result.data[key]=appendSendMap[key];
            }
        }
        return result;
    },
    BuildNewOpinion:function (opinionText){
        return {
            opinionText:opinionText,
            opinionClientCode:StringUtility.Timestamp()
        }
    },
    RefreshParentListThenClose:WorkFlowAction.RefreshParentListThenClose
}