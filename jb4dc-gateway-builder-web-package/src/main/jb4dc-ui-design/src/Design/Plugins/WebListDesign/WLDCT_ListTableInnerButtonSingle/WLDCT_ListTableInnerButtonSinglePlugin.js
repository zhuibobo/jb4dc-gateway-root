import GeneralPlugin from "../../GeneralPlugin";
import JsonUtility from "../../../../Utility/JsonUtility";

let WLDCT_ListTableInnerButtonSinglePlugin = {
    singleName: "WLDCT_ListTableInnerButtonSingle",
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
        GeneralPlugin.serializePropsToElem(this._$elem, props, this.config, props.normalProps.caption);
    },
    registeredEvent($elem) {
        GeneralPlugin.registeredGeneralEvent(this._$elem, this);
    },
    getContextMenu: GeneralPlugin.getGeneralContextMenu
}

GeneralPlugin.registeredPlugin(WLDCT_ListTableInnerButtonSinglePlugin.singleName, WLDCT_ListTableInnerButtonSinglePlugin);

export {WLDCT_ListTableInnerButtonSinglePlugin as default};