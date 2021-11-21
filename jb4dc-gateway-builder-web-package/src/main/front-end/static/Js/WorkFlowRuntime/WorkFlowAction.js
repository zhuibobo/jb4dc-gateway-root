let WorkFlowAction={
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
    Instance:function (isStartInstanceStatus,formRuntimeInst,pageHostInstance,pageReadyInnerParas,actionObj){
        let htmlId = actionObj.actionHTMLId ? actionObj.actionHTMLId : actionObj.actionCode;
        let elem = $('<button type="button" class="operation-button operation-button-primary" id="' + htmlId + '"><span>' + actionObj.actionCaption + '</span></button>');
        if(actionObj.actionDisable=="disable"){
            elem.attr("disable","disable");
            elem.addClass("operation-button-primary-disabled");
        }
        else{
            this._Prop = WorkFlowAction.BuildProp(this, pageReadyInnerParas,formRuntimeInst,actionObj,isStartInstanceStatus,pageHostInstance,htmlId);
            //elem.bind("click", this._Prop, this.ButtonClickEvent);
            elem.bind("click", this._Prop, function (sender) {
                console.log(sender.data);
                sender.data.sender.ButtonClickEvent();
            });
        }
        if(actionObj.actionRemark){
            elem.attr("title",actionObj.actionRemark);
        }
        return {
            elem: elem
        }
    },
    BuildProp:function (sender,pageReadyInnerParas,formRuntimeInst,actionObj,isStartInstanceStatus,pageHostInstance,htmlId) {
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
        }
    },
    RefreshParentListThenClose:function (message){
        if (window.OpenerWindowObj != null && window.OpenerWindowObj.instanceMainTaskProcessList != null) {
            window.OpenerWindowObj.instanceMainTaskProcessList.reloadData();
        }
        portletUtility.UpdateRefreshVersion();
        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, message, function () {
            DialogUtility.Frame_CloseDialog(window);
        }, this);
    }
}