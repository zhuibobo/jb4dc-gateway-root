import InnerFormCloseButton from './InnerFormButton/InnerFormCloseButton'
import InnerFormSaveButton from './InnerFormButton/InnerFormSaveButton'
import InnerFormJsClientButton from './InnerFormButton/InnerFormJsClientButton'

let InnerFormButtonRuntime= {

    RendererSingleInnerFormButton: function (innerButtonConfig, formRuntimeInstance, listButtonPO) {
        //console.log(formRuntimeInstance);
        //console.log(innerButtonConfig);
        //console.log(listButtonPO);
        let InnerFormButton;
        let buttonElem;
        let formRuntimeCategory = formRuntimeInstance._Prop_Config.FormRuntimeCategory;

        if (innerButtonConfig.buttonType == "关闭按钮") {
            InnerFormButton = Object.create(InnerFormCloseButton);
            buttonElem = InnerFormButton.Instance(innerButtonConfig, formRuntimeInstance, listButtonPO, formRuntimeCategory).elem;
        } else if (innerButtonConfig.buttonType == "保存按钮") {
            InnerFormButton = Object.create(InnerFormSaveButton);
            buttonElem = InnerFormButton.Instance(innerButtonConfig, formRuntimeInstance, listButtonPO, formRuntimeCategory).elem;
        } else if (innerButtonConfig.buttonType == "脚本按钮") {
            InnerFormButton = Object.create(InnerFormJsClientButton);
            buttonElem = InnerFormButton.Instance(innerButtonConfig, formRuntimeInstance, listButtonPO, formRuntimeCategory).elem;
        } else {
            let errorText = "不支持的按钮类型:InnerFormButtonRuntime.RendererSingleInnerFormButton";
            DialogUtility.AlertText(errorText);
            throw errorText;
        }
        return buttonElem;
    }
}

export {InnerFormButtonRuntime as default};