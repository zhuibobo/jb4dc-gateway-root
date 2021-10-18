var ActionsRuntimeObject={
    CreateALLActionButton:function (isStartInstanceStatus,formRuntimeInst,pageHostInstance,pageReadyInnerParas) {
        if(pageReadyInnerParas.jb4dcActions&&pageReadyInnerParas.jb4dcActions.jb4dcActionList){
            var buttonElem;
            for (let i = 0; i < pageReadyInnerParas.jb4dcActions.jb4dcActionList.length; i++) {
                let actionObj = pageReadyInnerParas.jb4dcActions.jb4dcActionList[i];
                if (actionObj.juelRunResultPO.booleanResult) {
                    if (actionObj.actionType == "send") {
                        let sendActionObject = Object.create(SendAction);
                        buttonElem = sendActionObject.Instance(isStartInstanceStatus,formRuntimeInst,pageHostInstance,pageReadyInnerParas,actionObj);
                    }
                    else if (actionObj.actionType == "recall") {
                        let callbackActionObject = Object.create(RecallAction);
                        buttonElem = callbackActionObject.Instance(isStartInstanceStatus,formRuntimeInst,pageHostInstance,pageReadyInnerParas,actionObj);
                    }
                    else if (actionObj.actionType == "deleteInstance") {
                        let deleteInstanceActionObject = Object.create(DeleteInstanceAction);
                        buttonElem = deleteInstanceActionObject.Instance(isStartInstanceStatus,formRuntimeInst,pageHostInstance,pageReadyInnerParas,actionObj);
                    }
                    $("#flowWorkActionButtonWrapOuter").append(buttonElem.elem);
                }
            }
        }
    },
    GetActionObj:function () {
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
            actionDisable:"enable",
            actionRemark:""
        };
    }
}