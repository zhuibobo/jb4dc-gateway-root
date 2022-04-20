import GeneralPlugin from "../../GeneralPlugin";
import ClassUtility from "../../../Utility/ClassUtility";
import AbstractInputBasePlugin from "../../AbstractInputBasePlugin";

let singleName="WLDCT_Search_TextBox";

function CustomizePlugin() {
    AbstractInputBasePlugin.call(this, singleName);
};

ClassUtility.inheritPrototype(CustomizePlugin, AbstractInputBasePlugin);

let WLDCT_Search_TextBoxPlugin=new CustomizePlugin();
GeneralPlugin.registeredPlugin(singleName, WLDCT_Search_TextBoxPlugin);
export { WLDCT_Search_TextBoxPlugin as default };

/*
let WLDCT_Search_TextBoxPlugin = {
    singleName: "WLDCT_Search_TextBox",
    config: GeneralPlugin.configProp,
    _$elem: null,
    id: null,
    props: JsonUtility.CloneStringify(GeneralPlugin.defaultProps),
    settings: JsonUtility.CloneStringify(GeneralPlugin.settings),
    buildInstanceObj(instanceId) {
        return GeneralPlugin.newControlInstance(this, instanceId);
    },
    constructionElem() {
        return GeneralPlugin.constructionGeneralInputElem(this);
    },
    setElem($elem) {
        this._$elem = $elem;
    },
    resetWysiwygElemProps($elem, props) {
        GeneralPlugin.serializePropsToElem(this._$elem, props, this.config, GeneralPlugin.buildInputControlGeneralText(this.config, props));
    },
    registeredEvent($elem) {
        GeneralPlugin.registeredGeneralEvent(this._$elem, this);
    },
    getContextMenu: GeneralPlugin.getGeneralContextMenu
}

GeneralPlugin.registeredPlugin(WLDCT_Search_TextBoxPlugin.singleName, WLDCT_Search_TextBoxPlugin);
export {WLDCT_Search_TextBoxPlugin as default};
*/


