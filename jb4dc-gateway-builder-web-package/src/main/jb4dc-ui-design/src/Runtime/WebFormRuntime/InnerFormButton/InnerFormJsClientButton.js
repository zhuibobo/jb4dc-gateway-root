import InnerFormButton from "./InnerFormButton";

let InnerFormJsClientButton= {
    _prop:InnerFormButton._prop,
    Instance:InnerFormButton.Instance,
    GetButtonElem:InnerFormButton.GetButtonElem,
    ButtonClickEvent: function (sender) {
        let innerButtonConfig = sender.data.innerButtonConfig;
        let actionType = innerButtonConfig.actionType;
        if(actionType=="reloadData"){
            window.location.href=window.location.href;
        }
        else{
            window.print();
            //printJS('htmlDesignRuntimeWrap', 'html');
            //DialogUtility.AlertText("未实现!");
        }
    }
}

export {InnerFormJsClientButton as default};