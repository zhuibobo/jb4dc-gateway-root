import GeneralPlugin from "../../GeneralPlugin";

let WLDCT_Search_TextBoxPlugin = {
    singleName: "WLDCT_Search_TextBox",
    config: GeneralPlugin.configProp,
    _$elem: null,
    id: null,
    props: JsonUtility.CloneStringify(GeneralPlugin.defaultProps),
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
        GeneralPlugin.serializePropsToElem(this._$elem, props, this.config, GeneralPlugin.buildListSearchControlGeneralText(this.config, props));
    },
    registeredEvent($elem) {
        GeneralPlugin.registeredGeneralEvent(this._$elem, this);
    },
    getContextMenu: GeneralPlugin.getGeneralContextMenu
}

GeneralPlugin.registeredPlugin(WLDCT_Search_TextBoxPlugin.singleName, WLDCT_Search_TextBoxPlugin);

export {WLDCT_Search_TextBoxPlugin as default};