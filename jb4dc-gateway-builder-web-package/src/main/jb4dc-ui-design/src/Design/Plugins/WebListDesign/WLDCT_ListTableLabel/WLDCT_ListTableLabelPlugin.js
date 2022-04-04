import GeneralPlugin from "../../GeneralPlugin";

let WLDCT_ListTableLabelPlugin = {
    singleName: "WLDCT_ListTableLabel",
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
        GeneralPlugin.serializePropsToElem(this._$elem, props, this.config, props.normalProps.columnCaption);
    },
    registeredEvent($elem) {
        GeneralPlugin.registeredGeneralEvent(this._$elem, this);
    }
}

GeneralPlugin.registeredPlugin(WLDCT_ListTableLabelPlugin.singleName, WLDCT_ListTableLabelPlugin);

export {WLDCT_ListTableLabelPlugin as default};