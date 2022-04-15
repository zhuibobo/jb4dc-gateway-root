import GeneralPlugin from "../../GeneralPlugin";
import ClassUtility from "../../../Utility/ClassUtility";
import AbstractInputBasePlugin from "../../AbstractInputBasePlugin";

let singleName="WLDCT_FormButton";

function customizePlugin() {
    AbstractInputBasePlugin.call(this, singleName, {isopbutton: "true"});
};

ClassUtility.inheritPrototype(customizePlugin, AbstractInputBasePlugin);

let WLDCT_FormButton=new customizePlugin();
GeneralPlugin.registeredPlugin(singleName, WLDCT_FormButton);
export { WLDCT_FormButton as default };

/*
let WLDCT_FormButtonPlugin = {
    singleName: "WLDCT_FormButton",
    config: GeneralPlugin.configProp,
    _$elem: null,
    id: null,
    props: JsonUtility.CloneStringify(GeneralPlugin.defaultProps),
    settings: JsonUtility.CloneStringify(GeneralPlugin.settings),
    buildInstanceObj(instanceId) {
        return GeneralPlugin.newControlInstance(this, instanceId);
    },
    constructionElem() {
        return GeneralPlugin.constructionGeneralInputElem(this, {isopbutton: "true"});
    },
    setElem($elem) {
        this._$elem = $elem;
    },
    resetWysiwygElemProps($elem, props) {
        GeneralPlugin.serializePropsToElem(this._$elem, props, this.config, GeneralPlugin.buildListButtonControlGeneralText(this.config, props));
    },
    registeredEvent($elem) {
        GeneralPlugin.registeredGeneralEvent(this._$elem, this);
    }
}

GeneralPlugin.registeredPlugin(WLDCT_FormButtonPlugin.singleName, WLDCT_FormButtonPlugin);

export {WLDCT_FormButtonPlugin as default};*/
