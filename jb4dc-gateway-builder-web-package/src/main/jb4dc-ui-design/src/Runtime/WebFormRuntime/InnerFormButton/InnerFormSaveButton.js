import InnerFormButton from "./InnerFormButton";

let InnerFormSaveButton= {
    _prop:InnerFormButton._prop,
    Instance:InnerFormButton.Instance,
    GetButtonElem:InnerFormButton.GetButtonElem,
    ButtonClickEvent: function (sender) {
        let innerButtonConfig = sender.data.innerButtonConfig;
        let formRuntimeInstance = sender.data.formRuntimeInstance;
        let listButtonPO = sender.data.listButtonPO;
        let _this=sender.data._this;
        let saveAndClose=innerButtonConfig.saveAndClose;
        let validateResult=ValidateRulesRuntime.ValidateSubmitEnable();

        _this._prop=InnerFormButton.GetProp(sender);
        if (ValidateRulesRuntime.AlertValidateErrors(validateResult)) {
            let formDataComplexPO = formRuntimeInstance.SerializationFormData();
            let operationType = formRuntimeInstance._Prop_Config.OperationType;
            DialogUtility.AlertLoading(window, DialogUtility.DialogLoadingId, {title:"系统提示"}, "系统处理中,请稍候...");
            RuntimeGeneralInstance.SubmitFormDataComplexPOListToServer(
                formDataComplexPO,
                formDataComplexPO.recordId,
                innerButtonConfig.id,
                listButtonPO.buttonId,
                operationType,
                function (result) {
                    if (result.success) {
                        //debugger;
                        if(this._prop.formRuntimeCategory==FormRuntimeSinglePageObject.FORM_RUNTIME_CATEGORY_LIST) {
                            console.log(this._prop);
                            let listFormButtonElemId = formRuntimeInstance.GetOpenedListFormButtonId();
                            window.OpenerWindowObj.WLDCT_ListTableContainer.TryReloadForListFormButton(listFormButtonElemId);
                            //console.log(window);
                            window.setTimeout(function () {
                                DialogUtility.CloseDialog(DialogUtility.DialogLoadingId);

                                DialogUtility.Alert(window, DialogUtility.DialogId02, {}, result.message, function () {
                                    DialogUtility.Frame_CloseDialog(window);
                                }, this);
                            }, 500);
                        }
                        else if(this._prop.formRuntimeCategory==FormRuntimeSinglePageObject.FORM_RUNTIME_CATEGORY_INDEPENDENCE){
                            //console.log(this._prop);
                            //debugger;
                            if(this._prop.formRuntimeInstance._FormPO.formOperationType=="dev"){
                                let devOperationEndFunc=BaseUtility.GetUrlParaValue("devOperationEndFunc");
                                if(StringUtility.IsNotNullOrEmpty(devOperationEndFunc)){
                                    window.OpenerWindowObj[devOperationEndFunc](this._prop);
                                }
                                if(this._prop.innerButtonConfig.saveAndClose=="true"){
                                    window.setTimeout(function () {
                                        DialogUtility.CloseDialog(DialogUtility.DialogLoadingId);

                                        DialogUtility.Alert(window, DialogUtility.DialogId02, {}, result.message, function () {
                                            DialogUtility.Frame_CloseDialog(window);
                                        }, this);
                                    }, 500);
                                }
                            }
                            else {
                                DialogUtility.CloseDialog(DialogUtility.DialogLoadingId);
                                DialogUtility.Alert(window, DialogUtility.DialogId02, {}, result.message, function () {
                                    if (saveAndClose) {
                                        DialogUtility.AlertText("关闭窗口,未完成!");
                                    }
                                    window.location.href = window.location.href;
                                }, this);
                            }
                        }
                    }
                    else{
                        DialogUtility.CloseDialog(DialogUtility.DialogLoadingId);
                    }
                }, _this);
        }
    }
}

export {InnerFormSaveButton as default};