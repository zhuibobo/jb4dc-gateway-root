import GeneralPlugin from "../../GeneralPlugin";
import ClassUtility from "../../../Utility/ClassUtility";
import AbstractInputBasePlugin from "../../AbstractInputBasePlugin";

let singleName="WFDCT_TextBox";

function CustomizePlugin() {
    AbstractInputBasePlugin.call(this, singleName);
};

ClassUtility.inheritPrototype(CustomizePlugin, AbstractInputBasePlugin);

let WFDCT_TextBoxPlugin=new CustomizePlugin();
GeneralPlugin.registeredPlugin(singleName, WFDCT_TextBoxPlugin);
export { WFDCT_TextBoxPlugin as default };

/*
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

export { WFDCT_TextBoxPlugin as default};*/
