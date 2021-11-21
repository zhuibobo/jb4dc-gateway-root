let RecallAction={
    acInterface:{
        recallMySendTask:"/Rest/Workflow/RunTime/Client/InstanceRuntime/RecallMySendTask"
    },
    _Prop:WorkFlowAction.EmptyProp,
    Instance:function (isStartInstanceStatus,formRuntimeInst,pageHostInstance,pageReadyInnerParas,actionObj) {
        //console.log(actionObj);
        /*let htmlId = actionObj.actionHTMLId ? actionObj.actionHTMLId : actionObj.actionCode;
        let elem = $('<button type="button" class="operation-button operation-button-primary" id="' + htmlId + '"><span>' + actionObj.actionCaption + '</span></button>');
        if(actionObj.actionDisable=="disable"){
            elem.attr("disable","disable");
            elem.addClass("operation-button-primary-disabled");
        }
        else{
            this._Prop = WorkFlowAction.BuildProp(this, pageReadyInnerParas, actionObj, isStartInstanceStatus, pageHostInstance, htmlId);
            elem.bind("click", this._Prop, this.ButtonClickEvent);
        }
        if(actionObj.actionRemark){
            elem.attr("title",actionObj.actionRemark);
        }
        return {
            elem: elem
        }*/
        return WorkFlowAction.Instance.call(this,isStartInstanceStatus,formRuntimeInst,pageHostInstance,pageReadyInnerParas,actionObj);
    },
    ButtonClickEvent:function (sender) {
        //let _this = sender.data.sender;
        DialogUtility.Confirm(window, "确认执行撤回操作?", function () {
            DialogUtility.AlertLoading(window, DialogUtility.DialogLoadingId, {}, "系统处理中,请稍候!");
            AjaxUtility.Post(this.acInterface.recallMySendTask, {
                extaskId: sender.data.currentTaskId
            }, function (result) {
                //debugger;
                DialogUtility.CloseDialog(DialogUtility.DialogLoadingId);
                if (result.success) {
                    this.RefreshParentListThenClose(result.message);
                }
            },);
        }, this);
    },
    RefreshParentListThenClose:WorkFlowAction.RefreshParentListThenClose
}