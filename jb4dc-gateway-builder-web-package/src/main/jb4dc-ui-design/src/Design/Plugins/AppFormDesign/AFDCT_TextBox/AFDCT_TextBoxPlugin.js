import GeneralPlugin from "../../GeneralPlugin";

let AFDCT_TextBoxPlugin={
    singleName:"AFDCT_TextBox",
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

GeneralPlugin.registeredPlugin(AFDCT_TextBoxPlugin.singleName,AFDCT_TextBoxPlugin);

export { AFDCT_TextBoxPlugin as default};