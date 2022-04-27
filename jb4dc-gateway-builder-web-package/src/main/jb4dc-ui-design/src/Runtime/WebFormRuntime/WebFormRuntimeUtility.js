import WebFormRuntime from './WebFormRuntime.js';

let WebFormRuntimeUtility={
    _webFormRTParas:null,
    _formRuntimeInst:null,
    FORM_RUNTIME_CATEGORY_INDEPENDENCE:"IsIndependence",
    FORM_RUNTIME_CATEGORY_LIST:"IsDependenceList",

    getWebFormRTParasWithListButtonId:function () {
        if(!this._webFormRTParas) {
            this._webFormRTParas = {
                "FormId": BaseUtility.GetUrlParaValue("formId"),
                "ButtonId": BaseUtility.GetUrlParaValue("buttonId"),
                "OperationType": BaseUtility.GetUrlParaValue("operationType"),
                "ListFormButtonElemId": BaseUtility.GetUrlParaValue("listFormButtonElemId"),
                "RecordId": BaseUtility.GetUrlParaValue("recordId"),
                "WindowWidth": BaseUtility.GetUrlParaValue("windowWidth"),
                "WindowHeight": BaseUtility.GetUrlParaValue("windowHeight"),
                "FormRuntimeCategory":this.FORM_RUNTIME_CATEGORY_LIST
            };
            if(!this._webFormRTParas.RecordId){
                this._webFormRTParas.RecordId=StringUtility.Guid();
            }
        }
        return this._webFormRTParas;
    },
    getWebFormRTParasWithIndependence:function(){
        //debugger;
        let formId=RuntimeGeneralInstance.TryGetMenuOuterId();
        if(StringUtility.IsNullOrEmpty(formId)){
            formId=BaseUtility.GetUrlParaValue("formId")
        }
        //console.log(formId);
        if(!this._webFormRTParas) {
            this._webFormRTParas = {
                "FormId": formId,
                "ButtonId": this.FORM_RUNTIME_CATEGORY_INDEPENDENCE,
                "OperationType": this.FORM_RUNTIME_CATEGORY_INDEPENDENCE,
                "ListFormButtonElemId": this.FORM_RUNTIME_CATEGORY_INDEPENDENCE,
                "RecordId": "",
                "WindowWidth": "",
                "WindowHeight": "",
                "FormRuntimeCategory":this.FORM_RUNTIME_CATEGORY_INDEPENDENCE
            };
            if(StringUtility.IsNotNullOrEmpty(BaseUtility.GetUrlParaValue("operationType"))){
                this._webFormRTParas.OperationType=BaseUtility.GetUrlParaValue("operationType");
            };
            if(StringUtility.IsNotNullOrEmpty(BaseUtility.GetUrlParaValue("recordId"))){
                this._webFormRTParas.RecordId=BaseUtility.GetUrlParaValue("recordId");
            };
            if(!this._webFormRTParas.RecordId){
                this._webFormRTParas.RecordId=StringUtility.Guid();
            }
        }
        return this._webFormRTParas;
    },
    pageReady:function (config) {
        //debugger;
        this._formRuntimeInst = Object.create(WebFormRuntime);
        //var webFormRTParas=this.getWebFormRTParas();
        let webFormRTParas=config.getWebFormRTParasFunc.call(this);
        this._formRuntimeInst.Initialization({
            "RendererToId": config.rendererToId,
            "RendererInnerButtonsToId":config.rendererInnerButtonsToId,
            "FormId":webFormRTParas.FormId,
            "RecordId":webFormRTParas.RecordId,
            "ButtonId":webFormRTParas.ButtonId,
            "OperationType":webFormRTParas.OperationType,
            "IsPreview":config.isPreview,
            "RendererChainCompletedFunc":config.rendererChainCompletedFunc,
            "ListFormButtonElemId":webFormRTParas.ListFormButtonElemId,
            "WebFormRTParas":webFormRTParas,
            "FormRuntimeCategory":webFormRTParas.FormRuntimeCategory
        });
        //this._formRuntimeInst.webFormRTParas=webFormRTParas;
        return this._formRuntimeInst;
    }
}

export {WebFormRuntimeUtility as default};