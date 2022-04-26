import InnerFormButton from "./InnerFormButton";

let InnerFormCloseButton= {
    _prop:InnerFormButton._prop,
    Instance:InnerFormButton.Instance,
    GetButtonElem:InnerFormButton.GetButtonElem,
    ButtonClickEvent: function (sender) {
        DialogUtility.Frame_CloseDialog(window);
    }
}

export {InnerFormCloseButton as default};
