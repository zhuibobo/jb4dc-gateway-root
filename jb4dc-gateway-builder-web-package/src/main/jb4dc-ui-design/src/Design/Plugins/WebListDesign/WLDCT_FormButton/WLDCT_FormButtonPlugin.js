import GeneralPlugin from "../../GeneralPlugin";

let WLDCT_FormButtonPlugin={
    singleName:"WLDCT_FormButton",
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
    resetWysiwygElemProps($elem,props){
        GeneralPlugin.serializePropsToElem(this._$elem,props,this.config,props.normalProps.buttonCaption);
    },
    registeredEvent($elem) {
        GeneralPlugin.registeredGeneralEvent(this._$elem,this);
    }
}

GeneralPlugin.registeredPlugin(WLDCT_FormButtonPlugin.singleName,WLDCT_FormButtonPlugin);

export { WLDCT_FormButtonPlugin as default};