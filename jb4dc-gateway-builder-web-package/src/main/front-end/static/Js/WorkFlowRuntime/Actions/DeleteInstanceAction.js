let DeleteInstanceAction={
    acInterface:{

    },
    _Prop:WorkFlowAction.EmptyProp,
    Instance:function (isStartInstanceStatus,formRuntimeInst,pageHostInstance,pageReadyInnerParas,actionObj) {
        return WorkFlowAction.Instance.call(this,isStartInstanceStatus,formRuntimeInst,pageHostInstance,pageReadyInnerParas,actionObj);
    },
    ButtonClickEvent:function (sender) {
        //let _this = sender.data.sender;
        DialogUtility.Confirm(window,"暂不支持该操作?",function (){
            return;
        },this);
    }
}