let RecallAction={
    acInterface:{
        recallMySendTask:"/Rest/Workflow/RunTime/Client/InstanceRuntime/RecallMySendTask"
    },
    _Prop:{

    },
    Instance:function (isStartInstanceStatus,formRuntimeInst,pageHostInstance,pageReadyInnerParas,actionObj) {
        //console.log(actionObj);
        var htmlId = actionObj.actionHTMLId ? actionObj.actionHTMLId : actionObj.actionCode;
        var elem = $('<button type="button" class="operation-button operation-button-primary" id="' + htmlId + '"><span>' + actionObj.actionCaption + '</span></button>');
        if(actionObj.actionDisable=="disable"){
            elem.attr("disable","disable");
            elem.addClass("operation-button-primary-disabled");
        }
        else{
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
                "recordId":pageReadyInnerParas.recordId,
                "modelId":pageReadyInnerParas.modelId,
                "modelReKey":pageReadyInnerParas.modelReKey,
                "currentTaskId":pageReadyInnerParas.currentTaskId,
                "instanceId":pageReadyInnerParas.flowInstanceRuntimePO.instanceEntity.instId
            }
            elem.bind("click", this._Prop, this.ButtonClickEvent);
        }
        if(actionObj.actionRemark){
            elem.attr("title",actionObj.actionRemark);
        }
        return {
            elem: elem
        }
    },
    ButtonClickEvent:function (sender) {
        let _this = sender.data.sender;
        DialogUtility.Confirm(window,"确认执行撤回操作?",function (){

            DialogUtility.AlertLoading(window,DialogUtility.DialogLoadingId,{},"系统处理中,请稍候!");
            AjaxUtility.Post(_this.acInterface.recallMySendTask,{
                extaskId:sender.data.currentTaskId
            },function (result){
                //debugger;
                DialogUtility.CloseDialog(DialogUtility.DialogLoadingId);
                if(result.success){
                    if(window.OpenerWindowObj!=null&&window.OpenerWindowObj.instanceMainTaskProcessList!=null){
                        window.OpenerWindowObj.instanceMainTaskProcessList.reloadData();
                    }
                    DialogUtility.Alert(window,DialogUtility.DialogAlertId,{}, result.message, function () {
                        DialogUtility.Frame_CloseDialog(window);
                    }, this);
                }
            },_this);
        },_this);
    },
}