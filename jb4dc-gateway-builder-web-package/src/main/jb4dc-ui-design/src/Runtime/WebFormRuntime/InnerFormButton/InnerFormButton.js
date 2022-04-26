let InnerFormButton= {
    _prop: {
        elem: null,
        innerButtonConfig: null,
        formRuntimeInstance: null,
        listButtonPO: null,
        formRuntimeCategory: ""
    },
    Instance: function (innerButtonConfig, formRuntimeInstance, listButtonPO, formRuntimeCategory) {
        let elem = $('<button type="button" class="operation-button operation-button-primary" id="' + innerButtonConfig.id + '"><span>' + innerButtonConfig.caption + '</span></button>');
        elem.bind("click", {
            "innerButtonConfig": innerButtonConfig,
            "formRuntimeInstance": formRuntimeInstance,
            "listButtonPO": listButtonPO,
            "formRuntimeCategory":formRuntimeCategory,
            "_this": this
        }, this.ButtonClickEvent);
        return {
            elem:elem
        }
    },
    GetProp:function(sender){
        return {
            elem: sender.data._this,
            innerButtonConfig: sender.data.innerButtonConfig,
            formRuntimeInstance: sender.data.formRuntimeInstance,
            listButtonPO: sender.data.listButtonPO,
            formRuntimeCategory: sender.data.formRuntimeCategory
        }
    },
    ButtonClickEvent: function (sender) {
        DialogUtility.Frame_CloseDialog(window);
    }
}

export {InnerFormButton as default};