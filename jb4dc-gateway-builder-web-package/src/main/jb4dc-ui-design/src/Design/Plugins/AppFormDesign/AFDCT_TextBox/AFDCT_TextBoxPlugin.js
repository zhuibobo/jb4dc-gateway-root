import GeneralPlugin from "../../GeneralPlugin";

let AFDCT_TextBoxPlugin={
    singleName:"AFDCT_TextBox",
    config:GeneralPlugin.configProp,
    _$elem:null,
    id:null,
    buildInstanceObj(instanceId){
        return GeneralPlugin.newControlInstance(this,instanceId);
    },
    constructionElem(){
        return GeneralPlugin.constructionGeneralInputElem(this);
    },
    rebuildElem($elem,props){
        console.log($elem);
        console.log(props);
        //var controlDescText=CKEditorPluginUtility.GetControlDescText(pluginSetting,props);
        //CKEditorPluginUtility.BuildGeneralElemToCKWysiwyg("<div class='wysiwyg-container-text'>"+controlDescText+"</div>", pluginSetting, props, contentWindow);
    },
    registeredEvent($elem) {
        GeneralPlugin.registeredGeneralEvent(this._$elem,this);
    }
}

GeneralPlugin.registeredPlugin(AFDCT_TextBoxPlugin.singleName,AFDCT_TextBoxPlugin);

export { AFDCT_TextBoxPlugin as default};