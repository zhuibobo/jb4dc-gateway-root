import GeneralPlugin from "../../GeneralPlugin";

let WFDCT_TextBoxPlugin={
    singleName:"WFDCT_TextBox",
    config:GeneralPlugin.configProp,
    _$elem:null,
    id:null,
    props:JsonUtility.CloneStringify(GeneralPlugin.defaultProps),
    buildInstanceObj(instanceId){
        return GeneralPlugin.newControlInstance(this,instanceId);
    },
    constructionElem(){
        return GeneralPlugin.constructionGeneralInputElem(this);
    },
    setElem($elem){
        this._$elem=$elem;
    },
    rebuildElem($elem,props){
        GeneralPlugin.serializePropsToElem(this._$elem,props,this.config);
    },
    registeredEvent($elem) {
        GeneralPlugin.registeredGeneralEvent(this._$elem,this);
    }
}

GeneralPlugin.registeredPlugin(WFDCT_TextBoxPlugin.singleName,WFDCT_TextBoxPlugin);

export { WFDCT_TextBoxPlugin as default};